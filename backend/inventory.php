<?php
/**
 * Inventory API Endpoint
 * Handles container/trailer inventory (GET, POST, PUT, DELETE)
 */

require_once __DIR__ . '/utils.php';
require_once __DIR__ . '/database.php';

setCorsHeaders();

$method = $_SERVER['REQUEST_METHOD'];
$db = Database::getInstance();

try {
    // GET - List inventory (requires auth)
    if ($method === 'GET') {
        requireAuth();
        
        $stmt = $db->query(
            "SELECT id, type, `condition`, status, quantity, created_at as createdAt 
             FROM inventory 
             ORDER BY created_at DESC 
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
        $condition = isset($data['condition']) ? sanitizeInput($data['condition']) : null;
        $status = isset($data['status']) ? sanitizeInput($data['status']) : 'Available';
        $quantity = isset($data['quantity']) ? intval($data['quantity']) : 1;
        
        if ($quantity < 0 || $quantity > 10000) {
            jsonResponse(['error' => 'Quantity must be between 0 and 10000'], 400);
        }
        
        $db->query(
            "INSERT INTO inventory (type, `condition`, status, quantity, created_at) 
             VALUES (?, ?, ?, ?, NOW())",
            [$type, $condition, $status, $quantity]
        );
        
        $id = $db->lastInsertId();
        
        // Fetch and return the created item
        $stmt = $db->query(
            "SELECT id, type, `condition`, status, quantity, created_at as createdAt 
             FROM inventory WHERE id = ?",
            [$id]
        );
        
        $item = $stmt->fetch();
        jsonResponse(['ok' => true, 'item' => $item], 201);
    }
    
    // PUT - Update inventory item (requires auth)
    elseif ($method === 'PUT') {
        requireAuth();
        
        $data = getRequestBody();
        
        // Handle both PUT with ID in URL or in body
        $pathParts = explode('/', trim($_SERVER['REQUEST_URI'], '/'));
        $urlId = intval(end($pathParts));
        $id = $urlId > 0 ? $urlId : intval($data['id'] ?? 0);
        
        if ($id <= 0) {
            jsonResponse(['error' => 'Invalid inventory ID'], 400);
        }
        
        // Build update query dynamically based on provided fields
        $fields = [];
        $params = [];
        
        if (isset($data['type'])) {
            $fields[] = 'type = ?';
            $params[] = validateAndSanitize($data['type'], 'Type', 100);
        }
        if (isset($data['condition'])) {
            $fields[] = '`condition` = ?';
            $params[] = sanitizeInput($data['condition']);
        }
        if (isset($data['status'])) {
            $fields[] = 'status = ?';
            $params[] = sanitizeInput($data['status']);
        }
        if (isset($data['quantity'])) {
            $quantity = intval($data['quantity']);
            if ($quantity < 0 || $quantity > 10000) {
                jsonResponse(['error' => 'Quantity must be between 0 and 10000'], 400);
            }
            $fields[] = 'quantity = ?';
            $params[] = $quantity;
        }
        
        if (empty($fields)) {
            jsonResponse(['error' => 'No fields to update'], 400);
        }
        
        $params[] = $id;
        $sql = "UPDATE inventory SET " . implode(', ', $fields) . " WHERE id = ?";
        
        $db->query($sql, $params);
        
        // Fetch and return the updated item
        $stmt = $db->query(
            "SELECT id, type, `condition`, status, quantity, created_at as createdAt 
             FROM inventory WHERE id = ?",
            [$id]
        );
        
        $item = $stmt->fetch();
        jsonResponse(['ok' => true, 'item' => $item]);
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
