const pool = require('./config/db');

async function testDirectAnalytics() {
  try {
    console.log('=== DIRECT ANALYTICS TEST ===');
    
    
    console.log('\n1. Dashboard Summary:');
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
    
    const summary = {
      materials_count: materialsCount[0].count,
      orders_count: ordersCount[0].count,
      messages_count: messagesCount[0].count,
      low_stock_count: lowStockCount[0].count,
      revenue_this_month: revenueThisMonth[0].total,
      expenses_this_month: expensesThisMonth[0].total,
      profit_this_month: revenueThisMonth[0].total - expensesThisMonth[0].total
    };
    
    console.log('Dashboard Summary:', summary);
    
    
    console.log('\n2. Top Used Materials:');
    const [topMaterials] = await pool.query(`
      SELECT 
        m.name,
        m.unit,
        COALESCE(SUM(CASE WHEN ml.quantity_change < 0 THEN ABS(ml.quantity_change) ELSE 0 END), 0) as total_used
      FROM materials m
      LEFT JOIN material_logs ml ON m.id = ml.material_id
      GROUP BY m.id, m.name, m.unit
      ORDER BY total_used DESC
      LIMIT 10
    `);
    
    console.log('Top Materials:', topMaterials);
    
    
    console.log('\n3. Revenue Evolution:');
    const [revenue] = await pool.query(`
      SELECT 
        DATE_FORMAT(created_at, '%Y-%m') as month,
        SUM(amount) as total_revenue
      FROM revenues
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
      GROUP BY DATE_FORMAT(created_at, '%Y-%m')
      ORDER BY month ASC
    `);
    
    console.log('Revenue Evolution:', revenue);
    
    
    console.log('\n4. Material Logs Analysis:');
    const [logStats] = await pool.query(`
      SELECT 
        action,
        COUNT(*) as count,
        SUM(CASE WHEN quantity_change > 0 THEN quantity_change ELSE 0 END) as additions,
        SUM(CASE WHEN quantity_change < 0 THEN ABS(quantity_change) ELSE 0 END) as uses
      FROM material_logs 
      GROUP BY action
    `);
    
    console.log('Log Stats:', logStats);
    
    await pool.end();
    console.log('\n=== TEST COMPLETE ===');
    
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

testDirectAnalytics();
