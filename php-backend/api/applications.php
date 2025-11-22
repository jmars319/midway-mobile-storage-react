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
            "SELECT id, name, email, phone, position, experience, message, 
                    resume_filename, resume_path, status, created_at, updated_at 
             FROM job_applications 
             ORDER BY created_at DESC 
             LIMIT 100"
        );
        
        $applications = $stmt->fetchAll();
        jsonResponse(['applications' => $applications]);
    }
    
    // POST - Create new application (public, rate limited)
    elseif ($method === 'POST') {
        checkRateLimit('applications_form');
        
        $data = getRequestBody();
        
        // Validate CSRF token
        $csrfToken = $data['csrf_token'] ?? '';
        if (!validateCsrfToken($csrfToken)) {
            jsonResponse(['error' => 'Invalid or missing CSRF token'], 403);
        }
        
        $name = validateAndSanitize($data['name'] ?? '', 'Name', 100);
        $email = validateAndSanitize($data['email'] ?? '', 'Email', 100);
        $phone = validateAndSanitize($data['phone'] ?? '', 'Phone', 20, false); // Phone is optional
        
        if (!validateEmail($email)) {
            jsonResponse(['error' => 'Please enter a valid email address'], 400);
        }
        
        $position = isset($data['position']) ? sanitizeInput($data['position']) : 'other';
        $experience = isset($data['experience']) ? sanitizeInput($data['experience']) : null;
        $message = isset($data['message']) ? sanitizeInput($data['message']) : null;
        
        $db->query(
            "INSERT INTO job_applications (name, email, phone, position, experience, message, status) 
             VALUES (?, ?, ?, ?, ?, ?, 'new')",
            [$name, $email, $phone, $position, $experience, $message]
        );
        
        $id = $db->lastInsertId();
        jsonResponse(['ok' => true, 'id' => $id], 201);
    }
    
    // PATCH - Update application status (requires auth)
    elseif ($method === 'PATCH') {
        requireAuth();
        
        $data = getRequestBody();
        $pathParts = explode('/', trim($_SERVER['REQUEST_URI'], '/'));
        $id = intval($pathParts[count($pathParts) - 2]); // Get ID before /status
        $status = sanitizeInput($data['status'] ?? '');
        
        if ($id <= 0) {
            jsonResponse(['error' => 'Invalid application ID'], 400);
        }
        
        $db->query(
            "UPDATE job_applications SET status = ? WHERE id = ?",
            [$status, $id]
        );
        
        // Return updated application
        $stmt = $db->query(
            "SELECT id, name, email, phone, position, experience, message, 
                    resume_filename, resume_path, status, created_at, updated_at 
             FROM job_applications 
             WHERE id = ?",
            [$id]
        );
        
        $application = $stmt->fetch();
        jsonResponse(['ok' => true, 'application' => $application]);
    }
    
    // DELETE - Delete application (requires auth)
    elseif ($method === 'DELETE') {
        requireAuth();
        
        $pathParts = explode('/', trim($_SERVER['REQUEST_URI'], '/'));
        $id = intval(end($pathParts));
        
        if ($id <= 0) {
            jsonResponse(['error' => 'Invalid application ID'], 400);
        }
        
        $db->query("DELETE FROM job_applications WHERE id = ?", [$id]);
        
        jsonResponse(['ok' => true]);
    }
    
    else {
        jsonResponse(['error' => 'Method not allowed'], 405);
    }
    
} catch (Exception $e) {
    // Always log errors for debugging
    error_log('Applications API Error: ' . $e->getMessage());
    error_log('Stack trace: ' . $e->getTraceAsString());
    
    $message = (strpos($e->getMessage(), 'required') !== false || 
                strpos($e->getMessage(), 'Invalid') !== false ||
                strpos($e->getMessage(), 'must be') !== false)
        ? $e->getMessage()
        : 'An error occurred processing your request';
    
    jsonResponse(['error' => $message], 400);
}
