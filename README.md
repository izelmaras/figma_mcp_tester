# Figma MCP Tester

A modern web application for testing and integrating with Figma's Model Context Protocol (MCP) tools. This application allows you to connect to Figma designs, preview them, and generate code in multiple frameworks.

## Features

- 🔗 **Figma Integration**: Connect to Figma files and extract design data
- 🎨 **Design Preview**: Visualize Figma designs in the browser
- 💻 **Code Generation**: Generate code in HTML/CSS, React, Vue, and Angular
- 🧩 **Component Library**: Built-in component system for consistent UI
- 📱 **Mobile Responsive**: Optimized for all device sizes
- 🎯 **MCP Tools**: Full integration with Figma MCP tools

## Getting Started

### Prerequisites

- Modern web browser with JavaScript enabled
- Figma account and access to design files
- MCP tools configured (if using real Figma integration)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/izelmaras/figma_mcp_tester.git
cd figma_mcp_tester
```

2. Open `index.html` in your web browser or serve it using a local server:
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .

# Using PHP
php -S localhost:8000
```

3. Navigate to `http://localhost:8000` in your browser

## Usage

### Connecting to Figma

1. Click the "Connect to Figma" button in the header
2. Enter a Figma file URL or node ID in the connection panel
3. Click "Load Design" to fetch the design data

### Generating Code

1. Select your preferred framework from the dropdown (HTML/CSS, React, Vue, Angular)
2. Click "Generate Code" to create code from the loaded design
3. Copy the generated code or export it as a file

### Component Library

The application includes a built-in component library with:
- Buttons (Primary, Secondary, Success, Warning, Error)
- Input fields
- Cards
- Alerts
- Modals
- And more...

## Project Structure

```
figma_mcp_tester/
├── index.html              # Main HTML file
├── styles/
│   ├── main.css           # Main application styles
│   └── components.css     # Component system styles
├── js/
│   ├── main.js            # Main application logic
│   ├── figma-integration.js # Figma MCP integration
│   └── code-generator.js  # Code generation utilities
└── README.md              # This file
```

## Component System

The application uses a comprehensive component system with:

### Design Tokens
- **Colors**: Primary, secondary, success, warning, error variants
- **Typography**: Consistent font sizes and weights
- **Spacing**: Standardized spacing scale
- **Border Radius**: Consistent corner rounding
- **Shadows**: Elevation system

### Components
- **Buttons**: Multiple variants and sizes
- **Inputs**: Form controls with validation states
- **Cards**: Content containers with headers, bodies, and footers
- **Alerts**: Notification components
- **Modals**: Overlay dialogs
- **Badges**: Status indicators

## MCP Integration

The application integrates with Figma's MCP tools:

- `getMetadata`: Retrieve design structure and hierarchy
- `getCode`: Generate code from design components
- `getScreenshot`: Capture design previews
- `getVariableDefs`: Extract design tokens and variables
- `getCodeConnectMap`: Map components to existing code

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Development

### Adding New Components

1. Define the component in `styles/components.css`
2. Add JavaScript functionality in `js/main.js`
3. Update the component library in the HTML

### Extending Code Generation

1. Add new framework support in `js/code-generator.js`
2. Update the framework selector in the HTML
3. Test with various design structures

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For questions or issues:
- Create an issue on GitHub
- Check the documentation
- Review the code examples

## Roadmap

- [ ] Real-time Figma sync
- [ ] Advanced component detection
- [ ] Design system export
- [ ] Plugin integration
- [ ] Team collaboration features
- [ ] Version control integration

---

Built with ❤️ for the design-to-code workflow community.
