<?php
/**
 * Odoo JSON-RPC Client (file_get_contents version)
 * For servers where curl_exec is disabled
 */
class OdooClientAlt {
    private $url;
    private $db;
    private $uid;
    private $password;

    public function __construct($url, $db, $uid, $password) {
        $this->url = rtrim($url, '/');
        $this->db = $db;
        $this->uid = intval($uid);
        $this->password = $password;
    }

    public function execute($model, $method, $args = [], $kwargs = []) {
        $payload = [
            'jsonrpc' => '2.0',
            'method' => 'call',
            'params' => [
                'service' => 'object',
                'method' => 'execute_kw',
                'args' => [
                    $this->db,
                    $this->uid,
                    $this->password,
                    $model,
                    $method,
                    $args,
                    $kwargs
                ]
            ],
            'id' => time()
        ];

        $jsonPayload = json_encode($payload);
        
        // Use stream context instead of CURL
        $options = [
            'http' => [
                'method' => 'POST',
                'header' => [
                    'Content-Type: application/json',
                    'Content-Length: ' . strlen($jsonPayload)
                ],
                'content' => $jsonPayload,
                'timeout' => 30,
                'ignore_errors' => true
            ],
            'ssl' => [
                'verify_peer' => false,
                'verify_peer_name' => false
            ]
        ];

        $context = stream_context_create($options);
        $url = $this->url . '/jsonrpc';
        
        $response = @file_get_contents($url, false, $context);
        
        if ($response === false) {
            $error = error_get_last();
            throw new Exception("Connection failed: " . ($error['message'] ?? 'Unknown error'));
        }

        // Parse HTTP response code from headers
        $httpCode = 0;
        if (isset($http_response_header)) {
            foreach ($http_response_header as $header) {
                if (preg_match('/^HTTP\/[\d.]+\s+(\d+)/', $header, $matches)) {
                    $httpCode = intval($matches[1]);
                    break;
                }
            }
        }

        if ($httpCode !== 200 && $httpCode !== 0) {
            throw new Exception("HTTP Error: $httpCode");
        }

        if (empty($response)) {
            throw new Exception("Empty response from Odoo server");
        }

        $data = json_decode($response, true);
        
        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new Exception("Invalid JSON response: " . json_last_error_msg());
        }

        if (isset($data['error'])) {
            $errorMessage = 'Odoo Error: ';
            if (isset($data['error']['data']['message'])) {
                $errorMessage .= $data['error']['data']['message'];
            } elseif (isset($data['error']['message'])) {
                $errorMessage .= $data['error']['message'];
            } else {
                $errorMessage .= json_encode($data['error']);
            }
            throw new Exception($errorMessage);
        }

        return $data['result'] ?? null;
    }
}
