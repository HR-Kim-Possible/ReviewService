const express = require('express');
const db = require('./db');
const routes = require('./routes');
require('newrelic');
const morgan = require('morgan');

const app = express();

app.use(express.json());

app.use(morgan('tiny'));

app.use('/', routes);

const port = 8080;

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});