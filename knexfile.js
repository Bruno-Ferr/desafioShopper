require('dotenv').config();
const fs = require('fs');
const path = require('path');

const baseDir = path.resolve(__dirname, '..'); 
/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: './mydb.sqlite',
    },
    migrations: {
      tableName: 'knex_migrations'
    },
    useNullAsDefault: true
  },

  production: {
    client: 'mysql2',
    connection: {
      host:     process.env.DB_HOST,
      database: process.env.DB_DATABASE,
      user:     process.env.DB_USERNAME,
      password: process.env.DB_PWD,
      port:     process.env.DB_PORT,
    },
    pool: {
      min: 0
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};