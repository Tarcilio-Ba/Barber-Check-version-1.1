
exports.up = function (knex) {
    return knex.schema.createTable('usuarios', table => {
        table.increments('Codusuario').notNull()
        table.string('nome').notNull()
        table.string('sobrenome')
        table.string('email').notNull().unique()
        table.string('password').notNull()
        table.boolean('admin').notNull().defaultTo(false)
        table.integer('Codemp').references('Codemp')
            .inTable('empresas').notNull()
        table.timestamp('deleteAt')
    })
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('usuarios')
};
