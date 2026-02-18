# Via Sacra - Santidade Juvenil

A Via Sacra (Way of the Cross) application featuring young saints who inspire us. This interactive web application presents 14 stations, each dedicated to a young saint's story.

## Features

- 🙏 14 Stations of young saints
- 🌓 Dark/Light/System theme support
- 📖 Accessible reading with adjustable font sizes
- 🖼️ Image zoom functionality
- 📱 Mobile-responsive design
- ♿ Built with accessibility in mind

## Technologies

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **React Router** - Navigation
- **Marked** - Markdown parsing
- **DOMPurify** - XSS protection
- **Lucide React** - Icons
- **ESLint** - Code quality

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Lint code
npm run lint

# Preview production build
npm run preview

# Deploy to GitHub Pages
npm run deploy
```

## Security

This application implements several security best practices:
- HTML sanitization with DOMPurify to prevent XSS attacks
- PropTypes validation for type safety
- Secure content rendering
- URL validation before processing

## Accessibility

- Theme switching (Light/Dark/System)
- Font size adjustment (80%-150%)
- Semantic HTML structure
- ARIA labels for interactive elements
- Keyboard navigation support

## Project Structure

```
src/
├── components/          # React components
│   ├── StationContent.jsx
│   ├── Navigation.jsx
│   ├── Footer.jsx
│   └── AccessibilityMenu.jsx
├── context/            # React context providers
│   └── AccessibilityContext.jsx
├── constants.js        # Application constants
├── App.jsx            # Main app component
└── main.jsx           # Entry point

public/
├── stations/          # Markdown content for each station
└── images/           # Saint images
```

## License

This project is private and intended for educational/religious purposes.
