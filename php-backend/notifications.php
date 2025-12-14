<?php
/**
 * Submission display + notification helpers
 * - Canonical renderer for form submissions
 * - SendGrid email integration with strict gating
 * - Lightweight raw payload storage for new/unknown fields
 */

require_once __DIR__ . '/utils.php';

if (!defined('SUBMISSION_STORAGE_BASE')) {
    define('SUBMISSION_STORAGE_BASE', __DIR__ . '/storage/submissions');
}

/**
 * Read an environment variable with fallback.
 */
function envValue($key, $default = null) {
    if (isset($_ENV[$key]) && $_ENV[$key] !== '') {
        return $_ENV[$key];
    }
    $value = getenv($key);
    if ($value === false || $value === null || $value === '') {
        return $default;
    }
    return $value;
}

/**
 * Structured log helper for skipped emails.
 */
function logEmailSkip($type, $formType, $recipients, $reason) {
    $line = sprintf('[email:skip] type=%s form=%s to=%s reason=%s', $type, $formType, $recipients, $reason);
    error_log($line);
}

/**
 * Determine if transactional emails are allowed.
 */
function shouldSendEmails() {
    $appEnv = strtolower(envValue('APP_ENV', 'development'));
    $sendFlag = strtolower(envValue('SEND_EMAILS', 'false'));
    return $appEnv === 'production' && $sendFlag === 'true';
}

/**
 * Ensure the storage folder for a form exists.
 */
function ensureSubmissionStorageDirectory($formKey) {
    $dir = rtrim(SUBMISSION_STORAGE_BASE, '/\\') . '/' . $formKey;
    if (!is_dir($dir)) {
        @mkdir($dir, 0775, true);
    }
    return $dir;
}

/**
 * Persist the raw payload for a submission so new fields remain visible later.
 */
function persistSubmissionPayload($formKey, $submissionId, array $payload) {
    try {
        $dir = ensureSubmissionStorageDirectory($formKey);
        $path = $dir . '/' . $submissionId . '.json';
        $record = [
            'saved_at' => date('c'),
            'payload' => $payload
        ];
        file_put_contents($path, json_encode($record, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES), LOCK_EX);
    } catch (Exception $e) {
        if (DEBUG_MODE) {
            error_log('Failed to persist submission payload: ' . $e->getMessage());
        }
    }
}

/**
 * Retrieve the raw payload for a stored submission (if any).
 */
function loadSubmissionPayload($formKey, $submissionId) {
    $path = rtrim(SUBMISSION_STORAGE_BASE, '/\\') . '/' . $formKey . '/' . $submissionId . '.json';
    if (!is_file($path)) {
        return null;
    }
    $raw = json_decode(file_get_contents($path), true);
    if (isset($raw['payload']) && is_array($raw['payload'])) {
        return $raw['payload'];
    }
    return is_array($raw) ? $raw : null;
}

/**
 * Remove stored payload when a submission is deleted.
 */
function deleteSubmissionPayload($formKey, $submissionId) {
    $path = rtrim(SUBMISSION_STORAGE_BASE, '/\\') . '/' . $formKey . '/' . $submissionId . '.json';
    if (is_file($path)) {
        @unlink($path);
    }
}

/**
 * Attempt to resolve the visitor's source page (referrer or explicit value).
 */
function detectSourcePage(array $payload = []) {
    $keys = ['sourcePage', 'source_page', 'pageUrl', 'page_url', 'originUrl', 'origin_url'];
    foreach ($keys as $key) {
        if (!empty($payload[$key])) {
            return $payload[$key];
        }
    }
    return $_SERVER['HTTP_REFERER'] ?? null;
}

/**
 * Turn a field key into a plain-language label.
 */
