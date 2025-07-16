const pool = require('../config/db');

// Get all gallery items
async function getGallery() {
  const [rows] = await pool.query('SELECT * FROM gallery ORDER BY uploaded_at DESC');
  return rows;
}

// Add new gallery item
async function addGalleryItem({ title, category, before_img, after_img }) {
  const [result] = await pool.query(
    'INSERT INTO gallery (title, category, before_img, after_img) VALUES (?, ?, ?, ?)',
    [title, category, before_img, after_img]
  );
  return result.insertId;
}

module.exports = {
  getGallery,
  addGalleryItem,
}; 