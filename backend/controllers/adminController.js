const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const fs = require('fs');
const path = require('path');

async function adminLogin(req, res) {
  const { email, password } = req.body;
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPass = process.env.ADMIN_PASS;
  const jwtSecret = process.env.JWT_SECRET;
  console.log('Loaded adminEmail:', adminEmail, 'Loaded adminPass:', adminPass ? 'set' : 'not set');
  if (!email || !password) return res.status(400).json({ message: 'Email and password required' });
  if (!adminEmail || !adminPass || !jwtSecret) return res.status(500).json({ message: 'Server misconfiguration: Set ADMIN_EMAIL, ADMIN_PASS, and JWT_SECRET in .env.' });
  if (email === adminEmail && password === adminPass) {
    const token = jwt.sign({ role: 'admin', email }, jwtSecret, { expiresIn: '1d' });
    return res.json({ token });
  } else {
    return res.status(401).json({ message: 'Identifiants invalides' });
  }
}

async function getAllUsers(req, res) {
  try {
    const [users] = await pool.query('SELECT * FROM users');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users', details: err.message });
  }
}

async function getAllMessages(req, res) {
  try {
    const [messages] = await pool.query('SELECT * FROM messages ORDER BY created_at DESC');
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages', details: err.message });
  }
}

function getAllUploads(req, res) {
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
}

module.exports = {
  adminLogin,
  getAllUsers,
  getAllMessages,
  getAllUploads
}; 
console.log("Loaded admin credentials:");
console.log("Email:", process.env.ADMIN_EMAIL);
console.log("Password:", process.env.ADMIN_PASS);
