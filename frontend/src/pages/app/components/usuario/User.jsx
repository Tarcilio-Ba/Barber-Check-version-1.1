import React, { useEffect, useState } from 'react'
import api from '../../../../services/api'
import Main from '../../template/Main'
import InputGroup from 'react-bootstrap/InputGroup'
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'
import Col from 'react-bootstrap/esm/Col'
import Button from 'react-bootstrap/esm/Button'
import { BiShow, BiHide } from 'react-icons/bi'
import { FaRegTrashAlt } from 'react-icons/fa'
import Dialog from '../../template/Dialog'


export default props => {
    const [nome, setNome] = useState('')
    const [sobrenome, setSobrenome] = useState('')
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const [confirmaSenha, setConfirmaSenha] = useState('')
    const [empresa, setEmpresa] = useState('')

    const headerProps = {
        icon: 'users',
        title: ' Usuário',
        subtitle: 'Editar Perfil'
    }

    useEffect(() => {
        const mount = async () => {
            const userId = parseInt(localStorage.getItem('UID'))
            const user = await api.get(`/usuarios/${userId}`)
            console.log(user.data)
            setNome(user.data.nome)
            setSobrenome(user.data.sobrenome)
            setEmail(user.data.email)
            setEmpresa(user.data.empresa)
            setSenha(user.data.password)
            setConfirmaSenha(user.data.password)
        }
        mount()
    }, [])


    const save = async () => {
        const usuario = {
            nome: nome,
            sobrenome: sobrenome,
            email: email,
            password: senha,
            confirmPassword: confirmaSenha
        }
        const userId = parseInt(localStorage.getItem('UID'))
        const resp = await api.put(`/usuarios/${userId}`, { ...usuario })
        /* const user = await api.get(`/usuarios/${userId}`) */
        console.log(resp.data)
        setNome(resp.data.nome)
        setSobrenome(resp.data.sobrenome)
        setSenha(resp.data.password)
        setConfirmaSenha(resp.data.password)
        window.location.reload()
    }

    return (
        <Main {...headerProps}>
            <h2 className="font-weight-light">Confira abaixo seus dados.</h2>
            <p className="lead">
                Aqui você pode fazer alterações em seu cadastro de usuário, incluindo alteração de senha.
                <br />
            </p>
            <hr />
            <Form >
                <Form.Group controlId="formHorizontalEmail">
                    <Form.Row>
                        <Form.Label column sm={2}>
                            Email*
                        </Form.Label>
                        <Col sm={10}>
                            <Form.Control plaintext readOnly defaultValue={email} />
                        </Col>
                    </Form.Row>
                </Form.Group>

                <Form.Group controlId="formHorizontalNome">
                    <Form.Row>
                        <Form.Label column sm={2}>
                            Nome
                        </Form.Label>
                        <Col sm={10}>
                            <Form.Control
                                type="text"
                                placeholder="Nome"
                                name="nome"
                                onChange={e => setNome(e.target.value)}
                                value={nome} />
                        </Col>
                    </Form.Row>
                </Form.Group>

                <Form.Group controlId="formHorizontalSobrenome">
                    <Form.Row>
                        <Form.Label column sm={2}>
                            Sobrenome
                        </Form.Label>
                        <Col sm={10}>
                            <Form.Control
                                type="text"
                                placeholder="Sobrenome"
                                name="sobrenome"
                                onChange={e => setSobrenome(e.target.value)}
                                value={sobrenome} />
                        </Col>
                    </Form.Row>
                </Form.Group>

                <Form.Group controlId="formHorizontalEmpresa">
                    <Form.Row>
                        <Form.Label column sm={2}>
                            Empresa*
                        </Form.Label>
                        <Col sm={10}>
                            <Form.Control plaintext readOnly defaultValue={empresa} />
                        </Col>
                    </Form.Row>
                </Form.Group>

                <Form.Group controlId="formHorizontalPassword">
                    <Form.Row>
                        <Form.Label column sm={2}>
                            Senha
                                </Form.Label>
                        <Col sm={10}>
                            <Form.Control
                                type="password"
                                placeholder="Nova Senha"
                                name="senha"
                                onChange={e => setSenha(e.target.value)}
                                value={senha} />
                        </Col>
                    </Form.Row>
                    <Form.Row className="mt-2">
                        <Form.Label column sm={2}>
                            Confirmação Senha
                                </Form.Label>
                        <Col sm={10}>
                            <Form.Control
                                type="password"
                                placeholder="Repita a Senha"
                                onChange={e => setConfirmaSenha(e.target.value)}
                                value={confirmaSenha} />
                        </Col>
                    </Form.Row>
                </Form.Group>

                <Form.Text id="passwordHelpBlock" muted>
                    Os dados marcados com * não podem ser alterados.
                </Form.Text>
                <hr />
                <Form.Group >
                    <Form.Row>
                        <Col sm={{ span: 10, offset: 2 }}>
                            <Dialog
                            class="ml-2"
                            color="primary"
                            openLabel="Salvar Alterações"
                            title="Salvar Alterações"
                            body={`Tem certeza que deseja alterar os dados?`}
                            button="Salvar"
                            onClick={() => save()} />
                        </Col>
                    </Form.Row>
                </Form.Group>
            </Form>

        </Main>
    )
}