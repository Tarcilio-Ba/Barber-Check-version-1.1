import React from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import "./pages/app/App.css";
import 'bootstrap/dist/css/bootstrap.min.css'
import 'font-awesome/css/font-awesome.min.css' 

import { isAuthenticated } from "./services/auth";

import SignIn from "./pages/signin/SignIn";
import SignUp from './pages/SignUp/index' 
import Home from "./pages/app/components/home/Home"
/* import Dash from "./pages/app/components/home/Dash" */
import AgendamentoList from './pages/app/components/agendamento/AgendamentoList'
import Agendamento from './pages/app/components/agendamento/Agendamento'
import BarbeariaList from './pages/app/components/barbearia/BarbeariaList'
import Barbearia from './pages/app/components/barbearia/Barbearia'
import BarbeiroList from './pages/app/components/barbeiro/BarbeiroList'
import Barbeiro from './pages/app/components/barbeiro/Barbeiro'
import ClienteList from './pages/app/components/clientes/ClienteList'
import Cliente from './pages/app/components/clientes/Cliente'
import Empresa from './pages/app/components/empresa/Empresa.jsx'
import ItemList from './pages/app/components/itens/ItemList'
import Item from './pages/app/components/itens/Item'
import Vendas from './pages/app/components/vendas/Vendas'
import CancelaVenda from "./pages/app/components/vendas/CancelaVenda";
import User from './pages/app/components/usuario/User'

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      isAuthenticated() ? (
        <Component {...props} />
      ) : (
        <Redirect to={{ pathname: "/", state: { from: props.location } }} />
      )
    }
  />
);

const Routes = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={SignIn} />
      <Route path="/signup" component={SignUp} />
      <PrivateRoute path="/home" component={ Home } />
      <PrivateRoute exact path="/barbeiros" component={ BarbeiroList } />
      <PrivateRoute exact path="/barbeiros/novo" component={ Barbeiro} />
      <PrivateRoute exact path="/barbearias" component={ BarbeariaList } />
      <PrivateRoute exact path="/barbearias/novo" component={ Barbearia} />
      <PrivateRoute exact path="/clientes" component={ ClienteList } />
      <PrivateRoute exact path="/clientes/novo" component={ Cliente} />
      <PrivateRoute exact path="/itens" component={ ItemList } />
      <PrivateRoute exact path="/itens/novo" component={ Item} />
      <PrivateRoute exact path="/agendamentos" component={ AgendamentoList } />
      <PrivateRoute exact path="/agendamentos/novo" component={ Agendamento } />
      <PrivateRoute exact path="/vendas" component={ Vendas } />
      <PrivateRoute exact path="/vendas/cancelar" component={ CancelaVenda } />
      <PrivateRoute exact path="/empresas" component={ Empresa } />
      <PrivateRoute exact path="/user" component={ User } />
      <Route path="*" component={() => <h1>Page not found</h1>} />
    </Switch>
  </BrowserRouter>
);

export default Routes;