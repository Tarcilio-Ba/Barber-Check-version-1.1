module.exports = app => {
    const {existsOrError, notExistsOrError} = app.api.validation

    const save = (req, res) => {
        const itemvenda = {...req.body}

    if(req.params.Coditemvenda) itemvenda.Coditemvenda = req.params.Coditemvenda
    
    try{
        existsOrError(itemvenda.itemId, 'Código do item não informado.')
        existsOrError(itemvenda.vendaId, 'Código da venda não informado.')
        existsOrError(itemvenda.qtvenda, 'Quantidade não informado.')
    } catch(msg){
        return res.status(400).send(msg)
    }

    if(itemvenda.Coditemvenda){
        app.db('itemvendas')
            .update(itemvenda)
            .where({Coditemvenda: itemvenda.Coditemvenda})
            .then(_=> res.status(204).send())
            .catch(err => res.status(500).send(err))
    }else{
        app.db('itemvendas')
            .insert(itemvenda)
            .then(_=> res.status(204).send())
            .catch(err => res.status(500).send(err))
    }

}
    const remove = async (req, res) => {
        
        try {
            const rowsDeleted = await app.db('itemvendas')
                .where({Coditemvenda: req.params.Coditemvenda}).del()
            existsOrError(rowsDeleted, 'Código não encontrado.')

            res.status(204).send()
        }catch(msg){
            res.status(400).send(msg)
        }
    }

    const get = (req, res) => {
        app.db('itemvendas')
            .join('itens', 'itens.Coditem', '=', 'itemvendas.itemId')
            .select('itemvendas.*', 'itens.nome as item', 'itens.preco as preco')
            .then(itemvendas => res.json(itemvendas))
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res ) => {
        app.db('itemvendas')
            .where({Coditemvenda: req.params.Coditemvenda})
            .join('itens', 'itens.Coditem', '=', 'itemvendas.itemId')
            .select('itemvendas.*', 'itens.nome as item', 'itens.preco as preco')
            .then(itemvenda => res.json(itemvenda))
            .catch(err => res.status(500).send(err))
    }
    return {save, remove, get, getById}
}