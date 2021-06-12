import Knex, { StaticConnectionConfig } from 'knex';
import { types } from 'pg';
import { getEnv } from './env';

// Fix pg number conversion
types.setTypeParser(types.builtins.NUMERIC, value => {
  if (!value) {
    return value;
  }
  return Number(value);
});

export const pgConnectionConfig = {
  host: getEnv('DB_HOST'),
  database: getEnv('DB_DATABASE'),
  user: getEnv('DB_USER'),
  password: getEnv('DB_PASSWORD'),
  port: parseInt(getEnv('DB_PORT') || '5432', 10),
};

export const knex = Knex({
  useNullAsDefault: true,
  client: 'pg',
  connection: pgConnectionConfig,
  pool: {
    min: parseInt(getEnv('DB_MIN_POOL') || '2', 10),
    max: parseInt(getEnv('DB_MAX_POOL') || '10', 10),
  },
  migrations: {
    tableName: 'knex_migrations',
  },
});
