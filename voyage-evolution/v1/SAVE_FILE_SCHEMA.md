## Aurora Voyage Save File Schema

This document describes the JSON save file format used by **Aurora Voyage – Premium Itinerary Studio**.

Save files are designed to be:

- **Frontend-only**: no server or database required.
- **Offline-friendly**: load from disk, work in memory, and save back to disk.
- **AI-friendly**: structured enough for programmatic generation and manipulation by future agents.

The same schema is used for:

- Manual saves from the UI (`Save` → download JSON)
- Programmatic generation of save files by an AI agent

---

### 1. Top-Level Structure

```json
{
  "version": "1.0.0",
  "settings": { ... },
  "uiState": { ... },
  "trips": [ ... ],
  "metadata": {
    "savedAt": "2026-02-28T12:00:00.000Z",
    "product": "Aurora Voyage"
  }
}
```

- **version**: String. Application version. Used for forward-compatibility and future migrations.
- **settings**: Global application settings (theme, modes, etc.).
- **uiState**: Non-critical UI layout state (expanded panels, selection, etc.).
- **trips**: Array of trip objects. Usually 1–5, but can be many.
- **metadata**: Non-essential metadata; safe to ignore for programmatic generation.

---

### 2. `settings` Object

```json
{
  "theme": "dark",
  "planningMode": "structured",
  "smartAssistEnabled": true,
  "mapEnabled": true,
  "aiMode": "human",
  "layoutView": "board"
}
```

- **theme**: `"dark"` | `"light"` – Current color theme.
- **planningMode**: `"structured"` | `"hybrid"`  
  - `"structured"`: time-ordered emphasis.
  - `"hybrid"`: flexible order inside sections.
- **smartAssistEnabled**: Boolean. Enables emoji, buffer, and travel-load hints.
- **mapEnabled**: Boolean. If `false`, map panel is visually disabled (data still preserved).
- **aiMode**: `"human"` | `"ai"` – Toggles AI compatibility emphasis in UI.
- **layoutView**: `"board"` | `"timeline"` – Current primary view.

All fields are **optional** but recommended. Missing fields will be defaulted by the app.

---

### 3. `uiState` Object

```json
{
  "activeTripId": "trip_xxxxxxxx",
  "selectedEntity": {
    "type": "item",
    "tripId": "trip_xxxxxxxx",
    "sectionId": "section_xxxxxxxx",
    "itemId": "item_xxxxxxxx"
  },
  "expandedSections": {
    "section_xxxxxxxx": true,
    "section_yyyyyyyy": false
  }
}
```

- **activeTripId**: String or `null`. ID of the currently active trip.
- **selectedEntity**: Optional. The currently selected object in the inspector.
  - **type**: `"trip" | "section" | "item" | "alt"`
  - **tripId**: Always present.
  - **sectionId**: Present for `"section"`, `"item"`, `"alt"`.
  - **itemId**: Present for `"item"`, `"alt"`.
  - **altId**: Present for `"alt"`.
- **expandedSections**: Object map `sectionId → boolean`. Tracks collapse/expand state in the board.

All fields in `uiState` are **optional** and safe to omit if you do not care about restoring UI layout.

---

### 4. `trips[]` – Trip Object

```json
{
  "id": "trip_spring_lights_tokyo_kyoto",
  "name": "Spring Lights: Tokyo & Kyoto",
  "clientName": "The Nakamura Family",
  "dateRange": {
    "start": "2026-04-03",
    "end": "2026-04-12"
  },
  "notes": "Long-form trip-level notes...",
  "packingNotes": "Packing reminders, special constraints...",
  "sections": [ ... ]
}
```

#### Fields

- **id**: String. Globally unique within the file. **Required.**
- **name**: String. Human-facing name of the itinerary. **Recommended.**
- **clientName**: String. Name of the client / traveller(s).
- **dateRange**:
  - **start**: `YYYY-MM-DD` or `null`.
  - **end**: `YYYY-MM-DD` or `null`.
  - May be omitted for fully flexible itineraries.
- **notes**: Long-form **trip-level notes**. Critical design surface; no semantic constraints.
- **packingNotes**: Long-form **packing & reminder notes**.
- **sections**: Array of Section objects. **Required.**

---

### 5. `sections[]` – Section Object

```json
{
  "id": "section_tokyo_arrival_orientation",
  "title": "Arrival & Orientation – Tokyo",
  "notes": "Long-form section-level notes...",
  "colorTag": "#38bdf8",
  "items": [ ... ]
}
```

#### Fields

- **id**: String. Unique within the trip. **Required.**
- **title**: String. Label for the section (city, phase, day group, etc.). **Required.**
- **notes**: Long-form **section-level notes**.
- **colorTag**: String (CSS color). Cosmetic accent color for the section.
- **items**: Array of Item objects. **Required (can be empty).**

Sections are **pure containers**; they do **not** enforce time semantics. They can represent:

- Cities
- Phases
- Thematic clusters
- Loosely “day” groupings

---

### 6. `items[]` – Item Object

Items represent activities such as travel, stays, meals, sightseeing, notes, and buffers.

```json
{
  "id": "item_tokyo_arrival",
  "title": "Arrival in Tokyo",
  "category": "Arrival",
  "location": "Haneda Airport (HND)",
  "startDateTime": "2026-04-03T08:30",
  "endDateTime": "2026-04-03T10:00",
  "untimed": false,
  "spanning": false,
  "notes": "Freeform long-form notes...",
  "attachments": [
    { "id": "att_airport_map", "label": "Airport map", "url": "https://example.com/map" }
  ],
  "emoji": "🛬",
  "emojiLocked": false,
  "colorTag": "#38bdf8",
  "isCollapsed": false,
  "alternatives": [ ... ],
  "activeAlternativeId": null,
  "coords": {
    "lat": 35.5494,
    "lng": 139.7798
  }
}
```

