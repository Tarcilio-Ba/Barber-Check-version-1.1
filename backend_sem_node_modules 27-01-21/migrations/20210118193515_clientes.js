
exports.up = function (knex, Promise) {
    return knex.schema.createTable('clientes', table => {
        table.increments('Codcliente').notNull()
        table.string('nome').notNull()
        table.string('cpf').notNull().unique()
        table.string('endereco')
        table.string('email').notNull().unique()
        table.string('telefone').notNull()
        table.integer('Codemp').references('Codemp')
            .inTable('empresas').notNull()
    })
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('clientes')

};
