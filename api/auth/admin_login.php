<?php
require_once '../dataBase.php';

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

if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'JSON inválido']);
    exit;
}

if (empty($data['admin_email']) || empty($data['password'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Email e senha são obrigatórios']);
    exit;
}

$email = trim($data['admin_email']);
$senha = $data['password'];

// Validação de email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Email inválido']);
    exit;
}

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
    
    if (!$admin) {
        // Mensagem genérica
        http_response_code(401);
        echo json_encode([
            'success' => false, 
            'message' => 'Credenciais inválidas'
        ]);
        exit;
    }
    
    // Verificar se a conta está ativa
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
        $session_expires = date('Y-m-d H:i:s', strtotime('+1 hour'));
        
        // Atualizar token de sessão no banco
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
        
        // Retornar sucesso (SEM LOGS)
        echo json_encode([
            'success' => true,
            'message' => 'Login realizado com sucesso!',
            'admin' => $admin,
            'session' => [
                'token' => $session_token,
                'expires' => $session_expires
            ],
            'redirect' => '../HTML/admin/admin-page.html'
        ]);
        
    } else {
        // Senha incorreta
        http_response_code(401);
        echo json_encode([
            'success' => false, 
            'message' => 'Credenciais inválidas'
        ]);
    }
    
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'message' => 'Erro no servidor. Tente novamente mais tarde.'
    ]);

    error_log("Erro no login admin: " . $e->getMessage());
}
?>