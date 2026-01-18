<?php
/**
 * Applications API Endpoint
 * Handles job applications (GET, POST, DELETE)
 */

require_once __DIR__ . '/utils.php';
require_once __DIR__ . '/database.php';
require_once __DIR__ . '/notifications.php';

setCorsHeaders();

$method = $_SERVER['REQUEST_METHOD'];
$db = Database::getInstance();

try {
    // GET - List applications (requires auth)
    if ($method === 'GET') {
        requireAuth();
        
        $stmt = $db->query(
            "SELECT id, name, email, phone, position, experience, message, 
                    resume_filename, resume_path, status, created_at, updated_at 
             FROM job_applications 
             ORDER BY created_at DESC 
             LIMIT 100"
        );
        
        $applications = $stmt->fetchAll();
        $applications = array_map(function ($row) {
            $extras = loadSubmissionPayload('applications', $row['id']) ?? [];
            $merged = array_merge($extras, $row);
            $row['display'] = buildSubmissionDisplay('job_application', $merged, [
                'formLabel' => 'Job Application',
                'timestampKey' => 'created_at',
                'primaryKeys' => ['name', 'position', 'email']
            ]);
            return $row;
        }, $applications);
        jsonResponse(['applications' => $applications]);
    }
    
    // POST - Create new application (public, rate limited)
    elseif ($method === 'POST') {
        checkRateLimit('applications_form');
        
        $data = getRequestBody();
        if (honeypotTripped($data)) {
            jsonResponse(['error' => 'Invalid submission'], 400);
        }
        
        // Validate CSRF token
        $csrfToken = $data['csrf_token'] ?? '';
        if (!validateCsrfToken($csrfToken)) {
            jsonResponse(['error' => 'Invalid or missing CSRF token'], 403);
        }
        
        $name = validateAndSanitize($data['name'] ?? '', 'Name', 100);
        $email = validateAndSanitize($data['email'] ?? '', 'Email', 100);
        $phone = validateAndSanitize($data['phone'] ?? '', 'Phone', 20, false); // Phone is optional
        
        if (!validateEmail($email)) {
            jsonResponse(['error' => 'Please enter a valid email address'], 400);
        }
        
        $position = isset($data['position']) ? sanitizeInput($data['position']) : 'other';
        $experience = isset($data['experience']) ? sanitizeInput($data['experience']) : null;
        $message = isset($data['message']) ? sanitizeInput($data['message']) : null;
        $resumeFilename = isset($data['resumeName']) ? sanitizeInput($data['resumeName']) : null;
        $resumePath = isset($data['resumePath']) ? sanitizeInput($data['resumePath']) : null;
        $sourcePage = detectSourcePage($data);
        $createdAt = getMySQLDateTime();
        
        $db->query(
            "INSERT INTO job_applications (name, email, phone, position, experience, message, status, created_at) 
             VALUES (?, ?, ?, ?, ?, ?, 'new', ?)",
            [$name, $email, $phone, $position, $experience, $message, $createdAt]
        );
        
        $id = $db->lastInsertId();

        $rawPayload = [
            'id' => $id,
            'name' => $name,
            'email' => $email,
            'phone' => $phone,
            'position' => $position,
            'experience' => $experience,
            'message' => $message,
            'resume_filename' => $resumeFilename,
            'resume_path' => $resumePath,
            'status' => 'new',
            'source_page' => $sourcePage,
            'created_at' => $createdAt
        ];
        persistSubmissionPayload('applications', $id, $rawPayload);
        notifyFormSubmission('job_application', $rawPayload, [
            'formLabel' => 'Job Application',
            'timestampKey' => 'created_at',
            'primaryKeys' => ['name', 'position', 'email']
        ]);

        jsonResponse(['ok' => true, 'id' => $id], 201);
    }
    
    // PATCH - Update application status (requires auth)
    elseif ($method === 'PATCH') {
        requireAuth();
        
        $data = getRequestBody();
        $pathParts = explode('/', trim($_SERVER['REQUEST_URI'], '/'));
        $id = intval($pathParts[count($pathParts) - 2]); // Get ID before /status
        $status = sanitizeInput($data['status'] ?? '');
        
        if ($id <= 0) {
            jsonResponse(['error' => 'Invalid application ID'], 400);
        }
        
        $db->query(
            "UPDATE job_applications SET status = ? WHERE id = ?",
            [$status, $id]
        );
        
        // Return updated application
        $stmt = $db->query(
            "SELECT id, name, email, phone, position, experience, message, 
                    resume_filename, resume_path, status, created_at, updated_at 
             FROM job_applications 
             WHERE id = ?",
            [$id]
        );
        
        $application = $stmt->fetch();
        if ($application) {
            $extras = loadSubmissionPayload('applications', $application['id']) ?? [];
            $merged = array_merge($extras, $application);
            $application['display'] = buildSubmissionDisplay('job_application', $merged, [
                'formLabel' => 'Job Application',
                'timestampKey' => 'created_at',
                'primaryKeys' => ['name', 'position', 'email']
            ]);
        }
        jsonResponse(['ok' => true, 'application' => $application]);
    }
    
    // DELETE - Delete application (requires auth)
    elseif ($method === 'DELETE') {
        requireAuth();
        
        $pathParts = explode('/', trim($_SERVER['REQUEST_URI'], '/'));
        $id = intval(end($pathParts));
        
        if ($id <= 0) {
            jsonResponse(['error' => 'Invalid application ID'], 400);
        }
        
        $db->query("DELETE FROM job_applications WHERE id = ?", [$id]);
        deleteSubmissionPayload('applications', $id);
        
        jsonResponse(['ok' => true]);
    }
    
    else {
        jsonResponse(['error' => 'Method not allowed'], 405);
    }
    
} catch (Exception $e) {
    error_log('Applications API Error: ' . $e->getMessage());
    if (!isValidationError($e)) {
        notifyException('Applications API Error', $e, ['path' => '/api/applications', 'method' => $method, 'form' => 'applications']);
    }
    
    $message = isValidationError($e)
        ? $e->getMessage()
        : 'An error occurred processing your request';
    
    jsonResponse(['error' => $message], 400);
}
