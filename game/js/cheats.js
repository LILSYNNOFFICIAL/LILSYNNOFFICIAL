// Secret codes. Only ever called from the MAIN MENU code screen (see main.js: openCodes()).
// Codes are case-insensitive; spacing/punctuation is forgiven ("lil-synn" == "LIL SYNN").
// Codes only add unlock flags; they never delete progress, so they cannot corrupt a save.
// A code that starts a quest (PINK) only activates the quest; it never grants the reward.

export const COSTUMES = [
  { id: 'classic', name: 'Classic LIL SYNN', jacket: 0x0b0b0f, trim: 0x1a1a22, accent: 0xff4fb8, crown: false },
  { id: 'legend', name: 'Gold & Pink Legend', jacket: 0x16090f, trim: 0xf6c445, accent: 0xff4fb8, crown: false, code: 'JARRED' },
  { id: 'creator', name: 'Black & Gold Creator', jacket: 0x070707, trim: 0xd9a92e, accent: 0xf6c445, crown: false, code: 'JARRED' },
  { id: 'synova', name: 'SYNOVA MEDIA Signal', jacket: 0x0c0718, trim: 0x8a4dff, accent: 0x29e0ff, crown: false, code: 'JARRED' },
  { id: 'crowned', name: 'Crowned', jacket: 0x0b0b0f, trim: 0xf6c445, accent: 0xf6c445, crown: true, code: 'JARRED' },
  { id: 'premium', name: 'Secret Premium', jacket: 0x050508, trim: 0x2a2a36, accent: 0xff2fa8, crown: false, chrome: true, code: 'JARRED' },
];

export const normalizeCode = (s) => String(s || '').toUpperCase().replace(/[^A-Z0-9]+/g, ' ').trim();

// Required codes (spec section 14). Stage 1 = what the effect does now.
const REQUIRED = {
  'ROSIE': (u) => {
    u.swordLevel = 369;
    Object.assign(u.flags, { allUnlocked: true, allLevels: true, allItems: true, girlPlayable: true, cello: true, doubleHp: true, pinkQuest: u.flags.pinkQuest || 'active', allWeapons: true });
    u.costumes = COSTUMES.map(c => c.id);
    return ['EVERYTHING UNLOCKED', 'Magic sword Level 369, every costume, the Pink Cello, the Girl in the Yellow Dress, double hearts and all levels are unlocked. Thank you, Rosie.'];
  },
  'LIL SYNN': (u) => { u.swordLevel = Math.max(u.swordLevel, 5); return ['MAGIC SWORD LEVEL 5', 'Your magic sword starts at Level 5.']; },
  'YELLOW DRESS': (u) => { u.flags.girlPlayable = true; return ['THE GIRL IS PLAYABLE', 'The Girl in the Yellow Dress is unlocked as a playable character.']; },
  'SHADOW MAN': (u) => { u.flags.doubleHp = true; return ['DOUBLE HEARTS', 'Your maximum health is doubled for the whole game.']; },
  'CELLO': (u) => { u.flags.cello = true; return ['THE PINK MAGIC CELLO', 'The Pink Cello is yours: an area attack that deals 75% damage to every enemy it reaches. Switch to it in game (Q / mouse wheel).']; },
  'PINK': (u) => {
    if (u.flags.pinkQuest === 'complete') return ['ALREADY FOUND', 'You already recovered the Lost Microphone.'];
    u.flags.pinkQuest = 'active';
    return ['QUEST STARTED: THE LOST MICROPHONE', 'Something precious is missing… find the cat. It knows where to look.'];
  },
  'JARRED': (u) => {
    for (const c of COSTUMES) if (!u.costumes.includes(c.id)) u.costumes.push(c.id);
    return ['CREATOR COSTUMES', 'Five exclusive LIL SYNN costumes are unlocked. Find them under Wardrobe on the main menu.'];
  },
};

