// Sign data for ASL (American) and ISL (Indian) sign languages.
// Each letter entry produces a schematic SVG of the hand shape plus a
// human-readable description. Word entries map common English words to a
// "tokens" array — when a token isn't found in the word dictionary, the app
// falls back to fingerspelling.

// ---- ASL hand-shape generator ----------------------------------------------
// State per finger:
//   'up'   — fully extended
//   'half' — bent at middle joint
//   'hook' — bent like a claw / X letter
//   'curl' — closed against palm
// State per thumb:
//   'side'     — resting along the side of the index (default closed-fist position)
//   'across'   — across the front of the closed fingers (S, T-ish)
//   'tuck'     — tucked inside the curled fingers (M, N)
//   'open'     — extended out to the side (L, Y)
//   'pinch'    — touching index/middle tips (F, O)
//   'between'  — poking between fingers (T)
//   'parallel' — alongside an extended index (G, H)
const FINGER_GEOMETRY = {
  index:  { x: 60,  w: 18, fullY: 18, fullH: 102 },
  middle: { x: 82,  w: 18, fullY: 10, fullH: 110 },
  ring:   { x: 104, w: 18, fullY: 18, fullH: 102 },
  pinky:  { x: 126, w: 16, fullY: 38, fullH: 82  },
};

function fingerRect(name, state) {
  const g = FINGER_GEOMETRY[name];
  if (state === 'up') {
    return `<rect x="${g.x}" y="${g.fullY}" width="${g.w}" height="${g.fullH}" rx="9" class="finger" />`;
  }
  if (state === 'half') {
    const y = g.fullY + g.fullH * 0.5;
    return `<rect x="${g.x}" y="${y}" width="${g.w}" height="${g.fullH * 0.5}" rx="9" class="finger" />
            <circle cx="${g.x + g.w / 2}" cy="${y}" r="${g.w / 2}" class="knuckle" />`;
  }
  if (state === 'hook') {
    const y = g.fullY + g.fullH * 0.35;
    return `<rect x="${g.x}" y="${y}" width="${g.w}" height="${g.fullH * 0.65}" rx="9" class="finger" />
            <ellipse cx="${g.x + g.w / 2}" cy="${y - 3}" rx="${g.w / 2 + 2}" ry="${g.w / 2 + 4}" class="finger" transform="rotate(-30 ${g.x + g.w / 2} ${y})" />`;
  }
  // curl
  const y = g.fullY + g.fullH - 18;
  return `<rect x="${g.x}" y="${y}" width="${g.w}" height="22" rx="9" class="finger" />`;
}

function thumbShape(state) {
  // Thumb origin near (50, 145)
  switch (state) {
    case 'side':
      return `<rect x="46" y="115" width="18" height="50" rx="9" class="finger" />`;
    case 'across':
      return `<path d="M 46 145 Q 46 130 60 128 L 110 128 Q 124 130 124 145 Q 124 158 110 158 L 60 158 Q 46 158 46 145 Z" class="finger" />`;
    case 'tuck':
      return `<rect x="56" y="138" width="40" height="18" rx="9" class="finger" />`;
    case 'open':
      return `<rect x="6" y="120" width="48" height="20" rx="10" class="finger" transform="rotate(-25 30 130)" />`;
    case 'pinch':
      return `<path d="M 50 130 Q 35 120 40 105 Q 50 98 60 110 Q 68 122 64 132 Z" class="finger" />`;
    case 'between':
      return `<rect x="62" y="100" width="14" height="40" rx="7" class="finger" />`;
    case 'parallel':
      return `<rect x="40" y="80" width="14" height="50" rx="7" class="finger" transform="rotate(-15 47 105)" />`;
    case 'tip-up':
      return `<rect x="38" y="80" width="16" height="60" rx="8" class="finger" />`;
    default:
      return `<rect x="46" y="115" width="18" height="50" rx="9" class="finger" />`;
  }
}

function palmAndWrist(extras = '') {
  return `
    <rect x="48" y="120" width="100" height="92" rx="22" class="palm" />
    <rect x="68" y="208" width="60" height="28" rx="10" class="wrist" />
    ${extras}
  `;
}

export function aslHandSvg(cfg) {
  const { index = 'up', middle = 'up', ring = 'up', pinky = 'up', thumb = 'side', overlay = '' } = cfg;
  return `
    <svg viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">
      <g>
        ${fingerRect('pinky', pinky)}
        ${fingerRect('ring', ring)}
        ${fingerRect('middle', middle)}
        ${fingerRect('index', index)}
        ${thumbShape(thumb)}
        ${palmAndWrist()}
        ${overlay}
      </g>
    </svg>
  `;
}

