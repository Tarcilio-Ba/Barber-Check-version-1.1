import React from 'react'

import Main from '../../template/Main'
import { Component } from 'react'
import api from '../../../../services/api'
import { dateFormat, convertDate } from '../../mask/mask'
import ModalApp from '../../template/SimpleModal'
import ItensVenda from './ItensVenda'
import { NavLink } from 'react-router-dom'


const headerProps = {
    title: " Vendas",
    subtitle: "Cadastro de Vendas: Produtos e Serviços",
    icon: "money"
}



const initialState = {
    venda: {
        clienteId: '',
        barbeariaId: '',
        barbeiroId: '',
        data: new Date(),
        Codemp: parseInt(localStorage.getItem('EMP'))
    },
    itemVenda: {
        itemId: '',
        qtvenda: '',
        Codemp: parseInt(localStorage.getItem('EMP'))
    },
    idVenda: '',
    inVenda: false,
    clientes: [],
    barbearias: [],
    barbeiros: [],
    itens: [],
    vendas: [],
    itemvendas: [],
    data: dateFormat(),
    total: 0,
    error: ''
}

export default class Vendas extends Component {
    constructor(props) {
        super(props)
        this.state = { ...initialState }

        this.changeVenda = this.changeVenda.bind(this)
        this.changeItem = this.changeItem.bind(this)
        this.saveVenda = this.saveVenda.bind(this)
        this.saveItem = this.saveItem.bind(this)
        this.clearVenda = this.clearVenda.bind(this)
        this.handleVendaOn = this.handleVendaOn.bind(this)
        this.handleVendaOff = this.handleVendaOff.bind(this)
    }

    handleVendaOn() {
        this.setState({ inVenda: true })
    }
    handleVendaOff() {
        this.setState({ inVenda: false })
    }

    changeVenda(event) {
        const venda = { ...this.state.venda }
        venda[event.target.name] = event.target.value
        this.setState({ venda })
    }

    clearVenda() {
        this.setState({ venda: initialState.venda, error: '' })
    }

    changeItem(event) {
        const itemVenda = { ...this.state.itemVenda }
        itemVenda[event.target.name] = event.target.value 
        this.setState({ itemVenda })
    }

    componentDidMount = async () => {
        const emp = parseInt(localStorage.getItem('EMP'))
        /* CLIENTES */
        const clientes = await api.get('/clientes')
        clientes.data.sort((a, b) => {
            if (a.nome > b.nome) {
                return 1;
            }
            if (a.nome < b.nome) {
                return -1;
            }
            // a must be equal to b
            return 0;
        })
        const clientesByEmp = clientes.data.filter(c => c.Codemp === emp)
        this.setState({ clientes: clientesByEmp })
        /* BARBEARIAS */
        const barbearias = await api.get('/barbearias')
        barbearias.data.sort((a, b) => {
            if (a.nome < b.nome) {
                return 1;
            }
            if (a.nome > b.nome) {
                return -1;
            }
            // a must be equal to b
            return 0;
        })
        const barbeariasByEmp = barbearias.data.filter(b => b.Codemp === emp)
        this.setState({ barbearias: barbeariasByEmp })
        /* BARBEIROS */
        const barbeiros = await api.get('/barbeiros')
        barbeiros.data.sort((a, b) => {
            if (a.nome > b.nome) {
                return 1;
            }
            if (a.nome < b.nome) {
                return -1;
            }
            // a must be equal to b
            return 0;
        })
        const barbeirosByEmp = barbeiros.data.filter(b => b.Codemp === emp)
        this.setState({ barbeiros: barbeirosByEmp })
        /* ITENS */
        const itens = await api.get('/itens')
        itens.data.sort((a, b) => {
            if (a.nome > b.nome) {
                return 1;
            }
            if (a.nome < b.nome) {
                return -1;
            }
            // a must be equal to b
            return 0;
        })
        const itensByEmp = itens.data.filter(i => i.Codemp === emp)
        this.setState({ itens: itensByEmp })

        const vendas = await api.get('/vendas')
        this.setState({ vendas: vendas.data })
    }

