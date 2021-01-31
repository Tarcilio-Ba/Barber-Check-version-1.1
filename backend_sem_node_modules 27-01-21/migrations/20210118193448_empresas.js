
exports.up = function(knex) {
    return knex.schema.createTable('empresas', table =>{
        table.increments('Codemp').notNull()
        table.string('razaoSocial').notNull()
        table.string('cnpj').notNull().unique()
        table.string('fantasia')
        table.string('endereco')
        table.string('emailResp').notNull()
        table.string('nomeResp').notNull()
        table.timestamp('deleteAt')
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('empresas')
};
