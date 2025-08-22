const pool = require('./config/db');

async function debugAnalytics() {
  try {
    console.log('=== DEBUGGING ANALYTICS ===\n');
    
   
    console.log('1. Basic Counts:');
    const [materialCount] = await pool.query('SELECT COUNT(*) as count FROM materials');
    const [orderCount] = await pool.query('SELECT COUNT(*) as count FROM orders');
    const [messageCount] = await pool.query('SELECT COUNT(*) as count FROM messages');
    const [logCount] = await pool.query('SELECT COUNT(*) as count FROM material_logs');
    
    console.log(`Materials: ${materialCount[0].count}`);
    console.log(`Orders: ${orderCount[0].count}`);
    console.log(`Messages: ${messageCount[0].count}`);
    console.log(`Material Logs: ${logCount[0].count}\n`);
    
  
    console.log('2. Current Month Financial Data:');
    const [currentRevenue] = await pool.query(`
      SELECT COALESCE(SUM(amount), 0) as total 
      FROM revenues 
      WHERE MONTH(created_at) = MONTH(NOW()) AND YEAR(created_at) = YEAR(NOW())
    `);
    
    const [currentExpenses] = await pool.query(`
      SELECT COALESCE(SUM(amount), 0) as total 
      FROM expenses 
      WHERE MONTH(created_at) = MONTH(NOW()) AND YEAR(created_at) = YEAR(NOW())
    `);
    
    console.log(`Current Month Revenue: ${currentRevenue[0].total}`);
    console.log(`Current Month Expenses: ${currentExpenses[0].total}\n`);
    
   
    console.log('3. Revenue Data Sample:');
    const [revenueData] = await pool.query(`
      SELECT DATE_FORMAT(created_at, '%Y-%m-%d') as date, amount 
      FROM revenues 
      ORDER BY created_at DESC 
      LIMIT 5
    `);
    console.log(revenueData);
    
    
    console.log('\n4. Material Logs Sample:');
    const [logData] = await pool.query(`
      SELECT ml.*, m.name as material_name 
      FROM material_logs ml 
      LEFT JOIN materials m ON ml.material_id = m.id 
      ORDER BY ml.created_at DESC 
      LIMIT 5
    `);
    console.log(logData);
    
 
    console.log('\n5. Top Used Materials Query:');
    const [topMaterials] = await pool.query(`
      SELECT 
        m.name,
        m.unit,
        COALESCE(SUM(CASE WHEN ml.quantity_change < 0 THEN ABS(ml.quantity_change) ELSE 0 END), 0) as total_used
      FROM materials m
      LEFT JOIN material_logs ml ON m.id = ml.material_id
      GROUP BY m.id, m.name, m.unit
      ORDER BY total_used DESC
      LIMIT 5
    `);
    console.log(topMaterials);
    
    await pool.end();
    console.log('\n=== DEBUG COMPLETE ===');
    
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

debugAnalytics();
