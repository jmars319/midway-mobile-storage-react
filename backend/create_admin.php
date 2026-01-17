<?php
/**
 * Create Admin User Script
 * Run this once to create a secure admin user in the database
 * 
 * Usage: php create_admin.php
 */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/database.php';

// Configuration
$username = 'admin';
$password = 'admin123'; // Change this to your desired password
$email = 'admin@midwaymobilestorage.com';
$fullName = 'System Administrator';
$isActive = 1;

try {
    $db = Database::getInstance();
    
    // Create admin_users table if it doesn't exist
    $db->query("
        CREATE TABLE IF NOT EXISTS admin_users (
            id INT PRIMARY KEY AUTO_INCREMENT,
            username VARCHAR(255) NOT NULL UNIQUE,
            password_hash VARCHAR(255) NOT NULL,
            email VARCHAR(100) NOT NULL UNIQUE,
            full_name VARCHAR(100),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            last_login TIMESTAMP NULL DEFAULT NULL,
            is_active TINYINT(1) DEFAULT 1
        )
    ");
    
    // Hash the password
    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
    
    // Check if user exists
    $stmt = $db->query("SELECT id FROM admin_users WHERE username = ?", [$username]);
    
    if ($stmt->fetch()) {
        // Update existing user
        $db->query(
            "UPDATE admin_users SET password_hash = ?, email = ?, full_name = ?, is_active = ? WHERE username = ?",
            [$hashedPassword, $email, $fullName, $isActive, $username]
        );
        echo "Admin user updated successfully!\n";
    } else {
        // Insert new user
        $db->query(
            "INSERT INTO admin_users (username, password_hash, email, full_name, is_active) VALUES (?, ?, ?, ?, ?)",
            [$username, $hashedPassword, $email, $fullName, $isActive]
        );
        echo "Admin user created successfully!\n";
    }
    
    echo "\nCredentials:\n";
    echo "Username: $username\n";
    echo "Password: $password\n";
    echo "\n⚠️  IMPORTANT: Change the password in this script and delete it after creating your admin user!\n";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    exit(1);
}