// ---- ASL alphabet ----------------------------------------------------------
export const ASL_ALPHABET = {
  A: { cfg: { index: 'curl', middle: 'curl', ring: 'curl', pinky: 'curl', thumb: 'side' },
       desc: 'Closed fist, thumb resting along the side of the index finger.' },
  B: { cfg: { index: 'up', middle: 'up', ring: 'up', pinky: 'up', thumb: 'across' },
       desc: 'Flat hand, fingers together pointing up; thumb folded across the palm.' },
  C: { cfg: { index: 'hook', middle: 'hook', ring: 'hook', pinky: 'hook', thumb: 'open' },
       desc: 'Curve all fingers and thumb into a "C" shape.' },
  D: { cfg: { index: 'up', middle: 'curl', ring: 'curl', pinky: 'curl', thumb: 'pinch' },
       desc: 'Index finger straight up; other fingers touch the thumb forming a circle.' },
  E: { cfg: { index: 'curl', middle: 'curl', ring: 'curl', pinky: 'curl', thumb: 'tuck' },
       desc: 'All fingertips curl down to meet the thumb; tight bunched fist.' },
  F: { cfg: { index: 'pinch-tip', middle: 'up', ring: 'up', pinky: 'up', thumb: 'pinch',
              overlay: '<circle cx="55" cy="105" r="14" fill="none" stroke="#1f2937" stroke-width="3" />' },
       desc: 'Thumb and index touch in a circle; the other three fingers point up.' },
  G: { cfg: { index: 'up', middle: 'curl', ring: 'curl', pinky: 'curl', thumb: 'open',
              overlay: '<text x="100" y="232" font-size="14" font-weight="700" text-anchor="middle" fill="#94a3b8">point sideways →</text>' },
       desc: 'Index finger and thumb extended parallel — point them sideways (not up).' },
  H: { cfg: { index: 'up', middle: 'up', ring: 'curl', pinky: 'curl', thumb: 'across',
              overlay: '<text x="100" y="232" font-size="14" font-weight="700" text-anchor="middle" fill="#94a3b8">point sideways →</text>' },
       desc: 'Index and middle fingers extended together — point them sideways (not up).' },
  I: { cfg: { index: 'curl', middle: 'curl', ring: 'curl', pinky: 'up', thumb: 'across' },
       desc: 'Pinky finger extended up; other fingers and thumb closed in a fist.' },
  J: { cfg: { index: 'curl', middle: 'curl', ring: 'curl', pinky: 'up', thumb: 'across',
              overlay: '<path d="M 145 60 Q 145 200 100 200" fill="none" stroke="#0ea5e9" stroke-width="3" stroke-dasharray="4 4" /><polygon points="95,196 105,196 100,206" fill="#0ea5e9" />' },
       desc: 'Like "I", but trace the letter J in the air with the pinky.' },
  K: { cfg: { index: 'up', middle: 'up', ring: 'curl', pinky: 'curl', thumb: 'between',
              overlay: '<rect x="82" y="40" width="18" height="80" rx="9" class="finger" transform="rotate(35 91 80)" />' },
       desc: 'Index up, middle finger angled out, thumb pressed between them.' },
  L: { cfg: { index: 'up', middle: 'curl', ring: 'curl', pinky: 'curl', thumb: 'open' },
       desc: 'Index finger up and thumb out — together they form an "L" shape.' },
  M: { cfg: { index: 'curl', middle: 'curl', ring: 'curl', pinky: 'curl', thumb: 'tuck',
              overlay: '<rect x="60" y="120" width="58" height="14" rx="7" class="finger" />' },
       desc: 'Three fingers (index, middle, ring) folded over a tucked thumb.' },
  N: { cfg: { index: 'curl', middle: 'curl', ring: 'curl', pinky: 'curl', thumb: 'tuck',
              overlay: '<rect x="60" y="120" width="38" height="14" rx="7" class="finger" />' },
       desc: 'Index and middle fingers folded over a tucked thumb.' },
  O: { cfg: { index: 'hook', middle: 'hook', ring: 'hook', pinky: 'hook', thumb: 'pinch',
              overlay: '<circle cx="100" cy="105" r="34" fill="none" stroke="#1f2937" stroke-width="4" />' },
       desc: 'All fingertips curl down to touch the thumb, forming an "O".' },
  P: { cfg: { index: 'up', middle: 'up', ring: 'curl', pinky: 'curl', thumb: 'between',
              overlay: '<rect x="82" y="40" width="18" height="80" rx="9" class="finger" transform="rotate(35 91 80)" /><text x="100" y="232" font-size="14" font-weight="700" text-anchor="middle" fill="#94a3b8">point downward ↓</text>' },
       desc: 'Like "K", but the hand points downward — middle finger reaches forward.' },
  Q: { cfg: { index: 'up', middle: 'curl', ring: 'curl', pinky: 'curl', thumb: 'open',
              overlay: '<text x="100" y="232" font-size="14" font-weight="700" text-anchor="middle" fill="#94a3b8">point downward ↓</text>' },
       desc: 'Like "G", but the index finger and thumb point downward.' },
  R: { cfg: { index: 'up', middle: 'up', ring: 'curl', pinky: 'curl', thumb: 'across',
              overlay: '<rect x="76" y="10" width="18" height="110" rx="9" class="finger" transform="rotate(8 85 60)" /><rect x="86" y="18" width="18" height="102" rx="9" class="finger" transform="rotate(-8 95 60)" />' },
       desc: 'Index and middle fingers crossed, pointing up.' },
  S: { cfg: { index: 'curl', middle: 'curl', ring: 'curl', pinky: 'curl', thumb: 'across' },
       desc: 'Closed fist with thumb crossing over the front of the fingers.' },
  T: { cfg: { index: 'curl', middle: 'curl', ring: 'curl', pinky: 'curl', thumb: 'between' },
       desc: 'Closed fist with the thumb poking up between the index and middle fingers.' },
  U: { cfg: { index: 'up', middle: 'up', ring: 'curl', pinky: 'curl', thumb: 'across' },
       desc: 'Index and middle fingers up together, side by side.' },
  V: { cfg: { index: 'up', middle: 'up', ring: 'curl', pinky: 'curl', thumb: 'across',
              overlay: '<rect x="60" y="18" width="18" height="102" rx="9" class="finger" transform="rotate(-15 69 70)" /><rect x="82" y="10" width="18" height="110" rx="9" class="finger" transform="rotate(15 91 70)" />' },
       desc: 'Index and middle fingers up, spread apart in a "V".' },
  W: { cfg: { index: 'up', middle: 'up', ring: 'up', pinky: 'curl', thumb: 'across' },
       desc: 'Index, middle, and ring fingers up, spread apart.' },
  X: { cfg: { index: 'hook', middle: 'curl', ring: 'curl', pinky: 'curl', thumb: 'side' },
       desc: 'Index finger bent like a hook; other fingers curled.' },
  Y: { cfg: { index: 'curl', middle: 'curl', ring: 'curl', pinky: 'up', thumb: 'open' },
       desc: 'Thumb and pinky extended out, others curled — like "hang loose".' },
  Z: { cfg: { index: 'up', middle: 'curl', ring: 'curl', pinky: 'curl', thumb: 'across',
              overlay: '<polyline points="40,40 160,40 40,140 160,140" fill="none" stroke="#0ea5e9" stroke-width="3" stroke-dasharray="4 4" />' },
       desc: 'Index finger out — trace the letter "Z" in the air.' },
};

// Render the SVG once per letter
for (const k of Object.keys(ASL_ALPHABET)) {
  ASL_ALPHABET[k].svg = aslHandSvg(ASL_ALPHABET[k].cfg);
  ASL_ALPHABET[k].letter = k;
}

