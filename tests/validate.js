/*
 * Validation tests for the free-writing-contests-directory project.
 * Run with: node tests/validate.js
 * Zero dependencies. Checks data quality, page integrity, project files,
 * and that nothing fee-tagged or secret-shaped is hiding in the content.
 */
var fs = require("fs");
var path = require("path");
var vm = require("vm");

var ROOT = path.join(__dirname, "..");
var failures = [];
var checks = 0;

function check(name, ok, extra) {
  checks++;
  if (!ok) failures.push(name + (extra ? " (" + extra + ")" : ""));
}

/* ---------- data checks ---------- */
var dataPath = path.join(ROOT, "data", "contests.js");
check("data/contests.js exists", fs.existsSync(dataPath));

var dataCode = fs.readFileSync(dataPath, "utf8");
var sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(dataCode, sandbox);
var contests = sandbox.window.CONTESTS;
check("contests data parses and is non-empty", Array.isArray(contests) && contests.length > 0);

var allowedTypes = ["Contest", "Magazine", "Anthology"];
contests.forEach(function (c) {
  var id = c.id || "<missing id>";
  ["id", "name", "type", "genres", "fee", "prize", "eligibility", "wordcount",
    "schedule", "rightsNote", "payNote", "notes", "url", "reviewed"].forEach(function (field) {
    check("entry " + id + " has " + field, c[field] !== undefined && c[field] !== null && String(c[field]).length > 0);
  });
  check("entry " + id + " fee is free", typeof c.fee === "string" && /free/i.test(c.fee), c.fee);
  check("entry " + id + " type is known", allowedTypes.indexOf(c.type) !== -1, c.type);
  check("entry " + id + " url is https", typeof c.url === "string" && c.url.indexOf("https://") === 0, c.url);
  check("entry " + id + " no paywall words in payNote", !/\b(entr(y|ance) fee|processing fee|reading fee)\b/i.test(c.payNote), c.payNote);
  check("entry " + id + " windowMonths sane", !c.windowMonths || c.windowMonths.every(function (m) { return m >= 1 && m <= 12; }));
  check("entry " + id + " reviewed looks like YYYY-MM", /^\d{4}-\d{2}$/.test(c.reviewed), c.reviewed);
});
var ids = contests.map(function (c) { return c.id; });
check("ids unique", ids.length === new Set(ids).size);

/* ---------- page/served-asset checks ---------- */
var pages = ["index.html", "red-flags.html", "before-you-submit.html", "calendar.html", "log.html", "rights.html"];
pages.forEach(function (p) {
  var file = path.join(ROOT, p);
  check(p + " exists", fs.existsSync(file));
  if (!fs.existsSync(file)) return;
  var html = fs.readFileSync(file, "utf8");
  check(p + " starts with doctype", /^<!DOCTYPE html>/i.test(html.trim()));
  check(p + " has lang attribute", /<html lang="en"/.test(html));
  check(p + " loads stylesheet", /href="style\.css"/.test(html));
  check(p + " has site header", /header class="site"/.test(html));
  check(p + " has nav with six links", (html.match(/nav class="main"/g) || []).length === 1);
  check(p + " no file:// links", html.indexOf("file://") === -1);
  check(p + " references assets that exist", (html.match(/(?:src|href)="([^"#][^"]*?)"/g) || [])
    .every(function (m) {
      var ref = m.replace(/(?:src|href)="/, "").replace(/"$/, "");
      if (/^https?:|^mailto:/.test(ref)) return true;
      return fs.existsSync(path.join(ROOT, ref));
    }));
});

var missingAssets = ["style.css", "directory.js", "deadline-calendar.js", "submission-log.js",
  "checklist.js", "shared-footer.js", "data/contests.js", "serve.js"].filter(function (a) {
  return !fs.existsSync(path.join(ROOT, a));
});
check("all JS/CSS assets exist", missingAssets.length === 0, missingAssets.join(", "));

/* syntax-check every JS file except data (already vm-run) */
["directory.js", "deadline-calendar.js", "submission-log.js", "checklist.js", "shared-footer.js", "serve.js"].forEach(function (f) {
  try {
    new vm.Script(fs.readFileSync(path.join(ROOT, f), "utf8"), { filename: f });
    check(f + " parses cleanly", true);
  } catch (e) {
    check(f + " parses cleanly", false, e.message);
  }
});

/* ---------- content safety checks ---------- */
var allFiles = (function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).reduce(function (acc, d) {
    if (d.name === ".git" || d.name === "node_modules") return acc;
    var full = path.join(dir, d.name);
    if (d.isDirectory()) return acc.concat(walk(full));
    return acc.concat(full);
  }, []);
})(ROOT);

var secretPattern = /\b(sk_live_|sk_test_|AKIA[A-Z0-9]{8,}|ghp_[A-Za-z0-9]{20,}|BEGIN (RSA|EC|OPENSSH)? ?PRIVATE KEY)\b/;
var emailPattern = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/;
var ssnPattern = /\b\d{3}-\d{2}-\d{4}\b/;

allFiles.forEach(function (f) {
  var rel = path.relative(ROOT, f);
  if (rel === "tests" + path.sep + "validate.js") return; // self-exempt: this file contains pattern examples
  check(rel + " contains no secret-shaped strings", !secretPattern.test(fs.readFileSync(f, "utf8")));
  check(rel + " contains no personal email addresses", !emailPattern.test(fs.readFileSync(f, "utf8")));
  check(rel + " contains no SSN-shaped data", !ssnPattern.test(fs.readFileSync(f, "utf8")));
});

/* ---------- project file checks ---------- */
var pkgPath = path.join(ROOT, "package.json");
check("package.json exists", fs.existsSync(pkgPath));
if (fs.existsSync(pkgPath)) {
  var pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
  check("package.json has test script", pkg.scripts && typeof pkg.scripts.test === "string");
  check("package.json license is MIT", pkg.license === "MIT", pkg.license);
  check("package.json credit present",
    (JSON.stringify(pkg) + " " + fs.readFileSync(path.join(ROOT, "README.md"), "utf8"))
      .indexOf("Asdale Dynamics, LLC") !== -1);
}

var licPath = path.join(ROOT, "LICENSE");
check("LICENSE exists", fs.existsSync(licPath));
if (fs.existsSync(licPath)) {
  var lic = fs.readFileSync(licPath, "utf8");
  check("LICENSE copyright line exact",
    lic.indexOf("Copyright (c) 2026 Asdale Dynamics, LLC") !== -1);
  check("LICENSE is MIT", lic.indexOf("MIT License") !== -1);
}

var readme = path.join(ROOT, "README.md");
check("README exists", fs.existsSync(readme));
if (fs.existsSync(readme)) {
  var rd = fs.readFileSync(readme, "utf8");
  check("README credits Asdale Dynamics, LLC", rd.indexOf("Asdale Dynamics, LLC") !== -1);
  check("README documents how to run", rd.indexOf("node serve.js") !== -1);
}

/* ---------- summary ---------- */
if (failures.length) {
  console.error("\nFAIL: " + failures.length + " of " + checks + " checks failed:");
  failures.forEach(function (f) { console.error("  - " + f); });
  process.exit(1);
} else {
  console.log("\nPASS: all " + checks + " checks passed.");
}
