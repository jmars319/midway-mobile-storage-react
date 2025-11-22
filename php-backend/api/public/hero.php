<?php
/**
 * Public Hero Endpoint
 * Returns the active hero image (no authentication required)
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
                $originalName = $meta['originalName'] ?? null;
                
                $files[] = [
                    'name' => $filename,
                    'originalName' => $originalName,
                    'tags' => $tags,
                    'url' => '/uploads/' . rawurlencode($filename)
                ];
            }
        }
    }
    
    // Filter for hero tag
    $heroes = array_filter($files, function($file) {
        return is_array($file['tags']) && in_array('hero', $file['tags']);
    });
    
    if (empty($heroes)) {
        jsonResponse(['url' => null]);
    }
    
    // Return first hero
    $hero = array_values($heroes)[0];
    jsonResponse([
        'url' => $hero['url'],
        'name' => $hero['name'],
        'originalName' => $hero['originalName']
    ]);
    
} catch (Exception $e) {
    if (DEBUG_MODE) {
        error_log("Hero endpoint error: " . $e->getMessage());
    }
    jsonResponse(['error' => 'Failed to read uploads'], 500);
}
