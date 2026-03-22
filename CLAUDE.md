# CLAUDE.md — AI Assistant Guide for stanleysunday.github.io

## Project Overview

This is a **creative portfolio website** for "Stanley Sunday", hosted on GitHub Pages. It is a pure static site with no build system, no package manager, and no backend. The site showcases several interactive web experiences built with vanilla HTML5, CSS3, and JavaScript.

---

## Repository Structure

```
stanleysunday.github.io/
├── index.html              # Main landing page with animated canvas background
├── caballitosalchicha.png  # Bouncing image asset used on the landing page
├── README.md               # Brief project description
├── CLAUDE.md               # This file
│
├── filmografia/
│   └── index.html          # Film catalog / résumé page
│
├── dropmates/
│   └── index.html          # Self-contained interactive game
│
├── lluvia/
│   └── index.html          # Interactive photo-rain physics animation
│
└── dianahead/
    ├── index.html           # HTML shell (loads p5.js + sketch.js)
    ├── sketch.js            # Main p5.js sketch (~190 lines)
    └── face.jpg             # Portrait image used in the interaction
```

---

## Technology Stack

| Layer       | Technology                                                          |
|-------------|---------------------------------------------------------------------|
| HTML        | HTML5 (no templating engine)                                        |
| CSS         | Vanilla CSS3 (clamp, flexbox, grid, viewport units)                 |
| JavaScript  | Vanilla ES5/ES6, Canvas 2D API, requestAnimationFrame               |
| Library     | p5.js v1.4.0 (CDN only, used in `dianahead/`)                       |
| Fonts       | Google Fonts (Fredoka One, Nunito, Space Mono)                      |
| Hosting     | GitHub Pages (served from `main`/`master` branch root)              |
| Build       | **None** — zero-build, zero-dependency, no npm or bundler           |

---

## Subprojects

### `/index.html` — Landing Page
- Animated canvas background: a PNG image bounces around the viewport.
- Navigation links to the three sub-experiences.
- Fluid typography via CSS `clamp()`.
- Spanish-language content.

### `/filmografia/` — Film Catalog
- Static page listing films (year + title).
- Serif typography (Georgia), responsive grid.
- No interactivity.

### `/dropmates/` — Game
- A fully self-contained single-file game (~717 lines, ~194 KB).
- Canvas-based rendering with embedded CSS and JS.
- Has a scoring system, game-over screen, and restart button.
- All UI strings in Spanish.

### `/lluvia/` — Photo Rain Animation
- Physics simulation: gravity, velocity, bounce damping, friction.
- A base64-encoded JPEG is embedded directly in the JavaScript.
- Click/touch anywhere spawns batches of falling photos.
- "Clear" button resets the simulation.

### `/dianahead/` — Face Interaction (p5.js)
- Loaded via CDN: `https://cdn.jsdelivr.net/npm/p5@1.4.0/lib/p5.js`
- Freehand drawing with mouse/touch.
- Shape extraction from background with boundary collision detection.
- On-screen "C" button closes the drawn shape.

---

## Development Workflow

### Making Changes
1. Edit HTML/CSS/JS files directly — no compilation needed.
2. Open any `index.html` in a browser (file:// or a local server) to preview.
3. A simple local server is helpful for `dianahead/` (p5.js + external image):
   ```bash
   python3 -m http.server 8080
   # then open http://localhost:8080/
   ```

### Deployment
- Push to `main` (or `master`) branch — GitHub Pages serves the root automatically.
- No CI/CD pipeline exists. Deployment is immediate after a push.

### Branch Convention
- Feature/AI branches follow the pattern: `claude/<description>-<id>`
- Always develop on the designated feature branch and push with:
  ```bash
  git push -u origin <branch-name>
  ```

---

## Code Conventions

### HTML
- Each subproject is a **self-contained `index.html`**.
- Styles are either inline `<style>` blocks or embedded in the file.
- Scripts are inline `<script>` blocks at the bottom of `<body>` or loaded via CDN `<script src>`.
- Viewport meta tag is always present: `<meta name="viewport" content="width=device-width, initial-scale=1.0">`.

### CSS
- Fluid typography using `clamp()` — avoid hard pixel values for font sizes.
- Dark backgrounds (`#111`, `#1a0533`) with bright accent colors (`#ffd93d`, `#ff6b9d`).
- No CSS preprocessors (no Sass/Less/PostCSS).
- No external CSS frameworks (no Bootstrap, Tailwind, etc.).

### JavaScript
- **No modules** — no `import`/`export`, no bundler.
- Global scope variables are acceptable (no module encapsulation).
- Use `requestAnimationFrame` for all animation loops.
- Physics values (gravity, damping, friction) are plain numeric constants at the top of the relevant script.
- Touch and mouse events are both handled for mobile compatibility.
- Assets embedded as base64 strings where portability is needed (see `lluvia/`).

### Naming
- Files and directories use lowercase, no spaces (e.g., `filmografia/`, `sketch.js`).
- No strict naming convention for variables; camelCase is used in practice.

### Language
- All user-facing text is in **Spanish**.

---

## Key Patterns

### Canvas Animation Loop
```js
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // update state
  // render
  requestAnimationFrame(draw);
}
requestAnimationFrame(draw);
```

### Physics Particle
```js
let particle = {
  x, y,
  vx, vy,      // velocity
  gravity: 0.4,
  friction: 0.98,
  bounceDamping: 0.6
};
// Per frame:
particle.vy += particle.gravity;
particle.vx *= particle.friction;
particle.vy *= particle.friction;
particle.x += particle.vx;
particle.y += particle.vy;
// Boundary collision:
if (particle.y + size > canvas.height) {
  particle.y = canvas.height - size;
  particle.vy *= -particle.bounceDamping;
}
```

### Responsive Canvas
```js
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
```

---

## What NOT to Do

- Do **not** introduce a build system (webpack, Vite, Parcel) unless explicitly requested.
- Do **not** add npm or any package manager.
- Do **not** convert inline scripts to external module files unless requested.
- Do **not** add a framework (React, Vue, etc.) — the project intentionally uses vanilla JS.
- Do **not** break the self-contained nature of subproject `index.html` files.
- Do **not** push to `main`/`master` directly — always use a feature branch.
- Do **not** add English text to user-facing UI — content is in Spanish.

---

## Asset Notes

- `caballitosalchicha.png` (~344 KB) — landing page bouncing image.
- `dianahead/face.jpg` (~94 KB) — portrait used in the p5.js sketch.
- `lluvia/index.html` contains a large base64-encoded JPEG embedded in JavaScript (~24 KB file total).

---

## Commit Message Style

The existing history uses simple messages like `"Add files via upload"`. Prefer descriptive messages:

```
Add responsive breakpoint to filmografia layout
Fix bounce physics in lluvia for small screens
Update landing page copy
```

No enforced conventional commit format (feat:/fix:/chore:), but clear imperative descriptions are preferred.
