-- Updated schema for inventory table
-- Use this for NEW database installations
-- For existing databases, use fix_inventory_schema.sql migration instead

CREATE TABLE IF NOT EXISTS inventory (
  id INT PRIMARY KEY AUTO_INCREMENT,
  type VARCHAR(100) NOT NULL COMMENT 'Container type (e.g., 20ft Container, 40ft Container)',
  `condition` ENUM('New', 'Used - Excellent', 'Used - Good', 'Used - Fair') NOT NULL,
  status ENUM('Available', 'Rented', 'Sold', 'Maintenance', 'Reserved') DEFAULT 'Available',
  quantity INT DEFAULT 0 COMMENT 'Number of units in stock',
  serial_number VARCHAR(100),
  purchase_date DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_type (type),
  UNIQUE KEY serial_number (serial_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
