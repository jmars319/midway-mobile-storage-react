<?php
/**
 * Change Password API Endpoint
 * Allows authenticated admin users to change their password
 */

require_once __DIR__ . '/../utils.php';
require_once __DIR__ . '/../database.php';

setCorsHeaders();

$method = $_SERVER['REQUEST_METHOD'];
$db = Database::getInstance();

try {
    // Only POST method allowed
    if ($method !== 'POST') {
        jsonResponse(['error' => 'Method not allowed'], 405);
    }
    
    // Require authentication
    requireAuth();
    
    // Get authenticated user from JWT token
    $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    $token = str_replace('Bearer ', '', $authHeader);
    $userData = verifyJWT($token);
    
    if (!$userData || !isset($userData['username'])) {
        jsonResponse(['error' => 'Invalid authentication'], 401);
    }
    
    $username = $userData['username'];
    
    // Get request data
    $data = getRequestBody();
    $currentPassword = $data['currentPassword'] ?? '';
    $newPassword = $data['newPassword'] ?? '';
    $confirmPassword = $data['confirmPassword'] ?? '';
    
    // Validation
    if (empty($currentPassword)) {
        jsonResponse(['error' => 'Current password is required'], 400);
    }
    
    if (empty($newPassword)) {
        jsonResponse(['error' => 'New password is required'], 400);
    }
    
    if (strlen($newPassword) < 8) {
        jsonResponse(['error' => 'New password must be at least 8 characters long'], 400);
    }
    
    if ($newPassword !== $confirmPassword) {
        jsonResponse(['error' => 'New password and confirmation do not match'], 400);
    }
    
    if ($currentPassword === $newPassword) {
        jsonResponse(['error' => 'New password must be different from current password'], 400);
    }
    
    // Get current user data
    $stmt = $db->query(
        "SELECT id, username, password FROM admin_users WHERE username = ?",
        [$username]
    );
    
    $user = $stmt->fetch();
    
    if (!$user) {
        jsonResponse(['error' => 'User not found'], 404);
    }
    
    // Verify current password
    if (!password_verify($currentPassword, $user['password'])) {
        jsonResponse(['error' => 'Current password is incorrect'], 401);
    }
    
    // Hash new password
    $hashedPassword = password_hash($newPassword, PASSWORD_BCRYPT, ['cost' => 12]);
    
    // Update password
    $db->query(
        "UPDATE admin_users SET password = ?, updated_at = NOW() WHERE id = ?",
        [$hashedPassword, $user['id']]
    );
    
    // Log the password change (optional, for security audit)
    if (DEBUG_MODE) {
        error_log("Password changed for user: {$username}");
    }
    
    jsonResponse([
        'ok' => true,
        'message' => 'Password changed successfully'
    ]);
    
} catch (Exception $e) {
    if (DEBUG_MODE) {
        error_log('Change Password API Error: ' . $e->getMessage());
    }
    
    jsonResponse(['error' => 'An error occurred changing your password'], 500);
}
