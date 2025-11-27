<?php
/**
 * Network Diagnostics
 * Access: https://abissnet.cloud/test-network.php
 */

header('Content-Type: application/json');

$tests = [];

// Test 1: Can PHP make outbound connections?
$tests['curl_enabled'] = function_exists('curl_init');

// Test 2: Try simple HTTP request
try {
    $ch = curl_init('https://www.google.com');
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 10,
        CURLOPT_NOBODY => true,
        CURLOPT_SSL_VERIFYPEER => false
    ]);
    $result = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);
    
    $tests['google_test'] = [
        'success' => ($httpCode >= 200 && $httpCode < 400),
        'http_code' => $httpCode,
        'error' => $error ?: null
    ];
} catch (Exception $e) {
    $tests['google_test'] = ['error' => $e->getMessage()];
}

// Test 3: Try to reach Odoo server
$odooUrl = 'https://hr.abissnet.al';
try {
    $ch = curl_init($odooUrl);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 10,
        CURLOPT_NOBODY => true,
        CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_SSL_VERIFYHOST => false,
        CURLOPT_FOLLOWLOCATION => true
    ]);
    $result = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    $errno = curl_errno($ch);
    $info = curl_getinfo($ch);
    curl_close($ch);
    
    $tests['odoo_server_test'] = [
        'url' => $odooUrl,
        'success' => ($httpCode >= 200 && $httpCode < 400),
        'http_code' => $httpCode,
        'curl_error' => $error ?: null,
        'curl_errno' => $errno,
        'effective_url' => $info['url'],
        'total_time' => $info['total_time']
    ];
} catch (Exception $e) {
    $tests['odoo_server_test'] = ['error' => $e->getMessage()];
}

// Test 4: DNS resolution
$tests['dns_lookup'] = [
    'hr.abissnet.al' => gethostbyname('hr.abissnet.al')
];

// Test 5: Server configuration
$tests['server_info'] = [
    'php_version' => phpversion(),
    'allow_url_fopen' => ini_get('allow_url_fopen'),
    'open_basedir' => ini_get('open_basedir') ?: 'none',
    'disable_functions' => ini_get('disable_functions') ?: 'none'
];

echo json_encode([
    'tests' => $tests,
    'diagnosis' => (
        $tests['odoo_server_test']['http_code'] === 0 
        ? "Your hosting provider is blocking outbound HTTPS connections to hr.abissnet.al" 
        : "Connection successful"
    )
], JSON_PRETTY_PRINT);
