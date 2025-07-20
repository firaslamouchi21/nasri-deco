const express = require('express');
const jwt = require('jsonwebtoken');
const { getAllUsers, getAllMessages, getAllUploads } = require('../controllers/adminController');
const verifyAdmin = require('../middleware/verifyAdmin');
const router = express.Router();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com';
const ADMIN_PASS = process.env.ADMIN_PASS || 'admin123';
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (email === ADMIN_EMAIL && password === ADMIN_PASS) {
    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '2h' });
    return res.json({ token });
  }
  res.status(401).json({ error: 'Invalid credentials' });
});

router.get('/users', verifyAdmin, getAllUsers);
router.get('/messages', verifyAdmin, getAllMessages);
router.get('/uploads', verifyAdmin, getAllUploads);

module.exports = router;
