# Migration Record - ai-experiments

## Summary

`ai-experiments` consolidates two standalone repos into one Vercel site with a config-driven home
page and per-experiment routes.

| Source repo | Original commits | Now at route |
|---|---|---|
| `kartikeya1/voyage-evolution` | `e09eaed` (fix v1 assets 404), `1074688` (drop dev files), `a6e670f` (Voyage evolution showcase) | `/voyage-evolution` (nested `/v1`, `/v2`) |
| `kartikeya1/sign-bridge` | `a30f3d9` (Add README), `b018229` (Initial commit) | `/sign-bridge` |

**Approach:** the entire `voyage-evolution` folder (showcase `index.html` + `v1/` + `v2/` + all
docs + sample save files) and all `sign-bridge` files were copied **byte-for-byte** (verified via
recursive `diff`). A shared config-driven home framework was added. Fresh git history; original
commit hashes recorded above.

**Not migrated:** voyage's own `vercel.json` and `.gitignore` (superseded by the parent repo's - the
`nosniff` header is preserved in the root `vercel.json`), `.vercel/`, `.claude/`, and the redundant
`v2/voyagr.html` duplicate of `v2/index.html`.

## Documentation mapping

| Original repo → section | New location |
|---|---|
| **voyage-evolution README** - full case-study README | `voyage-evolution/README.md` (**verbatim, preserved in place**) + summarized in top README |
| voyage README - evolution table (v1 vs v2) | top README → "the evolution, in one line" (verbatim) |
| voyage README - Routes table | top README → Internal routes |
| voyage - `v1/README.md`, `v1/USER_GUIDE.md`, `v1/SAVE_FILE_SCHEMA.md` | preserved verbatim in `voyage-evolution/v1/` (linked from top README) |
| voyage - `v2/USER_GUIDE.md`, `v2/SAVE_FILE_SCHEMA.md` | preserved verbatim in `voyage-evolution/v2/` (linked from top README) |
| voyage - Sample Save Files (v1 + v2) | preserved verbatim in each version's `Sample Save Files/` |
| **sign-bridge README** - How it works | top README → Sign Bridge → How it works |
| sign-bridge README - Running it | top README → Development |
| sign-bridge README - Deployment | top README → Deployment |
| sign-bridge README - Structure | top README → Architecture |
| sign-bridge README - Notes & limitations | top README → Sign Bridge → Notes & limitations |

**Nothing dropped.** Voyage's rich in-folder docs are preserved verbatim (not rewritten), and
linked from the top README. New material: shared Architecture + "Adding a future experiment" guide.

## Validation report

**Routes** (all served locally, HTTP 200):

| Route | Status | Notes |
|---|---|---|
| `/` | ✅ 200 | Home renders 2 cards from config; accent `#8b5cf6` |
| `/voyage-evolution/` | ✅ 200 | Showcase loads |
| `/voyage-evolution/v1/` | ✅ 200 | **Relative assets resolve** - `v1/app.js` + `v1/styles.css` load (the original "assets 404" concern is resolved by native directory serving); Leaflet from CDN |
| `/voyage-evolution/v2/` | ✅ 200 | Voyagr loads |
| `/sign-bridge/` | ✅ 200 | Loads ASL/ISL toggles + sample phrases |

| Check | Result |
|---|---|
| App files vs originals | ✅ recursive `diff` clean (excluding intentionally-removed config + `voyagr.html` dup) |
| sign-bridge convert | ✅ typing text + Convert renders SVG hand shapes (34 SVGs) and shows the player - `data/sign-data.js` loads |
| Nested-route assets | ✅ no failed requests under `/voyage-evolution/v1/` |
| Home cards config-driven | ✅ 2 cards, correct routes/chips |
| Console errors | ✅ none |
| Secrets committed | ✅ none |

## Manual steps for you

1. Import `ai-experiments` into Vercel (preset **Other**, no build, output = root).
2. Retire the old **voyage-evolution** and **sign-bridge** Vercel projects and archive those GitHub
   repos (commands in the top-level consolidation report).
