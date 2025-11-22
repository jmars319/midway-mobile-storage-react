<?php
/**
 * Site Settings API
 * Manage site-wide settings
 */

require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../database.php';
require_once __DIR__ . '/../utils.php';

setCorsHeaders();

requireAuth();

$db = Database::getInstance();

// GET - Fetch settings
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $stmt = $db->query("SELECT * FROM site_settings ORDER BY id DESC LIMIT 1");
        $settings = $stmt->fetch();
        
        if (!$settings) {
            // Return default empty settings
            jsonResponse(['settings' => [
                'businessName' => '',
                'email' => '',
                'phone' => '',
                'address' => '',
                'city' => '',
                'state' => '',
                'zip' => '',
                'country' => 'US',
                'hours' => '',
                'siteUrl' => ''
            ]]);
        } else {
            jsonResponse(['settings' => $settings]);
        }
    } catch (Exception $e) {
        error_log('Settings fetch error: ' . $e->getMessage());
        jsonResponse(['error' => 'Failed to fetch settings'], 500);
    }
}

// PUT - Update settings
elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    try {
        $data = getRequestBody();
        
        $businessName = sanitizeInput($data['businessName'] ?? '');
        $email = sanitizeInput($data['email'] ?? '');
        $phone = sanitizeInput($data['phone'] ?? '');
        $address = sanitizeInput($data['address'] ?? '');
        $city = sanitizeInput($data['city'] ?? '');
        $state = sanitizeInput($data['state'] ?? '');
        $zip = sanitizeInput($data['zip'] ?? '');
        $country = sanitizeInput($data['country'] ?? 'US');
        $hours = sanitizeInput($data['hours'] ?? '');
        $siteUrl = sanitizeInput($data['siteUrl'] ?? '');
        
        // Check if settings exist
        $stmt = $db->query("SELECT id FROM site_settings LIMIT 1");
        $existing = $stmt->fetch();
        
        if ($existing) {
            // Update existing
            $db->query(
                "UPDATE site_settings SET 
                    businessName = ?, email = ?, phone = ?, address = ?, 
                    city = ?, state = ?, zip = ?, country = ?, hours = ?, siteUrl = ?
                WHERE id = ?",
                [$businessName, $email, $phone, $address, $city, $state, $zip, $country, $hours, $siteUrl, $existing['id']]
            );
        } else {
            // Insert new
            $db->query(
                "INSERT INTO site_settings 
                    (businessName, email, phone, address, city, state, zip, country, hours, siteUrl) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                [$businessName, $email, $phone, $address, $city, $state, $zip, $country, $hours, $siteUrl]
            );
        }
        
        jsonResponse(['ok' => true, 'message' => 'Settings saved successfully']);
    } catch (Exception $e) {
        error_log('Settings update error: ' . $e->getMessage());
        jsonResponse(['error' => 'Failed to save settings'], 500);
    }
}

else {
    jsonResponse(['error' => 'Method not allowed'], 405);
}
