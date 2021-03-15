import express from 'express';

import debug from './debug';

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send({ hello: 'world' });
});

app.listen(3000, () => {
  debug.http('Listening on port 3000');
});
