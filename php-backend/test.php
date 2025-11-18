<?php
/**
 * Test Script for PHP Backend
 * Tests all API endpoints to verify functionality
 * 
 * Usage: php test.php
 */

$API_BASE = 'http://localhost/api'; // Change to your test URL

echo "=== Midway Mobile Storage API Test Suite ===\n\n";

// Test 1: Health Check
echo "1. Testing Health Endpoint...\n";
$response = file_get_contents("$API_BASE/health");
$data = json_decode($response, true);
if ($data['status'] === 'ok') {
    echo "   ✓ Health check passed\n\n";
} else {
    echo "   ✗ Health check failed\n\n";
}

// Test 2: Login
echo "2. Testing Login...\n";
$loginData = json_encode([
    'username' => 'admin',
    'password' => 'admin123'
]);

$context = stream_context_create([
    'http' => [
        'method' => 'POST',
        'header' => "Content-Type: application/json\r\n",
        'content' => $loginData
    ]
]);

$response = file_get_contents("$API_BASE/auth/login", false, $context);
$data = json_decode($response, true);

if (isset($data['token'])) {
    echo "   ✓ Login successful\n";
    $token = $data['token'];
    echo "   Token: " . substr($token, 0, 20) . "...\n\n";
} else {
    echo "   ✗ Login failed\n\n";
    exit(1);
}

// Test 3: Create Quote (Public)
echo "3. Testing Create Quote (Public)...\n";
$quoteData = json_encode([
    'name' => 'Test Customer',
    'email' => 'test@example.com',
    'phone' => '555-1234',
    'serviceType' => 'rental',
    'containerSize' => '20ft',
    'quantity' => 1,
    'message' => 'Test quote from PHP'
]);

$context = stream_context_create([
    'http' => [
        'method' => 'POST',
        'header' => "Content-Type: application/json\r\n",
        'content' => $quoteData
    ]
]);

$response = file_get_contents("$API_BASE/quotes", false, $context);
$data = json_decode($response, true);

if ($data['ok'] && isset($data['id'])) {
    echo "   ✓ Quote created successfully (ID: {$data['id']})\n\n";
    $quoteId = $data['id'];
} else {
    echo "   ✗ Quote creation failed\n\n";
}

// Test 4: Get Quotes (Protected)
echo "4. Testing Get Quotes (Protected)...\n";
$context = stream_context_create([
    'http' => [
        'method' => 'GET',
        'header' => "Authorization: Bearer $token\r\n"
    ]
]);

$response = file_get_contents("$API_BASE/quotes", false, $context);
$data = json_decode($response, true);

if (isset($data['quotes']) && is_array($data['quotes'])) {
    echo "   ✓ Retrieved " . count($data['quotes']) . " quotes\n\n";
} else {
    echo "   ✗ Failed to retrieve quotes\n\n";
}

// Test 5: Create Message (Public)
echo "5. Testing Create Message (Public)...\n";
$messageData = json_encode([
    'name' => 'Test User',
    'email' => 'user@example.com',
    'subject' => 'Test Subject',
    'message' => 'This is a test message'
]);

$context = stream_context_create([
    'http' => [
        'method' => 'POST',
        'header' => "Content-Type: application/json\r\n",
        'content' => $messageData
    ]
]);

$response = file_get_contents("$API_BASE/messages", false, $context);
$data = json_decode($response, true);

if ($data['ok']) {
    echo "   ✓ Message created successfully\n\n";
} else {
    echo "   ✗ Message creation failed\n\n";
}

// Test 6: Rate Limiting
echo "6. Testing Rate Limiting...\n";
echo "   Submitting 11 rapid requests...\n";

$rateLimitHit = false;
for ($i = 1; $i <= 11; $i++) {
    $testData = json_encode([
        'name' => "Test $i",
        'email' => "test$i@example.com",
        'message' => "Rate limit test $i"
    ]);
    
    $context = stream_context_create([
        'http' => [
            'method' => 'POST',
            'header' => "Content-Type: application/json\r\n",
            'content' => $testData,
            'ignore_errors' => true
        ]
    ]);
    
    $response = @file_get_contents("$API_BASE/messages", false, $context);
    $statusCode = null;
    
    if (isset($http_response_header)) {
        preg_match('/HTTP\/\d\.\d\s+(\d+)/', $http_response_header[0], $matches);
        $statusCode = $matches[1] ?? null;
    }
    
    if ($statusCode == 429) {
        $rateLimitHit = true;
        echo "   ✓ Rate limit triggered at request $i\n\n";
        break;
    }
}

if (!$rateLimitHit) {
    echo "   ⚠ Rate limiting may not be working correctly\n\n";
}

echo "=== Test Suite Complete ===\n";
echo "\nNote: Some tests may fail if you haven't configured the database yet.\n";
echo "Refer to README.md for setup instructions.\n";
