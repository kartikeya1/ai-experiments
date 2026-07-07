# Aurora Voyage → Voyagr — The Evolution of an Itinerary Studio

A single deployment that showcases one product built **twice**: how **Aurora Voyage (v1)** became **Voyagr (v2)** through iteration. The landing page tells the evolution story, compares both builds side by side, embeds both real apps live, and gives a full tour of every v2 feature.

**✦ Brewed with love by KT using Cursor**

---

## What's inside

```
voyage-evolution/
├── index.html          # The showcase / case-study landing page
├── v1/                 # Aurora Voyage — the original build (HTML + CSS + JS)
│   └── index.html
├── v2/                 # Voyagr — the final build (single self-contained file)
│   └── index.html      # (a copy of voyagr.html, served as the folder index)
├── vercel.json         # Static hosting + clean-URL routing
└── README.md
```

Both apps are **100% frontend-only and offline-friendly** — no backend, no build step. The showcase page is a single static HTML file in the same design language as v2 (dark editorial theme, Cormorant Garamond, gold accent).

## The evolution, in one line

| | **v1 · Aurora Voyage** | **v2 · Voyagr** |
|---|---|---|
| Architecture | Three files (HTML/CSS/JS) | One self-contained file |
| Identity | Light-first studio UI | Dark editorial + gold accent |
| Scope | Multi-trip management | Focused single-trip depth |
| Map | Leaflet + OpenStreetMap (CDN) | Offline location listing |
| New in v2 | — | Packing list · Trip stats · Conflict detection |

## Run locally

No build step. Serve the folder with any static server:

```bash
npx serve .
# or
python3 -m http.server 8000
```

Then open `http://localhost:8000` for the showcase, `/v1` for Aurora Voyage, `/v2` for Voyagr.

## Deploy to Vercel

This is a zero-config static site.

```bash
# from this directory
vercel          # preview deployment
vercel --prod   # production
```

Or import the GitHub repo at [vercel.com/new](https://vercel.com/new) — no framework preset needed, output is the repo root.

## Routes

| Path | Serves |
|------|--------|
| `/`   | Evolution showcase (this project) |
| `/v1` | Aurora Voyage (original) |
| `/v2` | Voyagr (final) |
