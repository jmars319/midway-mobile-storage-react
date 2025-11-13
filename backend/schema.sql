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