// ---- ISL (Indian Sign Language) alphabet -----------------------------------
// ISL fingerspelling is two-handed. We render a simplified two-hand
// schematic with text descriptions; for accurate reference users should
// consult the Indian Sign Language Research and Training Centre (ISLRTC).
function islHandSvg(leftCfg, rightCfg, overlay = '') {
  const body = (cfg) => `
    ${fingerRect('pinky', cfg.pinky || 'up')}
    ${fingerRect('ring', cfg.ring || 'up')}
    ${fingerRect('middle', cfg.middle || 'up')}
    ${fingerRect('index', cfg.index || 'up')}
    ${thumbShape(cfg.thumb || 'side')}
    <rect x="48" y="120" width="100" height="92" rx="22" class="palm" />
    <rect x="68" y="208" width="60" height="28" rx="10" class="wrist" />
  `;
  // Left hand: mirrored (scale -0.85 on x) so the thumb faces the right hand.
  // Right hand: scaled to 0.85 and shifted to the right half.
  return `
    <svg viewBox="0 0 440 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">
      <g transform="translate(200,10) scale(-0.85,0.85)">${body(leftCfg)}</g>
      <g transform="translate(240,10) scale(0.85,0.85)">${body(rightCfg)}</g>
      ${overlay}
    </svg>
  `;
}

export const ISL_ALPHABET = {
  A: { desc: 'Touch the tip of the right index finger to the tip of the left thumb.',
       cfg: { left: { index: 'curl', middle: 'curl', ring: 'curl', pinky: 'curl', thumb: 'open' },
              right: { index: 'up', middle: 'curl', ring: 'curl', pinky: 'curl', thumb: 'side' } } },
  B: { desc: 'Hold both palms flat, fingers up; touch the right fingers to the left palm.',
       cfg: { left: { thumb: 'across' }, right: { thumb: 'across' } } },
  C: { desc: 'Both hands form a "C" curve facing each other.',
       cfg: { left: { index: 'hook', middle: 'hook', ring: 'hook', pinky: 'hook', thumb: 'open' },
              right: { index: 'hook', middle: 'hook', ring: 'hook', pinky: 'hook', thumb: 'open' } } },
  D: { desc: 'Right index finger points up; left hand is a flat palm at its base.',
       cfg: { left: { thumb: 'across' },
              right: { index: 'up', middle: 'curl', ring: 'curl', pinky: 'curl', thumb: 'side' } } },
  E: { desc: 'Right index finger touches the left ring finger.',
       cfg: { left: { thumb: 'across' },
              right: { index: 'up', middle: 'curl', ring: 'curl', pinky: 'curl', thumb: 'side' } } },
  F: { desc: 'Right index finger touches the tip of the left middle finger.',
       cfg: { left: { thumb: 'across' },
              right: { index: 'up', middle: 'curl', ring: 'curl', pinky: 'curl', thumb: 'side' } } },
  G: { desc: 'Right hand forms an "L" rested on the left flat palm.',
       cfg: { left: { thumb: 'across' },
              right: { index: 'up', middle: 'curl', ring: 'curl', pinky: 'curl', thumb: 'open' } } },
  H: { desc: 'Right index and middle (pointing sideways) rest on the left palm.',
       cfg: { left: { thumb: 'across' },
              right: { index: 'up', middle: 'up', ring: 'curl', pinky: 'curl', thumb: 'across' } } },
  I: { desc: 'Right pinky touches the left palm.',
       cfg: { left: { thumb: 'across' },
              right: { index: 'curl', middle: 'curl', ring: 'curl', pinky: 'up', thumb: 'across' } } },
  J: { desc: 'Right pinky traces a "J" against the left palm.',
       cfg: { left: { thumb: 'across' },
              right: { index: 'curl', middle: 'curl', ring: 'curl', pinky: 'up', thumb: 'across' } } },
  K: { desc: 'Right index finger touches the left wrist.',
       cfg: { left: { thumb: 'across' },
              right: { index: 'up', middle: 'curl', ring: 'curl', pinky: 'curl', thumb: 'side' } } },
  L: { desc: 'Right hand forms an "L" against the upturned left palm.',
       cfg: { left: { thumb: 'across' },
              right: { index: 'up', middle: 'curl', ring: 'curl', pinky: 'curl', thumb: 'open' } } },
  M: { desc: 'Three right fingers laid across the open left palm.',
       cfg: { left: { thumb: 'across' },
              right: { index: 'up', middle: 'up', ring: 'up', pinky: 'curl', thumb: 'across' } } },
  N: { desc: 'Two right fingers laid across the open left palm.',
       cfg: { left: { thumb: 'across' },
              right: { index: 'up', middle: 'up', ring: 'curl', pinky: 'curl', thumb: 'across' } } },
  O: { desc: 'Both hands form a circular "O" shape together.',
       cfg: { left: { index: 'hook', middle: 'hook', ring: 'hook', pinky: 'hook', thumb: 'pinch' },
              right: { index: 'hook', middle: 'hook', ring: 'hook', pinky: 'hook', thumb: 'pinch' } } },
  P: { desc: 'Right index finger points down onto the left palm.',
       cfg: { left: { thumb: 'across' },
              right: { index: 'up', middle: 'curl', ring: 'curl', pinky: 'curl', thumb: 'side' } } },
  Q: { desc: 'Right thumb-and-index pinch over a downturned left fist.',
       cfg: { left: { index: 'curl', middle: 'curl', ring: 'curl', pinky: 'curl', thumb: 'across' },
              right: { index: 'pinch-tip', middle: 'curl', ring: 'curl', pinky: 'curl', thumb: 'pinch' } } },
  R: { desc: 'Right index and middle (crossed) rest on the left palm.',
       cfg: { left: { thumb: 'across' },
              right: { index: 'up', middle: 'up', ring: 'curl', pinky: 'curl', thumb: 'across' } } },
  S: { desc: 'Right hand strokes down the left palm.',
       cfg: { left: { thumb: 'across' },
              right: { index: 'up', middle: 'up', ring: 'up', pinky: 'up', thumb: 'across' } } },
  T: { desc: 'Right index finger held under the horizontal left index finger.',
       cfg: { left: { index: 'up', middle: 'curl', ring: 'curl', pinky: 'curl', thumb: 'across' },
              right: { index: 'up', middle: 'curl', ring: 'curl', pinky: 'curl', thumb: 'side' } } },
  U: { desc: 'Both hands make "U" shapes interlocking.',
       cfg: { left: { index: 'up', middle: 'up', ring: 'curl', pinky: 'curl', thumb: 'across' },
              right: { index: 'up', middle: 'up', ring: 'curl', pinky: 'curl', thumb: 'across' } } },
  V: { desc: 'Right "V" sign rests on the open left palm.',
       cfg: { left: { thumb: 'across' },
              right: { index: 'up', middle: 'up', ring: 'curl', pinky: 'curl', thumb: 'across' } } },
  W: { desc: 'Three fingers up on each hand, brought together.',
       cfg: { left: { index: 'up', middle: 'up', ring: 'up', pinky: 'curl', thumb: 'across' },
              right: { index: 'up', middle: 'up', ring: 'up', pinky: 'curl', thumb: 'across' } } },
  X: { desc: 'Right hooked index finger crosses with the left hooked index.',
       cfg: { left: { index: 'hook', middle: 'curl', ring: 'curl', pinky: 'curl', thumb: 'side' },
              right: { index: 'hook', middle: 'curl', ring: 'curl', pinky: 'curl', thumb: 'side' } } },
  Y: { desc: 'Right pinky and thumb out (Y shape) rests on the left palm.',
       cfg: { left: { thumb: 'across' },
              right: { index: 'curl', middle: 'curl', ring: 'curl', pinky: 'up', thumb: 'open' } } },
  Z: { desc: 'Right index finger traces "Z" on the left palm.',
       cfg: { left: { thumb: 'across' },
              right: { index: 'up', middle: 'curl', ring: 'curl', pinky: 'curl', thumb: 'side' } } },
};

