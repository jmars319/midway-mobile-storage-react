<?php
/**
 * CSRF Token API Endpoint
 * Provides CSRF tokens for public forms
 */

require_once __DIR__ . '/../utils.php';

setCorsHeaders();

$method = $_SERVER['REQUEST_METHOD'];

try {
    // GET - Get CSRF token (public)
    if ($method === 'GET') {
        checkRateLimit('csrf_token');
        
        $token = generateCsrfToken();
        jsonResponse(['csrf_token' => $token]);
    } else {
        jsonResponse(['error' => 'Method not allowed'], 405);
    }
} catch (Exception $e) {
    error_log("CSRF Token Error: " . $e->getMessage());
    jsonResponse(['error' => 'Internal server error'], 500);
}
