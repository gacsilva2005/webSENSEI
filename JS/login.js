// Configurações
const API_URL = '../api/auth/admin_login.php';

// Quando o formulário for enviado
document.querySelector('.form').addEventListener('submit', async function(e) {
    e.preventDefault(); // Impede o envio tradicional
    
    // Obtém os valores dos inputs
    const email = this.querySelector('input[type="text"]').value;
    const senha = this.querySelector('input[type="password"]').value;
    
    // Validação simples
    if (!email || !senha) {
        alert('Por favor, preencha todos os campos!');
        return;
    }
    
    // Desabilita o botão para evitar múltiplos cliques
    const botao = this.querySelector('.button-login');
    const textoOriginal = botao.textContent;
    botao.textContent = 'AUTENTICANDO...';
    botao.disabled = true;
    
    try {
        // Envia para a API
        const resposta = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                admin_email: email,
                password: senha
            })
        });
        
        // Converte a resposta para JSON
        const dados = await resposta.json();
        
        if (dados.success) {
            // Salva o token se existir
            if (dados.session) {
                localStorage.setItem('admin_token', dados.session.token);
            }
            
            // Salva dados do admin se existir
            if (dados.admin) {
                localStorage.setItem('admin_data', JSON.stringify(dados.admin));
            }
            
            // Redireciona para a página administrativa
            window.location.href = dados.redirect || '../HTML/admin/admin-page.html';
            
        } else {
            alert('Erro: ' + dados.message);
            botao.textContent = textoOriginal;
            botao.disabled = false;
        }
        
    } catch (erro) {
        console.error('Erro:', erro);
        alert('Erro de conexão com o servidor!');
        botao.textContent = textoOriginal;
        botao.disabled = false;
    }
});

// Preenchimento automático para testes (REMOVA EM PRODUÇÃO)
window.addEventListener('load', function() {
    // Verifica se estamos em ambiente de desenvolvimento
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        const inputs = document.querySelectorAll('.form input');
        if (inputs[0] && inputs[1]) {
            inputs[0].value = 'admin@senseidojo.com';
            inputs[1].value = 'Admin123@';
            
            console.log('Credenciais de teste preenchidas automaticamente');
            console.log('Email: admin@senseidojo.com | Senha: Admin123@');
        }
    }
    
    // Verifica se já está logado
    const token = localStorage.getItem('admin_token');
    if (token) {
        // Verifica se o token ainda é válido (implementação básica)
        // Em produção, você deve validar com a API
        const adminData = localStorage.getItem('admin_data');
        if (adminData) {
            console.log('Já está logado, redirecionando...');
            window.location.href = '../HTML/admin/admin-page.html';
        }
    }
});
