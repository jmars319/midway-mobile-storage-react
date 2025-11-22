<?php
/**
 * Public Services Media Endpoint
 * Returns mapping of service slugs to image URLs (no authentication required)
 */

require_once __DIR__ . '/../../utils.php';

setCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonResponse(['error' => 'Method not allowed'], 405);
}

try {
    $uploadsDir = __DIR__ . '/../../uploads';
    $metaFile = $uploadsDir . '/media.json';
    
    // Read metadata
    $metadata = [];
    if (file_exists($metaFile)) {
        $content = file_get_contents($metaFile);
        $metadata = json_decode($content, true) ?? [];
    }
    
    // Scan uploads directory
    $files = [];
    if (is_dir($uploadsDir)) {
        $allFiles = array_diff(scandir($uploadsDir), ['.', '..', 'media.json']);
        foreach ($allFiles as $filename) {
            $filePath = $uploadsDir . '/' . $filename;
            if (is_file($filePath)) {
                $meta = $metadata[$filename] ?? [];
                $tags = $meta['tags'] ?? [];
                
                $files[] = [
                    'name' => $filename,
                    'tags' => $tags,
                    'url' => '/uploads/' . rawurlencode($filename)
                ];
            }
        }
    }
    
    // Build service slug to URL mapping
    $map = [];
    foreach ($files as $file) {
        if (!is_array($file['tags'])) continue;
        
        foreach ($file['tags'] as $tag) {
            if (is_string($tag) && strpos($tag, 'service:') === 0) {
                $slug = substr($tag, 8); // Remove 'service:' prefix
                // Only include first occurrence (uniqueness)
                if (!isset($map[$slug])) {
                    $map[$slug] = $file['url'];
                }
            }
        }
    }
    
    jsonResponse($map);
    
} catch (Exception $e) {
    if (DEBUG_MODE) {
        error_log("Services media endpoint error: " . $e->getMessage());
    }
    jsonResponse(['error' => 'Failed to read uploads'], 500);
}
