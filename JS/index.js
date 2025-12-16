// Menu Mobile
const menuToggle = document.getElementById('mobile-menu');
const navMenu = document.querySelector('.nav-menu');

menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Fechar menu ao clicar em um link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    menuToggle.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Scroll suave para âncoras
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if(targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if(targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

const instituteObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if(entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.institute-content, .institute-stats').forEach(el => {
    instituteObserver.observe(el);
});

// Header com efeito de scroll
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if(window.scrollY > 100) {
        header.style.backgroundColor = 'rgba(0, 0, 0, 0.95)';
        header.style.padding = '10px 0';
    } else {
        header.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
        header.style.padding = '15px 0';
    }
});

// Animação de elementos ao rolar a página
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if(entry.isIntersecting) {
            entry.target.classList.add('animated');
        }
    });
}, observerOptions);

// Observar elementos para animação
document.querySelectorAll('.modality-card, .teacher-card, .gallery-item, .feature, .stat-item').forEach(el => {
    observer.observe(el);
});

// Modal para imagens da galeria
const galleryItems = document.querySelectorAll('.gallery-item');
galleryItems.forEach(item => {
    item.addEventListener('click', function() {
        const imgSrc = this.querySelector('img').src;
        const modal = document.createElement('div');
        modal.className = 'image-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <img src="${imgSrc}" alt="Imagem ampliada">
            </div>
        `;
        document.body.appendChild(modal);
        
        modal.style.display = 'flex';
        
        // Fechar modal
        modal.querySelector('.close-modal').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        // Fechar ao clicar fora da imagem
        modal.addEventListener('click', (e) => {
            if(e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    });
});

// Estilo adicional para o modal
const modalStyle = document.createElement('style');
modalStyle.textContent = `
    .image-modal {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.9);
        z-index: 2000;
        align-items: center;
        justify-content: center;
    }
    
    .modal-content {
        max-width: 90%;
        max-height: 90%;
        position: relative;
    }
    
    .modal-content img {
        width: 100%;
        height: auto;
        max-height: 80vh;
        object-fit: contain;
    }
    
    .close-modal {
        position: absolute;
        top: -40px;
        right: 0;
        color: white;
        font-size: 30px;
        cursor: pointer;
        background: none;
        border: none;
    }
`;
document.head.appendChild(modalStyle);

// Atualizar ano no footer
document.addEventListener('DOMContentLoaded', function() {
    const yearSpan = document.querySelector('#current-year');
    if(yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});

// Validação básica para formulário (se houver)
const contactForm = document.getElementById('contact-form');
if(contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validação básica
        const name = this.querySelector('input[name="name"]');
        const email = this.querySelector('input[name="email"]');
        const message = this.querySelector('textarea[name="message"]');
        
        let isValid = true;
        
        if(!name.value.trim()) {
            alert('Por favor, digite seu nome');
            isValid = false;
        } else if(!email.value.trim() || !email.value.includes('@')) {
            alert('Por favor, digite um email válido');
            isValid = false;
        } else if(!message.value.trim()) {
            alert('Por favor, digite sua mensagem');
            isValid = false;
        }
        
        if(isValid) {
            // Enviar formulário (aqui você integraria com seu backend)
            alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
            this.reset();
        }
    });
}