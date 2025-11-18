<?php
/**
 * Orders API Endpoint
 * Handles PanelSeal and product orders (GET, POST, DELETE)
 */

require_once __DIR__ . '/../utils.php';
require_once __DIR__ . '/../database.php';

setCorsHeaders();

$method = $_SERVER['REQUEST_METHOD'];
$db = Database::getInstance();

try {
    // GET - List orders (requires auth)
    if ($method === 'GET') {
        requireAuth();
        
        $stmt = $db->query(
            "SELECT id, customer, email, phone, address, product, quantity, notes, status, created_at 
             FROM orders 
             ORDER BY created_at DESC 
             LIMIT 100"
        );
        
        $orders = $stmt->fetchAll();
        jsonResponse(['orders' => $orders]);
    }
    
    // POST - Create new order (public, rate limited)
    elseif ($method === 'POST') {
        checkRateLimit('orders_form');
        
        $data = getRequestBody();
        
        $customer = validateAndSanitize($data['customer'] ?? '', 'Customer name', 255);
        $email = validateAndSanitize($data['email'] ?? '', 'Email', 255);
        
        if (!validateEmail($email)) {
            jsonResponse(['error' => 'Please enter a valid email address'], 400);
        }
        
        $phone = isset($data['phone']) ? sanitizeInput($data['phone']) : null;
        $address = isset($data['address']) ? sanitizeInput($data['address']) : null;
        $product = validateAndSanitize($data['product'] ?? '', 'Product', 255);
        $quantity = isset($data['quantity']) ? sanitizeInput($data['quantity']) : null;
        $notes = isset($data['notes']) ? sanitizeInput($data['notes']) : null;
        $createdAt = getMySQLDateTime();
        
        $db->query(
            "INSERT INTO orders (customer, email, phone, address, product, quantity, notes, created_at, status) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')",
            [$customer, $email, $phone, $address, $product, $quantity, $notes, $createdAt]
        );
        
        $id = $db->lastInsertId();
        jsonResponse(['ok' => true, 'id' => $id], 201);
    }
    
    // DELETE - Delete order (requires auth)
    elseif ($method === 'DELETE') {
        requireAuth();
        
        $pathParts = explode('/', trim($_SERVER['REQUEST_URI'], '/'));
        $id = intval(end($pathParts));
        
        if ($id <= 0) {
            jsonResponse(['error' => 'Invalid order ID'], 400);
        }
        
        $db->query("DELETE FROM orders WHERE id = ?", [$id]);
        
        jsonResponse(['ok' => true]);
    }
    
    else {
        jsonResponse(['error' => 'Method not allowed'], 405);
    }
    
} catch (Exception $e) {
    jsonResponse(['error' => $e->getMessage()], 400);
}
