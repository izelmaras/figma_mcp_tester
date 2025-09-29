// Code Generator Module
class CodeGenerator {
    constructor() {
        this.frameworks = {
            html: {
                name: 'HTML/CSS',
                extension: 'html',
                template: this.generateHTMLTemplate.bind(this)
            },
            react: {
                name: 'React',
                extension: 'jsx',
                template: this.generateReactTemplate.bind(this)
            },
            vue: {
                name: 'Vue',
                extension: 'vue',
                template: this.generateVueTemplate.bind(this)
            },
            angular: {
                name: 'Angular',
                extension: 'ts',
                template: this.generateAngularTemplate.bind(this)
            }
        };
    }

    generateCode(designData, framework = 'html', options = {}) {
        const frameworkConfig = this.frameworks[framework];
        if (!frameworkConfig) {
            throw new Error(`Unsupported framework: ${framework}`);
        }

        return frameworkConfig.template(designData, options);
    }

    generateHTMLTemplate(designData, options = {}) {
        const { components = [], variables = {}, styles = {} } = designData;
        
        let html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated Design</title>
    <style>
        ${this.generateCSSVariables(variables)}
        ${this.generateBaseStyles()}
        ${this.generateComponentStyles(components, styles)}
    </style>
</head>
<body>
    ${this.generateHTMLStructure(components)}
</body>
</html>`;

        return html;
    }

    generateReactTemplate(designData, options = {}) {
        const { components = [], variables = {} } = designData;
        
        const componentCode = this.generateReactComponents(components);
        const stylesCode = this.generateReactStyles(components, variables);
        
        return {
            component: componentCode,
            styles: stylesCode,
            package: this.generateReactPackageJson()
        };
    }

    generateVueTemplate(designData, options = {}) {
        const { components = [], variables = {} } = designData;
        
        return this.generateVueComponents(components, variables);
    }

    generateAngularTemplate(designData, options = {}) {
        const { components = [], variables = {} } = designData;
        
        return this.generateAngularComponents(components, variables);
    }

    generateCSSVariables(variables) {
        if (!variables || Object.keys(variables).length === 0) {
            return '';
        }

        let css = ':root {\n';
        for (const [key, value] of Object.entries(variables)) {
            const cssVar = key.replace(/\//g, '-').toLowerCase();
            css += `  --${cssVar}: ${value};\n`;
        }
        css += '}\n\n';
        return css;
    }

    generateBaseStyles() {
        return `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.6;
    color: #333;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

`;
    }

    generateComponentStyles(components, styles) {
        let css = '';
        
        components.forEach(component => {
            const componentName = this.sanitizeClassName(component.name);
            css += `.${componentName} {\n`;
            
            if (component.styles) {
                for (const [property, value] of Object.entries(component.styles)) {
                    css += `  ${property}: ${value};\n`;
                }
            }
            
            css += '}\n\n';
        });
        
        return css;
    }

    generateHTMLStructure(components) {
        let html = '<div class="container">\n';
        
        components.forEach(component => {
            const componentName = this.sanitizeClassName(component.name);
            html += `  <div class="${componentName}">\n`;
            
            if (component.children) {
                html += this.generateHTMLChildren(component.children, '    ');
            } else if (component.content) {
                html += `    ${component.content}\n`;
            }
            
            html += '  </div>\n';
        });
        
        html += '</div>';
        return html;
    }

    generateHTMLChildren(children, indent = '') {
        let html = '';
        
        children.forEach(child => {
            const childName = this.sanitizeClassName(child.name);
            html += `${indent}<div class="${childName}">\n`;
            
            if (child.children) {
                html += this.generateHTMLChildren(child.children, indent + '  ');
            } else if (child.content) {
                html += `${indent}  ${child.content}\n`;
            }
            
            html += `${indent}</div>\n`;
        });
        
        return html;
    }

    generateReactComponents(components) {
        let jsx = `import React from 'react';
import './styles.css';

const App = () => {
    return (
        <div className="container">
`;

        components.forEach(component => {
            const componentName = this.sanitizeClassName(component.name);
            jsx += `            <div className="${componentName}">\n`;
            
            if (component.children) {
                jsx += this.generateReactChildren(component.children, '                ');
            } else if (component.content) {
                jsx += `                ${component.content}\n`;
            }
            
            jsx += '            </div>\n';
        });

        jsx += `        </div>
    );
};

export default App;`;

        return jsx;
    }

    generateReactChildren(children, indent = '') {
        let jsx = '';
        
        children.forEach(child => {
            const childName = this.sanitizeClassName(child.name);
            jsx += `${indent}<div className="${childName}">\n`;
            
            if (child.children) {
                jsx += this.generateReactChildren(child.children, indent + '  ');
            } else if (child.content) {
                jsx += `${indent}  ${child.content}\n`;
            }
            
            jsx += `${indent}</div>\n`;
        });
        
        return jsx;
    }

    generateReactStyles(components, variables) {
        let css = this.generateCSSVariables(variables);
        css += this.generateBaseStyles();
        css += this.generateComponentStyles(components);
        return css;
    }

    generateReactPackageJson() {
        return {
            name: "figma-generated-app",
            version: "1.0.0",
            dependencies: {
                "react": "^18.2.0",
                "react-dom": "^18.2.0"
            },
            devDependencies: {
                "@vitejs/plugin-react": "^4.0.0",
                "vite": "^4.4.0"
            }
        };
    }

    generateVueComponents(components, variables) {
        let vue = `<template>
    <div class="container">
`;

        components.forEach(component => {
            const componentName = this.sanitizeClassName(component.name);
            vue += `        <div class="${componentName}">\n`;
            
            if (component.children) {
                vue += this.generateVueChildren(component.children, '            ');
            } else if (component.content) {
                vue += `            ${component.content}\n`;
            }
            
            vue += '        </div>\n';
        });

        vue += `    </div>
</template>

<script>
export default {
    name: 'GeneratedApp'
}
</script>

<style scoped>
${this.generateCSSVariables(variables)}
${this.generateBaseStyles()}
${this.generateComponentStyles(components)}
</style>`;

        return vue;
    }

    generateVueChildren(children, indent = '') {
        let vue = '';
        
        children.forEach(child => {
            const childName = this.sanitizeClassName(child.name);
            vue += `${indent}<div class="${childName}">\n`;
            
            if (child.children) {
                vue += this.generateVueChildren(child.children, indent + '  ');
            } else if (child.content) {
                vue += `${indent}  ${child.content}\n`;
            }
            
            vue += `${indent}</div>\n`;
        });
        
        return vue;
    }

    generateAngularComponents(components, variables) {
        let ts = `import { Component } from '@angular/core';

@Component({
    selector: 'app-root',
    template: \`
        <div class="container">
`;

        components.forEach(component => {
            const componentName = this.sanitizeClassName(component.name);
            ts += `            <div class="${componentName}">\n`;
            
            if (component.children) {
                ts += this.generateAngularChildren(component.children, '                ');
            } else if (component.content) {
                ts += `                ${component.content}\n`;
            }
            
            ts += '            </div>\n';
        });

        ts += `        </div>
    \`,
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'figma-generated-app';
}`;

        return ts;
    }

    generateAngularChildren(children, indent = '') {
        let ts = '';
        
        children.forEach(child => {
            const childName = this.sanitizeClassName(child.name);
            ts += `${indent}<div class="${childName}">\n`;
            
            if (child.children) {
                ts += this.generateAngularChildren(child.children, indent + '  ');
            } else if (child.content) {
                ts += `${indent}  ${child.content}\n`;
            }
            
            ts += `${indent}</div>\n`;
        });
        
        return ts;
    }

    sanitizeClassName(name) {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
    }

    // Utility methods for code formatting
    formatCode(code, language = 'html') {
        // Basic code formatting
        return code;
    }

    minifyCode(code, language = 'html') {
        // Basic code minification
        return code.replace(/\s+/g, ' ').trim();
    }

    validateCode(code, language = 'html') {
        // Basic code validation
        const validators = {
            html: this.validateHTML.bind(this),
            css: this.validateCSS.bind(this),
            javascript: this.validateJavaScript.bind(this)
        };

        return validators[language] ? validators[language](code) : true;
    }

    validateHTML(html) {
        // Basic HTML validation
        const hasDoctype = html.includes('<!DOCTYPE');
        const hasHtmlTag = html.includes('<html');
        const hasBodyTag = html.includes('<body');
        
        return hasDoctype && hasHtmlTag && hasBodyTag;
    }

    validateCSS(css) {
        // Basic CSS validation
        const hasValidSyntax = /{[^}]*}/.test(css);
        return hasValidSyntax;
    }

    validateJavaScript(js) {
        // Basic JavaScript validation
        try {
            // Try to parse as JavaScript
            new Function(js);
            return true;
        } catch (e) {
            return false;
        }
    }

    // Export functionality
    exportCode(code, filename, format = 'html') {
        const blob = new Blob([code], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}.${this.frameworks[format]?.extension || 'txt'}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Copy to clipboard functionality
    async copyToClipboard(code) {
        try {
            await navigator.clipboard.writeText(code);
            return true;
        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = code;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            return true;
        }
    }
}

// Export for use in other modules
window.CodeGenerator = CodeGenerator;