for (const k of Object.keys(ISL_ALPHABET)) {
  const e = ISL_ALPHABET[k];
  e.svg = islHandSvg(e.cfg.left, e.cfg.right);
  e.letter = k;
}

// ---- Common-word dictionary -----------------------------------------------
// Words are described with a short visual description plus a fallback to
// fingerspelling. Many of these signs share basic shapes with fingerspelled
// letters; the descriptions tell the caregiver how to perform them properly.
function wordEntry({ word, asl, isl, cfg }) {
  return {
    word,
    asl,
    isl,
    svg: aslHandSvg(cfg || { thumb: 'open' }),
    fingerspell: false,
  };
}

export const WORD_DICTIONARY = {
  hello:    wordEntry({ word: 'hello',    asl: 'Flat hand at forehead, swing outward like a salute.', isl: 'Right palm at forehead, move it forward.', cfg: { thumb: 'open' } }),
  hi:       wordEntry({ word: 'hi',       asl: 'Wave an open hand at chest height.', isl: 'Wave an open hand near the head.' }),
  bye:      wordEntry({ word: 'bye',      asl: 'Open hand, wiggle fingers down toward the palm.', isl: 'Wave the open hand side to side.' }),
  goodbye:  wordEntry({ word: 'goodbye',  asl: 'Wave an open hand toward the person.', isl: 'Wave the open hand side to side.' }),
  yes:      wordEntry({ word: 'yes',      asl: 'Closed fist nodding up and down (like a head nodding).', isl: 'Nod the head while making a thumbs-up.', cfg: { index: 'curl', middle: 'curl', ring: 'curl', pinky: 'curl', thumb: 'side' } }),
  no:       wordEntry({ word: 'no',       asl: 'Index and middle fingers tap the thumb (snap motion).', isl: 'Wave open hand left-right with palm out.', cfg: { index: 'half', middle: 'half', ring: 'curl', pinky: 'curl', thumb: 'pinch' } }),
  please:   wordEntry({ word: 'please',   asl: 'Flat hand circles on the chest.', isl: 'Both palms together near the chest.', cfg: { thumb: 'across' } }),
  'thank you': wordEntry({ word: 'thank you', asl: 'Flat hand at chin, move forward and down toward the listener.', isl: 'Bring both palms together at the chest, bow head slightly.', cfg: { thumb: 'across' } }),
  thanks:   wordEntry({ word: 'thanks',   asl: 'Flat hand at chin, move forward toward the listener.', isl: 'Both palms together at the chest.', cfg: { thumb: 'across' } }),
  sorry:    wordEntry({ word: 'sorry',    asl: 'Closed fist circles over the heart.', isl: 'Right palm circles on the chest.', cfg: { index: 'curl', middle: 'curl', ring: 'curl', pinky: 'curl', thumb: 'across' } }),
  help:     wordEntry({ word: 'help',     asl: 'Closed fist (thumb up) rests on flat palm; both lift up together.', isl: 'Right thumbs-up rests on left flat palm; lift up.', cfg: { index: 'curl', middle: 'curl', ring: 'curl', pinky: 'curl', thumb: 'open' } }),
  water:    wordEntry({ word: 'water',    asl: 'Three fingers (W shape) tap the chin twice.', isl: 'Cup right hand and bring to mouth as if drinking.', cfg: { index: 'up', middle: 'up', ring: 'up', pinky: 'curl', thumb: 'across' } }),
  food:     wordEntry({ word: 'food',     asl: 'Pinched fingertips tap the lips.', isl: 'Bring fingertips of right hand to the mouth.', cfg: { index: 'hook', middle: 'hook', ring: 'hook', pinky: 'hook', thumb: 'pinch' } }),
  eat:      wordEntry({ word: 'eat',      asl: 'Pinched fingertips tap the lips.', isl: 'Bring fingertips of right hand to the mouth.', cfg: { index: 'hook', middle: 'hook', ring: 'hook', pinky: 'hook', thumb: 'pinch' } }),
  drink:    wordEntry({ word: 'drink',    asl: 'Curved "C" hand mimics drinking from a cup.', isl: 'Cup right hand and bring to mouth as if drinking.', cfg: { index: 'hook', middle: 'hook', ring: 'hook', pinky: 'hook', thumb: 'open' } }),
  hungry:   wordEntry({ word: 'hungry',   asl: 'Curved "C" hand slides down the chest.', isl: 'Right palm rubs the stomach.', cfg: { index: 'hook', middle: 'hook', ring: 'hook', pinky: 'hook', thumb: 'open' } }),
  thirsty:  wordEntry({ word: 'thirsty',  asl: 'Index finger traces down the throat.', isl: 'Index finger traces down the throat.', cfg: { index: 'up', middle: 'curl', ring: 'curl', pinky: 'curl', thumb: 'side' } }),
  pain:     wordEntry({ word: 'pain',     asl: 'Both index fingers point at each other and twist.', isl: 'Both index fingers tap the spot that hurts.', cfg: { index: 'up', middle: 'curl', ring: 'curl', pinky: 'curl', thumb: 'side' } }),
  hurt:     wordEntry({ word: 'hurt',     asl: 'Both index fingers point at each other and twist near the painful area.', isl: 'Both index fingers tap the spot that hurts.', cfg: { index: 'up', middle: 'curl', ring: 'curl', pinky: 'curl', thumb: 'side' } }),
  sick:     wordEntry({ word: 'sick',     asl: 'Middle finger of each hand touches the forehead and stomach.', isl: 'Right middle finger touches the forehead.', cfg: { index: 'up', middle: 'half', ring: 'up', pinky: 'up', thumb: 'across' } }),
  doctor:   wordEntry({ word: 'doctor',   asl: 'Tap the wrist as if checking a pulse.', isl: 'Tap two fingers on the wrist as if checking pulse.', cfg: { index: 'up', middle: 'up', ring: 'curl', pinky: 'curl', thumb: 'across' } }),
  medicine: wordEntry({ word: 'medicine', asl: 'Middle finger circles on the open palm.', isl: 'Right middle finger circles on the left palm.', cfg: { index: 'up', middle: 'half', ring: 'up', pinky: 'up', thumb: 'across' } }),
  bathroom: wordEntry({ word: 'bathroom', asl: '"T" hand shape shaken side to side.', isl: 'Right hand mimics opening a tap, then washes.', cfg: { index: 'curl', middle: 'curl', ring: 'curl', pinky: 'curl', thumb: 'between' } }),
  toilet:   wordEntry({ word: 'toilet',   asl: '"T" hand shape shaken side to side.', isl: 'Right hand mimics opening a tap.', cfg: { index: 'curl', middle: 'curl', ring: 'curl', pinky: 'curl', thumb: 'between' } }),
  sleep:    wordEntry({ word: 'sleep',    asl: 'Open hand passes over the face, fingers closing as eyes "close".', isl: 'Both palms together, tilt head onto them.', cfg: { thumb: 'across' } }),
  tired:    wordEntry({ word: 'tired',    asl: 'Both bent hands at chest, drop downward.', isl: 'Both palms drop down with shoulders.', cfg: { index: 'half', middle: 'half', ring: 'half', pinky: 'half', thumb: 'across' } }),
  hot:      wordEntry({ word: 'hot',      asl: 'Curved hand near the mouth, twist and pull away.', isl: 'Right hand fans the face.', cfg: { index: 'hook', middle: 'hook', ring: 'hook', pinky: 'hook', thumb: 'open' } }),
  cold:     wordEntry({ word: 'cold',     asl: 'Both fists near the shoulders, shiver/shake.', isl: 'Both fists shiver/shake near the shoulders.', cfg: { index: 'curl', middle: 'curl', ring: 'curl', pinky: 'curl', thumb: 'across' } }),
  good:     wordEntry({ word: 'good',     asl: 'Flat hand at chin, move forward and down (like "thank you").', isl: 'Right thumb up.', cfg: { thumb: 'across' } }),
  bad:      wordEntry({ word: 'bad',      asl: 'Flat hand at chin, flip down with palm facing down.', isl: 'Right thumb down.', cfg: { thumb: 'across' } }),
  happy:    wordEntry({ word: 'happy',    asl: 'Flat hands brush upward on the chest, repeated.', isl: 'Both palms brush up on the chest.', cfg: { thumb: 'across' } }),
  sad:      wordEntry({ word: 'sad',      asl: 'Both open hands slide down the face.', isl: 'Both open hands slide down the face.', cfg: { thumb: 'across' } }),
  love:     wordEntry({ word: 'love',     asl: 'Cross both arms over the chest like a hug.', isl: 'Cross both fists over the chest.', cfg: { index: 'curl', middle: 'curl', ring: 'curl', pinky: 'curl', thumb: 'across' } }),
  family:   wordEntry({ word: 'family',   asl: '"F" hand shape on each hand circles outward.', isl: 'Both "F" hands circle outward and meet.', cfg: { index: 'pinch-tip', middle: 'up', ring: 'up', pinky: 'up', thumb: 'pinch' } }),
  mother:   wordEntry({ word: 'mother',   asl: 'Thumb of open hand taps the chin.', isl: 'Right palm taps the cheek twice.', cfg: { thumb: 'open' } }),
  father:   wordEntry({ word: 'father',   asl: 'Thumb of open hand taps the forehead.', isl: 'Right thumb taps the forehead.', cfg: { thumb: 'open' } }),
  friend:   wordEntry({ word: 'friend',   asl: 'Both index fingers hook together, then reverse.', isl: 'Both hands clasp together.', cfg: { index: 'hook', middle: 'curl', ring: 'curl', pinky: 'curl', thumb: 'side' } }),
  home:     wordEntry({ word: 'home',     asl: 'Pinched fingertips tap the cheek twice.', isl: 'Both hands form a roof shape over the head.', cfg: { index: 'hook', middle: 'hook', ring: 'hook', pinky: 'hook', thumb: 'pinch' } }),
  go:       wordEntry({ word: 'go',       asl: 'Both index fingers point and move forward.', isl: 'Right index finger points forward, moves away.', cfg: { index: 'up', middle: 'curl', ring: 'curl', pinky: 'curl', thumb: 'side' } }),
  come:     wordEntry({ word: 'come',     asl: 'Both index fingers move toward the body.', isl: 'Right hand beckons toward the body.', cfg: { index: 'up', middle: 'curl', ring: 'curl', pinky: 'curl', thumb: 'side' } }),
  stop:     wordEntry({ word: 'stop',     asl: 'Edge of right hand strikes left flat palm.', isl: 'Right palm pushed forward, like "halt".', cfg: { thumb: 'across' } }),
  wait:     wordEntry({ word: 'wait',     asl: 'Both hands face up, fingers wiggle.', isl: 'Right palm up, fingers wiggle.', cfg: { thumb: 'open' } }),
  more:     wordEntry({ word: 'more',     asl: 'Both pinched hands tap together.', isl: 'Right fingers and thumb pinch repeatedly.', cfg: { index: 'hook', middle: 'hook', ring: 'hook', pinky: 'hook', thumb: 'pinch' } }),
  less:     wordEntry({ word: 'less',     asl: 'One flat hand drops down toward the other.', isl: 'Pinch fingers together, fingers close.', cfg: { thumb: 'across' } }),
  i:        wordEntry({ word: 'i',        asl: 'Index finger points to your own chest.', isl: 'Index finger points to your own chest.', cfg: { index: 'up', middle: 'curl', ring: 'curl', pinky: 'curl', thumb: 'side' } }),
  me:       wordEntry({ word: 'me',       asl: 'Index finger points to your own chest.', isl: 'Index finger points to your own chest.', cfg: { index: 'up', middle: 'curl', ring: 'curl', pinky: 'curl', thumb: 'side' } }),
  you:      wordEntry({ word: 'you',      asl: 'Index finger points outward at the listener.', isl: 'Index finger points outward at the listener.', cfg: { index: 'up', middle: 'curl', ring: 'curl', pinky: 'curl', thumb: 'side' } }),
  we:       wordEntry({ word: 'we',       asl: 'Index finger touches one shoulder, arcs to the other.', isl: 'Sweep open palm across the chest.', cfg: { index: 'up', middle: 'curl', ring: 'curl', pinky: 'curl', thumb: 'side' } }),
  they:     wordEntry({ word: 'they',     asl: 'Index finger sweeps across the listeners.', isl: 'Index finger points across the group.', cfg: { index: 'up', middle: 'curl', ring: 'curl', pinky: 'curl', thumb: 'side' } }),
  he:       wordEntry({ word: 'he',       asl: 'Index finger points to him.', isl: 'Index finger points to him.', cfg: { index: 'up', middle: 'curl', ring: 'curl', pinky: 'curl', thumb: 'side' } }),
  she:      wordEntry({ word: 'she',      asl: 'Index finger points to her.', isl: 'Index finger points to her.', cfg: { index: 'up', middle: 'curl', ring: 'curl', pinky: 'curl', thumb: 'side' } }),
  what:     wordEntry({ word: 'what',     asl: 'Both palms up, shake side to side with raised eyebrows.', isl: 'Right palm up, fingers wiggle, raise eyebrows.', cfg: { thumb: 'open' } }),
  why:      wordEntry({ word: 'why',      asl: 'Touch forehead, then drop hand to "Y" shape.', isl: 'Right palm at forehead, twist outward.', cfg: { index: 'curl', middle: 'curl', ring: 'curl', pinky: 'up', thumb: 'open' } }),
  where:    wordEntry({ word: 'where',    asl: 'Index finger up, shaken side to side.', isl: 'Right palm up, shake side to side.', cfg: { index: 'up', middle: 'curl', ring: 'curl', pinky: 'curl', thumb: 'side' } }),
  when:     wordEntry({ word: 'when',     asl: 'Right index circles around left index, lands on top.', isl: 'Right index circles, lands on left index.', cfg: { index: 'up', middle: 'curl', ring: 'curl', pinky: 'curl', thumb: 'side' } }),
  who:      wordEntry({ word: 'who',      asl: 'Thumb at chin, index finger wiggles.', isl: 'Right index circles in front of face.', cfg: { index: 'up', middle: 'curl', ring: 'curl', pinky: 'curl', thumb: 'open' } }),
  how:      wordEntry({ word: 'how',      asl: 'Bent hands knuckles together, roll out to palms up.', isl: 'Right palm up, fingers wiggle questioningly.', cfg: { index: 'half', middle: 'half', ring: 'half', pinky: 'half', thumb: 'across' } }),
  yesterday:wordEntry({ word: 'yesterday',asl: '"Y" hand on the cheek, slides backward.', isl: 'Right thumb points back over the shoulder.', cfg: { index: 'curl', middle: 'curl', ring: 'curl', pinky: 'up', thumb: 'open' } }),
  today:    wordEntry({ word: 'today',    asl: 'Both "Y" hands drop down twice in front of body.', isl: 'Both palms down, push down twice.', cfg: { index: 'curl', middle: 'curl', ring: 'curl', pinky: 'up', thumb: 'open' } }),
  tomorrow: wordEntry({ word: 'tomorrow', asl: '"A" hand at chin, arcs forward.', isl: 'Right thumb points forward over the shoulder.', cfg: { index: 'curl', middle: 'curl', ring: 'curl', pinky: 'curl', thumb: 'side' } }),
  morning:  wordEntry({ word: 'morning',  asl: 'Left flat hand horizontal, right arm rises like a sunrise.', isl: 'Both palms together, open like a sunrise.', cfg: { thumb: 'across' } }),
  night:    wordEntry({ word: 'night',    asl: 'Right flat hand drops over the back of the left flat hand.', isl: 'Both flat hands cross, palms down, like "shut".', cfg: { thumb: 'across' } }),
  name:     wordEntry({ word: 'name',     asl: '"H" fingers of right tap "H" fingers of left.', isl: 'Right "H" taps left "H" twice.', cfg: { index: 'up', middle: 'up', ring: 'curl', pinky: 'curl', thumb: 'across' } }),
  work:     wordEntry({ word: 'work',     asl: 'Right fist taps wrist of left fist twice.', isl: 'Right fist taps left fist twice.', cfg: { index: 'curl', middle: 'curl', ring: 'curl', pinky: 'curl', thumb: 'across' } }),
  school:   wordEntry({ word: 'school',   asl: 'Right palm claps onto left palm twice.', isl: 'Right palm claps onto left palm twice.', cfg: { thumb: 'across' } }),
  book:     wordEntry({ word: 'book',     asl: 'Both palms together, then open like a book.', isl: 'Both palms together, then open like a book.', cfg: { thumb: 'across' } }),
  read:     wordEntry({ word: 'read',     asl: 'Right "V" fingers move down the left flat palm.', isl: 'Right "V" fingers scan down the left palm.', cfg: { index: 'up', middle: 'up', ring: 'curl', pinky: 'curl', thumb: 'across' } }),
  write:    wordEntry({ word: 'write',    asl: 'Mimic writing on the open left palm with the right.', isl: 'Mimic writing on the left palm.', cfg: { index: 'up', middle: 'curl', ring: 'curl', pinky: 'curl', thumb: 'pinch' } }),
  okay:     wordEntry({ word: 'okay',     asl: 'Spell O-K with fingers (or thumbs-up).', isl: 'Right thumbs-up.', cfg: { index: 'curl', middle: 'curl', ring: 'curl', pinky: 'curl', thumb: 'open' } }),
  ok:       wordEntry({ word: 'ok',       asl: 'Spell O-K with fingers (or thumbs-up).', isl: 'Right thumbs-up.', cfg: { index: 'curl', middle: 'curl', ring: 'curl', pinky: 'curl', thumb: 'open' } }),
  yes_word: wordEntry({ word: 'yes_word', asl: 'Closed fist nods up and down.', isl: 'Thumbs up while nodding.' }),
};

