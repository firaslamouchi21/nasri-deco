const pool = require('../config/db');

// Get all orders
exports.getAllOrders = async () => {
  const [rows] = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
  return rows;
};

// Create a new order
exports.createOrder = async (order) => {
  const { name, email, phone, details, image } = order;
  const [result] = await pool.query(
    'INSERT INTO orders (name, email, phone, details, image) VALUES (?, ?, ?, ?, ?)',
    [name, email, phone, details, image]
  );
  return result.insertId;
};

// Update order status
exports.updateOrderStatus = async (id, status) => {
  const [result] = await pool.query('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
  return result.affectedRows;
}; 