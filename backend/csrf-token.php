<?php
/**
 * CSRF Token API Endpoint
 * Provides CSRF tokens for public forms
 */

require_once __DIR__ . '/utils.php';

setCorsHeaders();

$method = $_SERVER['REQUEST_METHOD'];

try {
    // GET - Get CSRF token (public)
    // Note: CSRF token endpoint is not rate limited because:
    // 1. It only reads/generates a session token (no database or expensive operations)
    // 2. Multiple forms on a page need tokens simultaneously
    // 3. Rate limiting here causes UX issues when users navigate between pages
    // 4. The actual form submissions are rate limited instead
    if ($method === 'GET') {
        header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
        header('Pragma: no-cache');
        header('Expires: 0');
        $token = generateCsrfToken();
        jsonResponse(['csrf_token' => $token]);
    } else {
        jsonResponse(['error' => 'Method not allowed'], 405);
    }
} catch (Exception $e) {
    error_log("CSRF Token Error: " . $e->getMessage());
    jsonResponse(['error' => 'Internal server error'], 500);
}
