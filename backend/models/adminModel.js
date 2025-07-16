const pool = require('../config/db');

// Get admin by username
async function getAdminByUsername(username) {
  const [rows] = await pool.query('SELECT * FROM admin WHERE username = ?', [username]);
  return rows[0];
}

// Create a new admin (for setup, not exposed in routes)
async function createAdmin(username, password_hash) {
  const [result] = await pool.query('INSERT INTO admin (username, password_hash) VALUES (?, ?)', [username, password_hash]);
  return result.insertId;
}

// Optionally: List all admins
async function getAllAdmins() {
  const [rows] = await pool.query('SELECT id, username FROM admin');
  return rows;
}

module.exports = {
  getAdminByUsername,
  createAdmin,
  getAllAdmins,
}; 