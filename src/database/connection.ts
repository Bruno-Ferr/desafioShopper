import knex from "knex"

const { development, production } = require('../../knexfile')

export const db = knex(production)