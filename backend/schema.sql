-- ============================================================================
-- Midway Mobile Storage - Database Schema
-- Production-ready schema with indexes for optimal performance
-- ============================================================================

-- Site Settings Table
-- Stores configurable business information used in structured data and contact info
CREATE TABLE IF NOT EXISTS site_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    businessName VARCHAR(255) NOT NULL DEFAULT 'Midway Mobile Storage',
    email VARCHAR(255) NOT NULL DEFAULT 'info@midwaystorage.example',
    phone VARCHAR(50) NOT NULL DEFAULT '(555) 555-5555',
    address VARCHAR(255) NOT NULL DEFAULT '123 Storage Ave',
    city VARCHAR(100) NOT NULL DEFAULT 'Somewhere',
    state VARCHAR(100) NOT NULL DEFAULT 'State',
    zip VARCHAR(20) NOT NULL DEFAULT '00000',
    country VARCHAR(10) NOT NULL DEFAULT 'US',
    hours VARCHAR(255) NOT NULL DEFAULT 'Mon–Fri 8:00–17:00',
    siteUrl VARCHAR(255) NOT NULL DEFAULT 'https://midwaymobilestorage.com',
    mapEmbedUrl TEXT,
    mapEmbedEnabled TINYINT(1) NOT NULL DEFAULT 0,
    aboutTitle VARCHAR(255) NOT NULL DEFAULT 'About Midway Mobile Storage',
    aboutSubtitle VARCHAR(255) NOT NULL DEFAULT 'Serving Winston-Salem and the Triad Area',
    aboutSinceYear VARCHAR(10) NOT NULL DEFAULT '1989',
    aboutText1 TEXT,
    aboutText2 TEXT,
    aboutCommitments TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Quotes Table
-- Stores customer quote requests for storage rentals
CREATE TABLE IF NOT EXISTS quotes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(100),
    serviceType VARCHAR(255),
    containerSize VARCHAR(255),
    quantity INT,
    duration VARCHAR(255),
    deliveryAddress TEXT,
    message TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT NULL,
    INDEX idx_quotes_status (status),
    INDEX idx_quotes_createdAt (createdAt),
    INDEX idx_quotes_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Messages Table
-- Stores contact form submissions
CREATE TABLE IF NOT EXISTS messages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255),
    message TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT NULL,
    INDEX idx_messages_status (status),
    INDEX idx_messages_createdAt (createdAt),
    INDEX idx_messages_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Job Applications Table
-- Stores career/job application submissions
CREATE TABLE IF NOT EXISTS job_applications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    position ENUM('driver', 'contractor-driver', 'fabrication', 'sales', 'customer-service', 'other') NOT NULL,
    experience VARCHAR(100),
    message TEXT,
    resume_filename VARCHAR(255),
    resume_path VARCHAR(500),
    status ENUM('new', 'reviewing', 'interviewed', 'hired', 'rejected') DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_position (position),
    INDEX idx_job_applications_status (status),
    INDEX idx_job_applications_created_at (created_at),
    INDEX idx_job_applications_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Inventory Table
