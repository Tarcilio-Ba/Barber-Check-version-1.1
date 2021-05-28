import React, { Component } from 'react'
import { dataF } from '../../mask/mask'
import api from '../../../../services/api'


export default class AgendamentoForm extends Component {

    constructor(props) {
        super(props)
        this.state = {
            agendamento: { ...this.props.agendamento },
            /* cliente: [],
            barbearia: [],
            barbeiro: [],
            iten: [] */
        }
    }

    change(event) {
        const agendamento = { ...this.state.agendamento }
        agendamento[event.target.name] = event.target.value
        this.setState({ agendamento })
    }

    clear() {
        this.setState({ agendamento: this.props.agendamento })
    }

    save = async e => {
        const { Codagendamento, data, hora, clienteId, barbeariaId, barbeiroId, itemId } = { ...this.state.agendamento }
        try {
            await api.put(`/agendamentos/${Codagendamento}`, { data, hora, clienteId, barbeariaId, barbeiroId, itemId })
            window.location.reload()
        } catch (err) {
            return this.setState({
                error: 'Não foi possível alterar, favor verifique!'
            })
        }
        
    }

    render() {
        return (
            <div className="form">
                <div className="row" >
                    <div className="col-3 md-2">
                        <div className="input-group">
                            <div className="input-group-prepend">
                                <label className="input-group-text" htmlFor="data">Data</label>
                            </div>
                            <input className="form-control" id="data"
                                type="date"
                                name="data"
                                value={dataF(this.state.agendamento.data)}
                                onChange={e => this.change(e)} />
                        </div>
                    </div>
                    <div className="col-3 md-3">
                        <div className="input-group">
                            <div className="input-group-prepend">
                                <label className="input-group-text" htmlFor="hora">Hora</label>
                            </div>
                            <input className="form-control" id="hora"
                                type="time"
                                name="hora"
                                value={this.state.agendamento.hora}
                                onChange={e => this.change(e)} />
                        </div>
                    </div>
                    <div className="col-6 md-6">
                        <div className="input-group">
                            <div className="input-group-prepend">
                                <label className="input-group-text" htmlFor="cliente">Cliente</label>
                            </div>
                            <select value={this.state.agendamento.clienteId}
                                onChange={e => this.change(e)} name="clienteId" className="custom-select" id="cliente">
                                {this.props.clientes.map((cliente, i) => {
                                    return (
                                        <option key={i} value={cliente.Codcliente}>
                                            {cliente.nome}
                                        </option>
                                    )
                                })}
                            </select>
                        </div>
                    </div>
                </div>
                <div className="row mt-3">
                    <div className="col-4 md-4">
                        <div className="input-group">
                            <div className="input-group-prepend">
                                <label className="input-group-text" htmlFor="item">Serviço</label>
                            </div>
                            <select value={this.state.agendamento.itemId}
                                onChange={e => this.change(e)} name="itemId" className="custom-select" id="item">
                                {this.props.itens.map((item, i) => {
                                    return (
                                        <option key={i} value={item.Coditem}>
                                            {item.nome}
                                        </option>
                                    )
                                })}
                            </select>
                        </div>
                    </div>
                    <div className="col-4 md-4">
                        <div className="input-group">
                            <div className="input-group-prepend">
                                <label className="input-group-text" htmlFor="barbearia">Barbearia</label>
                            </div>
                            <select value={this.state.agendamento.barbeariaId}
                                onChange={e => this.change(e)} name="barbeariaId" className="custom-select" id="barbearia" >
                                {this.props.barbearias.map((barbearia, i) => {
                                    return (
                                        <option key={i} value={barbearia.Codbarbearia}>
                                            {barbearia.nome}
                                        </option>
                                    )
                                })}
                            </select>
                        </div>
                    </div>
                    <div className="col-4 md-4">
                        <div className="input-group">
                            <div className="input-group-prepend">
                                <label className="input-group-text" htmlFor="barbeiro">Barbeiro</label>
                            </div>
                            <select value={this.state.agendamento.barbeiroId}
                                onChange={e => this.change(e)} name="barbeiroId" className="custom-select" id="barbeiro">
                                {this.props.barbeiros.map((barbeiros, i) => {
                                    return (
                                        <option key={i} value={barbeiros.Codbarbeiro}>
                                            {barbeiros.nome}
                                        </option>
                                    )
                                })}
                            </select>
                        </div>
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
                            Salvar
                            </button>
                    </div>
                </div>
            </div>
        )
    }
}
