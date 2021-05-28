import React, { Component } from 'react'
import api from '../../../../services/api'
import ItemForm from './ItemForm'
import ModalApp from '../../template/Modal'
import Main from '../../template/Main'
import { NavLink } from 'react-router-dom'
import Dialog from '../../template/Dialog'
import { FaRegTrashAlt } from 'react-icons/fa'
import SearchField from 'react-search-field'
import TypeChecker from 'typeco'

const headerProps = {
    icon: 'archive',
    title: ' Itens',
    subtitle: 'Lista de Itens: Editar e Excluir'
}

const initialState = {
    list: [],
    emp: parseInt(localStorage.getItem('EMP')),
    error: ''
}
export default class ItemList extends Component {

    constructor(props) {
        super(props)

        this.state = { ...initialState, search: 'nome', filteredList: [], searchText: '' }

        this.onBasicChange = this.onBasicChange.bind(this)
        this.onChangeTipo = this.onChangeTipo.bind(this)
        this.onChangeCod = this.onChangeCod.bind(this)
    }

    componentDidMount = async () => {
        try {
            const resp = await api.get('/itens')
            resp.data.sort((a, b) => {
                if (a.nome > b.nome) {
                    return 1;
                }
                if (a.nome < b.nome) {
                    return -1;
                }
                return 0;
            })
            const itens = resp.data.filter(i => i.Codemp === this.state.emp)
            this.setState({ list: itens, filteredList: itens })
        } catch (err) {
            return this.setState({ error: 'Não foi possível carregar a lista.' })
        }
    }

    onChange = event => {
        const busca = this.state
        busca.search = event.target.value
        this.setState({ busca })
    }

    getMatchedList = (searchText) => {
        if (TypeChecker.isEmpty(searchText)) return this.state.list;
        return this.state.list.filter(c => c.nome.toLowerCase().includes(searchText.toLowerCase()));
    }
    getMatchedTipo = (searchText) => {
        if (TypeChecker.isEmpty(searchText)) return this.state.list;
        return this.state.list.filter(c => c.tipo.toLowerCase().includes(searchText.toLowerCase()));
    }
    getMatchedCod = (searchText) => {
        if (TypeChecker.isEmpty(searchText)) return this.state.list;
        return this.state.list.filter(c => c.Coditem.toString().toLowerCase().includes(searchText.toLowerCase()));
    }
    onBasicChange(value) {
        this.setState({
            searchText: value,
            filteredList: this.getMatchedList(value),
        });
    }
    onChangeTipo(value) {
        this.setState({
            searchText: value,
            filteredList: this.getMatchedTipo(value),
        });
    }
    onChangeCod(value) {
        this.setState({
            searchText: value,
            filteredList: this.getMatchedCod(value),
        });
    }

    remove = async item => {
        try {
            api.delete(`/itens/${item.Coditem}`)
            const resp = await api.get('/itens')
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
                                <th>Tipo</th>
                                <th>Preço</th>
                                <th>Quantidade</th>
                                <th>Editar | Excluir</th>
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
        return this.state.filteredList.map(item => {
            return (
                <tr key={item.Coditem} className="text-center">
                    <td>{item.Coditem}</td>
                    <td>{item.nome}</td>
                    <td>{item.tipo}</td>
                    <td>{item.preco.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</td>
                    <td>{item.tipo === 'P' ? item.quantidade : '--'}</td>
                    <td>
                        <ModalApp color="warning" icon="edit" edit="Item"
                            component={
                                <ItemForm
                                    item={item} />
                            } />
                        <Dialog
                            class="ml-2"
                            color="danger"
                            size="sm"
                            openLabel={<FaRegTrashAlt />}
                            title="Excluir"
                            body={`Tem certeza que deseja excluir o item ${item.nome}?`}
                            button="Excluir"
                            onClick={() => this.remove(item)} />
                    </td>
                </tr>
            )
        })
    }

    novo = () => <NavLink className="btn btn-info mb-2" to="/itens/novo">Novo Item</NavLink>

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
                                    <option value="tipo">Tipo (P ou S)</option>
                                    <option value="cod">Código</option>
                                </select>
                                {this.state.search === "nome" &&
                                    <SearchField
                                        classNames="col-8 h-auto font-weight-bold"
                                        placeholder="Digite um nome..."
                                        onChange={this.onBasicChange} />
                                }
                                {this.state.search === "tipo" &&
                                    <SearchField
                                        classNames="col-8 h-auto font-weight-bold"
                                        placeholder="Digite o tipo de item P ou S"
                                        onChange={this.onChangeTipo} />
                                }
                                {this.state.search === "cod" &&
                                    <SearchField
                                        classNames="col-8 h-auto font-weight-bold"
                                        placeholder="Digite um código de item..."
                                        onChange={this.onChangeCod} />
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