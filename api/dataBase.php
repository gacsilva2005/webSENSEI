<?php
// api/Database.php - VERSÃO PRODUÇÃO
class Database {
    private static $instance = null;
    private $conn;
    
    // Configurações do banco
    private $host = "localhost";
    private $db_name = "senseidojo_db";
    private $username = "root";
    private $password = "Gb762729";
    private $charset = "utf8mb4";

    // Construtor privado
    private function __construct() {
        try {
            $dsn = "mysql:host={$this->host};dbname={$this->db_name};charset={$this->charset}";
            $this->conn = new PDO($dsn, $this->username, $this->password);
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
            $this->conn->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
            
            // Timezone
            $this->conn->exec("SET time_zone = '-03:00'");
            
        } catch(PDOException $e) {
            error_log("Erro de conexão: " . $e->getMessage());
            throw new Exception("Erro ao conectar ao banco de dados.");
        }
    }

    // Método para obter instância
    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new Database();
        }
        return self::$instance;
    }

    // Obter conexão
    public function getConnection() {
        return $this->conn;
    }

    // Iniciar transação
    public function beginTransaction() {
        return $this->conn->beginTransaction();
    }

    // Commit
    public function commit() {
        return $this->conn->commit();
    }

    // Rollback
    public function rollback() {
        return $this->conn->rollback();
    }

    // Último ID inserido
    public function lastInsertId() {
        return $this->conn->lastInsertId();
    }
}
?>