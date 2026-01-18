<?php
/**
 * PHP Built-in Server Router
 * Routes requests to appropriate API endpoints
 */

// Load utilities and config for CORS
require_once __DIR__ . '/utils.php';

// Set CORS headers for all requests
setCorsHeaders();

$requestUri = $_SERVER['REQUEST_URI'];
$requestMethod = $_SERVER['REQUEST_METHOD'];

// Remove query string
$path = parse_url($requestUri, PHP_URL_PATH);

// Remove leading slash
$path = ltrim($path, '/');

// Remove /api prefix if present (for production .htaccess routing)
if (strpos($path, 'api/') === 0) {
    $path = substr($path, 4); // Remove 'api/'
}

// Route mapping
$routes = [
    'health' => 'health.php',
    'auth/login' => 'auth/login.php',
    'auth/change-password' => 'change-password.php',
    'csrf-token' => 'csrf-token.php',
    'admin/stats' => 'admin/stats.php',
    'public/logo' => 'public/logo.php',
    'public/hero' => 'public/hero.php',
    'public/services-media' => 'public/services-media.php',
    'public/settings' => 'public/settings.php',
    'quotes' => 'quotes.php',
    'messages' => 'messages.php',
    'applications' => 'applications.php',
    'orders' => 'orders.php',
    'inventory' => 'inventory.php',
    'media' => 'media.php',
    'settings' => 'settings.php',
];

// Check for exact match
if (isset($routes[$path])) {
    require __DIR__ . '/' . $routes[$path];
    exit;
}

// Check for media tags route (media/{filename}/tags)
if (preg_match('#^media/([^/]+)/tags$#', $path, $matches)) {
    require __DIR__ . '/media/tags.php';
    exit;
}

// Check for media delete route (media/{filename})
if (preg_match('#^media/([^/]+)$#', $path, $matches) && $_SERVER['REQUEST_METHOD'] === 'DELETE') {
    require __DIR__ . '/media.php';
    exit;
}

// Check for routes with IDs (e.g., quotes/123, applications/123/status)
foreach ($routes as $route => $file) {
    // Match routes with /id/status pattern
    if (preg_match('#^' . preg_quote($route, '#') . '/(\d+)/status$#', $path, $matches)) {
        $_GET['id'] = $matches[1];
        $_GET['action'] = 'status';
        require __DIR__ . '/' . $file;
        exit;
    }
    // Match routes with /id pattern
    if (preg_match('#^' . preg_quote($route, '#') . '/(\d+)$#', $path, $matches)) {
        $_GET['id'] = $matches[1];
        require __DIR__ . '/' . $file;
        exit;
    }
}

// Serve static files from uploads directory
if (preg_match('#^uploads/(.+)$#', $path, $matches)) {
    // Prevent path traversal attacks
    $filename = basename($matches[1]);
    $filePath = __DIR__ . '/uploads/' . $filename;
    $realPath = realpath($filePath);
    $uploadsDir = realpath(__DIR__ . '/uploads/');
    
    if ($realPath && $uploadsDir && strpos($realPath, $uploadsDir) === 0 && is_file($realPath)) {
        // Determine content type - use finfo for files without extensions
        if (function_exists('finfo_open')) {
            $finfo = finfo_open(FILEINFO_MIME_TYPE);
            $contentType = finfo_file($finfo, $realPath);
            finfo_close($finfo);
        } else {
            // Fallback to extension-based detection
            $ext = strtolower(pathinfo($filePath, PATHINFO_EXTENSION));
            $mimeTypes = [
                'jpg' => 'image/jpeg',
                'jpeg' => 'image/jpeg',
                'png' => 'image/png',
                'gif' => 'image/gif',
                'webp' => 'image/webp',
                'svg' => 'image/svg+xml',
            ];
            $contentType = $mimeTypes[$ext] ?? 'application/octet-stream';
        }
        
        header('Content-Type: ' . $contentType);
        header('Content-Length: ' . filesize($filePath));
        readfile($filePath);
        exit;
    }
}

// Not found
http_response_code(404);
header('Content-Type: application/json');
echo json_encode(['error' => 'Endpoint not found']);
