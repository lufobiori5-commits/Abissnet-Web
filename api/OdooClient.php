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

        $ch = curl_init($this->url . '/jsonrpc');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 30);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $curlError = curl_error($ch);
        curl_close($ch);

        if ($curlError) {
            throw new Exception("CURL Error: " . $curlError);
        }

        if ($httpCode !== 200) {
            throw new Exception("HTTP Error: " . $httpCode);
        }

        $data = json_decode($response, true);

        if (isset($data['error'])) {
            throw new Exception("Odoo Error: " . json_encode($data['error']));
        }

        return $data['result'] ?? null;
    }
}
