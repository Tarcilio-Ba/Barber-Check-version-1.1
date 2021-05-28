import React, { Component } from 'react'
import api from '../../../../services/api'

import AgendamentoForm from './AgendamentoForm'
import ModalApp from '../../template/Modal'
import Main from '../../template/Main'
import { NavLink } from 'react-router-dom'
import { dataF, dataMask, dateFormat } from '../../mask/mask'
import Dialog from '../../template/Dialog'
import { FaRegTrashAlt } from 'react-icons/fa'
import { BsSearch } from 'react-icons/bs'
import SearchField from 'react-search-field'
import TypeChecker from 'typeco'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import ButtonToolbar from 'react-bootstrap/ButtonToolbar'
import Button from 'react-bootstrap/esm/Button'
import { GiEgyptianTemple } from 'react-icons/gi'


const headerProps = {
    icon: 'calendar',
    title: ' Agendamento',
    subtitle: 'Lista de Agendamentos: Editar e Excluir'
}

const initialState = {
    list: [],
    clientes: [],
    barbearias: [],
    barbeiros: [],
    itens: [],
    emp: parseInt(localStorage.getItem('EMP')),
    error: ''
}


export default class AgendamentoList extends Component {

    constructor(props) {
        super(props)

        this.state = {
            ...initialState,
            filteredList: [],
            searchText: '',
            dataBusca: dateFormat(),
            busca: false,
            buscaCliente: false
        }

        this.onBasicChange = this.onBasicChange.bind(this)
    }

    handleSearchClient() {
        if (this.state.buscaCliente === false) {
            this.setState({ buscaCliente: true })
        } else {
            this.setState({ buscaCliente: false })
        }
    }
    handleSearchBusca() {
        if (this.state.busca === false) {
            this.setState({ busca: true })
            /* if(this.state.buscaCliente === true){
                this.setState({ buscaCliente: false })
            } */
        } else {
            this.setState({ busca: false })
        }
    }
    handleClear = async () => {
        const resp = await api.get('/agendamentos')
        resp.data.sort((a, b) => {
            if (a.data < b.data) {
                return 1;
            }
            if (a.data > b.data) {
                return -1;
            }
            return 0;
        })
        const agByEmp = resp.data.filter(a => a.Codemp === this.state.emp)
        this.setState({ filteredList: agByEmp, busca: false, buscaCliente: false, dataBusca: dateFormat() })
    }
    componentDidMount = async () => {
        try {
            /* const dataBusca = this.state.dataBusca */
            const resp = await api.get('/agendamentos')
            resp.data.sort((a, b) => {
                if (a.data < b.data) {
                    return 1;
                }
                if (a.data > b.data) {
                    return -1;
                }
                return 0;
            })
            /* const list = resp.data.filter(a => dataF(a.data) === dataBusca) */
            const agByEmp = resp.data.filter(a => a.Codemp === this.state.emp)
            this.setState({ list: agByEmp, filteredList: agByEmp })
            console.log(this.state.list)
        } catch (err) {
            return this.setState({ error: 'Não foi possível carregar a lista.' })
        }
        const resp = {
            clientes: await api.get('/clientes'),
            barbearias: await api.get('/barbearias'),
            barbeiros: await api.get('/barbeiros'),
            itens: await api.get('/itens'),
        }
        for (var prop in resp) {
            resp[prop].data.sort((a, b) => {
                if (a.nome > b.nome) {
                    return 1;
                }
                if (a.nome < b.nome) {
                    return -1;
                }
                // a must be equal to b
                return 0;
            })
        }
        const itens = resp.itens.data.filter(r => r.tipo !== 'P')
        const clientesByEmp = resp.clientes.data.filter(x => x.Codemp === this.state.emp)
        const barbeirosByEmp = resp.barbeiros.data.filter(x => x.Codemp === this.state.emp)
        const barbeariasByEmp = resp.barbearias.data.filter(x => x.Codemp === this.state.emp)
        const itensByEmp = itens.filter(x => x.Codemp === this.state.emp)
        this.setState({
            clientes: clientesByEmp,
            barbearias: barbeariasByEmp,
            barbeiros: barbeirosByEmp,
            itens: itensByEmp
        })
    }
    onChange(event) {
        const state = { ...this.state }
        state[event.target.name] = event.target.value
        this.setState({ busca: state.busca })
    }
    changeData(event) {
        const state = { ...this.state }
        state[event.target.name] = event.target.value
        this.setState({ dataBusca: state.dataBusca })
        console.log(state.dataBusca)
    }

    remove = async agendamento => {
        try {
            api.delete(`/agendamentos/${agendamento.Codagendamento}`)
            const resp = await api.get('/agendamentos')
            resp.data.sort((a, b) => {
                if (a.data > b.data) {
                    return 1;
                }
                if (a.data < b.data) {
                    return -1;
                }
                return 0;
            })
            const agByEmp = resp.data.filter(a => a.Codemp === this.state.emp)
            this.setState({ list: agByEmp, filteredList: agByEmp })
        } catch (err) {
            return this.setState({ error: 'Não foi possível excluir!' })
        }
        window.location.reload()
    }

