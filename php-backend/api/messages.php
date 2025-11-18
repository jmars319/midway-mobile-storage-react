<?php
/**
 * Messages API Endpoint
 * Handles contact form messages (GET, POST, PUT, DELETE)
 */

require_once __DIR__ . '/../utils.php';
require_once __DIR__ . '/../database.php';

setCorsHeaders();

$method = $_SERVER['REQUEST_METHOD'];
$db = Database::getInstance();

try {
    // GET - List messages (requires auth)
    if ($method === 'GET') {
        requireAuth();
        
        $stmt = $db->query(
            "SELECT id, name, email, subject, message, status, createdAt 
             FROM messages 
             ORDER BY createdAt DESC 
             LIMIT 100"
        );
        
        $messages = $stmt->fetchAll();
        jsonResponse(['messages' => $messages]);
    }
    
    // POST - Create new message (public, rate limited)
    elseif ($method === 'POST') {
        checkRateLimit('messages_form');
        
        $data = getRequestBody();
        
        $name = validateAndSanitize($data['name'] ?? '', 'Name', 255);
        $email = validateAndSanitize($data['email'] ?? '', 'Email', 255);
        
        if (!validateEmail($email)) {
            jsonResponse(['error' => 'Please enter a valid email address'], 400);
        }
        
        $subject = isset($data['subject']) ? sanitizeInput($data['subject']) : null;
        $message = isset($data['message']) ? sanitizeInput($data['message']) : null;
        $createdAt = getMySQLDateTime();
        
        $db->query(
            "INSERT INTO messages (name, email, subject, message, createdAt, status) 
             VALUES (?, ?, ?, ?, ?, 'new')",
            [$name, $email, $subject, $message, $createdAt]
        );
        
        $id = $db->lastInsertId();
        jsonResponse(['ok' => true, 'id' => $id], 201);
    }
    
    // PUT - Update message status (requires auth)
    elseif ($method === 'PUT') {
        requireAuth();
        
        $data = getRequestBody();
        $id = intval($data['id'] ?? 0);
        $status = sanitizeInput($data['status'] ?? '');
        
        if ($id <= 0) {
            jsonResponse(['error' => 'Invalid message ID'], 400);
        }
        
        $db->query(
            "UPDATE messages SET status = ? WHERE id = ?",
            [$status, $id]
        );
        
        jsonResponse(['ok' => true]);
    }
    
    // DELETE - Delete message (requires auth)
    elseif ($method === 'DELETE') {
        requireAuth();
        
        $pathParts = explode('/', trim($_SERVER['REQUEST_URI'], '/'));
        $id = intval(end($pathParts));
        
        if ($id <= 0) {
            jsonResponse(['error' => 'Invalid message ID'], 400);
        }
        
        $db->query("DELETE FROM messages WHERE id = ?", [$id]);
        
        jsonResponse(['ok' => true]);
    }
    
    else {
        jsonResponse(['error' => 'Method not allowed'], 405);
    }
    
} catch (Exception $e) {
    if (DEBUG_MODE) {
        error_log('Messages API Error: ' . $e->getMessage());
    }
    
    $message = (strpos($e->getMessage(), 'required') !== false || 
                strpos($e->getMessage(), 'Invalid') !== false ||
                strpos($e->getMessage(), 'must be') !== false)
        ? $e->getMessage()
        : 'An error occurred processing your request';
    
    jsonResponse(['error' => $message], 400);
}
