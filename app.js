const screens = [...document.querySelectorAll(".screen")];

const state = {
  occasion: "",
  customFrom: "Wedding",
  selection: null,
  people: {
    bride: { label: "Bride", sub: "Includes your trial", makeup: 1, hair: 1 },
    bridesmaids: { label: "Bridesmaids", sub: "", makeup: 0, hair: 0 },
    mother: { label: "Mother", sub: "MOB / MOG", makeup: 0, hair: 0 },
    flower: { label: "Grandmother / Flower Girl", sub: "", makeup: 0, hair: 0 },
    additional: { label: "Additional Guest", sub: "Not part of retinue", makeup: 0, hair: 0 }
  }
};

// Change these before publishing:
const BUSINESS_WHATSAPP = "27XXXXXXXXX";
const BUSINESS_EMAIL = "bookings@beguilingstudios.com";

function showScreen(id) {
  screens.forEach(screen => screen.classList.toggle("active", screen.id === id));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.addEventListener("click", (event) => {
  const go = event.target.closest("[data-go]");
  if (go) showScreen(go.dataset.go);

  const back = event.target.closest("[data-back]");
  if (back) showScreen(back.dataset.back);

  const occasion = event.target.closest("[data-occasion]");
  if (occasion) {
    state.occasion = occasion.dataset.occasion;
    showScreen(state.occasion === "matric" ? "matricScreen" : "weddingScreen");
  }

  const custom = event.target.closest("[data-custom]");
  if (custom) {
    state.customFrom = custom.dataset.custom;
    configureCustomQuote();
    showScreen("customQuoteScreen");
  }

  const packageButton = event.target.closest(".package-select");
  if (packageButton) {
    state.selection = {
      type: "package",
      name: packageButton.dataset.package,
      price: Number(packageButton.dataset.price),
      details: packageButton.dataset.details
    };
    renderPackageSummary();
    showScreen("summaryScreen");
  }
});

document.getElementById("customBack").addEventListener("click", () => {
  showScreen(state.customFrom === "Matric Dance" ? "matricScreen" : "weddingScreen");
});

document.getElementById("summaryBack").addEventListener("click", () => {
  showScreen(state.selection?.type === "custom" ? "customQuoteScreen" :
    state.selection?.name?.startsWith("Matric") ? "matricScreen" : "weddingScreen");
});

function configureCustomQuote() {
  if (state.customFrom === "Matric Dance") {
    state.people.bride.label = "Matric Student";
    state.people.bride.sub = "";
    state.people.bride.makeup = 1;
    state.people.bride.hair = 1;
  } else {
    state.people.bride.label = "Bride";
    state.people.bride.sub = "Includes your trial";
    state.people.bride.makeup = 1;
    state.people.bride.hair = 1;
  }
  renderPeopleRows();
}

function renderPeopleRows() {
  const holder = document.getElementById("peopleRows");
  holder.innerHTML = "";

  Object.entries(state.people).forEach(([key, person]) => {
    const row = document.createElement("div");
    row.className = "person-row";
    row.innerHTML = `
      <div class="person-label">
        <strong>${person.label}</strong>
        <small>${person.sub || "&nbsp;"}</small>
      </div>
      ${stepperMarkup(key, "makeup", person.makeup)}
      ${stepperMarkup(key, "hair", person.hair)}
    `;
    holder.appendChild(row);
  });

  holder.querySelectorAll("[data-step]").forEach(button => {
    button.addEventListener("click", () => {
      const { person, service, step } = button.dataset;
      state.people[person][service] = Math.max(0, state.people[person][service] + Number(step));
      renderPeopleRows();
      syncServiceAvailability();
    });
  });

  syncServiceAvailability();
}

function stepperMarkup(person, service, value) {
  return `
    <div class="stepper" data-service="${service}">
      <button type="button" data-step data-person="${person}" data-service="${service}" data-step="-1">−</button>
      <output>${value}</output>
      <button type="button" data-step data-person="${person}" data-service="${service}" data-step="1">+</button>
    </div>`;
}

function syncServiceAvailability() {
  const makeupOn = document.getElementById("makeupToggle").checked;
  const hairOn = document.getElementById("hairToggle").checked;

  document.querySelectorAll('.stepper[data-service="makeup"]').forEach(el => {
    el.classList.toggle("disabled", !makeupOn);
  });
  document.querySelectorAll('.stepper[data-service="hair"]').forEach(el => {
    el.classList.toggle("disabled", !hairOn);
  });
}

document.getElementById("makeupToggle").addEventListener("change", syncServiceAvailability);
document.getElementById("hairToggle").addEventListener("change", syncServiceAvailability);

document.getElementById("quoteForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const makeupOn = document.getElementById("makeupToggle").checked;
  const hairOn = document.getElementById("hairToggle").checked;

  const people = Object.entries(state.people)
    .map(([key, person]) => ({
      key,
      label: person.label,
      makeup: makeupOn ? person.makeup : 0,
      hair: hairOn ? person.hair : 0
    }))
    .filter(person => person.makeup > 0 || person.hair > 0);

  state.selection = {
    type: "custom",
    occasion: state.customFrom,
    services: [
      makeupOn ? "Makeup" : null,
      hairOn ? "Hair" : null
    ].filter(Boolean),
    people,
    venue: document.getElementById("venue").value.trim(),
    notes: document.getElementById("notes").value.trim()
  };

  renderCustomSummary();
  showScreen("summaryScreen");
});

