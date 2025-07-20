const materialsModel = require('../models/materialsModel');
const materialLogsModel = require('../models/materialLogsModel');

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