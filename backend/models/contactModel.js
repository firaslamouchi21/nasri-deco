const pool = require('../config/db');


async function createContact({ name, email, phone, subject, message }) {
  const [result] = await pool.query(
    'INSERT INTO messages (full_name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)',
    [name, email, phone, subject, message]
  );
  return result.insertId;
}


async function getAllMessages() {
  const [rows] = await pool.query('SELECT * FROM messages ORDER BY created_at DESC');
  return rows;
}

module.exports = {
  createContact,
  getAllMessages,
}; 