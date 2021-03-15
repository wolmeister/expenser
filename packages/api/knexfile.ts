// eslint-disable-next-line import/no-extraneous-dependencies
import 'dotenv/config';

export default {
  client: 'pg',
  connection: {
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },
  migrations: {
    tableName: 'knex_migrations',
  },
};
