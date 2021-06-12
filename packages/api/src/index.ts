import { Model } from 'objection';

import debug from './debug';
import { knex } from './knex';
import { app } from './app';
import { getEnv } from './env';

// Setup knex
Model.knex(knex);

// Init express
const port = parseInt(getEnv('PORT') || '3000', 10);

app.listen(port, () => {
  debug.http(`Listening on port ${port}`);
});
