<?php
/**
 * Test Alternative Odoo Connection (file_get_contents)
 * Access: https://abissnet.cloud/test-odoo-alt.php
 */

require_once __DIR__ . '/api/config.php';
require_once __DIR__ . '/api/OdooClientAlt.php';

header('Content-Type: application/json');

try {
    $odoo = new OdooClientAlt(ODOO_URL, ODOO_DB, ODOO_UID, ODOO_PASS);
    
    // Try a simple search
    $result = $odoo->execute('res.partner', 'search', [[]], ['limit' => 1]);
    
    echo json_encode([
        'success' => true,
        'message' => 'Odoo connection successful with file_get_contents!',
        'method' => 'file_get_contents (curl_exec disabled)',
        'test_result' => $result
    ], JSON_PRETTY_PRINT);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'method' => 'file_get_contents'
    ], JSON_PRETTY_PRINT);
}
