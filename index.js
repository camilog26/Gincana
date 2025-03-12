class IndexManager {
    constructor() {
        this.loadingScreen = document.getElementById('loading-screen');
        this.rankingsList = document.getElementById('rankings-list');
        this.refreshButton = document.getElementById('refresh-rankings');
        this.themeToggle = document.getElementById('theme-toggle');
        this.soundToggle = document.getElementById('sound-toggle');

        this.initialize();
    }

    initialize() {
        // Mostrar pantalla de carga
        this.showLoadingScreen();

        // Configurar eventos
        this.setupEventListeners();

        // Cargar rankings
        this.loadRankings();

        // Verificar preferencias guardadas
        this.loadPreferences();

        // Ocultar pantalla de carga después de todo cargado
        setTimeout(() => this.hideLoadingScreen(), 1500);
    }

    setupEventListeners() {
        // Botón de refrescar rankings
        this.refreshButton.addEventListener('click', () => {
            this.refreshButton.classList.add('spin');
            this.loadRankings().then(() => {
                setTimeout(() => {
                    this.refreshButton.classList.remove('spin');
                }, 1000);
            });
        });

        // Cambio de tema
        this.themeToggle.addEventListener('click', () => this.toggleTheme());

        // Control de sonido
        this.soundToggle.addEventListener('click', () => this.toggleSound());
    }

    async loadRankings() {
        try {
            // Aquí iría la llamada al backend
            // Por ahora usamos datos de ejemplo
            const rankings = await this.getFakeRankings();
            this.displayRankings(rankings);
        } catch (error) {
            console.error('Error al cargar rankings:', error);
        }
    }

    displayRankings(rankings) {
        this.rankingsList.innerHTML = rankings.map((team, index) => `
            <div class="ranking-item ${index < 3 ? 'top-' + (index + 1) : ''}">
                <div class="ranking-position">
                    ${index < 3 ? 
                        `<i class="fas fa-trophy trophy-${index + 1}"></i>` : 
                        `#${index + 1}`
                    }
                </div>
                <div class="ranking-info">
                    <div class="team-name">${team.name}</div>
                    <div class="school-name">${team.school}</div>
                </div>
                <div class="ranking-score">
                    ${team.score} pts
                </div>
            </div>
        `).join('');
    }

    getFakeRankings() {
        // Datos de ejemplo para desarrollo
        return Promise.resolve([
            { name: "Los Historiadores", school: "Colegio Académico", score: 2500 },
            { name: "Guardianes de Buga", school: "Instituto Mayor", score: 2300 },
            { name: "Señores del Saber", school: "Colegio Central", score: 2100 },
            { name: "Quiz Masters", school: "Liceo Moderno", score: 1900 },
            { name: "Team Cultura", school: "Colegio del Sur", score: 1800 }
        ]);
    }

    toggleTheme() {
        const html = document.documentElement;
        const isDark = html.getAttribute('data-theme') === 'dark';
        const newTheme = isDark ? 'light' : 'dark';
        const icon = this.themeToggle.querySelector('i');

        html.setAttribute('data-theme', newTheme);
        icon.className = isDark ? 'fas fa-moon' : 'fas fa-sun';
        localStorage.setItem('theme', newTheme);
    }

    toggleSound() {
        const icon = this.soundToggle.querySelector('i');
        const isMuted = icon.classList.contains('fa-volume-mute');

        icon.className = isMuted ? 'fas fa-volume-up' : 'fas fa-volume-mute';
        localStorage.setItem('sound', String(!isMuted));

        // Aquí iría la lógica para silenciar/activar el sonido
    }

    loadPreferences() {
        // Cargar tema
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            document.documentElement.setAttribute('data-theme', savedTheme);
            const icon = this.themeToggle.querySelector('i');
            icon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }

        // Cargar preferencia de sonido
        const soundEnabled = localStorage.getItem('sound') !== 'false';
        const soundIcon = this.soundToggle.querySelector('i');
        soundIcon.className = soundEnabled ? 'fas fa-volume-up' : 'fas fa-volume-mute';
    }

    showLoadingScreen() {
        this.loadingScreen.style.display = 'flex';
    }

    hideLoadingScreen() {
        this.loadingScreen.style.opacity = '0';
        setTimeout(() => {
            this.loadingScreen.style.display = 'none';
        }, 500);
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new IndexManager();
});