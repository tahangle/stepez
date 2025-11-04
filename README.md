# Lighting Designer Portfolio Website

A modern portfolio website for a lighting designer featuring GSAP animations.

## Setup

No build process required! This is a static website that can be deployed directly to GitHub Pages.

## Development

Simply open `index.html` in your browser, or use any local server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx http-server

# Using VS Code Live Server extension
# Right-click index.html and select "Open with Live Server"
```

## Deploy to GitHub Pages

1. Push this repository to GitHub
2. Go to repository Settings > Pages
3. Select branch (usually `main`) and root folder
4. Your site will be live at `https://yourusername.github.io/repository-name`

## Technologies

- **HTML/CSS** - Structure and styling
- **GSAP** - Smooth animations and scroll effects (loaded via CDN)

## Project Structure

```
├── css/
│   ├── reset.css      # CSS reset
│   └── styles.css     # Main styles
├── js/
│   └── main.js        # GSAP animations
├── fonts/             # Custom fonts
├── images/            # Image assets
└── index.html         # Main HTML file
```
