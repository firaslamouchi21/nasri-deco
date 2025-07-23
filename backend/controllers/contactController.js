// const pool = require('../config/db');
const contactModel = require('../models/contactModel');

// Submit contact form
async function submitContact(req, res) {
  const { full_name, email, message } = req.body;
  if (!full_name || !email || !message) {
    return res.status(400).json({ error: 'Tous les champs sont obligatoires.' });
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ error: 'Email invalide.' });
  }
  try {
    await contactModel.createContact({ name: full_name, email, message });
    res.status(201).json({ message: 'Message envoyé avec succès!' });
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de l'enregistrement du message.", details: err.message });
  }
}

module.exports = { submitContact }; 