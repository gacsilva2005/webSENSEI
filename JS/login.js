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
