import React, { Component } from 'react'
import BarbeiroForm from './BarbeiroForm'
import ModalApp from '../../template/Modal'
import Main from '../../template/Main'
import { NavLink } from 'react-router-dom'
import api from '../../../../services/api'
import SearchField from 'react-search-field'
import TypeChecker from 'typeco'
import Dialog from '../../template/Dialog'
import { FaRegTrashAlt } from 'react-icons/fa'


const headerProps = {
    icon: 'user',
    title: ' Barbeiros',
    subtitle: 'Lista de Barbeiros: Editar e Excluir'
}

const initialState = {
    list: [],
    emp: parseInt(localStorage.getItem('EMP')),
    error: ''
}
export default class BarbeiroList extends Component {

    constructor(props) {
        super(props)

        this.state = { ...initialState, search: 'nome', filteredList: [], searchText: '' }
        this.onBasicChange = this.onBasicChange.bind(this)
        this.onChangeFone = this.onChangeFone.bind(this)
    }

    componentDidMount = async () => {
        try {
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
            const barbeiros = resp.data.filter(b => b.Codemp === this.state.emp)
            this.setState({ list: barbeiros, filteredList: barbeiros })
        } catch (err) {
            return this.setState({ error: 'Não foi possível carregar a lista.' })
        }
    }

    novo = () => {
        return (
            <NavLink className="btn btn-info mb-2" to="/barbeiros/novo" >
                Novo Barbeiro
            </NavLink>
        )
    }

    onChange = event => {
        const busca = this.state
        busca.search = event.target.value
        this.setState({ busca })
    }

    getMatchedList = (searchText) => {
        if (TypeChecker.isEmpty(searchText)) return this.state.list;
        return this.state.list.filter(barbeiro => barbeiro.nome.toLowerCase().includes(searchText.toLowerCase()));
    }
    getMatchedFone = (searchText) => {
        if (TypeChecker.isEmpty(searchText)) return this.state.list;
        return this.state.list.filter(barbeiro => barbeiro.telefone.toLowerCase().includes(searchText.toLowerCase()));
    }
    onBasicChange(value) {
        this.setState({
            searchText: value,
            filteredList: this.getMatchedList(value),
        });
    }
    onChangeFone(value) {
        this.setState({
            searchText: value,
            filteredList: this.getMatchedFone(value),
        });
    }

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

    renderTable() {
        return (
            <div>
                <div className="col col-12 d-flex">
                    <table className="table table-hover table-borderless table-sm">
                        <thead className="table-secondary">
                            <tr className="text-center">
                                <th>Cod</th>
                                <th>Nome</th>
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
        return this.state.filteredList.map(barbeiro => {
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
                        <Dialog
                            class="ml-2"
                            color="danger"
                            size="sm"
                            openLabel={<FaRegTrashAlt />}
                            title="Excluir"
                            body={`Tem certeza que deseja excluir o barbeiro ${barbeiro.nome}?`}
                            button="Excluir"
                            onClick={() => this.remove(barbeiro)} />
                    </td>
                </tr>
            )
        })
    }

    render() {
        return (
            <div >
                {this.state.error && <p>{this.state.error}</p>}
                <Main {...headerProps} button={this.novo()}>
                    <span>
                        <div className="row">
                            <div className="input-group col-12 mb-3">
                                <div className="input-group-prepend">
                                    <label className="input-group-text" htmlFor="dropdown">
                                        Busca por
                                    </label>
                                </div>
                                <select name="search" id="dropdown" value={this.state.search}
                                    className="custom-select col-3" onChange={e => this.onChange(e)}>
                                    <option value="nome">Nome</option>
                                    <option value="telefone">Telefone</option>
                                </select>
                                {this.state.search === "nome" &&
                                    <SearchField
                                        classNames="col-8 h-auto font-weight-bold"
                                        placeholder="Digite um nome..."
                                        onChange={this.onBasicChange} />
                                }{this.state.search === "telefone" &&
                                    <SearchField
                                        classNames="col-8 h-auto font-weight-bold"
                                        placeholder="Digite um telefone..."
                                        onChange={this.onChangeFone} />
                                }
                            </div>
                        </div>

                        {this.renderTable()}
                    </span>
                </Main>

            </div>
        )
    }
}