const pool = require('../config/db');


async function getGallery() {
  const [rows] = await pool.query('SELECT * FROM gallery ORDER BY uploaded_at DESC');
  return rows;
}


async function addGalleryItem({ title, category, description, before_img, after_img, before_type, after_type, before_url, after_url }) {
  const [result] = await pool.query(
    'INSERT INTO gallery (title, category, description, before_img, after_img, before_type, after_type, before_url, after_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [title, category, description, before_img, after_img, before_type, after_type, before_url, after_url]
  );
  return result.insertId;
}


async function updateGalleryItem(id, updateData) {
  const { title, category, description, before_img, after_img, before_type, after_type, before_url, after_url } = updateData;
  
  let query = 'UPDATE gallery SET title = ?, category = ?, description = ?';
  let params = [title, category, description];
  
  if (before_img) {
    query += ', before_img = ?';
    params.push(before_img);
  }
  
  if (after_img) {
    query += ', after_img = ?';
    params.push(after_img);
  }

  if (before_type) {
    query += ', before_type = ?';
    params.push(before_type);
  }

  if (after_type) {
    query += ', after_type = ?';
    params.push(after_type);
  }

  if (before_url) {
    query += ', before_url = ?';
    params.push(before_url);
  }

  if (after_url) {
    query += ', after_url = ?';
    params.push(after_url);
  }
  
  query += ' WHERE id = ?';
  params.push(id);
  
  const [result] = await pool.query(query, params);
  return result.affectedRows > 0;
}


async function deleteGalleryItem(id) {
  const [result] = await pool.query('DELETE FROM gallery WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

module.exports = {
  getGallery,
  addGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
}; 