// Archive V2 - Enhanced Portfolio System

class ArchiveV2 {
    constructor() {
        this.currentProject = 'invitation';
        this.currentYear = '2025';
        this.projects = {
            invitation: {
                title: 'Party Invitation',
                date: 'October 4, 2024',
                description: 'Animated party invitation with sky background and decorative elements',
                file: 'posters/invitation.html'
            },
            'lorem-1': {
                title: 'Lorem Project',
                date: 'October 2, 2024',
                description: 'Placeholder project description',
                file: null
            },
            'lorem-2': {
                title: 'September Project',
                date: 'September 2, 2024',
                description: 'Another placeholder project',
                file: null
            },
            'lorem-3': {
                title: 'Another Project',
                date: 'September 2, 2024',
                description: 'Yet another placeholder project',
                file: null
            }
        };
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadProject(this.currentProject);
        this.updateYearView(this.currentYear);
    }

    bindEvents() {
        // Project navigation
        document.querySelectorAll('.project-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const projectId = item.dataset.project;
                if (projectId) {
                    this.switchProject(projectId);
                }
            });
        });

        // Year dropdown navigation
        document.querySelectorAll('.year-header').forEach(header => {
            header.addEventListener('click', (e) => {
                const yearDropdown = header.closest('.year-dropdown');
                this.toggleYear(yearDropdown);
            });
        });

        // Month dropdown collapse/expand
        document.querySelectorAll('.month-header').forEach(header => {
            header.addEventListener('click', (e) => {
                const monthDropdown = header.closest('.month-dropdown');
                this.toggleMonth(monthDropdown);
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

    toggleYear(yearDropdown) {
        const isActive = yearDropdown.classList.contains('active');
        
        if (isActive) {
            // Collapse year
            yearDropdown.classList.remove('active');
            const yearContent = yearDropdown.querySelector('.year-content');
            if (yearContent) {
                yearContent.classList.remove('expanded');
            }
        } else {
            // Expand year
            yearDropdown.classList.add('active');
            const yearContent = yearDropdown.querySelector('.year-content');
            if (yearContent) {
                yearContent.classList.add('expanded');
            }
            
            // Update current year
            const year = yearDropdown.dataset.year;
            this.currentYear = year;
        }
    }

    toggleMonth(monthDropdown) {
        const isExpanded = monthDropdown.classList.contains('expanded');
        
        if (isExpanded) {
            // Collapse month
            monthDropdown.classList.remove('expanded');
            const monthContent = monthDropdown.querySelector('.month-content');
            if (monthContent) {
                monthContent.classList.remove('expanded');
            }
        } else {
            // Expand month
            monthDropdown.classList.add('expanded');
            const monthContent = monthDropdown.querySelector('.month-content');
            if (monthContent) {
                monthContent.classList.add('expanded');
            }
        }
    }

    loadProject(projectId) {
        const project = this.projects[projectId];
        if (!project) return;

        // Update project info
        document.getElementById('project-title').textContent = project.title;
        document.getElementById('project-date').textContent = project.date;

        // Load iframe if project has file
        const iframe = document.querySelector('.project-iframe');
        if (project.file) {
            iframe.src = project.file;
        } else {
            // Show placeholder for projects without files
            iframe.src = 'about:blank';
            const projectFrame = document.querySelector('.project-frame');
            projectFrame.innerHTML = `
                <div style="
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 100%;
                    background: #f5f5f5;
                    color: #666666;
                    font-family: 'Helvetica', sans-serif;
                    font-size: 24px;
                    font-weight: 400;
                    text-align: center;
                ">
                    <div>
                        <div style="font-size: 18px; margin-bottom: 8px;">COMING SOON</div>
                        <div style="font-size: 14px; opacity: 0.6;">PROJECT IN DEVELOPMENT</div>
                    </div>
                </div>
            `;
        }
    }

    updateYearView(year) {
        // This method can be extended to load different project sets for different years
        console.log(`Switched to year: ${year}`);
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
                    font-family: 'Helvetica', sans-serif;
                    font-size: 48px;
                    font-weight: 400;
                    text-align: center;
                ">
                    <div>
                        <div style="font-size: 36px; margin-bottom: 16px;">COMING SOON</div>
                        <div style="font-size: 24px; opacity: 0.6;">PROJECT IN DEVELOPMENT</div>
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
            right: 60px;
            background: #000000;
            color: #ffffff;
            padding: 20px 30px;
            font-family: 'Helvetica', sans-serif;
            font-size: 24px;
            font-weight: 400;
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

    // Method to add new projects dynamically
    addProject(id, title, date, description, file = null) {
        this.projects[id] = { title, date, description, file };
        
        // You can extend this to add projects to specific months/years
        console.log(`Added project: ${title}`);
    }

    // Method to expand/collapse all months
    expandAllMonths() {
        document.querySelectorAll('.month-section.collapsed').forEach(section => {
            this.toggleMonth(section);
        });
    }

    collapseAllMonths() {
        document.querySelectorAll('.month-section:not(.collapsed)').forEach(section => {
            if (section.querySelector('.month-header')) {
                this.toggleMonth(section);
            }
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ArchiveV2();
});

// Export for potential external use
window.ArchiveV2 = ArchiveV2;
