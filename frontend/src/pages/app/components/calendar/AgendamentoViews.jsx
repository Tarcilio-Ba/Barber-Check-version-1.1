import React, { Component } from 'react'
import api from '../../../../services/api'
import { dataMask, convertDate, dataF } from '../../mask/mask'
import './DayView.css'


const initial = {
    clienteId: '',
    barbeariaId: '',
    barbeiroId: '',
    itemId: '',
    Codemp: parseInt(localStorage.getItem("EMP"))
}
export class Agendar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            agenda: {
                data: this.props.data,
                hora: this.props.hora,
                ...initial
            },
            clientes: [],
            barbearias: [],
            barbeiros: [],
            itens: [],
            agendamentos: [],
            barberList: [],
            clientList: [],
            emp: parseInt(localStorage.getItem("EMP")),
            error: ''
        }

        this.change = this.change.bind(this)
        this.save = this.save.bind(this)
    }

    componentDidMount = async () => {
        const resp = {
            clientes: await api.get('/clientes'),
            barbearias: await api.get('/barbearias'),
            barbeiros: await api.get('/barbeiros'),
            itens: await api.get('/itens'),
            agendamentos: await api.get('/agendamentos')
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
        const agendamentosByEmp = resp.agendamentos.data.filter(x => x.Codemp === this.state.emp)
        const itensByEmp = itens.filter(x => x.Codemp === this.state.emp)
        this.setState({
            clientes: clientesByEmp,
            barbearias: barbeariasByEmp,
            barbeiros: barbeirosByEmp,
            agendamentos: agendamentosByEmp,
            itens: itensByEmp
        })
        this.filteredList()
    }

    change(event) {
        const agenda = { ...this.state.agenda }
        agenda[event.target.name] = event.target.value
        this.setState({ agenda })
        console.log(this.state.agenda)
    }
    save = async () => {
        const { data, hora, clienteId, barbeariaId, barbeiroId, itemId, Codemp } = this.state.agenda
        if (!clienteId || !barbeariaId || !barbeiroId || !itemId) {
            this.setState({ error: "Preencha todos os dados para continuar!" });
        }
        else {
            try {
                await api.post("/agendamentos", { data, hora, clienteId, barbeariaId, barbeiroId, itemId, Codemp })
                this.setState({
                    agenda: {
                        data: this.props.data,
                        hora: this.props.hora,
                        ...initial
                    },
                    error: 'Cadastro realizado com sucesso!'
                })
                /* window.location.reload() */
            } catch (err) {
                this.setState({ error: 'Ocorreu um erro ao cadastrar!' })
            }
        }
    }

    filteredList = () => {
        const hora = this.state.agenda.hora
        const dataBusca = this.state.agenda.data
        const agendamentos = this.state.agendamentos.filter(l => l.hora === hora)
        const list = agendamentos.filter(l => dataF(l.data) === dataBusca)
        let barbeiros = this.state.barbeiros
        let clientes = this.state.clientes 
        if(list.length > 0){
            list.map((agendamento, i) => {
                barbeiros = barbeiros.filter(b => b.Codbarbeiro !== agendamento.barbeiroId)
                clientes = clientes.filter(b => b.Codcliente !== agendamento.clienteId)
                this.setState({ barberList: barbeiros, clientList: clientes })
                return (barbeiros, clientes)
            })
        }else{
            this.setState({ barberList: barbeiros, clientList: clientes })
        }
    }

    render() {
        return (
            <div className="form">
                {this.state.error &&
                    <div class="alert alert-warning" role="alert">
                        <strong>{this.state.error}</strong>
                    </div>}
                <div className="row" >
                    <div className="col-3 md-2">
                        <div className="input-group">
                            <div className="input-group-prepend">
                                <label className="input-group-text" htmlFor="data">Data</label>
                            </div>
                            <input className="form-control" id="data"
                                type="date"
                                name="data"
                                defaultValue={this.state.agenda.data}
                                /* onChange={this.change} */ />
                        </div>
                    </div>
                    <div className="col-3 md-2">
                        <div className="input-group">
                            <div className="input-group-prepend">
                                <label className="input-group-text" htmlFor="hora">Hora</label>
                            </div>
                            <input className="form-control" id="hora"
                                type="time"
                                name="hora"
                                defaultValue={this.state.agenda.hora}
                                /* onChange={this.change} */ />
                        </div>
                    </div>
                    <div className="col-6 md-6">
                        <div className="input-group">
                            <div className="input-group-prepend">
                                <label className="input-group-text" htmlFor="cliente">Cliente</label>
                            </div>
                            <select value={this.state.clientList.Codcliente}
                                onChange={this.change} name="clienteId" className="custom-select" id="cliente">
                                <option>Selecione</option>
                                {this.state.clientList.map((cliente, i) => {
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
                            <select value={this.state.barberList.Codbarbeiro}
                                onChange={this.change} name="barbeiroId" className="custom-select" id="barbeiro">
                                <option>Selecione</option>
                                {this.state.barberList.map((barbeiro, i) => {
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
                        <button className="btn btn-success ml-3"
                            onClick={this.save} >
                            Salvar
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}

export class Cancelar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            list: this.props.list,
            selectedBarber: this.props.selectedBarber,
            data: this.props.data,
            hora: this.props.hora,
            barber: this.props.barber,
            barbeiros: this.props.barbeiros,
            emp: parseInt(localStorage.getItem('EMP')),
            msg: ''
        }
    }

    remove = async agendamento => {
        const barber = this.state.barber
        const barbeiro = this.state.selectedBarber.barbeiroId
        const dataBusca = this.state.data
        const hora = this.state.hora
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
            const list = agByEmp.filter(r => r.hora === hora)
            const newList = list.filter(l => dataF(l.data) === convertDate(dataBusca, false))
            if (!barber) {
                this.setState({ list: newList, msg: 'Cancelamento realizado!' })
            } else {
                const barberList = newList.filter(b => b.barbeiroId === barbeiro)
                this.setState({ list: barberList, msg: 'Cancelamento realizado!' })
            }
        } catch (err) {
            return this.setState({ msg: 'Não foi possível excluir!' })
        }
    }

    findName = (cod) => {
        const ind = this.state.barbeiros.filter(b => b.Codbarbeiro === cod)
        console.log(ind[0].nome)
        return ind[0].nome
    }


    renderRows = () => {
        return this.state.list.map(agendamento => {
            return (
                <tr key={agendamento.Codagendamento} className="text-center">
                    <td>{agendamento.Codagendamento}</td>
                    <td>{dataMask(agendamento.data)}</td>
                    <td>{agendamento.hora}</td>
                    <td>{agendamento.cliente}</td>
                    <td>{this.findName(agendamento.barbeiroId)}</td>
                    <td>{agendamento.itemId}</td>
                    <td>{agendamento.barbeariaId}</td>
                    <td>
                        <button className="btn btn-sm btn-danger"
                            onClick={() => this.remove(agendamento)}>
                            <i className="fa fa-cancel"></i> Cancelar
                        </button>
                    </td>
                </tr>
            )
        })
    }
    render() {
        return (
            <div>
                {this.state.msg &&
                    <div class="alert alert-warning" role="alert">
                        <strong>{this.state.msg}</strong>
                    </div>}
                <table className="table table-hover ">
                    <thead className="thead-dark">
                        <tr className="text-center text-xl">
                            <th>Cod</th>
                            <th>Data</th>
                            <th>Hora</th>
                            <th>Cliente</th>
                            <th>Barbeiro</th>
                            <th>Serviço</th>
                            <th>Barbearia</th>
                            <th>Excluir</th>
                        </tr>
                    </thead>
                    <tbody className="text-left">
                        {this.renderRows()}
                    </tbody>
                </table>
            </div>
        )
    }
}