// Helper verbs and frequent connectors. In real ASL/ISL, many of these are
// dropped or expressed through facial expression — but for a beginner caregiver
// app, showing a recognisable sign is more useful than silently skipping them.
const helpers = {
  are:    { asl: 'Index and middle fingers ("R" shape) move outward from the lips.', isl: 'Same sign as "you" — index finger points forward.', cfg: { index: 'up', middle: 'up', ring: 'curl', pinky: 'curl', thumb: 'across' } },
  am:     { asl: 'Index finger touches the lips and moves forward (often dropped).', isl: 'Often dropped — point to self.', cfg: { index: 'up', middle: 'curl', ring: 'curl', pinky: 'curl', thumb: 'side' } },
  is:     { asl: 'Pinky finger ("I" shape) touches the lips and moves forward.', isl: 'Often dropped — gesture briefly.', cfg: { index: 'curl', middle: 'curl', ring: 'curl', pinky: 'up', thumb: 'across' } },
  was:    { asl: '"W" shape near the cheek, moves backward over the shoulder.', isl: 'Wave the right hand back over the shoulder.', cfg: { index: 'up', middle: 'up', ring: 'up', pinky: 'curl', thumb: 'across' } },
  do:     { asl: 'Both "C" hands face down, swing side to side.', isl: 'Both palms down, gesture forward.', cfg: { index: 'hook', middle: 'hook', ring: 'hook', pinky: 'hook', thumb: 'open' } },
  does:   { asl: 'Both "D" hands swing side to side.', isl: 'Both palms forward, gesture.', cfg: { index: 'up', middle: 'curl', ring: 'curl', pinky: 'curl', thumb: 'pinch' } },
  did:    { asl: '"D" hand swings side to side, then back.', isl: 'Right palm gestures back.', cfg: { index: 'up', middle: 'curl', ring: 'curl', pinky: 'curl', thumb: 'pinch' } },
  have:   { asl: 'Both bent hands tap the chest.', isl: 'Both bent hands tap the chest.', cfg: { index: 'half', middle: 'half', ring: 'half', pinky: 'half', thumb: 'across' } },
  has:    { asl: 'Both bent hands tap the chest.', isl: 'Both bent hands tap the chest.', cfg: { index: 'half', middle: 'half', ring: 'half', pinky: 'half', thumb: 'across' } },
  want:   { asl: 'Both curved hands pull inward toward the body.', isl: 'Right palm pulls toward the body.', cfg: { index: 'half', middle: 'half', ring: 'half', pinky: 'half', thumb: 'open' } },
  need:   { asl: '"X" hand moves down with emphasis.', isl: 'Right index taps the palm with urgency.', cfg: { index: 'hook', middle: 'curl', ring: 'curl', pinky: 'curl', thumb: 'side' } },
  like:   { asl: 'Pinch thumb-and-middle finger pulls away from the chest.', isl: 'Right hand on the chest, then thumbs up.', cfg: { index: 'up', middle: 'half', ring: 'up', pinky: 'up', thumb: 'pinch' } },
  know:   { asl: 'Bent hand taps the forehead.', isl: 'Right palm taps the forehead.', cfg: { index: 'half', middle: 'half', ring: 'half', pinky: 'half', thumb: 'across' } },
  think:  { asl: 'Index finger touches the forehead.', isl: 'Right index taps the forehead.', cfg: { index: 'up', middle: 'curl', ring: 'curl', pinky: 'curl', thumb: 'side' } },
  not:    { asl: 'Thumb under the chin flicks forward.', isl: 'Wave right palm side to side, palm out.', cfg: { index: 'curl', middle: 'curl', ring: 'curl', pinky: 'curl', thumb: 'open' } },
  can:    { asl: 'Both "S" hands push down together.', isl: 'Both fists push down with confidence.', cfg: { index: 'curl', middle: 'curl', ring: 'curl', pinky: 'curl', thumb: 'across' } },
  cant:   { asl: 'Right index strikes down across the left index.', isl: 'Right index crosses over left index.', cfg: { index: 'up', middle: 'curl', ring: 'curl', pinky: 'curl', thumb: 'side' } },
  see:    { asl: '"V" hand moves out from the eyes.', isl: 'Two fingers move out from the eyes.', cfg: { index: 'up', middle: 'up', ring: 'curl', pinky: 'curl', thumb: 'across' } },
  hear:   { asl: 'Index finger touches the ear.', isl: 'Cup the ear with the right hand.', cfg: { index: 'up', middle: 'curl', ring: 'curl', pinky: 'curl', thumb: 'side' } },
  speak:  { asl: 'Index finger circles in front of the mouth.', isl: 'Right hand circles in front of the mouth.', cfg: { index: 'up', middle: 'curl', ring: 'curl', pinky: 'curl', thumb: 'side' } },
  talk:   { asl: 'Both index fingers alternate near the mouth.', isl: 'Both index fingers move from the mouth.', cfg: { index: 'up', middle: 'curl', ring: 'curl', pinky: 'curl', thumb: 'side' } },
  here:   { asl: 'Both palms face up, circle in opposite directions in front of you.', isl: 'Right palm down, point at the spot.', cfg: { thumb: 'open' } },
  there:  { asl: 'Index finger points toward a distant spot.', isl: 'Right index points at the place.', cfg: { index: 'up', middle: 'curl', ring: 'curl', pinky: 'curl', thumb: 'side' } },
  this:   { asl: 'Index finger of the right hand taps the open left palm.', isl: 'Right index taps the left palm.', cfg: { index: 'up', middle: 'curl', ring: 'curl', pinky: 'curl', thumb: 'side' } },
  that:   { asl: '"Y" hand drops onto the open left palm.', isl: 'Right hand drops onto left palm.', cfg: { index: 'curl', middle: 'curl', ring: 'curl', pinky: 'up', thumb: 'open' } },
  and:    { asl: 'Open hand closes into a flat-O while moving sideways.', isl: 'Both palms together, then move apart.', cfg: { index: 'hook', middle: 'hook', ring: 'hook', pinky: 'hook', thumb: 'pinch' } },
  or:     { asl: '"L" hand wiggles between two options.', isl: 'Right index taps two spots in front.', cfg: { index: 'up', middle: 'curl', ring: 'curl', pinky: 'curl', thumb: 'open' } },
  but:    { asl: 'Both index fingers cross, then pull apart.', isl: 'Both index fingers cross, then separate.', cfg: { index: 'up', middle: 'curl', ring: 'curl', pinky: 'curl', thumb: 'side' } },
  with:   { asl: 'Two "A" fists come together.', isl: 'Two fists come together.', cfg: { index: 'curl', middle: 'curl', ring: 'curl', pinky: 'curl', thumb: 'side' } },
  for:    { asl: 'Index finger touches the forehead, then turns out.', isl: 'Right index touches forehead, then forward.', cfg: { index: 'up', middle: 'curl', ring: 'curl', pinky: 'curl', thumb: 'side' } },
  to:     { asl: 'Right index finger touches the tip of the left index finger.', isl: 'Right index touches left index tip.', cfg: { index: 'up', middle: 'curl', ring: 'curl', pinky: 'curl', thumb: 'side' } },
  in:     { asl: 'Pinched fingertips dip into the cup of the other hand.', isl: 'Right fingertips drop into left cupped hand.', cfg: { index: 'hook', middle: 'hook', ring: 'hook', pinky: 'hook', thumb: 'pinch' } },
  on:     { asl: 'Right flat hand lands on the back of the left hand.', isl: 'Right palm rests on the back of left hand.', cfg: { thumb: 'across' } },
  at:     { asl: 'Right fingertips touch the back of the left hand.', isl: 'Right fingertips touch the back of left hand.', cfg: { index: 'half', middle: 'half', ring: 'half', pinky: 'half', thumb: 'across' } },
  of:     { asl: 'Often omitted — fingerspell briefly.', isl: 'Often omitted.', cfg: { index: 'curl', middle: 'curl', ring: 'curl', pinky: 'curl', thumb: 'open' } },
  a:      { asl: 'Use the "A" hand shape (often omitted in sign).', isl: 'Often omitted.', cfg: { index: 'curl', middle: 'curl', ring: 'curl', pinky: 'curl', thumb: 'side' } },
  an:     { asl: 'Often omitted in sign.', isl: 'Often omitted.', cfg: { index: 'curl', middle: 'curl', ring: 'curl', pinky: 'curl', thumb: 'side' } },
  the:    { asl: 'Often omitted in sign.', isl: 'Often omitted.', cfg: { thumb: 'across' } },
  my:     { asl: 'Flat right palm presses against the chest.', isl: 'Right palm taps the chest.', cfg: { thumb: 'across' } },
  your:   { asl: 'Flat right palm extends toward the listener.', isl: 'Right palm extends toward the listener.', cfg: { thumb: 'across' } },
  his:    { asl: 'Point at him, then flat hand pushes outward.', isl: 'Point at him; then flat palm forward.', cfg: { thumb: 'across' } },
  her:    { asl: 'Point at her, then flat hand pushes outward.', isl: 'Point at her; then flat palm forward.', cfg: { thumb: 'across' } },
  our:    { asl: '"R" hand sweeps from one shoulder to the other.', isl: 'Sweep open palm across the chest.', cfg: { index: 'up', middle: 'up', ring: 'curl', pinky: 'curl', thumb: 'across' } },
  their:  { asl: 'Flat hand sweeps across, palm out, toward the group.', isl: 'Flat palm sweeps across the group.', cfg: { thumb: 'across' } },
  yours:  { asl: 'Flat right palm extends toward the listener.', isl: 'Right palm extends toward the listener.', cfg: { thumb: 'across' } },
};
for (const [w, h] of Object.entries(helpers)) {
  WORD_DICTIONARY[w] = wordEntry({ word: w, asl: h.asl, isl: h.isl, cfg: h.cfg });
}

