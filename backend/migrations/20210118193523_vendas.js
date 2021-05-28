
exports.up = function (knex, Promise) {
    return knex.schema.createTable('vendas', table => {
        table.increments('Codvenda').notNull()
        table.date('data').notNull()
        table.integer('clienteId').references('Codcliente')
            .inTable('clientes').notNull()
        table.integer('barbeariaId').references('Codbarbearia')
            .inTable('barbearias')
        table.integer('barbeiroId').references('Codbarbeiro')
            .inTable('barbeiros')
        table.integer('Codemp').references('Codemp')
            .inTable('empresas').notNull()
        table.timestamp('deleteAt')

    })
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('vendas')
};
