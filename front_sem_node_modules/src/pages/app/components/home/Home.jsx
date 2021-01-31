import React, { Component } from 'react'
import Main from '../../template/Main'
import MyCalendar from '../calendar/Calendar'
import DayView from '../calendar/DayView'
import Card from '../../template/Card'
import api from '../../../../services/api'
import { FaCaretRight } from 'react-icons/fa'
import { convertDate } from '../../mask/mask'
import { BsSearch } from 'react-icons/bs'
import { RiPlayListAddLine } from 'react-icons/ri'
import Dropdown from 'react-bootstrap/esm/Dropdown'
import { NavLink } from 'react-router-dom'

const initial = {
    dayDetail: false,
    selected: { barbeiroId: 0 },
    justOneDetail: false,
    error: ''
}
export default class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {
            date: new Date(),
            dayDetail: false,
            justOneDetail: false,
            barbeiros: [],
            selected: { barbeiroId: 0 },
            error: ''
        }
        this.onChange = this.onChange.bind(this)
        this.dayClick = this.dayClick.bind(this)
        this.clickOpen = this.clickOpen.bind(this)
        this.clickClose = this.clickClose.bind(this)
        this.handleChangeBarbeiro = this.handleChangeBarbeiro.bind(this)
        this.handleOneDetail = this.handleOneDetail.bind(this)
    }

    componentDidMount = async () => {
        const emp = parseInt(localStorage.getItem('EMP'))
        const barb = await api.get('/barbeiros')
        barb.data.sort((a, b) => {
            if (a.data < b.data) {
                return 1;
            }
            if (a.data > b.data) {
                return -1;
            }
            return 0;
        })
        const barbByEmp = barb.data.filter(b => b.Codemp === emp)
        this.setState({ barbeiros: barbByEmp })
    }
    handleChangeBarbeiro(event) {
        const selected = { ...this.state.selected }
        selected[event.target.name] = +event.target.value
        this.setState({ selected })
    }
    onChange = date => this.setState({ date })
    dayClick = value => this.setState({ date: value })
    clickOpen = () => this.setState({ dayDetail: true })
    clickClose = () => this.setState({ ...initial })

    handleOneDetail = () => {
        this.state.selected.barbeiroId === 0 ?
            this.setState({ error: 'Selecione um barbeiro para continuar!' })
            :
            this.setState({ justOneDetail: true, dayDetail: true })
    }

    render() {
        return (<Main title="Inicio - Sistema de Gerenciamento de Barbearias"
            subtitle="Agendamento e Gerenciamento de forma simples e rápida!"
            icon="home">
            {!this.state.dayDetail &&
                <div className="container-fluid">
                    <div className="row justify-content-center " >
                        <div className="col-sm text-center">
                            <Card gray title="Instruções"> {/*card 1*/}
                                <ul className="text-left">
                                    <li>Selecione um dia no <strong><em>Calendário</em></strong>.</li>
                                    <li>Clique em <em><strong>Visualizar Agendamentos </strong></em>
                                        para os agendamentos do dia selecionado.</li>
                                    <li>Clique em <em><strong>Cadastrar Agendamento </strong></em>
                                        para novo agendamento
                                    </li>
                                    <li>Selecone um barbeiro e clique em <em><strong>Visualizar </strong></em>
                                        para os seus agendamentos do dia .
                                    </li>
                                </ul>
                            </Card>
                        </div>
                        <div className="col-sm text-center">
                            <Card gray title="Calendário"> {/*card 2*/}
                                <MyCalendar
                                    dayClick={this.dayClick}
                                    date={this.state.date}
                                    changeDay={this.onChange}
                                />
                                <br />
                            </Card>

                        </div>
                        <div className="col-sm text-center">
                            <Card gray title="Opções"> {/*card 3*/}
                                <div className="justify-content-center ">
                                    {/* Parte 1 */}
                                    <div>
                                        <strong>Dia Selecionado: {convertDate(this.state.date)}</strong>
                                    </div>
                                    <button
                                        className="btn btn-warning"
                                        onClick={this.clickOpen}>
                                        <BsSearch /> Visualizar Agendamentos <FaCaretRight />
                                    </button>
                                    <hr />
                                    {/* Parte 2 */}
                                    <Dropdown>
                                        <Dropdown.Toggle variant="primary" id="dropdown-basic">
                                            <RiPlayListAddLine /> Cadastros
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu className="text-center">
                                            <Dropdown.Item >
                                                <NavLink to="/barbearias/novo" className="text-dark">Barbearias</NavLink>
                                            </Dropdown.Item>
                                            <Dropdown.Item >
                                                <NavLink to="/barbeiros/novo" className="text-dark">Barbeiros</NavLink>
                                            </Dropdown.Item>
                                            <Dropdown.Item >
                                                <NavLink to="/clientes/novo" className="text-dark">Clientes</NavLink>
                                            </Dropdown.Item>
                                            <Dropdown.Item >
                                                <NavLink to="/itens/novo" className="text-dark">Produtos/Serviços</NavLink>
                                            </Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                    <hr />
                                    {/* Parte 3 */}
                                    {this.state.error &&
                                        <div class="alert alert-warning" role="alert">
                                            <strong>{this.state.error}</strong>
                                        </div>}
                                    <label>Selecione um Barbeiro</label>
                                    <div className="input-group">
                                        <div className="input-group-prepend">
                                            <label className="input-group-text" htmlFor="barbeiro">Barbeiro</label>
                                        </div>
                                        <select value={this.state.barbeiros.Codbarbeiro}
                                            onChange={this.handleChangeBarbeiro} name="barbeiroId" className="custom-select" id="barbeiro">
                                            <option>Selecione</option>
                                            {this.state.barbeiros.map((barbeiro, i) => {
                                                return (
                                                    <option key={i} value={barbeiro.Codbarbeiro} placeholder="Selecione">
                                                        {barbeiro.nome}
                                                    </option>
                                                )
                                            })}
                                        </select>
                                    </div>
                                    <button
                                        className="btn btn-info mt-2"
                                        onClick={this.handleOneDetail}>
                                        <BsSearch /> Visualizar <FaCaretRight />
                                    </button>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>}
            {this.state.dayDetail &&
                <div className="justify-content-center">
                    <DayView
                        data={this.state.date}
                        justOneDetail={this.state.justOneDetail}
                        open={this.clickOpen}
                        close={this.clickClose}
                        selected={this.state.selected}
                        barbeiros={this.state.barbeiros} />
                </div>}
        </Main>)
    }
}