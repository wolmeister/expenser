import { join } from 'path';
import { Model } from 'objection';
import { migrate } from 'postgres-migrations';

import debug from './debug';
import { knex, pgConnectionConfig } from './knex';
import { app } from './app';
import { getEnv } from './env';

// Setup knex
Model.knex(knex);

const start = async () => {
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
