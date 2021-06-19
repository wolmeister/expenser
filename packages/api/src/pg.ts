import { Socket } from 'net';
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

export const pgConnectionConfig = {
  host,
  database,
  user,
  password,
  port,
};

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

    socket.connect(port, host, () => {
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
