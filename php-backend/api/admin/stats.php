<?php
/**
 * Admin Statistics Endpoint
 * Returns counts for dashboard widgets
 * GET /admin/stats - Get statistics
 */

require_once __DIR__ . '/../../config.php';
require_once __DIR__ . '/../../database.php';
require_once __DIR__ . '/../../utils.php';

setCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Require authentication for GET requests
    requireAuth();
    try {
        $db = Database::getInstance();
        
        // Get new quotes count
        $quotesStmt = $db->query("SELECT COUNT(*) as count FROM quotes WHERE status = 'new'");
        $quotesCount = $quotesStmt->fetch()['count'];
        
        // Get new messages count
        $messagesStmt = $db->query("SELECT COUNT(*) as count FROM messages WHERE status = 'new'");
        $messagesCount = $messagesStmt->fetch()['count'];
        
        // Get new job applications count
        $applicationsStmt = $db->query("SELECT COUNT(*) as count FROM job_applications WHERE status = 'new'");
        $applicationsCount = $applicationsStmt->fetch()['count'];
        
        // Get processing panelseal orders count
        $ordersStmt = $db->query("SELECT COUNT(*) as count FROM panelseal_orders WHERE status = 'processing'");
        $ordersCount = $ordersStmt->fetch()['count'];
        
        // Get inventory stats (sum quantities for accurate counts)
        $inventoryStmt = $db->query("SELECT 
            COALESCE(SUM(quantity), 0) as total,
            COALESCE(SUM(CASE WHEN status = 'Available' THEN quantity ELSE 0 END), 0) as available,
            COALESCE(SUM(CASE WHEN status = 'Rented' THEN quantity ELSE 0 END), 0) as rented
            FROM inventory");
        $inventoryStats = $inventoryStmt->fetch();
        
        jsonResponse([
            'quotes' => (int)$quotesCount,
            'messages' => (int)$messagesCount,
            'applications' => (int)$applicationsCount,
            'orders' => (int)$ordersCount,
            'inventory' => [
                'total' => (int)$inventoryStats['total'],
                'available' => (int)$inventoryStats['available'],
                'rented' => (int)$inventoryStats['rented']
            ]
        ]);
        
    } catch (Exception $e) {
        error_log('Error fetching stats: ' . $e->getMessage());
        jsonResponse(['error' => 'Failed to fetch statistics'], 500);
    }
} else {
    jsonResponse(['error' => 'Method not allowed'], 405);
}
