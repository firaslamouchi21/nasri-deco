const adminModel = require('../models/adminModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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

module.exports = { adminLogin }; 