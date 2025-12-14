<?php
/**
 * Messages API Endpoint
 * Handles contact form messages (GET, POST, PUT, DELETE)
 */

require_once __DIR__ . '/../utils.php';
require_once __DIR__ . '/../database.php';
require_once __DIR__ . '/../notifications.php';

setCorsHeaders();

$method = $_SERVER['REQUEST_METHOD'];
$db = Database::getInstance();

try {
    // GET - List messages (requires auth)
    if ($method === 'GET') {
        requireAuth();
        
        $stmt = $db->query(
            "SELECT id, name, email, subject, message, status, createdAt 
             FROM messages 
             ORDER BY createdAt DESC 
             LIMIT 100"
        );
        
        $messages = $stmt->fetchAll();
        $messages = array_map(function ($row) {
            $extras = loadSubmissionPayload('messages', $row['id']) ?? [];
            $merged = array_merge($extras, $row);
            $row['display'] = buildSubmissionDisplay('contact_message', $merged, [
                'formLabel' => 'Contact Message',
                'timestampKey' => 'createdAt',
                'primaryKeys' => ['name', 'email', 'subject']
            ]);
            return $row;
        }, $messages);
        jsonResponse(['messages' => $messages]);
    }
    
    // POST - Create new message (public, rate limited)
    elseif ($method === 'POST') {
        checkRateLimit('messages_form');
        
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
        
        $subject = isset($data['subject']) ? sanitizeInput($data['subject']) : null;
        $message = isset($data['message']) ? sanitizeInput($data['message']) : null;
        $createdAt = getMySQLDateTime();
        $sourcePage = detectSourcePage($data);
        
        $db->query(
            "INSERT INTO messages (name, email, subject, message, createdAt, status) 
             VALUES (?, ?, ?, ?, ?, 'new')",
            [$name, $email, $subject, $message, $createdAt]
        );
        
        $id = $db->lastInsertId();

        $rawPayload = [
            'id' => $id,
            'name' => $name,
            'email' => $email,
            'subject' => $subject,
            'message' => $message,
            'status' => 'new',
            'createdAt' => $createdAt,
            'source_page' => $sourcePage
        ];
        persistSubmissionPayload('messages', $id, $rawPayload);
        notifyFormSubmission('contact_message', $rawPayload, [
            'formLabel' => 'Contact Message',
            'timestampKey' => 'createdAt',
            'primaryKeys' => ['name', 'email', 'subject']
        ]);

        jsonResponse(['ok' => true, 'id' => $id], 201);
    }
    
    // PUT - Update message status (requires auth)
    elseif ($method === 'PUT') {
        requireAuth();
        
        $data = getRequestBody();
        $id = intval($data['id'] ?? 0);
        $status = sanitizeInput($data['status'] ?? '');
        
        if ($id <= 0) {
            jsonResponse(['error' => 'Invalid message ID'], 400);
        }
        
        $db->query(
            "UPDATE messages SET status = ? WHERE id = ?",
            [$status, $id]
        );

        $stmt = $db->query(
            "SELECT id, name, email, subject, message, status, createdAt 
             FROM messages 
             WHERE id = ?",
            [$id]
        );
        $messageRow = $stmt->fetch();
        if ($messageRow) {
            $extras = loadSubmissionPayload('messages', $messageRow['id']) ?? [];
            $merged = array_merge($extras, $messageRow);
            $messageRow['display'] = buildSubmissionDisplay('contact_message', $merged, [
                'formLabel' => 'Contact Message',
                'timestampKey' => 'createdAt',
                'primaryKeys' => ['name', 'email', 'subject']
            ]);
        }
        
        jsonResponse(['ok' => true, 'message' => $messageRow]);
    }
    
    // DELETE - Delete message (requires auth)
    elseif ($method === 'DELETE') {
        requireAuth();
        
        $pathParts = explode('/', trim($_SERVER['REQUEST_URI'], '/'));
        $id = intval(end($pathParts));
        
        if ($id <= 0) {
            jsonResponse(['error' => 'Invalid message ID'], 400);
        }
        
        $db->query("DELETE FROM messages WHERE id = ?", [$id]);
        deleteSubmissionPayload('messages', $id);
        
        jsonResponse(['ok' => true]);
    }
    
    else {
        jsonResponse(['error' => 'Method not allowed'], 405);
    }
    
} catch (Exception $e) {
    if (DEBUG_MODE) {
        error_log('Messages API Error: ' . $e->getMessage());
    }
    if (!isValidationError($e)) {
        notifyException('Messages API Error', $e, ['path' => '/api/messages', 'method' => $method, 'form' => 'messages']);
    }
    
    $message = isValidationError($e)
        ? $e->getMessage()
        : 'An error occurred processing your request';
    
    jsonResponse(['error' => $message], 400);
}
