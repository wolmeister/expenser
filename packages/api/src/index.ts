import { Model } from 'objection';
import retry from 'async-retry';

import debug from './debug';
import { isPgRunning, knex } from './knex';
import { app } from './app';
import { getEnv } from './env';

// Setup knex
Model.knex(knex);

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
    await knex.migrate.latest();
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
