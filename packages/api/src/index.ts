import { join } from 'path';
import retry from 'async-retry';
import { migrate } from 'postgres-migrations';

import debug from './debug';
import { app } from './app';
import { getEnv } from './env';
import { isPgRunning, pgConnectionConfig } from './pg';

const start = async () => {
  // Wait for the postrgres to be running
  try {
    await retry(
      async () => {
        const pgIsRunning = await isPgRunning();
        if (!pgIsRunning) {
          throw new Error('Postgres is not running');
        }
      },
      { retries: 5 }
    );
  } catch (error) {
    debug.error(error);
    process.exit(-1);
  }

  // Execute migrations
  try {
    await migrate(pgConnectionConfig, join(__dirname, '..', 'migrations'));
  } catch (error) {
    debug.error(error);
    process.exit(-1);
  }

  // Init express
  const port = parseInt(getEnv('PORT') || '3000', 10);

  app.listen(port, () => {
    debug.http(`Listening on port ${port}`);
  });
};

start();
