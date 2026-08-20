var screens = Array.prototype.slice.call(document.querySelectorAll(".screen"));

var state = {
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
var BUSINESS_WHATSAPP = "27XXXXXXXXX";
var BUSINESS_EMAIL = "bookings@beguilingstudios.com";

function forEachNode(nodes, callback) {
  Array.prototype.forEach.call(nodes, callback);
}

function showScreen(id) {
  forEachNode(screens, function (screen) {
    if (screen.id === id) {
      screen.classList.add("active");
    } else {
      screen.classList.remove("active");
    }
  });

  window.scrollTo(0, 0);
}

function findParentWithAttribute(element, attributeName) {
  while (element && element !== document) {
    if (element.getAttribute && element.getAttribute(attributeName) !== null) {
      return element;
    }
    element = element.parentNode;
  }
  return null;
}

function findParentWithClass(element, className) {
  while (element && element !== document) {
    if (element.classList && element.classList.contains(className)) {
      return element;
    }
    element = element.parentNode;
  }
  return null;
}

document.addEventListener("click", function (event) {
  var go = findParentWithAttribute(event.target, "data-go");
  if (go) {
    showScreen(go.getAttribute("data-go"));
    return;
  }

  var back = findParentWithAttribute(event.target, "data-back");
  if (back) {
    showScreen(back.getAttribute("data-back"));
    return;
  }

  var occasion = findParentWithAttribute(event.target, "data-occasion");
  if (occasion) {
    state.occasion = occasion.getAttribute("data-occasion");
    showScreen(state.occasion === "matric" ? "matricScreen" : "weddingScreen");
    return;
  }

  var custom = findParentWithAttribute(event.target, "data-custom");
  if (custom) {
    state.customFrom = custom.getAttribute("data-custom");
    configureCustomQuote();
    showScreen("customQuoteScreen");
    return;
  }

  var packageButton = findParentWithClass(event.target, "package-select");
  if (packageButton) {
    state.selection = {
      type: "package",
      name: packageButton.getAttribute("data-package"),
      price: Number(packageButton.getAttribute("data-price")),
      details: packageButton.getAttribute("data-details")
    };
    renderPackageSummary();
    showScreen("summaryScreen");
  }
});

document.getElementById("customBack").addEventListener("click", function () {
  showScreen("weddingScreen");
});

document.getElementById("summaryBack").addEventListener("click", function () {
  if (state.selection && state.selection.type === "custom") {
    showScreen("customQuoteScreen");
  } else if (
    state.selection &&
    state.selection.name &&
    state.selection.name.indexOf("Matric") === 0
  ) {
    showScreen("matricScreen");
  } else {
    showScreen("weddingScreen");
  }
});

function configureCustomQuote() {
  state.people.bride.label = "Bride";
  state.people.bride.sub = "Includes your trial";
  state.people.bride.makeup = 1;
  state.people.bride.hair = 1;
  renderPeopleRows();
}

function renderPeopleRows() {
  var holder = document.getElementById("peopleRows");
  holder.innerHTML = "";

  var peopleKeys = Object.keys(state.people);
  var i;
  for (i = 0; i < peopleKeys.length; i++) {
    var key = peopleKeys[i];
    var person = state.people[key];
    var row = document.createElement("div");
    row.className = "person-row";
    row.innerHTML =
      '<div class="person-label">' +
        "<strong>" + person.label + "</strong>" +
        "<small>" + (person.sub || "&nbsp;") + "</small>" +
      "</div>" +
      stepperMarkup(key, "makeup", person.makeup) +
      stepperMarkup(key, "hair", person.hair);

    holder.appendChild(row);
  }

  forEachNode(holder.querySelectorAll("[data-step]"), function (button) {
    button.addEventListener("click", function () {
      var personKey = button.getAttribute("data-person");
      var service = button.getAttribute("data-service");
      var step = Number(button.getAttribute("data-step"));

      state.people[personKey][service] = Math.max(
        0,
        state.people[personKey][service] + step
      );

      renderPeopleRows();
      syncServiceAvailability();
    });
  });

  syncServiceAvailability();
}

function stepperMarkup(person, service, value) {
  return (
    '<div class="stepper" data-service="' + service + '">' +
      '<button type="button" data-step data-person="' + person +
      '" data-service="' + service + '" data-step="-1">−</button>' +
      "<output>" + value + "</output>" +
      '<button type="button" data-step data-person="' + person +
      '" data-service="' + service + '" data-step="1">+</button>' +
    "</div>"
  );
}

function syncServiceAvailability() {
  var makeupOn = document.getElementById("makeupToggle").checked;
  var hairOn = document.getElementById("hairToggle").checked;

  forEachNode(
    document.querySelectorAll('.stepper[data-service="makeup"]'),
    function (el) {
      if (makeupOn) {
        el.classList.remove("disabled");
      } else {
        el.classList.add("disabled");
      }
    }
  );

  forEachNode(
    document.querySelectorAll('.stepper[data-service="hair"]'),
    function (el) {
      if (hairOn) {
        el.classList.remove("disabled");
      } else {
        el.classList.add("disabled");
      }
    }
  );
}

document.getElementById("makeupToggle").addEventListener("change", syncServiceAvailability);
document.getElementById("hairToggle").addEventListener("change", syncServiceAvailability);

document.getElementById("quoteForm").addEventListener("submit", function (event) {
  event.preventDefault();

  var makeupOn = document.getElementById("makeupToggle").checked;
  var hairOn = document.getElementById("hairToggle").checked;
  var people = [];

  var peopleKeys = Object.keys(state.people);
  var i;
  for (i = 0; i < peopleKeys.length; i++) {
    var key = peopleKeys[i];
    var person = state.people[key];
    var item = {
      key: key,
      label: person.label,
      makeup: makeupOn ? person.makeup : 0,
      hair: hairOn ? person.hair : 0
    };

    if (item.makeup > 0 || item.hair > 0) {
      people.push(item);
    }
  }

  state.selection = {
    type: "custom",
    occasion: "Wedding",
    services: [],
    people: people,
    venue: document.getElementById("venue").value.trim(),
    notes: document.getElementById("notes").value.trim()
  };

  if (makeupOn) state.selection.services.push("Makeup");
  if (hairOn) state.selection.services.push("Hair");

  renderCustomSummary();
  showScreen("summaryScreen");
});

function formatRand(value) {
  try {
    return Number(value).toLocaleString("en-ZA");
  } catch (error) {
    return String(value);
  }
}

function renderPackageSummary() {
  var content = document.getElementById("summaryContent");
  var selection = state.selection;

  content.innerHTML =
    "<h3>" + selection.name + "</h3>" +
    "<dl>" +
      '<div class="summary-line"><dt>Package</dt><dd>' +
        selection.details +
      "</dd></div>" +
      '<div class="summary-line"><dt>Price</dt><dd>R' +
        formatRand(selection.price) +
      "</dd></div>" +
    "</dl>";

  updateContactLinks(
    "Hi Beguiling Studios! I would like to book " +
    selection.name +
    " at R" +
    formatRand(selection.price) +
    ". Package details: " +
    selection.details +
    "."
  );
}

function renderCustomSummary() {
  var content = document.getElementById("summaryContent");
  var selection = state.selection;
  var peopleHtml = "";

  if (selection.people.length) {
    selection.people.forEach(function (person) {
      peopleHtml +=
        '<div class="summary-line"><dt>' +
        person.label +
        "</dt><dd>Makeup: " +
        person.makeup +
        " · Hair: " +
        person.hair +
        "</dd></div>";
    });
  } else {
    peopleHtml =
      '<div class="summary-line"><dt>Services</dt><dd>No quantities selected yet</dd></div>';
  }

  content.innerHTML =
    "<h3>Wedding personalised quote</h3>" +
    "<dl>" +
      '<div class="summary-line"><dt>Services</dt><dd>' +
        (selection.services.length ? selection.services.join(" & ") : "None selected") +
      "</dd></div>" +
      peopleHtml +
      '<div class="summary-line"><dt>Venue</dt><dd>' +
        (selection.venue || "To be confirmed") +
      "</dd></div>" +
      '<div class="summary-line"><dt>Notes</dt><dd>' +
        (selection.notes || "None") +
      "</dd></div>" +
    "</dl>";

  var peopleText = "No quantities selected";

  if (selection.people.length) {
    var parts = [];
    selection.people.forEach(function (person) {
      parts.push(
        person.label +
        ": Makeup " +
        person.makeup +
        ", Hair " +
        person.hair
      );
    });
    peopleText = parts.join("; ");
  }

  updateContactLinks(
    "Hi Beguiling Studios! I would like a personalised Wedding quote. Services: " +
    (selection.services.length ? selection.services.join(" & ") : "Not selected") +
    ". " +
    peopleText +
    ". Venue: " +
    (selection.venue || "To be confirmed") +
    ". Notes: " +
    (selection.notes || "None") +
    "."
  );
}

function updateContactLinks(message) {
  var encoded = encodeURIComponent(message);

  document.getElementById("whatsappBtn").href =
    "https://wa.me/" + BUSINESS_WHATSAPP + "?text=" + encoded;

  document.getElementById("emailBtn").href =
    "mailto:" +
    BUSINESS_EMAIL +
    "?subject=" +
    encodeURIComponent("Beguiling Studios Booking Request") +
    "&body=" +
    encoded;
}

renderPeopleRows();
