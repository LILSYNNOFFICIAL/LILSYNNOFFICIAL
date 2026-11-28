// LIL SYNN - ROAD TO HER — versioned local save with migrations and verified writes.
// Layout: one root object in localStorage under KEY, a last-known-good copy under KEY_BAK.
// Every write is serialized, written to a temp key, read back and compared before it
// replaces the main key, so an interrupted or failed write never leaves a corrupt save.

export const SAVE_VERSION = 1;
export const KEY = 'lsmr_save';
const KEY_BAK = 'lsmr_save_bak';
const KEY_TMP = 'lsmr_save_tmp';

export const DEFAULT_SETTINGS = Object.freeze({
  master: 0.85, musicOn: true, music: 0.6, sfxOn: true, sfx: 0.8,
  sensitivity: 1, invertY: false, subtitles: true, subtitleSize: 'medium',
  brightness: 1, quality: 'auto', fill: false,
});

export function blankGame() {
  return {
    step: 0, // tutorial step index (see TUTORIAL in main.js)
    tutorialDone: false,
    hp: null, mana: 30, pouch: 0, healthPacks: 0,
    weapons: ['sonic'], weapon: 'sonic',
    defeated: 0, chestOpened: false,
    playTime: 0,
  };
}

export function blankSave() {
  return {
    version: SAVE_VERSION,
    savedAt: 0,
    settings: { ...DEFAULT_SETTINGS },
    unlocks: {
      codes: [],          // every secret code ever accepted (normalized)
      flags: {},          // effect flags, e.g. doubleHp, girlPlayable, cello, costumes, pinkQuest
      swordLevel: 1,      // 369-level magic sword (sword gameplay arrives in a later stage)
      costumes: [],       // unlocked costume ids
      costume: 'classic', // equipped costume
    },
    cutscenes: [],        // unlocked cutscene ids (Cutscene Gallery)
    current: null,        // autosave / Continue
    slots: [null, null, null], // manual save slots
  };
}

// Migration hook: each entry upgrades data from version N to N+1.
// Version 0 = anything written before versioning (or the old Broken Hearts mute flag).
const MIGRATIONS = {
  0: (d) => {
    const s = blankSave();
    try { if (localStorage.getItem('lsbh_muted') === '1') s.settings.musicOn = false; } catch (e) {}
    return Object.assign(s, d && typeof d === 'object' ? d : {}, { version: 1 });
  },
};

export function migrate(d) {
  if (!d || typeof d !== 'object') d = { version: 0 };
  let v = Number.isInteger(d.version) ? d.version : 0;
  if (v > SAVE_VERSION) throw new Error('save from a newer version');
  while (v < SAVE_VERSION) { d = MIGRATIONS[v](d); v = d.version; }
  return normalize(d);
}

// Fill any missing fields so older or partial saves never crash the game.
function normalize(d) {
  const b = blankSave();
  const out = { ...b, ...d };
  out.settings = { ...b.settings, ...(d.settings || {}) };
  out.unlocks = { ...b.unlocks, ...(d.unlocks || {}) };
  out.unlocks.flags = { ...(d.unlocks?.flags || {}) };
  out.unlocks.codes = Array.isArray(d.unlocks?.codes) ? [...d.unlocks.codes] : [];
  out.unlocks.costumes = Array.isArray(d.unlocks?.costumes) ? [...d.unlocks.costumes] : [];
  out.cutscenes = Array.isArray(d.cutscenes) ? [...d.cutscenes] : [];
  out.slots = Array.isArray(d.slots) ? [0, 1, 2].map(i => d.slots[i] ? fixGame(d.slots[i]) : null) : [null, null, null];
  out.current = d.current ? fixGame(d.current) : null;
  return out;
}
function fixGame(g) { const b = blankGame(); const o = { ...b, ...g }; o.weapons = Array.isArray(g.weapons) && g.weapons.length ? [...g.weapons] : ['sonic']; return o; }

function valid(d) { return d && typeof d === 'object' && d.version === SAVE_VERSION && d.settings && d.unlocks && Array.isArray(d.slots); }

function readKey(k) { try { const raw = localStorage.getItem(k); if (!raw) return null; return migrate(JSON.parse(raw)); } catch (e) { return null; } }

export function load() {
  const main = readKey(KEY); if (valid(main)) return { data: main, source: 'main' };
  const bak = readKey(KEY_BAK); if (valid(bak)) return { data: bak, source: 'backup' };
  return { data: migrate(null), source: 'new' };
}

// Returns true only when the write was verified.
export function write(data) {
  try {
    data.version = SAVE_VERSION; data.savedAt = Date.now();
    const raw = JSON.stringify(data);
    localStorage.setItem(KEY_TMP, raw);
    if (localStorage.getItem(KEY_TMP) !== raw) return false;
    JSON.parse(raw); // sanity
    const prev = localStorage.getItem(KEY);
    if (prev) { try { if (valid(migrate(JSON.parse(prev)))) localStorage.setItem(KEY_BAK, prev); } catch (e) {} }
    localStorage.setItem(KEY, raw);
    const ok = localStorage.getItem(KEY) === raw;
    localStorage.removeItem(KEY_TMP);
    return ok;
  } catch (e) { return false; }
}

export function snapshotGame(g) { return JSON.parse(JSON.stringify(g)); }
