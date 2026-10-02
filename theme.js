const THEME_STORAGE_KEY = "pawcare.theme";

const themeToggle = document.querySelector("#theme-toggle");


function getStoredTheme() {
  try {
    return localStorage.getItem(THEME_STORAGE_KEY);
  } catch {
    return null;
  }
}


function setStoredTheme(theme) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    return true;
  } catch {
    return false;
  }
}


function getPreferredTheme() {
  const stored = getStoredTheme();

  if (stored === "dark" || stored === "light") {
    return stored;
  }

  const prefersDark =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  return prefersDark ? "dark" : "light";
}


function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
}


function currentTheme() {
  return document.documentElement.getAttribute("data-theme") === "dark"
    ? "dark"
    : "light";
}


function updateToggleButton() {
  if (!themeToggle) {
    return;
  }

  const theme = currentTheme();

  themeToggle.setAttribute("aria-pressed", String(theme === "dark"));

  themeToggle.setAttribute(
    "aria-label",
    theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
  );
}


function toggleTheme() {
  const nextTheme = currentTheme() === "dark" ? "light" : "dark";

  applyTheme(nextTheme);
  setStoredTheme(nextTheme);
  updateToggleButton();
}


// The <head> of every page already sets data-theme as early as
// possible (see the inline script before the stylesheet) to avoid
// a flash of the wrong theme. This call just makes sure the theme
// is correct even if that inline script was skipped or storage
// changed in another tab, and keeps the toggle button in sync.
applyTheme(getPreferredTheme());
updateToggleButton();


if (themeToggle) {
  themeToggle.addEventListener("click", toggleTheme);
}


window.addEventListener("storage", (event) => {
  if (event.key === THEME_STORAGE_KEY && event.newValue) {
    applyTheme(event.newValue);
    updateToggleButton();
  }
});
