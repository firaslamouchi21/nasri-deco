const expensesModel = require('../models/expensesModel');
const path = require('path');
const { toMysqlDate } = require('../models/expensesModel');


exports.createExpense = async (req, res) => {
  console.log(`[Expense] ${req.method} ${req.originalUrl} body:`, req.body);
  try {
    const { date, description, amount, category, material_id } = req.body;
    const file = req.file ? req.file.filename : null;
 
   
    const id = await expensesModel.createExpense({ date, description, amount, category, material_id, file });
    console.log(`[Expense] Created with id:`, id);
    res.status(201).json({ message: 'Expense added', id });
  } catch (err) {
    console.error(`[Expense] Error:`, err);
    res.status(500).json({ error: err.message });
  }
};


exports.getAllExpenses = async (req, res) => {
  console.log(`[Expense] ${req.method} ${req.originalUrl}`);
  try {
    const expenses = await expensesModel.getAllExpenses();
    console.log(`[Expense] Fetched count:`, expenses.length);
    res.json(expenses);
  } catch (err) {
    console.error(`[Expense] Error:`, err);
    res.status(500).json({ error: err.message });
  }
};


exports.getExpenseById = async (req, res) => {
  console.log(`[Expense] ${req.method} ${req.originalUrl} params:`, req.params);
  try {
    const expense = await expensesModel.getExpenseById(req.params.id);
    if (!expense) {
      console.log(`[Expense] Not found for id:`, req.params.id);
      return res.status(404).json({ error: 'Not found' });
    }
    res.json(expense);
  } catch (err) {
    console.error(`[Expense] Error:`, err);
    res.status(500).json({ error: err.message });
  }
};


exports.updateExpense = async (req, res) => {
  console.log(`[Expense] ${req.method} ${req.originalUrl} params:`, req.params, 'body:', req.body);
  try {
    const updates = req.body;
    if (req.file) updates.file = req.file.filename;
  
    const affected = await expensesModel.updateExpense(req.params.id, updates);
    console.log(`[Expense] Update affected rows:`, affected);
    if (!affected) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Expense updated' });
  } catch (err) {
    console.error(`[Expense] Error:`, err);
    res.status(500).json({ error: err.message });
  }
};


exports.deleteExpense = async (req, res) => {
  console.log(`[Expense] ${req.method} ${req.originalUrl} params:`, req.params);
  try {
    const affected = await expensesModel.deleteExpense(req.params.id);
    console.log(`[Expense] Delete affected rows:`, affected);
    if (!affected) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Expense deleted' });
  } catch (err) {
    console.error(`[Expense] Error:`, err);
    res.status(500).json({ error: err.message });
  }
};

exports.getMonthlyExpenseAggregates = async (req, res) => {
  try {
    const data = await expensesModel.getMonthlyExpenseAggregates();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch monthly expense aggregates', details: err.message });
  }
};

exports.getYearlyExpenseAggregates = async (req, res) => {
  try {
    const data = await expensesModel.getYearlyExpenseAggregates();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch yearly expense aggregates', details: err.message });
  }
};

exports.getExpenseCategoryBreakdown = async (req, res) => {
  try {
    const data = await expensesModel.getExpenseCategoryBreakdown();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch expense category breakdown', details: err.message });
  }
}; 