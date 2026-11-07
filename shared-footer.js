/* Shared footer for every page. Injected because each page includes this file. */
(function () {
  var f = document.createElement("footer");
  f.className = "site";
  f.innerHTML =
    "A free community education project by <strong>Asdale Dynamics, LLC</strong> &middot; " +
    "MIT licensed &middot; Works offline &middot; No signup, no tracking, no fees.<br>" +
    "This directory is information, not legal or financial advice. Rules change &mdash; verify every " +
    "contest at its official site before you submit.";
  document.body.appendChild(f);
})();
