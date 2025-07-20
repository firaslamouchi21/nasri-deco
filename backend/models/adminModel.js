const pool = require('../config/db');

exports.findByUsername = async (username) => {
  const [rows] = await pool.query('SELECT * FROM admin WHERE username = ?', [username]);
  return rows[0];
};

exports.createAdmin = async (username, hashedPassword) => {
  const [result] = await pool.query('INSERT INTO admin (username, password) VALUES (?, ?)', [username, hashedPassword]);
  return result.insertId;
}; 