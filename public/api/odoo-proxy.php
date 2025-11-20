<?php
/**
 * Odoo API Proxy for cPanel/Shared Hosting
 * 
 * This PHP script acts as a secure proxy between your frontend forms
 * and the Odoo JSON-RPC API, keeping credentials server-side.
 */

// Enable CORS if needed (adjust domain for production)
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Odoo configuration (KEEP THESE SECRET - don't expose in frontend!)
define('ODOO_URL', 'https://hr.abissnet.al');
define('ODOO_DB', 'odoo');
define('ODOO_UID', 858);
define('ODOO_PASSWORD', 'Biori1234');

// Get request body
$input = file_get_contents('php://input');
$requestData = json_decode($input, true);

if (!$requestData) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON']);
    exit;
}

// Determine endpoint type
$endpoint = isset($_GET['endpoint']) ? $_GET['endpoint'] : '';

// Prepare Odoo payload based on endpoint
if ($endpoint === 'contact') {
    // Contact form submission
    $name = $requestData['name'] ?? '';
    $email = $requestData['email'] ?? '';
    $phone = $requestData['phone'] ?? '';
    $city = $requestData['city'] ?? '';
    $subject = $requestData['subject'] ?? '';
    $clientStatus = $requestData['client_status'] ?? '';
    $message = $requestData['message'] ?? '';
    
    if (empty($name) || empty($email)) {
        http_response_code(400);
        echo json_encode(['error' => 'Name and email are required']);
        exit;
    }
    
    // Build description with all details
    $description = "Contact Form Submission\n\n";
    $description .= "Name: $name\n";
    $description .= "Email: $email\n";
    if ($phone) $description .= "Phone: $phone\n";
    if ($city) $description .= "City: $city\n";
    if ($subject) $description .= "Subject: $subject\n";
    if ($clientStatus) $description .= "Client Status: $clientStatus\n";
    if ($message) $description .= "\nMessage:\n$message\n";
    
    // Use standard Odoo 'create' method (works on all Odoo instances)
    $odooPayload = [
        'jsonrpc' => '2.0',
        'method' => 'call',
        'params' => [
            'service' => 'object',
            'method' => 'execute_kw',
            'args' => [
                ODOO_DB,
                ODOO_UID,
                ODOO_PASSWORD,
                'crm.lead',
                'create',
                [[
                    'name' => $subject ?: "Contact: $name",
                    'contact_name' => $name,
                    'email_from' => $email,
                    'phone' => $phone,
                    'city' => $city,
                    'description' => $description,
                    'type' => 'lead'
                ]]
            ]
        ],
        'id' => time()
    ];
    
} elseif ($endpoint === 'careers') {
    // Job application submission
    $positionTitle = $requestData['position_title'] ?? '';
    $fullName = $requestData['full_name'] ?? '';
    $email = $requestData['email'] ?? '';
    $phone = $requestData['phone'] ?? '';
    $message = $requestData['message'] ?? '';
    $resumeName = $requestData['resume_name'] ?? '';
    
    if (empty($fullName) || empty($email) || empty($positionTitle)) {
        http_response_code(400);
        echo json_encode(['error' => 'Full name, email, and position are required']);
        exit;
    }
    
    // Validate email format
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid email format']);
        exit;
    }
    
    // Build detailed description
    $description = "Job Application\n\n";
    $description .= "Position: $positionTitle\n";
    $description .= "Applicant: $fullName\n";
    $description .= "Email: $email\n";
    if ($phone) $description .= "Phone: $phone\n";
    if ($resumeName) $description .= "CV File: $resumeName\n";
    if ($message) $description .= "\nCover Letter:\n$message\n";
    $description .= "\n---\nPlease contact b.njerezore@abissnet.al for follow-up.";
    
    // Use standard Odoo 'create' method
    $odooPayload = [
        'jsonrpc' => '2.0',
        'method' => 'call',
        'params' => [
            'service' => 'object',
            'method' => 'execute_kw',
            'args' => [
                ODOO_DB,
                ODOO_UID,
                ODOO_PASSWORD,
                'crm.lead',
                'create',
                [[
                    'name' => "Aplikim: $positionTitle - $fullName",
                    'contact_name' => $fullName,
                    'email_from' => $email,
                    'phone' => $phone,
                    'description' => $description,
                    'type' => 'opportunity'
                ]]
            ]
        ],
        'id' => time()
    ];
    
} else {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid endpoint. Use ?endpoint=contact or ?endpoint=careers']);
    exit;
}

// Make request to Odoo
$ch = curl_init(ODOO_URL . '/jsonrpc');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($odooPayload));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json'
]);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

// Handle cURL errors
if ($curlError) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Connection error: ' . $curlError
    ]);
    exit;
}

// Parse Odoo response
$odooResponse = json_decode($response, true);

if (isset($odooResponse['error'])) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $odooResponse['error']['data']['message'] ?? $odooResponse['error']['message'] ?? 'Odoo error'
    ]);
    exit;
}

if (isset($odooResponse['result'])) {
    echo json_encode([
        'success' => true,
        'lead_id' => $odooResponse['result']
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Unexpected response from Odoo'
    ]);
}
