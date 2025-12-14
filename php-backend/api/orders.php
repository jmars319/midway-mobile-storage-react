<?php
/**
 * Orders API Endpoint
 * Handles PanelSeal and product orders (GET, POST, DELETE)
 */

require_once __DIR__ . '/../utils.php';
require_once __DIR__ . '/../database.php';
require_once __DIR__ . '/../notifications.php';

setCorsHeaders();

$method = $_SERVER['REQUEST_METHOD'];
$db = Database::getInstance();

try {
    // GET - List orders (requires auth)
    if ($method === 'GET') {
        requireAuth();
        
        $stmt = $db->query(
            "SELECT id, customer_name, customer_email, customer_phone, shipping_address, 
                    product, quantity, notes, status, tracking_number, order_total, 
                    created_at, updated_at 
             FROM panelseal_orders 
             ORDER BY created_at DESC 
             LIMIT 100"
        );
        
        $orders = $stmt->fetchAll();
        $orders = array_map(function ($row) {
            $extras = loadSubmissionPayload('orders', $row['id']) ?? [];
            $merged = array_merge($extras, $row);
            $row['display'] = buildSubmissionDisplay('panelseal_order', $merged, [
                'formLabel' => 'PanelSeal Order',
                'timestampKey' => 'created_at',
                'primaryKeys' => ['customer_name', 'product', 'customer_email']
            ]);
            return $row;
        }, $orders);
        jsonResponse(['orders' => $orders]);
    }
    
    // POST - Create new order (public, rate limited)
    elseif ($method === 'POST') {
        checkRateLimit('orders_form');
        
        $data = getRequestBody();
        if (honeypotTripped($data)) {
            jsonResponse(['error' => 'Invalid submission'], 400);
        }
        
        // Validate CSRF token
        $csrfToken = $data['csrf_token'] ?? '';
        if (!validateCsrfToken($csrfToken)) {
            jsonResponse(['error' => 'Invalid or missing CSRF token'], 403);
        }
        
        $customer_name = validateAndSanitize($data['customer'] ?? '', 'Customer name', 100);
        $customer_email = validateAndSanitize($data['email'] ?? '', 'Email', 100);
        $customer_phone = validateAndSanitize($data['phone'] ?? '', 'Phone', 20);
        $shipping_address = validateAndSanitize($data['address'] ?? '', 'Address', 1000);
        
        if (!validateEmail($customer_email)) {
            jsonResponse(['error' => 'Please enter a valid email address'], 400);
        }
        
        $product = validateAndSanitize($data['product'] ?? '', 'Product', 100);
        $quantity = isset($data['quantity']) ? intval($data['quantity']) : 1;
        $notes = isset($data['notes']) ? sanitizeInput($data['notes']) : null;
        $sourcePage = detectSourcePage($data);
        $createdAt = getMySQLDateTime();
        
        $db->query(
            "INSERT INTO panelseal_orders (customer_name, customer_email, customer_phone, 
                                          shipping_address, product, quantity, notes, status, created_at) 
             VALUES (?, ?, ?, ?, ?, ?, ?, 'processing', ?)",
            [$customer_name, $customer_email, $customer_phone, $shipping_address, 
             $product, $quantity, $notes, $createdAt]
        );
        
        $id = $db->lastInsertId();

        $rawPayload = [
            'id' => $id,
            'customer_name' => $customer_name,
            'customer_email' => $customer_email,
            'customer_phone' => $customer_phone,
            'shipping_address' => $shipping_address,
            'product' => $product,
            'quantity' => $quantity,
            'notes' => $notes,
            'status' => 'processing',
            'created_at' => $createdAt,
            'source_page' => $sourcePage
        ];
        persistSubmissionPayload('orders', $id, $rawPayload);
        notifyFormSubmission('panelseal_order', $rawPayload, [
            'formLabel' => 'PanelSeal Order',
            'timestampKey' => 'created_at',
            'primaryKeys' => ['customer_name', 'product', 'customer_email']
        ]);

        jsonResponse(['ok' => true, 'id' => $id], 201);
    }
    
    // PATCH - Update order status (requires auth)
    elseif ($method === 'PATCH') {
        requireAuth();
        
        $data = getRequestBody();
        $pathParts = explode('/', trim($_SERVER['REQUEST_URI'], '/'));
        $id = intval($pathParts[count($pathParts) - 2]); // Get ID before /status
        $status = sanitizeInput($data['status'] ?? '');
        
        if ($id <= 0) {
            jsonResponse(['error' => 'Invalid order ID'], 400);
        }
        
        $db->query(
            "UPDATE panelseal_orders SET status = ? WHERE id = ?",
            [$status, $id]
        );
        
        // Return updated order
        $stmt = $db->query(
            "SELECT id, customer_name, customer_email, customer_phone, shipping_address, 
                    product, quantity, notes, status, tracking_number, order_total, 
                    created_at, updated_at 
             FROM panelseal_orders 
             WHERE id = ?",
            [$id]
        );
        
        $order = $stmt->fetch();
        if ($order) {
            $extras = loadSubmissionPayload('orders', $order['id']) ?? [];
            $merged = array_merge($extras, $order);
            $order['display'] = buildSubmissionDisplay('panelseal_order', $merged, [
                'formLabel' => 'PanelSeal Order',
                'timestampKey' => 'created_at',
                'primaryKeys' => ['customer_name', 'product', 'customer_email']
            ]);
        }
        jsonResponse(['ok' => true, 'order' => $order]);
    }
    
    // DELETE - Delete order (requires auth)
    elseif ($method === 'DELETE') {
        requireAuth();
        
        $pathParts = explode('/', trim($_SERVER['REQUEST_URI'], '/'));
        $id = intval(end($pathParts));
        
        if ($id <= 0) {
            jsonResponse(['error' => 'Invalid order ID'], 400);
        }
        
        $db->query("DELETE FROM panelseal_orders WHERE id = ?", [$id]);
        deleteSubmissionPayload('orders', $id);
        
        jsonResponse(['ok' => true]);
    }
    
    else {
        jsonResponse(['error' => 'Method not allowed'], 405);
    }
    
} catch (Exception $e) {
    if (DEBUG_MODE) {
        error_log('Orders API Error: ' . $e->getMessage());
    }
    if (!isValidationError($e)) {
        notifyException('Orders API Error', $e, ['path' => '/api/orders', 'method' => $method, 'form' => 'orders']);
    }
    
    $message = isValidationError($e)
        ? $e->getMessage()
        : 'An error occurred processing your request';
    
    jsonResponse(['error' => $message], 400);
}
