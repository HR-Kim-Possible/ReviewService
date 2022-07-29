const { Client } = require('pg');
const pgp = require('pg-promise')();

// pg
const credentials = {
  user: 'postgres',
  host: 'localhost',
  database: 'review',
  password: '111',
  port: 5432,
};

const client = new Client(credentials);
client.connect();

//pgp
const cn = {
  user: 'postgres',
  host: 'localhost',
  database: 'review',
  password: '111',
  port: 5432,
};

const db = pgp(cn);


module.exports = {
  client: client,
  pgp: pgp,
  db: db
};


