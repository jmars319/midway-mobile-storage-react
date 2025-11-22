-- Migration: Add quantity column to inventory table and update schema
-- Run this on existing databases that were created with backend/schema.sql
-- Compatible with MySQL 5.x and MariaDB

-- Add quantity column if it doesn't exist
SET @dbname = DATABASE();
SET @tablename = 'inventory';
SET @columnname = 'quantity';
SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
   WHERE (table_name = @tablename)
   AND (table_schema = @dbname)
   AND (column_name = @columnname)) > 0,
  'SELECT 1',
  CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' INT DEFAULT 1 AFTER status')
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Add created_at column if it doesn't exist (some schemas may have createdAt instead)
SET @columnname = 'created_at';
SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
   WHERE (table_name = @tablename)
   AND (table_schema = @dbname)
   AND (column_name = @columnname)) > 0,
  'SELECT 1',
  CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' TIMESTAMP DEFAULT CURRENT_TIMESTAMP')
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Update any existing records to have a default quantity
UPDATE inventory SET quantity = 1 WHERE quantity IS NULL OR quantity = 0;

-- Show updated structure
DESCRIBE inventory;

-- Sample query to verify
SELECT id, type, `condition`, status, quantity, created_at FROM inventory LIMIT 5;
