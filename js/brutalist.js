// Brutalist Archive System

class BrutalistArchive {
    constructor() {
        this.currentProject = 'invitation';
        this.projects = {
            invitation: {
                title: 'PARTY INVITATION',
                date: 'OCTOBER 4, 2024',
                description: 'Animated party invitation with sky background and decorative elements',
                file: 'posters/invitation.html'
            },
            'coming-soon-1': {
                title: 'COMING SOON',
                date: 'DECEMBER 15, 2024',
                description: 'New project coming soon',
                file: null
            },
            'coming-soon-2': {
                title: 'PROJECT ARCHIVE',
                date: 'SEPTEMBER 22, 2023',
                description: 'Historical project archive',
                file: null
            },
            'coming-soon-3': {
                title: 'DESIGN SYSTEM',
                date: 'JUNE 8, 2023',
                description: 'Comprehensive design system documentation',
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
        // Project navigation
        document.querySelectorAll('.project-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const projectId = item.dataset.project;
                if (!projectId.startsWith('coming-soon')) {
                    this.switchProject(projectId);
                }
            });
        });

        // Fullscreen controls
        document.getElementById('fullscreen-btn').addEventListener('click', () => {
            this.enterFullscreen();
        });

        document.getElementById('share-btn').addEventListener('click', () => {
            this.shareProject();
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

        // Click outside overlay to exit fullscreen
        document.getElementById('fullscreen-overlay').addEventListener('click', (e) => {
            if (e.target.id === 'fullscreen-overlay') {
                this.exitFullscreen();
            }
        });
    }

    switchProject(projectId) {
        // Update active state
        document.querySelectorAll('.project-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-project="${projectId}"]`).classList.add('active');
        
        this.currentProject = projectId;
        this.loadProject(projectId);
    }

    loadProject(projectId) {
        const project = this.projects[projectId];
        if (!project) return;

        // Update info section
        document.getElementById('project-title').textContent = project.title;
        document.getElementById('project-date').textContent = project.date;
        document.getElementById('project-description').textContent = project.description;

        // Load iframe if project has file
        const iframe = document.querySelector('.project-iframe');
        if (project.file) {
            iframe.src = project.file;
        } else {
            // Show placeholder for coming soon projects
            iframe.src = 'about:blank';
            const projectFrame = document.querySelector('.project-frame');
            projectFrame.innerHTML = `
                <div style="
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 100%;
                    background: #ffffff;
                    color: #666666;
                    font-family: 'Inter', monospace;
                    font-size: 14px;
                    font-weight: 400;
                    letter-spacing: 1px;
                    text-align: center;
                ">
                    <div>
                        <div style="font-size: 12px; margin-bottom: 8px;">COMING SOON</div>
                        <div style="font-size: 10px; opacity: 0.6;">PROJECT IN DEVELOPMENT</div>
                    </div>
                </div>
            `;
        }
    }

    enterFullscreen() {
        const overlay = document.getElementById('fullscreen-overlay');
        const fullscreenContent = document.getElementById('fullscreen-content');
        const project = this.projects[this.currentProject];
        
        if (project.file) {
            fullscreenContent.innerHTML = `
                <iframe src="${project.file}" style="width: 100%; height: 100%; border: none; background: #ffffff;"></iframe>
            `;
        } else {
            fullscreenContent.innerHTML = `
                <div style="
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 100%;
                    background: #ffffff;
                    color: #666666;
                    font-family: 'Inter', monospace;
                    font-size: 24px;
                    font-weight: 400;
                    letter-spacing: 2px;
                    text-align: center;
                ">
                    <div>
                        <div style="font-size: 18px; margin-bottom: 16px;">COMING SOON</div>
                        <div style="font-size: 14px; opacity: 0.6;">PROJECT IN DEVELOPMENT</div>
                    </div>
                </div>
            `;
        }
        
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    exitFullscreen() {
        const overlay = document.getElementById('fullscreen-overlay');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    shareProject() {
        const project = this.projects[this.currentProject];
        const url = window.location.href;
        
        if (navigator.share) {
            navigator.share({
                title: `${project.title} - Izel Maras Archive`,
                text: project.description,
                url: url
            }).catch(err => {
                console.log('Error sharing:', err);
                this.copyToClipboard(url);
            });
        } else {
            this.copyToClipboard(url);
        }
    }

    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            this.showNotification('URL copied to clipboard');
        } catch (err) {
            console.log('Error copying to clipboard:', err);
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.showNotification('URL copied to clipboard');
        }
    }

    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 40px;
            background: #000000;
            color: #ffffff;
            padding: 12px 20px;
            font-family: 'Inter', monospace;
            font-size: 12px;
            font-weight: 500;
            letter-spacing: 1px;
            z-index: 1002;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Fade in
        setTimeout(() => {
            notification.style.opacity = '1';
        }, 10);
        
        // Fade out and remove
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 2000);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new BrutalistArchive();
});

