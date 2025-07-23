const pool = require('../config/db');

// Create a new contact message
async function createContact({ name, email, message }) {
  const [result] = await pool.query(
    'INSERT INTO messages (full_name, email, message) VALUES (?, ?, ?)',
    [name, email, message]
  );
  return result.insertId;
}

// Get all messages (admin)
async function getAllMessages() {
  const [rows] = await pool.query('SELECT * FROM messages ORDER BY created_at DESC');
  return rows;
}

module.exports = {
  createContact,
  getAllMessages,
}; 