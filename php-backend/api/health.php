<?php
/**
 * Health Check Endpoint
 * Simple endpoint to verify API is working
 */

require_once __DIR__ . '/../utils.php';

setCorsHeaders();

jsonResponse([
    'status' => 'ok',
    'time' => time() * 1000 // milliseconds for consistency with Node version
]);
