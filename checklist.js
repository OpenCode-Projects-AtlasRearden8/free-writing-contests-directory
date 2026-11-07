/* submission-checklist.js
 * "Questions to check before submitting" — a persistent, local-only checklist.
 * Each default item comes from the curated red-flags content in this project.
 */
(function () {
  var box = document.getElementById("checklist-box");
  if (!box) return;

  var KEY = "fwcd.checklist.v1";
  var ITEMS = [
    { id: "fee",        q: "Is entry genuinely free (no reading fee, no processing fee, no required membership)?" },
    { id: "official",   q: "Have I read the rules on the contest or magazine's official site, not a third-party summary?" },
    { id: "eligibility", q: "Do I qualify (age, residency, publication history, prior winners)?" },
    { id: "theme",      q: "Does my work match the current theme, category, or what the magazine actually publishes?" },
    { id: "length",     q: "Is my piece within their word-count or line-count limits?" },
    { id: "format",     q: "Does my manuscript follow their formatting and file-type rules?" },
    { id: "rights",     q: "Do I know exactly which rights they are asking for (see the Rights page), and am I comfortable with the exclusivity window?" },
    { id: "pay",        q: "Is there payment, publication, or some other concrete benefit that makes entering worthwhile?" },
    { id: "simsub",     q: "Are simultaneous submissions allowed, and do I know the rule for withdrawing on acceptance?" },
    { id: "reuse",      q: "Is my piece original/unpublished if required (or do they accept reprints)?" },
    { id: "response",   q: "Do they state a response time? Have I noted it in my submission log?" },
    { id: "deadline",   q: "Do I know the deadline including time zone, and have I added it to my calendar?" },
    { id: "judges",     q: "Can I see named judges, editors, or past winners? (Anonymous judges with no track record are a red flag.)" },
    { id: "no-purchase", q: "Did I double-check that '-winning' never requires me to buy anything, travel anywhere, or pay publication costs?" },
    { id: "contact",    q: "Do I have contact info for the organizer, and does the domain match the official organization?" },
    { id: "recheck",    q: "Final pass: re-read the rules page today. Rules and dates change more often than you think." }
  ];

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) { return {}; }
  }
  function save(state) {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* private mode */ }
  }

  function render() {
    var state = load();
    box.innerHTML = ITEMS.map(function (it) {
      var done = !!state[it.id];
      return '<li><label><input type="checkbox" data-ck="' + it.id + '"' + (done ? " checked" : "") + "> " +
        '<span class="check-item"><strong>' + it.q + "</strong></span></label></li>";
    }).join("");
    var total = ITEMS.filter(function (it) { return state[it.id]; }).length;
    document.getElementById("checklist-progress").textContent =
      total + " of " + ITEMS.length + " questions confirmed";
    box.querySelectorAll("[data-ck]").forEach(function (cb) {
      cb.addEventListener("change", function () {
        var s = load();
        s[cb.getAttribute("data-ck")] = cb.checked;
        save(s);
        render();
      });
    });
  }

  var reset = document.getElementById("checklist-reset");
  if (reset) reset.addEventListener("click", function () {
    save({});
    render();
  });

  render();
})();
