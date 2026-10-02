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
- A "Continue to your details" button validates the selection, shows an inline error banner (`role="alert"`) if the date or time is missing, and otherwise saves the selection and moves to `details.html`.
- Selected date is saved to `localStorage` under `pawcare.selectedDate` (ISO `YYYY-MM-DD`), and the time under `pawcare.selectedTimeSlot`.
- The saved date & time are restored when the page is reopened.
- Calendar and time slot buttons are fully keyboard accessible (tab between controls, Enter/Space to select, arrow keys inside the calendar).
- Shows the previously selected service name at the top, with a link back to `index.html` if none was chosen yet.

### Step 3 — Your details (`details.html`)
- A single-column, labelled form collecting owner name, email, phone, pet name, and pet type.
- Every field has native HTML5 validation attributes (`required`, `type="email"`, `type="tel"`, `pattern`, `minlength`/`maxlength`) as a baseline, layered with custom JavaScript validation for clearer messages.
- **Live validation**: each field is checked on `input`/`blur`/`change`. Once a field has been visited, errors update as the user types; a red inline message appears under the field and the input is marked `aria-invalid="true"`.
- Each field's error text is inside a `role="alert"` element (an ARIA live region), so screen readers announce new validation errors as they appear. A page-level `role="alert"` banner also summarizes failed submit attempts.
- A persistent "← Back to date & time" link appears both above and below the form; going back does not lose the date/time already saved in `localStorage`.
- On successful submit, all five fields are saved as one object to `localStorage` under `pawcare.customerDetails`, and the browser is redirected to `confirm.html`.
- If the user returns to this page later (e.g. from the confirmation page to make an edit), previously saved details are automatically repopulated into the form fields.
- Fully keyboard accessible: standard `<input>`/`<select>`/`<button>` elements, visible focus rings, and logical tab order (no custom widgets that would need extra keyboard handling).

### Step 4 — Confirmation (`confirm.html`)
- Reads the service, date, time, and customer details back out of `localStorage` and displays them as a read-only summary.
- Shows a warning banner if any earlier step was skipped or is missing.
- "Edit your details" returns to `details.html` (pre-filled); "Start a new booking" clears all saved booking data and returns to `index.html`.

## Project structure

```text
.
├── index.html
├── date.html
├── details.html
├── confirm.html
├── style.css
├── script.js
├── date.js
├── details.js
├── confirm.js
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
git add index.html date.html details.html confirm.html style.css script.js date.js details.js confirm.js README.md
git commit -m "Build pet service, date/time, details, and confirmation screens"
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

Form validation rules for the details page live in the `FIELD_RULES` object in `details.js` — edit the regular expressions or messages there to change what counts as a valid name, email, or phone number.

## Dependencies

- [Pikaday](https://github.com/Pikaday/Pikaday) (date picker, loaded via CDN in `date.html`) — requires an internet connection when running locally. To make the project fully offline, download `pikaday.min.js` and `pikaday.min.css` into the project folder and update the `<link>`/`<script>` paths in `date.html` to point to the local files instead of the CDN.
