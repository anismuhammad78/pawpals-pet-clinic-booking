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

const EDIT_ICON = `
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25ZM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83Z"/>
  </svg>
`;


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


function createRow(label, value, isMissing) {
  const row = document.createElement("div");
  row.className = "summary-row";

  const labelEl = document.createElement("span");
  labelEl.className = "summary-label";
  labelEl.textContent = label;

  const valueEl = document.createElement("span");
  valueEl.className = isMissing ? "summary-value is-muted" : "summary-value";
  valueEl.textContent = value;

  row.appendChild(labelEl);
  row.appendChild(valueEl);

  return row;
}


function createSection({ title, editHref, editLabel, rows }) {
  const section = document.createElement("div");
  section.className = "summary-section";

  const header = document.createElement("div");
  header.className = "summary-section-header";

  const heading = document.createElement("h2");
  heading.textContent = title;

  const editLink = document.createElement("a");
  editLink.className = "edit-link";
  editLink.href = editHref;
  editLink.setAttribute("aria-label", editLabel);
  editLink.innerHTML = `${EDIT_ICON}<span aria-hidden="true">Edit</span>`;

  header.appendChild(heading);
  header.appendChild(editLink);

  section.appendChild(header);

  rows.forEach(([label, value, isMissing]) => {
    section.appendChild(createRow(label, value, isMissing));
  });

  return section;
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
      "Some booking information is missing. Use the edit links below to go back and complete it.";
    missingNotice.hidden = false;
  }

  const fragment = document.createDocumentFragment();

  fragment.appendChild(
    createSection({
      title: "Service",
      editHref: "index.html",
      editLabel: "Edit selected service",
      rows: [
        [
          "Service",
          serviceId ? (SERVICE_NAMES[serviceId] || serviceId) : "Not selected",
          !serviceId
        ]
      ]
    })
  );

  fragment.appendChild(
    createSection({
      title: "Date & time",
      editHref: "date.html",
      editLabel: "Edit appointment date and time",
      rows: [
        [
          "Date",
          savedDate ? formatDisplayDate(savedDate) : "Not selected",
          !savedDate
        ],
        [
          "Time",
          savedTime || "Not selected",
          !savedTime
        ]
      ]
    })
  );

  fragment.appendChild(
    createSection({
      title: "Owner & pet",
      editHref: "details.html",
      editLabel: "Edit your contact and pet details",
      rows: [
        [
          "Owner name",
          (details && details.ownerName) || "Not provided",
          !(details && details.ownerName)
        ],
        [
          "Email",
          (details && details.ownerEmail) || "Not provided",
          !(details && details.ownerEmail)
        ],
        [
          "Phone",
          (details && details.ownerPhone) || "Not provided",
          !(details && details.ownerPhone)
        ],
        [
          "Pet name",
          (details && details.petName) || "Not provided",
          !(details && details.petName)
        ],
        [
          "Pet type",
          (details && details.petType)
            ? (PET_TYPE_NAMES[details.petType] || details.petType)
            : "Not provided",
          !(details && details.petType)
        ]
      ]
    })
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