    saveVenda = async () => {
        const { clienteId, barbeariaId, barbeiroId, Codemp } = this.state.venda
        if (!clienteId || !barbeariaId || !barbeiroId) {
            this.setState({ error: "Preencha todos os dados para continuar!" });
        } else {
            try {
                const data = new Date()
                await api.post("/vendas", { clienteId, barbeariaId, barbeiroId, data, Codemp })
                this.handleVendaOn()
            } catch (err) {
                this.setState({ error: 'Ocorreu um erro ao cadastrar!' })
            }
        }
        if (this.state.error !== '') {
            this.setState({ error: '' })
        }
        const vendas = await api.get('/vendas')
        const vendasEmp = vendas.data.filter(v => v.Codemp === Codemp)
        const currentVenda = vendasEmp.slice(-1)
        this.setState({ idVenda: currentVenda[0].Codvenda, vendas: vendasEmp.data })
    }

    saveItem = async () => {
        const vendaId = this.state.idVenda
        const { itemId, qtvenda, Codemp} = this.state.itemVenda

        if (!itemId || !qtvenda) {
            this.setState({ error: "Preencha todos os dados para continuar!" });
        } else {
            try {
                await api.post("/itemvendas", { itemId, vendaId, qtvenda, Codemp })
            } catch (err) {
                this.setState({ error: 'Ocorreu um erro ao cadastrar!' })
            }
        }
        const itemvendas = await api.get('/itemvendas')
        const filteredItens = itemvendas.data.filter(i => i.vendaId === vendaId)
        const soma = this.totalizar(filteredItens)
        this.setState({ itemvendas: filteredItens, total: soma })
        this.setState({ itemVenda: initialState.itemVenda })
    }

    totalizar(obj) {
        let soma = 0
        let it
        for (let i = 0; i < obj.length; i++) {
            it = obj[i].preco * obj[i].qtvenda
            soma += it
        }
        return soma
    }
    removeItem = async itemvenda => {
        const vendaId = this.state.idVenda
        try {
            api.delete(`/itemvendas/${itemvenda.Coditemvenda}`)
            const resp = await api.get('/itemvendas')
            const filteredItens = resp.data.filter(r => r.vendaId === vendaId)
            const soma = this.totalizar(filteredItens)
            this.setState({ itemvendas: filteredItens, total: soma })
        } catch (err) {
            return this.setState({ error: 'Não foi possível excluir!' })
        }

    }

