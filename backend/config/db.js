const mysql = require('mysql2/promise');
require('dotenv').config();

console.log('DB config:', {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  hasPassword: process.env.DB_PASS ? true : false,
  database: process.env.DB_NAME
});

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool; 