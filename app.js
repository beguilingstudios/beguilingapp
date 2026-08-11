(function () {
  "use strict";

  var data = {
    bookings: [
      {id:1, customer:"Sarah Johnson", service:"Wedding Package", date:"2026-08-12", time:"10:00", amount:4500, status:"Confirmed"},
      {id:2, customer:"Daniel Smith", service:"Studio Session", date:"2026-08-13", time:"14:30", amount:1800, status:"Pending"},
      {id:3, customer:"Lerato Mokoena", service:"Corporate Event", date:"2026-08-15", time:"09:00", amount:6200, status:"Confirmed"}
    ],
    customers: [
      {id:1, name:"Sarah Johnson", email:"sarah@example.com", phone:"082 555 0101"},
      {id:2, name:"Daniel Smith", email:"daniel@example.com", phone:"083 555 0102"},
      {id:3, name:"Lerato Mokoena", email:"lerato@example.com", phone:"084 555 0103"}
    ],
    invoices: [
      {id:1, number:"INV-1001", customer:"Sarah Johnson", amount:4500, status:"Paid"},
      {id:2, number:"INV-1002", customer:"Daniel Smith", amount:1800, status:"Unpaid"},
      {id:3, number:"INV-1003", customer:"Lerato Mokoena", amount:6200, status:"Unpaid"}
    ],
    services: [
      {id:1, name:"Wedding Package", price:4500},
      {id:2, name:"Studio Session", price:1800},
      {id:3, name:"Corporate Event", price:6200}
    ]
  };

  function money(n) {
    n = Number(n || 0);
    return "R " + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  function safe(v) {
    var d = document.createElement("div");
    d.appendChild(document.createTextNode(v == null ? "" : String(v)));
    return d.innerHTML;
  }

  function prettyDate(v) {
    var p;
    if (!v) return "";
    p = v.split("-");
    if (p.length !== 3) return v;
    return p[2] + "/" + p[1] + "/" + p[0];
  }

  function bookingHTML(b) {
    return '<div class="card"><div class="card-left">' +
      '<div class="card-title">' + safe(b.customer) + '</div>' +
      '<div class="card-sub">' + safe(b.service) + '</div>' +
      '<div class="card-meta">' + safe(prettyDate(b.date)) + ' - ' + safe(b.time) + '</div>' +
      '</div><div class="card-right"><div class="amount">' + safe(money(b.amount)) + '</div>' +
      '<span class="badge">' + safe(b.status) + '</span></div></div>';
  }

  function customerHTML(c) {
    return '<div class="card"><div class="card-title">' + safe(c.name) + '</div>' +
      '<div class="card-sub">' + safe(c.email || "No email") + '</div>' +
      '<div class="card-meta">' + safe(c.phone || "No phone") + '</div></div>';
  }

  function invoiceHTML(i) {
    return '<div class="card"><div class="card-left"><div class="card-title">' + safe(i.number) + '</div>' +
      '<div class="card-sub">' + safe(i.customer) + '</div></div>' +
      '<div class="card-right"><div class="amount">' + safe(money(i.amount)) + '</div>' +
      '<span class="badge ' + safe(String(i.status).toLowerCase()) + '">' + safe(i.status) + '</span></div></div>';
  }

  function serviceHTML(s) {
    return '<div class="card"><div class="card-left"><div class="card-title">' + safe(s.name) + '</div></div>' +
      '<div class="card-right"><div class="amount">' + safe(money(s.price)) + '</div></div></div>';
  }

  function list(id, arr, fn) {
    var e = document.getElementById(id), html = "", i;
    for (i = 0; i < arr.length; i++) html += fn(arr[i]);
    e.innerHTML = html || '<div class="panel">Nothing here yet.</div>';
  }

  function render() {
    var outstanding = 0, i, opts = '<option value="">Choose a service</option>';

    document.getElementById("bookingCount").innerHTML = data.bookings.length;
    document.getElementById("invoiceCount").innerHTML = data.invoices.length;

    for (i = 0; i < data.invoices.length; i++) {
      if (data.invoices[i].status !== "Paid") outstanding += Number(data.invoices[i].amount || 0);
    }
    document.getElementById("outstandingTotal").innerHTML = money(outstanding);

    list("homeBookings", data.bookings, bookingHTML);
    list("bookingsList", data.bookings, bookingHTML);
    list("customersList", data.customers, customerHTML);
    list("invoicesList", data.invoices, invoiceHTML);
    list("servicesList", data.services, serviceHTML);

    for (i = 0; i < data.services.length; i++) {
      opts += '<option value="' + safe(data.services[i].name) + '">' + safe(data.services[i].name) + '</option>';
    }
    document.getElementById("bookingService").innerHTML = opts;
  }

  function showPage(name) {
    var pages = document.getElementsByClassName("page");
    var navs = document.getElementsByClassName("nav");
    var i;
    for (i = 0; i < pages.length; i++) pages[i].className = "page";
    for (i = 0; i < navs.length; i++) navs[i].className = "nav";
    document.getElementById("page-" + name).className = "page active";
    for (i = 0; i < navs.length; i++) {
      if (navs[i].getAttribute("data-target") === name) navs[i].className = "nav active";
    }
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

  function nextId(arr) {
    var max = 0, i;
    for (i = 0; i < arr.length; i++) if (Number(arr[i].id) > max) max = Number(arr[i].id);
    return max + 1;
  }

  function addListeners() {
    var navs = document.getElementsByClassName("nav");
    var closes = document.getElementsByClassName("close");
    var i;

    for (i = 0; i < navs.length; i++) {
      navs[i].onclick = function () { showPage(this.getAttribute("data-target")); };
    }
    for (i = 0; i < closes.length; i++) {
      closes[i].onclick = function () { closeModal(this.getAttribute("data-modal")); };
    }

    document.getElementById("topNewBooking").onclick = function () { openModal("bookingModal"); };
    document.getElementById("pageNewBooking").onclick = function () { openModal("bookingModal"); };
    document.getElementById("pageNewCustomer").onclick = function () { openModal("customerModal"); };
    document.getElementById("pageNewInvoice").onclick = function () { openModal("invoiceModal"); };
    document.getElementById("shade").onclick = function () {
      closeModal("bookingModal"); closeModal("customerModal"); closeModal("invoiceModal");
    };

    document.getElementById("bookingForm").onsubmit = function (e) {
      e.preventDefault();
      data.bookings.push({
        id:nextId(data.bookings),
        customer:document.getElementById("bookingCustomer").value,
        service:document.getElementById("bookingService").value,
        date:document.getElementById("bookingDate").value,
        time:document.getElementById("bookingTime").value,
        amount:Number(document.getElementById("bookingAmount").value || 0),
        status:document.getElementById("bookingStatus").value
      });
      this.reset(); closeModal("bookingModal"); render(); showPage("bookings");
      return false;
    };

    document.getElementById("customerForm").onsubmit = function (e) {
      e.preventDefault();
      data.customers.push({
        id:nextId(data.customers),
        name:document.getElementById("customerName").value,
        email:document.getElementById("customerEmail").value,
        phone:document.getElementById("customerPhone").value
      });
      this.reset(); closeModal("customerModal"); render(); showPage("customers");
      return false;
    };

    document.getElementById("invoiceForm").onsubmit = function (e) {
      e.preventDefault();
      data.invoices.push({
        id:nextId(data.invoices),
        customer:document.getElementById("invoiceCustomer").value,
        number:document.getElementById("invoiceNumber").value,
        amount:Number(document.getElementById("invoiceAmount").value || 0),
        status:document.getElementById("invoiceStatus").value
      });
      this.reset(); closeModal("invoiceModal"); render(); showPage("invoices");
      return false;
    };
  }

  render();
  addListeners();
})();
