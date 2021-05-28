import React, { Component } from 'react'
import BarbeiroForm from './BarbeiroForm'
import ModalApp from '../../template/Modal'
import Main from '../../template/Main'
import { NavLink } from 'react-router-dom'
import api from '../../../../services/api'
import SearchField from 'react-search-field'
import TypeChecker from 'typeco'
import Table from '../../template/Table'


const columns = [
    {
        name: 'Nome',
        selector: 'nome',
        sortable: true,
    },
    {
        name: 'Endereço',
        selector: 'endereco',
        sortable: true
    },
    {
        name: 'E-mail',
        selector: 'email',
        sortable: false
    },
    {
        name: 'Telefone',
        selector: 'telefone',
        sortable: false
    },
    /* {
        name: 'Editar | Excluir',
        sortable: false,
        cell: row =>
            <div>
                <div style={{ fontWeight: 700, alignContent: 'center' }}>
                    {<div>
                        <ModalApp color="warning" icon="edit" edit="Barbeiro"
                            component={
                                <BarbeiroForm
                                    barbeiro={row} />
                            }/>
                    </div>}
                </div>
                {row.summary}
            </div>
    } */
]

const headerProps = {
    icon: 'user',
    title: ' Barbeiros',
    subtitle: 'Lista de Barbeiros: Editar e Excluir'
}

const initialState = {
    list: [],
    selected: {},
    error: ''
}

export default class BarbeiroList extends Component {

    constructor(props) {
        super(props)

        this.state = { ...initialState, filteredList: [] }

        this.onBasicChange = this.onBasicChange.bind(this)
    }

    resetState = async () => {
        try {
            const resp = await api.get('/barbeiros')
            this.setState({ list: resp.data, filteredList: resp.data })
        } catch (err) {
            return this.setState({ error: 'Não foi possível carregar a lista.' })
        }
    }
    componentDidMount = () => {
        this.resetState()
    }

    getMatchedList = (searchText) => {
        if (TypeChecker.isEmpty(searchText)) return this.state.list;
        return this.state.list.filter(item => item.nome.toLowerCase().includes(searchText.toLowerCase()))
    }
    onBasicChange(value) {
        this.setState({
            filteredList: this.getMatchedList(value),
        });
    }
    doubleClick = (row) => this.setState({ selected: row })
    
    remove = async (barbeiro) => {
        try {
            api.delete(`/barbeiros/${barbeiro.Codbarbeiro}`)
            const resp = await api.get('/barbeiros')
            resp.data.sort((a, b) => {
                if (a.nome > b.nome) {
                    return 1;
                }
                if (a.nome < b.nome) {
                    return -1;
                }
                return 0;
            })
            this.setState({ list: resp.data })
            window.location.reload()
        } catch (err) {
            return this.setState({ error: 'Não foi possível excluir!' })
        }
    }
    title() {
        return (
            <div>
                <div className="d-4 ">
                    {/* <Table columns={columns} data={this.state.filteredList} title="Barbeiros" /> */}
                    <NavLink className="btn btn-outline-success mr-3" to="/barbeiros/novo" >
                        Novo Barbeiro
                        </NavLink>
                    <SearchField
                        classNames='col-5 h-auto font-weight-bold'
                        placeholder="Digite um nome..."
                        onChange={this.onBasicChange} />
                </div>
            </div>
        )
    }
    renderTable() {
        return (
            <div>
                <div className="col col-12 d-flex">
                    <table className="table table-hover">
                        <thead className="table-secondary">
                            <tr className="text-center">
                                <th>Cod</th>
                                <th>
                                    <SearchField
                                        className='bg-dark'
                                        placeholder="Digite um nome..."
                                        onChange={this.onBasicChange} />
                                    <br />
                                    Nome
                                </th>
                                <th>E-mail</th>
                                <th>Endereço</th>
                                <th>Telefone</th>
                                <th>Ações</th>
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

        return this.state.list.map(barbeiro => {
            return (
                <tr key={barbeiro.Codbarbeiro} className="text-center">
                    <td>{barbeiro.Codbarbeiro}</td>
                    <td>{barbeiro.nome}</td>
                    <td>{barbeiro.email}</td>
                    <td>{barbeiro.endereco}</td>
                    <td>{barbeiro.telefone}</td>
                    <td>
                        <ModalApp color="warning" icon="edit" edit="Barbeiro"
                            component={
                                <BarbeiroForm
                                    barbeiro={barbeiro} />
                            } />
                        <button className="btn btn-danger ml-1"
                            onClick={() => this.remove(barbeiro)}>
                            <i className="fa fa-trash"></i>
                        </button>
                    </td>
                </tr>
            )
        })
    }
    expandToggled = (row) => {this.setState({ selected: row })}
    render() {
        return (
            <div >
                {this.state.error && <p>{this.state.error}</p>}
                <Main {...headerProps} >
                    <span>
                        {/* <NavLink className="btn btn-info mb-2" to="/barbeiros/novo" >
                            Novo Barbeiro
                        </NavLink> */}
                        {/* {this.renderTable()} */}
                        {/* <FlexyTable data={this.state.list}/> */}


                        {/* {this.table()} */}
                        <Table title={this.title()}
                            columns={columns}
                            data={this.state.filteredList}
                            doubleClick={e => this.doubleClick(e)}
                            toggled={row => this.expandToggled(row)}
                            component={<BarbeiroForm barbeiro={this.state.selected}/>} />
                            
                    </span>
                </Main>

            </div>
        )
    }
}