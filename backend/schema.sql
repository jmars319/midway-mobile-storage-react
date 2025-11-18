-- Site settings table for storing configurable business information
-- Used for structured data, contact info, and site metadata

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
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default settings if table is empty
INSERT INTO site_settings (businessName, email, phone, address, city, state, zip, country, hours, siteUrl)
SELECT 'Midway Mobile Storage', 'info@midwaystorage.example', '(555) 555-5555', '123 Storage Ave', 'Somewhere', 'State', '00000', 'US', 'Mon–Fri 8:00–17:00', 'https://midwaymobilestorage.com'
WHERE NOT EXISTS (SELECT 1 FROM site_settings LIMIT 1);

-- Quotes table for storing quote requests
CREATE TABLE IF NOT EXISTS quotes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  serviceType VARCHAR(100),
  containerSize VARCHAR(50),
  quantity VARCHAR(50),
  duration VARCHAR(50),
  deliveryAddress TEXT,
  message TEXT,
  status VARCHAR(50) DEFAULT 'new',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Messages table for contact form submissions
CREATE TABLE IF NOT EXISTS messages (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(255),
  message TEXT,
  status VARCHAR(50) DEFAULT 'new',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Applications table for career applications
CREATE TABLE IF NOT EXISTS applications (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  position VARCHAR(255),
  resume VARCHAR(500),
  status VARCHAR(50) DEFAULT 'new',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inventory table for container/trailer inventory management
CREATE TABLE IF NOT EXISTS inventory (
  id INT PRIMARY KEY AUTO_INCREMENT,
  type VARCHAR(100) NOT NULL,
  size VARCHAR(100),
  condition VARCHAR(50),
  location VARCHAR(255),
  price DECIMAL(10,2),
  status VARCHAR(50) DEFAULT 'available',
  notes TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders table for PanelSeal and other product orders
CREATE TABLE IF NOT EXISTS orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  customer VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  address TEXT,
  product VARCHAR(255) NOT NULL,
  quantity VARCHAR(50),
  notes TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admin users table for authentication (optional - PHP backend has fallback)
CREATE TABLE IF NOT EXISTS admin_users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
