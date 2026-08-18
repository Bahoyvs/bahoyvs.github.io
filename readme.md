# İlhan Bahadır Yavaş - Portfolio Website

A modern, responsive portfolio website for a software engineer and game developer: Unity and Unreal Engine gameplay systems, multiplayer networking, and the backends behind them. Built with vanilla HTML, CSS, and JavaScript, with a cyberpunk/sci-fi aesthetic.

Live at **[bahoyvs.github.io](https://bahoyvs.github.io)**.

## 🚀 Features

- **Modern Cyberpunk Design**: Dark theme with neon accent colors (#64ffda, #00BFFF)
- **Fully Responsive**: Optimized for mobile, tablet, and desktop devices
- **Smooth Animations**: AOS (Animate On Scroll) library integration
- **Interactive Project Modals**: Detailed project information in pop-up modals
- **Experience Timeline**: Work history rendered as a vertical timeline
- **Sticky Navigation**: Smart navbar with hamburger menu for mobile
- **Progress Bars**: Animated skill level indicators
- **Contact Form**: Ready-to-use contact form (mailto-based)
- **SEO Optimized**: Proper meta tags, semantic HTML, and accessibility features
- **Lazy Loading**: Optimized image loading for better performance

## 📁 Project Structure

```
bahoyvs.github.io/
├── index.html          # Main HTML file
├── style.css           # All custom styles
├── scripts.js          # Project data, modals, animations
├── assets/
│   ├── img/            # Project artwork and placeholders
│   ├── images/         # Photos and screenshots
│   └── cv.pdf          # Downloadable CV
└── readme.md
```

## 🛠️ Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- A code editor (VS Code recommended)
- Optional: Live Server extension for local development

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/bahoyvs/bahoyvs.github.io.git
   cd bahoyvs.github.io
   ```

2. **Open with Live Server**
   
   Using VS Code:
   - Install the "Live Server" extension
   - Right-click on `index.html`
   - Select "Open with Live Server"

   Or using Python:
   ```bash
   python -m http.server 8000
   ```
   Then open `http://localhost:8000` in your browser.

   Or using Node.js:
   ```bash
   npx serve src
   ```

3. **Start editing!**
   - The page will auto-reload when you save changes (with Live Server)

### Production Deployment

Since this is a static website, you can deploy it to any static hosting service:

#### GitHub Pages
1. Push your code to the `username.github.io` repository
2. Go to Settings > Pages
3. Select the branch and the root folder as the source
4. Your site will be available at `https://username.github.io`

#### Netlify
1. Connect your GitHub repository
2. Set build command: (leave empty)
3. Set publish directory: `.`
4. Deploy!

#### Vercel
1. Import your GitHub repository
2. Framework Preset: Other
3. Root Directory: `.`
4. Deploy!

## 🎨 Customization

### Colors

Edit the CSS variables in `style.css`:

```css
:root {
    --color-bg-primary: #0a192f;     /* Main background */
    --color-bg-secondary: #112240;    /* Card backgrounds */
    --color-accent: #64ffda;          /* Primary accent (cyan) */
    --color-accent-secondary: #00BFFF; /* Secondary accent (blue) */
    --color-text-primary: #ccd6f6;    /* Main text */
    --color-text-secondary: #8892b0;  /* Muted text */
}
```

### Fonts

The website uses Google Fonts:
- **Poppins**: Headings (600-800 weight)
- **Inter**: Body text (300-600 weight)

To change fonts, update the Google Fonts link in `index.html` and the font-family variables in `style.css`.

### Adding Projects

1. Add your project image to `assets/img/`
2. Add project data in `scripts.js`:

```javascript
const projectData = {
    'your-project-id': {
        title: 'Project Title',
        role: 'Your role on the project',        // optional
        image: 'assets/img/your-image.jpg',
        video: 'https://youtu.be/VIDEO_ID',      // optional, replaces the image
        awards: ['Award name, Event 2026'],      // optional
        description: 'Project description...',
        features: [
            'Feature 1',
            'Feature 2'
        ],
        technologies: ['Tech1', 'Tech2']
    }
};
```

3. Add the project card HTML in `index.html` (copy an existing card and modify)

### Replacing Placeholder Images

Replace the SVG placeholders with your actual project screenshots:
- Recommended size: 800x500px for project images
- Recommended size: 400x400px for profile image
- Supported formats: WebP, JPEG, PNG, SVG
- Use `srcset` for responsive images:

```html
<img 
    src="assets/img/project.jpg"
    srcset="assets/img/project-small.jpg 400w,
            assets/img/project-medium.jpg 800w,
            assets/img/project-large.jpg 1200w"
    sizes="(max-width: 768px) 100vw, 50vw"
    alt="Project description"
    loading="lazy"
>
```

### Contact Form Backend

The contact form currently uses `mailto:`. For a functional form, integrate with:

- **Formspree**: Free form backend
  ```html
  <form action="https://formspree.io/f/YOUR_ID" method="POST">
  ```

- **Netlify Forms**: If deploying on Netlify
  ```html
  <form name="contact" netlify>
  ```

- **Custom Backend**: Connect to your own API endpoint

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome for Android)

## 🔧 Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Custom properties, Flexbox, Grid, Animations
- **JavaScript**: ES6+, IntersectionObserver, DOM manipulation
- **AOS**: Animate On Scroll library
- **Font Awesome**: Icon library
- **Google Fonts**: Poppins & Inter

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**İlhan Bahadır Yavaş**
- Portfolio: [bahoyvs.github.io](https://bahoyvs.github.io)
- LinkedIn: [linkedin.com/in/bahoyvs](https://linkedin.com/in/bahoyvs)
- GitHub: [github.com/bahoyvs](https://github.com/bahoyvs)
- Email: ilhanbahadiryavas@gmail.com

---

⭐ If you found this template helpful, please give it a star!
