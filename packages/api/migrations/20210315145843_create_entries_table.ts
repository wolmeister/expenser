import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('entries', table => {
    table.increments('id').primary().unsigned();
    table.integer('userId').unsigned().references('id').inTable('users');
    table.decimal('amount', 13, 2).notNullable();
    table.text('category').notNullable();
    table.text('description');
    table.date('date').notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('entries');
}
