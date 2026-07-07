## Aurora Voyage – User Guide

Premium Itinerary Studio for professional travel designers.  
All functionality runs completely in the browser, with no server or login.

---

### Table of Contents

1. Overview
2. Core Concepts
3. Getting Started
4. Working with Trips
5. Sections & Items
6. Time & Scheduling
7. Notes Strategy (Trip / Section / Item / Alternative)
8. Planning Modes (Structured vs Hybrid)
9. Drag & Drop & Direct Manipulation
10. Smart Assistance
11. Map View (Optional)
12. Save & Load (JSON Save Files)
13. Presentation Export (Print / PDF)
14. Keyboard Shortcuts
15. AI Compatibility Mode
16. Large Itineraries & Performance
17. Troubleshooting & Diagnostics

---

### 1. Overview

**Aurora Voyage** is a premium **travel itinerary design tool**.  
It is **not** a booking engine, search tool, or recommendation system.

You use Aurora Voyage to:

- Design, refine, and present itineraries for clients.
- Reuse and adapt templates quickly.
- Export clean, client-ready presentations and offline save files.

Everything runs **entirely in the browser**:

- No login, no backend, no database.
- All work lives in memory during the session.
- Saving = download a JSON file.
- Loading = open a JSON file.

---

### 2. Core Concepts

- **Trip** – A full itinerary for a client or journey.
- **Section** – A container inside a trip.
  - Can represent cities, phases, or any custom grouping.
- **Item** – A concrete activity:
  - Travel, stay, food, sightseeing, buffer, notes, etc.
- **Alternative** – An optional variation for a single item (e.g., two dinner options).

Hierarchy:

> Trip → Sections → Items → Alternatives

No item can exist outside a section.

---

### 3. Getting Started

1. Open `index.html` locally in any modern browser (Chrome, Edge, Safari, Firefox).
2. A **preloaded demo trip** (“Spring Lights: Tokyo & Kyoto”) appears immediately.
3. Explore:
   - Sections and items in the central board.
   - Trip overview and notes on the left.
   - Inspector, map, AI structure, and about tab on the right.
4. Start editing the demo, duplicate it, or create a brand-new trip.

---

### 4. Working with Trips

**Create a new trip**

- Click **“+ Trip”** in the header, or use **Ctrl/Cmd + N**.
- A blank itinerary appears with no sections yet.

**Duplicate current trip as a template**

- Click **“Duplicate”** or use **Ctrl/Cmd + D**.
- The new trip inherits all sections and items; you can safely modify it for a new client.

**Switch between trips**

- Use the **trip dropdown** in the header to select any existing trip.

**Trip-level notes**

- Left sidebar → **“Trip Notes”**.
- Long-form space for narrative design, constraints, or rationale.

**Packing & reminders**

- Left sidebar → **“Packing & Reminders”**.
- Ideal for per-trip packing lists, climate notes, and special instructions.

---

### 5. Sections & Items

#### Sections

- Add a section with **“+ Section”** on the board toolbar, or **Ctrl/Cmd + Alt + S**.
- Typical uses:
  - “Tokyo – Arrival & Orientation”
  - “Kyoto – Slow Days”
  - “Return Journey”
- Sections are **reorderable via drag-and-drop**:
  - Grab the section header and drag it left/right.

Each section has:

- A **title** (inline editable in the header).
- Long-form **section notes**, editable via:
  - The pencil button in the section header, or
  - Selecting the section to open it in the right-hand inspector.
- A color accent (stored but currently subtle in UI).

#### Items

- Add an item to a section:
  - Click the **“+” button** in the section header, or
  - Use **Ctrl/Cmd + Alt + N** (adds to the first section by default).

Each item supports:

- **Title** – Inline editable directly on the card.
- **Category / Type** – Set in the right-hand inspector.
- **Location** – Freeform, editable in the inspector.
- **Date & time**:
  - `startDateTime` and `endDateTime` fields (datetime pickers in the inspector).
  - `untimed` flag for time-flexible items.
  - `spanning` flag for multi-day spans.
- **Notes** – Long-form item notes in the inspector.
- **Attachments** – Represented as text/links in the save file (UI shows simple usage).
- **Emoji**:
  - Auto-suggested from category/title.
  - Click the emoji on a card to manually override.
- **Color tags** – Per-item accent stored for future styling.
- **Alternatives** – Set of up to 2–3 alternative options for a single slot.

