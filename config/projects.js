// ============================================================
//  PROJECT REGISTRY  —  the single source of truth.
//
//  To add a new experiment:
//    1. Drop its folder at the repo root (e.g.  my-experiment/index.html).
//    2. Add one entry below. `slug` MUST match the folder name.
//  Nothing else changes — the home page renders automatically.
// ============================================================
window.PROJECTS = [
  {
    slug: "voyage-evolution",
    title: "Aurora Voyage → Voyagr",
    tagline: "One itinerary studio built twice. A case-study showcase that tells the evolution story and embeds both live apps — the original (v1) and the final build (v2).",
    tags: ["Case Study", "Itinerary", "v1 → v2"]
  },
  {
    slug: "sign-bridge",
    title: "Sign Bridge — Text to Sign Language",
    tagline: "Turns typed English into a step-by-step sign-language sequence rendered as schematic SVG hand shapes, with a built-in player. Supports ASL and ISL.",
    tags: ["ASL / ISL", "SVG", "Accessibility"]
  }
];
