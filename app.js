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

  function safe(value) {
    var d = document.createElement("div");
    d.appendChild(document.createTextNode(value == null ? "" : String(value)));
    return d.innerHTML;
  }

  function showPage(name) {
    var pages = document.getElementsByClassName("page");
    var i;

    for (i = 0; i < pages.length; i++) {
      pages[i].className = "page";
    }

    document.getElementById("page-" + name).className = "page active";
    window.scrollTo(0, 0);
  }

  function openModal(id) {
    document.getElementById("shade").className = "";
    document.getElementById(id).className = "modal";
  }

  function closeModal(id) {
    document.getElementById(id).className = "modal hidden";
    document.getElementById("shade").className = "hidden";
  }

  function closeAllModals() {
    closeModal("bookingModal");
    closeModal("quoteModal");
  }

  function showPromoPackages(category) {
    var packages = promoPackages[category] || [];
    var html = "";
    var i;
    var buttonLabel;

    document.getElementById("promoPageTitle").innerHTML = safe(category);

    document.getElementById("promoPageIntro").innerHTML =
      category === "Wedding"
        ? "Choose a wedding promo package or request a personalised quote."
        : "Choose the promo package you would like to book.";

    for (i = 0; i < packages.length; i++) {
      buttonLabel = packages[i].type === "quote"
        ? "GET A PERSONALISED QUOTE"
        : "BOOK NOW";

      html += '<div class="package-card">' +
        '<h2>' + safe(packages[i].name) + '</h2>' +
        (packages[i].price
          ? '<div class="package-price">' + safe(packages[i].price) + '</div>'
          : '') +
        '<p class="package-note">' + safe(packages[i].note) + '</p>' +
        '<button class="package-action"' +
          ' data-category="' + safe(category) + '"' +
          ' data-package="' + safe(packages[i].name) + '"' +
          ' data-amount="' + safe(packages[i].amount) + '"' +
          ' data-type="' + safe(packages[i].type) + '">' +
          buttonLabel +
        '</button>' +
      '</div>';
    }

    document.getElementById("promoPackageList").innerHTML = html;
    showPage("promos");

    var actions = document.getElementsByClassName("package-action");

    for (i = 0; i < actions.length; i++) {
      actions[i].onclick = function () {
        var actionType = this.getAttribute("data-type");
        var packageName = this.getAttribute("data-package");
        var amount = this.getAttribute("data-amount");

        if (actionType === "quote") {
          openModal("quoteModal");
          return;
        }

        document.getElementById("bookingPackage").value = packageName;
        document.getElementById("bookingAmount").value = amount;

        document.getElementById("selectedPackageSummary").innerHTML =
          '<strong>' + safe(packageName) + '</strong>' +
          '<span>R ' + Number(amount).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '</span>';

        openModal("bookingModal");
      };
    }
  }

  function addListeners() {
    var promoChoices = document.getElementsByClassName("promo-choice");
    var closeButtons = document.getElementsByClassName("close");
    var i;

    for (i = 0; i < promoChoices.length; i++) {
      promoChoices[i].onclick = function () {
        showPromoPackages(this.getAttribute("data-promo"));
      };
    }

    document.getElementById("backToHome").onclick = function () {
      showPage("home");
    };

    for (i = 0; i < closeButtons.length; i++) {
      closeButtons[i].onclick = function () {
        closeModal(this.getAttribute("data-modal"));
      };
    }

    document.getElementById("shade").onclick = function () {
      closeAllModals();
    };

    document.getElementById("bookingForm").onsubmit = function (event) {
      event.preventDefault();

      var packageName = document.getElementById("bookingPackage").value;
      var name = document.getElementById("bookingCustomer").value;

      alert(
        "Thank you, " + name +
        ". Your request for " + packageName +
        " has been captured. We will connect this form to your live booking system next."
      );

      this.reset();
      closeModal("bookingModal");
      showPage("home");
      return false;
    };

    document.getElementById("quoteForm").onsubmit = function (event) {
      event.preventDefault();

      var name = document.getElementById("quoteName").value;

      alert(
        "Thank you, " + name +
        ". Your personalised wedding quote request has been captured. We will connect this form to your live system next."
      );

      this.reset();
      closeModal("quoteModal");
      showPage("home");
      return false;
    };
  }

  addListeners();
  showPage("home");
})();