Item operations (from card or inspector):

- **Drag & drop** to:
  - Reorder within a section.
  - Move items into another section.
- **Duplicate** – Small ⧉ button on each card.
- **Delete** – Small × button on each card.

---

### 6. Time & Scheduling

Aurora Voyage supports:

- Exact timestamps.
- Time ranges.
- Untimed items.
- Multi-day spans.

Usage:

1. Select an item.
2. In the inspector, set:
   - **Start** (datetime-local).
   - **End** (datetime-local).
   - **Untimed** – check to mark as flexible.
   - **Multi-day span** – check if it conceptually spans multiple days.

Visual behaviours:

- Overlaps within a section are highlighted with a **conflict border** (visual only).
- Multi-day items show a **“Multi-day”** badge on the card.

Items are never forced into strict day buckets; sections and planning modes decide how to present them.

---

### 7. Notes Strategy (Trip / Section / Item / Alternative)

Notes are intentionally unconstrained and critical for future feature discovery:

- **Trip notes** – Overall journey design, client constraints, and narrative.
- **Section notes** – City/phase-level context, pacing guidance, themes.
- **Item notes** – Per-activity details, micro-instructions, or rationale.
- **Alternative notes** – Explain how alternatives differ (cost, mood, distance, etc.).

Best practice:

- Use notes heavily as the primary design narrative space.
- Avoid encoding semantics that should be explicit fields later; keep them expressive.

---

### 8. Planning Modes (Structured vs Hybrid)

In the header:

- **Structured ↔ Hybrid toggle** (or **Ctrl/Cmd + M**)

**Structured mode**

- Items inside sections are sorted in time order (when times are present).
- Intended for day-wise or schedule-oriented demos.

**Hybrid mode**

- Respects manual ordering inside sections.
- Best for creative, non-linear planning and rearranging.

You can switch modes at any time; the underlying data remains unchanged.

---

### 9. Drag & Drop & Direct Manipulation

Aurora Voyage prioritizes **direct manipulation** over modal forms:

- **Sections**
  - Drag section headers left/right to reorder phases/cities.
- **Items**
  - Drag cards within a section to reorder.
  - Drag cards into other sections to move them.

Click directly on:

- Section titles (inline editing).
- Item titles (inline editing).
- Item emojis (manual override).

Modal dialogs are minimized; editing happens **in context**:

- Notes in the sidebars and inspector.
- Times, categories, and locations in the inspector.

---

### 10. Smart Assistance

Smart assistance is **frontend-only** and fully optional:

- Toggle with **“Assist”** switch on the board toolbar.

Current assistive behaviours:

- **Emoji suggestions** based on:
  - Item category (Travel, Stay, Food, Sightseeing, Buffer, Pass, etc.).
  - Keywords in the item title (train, flight, temple, museum, dinner, etc.).
- **Travel-heavy day indicator**:
  - If a section has many travel-heavy items, a **“Travel-heavy”** badge appears.

All assistance is **non-destructive**—you can override everything manually.

---

### 11. Map View (Optional)

The **Map** tab in the right sidebar is strictly optional and can be fully disabled:

- Toggle **Map** on/off using the board toolbar switch.
- Under the hood, Aurora Voyage uses Leaflet + OpenStreetMap tiles.
  - Needs an initial network connection to fetch the library and tiles.
  - The itinerary design itself remains fully functional offline.

To plot an item on the map:

1. Select the item.
2. In the inspector, fill in **lat** and **lng** under “Map coordinates”.
3. The map will:
   - Plot each item as a point.
   - Draw a route line in the order of items.

If **no coordinates** are provided:

- The item is ignored by the map, and manual planning still works 100%.

---

### 12. Save & Load (JSON Save Files)

**Saving**

- Click **“Save”** in the header, or press **Ctrl/Cmd + S**.
- A `.auroravoyage.json` file is downloaded.
- The file contains:
  - All trips.
  - All sections and items.
  - Notes and settings.
  - UI state (which sections are expanded, selection, etc.).

**Loading**

- Click **“Load”** and choose a valid Aurora Voyage JSON file, or
- Press **Ctrl/Cmd + O** to open the file picker.

The app will fully restore:

- Trip data.
- Layout state (where reasonable).
- Settings and toggles.

**Unsaved Changes Protection**

- If you attempt to close/refresh with unsaved changes:
  - The browser’s native confirmation is triggered (Leave / Stay).