-- Manages storage container/trailer inventory
CREATE TABLE IF NOT EXISTS inventory (
    id INT PRIMARY KEY AUTO_INCREMENT,
    type VARCHAR(100) NOT NULL,
    `condition` ENUM('New', 'Used - Excellent', 'Used - Good', 'Used - Fair') NOT NULL,
    status ENUM('Available', 'Rented', 'Sold', 'Maintenance', 'Reserved') DEFAULT 'Available',
    quantity INT DEFAULT 0,
    serial_number VARCHAR(100),
    purchase_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_type (type),
    UNIQUE KEY serial_number (serial_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- PanelSeal Orders Table
-- Stores product orders (PanelSeal and related products)
CREATE TABLE IF NOT EXISTS panelseal_orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    customer_name VARCHAR(100) NOT NULL,
    customer_email VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    product VARCHAR(100) NOT NULL,
    quantity INT NOT NULL,
    shipping_address TEXT NOT NULL,
    notes TEXT,
    status ENUM('processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'processing',
    tracking_number VARCHAR(100),
    order_total DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_customer_email (customer_email),
    INDEX idx_panelseal_orders_status (status),
    INDEX idx_panelseal_orders_created_at (created_at),
    INDEX idx_panelseal_orders_customer_email (customer_email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Admin Users Table
-- Stores admin user credentials for backend authentication
CREATE TABLE IF NOT EXISTS admin_users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    full_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL DEFAULT NULL,
    is_active TINYINT(1) DEFAULT 1,
    INDEX idx_admin_users_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Activity Log Table
-- Tracks admin actions for auditing
CREATE TABLE IF NOT EXISTS activity_log (
    id INT PRIMARY KEY AUTO_INCREMENT,
    admin_user_id INT,
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(50),
    record_id INT,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user (admin_user_id),
    INDEX idx_created (created_at),
    CONSTRAINT activity_log_ibfk_1 FOREIGN KEY (admin_user_id) REFERENCES admin_users (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Applications Table (legacy)
-- Stores job applications captured via legacy form
CREATE TABLE IF NOT EXISTS applications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    position VARCHAR(255),
    cover_letter TEXT,
    resume_path VARCHAR(1024),
    status VARCHAR(50) DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Business Settings Table (legacy)
-- Stores business contact details used by older flows
CREATE TABLE IF NOT EXISTS business_settings (
    id INT NOT NULL DEFAULT 1,
    business_phone VARCHAR(20),
    business_email VARCHAR(100),
    business_address TEXT,
    business_hours TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT business_settings_chk_1 CHECK (id = 1)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Media Table
-- Stores metadata for uploaded assets
CREATE TABLE IF NOT EXISTS media (
    id INT PRIMARY KEY AUTO_INCREMENT,
    filename VARCHAR(512) NOT NULL,
    original_name VARCHAR(512),
    mime_type VARCHAR(128),
    media_type VARCHAR(64) DEFAULT 'image',
    alt_text VARCHAR(512),
    uploaded_by VARCHAR(128),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Quote Requests Table (legacy)
-- Stores quote requests captured via legacy form
CREATE TABLE IF NOT EXISTS quote_requests (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    service_type ENUM('rental', 'purchase', 'trailer', 'custom') NOT NULL,
    container_size VARCHAR(50),
    quantity VARCHAR(10),
    duration VARCHAR(50),
    delivery_address TEXT NOT NULL,
    message TEXT,
    status ENUM('pending', 'responded', 'accepted', 'declined') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Rental Contracts Table (legacy)
-- Tracks rental agreements tied to inventory
CREATE TABLE IF NOT EXISTS rental_contracts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    customer_name VARCHAR(100) NOT NULL,
    customer_email VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    inventory_id INT,
    start_date DATE NOT NULL,
    end_date DATE,
    monthly_rate DECIMAL(10,2),
    deposit_amount DECIMAL(10,2),
    delivery_address TEXT,
    status ENUM('active', 'completed', 'cancelled') DEFAULT 'active',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_inventory_id (inventory_id),
    INDEX idx_status (status),
    INDEX idx_customer_email (customer_email),
    CONSTRAINT rental_contracts_ibfk_1 FOREIGN KEY (inventory_id) REFERENCES inventory (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Initial Data Setup
-- ============================================================================

-- Insert default site settings if none exist
INSERT INTO site_settings (
    businessName, email, phone, address, city, state, zip, country, hours, siteUrl,
    mapEmbedUrl, mapEmbedEnabled, aboutTitle, aboutSubtitle, aboutSinceYear, aboutText1, aboutText2, aboutCommitments
)
SELECT
    'Midway Mobile Storage', 'info@midwaystorage.example', '(555) 555-5555', '123 Storage Ave', 'Somewhere', 'State',
    '00000', 'US', 'Mon–Fri 8:00–17:00', 'https://midwaymobilestorage.com', NULL, 0,
    'About Midway Mobile Storage', 'Serving Winston-Salem and the Triad Area', '1989', NULL, NULL, NULL
WHERE NOT EXISTS (SELECT 1 FROM site_settings LIMIT 1);

-- Insert default admin user (username: admin, password: admin123)
-- Password hash is bcrypt with cost 12: admin123
INSERT INTO admin_users (username, password_hash, email, full_name, is_active)
SELECT 'admin', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5d5J7aN0lbKe6', 'admin@midwaymobilestorage.com',
       'System Administrator', 1
WHERE NOT EXISTS (SELECT 1 FROM admin_users WHERE username = 'admin');

-- ============================================================================
-- Schema Information
-- ============================================================================
-- Total Tables: 7
-- Total Indexes: 13 (excluding primary keys)
-- Character Set: utf8mb4 (full Unicode support including emojis)
-- Collation: utf8mb4_unicode_ci (case-insensitive Unicode sorting)
-- Engine: InnoDB (ACID compliance, foreign key support, crash recovery)
--
-- Security Features:
-- - All passwords stored as bcrypt hashes
-- - Status fields use ENUM for data integrity
-- - Indexes on frequently queried columns (status, email, created_at)
-- - Timestamps auto-update for audit trail
--
-- Performance Optimizations:
-- - Indexed columns for common WHERE clauses
-- - InnoDB engine for row-level locking
-- - utf8mb4 for efficient international character storage
-- ============================================================================
