<?php
/**
 * PHP Built-in Server Router
 * Routes requests to appropriate API endpoints
 */

$requestUri = $_SERVER['REQUEST_URI'];
$requestMethod = $_SERVER['REQUEST_METHOD'];

// Remove query string
$path = parse_url($requestUri, PHP_URL_PATH);

// Remove leading slash
$path = ltrim($path, '/');

// Route mapping
$routes = [
    'health' => 'health.php',
    'auth/login' => 'auth/login.php',
    'public/logo' => 'public/logo.php',
    'public/hero' => 'public/hero.php',
    'public/services-media' => 'public/services-media.php',
    'public/settings' => 'public/settings.php',
    'quotes' => 'quotes.php',
    'messages' => 'messages.php',
    'applications' => 'applications.php',
    'orders' => 'orders.php',
    'inventory' => 'inventory.php',
];

// Check for exact match
if (isset($routes[$path])) {
    require __DIR__ . '/' . $routes[$path];
    exit;
}

// Check for routes with IDs (e.g., quotes/123)
foreach ($routes as $route => $file) {
    if (preg_match('#^' . preg_quote($route, '#') . '/(\d+)$#', $path, $matches)) {
        $_GET['id'] = $matches[1];
        require __DIR__ . '/' . $file;
        exit;
    }
}

// Serve static files from uploads directory
if (preg_match('#^uploads/(.+)$#', $path, $matches)) {
    $filePath = __DIR__ . '/../uploads/' . $matches[1];
    if (file_exists($filePath) && is_file($filePath)) {
        // Determine content type
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
