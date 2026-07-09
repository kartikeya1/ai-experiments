# 🧪 AI Experiments

A portfolio of AI-assisted product experiments, served as a single Vercel site. The home page is a
directory of experiments; each card opens a self-contained, offline-friendly web app at its own
route.

<br>

## Projects

| Route | Experiment | What it is |
|-------|-----------|------------|
| [ResumeForge ↗](https://resume-forge-kartikeya-thapliyals-projects.vercel.app) | **ResumeForge** | A resume builder with a live pageless preview, deterministic ATS scoring, and job-description keyword matching. Exports clean PDF/DOCX. (Deployed separately.) |
| [`/voyage-evolution`](voyage-evolution/) | **Aurora Voyage → Voyagr** | A case-study showcase of one itinerary studio built twice, embedding both live apps (v1 and v2). |
| [`/sign-bridge`](sign-bridge/) | **Sign Bridge** | Turns typed English into a step-by-step sign-language sequence (ASL / ISL) with a player. |

<br>

## ResumeForge — resume builder with live ATS scoring

A web app for building or importing a resume with a live, pageless black-and-white preview. Paste a
job description and it extracts keywords, shows present/missing coverage, and computes an ATS score
plus a JD-match score — all with a deterministic, explainable feedback engine (no AI required). It
also flags weak bullets, tracks multiple resume versions, and exports design-preserving PDF and DOCX.
Unlike the other experiments here, ResumeForge is a Next.js app **deployed separately** on Vercel, so
its card links out to the live site:
[resume-forge.vercel.app ↗](https://resume-forge-kartikeya-thapliyals-projects.vercel.app).

<br>

## Aurora Voyage → Voyagr — the evolution of an itinerary studio

A single deployment that showcases one product built **twice**: how **Aurora Voyage (v1)** became
**Voyagr (v2)** through iteration. The landing page tells the evolution story, compares both builds
side by side, embeds both real apps live, and gives a full tour of every v2 feature. It is itself a
mini-showcase with its own internal routes.

**Internal routes**

| Path | Serves |
|------|--------|
| [`/voyage-evolution/`](voyage-evolution/) | Evolution showcase (case study) |
| [`/voyage-evolution/v1/`](voyage-evolution/v1/) | Aurora Voyage — the original build (HTML + CSS + JS, Leaflet map) |
| [`/voyage-evolution/v2/`](voyage-evolution/v2/) | Voyagr — the final build (single self-contained file) |

**The evolution, in one line**

| | **v1 · Aurora Voyage** | **v2 · Voyagr** |
|---|---|---|
| Architecture | Three files (HTML/CSS/JS) | One self-contained file |
| Identity | Light-first studio UI | Dark editorial + gold accent |
| Scope | Multi-trip management | Focused single-trip depth |
| Map | Leaflet + OpenStreetMap (CDN) | Offline location listing |
| New in v2 | — | Packing list · Trip stats · Conflict detection |

Both apps are 100% frontend-only and offline-friendly. Deeper documentation is preserved inside the
folder: the showcase's own [`voyage-evolution/README.md`](voyage-evolution/README.md), plus
per-version **user guides** and **save-file schemas**
([`v1/USER_GUIDE.md`](voyage-evolution/v1/USER_GUIDE.md),
[`v1/SAVE_FILE_SCHEMA.md`](voyage-evolution/v1/SAVE_FILE_SCHEMA.md),
[`v2/USER_GUIDE.md`](voyage-evolution/v2/USER_GUIDE.md),
[`v2/SAVE_FILE_SCHEMA.md`](voyage-evolution/v2/SAVE_FILE_SCHEMA.md)) and sample save files under each
version's `Sample Save Files/`.

<br>

## Sign Bridge — text to sign language

A web app that turns typed English text into a step-by-step sign-language sequence, rendered as
schematic SVG hand shapes with a built-in player. It supports **ASL** (American Sign Language) and
**ISL** (Indian Sign Language). No build tools, no frameworks — plain HTML, CSS, and vanilla JS.

**How it works**
- Type some text and hit **Convert**.
- Each word is matched against a word dictionary; when a word isn't found, the app **falls back to
  fingerspelling** it letter by letter.
- Letters and digits are drawn as schematic SVG hand shapes with a human-readable description of the
  hand position.
- The **player** steps through the sequence with play/pause, previous/next, a repeat toggle, and an
  adjustable playback **speed**.
- Toggle between **ASL** and **ISL** at any time; the alphabet grid and descriptions update to match.

**Notes & limitations**
- Hand shapes are **schematic** approximations meant to communicate the shape, not anatomically
  exact renderings.
- Digits 0 and 6–9 ship a clean numeral-card fallback rather than a generated hand shape.
- Coverage depends on the word dictionary in `sign-bridge/data/sign-data.js`; anything not in it is
  fingerspelled.

<br>

## Architecture

```
ai-experiments/
├── index.html                          # Generic home shell (loads config + renderer)
├── config/
│   ├── site.js                         # window.SITE — page title, tagline, emoji, accent
│   └── projects.js                     # window.PROJECTS — THE registry (single source of truth)
├── assets/
│   ├── home.css                        # Shared card-grid styling (dark, responsive)
│   └── home.js                         # Renders cards from window.PROJECTS
├── voyage-evolution/                   # Route: /voyage-evolution (nested showcase with /v1, /v2)
│   ├── index.html · README.md
│   ├── v1/  (index.html, app.js, styles.css, USER_GUIDE.md, SAVE_FILE_SCHEMA.md, Sample Save Files/)
│   └── v2/  (index.html, USER_GUIDE.md, SAVE_FILE_SCHEMA.md, Sample Save Files/)
├── sign-bridge/                        # Route: /sign-bridge
│   ├── index.html · styles.css · app.js
│   └── data/sign-data.js               # ASL & ISL hand-shape generators + word dictionary
├── vercel.json
└── README.md
```

**How routing works.** Each experiment is a top-level folder served natively by Vercel at
`/<folder>` — clean routes, deep links, and refresh with **no rewrite rules**. `voyage-evolution`
keeps its own internal `v1/`, `v2/` structure; because all asset references are **relative**, the
nested routes (`/voyage-evolution/v1/`) resolve their `app.js`/`styles.css` correctly. The home page
renders from `config/projects.js`.

<br>

## Development

No build step. Serve the folder with any static server:

```bash
npx serve .
# or
python3 -m http.server 8000
# home:      http://localhost:8000/
# voyage:    http://localhost:8000/voyage-evolution/   (and /v1/, /v2/)
# signbridge: http://localhost:8000/sign-bridge/
```

<br>

## Adding a future experiment

Two steps, one config edit:

1. **Drop the folder** at the repo root, e.g. `my-experiment/index.html` (relative asset paths).
2. **Add one entry** to `config/projects.js`:

   ```js
   { slug: "my-experiment", title: "My Experiment", tagline: "One-line description.", tags: ["AI"] }
   ```

`slug` must equal the folder name (it becomes the route). The home page updates automatically — no
changes to `index.html`, `home.js`, or `vercel.json`.

<br>

## Deployment (Vercel)

Zero-config static site: push to GitHub, import in Vercel (preset **Other**, no build, output =
root), deploy. `vercel.json` keeps native filesystem routing and preserves Voyage's
`X-Content-Type-Options: nosniff` header (applied site-wide).

<br>

## Tech

Vanilla HTML / CSS / JavaScript. Voyage v1 uses Leaflet + OpenStreetMap via CDN; everything else is
self-contained. No build, no framework. See [`MIGRATION.md`](MIGRATION.md) for how this repo was
consolidated and validated.
