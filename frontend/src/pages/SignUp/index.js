import React, { Component } from "react"
import { withRouter } from "react-router-dom"

import api from '../../services/api'

import Logo from "../../assets/barber_check2.png"

import { Form, Container } from "./styles"
import Dialog from "../app/template/Dialog"

class SignUp extends Component {
    state = {
        nome: "",
        sobrenome: "",
        email: "",
        password: "",
        confirmPassword: "",
        error: ""
    }

    handleSignUp = async e => {
        e.preventDefault()
        const { nome, sobrenome, email, password, confirmPassword } = this.state
        if (!nome || !sobrenome || !email || !password || !confirmPassword) {
            this.setState({ error: "Preencha todos os dados para se cadastrar!" })
        } else {
            try {
                await api.post("/signup", { nome, sobrenome, email, password, confirmPassword })
                this.props.history.push("/")
            } catch (err) {
                console.log(err)
                this.setState({ error: "Ocorreu um erro ao registrar sua conta." })
            }
        }
    }

    render() {
        return (
            <Container>
                <Form onSubmit={this.handleSignUp}>
                    <img src={Logo} alt="barber_check logo" />
                    {this.state.error && <p>{this.state.error}</p>}
                    <input
                        type="text"
                        placeholder="Nome..."
                        onChange={e => this.setState({ nome: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Sobrenome..."
                        onChange={e => this.setState({ sobrenome: e.target.value })}
                    />
                    <input
                        type="email"
                        placeholder="Endereço de e-mail"
                        onChange={e => this.setState({ email: e.target.value })}
                    />
                    <input
                        type="password"
                        placeholder="Senha"
                        onChange={e => this.setState({ password: e.target.value })}
                    />
                    <input
                        type="password"
                        placeholder="Confirmação de Senha"
                        onChange={e => this.setState({ confirmPassword: e.target.value })}
                    />
                    <div>
                        {/* <button type="submit">Cadastrar</button> */}
                        <Dialog onClick={this.handleSignUp} 
                                openLabel="Cadastrar"
                                title="Cadastar"
                                body="Cadastro realizado com sucesso!"
                                button="OK" />
                        <a href="/" type="button">Login</a>
                    </div>

                    {/* <Link to="/">Fazer login</Link> */}
                </Form>
            </Container>
        )
    }
}

export default withRouter(SignUp)