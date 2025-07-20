const pool = require('../config/db');

exports.logMaterialChange = async (material_id, action, quantity_change, admin_id, reason) => {
  await pool.query(
    'INSERT INTO material_logs (material_id, action, quantity_change, admin_id, reason) VALUES (?, ?, ?, ?, ?)',
    [material_id, action, quantity_change, admin_id, reason]
  );
};

exports.getLogsForMaterial = async (material_id) => {
  const [rows] = await pool.query('SELECT * FROM material_logs WHERE material_id = ? ORDER BY timestamp DESC', [material_id]);
  return rows;
};

exports.getAllLogs = async () => {
  const [rows] = await pool.query('SELECT * FROM material_logs ORDER BY timestamp DESC');
  return rows;
}; 