-- Migration: Add quantity column to inventory table and update schema
-- Run this on existing databases that were created with backend/schema.sql

-- Add quantity column if it doesn't exist
ALTER TABLE inventory 
ADD COLUMN IF NOT EXISTS quantity INT DEFAULT 1 AFTER status;

-- Add created_at column if it doesn't exist (some schemas may have createdAt instead)
ALTER TABLE inventory 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Update any existing records to have a default quantity
UPDATE inventory SET quantity = 1 WHERE quantity IS NULL OR quantity = 0;

-- Show updated structure
DESCRIBE inventory;

-- Sample query to verify
SELECT id, type, `condition`, status, quantity, created_at FROM inventory LIMIT 5;
