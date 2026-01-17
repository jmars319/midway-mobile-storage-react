-- Performance Optimization: Add indexes to frequently queried columns
-- Run this on production database after deployment
-- Compatible with MySQL 5.x and MariaDB

-- Quotes table indexes (skip if exists)
SELECT COUNT(*) INTO @exists FROM information_schema.statistics 
WHERE table_schema = DATABASE() AND table_name = 'quotes' AND index_name = 'idx_quotes_status';
SET @query = IF(@exists = 0, 'CREATE INDEX idx_quotes_status ON quotes(status)', 'SELECT "Index already exists"');
PREPARE stmt FROM @query; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SELECT COUNT(*) INTO @exists FROM information_schema.statistics 
WHERE table_schema = DATABASE() AND table_name = 'quotes' AND index_name = 'idx_quotes_createdAt';
SET @query = IF(@exists = 0, 'CREATE INDEX idx_quotes_createdAt ON quotes(createdAt)', 'SELECT "Index already exists"');
PREPARE stmt FROM @query; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SELECT COUNT(*) INTO @exists FROM information_schema.statistics 
WHERE table_schema = DATABASE() AND table_name = 'quotes' AND index_name = 'idx_quotes_email';
SET @query = IF(@exists = 0, 'CREATE INDEX idx_quotes_email ON quotes(email)', 'SELECT "Index already exists"');
PREPARE stmt FROM @query; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Messages table indexes
SELECT COUNT(*) INTO @exists FROM information_schema.statistics 
WHERE table_schema = DATABASE() AND table_name = 'messages' AND index_name = 'idx_messages_status';
SET @query = IF(@exists = 0, 'CREATE INDEX idx_messages_status ON messages(status)', 'SELECT "Index already exists"');
PREPARE stmt FROM @query; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SELECT COUNT(*) INTO @exists FROM information_schema.statistics 
WHERE table_schema = DATABASE() AND table_name = 'messages' AND index_name = 'idx_messages_createdAt';
SET @query = IF(@exists = 0, 'CREATE INDEX idx_messages_createdAt ON messages(createdAt)', 'SELECT "Index already exists"');
PREPARE stmt FROM @query; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SELECT COUNT(*) INTO @exists FROM information_schema.statistics 
WHERE table_schema = DATABASE() AND table_name = 'messages' AND index_name = 'idx_messages_email';
SET @query = IF(@exists = 0, 'CREATE INDEX idx_messages_email ON messages(email)', 'SELECT "Index already exists"');
PREPARE stmt FROM @query; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Job Applications table indexes
SELECT COUNT(*) INTO @exists FROM information_schema.statistics 
WHERE table_schema = DATABASE() AND table_name = 'job_applications' AND index_name = 'idx_job_applications_status';
SET @query = IF(@exists = 0, 'CREATE INDEX idx_job_applications_status ON job_applications(status)', 'SELECT "Index already exists"');
PREPARE stmt FROM @query; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SELECT COUNT(*) INTO @exists FROM information_schema.statistics 
WHERE table_schema = DATABASE() AND table_name = 'job_applications' AND index_name = 'idx_job_applications_created_at';
SET @query = IF(@exists = 0, 'CREATE INDEX idx_job_applications_created_at ON job_applications(created_at)', 'SELECT "Index already exists"');
PREPARE stmt FROM @query; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SELECT COUNT(*) INTO @exists FROM information_schema.statistics 
WHERE table_schema = DATABASE() AND table_name = 'job_applications' AND index_name = 'idx_job_applications_email';
SET @query = IF(@exists = 0, 'CREATE INDEX idx_job_applications_email ON job_applications(email)', 'SELECT "Index already exists"');
PREPARE stmt FROM @query; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- PanelSeal Orders table indexes
SELECT COUNT(*) INTO @exists FROM information_schema.statistics 
WHERE table_schema = DATABASE() AND table_name = 'panelseal_orders' AND index_name = 'idx_panelseal_orders_status';
SET @query = IF(@exists = 0, 'CREATE INDEX idx_panelseal_orders_status ON panelseal_orders(status)', 'SELECT "Index already exists"');
PREPARE stmt FROM @query; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SELECT COUNT(*) INTO @exists FROM information_schema.statistics 
WHERE table_schema = DATABASE() AND table_name = 'panelseal_orders' AND index_name = 'idx_panelseal_orders_created_at';
SET @query = IF(@exists = 0, 'CREATE INDEX idx_panelseal_orders_created_at ON panelseal_orders(created_at)', 'SELECT "Index already exists"');
PREPARE stmt FROM @query; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SELECT COUNT(*) INTO @exists FROM information_schema.statistics 
WHERE table_schema = DATABASE() AND table_name = 'panelseal_orders' AND index_name = 'idx_panelseal_orders_customer_email';
SET @query = IF(@exists = 0, 'CREATE INDEX idx_panelseal_orders_customer_email ON panelseal_orders(customer_email)', 'SELECT "Index already exists"');
PREPARE stmt FROM @query; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Admin Users table indexes
SELECT COUNT(*) INTO @exists FROM information_schema.statistics 
WHERE table_schema = DATABASE() AND table_name = 'admin_users' AND index_name = 'idx_admin_users_username';
SET @query = IF(@exists = 0, 'CREATE INDEX idx_admin_users_username ON admin_users(username)', 'SELECT "Index already exists"');
PREPARE stmt FROM @query; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Show indexes after creation
SHOW INDEX FROM quotes;
SHOW INDEX FROM messages;
SHOW INDEX FROM job_applications;
SHOW INDEX FROM panelseal_orders;
SHOW INDEX FROM admin_users;
