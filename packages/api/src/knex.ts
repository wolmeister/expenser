import Knex from 'knex';
import { types } from 'pg';

// Fix pg number conversion
types.setTypeParser(types.builtins.NUMERIC, value => {
  if (!value) {
    return value;
  }
  return Number(value);
});

export const knex = Knex({
  useNullAsDefault: true,
  client: 'pg',
  connection: {
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },
  pool: {
    min: process.env.DB_MIN_POOL ? parseInt(process.env.DB_MIN_POOL, 10) : 2,
    max: process.env.DB_MAX_POOL ? parseInt(process.env.DB_MAX_POOL, 10) : 10,
  },
  migrations: {
    tableName: 'knex_migrations',
  },
});
