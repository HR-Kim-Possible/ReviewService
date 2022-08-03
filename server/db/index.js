const { Client, Pool } = require('pg');
const pgp = require('pg-promise')();
require('dotenv').config();

// pg
const credentials = {
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
};

const client = new Client(credentials);
client.connect();

const pool = new Pool(credentials);

//pgp
const cn = {
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
  max: 40,
};

const db = pgp(cn);


module.exports = {
  client: client,
  pool: pool,
  pgp: pgp,
  db: db
};


