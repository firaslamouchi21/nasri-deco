const pool = require('../config/db');

async function getAllMaterials() {
  const [rows] = await pool.query('SELECT * FROM materials ORDER BY last_updated DESC, date_added DESC');
  return rows;
}

async function getMaterialById(id) {
  const [rows] = await pool.query('SELECT * FROM materials WHERE id = ?', [id]);
  return rows[0];
}

async function addMaterial(material) {
  const { name, category, quantity, unit, unit_price, supplier } = material;
  const [result] = await pool.query(
    'INSERT INTO materials (name, category, quantity, unit, unit_price, supplier, stock_quantity) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [name, category, quantity, unit, unit_price, supplier, quantity]
  );
  return result.insertId;
}

async function updateMaterial(id, updates) {
  const fields = [];
  const values = [];
  for (const key in updates) {
    fields.push(`${key} = ?`);
    values.push(updates[key]);
  }
  values.push(id);
  const [result] = await pool.query(
    `UPDATE materials SET ${fields.join(', ')}, last_updated = NOW() WHERE id = ?`,
    values
  );
  return result.affectedRows;
}

async function deleteMaterial(id) {
  const [result] = await pool.query('DELETE FROM materials WHERE id = ?', [id]);
  return result.affectedRows;
}

// Get materials with stock below a threshold
async function getLowStockMaterials(threshold = 20) {
  const [rows] = await pool.query('SELECT * FROM materials WHERE stock_quantity < ?', [threshold]);
  return rows;
}

// Get average weekly usage for a material over the last 30 days
async function getAverageWeeklyUsage(material_id) {
  const [rows] = await pool.query(
    `SELECT AVG(used_quantity) AS avg_usage FROM material_usage WHERE material_id = ? AND created_at BETWEEN DATE_SUB(NOW(), INTERVAL 30 DAY) AND NOW()`,
    [material_id]
  );
  return rows[0]?.avg_usage || 0;
}

module.exports = {
  getAllMaterials,
  getMaterialById,
  addMaterial,
  updateMaterial,
  deleteMaterial,
  getLowStockMaterials,
  getAverageWeeklyUsage,
}; 