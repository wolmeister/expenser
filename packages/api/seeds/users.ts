import Knex from 'knex';
import { hash } from 'bcryptjs';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('users').del();

  // Inserts seed entries
  await knex('users').insert([
    {
      name: 'User Test',
      email: 'user@test.com',
      password: await hash('123', 12),
    },
  ]);
}
