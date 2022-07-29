const express = require('express');
const db = require('./db');
const routes = require('./routes');

const app = express();

app.use(express.json());

app.use('/a', routes);

const port = 3000;

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});