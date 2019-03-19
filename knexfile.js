// Update with your config settings.

module.exports = {

  development: {
    client: 'pg',
    connection: 'postgress://localhost/palettepicker',
    useNullAsDefault: true,
    migration: {
      directory: './db/migrations'
    },
    seeds: {
      directory: './db/seeds/dev'
    },
  }

};
