const bcrypt = require('bcrypt')

module.exports = app => {
    const { existsOrError, notExistsOrError } = app.api.validation

    const save = async (req, res) => {
        const empresa = { ...req.body }
        if (req.params.Codemp) empresa.Codemp = req.params.Codemp

        /* if (!req.originalUrl.startsWith('/empresas')) empresa.admin = false
        if (!req.empresa || !req.empresa.admin) empresa.admin = false */

        try {
            existsOrError(empresa.razaoSocial, 'Razão Social nome não informado.')
            existsOrError(empresa.cnpj, 'CNPJ não informado.')
            existsOrError(empresa.emailResp, 'E-mail do responsável não informado.')
            existsOrError(empresa.nomeResp, 'Confirmação de senha inválida')
            /* existsOrError(empresa.password, empresa.confirmPassword, 'Senha inválidas.') */


            const empresaFromDB = await app.db('empresas')
                .where({ cnpj: empresa.cnpj }).first()
            if (!empresa.Codemp) {
                notExistsOrError(empresaFromDB, 'Empresa já cadastrada.')
            }

        } catch (msg) {
            return res.status(400).send(msg)
        }
 
        if (empresa.Codemp) {
            app.db('empresas')
                .update(empresa)
                .where({ Codemp: empresa.Codemp })
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))

        } else {
            app.db('empresas')
                .insert(empresa)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }

    const remove = async (req, res) => {
        try {
            const rowsUpdated = await app.db('empresas')
                .update({ deleteAt: new Date() })
                .where({ Codemp: req.params.Codemp })
            existsOrError(rowsUpdated, 'Empresa não foi encontrada.')

            res.status(204).send()
        } catch (msg) {
            res.status(500).send(msg)
        }
    }

    const get = (req, res) => {
        app.db('empresas')
            .then(empresas => res.json(empresas))
            .catch(err => res.status(500).send(err))

    }
    const getById = (req, res) => {
        app.db('empresas')
            .where({ Codemp: req.params.Codemp })
            .first()
            .then(empresa => res.json(empresa))
            .catch(err => res.status(500).send(err))
    }
    return { save, remove, get, getById }

}