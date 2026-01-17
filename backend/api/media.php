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

/**
 * Validate uploaded file meets size/type requirements
 */
function validateUploadedFile($file, $maxSizeMB = 10) {
    $allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    $allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
    
    // Check file size (convert MB to bytes)
    $maxSizeBytes = $maxSizeMB * 1024 * 1024;
    if ($file['size'] > $maxSizeBytes) {
        return ['valid' => false, 'error' => "File too large. Maximum {$maxSizeMB}MB allowed."];
    }
    
    // Check MIME type
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mimeType = finfo_file($finfo, $file['tmp_name']);
    finfo_close($finfo);
    
    if (!in_array($mimeType, $allowedTypes)) {
        return ['valid' => false, 'error' => 'Only image files (JPG, PNG, WebP, GIF) allowed.'];
    }
    
    // Check extension
    $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    if (!in_array($ext, $allowedExtensions)) {
        return ['valid' => false, 'error' => 'Invalid file extension.'];
    }
    
    return ['valid' => true];
}

/**
 * Optimize uploaded image to WebP with size/dimension limits
 * Returns path to optimized file or false on failure
 */
function optimizeImage($sourcePath, $tags = [], $maxWidth = 1920, $maxHeight = 1080, $quality = 85) {
    // Adjust settings based on image purpose
    if (in_array('logo', $tags)) {
        $maxWidth = 800;
        $maxHeight = 400;
        $quality = 90;
    } elseif (in_array('gallery', $tags)) {
        $maxWidth = 1200;
        $maxHeight = 800;
        $quality = 80;
    }
    
    // Get image info
    $imageInfo = @getimagesize($sourcePath);
    if (!$imageInfo) return false;
    
    list($width, $height, $type) = $imageInfo;
    
    // Load image based on type
    switch ($type) {
        case IMAGETYPE_JPEG:
            $source = @imagecreatefromjpeg($sourcePath);
            break;
        case IMAGETYPE_PNG:
            $source = @imagecreatefrompng($sourcePath);
            break;
        case IMAGETYPE_WEBP:
            $source = @imagecreatefromwebp($sourcePath);
            break;
        case IMAGETYPE_GIF:
            $source = @imagecreatefromgif($sourcePath);
            break;
        default:
            return false; // Unsupported type
    }
    
    if (!$source) return false;
    
    // Calculate new dimensions (maintain aspect ratio)
    if ($width > $maxWidth || $height > $maxHeight) {
        $ratio = min($maxWidth / $width, $maxHeight / $height);
        $newWidth = round($width * $ratio);
        $newHeight = round($height * $ratio);
    } else {
        $newWidth = $width;
        $newHeight = $height;
    }
    
    // Create resized image
    $resized = imagecreatetruecolor($newWidth, $newHeight);
    
    // Preserve transparency for PNG/WebP
    imagealphablending($resized, false);
    imagesavealpha($resized, true);
    
    // Resize
    imagecopyresampled($resized, $source, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);
    
    // Save as WebP
    $webpPath = preg_replace('/\.[^.]+$/', '', $sourcePath) . '.webp';
    $success = @imagewebp($resized, $webpPath, $quality);
    
    // Cleanup
    imagedestroy($source);
    imagedestroy($resized);
    
    // Delete original if WebP creation succeeded and it's a different file
    if ($success && $webpPath !== $sourcePath && file_exists($sourcePath)) {
        @unlink($sourcePath);
        return $webpPath;
    }
    
    return $success ? $webpPath : false;
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
                    'url' => '/api/uploads/' . $filename,
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
        
        // Validate file size and type (10MB max)
        $validation = validateUploadedFile($file, 10);
        if (!$validation['valid']) {
            jsonResponse(['error' => $validation['error']], 400);
        }
        
        // Get tags from request (needed for optimization settings)
        $tags = [];
        if (isset($_POST['tags'])) {
            $tagsData = json_decode($_POST['tags'], true);
            if (is_array($tagsData)) {
                $tags = $tagsData;
            }
        }
        
        // Generate unique filename (keep original extension temporarily)
        $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
        $filename = md5(uniqid() . $file['name']);
        if ($ext) $filename .= '.' . $ext;
        
        $targetPath = $uploadsDir . '/' . $filename;
        
        // Move uploaded file
        if (!move_uploaded_file($file['tmp_name'], $targetPath)) {
            jsonResponse(['error' => 'Failed to save file'], 500);
        }
        
        // Auto-optimize image to WebP (uses tag-based settings)
        $optimizedPath = optimizeImage($targetPath, $tags);
        
        if ($optimizedPath === false) {
            // If optimization fails, delete upload and error
            @unlink($targetPath);
            jsonResponse(['error' => 'Failed to process image'], 500);
        }
        
        // Use optimized filename for storage
        $finalFilename = basename($optimizedPath);
        
        // Update metadata
        $meta = getMediaMeta($metaFile);
        $meta[$finalFilename] = [
            'originalName' => $file['name'],
            'tags' => $tags,
            'uploadedAt' => date('Y-m-d H:i:s'),
            'optimized' => true
        ];
        saveMediaMeta($metaFile, $meta);
        
        jsonResponse([
            'ok' => true,
            'file' => [
                'name' => $finalFilename,
                'originalName' => $file['name'],
                'url' => '/api/uploads/' . $finalFilename,
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
