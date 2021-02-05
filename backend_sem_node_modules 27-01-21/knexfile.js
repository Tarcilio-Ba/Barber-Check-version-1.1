// Update with your config settings.

module.exports = {
  
    client: 'postgresql',
    connection: {
      host: 'dbsystem.cszgxfxjrqdm.us-east-2.rds.amazonaws.com',
      database: 'barber_check',
      user:     'barber_check_db',
      password: '81162212'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  };
