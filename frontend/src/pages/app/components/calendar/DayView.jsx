import React, { Component } from 'react'
import { horas } from './resources'
import './DayView.css'
import api from '../../../../services/api'
import { convertDate, dataF } from '../../mask/mask'
import { FaArrowCircleLeft, FaCalendarAlt } from 'react-icons/fa'
import { TiCancel } from 'react-icons/ti'
import { GiRazorBlade } from 'react-icons/gi'
import { IoIosPerson } from 'react-icons/io'

import { Agendar, Cancelar } from './AgendamentoViews'
import ModalApp from '../../template/SimpleModal'
import { NavLink } from 'react-router-dom'

export default class DayView extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: this.props.data,
            list: [],
            barbeiros: this.props.barbeiros,
            selectedBarber: this.props.selected,
            justOneDetail: this.props.justOneDetail,
            emp: parseInt(localStorage.getItem('EMP')),
            error: ''
        }
    }

    componentDidMount = async () => {
        try {
            const resp = await api.get('/agendamentos')
            const list = resp.data.filter(a => a.Codemp === this.state.emp)
            this.setState({ list })

        } catch (err) {
            return this.setState({ error: 'Não foi possível carregar a lista.' })
        }
    }
    componentDidUpdate = async () => {
        try {
            const resp = await api.get('/agendamentos')
            const list = resp.data.filter(a => a.Codemp === this.state.emp)

            this.setState({ list })

        } catch (err) {
            return this.setState({ error: 'Não foi possível carregar a lista.' })
        }
    }

    filteredList = (hora, barber = false) => {
        const barbeiro = this.state.selectedBarber.barbeiroId
        const dataBusca = this.state.data
        const list = this.state.list.filter(l => l.hora === hora)
        const newList = list.filter(l => dataF(l.data) === convertDate(dataBusca, false))
        if (!barber) {
            return newList
        } else {
            const barberList = newList.filter(b => b.barbeiroId === barbeiro)
            return barberList
        }
    }

    findName = (cod) => {
        const ind = this.state.barbeiros.filter(b => b.Codbarbeiro === cod)
        /* console.log(ind[0].nome) */
        return ind[0].nome
    }

    renderTable = () => {
        const justOneDetail = this.state.justOneDetail
        const barbeiro = this.state.selectedBarber.barbeiroId
        return (
            <table className="table table-hover ">
                <thead className="thead-dark">
                    <tr className="text-center text-xl">
                        <th>Hora</th>
                        {!justOneDetail ? <th>Agendamentos</th> : <th>Agendamentos || {<GiRazorBlade />} Barbeiro: {this.findName(barbeiro)}</th>}
                        <th>Opções</th>
                    </tr>
                </thead>
                <tbody className="text-left">
                    {this.renderRows()}
                </tbody>
            </table>
        )
    }

    renderRows = () => {
        return horas.map((hora, i) => {
            const justOneDetail = this.state.justOneDetail
            return (
                <tr key={i} className="text-center align-itens-center">
                    <td className="hour align-middle">{hora}</td>
                    <td>
                        <div className="gen align-middle text-left">
                            {!justOneDetail ?
                                this.filteredList(hora, false).map(ag => {
                                    return (
                                        <ul key={ag.Codagendamento}
                                        >
                                            <li>
                                                <small className="text-info text-muted">Cód: {ag.Codagendamento} - </small>
                                                <IoIosPerson /><small className="text-muted"> Cliente: {ag.cliente} </small>
                                                <GiRazorBlade /><small className="text-muted"> Barbeiro: {this.findName(ag.barbeiroId)} </small>
                                            </li>
                                        </ul>
                                    )
                                })
                                :
                                this.filteredList(hora, true).map(ag => {
                                    return (
                                        <ul key={ag.Codagendamento} className="none">
                                            <li>
                                                <small className="text-info text-muted">Cód: {ag.Codagendamento} - </small>
                                                <IoIosPerson /><small className="text-muted"> Cliente: {ag.cliente} </small>
                                                {/* <GiRazorBlade /><small className="text-muted"> Barbeiro: {this.findName(ag.barbeiroId)} </small> */}
                                            </li>
                                        </ul>
                                    )
                                })}
                        </div>
                    </td>
                    <td className="opcoes align-middle">
                        <ModalApp color="warning" className="mb-2"
                            tam="sm"
                            icon={<FaCalendarAlt />}
                            buttonLabel=" Agendar"
                            edit="Agendar"
                            component={
                                <Agendar data={convertDate(this.state.data, false)}
                                    hora={hora} />
                            } />
                        {this.state.justOneDetail ?
                            <ModalApp color="danger"
                                tam="sm"
                                icon={<TiCancel />}
                                buttonLabel=" Cancelar"
                                edit="Cancelar"
                                component={
                                    <Cancelar
                                        list={this.filteredList(hora, true)}
                                        data={this.state.data}
                                        hora={hora}
                                        selectedBarber={this.state.selectedBarber}
                                        barbeiros={this.state.barbeiros}
                                        barber={true} />
                                } />
                            :
                            <ModalApp color="danger"
                                icon={<TiCancel />}
                                buttonLabel=" Cancelar"
                                edit="Cancelar"
                                tam="sm"
                                component={
                                    <Cancelar
                                        data={this.state.data}
                                        hora={hora}
                                        list={this.filteredList(hora, false)}
                                        selectedBarber={this.state.selectedBarber}
                                        barbeiros={this.state.barbeiros}
                                        barber={false} />
                                } />}
                    </td>
                </tr>
            )
        })
    }

    render() {
        return (
            <div>
                <nav className="navbar navbar-inverse">
                    <div className="container-fluid">
                        <div className="navbar-header">
                            <button className="btn btn-outline-dark" onClick={this.props.close}>
                                <FaArrowCircleLeft /> <strong>Voltar</strong>
                            </button>
                        </div>
                        <span>
                            <NavLink to="/barbearias/novo" className="btn btn-outline-dark">Cadastrar Barbearia</NavLink>
                            <NavLink to="/barbeiros/novo" className="btn btn-outline-dark ml-1">Cadastrar Barbeiro</NavLink>
                            <NavLink to="/clientes/novo" className="btn btn-outline-dark ml-1">Cadastrar Cliente</NavLink>
                        </span>
                        <strong> Data: {convertDate(this.props.data)}</strong>
                    </div>
                </nav>
                <div className="gen col col-12 d-flex">
                    {this.renderTable()}
                </div>
            </div >
        )
    }
}