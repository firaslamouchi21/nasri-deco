const pool = require('../config/db');


exports.getTopUsedMaterials = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const [rows] = await pool.query(`
      SELECT 
        m.name,
        m.unit,
        COALESCE(SUM(CASE WHEN ml.quantity_change < 0 THEN ABS(ml.quantity_change) ELSE 0 END), 0) as total_used
      FROM materials m
      LEFT JOIN material_logs ml ON m.id = ml.material_id
      WHERE ml.action IN ('used', 'updated') OR ml.action IS NULL
      GROUP BY m.id, m.name, m.unit
      ORDER BY total_used DESC
      LIMIT ?
    `, [limit]);
    
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch top used materials', details: err.message });
  }
};


exports.getRevenueEvolution = async (req, res) => {
  try {
    const months = parseInt(req.query.months) || 12;
    const [rows] = await pool.query(`
      SELECT 
        DATE_FORMAT(created_at, '%Y-%m') as month,
        SUM(amount) as total_revenue
      FROM revenues
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? MONTH)
      GROUP BY DATE_FORMAT(created_at, '%Y-%m')
      ORDER BY month ASC
    `, [months]);
    
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch revenue evolution', details: err.message });
  }
};


exports.getExpensesBySupplier = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        COALESCE(m.supplier, 'Autres') as supplier_name,
        SUM(e.amount) as total_expenses,
        COUNT(e.id) as expense_count
      FROM expenses e
      LEFT JOIN materials m ON e.material_id = m.id
      GROUP BY COALESCE(m.supplier, 'Autres')
      ORDER BY total_expenses DESC
    `);
    
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch expenses by supplier', details: err.message });
  }
};

//na3l zeb zbi
exports.getLowStockAlerts = async (req, res) => {
  try {
    const threshold = parseInt(req.query.threshold) || 20;
    const [rows] = await pool.query(`
      SELECT 
        m.id,
        m.name,
        m.stock_quantity as current_stock,
        m.unit,
        m.supplier,
        ? as threshold,
        CASE 
          WHEN m.stock_quantity <= ? / 2 THEN 'critical'
          WHEN m.stock_quantity <= ? THEN 'low'
          ELSE 'normal'
        END as alert_level
      FROM materials m
      WHERE m.stock_quantity <= ?
      ORDER BY m.stock_quantity ASC
    `, [threshold, threshold, threshold, threshold]);
    
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch low stock alerts', details: err.message });
  }
};


exports.getMonthlyMaterialCosts = async (req, res) => {
  try {
    const months = parseInt(req.query.months) || 12;
    const [rows] = await pool.query(`
      SELECT 
        DATE_FORMAT(ml.created_at, '%Y-%m') as month,
        SUM(ABS(ml.quantity_change) * m.unit_price) as total_cost
      FROM material_logs ml
      JOIN materials m ON ml.material_id = m.id
      WHERE ml.quantity_change < 0 
        AND ml.created_at >= DATE_SUB(NOW(), INTERVAL ? MONTH)
      GROUP BY DATE_FORMAT(ml.created_at, '%Y-%m')
      ORDER BY month ASC
    `, [months]);
    
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch monthly material costs', details: err.message });
  }
};


exports.getProjectStatusOverview = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        COALESCE(status, 'pending') as status,
        COUNT(*) as count
      FROM orders
      GROUP BY COALESCE(status, 'pending')
      ORDER BY count DESC
    `);
    
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch project status overview', details: err.message });
  }
};


exports.getUsageByCategory = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        COALESCE(m.category, 'Non catégorisé') as category,
        SUM(ABS(ml.quantity_change)) as total_used,
        SUM(ABS(ml.quantity_change) * m.unit_price) as total_cost
      FROM material_logs ml
      JOIN materials m ON ml.material_id = m.id
      WHERE ml.quantity_change < 0
      GROUP BY COALESCE(m.category, 'Non catégorisé')
      ORDER BY total_used DESC
    `);
    
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch usage by category', details: err.message });
  }
};

// 8. Stock modifications per month
exports.getStockModifications = async (req, res) => {
  try {
    const months = parseInt(req.query.months) || 12;
    const [rows] = await pool.query(`
      SELECT 
        DATE_FORMAT(created_at, '%Y-%m') as month,
        COUNT(*) as total_modifications,
        SUM(CASE WHEN quantity_change > 0 THEN 1 ELSE 0 END) as additions,
        SUM(CASE WHEN quantity_change < 0 THEN 1 ELSE 0 END) as uses,
        SUM(ABS(quantity_change)) as total_quantity_changed
      FROM material_logs
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? MONTH)
      GROUP BY DATE_FORMAT(created_at, '%Y-%m')
      ORDER BY month ASC
    `, [months]);
    
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stock modifications', details: err.message });
  }
};

// 9. Top clients analysis
exports.getTopClients = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const [rows] = await pool.query(`
      SELECT 
        name as client_name,
        email,
        COUNT(*) as order_count,
        MAX(created_at) as last_order_date,
        MIN(created_at) as first_order_date
      FROM orders
      GROUP BY name, email
      ORDER BY order_count DESC, last_order_date DESC
      LIMIT ?
    `, [limit]);
    
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch top clients', details: err.message });
  }
};

// 10. Admin activity tracking
exports.getAdminActivity = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const [rows] = await pool.query(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as activities,
        COUNT(DISTINCT admin_id) as active_admins
      FROM material_logs
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
        AND admin_id IS NOT NULL
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `, [days]);
    
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch admin activity', details: err.message });
  }
};

// Dashboard summary stats
exports.getDashboardSummary = async (req, res) => {
  try {
    const [materialsCount] = await pool.query('SELECT COUNT(*) as count FROM materials');
    const [ordersCount] = await pool.query('SELECT COUNT(*) as count FROM orders');
    const [messagesCount] = await pool.query('SELECT COUNT(*) as count FROM messages');
    const [lowStockCount] = await pool.query('SELECT COUNT(*) as count FROM materials WHERE stock_quantity <= 20');
    
    const [revenueThisMonth] = await pool.query(`
      SELECT COALESCE(SUM(amount), 0) as total 
      FROM revenues 
      WHERE MONTH(created_at) = MONTH(NOW()) AND YEAR(created_at) = YEAR(NOW())
    `);
    
    const [expensesThisMonth] = await pool.query(`
      SELECT COALESCE(SUM(amount), 0) as total 
      FROM expenses 
      WHERE MONTH(created_at) = MONTH(NOW()) AND YEAR(created_at) = YEAR(NOW())
    `);
    
    res.json({
      materials_count: materialsCount[0].count,
      orders_count: ordersCount[0].count,
      messages_count: messagesCount[0].count,
      low_stock_count: lowStockCount[0].count,
      revenue_this_month: revenueThisMonth[0].total,
      expenses_this_month: expensesThisMonth[0].total,
      profit_this_month: revenueThisMonth[0].total - expensesThisMonth[0].total
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch dashboard summary', details: err.message });
  }
};
