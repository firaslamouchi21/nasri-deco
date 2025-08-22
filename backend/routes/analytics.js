const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const verifyAdmin = require('../middleware/verifyAdmin');

// Apply admin verification to all analytics routes
router.use(verifyAdmin);

// Dashboard summary
router.get('/dashboard-summary', analyticsController.getDashboardSummary);

// Material analytics
router.get('/top-used-materials', analyticsController.getTopUsedMaterials);
router.get('/usage-by-category', analyticsController.getUsageByCategory);
router.get('/monthly-material-costs', analyticsController.getMonthlyMaterialCosts);
router.get('/low-stock-alerts', analyticsController.getLowStockAlerts);
router.get('/stock-modifications', analyticsController.getStockModifications);

// Financial analytics
router.get('/revenue-evolution', analyticsController.getRevenueEvolution);
router.get('/expenses-by-supplier', analyticsController.getExpensesBySupplier);

// Project and client analytics
router.get('/project-status-overview', analyticsController.getProjectStatusOverview);
router.get('/top-clients', analyticsController.getTopClients);

// Admin activity
router.get('/admin-activity', analyticsController.getAdminActivity);

module.exports = router;
