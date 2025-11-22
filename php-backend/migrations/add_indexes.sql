-- Performance Optimization: Add indexes to frequently queried columns
-- Run this on production database after deployment

-- Quotes table indexes
CREATE INDEX IF NOT EXISTS idx_quotes_status ON quotes(status);
CREATE INDEX IF NOT EXISTS idx_quotes_createdAt ON quotes(createdAt);
CREATE INDEX IF NOT EXISTS idx_quotes_email ON quotes(email);

-- Messages table indexes
CREATE INDEX IF NOT EXISTS idx_messages_status ON messages(status);
CREATE INDEX IF NOT EXISTS idx_messages_createdAt ON messages(createdAt);
CREATE INDEX IF NOT EXISTS idx_messages_email ON messages(email);

-- Job Applications table indexes
CREATE INDEX IF NOT EXISTS idx_job_applications_status ON job_applications(status);
CREATE INDEX IF NOT EXISTS idx_job_applications_created_at ON job_applications(created_at);
CREATE INDEX IF NOT EXISTS idx_job_applications_email ON job_applications(email);

-- PanelSeal Orders table indexes
CREATE INDEX IF NOT EXISTS idx_panelseal_orders_status ON panelseal_orders(status);
CREATE INDEX IF NOT EXISTS idx_panelseal_orders_created_at ON panelseal_orders(created_at);
CREATE INDEX IF NOT EXISTS idx_panelseal_orders_customer_email ON panelseal_orders(customer_email);

-- Admin Users table indexes
CREATE INDEX IF NOT EXISTS idx_admin_users_username ON admin_users(username);

-- Show indexes after creation
SHOW INDEX FROM quotes;
SHOW INDEX FROM messages;
SHOW INDEX FROM job_applications;
SHOW INDEX FROM panelseal_orders;
SHOW INDEX FROM admin_users;
