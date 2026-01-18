<?php
/**
 * Media Tags API
 * Update tags for a specific media file
 */

require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../utils.php';

setCorsHeaders();

requireAuth();

$uploadsDir = __DIR__ . '/../uploads';
$metaFile = $uploadsDir . '/media.json';

// Helper to read media metadata
function getMediaMeta($metaFile) {
    if (!file_exists($metaFile)) return [];
    $content = file_get_contents($metaFile);
    return json_decode($content, true) ?: [];
}

// Helper to save media metadata
function saveMediaMeta($metaFile, $meta) {
    file_put_contents($metaFile, json_encode($meta, JSON_PRETTY_PRINT));
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // Get filename from URL
        $pathParts = explode('/', trim($_SERVER['REQUEST_URI'], '/'));
        // Find 'media' in path and get filename after it
        $mediaIndex = array_search('media', $pathParts);
        if ($mediaIndex === false || !isset($pathParts[$mediaIndex + 1])) {
            jsonResponse(['error' => 'Invalid request'], 400);
        }
        $filename = urldecode($pathParts[$mediaIndex + 1]);
        
        // Security check
        if (strpos($filename, '..') !== false || strpos($filename, '/') !== false) {
            jsonResponse(['error' => 'Invalid filename'], 400);
        }
        
        // Get tags from request body
        $data = getRequestBody();
        $tags = $data['tags'] ?? [];
        
        if (!is_array($tags)) {
            jsonResponse(['error' => 'Tags must be an array'], 400);
        }
        
        // Update metadata
        $meta = getMediaMeta($metaFile);
        if (!isset($meta[$filename])) {
            jsonResponse(['error' => 'File not found'], 404);
        }
        
        $meta[$filename]['tags'] = $tags;
        saveMediaMeta($metaFile, $meta);
        
        jsonResponse(['ok' => true, 'tags' => $tags]);
    } catch (Exception $e) {
        error_log('Media tags update error: ' . $e->getMessage());
        jsonResponse(['error' => 'Failed to update tags'], 500);
    }
} else {
    jsonResponse(['error' => 'Method not allowed'], 405);
}
