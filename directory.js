/*
 * Directory logic for index.html: search + filter over window.CONTESTS.
 * Small, dependency-free, and safe on file:// too.
 */
(function () {
  var list = document.getElementById("directory-list");
  var search = document.getElementById("dir-search");
  var typeSel = document.getElementById("dir-type");
  var genreSel = document.getElementById("dir-genre");
  if (!list || !search || !typeSel || !genreSel) return;

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  function cards(data) {
    return data.map(function (c) {
      var chips = ['<span class="badge free">' + esc(c.fee) + "</span>"];
      chips.push('<span class="badge">' + esc(c.type) + "</span>");
      c.genres.forEach(function (g) {
        chips.push('<span class="badge">' + esc(g) + "</span>");
      });
      var months = (c.windowMonths || []).map(function (m) {
        return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][m - 1];
      });
      var dl = c.windowMonths && c.windowMonths.length
        ? "Typically: " + months.join(", ") + " (verify exact dates)"
        : "Rolling / check current status";
      return (
        '<article class="card" data-id="' + esc(c.id) + '">' +
        "<h3>" + esc(c.name) + "</h3>" +
        '<div class="chips">' + chips.join("") + "</div>" +
        '<dl class="kv">' +
        "<dt>What you can win / earn</dt><dd>" + esc(c.prize) + "</dd>" +
        "<dt>Eligibility</dt><dd>" + esc(c.eligibility) + "</dd>" +
        "<dt>Length</dt><dd>" + esc(c.wordcount) + "</dd>" +
        "<dt>Deadlines</dt><dd>" + esc(dl) + "</dd>" +
        "<dt>Pay</dt><dd>" + esc(c.payNote) + "</dd>" +
        "<dt>Rights &amp; exclusivity</dt><dd>" + esc(c.rightsNote) + "</dd>" +
        "<dt>Why we list it</dt><dd>" + esc(c.notes) + "</dd>" +
        "<dt>Reviewed</dt><dd>" + esc(c.reviewed) + " &mdash; always re-check the site</dd>" +
        "</dl>" +
        '<p class="meta">Official page: <a href="' + esc(c.url) + '" target="_blank" rel="noopener noreferrer">verify rules, dates, and pay rates</a></p>' +
        "</article>"
      );
    });
  }

  function render() {
    var q = (search.value || "").trim().toLowerCase();
    var t = typeSel.value;
    var g = genreSel.value;
    var data = window.CONTESTS.filter(function (c) {
      if (t && c.type !== t) return false;
      if (g && !(c.genres || []).includes(g)) return false;
      if (q) {
        var blob = [c.name, c.prize, c.eligibility, c.notes, c.payNote, c.genres.join(" ")]
          .join(" ")
          .toLowerCase();
        if (blob.indexOf(q) === -1) return false;
      }
      return true;
    });
    document.getElementById("dir-count").textContent =
      data.length + " of " + window.CONTESTS.length + " entries shown";
    list.innerHTML = cards(data).join("") ||
      '<p class="notice">No entries match that filter. Try clearing the search or choosing another category.</p>';
  }

  var types = [];
  var genres = [];
  window.CONTESTS.forEach(function (c) {
    if (types.indexOf(c.type) < 0) types.push(c.type);
    (c.genres || []).forEach(function (g) {
      if (genres.indexOf(g) < 0) genres.push(g);
    });
  });
  typeSel.innerHTML =
    '<option value="">All types</option>' +
    types.map(function (t) { return '<option value="' + t + '">' + t + "</option>"; }).join("");
  genreSel.innerHTML =
    '<option value="">All genres</option>' +
    genres.map(function (g) { return '<option value="' + g + '">' + g + "</option>"; }).join("");

  search.addEventListener("input", render);
  typeSel.addEventListener("change", render);
  genreSel.addEventListener("change", render);
  render();
})();
