const pool = require('../config/db');

// Create a new order
async function createOrder(order) {
  const { name, email, phone, details, image } = order;
  const [result] = await pool.query(
    'INSERT INTO orders (name, email, phone, details, image) VALUES (?, ?, ?, ?, ?)',
    [name, email, phone, details, image]
  );
  return result.insertId;
}

// Get all orders (admin)
async function getAllOrders() {
  const [rows] = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
  return rows;
}

module.exports = {
  createOrder,
  getAllOrders,
}; 