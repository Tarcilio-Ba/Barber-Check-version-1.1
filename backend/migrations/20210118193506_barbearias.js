
exports.up = function (knex, Promise) {
    return knex.schema.createTable('barbearias', table => {
      table.increments('Codbarbearia').notNull()
      table.string('nome').notNull()
      table.string('endereco').notNull()
      table.string('email').notNull().unique()
      table.string('telefone').notNull()
      table.timestamp('deleteAt')
      table.integer('Codemp').references('Codemp')
        .inTable('empresas').notNull()
    })
  };
  
  exports.down = function (knex, Promise) {
    return knex.schema.dropTable('barbearias')
  };
