<?php
/**
 * Inventory API Endpoint
 * Handles container/trailer inventory (GET, POST, PUT, DELETE)
 */

require_once __DIR__ . '/../utils.php';
require_once __DIR__ . '/../database.php';

setCorsHeaders();

$method = $_SERVER['REQUEST_METHOD'];
$db = Database::getInstance();

try {
    // GET - List inventory (requires auth)
    if ($method === 'GET') {
        requireAuth();
        
        $stmt = $db->query(
            "SELECT id, type, size, `condition`, location, price, status, notes, createdAt 
             FROM inventory 
             ORDER BY createdAt DESC 
             LIMIT 100"
        );
        
        $inventory = $stmt->fetchAll();
        jsonResponse(['inventory' => $inventory]);
    }
    
    // POST - Create inventory item (requires auth)
    elseif ($method === 'POST') {
        requireAuth();
        
        $data = getRequestBody();
        
        $type = validateAndSanitize($data['type'] ?? '', 'Type', 100);
        $size = isset($data['size']) ? sanitizeInput($data['size']) : null;
        $condition = isset($data['condition']) ? sanitizeInput($data['condition']) : null;
        $location = isset($data['location']) ? sanitizeInput($data['location']) : null;
        $price = isset($data['price']) ? floatval($data['price']) : null;
        $status = isset($data['status']) ? sanitizeInput($data['status']) : 'available';
        $notes = isset($data['notes']) ? sanitizeInput($data['notes']) : null;
        $createdAt = getMySQLDateTime();
        
        $db->query(
            "INSERT INTO inventory (type, size, `condition`, location, price, status, notes, createdAt) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [$type, $size, $condition, $location, $price, $status, $notes, $createdAt]
        );
        
        $id = $db->lastInsertId();
        jsonResponse(['ok' => true, 'id' => $id], 201);
    }
    
    // PUT - Update inventory item (requires auth)
    elseif ($method === 'PUT') {
        requireAuth();
        
        $data = getRequestBody();
        $id = intval($data['id'] ?? 0);
        
        if ($id <= 0) {
            jsonResponse(['error' => 'Invalid inventory ID'], 400);
        }
        
        $type = validateAndSanitize($data['type'] ?? '', 'Type', 100);
        $size = isset($data['size']) ? sanitizeInput($data['size']) : null;
        $condition = isset($data['condition']) ? sanitizeInput($data['condition']) : null;
        $location = isset($data['location']) ? sanitizeInput($data['location']) : null;
        $price = isset($data['price']) ? floatval($data['price']) : null;
        $status = isset($data['status']) ? sanitizeInput($data['status']) : 'available';
        $notes = isset($data['notes']) ? sanitizeInput($data['notes']) : null;
        
        $db->query(
            "UPDATE inventory 
             SET type = ?, size = ?, `condition` = ?, location = ?, price = ?, status = ?, notes = ? 
             WHERE id = ?",
            [$type, $size, $condition, $location, $price, $status, $notes, $id]
        );
        
        jsonResponse(['ok' => true]);
    }
    
    // DELETE - Delete inventory item (requires auth)
    elseif ($method === 'DELETE') {
        requireAuth();
        
        $pathParts = explode('/', trim($_SERVER['REQUEST_URI'], '/'));
        $id = intval(end($pathParts));
        
        if ($id <= 0) {
            jsonResponse(['error' => 'Invalid inventory ID'], 400);
        }
        
        $db->query("DELETE FROM inventory WHERE id = ?", [$id]);
        
        jsonResponse(['ok' => true]);
    }
    
    else {
        jsonResponse(['error' => 'Method not allowed'], 405);
    }
    
} catch (Exception $e) {
    if (DEBUG_MODE) {
        error_log('Inventory API Error: ' . $e->getMessage());
    }
    
    $message = (strpos($e->getMessage(), 'required') !== false || 
                strpos($e->getMessage(), 'Invalid') !== false ||
                strpos($e->getMessage(), 'must be') !== false)
        ? $e->getMessage()
        : 'An error occurred processing your request';
    
    jsonResponse(['error' => $message], 400);
}
