import React, { Component } from 'react'
import api from '../../../../services/api'

import { AiFillHome } from 'react-icons/ai'
import Main from '../../template/Main.jsx'
import Dialog from '../../template/Dialog'
import { NavLink } from 'react-router-dom'
import { horas } from '../calendar/resources'


const headerProps = {
    icon: 'calendar',
    title: ' Agendamentos',
    subtitle: 'Cadastrar, Consultar, Editar e Excluir'
}

const initialState = {
    agenda: {
        data: '',
        hora: '',
        clienteId: Number(),
        barbeariaId: Number(),
        barbeiroId: Number(),
        itemId: Number()
    },
    clientes: [],
    barbearias: [],
    barbeiros: [],
    itens: [],
    horas: horas,
    emp: parseInt(localStorage.getItem("EMP")),
    error: ''
}

export default class Agendamento extends Component {

    constructor(props) {
        super(props)
        this.state = { ...initialState }

        this.save = this.save.bind(this)
        this.change = this.change.bind(this)
        this.clear = this.clear.bind(this)
    }

    componentDidMount = async () => {
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

    change(event) {
        const agenda = { ...this.state.agenda }
        agenda[event.target.name] = event.target.value
        this.setState({ agenda })
        console.log(this.state.agenda)
    }
    save = async () => {
        const { data, hora, clienteId, barbeariaId, barbeiroId, itemId } = this.state.agenda
        const Codemp = this.state.emp
        if (!data || !hora || !clienteId || !barbeariaId || !barbeiroId || !itemId) {
            this.setState({ error: "Preencha todos os dados para continuar!" });
        } else if (hora > '20:30' || hora < '08:00') {
            this.setState({ error: "A HORA deve estar entre 08:00 e 20:30" })
        } else {
            try {
                await api.post("/agendamentos", { data, hora, clienteId, barbeariaId, barbeiroId, itemId, Codemp })
                this.setState({ ...initialState })
                window.location.reload()
            } catch (err) {
                this.setState({ error: 'Ocorreu um erro ao cadastrar!' })
            }
        }
    }

    clear() {
        this.setState({ agenda: initialState.agenda, error: initialState.error })
    }

    render() {
        return (
            <Main {...headerProps} >
                <div className="row justify-content-between">
                    <div className="col-2">
                        <NavLink className="btn btn-outline-dark" to="/home" >
                            <AiFillHome /> Início
                        </NavLink>
                    </div>
                    <div className="col-10 text-right">
                        <NavLink className="btn btn-info" activeClassName="selected" to="/agendamentos" >
                            Listar Agendamentos
                        </NavLink>
                    </div>
                </div>
                {this.state.error && <p className="text-danger font-weight-bold">{this.state.error}</p>}
                <hr />
                <hr />
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
                                    value={this.state.agenda.data}
                                    onChange={this.change} />
                            </div>
                        </div>
                        <div className="col-3 md-3">
                            <div className="input-group">
                                <div className="input-group-prepend">
                                    <label className="input-group-text" htmlFor="hora">Hora</label>
                                </div>
                                <select value={this.state.hora}
                                    onChange={this.change} name="hora" className="custom-select" id="hora">
                                    <option>Selecione</option>
                                    {this.state.horas.map((hora, i) => {
                                        return (
                                            <option key={i} value={hora}>
                                                {hora.slice(0,5)}
                                            </option>
                                        )
                                    })}
                                </select>
                            </div>
                        </div>
                        <div className="col-6 md-6">
                            <div className="input-group">
                                <div className="input-group-prepend">
                                    <label className="input-group-text" htmlFor="cliente">Cliente</label>
                                </div>
                                <select value={this.state.agenda.Codcliente}
                                    onChange={this.change} name="clienteId" className="custom-select" id="cliente">
                                    <option>Selecione</option>
                                    {this.state.clientes.map((cliente, i) => {
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
                                    <label className="input-group-text" htmlFor="servico">Serviço</label>
                                </div>
                                <select value={this.state.itens.Coditem}
                                    onChange={this.change} name="itemId" className="custom-select" id="servico">
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
                        </div>
                        <div className="col-4 md-4">
                            <div className="input-group">
                                <div className="input-group-prepend">
                                    <label className="input-group-text" htmlFor="barbearia">Barbearia</label>
                                </div>
                                <select value={this.state.barbearias.Codbarbearia}
                                    onChange={this.change} name="barbeariaId" className="custom-select" id="barbearia">
                                    <option>Selecione</option>
                                    {this.state.barbearias.map((barbearia, i) => {
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
                                <select value={this.state.barbeiros.Codbarbeiro}
                                    onChange={this.change} name="barbeiroId" className="custom-select" id="barbeiro">
                                    <option>Selecione</option>
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
                    </div>
                    <hr />
                    <div className="row">
                        <div className="col-12 d-flex justify-content-center" >
                            <button className="btn btn-primary "
                                onClick={this.clear} >
                                Cancelar
                            </button>
                            <Dialog 
                            class="ml-2"
                            color="success"
                            openLabel={`Salvar`}
                            title="Salvar"
                            body={!this.state.error ? 
                                'Deseja salvar lançamento?' 
                                : <p className="text-danger font-weight-bold">{this.state.error}</p>}
                            button="Salvar" 
                            onClick={this.save}/>
                        </div>
                    </div>
                </div>
                <hr />

            </Main>
        )
    }
}