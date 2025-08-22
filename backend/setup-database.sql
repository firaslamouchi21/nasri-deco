
ALTER TABLE messages 
ADD COLUMN IF NOT EXISTS phone VARCHAR(20),
ADD COLUMN IF NOT EXISTS subject VARCHAR(255);

-- 3. Fix materials table schema to be consistent
ALTER TABLE materials 
ADD COLUMN IF NOT EXISTS category VARCHAR(100) AFTER name,
ADD COLUMN IF NOT EXISTS quantity INT DEFAULT 0 AFTER category,
ADD COLUMN IF NOT EXISTS unit VARCHAR(50) AFTER quantity,
ADD COLUMN IF NOT EXISTS supplier VARCHAR(255) AFTER unit_price,
ADD COLUMN IF NOT EXISTS date_added TIMESTAMP DEFAULT CURRENT_TIMESTAMP AFTER supplier,
ADD COLUMN IF NOT EXISTS last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER date_added;

-- 4. Ensure stock_quantity exists and sync with quantity
UPDATE materials SET stock_quantity = quantity WHERE stock_quantity IS NULL AND quantity IS NOT NULL;
UPDATE materials SET quantity = stock_quantity WHERE quantity != stock_quantity;

-- 5. Add status column to orders if not exists
ALTER TABLE orders ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'pending';

t
CREATE TABLE IF NOT EXISTS material_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  material_id INT,
  action VARCHAR(50),
  quantity_change INT,
  admin_id INT,
  reason VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (material_id) REFERENCES materials(id)
);


INSERT INTO material_logs (material_id, action, quantity_change, reason, created_at) 
SELECT 
  m.id,
  'used',
  -FLOOR(RAND() * 10 + 1),
  'Test usage data',
  DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 30) DAY)
FROM materials m
WHERE EXISTS (SELECT 1 FROM materials)
LIMIT 20
ON DUPLICATE KEY UPDATE id=id;
