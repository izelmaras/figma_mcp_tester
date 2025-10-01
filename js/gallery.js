// Gallery Navigation and Functionality
class PosterGallery {
    constructor() {
        this.currentPoster = 'invitation';
        this.currentView = 'single';
        this.posters = {
            invitation: {
                title: 'Izel & Mickey Invitation',
                description: 'Animated party invitation with sky background',
                file: 'posters/invitation.html'
            },
            portfolio: {
                title: 'Portfolio',
                description: 'Professional portfolio layout',
                file: 'posters/portfolio.html'
            },
            poster2: {
                title: 'Poster 2',
                description: 'Coming Soon',
                file: null
            },
            poster3: {
                title: 'Poster 3', 
                description: 'Coming Soon',
                file: null
            }
        };
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.handleURL();
        this.updateView();
    }

    bindEvents() {
        // Menu item clicks
        document.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const poster = item.dataset.poster;
                if (poster !== 'poster2' && poster !== 'poster3') {
                    this.switchPoster(poster);
                }
            });
        });

        // View toggle buttons
        document.querySelectorAll('.toggle-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const view = e.target.dataset.view;
                this.switchView(view);
            });
        });

        // Action buttons
        document.getElementById('fullscreen-btn')?.addEventListener('click', () => {
            this.toggleFullscreen();
        });

        document.getElementById('share-btn')?.addEventListener('click', () => {
            this.sharePoster();
        });

        // Gallery card clicks
        document.querySelectorAll('.poster-card').forEach(card => {
            card.addEventListener('click', () => {
                const poster = card.dataset.poster;
                if (poster !== 'poster2' && poster !== 'poster3') {
                    this.switchPoster(poster);
                    this.switchView('single');
                }
            });
        });

        // URL hash changes
        window.addEventListener('hashchange', () => {
            this.handleURL();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.exitFullscreen();
            }
            if (e.key === 'f' || e.key === 'F') {
                this.toggleFullscreen();
            }
        });
    }

    handleURL() {
        const hash = window.location.hash.slice(1);
        if (hash && this.posters[hash]) {
            this.switchPoster(hash);
        } else {
            this.switchPoster('invitation');
        }
    }

    switchPoster(posterId) {
        if (!this.posters[posterId] || !this.posters[posterId].file) {
            return;
        }

        this.currentPoster = posterId;
        
        // Update URL
        window.history.pushState(null, null, `#${posterId}`);
        
        // Update active menu item
        document.querySelectorAll('.menu-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-poster="${posterId}"]`).classList.add('active');
        
        // Update poster title
        const title = document.querySelector('.poster-title');
        title.textContent = this.posters[posterId].title;
        
        // Update iframe source
        const iframe = document.getElementById('current-poster');
        if (iframe) {
            iframe.src = this.posters[posterId].file;
        }
        
        // Update active gallery card
        document.querySelectorAll('.poster-card').forEach(card => {
            card.classList.remove('active');
        });
        document.querySelector(`.poster-card[data-poster="${posterId}"]`)?.classList.add('active');
        
        this.updateView();
    }

    switchView(view) {
        this.currentView = view;
        
        // Update toggle buttons
        document.querySelectorAll('.toggle-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-view="${view}"]`).classList.add('active');
        
        // Update view containers
        document.querySelectorAll('.single-view, .gallery-view').forEach(container => {
            container.classList.remove('active');
        });
        
        if (view === 'single') {
            document.getElementById('single-view').classList.add('active');
        } else {
            document.getElementById('gallery-view').classList.add('active');
        }
    }

    updateView() {
        // Ensure correct view is active
        if (this.currentView === 'single') {
            this.switchView('single');
        } else {
            this.switchView('gallery');
        }
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            this.enterFullscreen();
        } else {
            this.exitFullscreen();
        }
    }

    enterFullscreen() {
        const container = document.querySelector('.poster-container');
        if (container.requestFullscreen) {
            container.requestFullscreen();
        } else if (container.webkitRequestFullscreen) {
            container.webkitRequestFullscreen();
        } else if (container.msRequestFullscreen) {
            container.msRequestFullscreen();
        }
        
        // Update button text
        const btn = document.getElementById('fullscreen-btn');
        if (btn) btn.textContent = 'Exit Fullscreen';
    }

    exitFullscreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
        
        // Update button text
        const btn = document.getElementById('fullscreen-btn');
        if (btn) btn.textContent = 'Fullscreen';
    }

    sharePoster() {
        const url = window.location.href;
        const title = this.posters[this.currentPoster].title;
        
        if (navigator.share) {
            navigator.share({
                title: title,
                text: `Check out this ${title} poster`,
                url: url
            });
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(url).then(() => {
                this.showNotification('Link copied to clipboard!');
            }).catch(() => {
                this.showNotification('Unable to copy link');
            });
        }
    }

    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #10b981;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 10px 25px -5px rgb(0 0 0 / 0.1);
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Method to add new posters dynamically
    addPoster(id, title, description, file) {
        this.posters[id] = { title, description, file };
        
        // Add to menu
        const menu = document.querySelector('.poster-menu');
        const newItem = document.createElement('li');
        newItem.className = 'menu-item';
        newItem.dataset.poster = id;
        newItem.innerHTML = `
            <a href="#${id}" class="menu-link">
                <span class="menu-icon">🎨</span>
                <span class="menu-text">${title}</span>
            </a>
        `;
        
        newItem.addEventListener('click', (e) => {
            e.preventDefault();
            this.switchPoster(id);
        });
        
        menu.appendChild(newItem);
        
        // Add to gallery view
        const grid = document.querySelector('.poster-grid');
        const newCard = document.createElement('div');
        newCard.className = 'poster-card';
        newCard.dataset.poster = id;
        newCard.innerHTML = `
            <iframe src="${file}" class="poster-preview" frameborder="0"></iframe>
            <div class="poster-info">
                <h3>${title}</h3>
                <p>${description}</p>
            </div>
        `;
        
        newCard.addEventListener('click', () => {
            this.switchPoster(id);
            this.switchView('single');
        });
        
        grid.appendChild(newCard);
    }
}

// Initialize gallery when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PosterGallery();
});

// Add CSS animation for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

