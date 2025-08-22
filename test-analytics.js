const pool = require('./config/db');

async function testAnalytics() {
  try {
    console.log('Testing analytics queries...');
    
    // Test 1: Top Used Materials
    console.log('\n1. Top Used Materials:');
    const [topMaterials] = await pool.query(`
      SELECT 
        m.name,
        m.unit,
        COALESCE(SUM(CASE WHEN ml.quantity_change < 0 THEN ABS(ml.quantity_change) ELSE 0 END), 0) as total_used
      FROM materials m
      LEFT JOIN material_logs ml ON m.id = ml.material_id
      WHERE ml.action IN ('used', 'updated') OR ml.action IS NULL
      GROUP BY m.id, m.name, m.unit
      ORDER BY total_used DESC
      LIMIT 5
    `);
    console.log('Results:', topMaterials);
    
    // Test 2: Revenue Evolution
    console.log('\n2. Revenue Evolution:');
    const [revenue] = await pool.query(`
      SELECT 
        DATE_FORMAT(created_at, '%Y-%m') as month,
        SUM(amount) as total_revenue
      FROM revenues
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
      GROUP BY DATE_FORMAT(created_at, '%Y-%m')
      ORDER BY month ASC
    `);
    console.log('Results:', revenue);
    
    // Test 3: Check material_logs actions
    console.log('\n3. Material Logs Actions:');
    const [actions] = await pool.query(`
      SELECT DISTINCT action, COUNT(*) as count
      FROM material_logs 
      GROUP BY action
    `);
    console.log('Actions:', actions);
    
    // Test 4: Raw material logs
    console.log('\n4. Sample Material Logs:');
    const [logs] = await pool.query(`
      SELECT * FROM material_logs 
      ORDER BY created_at DESC 
      LIMIT 5
    `);
    console.log('Logs:', logs);
    
    await pool.end();
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

testAnalytics();
