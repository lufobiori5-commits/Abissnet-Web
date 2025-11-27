<?php
/**
 * Simple file_get_contents test
 */
header('Content-Type: application/json');

// Test if file_get_contents works for HTTPS
$url = 'https://hr.abissnet.al/jsonrpc';
$payload = json_encode(['test' => true]);

$options = [
    'http' => [
        'method' => 'POST',
        'header' => 'Content-Type: application/json',
        'content' => $payload,
        'timeout' => 10,
        'ignore_errors' => true
    ],
    'ssl' => [
        'verify_peer' => false,
        'verify_peer_name' => false
    ]
];

$context = stream_context_create($options);
$result = @file_get_contents($url, false, $context);

echo json_encode([
    'success' => ($result !== false),
    'result' => $result ? 'Got response' : 'Failed',
    'error' => $result === false ? error_get_last() : null,
    'http_response_header' => $http_response_header ?? null
], JSON_PRETTY_PRINT);
