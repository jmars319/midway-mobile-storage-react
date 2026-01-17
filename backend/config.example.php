<?php
/**
 * Database and Application Configuration Template
 * Copy this file to config.php and update with your GoDaddy credentials
 */

// Database Configuration
// Get these from GoDaddy cPanel > MySQL Databases
define('DB_HOST', 'localhost');  // Usually localhost on shared hosting
define('DB_USER', 'cpanel_username_dbuser');  // Your cPanel username + database user
define('DB_PASS', 'your_secure_password_here');  // Database password
define('DB_NAME', 'cpanel_username_dbname');  // Your cPanel username + database name

// JWT Secret for authentication
// Generate a secure random string: https://www.grc.com/passwords.htm
define('JWT_SECRET', 'CHANGE_THIS_TO_A_LONG_RANDOM_STRING');

// Token expiration time (in seconds)
define('JWT_EXPIRATION', 43200); // 12 hours

// CORS Configuration
// Add your production domain(s) here
define('ALLOWED_ORIGINS', [
    'https://yourdomain.com',
    'https://www.yourdomain.com',
    'http://localhost:3000',  // Remove in production
    'http://localhost:3001'   // Remove in production
]);

// Rate Limiting (requests per time window)
define('RATE_LIMIT_REQUESTS', 10);
define('RATE_LIMIT_WINDOW', 300); // 5 minutes in seconds

// File Upload Configuration
define('UPLOAD_DIR', __DIR__ . '/uploads');
define('MAX_FILE_SIZE', 10485760); // 10MB in bytes
define('ALLOWED_MIME_TYPES', ['image/jpeg', 'image/png', 'image/gif', 'image/webp']);

// Error reporting
// Set to false in production!
define('DEBUG_MODE', false);

if (DEBUG_MODE) {
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
} else {
    error_reporting(0);
    ini_set('display_errors', 0);
}

// Timezone
date_default_timezone_set('America/New_York');
