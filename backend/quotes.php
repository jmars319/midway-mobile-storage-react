<?php
/**
 * Quotes API Endpoint
 * Handles quote requests (GET, POST, PUT, DELETE)
 */

require_once __DIR__ . '/utils.php';
require_once __DIR__ . '/database.php';
require_once __DIR__ . '/notifications.php';

setCorsHeaders();

$method = $_SERVER['REQUEST_METHOD'];
$db = Database::getInstance();

function parseQuoteStatusValue($status) {
    $normalized = strtolower(trim((string) sanitizeInput($status)));
    if ($normalized === 'pending') {
        return 'new';
    }

    $allowedStatuses = ['new', 'responded', 'handled', 'dismissed'];
    return in_array($normalized, $allowedStatuses, true) ? $normalized : null;
}

function normalizeStoredQuoteStatus($status) {
    return parseQuoteStatusValue($status) ?? 'new';
}

function decorateQuoteRow(array $row) {
    $row['status'] = normalizeStoredQuoteStatus($row['status'] ?? null);

    $extras = loadSubmissionPayload('quotes', $row['id']) ?? [];
    if (!empty($extras)) {
        $extras['status'] = normalizeStoredQuoteStatus($extras['status'] ?? $row['status']);
    }

    $merged = array_merge($extras, $row);
    $row['display'] = buildSubmissionDisplay('quote_request', $merged, [
        'formLabel' => 'Quote Request',
        'timestampKey' => 'createdAt',
        'primaryKeys' => ['name', 'serviceType', 'email']
    ]);

    return $row;
}

try {
    // GET - List quotes (requires auth)
    if ($method === 'GET') {
        requireAuth();
        
        $stmt = $db->query(
            "SELECT id, name, email, phone, serviceType, containerSize, quantity, duration, 
                    deliveryAddress, message, status, createdAt 
             FROM quotes 
             ORDER BY createdAt DESC 
             LIMIT 100"
        );
        
        $quotes = $stmt->fetchAll();
        $quotes = array_map('decorateQuoteRow', $quotes);
        jsonResponse(['quotes' => $quotes]);
    }
    
    // POST - Create new quote (public, rate limited)
    elseif ($method === 'POST') {
        checkRateLimit('quotes_form');
        
        $data = getRequestBody();
        if (honeypotTripped($data)) {
            jsonResponse(['error' => 'Invalid submission'], 400);
        }
        
        // Validate CSRF token
        $csrfToken = $data['csrf_token'] ?? '';
        if (!validateCsrfToken($csrfToken)) {
            jsonResponse(['error' => 'Invalid or missing CSRF token'], 403);
        }
        
        $name = validateAndSanitize($data['name'] ?? '', 'Name', 255);
        $email = validateAndSanitize($data['email'] ?? '', 'Email', 255);
        
        if (!validateEmail($email)) {
            jsonResponse(['error' => 'Please enter a valid email address'], 400);
        }
        
        $phone = isset($data['phone']) ? sanitizeInput($data['phone']) : null;
        $serviceType = isset($data['serviceType']) ? sanitizeInput($data['serviceType']) : null;
        $containerSize = isset($data['containerSize']) ? sanitizeInput($data['containerSize']) : null;
        $quantity = isset($data['quantity']) ? intval($data['quantity']) : null;
        if ($quantity !== null && ($quantity < 0 || $quantity > 1000)) {
            jsonResponse(['error' => 'Quantity must be between 0 and 1000'], 400);
        }
        $duration = isset($data['duration']) ? sanitizeInput($data['duration']) : null;
        $deliveryAddress = isset($data['deliveryAddress']) ? sanitizeInput($data['deliveryAddress']) : null;
        $message = isset($data['message']) ? sanitizeInput($data['message']) : null;
        $sourcePage = detectSourcePage($data);
        
        $createdAt = getMySQLDateTime();
        
        $db->query(
            "INSERT INTO quotes (name, email, phone, serviceType, containerSize, quantity, 
                                 duration, deliveryAddress, message, createdAt, status) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'new')",
            [$name, $email, $phone, $serviceType, $containerSize, $quantity, 
             $duration, $deliveryAddress, $message, $createdAt]
        );
        
        $id = $db->lastInsertId();

        $rawPayload = [
            'id' => $id,
            'name' => $name,
            'email' => $email,
            'phone' => $phone,
            'serviceType' => $serviceType,
            'containerSize' => $containerSize,
            'quantity' => $quantity,
            'duration' => $duration,
            'deliveryAddress' => $deliveryAddress,
            'message' => $message,
            'status' => 'new',
            'createdAt' => $createdAt,
            'source_page' => $sourcePage
        ];
        persistSubmissionPayload('quotes', $id, $rawPayload);
        notifyFormSubmission('quote_request', $rawPayload, [
            'formLabel' => 'Quote Request',
            'timestampKey' => 'createdAt',
            'primaryKeys' => ['name', 'serviceType', 'email']
        ]);

        jsonResponse(['ok' => true, 'id' => $id], 201);
    }
    
    // PUT - Update quote status (requires auth)
    elseif ($method === 'PUT') {
        requireAuth();
        
        $data = getRequestBody();
        $id = intval($data['id'] ?? 0);
        $status = parseQuoteStatusValue($data['status'] ?? '');
        
        if ($id <= 0) {
            jsonResponse(['error' => 'Invalid quote ID'], 400);
        }
        if ($status === null) {
            jsonResponse(['error' => 'Invalid quote status'], 400);
        }
        
        $db->query(
            "UPDATE quotes SET status = ? WHERE id = ?",
            [$status, $id]
        );

        $existingPayload = loadSubmissionPayload('quotes', $id) ?? [];
        if (!empty($existingPayload)) {
            persistSubmissionPayload('quotes', $id, array_merge($existingPayload, [
                'status' => $status
            ]));
        }
        
        // Return updated quote
        $stmt = $db->query(
            "SELECT id, name, email, phone, serviceType, containerSize, quantity, duration, 
                    deliveryAddress, message, status, createdAt 
             FROM quotes 
             WHERE id = ?",
            [$id]
        );
        
        $quote = $stmt->fetch();
        if ($quote) {
            $quote = decorateQuoteRow($quote);
        }
        jsonResponse(['ok' => true, 'quote' => $quote]);
    }
    
    // DELETE - Delete quote (requires auth)
    elseif ($method === 'DELETE') {
        requireAuth();
        
        $pathParts = explode('/', trim($_SERVER['REQUEST_URI'], '/'));
        $id = intval(end($pathParts));
        
        if ($id <= 0) {
            jsonResponse(['error' => 'Invalid quote ID'], 400);
        }
        
        $db->query("DELETE FROM quotes WHERE id = ?", [$id]);
        deleteSubmissionPayload('quotes', $id);
        
        jsonResponse(['ok' => true]);
    }
    
    else {
        jsonResponse(['error' => 'Method not allowed'], 405);
    }
    
} catch (Exception $e) {
    if (DEBUG_MODE) {
        error_log('Quotes API Error: ' . $e->getMessage());
    }
    if (!isValidationError($e)) {
        notifyException('Quotes API Error', $e, ['path' => '/api/quotes', 'method' => $method, 'form' => 'quotes']);
    }
    
    $message = isValidationError($e)
        ? $e->getMessage()
        : 'An error occurred processing your request';
    
    jsonResponse(['error' => $message], 400);
}
