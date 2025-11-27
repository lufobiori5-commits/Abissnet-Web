<?php
/**
 * Jobs API Endpoint
 * Handles CRUD operations for job listings
 * Supports: GET (all/single), POST (create), PUT (update), DELETE
 */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/database.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];
$db = Database::getInstance();

try {
    switch ($method) {
        case 'GET':
            handleGet($db);
            break;
        case 'POST':
            handlePost($db);
            break;
        case 'PUT':
            handlePut($db);
            break;
        case 'DELETE':
            handleDelete($db);
            break;
        default:
            jsonResponse(['error' => 'Method not allowed'], 405);
    }
} catch (Exception $e) {
    error_log("API Error: " . $e->getMessage());
    jsonResponse(['error' => $e->getMessage()], 500);
}

/**
 * GET - Retrieve jobs
 * Query params:
 * - id: specific job ID
 * - published: filter by published status (1/0)
 * - department: filter by department
 * - type: filter by job type
 * - search: search in title, description, location
 */
function handleGet($db) {
    $id = $_GET['id'] ?? null;
    
    if ($id) {
        // Get single job
        $job = $db->fetchOne('SELECT * FROM jobs WHERE id = ?', [$id]);
        if (!$job) {
            jsonResponse(['error' => 'Job not found'], 404);
        }
        jsonResponse(['success' => true, 'job' => formatJob($job)]);
    }
    
    // Get all jobs with filters
    $sql = 'SELECT * FROM jobs WHERE 1=1';
    $params = [];
    
    if (isset($_GET['published'])) {
        $sql .= ' AND published = ?';
        $params[] = (int)$_GET['published'];
    }
    
    if (!empty($_GET['department'])) {
        $sql .= ' AND department = ?';
        $params[] = $_GET['department'];
    }
    
    if (!empty($_GET['type'])) {
        $sql .= ' AND type = ?';
        $params[] = $_GET['type'];
    }
    
    if (!empty($_GET['search'])) {
        $search = '%' . $_GET['search'] . '%';
        $sql .= ' AND (title LIKE ? OR description LIKE ? OR location LIKE ?)';
        $params[] = $search;
        $params[] = $search;
        $params[] = $search;
    }
    
    $sql .= ' ORDER BY created_at DESC';
    
    $jobs = $db->fetchAll($sql, $params);
    $formattedJobs = array_map('formatJob', $jobs);
    
    jsonResponse(['success' => true, 'jobs' => $formattedJobs, 'count' => count($formattedJobs)]);
}

/**
 * POST - Create new job
 * Required: title
 * Optional: department, location, type, description, published
 */
function handlePost($db) {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (empty($input['title'])) {
        jsonResponse(['error' => 'Title is required'], 400);
    }
    
    // Generate UUID v4
    $id = generateUUID();
    
    $sql = 'INSERT INTO jobs (id, title, department, location, type, description, published, created_at, updated_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?, datetime("now"), datetime("now"))';
    
    $params = [
        $id,
        trim($input['title']),
        trim($input['department'] ?? ''),
        trim($input['location'] ?? ''),
        trim($input['type'] ?? ''),
        trim($input['description'] ?? ''),
        isset($input['published']) ? (int)(bool)$input['published'] : 1
    ];
    
    $db->query($sql, $params);
    
    $job = $db->fetchOne('SELECT * FROM jobs WHERE id = ?', [$id]);
    
    jsonResponse(['success' => true, 'message' => 'Job created successfully', 'job' => formatJob($job)], 201);
}

/**
 * PUT - Update existing job
 * Required: id in request body
 */
function handlePut($db) {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (empty($input['id'])) {
        jsonResponse(['error' => 'Job ID is required'], 400);
    }
    
    // Check if job exists
    $existing = $db->fetchOne('SELECT * FROM jobs WHERE id = ?', [$input['id']]);
    if (!$existing) {
        jsonResponse(['error' => 'Job not found'], 404);
    }
    
    $updates = [];
    $params = [];
    
    if (isset($input['title'])) {
        $updates[] = 'title = ?';
        $params[] = trim($input['title']);
    }
    if (isset($input['department'])) {
        $updates[] = 'department = ?';
        $params[] = trim($input['department']);
    }
    if (isset($input['location'])) {
        $updates[] = 'location = ?';
        $params[] = trim($input['location']);
    }
    if (isset($input['type'])) {
        $updates[] = 'type = ?';
        $params[] = trim($input['type']);
    }
    if (isset($input['description'])) {
        $updates[] = 'description = ?';
        $params[] = trim($input['description']);
    }
    if (isset($input['published'])) {
        $updates[] = 'published = ?';
        $params[] = (int)(bool)$input['published'];
    }
    
    if (empty($updates)) {
        jsonResponse(['error' => 'No fields to update'], 400);
    }
    
    $updates[] = 'updated_at = datetime("now")';
    $params[] = $input['id'];
    
    $sql = 'UPDATE jobs SET ' . implode(', ', $updates) . ' WHERE id = ?';
    $db->query($sql, $params);
    
    $job = $db->fetchOne('SELECT * FROM jobs WHERE id = ?', [$input['id']]);
    
    jsonResponse(['success' => true, 'message' => 'Job updated successfully', 'job' => formatJob($job)]);
}

/**
 * DELETE - Delete job
 * Required: id in query string
 */
function handleDelete($db) {
    $id = $_GET['id'] ?? null;
    
    if (empty($id)) {
        jsonResponse(['error' => 'Job ID is required'], 400);
    }
    
    // Check if job exists
    $existing = $db->fetchOne('SELECT * FROM jobs WHERE id = ?', [$id]);
    if (!$existing) {
        jsonResponse(['error' => 'Job not found'], 404);
    }
    
    $db->query('DELETE FROM jobs WHERE id = ?', [$id]);
    
    jsonResponse(['success' => true, 'message' => 'Job deleted successfully']);
}

/**
 * Format job data for response (convert published to boolean)
 */
function formatJob($job) {
    if (!$job) return null;
    
    $job['published'] = (bool)$job['published'];
    return $job;
}

/**
 * Generate UUID v4
 */
function generateUUID() {
    $data = random_bytes(16);
    $data[6] = chr(ord($data[6]) & 0x0f | 0x40);
    $data[8] = chr(ord($data[8]) & 0x3f | 0x80);
    return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
}
