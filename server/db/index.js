const { Client, Pool } = require('pg');
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

const pool = new Pool(credentials);

//pgp
const cn = {
  user: 'postgres',
  host: 'localhost',
  database: 'review',
  password: '111',
  max: 40,
  port: 5432,
};

const db = pgp(cn);


module.exports = {
  client: client,
  pool: pool,
  pgp: pgp,
  db: db
};


