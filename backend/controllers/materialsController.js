const materialsModel = require('../models/materialsModel');
const materialLogsModel = require('../models/materialLogsModel');
const expensesModel = require('../models/expensesModel');
const revenuesModel = require('../models/revenuesModel');

exports.getAllMaterials = async (req, res) => {
  try {
    const materials = await materialsModel.getAllMaterials();
    res.json(materials);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch materials', details: err.message });
  }
};

exports.addMaterial = async (req, res) => {
  try {
    const { name, category, quantity, unit, unit_price, supplier, reason } = req.body;
    if (!name || !quantity || !unit || !unit_price) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const admin_id = req.admin ? req.admin.id : null;
    const id = await materialsModel.addMaterial({ name, category, quantity, unit, unit_price, supplier });
    await materialLogsModel.logMaterialChange(id, 'added', quantity, admin_id, reason || 'Initial stock');
    res.status(201).json({ message: 'Material added', id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add material', details: err.message });
  }
};

exports.updateMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const admin_id = req.admin ? req.admin.id : null;
    const oldMaterial = await materialsModel.getMaterialById(id);
    if (!oldMaterial) return res.status(404).json({ error: 'Material not found' });
    const affected = await materialsModel.updateMaterial(id, updates);
    if (affected) {
      // Log quantity change if present
      if (updates.quantity && updates.quantity !== oldMaterial.quantity) {
        const diff = updates.quantity - oldMaterial.quantity;
        await materialLogsModel.logMaterialChange(id, 'updated', diff, admin_id, updates.reason || 'Quantity updated');
      }
      res.json({ message: 'Material updated' });
    } else {
      res.status(400).json({ error: 'No changes made' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to update material', details: err.message });
  }
};

exports.deleteMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const admin_id = req.admin ? req.admin.id : null;
    const material = await materialsModel.getMaterialById(id);
    if (!material) return res.status(404).json({ error: 'Material not found' });
    await materialsModel.deleteMaterial(id);
    await materialLogsModel.logMaterialChange(id, 'removed', -material.quantity, admin_id, 'Material deleted');
    res.json({ message: 'Material deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete material', details: err.message });
  }
};

// Financial summary: total expenses, total revenues, balance
exports.getFinancialSummary = async (req, res) => {
  try {
    const total_expenses = await expensesModel.getMonthlyExpenses();
    const total_revenue = await revenuesModel.getMonthlyRevenues();
    const balance = total_revenue - total_expenses;
    res.json({ total_expenses, total_revenue, balance });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch financial summary', details: err.message });
  }
};

// Financial risk detection: if expenses > 80% of revenues
exports.getFinancialRisk = async (req, res) => {
  try {
    const total_expenses = await expensesModel.getMonthlyExpenses();
    const total_revenue = await revenuesModel.getMonthlyRevenues();
    const risk = total_revenue > 0 ? (total_expenses / total_revenue) > 0.8 : false;
    res.json({ risk, total_expenses, total_revenue });
  } catch (err) {
    res.status(500).json({ error: 'Failed to detect financial risk', details: err.message });
  }
};

// Low stock detection
exports.getLowStockMaterials = async (req, res) => {
  try {
    const threshold = parseInt(req.query.threshold) || 20;
    const lowStock = await materialsModel.getLowStockMaterials(threshold);
    res.json(lowStock);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch low stock materials', details: err.message });
  }
};

// Material usage projection for a material
exports.getMaterialUsageProjection = async (req, res) => {
  try {
    const { material_id } = req.query;
    if (!material_id) return res.status(400).json({ error: 'material_id is required' });
    const avg_usage = await materialsModel.getAverageWeeklyUsage(material_id);
    const [material] = await materialsModel.getLowStockMaterials(99999); // get all materials
    const current_stock = material?.stock_quantity || 0;
    const weeks_left = avg_usage > 0 ? current_stock / avg_usage : null;
    res.json({ avg_usage, current_stock, weeks_left });
  } catch (err) {
    res.status(500).json({ error: 'Failed to project material usage', details: err.message });
  }
};

exports.getFinancialHistory = async (req, res) => {
  try {
    const expenses = await expensesModel.getMonthlyExpensesHistory();
    const revenues = await revenuesModel.getMonthlyRevenuesHistory();
    res.json({ expenses, revenues });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch financial history', details: err.message });
  }
}; 