    getMatchedList = (searchText) => {
        if (TypeChecker.isEmpty(searchText)) return this.state.list;
        return this.state.list.filter(agendamento => agendamento.cliente.toLowerCase().includes(searchText.toLowerCase()));
    }
    onBasicChange(value) {
        this.setState({
            searchText: value,
            filteredList: this.getMatchedList(value),
        });
    }

    dateSearch = async () => {
        var dataBusca = this.state.dataBusca
        const resp = await api.get('/agendamentos')
        resp.data.sort((a, b) => {
            if (a.data < b.data) {
                return 1;
            }
            if (a.data > b.data) {
                return -1;
            }
            return 0;
        })
        const agByEmp = resp.data.filter(a => a.Codemp === this.state.emp)
        const agend = agByEmp.filter(a => dataF(a.data) === dataBusca)
        this.setState({ list: agend, filteredList: agend })
    }

    renderTable() {
        return (
            <div>
                <div className="col col-12 d-flex table-responsive-sm">
                    <table className="table table-hover table-borderless table-sm">
                        <thead className="table-secondary">
                            <tr className="text-center">
                                <th>Cod</th>
                                <th>Data</th>
                                <th>Hora</th>
                                <th>Cliente</th>
                                <th>Serviço</th>
                                <th>Barbearia</th>
                                <th>Barbeiro</th>
                                <th>Editar | Excluir</th>
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
        return this.state.filteredList.map(agendamento => {
            return (
                <tr key={agendamento.Codagendamento} className="text-center">
                    <td>{agendamento.Codagendamento}</td>
                    <td>{dataMask(agendamento.data)}</td>
                    <td>{agendamento.hora}</td>
                    <td>{agendamento.cliente}</td>
                    <td>{agendamento.itemId}</td>
                    <td>{agendamento.barbeariaId}</td>
                    <td>{agendamento.barbeiroId}</td>
                    <td>
                        <ModalApp color="warning" icon="edit" edit="Agendamento"
                            component={
                                <AgendamentoForm
                                    agendamento={agendamento}
                                    clientes={this.state.clientes}
                                    barbearias={this.state.barbearias}
                                    barbeiros={this.state.barbeiros}
                                    itens={this.state.itens}
                                />
                            } />
                        <Dialog
                            class="ml-2"
                            color="danger"
                            size="sm"
                            openLabel={<FaRegTrashAlt />}
                            title="Cancelar"
                            body={`Cancelamento do atendimento: 
                            ${agendamento.cliente}, 
                            ${dataMask(agendamento.data)}, 
                            ${agendamento.hora}`}
                            button="Confirmar"
                            onClick={() => this.remove(agendamento)} />
                    </td>
                </tr>
            )
        })
    }

    novo() {
        return (
            <NavLink className="btn btn-info" to='/agendamentos/novo' >
                Novo Agendamento
            </NavLink>
        )
    }
    render() {
        return (
            <Main {...headerProps} button={this.novo()}>
                <span>
                    <div className="row mb-3">
                        <div className="input-group col-9">
                            <div className="input-group-prepend ">
                                <label className="input-group-text mr-1" htmlFor="busca">
                                    Buscar por
                                </label>
                            </div>
                            <ButtonToolbar aria-label="Toolbar with button groups" id="busca">
                                <ButtonGroup className="mr-2" aria-label="First group">
                                    <Button variant="primary mr-1" onClick={() => this.handleSearchBusca()}>Data</Button>
                                    <Button variant="primary mr-1" onClick={() => this.handleSearchClient()}>Cliente</Button>
                                    <Button variant="secondary" onClick={() => this.handleClear()}>Limpar</Button>
                                </ButtonGroup>
                            </ButtonToolbar>
                        </div>
                    </div>
                    <div className="row col-12 mb-2">
                        {this.state.busca &&
                            <div className="col-4">
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
                                    <div className="input-group-append" id="search">
                                        <button className="btn btn-outline-dark" /* type="button" */
                                            onClick={e => this.dateSearch(e)} >
                                            <BsSearch /> Buscar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        }
                        {this.state.buscaCliente &&
                            <div className="col-8">
                                <div className="input-group">
                                    <div className="input-group-prepend ">
                                        <label className="input-group-text bg-primary text-light" htmlFor="search">
                                            Cliente
                                        </label>
                                    </div>
                                    <SearchField
                                        classNames="h-auto font-weight-bold col-6"
                                        id='search'
                                        placeholder="Digite o nome..."
                                        onChange={this.onBasicChange} />
                                </div>
                            </div>
                        }
                    </div>
                    {this.state.error && <p className="text-danger">{this.state.error}</p>}
                    {this.renderTable()}
                </span>
            </Main>
        )
    }
}