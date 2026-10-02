# PawCare Service Selection

A responsive pet-clinic service selection screen built with plain HTML, CSS, and JavaScript.

## Features

- Responsive CSS Grid with 6 sample pet services.
- Each service card includes an icon, name, description, and price.
- Clicking a card highlights it with a blue border.
- The selected service id is saved to `localStorage` under `pawcare.selectedServiceId`.
- The saved selection is restored when the page is reopened.
- Accessible service grid using `role="grid"` and selectable grid cells.
- Keyboard navigation with arrow keys and visible focus styles.
- No external runtime dependencies.

## Project structure

```text
.
├── index.html
├── style.css
├── script.js
└── README.md
```

## Run locally

Because this is a static site, you can open `index.html` directly in a browser.

For a local development server, from this directory run:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Git setup

Initialize the local repository:

```bash
git init
git add index.html style.css script.js README.md
git commit -m "Build pet service selection screen"
```

To publish it to a new GitHub repository, create an empty repository on GitHub and run:

```bash
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git push -u origin main
```

## Data model

Sample services are defined as a JavaScript array in `script.js`. Add or remove objects there to change the grid without editing the HTML cards manually.
