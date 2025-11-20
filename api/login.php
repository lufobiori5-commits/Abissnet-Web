<?php
/**
 * Login API
 * Simple demo authentication
 */

require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['error' => 'Method not allowed'], 405);
}

$input = getJsonInput();
$email = $input['email'] ?? '';
$password = $input['password'] ?? '';

if ($email === 'demo@abissnet.al' && $password === 'demo123') {
    error_log("Login successful: $email");
    jsonResponse(['token' => AUTH_TOKEN]);
} else {
    error_log("Login failed: $email");
    jsonResponse(['error' => 'invalid'], 401);
}
