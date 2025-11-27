<?php
/**
 * Subscriber Portal APIs
 * Handles all subscriber-related endpoints
 */

require_once __DIR__ . '/config.php';

$uri = $_SERVER['REQUEST_URI'];
$method = $_SERVER['REQUEST_METHOD'];

// Route handling
if (strpos($uri, '/api/overview') !== false) {
    handleOverview();
} elseif (strpos($uri, '/api/devices') !== false) {
    handleDevices();
} elseif (strpos($uri, '/api/invoices') !== false) {
    handleInvoices();
} elseif (strpos($uri, '/api/tickets') !== false) {
    handleTickets();
} elseif (strpos($uri, '/api/speedtest') !== false) {
    handleSpeedtest();
} elseif (strpos($uri, '/api/line-test') !== false) {
    handleLineTest();
} elseif (strpos($uri, '/api/restart-cpe') !== false) {
    handleRestartCPE();
} elseif (strpos($uri, '/api/pay') !== false) {
    handlePay();
} elseif (strpos($uri, '/api/upgrade') !== false) {
    handleUpgrade();
} elseif (strpos($uri, '/api/add-tv') !== false) {
    handleAddTV();
} elseif (strpos($uri, '/api/public-ip') !== false) {
    handlePublicIP();
} elseif (strpos($uri, '/api/health') !== false) {
    handleHealth();
} else {
    jsonResponse(['error' => 'endpoint not found'], 404);
}

// ============ HANDLERS ============

function handleOverview() {
    requireAuth();
    
    try {
        $state = readState();
        jsonResponse($state['overview']);
    } catch (Exception $e) {
        error_log("Error fetching overview: " . $e->getMessage());
        jsonResponse(['error' => 'Failed to fetch overview'], 500);
    }
}

function handleDevices() {
    requireAuth();
    
    try {
        $state = readState();
        jsonResponse(['devices' => $state['devices']]);
    } catch (Exception $e) {
        error_log("Error fetching devices: " . $e->getMessage());
        jsonResponse(['error' => 'Failed to fetch devices'], 500);
    }
}

function handleInvoices() {
    requireAuth();
    
    try {
        $state = readState();
        jsonResponse(['invoices' => $state['invoices']]);
    } catch (Exception $e) {
        error_log("Error fetching invoices: " . $e->getMessage());
        jsonResponse(['error' => 'Failed to fetch invoices'], 500);
    }
}

function handleTickets() {
    requireAuth();
    
    global $method;
    
    if ($method === 'GET') {
        try {
            $state = readState();
            jsonResponse(['tickets' => $state['tickets']]);
        } catch (Exception $e) {
            error_log("Error fetching tickets: " . $e->getMessage());
            jsonResponse(['error' => 'Failed to fetch tickets'], 500);
        }
    } elseif ($method === 'POST') {
        $input = getJsonInput();
        $subject = $input['subject'] ?? null;
        $category = $input['category'] ?? null;
        $message = $input['message'] ?? null;
        
        if (!$subject || !$category || !$message) {
            jsonResponse(['error' => 'missing fields'], 400);
        }
        
        try {
            $state = readState();
            $lastId = count($state['tickets']) > 0 ? end($state['tickets'])['id'] : 1000;
            $id = (string)($lastId + 1);
            
            $ticket = [
                'id' => $id,
                'subject' => $subject,
                'category' => $category,
                'message' => $message,
                'status' => 'open',
                'created_at' => date('c')
            ];
            
            $state['tickets'][] = $ticket;
            writeState($state);
            
            error_log("New ticket created: #$id - $subject [$category]");
            jsonResponse(['ok' => true, 'id' => $id, 'ticket' => $ticket]);
        } catch (Exception $e) {
            error_log("Error creating ticket: " . $e->getMessage());
            jsonResponse(['error' => 'Failed to create ticket'], 500);
        }
    } else {
        jsonResponse(['error' => 'Method not allowed'], 405);
    }
}

function handleSpeedtest() {
    requireAuth();
    
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        jsonResponse(['error' => 'Method not allowed'], 405);
    }
    
    // Simulate speed test delay
    sleep(3);
    
    $down = 270 + rand(0, 30);
    $up = 270 + rand(0, 30);
    $ping = 5 + rand(0, 10);
    $jitter = 1 + rand(0, 3);
    
    error_log("Speed test completed: ↓$down Mbps ↑$up Mbps ({$ping}ms)");
    
    jsonResponse([
        'down' => $down,
        'up' => $up,
        'ping' => $ping,
        'jitter' => $jitter,
        'timestamp' => date('c')
    ]);
}

function handleLineTest() {
    requireAuth();
    
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        jsonResponse(['error' => 'Method not allowed'], 405);
    }
    
    error_log("Running line test...");
    sleep(1);
    
    jsonResponse(['ok' => true, 'note' => "S'ka probleme të detektuara."]);
}

function handleRestartCPE() {
    requireAuth();
    
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        jsonResponse(['error' => 'Method not allowed'], 405);
    }
    
    error_log("Restarting CPE...");
    sleep(2);
    
    jsonResponse(['ok' => true, 'message' => 'CPE është restartuar me sukses']);
}

function handlePay() {
    requireAuth();
    
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        jsonResponse(['error' => 'Method not allowed'], 405);
    }
    
    $input = getJsonInput();
    $invoiceId = $input['invoiceId'] ?? 'DEMO';
    
    error_log("Payment initiated for invoice: $invoiceId");
    
    jsonResponse([
        'url' => "https://pay.abissnet.al/checkout?ref=ABISS-$invoiceId",
        'invoiceId' => $invoiceId
    ]);
}

function handleUpgrade() {
    requireAuth();
    
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        jsonResponse(['error' => 'Method not allowed'], 405);
    }
    
    $input = getJsonInput();
    $plan = $input['plan'] ?? null;
    
    if (!$plan) {
        jsonResponse(['error' => 'missing plan'], 400);
    }
    
    try {
        $state = readState();
        $oldPlan = $state['overview']['plan']['name'];
        
        $state['overview']['plan']['name'] = $plan;
        $state['overview']['plan']['desc'] = "$plan Mbps, kontratë 12M, IP dinamike";
        
        writeState($state);
        
        error_log("Plan upgraded: $oldPlan → $plan");
        jsonResponse(['ok' => true, 'message' => 'Plani u ndryshua me sukses']);
    } catch (Exception $e) {
        error_log("Error upgrading plan: " . $e->getMessage());
        jsonResponse(['error' => 'Failed to upgrade plan'], 500);
    }
}

function handleAddTV() {
    requireAuth();
    
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        jsonResponse(['error' => 'Method not allowed'], 405);
    }
    
    $input = getJsonInput();
    $packageName = $input['packageName'] ?? 'Basic';
    
    error_log("TV package added: $packageName");
    jsonResponse([
        'ok' => true,
        'message' => "Paketa TV \"$packageName\" u shtua me sukses"
    ]);
}

function handlePublicIP() {
    requireAuth();
    
    jsonResponse([
        'ip' => '185.99.99.99',
        'isp' => 'Abissnet',
        'location' => 'Tirana, Albania'
    ]);
}

function handleHealth() {
    jsonResponse([
        'status' => 'ok',
        'timestamp' => date('c'),
        'uptime' => time()
    ]);
}
