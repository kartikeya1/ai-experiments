// Aurora Voyage – Premium Itinerary Studio
// Frontend-only, offline-capable SPA. All state lives in-memory.

(() => {
  const APP_VERSION = "1.0.0";

  // -----------------------------
  // Logging helpers for AI debugging
  // -----------------------------
  function logInfo(event, payload = {}) {
    console.log("[AuroraVoyage][INFO]", { event, ...payload });
  }
  function logWarn(event, payload = {}) {
    console.warn("[AuroraVoyage][WARN]", { event, ...payload });
  }
  function logError(event, payload = {}) {
    console.error("[AuroraVoyage][ERROR]", { event, ...payload });
  }

  // -----------------------------
  // State model
  // -----------------------------
  function createInitialDemoState() {
    const tripId = generateId("trip");
    const section1Id = generateId("section");
    const section2Id = generateId("section");
    const section3Id = generateId("section");

    const item1 = {
      id: generateId("item"),
      title: "Arrival in Tokyo",
      category: "Arrival",
      location: "Haneda Airport (HND)",
      startDateTime: "2026-04-03T08:30",
      endDateTime: "2026-04-03T10:00",
      untimed: false,
      spanning: false,
      notes:
        "Meet & greet at arrivals. Purchase Suica card. Light breakfast at airport café.",
      attachments: [
        {
          id: generateId("att"),
          label: "Airport map",
          url: "https://tokyo-haneda.com",
        },
      ],
      emoji: "🛬",
      emojiLocked: false,
      colorTag: "#38bdf8",
      isCollapsed: false,
      alternatives: [],
      activeAlternativeId: null,
    };

    const item2 = {
      id: generateId("item"),
      title: "Check-in & unwind",
      category: "Stay",
      location: "Shinjuku hotel",
      startDateTime: "2026-04-03T11:30",
      endDateTime: "2026-04-03T13:00",
      untimed: false,
      spanning: false,
      notes: "Early check-in requested. Short rest before afternoon exploration.",
      attachments: [],
      emoji: "🏨",
      emojiLocked: false,
      colorTag: "#a855f7",
      isCollapsed: false,
      alternatives: [],
      activeAlternativeId: null,
    };

    const item3 = {
      id: generateId("item"),
      title: "Tokyo skyline sunset",
      category: "Sightseeing",
      location: "Tokyo Skytree",
      startDateTime: "2026-04-03T16:30",
      endDateTime: "2026-04-03T19:00",
      untimed: false,
      spanning: false,
      notes:
        "Golden-hour visit. Reserve fast-track tickets. Optional dinner in Solamachi.",
      attachments: [],
      emoji: "🌇",
      emojiLocked: false,
      colorTag: "#f97316",
      isCollapsed: false,
      alternatives: [
        {
          id: generateId("alt"),
          title: "Tokyo Tower viewpoint",
          category: "Sightseeing",
          location: "Tokyo Tower",
          startDateTime: "2026-04-03T16:30",
          endDateTime: "2026-04-03T19:00",
          untimed: false,
          spanning: false,
          notes:
            "Classic tower silhouette. Slightly less crowded, easier taxi access.",
          attachments: [],
          emoji: "🗼",
          emojiLocked: false,
          colorTag: "#f97316",
          isCollapsed: false,
        },
      ],
      activeAlternativeId: null,
    };

    const item4 = {
      id: generateId("item"),
      title: "Tokyo – Kyoto Shinkansen",
      category: "Travel",
      location: "Tokyo Station → Kyoto Station",
      startDateTime: "2026-04-06T09:00",
      endDateTime: "2026-04-06T11:20",
      untimed: false,
      spanning: false,
      notes: "Reserved seats. Sit on Mount Fuji side if weather is clear.",
      attachments: [],
      emoji: "🚅",
      emojiLocked: false,
      colorTag: "#22c55e",
      isCollapsed: false,
      alternatives: [],
      activeAlternativeId: null,
    };

    const spanningItem = {
      id: generateId("item"),
      title: "Japan Rail Pass validity",
      category: "Pass",
      location: "Nationwide",
      startDateTime: "2026-04-04T08:00",
      endDateTime: "2026-04-11T23:00",
      untimed: true,
      spanning: true,
      notes: "Covers all long-distance intercity travel – keep card accessible.",
      attachments: [],
      emoji: "🎫",
      emojiLocked: false,
      colorTag: "#0ea5e9",
      isCollapsed: false,
      alternatives: [],
      activeAlternativeId: null,
    };

    const trip = {
      id: tripId,
      name: "Spring Lights: Tokyo & Kyoto",
      clientName: "The Nakamura Family",
      dateRange: {
        start: "2026-04-03",
        end: "2026-04-12",
      },
      notes:
        "Family-focused itinerary with a gentle pace. Prioritize evening cityscapes, light experiences, and flexible daytime windows.",
      packingNotes:
        "Layering pieces; compact umbrellas; small gifts for local hosts; portable Wi‑Fi or eSIM confirmed externally.",
      sections: [
        {
          id: section1Id,
          title: "Arrival & Orientation – Tokyo",
          notes:
            "Soft landing day. Keep everything light and flexible in case of jet lag or delays.",
          colorTag: "#38bdf8",
          items: [item1, item2, item3],
        },
        {
          id: section2Id,
          title: "Tokyo – Kyoto Transition",
          notes:
            "Core transit day – avoid stacking too many fixed-time commitments.",
          colorTag: "#22c55e",
          items: [item4, spanningItem],
        },
        {
          id: section3Id,
          title: "Kyoto – Slow Days",
          notes:
            "Design serene, spacious days. Focus on temples, gardens, and gentle walks.",
          colorTag: "#f97316",
          items: [],
        },
      ],
    };

    return {
      version: APP_VERSION,
      settings: {
        theme: "dark",
        planningMode: "structured", // or "hybrid"
        smartAssistEnabled: true,
        mapEnabled: true,
        aiMode: "human", // or "ai"
        layoutView: "board", // or "timeline"
      },
      uiState: {
        activeTripId: tripId,
        selectedEntity: null, // { type: "trip"|"section"|"item"|"alt", tripId, sectionId?, itemId?, altId? }
        expandedSections: {
          [section1Id]: true,
          [section2Id]: true,
          [section3Id]: true,
        },
      },
      trips: [trip],
      _meta: {
        lastSavedAt: null,
        hasUnsavedChanges: false,
      },
    };
  }

  let appState = createInitialDemoState();

  const historyStack = [];
  const futureStack = [];
  const MAX_HISTORY = 200;

  function cloneState(state) {
    return JSON.parse(JSON.stringify(state));
  }

  function pushHistory(reason) {
    historyStack.push({
      state: cloneState(appState),
      reason,
      timestamp: Date.now(),
    });
    if (historyStack.length > MAX_HISTORY) {
      historyStack.shift();
    }
    futureStack.length = 0;
    appState._meta.hasUnsavedChanges = true;
    renderUnsavedIndicator();
    logInfo("history.push", { reason });
  }

  function undo() {
    if (!historyStack.length) {
      logInfo("history.undo.empty");
      return;
    }
    const last = historyStack.pop();
    futureStack.push({
      state: cloneState(appState),
      reason: "undo",
      timestamp: Date.now(),
    });
    appState = last.state;
    logInfo("history.undo", { toReason: last.reason });
    renderAll();
  }

  function redo() {
    if (!futureStack.length) {
      logInfo("history.redo.empty");
      return;
    }
    const next = futureStack.pop();
    historyStack.push({
      state: cloneState(appState),
      reason: "redo",
      timestamp: Date.now(),
    });
    appState = next.state;
    logInfo("history.redo", { toReason: next.reason });
    renderAll();
  }

  function applyMutation(reason, mutator) {
    try {
      pushHistory(reason);
      mutator(appState);
      logInfo("state.mutate", { reason });
      renderAll();
    } catch (err) {
      logError("state.mutate.error", { reason, error: String(err) });
      showToast("Error applying change. See console for details.", "error");
    }
  }

  // -----------------------------
  // Utilities
  // -----------------------------
  function generateId(prefix) {
    return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
  }

  function findActiveTrip() {
    return appState.trips.find((t) => t.id === appState.uiState.activeTripId);
  }

  function upsertExpanded(sectionId, expanded) {
    appState.uiState.expandedSections[sectionId] = expanded;
  }

  function dateSpanInfo(item) {
    if (!item.startDateTime || !item.endDateTime) return null;
    const start = new Date(item.startDateTime);
    const end = new Date(item.endDateTime);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return null;
    return {
      start,
      end,
      spanning: end.toDateString() !== start.toDateString(),
    };
  }

  // -----------------------------
  // Emoji suggestion
  // -----------------------------
  function suggestEmojiForItem(item) {
    const title = (item.title || "").toLowerCase();
    const cat = (item.category || "").toLowerCase();

    if (cat.includes("travel") || title.includes("train") || title.includes("flight")) {
      if (title.includes("train") || cat.includes("rail")) return "🚆";
      if (title.includes("ferry") || title.includes("boat")) return "⛴️";
      if (title.includes("car") || title.includes("drive")) return "🚗";
      return "✈️";
    }
    if (cat.includes("arrival")) return "🛬";
    if (cat.includes("departure")) return "🛫";
    if (cat.includes("stay") || cat.includes("hotel") || title.includes("check-in")) {
      return "🏨";
    }
    if (cat.includes("food") || cat.includes("dining") || title.includes("dinner")) {
      return "🍽️";
    }
    if (cat.includes("coffee") || title.includes("café") || title.includes("coffee")) {
      return "☕";
    }
    if (cat.includes("sightseeing") || title.includes("temple") || title.includes("museum")) {
      return "📍";
    }
    if (cat.includes("buffer") || title.includes("buffer") || title.includes("flex")) {
      return "🌿";
    }
    if (cat.includes("pass")) return "🎫";
    if (cat.includes("shopping")) return "🛍️";
    if (cat.includes("night") || title.includes("bar") || title.includes("rooftop")) {
      return "🌃";
    }
    return "📌";
  }

  // -----------------------------
  // Toasts
  // -----------------------------
  function showToast(message, level = "info", title) {
    const container = document.getElementById("toast-container");
    if (!container) return;
    const toast = document.createElement("div");
    toast.className = `av-toast av-toast-${level}`;

    const body = document.createElement("div");
    body.className = "av-toast-body";

    if (title) {
      const t = document.createElement("div");
      t.className = "av-toast-title";
      t.textContent = title;
      body.appendChild(t);
    }

    const text = document.createElement("div");
    text.textContent = message;
    body.appendChild(text);

    const close = document.createElement("button");
    close.className = "av-toast-close";
    close.innerHTML = "×";
    close.addEventListener("click", () => {
      container.removeChild(toast);
    });

    toast.appendChild(body);
    toast.appendChild(close);
    container.appendChild(toast);

    setTimeout(() => {
      if (toast.parentElement === container) {
        container.removeChild(toast);
      }
    }, 4000);
  }

  // -----------------------------
  // Rendering
  // -----------------------------
  function renderTripSelector() {
    const selector = document.getElementById("trip-selector");
    selector.innerHTML = "";
    appState.trips.forEach((trip) => {
      const opt = document.createElement("option");
      opt.value = trip.id;
      opt.textContent = trip.name || "Untitled Trip";
      selector.appendChild(opt);
    });
    selector.value = appState.uiState.activeTripId || "";
  }

  function renderTripOverview() {
    const container = document.getElementById("trip-overview");
    const trip = findActiveTrip();
    if (!trip) {
      container.innerHTML = '<div class="av-muted">No active trip.</div>';
      return;
    }
    const totalSections = trip.sections.length;
    const totalItems = trip.sections.reduce((sum, s) => sum + s.items.length, 0);
    const dateText =
      trip.dateRange && trip.dateRange.start && trip.dateRange.end
        ? `${trip.dateRange.start} → ${trip.dateRange.end}`
        : "Flexible dates";

    container.innerHTML = `
      <div class="av-muted" style="margin-bottom:6px;">
        <strong>${trip.clientName || "Client itinerary"}</strong>
      </div>
      <div style="font-size:11px; line-height:1.5;">
        <div><strong>Trip</strong>: ${trip.name}</div>
        <div><strong>Dates</strong>: ${dateText}</div>
        <div><strong>Sections</strong>: ${totalSections}</div>
        <div><strong>Items</strong>: ${totalItems}</div>
      </div>
    `;
  }

  function renderTripNotes() {
    const trip = findActiveTrip();
    const notesEl = document.getElementById("trip-notes");
    const packingEl = document.getElementById("trip-packing");
    if (!trip) {
      notesEl.value = "";
      packingEl.value = "";
      return;
    }
    notesEl.value = trip.notes || "";
    packingEl.value = trip.packingNotes || "";
  }

  function renderBoard() {
    const sectionsContainer = document.getElementById("sections-container");
    const trip = findActiveTrip();
    if (!trip) {
      sectionsContainer.innerHTML = '<div class="av-muted">No active trip selected.</div>';
      return;
    }
    sectionsContainer.innerHTML = "";

    const planningMode = appState.settings.planningMode; // "structured" or "hybrid"

    // For conflict calculation, we use per-section items.
    trip.sections.forEach((section) => {
      const sectionEl = document.createElement("div");
      sectionEl.className = "av-section";
      sectionEl.dataset.sectionId = section.id;
      sectionEl.setAttribute("draggable", "true");

      const headerEl = document.createElement("div");
      headerEl.className = "av-section-header";

      const headerRow = document.createElement("div");
      headerRow.className = "av-section-header-row";

      const titleEl = document.createElement("div");
      titleEl.className = "av-section-title";
      titleEl.textContent = section.title || "Section";
      titleEl.contentEditable = "true";
      titleEl.spellcheck = false;
      titleEl.addEventListener("blur", () => {
        const newTitle = titleEl.textContent.trim();
        if (newTitle === section.title) return;
        applyMutation("section.rename", (state) => {
          const t = state.trips.find((tr) => tr.id === trip.id);
          const s = t.sections.find((sec) => sec.id === section.id);
          s.title = newTitle || "Section";
        });
      });

      const actionsEl = document.createElement("div");
      actionsEl.className = "av-section-actions";

      const addItemBtn = document.createElement("button");
      addItemBtn.className = "av-icon-btn";
      addItemBtn.title = "Add item to section";
      addItemBtn.textContent = "+";
      addItemBtn.addEventListener("click", () => {
        addItemToSection(section.id);
      });

      const notesBtn = document.createElement("button");
      notesBtn.className = "av-icon-btn";
      notesBtn.title = "Edit section notes";
      notesBtn.textContent = "✎";
      notesBtn.addEventListener("click", () => {
        selectEntity({ type: "section", tripId: trip.id, sectionId: section.id });
      });

      const delBtn = document.createElement("button");
      delBtn.className = "av-icon-btn";
      delBtn.title = "Delete section";
      delBtn.textContent = "×";
      delBtn.addEventListener("click", () => {
        if (!confirm("Delete this section and all of its items?")) return;
        applyMutation("section.delete", (state) => {
          const t = state.trips.find((tr) => tr.id === trip.id);
          t.sections = t.sections.filter((sec) => sec.id !== section.id);
          delete state.uiState.expandedSections[section.id];
        });
      });

      actionsEl.appendChild(addItemBtn);
      actionsEl.appendChild(notesBtn);
      actionsEl.appendChild(delBtn);

      headerRow.appendChild(titleEl);
      headerRow.appendChild(actionsEl);

      const metaRow = document.createElement("div");
      metaRow.className = "av-section-meta";

      const badges = document.createElement("div");
      badges.className = "av-section-badges";

      const countBadge = document.createElement("span");
      countBadge.className = "av-badge av-badge-soft";
      countBadge.textContent = `${section.items.length} item${
        section.items.length === 1 ? "" : "s"
      }`;
      badges.appendChild(countBadge);

      const travelIntense =
        section.items.filter(
          (it) =>
            (it.category || "").toLowerCase().includes("travel") ||
            (it.title || "").toLowerCase().includes("transfer") ||
            (it.title || "").toLowerCase().includes("flight")
        ).length >= 3;
      if (travelIntense && appState.settings.smartAssistEnabled) {
        const warnBadge = document.createElement("span");
        warnBadge.className = "av-badge av-badge-warn";
        warnBadge.textContent = "Travel-heavy";
        badges.appendChild(warnBadge);
      }

      const expandToggle = document.createElement("button");
      expandToggle.className = "av-icon-btn";
      const expanded = appState.uiState.expandedSections[section.id] !== false;
      expandToggle.textContent = expanded ? "–" : "+";
      expandToggle.title = expanded ? "Collapse section" : "Expand section";
      expandToggle.addEventListener("click", () => {
        applyMutation("section.toggleExpand", (state) => {
          const val = state.uiState.expandedSections[section.id];
          state.uiState.expandedSections[section.id] = !val;
        });
      });

      metaRow.appendChild(badges);
      metaRow.appendChild(expandToggle);

      headerEl.appendChild(headerRow);
      headerEl.appendChild(metaRow);
      sectionEl.appendChild(headerEl);

      const bodyEl = document.createElement("div");
      bodyEl.className = "av-section-body";
      bodyEl.dataset.sectionId = section.id;

      if (!expanded) {
        bodyEl.style.display = "none";
      }

      const itemsWithInfo = section.items.map((it) => {
        const spanInfo = dateSpanInfo(it);
        return { item: it, spanInfo };
      });

      if (planningMode === "structured") {
        itemsWithInfo.sort((a, b) => {
          const ad =
            a.spanInfo && a.spanInfo.start ? a.spanInfo.start.getTime() : Infinity;
          const bd =
            b.spanInfo && b.spanInfo.start ? b.spanInfo.start.getTime() : Infinity;
          return ad - bd;
        });
      }

      // Conflict detection
      const conflictIds = new Set();
      for (let i = 0; i < itemsWithInfo.length; i++) {
        for (let j = i + 1; j < itemsWithInfo.length; j++) {
          const a = itemsWithInfo[i];
          const b = itemsWithInfo[j];
          if (!a.spanInfo || !b.spanInfo) continue;
          const sameDay =
            a.spanInfo.start.toDateString() === b.spanInfo.start.toDateString();
          if (!sameDay) continue;
          const overlap =
            a.spanInfo.start < b.spanInfo.end && b.spanInfo.start < a.spanInfo.end;
          if (overlap) {
            conflictIds.add(a.item.id);
            conflictIds.add(b.item.id);
          }
        }
      }

      itemsWithInfo.forEach(({ item, spanInfo }) => {
        const itemEl = document.createElement("div");
        itemEl.className = "av-item";
        itemEl.dataset.itemId = item.id;
        itemEl.dataset.sectionId = section.id;
        itemEl.setAttribute("draggable", "true");

        if (item.spanning || (spanInfo && spanInfo.spanning)) {
          itemEl.classList.add("av-item-spanning");
        }
        if (conflictIds.has(item.id)) {
          itemEl.classList.add("av-item-conflict");
        }

        const header = document.createElement("div");
        header.className = "av-item-header";

        const main = document.createElement("div");
        main.className = "av-item-main";

        const emojiEl = document.createElement("div");
        emojiEl.className = "av-item-emoji";
        emojiEl.textContent = item.emoji || "📌";
        emojiEl.title = "Click to override emoji";
        emojiEl.addEventListener("click", () => {
          const manual = prompt("Custom emoji for this item:", item.emoji || "");
          if (manual === null) return;
          applyMutation("item.emojiOverride", (state) => {
            const sTrip = state.trips.find((t) => t.id === trip.id);
            const sSec = sTrip.sections.find((sec) => sec.id === section.id);
            const sItem = sSec.items.find((it) => it.id === item.id);
            sItem.emoji = manual || "📌";
            sItem.emojiLocked = !!manual;
          });
        });

        const titleEl = document.createElement("div");
        titleEl.className = "av-item-title";
        titleEl.contentEditable = "true";
        titleEl.spellcheck = false;
        titleEl.textContent = item.title || "Item";
        titleEl.addEventListener("blur", () => {
          const newTitle = titleEl.textContent.trim();
          if (newTitle === item.title) return;
          applyMutation("item.rename", (state) => {
            const sTrip = state.trips.find((t) => t.id === trip.id);
            const sSec = sTrip.sections.find((sec) => sec.id === section.id);
            const sItem = sSec.items.find((it) => it.id === item.id);
            sItem.title = newTitle || "Item";
            if (state.settings.smartAssistEnabled && !sItem.emojiLocked) {
              sItem.emoji = suggestEmojiForItem(sItem);
            }
          });
        });

        main.appendChild(emojiEl);
        main.appendChild(titleEl);

        const actions = document.createElement("div");
        actions.className = "av-item-actions";

        const dupBtn = document.createElement("button");
        dupBtn.className = "av-icon-btn";
        dupBtn.title = "Duplicate item";
        dupBtn.textContent = "⧉";
        dupBtn.addEventListener("click", () => {
          applyMutation("item.duplicate", (state) => {
            const t = state.trips.find((t2) => t2.id === trip.id);
            const s = t.sections.find((sec) => sec.id === section.id);
            const idx = s.items.findIndex((it) => it.id === item.id);
            if (idx === -1) return;
            const copy = cloneState(s.items[idx]);
            copy.id = generateId("item");
            s.items.splice(idx + 1, 0, copy);
          });
        });

        const delBtnItem = document.createElement("button");
        delBtnItem.className = "av-icon-btn";
        delBtnItem.title = "Delete item";
        delBtnItem.textContent = "×";
        delBtnItem.addEventListener("click", () => {
          if (!confirm("Delete this item?")) return;
          applyMutation("item.delete", (state) => {
            const t = state.trips.find((t2) => t2.id === trip.id);
            const s = t.sections.find((sec) => sec.id === section.id);
            s.items = s.items.filter((it) => it.id !== item.id);
          });
        });

        actions.appendChild(dupBtn);
        actions.appendChild(delBtnItem);

        header.appendChild(main);
        header.appendChild(actions);

        const meta = document.createElement("div");
        meta.className = "av-item-meta";
        const timeLabel = document.createElement("span");
        timeLabel.className = "av-item-time";
        if (item.untimed) {
          timeLabel.textContent = "Untimed";
        } else if (item.startDateTime && item.endDateTime) {
          const s = new Date(item.startDateTime);
          const e = new Date(item.endDateTime);
          if (!Number.isNaN(s.getTime()) && !Number.isNaN(e.getTime())) {
            const sameDay = s.toDateString() === e.toDateString();
            const fmt = (d) =>
              `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
                2,
                "0"
              )}-${String(d.getDate()).padStart(2, "0")} ${String(
                d.getHours()
              ).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
            timeLabel.textContent = sameDay
              ? `${fmt(s)} → ${String(e.getHours()).padStart(2, "0")}:${String(
                  e.getMinutes()
                ).padStart(2, "0")}`
              : `${fmt(s)} → ${fmt(e)}`;
          } else {
            timeLabel.textContent = "Time not set";
          }
        } else {
          timeLabel.textContent = "Time not set";
        }
        meta.appendChild(timeLabel);

        if (item.category) {
          const catBadge = document.createElement("span");
          catBadge.className = "av-item-category";
          catBadge.textContent = item.category;
          meta.appendChild(catBadge);
        }

        if (item.alternatives && item.alternatives.length) {
          const altBadge = document.createElement("span");
          altBadge.className = "av-item-alt-pill";
          altBadge.textContent = `${item.alternatives.length} alt`;
          meta.appendChild(altBadge);
        }

        itemEl.appendChild(header);
        itemEl.appendChild(meta);

        if (item.alternatives && item.alternatives.length) {
          const altRow = document.createElement("div");
          altRow.className = "av-item-alt-row";
          item.alternatives.slice(0, 3).forEach((alt) => {
            const altEl = document.createElement("div");
            altEl.className = "av-item-alt";
            if (item.activeAlternativeId === alt.id) {
              altEl.classList.add("av-item-alt-active");
            }
            altEl.textContent = alt.title || "Alternative";
            altEl.title = "Click to set active alternative";
            altEl.addEventListener("click", () => {
              applyMutation("item.alt.setActive", (state) => {
                const t = state.trips.find((t2) => t2.id === trip.id);
                const s = t.sections.find((sec) => sec.id === section.id);
                const sItem = s.items.find((it) => it.id === item.id);
                sItem.activeAlternativeId = alt.id;
              });
            });
            altRow.appendChild(altEl);
          });
          itemEl.appendChild(altRow);
        }

        itemEl.addEventListener("click", () => {
          selectEntity({
            type: "item",
            tripId: trip.id,
            sectionId: section.id,
            itemId: item.id,
          });
        });

        // Drag events for items
        itemEl.addEventListener("dragstart", (e) => {
          e.dataTransfer.effectAllowed = "move";
          e.dataTransfer.setData(
            "text/plain",
            JSON.stringify({
              kind: "item",
              itemId: item.id,
              fromSectionId: section.id,
            })
          );
          itemEl.classList.add("av-item-dragging");
        });
        itemEl.addEventListener("dragend", () => {
          itemEl.classList.remove("av-item-dragging");
        });

        bodyEl.appendChild(itemEl);
      });

      // Drop target to append items into section
      bodyEl.addEventListener("dragover", (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
      });
      bodyEl.addEventListener("drop", (e) => {
        e.preventDefault();
        const raw = e.dataTransfer.getData("text/plain");
        if (!raw) return;
        let data;
        try {
          data = JSON.parse(raw);
        } catch {
          return;
        }
        if (data.kind === "item") {
          moveItemBetweenSections(data.itemId, data.fromSectionId, section.id);
        } else if (data.kind === "section") {
          // ignore; section-level handled elsewhere
        }
      });

      // Drag events for sections (reorder)
      sectionEl.addEventListener("dragstart", (e) => {
        if (e.target !== sectionEl && !sectionEl.contains(e.target)) return;
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData(
          "text/plain",
          JSON.stringify({ kind: "section", sectionId: section.id })
        );
        sectionEl.classList.add("av-item-dragging");
      });
      sectionEl.addEventListener("dragend", () => {
        sectionEl.classList.remove("av-item-dragging");
      });
      sectionEl.addEventListener("dragover", (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
      });
      sectionEl.addEventListener("drop", (e) => {
        e.preventDefault();
        const raw = e.dataTransfer.getData("text/plain");
        if (!raw) return;
        let data;
        try {
          data = JSON.parse(raw);
        } catch {
          return;
        }
        if (data.kind === "section") {
          reorderSections(data.sectionId, section.id);
        }
      });

      sectionEl.appendChild(bodyEl);
      sectionsContainer.appendChild(sectionEl);
    });
  }

  function renderInspector() {
    const panel = document.getElementById("inspector-panel");
    const empty = document.getElementById("inspector-empty");
    const sel = appState.uiState.selectedEntity;
    const trip = findActiveTrip();
    if (!trip || !sel) {
      panel.style.display = "none";
      empty.style.display = "block";
      return;
    }
    empty.style.display = "none";
    panel.style.display = "block";
    panel.innerHTML = "";

    if (sel.type === "section") {
      const section = trip.sections.find((s) => s.id === sel.sectionId);
      if (!section) return;
      const title = document.createElement("div");
      title.innerHTML = `<div class="av-muted">Section notes</div>`;
      const textarea = document.createElement("textarea");
      textarea.className = "av-textarea";
      textarea.value = section.notes || "";
      textarea.style.minHeight = "120px";
      textarea.addEventListener("blur", () => {
        const newNotes = textarea.value;
        if (newNotes === section.notes) return;
        applyMutation("section.notes.update", (state) => {
          const t = state.trips.find((t2) => t2.id === trip.id);
          const s = t.sections.find((sec) => sec.id === section.id);
          s.notes = newNotes;
        });
      });
      panel.appendChild(title);
      panel.appendChild(textarea);
      return;
    }

    if (sel.type === "item") {
      const section = trip.sections.find((s) => s.id === sel.sectionId);
      if (!section) return;
      const item = section.items.find((it) => it.id === sel.itemId);
      if (!item) return;

      const wrapper = document.createElement("div");
      wrapper.style.display = "flex";
      wrapper.style.flexDirection = "column";
      wrapper.style.gap = "8px";

      const heading = document.createElement("div");
      heading.innerHTML = `<div class="av-muted">Item details</div><div style="font-size:13px;font-weight:600;">${
        item.title || "Item"
      }</div>`;
      wrapper.appendChild(heading);

      const catRow = document.createElement("div");
      catRow.style.display = "flex";
      catRow.style.gap = "6px";
      catRow.style.alignItems = "center";
      const catLabel = document.createElement("span");
      catLabel.className = "av-muted";
      catLabel.textContent = "Category";
      const catInput = document.createElement("input");
      catInput.type = "text";
      catInput.value = item.category || "";
      catInput.className = "av-textarea";
      catInput.style.minHeight = "auto";
      catInput.style.height = "26px";
      catInput.style.resize = "none";
      catInput.addEventListener("blur", () => {
        const newVal = catInput.value.trim();
        if (newVal === item.category) return;
        applyMutation("item.category.update", (state) => {
          const t = state.trips.find((t2) => t2.id === trip.id);
          const s = t.sections.find((sec) => sec.id === section.id);
          const it = s.items.find((i2) => i2.id === item.id);
          it.category = newVal;
          if (state.settings.smartAssistEnabled && !it.emojiLocked) {
            it.emoji = suggestEmojiForItem(it);
          }
        });
      });
      catRow.appendChild(catLabel);
      catRow.appendChild(catInput);
      wrapper.appendChild(catRow);

      const locRow = document.createElement("div");
      locRow.style.display = "flex";
      locRow.style.flexDirection = "column";
      const locLabel = document.createElement("span");
      locLabel.className = "av-muted";
      locLabel.textContent = "Location";
      const locInput = document.createElement("input");
      locInput.type = "text";
      locInput.value = item.location || "";
      locInput.className = "av-textarea";
      locInput.style.minHeight = "auto";
      locInput.style.height = "26px";
      locInput.style.resize = "none";
      locInput.addEventListener("blur", () => {
        const newVal = locInput.value.trim();
        if (newVal === item.location) return;
        applyMutation("item.location.update", (state) => {
          const t = state.trips.find((t2) => t2.id === trip.id);
          const s = t.sections.find((sec) => sec.id === section.id);
          const it = s.items.find((i2) => i2.id === item.id);
          it.location = newVal;
        });
      });
      locRow.appendChild(locLabel);
      locRow.appendChild(locInput);
      wrapper.appendChild(locRow);

      const timeRow = document.createElement("div");
      timeRow.style.display = "grid";
      timeRow.style.gridTemplateColumns = "1fr 1fr";
      timeRow.style.gap = "6px";
      const startInput = document.createElement("input");
      startInput.type = "datetime-local";
      startInput.value = item.startDateTime || "";
      startInput.className = "av-textarea";
      startInput.style.minHeight = "auto";
      startInput.style.height = "28px";
      startInput.style.resize = "none";
      const endInput = document.createElement("input");
      endInput.type = "datetime-local";
      endInput.value = item.endDateTime || "";
      endInput.className = "av-textarea";
      endInput.style.minHeight = "auto";
      endInput.style.height = "28px";
      endInput.style.resize = "none";

      const untimedLabel = document.createElement("label");
      untimedLabel.className = "av-muted";
      untimedLabel.style.display = "flex";
      untimedLabel.style.alignItems = "center";
      untimedLabel.style.gap = "4px";
      const untimedChk = document.createElement("input");
      untimedChk.type = "checkbox";
      untimedChk.checked = !!item.untimed;
      untimedLabel.appendChild(untimedChk);
      untimedLabel.appendChild(document.createTextNode("Untimed"));

      const spanLabel = document.createElement("label");
      spanLabel.className = "av-muted";
      spanLabel.style.display = "flex";
      spanLabel.style.alignItems = "center";
      spanLabel.style.gap = "4px";
      const spanChk = document.createElement("input");
      spanChk.type = "checkbox";
      spanChk.checked = !!item.spanning;
      spanLabel.appendChild(spanChk);
      spanLabel.appendChild(document.createTextNode("Multi-day span"));

      function commitTimeChange() {
        const newStart = startInput.value || null;
        const newEnd = endInput.value || null;
        const newUntimed = !!untimedChk.checked;
        const newSpan = !!spanChk.checked;
        applyMutation("item.time.update", (state) => {
          const t = state.trips.find((t2) => t2.id === trip.id);
          const s = t.sections.find((sec) => sec.id === section.id);
          const it = s.items.find((i2) => i2.id === item.id);
          it.startDateTime = newStart;
          it.endDateTime = newEnd;
          it.untimed = newUntimed;
          it.spanning = newSpan;
        });
      }

      startInput.addEventListener("change", commitTimeChange);
      endInput.addEventListener("change", commitTimeChange);
      untimedChk.addEventListener("change", commitTimeChange);
      spanChk.addEventListener("change", commitTimeChange);

      timeRow.appendChild(startInput);
      timeRow.appendChild(endInput);
      wrapper.appendChild(timeRow);

      const flagsRow = document.createElement("div");
      flagsRow.style.display = "flex";
      flagsRow.style.gap = "8px";
      flagsRow.appendChild(untimedLabel);
      flagsRow.appendChild(spanLabel);
      wrapper.appendChild(flagsRow);

      const notesLabel = document.createElement("div");
      notesLabel.className = "av-muted";
      notesLabel.textContent = "Item notes";
      const notesArea = document.createElement("textarea");
      notesArea.className = "av-textarea";
      notesArea.style.minHeight = "110px";
      notesArea.value = item.notes || "";
      notesArea.addEventListener("blur", () => {
        const newVal = notesArea.value;
        if (newVal === item.notes) return;
        applyMutation("item.notes.update", (state) => {
          const t = state.trips.find((t2) => t2.id === trip.id);
          const s = t.sections.find((sec) => sec.id === section.id);
          const it = s.items.find((i2) => i2.id === item.id);
          it.notes = newVal;
        });
      });
      wrapper.appendChild(notesLabel);
      wrapper.appendChild(notesArea);

      const attachmentsLabel = document.createElement("div");
      attachmentsLabel.className = "av-muted";
      attachmentsLabel.textContent = "Attachments (one per line: Label | URL)";
      const attachmentsArea = document.createElement("textarea");
      attachmentsArea.className = "av-textarea";
      attachmentsArea.style.minHeight = "80px";
      attachmentsArea.placeholder = "Example: Airport map | https://example.com/map";
      const attachmentsValue =
        item.attachments && item.attachments.length
          ? item.attachments
              .map((att) => `${att.label || ""} | ${att.url || ""}`.trim())
              .join("\n")
          : "";
      attachmentsArea.value = attachmentsValue;
      attachmentsArea.addEventListener("blur", () => {
        const lines = attachmentsArea.value
          .split("\n")
          .map((l) => l.trim())
          .filter(Boolean);
        applyMutation("item.attachments.update", (state) => {
          const t = state.trips.find((t2) => t2.id === trip.id);
          const s = t.sections.find((sec) => sec.id === section.id);
          const it = s.items.find((i2) => i2.id === item.id);
          it.attachments =
            lines.map((line) => {
              const parts = line.split("|");
              const labelPart = (parts[0] || "").trim();
              const urlPart = (parts[1] || "").trim();
              return {
                id: generateId("att"),
                label: labelPart,
                url: urlPart,
              };
            }) || [];
        });
      });
      wrapper.appendChild(attachmentsLabel);
      wrapper.appendChild(attachmentsArea);

      const coordsLabel = document.createElement("div");
      coordsLabel.className = "av-muted";
      coordsLabel.textContent = "Map coordinates (lat, lng)";
      const coordsRow = document.createElement("div");
      coordsRow.style.display = "flex";
      coordsRow.style.gap = "6px";
      const latInput = document.createElement("input");
      latInput.type = "number";
      latInput.placeholder = "Lat";
      latInput.step = "0.000001";
      const lngInput = document.createElement("input");
      lngInput.type = "number";
      lngInput.placeholder = "Lng";
      lngInput.step = "0.000001";
      latInput.className = "av-textarea";
      lngInput.className = "av-textarea";
      latInput.style.height = "26px";
      lngInput.style.height = "26px";
      latInput.style.minHeight = "auto";
      lngInput.style.minHeight = "auto";
      latInput.style.resize = "none";
      lngInput.style.resize = "none";
      if (item.coords && typeof item.coords.lat === "number") {
        latInput.value = String(item.coords.lat);
      }
      if (item.coords && typeof item.coords.lng === "number") {
        lngInput.value = String(item.coords.lng);
      }

      function commitCoords() {
        const latVal = latInput.value.trim();
        const lngVal = lngInput.value.trim();
        applyMutation("item.coords.update", (state) => {
          const t = state.trips.find((t2) => t2.id === trip.id);
          const s = t.sections.find((sec) => sec.id === section.id);
          const it = s.items.find((i2) => i2.id === item.id);
          if (!latVal || !lngVal) {
            delete it.coords;
          } else {
            const lat = parseFloat(latVal);
            const lng = parseFloat(lngVal);
            if (!Number.isNaN(lat) && !Number.isNaN(lng)) {
              it.coords = { lat, lng };
            }
          }
        });
      }

      latInput.addEventListener("blur", commitCoords);
      lngInput.addEventListener("blur", commitCoords);

      coordsRow.appendChild(latInput);
      coordsRow.appendChild(lngInput);
      wrapper.appendChild(coordsLabel);
      wrapper.appendChild(coordsRow);

      const altBtnRow = document.createElement("div");
      altBtnRow.style.display = "flex";
      altBtnRow.style.justifyContent = "space-between";
      altBtnRow.style.marginTop = "6px";
      const addAltBtn = document.createElement("button");
      addAltBtn.className = "av-btn av-btn-small av-btn-ghost";
      addAltBtn.textContent = "+ Add alternative option";
      addAltBtn.addEventListener("click", () => {
        applyMutation("item.alt.add", (state) => {
          const t = state.trips.find((t2) => t2.id === trip.id);
          const s = t.sections.find((sec) => sec.id === section.id);
          const it = s.items.find((i2) => i2.id === item.id);
          const alt = {
            id: generateId("alt"),
            title: (it.title || "Alt") + " (alt)",
            category: it.category || "",
            location: it.location || "",
            startDateTime: it.startDateTime || null,
            endDateTime: it.endDateTime || null,
            untimed: !!it.untimed,
            spanning: !!it.spanning,
            notes: "",
            attachments: [],
            emoji: it.emoji || "📌",
            emojiLocked: false,
            colorTag: it.colorTag || "#38bdf8",
            isCollapsed: false,
          };
          it.alternatives = it.alternatives || [];
          it.alternatives.push(alt);
        });
      });
      altBtnRow.appendChild(addAltBtn);
      wrapper.appendChild(altBtnRow);

      panel.appendChild(wrapper);
      return;
    }
  }

  // -----------------------------
  // Map rendering (Leaflet)
  // -----------------------------
  let mapInstance = null;
  let mapLayerGroup = null;

  function ensureMap() {
    if (!window.L) {
      logWarn("map.leaflet.missing");
      return null;
    }
    if (!mapInstance) {
      mapInstance = L.map("map").setView([35.6762, 139.6503], 4);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
        attribution: "",
      }).addTo(mapInstance);
      mapLayerGroup = L.layerGroup().addTo(mapInstance);
      logInfo("map.init");
    }
    return mapInstance;
  }

  function renderMap() {
    if (!appState.settings.mapEnabled) return;
    const map = ensureMap();
    if (!map || !mapLayerGroup) return;
    mapLayerGroup.clearLayers();

    const trip = findActiveTrip();
    if (!trip) return;

    const coordsList = [];
    trip.sections.forEach((section) => {
      section.items.forEach((item) => {
        if (item.coords && typeof item.coords.lat === "number") {
          coordsList.push({
            latlng: [item.coords.lat, item.coords.lng],
            label: item.title || "Item",
          });
        }
      });
    });

    if (!coordsList.length) return;

    coordsList.forEach((c) => {
      L.circleMarker(c.latlng, {
        radius: 6,
        color: "#38bdf8",
        fillColor: "#0ea5e9",
        fillOpacity: 0.9,
        weight: 2,
      })
        .bindPopup(c.label)
        .addTo(mapLayerGroup);
    });

    const latLngs = coordsList.map((c) => c.latlng);
    L.polyline(latLngs, {
      color: "#f97316",
      weight: 2,
      opacity: 0.85,
      dashArray: "4,6",
    }).addTo(mapLayerGroup);

    map.fitBounds(latLngs, { padding: [20, 20] });
  }

  // -----------------------------
  // Selection
  // -----------------------------
  function selectEntity(sel) {
    appState.uiState.selectedEntity = sel;
    renderInspector();
  }

  // -----------------------------
  // Item & section operations
  // -----------------------------
  function addSection() {
    const trip = findActiveTrip();
    if (!trip) return;
    const newId = generateId("section");
    applyMutation("section.add", (state) => {
      const t = state.trips.find((tr) => tr.id === trip.id);
      t.sections.push({
        id: newId,
        title: "New section",
        notes: "",
        colorTag: "#38bdf8",
        items: [],
      });
      state.uiState.expandedSections[newId] = true;
    });
  }

  function addItemToSection(sectionId) {
    const trip = findActiveTrip();
    if (!trip) return;
    applyMutation("item.add", (state) => {
      const t = state.trips.find((tr) => tr.id === trip.id);
      const s = t.sections.find((sec) => sec.id === sectionId);
      if (!s) return;
      const item = {
        id: generateId("item"),
        title: "New item",
        category: "",
        location: "",
        startDateTime: null,
        endDateTime: null,
        untimed: true,
        spanning: false,
        notes: "",
        attachments: [],
        emoji: "📌",
        emojiLocked: false,
        colorTag: "#38bdf8",
        isCollapsed: false,
        alternatives: [],
        activeAlternativeId: null,
      };
      if (state.settings.smartAssistEnabled) {
        item.emoji = suggestEmojiForItem(item);
      }
      s.items.push(item);
      state.uiState.selectedEntity = {
        type: "item",
        tripId: trip.id,
        sectionId: sectionId,
        itemId: item.id,
      };
    });
  }

  function moveItemBetweenSections(itemId, fromSectionId, toSectionId) {
    // Allow same-section drops to act as reordering (item moves to end).
    const trip = findActiveTrip();
    if (!trip) return;
    applyMutation("item.moveSection", (state) => {
      const t = state.trips.find((tr) => tr.id === trip.id);
      const from = t.sections.find((s) => s.id === fromSectionId);
      const to = t.sections.find((s) => s.id === toSectionId);
      if (!from || !to) return;
      const idx = from.items.findIndex((it) => it.id === itemId);
      if (idx === -1) return;
      const [moved] = from.items.splice(idx, 1);
      to.items.push(moved);
    });
  }

  function reorderSections(sourceSectionId, targetSectionId) {
    if (sourceSectionId === targetSectionId) return;
    const trip = findActiveTrip();
    if (!trip) return;
    applyMutation("section.reorder", (state) => {
      const t = state.trips.find((tr) => tr.id === trip.id);
      const srcIdx = t.sections.findIndex((s) => s.id === sourceSectionId);
      const tgtIdx = t.sections.findIndex((s) => s.id === targetSectionId);
      if (srcIdx === -1 || tgtIdx === -1) return;
      const [sec] = t.sections.splice(srcIdx, 1);
      t.sections.splice(tgtIdx, 0, sec);
    });
  }

  // -----------------------------
  // Trips
  // -----------------------------
  function addTrip() {
    const newId = generateId("trip");
    applyMutation("trip.add", (state) => {
      const trip = {
        id: newId,
        name: "New itinerary",
        clientName: "",
        dateRange: { start: null, end: null },
        notes: "",
        packingNotes: "",
        sections: [],
      };
      state.trips.push(trip);
      state.uiState.activeTripId = newId;
      state.uiState.selectedEntity = { type: "trip", tripId: newId };
    });
    showToast("New trip created.", "success");
  }

  function duplicateTrip() {
    const trip = findActiveTrip();
    if (!trip) return;
    applyMutation("trip.duplicate", (state) => {
      const original = state.trips.find((t) => t.id === trip.id);
      const copy = cloneState(original);
      const newId = generateId("trip");
      copy.id = newId;
      copy.name = `${copy.name} (copy)`;
      state.trips.push(copy);
      state.uiState.activeTripId = newId;
      state.uiState.selectedEntity = { type: "trip", tripId: newId };
    });
    showToast("Trip duplicated as template.", "success");
  }

  // -----------------------------
  // Save / Load
  // -----------------------------
  function buildSavePayload() {
    const payload = {
      version: APP_VERSION,
      settings: appState.settings,
      uiState: appState.uiState,
      trips: appState.trips,
      metadata: {
        savedAt: new Date().toISOString(),
        product: "Aurora Voyage",
      },
    };
    return payload;
  }

  function downloadSaveFile() {
    try {
      const payload = buildSavePayload();
      const blob = new Blob([JSON.stringify(payload, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const trip = findActiveTrip();
      const nameSafe = (trip?.name || "aurora-itinerary").replace(/[^\w\d]+/g, "-");
      a.download = `${nameSafe}.auroravoyage.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      appState._meta.lastSavedAt = new Date().toISOString();
      appState._meta.hasUnsavedChanges = false;
      renderUnsavedIndicator();
      showToast("Save file downloaded.", "success");
      logInfo("save.download.success");
    } catch (err) {
      logError("save.download.error", { error: String(err) });
      showToast("Failed to create save file. See console for details.", "error");
    }
  }

  function handleLoadFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const raw = e.target.result;
        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed !== "object") {
          throw new Error("Invalid save file structure");
        }
        if (!parsed.trips || !Array.isArray(parsed.trips)) {
          throw new Error("Missing trips array in save file");
        }
        if (!parsed.settings || !parsed.uiState) {
          throw new Error("Missing settings/uiState in save file");
        }
        applyMutation("save.load", (state) => {
          state.version = parsed.version || APP_VERSION;
          state.settings = parsed.settings;
          state.uiState = parsed.uiState;
          state.trips = parsed.trips;
          state._meta.lastSavedAt = new Date().toISOString();
          state._meta.hasUnsavedChanges = false;
        });
        showToast("Save file loaded.", "success");
        logInfo("save.load.success", { version: parsed.version });
      } catch (err) {
        logError("save.load.error", { error: String(err) });
        showToast("Failed to load save file. See console for details.", "error");
      }
    };
    reader.readAsText(file);
  }

  function renderUnsavedIndicator() {
    const titleBase = "Aurora Voyage – Premium Itinerary Studio";
    document.title = appState._meta.hasUnsavedChanges ? `* ${titleBase}` : titleBase;
  }

  // -----------------------------
  // Presentation export
  // -----------------------------
  function exportPresentation() {
    const trip = findActiveTrip();
    if (!trip) {
      showToast("No active trip to export.", "error");
      return;
    }
    try {
      const win = window.open("", "_blank");
      if (!win) {
        showToast("Pop-up blocked. Allow pop-ups for presentation export.", "error");
        return;
      }
      const doc = win.document;
      const html = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>${trip.name} – Aurora Voyage Presentation</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      body {
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", "Segoe UI", sans-serif;
        margin: 0;
        padding: 24px 16px 32px;
        background: #0f172a;
        color: #f9fafb;
      }
      .shell {
        max-width: 960px;
        margin: 0 auto;
        background: radial-gradient(circle at top left, rgba(248, 250, 252, 0.16), transparent 55%), #020617;
        border-radius: 24px;
        border: 1px solid rgba(148, 163, 184, 0.4);
        padding: 24px 24px 22px;
        box-shadow: 0 24px 80px rgba(0, 0, 0, 0.7);
      }
      header {
        display: flex;
        justify-content: space-between;
        gap: 12px;
        align-items: flex-start;
        margin-bottom: 16px;
      }
      .brand {
        display: flex;
        gap: 10px;
        align-items: center;
      }
      .brand-mark {
        width: 34px;
        height: 34px;
        border-radius: 999px;
        background: radial-gradient(circle at 20% 0, #ffb86c, #ff6b81);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #020617;
        font-weight: 700;
      }
      .brand-text-upper {
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 0.14em;
        color: #9ca3af;
      }
      .trip-title {
        font-size: 20px;
        font-weight: 650;
      }
      .meta {
        font-size: 12px;
        color: #9ca3af;
        text-align: right;
      }
      .meta strong {
        color: #e5e7eb;
      }
      .grid {
        display: grid;
        grid-template-columns: minmax(0, 2fr) minmax(0, 1.1fr);
        gap: 20px;
      }
      .card {
        background: rgba(15, 23, 42, 0.9);
        border-radius: 18px;
        border: 1px solid rgba(148, 163, 184, 0.45);
        padding: 14px 14px 12px;
      }
      .card h3 {
        margin: 0 0 6px;
        font-size: 13px;
        text-transform: uppercase;
        letter-spacing: 0.16em;
        color: #9ca3af;
      }
      .card p {
        margin: 3px 0;
        font-size: 12px;
        color: #e5e7eb;
      }
      .sections {
        margin-top: 10px;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .section {
        border-radius: 14px;
        border: 1px solid rgba(148, 163, 184, 0.45);
        padding: 10px 10px 8px;
        background: rgba(15, 23, 42, 0.9);
      }
      .section-title {
        font-size: 13px;
        font-weight: 600;
        margin-bottom: 4px;
      }
      .section-notes {
        font-size: 11px;
        color: #9ca3af;
        margin-bottom: 6px;
      }
      .items {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      .item {
        border-radius: 10px;
        border: 1px solid rgba(31, 41, 55, 0.8);
        padding: 5px 7px 5px;
        font-size: 11px;
        background: radial-gradient(circle at top left, rgba(59, 130, 246, 0.18), transparent 60%), #020617;
      }
      .item-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2px;
      }
      .item-main {
        display: flex;
        gap: 6px;
        align-items: center;
      }
      .item-emoji {
        width: 20px;
        height: 20px;
        border-radius: 999px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(15, 23, 42, 0.9);
      }
      .item-title {
        font-weight: 600;
      }
      .item-meta {
        color: #9ca3af;
        font-size: 10px;
      }
      footer {
        margin-top: 16px;
        text-align: center;
        font-size: 10px;
        color: #6b7280;
      }
      @media (max-width: 720px) {
        .shell {
          padding: 18px 12px;
        }
        .grid {
          grid-template-columns: minmax(0, 1fr);
        }
      }
      @page {
        margin: 10mm;
      }
    </style>
  </head>
  <body>
    <div class="shell">
      <header>
        <div class="brand">
          <div class="brand-mark">AV</div>
          <div>
            <div class="brand-text-upper">Aurora Voyage</div>
            <div class="trip-title">${trip.name}</div>
          </div>
        </div>
        <div class="meta">
          <div><strong>Client</strong>: ${trip.clientName || "—"}</div>
          <div><strong>Dates</strong>: ${
            trip.dateRange && trip.dateRange.start && trip.dateRange.end
              ? `${trip.dateRange.start} → ${trip.dateRange.end}`
              : "Flexible"
          }</div>
        </div>
      </header>
      <div class="grid">
        <div class="card">
          <h3>Itinerary Overview</h3>
          <p>${trip.notes || "Designer notes not provided."}</p>
          <div class="sections">
            ${trip.sections
              .map((section) => {
                const itemsHtml = section.items
                  .map((item) => {
                    const s = item.startDateTime ? new Date(item.startDateTime) : null;
                    const e = item.endDateTime ? new Date(item.endDateTime) : null;
                    const fmt = (d) =>
                      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
                        2,
                        "0"
                      )}-${String(d.getDate()).padStart(2, "0")} ${String(
                        d.getHours()
                      ).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
                    let timeText = "Time flexible";
                    if (item.untimed) {
                      timeText = "Untimed / Flexible";
                    } else if (s && e && !Number.isNaN(s.getTime()) && !Number.isNaN(e.getTime())) {
                      const same =
                        s.toDateString() === e.toDateString();
                      timeText = same
                        ? `${fmt(s)} → ${String(e.getHours()).padStart(2, "0")}:${String(
                            e.getMinutes()
                          ).padStart(2, "0")}`
                        : `${fmt(s)} → ${fmt(e)}`;
                    }
                    return `
                    <div class="item">
                      <div class="item-header">
                        <div class="item-main">
                          <div class="item-emoji">${item.emoji || "📌"}</div>
                          <div class="item-title">${item.title || "Item"}</div>
                        </div>
                        <div class="item-meta">${item.category || ""}</div>
                      </div>
                      <div class="item-meta">${item.location || ""}</div>
                      <div class="item-meta">${timeText}</div>
                    </div>
                    `;
                  })
                  .join("");
                return `
                  <div class="section">
                    <div class="section-title">${section.title || "Section"}</div>
                    ${
                      section.notes
                        ? `<div class="section-notes">${section.notes}</div>`
                        : ""
                    }
                    <div class="items">
                      ${itemsHtml || '<div class="item-meta">No items yet.</div>'}
                    </div>
                  </div>
                `;
              })
              .join("")}
          </div>
        </div>
        <div class="card">
          <h3>Packing &amp; Reminders</h3>
          <p>${trip.packingNotes || "No specific packing notes recorded."}</p>
        </div>
      </div>
      <footer>
        Aurora Voyage – Presentation export.
        Subtle signature: Brewed with love by KT using Cursor.
      </footer>
    </div>
    <script>
      window.addEventListener('load', function () {
        setTimeout(function () {
          window.print();
        }, 400);
      });
    </script>
  </body>
</html>
      `;
      doc.open();
      doc.write(html);
      doc.close();
      logInfo("presentation.export.success");
    } catch (err) {
      logError("presentation.export.error", { error: String(err) });
      showToast("Failed to export presentation. See console for details.", "error");
    }
  }

  // -----------------------------
  // AI structure panel
  // -----------------------------
  function renderAIStructure() {
    const textarea = document.getElementById("ai-structure");
    const trip = findActiveTrip();
    if (!trip) {
      textarea.value = "";
      return;
    }
    const skeleton = {
      version: APP_VERSION,
      trip: {
        id: trip.id,
        name: trip.name,
        clientName: trip.clientName,
        dateRange: trip.dateRange,
        sections: trip.sections.map((s) => ({
          id: s.id,
          title: s.title,
          notes: s.notes,
          items: s.items.map((it) => ({
            id: it.id,
            title: it.title,
            category: it.category,
            location: it.location,
            startDateTime: it.startDateTime,
            endDateTime: it.endDateTime,
            untimed: it.untimed,
            spanning: it.spanning,
            notes: it.notes,
          })),
        })),
      },
    };
    textarea.value = JSON.stringify(skeleton, null, 2);
  }

  function applyAIStructureFromTextarea() {
    const textarea = document.getElementById("ai-structure");
    try {
      const parsed = JSON.parse(textarea.value);
      if (!parsed || !parsed.trip || !parsed.trip.sections) {
        throw new Error("Expected object with 'trip' and 'trip.sections'.");
      }
      const trip = findActiveTrip();
      if (!trip) return;
      applyMutation("ai.applyStructure", (state) => {
        const t = state.trips.find((tr) => tr.id === trip.id);
        t.name = parsed.trip.name || t.name;
        t.clientName = parsed.trip.clientName || t.clientName;
        t.dateRange = parsed.trip.dateRange || t.dateRange;
        t.sections = (parsed.trip.sections || []).map((s) => ({
          id: s.id || generateId("section"),
          title: s.title || "Section",
          notes: s.notes || "",
          colorTag: "#38bdf8",
          items: (s.items || []).map((it) => ({
            id: it.id || generateId("item"),
            title: it.title || "Item",
            category: it.category || "",
            location: it.location || "",
            startDateTime: it.startDateTime || null,
            endDateTime: it.endDateTime || null,
            untimed: !!it.untimed,
            spanning: !!it.spanning,
            notes: it.notes || "",
            attachments: [],
            emoji: "📌",
            emojiLocked: false,
            colorTag: "#38bdf8",
            isCollapsed: false,
            alternatives: [],
            activeAlternativeId: null,
          })),
        }));
      });
      showToast("AI structure applied to current trip.", "success");
    } catch (err) {
      logError("ai.applyStructure.error", { error: String(err) });
      showToast("Invalid AI structure JSON. See console for details.", "error");
    }
  }

  // -----------------------------
  // Keyboard shortcuts
  // -----------------------------
  function handleKeydown(e) {
    const ctrl = e.ctrlKey || e.metaKey;
    const shift = e.shiftKey;
    const alt = e.altKey || e.metaKey && e.altKey;

    if (!ctrl) return;

    switch (e.key.toLowerCase()) {
      case "s":
        e.preventDefault();
        if (alt) {
          addSection();
        } else {
          downloadSaveFile();
        }
        break;
      case "o":
        e.preventDefault();
        document.getElementById("file-input").click();
        break;
      case "n":
        e.preventDefault();
        if (alt) {
          // Add item to first section as default
          const trip = findActiveTrip();
          if (!trip || !trip.sections.length) {
            addSection();
            return;
          }
          addItemToSection(trip.sections[0].id);
        } else {
          addTrip();
        }
        break;
      case "d":
        e.preventDefault();
        duplicateTrip();
        break;
      case "z":
        e.preventDefault();
        if (shift) {
          redo();
        } else {
          undo();
        }
        break;
      case "m":
        e.preventDefault();
        togglePlanningMode();
        break;
      case "l":
        e.preventDefault();
        toggleTheme();
        break;
      case "v":
        if (shift) {
          e.preventDefault();
          toggleLayoutView();
        }
        break;
    }
  }

  // -----------------------------
  // Theme & view toggles
  // -----------------------------
  function applyTheme() {
    const root = document.getElementById("app-root");
    if (!root) return;
    if (appState.settings.theme === "light") {
      root.classList.add("av-theme-light");
    } else {
      root.classList.remove("av-theme-light");
    }
  }

  function toggleTheme() {
    applyMutation("settings.themeToggle", (state) => {
      state.settings.theme = state.settings.theme === "light" ? "dark" : "light";
    });
  }

  function togglePlanningMode() {
    applyMutation("settings.planningModeToggle", (state) => {
      state.settings.planningMode =
        state.settings.planningMode === "structured" ? "hybrid" : "structured";
    });
  }

  function toggleLayoutView() {
    applyMutation("settings.layoutToggle", (state) => {
      state.settings.layoutView =
        state.settings.layoutView === "board" ? "timeline" : "board";
    });
  }

  // -----------------------------
  // Timeline view (simple)
  // -----------------------------
  function renderTimelineOverlay() {
    const container = document.getElementById("sections-container");
    container.innerHTML = "";
    const trip = findActiveTrip();
    if (!trip) return;

    const allItems = [];
    trip.sections.forEach((section) => {
      section.items.forEach((item) => {
        allItems.push({
          sectionTitle: section.title,
          item,
        });
      });
    });

    allItems.sort((a, b) => {
      const ad = a.item.startDateTime ? new Date(a.item.startDateTime).getTime() : Infinity;
      const bd = b.item.startDateTime ? new Date(b.item.startDateTime).getTime() : Infinity;
      return ad - bd;
    });

    const wrapper = document.createElement("div");
    wrapper.style.width = "100%";
    wrapper.style.display = "flex";
    wrapper.style.flexDirection = "column";
    wrapper.style.gap = "6px";

    allItems.forEach((entry) => {
      const row = document.createElement("div");
      row.className = "av-item";
      row.style.cursor = "default";
      const title = document.createElement("div");
      title.textContent = `${entry.item.title || "Item"}  ·  ${
        entry.sectionTitle || ""
      }`;
      title.style.fontSize = "12px";
      const meta = document.createElement("div");
      meta.className = "av-item-meta";
      const spanInfo = dateSpanInfo(entry.item);
      meta.textContent =
        (spanInfo
          ? `${spanInfo.start.toISOString()} → ${spanInfo.end.toISOString()}`
          : "Flexible time") +
        (entry.item.location ? `  •  ${entry.item.location}` : "");
      row.appendChild(title);
      row.appendChild(meta);
      wrapper.appendChild(row);
    });

    container.appendChild(wrapper);
  }

  // -----------------------------
  // Tabs and side panel resizing
  // -----------------------------
  function setupTabs() {
    const tabs = document.querySelectorAll(".av-tab");
    const panels = document.querySelectorAll(".av-tab-panel");
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const name = tab.dataset.tab;
        tabs.forEach((t) => t.classList.toggle("av-tab-active", t === tab));
        panels.forEach((panel) =>
          panel.classList.toggle(
            "av-tab-panel-active",
            panel.dataset.tab === name
          )
        );
        if (name === "map") {
          setTimeout(renderMap, 120);
        }
      });
    });
  }

  function setupRightPanelResize() {
    const handle = document.getElementById("right-resize-handle");
    const sidebar = document.getElementById("right-sidebar");
    if (!handle || !sidebar) return;

    let dragging = false;
    let startX = 0;
    let startWidth = 0;

    handle.addEventListener("mousedown", (e) => {
      dragging = true;
      startX = e.clientX;
      startWidth = sidebar.offsetWidth;
      document.body.style.userSelect = "none";
    });

    window.addEventListener("mousemove", (e) => {
      if (!dragging) return;
      const delta = startX - e.clientX;
      const newWidth = Math.min(Math.max(startWidth + delta, 240), 420);
      sidebar.style.width = `${newWidth}px`;
    });

    window.addEventListener("mouseup", () => {
      dragging = false;
      document.body.style.userSelect = "";
    });
  }

  // -----------------------------
  // Unsaved changes protection
  // -----------------------------
  function setupUnsavedProtection() {
    window.addEventListener("beforeunload", (e) => {
      if (!appState._meta.hasUnsavedChanges) return;
      e.preventDefault();
      e.returnValue = "";
      return "";
    });

    const modal = document.getElementById("unsaved-modal");
    const btnSave = document.getElementById("unsaved-save");
    const btnDiscard = document.getElementById("unsaved-discard");
    const btnCancel = document.getElementById("unsaved-cancel");

    btnSave.addEventListener("click", () => {
      modal.style.display = "none";
      downloadSaveFile();
    });
    btnDiscard.addEventListener("click", () => {
      modal.style.display = "none";
      appState._meta.hasUnsavedChanges = false;
      renderUnsavedIndicator();
      showToast("Changes marked as discarded. Close tab when ready.", "info");
    });
    btnCancel.addEventListener("click", () => {
      modal.style.display = "none";
    });

    // Optional explicit exit control for three-choice flow
    document.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "q") {
        if (!appState._meta.hasUnsavedChanges) {
          window.close();
        } else {
          modal.style.display = "flex";
        }
      }
    });
  }

  // -----------------------------
  // Main render
  // -----------------------------
  function renderAll() {
    applyTheme();
    renderTripSelector();
    renderTripOverview();
    renderTripNotes();

    if (appState.settings.layoutView === "board") {
      renderBoard();
    } else {
      renderTimelineOverlay();
    }

    renderInspector();
    renderAIStructure();
    renderMap();

    // Header toggles
    const planningToggle = document.getElementById("planning-mode-toggle");
    planningToggle.checked = appState.settings.planningMode === "hybrid";
    const aiToggle = document.getElementById("ai-mode-toggle");
    aiToggle.checked = appState.settings.aiMode === "ai";
    const assistToggle = document.getElementById("assist-toggle");
    assistToggle.checked = !!appState.settings.smartAssistEnabled;
    const mapToggle = document.getElementById("map-toggle");
    mapToggle.checked = !!appState.settings.mapEnabled;

    const viewBtn = document.getElementById("btn-toggle-view");
    viewBtn.textContent =
      appState.settings.layoutView === "board" ? "Board View" : "Timeline View";
  }

  // -----------------------------
  // Event bindings
  // -----------------------------
  function bindEvents() {
    document
      .getElementById("trip-selector")
      .addEventListener("change", (e) => {
        const id = e.target.value;
        applyMutation("trip.switch", (state) => {
          state.uiState.activeTripId = id;
          state.uiState.selectedEntity = { type: "trip", tripId: id };
        });
      });

    document.getElementById("btn-add-trip").addEventListener("click", addTrip);
    document
      .getElementById("btn-duplicate-trip")
      .addEventListener("click", duplicateTrip);
    document.getElementById("btn-add-section").addEventListener("click", addSection);

    document.getElementById("btn-save").addEventListener("click", downloadSaveFile);

    document.getElementById("btn-load").addEventListener("click", () => {
      document.getElementById("file-input").click();
    });
    document.getElementById("file-input").addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;
      handleLoadFile(file);
      e.target.value = "";
    });

    document
      .getElementById("btn-export-presentation")
      .addEventListener("click", exportPresentation);

    document.getElementById("btn-theme").addEventListener("click", toggleTheme);

    document
      .getElementById("planning-mode-toggle")
      .addEventListener("change", togglePlanningMode);

    document
      .getElementById("assist-toggle")
      .addEventListener("change", (e) => {
        applyMutation("settings.assistToggle", (state) => {
          state.settings.smartAssistEnabled = !!e.target.checked;
        });
      });

    document.getElementById("map-toggle").addEventListener("change", (e) => {
      applyMutation("settings.mapToggle", (state) => {
        state.settings.mapEnabled = !!e.target.checked;
      });
    });

    document.getElementById("btn-toggle-view").addEventListener("click", () => {
      toggleLayoutView();
    });

    document
      .getElementById("ai-mode-toggle")
      .addEventListener("change", (e) => {
        applyMutation("settings.aiModeToggle", (state) => {
          state.settings.aiMode = e.target.checked ? "ai" : "human";
        });
      });

    document
      .getElementById("btn-apply-ai-structure")
      .addEventListener("click", applyAIStructureFromTextarea);

    document.getElementById("trip-notes").addEventListener("blur", (e) => {
      const trip = findActiveTrip();
      if (!trip) return;
      const newVal = e.target.value;
      if (newVal === trip.notes) return;
      applyMutation("trip.notes.update", (state) => {
        const t = state.trips.find((t2) => t2.id === trip.id);
        t.notes = newVal;
      });
    });

    document.getElementById("trip-packing").addEventListener("blur", (e) => {
      const trip = findActiveTrip();
      if (!trip) return;
      const newVal = e.target.value;
      if (newVal === trip.packingNotes) return;
      applyMutation("trip.packing.update", (state) => {
        const t = state.trips.find((t2) => t2.id === trip.id);
        t.packingNotes = newVal;
      });
    });

    window.addEventListener("keydown", handleKeydown);
  }

  // -----------------------------
  // Bootstrap
  // -----------------------------
  function init() {
    const yearEl = document.getElementById("footer-year");
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }
    setupTabs();
    setupRightPanelResize();
    setupUnsavedProtection();
    bindEvents();
    renderAll();
    logInfo("app.init", { version: APP_VERSION });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

