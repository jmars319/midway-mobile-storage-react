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

try {
    $db = Database::getInstance();
    
    // Create admin_users table if it doesn't exist
    $db->query("
        CREATE TABLE IF NOT EXISTS admin_users (
            id INT PRIMARY KEY AUTO_INCREMENT,
            username VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ");
    
    // Hash the password
    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
    
    // Check if user exists
    $stmt = $db->query("SELECT id FROM admin_users WHERE username = ?", [$username]);
    
    if ($stmt->fetch()) {
        // Update existing user
        $db->query(
            "UPDATE admin_users SET password = ? WHERE username = ?",
            [$hashedPassword, $username]
        );
        echo "Admin user updated successfully!\n";
    } else {
        // Insert new user
        $db->query(
            "INSERT INTO admin_users (username, password) VALUES (?, ?)",
            [$username, $hashedPassword]
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
