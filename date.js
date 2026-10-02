const TIME_SLOTS = [
  "09:00",
  "10:00",
  "11:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00"
];

const SERVICE_NAMES = {
  grooming: "Grooming",
  vaccination: "Vaccination",
  checkup: "Wellness Check",
  dental: "Dental Care",
  "flea-tick": "Flea & Tick",
  microchip: "Microchipping"
};

const SERVICE_STORAGE_KEY = "pawcare.selectedServiceId";
const DATE_STORAGE_KEY = "pawcare.selectedDate";
const TIME_STORAGE_KEY = "pawcare.selectedTimeSlot";


const calendarHost = document.querySelector("#calendar");
const dateField = document.querySelector("#date-field");
const timeSlotsEl = document.querySelector("#time-slots");
const errorBanner = document.querySelector("#form-error");
const datetimeNote = document.querySelector("#datetime-note");
const datetimeStatus = document.querySelector("#datetime-status");
const serviceContext = document.querySelector("#service-context");
const confirmButton = document.querySelector("#confirm-selection");


let selectedDate = null;
let selectedTime = null;


function getToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}


function isFutureOrToday(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return false;
  }

  const check = new Date(date);
  check.setHours(0, 0, 0, 0);

  return check.getTime() >= getToday().getTime();
}


function toISODate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}


function parseISODate(value) {
  if (typeof value !== "string") {
    return null;
  }

  const parts = value.split("-").map(Number);

  if (parts.length !== 3 || parts.some(Number.isNaN)) {
    return null;
  }

  const [year, month, day] = parts;
  const date = new Date(year, month - 1, day);

  return Number.isNaN(date.getTime()) ? null : date;
}


function formatDisplayDate(date) {
  return date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric"
  });
}


function getStoredValue(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}


function setStoredValue(key, value) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}


function showError(message) {
  errorBanner.textContent = message;
  errorBanner.hidden = false;
}


function clearError() {
  errorBanner.hidden = true;
  errorBanner.textContent = "";
}


function updateStatus() {
  const hasDate = Boolean(selectedDate) && isFutureOrToday(selectedDate);
  const hasTime = Boolean(selectedTime);

  if (hasDate && hasTime) {
    datetimeNote.classList.add("is-selected");

    datetimeStatus.textContent =
      `${formatDisplayDate(selectedDate)} at ${selectedTime} selected`;

  } else if (hasDate) {
    datetimeNote.classList.remove("is-selected");

    datetimeStatus.textContent =
      `${formatDisplayDate(selectedDate)} selected — choose a time`;

  } else if (hasTime) {
    datetimeNote.classList.remove("is-selected");

    datetimeStatus.textContent =
      `${selectedTime} selected — choose a date`;

  } else {
    datetimeNote.classList.remove("is-selected");

    datetimeStatus.textContent =
      "No date or time selected";
  }
}


function saveSelection() {
  const dateSaved = setStoredValue(
    DATE_STORAGE_KEY,
    toISODate(selectedDate)
  );

  const timeSaved = setStoredValue(
    TIME_STORAGE_KEY,
    selectedTime
  );

  return dateSaved && timeSaved;
}


function autosaveIfComplete() {
  if (
    selectedDate &&
    isFutureOrToday(selectedDate) &&
    selectedTime
  ) {
    saveSelection();
  }
}


function renderServiceContext() {
  if (!serviceContext) {
    return;
  }

  const serviceId = getStoredValue(SERVICE_STORAGE_KEY);
  const serviceName = serviceId ? SERVICE_NAMES[serviceId] : null;

  if (serviceName) {
    serviceContext.textContent =
      `Booking ${serviceName}. Choose an appointment date and an available time slot. Your selection is saved on this device.`;
  } else {
    serviceContext.innerHTML =
      `No service selected yet. <a href="index.html">Go back and choose a service</a>, then pick a date and time below.`;
  }
}


function selectTimeSlot(time) {
  selectedTime = time;

  timeSlotsEl
    .querySelectorAll(".time-slot")
    .forEach((button) => {

      const isSelected = button.dataset.time === time;

      button.classList.toggle("is-selected", isSelected);
      button.setAttribute("aria-pressed", String(isSelected));
    });

  clearError();
  updateStatus();
  autosaveIfComplete();
}


function renderTimeSlots() {
  const fragment = document.createDocumentFragment();

  TIME_SLOTS.forEach((time) => {
    const button = document.createElement("button");

    button.type = "button";
    button.className = "time-slot";
    button.textContent = time;
    button.dataset.time = time;
    button.setAttribute("aria-pressed", "false");

    button.addEventListener(
      "click",
      () => selectTimeSlot(time)
    );

    fragment.appendChild(button);
  });

  timeSlotsEl.appendChild(fragment);
}


function handleDateSelect(date) {
  selectedDate = date;

  clearError();
  updateStatus();
  autosaveIfComplete();
}


const picker = new Pikaday({
  field: dateField,
  container: calendarHost,
  bound: false,
  firstDay: 1,
  minDate: getToday(),
  defaultDate: null,
  onSelect() {
    handleDateSelect(picker.getDate());
  }
});


function handleConfirm() {
  if (!selectedDate || !isFutureOrToday(selectedDate)) {
    showError(
      "Please choose an appointment date (today or a future date)."
    );
    return;
  }

  if (!selectedTime) {
    showError(
      "Please select an available time slot."
    );
    return;
  }

  const saved = saveSelection();

  clearError();
  updateStatus();

  if (!saved) {
    showError(
      "Your selection is confirmed, but local saving is unavailable in this browser."
    );
  }
}


function restoreSavedSelection() {
  const savedDateStr = getStoredValue(DATE_STORAGE_KEY);
  const savedTime = getStoredValue(TIME_STORAGE_KEY);

  const parsedDate = parseISODate(savedDateStr);

  if (parsedDate && isFutureOrToday(parsedDate)) {
    selectedDate = parsedDate;
    picker.setDate(parsedDate, true);
  }

  if (savedTime && TIME_SLOTS.includes(savedTime)) {
    selectTimeSlot(savedTime);
  }

  updateStatus();
}


renderServiceContext();
renderTimeSlots();
restoreSavedSelection();

confirmButton.addEventListener("click", handleConfirm);
