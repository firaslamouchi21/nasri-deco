// const pool = require('../config/db');

// Submit contact form
async function submitContact(req, res) {
  res.status(200).json({ message: "Contact form submitted (placeholder)" });
}

module.exports = { submitContact }; 