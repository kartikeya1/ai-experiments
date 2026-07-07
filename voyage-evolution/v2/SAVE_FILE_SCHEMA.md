# Voyagr Save File Schema — v1.0

**Product:** Voyagr — Premium Travel Itinerary Design Platform  
**Schema Version:** 1.0  
**File Extension:** `.json`

---

## Overview

Voyagr save files are portable JSON documents that capture the complete state of a travel itinerary project, including all trip data, UI state, and settings. They function like game save files — transferable across devices, openable on any machine with the app.

---

## Root Structure

```json
{
  "version": "1.0.0",
  "schemaVersion": "1.0",
  "savedAt": "2025-06-01T10:30:00.000Z",
  "trip": { ... },
  "sections": [ ... ],
  "settings": { ... },
  "packing": [ ... ],
  "ui": { ... }
}
```

| Field | Type | Description |
|-------|------|-------------|
| `version` | string | App version that created the file |
| `schemaVersion` | string | Schema version for forward compatibility |
| `savedAt` | ISO-8601 string | Timestamp of save |
| `trip` | object | Trip-level metadata |
| `sections` | array | Ordered list of trip sections |
| `settings` | object | App and display settings |
| `packing` | array | Packing list items |
| `ui` | object | UI state (expand/collapse, active panel) |

---

## Trip Object

