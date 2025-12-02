// Máscaras para os campos
document.addEventListener('DOMContentLoaded', function() {
    
    // Máscara para telefone
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 11) value = value.substring(0, 11);
            
            if (value.length > 10) {
                value = value.replace(/^(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
            } else if (value.length > 6) {
                value = value.replace(/^(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
            } else if (value.length > 2) {
                value = value.replace(/^(\d{2})(\d{4})/, '($1) $2');
            } else if (value.length > 0) {
                value = value.replace(/^(\d{2})/, '($1');
            }
            
            e.target.value = value;
        });
    }
    
    // Alternar visibilidade da senha
    const toggleButtons = document.querySelectorAll('.toggle-password');
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.className = 'fas fa-eye-slash';
            } else {
                input.type = 'password';
                icon.className = 'fas fa-eye';
            }
        });
    });
    
    // Validar força da senha
    const passwordInput = document.getElementById('password');
    if (passwordInput) {
        passwordInput.addEventListener('input', validarForcaSenha);
    }
    
    // Limpar formulário
    const clearBtn = document.getElementById('clearForm');
    if (clearBtn) {
        clearBtn.addEventListener('click', limparFormulario);
    }
    
    // Submeter formulário
    const form = document.getElementById('registerUserForm');
    if (form) {
        form.addEventListener('submit', submitForm);
    }
    
    // Novo cadastro
    const newRegisterBtn = document.getElementById('newRegister');
    if (newRegisterBtn) {
        newRegisterBtn.addEventListener('click', function() {
            document.getElementById('successMessage').style.display = 'none';
            form.style.display = 'block';
            limparFormulario();
        });
    }
});

// Função para validar força da senha
function validarForcaSenha() {
    const password = document.getElementById('password').value;
    const strengthBar = document.querySelector('.strength-bar');
    const strengthText = document.getElementById('strengthText');
    
    let strength = 0;
    let color = '#e74c3c';
    let text = 'fraca';
    
    // Verificar comprimento
    if (password.length >= 8) strength += 25;
    
    // Verificar letras minúsculas e maiúsculas
    if (/[a-z]/.test(password)) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    
    // Verificar números e caracteres especiais
    if (/\d/.test(password)) strength += 15;
    if (/[^A-Za-z0-9]/.test(password)) strength += 10;
    
    // Determinar cor e texto baseado na força
    if (strength >= 75) {
        color = '#2ecc71'; // Verde
        text = 'forte';
    } else if (strength >= 50) {
        color = '#f39c12'; // Laranja
        text = 'média';
    }
    
    // Atualizar barra e texto
    strengthBar.style.setProperty('--strength-color', color);
    strengthBar.style.width = strength + '%';
    strengthText.textContent = text;
    strengthText.style.color = color;
}

// Função para limpar formulário
function limparFormulario() {
    const form = document.getElementById('registerUserForm');
    form.reset();
    
    // Limpar mensagens de erro
    document.querySelectorAll('.error-message').forEach(el => {
        el.textContent = '';
    });
    
    // Resetar força da senha
    document.querySelector('.strength-bar').style.width = '0%';
    document.getElementById('strengthText').textContent = 'fraca';
    document.getElementById('strengthText').style.color = '#e74c3c';
    
    // Remover classes de erro
    document.querySelectorAll('.error').forEach(el => {
        el.classList.remove('error');
    });
}

// Função para submeter formulário
function submitForm(e) {
    e.preventDefault();
    
    // Validar todos os campos
    const isValid = validarFormulario();
    
    if (isValid) {
        console.log('Formulário válido. Enviando dados...');
        
        // Mostrar mensagem de sucesso
        document.getElementById('registerUserForm').style.display = 'none';
        document.getElementById('successMessage').style.display = 'block';
    }
}

// Função para validar todo o formulário
function validarFormulario() {
    let isValid = true;
    
    // Validar nome
    const nome = document.getElementById('fullName').value;
    if (nome.length < 5) {
        mostrarErro('nameError', 'Nome deve ter pelo menos 5 caracteres');
        isValid = false;
    } else {
        limparErro('nameError');
    }
    
    // Validar data de nascimento
    const birthDate = new Date(document.getElementById('birthDate').value);
    const hoje = new Date();
    const idade = hoje.getFullYear() - birthDate.getFullYear();
    
    if (idade < 16) {
        mostrarErro('birthDateError', 'Usuário deve ter pelo menos 16 anos');
        isValid = false;
    } else if (idade > 100) {
        mostrarErro('birthDateError', 'Data de nascimento inválida');
        isValid = false;
    } else {
        limparErro('birthDateError');
    }
    
    // Validar e-mail
    const email = document.getElementById('email').value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        mostrarErro('emailError', 'E-mail inválido');
        isValid = false;
    } else {
        limparErro('emailError');
    }
    
    // Validar telefone
    const phone = document.getElementById('phone').value.replace(/\D/g, '');
    if (phone.length < 10 || phone.length > 11) {
        mostrarErro('phoneError', 'Telefone inválido');
        isValid = false;
    } else {
        limparErro('phoneError');
    }
    
    // Validar senhas
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (password.length < 8) {
        mostrarErro('confirmPasswordError', 'Senha deve ter pelo menos 8 caracteres');
        isValid = false;
    } else if (password !== confirmPassword) {
        mostrarErro('confirmPasswordError', 'As senhas não coincidem');
        isValid = false;
    } else {
        limparErro('confirmPasswordError');
    }
    
    // Validar termos
    const terms = document.getElementById('terms').checked;
    if (!terms) {
        mostrarErro('termsError', 'Você deve aceitar os termos e condições');
        isValid = false;
    } else {
        limparErro('termsError');
    }
    
    return isValid;
}

// Funções auxiliares para mostrar/limpar erros
function mostrarErro(elementId, mensagem) {
    const element = document.getElementById(elementId);
    element.textContent = mensagem;
    element.previousElementSibling.classList.add('error');
}

function limparErro(elementId) {
    const element = document.getElementById(elementId);
    element.textContent = '';
    const input = element.previousElementSibling;
    if (input && input.classList) {
        input.classList.remove('error');
    }
}