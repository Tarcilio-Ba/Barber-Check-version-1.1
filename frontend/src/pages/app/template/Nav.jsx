import React from 'react'
import NavItem from './itens/NavItem'
import './Nav.css'
import Logout from '../../logout/Logout'

import Logo from '../../../assets/barber_check2.png'

const user = localStorage.getItem('USUARIO')

export default props =>

    <nav className="navbar navbar-inverse bg-dark">
        <div className="container-fluid">
            <div className="navbar-header">
                <a href="/home" className="navbar-brand">
                    <img src={Logo} alt="barber_check" className="logo" />
                </a>
            </div>
            <NavItem path="/home" icon="home" label="Home" />
            <NavItem path="/agendamentos/novo" icon="calendar" label=" Agendamento" />
            <NavItem path="/barbearias" icon="cut" label=" Barbearias" />
            <NavItem path="/barbeiros" icon="user" label=" Barbeiros" />
            <NavItem path="/clientes" icon="users" label=" Clientes" />
            <NavItem path="/itens" icon="archive" label=" Itens" />
            <NavItem path="/vendas" icon="money" label=" Vendas" />
            {user === 'true' && <NavItem path="/empresas" icon="building" label=" Empresas" />}
            <Logout />
        </div>
    </nav>

