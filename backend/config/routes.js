//const admin = require('./admin')


module.exports = app => {
    app.post('/signup', app.api.usuario.save)
    app.post('/signin', app.api.auth.signin)
    app.post('/validateToken', app.api.auth.validateToken)

    app.route('/usuarios')
        .all(app.config.passport.authenticate())
        .post(app.api.usuario.save)
        .get(app.api.usuario.get)

    app.route('/usuarios/:Codusuario')
        .all(app.config.passport.authenticate())
        .put(app.api.usuario.save)
        .get(app.api.usuario.getById)
        .delete(app.api.usuario.remove)

    /*         .post(admin(app.api.usuario.save))
            .get(admin(app.api.usuario.get)) */

    app.route('/empresas')
        .all(app.config.passport.authenticate())
        .post(app.api.empresa.save)
        .get(app.api.empresa.get)

    app.route('/empresas/:Codempresa')
        .all(app.config.passport.authenticate())
        .put(app.api.empresa.save)
        .get(app.api.empresa.getById)
        .delete(app.api.empresa.remove)

    app.route('/barbearias')
        .all(app.config.passport.authenticate())
        .post(app.api.barbearia.save)
        .get(app.api.barbearia.get)

    app.route('/barbearias/:Codbarbearia')
        .all(app.config.passport.authenticate())
        .put(app.api.barbearia.save)
        .get(app.api.barbearia.getById)
        .delete(app.api.barbearia.remove)

    app.route('/barbeiros') 
        .all(app.config.passport.authenticate())
        .post(app.api.barbeiro.save)
        .get(app.api.barbeiro.get)

    app.route('/barbeiros/:Codbarbeiro')
        .all(app.config.passport.authenticate())
        .put(app.api.barbeiro.save)
        .get(app.api.barbeiro.getById)
        .delete(app.api.barbeiro.remove)

    app.route('/itens')
        .all(app.config.passport.authenticate())
        .post(app.api.item.save)
        .get(app.api.item.get)

    app.route('/itens/:Coditem')
        .all(app.config.passport.authenticate())
        .get(app.api.item.getById)
        .put(app.api.item.save)
        .delete(app.api.item.remove)

    app.route('/itemvendas')
        .all(app.config.passport.authenticate())
        .post(app.api.itemvenda.save)
        .get(app.api.itemvenda.get)

    app.route('/itemvendas/:Coditemvenda')
        .all(app.config.passport.authenticate())
        .get(app.api.itemvenda.getById)
        .put(app.api.itemvenda.save)
        .delete(app.api.itemvenda.remove)

    app.route('/clientes')
        .all(app.config.passport.authenticate())
        .post(app.api.cliente.save)
        .get(app.api.cliente.get)

    app.route('/clientes/:Codcliente')
        .all(app.config.passport.authenticate())
        .get(app.api.cliente.getById)
        .put(app.api.cliente.save)
        .delete(app.api.cliente.remove)

    app.route('/vendas')
        .all(app.config.passport.authenticate())
        .post(app.api.venda.save)
        .get(app.api.venda.get)

    app.route('/vendas/:Codvenda')
        .all(app.config.passport.authenticate())
        .get(app.api.venda.getById)
        .put(app.api.venda.save)
        .delete(app.api.venda.remove)

    app.route('/agendamentos')
        .all(app.config.passport.authenticate())
        .post(app.api.agendamento.save)
        .get(app.api.agendamento.get)

    app.route('/agendamentos/:Codagendamento')
        .all(app.config.passport.authenticate())
        .get(app.api.agendamento.getById)
        .put(app.api.agendamento.save)
        .delete(app.api.agendamento.remove)

    app.route('/stats')
        .all(app.config.passport.authenticate())
        .get(app.api.stat.get)
}
