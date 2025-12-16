<?php
// logout.php
require_once '../dataBase.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Verificar se é POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método não permitido']);
    exit;
}

// Obter dados do POST
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (empty($data['token'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Token não fornecido']);
    exit;
}

$token = trim($data['token']);

try {
    $db = Database::getInstance();
    $conn = $db->getConnection();
    
    // Verificar se o token existe e obter informações do admin
    $stmt = $conn->prepare("
        SELECT idadministrador, admin_name, admin_email 
        FROM administrador 
        WHERE session_token = :token 
        AND session_expires > NOW()
    ");
    
    $stmt->bindParam(':token', $token);
    $stmt->execute();
    
    $admin = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($admin) {
        // Invalida o token no banco (remove token e expiração)
        $updateStmt = $conn->prepare("
            UPDATE administrador 
            SET session_token = NULL, session_expires = NULL 
            WHERE idadministrador = :id
        ");
        
        $updateStmt->execute([':id' => $admin['idadministrador']]);
        
        // Log do logout (opcional)
        error_log("Logout realizado por: " . $admin['admin_name'] . " (" . $admin['admin_email'] . ")");
        
        echo json_encode([
            'success' => true,
            'message' => 'Logout realizado com sucesso',
            'admin_name' => $admin['admin_name']
        ]);
        
    } else {
        // Token já é inválido ou expirou
        echo json_encode([
            'success' => true,
            'message' => 'Sessão já foi encerrada'
        ]);
    }
    
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'message' => 'Erro ao processar logout'
    ]);
    error_log("Erro no logout: " . $e->getMessage());
}
?>