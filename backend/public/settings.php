<?php
/**
 * Public Settings Endpoint
 * Returns site settings (no authentication required)
 */

require_once __DIR__ . '/../utils.php';
require_once __DIR__ . '/../database.php';

setCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonResponse(['error' => 'Method not allowed'], 405);
}

// Default fallback settings
$defaultSettings = [
    'businessName' => 'Midway Mobile Storage',
    'email' => 'midwaymobilestorage@gmail.com',
    'phone' => '(336) 764-4208',
    'address' => '212 Fred Sink Road',
    'city' => 'Winston-Salem',
    'state' => 'NC',
    'zip' => '27107',
    'country' => 'US',
    'hours' => 'Mon–Fri 8:00–17:00',
    'siteUrl' => 'https://midwaymobilestorage.com',
    'mapEmbedUrl' => '',
    'mapEmbedEnabled' => 0,
    'aboutTitle' => 'About Midway Mobile Storage',
    'aboutSubtitle' => 'Serving Winston-Salem and the Triad Area',
    'aboutSinceYear' => '1989',
    'aboutText1' => 'Since 1989, Midway Mobile Storage has been at the forefront of the portable storage industry in Winston-Salem, NC. With over three decades of experience, we\'ve built our reputation on delivering secure, affordable mobile storage solutions backed by unmatched expertise and customer service throughout North Carolina.',
    'aboutText2' => 'As pioneers in our market, we understand what our customers need — whether it\'s short-term job site storage, long-term container rentals, or premium waterproofing products like PanelSeal. Our commitment to quality and innovation has made us a trusted partner for businesses and individuals throughout Winston-Salem, Greensboro, High Point, and surrounding areas.',
    'aboutCommitments' => 'Quality Products,Professional Service,Flexible Solutions,Competitive Pricing'
];

try {
    $db = Database::getInstance();
    $stmt = $db->query("SELECT * FROM site_settings LIMIT 1");
    $settings = $stmt->fetch();
    
    if ($settings) {
        jsonResponse(['settings' => decodeOutput($settings)]);
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
