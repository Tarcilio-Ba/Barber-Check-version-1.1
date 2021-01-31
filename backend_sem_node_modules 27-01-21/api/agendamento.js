module.exports = app => {
    const { existsOrError, notExistsOrError } = app.api.validation

    const save = (req, res) => {
        const agendamento = { ...req.body }
        if (req.params.Codagendamento) agendamento.Codagendamento = req.params.Codagendamento

        try {
            existsOrError(agendamento.data, 'Data não informada.')
            existsOrError(agendamento.hora, 'Horário não informado.')
            existsOrError(agendamento.clienteId, 'Informe o código do cliente.')
            existsOrError(agendamento.barbeariaId, 'Informe o código da barbearia.')
            existsOrError(agendamento.barbeiroId, 'Informe o código do barbeiro.')
            existsOrError(agendamento.itemId, 'Informe o código do serviço.')

        } catch (msg) {
            return res.status(400).send(msg)
        }

        if (agendamento.Codagendamento) {
            app.db('agendamentos')
                .update(agendamento)
                .where({ Codagendamento: agendamento.Codagendamento })
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else {
            app.db('agendamentos')
                .insert(agendamento)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }

    }

    const remove = async (req, res) => {
        try {
            const rowsUpdated = await app.db('agendamentos')
                .update({ deleteAt: new Date() })
                .where({ Codagendamento: req.params.Codagendamento })
            existsOrError(rowsUpdated, 'Agendamento não foi encontrado.')

            res.status(204).send()
        } catch (msg) {
            res.status(400).send(msg)
        }
    }

    const get = (req, res) => {
        app.db('agendamentos')
            /* .innerJoin('barbeiros', 'barbeiros.Codbarbeiro', 'agendamentos.barbeiroId') */
            .innerJoin('clientes', 'clientes.Codcliente', 'agendamentos.clienteId')
            .select('agendamentos.*', 'clientes.nome as cliente'/* ,'barbeiro.nome as barbeiro' */) 
            .whereNull('agendamentos.deleteAt')
            .then(agendamento => res.json(agendamento))
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
        app.db('agendamentos')
            .where({ Codagendamento: req.params.Codagendamento })
            .whereNull('deleteAt')
            .join('itens', 'itens.Coditem', '=', 'agendamentos.itemId')
            .select('agendamentos.*', 'itens.nome')
            .first()
            .then(agendamento => res.json(agendamento))
            .catch(err => res.status(500).send(err))
    }

    return { save, remove, get, getById }
}