// Optional bonus codes (spec section 14). live = has an effect in Stage 1.
const OPTIONAL = {
  'PINK MAGIC': ['flag', 'unlimitedMana', 'Unlimited mana.', true],
  'GOD MODE': ['flag', 'godMode', 'Invincibility.', true],
  'INFINITE HEARTS': ['flag', 'infiniteHearts', 'Unlimited health.', true],
  'SONIC BOOM': ['flag', 'sonicBoom', 'Maximum Sonic Blast.', true],
  'CROWN': ['costume', 'crowned', 'Royal golden outfit.', true],
  'BLACK CAT': ['flag', 'blackCat', 'Special cat abilities.', false],
  'LOST KITTENS': ['flag', 'revealKittens', 'Kitten locations revealed.', false],
  'GALAXY': ['flag', 'galaxyOutfit', 'Cosmic outfit.', false],
  'WINGS': ['flag', 'wings', 'Flight, where supported.', false],
  'UNDERWATER': ['flag', 'unlimitedOxygen', 'Unlimited oxygen.', false],
  'FAST LANE': ['flag', 'vehicles', 'Vehicles unlocked.', false],
  'BOSS MASTER': ['flag', 'bossReplay', 'Boss replay unlocked.', false],
  'MUSIC BOX': ['flag', 'allMusicWeapons', 'All musical weapons.', true],
  'PINK STORM': ['flag', 'pinkStorm', 'Powerful area ability.', false],
  '369': ['sword', 369, 'Magic sword Level 369.', true],
  'GOLDEN TICKET': ['flag', 'bonusAreas', 'Bonus areas unlocked.', false],
  'STAGE LIGHTS': ['flag', 'concertOutfit', 'Concert outfit.', false],
  'ACOUSTIC': ['flag', 'acousticMode', 'Acoustic performance mode.', false],
  'SHADOW HUNTER': ['flag', 'shadowHunterOutfit', 'Shadow Man-inspired outfit.', false],
  'PURPLE RAIN': ['flag', 'purpleRain', 'Pink and purple magical particles.', true],
  'CAT DAD': ['flag', 'catCrown', 'A tiny crown for the cat.', true],
  'MEOW': ['flag', 'bigCat', 'The cat is… bigger.', true],
  'HEADLINER': ['flag', 'secretConcert', 'Secret concert level.', false],
  'ENCORE': ['flag', 'encore', 'Final performance replay.', false],
  'SYNTIENT': ['flag', 'devRoom', 'Secret developer room.', false],
  'LIL LEGEND': ['costume', 'legend', 'Legendary gold-and-pink outfit.', true],
};

export const REQUIRED_CODES = Object.keys(REQUIRED);
export const OPTIONAL_CODES = Object.keys(OPTIONAL);

// Applies a code to save.unlocks. Returns { ok, title, msg }.
export function applyCode(input, save) {
  const code = normalizeCode(input);
  if (!code) return { ok: false, title: 'TYPE A CODE', msg: 'Type a secret code, then press Enter.' };
  const u = save.unlocks;
  let title, msg;
  if (REQUIRED[code]) {
    [title, msg] = REQUIRED[code](u);
  } else if (OPTIONAL[code]) {
    const [kind, val, desc, live] = OPTIONAL[code];
    if (kind === 'flag') u.flags[val] = true;
    if (kind === 'sword') u.swordLevel = Math.max(u.swordLevel, val);
    if (kind === 'costume' && !u.costumes.includes(val)) u.costumes.push(val);
    title = code; msg = desc + (live ? '' : ' Saved: it switches on when that part of the adventure arrives.');
  } else {
    return { ok: false, title: 'HMM… NOT QUITE', msg: "That code doesn't ring a bell. Nothing was changed. Try another!" };
  }
  if (!u.codes.includes(code)) u.codes.push(code);
  return { ok: true, code, title, msg };
}

export const celloDamage = (enemyMaxHp) => 0.75 * enemyMaxHp; // spec 10: cello deals 75% damage
