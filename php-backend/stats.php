<?php
/**
 * Database Stats Script
 * View statistics about your database tables
 * 
 * Usage: php stats.php
 */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/database.php';

try {
    $db = Database::getInstance();
    
    echo "=== Midway Mobile Storage Database Statistics ===\n\n";
    
    // Quotes
    $stmt = $db->query("SELECT COUNT(*) as total, 
                        SUM(CASE WHEN status = 'new' THEN 1 ELSE 0 END) as new,
                        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
                        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed
                        FROM quotes");
    $quotes = $stmt->fetch();
    echo "Quotes:\n";
    echo "  Total: {$quotes['total']}\n";
    echo "  New: {$quotes['new']}\n";
    echo "  Pending: {$quotes['pending']}\n";
    echo "  Completed: {$quotes['completed']}\n\n";
    
    // Messages
    $stmt = $db->query("SELECT COUNT(*) as total,
                        SUM(CASE WHEN status = 'new' THEN 1 ELSE 0 END) as new,
                        SUM(CASE WHEN status = 'read' THEN 1 ELSE 0 END) as read
                        FROM messages");
    $messages = $stmt->fetch();
    echo "Messages:\n";
    echo "  Total: {$messages['total']}\n";
    echo "  New: {$messages['new']}\n";
    echo "  Read: {$messages['read']}\n\n";
    
    // Applications
    $stmt = $db->query("SELECT COUNT(*) as total FROM applications");
    $applications = $stmt->fetch();
    echo "Job Applications: {$applications['total']}\n\n";
    
    // Orders
    $stmt = $db->query("SELECT COUNT(*) as total,
                        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
                        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed
                        FROM orders");
    $orders = $stmt->fetch();
    echo "Orders:\n";
    echo "  Total: {$orders['total']}\n";
    echo "  Pending: {$orders['pending']}\n";
    echo "  Completed: {$orders['completed']}\n\n";
    
    // Inventory
    $stmt = $db->query("SELECT COUNT(*) as total,
                        SUM(CASE WHEN status = 'available' THEN 1 ELSE 0 END) as available,
                        SUM(CASE WHEN status = 'rented' THEN 1 ELSE 0 END) as rented,
                        SUM(CASE WHEN status = 'maintenance' THEN 1 ELSE 0 END) as maintenance
                        FROM inventory");
    $inventory = $stmt->fetch();
    echo "Inventory:\n";
    echo "  Total: {$inventory['total']}\n";
    echo "  Available: {$inventory['available']}\n";
    echo "  Rented: {$inventory['rented']}\n";
    echo "  Maintenance: {$inventory['maintenance']}\n\n";
    
    echo "===============================================\n";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    exit(1);
}
