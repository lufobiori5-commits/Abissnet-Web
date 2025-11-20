<?php
header('Content-Type: application/json');
echo json_encode(['status' => 'PHP is working', 'method' => $_SERVER['REQUEST_METHOD']]);
