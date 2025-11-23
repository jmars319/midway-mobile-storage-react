<?php
/**
 * Media Management API
 * Handles media uploads, tagging, and deletion
 */

require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../utils.php';

setCorsHeaders();

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

$method = $_SERVER['REQUEST_METHOD'];

// GET - List all media
if ($method === 'GET') {
    requireAuth();
    
    try {
        $meta = getMediaMeta($metaFile);
        $media = [];
        
        // Get filter tag if provided (sanitize input)
        $filterTag = isset($_GET['tag']) ? sanitizeInput($_GET['tag']) : null;
        
        foreach ($meta as $filename => $info) {
            $filepath = $uploadsDir . '/' . $filename;
            if (file_exists($filepath)) {
                // Filter by tag if specified
                if ($filterTag && $filterTag !== 'all') {
                    if (!isset($info['tags']) || !in_array($filterTag, $info['tags'])) {
                        continue;
                    }
                }
                
                $media[] = [
                    'name' => $filename,
                    'originalName' => $info['originalName'] ?? $filename,
                    'url' => '/uploads/' . $filename,
                    'tags' => $info['tags'] ?? [],
                    'uploadedAt' => $info['uploadedAt'] ?? null
                ];
            }
        }
        
        jsonResponse(['media' => $media]);
    } catch (Exception $e) {
        error_log('Media list error: ' . $e->getMessage());
        jsonResponse(['error' => 'Failed to list media'], 500);
    }
}

// POST - Upload new media
elseif ($method === 'POST') {
    requireAuth();
    
    try {
        if (!isset($_FILES['file'])) {
            jsonResponse(['error' => 'No file uploaded'], 400);
        }
        
        $file = $_FILES['file'];
        
        // Validate file
        if ($file['error'] !== UPLOAD_ERR_OK) {
            jsonResponse(['error' => 'File upload failed'], 400);
        }
        
        // Generate unique filename
        $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
        $filename = md5(uniqid() . $file['name']);
        if ($ext) $filename .= '.' . $ext;
        
        $targetPath = $uploadsDir . '/' . $filename;
        
        // Move uploaded file
        if (!move_uploaded_file($file['tmp_name'], $targetPath)) {
            jsonResponse(['error' => 'Failed to save file'], 500);
        }
        
        // Get tags from request
        $tags = [];
        if (isset($_POST['tags'])) {
            $tagsData = json_decode($_POST['tags'], true);
            if (is_array($tagsData)) {
                $tags = $tagsData;
            }
        }
        
        // Update metadata
        $meta = getMediaMeta($metaFile);
        $meta[$filename] = [
            'originalName' => $file['name'],
            'tags' => $tags,
            'uploadedAt' => date('Y-m-d H:i:s')
        ];
        saveMediaMeta($metaFile, $meta);
        
        jsonResponse([
            'ok' => true,
            'file' => [
                'name' => $filename,
                'originalName' => $file['name'],
                'url' => '/uploads/' . $filename,
                'tags' => $tags
            ]
        ], 201);
    } catch (Exception $e) {
        error_log('Media upload error: ' . $e->getMessage());
        jsonResponse(['error' => 'Upload failed'], 500);
    }
}

// DELETE - Delete media file
elseif ($method === 'DELETE') {
    requireAuth();
    
    try {
        // Get filename from URL path
        $pathParts = explode('/', trim($_SERVER['REQUEST_URI'], '/'));
        $filename = end($pathParts);
        $filename = urldecode($filename);
        
        if (empty($filename)) {
            jsonResponse(['error' => 'No filename specified'], 400);
        }
        
        // Security check - prevent path traversal
        if (strpos($filename, '..') !== false || strpos($filename, '/') !== false) {
            jsonResponse(['error' => 'Invalid filename'], 400);
        }
        
        $filepath = $uploadsDir . '/' . $filename;
        
        // Delete file
        if (file_exists($filepath)) {
            unlink($filepath);
        }
        
        // Remove from metadata
        $meta = getMediaMeta($metaFile);
        if (isset($meta[$filename])) {
            unset($meta[$filename]);
            saveMediaMeta($metaFile, $meta);
        }
        
        jsonResponse(['ok' => true]);
    } catch (Exception $e) {
        error_log('Media delete error: ' . $e->getMessage());
        jsonResponse(['error' => 'Delete failed'], 500);
    }
}

else {
    jsonResponse(['error' => 'Method not allowed'], 405);
}
