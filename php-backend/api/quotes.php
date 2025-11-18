<?php
/**
 * Quotes API Endpoint
 * Handles quote requests (GET, POST, PUT, DELETE)
 */

require_once __DIR__ . '/../utils.php';
require_once __DIR__ . '/../database.php';

setCorsHeaders();

$method = $_SERVER['REQUEST_METHOD'];
$db = Database::getInstance();

try {
    // GET - List quotes (requires auth)
    if ($method === 'GET') {
        requireAuth();
        
        $stmt = $db->query(
            "SELECT id, name, email, phone, serviceType, containerSize, quantity, duration, 
                    deliveryAddress, message, status, createdAt 
             FROM quotes 
             ORDER BY createdAt DESC 
             LIMIT 100"
        );
        
        $quotes = $stmt->fetchAll();
        jsonResponse(['quotes' => $quotes]);
    }
    
    // POST - Create new quote (public, rate limited)
    elseif ($method === 'POST') {
        checkRateLimit('quotes_form');
        
        $data = getRequestBody();
        
        $name = validateAndSanitize($data['name'] ?? '', 'Name', 255);
        $email = validateAndSanitize($data['email'] ?? '', 'Email', 255);
        
        if (!validateEmail($email)) {
            jsonResponse(['error' => 'Please enter a valid email address'], 400);
        }
        
        $phone = isset($data['phone']) ? sanitizeInput($data['phone']) : null;
        $serviceType = isset($data['serviceType']) ? sanitizeInput($data['serviceType']) : null;
        $containerSize = isset($data['containerSize']) ? sanitizeInput($data['containerSize']) : null;
        $quantity = isset($data['quantity']) ? intval($data['quantity']) : null;
        $duration = isset($data['duration']) ? sanitizeInput($data['duration']) : null;
        $deliveryAddress = isset($data['deliveryAddress']) ? sanitizeInput($data['deliveryAddress']) : null;
        $message = isset($data['message']) ? sanitizeInput($data['message']) : null;
        
        $createdAt = getMySQLDateTime();
        
        $db->query(
            "INSERT INTO quotes (name, email, phone, serviceType, containerSize, quantity, 
                                 duration, deliveryAddress, message, createdAt, status) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'new')",
            [$name, $email, $phone, $serviceType, $containerSize, $quantity, 
             $duration, $deliveryAddress, $message, $createdAt]
        );
        
        $id = $db->lastInsertId();
        jsonResponse(['ok' => true, 'id' => $id], 201);
    }
    
    // PUT - Update quote status (requires auth)
    elseif ($method === 'PUT') {
        requireAuth();
        
        $data = getRequestBody();
        $id = intval($data['id'] ?? 0);
        $status = sanitizeInput($data['status'] ?? '');
        
        if ($id <= 0) {
            jsonResponse(['error' => 'Invalid quote ID'], 400);
        }
        
        $db->query(
            "UPDATE quotes SET status = ? WHERE id = ?",
            [$status, $id]
        );
        
        jsonResponse(['ok' => true]);
    }
    
    // DELETE - Delete quote (requires auth)
    elseif ($method === 'DELETE') {
        requireAuth();
        
        $pathParts = explode('/', trim($_SERVER['REQUEST_URI'], '/'));
        $id = intval(end($pathParts));
        
        if ($id <= 0) {
            jsonResponse(['error' => 'Invalid quote ID'], 400);
        }
        
        $db->query("DELETE FROM quotes WHERE id = ?", [$id]);
        
        jsonResponse(['ok' => true]);
    }
    
    else {
        jsonResponse(['error' => 'Method not allowed'], 405);
    }
    
} catch (Exception $e) {
    jsonResponse(['error' => $e->getMessage()], 400);
}
