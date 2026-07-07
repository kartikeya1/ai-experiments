import { ASL_ALPHABET, ISL_ALPHABET, WORD_DICTIONARY, tokenize, aslHandSvg } from './data/sign-data.js';

// ---- DOM refs --------------------------------------------------------------
const $ = (sel) => document.querySelector(sel);

const textInput      = $('#textInput');
const convertBtn     = $('#convertBtn');
const clearBtn       = $('#clearBtn');
const player         = $('#player');
const stageSvg       = $('#stageSvg');
const stageLabel     = $('#stageLabel');
const stageDesc      = $('#stageDescription');
const playerProgress = $('#playerProgress');
const playerLanguage = $('#playerLanguage');
const prevBtn        = $('#prevBtn');
const nextBtn        = $('#nextBtn');
const playBtn        = $('#playBtn');
const playIcon       = $('#playIcon');
const pauseIcon      = $('#pauseIcon');
const repeatBtn      = $('#repeatBtn');
const speedSlider    = $('#speedSlider');
const speedValue     = $('#speedValue');
const sequenceList   = $('#sequenceList');
const alphabetGrid   = $('#alphabetGrid');
const langButtons    = document.querySelectorAll('.lang-btn');

// ---- State -----------------------------------------------------------------
const state = {
  language: 'ASL',          // 'ASL' | 'ISL'
  tokens: [],               // current sequence
  index: 0,                 // current position
  playing: false,
  repeat: false,
  intervalMs: Number(speedSlider.value),
  timer: null,
};

// ---- Helpers ---------------------------------------------------------------
function alphabetFor(lang) {
  return lang === 'ISL' ? ISL_ALPHABET : ASL_ALPHABET;
}

function describeLetter(letter, lang) {
  const entry = alphabetFor(lang)[letter];
  if (!entry) return null;
  return {
    label: letter,
    svg: entry.svg,
    description: entry.desc,
    meta: `${lang} fingerspelling`,
    kind: 'letter',
  };
}

function describeDigit(digit) {
  return {
    label: digit,
    svg: digitSvg(digit),
    description: `Hold up ${digit === '0' ? 'a closed "O" hand' : digit + ' fingers'} to indicate the number ${digit}.`,
    meta: 'Number',
    kind: 'digit',
  };
}

function digitSvg(d) {
  const counts = { '1': 1, '2': 2, '3': 3, '4': 4, '5': 5 };
  if (counts[d]) {
    const fingers = ['curl', 'curl', 'curl', 'curl'];
    for (let i = 0; i < counts[d]; i++) fingers[i] = 'up';
    const cfg = {
      index: fingers[0], middle: fingers[1], ring: fingers[2], pinky: fingers[3],
      thumb: counts[d] === 5 ? 'open' : 'across',
      overlay: `<text x="170" y="40" font-size="32" font-weight="800" fill="#0f172a">${d}</text>`,
    };
    return aslHandSvg(cfg);
  }
  // 0, 6-9: just show the numeral as a card (real ASL has hand shapes for these,
  // but they're hard to render with our schematic generator; ship a clean fallback).
  return `
    <svg viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">
      <rect x="20" y="20" width="160" height="200" rx="20" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="3" />
      <text x="100" y="160" font-size="140" font-weight="800" text-anchor="middle" fill="#0f172a">${d}</text>
    </svg>
  `;
}

function describeWord(token, lang) {
  const entry = token.entry;
  return {
    label: token.word,
    svg: entry.svg,
    description: lang === 'ISL' ? entry.isl : entry.asl,
    meta: `${lang} · word sign`,
    kind: 'word',
  };
}

function describePause(symbol) {
  return {
    label: symbol === '.' ? '·' : symbol,
    svg: `
      <svg viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">
        <rect x="20" y="20" width="160" height="200" rx="20" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="3" stroke-dasharray="6 6" />
        <text x="100" y="160" font-size="120" font-weight="800" text-anchor="middle" fill="#94a3b8">${symbol}</text>
      </svg>
    `,
    description: symbol === '?' ? 'Pause and raise your eyebrows — the sentence is a question.'
              : symbol === '!' ? 'Pause and add emphasis — the sentence is exclamatory.'
              : 'A short pause between phrases.',
    meta: 'Pause',
    kind: 'pause',
  };
}

