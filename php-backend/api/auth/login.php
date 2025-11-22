<?php
/**
 * Authentication Endpoint
 * Handles login and token generation
 */

require_once __DIR__ . '/../../utils.php';
require_once __DIR__ . '/../../database.php';

setCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['error' => 'Method not allowed'], 405);
}

try {
    $data = getRequestBody();
    
    $username = $data['username'] ?? '';
    $password = $data['password'] ?? '';
    
    if (empty($username) || empty($password)) {
        jsonResponse(['error' => 'Username and password are required'], 400);
    }
    
    $db = Database::getInstance();
    
    // Check if admin_users table exists, if not use default credentials
    try {
        $stmt = $db->query(
            "SELECT id, username, password FROM admin_users WHERE username = ? LIMIT 1",
            [$username]
        );
        $user = $stmt->fetch();
        
        if (!$user || !password_verify($password, $user['password'])) {
            jsonResponse(['error' => 'Invalid credentials'], 401);
        }
        
        $token = generateToken(['userId' => $user['id'], 'username' => $user['username']]);
        jsonResponse(['token' => $token, 'username' => $user['username']]);
        
    } catch (Exception $e) {
        // Fallback to default credentials if table doesn't exist
        if ($username === 'admin' && $password === 'admin123') {
            $token = generateToken(['userId' => 1, 'username' => 'admin']);
            jsonResponse(['token' => $token, 'username' => 'admin']);
        }
        
        jsonResponse(['error' => 'Invalid credentials'], 401);
    }
    
} catch (Exception $e) {
    if (DEBUG_MODE) {
        error_log('Login API Error: ' . $e->getMessage());
    }
    jsonResponse(['error' => 'Authentication failed'], 500);
}
