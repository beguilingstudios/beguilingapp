(function () {
  "use strict";

  var promoPackages = {
    "Matric Dance": [
      {
        name: "Matric Dance Promo",
        price: "R 1,200",
        amount: "1200",
        note: "Professional Makeup + Hair Styling. Travel excluded.",
        type: "book"
      }
    ],
    "Wedding": [
      {
        name: "Wedding Promo 1",
        price: "R 6,000",
        amount: "6000",
        note: "Bride + 2 Bridesmaids. Makeup & Hair.",
        type: "book"
      },
      {
        name: "Wedding Promo 2",
        price: "R 14,700",
        amount: "14700",
        note: "Bride + 5 Bridesmaids + 2 x MOB/MOG (Mother of the Bride / Mother of the Groom) + 1 x Flower Girl / Granny.",
        type: "book"
      },
      {
        name: "I Need a Personalised Quote",
        price: "",
        amount: "",
        note: "Tell us what you need and we will prepare a personalised quote for your wedding.",
        type: "quote"
      }
    ]
  };

  function byId(id) {
    return document.getElementById(id);
  }

  function safe(value) {
    var div = document.createElement("div");
    div.appendChild(document.createTextNode(value == null ? "" : String(value)));
    return div.innerHTML;
  }

  function showPage(name) {
    var pages = document.getElementsByClassName("page");
    var i;

    for (i = 0; i < pages.length; i++) {
      pages[i].className = "page";
    }

    byId("page-" + name).className = "page active";
    window.scrollTo(0, 0);
  }

  function openModal(id) {
    byId("shade").className = "";
    byId(id).className = "modal";
  }

  function closeModal(id) {
    byId(id).className = "modal hidden";
    byId("shade").className = "hidden";
  }

  function closeAllModals() {
    byId("bookingModal").className = "modal hidden";
    byId("quoteModal").className = "modal hidden";
    byId("shade").className = "hidden";
  }

  function attachPackageButtons() {
    var buttons = document.getElementsByClassName("package-action");
    var i;

    for (i = 0; i < buttons.length; i++) {
      buttons[i].onclick = function () {
        var type = this.getAttribute("data-type");
        var packageName = this.getAttribute("data-package");
        var amount = this.getAttribute("data-amount");

        if (type === "quote") {
          openModal("quoteModal");
          return;
        }

        byId("bookingPackage").value = packageName;
        byId("bookingAmount").value = amount;
        byId("selectedPackageSummary").innerHTML =
          "<strong>" + safe(packageName) + "</strong>" +
          "<span>R " + Number(amount).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</span>";

        openModal("bookingModal");
      };
    }
  }

  function showPromoPackages(category) {
    var packages = promoPackages[category];
    var html = "";
    var i;
    var buttonText;

    byId("promoPageTitle").innerHTML = safe(category);

    if (category === "Wedding") {
      byId("promoPageIntro").innerHTML =
        "Choose a wedding promo package or request a personalised quote.";
    } else {
      byId("promoPageIntro").innerHTML =
        "Choose the promo package you would like to book.";
    }

    for (i = 0; i < packages.length; i++) {
      if (packages[i].type === "quote") {
        buttonText = "GET A PERSONALISED QUOTE";
      } else {
        buttonText = "BOOK NOW";
      }

      html += '<div class="package-card">';
      html += '<h2>' + safe(packages[i].name) + '</h2>';

      if (packages[i].price !== "") {
        html += '<div class="package-price">' + safe(packages[i].price) + '</div>';
      }

      html += '<p class="package-note">' + safe(packages[i].note) + '</p>';
      html += '<button type="button" class="package-action"';
      html += ' data-package="' + safe(packages[i].name) + '"';
      html += ' data-amount="' + safe(packages[i].amount) + '"';
      html += ' data-type="' + safe(packages[i].type) + '">';
      html += buttonText;
      html += '</button>';
      html += '</div>';
    }

    byId("promoPackageList").innerHTML = html;
    showPage("promos");
    attachPackageButtons();
  }

  byId("matricButton").onclick = function () {
    showPromoPackages("Matric Dance");
  };

  byId("weddingButton").onclick = function () {
    showPromoPackages("Wedding");
  };

  byId("backToHome").onclick = function () {
    showPage("home");
  };

  byId("closeBooking").onclick = function () {
    closeModal("bookingModal");
  };

  byId("closeQuote").onclick = function () {
    closeModal("quoteModal");
  };

  byId("shade").onclick = function () {
    closeAllModals();
  };

  byId("bookingForm").onsubmit = function (event) {
    event.preventDefault();

    alert(
      "Thank you, " + byId("bookingCustomer").value +
      ". Your booking request for " + byId("bookingPackage").value +
      " has been captured."
    );

    this.reset();
    closeModal("bookingModal");
    showPage("home");
    return false;
  };

  byId("quoteForm").onsubmit = function (event) {
    event.preventDefault();

    alert(
      "Thank you, " + byId("quoteName").value +
      ". Your personalised wedding quote request has been captured."
    );

    this.reset();
    closeModal("quoteModal");
    showPage("home");
    return false;
  };

  showPage("home");
})();
