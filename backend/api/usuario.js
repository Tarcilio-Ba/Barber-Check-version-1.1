const bcrypt = require('bcrypt')

module.exports = app => {
    const { existsOrError, notExistsOrError } = app.api.validation

    const encryptPassword = password => {
        const salt = bcrypt.genSaltSync(10)
        return bcrypt.hashSync(password, salt)
    }

    const save = async (req, res) => {
        const usuario = { ...req.body }
        if (req.params.Codusuario) usuario.Codusuario = req.params.Codusuario

        /* if (!req.originalUrl.startsWith('/usuarios')) usuario.admin = false
        if (!req.usuario || !req.usuario.admin) usuario.admin = false */

        try {
            existsOrError(usuario.nome, 'Primeiro nome não informado.')
            existsOrError(usuario.sobrenome, 'Sobrenome não informado.')
            existsOrError(usuario.email, 'E-mail não informado.')
            existsOrError(usuario.password, 'Senha não informada')
            existsOrError(usuario.confirmPassword, 'Confirmação de senha inválida')
            existsOrError(usuario.password, usuario.confirmPassword, 'Senha inválidas.')


            const usuarioFromDB = await app.db('usuarios')
                .where({ email: usuario.email }).first()
            if (!usuario.Codusuario) {
                notExistsOrError(usuarioFromDB, 'Usuário já cadastrado.')
            }

        } catch (msg) {
            return res.status(400).send(msg)
        }
        usuario.password = encryptPassword(usuario.password)
        delete usuario.confirmPassword

        if (usuario.Codusuario) {
            app.db('usuarios')
                .update(usuario)
                .where({ Codusuario: usuario.Codusuario })
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))

        } else {
            app.db('usuarios')
                .insert(usuario)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }

    const remove = async (req, res) => {
        try {
            const rowsUpdated = await app.db('usuarios')
                .update({ deleteAt: new Date() })
                .where({ Codusuario: req.params.Codusuario })
            existsOrError(rowsUpdated, 'Usuário não foi encontrado.')

            res.status(204).send()
        } catch (msg) {
            res.status(500).send(msg)
        }
    }

    const get = (req, res) => {
        app.db('usuarios')
            .then(usuarios => res.json(usuarios))
            .catch(err => res.status(500).send(err))

    }
    const getById = (req, res) => {
        app.db('usuarios')
            .join('empresas', 'empresas.Codemp', '=', 'usuarios.Codemp')
            .select('usuarios.*', 'empresas.razaoSocial as empresa')
            .where({ Codusuario: req.params.Codusuario })
            .first()
            .then(usuario => res.json(usuario))
            .catch(err => res.status(500).send(err))
    }
    return { save, remove, get, getById }

}