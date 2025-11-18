<?php
/**
 * Utility Functions
 * Common helper functions for validation, sanitization, CORS, etc.
 */

require_once __DIR__ . '/config.php';

/**
 * Set CORS headers
 */
function setCorsHeaders() {
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    
    if (in_array($origin, ALLOWED_ORIGINS)) {
        header("Access-Control-Allow-Origin: $origin");
    }
    
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Max-Age: 3600");
    
    // Handle preflight OPTIONS request
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
}

/**
 * Send JSON response
 */
function jsonResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}

/**
 * Sanitize input to prevent XSS
 */
function sanitizeInput($input) {
    if (is_array($input)) {
        return array_map('sanitizeInput', $input);
    }
    return htmlspecialchars(strip_tags(trim($input)), ENT_QUOTES, 'UTF-8');
}

/**
 * Validate email address
 */
function validateEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

/**
 * Validate and sanitize input with length check
 */
function validateAndSanitize($input, $fieldName, $maxLength = 255, $required = true) {
    if ($required && empty($input)) {
        throw new Exception("$fieldName is required");
    }
    
    $sanitized = sanitizeInput($input);
    
    if (strlen($sanitized) > $maxLength) {
        throw new Exception("$fieldName must be less than $maxLength characters");
    }
    
    return $sanitized;
}

/**
 * Get Bearer token from Authorization header
 */
function getBearerToken() {
    $headers = getallheaders();
    $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';
    
    if (preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
        return $matches[1];
    }
    
    return null;
}

/**
 * Check rate limiting using session
 */
function checkRateLimit($key, $limit = RATE_LIMIT_REQUESTS, $window = RATE_LIMIT_WINDOW) {
    session_start();
    
    $now = time();
    $rateLimitKey = "rate_limit_$key";
    
    if (!isset($_SESSION[$rateLimitKey])) {
        $_SESSION[$rateLimitKey] = ['count' => 0, 'reset' => $now + $window];
    }
    
    $rateData = $_SESSION[$rateLimitKey];
    
    // Reset if window expired
    if ($now > $rateData['reset']) {
        $_SESSION[$rateLimitKey] = ['count' => 1, 'reset' => $now + $window];
        return true;
    }
    
    // Check if limit exceeded
    if ($rateData['count'] >= $limit) {
        $retryAfter = $rateData['reset'] - $now;
        header("Retry-After: $retryAfter");
        jsonResponse([
            'error' => 'Too many requests. Please try again later.',
            'retryAfter' => $retryAfter
        ], 429);
    }
    
    // Increment counter
    $_SESSION[$rateLimitKey]['count']++;
    return true;
}

/**
 * Get current datetime in MySQL format
 */
function getMySQLDateTime() {
    return date('Y-m-d H:i:s');
}

/**
 * Get request body as array
 */
function getRequestBody() {
    $body = file_get_contents('php://input');
    return json_decode($body, true) ?? [];
}

/**
 * Verify JWT token
 */
function verifyToken($token) {
    if (empty($token)) {
        return false;
    }
    
    // Simple JWT validation (base64 encoded payload with signature)
    $parts = explode('.', $token);
    
    if (count($parts) !== 3) {
        return false;
    }
    
    list($header, $payload, $signature) = $parts;
    
    // Verify signature
    $validSignature = hash_hmac('sha256', "$header.$payload", JWT_SECRET, true);
    $validSignature = base64_encode($validSignature);
    $validSignature = str_replace(['+', '/', '='], ['-', '_', ''], $validSignature);
    
    if ($signature !== $validSignature) {
        return false;
    }
    
    // Check expiration
    $payloadData = json_decode(base64_decode($payload), true);
    
    if (!isset($payloadData['exp']) || $payloadData['exp'] < time()) {
        return false;
    }
    
    return $payloadData;
}

/**
 * Generate JWT token
 */
function generateToken($data) {
    $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
    $payload = json_encode(array_merge($data, ['exp' => time() + JWT_EXPIRATION]));
    
    $base64Header = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($header));
    $base64Payload = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($payload));
    
    $signature = hash_hmac('sha256', "$base64Header.$base64Payload", JWT_SECRET, true);
    $base64Signature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));
    
    return "$base64Header.$base64Payload.$base64Signature";
}

/**
 * Require authentication
 */
function requireAuth() {
    $token = getBearerToken();
    $payload = verifyToken($token);
    
    if (!$payload) {
        jsonResponse(['error' => 'Unauthorized'], 401);
    }
    
    return $payload;
}
