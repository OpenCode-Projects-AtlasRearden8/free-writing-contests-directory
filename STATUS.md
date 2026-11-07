# STATUS.md — free-writing-contests-directory

Project state: **complete and verified** (as of 2026-11-07).

## What was built

"The Free Entry Desk" — a curated, education-only directory of free-to-enter writing
contests, open anthologies, and free-to-submit paying magazines, for new authors.
Static site, zero dependencies, works offline, no signups, no tracking, nothing published.

- `index.html` — the directory: 13 curated fee-free entries (contests + pro magazines) with
  fee badges, eligibility, length limits, typical deadline windows, pay rates, rights notes,
  reviewed-month, and an "official site" link on every card; searchable and filterable, with
  pointers to where to find more free options (Submission Grinder, Ralan, Horror Tree, etc).
- `red-flags.html` — fee traps and rights grabs in plain English: disguised reading fees,
  "processing fee for finalists", certificate-and-print-run vanity models, rights-transfer
  clauses, perpetual-license red alerts, AI-training clauses, plus green flags for safer venues.
- `before-you-submit.html` — 16 pre-submission questions as a persistent local checklist.
- `calendar.html` — deadline calendar: month-level typical windows for the curated contests
  (explicitly marked "verify exact dates") plus user-added personal deadlines (local only).
- `log.html` — private submission log sheet: add entries, edit status, any fee > 0 gets a
  warning badge (free-entry norm), export JSON/CSV, import JSON backup, stored in localStorage.
- `rights.html` — rights and exclusivity in plain English: FASIP, one-time, all rights,
  who the clause-companies named *all* and *perpetual* are for, exclusivity windows with
  end dates, template of a reasonable clause, contract-question checklist.
- `data/contests.js` — the curated data file (data contract enforced by tests).
- `serve.js` — zero-dependency static server (`node serve.js [port]`).
- `tests/validate.js` — 382 zero-dependency checks.
- `README.md`, `LICENSE` (MIT, Copyright (c) 2026 Asdale Dynamics, LLC), `.gitignore`, `package.json`.

## How to run

```bash
node serve.js            # http://localhost:8080  (or: node serve.js 1234)
```

Nothing to install. Any static server works, or open `index.html` directly from disk —
all interactive features run in-browser via localStorage. Tests: `node tests/validate.js`.

## Verification results

- `node tests/validate.js` — **PASS: all 382 checks passed**
  (data contract: every entry free/https/well-formed; page integrity: doctype, lang, nav,
  all referenced local assets exist; JS syntax vm-checked; secret-pattern and
  personal-data scans across the repo).
- `node serve.js` verified with curl: all 8 static assets return HTTP 200 and valid HTML.
- One issue found and fixed during verification: the test suite flagged its own
  pattern-definition text as a "secret-shaped string"; resolved by exempting the test file
  from the pattern scan (self-exempt comment in `tests/validate.js`).

## Known gaps and honest limits

- **Accuracy is time-boxed, not guaranteed.** Contest rules, deadlines, and pay rates change
  constantly; all 13 entries carry a review month (2026-11) with instructions to verify at the
  official source. A strong "dates are *typical*, not exact" disclaimer appears on the calendar
  and directory pages.
- **Small curated list.** Deliberately limited to high-confidence, well-established free options
  rather than volume; the "where to find more" section covers discovery. Adding seasonal entries
  (e.g. one-off anthology calls) would need a per-entry review workflow.
- **No automated live checking.** Tests validate structure, not whether each linked page is still
  up; there is no scheduled re-verification job.
- **Calendar is month-resolution** for curated contests — it reminds you to check official pages,
  it doesn't promise exact due dates. Personal deadlines are user-entered and precise.
- **Not legal advice.** Rights and red-flags pages are educational; the notice is on every page.
- **No dedicated mobile/UX test pass yet** beyond responsive CSS defaults; no screen-reader audit.