#### Core Fields

- **id**: String. Unique within the section. **Required.**
- **title**: String. Short human-facing title. **Required.**
- **category**: String. Freeform; used for grouping and emoji suggestions.
- **location**: String. Freeform description of place or route.

#### Time & Span

- **startDateTime**: ISO-like local datetime string `YYYY-MM-DDTHH:mm` or `null`.
- **endDateTime**: Same shape as `startDateTime` or `null`.
- **untimed**: Boolean. If `true`, item is considered **time-flexible**.
- **spanning**: Boolean. Indicates multi-day span semantics.  
  - If `true`, item is treated as spanning multiple days where `startDateTime` and `endDateTime` differ.

The UI can show:

- Exact timestamps
- Time ranges
- Untimed blocks
- Multi-day spans (with visual indicators)

#### Notes & Attachments

- **notes**: Long-form **item-level notes**. Critical, unconstrained text surface.
- **attachments**: Array of text/link attachments:

  ```json
  {
    "id": "att_local_guide",
    "label": "Local guide contact",
    "url": "https://example.com/guide"
  }
  ```

  - **id**: Unique string within the item.
  - **label**: Human-facing label.
  - **url**: String (may also contain `mailto:`, `tel:`, or any plain link).

#### Visual & Emoji

- **emoji**: String (usually a single emoji). The app auto-suggests based on category/title but respects manual overrides.
- **emojiLocked**: Boolean. If `true`, suppresses automatic emoji changes.
- **colorTag**: String (CSS color). Optional per-item accent.
- **isCollapsed**: Boolean. For future per-item collapse; currently mostly cosmetic.

#### Alternatives

- **alternatives**: Array of **Alternative Item** objects (same schema subset as items, see below).
- **activeAlternativeId**: String or `null`. ID of the currently “active” alternative choice.

#### Optional Map Coordinates

- **coords** (optional):

  ```json
  {
    "lat": 35.6804,
    "lng": 139.7690
  }
  ```

  - If present, the map view plots this item.
  - If absent, the item is ignored by the map.

---

### 7. `alternatives[]` – Alternative Item Object

Alternatives inherit the same conceptual shape as an item, but live inside `item.alternatives` and do not themselves contain further alternatives.

```json
{
  "id": "alt_tokyo_tower",
  "title": "Tokyo Tower viewpoint",
  "category": "Sightseeing",
  "location": "Tokyo Tower",
  "startDateTime": "2026-04-03T16:30",
  "endDateTime": "2026-04-03T19:00",
  "untimed": false,
  "spanning": false,
  "notes": "Alternative skyline view option...",
  "attachments": [],
  "emoji": "🗼",
  "emojiLocked": false,
  "colorTag": "#f97316",
  "isCollapsed": false
}
```

Differences from main items:

- No `alternatives` or `activeAlternativeId` **inside** an alternative.
- Typically inherits timings and location from the parent item, but this is not enforced by schema.

---

### 8. Minimal Valid Save Example

```json
{
  "version": "1.0.0",
  "settings": {
    "theme": "dark",
    "planningMode": "structured",
    "smartAssistEnabled": true,
    "mapEnabled": true,
    "aiMode": "human",
    "layoutView": "board"
  },
  "uiState": {
    "activeTripId": "trip_demo",
    "selectedEntity": null,
    "expandedSections": {}
  },
  "trips": [
    {
      "id": "trip_demo",
      "name": "Sample Aurora Voyage Trip",
      "clientName": "Demo Client",
      "dateRange": {
        "start": "2026-06-01",
        "end": "2026-06-10"
      },
      "notes": "Trip-level long-form notes.",
      "packingNotes": "Layered clothing, comfortable shoes.",
      "sections": [
        {
          "id": "section_city_phase",
          "title": "City Phase – Example",
          "notes": "Section-level notes.",
          "colorTag": "#38bdf8",
          "items": [
            {
              "id": "item_arrival",
              "title": "Arrival",
              "category": "Arrival",
              "location": "Main Airport",
              "startDateTime": "2026-06-01T09:00",
              "endDateTime": "2026-06-01T11:00",
              "untimed": false,
              "spanning": false,
              "notes": "Long-form item notes.",
              "attachments": [],
              "emoji": "🛬",
              "emojiLocked": false,
              "colorTag": "#38bdf8",
              "isCollapsed": false,
              "alternatives": [],
              "activeAlternativeId": null
            }
          ]
        }
      ]
    }
  ],
  "metadata": {
    "savedAt": "2026-02-28T12:00:00.000Z",
    "product": "Aurora Voyage"
  }
}
```

---

### 9. AI-Agent Guidance

For another AI generating save files:

- **Always** set a valid, unique `id` for every `trip`, `section`, `item`, and `alternative`.
- Prefer `"YYYY-MM-DD"` for `dateRange` and `"YYYY-MM-DDTHH:mm"` for `startDateTime` / `endDateTime`.
- Use rich, descriptive `notes` at:
  - Trip level (`trip.notes`)
  - Section level (`section.notes`)
  - Item level (`item.notes`)
  - Alternative level (`alternative.notes`)
- It is **safe** to:
  - Omit `coords` if not known.
  - Omit `attachments` or leave as an empty array.
  - Leave `emoji` empty; the app will propose suggestions.
- Try to keep `settings` coherent (e.g., `"planningMode": "structured"` for day-wise exports).

If a field is unknown, you may omit it entirely—Aurora Voyage will fall back to defaults where possible.

