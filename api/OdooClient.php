<?php
/**
 * Odoo JSON-RPC Client
 * Handles communication with Odoo CRM via JSON-RPC
 */
class OdooClient {
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

    /**
     * Execute a method on an Odoo model
     * 
     * @param string $model Model name (e.g., 'crm.lead')
     * @param string $method Method name (e.g., 'create_from_api')
     * @param array $args Arguments for the method
     * @param array $kwargs Keyword arguments
     * @return mixed Result from Odoo
     * @throws Exception if request fails
     */
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
        $url = $this->url . '/jsonrpc';

        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_HTTPHEADER => [
                'Content-Type: application/json',
                'Content-Length: ' . strlen($jsonPayload)
            ],
            CURLOPT_POSTFIELDS => $jsonPayload,
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_SSL_VERIFYHOST => false,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_CONNECTTIMEOUT => 10,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_ENCODING => '', // Accept any encoding
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        ]);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $curlError = curl_error($ch);
        $curlErrno = curl_errno($ch);
        curl_close($ch);

        // Handle CURL errors
        if ($curlErrno !== 0) {
            throw new Exception("Connection Error: $curlError (Code: $curlErrno)");
        }

        // Handle HTTP errors
        if ($httpCode !== 200) {
            $errorMsg = "HTTP $httpCode";
            if ($response) {
                $errorMsg .= ": " . substr($response, 0, 200);
            }
            throw new Exception($errorMsg);
        }

        // Parse response
        if (empty($response)) {
            throw new Exception("Empty response from Odoo server");
        }

        $data = json_decode($response, true);
        
        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new Exception("Invalid JSON response: " . json_last_error_msg());
        }

        // Handle Odoo errors
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
