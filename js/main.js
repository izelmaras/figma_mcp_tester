// Main application logic
class FigmaMCPTester {
    constructor() {
        this.isConnected = false;
        this.currentDesign = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.setupComponentLibrary();
        this.checkConnectionStatus();
    }

    bindEvents() {
        // Figma connection events
        document.getElementById('connect-figma')?.addEventListener('click', () => {
            this.connectToFigma();
        });

        document.getElementById('load-design')?.addEventListener('click', () => {
            this.loadDesign();
        });

        document.getElementById('generate-code')?.addEventListener('click', () => {
            this.generateCode();
        });

        // Figma URL input
        document.getElementById('figma-url')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.loadDesign();
            }
        });

        // Framework selection
        document.getElementById('code-framework')?.addEventListener('change', (e) => {
            this.updateCodePreview();
        });
    }

    setupComponentLibrary() {
        const componentList = document.getElementById('component-list');
        if (!componentList) return;

        // Add click handlers to component items
        componentList.addEventListener('click', (e) => {
            const componentItem = e.target.closest('.component-item');
            if (componentItem) {
                const componentName = componentItem.querySelector('span').textContent;
                this.selectComponent(componentName);
            }
        });
    }

    async connectToFigma() {
        const connectBtn = document.getElementById('connect-figma');
        const statusIndicator = document.querySelector('.status-indicator');
        const statusText = document.querySelector('.connection-status span');

        try {
            connectBtn.textContent = 'Connecting...';
            connectBtn.disabled = true;

            // Simulate connection process
            await this.simulateConnection();

            this.isConnected = true;
            statusIndicator.classList.remove('disconnected');
            statusIndicator.classList.add('connected');
            statusText.textContent = 'Connected';
            connectBtn.textContent = 'Disconnect';
            connectBtn.disabled = false;

            this.showNotification('Successfully connected to Figma!', 'success');
        } catch (error) {
            this.isConnected = false;
            statusIndicator.classList.remove('connected');
            statusIndicator.classList.add('disconnected');
            statusText.textContent = 'Connection Failed';
            connectBtn.textContent = 'Connect to Figma';
            connectBtn.disabled = false;

            this.showNotification('Failed to connect to Figma. Please try again.', 'error');
        }
    }

    async loadDesign() {
        const figmaUrl = document.getElementById('figma-url').value.trim();
        const loadBtn = document.getElementById('load-design');
        const previewContainer = document.getElementById('preview-container');

        if (!figmaUrl) {
            this.showNotification('Please enter a Figma URL or node ID', 'warning');
            return;
        }

        try {
            loadBtn.textContent = 'Loading...';
            loadBtn.disabled = true;

            // Simulate design loading
            await this.simulateDesignLoad();

            // Update preview
            previewContainer.innerHTML = `
                <div class="design-preview">
                    <div class="design-header">
                        <h3>Design Preview</h3>
                        <span class="badge badge-primary">Loaded</span>
                    </div>
                    <div class="design-content">
                        <div class="mock-design">
                            <div class="mock-header">Header Component</div>
                            <div class="mock-body">
                                <div class="mock-button">Button</div>
                                <div class="mock-input">Input Field</div>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            this.currentDesign = {
                url: figmaUrl,
                components: ['Header', 'Button', 'Input'],
                loaded: true
            };

            loadBtn.textContent = 'Load Design';
            loadBtn.disabled = false;

            this.showNotification('Design loaded successfully!', 'success');
        } catch (error) {
            loadBtn.textContent = 'Load Design';
            loadBtn.disabled = false;
            this.showNotification('Failed to load design. Please check the URL.', 'error');
        }
    }

    async generateCode() {
        const framework = document.getElementById('code-framework').value;
        const codeOutput = document.getElementById('code-output');
        const generateBtn = document.getElementById('generate-code');

        if (!this.currentDesign) {
            this.showNotification('Please load a design first', 'warning');
            return;
        }

        try {
            generateBtn.textContent = 'Generating...';
            generateBtn.disabled = true;

            // Simulate code generation
            await this.simulateCodeGeneration();

            const generatedCode = this.generateCodeForFramework(framework);
            
            codeOutput.innerHTML = `<pre><code>${generatedCode}</code></pre>`;

            generateBtn.textContent = 'Generate Code';
            generateBtn.disabled = false;

            this.showNotification(`Code generated for ${framework}!`, 'success');
        } catch (error) {
            generateBtn.textContent = 'Generate Code';
            generateBtn.disabled = false;
            this.showNotification('Failed to generate code', 'error');
        }
    }

    selectComponent(componentName) {
        // Highlight selected component
        document.querySelectorAll('.component-item').forEach(item => {
            item.classList.remove('selected');
        });

        const selectedItem = Array.from(document.querySelectorAll('.component-item'))
            .find(item => item.querySelector('span').textContent === componentName);
        
        if (selectedItem) {
            selectedItem.classList.add('selected');
        }

        this.showNotification(`Selected ${componentName} component`, 'info');
    }

    generateCodeForFramework(framework) {
        const codeTemplates = {
            html: `<!-- Generated HTML/CSS -->
<div class="header">
    <h1 class="logo">Figma MCP Tester</h1>
    <nav class="nav">
        <button class="btn btn-primary">Connect to Figma</button>
    </nav>
</div>

<style>
.header {
    background: #ffffff;
    border-bottom: 1px solid #e2e8f0;
    padding: 1rem 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.logo {
    font-size: 1.25rem;
    font-weight: 700;
    color: #6366f1;
}

.btn {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 0.375rem;
    cursor: pointer;
    transition: all 0.15s ease-in-out;
}

.btn-primary {
    background: #6366f1;
    color: white;
}

.btn-primary:hover {
    background: #5855eb;
}
</style>`,

            react: `// Generated React Component
import React from 'react';
import './Header.css';

const Header = () => {
    return (
        <header className="header">
            <h1 className="logo">Figma MCP Tester</h1>
            <nav className="nav">
                <button className="btn btn-primary">
                    Connect to Figma
                </button>
            </nav>
        </header>
    );
};

export default Header;`,

            vue: `<!-- Generated Vue Component -->
<template>
    <header class="header">
        <h1 class="logo">Figma MCP Tester</h1>
        <nav class="nav">
            <button class="btn btn-primary" @click="connectToFigma">
                Connect to Figma
            </button>
        </nav>
    </header>
</template>

<script>
export default {
    name: 'Header',
    methods: {
        connectToFigma() {
            // Connect to Figma logic
        }
    }
}
</script>

<style scoped>
.header {
    background: #ffffff;
    border-bottom: 1px solid #e2e8f0;
    padding: 1rem 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>`,

            angular: `// Generated Angular Component
import { Component } from '@angular/core';

@Component({
    selector: 'app-header',
    template: \`
        <header class="header">
            <h1 class="logo">Figma MCP Tester</h1>
            <nav class="nav">
                <button class="btn btn-primary" (click)="connectToFigma()">
                    Connect to Figma
                </button>
            </nav>
        </header>
    \`,
    styleUrls: ['./header.component.css']
})
export class HeaderComponent {
    connectToFigma() {
        // Connect to Figma logic
    }
}`
        };

        return codeTemplates[framework] || codeTemplates.html;
    }

    updateCodePreview() {
        if (this.currentDesign) {
            this.generateCode();
        }
    }

    checkConnectionStatus() {
        // Check if we have a stored connection status
        const storedStatus = localStorage.getItem('figma-connection-status');
        if (storedStatus === 'connected') {
            this.isConnected = true;
            document.querySelector('.status-indicator').classList.add('connected');
            document.querySelector('.connection-status span').textContent = 'Connected';
            document.getElementById('connect-figma').textContent = 'Disconnect';
        }
    }

    async simulateConnection() {
        return new Promise((resolve) => {
            setTimeout(resolve, 1500);
        });
    }

    async simulateDesignLoad() {
        return new Promise((resolve) => {
            setTimeout(resolve, 2000);
        });
    }

    async simulateCodeGeneration() {
        return new Promise((resolve) => {
            setTimeout(resolve, 1000);
        });
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;

        // Add notification styles if not already added
        if (!document.getElementById('notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notification-styles';
            styles.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 1001;
                    max-width: 400px;
                    border-radius: 0.5rem;
                    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
                    animation: slideIn 0.3s ease-out;
                }
                
                .notification-content {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 1rem;
                }
                
                .notification-close {
                    background: none;
                    border: none;
                    font-size: 1.25rem;
                    cursor: pointer;
                    color: inherit;
                    opacity: 0.7;
                }
                
                .notification-close:hover {
                    opacity: 1;
                }
                
                .notification-info {
                    background: #dbeafe;
                    color: #1e40af;
                    border: 1px solid #93c5fd;
                }
                
                .notification-success {
                    background: #d1fae5;
                    color: #065f46;
                    border: 1px solid #6ee7b7;
                }
                
                .notification-warning {
                    background: #fef3c7;
                    color: #92400e;
                    border: 1px solid #fcd34d;
                }
                
                .notification-error {
                    background: #fee2e2;
                    color: #991b1b;
                    border: 1px solid #fca5a5;
                }
                
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
            document.head.appendChild(styles);
        }

        // Add to page
        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new FigmaMCPTester();
});

// Add some additional styles for the mock design preview
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
    .design-preview {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
    }
    
    .design-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
        padding-bottom: 0.5rem;
        border-bottom: 1px solid #e2e8f0;
    }
    
    .design-content {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .mock-design {
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 0.5rem;
        padding: 1rem;
        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
        min-width: 200px;
    }
    
    .mock-header {
        background: #6366f1;
        color: white;
        padding: 0.5rem;
        border-radius: 0.25rem;
        text-align: center;
        margin-bottom: 1rem;
        font-size: 0.875rem;
    }
    
    .mock-body {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }
    
    .mock-button {
        background: #6366f1;
        color: white;
        padding: 0.5rem;
        border-radius: 0.25rem;
        text-align: center;
        font-size: 0.875rem;
    }
    
    .mock-input {
        border: 1px solid #d1d5db;
        padding: 0.5rem;
        border-radius: 0.25rem;
        background: #f9fafb;
        font-size: 0.875rem;
        color: #6b7280;
    }
    
    .component-item.selected {
        border-color: #6366f1;
        background: #f0f0ff;
    }
`;
document.head.appendChild(additionalStyles);
