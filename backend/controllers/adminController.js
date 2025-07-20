const adminModel = require('../models/adminModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const fs = require('fs');
const path = require('path');

async function adminLogin(req, res) {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'Username and password required' });
  try {
    const admin = await adminModel.getAdminByUsername(username);
    if (!admin) return res.status(401).json({ message: 'Invalid credentials' });
    const valid = await bcrypt.compare(password, admin.password_hash);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: admin.id, username: admin.username }, process.env.token_secret, { expiresIn: '1d' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

exports.getAllUsers = async (req, res) => {
  try {
    const [users] = await pool.query('SELECT * FROM users');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users', details: err.message });
  }
};

exports.getAllMessages = async (req, res) => {
  try {
    const [messages] = await pool.query('SELECT * FROM messages ORDER BY created_at DESC');
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages', details: err.message });
  }
};

exports.getAllUploads = (req, res) => {
  const uploadsDir = path.join(__dirname, '../uploads');
  fs.readdir(uploadsDir, (err, files) => {
    if (err) return res.status(500).json({ error: 'Failed to read uploads' });
    const uploads = files.map(filename => {
      const stats = fs.statSync(path.join(uploadsDir, filename));
      return {
        filename,
        url: `/uploads/${filename}`,
        created_at: stats.ctime
      };
    });
    res.json(uploads);
  });
};

module.exports = { adminLogin }; 