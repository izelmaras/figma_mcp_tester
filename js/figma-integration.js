// Figma MCP Integration Module
class FigmaIntegration {
    constructor() {
        this.mcpTools = {
            getMetadata: null,
            getCode: null,
            getScreenshot: null,
            getVariableDefs: null,
            getCodeConnectMap: null
        };
        this.isInitialized = false;
    }

    async initialize() {
        try {
            // Check if MCP tools are available
            if (typeof window.mcp_Figma_get_metadata !== 'undefined') {
                this.mcpTools.getMetadata = window.mcp_Figma_get_metadata;
            }
            if (typeof window.mcp_Figma_get_code !== 'undefined') {
                this.mcpTools.getCode = window.mcp_Figma_get_code;
            }
            if (typeof window.mcp_Figma_get_screenshot !== 'undefined') {
                this.mcpTools.getScreenshot = window.mcp_Figma_get_screenshot;
            }
            if (typeof window.mcp_Figma_get_variable_defs !== 'undefined') {
                this.mcpTools.getVariableDefs = window.mcp_Figma_get_variable_defs;
            }
            if (typeof window.mcp_Figma_get_code_connect_map !== 'undefined') {
                this.mcpTools.getCodeConnectMap = window.mcp_Figma_get_code_connect_map;
            }

            this.isInitialized = true;
            console.log('Figma MCP Integration initialized');
            return true;
        } catch (error) {
            console.error('Failed to initialize Figma MCP Integration:', error);
            return false;
        }
    }

    async getDesignMetadata(nodeId = null) {
        if (!this.isInitialized) {
            throw new Error('Figma Integration not initialized');
        }

        try {
            if (this.mcpTools.getMetadata) {
                const result = await this.mcpTools.getMetadata({
                    nodeId: nodeId,
                    clientFrameworks: 'html,css,javascript',
                    clientLanguages: 'html,css,javascript'
                });
                return result;
            } else {
                // Fallback to mock data
                return this.getMockMetadata();
            }
        } catch (error) {
            console.error('Error getting design metadata:', error);
            throw error;
        }
    }

    async getDesignCode(nodeId = null, framework = 'html') {
        if (!this.isInitialized) {
            throw new Error('Figma Integration not initialized');
        }

        try {
            if (this.mcpTools.getCode) {
                const result = await this.mcpTools.getCode({
                    nodeId: nodeId,
                    clientFrameworks: framework,
                    clientLanguages: 'html,css,javascript',
                    forceCode: true
                });
                return result;
            } else {
                // Fallback to mock code generation
                return this.getMockCode(framework);
            }
        } catch (error) {
            console.error('Error getting design code:', error);
            throw error;
        }
    }

    async getDesignScreenshot(nodeId = null) {
        if (!this.isInitialized) {
            throw new Error('Figma Integration not initialized');
        }

        try {
            if (this.mcpTools.getScreenshot) {
                const result = await this.mcpTools.getScreenshot({
                    nodeId: nodeId,
                    clientFrameworks: 'html,css,javascript',
                    clientLanguages: 'html,css,javascript'
                });
                return result;
            } else {
                // Fallback to mock screenshot
                return this.getMockScreenshot();
            }
        } catch (error) {
            console.error('Error getting design screenshot:', error);
            throw error;
        }
    }

    async getDesignVariables(nodeId = null) {
        if (!this.isInitialized) {
            throw new Error('Figma Integration not initialized');
        }

        try {
            if (this.mcpTools.getVariableDefs) {
                const result = await this.mcpTools.getVariableDefs({
                    nodeId: nodeId,
                    clientFrameworks: 'html,css,javascript',
                    clientLanguages: 'html,css,javascript'
                });
                return result;
            } else {
                // Fallback to mock variables
                return this.getMockVariables();
            }
        } catch (error) {
            console.error('Error getting design variables:', error);
            throw error;
        }
    }

    async getCodeConnectMap(nodeId = null) {
        if (!this.isInitialized) {
            throw new Error('Figma Integration not initialized');
        }

        try {
            if (this.mcpTools.getCodeConnectMap) {
                const result = await this.mcpTools.getCodeConnectMap({
                    nodeId: nodeId,
                    clientFrameworks: 'html,css,javascript',
                    clientLanguages: 'html,css,javascript'
                });
                return result;
            } else {
                // Fallback to mock code connect map
                return this.getMockCodeConnectMap();
            }
        } catch (error) {
            console.error('Error getting code connect map:', error);
            throw error;
        }
    }

    parseFigmaUrl(url) {
        // Extract node ID from Figma URL
        const nodeIdMatch = url.match(/node-id=([^&]+)/);
        if (nodeIdMatch) {
            return nodeIdMatch[1].replace(/-/g, ':');
        }
        return null;
    }

    validateNodeId(nodeId) {
        // Validate node ID format (e.g., "123:456")
        const nodeIdPattern = /^\d+:\d+$/;
        return nodeIdPattern.test(nodeId);
    }

