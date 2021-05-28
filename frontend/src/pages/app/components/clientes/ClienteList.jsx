import React, { Component } from 'react'
import api from '../../../../services/api'
import ClienteForm from './ClienteForm'
import ModalApp from '../../template/Modal'
import Main from '../../template/Main'
import { NavLink } from 'react-router-dom'
import Dialog from '../../template/Dialog'
import { FaRegTrashAlt } from 'react-icons/fa'
import SearchField from 'react-search-field'
import TypeChecker from 'typeco'


const headerProps = {
    icon: 'user',
    title: ' Clientes',
    subtitle: 'Lista de Clientes: Editar e Excluir'
}

const initialState = {
    list: [],
    emp: parseInt(localStorage.getItem('EMP')),
    error: ''
}
export default class ClienteList extends Component {

    constructor(props) {
        super(props)

        this.state = { ...initialState, search: 'nome', filteredList: [], searchText: '' }

        this.onBasicChange = this.onBasicChange.bind(this)
        this.onChangeFone = this.onChangeFone.bind(this)
        this.onChangeCPF = this.onChangeCPF.bind(this)

    }

    onChange = event => {
        const busca = this.state
        busca.search = event.target.value
        this.setState({ busca })
    }
    
    componentDidMount = async () => {
        try {
            const resp = await api.get('/clientes')
            resp.data.sort((a, b) => {
                if (a.nome > b.nome) {
                    return 1;
                }
                if (a.nome < b.nome) {
                    return -1;
                }
                return 0;
            })
            const clientes = resp.data.filter(c => c.Codemp === this.state.emp)
            this.setState({ list: clientes, filteredList: clientes })
        } catch (err) {
            return this.setState({ error: 'Não foi possível carregar a lista.' })
        }
    }

    getMatchedList = (searchText) => {
        if (TypeChecker.isEmpty(searchText)) return this.state.list;
        return this.state.list.filter(c => c.nome.toLowerCase().includes(searchText.toLowerCase()));
    }
    getMatchedFone = (searchText) => {
        if (TypeChecker.isEmpty(searchText)) return this.state.list;
        return this.state.list.filter(c => c.telefone.toLowerCase().includes(searchText.toLowerCase()));
    }
    getMatchedCpf = (searchText) => {
        if (TypeChecker.isEmpty(searchText)) return this.state.list;
        return this.state.list.filter(c => c.cpf.toLowerCase().includes(searchText.toLowerCase()));
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
    onChangeCPF(value) {
        this.setState({
            searchText: value,
            filteredList: this.getMatchedCpf(value),
        });
    }

    remove = async cliente => {
        try {
            api.delete(`/clientes/${cliente.Codcliente}`)
            const resp = await api.get('/clientes')
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
                            <tr className='text-center'>
                                <th>Cod</th>
                                <th>Nome</th>
                                <th>Cpf</th>
                                <th>E-mail</th>
                                <th>Endereço</th>
                                <th>Telefone</th>
                                <th>Açoes</th>
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
        return this.state.filteredList.map(cliente => {
            return (
                <tr key={cliente.Codcliente} className='text-center'>
                    <td>{cliente.Codcliente}</td>
                    <td>{cliente.nome}</td>
                    <td>{cliente.cpf}</td>
                    <td>{cliente.email}</td>
                    <td>{cliente.endereco}</td>
                    <td>{cliente.telefone}</td>
                    <td>
                        <ModalApp color="warning" icon="edit" edit="Cliente"
                            component={
                                <ClienteForm
                                    cliente={cliente} />
                            } />
                        <Dialog 
                            class="ml-2"
                            color="danger"
                            size="sm"
                            openLabel={<FaRegTrashAlt />}
                            title="Excluir"
                            body={`Tem certeza que deseja excluir o cliente ${cliente.nome}?`}
                            button="Excluir" 
                            onClick={() => this.remove(cliente)}/>
                    </td>
                </tr>
            )
        })
    }

    novo = () => <NavLink className="btn btn-info mb-2" to="/clientes/novo">Novo Cliente</NavLink>

    render() {
        return (
            <div >
                <Main {...headerProps} button={this.novo()}>
                    <span>
                        {this.state.error && <p className="text-danger">{this.state.error}</p>}
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
                                    <option value="cpf">CPF</option>
                                </select>
                                {this.state.search === "nome" &&
                                    <SearchField
                                        classNames="col-8 h-auto font-weight-bold"
                                        placeholder="Digite um nome..."
                                        onChange={this.onBasicChange} />
                                }
                                {this.state.search === "telefone" &&
                                    <SearchField
                                        classNames="col-8 h-auto font-weight-bold"
                                        placeholder="Digite um telefone..."
                                        onChange={this.onChangeFone} />
                                }
                                {this.state.search === "cpf" &&
                                    <SearchField
                                        classNames="col-8 h-auto font-weight-bold"
                                        placeholder="Digite um CPF..."
                                        onChange={this.onChangeCPF} />
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