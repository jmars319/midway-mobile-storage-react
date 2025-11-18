<?php
/**
 * Applications API Endpoint
 * Handles job applications (GET, POST, DELETE)
 */

require_once __DIR__ . '/../utils.php';
require_once __DIR__ . '/../database.php';

setCorsHeaders();

$method = $_SERVER['REQUEST_METHOD'];
$db = Database::getInstance();

try {
    // GET - List applications (requires auth)
    if ($method === 'GET') {
        requireAuth();
        
        $stmt = $db->query(
            "SELECT id, name, email, phone, position, resume, status, createdAt 
             FROM applications 
             ORDER BY createdAt DESC 
             LIMIT 100"
        );
        
        $applications = $stmt->fetchAll();
        jsonResponse(['applications' => $applications]);
    }
    
    // POST - Create new application (public, rate limited)
    elseif ($method === 'POST') {
        checkRateLimit('applications_form');
        
        $data = getRequestBody();
        
        $name = validateAndSanitize($data['name'] ?? '', 'Name', 255);
        $email = validateAndSanitize($data['email'] ?? '', 'Email', 255);
        
        if (!validateEmail($email)) {
            jsonResponse(['error' => 'Please enter a valid email address'], 400);
        }
        
        $phone = isset($data['phone']) ? sanitizeInput($data['phone']) : null;
        $position = isset($data['position']) ? sanitizeInput($data['position']) : null;
        $resume = isset($data['resumeName']) ? sanitizeInput($data['resumeName']) : null;
        $createdAt = getMySQLDateTime();
        
        $db->query(
            "INSERT INTO applications (name, email, phone, position, resume, createdAt, status) 
             VALUES (?, ?, ?, ?, ?, ?, 'new')",
            [$name, $email, $phone, $position, $resume, $createdAt]
        );
        
        $id = $db->lastInsertId();
        jsonResponse(['ok' => true, 'id' => $id], 201);
    }
    
    // DELETE - Delete application (requires auth)
    elseif ($method === 'DELETE') {
        requireAuth();
        
        $pathParts = explode('/', trim($_SERVER['REQUEST_URI'], '/'));
        $id = intval(end($pathParts));
        
        if ($id <= 0) {
            jsonResponse(['error' => 'Invalid application ID'], 400);
        }
        
        $db->query("DELETE FROM applications WHERE id = ?", [$id]);
        
        jsonResponse(['ok' => true]);
    }
    
    else {
        jsonResponse(['error' => 'Method not allowed'], 405);
    }
    
} catch (Exception $e) {
    jsonResponse(['error' => $e->getMessage()], 400);
}