    // Mock data methods for development/testing
    getMockMetadata() {
        return {
            type: 'FRAME',
            name: 'Header Component',
            id: '1:2',
            children: [
                {
                    type: 'TEXT',
                    name: 'Logo',
                    id: '1:3'
                },
                {
                    type: 'FRAME',
                    name: 'Navigation',
                    id: '1:4',
                    children: [
                        {
                            type: 'RECTANGLE',
                            name: 'Button',
                            id: '1:5'
                        }
                    ]
                }
            ]
        };
    }

    getMockCode(framework = 'html') {
        const codeTemplates = {
            html: `<!-- Generated from Figma -->
<div class="header-component">
    <div class="logo">
        <span class="logo-text">Figma MCP Tester</span>
    </div>
    <nav class="navigation">
        <button class="nav-button primary">
            Connect to Figma
        </button>
    </nav>
</div>

<style>
.header-component {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 24px;
    background: #ffffff;
    border-bottom: 1px solid #e2e8f0;
}

.logo-text {
    font-size: 20px;
    font-weight: 700;
    color: #6366f1;
}

.navigation {
    display: flex;
    gap: 12px;
}

.nav-button {
    padding: 8px 16px;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s ease;
}

.nav-button.primary {
    background: #6366f1;
    color: #ffffff;
}

.nav-button.primary:hover {
    background: #5855eb;
}
</style>`,

            react: `// Generated React Component from Figma
import React from 'react';
import './HeaderComponent.css';

const HeaderComponent = () => {
    return (
        <div className="header-component">
            <div className="logo">
                <span className="logo-text">Figma MCP Tester</span>
            </div>
            <nav className="navigation">
                <button className="nav-button primary">
                    Connect to Figma
                </button>
            </nav>
        </div>
    );
};

export default HeaderComponent;`,

            vue: `<!-- Generated Vue Component from Figma -->
<template>
    <div class="header-component">
        <div class="logo">
            <span class="logo-text">Figma MCP Tester</span>
        </div>
        <nav class="navigation">
            <button class="nav-button primary" @click="handleConnect">
                Connect to Figma
            </button>
        </nav>
    </div>
</template>

<script>
export default {
    name: 'HeaderComponent',
    methods: {
        handleConnect() {
            // Handle connection logic
        }
    }
}
</script>

<style scoped>
.header-component {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 24px;
    background: #ffffff;
    border-bottom: 1px solid #e2e8f0;
}
</style>`,

            angular: `// Generated Angular Component from Figma
import { Component } from '@angular/core';

@Component({
    selector: 'app-header-component',
    template: \`
        <div class="header-component">
            <div class="logo">
                <span class="logo-text">Figma MCP Tester</span>
            </div>
            <nav class="navigation">
                <button class="nav-button primary" (click)="handleConnect()">
                    Connect to Figma
                </button>
            </nav>
        </div>
    \`,
    styleUrls: ['./header-component.component.css']
})
export class HeaderComponentComponent {
    handleConnect() {
        // Handle connection logic
    }
}`
        };

        return codeTemplates[framework] || codeTemplates.html;
    }

    getMockScreenshot() {
        return {
            url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjhmYWZjIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzY0NzQ4YiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkRlc2lnbiBQcmV2aWV3PC90ZXh0Pgo8L3N2Zz4K',
            width: 400,
            height: 200
        };
    }

    getMockVariables() {
        return {
            'color/primary': '#6366f1',
            'color/secondary': '#64748b',
            'color/success': '#10b981',
            'color/warning': '#f59e0b',
            'color/error': '#ef4444',
            'spacing/sm': '8px',
            'spacing/md': '16px',
            'spacing/lg': '24px',
            'radius/sm': '4px',
            'radius/md': '6px',
            'radius/lg': '8px',
            'typography/heading': '20px',
            'typography/body': '14px'
        };
    }

    getMockCodeConnectMap() {
        return {
            '1:2': {
                codeConnectSrc: 'https://github.com/example/components/Header.tsx',
                codeConnectName: 'Header'
            },
            '1:5': {
                codeConnectSrc: 'https://github.com/example/components/Button.tsx',
                codeConnectName: 'Button'
            }
        };
    }

    // Utility methods
    formatCodeForDisplay(code) {
        // Format code with proper indentation and syntax highlighting
        return code;
    }

    extractComponentsFromMetadata(metadata) {
        const components = [];
        
        function traverse(node) {
            if (node.type === 'COMPONENT' || node.type === 'INSTANCE') {
                components.push({
                    id: node.id,
                    name: node.name,
                    type: node.type
                });
            }
            
            if (node.children) {
                node.children.forEach(traverse);
            }
        }
        
        traverse(metadata);
        return components;
    }

    generateCSSVariables(variables) {
        let css = ':root {\n';
        for (const [key, value] of Object.entries(variables)) {
            const cssVar = key.replace(/\//g, '-');
            css += `  --${cssVar}: ${value};\n`;
        }
        css += '}\n';
        return css;
    }
}

// Export for use in other modules
window.FigmaIntegration = FigmaIntegration;