```json
{
  "title": "Italian Grand Tour",
  "dest": "Rome, Florence, Venice",
  "start": "2025-06-01",
  "end": "2025-06-15",
  "travelers": 2,
  "notes": "Anniversary trip. Focus on art and food."
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | ✓ | Display name of the trip |
| `dest` | string | — | Destination(s), comma-separated |
| `start` | string (YYYY-MM-DD) | — | Trip start date |
| `end` | string (YYYY-MM-DD) | — | Trip end date |
| `travelers` | number | — | Number of travelers (default 1) |
| `notes` | string | — | Freeform trip-level notes |

---

## Section Object

Sections are the primary organizational containers. They may represent cities, phases, or any grouping chosen by the planner.

```json
{
  "id": "abc123xyz",
  "name": "Rome — Days 1–4",
  "color": "#c8a96e",
  "notes": "Check in by 3pm. Pick up Roma Pass.",
  "items": [ ... ]
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | ✓ | Unique section identifier |
| `name` | string | ✓ | Display name |
| `color` | hex string | ✓ | Accent color for visual identity |
| `notes` | string | — | Freeform section-level notes |
| `items` | array | ✓ | Ordered list of Item objects |

---

## Item Object

Items represent any element of a travel plan — flights, stays, meals, activities, notes, buffers.

```json
{
  "id": "item_abc",
  "sectionId": "abc123xyz",
  "title": "Fly LHR → FCO",
  "category": "Flight",
  "emoji": "✈️",
  "emojiOverride": false,
  "location": "Heathrow Airport T2",
  "date": "2025-06-01",
  "dateEnd": "",
  "timeStart": "08:00",
  "timeEnd": "11:30",
  "notes": "BA269. Check-in 05:30.",
  "color": "#c8a96e",
  "attachments": [
    { "label": "BA Booking Ref XY1234", "url": "https://ba.com" }
  ],
  "alternatives": [
    {
      "id": "alt_001",
      "title": "Train as backup",
      "notes": "Eurostar if flight cancelled",
      "active": false
    }
  ],
  "multiDay": false
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | ✓ | Unique item identifier |
| `sectionId` | string | ✓ | Parent section's `id` |
| `title` | string | ✓ | Item display name |
| `category` | string | ✓ | See Category Enum below |
| `emoji` | string | ✓ | Single emoji character |
| `emojiOverride` | boolean | ✓ | If true, emoji was set manually |
| `location` | string | — | Address, venue, or city |
| `date` | string (YYYY-MM-DD) | — | Primary date |
| `dateEnd` | string (YYYY-MM-DD) | — | End date for multi-day spans |
| `timeStart` | string (HH:MM) | — | Start time (24h) |
| `timeEnd` | string (HH:MM) | — | End time (24h) |
| `notes` | string | — | Detailed freeform notes |
| `color` | hex string | ✓ | Color tag |
| `attachments` | array | ✓ | Reference links (see below) |
| `alternatives` | array | ✓ | Alternative options (max 3) |
| `multiDay` | boolean | ✓ | Whether the item spans multiple days |

### Category Enum

Valid values for `category`:

```
Stay | Flight | Train | Transport | Restaurant | Activity | Sightseeing |
Museum | Shopping | Beach | Hiking | Tour | Transfer | Buffer | Note |
Meeting | Event | Other
```

### Attachment Object

```json
{ "label": "Human-readable label", "url": "https://..." }
```

### Alternative Object

```json
{
  "id": "alt_unique_id",
  "title": "Alternative option title",
  "notes": "Freeform notes about this alternative",
  "active": false
}
```

Only one alternative per item should have `"active": true`. When an alternative is active, it represents the chosen option.

---

## Settings Object

```json
{
  "mode": "structured",
  "darkMode": true,
  "showConflicts": true,
  "autoEmoji": true,
  "aiMode": false,
  "showMap": false,
  "showAssistant": true
}
```

| Field | Type | Values | Description |
|-------|------|--------|-------------|
| `mode` | string | `"structured"`, `"hybrid"` | Planning mode |
| `darkMode` | boolean | — | Dark/light theme |
| `showConflicts` | boolean | — | Show time conflict warnings |
| `autoEmoji` | boolean | — | Auto-assign emoji from title/category |
| `aiMode` | boolean | — | AI import panel visible |
| `showMap` | boolean | — | Map panel state |
| `showAssistant` | boolean | — | Assistant features enabled |

---

## Packing Item Object

```json
{
  "id": "pack_abc",
  "category": "Documents",
  "name": "Passport",
  "checked": false
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | ✓ | Unique identifier |
| `category` | string | ✓ | Grouping label (freeform) |
| `name` | string | ✓ | Item name |
| `checked` | boolean | ✓ | Whether item is packed |

---

## UI Object

```json
{
  "expandedSections": {
    "abc123xyz": true,
    "def456uvw": false
  },
  "expandedItems": {
    "item_abc": true
  },
  "activePanel": "packing",
  "selectedSection": null
}
```

| Field | Type | Description |
|-------|------|-------------|
| `expandedSections` | `{[id]: boolean}` | Expand/collapse state per section |
| `expandedItems` | `{[id]: boolean}` | Expand/collapse state per item |
| `activePanel` | string or null | Currently open right panel |
| `selectedSection` | string or null | Highlighted section in nav |

---

## Complete Minimal Example

```json
{
  "version": "1.0.0",
  "schemaVersion": "1.0",
  "savedAt": "2025-06-01T10:00:00.000Z",
  "trip": {
    "title": "Weekend in Paris",
    "dest": "Paris",
    "start": "2025-07-04",
    "end": "2025-07-06",
    "travelers": 2,
    "notes": "Romantic weekend break."
  },
  "sections": [
    {
      "id": "sec_001",
      "name": "Day 1 — Arrival",
      "color": "#c8a96e",
      "notes": "",
      "items": [
        {
          "id": "item_001",
          "sectionId": "sec_001",
          "title": "Fly LHR → CDG",
          "category": "Flight",
          "emoji": "✈️",
          "emojiOverride": false,
          "location": "London Heathrow",
          "date": "2025-07-04",
          "dateEnd": "",
          "timeStart": "09:00",
          "timeEnd": "11:30",
          "notes": "Eurostar alternative available",
          "color": "#c8a96e",
          "attachments": [],
          "alternatives": [],
          "multiDay": false
        }
      ]
    }
  ],
  "settings": {
    "mode": "structured",
    "darkMode": true,
    "showConflicts": true,
    "autoEmoji": true,
    "aiMode": false
  },
  "packing": [],
  "ui": {
    "expandedSections": { "sec_001": true },
    "expandedItems": { "item_001": true },
    "activePanel": null,
    "selectedSection": null
  }
}
```

---

## Notes for AI Generation

When generating a Voyagr save file programmatically:

1. All `id` fields must be unique strings. Use any format (UUID, timestamp+random, etc.)
2. `sectionId` in each item must match the parent section's `id` exactly
3. Dates must be `YYYY-MM-DD` format; times `HH:MM` (24h)
4. `alternatives` array should have 0–3 items; at most one with `"active": true`
5. `emoji` should be a single emoji character appropriate to the category
6. `expandedSections` and `expandedItems` should reference all section/item ids with value `true` to show them expanded on load
7. The file is valid JSON — no trailing commas, all strings double-quoted

---

*Voyagr · Premium Travel Itinerary Design · ✦ Brewed with love by KT using Cursor*
