# PawPals Pet Clinic — Online Booking Front-End

A responsive, accessible, 4-step pet clinic booking flow built with plain HTML, CSS, and JavaScript — no frameworks, no build step. Everything a visitor picks is saved to their browser's `localStorage`, so a booking survives page reloads (there is no backend/server — see **Hand-over notes** below).

**Live site:** `https://YOUR-USERNAME.github.io/YOUR-REPO/` — *update this link after deploying (see "Deploy to GitHub Pages" below).*

## The booking flow

| Step | Page | What happens |
|---|---|---|
| 1 | `index.html` | Pick a clinic service from a grid of cards. |
| 2 | `date.html` | Pick an appointment date (calendar) and a time slot. |
| 3 | `details.html` | Enter owner & pet details, with live validation. |
| 4 | `confirm.html` | Review everything, edit any section, or start over. |

Every page shares the same header, footer, and a light/dark mode toggle.

## Features

### Step 1 — Choose a service (`index.html`)
- Responsive CSS Grid with 6 sample pet services (icon, name, description, price).
- Clicking a card highlights it and saves the service id to `localStorage` (`pawcare.selectedServiceId`); the choice is restored on reload.
- Accessible grid using `role="grid"`, selectable cells, and arrow-key keyboard navigation.
- "Continue to date & time" button is disabled until a service is chosen.

### Step 2 — Pick a date & time (`date.html`)
- Inline month-view calendar built with [Pikaday](https://github.com/Pikaday/Pikaday), a lightweight open-source date picker, loaded from a CDN (no install needed).
- Past dates are disabled (`minDate` set to today); only today or future dates can be picked.
- Time slot buttons (09:00, 10:00, 11:00, 13:00, 14:00, 15:00, 16:00) below the calendar; selecting one highlights it (`aria-pressed`).
- Once both a valid date and a time are chosen they're saved automatically (`pawcare.selectedDate`, `pawcare.selectedTimeSlot`); the "Continue" button also validates and shows an error banner if either is missing.
- Saved date & time are restored when the page is reopened (e.g. via the edit link from the confirmation page).
- Fully keyboard accessible (Tab between controls, Enter/Space to select, arrow keys inside the calendar).

### Step 3 — Your details (`details.html`)
- Single-column form: owner name, email, phone, pet name, pet type.
- Native HTML5 validation attributes (`required`, `type="email"`, `type="tel"`, `pattern`, `minlength`/`maxlength`) plus custom JavaScript rules for clearer messages.
- **Live validation**: once a field has been visited, errors update as the user types; invalid fields get a red inline message and `aria-invalid="true"`.
- Each error message lives inside a `role="alert"` element (an ARIA live region), so screen readers announce new errors as they appear; a page-level `role="alert"` banner also summarizes a failed submit attempt.
- On successful submit, all fields are saved as one object (`pawcare.customerDetails`) and the browser moves to `confirm.html`.
- Returning to this page (via Back or an edit link) repopulates previously saved details automatically.

### Step 4 — Confirmation (`confirm.html`)
- Reads everything back out of `localStorage` and displays it as three clearly headed sections: **Service**, **Date & time**, **Owner & pet**.
- Each section has a small pencil "Edit" link that sends the user back to the exact step that owns that data — and because every step already restores its own saved values, the field/selection is pre-filled automatically.
- Shows a warning banner if any step was skipped.
- "Start a new booking" clears all saved booking data and returns to `index.html`.

### Dark mode (all pages)
- A sun/moon toggle button sits in the header of every page.
- Colors are driven entirely by CSS custom properties (`--page`, `--surface`, `--text`, `--blue`, etc. defined in `:root`); dark mode simply overrides those properties under `:root[data-theme="dark"]`, so every component re-themes automatically.
- The choice is saved to `localStorage` (`pawcare.theme`) and restored on every page, including a small inline script in each page's `<head>` that applies the saved theme before the page paints (no flash of the wrong theme).
- If no preference is saved yet, the toggle respects the visitor's OS-level light/dark setting (`prefers-color-scheme`).

## Project structure

```text
.
├── index.html      Step 1 — service selection
├── date.html       Step 2 — date & time picker
├── details.html    Step 3 — customer & pet details form
├── confirm.html    Step 4 — booking summary / confirmation
├── style.css       All styling, incl. dark mode & Pikaday theme overrides
├── script.js       index.html logic
├── date.js         date.html logic (Pikaday + time slots)
├── details.js      details.html logic (validation)
├── confirm.js      confirm.html logic (summary rendering)
├── theme.js        shared dark-mode toggle logic (used on every page)
└── README.md
```

## Run locally

Because this is a static site, you can open `index.html` directly in a browser. For a local server instead:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Deploy to GitHub Pages

1. **Create the repository** (skip if you already have one) and push all files:

   ```bash
   git init
   git add .
   git commit -m "PawPals booking flow: services, date/time, details, confirmation, dark mode"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
   git push -u origin main
   ```

2. **Enable GitHub Pages:**
   - On GitHub, open the repository → **Settings** → **Pages** (left sidebar).
   - Under **Build and deployment → Source**, choose **Deploy from a branch**.
   - Under **Branch**, choose **main** and folder **/ (root)**, then **Save**.
   - Wait a minute or two, then refresh the page — GitHub shows the live URL at the top of the Pages settings (usually `https://YOUR-USERNAME.github.io/YOUR-REPO/`).

3. **Update this README's "Live site" link at the top** with that URL, commit, and push again.

4. **Smoke-test the live URL**, not just localhost — click through all 4 steps, try the dark-mode toggle, and refresh mid-flow to confirm `localStorage` persists on the real domain.

## Hand-over notes (for the client)

- **No backend, no database, no emails are sent.** Everything a visitor picks (service, date, time, contact & pet info, theme) is stored only in *that visitor's own browser* via `localStorage`. Nothing is sent to a server, so the clinic does not currently receive bookings anywhere — this project is the front-end booking UI only. To take real bookings you'll need to add a backend (e.g. a form endpoint, a small API, or a service like Formspree/Netlify Forms) that the final submit step sends data to.
- **Editing the service list:** open `script.js`, edit the `services` array (id, name, description, price, image filename).
- **Editing time slots:** open `date.js`, edit the `TIME_SLOTS` array.
- **Editing form validation rules:** open `details.js`, edit the `FIELD_RULES` object (regular expressions and error messages).
- **Editing colors/branding:** open `style.css`, edit the CSS custom properties at the top of the `:root` block (light mode) and the `:root[data-theme="dark"]` block just below it (dark mode) — every component reads from these variables.
- **Clearing a test booking:** open the browser console on any page and run `localStorage.clear()`, or use the "Start a new booking" button on the confirmation page.
- **Browser support caveat:** `localStorage` is per-browser and per-device — a booking made on a visitor's phone won't show up if they open the site on their laptop.

## Dependencies

- [Pikaday](https://github.com/Pikaday/Pikaday) (date picker, loaded via CDN in `date.html`) — requires an internet connection. To make the project fully offline, download `pikaday.js`/`pikaday.css` into the project folder and update the `<link>`/`<script>` paths in `date.html`.

## Data model

- Sample services: JavaScript array (`services`) in `script.js`.
- Time slots: JavaScript array (`TIME_SLOTS`) in `date.js`.
- Validation rules: `FIELD_RULES` object in `details.js`.
- `localStorage` keys used across the app: `pawcare.selectedServiceId`, `pawcare.selectedDate`, `pawcare.selectedTimeSlot`, `pawcare.customerDetails`, `pawcare.theme`.
