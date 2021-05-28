module.exports = app => {
    const { existsOrError, notExistsOrError } = app.api.validation

    const save = (req, res) => {
        const venda = {
            Codvenda: req.body.Codvenda,
            clienteId: req.body.clienteId,
            barbeariaId: req.body.barbeariaId,
            barbeiroId: req.body.barbeiroId,
            data: req.body.data,
            Codemp: req.body.Codemp
        }

        if (req.params.Codvenda) venda.Codvenda = req.params.Codvenda
        try {
            existsOrError(venda.clienteId, 'Código do cliente não informado.')
            existsOrError(venda.data, 'Data não informada.')
        } catch (msg) {
            return res.status(400).send(msg)
        }
        if (venda.Codvenda) {
            app.db('vendas')
                .update(venda)
                .where({ Codvenda: venda.Codvenda })
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else {
            app.db('vendas')
                .insert(venda) 
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))

        }
    }
    const remove = async (req, res) => {
        try {
            existsOrError(req.params.Codvenda, 'Código da venda não informado.')

            const rowsUpdated = await app.db('vendas')
                .update({ deleteAt: new Date() })
                .where({ Codvenda: req.params.Codvenda })
            existsOrError(rowsUpdated, 'Venda não foi encontrada.')

            res.status(204).send()
        } catch (msg) {
            res.status(400).send(msg)
        }
    }

    const get = (req, res) => {
        app.db('vendas')
            .innerJoin('clientes', 'clientes.Codcliente', '=', 'vendas.clienteId')
            .select('vendas.*', 'clientes.nome as cliente'/* ,'barbeiro.nome as barbeiro' */)
            .whereNull('vendas.deleteAt')
            .then(vendas => res.json(vendas))
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
        app.db('vendas')
            .where({ Codvenda: req.params.Codvenda })
            .first()
            .then(venda => res.json(venda))
            .catch(err => res.status(500).send(err))
    }
    return { save, remove, get, getById }
}