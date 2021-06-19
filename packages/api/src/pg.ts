import { createPool } from 'slonik';

import { getEnv } from './env';

const host = getEnv('DB_HOST');
const database = getEnv('DB_DATABASE');
const user = getEnv('DB_USER');
const password = getEnv('DB_PASSWORD');
const port = parseInt(getEnv('DB_PORT') || '5432', 10);
const maxPoolSize = parseInt(getEnv('DB_MAX_POOL') || '10', 10);

const connectionUrl = `postgres://${user}:${password}@${host}:${port}/${database}`;

export const pgPool = createPool(connectionUrl, {
  maximumPoolSize: maxPoolSize,
  typeParsers: [
    {
      name: 'numeric',
      parse: value => {
        if (!value) {
          return value;
        }
        return Number(value);
      },
    },
  ],
});
