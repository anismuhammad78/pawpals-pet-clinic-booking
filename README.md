# PawCare Service Selection

A responsive pet-clinic online booking front-end built with plain HTML, CSS, and JavaScript.

## Features

### Step 1 — Choose a service (`index.html`)
- Responsive CSS Grid with 6 sample pet services.
- Each service card includes an icon, name, description, and price.
- Clicking a card highlights it with a blue border.
- The selected service id is saved to `localStorage` under `pawcare.selectedServiceId`.
- The saved selection is restored when the page is reopened.
- Accessible service grid using `role="grid"` and selectable grid cells.
- Keyboard navigation with arrow keys and visible focus styles.
- A "Continue to date & time" button links to `date.html`, enabled only once a service is selected.

### Step 2 — Pick a date & time (`date.html`)
- Inline month-view calendar built with [Pikaday](https://github.com/Pikaday/Pikaday), a lightweight open-source date picker, loaded from a CDN (no build step required).
- Past dates are disabled (`minDate` set to today); only today or future dates can be picked.
- A row of time slot buttons (09:00, 10:00, 11:00, 13:00, 14:00, 15:00, 16:00) below the calendar.
- Selecting a time slot highlights it (`aria-pressed`) and, once both a valid date and a time are chosen, both are saved automatically.
- A "Confirm date & time" button validates the selection and shows an inline error banner (`role="alert"`) if the date or time is missing.
- Selected date is saved to `localStorage` under `pawcare.selectedDate` (ISO `YYYY-MM-DD`), and the time under `pawcare.selectedTimeSlot`.
- The saved date & time are restored when the page is reopened.
- Calendar and time slot buttons are fully keyboard accessible (tab between controls, Enter/Space to select, arrow keys inside the calendar).
- Shows the previously selected service name at the top, with a link back to `index.html` if none was chosen yet.

## Project structure

```text
.
├── index.html
├── date.html
├── style.css
├── script.js
├── date.js
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
git add index.html date.html style.css script.js date.js README.md
git commit -m "Build pet service selection and date/time picker screens"
```

To publish it to a new GitHub repository, create an empty repository on GitHub and run:

```bash
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git push -u origin main
```

## Data model

Sample services are defined as a JavaScript array in `script.js`. Add or remove objects there to change the grid without editing the HTML cards manually.

Available time slots are defined as a JavaScript array (`TIME_SLOTS`) in `date.js`. Add or remove strings there to change the time options.

## Dependencies

- [Pikaday](https://github.com/Pikaday/Pikaday) (date picker, loaded via CDN in `date.html`) — requires an internet connection when running locally. To make the project fully offline, download `pikaday.min.js` and `pikaday.min.css` into the project folder and update the `<link>`/`<script>` paths in `date.html` to point to the local files instead of the CDN.
