## Aurora Voyage – Premium Itinerary Studio

Aurora Voyage is a **frontend-only**, offline-friendly travel itinerary **design** tool built for professional trip creators. It runs entirely in the browser with no backend, database, or cloud services.

### Features

- Premium, desktop-first UI with dark/light themes.
- Hierarchical model: **Trip → Sections → Items → Alternatives**.
- Rich notes at trip, section, item, and alternative levels.
- Structured and hybrid planning modes.
- Drag-and-drop:
  - Reorder sections.
  - Reorder and move items between sections.
- Smart assistance (emoji suggestions, travel-day indicators).
- Optional Leaflet-based map view (manual coordinates only).
- Full undo/redo history.
- Save/load via JSON "game-style" save files.
- Presentation export with print-optimized HTML (save as PDF).
- AI compatibility mode exposing a structured JSON interface.

### Running the App

No build step is required.

1. Open the `index.html` file directly in a modern browser (Chrome, Edge, Safari, Firefox).
2. The preloaded **demo trip** appears automatically and is fully editable.

> The app is designed to work **offline after the first load**. External dependencies (like the Leaflet map library) are loaded via CDN the first time and are optional for core itinerary planning.

### Saving & Loading

- **Save**: Click **Save** in the header or press **Ctrl/Cmd + S** to download a `.auroravoyage.json` file.
- **Load**: Click **Load** or press **Ctrl/Cmd + O** and select a previously saved file.

The save file schema is documented in `SAVE_FILE_SCHEMA.md` to allow AI agents or other tools to generate compatible saves.

### Documentation

- `USER_GUIDE.md` – Full end-user documentation and workflows.
- `SAVE_FILE_SCHEMA.md` – Detailed JSON schema and example save file.

### Branding & Credit

- Product name: **Aurora Voyage – Premium Itinerary Studio**
- Signature credit line: **“Brewed with love by KT using Cursor.”**

