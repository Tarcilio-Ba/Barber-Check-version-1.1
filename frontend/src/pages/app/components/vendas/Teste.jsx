import React from 'react'

import Main from '../../template/Main'
import { Component } from 'react'
import api from '../../../../services/api'
import { dAF } from '../../mask/mask'


const headerProps = {
    title: " Vendas",
    subtitle: "Sistema de Gerenciamento de Barbearias",
    icon: "money"
}

const initialState = {
    venda: {
        clienteId: '',
        barbeariaId: ''
    },
    itemVenda: {
        itemId: '',
        qtvenda: '',
    },
    idVenda: 3,
    inVenda: false,
    clientes: [],
    barbearias: [],
    itens: [],
    itemvendas: [],
    data: dAF(),
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
        this.setState({ venda: initialState.venda })
    }

    changeItem(event) {
        const itemVenda = { ...this.state.itemVenda }
        itemVenda[event.target.name] = event.target.value
        this.setState({ itemVenda })
    }

    componentDidMount = async () => {
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
        this.setState({ clientes: clientes.data })
        const barbearias = await api.get('/barbearias')
        barbearias.data.sort((a, b) => {
            if (a.nome > b.nome) {
                return 1;
            }
            if (a.nome < b.nome) {
                return -1;
            }
            // a must be equal to b
            return 0;
        })
        this.setState({ barbearias: barbearias.data })
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
        this.setState({ itens: itens.data })
    }

    saveVenda = async () => {
        const { clienteId, barbeariaId } = this.state.venda
        if (!clienteId || !barbeariaId) {
            this.setState({ error: "Preencha todos os dados para continuar!" });
        } else {
            try {
                await api.post("/vendas", { clienteId, barbeariaId })
                this.handleVendaOn()
            } catch (err) {
                this.setState({ error: 'Ocorreu um erro ao cadastrar!' })
            }
        }
        if (this.state.error !== '') {
            this.setState({ error: '' })
        }
        const vendas = await api.get('/vendas')
        const currentVenda = vendas.data.slice(-1)
        this.setState({ idVenda: currentVenda[0].Codvenda })
        console.log(this.state.idVenda)

    }
    saveItem = async () => {
        const vendaId = this.state.idVenda
        /*this.setState({itemVenda: venda}) */
        const { itemId, qtvenda } = this.state.itemVenda

        if (!itemId || !qtvenda) {
            this.setState({ error: "Preencha todos os dados para continuar!" });
        } else {
            try {
                await api.post("/itemvendas", { itemId, vendaId, qtvenda })
            } catch (err) {
                this.setState({ error: 'Ocorreu um erro ao cadastrar!' })
            }
        }
        const itemvendas = await api.get('/itemvendas')
        const filteredItens = itemvendas.data.filter(i => i.vendaId === vendaId)
        const soma = this.totalizar(filteredItens)
        this.setState({ itemvendas: filteredItens, total: soma })
        this.setState({ itemVenda: initialState.itemVenda })
        console.log(this.state.itemvendas)
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
        } catch (err) {
            return this.setState({ error: 'Não foi possível excluir!' })
        }
        const resp = await api.get('/itemvendas')
        const filteredItens = resp.data.filter(r => r.vendaId === vendaId)
        this.setState({ itemvendas: filteredItens })
    }

    renderTable() {
        return (
            <div>
                <div className="col col-12 d-flex">
                    <table className="table table-sm table-bordered">
                        <thead className="table-secondary">
                            <tr className="text-center">
                                <th scope="col">Cód. Item</th>
                                <th scope="col">Item</th>
                                <th scope="col">Valor Unitário</th>
                                <th scope="col">Quantidade</th>
                                <th scope="col">Total</th>
                                <th scope="col">Remover</th>
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

    render() {
        return (
            <Main {...headerProps} >
                {this.state.error && <p className="text-danger">{this.state.error}</p>}
                <div className="mr-4">
                    <button className="btn btn-outline-danger">Cancelamento de Vendas</button>
                </div>
                {/*Teste de inclusão de itens começa aqui*/}
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
                                    <label className="input-group-text" htmlFor="inputGroupSelect01">Item</label>
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
                                <button className="btn btn-primary"
                                    type="button" id="button-addon2" onClick={this.saveItem}>
                                    <i className="fa fa-plus"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    
                        {this.renderTable()}
                    
                </div>
            </Main>
        )
    }
}