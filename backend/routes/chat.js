const express = require('express');
const pool = require('../config/db');
const router = express.Router();

router.post('/send', async (req, res) => {
  const { sender, receiver, message } = req.body;
  try {
    await pool.query('INSERT INTO messages (sender, receiver, message) VALUES (?, ?, ?)', [sender, receiver, message]);
    res.json({ message: 'Message saved' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save message', details: err.message });
  }
});

module.exports = router; 