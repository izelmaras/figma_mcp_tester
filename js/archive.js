// Archive System JavaScript

class ArchiveSystem {
    constructor() {
        this.currentProject = 'invitation';
        this.projects = {
            invitation: {
                title: 'Party Invitation',
                date: 'October 4, 2024',
                file: 'posters/invitation.html'
            },
            'coming-soon-1': {
                title: 'Coming Soon',
                date: 'December 15, 2024',
                file: null
            },
            'coming-soon-2': {
                title: 'Project Archive',
                date: 'September 22, 2023',
                file: null
            },
            'coming-soon-3': {
                title: 'Design System',
                date: 'June 8, 2023',
                file: null
            }
        };
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadProject(this.currentProject);
    }

    bindEvents() {
        // Project item clicks
        document.querySelectorAll('.project-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const projectId = e.currentTarget.dataset.project;
                if (!projectId.startsWith('coming-soon')) {
                    this.switchProject(projectId);
                }
            });
        });

        // Fullscreen button
        document.getElementById('fullscreen-btn').addEventListener('click', () => {
            this.enterFullscreen();
        });

        // Exit fullscreen
        document.getElementById('exit-fullscreen').addEventListener('click', () => {
            this.exitFullscreen();
        });

        // ESC key to exit fullscreen
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.exitFullscreen();
            }
        });

        // Click outside fullscreen overlay to exit
        document.getElementById('fullscreen-overlay').addEventListener('click', (e) => {
            if (e.target.id === 'fullscreen-overlay') {
                this.exitFullscreen();
            }
        });
    }

    switchProject(projectId) {
        if (!this.projects[projectId] || !this.projects[projectId].file) {
            return;
        }

        this.currentProject = projectId;
        
        // Update active project in menu
        document.querySelectorAll('.project-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-project="${projectId}"]`).classList.add('active');
        
        // Load the project
        this.loadProject(projectId);
    }

    loadProject(projectId) {
        const project = this.projects[projectId];
        if (!project) return;

        // Update header
        document.querySelector('.current-project-title').textContent = project.title;
        document.querySelector('.current-project-date').textContent = project.date;
        
        // Load iframe content
        const iframe = document.querySelector('.project-iframe');
        if (iframe && project.file) {
            iframe.src = project.file;
        }
    }

    enterFullscreen() {
        const overlay = document.getElementById('fullscreen-overlay');
        const fullscreenContent = document.getElementById('fullscreen-content');
        
        // Get current iframe content
        const currentIframe = document.querySelector('.project-iframe');
        const project = this.projects[this.currentProject];
        
        if (project && project.file) {
            // Create new iframe for fullscreen
            fullscreenContent.innerHTML = `
                <iframe src="${project.file}" style="width: 100%; height: 100%; border: none;"></iframe>
            `;
            
            // Show fullscreen overlay
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    exitFullscreen() {
        const overlay = document.getElementById('fullscreen-overlay');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
        
        // Clear fullscreen content
        document.getElementById('fullscreen-content').innerHTML = '';
    }

    // Method to add new projects dynamically
    addProject(id, title, date, file) {
        this.projects[id] = { title, date, file };
        
        // Find the appropriate year section (you might want to make this more sophisticated)
        const yearSections = document.querySelectorAll('.year-section');
        const targetYear = yearSections[0]; // Add to first year section for now
        
        if (targetYear) {
            const projectList = targetYear.querySelector('.project-list');
            const newItem = document.createElement('li');
            newItem.className = 'project-item';
            newItem.dataset.project = id;
            newItem.innerHTML = `
                <span class="project-date">${date.split(' ')[1]}</span>
                <span class="project-title">${title}</span>
            `;
            
            newItem.addEventListener('click', () => {
                this.switchProject(id);
            });
            
            projectList.appendChild(newItem);
        }
    }
}

// Initialize archive system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ArchiveSystem();
});

// Export for potential external use
window.ArchiveSystem = ArchiveSystem;
