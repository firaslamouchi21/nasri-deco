const express = require('express');
const adminController = require('../controllers/adminController');
const ordersController = require('../controllers/ordersController');
const materialsController = require('../controllers/materialsController');
const verifyAdmin = require('../middleware/verifyAdmin');

const router = express.Router();

// Admin login
router.post('/login', adminController.adminLogin);

// Orders management
router.get('/orders', verifyAdmin, ordersController.getAllOrders);
router.patch('/orders/:id', verifyAdmin, ordersController.updateOrderStatus);

// Materials management
router.get('/materials', verifyAdmin, materialsController.getAllMaterials);
router.post('/materials', verifyAdmin, materialsController.addMaterial);
router.patch('/materials/:id', verifyAdmin, materialsController.updateMaterial);
router.delete('/materials/:id', verifyAdmin, materialsController.deleteMaterial);

// Expenses & Revenues
router.post('/expenses', verifyAdmin, materialsController.addExpense);
router.post('/revenues', verifyAdmin, materialsController.addRevenue);

// Financial & material control
router.get('/financial-summary', verifyAdmin, materialsController.getFinancialSummary);
router.get('/financial-risk', verifyAdmin, materialsController.getFinancialRisk);
router.get('/low-stock', verifyAdmin, materialsController.getLowStockMaterials);
router.get('/material-usage', verifyAdmin, materialsController.getMaterialUsageProjection);
router.get('/material-usage-data', verifyAdmin, materialsController.getMaterialUsageData);
router.get('/financial-history', verifyAdmin, materialsController.getFinancialHistory);

// Protected admin routes
router.get('/users', verifyAdmin, adminController.getAllUsers);
router.get('/messages', verifyAdmin, adminController.getAllMessages);
router.get('/uploads', verifyAdmin, adminController.getAllUploads);

module.exports = router;
