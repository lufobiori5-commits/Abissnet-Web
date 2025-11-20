<?php
/**
 * Careers/Job Application API
 * Handles job applications and creates job leads in Odoo
 */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/OdooClientAlt.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['error' => 'Method not allowed'], 405);
}

$input = getJsonInput();

try {
    $odoo = new OdooClientAlt(ODOO_URL, ODOO_DB, ODOO_UID, ODOO_PASS);
    
    // Prepare payload for Odoo - 'name' is required field for crm.lead
    $payload = [
        'name' => 'Aplikim: ' . ($input['position_title'] ?? 'Pozicion i paspecifikuar') . ' - ' . ($input['full_name'] ?? 'N/A'),
        'contact_name' => $input['full_name'] ?? '',
        'email_from' => $input['email'] ?? '',
        'phone' => $input['phone'] ?? '',
        'description' => $input['message'] ?? '',
        'position_title' => $input['position_title'] ?? '',
        'resume_name' => $input['resume_name'] ?? ''
    ];
    
    // Create job application lead in Odoo
    // Odoo will handle email sending to b.njerezore@abissnet.al
    $leadId = $odoo->execute('crm.lead', 'create_from_api_job', [$payload]);
    
    error_log("Job application submitted - Lead #$leadId created");
    error_log("Applicant: " . ($input['full_name'] ?? 'N/A'));
    error_log("Position: " . ($input['position_title'] ?? 'N/A'));
    error_log("Email will be sent to: b.njerezore@abissnet.al");
    
    jsonResponse(['success' => true, 'lead_id' => $leadId]);
    
} catch (Exception $e) {
    error_log("ODOO ERROR: " . $e->getMessage());
    jsonResponse(['success' => false, 'error' => $e->getMessage()], 500);
}