function canonicalFieldLabel($key) {
    $map = [
        'id' => 'Record ID',
        'name' => 'Name',
        'customer' => 'Customer',
        'customer_name' => 'Customer',
        'customer_email' => 'Customer Email',
        'customer_phone' => 'Customer Phone',
        'email' => 'Email',
        'phone' => 'Phone',
        'serviceType' => 'Service Type',
        'containerSize' => 'Container Size',
        'quantity' => 'Quantity',
        'duration' => 'Duration',
        'deliveryAddress' => 'Delivery Address',
        'message' => 'Message',
        'subject' => 'Subject',
        'position' => 'Position',
        'experience' => 'Experience',
        'resume_filename' => 'Resume Filename',
        'resume_path' => 'Resume',
        'status' => 'Status',
        'createdAt' => 'Created',
        'created_at' => 'Created',
        'updated_at' => 'Updated',
        'notes' => 'Notes',
        'address' => 'Address',
        'shipping_address' => 'Shipping Address',
        'product' => 'Product',
        'gallons' => 'Gallons Requested',
        'sourcePage' => 'Source Page',
        'source_page' => 'Source Page',
    ];
    if (isset($map[$key])) {
        return $map[$key];
    }
    $label = preg_replace('/[_\-]+/', ' ', $key);
    $label = preg_replace('/([a-z])([A-Z])/', '$1 $2', $label);
    return ucwords($label);
}

/**
 * Provide a deterministic sort order for commonly used fields.
 */
function canonicalFieldOrder($key) {
    static $order = [
        'id' => 0,
        'form' => 1,
        'name' => 5,
        'customer' => 6,
        'customer_name' => 7,
        'email' => 10,
        'customer_email' => 11,
        'phone' => 12,
        'customer_phone' => 13,
        'subject' => 15,
        'serviceType' => 20,
        'containerSize' => 21,
        'quantity' => 22,
        'duration' => 23,
        'deliveryAddress' => 24,
        'address' => 25,
        'shipping_address' => 26,
        'product' => 27,
        'position' => 30,
        'experience' => 31,
        'message' => 40,
        'notes' => 50,
        'status' => 90,
        'createdAt' => 95,
        'created_at' => 96,
        'updated_at' => 97,
        'sourcePage' => 98,
        'source_page' => 99,
    ];
    return $order[$key] ?? 500;
}

/**
 * Check for sensitive fields that should be redacted.
 */
function isSensitiveFieldKey($key) {
    $sensitive = ['password', 'token', 'secret', 'authToken', 'apiKey'];
    return in_array($key, $sensitive, true);
}

/**
 * Convert arbitrary field values into readable strings.
 */
