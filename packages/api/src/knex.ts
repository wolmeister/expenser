import { Socket } from 'net';
import Knex from 'knex';
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

export async function isPgRunning(): Promise<boolean> {
  const promise = new Promise((resolve, reject) => {
    const socket = new Socket();
    const onError = () => {
      socket.destroy();
      reject();
    };

    socket.setTimeout(1000);
    socket.once('error', onError);
    socket.once('timeout', onError);

    socket.connect(pgConnectionConfig.port, pgConnectionConfig.host, () => {
      socket.end();
      resolve(null);
    });
  });

  try {
    await promise;
    return true;
  } catch {
    return false;
  }
}
