/* deadline-calendar.js
 * Renders a deadline calendar page:
 *  1. Typical deadline windows for curated free contests (verify at source).
 *  2. Personal deadlines you add (stored in localStorage; never sent anywhere).
 */
(function () {
  var listEl = document.getElementById("calendar-list");
  var addForm = document.getElementById("add-event-form");
  var clearBtn = document.getElementById("clear-events");
  if (!listEl) return;

  var MONTHS = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  var KEY = "fwcd.custom-events.v1";

  function loadEvents() {
    try {
      var raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) { return []; }
  }
  function saveEvents(events) {
    try { localStorage.setItem(KEY, JSON.stringify(events)); } catch (e) { /* private mode */ }
  }

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  /* Build "upcoming occurrences" — a simple month map of typical windows. */
  function typicalWindows() {
    var out = [];
    window.CONTESTS.forEach(function (c) {
      (c.windowMonths || []).forEach(function (m) {
        out.push({ contest: c, month: m });
      });
    });
    return out;
  }

  function render() {
    var events = loadEvents().sort(function (a, b) {
      return (a.date || "9999") < (b.date || "9999") ? -1 : 1;
    });

    var html = "";

    // Custom events first (dates you control)
    html += "<h2>Your personal deadlines</h2>";
    if (events.length) {
      html += '<table><thead><tr><th>Date</th><th>What</th><th>Venue / notes</th><th></th></tr></thead><tbody>';
      events.forEach(function (e, i) {
        html += "<tr><td>" + esc(e.date) + "</td><td>" + esc(e.title) +
          "</td><td>" + esc(e.notes || "") + "</td><td>" +
          '<button class="btn danger" data-del="' + i + '">Remove</button></td></tr>';
      });
      html += "</tbody></table>";
    } else {
      html += '<p class="notice">No personal deadlines yet. Use the form below to add one &mdash; ' +
        "for example, the closing date printed on a contest page you are entering this month.</p>";
    }

    // Recurring windows from the curated data
    html += "<h2>Typical annual windows (curated free contests)</h2>";
    html += '<p class="notice">Months only. These are <strong>typical</strong> windows from the ' +
      'entries above &mdash; contests move dates or skip years, so treat each month below as a ' +
      "reminder to <strong>check the official page</strong>, not as an exact due date.</p>";

    var byMonth = {};
    typicalWindows().forEach(function (w) {
      (byMonth[w.month] = byMonth[w.month] || []).push(w.contest);
    });
    MONTHS.forEach(function (mname, i) {
      var m = i + 1;
      if (!byMonth[m]) return;
      html += "<h3>" + mname + "</h3><ul>";
      byMonth[m].forEach(function (c) {
        html += "<li><strong>" + esc(c.name) + "</strong> (" + esc(c.type) + ") &mdash; " + esc(c.schedule) +
          ' &mdash; <a href="' + esc(c.url) + '" target="_blank" rel="noopener noreferrer">check current dates</a></li>';
      });
      html += "</ul>";
    });
    var rolling = window.CONTESTS.filter(function (c) { return !(c.windowMonths || []).length; });
    html += "<h3>No fixed season (rolling markets)</h3><ul>";
    rolling.forEach(function (c) {
      html += "<li><strong>" + esc(c.name) + "</strong> &mdash; " + esc(c.schedule) +
        ' &mdash; <a href="' + esc(c.url) + '" target="_blank" rel="noopener noreferrer">check open status</a></li>';
    });
    html += "</ul>";

    listEl.innerHTML = html;

    listEl.querySelectorAll("[data-del]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var events = loadEvents();
        events.splice(Number(btn.getAttribute("data-del")), 1);
        saveEvents(events);
        render();
      });
    });
  }

  if (addForm) {
    addForm.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var title = document.getElementById("ev-title");
      var date = document.getElementById("ev-date");
      var notes = document.getElementById("ev-notes");
      var events = loadEvents();
      events.push({ title: title.value.trim(), date: date.value, notes: notes.value.trim() });
      saveEvents(events);
      title.value = ""; date.value = ""; notes.value = "";
      render();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener("click", function () {
      saveEvents([]);
      render();
    });
  }

  render();
})();
