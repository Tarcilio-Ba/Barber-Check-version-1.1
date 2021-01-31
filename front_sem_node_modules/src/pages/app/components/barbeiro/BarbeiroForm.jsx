import React, { Component } from 'react'
import { FcUndo } from 'react-icons/fc'
import api from '../../../../services/api'


class BarbeiroForm extends Component {

    state = { ...this.props.barbeiro }

    change(event) {
        /* const barbeiro = { ...this.state }
        barbeiro[event.target.name] = event.target.value */
        this.setState({ [event.target.name]: event.target.value })
    }

    clear() {
        this.setState({ ...this.props.barbeiro })
    }
    save = async e => {
        e.preventDefault();
        const barbeiro = { ...this.state }
        try {
            await api.put(`/barbeiros/${barbeiro.Codbarbeiro}`, barbeiro)
            window.location.reload()
        } catch (err) {
            console.log(err)
        }
    }

    render() {
        return (
            <div className="container-fluid mt-3 mb-3">
                <div className="form">
                    <div className="row mb-3" >
                        <div className="input-group col-6">
                            <div className="input-group-prepend">
                                <label className="input-group-text" htmlFor="nome">Nome</label>
                            </div>
                            <input className="form-control" id="nome"
                                type="text"
                                name="nome"
                                value={this.state.nome}
                                onChange={e => this.change(e)}
                                placeholder="Nome..." />
                        </div>
                        <div className="input-group col-6">
                            <div className="input-group-prepend">
                                <label className="input-group-text" htmlFor="email">E-mail</label>
                            </div>
                            <input className="form-control" id="email"
                                type="text"
                                name="email"
                                value={this.state.email}
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
                                value={this.state.endereco}
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
                                value={this.state.telefone}
                                onChange={e => this.change(e)}
                                placeholder="Telefone..." />
                        </div>
                    </div>
                    <hr />
                    <div className="row">
                        <div className="col-12 d-flex justify-content-center" >
                            <button className="btn btn-outline-primary"
                                onClick={() => this.clear()} >
                               <FcUndo /> Cancelar
                            </button>
                            <button className="btn btn-outline-success ml-3"
                                onClick={e => this.save(e)} >
                               <i className="fa fa-edit"/> Salvar
                            </button>
                        </div>
                    </div>
                </div >
            </div>
        )
    }
}

export default BarbeiroForm