    renderTable() {
        return (
            <div>
                <div className="container-fluid">
                    <table className="table table-sm table-borderless table-bordered">
                        <thead className="table-secondary">
                            <tr className="text-center">
                                <th>Cód. Item</th>
                                <th>Item</th>
                                <th>Valor Unitário</th>
                                <th>Quantidade</th>
                                <th>Total</th>
                                <th>Remover</th>
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
        return this.state.itemvendas.map(item => {
            return (
                <tr key={item.Coditemvenda} className="text-center">
                    <td>{item.itemId}</td>
                    <td>{item.item}</td>
                    <td>{item.preco.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</td>
                    <td>{item.qtvenda}</td>
                    <td>{(item.preco * item.qtvenda).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</td>
                    <td>
                        <button className="btn btn-sm"
                            onClick={() => this.removeItem(item)}>
                            <i className="fa fa-minus"></i>
                        </button>
                    </td>
                </tr>
            )
        })
    }

    button = () => {
        return (
            !this.state.inVenda ?
                <NavLink to="/vendas/cancelar" className="btn btn-outline-danger">
                    Cancelamento de Vendas
                </NavLink>
                :
                <ModalApp
                    color="success"
                    /* icon={<TiCancel />} */
                    buttonLabel="Finalizar Venda"
                    edit={`Venda Nº ${this.state.idVenda} - Data: ${convertDate(this.state.venda.data)}`}
                    component={
                        <ItensVenda
                            itensVenda={this.state.itemvendas}
                            total={this.state.total} />
                    } />

        )
    }
    render() {
        return (
            <Main {...headerProps} button={this.button()}>
                {this.state.error && <p className="text-danger">{this.state.error}</p>}
                {!this.state.inVenda &&
                    <div>
                        <div className="navbar navbar-inverse ">
                            <div className="navbar-header">
                                <h2 className="lead"><strong>Cadastro de Vendas </strong></h2>
                            </div>
                            {/* <h2 className="lead">Data: <strong>{convertDate(this.state.venda.data)}</strong></h2> */}
                            <div className="input-group col-2">
                                <div className="input-group-prepend">
                                    <label className="input-group-text" htmlFor="data">Data</label>
                                </div>
                                <input className="form-control" id="data"
                                    type="text"
                                    name="data"
                                    defaultValue={convertDate(this.state.venda.data, true)}
                                    /* onChange={this.changeVenda} */ />
                            </div>
                        </div>
                        <hr />
                        <div className="container-fluid ">
                            <div className="row p-2" >
                                <div className="input-group col-4">
                                    <div className="input-group-prepend">
                                        <label className="input-group-text" htmlFor="cli">Cliente</label>
                                    </div>
                                    <select value={this.state.venda.clienteId} id="cli"
                                        onChange={this.changeVenda} name="clienteId" className="custom-select">
                                        <option>Selecione um Cliente</option>
                                        {this.state.clientes.map((cliente, i) => {
                                            return (
                                                <option key={i} value={cliente.Codcliente}>
                                                    {cliente.nome}
                                                </option>
                                            )
                                        })}
                                    </select>
                                </div>
                                <div className="input-group col-4">
                                    <div className="input-group-prepend">
                                        <label className="input-group-text" htmlFor="barb">Barbearia</label>
                                    </div>
                                    <select value={this.state.venda.barbeariaId} id="barb"
                                        onChange={this.changeVenda} name="barbeariaId" className="custom-select">
                                        <option>Selecione uma Barbearia</option>
                                        {this.state.barbearias.map((barbearia, i) => {
                                            return (
                                                <option key={i} value={barbearia.Codbarbearia}>
                                                    {barbearia.nome}
                                                </option>
                                            )
                                        })}
                                    </select>
                                </div>
                                <div className="input-group col-4">
                                    <div className="input-group-prepend">
                                        <label className="input-group-text" htmlFor="barber">Barbeiro</label>
                                    </div>
                                    <select value={this.state.venda.barbeiroId} id="barber"
                                        onChange={this.changeVenda} name="barbeiroId" className="custom-select">
                                        <option>Selecione um Barbeiro</option>
                                        {this.state.barbeiros.map((barbeiro, i) => {
                                            return (
                                                <option key={i} value={barbeiro.Codbarbeiro}>
                                                    {barbeiro.nome}
                                                </option>
                                            )
                                        })}
                                    </select>
                                </div>
                            </div>
                            <div className="input-group col-12 mt-2 justify-content-center p-3" >
                                <button className="btn btn-success mr-1"
                                    onClick={this.saveVenda} >
                                    Incluir Itens
                                </button>
                                <button className="btn btn-primary"
                                    onClick={this.clearVenda} >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                        <div>
                            <div className="lead mt-2">Preencha os campos acima e clique em <strong>"Incluir Itens"</strong></div>
                        </div>
                    </div>}
                {this.state.inVenda &&
                    <div>
                        <div className="row ">
                            <div className="col-2 md-2 mt-2 border text-center lead">
                                {this.state.data}
                            </div>
                            <div className="col-2 md-2 mt-2 border text-center lead">
                                Cód. Venda: {this.state.idVenda}
                            </div>
                            <div className="col-4 md-4 mt-2 border-bottom text-center lead">
                                Cadastro de Itens
                            </div>
                            <div className="col-1 md-1 mt-2 border text-center font-weight-bold lead">
                                Total:
                            </div>
                            <div className="col-3 md-3 mt-2 border text-center font-weight-bold lead">
                                {this.totalizar(this.state.itemvendas).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}
                            </div>
                        </div>
                        <br />
                        <div className="container-fluid " >
                            <div className="row mb-2 justify-content-center" >
                                <div className="input-group col-4">
                                    <div className="input-group-prepend">
                                        <label className="input-group-text d-flex" htmlFor="inputGroupSelect01">Item</label>
                                    </div>
                                    <select value={this.state.itemVenda.itemId}
                                        onChange={this.changeItem} name="itemId" className="custom-select" id="inputGroupSelect01">
                                        <option>Selecione</option>
                                        {this.state.itens.map((item, i) => {
                                            return (
                                                <option key={i} value={item.Coditem}>
                                                    {item.nome}
                                                </option>
                                            )
                                        })}
                                    </select>
                                </div>
                                <div className="input-group col-3">
                                    <div className="input-group-prepend">
                                        <label className="input-group-text" htmlFor="i2">Quantidade</label>
                                    </div>
                                    <input className="form-control" id="i2"
                                        type="number"
                                        min="1"
                                        name="qtvenda"
                                        value={this.state.itemVenda.qtvenda}
                                        onChange={this.changeItem} />

                                </div>
                                <div className="input-group col-1">
                                    <button className="btn btn-success"
                                        type="button" id="button-addon2" onClick={this.saveItem}>
                                        <i className="fa fa-plus"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                        {this.renderTable()}
                    </div>
                }
            </Main>
        )
    }
}