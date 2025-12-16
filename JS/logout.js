// logout.js - Sistema completo de logout com popup personalizado

document.addEventListener('DOMContentLoaded', function() {
    // Elementos
    const logoutBtn = document.getElementById('logoutBtn');
    const logoutPopup = document.getElementById('logoutPopup');
    const adminNamePopup = document.getElementById('adminNamePopup');
    const adminEmailPopup = document.getElementById('adminEmailPopup');
    const popupConfirmBtn = document.getElementById('popupConfirmBtn');
    const popupCancelBtn = document.getElementById('popupCancelBtn');
    const popupCloseBtn = document.querySelector('.popup-close');
    
    // API URL
    const LOGOUT_API = '../../api/auth/logout.php';
    
    // Verificar se o usuário está logado
    function verificarLogin() {
        const token = localStorage.getItem('admin_token');
        const adminData = localStorage.getItem('admin_data');
        
        if (!token || !adminData) {
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
    
    // Mostrar popup de logout
    function mostrarPopupLogout() {
        const adminInfo = obterInfoAdmin();
        
        if (adminInfo) {
            adminNamePopup.textContent = adminInfo.admin_name;
            adminEmailPopup.textContent = adminInfo.admin_email || 'Sem email cadastrado';
        } else {
            adminNamePopup.textContent = 'Administrador';
            adminEmailPopup.textContent = '';
        }
        
        logoutPopup.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Impede scroll do body
    }
    
    // Esconder popup de logout
    function esconderPopupLogout() {
        logoutPopup.style.display = 'none';
        document.body.style.overflow = ''; // Restaura scroll do body
    }
    
    // Função principal de logout
    async function executarLogout() {
        const adminInfo = obterInfoAdmin();
        const adminName = adminInfo ? adminInfo.admin_name : 'Administrador';
        
        // Desabilitar botão e mostrar loading
        popupConfirmBtn.disabled = true;
        popupConfirmBtn.classList.add('loading');
        popupConfirmBtn.innerHTML = '<i class="fas fa-spinner"></i>Processando...';
        
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
            
            // Feedback visual no popup
            popupConfirmBtn.innerHTML = '<i class="fas fa-check"></i>Logout realizado!';
            popupConfirmBtn.style.background = 'linear-gradient(135deg, #28a745 0%, #218838 100%)';
            
            // Aguardar 1.5 segundos e redirecionar
            setTimeout(() => {
                esconderPopupLogout();
                redirecionarParaLogin();
            }, 1500);
            
        } catch (erro) {
            console.error('Erro ao fazer logout:', erro);
            
            // Feedback de erro
            popupConfirmBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i>Erro!';
            popupConfirmBtn.style.background = 'linear-gradient(135deg, #ffc107 0%, #e0a800 100%)';
            
            // Limpar dados localmente mesmo com erro
            localStorage.removeItem('admin_token');
            localStorage.removeItem('admin_data');
            
            // Aguardar e redirecionar
            setTimeout(() => {
                esconderPopupLogout();
                redirecionarParaLogin();
            }, 1500);
        }
    }
    
    // Event Listeners
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            mostrarPopupLogout();
        });
    }
    
    // Confirmar logout no popup
    popupConfirmBtn.addEventListener('click', function(e) {
        e.preventDefault();
        executarLogout();
    });
    
    // Cancelar logout
    popupCancelBtn.addEventListener('click', function(e) {
        e.preventDefault();
        esconderPopupLogout();
    });
    
    // Fechar popup com X
    popupCloseBtn.addEventListener('click', function(e) {
        e.preventDefault();
        esconderPopupLogout();
    });
    
    // Fechar popup clicando fora
    logoutPopup.addEventListener('click', function(e) {
        if (e.target === this || e.target.classList.contains('popup-overlay')) {
            esconderPopupLogout();
        }
    });
    
    // Fechar com ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && logoutPopup.style.display === 'flex') {
            esconderPopupLogout();
        }
    });
    
    // Verificar login ao carregar a página
    verificarLogin();
    
    // Mostrar informação do admin logado (opcional)
    const adminInfo = obterInfoAdmin();
    if (adminInfo) {
        console.log(`Admin logado: ${adminInfo.admin_name} (${adminInfo.admin_email})`);
    }
    
    // Logout automático após inatividade (opcional)
    let inactivityTimer;
    const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutos
    
    function resetInactivityTimer() {
        clearTimeout(inactivityTimer);
        inactivityTimer = setTimeout(function() {
            const token = localStorage.getItem('admin_token');
            const adminData = localStorage.getItem('admin_data');
            
            if (token && adminData) {
                const adminInfo = JSON.parse(adminData);
                // Usa o mesmo popup para inatividade
                adminNamePopup.textContent = adminInfo.admin_name;
                adminEmailPopup.textContent = adminInfo.admin_email || '';
                
                // Altera mensagem para inatividade
                const messageElement = logoutPopup.querySelector('.popup-message p:first-child');
                if (messageElement) {
                    messageElement.innerHTML = `<strong>${adminInfo.admin_name}</strong>, sua sessão expirou por inatividade.`;
                }
                
                mostrarPopupLogout();
                
                // Remove o listener normal de confirmação temporariamente
                const originalHandler = popupConfirmBtn.onclick;
                popupConfirmBtn.onclick = function(e) {
                    e.preventDefault();
                    resetInactivityTimer();
                    esconderPopupLogout();
                    // Restaura o handler original
                    popupConfirmBtn.onclick = originalHandler;
                };
            }
        }, INACTIVITY_TIMEOUT);
    }
    
    // Reiniciar timer em eventos de interação
    ['click', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
        document.addEventListener(event, resetInactivityTimer, { passive: true });
    });
    
    // Iniciar timer
    resetInactivityTimer();
});