function renderPackageSummary() {
  const content = document.getElementById("summaryContent");
  const selection = state.selection;

  content.innerHTML = `
    <h3>${selection.name}</h3>
    <dl>
      <div class="summary-line"><dt>Package</dt><dd>${selection.details}</dd></div>
      <div class="summary-line"><dt>Price</dt><dd>R${selection.price.toLocaleString("en-ZA")}</dd></div>
    </dl>
  `;

  updateContactLinks(
    `Hi Beguiling Studios! I would like to book ${selection.name} at R${selection.price.toLocaleString("en-ZA")}. Package details: ${selection.details}.`
  );
}

function renderCustomSummary() {
  const content = document.getElementById("summaryContent");
  const selection = state.selection;

  const peopleHtml = selection.people.length
    ? selection.people.map(person =>
      `<div class="summary-line"><dt>${person.label}</dt><dd>Makeup: ${person.makeup} · Hair: ${person.hair}</dd></div>`
    ).join("")
    : `<div class="summary-line"><dt>Services</dt><dd>No quantities selected yet</dd></div>`;

  content.innerHTML = `
    <h3>${selection.occasion} personalised quote</h3>
    <dl>
      <div class="summary-line"><dt>Services</dt><dd>${selection.services.join(" & ") || "None selected"}</dd></div>
      ${peopleHtml}
      <div class="summary-line"><dt>Venue</dt><dd>${selection.venue || "To be confirmed"}</dd></div>
      <div class="summary-line"><dt>Notes</dt><dd>${selection.notes || "None"}</dd></div>
    </dl>
  `;

  const peopleText = selection.people.length
    ? selection.people.map(p => `${p.label}: Makeup ${p.makeup}, Hair ${p.hair}`).join("; ")
    : "No quantities selected";

  updateContactLinks(
    `Hi Beguiling Studios! I would like a personalised ${selection.occasion} quote. Services: ${selection.services.join(" & ") || "Not selected"}. ${peopleText}. Venue: ${selection.venue || "To be confirmed"}. Notes: ${selection.notes || "None"}.`
  );
}

function updateContactLinks(message) {
  const encoded = encodeURIComponent(message);
  document.getElementById("whatsappBtn").href = `https://wa.me/${BUSINESS_WHATSAPP}?text=${encoded}`;
  document.getElementById("emailBtn").href =
    `mailto:${BUSINESS_EMAIL}?subject=${encodeURIComponent("Beguiling Studios Booking Request")}&body=${encoded}`;
}

renderPeopleRows();
