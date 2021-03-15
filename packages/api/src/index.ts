// import { Model } from 'objection';

import debug from './debug';
import { knex } from './knex';
import { app } from './app';

// Setup knex
// Model.knex(knex);

// Init express
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.listen(port, () => {
  debug.http(`Listening on port ${port}`);
});
