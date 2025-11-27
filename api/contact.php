<?php
/**
 * Contact Form API
 * Handles contact form submissions and creates leads in Odoo
 */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/OdooClientAlt.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['error' => 'Method not allowed'], 405);
}

$input = getJsonInput();

try {
    $odoo = new OdooClientAlt(ODOO_URL, ODOO_DB, ODOO_UID, ODOO_PASS);
    
    // Create lead in Odoo
    $leadId = $odoo->execute('crm.lead', 'create_from_api', [$input]);
    
    jsonResponse(['success' => true, 'lead_id' => $leadId]);
    
} catch (Exception $e) {
    error_log("ODOO ERROR: " . $e->getMessage());
    jsonResponse(['success' => false, 'error' => $e->getMessage()], 500);
}
