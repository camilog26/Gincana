class TeamLogin {
    constructor() {
        this.form = document.getElementById('login-form');
        this.welcomeModal = document.getElementById('welcome-modal');
        this.accessKeyInput = document.getElementById('access-key');
        
        this.initialize();
    }

    initialize() {
        this.setupEventListeners();
        this.formatAccessKeyInput();
    }

    setupEventListeners() {
        this.form.addEventListener('submit', (e) => this.handleLogin(e));
        
        // Botones del modal de bienvenida
        document.getElementById('start-game').addEventListener('click', () => {
            window.location.href = 'game.html';
        });

        document.getElementById('view-history').addEventListener('click', () => {
            window.location.href = 'history.html';
        });
    }

    formatAccessKeyInput() {
        this.accessKeyInput.addEventListener('input', (e) => {
            let value = e.target.value.toUpperCase();
            
            // Eliminar caracteres no permitidos
            value = value.replace(/[^A-Z0-9-]/g, '');
            
            // Asegurar el formato BUGA-XXXXXXXX
            if (!value.startsWith('BUGA-')) {
                if (value.startsWith('B')) value = 'BUGA-' + value.slice(1);
                else if (!value.includes('-')) value = 'BUGA-' + value;
            }
            
            // Limitar longitud
            value = value.slice(0, 13);
            
            e.target.value = value;
        });
    }

    async handleLogin(e) {
        e.preventDefault();
        
        const accessKey = this.accessKeyInput.value;
        
        try {
            const teamData = await this.validateAccessKey(accessKey);
            
            if (teamData) {
                // Guardar datos del equipo en sessionStorage
                sessionStorage.setItem('currentTeam', JSON.stringify(teamData));
                
                // Mostrar perfil del equipo
                this.displayTeamProfile(teamData);
            } else {
                throw new Error('Llave de acceso inválida');
            }
        } catch (error) {
            this.showError('Llave de acceso incorrecta. Por favor, verifica e intenta de nuevo.');
        }
    }

    async validateAccessKey(accessKey) {
        // Aquí iría la validación con el backend
        // Por ahora, usaremos localStorage
        const teams = JSON.parse(localStorage.getItem('bugaQuizTeams') || '[]');
        return teams.find(team => team.accessKey === accessKey);
    }

    displayTeamProfile(teamData) {
        // Actualizar información en el modal
        document.getElementById('team-name').textContent = teamData.teamName;
        document.getElementById('school-name').textContent = teamData.school;
        document.getElementById('responsible-name').textContent = teamData.responsible.name;
        document.getElementById('responsible-role').textContent = 
            teamData.responsible.role === 'teacher' ? 'Profesor' : 'Padre de Familia';

        // Mostrar lista de participantes
        const membersContainer = document.getElementById('team-members');
        membersContainer.innerHTML = teamData.students.map(student => `
            <div class="team-member">
                <i class="fas fa-user-graduate"></i>
                <span>${student.name}</span>
                <small>${student.grade}° grado - ${student.age} años</small>
            </div>
        `).join('');

        // Mostrar estadísticas
        // Aquí podrías cargar estadísticas reales desde el almacenamiento
        document.getElementById('games-played').textContent = 
            teamData.statistics?.gamesPlayed || '0';
        document.getElementById('total-score').textContent = 
            teamData.statistics?.totalScore || '0';
        document.getElementById('achievements').textContent = 
            teamData.statistics?.achievements || '0';

        // Mostrar el modal
        this.welcomeModal.classList.remove('hidden');
    }

    showError(message) {
        // Animación de shake en el input
        this.accessKeyInput.classList.add('shake');
        setTimeout(() => {
            this.accessKeyInput.classList.remove('shake');
        }, 500);

        // Mostrar mensaje de error
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        
        const existingError = this.form.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        this.form.insertBefore(errorDiv, this.form.firstChild);
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new TeamLogin();
});