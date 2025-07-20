const pool = require('../config/db');

exports.getAllMaterials = async () => {
  const [rows] = await pool.query('SELECT * FROM materials ORDER BY last_updated DESC, date_added DESC');
  return rows;
};

exports.getMaterialById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM materials WHERE id = ?', [id]);
  return rows[0];
};

exports.addMaterial = async (material) => {
  const { name, category, quantity, unit, unit_price, supplier } = material;
  const [result] = await pool.query(
    'INSERT INTO materials (name, category, quantity, unit, unit_price, supplier) VALUES (?, ?, ?, ?, ?, ?)',
    [name, category, quantity, unit, unit_price, supplier]
  );
  return result.insertId;
};

exports.updateMaterial = async (id, updates) => {
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
};

exports.deleteMaterial = async (id) => {
  const [result] = await pool.query('DELETE FROM materials WHERE id = ?', [id]);
  return result.affectedRows;
}; 