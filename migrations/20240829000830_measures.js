/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  return await knex.schema.createTableIfNotExists('measures', function (table) {
    table.uuid('id').primary().unique().notNullable()
    table.string('customer_id').notNullable()
    table.string('measure_type').notNullable()
    table.datetime('date').notNullable()
    table.integer('value')
    table.boolean('has_confirmed').defaultTo(false)
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  return await knex.schema.dropTableIfExists('measures');
};
