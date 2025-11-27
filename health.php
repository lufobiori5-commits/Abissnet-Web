<?php
require_once __DIR__ . '/api/config.php';

header('Content-Type: application/json');
echo json_encode([
    'status' => 'ok',
    'timestamp' => date('c'),
    'uptime' => time(),
    'message' => 'Health endpoint working'
]);