function formatFieldValueForDisplay($value) {
    if (is_null($value) || $value === '') {
        return '—';
    }
    if (is_bool($value)) {
        return $value ? 'Yes' : 'No';
    }
    if (is_array($value)) {
        $isAssoc = array_keys($value) !== range(0, count($value) - 1);
        if ($isAssoc) {
            return json_encode($value, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        }
        return implode(', ', array_map(function ($item) {
            if (is_scalar($item) || is_null($item)) {
                return $item === '' ? '—' : (string)$item;
            }
            return json_encode($item);
        }, $value));
    }
    return (string)$value;
}

/**
 * Build a short summary tuple (primary/secondary/tertiary).
 */
function buildSubmissionSummary(array $payload, array $options = []) {
    $primaryKeys = $options['primaryKeys'] ?? ['name', 'customer_name', 'customer', 'subject', 'id'];
    $secondaryKeys = $options['secondaryKeys'] ?? ['email', 'customer_email', 'position', 'product'];
    $tertiaryKeys = $options['tertiaryKeys'] ?? ['phone', 'customer_phone', 'quantity', 'status'];

    $findValue = function ($keys) use ($payload) {
        foreach ($keys as $key) {
            if (!empty($payload[$key])) {
                return $payload[$key];
            }
        }
        return null;
    };

    return [
        'primary' => $findValue($primaryKeys),
        'secondary' => $findValue($secondaryKeys),
        'tertiary' => $findValue($tertiaryKeys)
    ];
}

/**
 * Attempt to convert a relative path to an absolute URL.
 */
function buildAbsoluteUrl($value) {
    if (!$value || !is_string($value)) {
        return null;
    }
    if (preg_match('#^https?://#i', $value)) {
        return $value;
    }
    $scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
    $host = $_SERVER['HTTP_HOST'] ?? 'localhost';
    $base = $scheme . '://' . $host;
    if ($value[0] === '/') {
        return rtrim($base, '/') . $value;
    }
    return rtrim($base, '/') . '/' . ltrim($value, '/');
}

/**
 * Collect attachment/link style fields from the payload.
 */
function extractSubmissionAttachments(array $payload) {
    $attachments = [];
    foreach ($payload as $key => $value) {
        if (!is_string($value) || $value === '') {
            continue;
        }
        if (preg_match('/(resume|attachment|file|document|link)/i', $key)) {
            $attachments[] = [
                'key' => $key,
                'label' => canonicalFieldLabel($key),
                'url' => buildAbsoluteUrl($value),
                'value' => $value
            ];
        }
    }
    return $attachments;
}

/**
 * Canonical renderer used by admin + email views.
 */
function buildSubmissionDisplay($formType, array $payload, array $options = []) {
    $fields = [];
    foreach ($payload as $key => $value) {
        $fields[] = [
            'key' => $key,
            'label' => $options['labels'][$key] ?? canonicalFieldLabel($key),
            'value' => formatFieldValueForDisplay($value),
            'order' => canonicalFieldOrder($key),
            'isSensitive' => isSensitiveFieldKey($key)
        ];
    }
    usort($fields, function ($a, $b) {
        if ($a['order'] === $b['order']) {
            return strnatcasecmp($a['label'], $b['label']);
        }
        return $a['order'] <=> $b['order'];
    });
    $fields = array_map(function ($field) {
        if ($field['isSensitive']) {
            $field['value'] = '[redacted]';
        }
        return [
            'key' => $field['key'],
            'label' => $field['label'],
            'value' => $field['value']
        ];
    }, $fields);

    $timestampKey = $options['timestampKey'] ?? 'created_at';
    $submittedAt = $payload[$timestampKey] ?? ($payload['createdAt'] ?? ($payload['created_at'] ?? null));
    $source = $options['source'] ?? detectSourcePage($payload);
    $attachments = extractSubmissionAttachments($payload);

    return [
        'formType' => $formType,
        'formLabel' => $options['formLabel'] ?? canonicalFieldLabel($formType),
        'meta' => [
            'formLabel' => $options['formLabel'] ?? canonicalFieldLabel($formType),
            'submittedAt' => $submittedAt,
            'source' => $source
        ],
        'summary' => buildSubmissionSummary($payload, $options),
        'fields' => $fields,
        'attachments' => $attachments,
        'raw' => $payload
    ];
}

/**
 * Build a readable plain-text email body for a submission.
 */
function renderSubmissionEmailBody(array $display) {
    $lines = [];
    $meta = $display['meta'] ?? [];
    $lines[] = $meta['formLabel'] ?? 'Form Submission';
    if (!empty($meta['submittedAt'])) {
        $lines[] = 'Submitted: ' . $meta['submittedAt'];
    }
    if (!empty($meta['source'])) {
        $lines[] = 'Source: ' . $meta['source'];
    }
    $lines[] = '';
    $lines[] = 'Fields:';
    foreach ($display['fields'] as $field) {
        $value = $field['value'];
        $value = str_replace("\r\n", "\n", $value);
        $value = str_replace("\r", "\n", $value);
        $value = str_replace("\n", "\n    ", $value);
        $lines[] = sprintf('- %s: %s', $field['label'], $value);
    }
    if (!empty($display['attachments'])) {
        $lines[] = '';
        $lines[] = 'Attachments / Links:';
        foreach ($display['attachments'] as $attachment) {
            $lines[] = sprintf('• %s: %s', $attachment['label'], $attachment['url'] ?? $attachment['value']);
        }
    }
    return implode("\n", $lines);
}

/**
 * Normalize comma-delimited recipient strings into SendGrid objects.
 */
function parseRecipientList($recipients) {
    if (is_string($recipients)) {
        $recipients = array_filter(array_map('trim', explode(',', $recipients)));
    }
    if (!is_array($recipients)) {
        $recipients = [];
    }
    return array_map(function ($email) {
        return ['email' => $email];
    }, $recipients);
}

/**
 * Send an email via SendGrid with gating + structured logging.
 */
function sendEmailViaSendGrid($type, $formType, $subject, $textBody, $htmlBody = null, array $recipients = []) {
    if (empty($recipients)) {
        return false;
    }
    $recipientList = implode(',', array_map(function ($entry) {
        return $entry['email'];
    }, $recipients));

    if (!shouldSendEmails()) {
        $appEnv = strtolower(envValue('APP_ENV', 'development'));
        $sendFlag = strtolower(envValue('SEND_EMAILS', 'false'));
        $reasons = [];
        if ($appEnv !== 'production') {
            $reasons[] = 'app-env=' . $appEnv;
        }
        if ($sendFlag !== 'true') {
            $reasons[] = 'send-emails=' . $sendFlag;
        }
        logEmailSkip($type, $formType, $recipientList, implode('+', $reasons));
        return false;
    }

    $apiKey = envValue('SENDGRID_API_KEY');
    if (!$apiKey) {
        logEmailSkip($type, $formType, $recipientList, 'missing-api-key');
        return false;
    }

    $fromEmail = envValue('EMAIL_FROM_ADDRESS', 'notifications@midwaymobilestorage.com');
    $fromName = envValue('EMAIL_FROM_NAME', 'Midway Mobile Storage');
    $replyTo = envValue('EMAIL_REPLY_TO', $fromEmail);

    $payload = [
        'personalizations' => [
            [
                'to' => $recipients
            ]
        ],
        'from' => [
            'email' => $fromEmail,
            'name' => $fromName
        ],
        'reply_to' => [
            'email' => $replyTo,
            'name' => $fromName
        ],
        'subject' => $subject,
        'content' => [
            [
                'type' => 'text/plain',
                'value' => $textBody
            ]
        ]
    ];

    if ($htmlBody) {
        $payload['content'][] = [
            'type' => 'text/html',
            'value' => $htmlBody
        ];
    }

    $ch = curl_init('https://api.sendgrid.com/v3/mail/send');
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Authorization: Bearer ' . $apiKey,
        'Content-Type: application/json'
    ]);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);

    $response = curl_exec($ch);
    $httpStatus = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    if ($response === false || $httpStatus >= 400) {
        $error = $response === false ? curl_error($ch) : $response;
        error_log(sprintf('SendGrid error (%s): %s', $formType, $error));
        curl_close($ch);
        return false;
    }

    curl_close($ch);
    return true;
}

