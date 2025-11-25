<?php
/**
 * Public Logo Endpoint
 * Returns the active logo image (no authentication required)
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
                    'url' => '/api/uploads/' . rawurlencode($filename)
                ];
            }
        }
    }
    
    // Filter for logo tag
    $logos = array_filter($files, function($file) {
        return is_array($file['tags']) && in_array('logo', $file['tags']);
    });
    
    if (empty($logos)) {
        jsonResponse(['url' => null]);
    }
    
    // Return first logo
    $logo = array_values($logos)[0];
    jsonResponse([
        'url' => $logo['url'],
        'name' => $logo['name'],
        'originalName' => $logo['originalName']
    ]);
    
} catch (Exception $e) {
    if (DEBUG_MODE) {
        error_log("Logo endpoint error: " . $e->getMessage());
    }
    jsonResponse(['error' => 'Failed to read uploads'], 500);
}
