document.addEventListener('DOMContentLoaded', () => {
    // Verificar sesión
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!currentUser || currentUser.role !== 'admin') {
        window.location.href = '../login.html';
        return;
    }

    // Elementos del DOM
    const addSubjectBtn = document.getElementById('addSubjectBtn');
    const modal = document.getElementById('subjectModal');
    const closeModal = document.getElementById('closeModal');
    const subjectForm = document.getElementById('subjectForm');
    const emojiGrid = document.getElementById('emojiGrid');
    const subjectsGrid = document.getElementById('subjectsGrid');

    // Lista de emojis para materias
    const subjectEmojis = [
        '📚', '📝', '📐', '🔬', '🧮', '🎨',
        '🌍', '⚡️', '🧪', '📖', '🎭', '🏃‍♂️',
        '🎵', '💻', '🎪', '📱', '🗣️', '🏛️',
        '🔠', '🎯', '🧠', '📊', '🎬', '🤖'
    ];

    // Estado
    let selectedEmoji = null;

    // API URL
    const API_URL = 'http://localhost:3000';

    // Inicializar emojis
    subjectEmojis.forEach(emoji => {
        const emojiOption = document.createElement('div');
        emojiOption.className = 'emoji-option';
        emojiOption.textContent = emoji;
        emojiOption.addEventListener('click', () => {
            document.querySelectorAll('.emoji-option').forEach(opt => 
                opt.classList.remove('selected'));
            emojiOption.classList.add('selected');
            selectedEmoji = emoji;
        });
        emojiGrid.appendChild(emojiOption);
    });

    // Cargar materias existentes
    async function loadSubjects() {
        try {
            const response = await fetch(`${API_URL}/subjects`);
            const subjects = await response.json();
            subjectsGrid.innerHTML = '';
            subjects.forEach(subject => addSubjectToGrid(subject));
        } catch (error) {
            console.error('Error al cargar materias:', error);
        }
    }

    // Mostrar modal
    addSubjectBtn.addEventListener('click', () => {
        modal.classList.add('active');
        selectedEmoji = null;
        subjectForm.reset();
        document.querySelectorAll('.emoji-option').forEach(opt => 
            opt.classList.remove('selected'));
    });

    // Cerrar modal
    closeModal.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    // Click fuera del modal para cerrar
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });

    // Manejar envío del formulario
    subjectForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const subjectName = document.getElementById('subjectName').value.trim();
        
        if (!selectedEmoji) {
            alert('Por favor, selecciona un emoji para la materia');
            return;
        }

        const newSubject = {
            name: subjectName,
            emoji: selectedEmoji
        };

        try {
            const response = await fetch(`${API_URL}/subjects`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newSubject)
            });

            if (response.ok) {
                const subject = await response.json();
                addSubjectToGrid(subject);
                modal.classList.remove('active');
                subjectForm.reset();
            }
        } catch (error) {
            console.error('Error al crear materia:', error);
            alert('Error al crear la materia. Por favor, intenta de nuevo.');
        }
    });

    // Función para añadir materia al grid
    function addSubjectToGrid(subject) {
        const subjectCard = document.createElement('div');
        subjectCard.className = 'subject-card';
        subjectCard.innerHTML = `
            <div class="subject-emoji">${subject.emoji}</div>
            <div class="subject-name">${subject.name}</div>
        `;
        subjectsGrid.appendChild(subjectCard);
    }

    // Cargar materias al iniciar
    loadSubjects();
});
