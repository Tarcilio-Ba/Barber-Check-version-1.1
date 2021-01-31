import React, { Component } from 'react'
import api from '../../../../services/api'
import Main from '../../template/Main.jsx'
import { NavLink } from 'react-router-dom'
import { cpfMask } from '../../mask/mask'


const headerProps = {
    icon: 'users',
    title: ' Clientes',
    subtitle: 'Cadastrar, Consultar, Editar e Excluir'
}

const initialState = {
    nome: '',
    cpf: '',
    endereco: '',
    email: '',
    telefone: '',
    Codemp: parseInt(localStorage.getItem('EMP')),
    error: ''
}

export default class Cliente extends Component {

    constructor(props) {
        super(props)
        this.state = { ...initialState }

        this.change = this.change.bind(this)
        this.clear = this.clear.bind(this)
    }

    change(event) {
        this.setState({ [event.target.name]: event.target.value })
    }
    save = async () => {
        const { nome, cpf, email, endereco, telefone,  Codemp} = this.state
        if (!nome || !cpf || !email || !endereco || !telefone) {
            this.setState({ error: "Preencha todos os dados para continuar!" });
        } else {
            try {
                await api.post("/clientes", { nome, cpf, email, endereco, telefone, Codemp })
                this.setState({ ...initialState })
            } catch (err) {
                this.setState({ error: 'Ocorreu um erro ao cadastrar!' })
            }

        }
    }

    clear() {
        this.setState({ ...initialState })
    }

    render() {
        return (
            <Main {...headerProps} >
                <NavLink className="btn btn-info" activeClassName="selected" to="/clientes" >
                    Listar Clientes
                </NavLink>
                <hr />
                {this.state.error && <p className="text-danger">{this.state.error}</p>}
                <div className="form">
                    <div className="row mb-3" >
                        <div className="input-group col-12">
                            <div className="input-group-prepend">
                                <label className="input-group-text" htmlFor="nome">Nome</label>
                            </div>
                            <input className="form-control" id="nome"
                                type="text"
                                name="nome"
                                value={this.state.nome}
                                onChange={this.change}
                                placeholder="Nome..." />
                        </div>
                    </div>
                    <div className="row mb-3" >
                        <div className="input-group col-6">
                            <div className="input-group-prepend">
                                <label className="input-group-text" htmlFor="cpf">CPF</label>
                            </div>
                            <input className="form-control" id="cpf"
                                type="text"
                                name="cpf"
                                maxLength='14'
                                value={cpfMask(this.state.cpf)}
                                onChange={this.change}
                                placeholder="Cpf..." />
                        </div>
                        <div className="input-group col-6">
                            <div className="input-group-prepend">
                                <label className="input-group-text" htmlFor="email">E-mail</label>
                            </div>
                            <input className="form-control" id="email"
                                type="email"
                                name="email"
                                value={this.state.email}
                                onChange={this.change}
                                placeholder="E-mail..." />
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="input-group col-6">
                            <div className="input-group-prepend">
                                <label className="input-group-text" htmlFor="end">Endereço</label>
                            </div>
                            <input className="form-control" id="end"
                                type="text"
                                name="endereco"
                                value={this.state.endereco}
                                onChange={this.change}
                                placeholder="Endereço..." />
                        </div>
                        <div className="input-group col-6">
                            <div className="input-group-prepend">
                                <label className="input-group-text" htmlFor="tel">Telefone</label>
                            </div>
                            <input className="form-control" id="tel"
                                type="tel"
                                name="telefone"
                                value={this.state.telefone}
                                onChange={this.change}
                                placeholder="Telefone..." />
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
            </Main>
        )
    }
}