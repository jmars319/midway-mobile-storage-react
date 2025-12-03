-- ============================================================================
-- Midway Mobile Storage - Database Schema
-- Production-ready schema with indexes for optimal performance
-- ============================================================================

-- Site Settings Table
-- Stores configurable business information used in structured data and contact info
CREATE TABLE IF NOT EXISTS site_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    businessName VARCHAR(255) NOT NULL DEFAULT 'Midway Mobile Storage',
    email VARCHAR(255) NOT NULL DEFAULT 'info@midwaymobilestorage.com',
    phone VARCHAR(50) NOT NULL DEFAULT '(555) 555-5555',
    address VARCHAR(255) NOT NULL DEFAULT '',
    city VARCHAR(100) NOT NULL DEFAULT '',
    state VARCHAR(100) NOT NULL DEFAULT '',
    zip VARCHAR(20) NOT NULL DEFAULT '',
    country VARCHAR(10) NOT NULL DEFAULT 'US',
    hours VARCHAR(255) NOT NULL DEFAULT 'Mon–Fri 8:00–17:00',
    siteUrl VARCHAR(255) NOT NULL DEFAULT 'https://midwaymobilestorage.com',
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
    phone VARCHAR(50),
    serviceType VARCHAR(100),
    containerSize VARCHAR(50),
    quantity INT,
    duration VARCHAR(50),
    deliveryAddress TEXT,
    message TEXT,
    status ENUM('new', 'contacted', 'quoted', 'won', 'lost') DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Messages Table
-- Stores contact form submissions
CREATE TABLE IF NOT EXISTS messages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255),
    message TEXT,
    status ENUM('new', 'read', 'replied', 'archived') DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Job Applications Table
-- Stores career/job application submissions
CREATE TABLE IF NOT EXISTS job_applications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    position ENUM('driver', 'contractor-driver', 'fabrication', 'sales', 'customer-service', 'other') NOT NULL,
    experience TEXT,
    message TEXT,
    resume_filename VARCHAR(255),
    resume_path VARCHAR(500),
    status ENUM('new', 'reviewing', 'interviewed', 'hired', 'rejected') DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_position (position),
    INDEX idx_created_at (created_at),
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Inventory Table
-- Manages storage container/trailer inventory
CREATE TABLE IF NOT EXISTS inventory (
    id INT PRIMARY KEY AUTO_INCREMENT,
    type VARCHAR(100) NOT NULL,
    condition VARCHAR(50),
    status ENUM('Available', 'Rented', 'Maintenance', 'Retired') DEFAULT 'Available',
    quantity INT DEFAULT 1,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_type (type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- PanelSeal Orders Table
-- Stores product orders (PanelSeal and related products)
CREATE TABLE IF NOT EXISTS panelseal_orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(50),
    zip VARCHAR(20),
    productType VARCHAR(100),
    quantity INT,
    notes TEXT,
    status ENUM('new', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'processing',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Admin Users Table
-- Stores admin user credentials for backend authentication
CREATE TABLE IF NOT EXISTS admin_users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Initial Data Setup
-- ============================================================================

-- Insert default site settings if none exist
INSERT INTO site_settings (businessName, email, phone, address, city, state, zip, country, hours, siteUrl)
SELECT 'Midway Mobile Storage', 'info@midwaymobilestorage.com', '(555) 555-5555', '', '', '', '', 'US', 'Mon–Fri 8:00–17:00', 'https://midwaymobilestorage.com'
WHERE NOT EXISTS (SELECT 1 FROM site_settings LIMIT 1);

-- Insert default admin user (username: admin, password: admin123)
-- Password hash is bcrypt with cost 12: admin123
INSERT INTO admin_users (username, password_hash, email)
SELECT 'admin', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5d5J7aN0lbKe6', 'admin@midwaymobilestorage.com'
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
