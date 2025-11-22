<?php
/**
 * Public Settings Endpoint
 * Returns site settings (no authentication required)
 */

require_once __DIR__ . '/../../utils.php';
require_once __DIR__ . '/../../database.php';

setCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonResponse(['error' => 'Method not allowed'], 405);
}

// Default fallback settings
$defaultSettings = [
    'businessName' => 'Midway Mobile Storage',
    'email' => 'info@midwaystorage.example',
    'phone' => '(555) 555-5555',
    'address' => '123 Storage Ave',
    'city' => 'Somewhere',
    'state' => 'State',
    'zip' => '00000',
    'country' => 'US',
    'hours' => 'Mon–Fri 8:00–17:00',
    'siteUrl' => 'https://midwaymobilestorage.com'
];

try {
    $db = Database::getInstance();
    $stmt = $db->query("SELECT * FROM site_settings LIMIT 1");
    $settings = $stmt->fetch();
    
    if ($settings) {
        jsonResponse(['settings' => $settings]);
    } else {
        jsonResponse(['settings' => $defaultSettings]);
    }
    
} catch (Exception $e) {
    if (DEBUG_MODE) {
        error_log("Settings endpoint error: " . $e->getMessage());
    }
    // Return defaults on any error
    jsonResponse(['settings' => $defaultSettings]);
}
