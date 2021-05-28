
exports.up = function(knex, Promise) {
    return knex.schema.createTable('barbeiros', table =>{
        table.increments('Codbarbeiro').notNull()
        table.string('nome').notNull()
        table.string('endereco')
        table.string('email').notNull().unique()
        table.string('telefone').notNull()
        table.integer('Codemp').references('Codemp')
              .inTable('empresas').notNull()
    })
  };
  
  exports.down = function(knex, Promise) {
      return knex.schema.dropTable('barbeiros')
    
  };
