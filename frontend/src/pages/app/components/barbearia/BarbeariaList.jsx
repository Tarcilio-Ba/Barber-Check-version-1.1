import React, { Component } from 'react'
import api from '../../../../services/api'
import BarbeariaForm from './BarbeariaForm'
import ModalApp from '../../template/Modal'
import Main from '../../template/Main'
import { NavLink } from 'react-router-dom'
import TypeChecker from 'typeco'
import SearchComponent from '../../template/SearchComponent'
import Dialog from '../../template/Dialog'
import { FaRegTrashAlt } from 'react-icons/fa'

const headerProps = {
    icon: 'cut',
    title: ' Barbearias',
    subtitle: 'Lista de Barbeiros: Editar e Excluir',
}

const initialState = {
    list: [],
    emp: parseInt(localStorage.getItem('EMP')),
    error: ''
}
export default class BarbeariaList extends Component {

    constructor(props) {
        super(props)

        this.state = { ...initialState, filteredList: [], searchText: '' }
        this.onBasicChange = this.onBasicChange.bind(this)
    }

    novo = () => {
        return (
            <NavLink className="btn btn-info mb-2" to="/barbearias/novo" >
                Nova Barbearia
            </NavLink>
        )
    }
    
    componentDidMount = async () => {
        try {
            const resp = await api.get('/barbearias')
            resp.data.sort((a, b) => {
                if (a.nome > b.nome) {
                    return 1;
                }
                if (a.nome < b.nome) {
                    return -1;
                }
                return 0;
            })
            console.log(resp.data)
            const barbearias = resp.data.filter(e => e.Codemp === this.state.emp)
            this.setState({ list: barbearias, filteredList: barbearias })
        } catch (err) {
            return this.setState({ error: 'Não foi possível carregar a lista.' })
        }
    }

    remove = async barbearia => {
        try {
            api.delete(`/barbearias/${barbearia.Codbarbearia}`)
            const resp = await api.get('/barbearias')
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

    getMatchedList = (searchText) => {
        if (TypeChecker.isEmpty(searchText)) return this.state.list;
        return this.state.list.filter(item => item.nome.toLowerCase().includes(searchText.toLowerCase()));
    }
    onBasicChange(value) {
        this.setState({
            searchText: value,
            filteredList: this.getMatchedList(value),
        });
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
        return this.state.filteredList.map(barbearia => {
            return (
                <tr key={barbearia.Codbarbearia} className='text-center'>
                    <td>{barbearia.Codbarbearia}</td>
                    <td>{barbearia.nome}</td>
                    <td>{barbearia.email}</td>
                    <td>{barbearia.endereco}</td>
                    <td>{barbearia.telefone}</td>
                    <td>
                        <ModalApp color="warning" icon="edit" edit="Barbearia"
                            component={
                                <BarbeariaForm
                                    barbearia={barbearia} />
                            } />
                        <Dialog
                            class="ml-2"
                            color="danger"
                            size="sm"
                            openLabel={<FaRegTrashAlt />}
                            title="Excluir"
                            body={`Tem certeza que deseja excluir ${barbearia.nome}?`}
                            button="Excluir"
                            onClick={() => this.remove(barbearia)} />
                    </td>
                </tr>
            )
        })
    }

    render() {
        return (
            <div >
                <Main {...headerProps}  button={this.novo()} >
                    <span>
                        <SearchComponent
                            label="Busca por Nome"
                            placeholder="Digite o nome..."
                            onChange={this.onBasicChange} />
                        {this.state.error && <p className="text-danger">{this.state.error}</p>}
                        {this.renderTable()}
                    </span>
                </Main>

            </div>
        )
    }
}

