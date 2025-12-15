document.addEventListener('DOMContentLoaded', function() {
    const logoutBtn = document.getElementById('logoutBtn');

    // API URL
    const LOGOUT_API = '../../api/auth/logout.php';
    
    // Verificar se o usuário está logado
    function verificarLogin() {
        const token = localStorage.getItem('admin_token');
        const adminData = localStorage.getItem('admin_data');
        
        if (!token || !adminData) {
            // Se não estiver logado, redireciona para login
            redirecionarParaLogin();
            return false;
        }
        
        return true;
    }
    
    // Obter informações do admin logado
    function obterInfoAdmin() {
        try {
            const adminData = localStorage.getItem('admin_data');
            if (adminData) {
                return JSON.parse(adminData);
            }
        } catch (e) {
            console.error('Erro ao ler dados do admin:', e);
        }
        return null;
    }
    
    // Redirecionar para login
    function redirecionarParaLogin() {
        window.location.href = '../login-page.html';
    }
    
    // Função para fazer logout completo
    async function fazerLogout() {
        const adminInfo = obterInfoAdmin();
        const adminName = adminInfo ? adminInfo.admin_name : 'Administrador';
        
        // Mostrar confirmação personalizada
        const confirmar = confirm(`Olá, ${adminName}!\n\nDeseja realmente sair do sistema?`);
        
        if (!confirmar) {
            return;
        }
        
        // Mostrar feedback visual
        const btnOriginalText = logoutBtn.innerHTML;
        logoutBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Saindo...</span>';
        logoutBtn.disabled = true;
        
        try {
            // Obter token
            const token = localStorage.getItem('admin_token');
            
            // Se tiver token, tenta invalidar no servidor
            if (token) {
                const resposta = await fetch(LOGOUT_API, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ token: token })
                });
                
                const dados = await resposta.json();
                
                if (dados.success) {
                    console.log(`Logout realizado para: ${dados.admin_name || adminName}`);
                } else {
                    console.warn('Não foi possível invalidar token no servidor:', dados.message);
                }
            }
            
            // Limpar dados do localStorage
            localStorage.removeItem('admin_token');
            localStorage.removeItem('admin_data');
            
            // Feedback visual de sucesso
            logoutBtn.innerHTML = '<i class="fas fa-check"></i><span>Logout realizado!</span>';
            logoutBtn.style.background = 'linear-gradient(135deg, #28a745 0%, #218838 100%)';
            
            // Aguardar 1 segundo e redirecionar
            setTimeout(() => {
                redirecionarParaLogin();
            }, 1000);
            
        } catch (erro) {
            console.error('Erro ao fazer logout:', erro);
            
            // Mesmo com erro, limpa os dados localmente
            localStorage.removeItem('admin_token');
            localStorage.removeItem('admin_data');
            
            // Restaurar botão
            logoutBtn.innerHTML = btnOriginalText;
            logoutBtn.disabled = false;
            
            setTimeout(redirecionarParaLogin, 500);
        }
    }
    
    // Evento de clique no botão de logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            fazerLogout();
        });
    }
    
    // Verificar login ao carregar a página
    verificarLogin();
    
    // Prevenir voltar para página após logout
    window.addEventListener('popstate', function() {
        if (!localStorage.getItem('admin_token')) {
            redirecionarParaLogin();
        }
    });
});