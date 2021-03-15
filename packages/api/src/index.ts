import express from 'express';

import debug from './debug';

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send({ hello: 'world' });
});

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.listen(port, () => {
  debug.http(`Listening on port ${port}`);
});
