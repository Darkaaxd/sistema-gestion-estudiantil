import { API_URL } from './config.js';

document.addEventListener('DOMContentLoaded', () => {
    // Verificar sesión
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!currentUser || currentUser.role !== 'student') {
        window.location.href = '../login.html';
        return;
    }

    // Mostrar nombre del estudiante
    document.getElementById('studentName').textContent = currentUser.username;

    // Cargar materias
    async function loadSubjects() {
        try {
            const response = await fetch(`${API_URL}/subjects`);
            const subjects = await response.json();
            const subjectsGrid = document.getElementById('subjectsGrid');
            
            subjects.forEach(subject => {
                const subjectCard = document.createElement('div');
                subjectCard.className = 'subject-card';
                subjectCard.innerHTML = `
                    <div class="subject-emoji">${subject.emoji}</div>
                    <div class="subject-name">${subject.name}</div>
                `;
                subjectsGrid.appendChild(subjectCard);
            });
        } catch (error) {
            console.error('Error al cargar materias:', error);
        }
    }

    // Navegación entre secciones
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.section');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remover clase active de todos los items y secciones
            navItems.forEach(i => i.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));

            // Añadir clase active al item clickeado y su sección correspondiente
            item.classList.add('active');
            const sectionId = item.dataset.section + '-section';
            document.getElementById(sectionId).classList.add('active');
        });
    });

    // Cargar materias al iniciar
    loadSubjects();
});
