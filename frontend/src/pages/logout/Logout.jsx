import React, { Component } from 'react'
import { logout } from '../../services/auth'
import { withRouter } from 'react-router'
import Dropdown from 'react-bootstrap/Dropdown'
import { FiUsers } from 'react-icons/fi'
import { FaEdit } from 'react-icons/fa'
import { CgProfile } from 'react-icons/cg'
import Dialog from '../app/template/Dialog'
import api from '../../services/api'
import { NavLink } from 'react-router-dom'

const initialState = {
    email: '',
    nome: ''
}
class Logout extends Component {
    state = {
        ...initialState
    }
    sair() {
        this.setState({ ...initialState })
        logout()
        this.props.history.push('/')
    }

    componentDidMount = async () => {
        const resp = await api.get('/usuarios')
        const email = localStorage.getItem('EMAIL')
        const user = resp.data.filter(u => u.email === email)
        this.setState({ email: user[0].email, nome: user[0].nome })
    }

    render() {
        return (
            <span>
                <Dropdown>
                    <Dropdown.Toggle variant="secondary"/*  size="lg" */ id="dropdown-basic">
                        <CgProfile />
                    </Dropdown.Toggle>

                    <Dropdown.Menu className="text-center">
                        <Dropdown.ItemText>
                            <FiUsers /> {this.state.nome}
                        </Dropdown.ItemText>
                        <Dropdown.Divider />
                        <Dropdown.Item>
                            <NavLink to="/user" className="text-dark">
                                <FaEdit/> Editar Perfil
                            </NavLink>
                        </Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item >{
                            <Dialog onClick={() => this.sair()}
                                block="block"
                                class="dropdown-item"
                                openLabel="Sair"
                                title="Sair"
                                body="Deseja realmente sair?"
                                button="Sair" />
                        }</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </span>
        )
    }

}

export default withRouter(Logout)