function describeWordEnd(word) {
  return {
    label: '↵',
    svg: `
      <svg viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">
        <rect x="20" y="20" width="160" height="200" rx="20" fill="#eef2ff" stroke="#c7d2fe" stroke-width="3" />
        <text x="100" y="140" font-size="80" font-weight="800" text-anchor="middle" fill="#6366f1">↵</text>
        <text x="100" y="190" font-size="22" font-weight="700" text-anchor="middle" fill="#4338ca">${word}</text>
      </svg>
    `,
    description: `End of fingerspelled word: "${word}". Take a brief pause before the next word.`,
    meta: 'Word break',
    kind: 'word-end',
  };
}

function tokenToView(token, lang) {
  if (token.kind === 'letter') return describeLetter(token.letter, lang);
  if (token.kind === 'digit') return describeDigit(token.digit);
  if (token.kind === 'word')  return describeWord(token, lang);
  if (token.kind === 'pause') return describePause(token.display);
  if (token.kind === 'word-end') return describeWordEnd(token.word);
  return null;
}

// ---- Rendering -------------------------------------------------------------
function renderStage() {
  if (state.tokens.length === 0) return;
  const token = state.tokens[state.index];
  const view = tokenToView(token, state.language);
  if (!view) return;

  stageSvg.innerHTML = view.svg;
  stageLabel.textContent = view.label;
  stageLabel.className = 'stage-label';
  if (view.kind === 'letter' || view.kind === 'digit') stageLabel.classList.add('is-letter');
  if (view.kind === 'pause') stageLabel.classList.add('is-pause');

  stageDesc.innerHTML = `${escapeHtml(view.description)} <span class="meta">${escapeHtml(view.meta)}</span>`;
  playerProgress.textContent = `Sign ${state.index + 1} of ${state.tokens.length}`;
  playerLanguage.textContent = state.language;

  // Sequence list highlight
  const items = sequenceList.querySelectorAll('.sequence-item');
  items.forEach((el, i) => el.classList.toggle('is-active', i === state.index));
  // Scroll active item into view if it's offscreen
  const active = items[state.index];
  if (active) active.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
}

function renderSequence() {
  sequenceList.innerHTML = '';
  state.tokens.forEach((token, i) => {
    const li = document.createElement('li');
    const btn = document.createElement('button');
    btn.className = 'sequence-item';
    btn.type = 'button';
    if (token.kind === 'letter') {
      btn.textContent = token.letter;
      btn.classList.add('is-letter', 'is-fingerspell');
    } else if (token.kind === 'digit') {
      btn.textContent = token.digit;
      btn.classList.add('is-letter');
    } else if (token.kind === 'word') {
      btn.textContent = token.word;
    } else if (token.kind === 'pause') {
      btn.textContent = token.display;
      btn.classList.add('is-pause');
    } else if (token.kind === 'word-end') {
      btn.textContent = '·';
      btn.classList.add('is-pause');
      btn.setAttribute('aria-label', `end of word ${token.word}`);
    }
    btn.addEventListener('click', () => {
      state.index = i;
      pause();
      renderStage();
    });
    li.appendChild(btn);
    sequenceList.appendChild(li);
  });
}

function renderAlphabet() {
  const alphabet = alphabetFor(state.language);
  alphabetGrid.innerHTML = '';
  for (const letter of Object.keys(alphabet)) {
    const card = document.createElement('button');
    card.className = 'alpha-card';
    card.type = 'button';
    card.innerHTML = `${alphabet[letter].svg}<span class="alpha-letter">${letter}</span>`;
    card.addEventListener('click', () => {
      state.tokens = [{ kind: 'letter', letter }];
      state.index = 0;
      pause();
      showPlayer();
      renderSequence();
      renderStage();
    });
    alphabetGrid.appendChild(card);
  }
}

