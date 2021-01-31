import React, { Component } from 'react'
import api from '../../../../services/api'
import { dataF, dataMask, dateFormat } from '../../mask/mask'
import Dialog from '../../template/Dialog'
import Main from '../../template/Main'
import SearchField from 'react-search-field'
import TypeChecker from 'typeco'
import { BsSearch } from 'react-icons/bs'
import { AiOutlineClear } from 'react-icons/ai'
import { NavLink } from 'react-router-dom'
import ModalApp from '../../template/Modal'
import ItensVenda from './ItensVenda'
import Button from 'react-bootstrap/esm/Button'


const headerProps = {
    icon: 'money',
    title: ' Cancelamento de Vendas',
    subtitle: 'Cancelar e Consultar vendas'
}

const initialState = {
    list: [],
    barbearias: [],
    barbeiros: [],
    dataBusca: dateFormat(),
    searchText: '',
    total: 0,
    itemvendas: [],
    itens: false,
    emp: parseInt(localStorage.getItem('EMP')),
    error: ''
}

export default class CancelaVenda extends Component {
    constructor(props) {
        super(props)
        this.state = { ...initialState, filteredList: [] }

        this.onBasicChange = this.onBasicChange.bind(this)
        this.handleClear = this.handleClear.bind(this)
    }

    componentDidMount = async () => {
        const Codemp = this.state.emp
        try {
            const vendas = await api.get('/vendas')
            vendas.data.sort((a, b) => {
                if (a.data < b.data) {
                    return 1;
                }
                if (a.data > b.data) {
                    return -1;
                }
                return 0;
            })
            const vendasByEmp = vendas.data.filter(v => v.Codemp === Codemp)
            const barbearias = await api.get('/barbearias')
            const barbeiros = await api.get('/barbeiros')
            const itemvendas = await api.get('/itemvendas')
            this.setState({
                list: vendasByEmp,
                filteredList: vendasByEmp,
                barbearias: barbearias.data,
                barbeiros: barbeiros.data,
                itemvendas: itemvendas.data,
            })
            console.log(this.state.list)
        } catch (err) {
            this.setState({ error: 'Não foi possível carregar a lista!' })
        }
    }

    remove = async venda => {
        try {
            api.delete(`/vendas/${venda.Codvenda}`)
            const resp = await api.get('/vendas')
            this.setState({ list: resp.data, filteredList: resp.data })
            window.location.reload()
        } catch (err) {
            return this.setState({ error: 'Não foi possível excluir!' })
        }
    }

    changeData(event) {
        const state = { ...this.state }
        state[event.target.name] = event.target.value
        this.setState({ dataBusca: state.dataBusca })
    }

    findName = (cod, list) => {
        if (list === 'barbearia') {
            const ind = this.state.barbearias.filter(b => b.Codbarbearia === cod)
            console.log(ind[0].nome)
            return ind[0].nome
        }
        if (list === 'barbeiro') {
            const ind = this.state.barbeiros.filter(b => b.Codbarbeiro === cod)
            console.log(ind[0].nome)
            return ind[0].nome
        }
    }
    handleClear = async () => {
        const resp = await api.get('/vendas')
        resp.data.sort((a, b) => {
            if (a.data < b.data) {
                return 1;
            }
            if (a.data > b.data) {
                return -1;
            }
            return 0;
        })
        const vendasByEmp = resp.data.filter(v => v.Codemp === this.state.emp)
        this.setState({ filteredList: vendasByEmp, dataBusca: dateFormat() })
    }

    totalizar(obj) {
        let soma = 0, it
        for (let i = 0; i < obj.length; i++) {
            it = obj[i].preco * obj[i].qtvenda
            soma += it
        }
        return soma
    }
    handleItens = vendaId => {
        const filteredItens = this.state.itemvendas.filter(i => i.vendaId === vendaId)
        return filteredItens
    }
    /* handleSoma = () => {
        const soma = this.totalizar(filteredItens)
        this.setState({ itemvendas: filteredItens, total: soma })
    } */

