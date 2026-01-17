<?php
/**
 * One-time migration script to optimize existing uploaded images
 * Run this once to convert all existing uploads to optimized WebP format
 * 
 * Usage: php optimize-existing-uploads.php
 */

require_once __DIR__ . '/config.php';

$uploadsDir = __DIR__ . '/uploads';
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
 * Optimize image to WebP with size/dimension limits
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
    if (!$imageInfo) {
        echo "  ⚠️  Could not read image info\n";
        return false;
    }
    
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
            echo "  ⚠️  Unsupported image type\n";
            return false;
    }
    
    if (!$source) {
        echo "  ⚠️  Failed to create image resource\n";
        return false;
    }
    
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
    
    // Preserve transparency
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
    
    if (!$success) {
        echo "  ⚠️  Failed to save WebP\n";
        return false;
    }
    
    return $webpPath;
}

// Main migration logic
echo "===========================================\n";
echo "Optimizing Existing Uploads\n";
echo "===========================================\n\n";

$meta = getMediaMeta($metaFile);
$optimizedCount = 0;
$skippedCount = 0;
$errorCount = 0;

foreach ($meta as $filename => $info) {
    $filepath = $uploadsDir . '/' . $filename;
    
    // Skip if already optimized
    if (isset($info['optimized']) && $info['optimized'] === true) {
        echo "⏭️  Skipped: $filename (already optimized)\n";
        $skippedCount++;
        continue;
    }
    
    // Skip if file doesn't exist
    if (!file_exists($filepath)) {
        echo "⚠️  Missing: $filename (file not found)\n";
        $errorCount++;
        continue;
    }
    
    // Skip if already WebP and doesn't need resizing
    if (pathinfo($filename, PATHINFO_EXTENSION) === 'webp') {
        $imageInfo = @getimagesize($filepath);
        if ($imageInfo) {
            list($width, $height) = $imageInfo;
            $maxDim = in_array('logo', $info['tags'] ?? []) ? 800 : 1920;
            
            if ($width <= $maxDim && $height <= $maxDim) {
                echo "⏭️  Skipped: $filename (already WebP with correct dimensions)\n";
                $meta[$filename]['optimized'] = true;
                $skippedCount++;
                continue;
            }
        }
    }
    
    echo "🔄 Processing: $filename\n";
    echo "   Original size: " . number_format(filesize($filepath) / 1024, 2) . " KB\n";
    
    $tags = $info['tags'] ?? [];
    $optimizedPath = optimizeImage($filepath, $tags);
    
    if ($optimizedPath === false) {
        echo "   ❌ Failed to optimize\n\n";
        $errorCount++;
        continue;
    }
    
    $newFilename = basename($optimizedPath);
    $newSize = filesize($optimizedPath);
    
    echo "   ✅ Optimized to: $newFilename\n";
    echo "   New size: " . number_format($newSize / 1024, 2) . " KB\n";
    
    // Update metadata with new filename
    $meta[$newFilename] = $info;
    $meta[$newFilename]['optimized'] = true;
    
    // Remove old metadata entry if filename changed
    if ($newFilename !== $filename) {
        unset($meta[$filename]);
        
        // Delete original file if it still exists and is different
        if (file_exists($filepath) && $filepath !== $optimizedPath) {
            @unlink($filepath);
            echo "   🗑️  Deleted original: $filename\n";
        }
    }
    
    echo "\n";
    $optimizedCount++;
}

// Save updated metadata
saveMediaMeta($metaFile, $meta);

echo "===========================================\n";
echo "Migration Complete!\n";
echo "===========================================\n";
echo "✅ Optimized: $optimizedCount files\n";
echo "⏭️  Skipped: $skippedCount files\n";
echo "❌ Errors: $errorCount files\n";
echo "\nMetadata updated in: $metaFile\n";