- Additionally:
  - An internal **“Unsaved Changes”** dialog (Ctrl/Cmd + Q) offers:
    - **Save & Download**
    - **Discard & Exit**
    - **Cancel**

For details of the JSON structure, see `SAVE_FILE_SCHEMA.md`.

---

### 13. Presentation Export (Print / PDF)

Aurora Voyage includes a dedicated **client presentation** export:

- Click **“Presentation”** in the header.

This opens a new window with:

- A clean, print-optimized layout.
- Brand placement:
  - Aurora Voyage logo and title.
  - Trip title and client name.
  - Itinerary sections and items.
  - Packing & reminders card.
- Subtle signature:
  - “Brewed with love by KT using Cursor.”

To export as PDF:

1. When the window opens, a **print dialog** is automatically triggered.
2. Choose **“Save as PDF”** in your browser’s print options.

The layout is designed to work across:

- Laptops
- Tablets
- Phones (for review)

---

### 14. Keyboard Shortcuts

**Trip & Sections**

- **Ctrl/Cmd + N** – Create new trip.
- **Ctrl/Cmd + D** – Duplicate active trip as template.
- **Ctrl/Cmd + Alt + S** – Add section to current trip.

**Items**

- **Ctrl/Cmd + Alt + N** – Add item to the first section (or new section).

**Saving & Loading**

- **Ctrl/Cmd + S** – Save (download JSON).
- **Ctrl/Cmd + O** – Load save file (open file picker).

**Undo / Redo**

- **Ctrl/Cmd + Z** – Undo.
- **Ctrl/Cmd + Shift + Z** – Redo.

**Modes & Views**

- **Ctrl/Cmd + M** – Toggle Structured / Hybrid planning mode.
- **Ctrl/Cmd + L** – Toggle dark / light mode.
- **Ctrl/Cmd + Shift + V** – Switch between Board and Timeline views.

**Optional exit flow**

- **Ctrl/Cmd + Q** – Show in-app unsaved-changes dialog (Save / Discard / Cancel).

All shortcuts support both Windows (Ctrl) and macOS (Cmd).

---

### 15. AI Compatibility Mode

While Aurora Voyage is human-centric, it includes an **AI-friendly mode**:

- Toggle **Human / AI** in the header.
- Open the **AI Struct** tab in the right sidebar.

There you can:

- View a **structured JSON skeleton** of the current trip:
  - Trip name and client.
  - Sections and items (titles, categories, times, locations, notes).
- Paste a modified JSON structure and click **“Apply Structured Input”**.

Use cases:

- Upstream AI agent generates a draft itinerary structure.
- You review, tweak, and then apply it to the active trip.

This interface is:

- Purely frontend.
- Optional.
- Does **not** require any server or network calls.

For full save-file schema details, see `SAVE_FILE_SCHEMA.md`.

---

### 16. Large Itineraries & Performance

Aurora Voyage is designed for:

- Multi-country, long-duration itineraries.
- Many sections and items.

Tips for smooth operation:

- Prefer **Structured mode** when presenting long, time-rich itineraries.
- Collapse sections you are not actively editing.
- Use the **Timeline view** for high-level sequence reviews.
- Save regularly (Ctrl/Cmd + S) for peace of mind.

Behind the scenes:

- Undo/redo tracks recent states (up to a generous limit).
- All changes happen in memory, with no network latency.

---

### 17. Troubleshooting & Diagnostics

If something feels off:

1. Open the browser console (F12 / DevTools).
2. Look for logs prefixed with:
   - `[AuroraVoyage][INFO]`
   - `[AuroraVoyage][WARN]`
   - `[AuroraVoyage][ERROR]`
3. These logs are:
   - Structured.
   - Categorized by event type.
   - Designed so another AI (or developer) can diagnose issues quickly.

Common issues:

- **“Failed to load save file”**:
  - The JSON may not match the expected structure.
  - Validate the file against the schema in `SAVE_FILE_SCHEMA.md`.
- **Map not loading tiles**:
  - Works best after an initial online load (Leaflet + tiles).
  - The itinerary builder itself remains fully functional offline.

If you intend to modify Aurora Voyage via an AI-powered coding assistant:

- Prefer small, deterministic changes.
- Keep structures simple.
- Preserve the existing JSON schema when possible.

Aurora Voyage is built to be **robust, clear, and professional**—ready for real-world client work and live sales demos.

