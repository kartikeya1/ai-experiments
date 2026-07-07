# Voyagr — User Guide

**Premium Travel Itinerary Design Platform**  
Version 1.0.0 · ✦ Brewed with love by KT using Cursor

---

## Table of Contents

1. [What is Voyagr?](#what-is-voyagr)
2. [Getting Started](#getting-started)
3. [Core Concepts](#core-concepts)
4. [Creating a Trip](#creating-a-trip)
5. [Working with Sections](#working-with-sections)
6. [Working with Items](#working-with-items)
7. [Planning Modes](#planning-modes)
8. [Alternative Options](#alternative-options)
9. [Packing List](#packing-list)
10. [Map View](#map-view)
11. [Trip Stats](#trip-stats)
12. [Saving & Loading](#saving--loading)
13. [Exporting for Clients](#exporting-for-clients)
14. [Keyboard Shortcuts](#keyboard-shortcuts)
15. [AI Mode](#ai-mode)
16. [Tips for Professionals](#tips-for-professionals)

---

## What is Voyagr?

Voyagr is a **travel itinerary design tool** for professional itinerary creators and serious travelers. It is not a booking engine, recommendation platform, or travel research tool.

**Mental model:** Think of Voyagr as a creative canvas for organizing a travel plan — like a design tool, not a checklist app.

**Ideal workflow:**
1. Research your trip using Google Maps, travel blogs, booking sites
2. Open Voyagr and design the itinerary structure
3. Export a polished presentation for your client

---

## Getting Started

Voyagr is a single HTML file. Open it in any modern browser (Chrome, Firefox, Safari, Edge). No installation. No internet required after first load.

**Quick start options:**
- Click **Demo** to load a pre-built Italian trip itinerary and explore all features
- Click **+ Section** to start building your own trip

---

## Core Concepts

### Hierarchy

```
Trip
 └── Sections (cities, phases, any grouping)
       └── Items (activities, flights, stays, meals...)
```

- A **Trip** has a title, dates, destination, and notes.
- **Sections** are containers — use them for cities, days, travel phases, or whatever makes sense for your trip.
- **Items** are individual activities, stays, flights, restaurants, etc.

### Design Philosophy

- Items must belong to a section (no orphan items)
- Sections have no forced time semantics — you define what they mean
- Everything is inline-editable; minimize clicking into modals

---

## Creating a Trip

The **sidebar** on the left contains all trip-level fields:

| Field | Description |
|-------|-------------|
| Trip Name | Displayed prominently in canvas header |
| Start / End Date | Used for duration stats |
| Destination(s) | Free text, shown in header and exported PDF |
| Travelers | Count used in stats |
| Trip Notes | Overall notes — visible in presentation export |

Click any field and type to edit. Changes save to memory immediately.

---

## Working with Sections

### Add a Section
- Click **+ Section** in the canvas header, OR
- Click the **+** button in the sidebar header, OR
- Press `Ctrl/Cmd + Shift + S`

### Rename a Section
Click the section name and type directly — it updates inline.

### Reorder Sections
Grab the **⠿** drag handle on the left of the section header and drag up or down.

### Section Colors
Click any of the color dots in the section header to change the section's accent color.

### Section Notes
Click inside the section notes area (below the header) to add high-level section notes. These appear in the exported presentation.

### Duplicate a Section
Click the **⧉** button in the section header to create a copy below it, with all items duplicated.

### Delete a Section
Click the **✕** button. A confirmation dialog will appear.

### Collapse / Expand
Click anywhere on the section header (or the ▾ arrow) to collapse/expand the items list.

---

## Working with Items

### Add an Item
In the section's footer row, click any category button:
- ✈️ Flight · 🏨 Stay · 🚄 Train · 🚗 Transport · 🍽️ Restaurant · 🎯 Activity · 👁️ Sightseeing · 🏛️ Museum · 📝 Note · ⏸️ Buffer
- Click **+ More** to see all categories

### Item Fields

| Field | Description |
|-------|-------------|
| Title | Item name (supports emoji auto-detection) |
| Category | Controls emoji auto-assignment |
| Color Tag | Visual color coding |
| Date | Primary date (YYYY-MM-DD) |
| Multi-day End | For items spanning multiple days |
| Start / End Time | 24h time — enables conflict detection |
| Location | Free text — shown on map panel |
| Notes | Long-form freeform notes |
| Links | Add any number of reference URLs |

Click the item header to expand/collapse its fields.

### Edit Item Emoji
Click the emoji to the left of the item title to change it. A dialog will ask for a replacement emoji.

### Drag & Drop Items
Grab the **⠿** handle at the left of the item card and drag to reorder within the section.

### Move to Another Section
Click the **↕** button in the item header to move it to a different section.

### Duplicate an Item
Click the **⧉** button in the item header.

### Delete an Item
Click the **✕** button in the item header.

### Conflict Detection
If two items in the same section on the same date have overlapping times, a **⚠️** warning badge appears. The canvas header also shows a total conflict count.

---

## Planning Modes

Access modes via the toggle in the app header.

### Structured Mode
The primary planning mode. Items are displayed in a clean, organized card layout within their sections. Best for detailed day-by-day planning.

### Hybrid Mode
A more flexible arrangement suited to combining rigid timed activities with loose flexible blocks. Sections and items remain the same — the layout shifts to a slightly more fluid feel.

Switch modes at any time — your data is preserved.

---

## Alternative Options

Each item can have up to **3 alternatives** — backup or side-by-side comparison options.

**To add an alternative:**
1. Expand an item
2. Scroll to "Alternative Options" at the bottom
3. Click **+ Add Alternative**
4. Enter the title and notes

**To mark an alternative as active:**
Click "Set Active" on an alternative. This marks it as the selected option (shown with a green border and ✓). Only one alternative can be active at a time.

Alternatives appear in the exported presentation to show clients the thinking behind choices.

---

## Packing List

Click **🧳 Packing** in the canvas header to open the packing panel.

- Items are grouped by category
- Check items off as you pack them
- A progress bar shows completion
- Add new items with a category label and item name
- Packing list is saved with the trip file

---

## Map View

Click **🗺 Map** in the canvas header to open the map panel.

The map panel shows all items that have a **Location** filled in, listed in order. This provides a visual reference of all places in the itinerary.

> Note: The map view is a location listing, not a live map API integration. It works fully offline.

---

## Trip Stats

Click **📊 Stats** in the canvas header for a summary:
- Total sections, items, days, and locations
- Breakdown by category with progress bars
- Conflict count

---

## Saving & Loading

### Save (Download as JSON)
- Click **💾 Save** button (top right), OR
- Press `Ctrl/Cmd + S`

A `.json` file will download. This is your save file — keep it safe.

### Load (Open JSON)
- Click **📂 Open** button
- Select your `.json` save file
- The entire trip is restored exactly as you left it

### Duplicate Trip in Memory
- Click **⧉ Clone** in the header
- The trip is duplicated in the current session (title gets "(copy)" suffix)
- Save immediately to download the clone

### Unsaved Changes Protection
If you try to close the browser tab with unsaved changes, the browser will ask you to confirm. **Always save before closing.**

---

## Exporting for Clients

Click **📄 Export** (top right) to generate a clean HTML presentation file.

The exported file includes:
- A cover with trip name, dates, destination
- All sections with their notes
- All items with time, location, notes, and links
- Alternative options shown per item
- A print/PDF button in the bottom right corner

**To create a PDF:**
1. Open the exported HTML file in a browser
2. Click **🖨️ Print / Save as PDF**
3. In the print dialog, select "Save as PDF" as the destination
4. Remove headers/footers in print settings for a cleaner output

---

## Keyboard Shortcuts

| Action | Windows | macOS |
|--------|---------|-------|
| Save | `Ctrl+S` | `Cmd+S` |
| Undo | `Ctrl+Z` | `Cmd+Z` |
| Redo | `Ctrl+Shift+Z` | `Cmd+Shift+Z` |
| Add Section | `Ctrl+Shift+S` | `Cmd+Shift+S` |
| Toggle Dark/Light | `Ctrl+D` | `Cmd+D` |
| Duplicate Trip | `Ctrl+Shift+D` | `Cmd+Shift+D` |
| Export Presentation | `Ctrl+E` | `Cmd+E` |
| Open Help | `Ctrl+/` | `Cmd+/` |
| Close Dialog | `Escape` | `Escape` |

---

## AI Mode

Enable AI Mode in **Settings** (⚙ button in sidebar) or via the Settings panel.

When enabled, an input panel appears at the top of the canvas. You can paste a valid Voyagr JSON structure here to import a programmatically generated itinerary.

This allows AI assistants to generate complete itineraries using the schema in `SAVE_FILE_SCHEMA.md`, which can then be imported directly into Voyagr.

Click **Copy Schema Docs** to copy the schema to your clipboard to paste into an AI prompt.

---

## Tips for Professionals

**Template reuse:** Design a "master template" trip structure (e.g., a 7-day city break skeleton), save it as JSON, and open + clone it for each new client. Modify the clone.

**Color coding:** Use different section colors to visually distinguish phases (transport = gold, leisure = green, accommodation = blue).

**Notes as your working notes:** Use item notes for booking references, confirmation numbers, tips for clients — all exports show notes, making them perfect for client handoffs.

**Alternatives for proposals:** Add 2–3 restaurant/hotel alternatives with your recommendation marked "Active". Export shows all options — clients can see your thinking.

**Fast presentation:** Export to HTML, open in browser, press print → PDF. Share with client in under 60 seconds.

---

*Voyagr · Premium Travel Itinerary Design · ✦ Brewed with love by KT using Cursor*