function showPlayer() {
  player.hidden = false;
  player.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ---- Playback --------------------------------------------------------------
function play() {
  if (state.tokens.length === 0) return;
  state.playing = true;
  playIcon.hidden = true;
  pauseIcon.hidden = false;
  playBtn.setAttribute('aria-label', 'Pause');
  scheduleTick();
}

function pause() {
  state.playing = false;
  playIcon.hidden = false;
  pauseIcon.hidden = true;
  playBtn.setAttribute('aria-label', 'Play');
  if (state.timer) {
    clearTimeout(state.timer);
    state.timer = null;
  }
}

function scheduleTick() {
  if (state.timer) clearTimeout(state.timer);
  // Pauses (punctuation) get a slightly longer hold
  const token = state.tokens[state.index];
  const isPause = token && (token.kind === 'pause' || token.kind === 'word-end');
  const ms = isPause ? Math.max(state.intervalMs * 0.6, 400) : state.intervalMs;
  state.timer = setTimeout(advance, ms);
}

function advance() {
  if (!state.playing) return;
  if (state.index < state.tokens.length - 1) {
    state.index += 1;
    renderStage();
    scheduleTick();
  } else if (state.repeat) {
    state.index = 0;
    renderStage();
    scheduleTick();
  } else {
    pause();
  }
}

function step(delta) {
  if (state.tokens.length === 0) return;
  pause();
  state.index = Math.min(state.tokens.length - 1, Math.max(0, state.index + delta));
  renderStage();
}

// ---- Events ----------------------------------------------------------------
convertBtn.addEventListener('click', () => {
  const text = textInput.value.trim();
  if (!text) {
    textInput.focus();
    return;
  }
  state.tokens = tokenize(text);
  if (state.tokens.length === 0) {
    textInput.focus();
    return;
  }
  state.index = 0;
  showPlayer();
  renderSequence();
  renderStage();
  // Auto-play for a smoother first-time experience
  play();
});

clearBtn.addEventListener('click', () => {
  textInput.value = '';
  textInput.focus();
});

textInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
    e.preventDefault();
    convertBtn.click();
  }
});

document.querySelectorAll('.suggestion').forEach((b) => {
  b.addEventListener('click', () => {
    textInput.value = b.dataset.text;
    convertBtn.click();
  });
});

playBtn.addEventListener('click', () => (state.playing ? pause() : play()));
prevBtn.addEventListener('click', () => step(-1));
nextBtn.addEventListener('click', () => step(1));

repeatBtn.addEventListener('click', () => {
  state.repeat = !state.repeat;
  repeatBtn.setAttribute('aria-pressed', String(state.repeat));
});

speedSlider.addEventListener('input', () => {
  state.intervalMs = Number(speedSlider.value);
  speedValue.textContent = `${(state.intervalMs / 1000).toFixed(1)}s / sign`;
  if (state.playing) scheduleTick();
});

langButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const lang = btn.dataset.lang;
    if (lang === state.language) return;
    state.language = lang;
    langButtons.forEach((b) => {
      const active = b.dataset.lang === lang;
      b.classList.toggle('is-active', active);
      b.setAttribute('aria-checked', String(active));
    });
    renderAlphabet();
    if (state.tokens.length > 0) renderStage();
  });
});

// Keyboard shortcuts (only when player is visible & focus isn't in the textarea)
window.addEventListener('keydown', (e) => {
  if (player.hidden) return;
  if (document.activeElement === textInput) return;
  if (e.key === ' ') {
    e.preventDefault();
    state.playing ? pause() : play();
  } else if (e.key === 'ArrowLeft') {
    step(-1);
  } else if (e.key === 'ArrowRight') {
    step(1);
  }
});

// ---- Utilities -------------------------------------------------------------
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (ch) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[ch]);
}

// ---- Initialise ------------------------------------------------------------
speedValue.textContent = `${(state.intervalMs / 1000).toFixed(1)}s / sign`;
renderAlphabet();
textInput.focus();
