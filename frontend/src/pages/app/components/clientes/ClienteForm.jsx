import React, { Component } from 'react'
import api from '../../../../services/api'
import { cpfMask } from '../../mask/mask'


export default class ClienteForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            cliente: { ...this.props.cliente },
            error: ''
        }

        this.change = this.change.bind(this)
    }



    change(event) {
        const cliente = { ...this.state.cliente }
        cliente[event.target.name] = event.target.value
        this.setState({ cliente })
    }

    clear() {
        this.setState({ ...this.props.cliente })
    }

    save = async e => {
        e.preventDefault();
        const cliente = { ...this.state.cliente }
        const { nome, cpf, email, endereco, telefone } = this.state.cliente
        try {
            await api.put(`/clientes/${cliente.Codcliente}`, { nome, cpf, email, endereco, telefone })
        } catch (err) {
            return this.setState({
                error: 'Não foi possível alterar, favor verifique!'
            })
        }
        window.location.reload()
    }

    render() {
        return (
            <div className="form">
                {this.state.error && <p className="text-danger">{this.state.error}</p>}
                <div className="row mb-3" >
                    <div className="input-group col-12">
                        <div className="input-group-prepend">
                            <label className="input-group-text" htmlFor="nome">Nome</label>
                        </div>
                        <input className="form-control" id="nome"
                            type="text"
                            name="nome"
                            value={this.state.cliente.nome}
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
                            value={cpfMask(this.state.cliente.cpf)}
                            onChange={e => this.change(e)}
                            placeholder="cpf..." />
                    </div>
                    <div className="input-group col-6">
                        <div className="input-group-prepend">
                            <label className="input-group-text" htmlFor="email">E-mail</label>
                        </div>
                        <input className="form-control" id="email"
                            type="text"
                            name="email"
                            value={this.state.cliente.email}
                            onChange={e => this.change(e)}
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
                            value={this.state.cliente.endereco}
                            onChange={e => this.change(e)}
                            placeholder="Endereço..." />
                    </div>
                    <div className="input-group col-6">
                        <div className="input-group-prepend">
                            <label className="input-group-text" htmlFor="tel">Telefone</label>
                        </div>
                        <input className="form-control" id="tel"
                            type="text"
                            name="telefone"
                            value={this.state.cliente.telefone}
                            onChange={e => this.change(e)}
                            placeholder="Telefone..." />
                    </div>
                </div>
                <hr />
                <div className="row">
                    <div className="col-12 d-flex justify-content-center" >
                        <button className="btn btn-primary "
                            onClick={() => this.clear()} >
                            Cancelar
                            </button>
                        <button className="btn btn-success ml-3"
                            onClick={e => this.save(e)} >
                            Editar
                            </button>
                    </div>
                </div>
            </div>
        )
    }
}
