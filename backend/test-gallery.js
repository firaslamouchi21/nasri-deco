const pool = require('./config/db');

async function testGallery() {
  try {
    console.log('Testing gallery functionality...');
    
   
    const [rows] = await pool.query('SELECT 1 as test');
    console.log('✅ Database connection successful');
    
    
    const [structure] = await pool.query('DESCRIBE gallery');
    console.log('✅ Gallery table structure:', structure.map(s => s.Field));
    
    
    const [items] = await pool.query('SELECT * FROM gallery');
    console.log('✅ Found', items.length, 'gallery items');
    
    /
    if (items.length > 0) {
      const updates = [
        { id: 1, description: 'Transformation complète d\'un salon avec plafond en staff moderne et éclairage intégré.' },
        { id: 2, description: 'Installation d\'une décoration murale artistique pour un couloir élégant.' },
        { id: 3, description: 'Création d\'un plafond en staff avec motifs décoratifs pour une chambre.' }
      ];
      
      for (const update of updates) {
        if (items.find(item => item.id === update.id && !item.description)) {
          await pool.query('UPDATE gallery SET description = ? WHERE id = ?', [update.description, update.id]);
          console.log(`✅ Updated description for item ${update.id}`);
        }
      }
    }
    
    // Show final gallery items
    const [finalItems] = await pool.query('SELECT id, title, category, description FROM gallery');
    console.log('✅ Final gallery items:', finalItems);
    
  } catch (error) {
    console.error('❌ Error testing gallery:', error);
  } finally {
    await pool.end();
    console.log('✅ Database connection closed');
  }
}

testGallery();
