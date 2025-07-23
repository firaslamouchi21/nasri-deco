const pool = require('../config/db');

// Get total revenues for the current month
async function getMonthlyRevenues() {
  const [rows] = await pool.query(
    `SELECT SUM(amount) AS total_revenue FROM revenues WHERE MONTH(created_at) = MONTH(CURRENT_DATE()) AND YEAR(created_at) = YEAR(CURRENT_DATE())`
  );
  return rows[0]?.total_revenue || 0;
}

// Add a new revenue
async function addRevenue({ description, amount }) {
  const [result] = await pool.query(
    'INSERT INTO revenues (description, amount) VALUES (?, ?)',
    [description, amount]
  );
  return result.insertId;
}

// Get all revenues
async function getAllRevenues() {
  const [rows] = await pool.query('SELECT * FROM revenues ORDER BY created_at DESC');
  return rows;
}

// Get monthly revenues for the last 12 months (for graph)
async function getMonthlyRevenuesHistory() {
  const [rows] = await pool.query(
    `SELECT DATE_FORMAT(created_at, '%Y-%m') AS month, SUM(amount) AS total
     FROM revenues
     WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
     GROUP BY month
     ORDER BY month`
  );
  return rows;
}

module.exports = {
  getMonthlyRevenues,
  addRevenue,
  getAllRevenues,
  getMonthlyRevenuesHistory,
}; 