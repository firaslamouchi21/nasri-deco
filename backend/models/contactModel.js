const pool = require('../config/db');

// Create a new contact message
async function createContact({ name, email, message }) {
  const [result] = await pool.query(
    'INSERT INTO contact (name, email, message) VALUES (?, ?, ?)',
    [name, email, message]
  );
  return result.insertId;
}

// Get all contact messages (admin)
async function getAllContacts() {
  const [rows] = await pool.query('SELECT * FROM contact ORDER BY created_at DESC');
  return rows;
}

module.exports = {
  createContact,
  getAllContacts,
}; 