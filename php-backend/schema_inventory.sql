-- Updated schema for inventory table
-- Use this for NEW database installations
-- For existing databases, use fix_inventory_schema.sql migration instead

CREATE TABLE IF NOT EXISTS inventory (
  id INT PRIMARY KEY AUTO_INCREMENT,
  type VARCHAR(100) NOT NULL COMMENT 'Container type (e.g., 20ft Container, 40ft Container)',
  `condition` VARCHAR(50) COMMENT 'Condition (e.g., New, Used, Refurbished)',
  status VARCHAR(50) DEFAULT 'Available' COMMENT 'Status (Available, Unavailable, Rented, Sold)',
  quantity INT DEFAULT 1 COMMENT 'Number of units in stock',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
