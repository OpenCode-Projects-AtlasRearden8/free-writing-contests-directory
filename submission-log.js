/* submission-log.js
 * Plain, local-only submission log sheet.
 * Everything lives in localStorage. No uploads, no accounts. Export/import as JSON, export CSV.
 */
(function () {
  var tableBody = document.getElementById("log-body");
  var form = document.getElementById("log-form");
  var exportJsonBtn = document.getElementById("export-json");
  var exportCsvBtn = document.getElementById("export-csv");
  var importInput = document.getElementById("import-json");
  var clearBtn = document.getElementById("clear-log");
  if (!tableBody || !form) return;

  var KEY = "fwcd.sub-log.v1";
  var STATUSES = ["Submitted", "Awaiting", "Personal response", "Form rejection",
    "Declined", "Accepted", "Withdrawn"];

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) { return []; }
  }
  function save(entries) {
    try { localStorage.setItem(KEY, JSON.stringify(entries)); } catch (e) { /* private mode */ }
  }

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  function csvCell(v) {
    v = String(v == null ? "" : v);
    return '"' + v.replace(/"/g, '""') + '"';
  }

  var FIELDS = ["date", "title", "venue", "words", "type", "status", "responseDate", "fee", "notes"];

  function render() {
    var entries = load().sort(function (a, b) {
      return (b.date || "").localeCompare(a.date || "");
    });
    document.getElementById("log-count").textContent = entries.length + " submission" + (entries.length === 1 ? "" : "s");
    if (!entries.length) {
      tableBody.innerHTML = '<tr><td colspan="9">Nothing logged yet. Add your first submission with the form above.</td></tr>';
      return;
    }
    tableBody.innerHTML = entries.map(function (e, i) {
      var statusOpts = STATUSES.map(function (s) {
        return '<option value="' + s + '"' + (s === e.status ? " selected" : "") + ">" + s + "</option>";
      }).join("");
      var feeWarn = "";
      if (e.fee && Number(e.fee) > 0) {
        feeWarn = ' <span class="badge warn">fee paid: ' + esc(e.fee) + '</span>';
      }
      var statusClass = e.status === "Accepted" ? "free" : (e.status === "Declined" ? "warn" : "");
      return "<tr><td>" + esc(e.date) + "</td><td><strong>" + esc(e.title) + "</strong></td><td>" + esc(e.venue) +
        "</td><td>" + esc(e.words) + "</td><td>" + esc(e.type) +
        "</td><td><select data-status='" + i + "'>" + statusOpts + "</select>" +
        (statusClass ? ' <span class="badge ' + statusClass + '">' + esc(e.status) + "</span>" : "") +
        "</td><td>" + esc(e.responseDate) + "</td><td>" + (e.fee ? esc(e.fee) : "$0") + feeWarn +
        "</td><td>" + esc(e.notes) + " <button class=\"btn danger\" data-del=\"" + i + '">Delete</button></td></tr>';
    }).join("");

    tableBody.querySelectorAll("[data-status]").forEach(function (sel) {
      sel.addEventListener("change", function () {
        var entries = load();
        entries[Number(sel.getAttribute("data-status"))].status = sel.value;
        save(entries);
        render();
      });
    });
    tableBody.querySelectorAll("[data-del]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var entries = load();
        entries.splice(Number(btn.getAttribute("data-del")), 1);
        save(entries);
        render();
      });
    });
  }

  form.addEventListener("submit", function (ev) {
    ev.preventDefault();
    var entry = {};
    FIELDS.forEach(function (f) {
      entry[f] = document.getElementById("log-" + f).value.trim();
    });
    if (!entry.title) return;
    var entries = load();
    entries.push(entry);
    save(entries);
    form.reset();
    document.getElementById("log-fee").value = "0";
    render();
  });

  if (exportJsonBtn) exportJsonBtn.addEventListener("click", function () {
    var blob = new Blob([JSON.stringify(load(), null, 2)], { type: "application/json" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "submission-log.json";
    a.click();
    URL.revokeObjectURL(a.href);
  });

  if (exportCsvBtn) exportCsvBtn.addEventListener("click", function () {
    var entries = load();
    var rows = [FIELDS.map(csvCell).join(",")].concat(
      entries.map(function (e) { return FIELDS.map(function (f) { return csvCell(e[f]); }).join(","); })
    );
    var blob = new Blob([rows.join("\n")], { type: "text/csv" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "submission-log.csv";
    a.click();
    URL.revokeObjectURL(a.href);
  });

  if (importInput) importInput.addEventListener("change", function () {
    var file = importInput.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function () {
      try {
        var data = JSON.parse(reader.result);
        if (!Array.isArray(data)) throw new Error("not an array");
        var entries = load().concat(data);
        save(entries);
        render();
      } catch (e) {
        window.alert("That file did not look like a valid submission-log.json export. Nothing was changed.");
      }
    };
    reader.readAsText(file);
  });

  if (clearBtn) clearBtn.addEventListener("click", function () {
    if (window.confirm("Delete every log entry on this device? This cannot be undone.")) {
      save([]);
      render();
    }
  });

  render();
})();