// Aliases: handle apostrophes and common variants
WORD_DICTIONARY["i'm"]    = WORD_DICTIONARY.i;
WORD_DICTIONARY["i am"]   = WORD_DICTIONARY.i;
WORD_DICTIONARY["mom"]    = WORD_DICTIONARY.mother;
WORD_DICTIONARY["mum"]    = WORD_DICTIONARY.mother;
WORD_DICTIONARY["dad"]    = WORD_DICTIONARY.father;
WORD_DICTIONARY["papa"]   = WORD_DICTIONARY.father;

// ---- Tokenizer -------------------------------------------------------------
// Splits a sentence into a sequence of "tokens" (each token is one sign).
// Multi-word phrases like "thank you" are matched greedily.
const MULTI_WORD_KEYS = Object.keys(WORD_DICTIONARY)
  .filter((k) => k.includes(' '))
  .sort((a, b) => b.length - a.length);

export function tokenize(text) {
  const tokens = [];
  if (!text || !text.trim()) return tokens;

  // Normalise: lowercase, collapse spaces. Keep sentence punctuation as pause markers.
  const cleaned = text.toLowerCase().replace(/[^a-z0-9'\s.,!?]/g, ' ').replace(/\s+/g, ' ').trim();

  // Split into sentences first so punctuation becomes a "pause" token.
  const segments = cleaned.split(/([.,!?])/).map((s) => s.trim()).filter(Boolean);

  for (const segment of segments) {
    if (/^[.,!?]$/.test(segment)) {
      tokens.push({ kind: 'pause', display: segment });
      continue;
    }

    let remaining = segment;
    while (remaining.length > 0) {
      // Multi-word phrase match
      let matched = false;
      for (const phrase of MULTI_WORD_KEYS) {
        if (remaining === phrase || remaining.startsWith(phrase + ' ')) {
          const entry = WORD_DICTIONARY[phrase];
          tokens.push({ kind: 'word', word: phrase, entry });
          remaining = remaining.slice(phrase.length).trim();
          matched = true;
          break;
        }
      }
      if (matched) continue;

      // Single word
      const [word, ...rest] = remaining.split(' ');
      const entry = WORD_DICTIONARY[word];
      if (entry) {
        tokens.push({ kind: 'word', word, entry });
      } else {
        // Fingerspell: each character becomes its own token
        for (const ch of word.toUpperCase()) {
          if (/[A-Z]/.test(ch)) {
            tokens.push({ kind: 'letter', letter: ch });
          } else if (/[0-9]/.test(ch)) {
            tokens.push({ kind: 'digit', digit: ch });
          }
        }
        if (word.length > 0) {
          tokens.push({ kind: 'word-end', word });
        }
      }
      remaining = rest.join(' ').trim();
    }
  }
  return tokens;
}
