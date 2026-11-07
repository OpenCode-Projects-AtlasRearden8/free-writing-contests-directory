# The Free Entry Desk — free writing contests, anthologies & markets

A curated, education-only directory of **free-to-enter** writing contests, open anthologies, and
free-to-submit paying magazines. Built so a new author can browse real opportunities in one calm place —
and learn to spot fee traps and rights grabs on their own.

Made by **Asdale Dynamics, LLC** (Dylan Asdale's AI-education company). Plain English, step by step, never condescending.

## What's inside

| Page | What it does |
|---|---|
| `index.html` | The directory: searchable, filterable list of fee-free contests and markets, with pay rates, eligibility, windows, and rights notes on every card, each linked to the official site. |
| `red-flags.html` | Fee-trap and rights-grab warning signs in plain English (and the green flags that mean safer). |
| `before-you-submit.html` | Sixteen questions to check before submitting, as a persistent local checklist. |
| `calendar.html` | Deadline calendar: typical seasonal windows for curated contests plus your own personal deadlines. |
| `log.html` | A private submission log sheet: what, where, fees ($0 target), response dates, statuses, with JSON/CSV export. |
| `rights.html` | Plain-English notes on rights and exclusivity: first rights, one-time rights, "all rights", reprints, and the AI-era clauses to watch for. |

## How to run

Nothing to install — zero dependencies.

```bash
# from this folder
node serve.js            # then open http://localhost:8080
# or any other static server, e.g.:
python3 -m http.server 8080
```

You can also just open `index.html` directly in a browser — it works offline, and every feature
(the directory filters, checklist, calendar, and log) uses your browser's local storage. No account,
no signups, no tracking, no network calls after load.

## Tests

```bash
node tests/validate.js   # or: npm test
```

The suite checks the curated data (free fee fields, https links, sane dates), page integrity,
syntax of every script, and that no secret-shaped strings or personal data are committed.

## The honesty notes

- **Verify everything.** Contest rules, deadlines, and pay rates change. Every card shows its review
  month and links the official page; treat the directory as a starting point, never as permission to
  skip the rules.
- **Free entry is the floor, not the promise of quality.** Free-to-submit professional markets that
  pay per word are the norm in the well-run corner of this industry, and that is what the magazine
  section reflects.
- **Education only.** Nothing here is legal, financial, or submission advice for your specific contract.
- Unlike the related *submission-tracker-mcp-server* (a tracking tool) and *arc-review-tracker-webapp*
  (advance review-copy management), this project is a read-and-learn directory: no data goes anywhere.

## Privacy

All personal features (checklists, calendar events, the submission log) store data **only** in your
browser's local storage, on your own device. Export is always available as JSON or CSV.

## License

MIT — see `LICENSE` (Copyright (c) 2026 Asdale Dynamics, LLC). Credit: built by Asdale Dynamics, LLC.
