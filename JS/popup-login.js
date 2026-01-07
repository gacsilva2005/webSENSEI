document.addEventListener('DOMContentLoaded', function() {
    const loginModal = document.getElementById('loginModal');
    const openModalBtn = document.getElementById('openLoginModal');
    const closeModalBtn = document.getElementById('closeModal');
    const understoodBtn = document.getElementById('btnUnderstood');
    
    // Abrir modal
    if (openModalBtn) {
        openModalBtn.addEventListener('click', function(e) {
            e.preventDefault();
            loginModal.classList.add('active');
            setTimeout(() => {
                loginModal.querySelector('.modal-container').classList.add('active');
            }, 10);
            document.body.style.overflow = 'hidden'; // Bloquear scroll
        });
    }
    
    // Fechar modal com botão X
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }
    
    // Fechar modal com botão "Entendi"
    if (understoodBtn) {
        understoodBtn.addEventListener('click', closeModal);
    }
    
    // Fechar modal clicando fora
    loginModal.addEventListener('click', function(e) {
        if (e.target === loginModal) {
            closeModal();
        }
    });
    
    // Fechar com ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && loginModal.classList.contains('active')) {
            closeModal();
        }
    });
    
    function closeModal() {
        loginModal.querySelector('.modal-container').classList.remove('active');
        setTimeout(() => {
            loginModal.classList.remove('active');
            document.body.style.overflow = 'auto'; // Restaurar scroll
        }, 300);
    }
});