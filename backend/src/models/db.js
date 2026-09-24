// src/models/db.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// We now export the pool itself, so our test can close it
module.exports = {
  query: (text, params) => pool.query(text, params),
  pool: pool 
};