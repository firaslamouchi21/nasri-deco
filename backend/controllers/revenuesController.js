const revenuesModel = require('../models/revenuesModel');
const path = require('path');
const { toMysqlDate } = require('../models/expensesModel');


exports.createRevenue = async (req, res) => {
  console.log(`[Revenue] ${req.method} ${req.originalUrl} body:`, req.body);
  try {
    const { date, description, amount, payment_method, client_name } = req.body;
    const file = req.file ? req.file.filename : null;
  
    const id = await revenuesModel.createRevenue({ date, description, amount, payment_method, client_name, file });
    console.log(`[Revenue] Created with id:`, id);
    res.status(201).json({ message: 'Revenue added', id });
  } catch (err) {
    console.error(`[Revenue] Error:`, err);
    res.status(500).json({ error: err.message });
  }
};


exports.getAllRevenues = async (req, res) => {
  console.log(`[Revenue] ${req.method} ${req.originalUrl}`);
  try {
    const revenues = await revenuesModel.getAllRevenues();
    console.log(`[Revenue] Fetched count:`, revenues.length);
    res.json(revenues);
  } catch (err) {
    console.error(`[Revenue] Error:`, err);
    res.status(500).json({ error: err.message });
  }
};


exports.getRevenueById = async (req, res) => {
  console.log(`[Revenue] ${req.method} ${req.originalUrl} params:`, req.params);
  try {
    const revenue = await revenuesModel.getRevenueById(req.params.id);
    if (!revenue) {
      console.log(`[Revenue] Not found for id:`, req.params.id);
      return res.status(404).json({ error: 'Not found' });
    }
    res.json(revenue);
  } catch (err) {
    console.error(`[Revenue] Error:`, err);
    res.status(500).json({ error: err.message });
  }
};


exports.updateRevenue = async (req, res) => {
  console.log(`[Revenue] ${req.method} ${req.originalUrl} params:`, req.params, 'body:', req.body);
  try {
    const updates = req.body;
    if (req.file) updates.file = req.file.filename;
  
    if ('material_id' in updates) delete updates.material_id;
   
    const affected = await revenuesModel.updateRevenue(req.params.id, updates);
    console.log(`[Revenue] Update affected rows:`, affected);
    if (!affected) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Revenue updated' });
  } catch (err) {
    console.error(`[Revenue] Error:`, err);
    res.status(500).json({ error: err.message });
  }
};


exports.deleteRevenue = async (req, res) => {
  console.log(`[Revenue] ${req.method} ${req.originalUrl} params:`, req.params);
  try {
    const affected = await revenuesModel.deleteRevenue(req.params.id);
    console.log(`[Revenue] Delete affected rows:`, affected);
    if (!affected) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Revenue deleted' });
  } catch (err) {
    console.error(`[Revenue] Error:`, err);
    res.status(500).json({ error: err.message });
  }
};


exports.getMonthlyRevenueAggregates = async (req, res) => {
  try {
    const data = await revenuesModel.getMonthlyRevenueAggregates();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch monthly revenue aggregates', details: err.message });
  }
};

exports.getYearlyRevenueAggregates = async (req, res) => {
  try {
    const data = await revenuesModel.getYearlyRevenueAggregates();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch yearly revenue aggregates', details: err.message });
  }
}; 