<?php
/**
 * SQLite Database Manager for Jobs
 * Handles database connection and initialization
 */

class Database {
    private static $instance = null;
    private $db;
    private $dbPath;

    private function __construct() {
        // Database will be stored in the api directory
        $this->dbPath = __DIR__ . '/jobs.db';
        $this->connect();
        $this->initTables();
    }

    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function connect() {
        try {
            $this->db = new PDO('sqlite:' . $this->dbPath);
            $this->db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->db->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Database connection error: " . $e->getMessage());
            throw new Exception("Failed to connect to database");
        }
    }

    private function initTables() {
        $sql = "
        CREATE TABLE IF NOT EXISTS jobs (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            department TEXT,
            location TEXT,
            type TEXT,
            description TEXT,
            published INTEGER DEFAULT 1,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP
        )";

        try {
            $this->db->exec($sql);
        } catch (PDOException $e) {
            error_log("Table creation error: " . $e->getMessage());
            throw new Exception("Failed to create tables");
        }
    }

    public function getConnection() {
        return $this->db;
    }

    public function query($sql, $params = []) {
        try {
            $stmt = $this->db->prepare($sql);
            $stmt->execute($params);
            return $stmt;
        } catch (PDOException $e) {
            error_log("Query error: " . $e->getMessage());
            throw new Exception("Database query failed");
        }
    }

    public function fetchAll($sql, $params = []) {
        return $this->query($sql, $params)->fetchAll();
    }

    public function fetchOne($sql, $params = []) {
        return $this->query($sql, $params)->fetch();
    }

    public function lastInsertId() {
        return $this->db->lastInsertId();
    }
}
