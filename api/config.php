<?php
/**
 * Configuration and Helper Functions
 * Loads environment variables and provides utility functions
 */

// Load environment variables from .env file
function loadEnv($filePath) {
    if (!file_exists($filePath)) {
        return;
    }

    $lines = file($filePath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        // Skip comments
        if (strpos(trim($line), '#') === 0) {
            continue;
        }

        // Remove inline comments
        $line = preg_replace('/#.*$/', '', $line);
        $line = trim($line);

        if (empty($line)) {
            continue;
        }

        // Parse KEY=VALUE
        list($name, $value) = explode('=', $line, 2);
        $name = trim($name);
        $value = trim($value);

        // Remove quotes if present
        $value = trim($value, '"\'');

        if (!array_key_exists($name, $_ENV)) {
            $_ENV[$name] = $value;
            putenv("$name=$value");
        }
    }
}

// Load .env from parent directory
loadEnv(__DIR__ . '/../.env');

// Configuration constants
define('ODOO_URL', $_ENV['ODOO_URL'] ?? 'https://hr.abissnet.al');
define('ODOO_DB', $_ENV['ODOO_DB'] ?? 'odoo');
define('ODOO_UID', $_ENV['ODOO_UID'] ?? '858');
define('ODOO_PASS', $_ENV['ODOO_PASS'] ?? 'Biori1234');
define('AUTH_TOKEN', 'demo-token');
define('DATA_FILE', __DIR__ . '/../server/data/subscribers.json');

/**
 * Send JSON response
 */
function jsonResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}

/**
 * Get JSON input from request body
 */
function getJsonInput() {
    $input = file_get_contents('php://input');
    return json_decode($input, true) ?? [];
}

/**
 * Check if request is authorized
 */
function isAuthorized() {
    $headers = getallheaders();
    $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';
    
    if (strpos($authHeader, 'Bearer ') === 0) {
        $token = substr($authHeader, 7);
        return $token === AUTH_TOKEN;
    }
    
    return false;
}

/**
 * Require authorization or die
 */
function requireAuth() {
    if (!isAuthorized()) {
        jsonResponse(['error' => 'unauthorized'], 401);
    }
}

/**
 * Read subscriber data from JSON file
 */
function readState() {
    ensureDataFile();
    $json = file_get_contents(DATA_FILE);
    return json_decode($json, true);
}

/**
 * Write subscriber data to JSON file
 */
function writeState($data) {
    $json = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    file_put_contents(DATA_FILE, $json);
}

/**
 * Ensure data file exists with default structure
 */
function ensureDataFile() {
    if (file_exists(DATA_FILE)) {
        return;
    }

    $dataDir = dirname(DATA_FILE);
    if (!is_dir($dataDir)) {
        mkdir($dataDir, 0755, true);
    }

    $init = [
        'overview' => [
            'service' => [
                'status' => 'active',
                'note' => 'Shërbimi aktiv pa alarme.'
            ],
            'billing' => [
                'cycle' => 'Mujor',
                'last_invoice' => '3,200 ALL',
                'due_date' => '10/11/2025',
                'balance' => '0 ALL'
            ],
            'plan' => [
                'name' => 'Fiber 300',
                'desc' => '300/300 Mbps, kontratë 12M, IP dinamike'
            ]
        ],
        'devices' => [
            [
                'title' => 'ONT/Modem',
                'model' => 'ZTE F660',
                'mac' => 'AC:12:34:56:78:9A',
                'ip' => '192.168.1.1',
                'status' => 'Online'
            ],
            [
                'title' => 'STB',
                'model' => 'MAG 520',
                'mac' => 'B0:AA:BC:DE:F0:11',
                'ip' => '192.168.1.50',
                'status' => 'Online'
            ],
            [
                'title' => 'Mesh AP',
                'model' => 'TP-Link X20',
                'mac' => '10:22:33:44:55:66',
                'ip' => '192.168.1.3',
                'status' => 'Offline'
            ]
        ],
        'invoices' => [
            ['date' => '10/10/2025', 'amount' => '3,200', 'status' => 'Paguar'],
            ['date' => '10/09/2025', 'amount' => '3,200', 'status' => 'Paguar'],
            ['date' => '10/08/2025', 'amount' => '3,200', 'status' => 'Paguar']
        ],
        'tickets' => []
    ];

    writeState($init);
}

// Enable CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}
