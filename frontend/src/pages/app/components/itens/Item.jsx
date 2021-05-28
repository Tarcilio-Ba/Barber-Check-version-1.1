import React, { Component } from 'react'
import api from '../../../../services/api'

import Main from '../../template/Main.jsx'
import { NavLink } from 'react-router-dom';


const headerProps = {
    icon: 'archive',
    title: ' Itens',
    subtitle: 'Cadastrar, Consultar, Editar e Excluir'
}


const initialState = {
    item: {
        nome: '',
        tipo: '',
        quantidade: 1,
        preco: '',
        Codemp: localStorage.getItem('EMP')
    },
    tipos: ['Produto', 'Serviço']
}



export default class Item extends Component {

    constructor(props) {
        super(props)
        this.state = { ...initialState }

        this.save = this.save.bind(this)
        this.change = this.change.bind(this)
        this.changeTipo = this.changeTipo.bind(this)
        this.clear = this.clear.bind(this)
    }

    change(event) {
        const item = { ...this.state.item }
        if (event.target.name === 'preco') {
            item[event.target.name] = Number(event.target.value)
        } else {
            item[event.target.name] = event.target.value
        }
        this.setState({ item })
    }
    changeTipo(event) {
        const item = { ...this.state.item }
        item.tipo = event.target.value
        this.setState({ item })
    }
    save = async () => {
        const { nome, tipo, quantidade, preco, Codemp } = this.state.item
        if (!nome || !tipo || !quantidade || !preco) {
            this.setState({ error: "Preencha todos os dados para continuar!" });
        } else {
            try {
                await api.post("/itens", { nome, tipo, quantidade, preco, Codemp })
                this.setState({ ...initialState })
            } catch (err) {
                this.setState({ error: 'Ocorreu um erro ao cadastrar!' })
            }
        }
        window.location.reload()
    }

    clear() {
        this.setState({ ...initialState.item })
    }

    render() {
        return (
            <Main {...headerProps} >
                <NavLink className="btn btn-info" activeClassName="selected" to="/itens" >
                    Listar Itens
                </NavLink>
                {this.state.error && <p className="text-danger">{this.state.error}</p>}
                <hr />
                <div className="form">
                    <div className="row mb-3" >
                        <div className="input-group col-6">
                            <div className="input-group-prepend">
                                <label className="input-group-text" htmlFor="nome">Nome</label>
                            </div>
                            <input className="form-control" id="nome"
                                type="text"
                                name="nome"
                                value={this.state.item.nome}
                                onChange={this.change}
                                placeholder="Nome..." />
                        </div>
                        <div className="input-group col-6">
                            <div className="input-group-prepend">
                                <label className="input-group-text" htmlFor="tipo">Tipo</label>
                            </div>
                            <select value={this.state.item.tipo}
                                onChange={this.changeTipo} className="custom-select" id="tipo">
                                <option>Selecione...</option>
                                {this.state.tipos.map((tipo, i) => {
                                    return (
                                        <option key={i} value={tipo === 'Produto' ? 'P' : 'S'}>
                                            {tipo}
                                        </option>
                                    )
                                })}
                            </select>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="input-group col-6">
                            <div className="input-group-prepend">
                                <label className="input-group-text" htmlFor="price">Preco</label>
                            </div>
                            <div class="input-group-prepend">
                                <span class="input-group-text">R$</span>
                            </div>
                            <input className="form-control" id="price"
                                type="number"
                                name="preco"
                                min="0.00"
                                step="0.1"
                                value={this.state.preco}
                                onChange={this.change}
                                placeholder="0,00" />
                        </div>
                        <div className="input-group col-6">
                            <div className="input-group-prepend">
                                <label className="input-group-text" htmlFor="qtd">Quantidade</label>
                            </div>
                            <input className="form-control" id="qtd"
                                type="number"
                                min="0"
                                step="1"
                                name="quantidade"
                                value={this.state.quantidade}
                                onChange={this.change}
                                placeholder="Quantidade..." />
                        </div>
                    </div>
                    <hr />
                    <div className="row">
                        <div className="col-12 d-flex justify-content-center" >
                            <button className="btn btn-primary "
                                onClick={this.clear} >
                                Cancelar
                            </button>
                            <button className="btn btn-success ml-3"
                                onClick={this.save} >
                                Salvar
                            </button>
                        </div>
                    </div>
                </div>
                <hr />

            </Main >
        )
    }
}