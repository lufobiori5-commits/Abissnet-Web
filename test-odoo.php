<?php
/**
 * Test Odoo Connection
 * Access: https://abissnet.cloud/test-odoo.php
 */

require_once __DIR__ . '/api/config.php';
require_once __DIR__ . '/api/OdooClient.php';

header('Content-Type: application/json');

try {
    // Test 1: Check if config is loaded
    $config = [
        'ODOO_URL' => ODOO_URL,
        'ODOO_DB' => ODOO_DB,
        'ODOO_UID' => ODOO_UID,
        'ODOO_PASS' => substr(ODOO_PASS, 0, 3) . '***' // Hide password
    ];
    
    // Test 2: Check if CURL is available
    if (!function_exists('curl_init')) {
        throw new Exception('CURL extension not enabled!');
    }
    
    // Test 3: Try to connect to Odoo
    $odoo = new OdooClient(ODOO_URL, ODOO_DB, ODOO_UID, ODOO_PASS);
    
    // Test 4: Try a simple search (less likely to fail than create)
    $result = $odoo->execute('res.partner', 'search', [[]], ['limit' => 1]);
    
    echo json_encode([
        'success' => true,
        'message' => 'Odoo connection successful!',
        'config' => $config,
        'curl_available' => true,
        'test_result' => $result
    ], JSON_PRETTY_PRINT);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'config' => $config ?? null,
        'curl_available' => function_exists('curl_init'),
        'php_version' => phpversion(),
        'trace' => $e->getTraceAsString()
    ], JSON_PRETTY_PRINT);
}
