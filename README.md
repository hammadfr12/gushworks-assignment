# Gushworks — Industrial Yarn Machinery Website

A fully responsive, multi-page static website built with **vanilla HTML, CSS, and JavaScript** (no frameworks or libraries). Designed to pixel-perfectly match the provided Figma specification.

---

## 📁 Project Structure

```
gushworks/
├── index.html            # Home page (hero, features, products, FAQ, CTA)
├── about.html            # About Us page (story, values, timeline, team)
├── products.html         # Products listing page (grid + filters)
├── product-detail.html   # Product detail page (carousel, specs, tabs)
├── contact.html          # Contact page (form, map, guarantees)
├── styles.css            # All CSS styles (design tokens, components, responsive)
├── script.js             # All JavaScript (sticky header, carousel, zoom, modals, FAQ)
├── assets/
│   ├── logo.png          # Site logo
│   └── product-main.png  # Main product image (used in carousel)
└── README.md             # This file
```

---

## 🚀 How to Run

### Option 1 — Open Directly in Browser (Quickest)

1. Open **File Explorer** and navigate to the project folder:
   ```
   C:\Users\dell\OneDrive\Desktop\gushworks\
   ```
2. Double-click **`index.html`**
3. It will open in your default browser immediately — no server needed.

> ✅ Works in Chrome, Edge, Firefox, and Safari.

---

### Option 2 — Live Server via VS Code (Recommended for Development)

This gives you **auto-refresh on save**, which is helpful when editing files.

1. Open VS Code and open the `gushworks` folder:
   - **File → Open Folder** → select `gushworks`
2. Install the **Live Server** extension (if not already installed):
   - Go to Extensions (`Ctrl+Shift+X`)
   - Search for `Live Server` by Ritwick Dey
   - Click **Install**
3. Right-click `index.html` in the Explorer panel and choose **"Open with Live Server"**
4. Your browser will open automatically at `http://127.0.0.1:5500/index.html`

---

### Option 3 — Python Local Server (No Extensions Needed)

If you have Python installed, run this in a terminal from the project folder:

**Python 3:**
```bash
python -m http.server 8080
```

Then open your browser at:
```
http://localhost:8080
```

---

### Option 4 — Node.js `serve` Package

If you have Node.js installed:

```bash
npx serve .
```

Then open the URL shown in the terminal (usually `http://localhost:3000`).

---

## ✨ Key Features

| Feature | Description |
|---|---|
| **Sticky Header** | A blue band slides in above the navbar when scrolling past the hero (80vh). Disappears when back at top. |
| **Image Carousel** | Navigation via arrows, thumbnail clicks, and dot indicators. Smooth slide transitions. |
| **Zoom on Hover** | Hovering over the carousel shows a magnified preview panel that follows the cursor. Dynamically tracks the active slide. |
| **Mobile Menu** | Hamburger icon on screens ≤860px. Full-height slide-in navigation panel. |
| **FAQ Accordion** | Chevron-driven accordion. Only one item open at a time. |
| **Modals** | "Request a Quote" modal accessible from multiple CTAs. Closes via button, backdrop click, or Escape key. |
| **Scroll Reveal** | Elements with `data-reveal` attribute animate into view using `IntersectionObserver`. |
| **Form Handling** | Contact and quote forms show a success state on submit (no backend required). |

---

## 📐 Responsive Breakpoints

| Breakpoint | Width | Layout |
|---|---|---|
| Desktop | ≥ 861px | Full multi-column layouts, desktop nav |
| Tablet | 661px – 860px | Stacked hero, 2-column grids, hamburger menu |
| Mobile | 401px – 660px | Single column, reduced padding |
| Small Mobile | ≤ 400px | Compact typography, hidden price in sticky bar |

---

## 🎨 Design Tokens

All design values are defined as CSS custom properties in `styles.css`:

```css
--primary:    #2B3990   /* Royal Blue */
--dark-bg:    #111827   /* Dark section background */
--text-primary: #0F172A /* Main text */
--nav-h:      77px      /* Navbar height */
--sticky-h:   48px      /* Sticky header band height */
--max-w:      1240px    /* Max content width */
```

---

## 🌐 Browser Compatibility

| Browser | Support |
|---|---|
| Chrome 90+ | ✅ Full |
| Edge 90+ | ✅ Full |
| Firefox 88+ | ✅ Full |
| Safari 14+ | ✅ Full |

---

## 📝 Notes

- **No build step** — all files are plain HTML/CSS/JS. Just open and run.
- **No npm / node_modules** — zero dependencies.
- **Images** — the site uses stock images from `assets/`. Replace with real product photos before deploying.
- **Contact form** — submissions are handled client-side only (shows success message). To send real emails, connect a backend or a service like [Formspree](https://formspree.io).
