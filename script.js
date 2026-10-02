const services = [
  {
    id: "grooming",
    name: "Grooming",
    description: "Bath, brush, nail trim, and a tidy finish for your pet.",
    price: "$35",
    image: "groomingg.jfif"
  },

  {
    id: "vaccination",
    name: "Vaccination",
    description: "Routine vaccines with a quick wellness check from the clinic team.",
    price: "$45",
    image: "vaccination.jpg"
  },

  {
    id: "checkup",
    name: "Wellness Check",
    description: "A nose-to-tail health exam to keep your pet feeling their best.",
    price: "$30",
    image: "illustions.jpg"
  },

  {
    id: "dental",
    name: "Dental Care",
    description: "A gentle dental check and cleaning plan for healthier smiles.",
    price: "$50",
    image: "Dog teeth.jpg"
  },

  {
    id: "flea-tick",
    name: "Flea & Tick",
    description: "Protection advice and treatment to help keep pests away.",
    price: "$25",
    image: "Flea & Tick.webp"
  },

  {
    id: "microchip",
    name: "Microchipping",
    description: "Quick identification chip placement with registration guidance.",
    price: "$20",
    image: "micropro.avif"
  }
];


const STORAGE_KEY = "pawcare.selectedServiceId";

const grid = document.querySelector("#service-grid");
const selectionNote = document.querySelector(".selection-note");
const selectionStatus = document.querySelector("#selection-status");
const continueLink = document.querySelector("#continue-to-date");


function getSavedServiceId() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}


function saveServiceId(serviceId) {
  try {
    localStorage.setItem(STORAGE_KEY, serviceId);
    return true;
  } catch {
    return false;
  }
}


function createServiceCard(service, index) {
  const card = document.createElement("button");

  card.className = "service-card";
  card.type = "button";

  card.setAttribute("role", "gridcell");
  card.setAttribute("aria-selected", "false");
  card.setAttribute(
    "aria-label",
    `${service.name}, ${service.price}`
  );

  card.dataset.serviceId = service.id;

  card.tabIndex = index === 0 ? 0 : -1;


  card.innerHTML = `
    <span
      class="service-icon"
      aria-hidden="true"
    >
      <img
        src="${service.image}"
        alt=""
        loading="lazy"
      >
    </span>

    <h2>${service.name}</h2>

    <p>${service.description}</p>

    <span class="service-meta">

      <span class="service-price">
        ${service.price}
      </span>

      <span
        class="select-label"
        aria-hidden="true"
      >
        Select →
      </span>

    </span>
  `;


  card.addEventListener(
    "click",
    () => selectService(service.id)
  );

  card.addEventListener(
    "keydown",
    handleGridNavigation
  );


  return card;
}


function renderServices() {
  const fragment = document.createDocumentFragment();

  services.forEach((service, index) => {
    fragment.appendChild(
      createServiceCard(service, index)
    );
  });

  grid.appendChild(fragment);
}


function updateSelection(serviceId) {
  const selectedService =
    services.find(
      (service) => service.id === serviceId
    ) || null;


  grid
    .querySelectorAll(".service-card")
    .forEach((card) => {

      const isSelected =
        card.dataset.serviceId === serviceId;

      card.setAttribute(
        "aria-selected",
        String(isSelected)
      );
    });


  if (selectedService) {

    selectionNote.classList.add("is-selected");

    selectionStatus.textContent =
      `${selectedService.name} selected`;

  } else {

    selectionNote.classList.remove("is-selected");

    selectionStatus.textContent =
      "No service selected";
  }


  if (continueLink) {

    if (selectedService) {
      continueLink.classList.remove("is-disabled");
      continueLink.removeAttribute("aria-disabled");
    } else {
      continueLink.classList.add("is-disabled");
      continueLink.setAttribute("aria-disabled", "true");
    }
  }
}


function selectService(serviceId) {
  const exists =
    services.some(
      (service) => service.id === serviceId
    );


  if (!exists) {
    return;
  }


  const saved =
    saveServiceId(serviceId);

  updateSelection(serviceId);


  if (!saved) {
    selectionStatus.textContent =
      "Selection shown, but local saving is unavailable";

    selectionNote.classList.add(
      "is-selected"
    );
  }
}


function handleGridNavigation(event) {
  const cards = [
    ...grid.querySelectorAll(".service-card")
  ];

  const currentIndex =
    cards.indexOf(event.currentTarget);

  let nextIndex = currentIndex;


  if (event.key === "ArrowRight") {
    nextIndex = Math.min(
      currentIndex + 1,
      cards.length - 1
    );
  }


  if (event.key === "ArrowLeft") {
    nextIndex = Math.max(
      currentIndex - 1,
      0
    );
  }


  if (event.key === "ArrowDown") {
    nextIndex = Math.min(
      currentIndex + 3,
      cards.length - 1
    );
  }


  if (event.key === "ArrowUp") {
    nextIndex = Math.max(
      currentIndex - 3,
      0
    );
  }


  if (nextIndex !== currentIndex) {

    event.preventDefault();

    cards[currentIndex].tabIndex = -1;

    cards[nextIndex].tabIndex = 0;

    cards[nextIndex].focus();
  }
}


renderServices();

updateSelection(
  getSavedServiceId()
);


if (continueLink) {
  continueLink.addEventListener("click", (event) => {
    if (continueLink.classList.contains("is-disabled")) {
      event.preventDefault();
    }
  });
}