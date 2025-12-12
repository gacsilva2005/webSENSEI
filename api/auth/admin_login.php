<?php
require_once '../datBase.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método não permitido']);
    exit;
}

// Obter dados do POST
$input = file_get_contents('php://input');
$data = json_decode($input, true);

// Verificar se veio JSON válido
if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'JSON inválido']);
    exit;
}

// Validar campos obrigatórios
if (empty($data['admin_email']) || empty($data['password'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Email e senha são obrigatórios']);
    exit;
}

$email = trim($data['admin_email']);
$senha = $data['password'];

try {
    $db = Database::getInstance();
    $conn = $db->getConnection();
    
    // Buscar administrador pelo email
    $stmt = $conn->prepare("
        SELECT idadministrador, admin_name, password_hash, admin_email, 
               acess_level, photo_perfil, active 
        FROM administrador 
        WHERE admin_email = :email
    ");
    
    $stmt->bindParam(':email', $email);
    $stmt->execute();
    
    $admin = $stmt->fetch(PDO::FETCH_ASSOC);
    
    // Verificar se encontrou o administrador
    if (!$admin) {
        http_response_code(401);
        echo json_encode([
            'success' => false, 
            'message' => 'Administrador não encontrado'
        ]);
        exit;
    }
    
    // Verificar se está ativo
    if ($admin['active'] != 1) {
        http_response_code(403);
        echo json_encode([
            'success' => false, 
            'message' => 'Conta desativada. Entre em contato com o suporte.'
        ]);
        exit;
    }
    
    // Verificar senha
    if (password_verify($senha, $admin['password_hash'])) {
        // Remover a senha da resposta
        unset($admin['password_hash']);
        
        // Gerar token de sessão
        $session_token = bin2hex(random_bytes(32));
        $session_expires = date('Y-m-d H:i:s', strtotime('+8 hours'));
        
        // Atualizar token de sessão no banco (opcional)
        $updateStmt = $conn->prepare("
            UPDATE administrador 
            SET session_token = :token, session_expires = :expires 
            WHERE idadministrador = :id
        ");
        
        $updateStmt->execute([
            ':token' => $session_token,
            ':expires' => $session_expires,
            ':id' => $admin['idadministrador']
        ]);
        
        $logStmt->execute([
            ':admin_id' => $admin['idadministrador'],
            ':ip' => $_SERVER['REMOTE_ADDR'] ?? 'unknown',
            ':agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'unknown'
        ]);
        
        // Retornar sucesso
        echo json_encode([
            'success' => true,
            'message' => 'Login realizado com sucesso!',
            'admin' => $admin,
            'session' => [
                'token' => $session_token,
                'expires' => $session_expires
            ],
            'redirect' => 'admin/admin-page.html'
        ]);
        
    } else {
        http_response_code(401);
        echo json_encode([
            'success' => false, 
            'message' => 'Senha incorreta'
        ]);
    }
    
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'message' => 'Erro no servidor: ' . $e->getMessage()
    ]);
    error_log("Erro login admin: " . $e->getMessage());
}
?>