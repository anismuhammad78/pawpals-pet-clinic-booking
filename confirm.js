const SERVICE_NAMES = {
  grooming: "Grooming",
  vaccination: "Vaccination",
  checkup: "Wellness Check",
  dental: "Dental Care",
  "flea-tick": "Flea & Tick",
  microchip: "Microchipping"
};

const PET_TYPE_NAMES = {
  dog: "Dog",
  cat: "Cat",
  bird: "Bird",
  rabbit: "Rabbit",
  other: "Other"
};

const STORAGE_KEYS = [
  "pawcare.selectedServiceId",
  "pawcare.selectedDate",
  "pawcare.selectedTimeSlot",
  "pawcare.customerDetails"
];


const summaryCard = document.querySelector("#summary-card");
const missingNotice = document.querySelector("#missing-data-notice");
const startOverButton = document.querySelector("#start-over");


function getStoredValue(key) {
  try {
    return localStorage.getItem(key);
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
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}


function createRow(label, value) {
  const row = document.createElement("div");
  row.className = "summary-row";

  const labelEl = document.createElement("span");
  labelEl.className = "summary-label";
  labelEl.textContent = label;

  const valueEl = document.createElement("span");
  valueEl.className = "summary-value";
  valueEl.textContent = value;

  row.appendChild(labelEl);
  row.appendChild(valueEl);

  return row;
}


function renderSummary() {
  const serviceId = getStoredValue("pawcare.selectedServiceId");
  const savedDate = getStoredValue("pawcare.selectedDate");
  const savedTime = getStoredValue("pawcare.selectedTimeSlot");

  let details = null;
  const rawDetails = getStoredValue("pawcare.customerDetails");

  if (rawDetails) {
    try {
      details = JSON.parse(rawDetails);
    } catch {
      details = null;
    }
  }

  const hasEverything =
    serviceId && savedDate && savedTime && details;

  if (!hasEverything) {
    missingNotice.textContent =
      "Some booking information is missing. You can go back and complete the earlier steps.";
    missingNotice.hidden = false;
  }

  const fragment = document.createDocumentFragment();

  fragment.appendChild(
    createRow(
      "Service",
      serviceId ? (SERVICE_NAMES[serviceId] || serviceId) : "Not selected"
    )
  );

  fragment.appendChild(
    createRow(
      "Date",
      savedDate ? formatDisplayDate(savedDate) : "Not selected"
    )
  );

  fragment.appendChild(
    createRow(
      "Time",
      savedTime || "Not selected"
    )
  );

  fragment.appendChild(
    createRow(
      "Owner name",
      details?.ownerName || "Not provided"
    )
  );

  fragment.appendChild(
    createRow(
      "Email",
      details?.ownerEmail || "Not provided"
    )
  );

  fragment.appendChild(
    createRow(
      "Phone",
      details?.ownerPhone || "Not provided"
    )
  );

  fragment.appendChild(
    createRow(
      "Pet name",
      details?.petName || "Not provided"
    )
  );

  fragment.appendChild(
    createRow(
      "Pet type",
      details?.petType
        ? (PET_TYPE_NAMES[details.petType] || details.petType)
        : "Not provided"
    )
  );

  summaryCard.appendChild(fragment);
}


function handleStartOver() {
  STORAGE_KEYS.forEach((key) => {
    try {
      localStorage.removeItem(key);
    } catch {
      /* ignore unavailable storage */
    }
  });

  window.location.href = "index.html";
}


renderSummary();

startOverButton.addEventListener("click", handleStartOver);