    getMatchedList = (searchText) => {
        if (TypeChecker.isEmpty(searchText)) return this.state.list;
        return this.state.list.filter(c => c.cliente.toLowerCase().includes(searchText.toLowerCase()));
    }
    onBasicChange(value) {
        this.setState({
            searchText: value,
            filteredList: this.getMatchedList(value),
        });
    }
    dateSearch = async () => {
        var dataBusca = this.state.dataBusca
        const resp = await api.get('/vendas')
        resp.data.sort((a, b) => {
            if (a.data < b.data) {
                return 1;
            }
            if (a.data > b.data) {
                return -1;
            }
            return 0;
        })
        const vendasByEmp = resp.data.filter(v => v.Codemp === this.state.emp)
        const venda = vendasByEmp.filter(v => dataF(v.data) === dataBusca)
        this.setState({ list: venda, filteredList: venda })
    }

    novo() {
        return (
            <NavLink className="btn btn-info" to='/vendas' >
                Nova Venda
            </NavLink>
        )
    }
    renderTable() {
        return (
            <div>
                <div className="col col-12 d-flex">
                    <table className="table table-hover table-borderless table-sm">
                        <thead className="table-secondary">
                            <tr className="text-center">
                                <th>Cod. Venda</th>
                                <th>Data</th>
                                <th>Cod. Cliente</th>
                                <th>Cliente</th>
                                <th>Cod. Barbeiro</th>
                                <th>Barbeiro</th>
                                <th>Cod. Barbearia</th>
                                <th>Barbearia</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.renderRows()}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
    renderRows() {
        return this.state.filteredList.map(venda => {
            return (
                <tr key={venda.Codvenda} className="text-center">
                    <td>{venda.Codvenda}</td>
                    <td>{dataMask(venda.data)}</td>
                    <td>{venda.clienteId}</td>
                    <td>{venda.cliente}</td>
                    <td>{venda.barbeiroId}</td>
                    <td>{this.findName(venda.barbeiroId, 'barbeiro')}</td>
                    <td>{venda.barbeariaId}</td>
                    <td>{this.findName(venda.barbeariaId, 'barbearia')}</td>
                    <td>
                        <Dialog
                            color="danger"
                            class="mr-2"
                            size="sm"
                            openLabel="Cancelar"
                            title="Cancelar Venda"
                            body={`Deseja cancelar a venda Nº ${venda.Codvenda}?`}
                            button="Sim"
                            onClick={() => this.remove(venda)} />
                        <ModalApp
                            color="primary"
                            tam="sm"
                            buttonLabel="Itens"
                            edit={`Venda Nº ${venda.Codvenda} - Data: ${dataMask(venda.data)}`}
                            component={
                                <ItensVenda
                                    itensVenda={this.handleItens(venda.Codvenda)}
                                    total={this.totalizar(this.handleItens(venda.Codvenda))} />
                            } />
                        {/* <button className="btn btn-sm btn-primary ml-1"
                            onClick={() => this.handleItens(venda.Codvenda)} >Itens</button> */}
                    </td>
                    {/*                     {this.state.itens &&
                    this.RenderItens()} */}
                </tr>

            )
        })
    }
    render() {
        return (
            <Main {...headerProps} button={this.novo()}>
                <div className="row">
                    <div className="col-5 mb-2">
                        <div className="input-group">
                            <div className="input-group-prepend ">
                                <label className="input-group-text bg-primary text-light" htmlFor="search" id="search">
                                    Data
                            </label>
                            </div>
                            <input className="form-control"
                                aria-describedby="search"
                                type="date"
                                name="dataBusca"
                                value={this.state.dataBusca}
                                onChange={e => this.changeData(e)}
                            />
                            {/* <div className="input-group-append" id="search"> */}
                            <Button variant="outline-success"
                                onClick={e => this.dateSearch(e)}>
                                <BsSearch /> Buscar
                            </Button>
                            <Button variant="outline-secondary"
                                onClick={this.handleClear}><BsSearch />
                                <AiOutlineClear /> Limpar
                            </Button>
                        </div>
                    </div>
                    <div className="col-7 mb-2">
                        <div className="input-group">
                            <div className="input-group-prepend ">
                                <label className="input-group-text bg-success text-light" htmlFor="cli" id="search">
                                    Cliente
                            </label>
                            </div>
                            <SearchField
                                classNames="h-auto font-weight-bold col-7"
                                id='search'
                                placeholder="Digite o cliente..."
                                onChange={this.onBasicChange} />
                        </div>
                    </div>
                </div>
                {this.renderTable()}
            </Main>
        )
    }
}