-- Migration: Add legacy/auxiliary tables that exist in production
-- Safe to run on environments missing these tables.

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
