const pool = require('../config/db');

// Get total expenses for the current month
async function getMonthlyExpenses() {
  const [rows] = await pool.query(
    `SELECT SUM(amount) AS total_expenses FROM expenses WHERE MONTH(created_at) = MONTH(CURRENT_DATE()) AND YEAR(created_at) = YEAR(CURRENT_DATE())`
  );
  return rows[0]?.total_expenses || 0;
}

// Add a new expense
async function addExpense({ description, amount, type, material_id }) {
  const [result] = await pool.query(
    'INSERT INTO expenses (description, amount, type, material_id) VALUES (?, ?, ?, ?)',
    [description, amount, type, material_id]
  );
  return result.insertId;
}

// Get all expenses
async function getAllExpenses() {
  const [rows] = await pool.query('SELECT * FROM expenses ORDER BY created_at DESC');
  return rows;
}

// Get monthly expenses for the last 12 months (for graph)
async function getMonthlyExpensesHistory() {
  const [rows] = await pool.query(
    `SELECT DATE_FORMAT(created_at, '%Y-%m') AS month, SUM(amount) AS total
     FROM expenses
     WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
     GROUP BY month
     ORDER BY month`
  );
  return rows;
}

module.exports = {
  getMonthlyExpenses,
  addExpense,
  getAllExpenses,
  getMonthlyExpensesHistory,
}; 