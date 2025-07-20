const pool = require('../config/db');

// Get all orders
exports.getAllOrders = async () => {
  const [rows] = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
  return rows;
};

// Update order status
exports.updateOrderStatus = async (id, status) => {
  const [result] = await pool.query('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
  return result.affectedRows;
}; 