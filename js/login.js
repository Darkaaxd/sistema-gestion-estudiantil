import { API_URL } from './config.js';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('error-message');
    const whatsappInput = document.getElementById('whatsapp');
    const whatsappGroup = document.getElementById('whatsappGroup');
    const userTypeInputs = document.querySelectorAll('input[name="userType"]');

    // Manejar cambio de tipo de usuario
    userTypeInputs.forEach(input => {
        input.addEventListener('change', (e) => {
            const isStudent = e.target.value === 'student';
            whatsappInput.required = isStudent;
            whatsappGroup.style.display = isStudent ? 'block' : 'none';
        });
    });

    // Validar formato de WhatsApp mientras el usuario escribe
    whatsappInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/[^0-9]/g, '');
        
        if (value.length > 0 && value[0] !== '3') {
            value = '3';
        }
        
        value = value.slice(0, 10);
        e.target.value = value;
    });

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const userType = document.querySelector('input[name="userType"]:checked').value;
        const whatsapp = whatsappInput.value.trim();

        // Validar campos vacíos
        if (!username || !password) {
            showError('Por favor, complete los campos requeridos');
            return;
        }

        try {
            // Obtener usuarios
            const response = await fetch(`${API_URL}/users`);
            const users = await response.json();

            // Buscar usuario según tipo
            let user;
            if (userType === 'student') {
                if (!whatsapp) {
                    showError('Por favor, ingrese su número de WhatsApp');
                    return;
                }

                if (!isValidColombianWhatsApp(whatsapp)) {
                    showError('El número de WhatsApp debe empezar con 3 y tener 10 dígitos');
                    return;
                }

                user = users.find(u => 
                    u.username === username && 
                    u.password === password && 
                    u.whatsapp === whatsapp &&
                    u.role === 'student'
                );
            } else {
                user = users.find(u => 
                    u.username === username && 
                    u.password === password &&
                    u.role === 'admin'
                );
            }

            if (user) {
                loginSuccess(user);
            } else {
                showError('Credenciales incorrectas');
            }
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            showError('Error al iniciar sesión. Por favor, intenta de nuevo.');
        }
    });

    function isValidColombianWhatsApp(number) {
        return /^3[0-9]{9}$/.test(number);
    }

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.opacity = '1';
        setTimeout(() => {
            errorMessage.style.opacity = '0';
        }, 3000);
    }

    function loginSuccess(user) {
        sessionStorage.setItem('currentUser', JSON.stringify({
            username: user.username,
            whatsapp: user.whatsapp,
            role: user.role
        }));

        if (user.role === 'admin') {
            window.location.href = './admin/dashboard.html';
        } else {
            window.location.href = './student/dashboard.html';
        }
    }

    // Inicializar estado del campo WhatsApp
    const initialUserType = document.querySelector('input[name="userType"]:checked').value;
    whatsappInput.required = initialUserType === 'student';
    whatsappGroup.style.display = initialUserType === 'student' ? 'block' : 'none';
});