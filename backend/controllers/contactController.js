// const pool = require('../config/db');
const contactModel = require('../models/contactModel');

// Submit contact form
async function submitContact(req, res) {
  const { full_name, email, phone, subject, message } = req.body;
  if (!full_name || !email || !message) {
    return res.status(400).json({ error: 'Les champs nom, email et message sont obligatoires.' });
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ error: 'Email invalide.' });
  }
  try {
    await contactModel.createContact({ 
      name: full_name, 
      email, 
      phone: phone || null, 
      subject: subject || null, 
      message 
    });
    res.status(201).json({ message: 'Message envoyé avec succès!' });
  } catch (err) {
    console.error('Contact submission error:', err);
    res.status(500).json({ error: "Erreur lors de l'enregistrement du message.", details: err.message });
  }
}

module.exports = { submitContact }; 