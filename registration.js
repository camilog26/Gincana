class TeamRegistration {
    constructor() {
        this.form = document.getElementById('team-registration');
        this.modal = document.getElementById('access-key-modal');
        this.copyButton = document.getElementById('copy-key');
        
        this.initialize();
    }

    initialize() {
        this.generateStudentFields();
        this.setupEventListeners();
    }

    generateStudentFields() {
        const container = document.getElementById('students-container');
        
        for (let i = 1; i <= 5; i++) {
            const studentSection = document.createElement('div');
            studentSection.className = 'student-section';
            studentSection.innerHTML = `
                <h3>Participante ${i}</h3>
                <div class="form-group">
                    <label for="student-name-${i}">Nombre Completo:</label>
                    <input type="text" id="student-name-${i}" class="vintage-input" required>
                </div>
                <div class="form-group">
                    <label for="student-grade-${i}">Grado:</label>
                    <select id="student-grade-${i}" class="vintage-input" required>
                        <option value="">Seleccionar Grado</option>
                        <option value="10">10°</option>
                        <option value="11">11°</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="student-age-${i}">Edad:</label>
                    <input type="number" id="student-age-${i}" class="vintage-input" 
                           min="14" max="19" required>
                </div>
            `;
            container.appendChild(studentSection);
        }
    }

    setupEventListeners() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.copyButton.addEventListener('click', () => this.copyAccessKey());
    }

    async handleSubmit(e) {
        e.preventDefault();

        const teamData = {
            teamName: document.getElementById('team-name').value,
            school: document.getElementById('school-name').value,
            responsible: {
                name: document.getElementById('responsible-name').value,
                role: document.querySelector('input[name="responsible-role"]:checked').value
            },
            students: [],
            accessKey: this.generateAccessKey(),
            registrationDate: new Date().toISOString()
        };

        // Recopilar datos de los estudiantes
        for (let i = 1; i <= 5; i++) {
            teamData.students.push({
                name: document.getElementById(`student-name-${i}`).value,
                grade: document.getElementById(`student-grade-${i}`).value,
                age: document.getElementById(`student-age-${i}`).value
            });
        }

        try {
            // Aquí iría la lógica para guardar en la base de datos
            await this.saveTeamData(teamData);
            
            // Mostrar la llave de acceso
            document.getElementById('access-key').textContent = teamData.accessKey;
            this.modal.classList.remove('hidden');
        } catch (error) {
            console.error('Error al registrar el equipo:', error);
            alert('Hubo un error al registrar el equipo. Por favor, intenta de nuevo.');
        }
    }

    generateAccessKey() {
        // Generar una llave de acceso única
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        const keyLength = 8;
        let key = '';
        
        for (let i = 0; i < keyLength; i++) {
            key += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        
        return `BUGA-${key}`;
    }

    async saveTeamData(teamData) {
        // Aquí iría la lógica para guardar en la base de datos
        // Por ahora, guardaremos en localStorage como ejemplo
        const teams = JSON.parse(localStorage.getItem('bugaQuizTeams') || '[]');
        teams.push(teamData);
        localStorage.setItem('bugaQuizTeams', JSON.stringify(teams));
    }

    copyAccessKey() {
        const accessKey = document.getElementById('access-key').textContent;
        navigator.clipboard.writeText(accessKey)
            .then(() => {
                this.copyButton.innerHTML = '<i class="fas fa-check"></i>';
                setTimeout(() => {
                    this.copyButton.innerHTML = '<i class="fas fa-copy"></i>';
                }, 2000);
            })
            .catch(err => {
                console.error('Error al copiar:', err);
                alert('Error al copiar la llave de acceso');
            });
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new TeamRegistration();
});