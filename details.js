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
const DETAILS_STORAGE_KEY = "pawcare.customerDetails";


const form = document.querySelector("#details-form");
const formError = document.querySelector("#form-error");
const bookingContext = document.querySelector("#booking-context");

const fields = {
  ownerName: document.querySelector("#owner-name"),
  ownerEmail: document.querySelector("#owner-email"),
  ownerPhone: document.querySelector("#owner-phone"),
  petName: document.querySelector("#pet-name"),
  petType: document.querySelector("#pet-type")
};

const errorEls = {
  ownerName: document.querySelector("#owner-name-error"),
  ownerEmail: document.querySelector("#owner-email-error"),
  ownerPhone: document.querySelector("#owner-phone-error"),
  petName: document.querySelector("#pet-name-error"),
  petType: document.querySelector("#pet-type-error")
};

const touched = {
  ownerName: false,
  ownerEmail: false,
  ownerPhone: false,
  petName: false,
  petType: false
};


const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[0-9+()\-\s]{7,20}$/;
const NAME_PATTERN = /^[A-Za-z\s'.-]{2,60}$/;


const FIELD_RULES = {
  ownerName(value) {
    const trimmed = value.trim();

    if (!trimmed) {
      return "Owner name is required.";
    }

    if (!NAME_PATTERN.test(trimmed)) {
      return "Enter a valid name (letters, spaces, apostrophes or hyphens only, at least 2 characters).";
    }

    return "";
  },

  ownerEmail(value) {
    const trimmed = value.trim();

    if (!trimmed) {
      return "Email address is required.";
    }

    if (!EMAIL_PATTERN.test(trimmed)) {
      return "Enter a valid email address, e.g. name@example.com.";
    }

    return "";
  },

  ownerPhone(value) {
    const trimmed = value.trim();

    if (!trimmed) {
      return "Phone number is required.";
    }

    if (!PHONE_PATTERN.test(trimmed)) {
      return "Enter a valid phone number (digits, spaces, +, -, ( ) only, 7–20 characters).";
    }

    return "";
  },

  petName(value) {
    const trimmed = value.trim();

    if (!trimmed) {
      return "Pet name is required.";
    }

    if (trimmed.length > 40) {
      return "Pet name must be 40 characters or fewer.";
    }

    return "";
  },

  petType(value) {
    if (!value) {
      return "Please choose a pet type.";
    }

    return "";
  }
};


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


function getStoredDetails() {
  const raw = getStoredValue(DETAILS_STORAGE_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}


function formatDisplayDate(isoDate) {
  const parts = isoDate.split("-").map(Number);

  if (parts.length !== 3) {
    return isoDate;
  }

  const [year, month, day] = parts;
  const date = new Date(year, month - 1, day);

  if (Number.isNaN(date.getTime())) {
    return isoDate;
  }

  return date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric"
  });
}


function renderBookingContext() {
  if (!bookingContext) {
    return;
  }

  const serviceId = getStoredValue(SERVICE_STORAGE_KEY);
  const serviceName = serviceId ? SERVICE_NAMES[serviceId] : null;

  const savedDate = getStoredValue(DATE_STORAGE_KEY);
  const savedTime = getStoredValue(TIME_STORAGE_KEY);

  if (serviceName && savedDate && savedTime) {
    bookingContext.textContent =
      `Booking ${serviceName} on ${formatDisplayDate(savedDate)} at ${savedTime}. ` +
      `Tell us who to contact and a little about your pet.`;
  } else {
    bookingContext.innerHTML =
      `Some booking details are missing. <a href="index.html">Start over from services</a> ` +
      `if this isn't right, or continue below — your contact details are saved either way.`;
  }
}


function prefillForm() {
  const saved = getStoredDetails();

  if (!saved) {
    return;
  }

  if (saved.ownerName) fields.ownerName.value = saved.ownerName;
  if (saved.ownerEmail) fields.ownerEmail.value = saved.ownerEmail;
  if (saved.ownerPhone) fields.ownerPhone.value = saved.ownerPhone;
  if (saved.petName) fields.petName.value = saved.petName;
  if (saved.petType) fields.petType.value = saved.petType;
}


function showFieldError(name, message) {
  const input = fields[name];
  const errorEl = errorEls[name];

  errorEl.textContent = message;
  input.setAttribute("aria-invalid", message ? "true" : "false");
  input.classList.toggle("is-invalid", Boolean(message));
}


function validateField(name, { force = false } = {}) {
  if (!touched[name] && !force) {
    return true;
  }

  const input = fields[name];
  const message = FIELD_RULES[name](input.value);

  showFieldError(name, message);

  return !message;
}


function validateAllFields() {
  let isValid = true;

  Object.keys(fields).forEach((name) => {
    touched[name] = true;

    const fieldValid = validateField(name, { force: true });

    if (!fieldValid) {
      isValid = false;
    }
  });

  return isValid;
}


function showFormError(message) {
  formError.textContent = message;
  formError.hidden = false;
}


function clearFormError() {
  formError.hidden = true;
  formError.textContent = "";
}


function focusFirstInvalidField() {
  const firstInvalidName = Object.keys(fields).find(
    (name) => errorEls[name].textContent
  );

  if (firstInvalidName) {
    fields[firstInvalidName].focus();
  }
}


function saveDetails(details) {
  return setStoredValue(
    DETAILS_STORAGE_KEY,
    JSON.stringify(details)
  );
}


function attachLiveValidation() {
  Object.keys(fields).forEach((name) => {
    const input = fields[name];

    input.addEventListener("input", () => {
      validateField(name);
    });

    input.addEventListener("blur", () => {
      touched[name] = true;
      validateField(name, { force: true });
    });

    input.addEventListener("change", () => {
      touched[name] = true;
      validateField(name, { force: true });
    });
  });
}


function handleSubmit(event) {
  event.preventDefault();

  const isValid = validateAllFields();

  if (!isValid) {
    showFormError(
      "Please fix the highlighted fields before continuing."
    );
    focusFirstInvalidField();
    return;
  }

  clearFormError();

  const details = {
    ownerName: fields.ownerName.value.trim(),
    ownerEmail: fields.ownerEmail.value.trim(),
    ownerPhone: fields.ownerPhone.value.trim(),
    petName: fields.petName.value.trim(),
    petType: fields.petType.value
  };

  const saved = saveDetails(details);

  if (!saved) {
    showFormError(
      "Your details look good, but local saving is unavailable in this browser."
    );
    return;
  }

  window.location.href = "confirm.html";
}


renderBookingContext();
prefillForm();
attachLiveValidation();

form.addEventListener("submit", handleSubmit);