/**
 * Notify staff of a new submission and return the canonical display model.
 */
function notifyFormSubmission($formType, array $payload, array $options = []) {
    $display = buildSubmissionDisplay($formType, $payload, $options);
    $summary = $display['summary'] ?? [];
    $submitter = $summary['primary'] ?? 'New submission';
    $formLabel = $display['meta']['formLabel'] ?? 'Form Submission';
    $subject = sprintf('[Midway] %s from %s', $formLabel, $submitter);
    $recipients = parseRecipientList(envValue('FORM_NOTIFICATION_RECIPIENT', 'midwaymobilestorage@gmail.com'));
    sendEmailViaSendGrid('form_submission', $formType, $subject, renderSubmissionEmailBody($display), null, $recipients);
    return $display;
}

/**
 * Notify support when a server-side exception occurs.
 */
function notifyException($title, Throwable $error, array $context = []) {
    $contextSafe = array_intersect_key($context, array_flip(['path', 'method', 'form', 'id']));
    $lines = [];
    $lines[] = $title;
    if (!empty($contextSafe['path'])) {
        $lines[] = 'Path: ' . $contextSafe['path'];
    }
    if (!empty($contextSafe['method'])) {
        $lines[] = 'Method: ' . $contextSafe['method'];
    }
    if (!empty($contextSafe['form'])) {
        $lines[] = 'Form: ' . $contextSafe['form'];
    }
    if (!empty($contextSafe['id'])) {
        $lines[] = 'Record ID: ' . $contextSafe['id'];
    }
    $lines[] = 'Error: ' . $error->getMessage();
    $lines[] = '';
    $lines[] = $error->getTraceAsString();

    $recipients = parseRecipientList(envValue('ERROR_NOTIFICATION_RECIPIENT', 'support@jamarq.digital'));
    sendEmailViaSendGrid('error_notification', $contextSafe['form'] ?? 'server', $title, implode("\n", $lines), null, $recipients);
}
