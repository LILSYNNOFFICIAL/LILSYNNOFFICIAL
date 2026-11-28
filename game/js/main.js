// LIL SYNN - ROAD TO HER — Stage 1: Enchanted Meadow tutorial.
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import * as SAVE from './save.js';
import { AudioSystem } from './audio.js';
import { applyCode, applyPauseCode, COSTUMES, celloDamage } from './cheats.js';
import { Character, Cat, makeMic, makeWand, makeCello, loadBody } from './characters.js';
import { buildMeadow, height, groundAt, pathX, streamZ, WATER_Y, PORTAL, POND, U, sprites } from './world.js';
import { glowTexture } from './textures.js';

const V3 = THREE.Vector3, $ = (id) => document.getElementById(id), clamp = THREE.MathUtils.clamp, lerp = THREE.MathUtils.lerp;
const damp = (a, b, k, dt) => lerp(a, b, 1 - Math.exp(-k * dt));
const BASE = new URL('../', import.meta.url).href; // .../game/
const params = new URLSearchParams(location.search);
const TEST = params.has('test');

// ---------------- save + settings ----------------
const loaded = SAVE.load(); let SV = loaded.data; const S = SV.settings;
const persist = () => SAVE.write(SV);
const flags = () => SV.unlocks.flags;

// ---------------- quality ----------------
let isTouch = matchMedia('(pointer: coarse)').matches || ('ontouchstart' in window && !matchMedia('(pointer: fine)').matches);
const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) || (isTouch && Math.min(screen.width, screen.height) < 900);
function qualityTier() { const q = params.get('q') || S.quality; if (q === 'low' || q === 'med' || q === 'high') return q; return isMobile ? 'low' : 'high'; }
const tier = qualityTier();
// Quality presets: one place to tune every tier (grass density etc. read Q.low / Q.med / Q.high in world.js).
export const QUALITY_PRESETS = {
  low: { shadows: false, shadowMap: 0, pr: 1.15, msaa: 0, bloom: 0.25, ao: false },
  med: { shadows: true, shadowMap: 1024, pr: 1.5, msaa: 4, bloom: 0.3, ao: false },
  high: { shadows: true, shadowMap: 2048, pr: 2, msaa: 4, bloom: 0.32, ao: true },
};
const QP = QUALITY_PRESETS[tier];
const Q = { tier, preset: QP, low: tier === 'low', med: tier === 'med', high: tier === 'high', shadows: QP.shadows, pr: Math.min(devicePixelRatio || 1, QP.pr) };
if (isTouch) document.body.classList.add('touch');
if ((S.fill && !isTouch) || isTouch) document.body.classList.add('fill'); // touch: always use the whole screen (portrait or landscape)

// ---------------- renderer + post ----------------
const stage = $('stage'); const SW = () => Math.max(1, stage.clientWidth), SH = () => Math.max(1, stage.clientHeight);
const renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: 'high-performance', preserveDrawingBuffer: TEST });
renderer.setPixelRatio(Q.pr); renderer.setSize(SW(), SH());
renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 0.92 * S.brightness;
renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.shadowMap.enabled = Q.shadows; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
$('app').appendChild(renderer.domElement);
const scene = new THREE.Scene(); scene.fog = new THREE.FogExp2(0xe9c8d6, 0.0019); scene.background = new THREE.Color(0xe9c8d6);
const camera = new THREE.PerspectiveCamera(58, SW() / SH(), 0.1, 1400);
const rt = new THREE.WebGLRenderTarget(SW() * Q.pr, SH() * Q.pr, { type: THREE.HalfFloatType, samples: QP.msaa });
const composer = new EffectComposer(renderer, rt); composer.setPixelRatio(Q.pr);
composer.addPass(new RenderPass(scene, camera));
let aoPass = null;
const bloom = new UnrealBloomPass(new THREE.Vector2(SW() * 0.5, SH() * 0.5), QP.bloom, 0.45, 0.9); // subtle: only magic emissives cross the threshold
composer.addPass(bloom); composer.addPass(new OutputPass());
if (QP.ao && !params.has('noao')) import('three/addons/postprocessing/GTAOPass.js').then(({ GTAOPass }) => { try { aoPass = new GTAOPass(scene, camera, SW(), SH()); aoPass.output = GTAOPass.OUTPUT.Default; aoPass.blendIntensity = 0.8; aoPass.updateGtaoMaterial({ radius: 0.6, distanceExponent: 1.5, thickness: 1.2, scale: 1 }); composer.insertPass(aoPass, 1); } catch (e) { console.warn('GTAO unavailable', e); aoPass = null; } }).catch(() => {});
const hemi = new THREE.HemisphereLight(0xdfe6ff, 0x4a6a32, 0.35); scene.add(hemi);
const sun = new THREE.DirectionalLight(0xffd9a8, 3.6); sun.castShadow = Q.shadows;
sun.shadow.mapSize.set(QP.shadowMap || 512, QP.shadowMap || 512); Object.assign(sun.shadow.camera, { left: -26, right: 26, top: 26, bottom: -26, near: 1, far: 160 }); sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.03;
scene.add(sun, sun.target);
const pmrem = new THREE.PMREMGenerator(renderer);
new RGBELoader().load(BASE + 'assets/hdri/qwantani_sunset_puresky_1k.hdr', (t) => { t.mapping = THREE.EquirectangularReflectionMapping; scene.environment = pmrem.fromEquirectangular(t).texture; t.dispose(); scene.traverse(o => { if (o.isMesh && o.material && 'envMapIntensity' in o.material) if (o.material.envMapIntensity === 1) o.material.envMapIntensity = 0.75; }); }, undefined, () => { /* procedural sky lights the scene anyway */ });
// Post-processing hook: an optional ./pipeline.js may export createPipeline({ renderer, scene, camera, Q, preset, sun, size })
// returning { render(dt), setSize(w, h), dispose?() }. If it is missing or throws, the built-in composer above is used.
let PIPE = null;
import('./pipeline.js').then(async (m) => { if (!m.createPipeline) return; const p = await m.createPipeline({ renderer, scene, camera, Q, preset: QP, sun, size: [SW(), SH()] }); if (p && p.render) { PIPE = p; console.info('custom render pipeline active'); } }).catch(() => {});
function onResize() { const w = SW(), h = SH(); renderer.setSize(w, h); composer.setSize(w, h); if (PIPE) PIPE.setSize?.(w, h); camera.aspect = w / h; camera.updateProjectionMatrix(); if (aoPass) aoPass.setSize(w, h); }
addEventListener('resize', onResize); new ResizeObserver(onResize).observe(stage);

// ---------------- audio ----------------
const AU = new AudioSystem(S);
// Song manifest: audio/tracks.json (written by the Drive sync workflow); falls back to the legacy tracks.json.
const tracksReady = AU.loadManifest(BASE + 'audio/tracks.json').then(() => AU.tracks.length ? null : AU.loadManifest(BASE + 'tracks.json')).then(() => {
  AU.tracks.forEach(t => { t.rel = t.file; t.file = /^https?:/.test(t.file) ? t.file : BASE + t.file; t.id = t.id || t.rel; });
  const want = SV.unlocks.repeatTrack; if (want && SV.unlocks.flags.songSelector) AU.repeat = AU.tracks.find(t => t.id === want || t.rel === want) || null;
  drawMusic();
});
AU.onTrack = () => drawMusic(); AU.onState = () => drawMusic();
function drawMusic() {
  const t = AU.curTrack || AU.repeat; const title = t ? t.title : 'LIL SYNN music'; const on = AU.playing() || (S.musicOn && !AU.started);
  const mt = document.getElementById('mTitle'); if (!mt) return;
  mt.textContent = (AU.repeat ? '🔁 ' : '♫ ') + title; $('mPlay').textContent = S.musicOn ? '❚❚' : '▶'; $('mPlay').title = S.musicOn ? 'Pause music (M)' : 'Play music (M)';
  $('pmTitle').textContent = (AU.repeat ? '🔁 ' : '♫ ') + title + (t?.album ? ' · ' + t.album : ''); $('pmPlay').textContent = S.musicOn ? '❚❚ PAUSE' : '▶ PLAY';
  $('pmRepeat').textContent = AU.repeat ? 'On repeat (Song Selector). Enter MESS with the pause-menu code button to return to random songs.' : 'Random LIL SYNN songs · N next · M pause/play · B replay';
  $('mNext').disabled = $('pmNext').disabled = !!AU.repeat; void on;
}
function musicCmd(c) {
  AU.unlock();
  if (c === 'next') { if (AU.repeat) { toast('Song on repeat: enter MESS in the pause menu to shuffle again', 2.2); return; } AU.skip(); toast('» ' + (AU.curTrack?.title || 'Next song'), 1.4); }
  if (c === 'play') { const on = AU.togglePlay(); persist(); toast(on ? '▶ Music on' : '❚❚ Music paused', 1.2); }
  if (c === 'replay') { AU.replay(); toast('↺ ' + (AU.curTrack?.title || 'Replay'), 1.2); }
  G.fs.music = true; drawMusic();
}
const sfx = (n, x) => AU.play(n, x);
addEventListener('pointerdown', () => AU.unlock(), { capture: true }); addEventListener('keydown', () => AU.unlock(), { capture: true });

// ---------------- characters ----------------
const costumeOf = () => COSTUMES.find(c => c.id === SV.unlocks.costume) || COSTUMES[0];
const lil = new Character('lil', { costume: costumeOf() }); scene.add(lil.root);
const girl = new Character('girl'); scene.add(girl.root);
const shadow = new Character('shadow'); scene.add(shadow.root); shadow.root.visible = true; // Shadow Man: the tutorial guide
const cat = new Cat(tier); scene.add(cat.root);
const W8 = { sonic: makeMic(), wand: makeWand(), cello: makeCello() };
const celloProp = makeCello(); celloProp.visible = false; scene.add(celloProp);
Character.camera = camera;
const BODY = {}; // which body each character ended up with (glb | sprite | procedural)
fetch(BASE + 'characters.json').then(r => r.json()).catch(() => ({})).then(async (cfg) => {
  BODY.lil = await loadBody(lil, cfg.lil?.sources, BASE); lil.hold(W8[P.weapon] || W8.sonic);
  BODY.cat = await loadBody(cat, cfg.cat?.sources, BASE); if (BODY.cat !== 'procedural') cat.setCrown = () => {};
  BODY.girl = await loadBody(girl, cfg.girl?.sources, BASE); BODY.shadow = await loadBody(shadow, cfg.shadow?.sources, BASE);
});
lil.hold(W8.sonic);

// ---------------- world ----------------
let W = null; let loadP = 0;
const loadTick = setInterval(() => { loadP = Math.min(0.9, loadP + 0.03); $('loadFill').style.width = (loadP * 100) + '%'; }, 120);
const worldReady = buildMeadow(scene, Q, BASE).then(w => { W = w; buildTraining(); clearInterval(loadTick); $('loadFill').style.width = '100%'; $('loadTxt').textContent = 'ROAD TO HER · the meadow is ready'; setTimeout(() => $('loadBar').classList.add('hidden'), 700); placeIdle(); return w; })
  .catch(e => { console.error(e); clearInterval(loadTick); $('loadTxt').textContent = 'Could not load the meadow. Please refresh.'; throw e; });

// ---------------- state ----------------
const G = { state: 'menu', t: 0, step: 0, stepT: 0, idleT: 0, yawAcc: 0, ranT: 0, fs: {}, game: null, cine: null };
const P = { pos: new V3(), vel: new V3(), face: Math.PI, onGround: true, coyote: 0, jumps: 0, hp: 10, maxHp: 10, mana: 30, maxMana: 100, pouch: 0, packs: 0, inv: 0, hurtT: 0, landT: 0, upper: null, upperT: 0, upperDur: 0, fireCd: 0, runT: 0, sprint: false, weapon: 'sonic', weapons: ['sonic'], absorb: null, wading: false, stepAcc: 0, swim: false, climb: null, roll: 0, rollCd: 0, rollDir: new V3(), meleeCd: 0, breath: 100, drownT: 0 };
const cam = { yaw: 0, pitch: 0.28, dist: 5.4, target: new V3(), shake: 0, pos: new V3() };
const enemies = [], pickups = [], shots = [], fx = [], bells = [];

function maxHpNow() { return (flags().doubleHp ? 20 : 10); }
function weaponsNow() { const w = ['sonic']; if (G.game?.chestOpened || flags().allWeapons || flags().allMusicWeapons) w.push('wand'); if (flags().cello) w.push('cello'); return w; }
const WEAPONS = {
  sonic: { name: 'SONIC BLAST', icon: '♪', cost: 2, cd: 0.22, dmg: 1 },
  wand: { name: 'STAR WAND', icon: '★', cost: 8, cd: 0.55, dmg: 1.2 },
  cello: { name: 'PINK CELLO', icon: '𝄞', cost: 30, cd: 2.4, dmg: 0 },
};

// ---------------- HUD ----------------
const HEART = (cls) => `<svg class="${cls}" viewBox="0 0 100 92"><defs><linearGradient id="hg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffb3e0"/><stop offset=".55" stop-color="#ff4fb8"/><stop offset="1" stop-color="#c0207e"/></linearGradient></defs><path d="M50 88 C20 66 2 48 2 28 C2 12 14 2 28 2 C38 2 46 8 50 16 C54 8 62 2 72 2 C86 2 98 12 98 28 C98 48 80 66 50 88Z" fill="${cls === 'e' ? 'rgba(60,20,70,.55)' : 'url(#hg)'}" stroke="${cls === 'e' ? 'rgba(255,211,107,.6)' : '#ffd36b'}" stroke-width="5"/>${cls === 'e' ? '' : '<ellipse cx="30" cy="24" rx="10" ry="7" fill="rgba(255,255,255,.55)"/>'}</svg>`;
const CRACK = '<svg class="crack" viewBox="0 0 100 92"><polyline points="52,14 40,34 58,50 42,70 50,88" fill="none" stroke="#fff" stroke-width="6" stroke-linejoin="round"/></svg>';
let hudHearts = [];
function buildHealthHUD() { const el = $('health'); el.innerHTML = ''; hudHearts = []; for (let i = 0; i < P.maxHp / 2; i++) { const d = document.createElement('div'); d.className = 'hh'; d.innerHTML = HEART('e') + HEART('f') + CRACK + HEART('sl') + HEART('sr'); el.appendChild(d); hudHearts.push({ d, v: -1 }); } drawHealth(true); }
function drawHealth(silent) {
  hudHearts.forEach((h, i) => { const v = clamp(Math.ceil(P.hp) - i * 2, 0, 2); if (v === h.v) return; const prev = h.v; h.v = v; const c = h.d.classList; c.remove('cracked', 'broken', 'mend'); if (!silent) void h.d.offsetWidth;
    if (v === 1) c.add('cracked'); if (v === 0) { c.add('broken'); if (!silent && prev > 0) { c.remove('shatter'); void h.d.offsetWidth; c.add('shatter'); } } if (!silent && prev >= 0 && v > prev) c.add('mend'); });
}
function drawMana() { const unl = flags().unlimitedMana; if (unl) P.mana = P.maxMana; $('manaFill').style.width = (P.mana / P.maxMana * 100) + '%'; $('manaGhost').style.width = (P.mana / P.maxMana * 100) + '%'; $('manaTxt').textContent = unl ? 'MANA ∞' : `MANA ${Math.floor(P.mana)}`; }
function drawPouch() { $('pouchN').textContent = P.pouch; $('packN').textContent = P.packs; }
function drawWeapon() { const w = WEAPONS[P.weapon]; $('wIcon').textContent = w.icon; $('wName').textContent = w.name; $('wCost').textContent = `${w.cost} mana`; const el = $('weapon'); el.classList.remove('swap'); void el.offsetWidth; el.classList.add('swap'); }
let toastT = 0; function toast(m, d = 2.2) { $('toast').textContent = m; $('toast').classList.add('on'); toastT = d; }
const KEYS = { move: ['<kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd>', 'the left stick'], run: ['hold <kbd>SHIFT</kbd>', 'push the stick all the way'], jump: ['<kbd>SPACE</kbd>', '<kbd>JUMP</kbd>'], fire: ['<kbd>E</kbd> or click', '<kbd>♪</kbd>'], use: ['<kbd>F</kbd>', '<kbd>USE</kbd>'], swap: ['<kbd>Q</kbd> / mouse wheel', '<kbd>⇄</kbd>'], mic: ['<kbd>R</kbd>', '<kbd>MIC</kbd>'], heal: ['<kbd>H</kbd>', '<kbd>✚</kbd>'], look: ['the mouse (click the game to lock it)', 'a finger on the right side'], melee: ['<kbd>V</kbd> or right-click', '<kbd>HIT</kbd>'], roll: ['<kbd>C</kbd>', '<kbd>ROLL</kbd>'], dive: ['<kbd>C</kbd>', '<kbd>DIVE</kbd>'], drop: ['<kbd>C</kbd>', '<kbd>DROP</kbd>'], climb: ['<kbd>W</kbd> / <kbd>S</kbd>', 'the stick up / down'], pause: ['<kbd>Esc</kbd> or <kbd>P</kbd>', '<kbd>II</kbd>'] };
const K = (k) => KEYS[k][isTouch ? 1 : 0];
function setInputMode(touch) {
  if (touch === isTouch) return; isTouch = touch; document.body.classList.toggle('touch', touch); if (touch) document.body.classList.add('fill'); else document.body.classList.toggle('fill', !!S.fill);
  $('touch').classList.toggle('hidden', !(touch && (G.state === 'play'))); if (G.state === 'play' && STEPS[G.step]) prompt(STEPS[G.step].p());
}
addEventListener('pointerdown', (e) => setInputMode(e.pointerType === 'touch' || e.pointerType === 'pen'), { capture: true });
addEventListener('keydown', () => setInputMode(false), { capture: true });
document.addEventListener('gesturestart', (e) => e.preventDefault()); document.addEventListener('dblclick', (e) => e.preventDefault());
function prompt(html) { const p = $('prompt'); p.innerHTML = html || ''; }
function promptDone() { const p = $('prompt'); p.classList.remove('done'); void p.offsetWidth; p.classList.add('done'); sfx('cue'); }
let subQ = [], subT = 0;
function say(who, text, dur) { if (!S.subtitles && G.state !== 'cutscene') { subQ.push({ who, text, dur: dur || 3.2, silent: true }); return; } subQ.push({ who, text, dur: dur || Math.max(2.6, text.length * 0.06) }); }
function drawSubs(dt) {
  if (subT > 0) { subT -= dt; if (subT <= 0) $('subs').innerHTML = ''; return; }
  const n = subQ.shift(); if (!n) return; subT = n.dur; if (!S.subtitles) return;
  const cls = { 'SHADOW MAN': 'shadow', 'THE CAT': 'cat', 'THE GIRL': 'girl' }[n.who] || '';
  $('subs').innerHTML = `<span class="line">${n.who ? `<span class="who ${cls}">${n.who}</span>` : ''}${n.text}</span>`;
}
function applySubSize() { stage.style.setProperty('--subSize', { small: '14px', medium: '16px', large: '20px' }[S.subtitleSize] || '16px'); }
applySubSize();

// ---------------- input ----------------
const keys = new Set(); const inp = { stick: new THREE.Vector2(), jump: 0, fire: false, fireTap: 0, act: false };
const mouse = { active: 0, x: 0, y: 0, locked: false, ndc: new THREE.Vector2() };
const inGame = () => G.state === 'play';
addEventListener('keydown', (e) => {
  if (G.state === 'codes' || G.state === 'pcodes') { if (e.key === 'Escape') closeCodes(); return; }
  // Pause-menu exception: CTRL opens a code box that only accepts MESS (Song Selector repeat off).
  if (e.key === 'Control' && G.state === 'paused' && !$('sheet').classList.contains('show')) { e.preventDefault(); openPauseCodes(); return; }
  if ((G.state === 'play' || G.state === 'paused') && !e.repeat && !e.ctrlKey && !e.metaKey) { if (e.code === 'KeyN') { musicCmd('next'); return; } if (e.code === 'KeyM') { musicCmd('play'); return; } if (e.code === 'KeyB') { musicCmd('replay'); return; } }
  // CTRL opens the secret-code screen ONLY on the main menu (never during gameplay or pause).
  if ((e.key === 'Control') && G.state === 'menu' && $('menu').classList.contains('show') && !$('sheet').classList.contains('show')) { e.preventDefault(); openCodes(); return; }
  if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code) && inGame()) e.preventDefault();
  if (e.repeat) return; keys.add(e.code);
  if (G.state === 'cutscene' && (e.code === 'Escape' || e.code === 'Enter')) { skipCine(); return; }
  if (e.code === 'Escape' || e.code === 'KeyP') { if (G.state === 'play') pauseGame(true); else if (G.state === 'paused' && !$('sheet').classList.contains('show')) pauseGame(false); else if ($('sheet').classList.contains('show')) closeSheet(); else if ($('catMenu').classList.contains('show')) closeCat(); return; }
  if (!inGame()) return;
  if (e.code === 'Space') inp.jump = 0.15;
  if (e.code === 'KeyE') { inp.fire = true; inp.fireTap = 0.12; }
  if (e.code === 'KeyQ') cycleWeapon(1);
  if (e.code === 'Digit1') setWeapon('sonic'); if (e.code === 'Digit2') setWeapon('wand'); if (e.code === 'Digit3') setWeapon('cello');
  if (e.code === 'KeyR') startAbsorb();
  if (e.code === 'KeyF') interact();
  if (e.code === 'KeyH') useHealthPack();
  if (e.code === 'KeyV') melee();
  if (e.code === 'KeyC') { inp.act = true; actTap(); }
});
addEventListener('keyup', (e) => { keys.delete(e.code); if (e.code === 'KeyE') inp.fire = false; if (e.code === 'KeyC') inp.act = false; });
addEventListener('blur', () => { keys.clear(); inp.fire = false; if (G.state === 'play') pauseGame(true); });
const cv = renderer.domElement;
const drag = { id: null, x: 0, y: 0 }, stick = { id: null, ox: 0, oy: 0 };
function lookBy(dx, dy, s) { const k = s * S.sensitivity; cam.yaw -= dx * k; cam.pitch = clamp(cam.pitch + dy * k * (S.invertY ? -1 : 1), -0.35, 1.1); G.yawAcc += Math.abs(dx * k); }
cv.addEventListener('pointerdown', (e) => {
  if (!inGame()) return; const rc = stage.getBoundingClientRect();
  if (e.pointerType === 'mouse') {
    if (!mouse.locked && !TEST && cv.requestPointerLock) { try { const r = cv.requestPointerLock(); if (r && r.catch) r.catch(() => {}); } catch (err) {} }
    if (e.button === 2) { melee(); drag.id = e.pointerId; drag.x = e.clientX; drag.y = e.clientY; return; }
    if (e.button === 0 && (mouse.locked || e.shiftKey === false)) { if (mouse.locked) { inp.fire = true; inp.fireTap = 0.12; } }
    drag.id = e.pointerId; drag.x = e.clientX; drag.y = e.clientY; return;
  }
  if (e.clientX - rc.left < rc.width * 0.45 && stick.id === null) { stick.id = e.pointerId; stick.ox = e.clientX; stick.oy = e.clientY; const b = $('stickBase'); b.style.left = (e.clientX - rc.left - 58) + 'px'; b.style.top = (e.clientY - rc.top - 58) + 'px'; b.style.bottom = 'auto'; b.style.opacity = 1; }
  else if (drag.id === null) { drag.id = e.pointerId; drag.x = e.clientX; drag.y = e.clientY; }
  cv.setPointerCapture?.(e.pointerId);
});
addEventListener('pointermove', (e) => {
  if (e.pointerType === 'mouse') {
    const rc = stage.getBoundingClientRect(); mouse.x = e.clientX - rc.left; mouse.y = e.clientY - rc.top;
    if (mouse.locked) { lookBy(e.movementX, e.movementY, 0.0024); mouse.active = 1.4; }
    else { mouse.active = 1.4; if (drag.id === e.pointerId && e.buttons) { lookBy(e.clientX - drag.x, e.clientY - drag.y, 0.005); drag.x = e.clientX; drag.y = e.clientY; } }
    return;
  }
  if (e.pointerId === stick.id) { let dx = e.clientX - stick.ox, dy = e.clientY - stick.oy; const l = Math.hypot(dx, dy), m = 50; if (l > m) { dx *= m / l; dy *= m / l; } inp.stick.set(dx / m, -dy / m); $('stickKnob').style.transform = `translate(${dx}px, ${dy}px)`; }
  else if (e.pointerId === drag.id) { lookBy(e.clientX - drag.x, e.clientY - drag.y, 0.008); drag.x = e.clientX; drag.y = e.clientY; }
});
const endPtr = (e) => { if (e.pointerId === stick.id) { stick.id = null; inp.stick.set(0, 0); $('stickKnob').style.transform = ''; $('stickBase').style.opacity = 0.65; } if (e.pointerId === drag.id) drag.id = null; if (e.pointerType === 'mouse' && mouse.locked) inp.fire = false; };
addEventListener('pointerup', endPtr); addEventListener('pointercancel', endPtr);
document.addEventListener('pointerlockchange', () => { const was = mouse.locked; mouse.locked = document.pointerLockElement === cv; if (was && !mouse.locked && G.state === 'play') pauseGame(true); });
cv.addEventListener('wheel', (e) => { if (inGame()) cycleWeapon(e.deltaY > 0 ? 1 : -1); }, { passive: true });
cv.addEventListener('contextmenu', (e) => e.preventDefault());
const tb = (id, fn, up) => { const el = $(id); el.addEventListener('pointerdown', (e) => { e.preventDefault(); e.stopPropagation(); fn(); }); if (up) el.addEventListener('pointerup', (e) => { e.preventDefault(); up(); }); };
tb('tJump', () => inp.jump = 0.15); tb('tFire', () => { inp.fire = true; inp.fireTap = 0.12; }, () => inp.fire = false); tb('tSwap', () => cycleWeapon(1)); tb('tMic', () => startAbsorb()); tb('tUse', () => interact()); tb('tHeal', () => useHealthPack()); tb('tPause', () => pauseGame(true));
tb('tMelee', () => melee()); tb('tAct', () => { inp.act = true; actTap(); }, () => { inp.act = false; });
// context button / C key: ROLL on land, DIVE (hold) in deep water, DROP while climbing
function actTap() { if (!inGame()) return; if (P.climb) { P.climb = null; P.vel.set(-1.5, 0, 0); P.onGround = false; return; } if (P.swim) return; roll(); }
for (const [id, c] of [['mReplay', 'replay'], ['mPlay', 'play'], ['mNext', 'next'], ['pmReplay', 'replay'], ['pmPlay', 'play'], ['pmNext', 'next']]) $(id).addEventListener('click', (e) => { e.stopPropagation(); musicCmd(c); });
['music', 'pMusic'].forEach(id => $(id).addEventListener('pointerdown', (e) => e.stopPropagation()));

function toggleFullscreen() {
  const el = document.documentElement, fsEl = document.fullscreenElement || document.webkitFullscreenElement, req = el.requestFullscreen || el.webkitRequestFullscreen;
  if (fsEl) { (document.exitFullscreen || document.webkitExitFullscreen).call(document); return; }
  if (req) { try { const r = req.call(el, { navigationUI: 'hide' }); if (r && r.catch) r.catch(() => document.body.classList.toggle('fill')); } catch (e) { document.body.classList.toggle('fill'); } }
  else { document.body.classList.toggle('fill'); setTimeout(() => scrollTo(0, 1), 50); }
}
function toggleFill() { const on = document.body.classList.toggle('fill'); S.fill = on; persist(); }
$('btnFs').onclick = toggleFullscreen; $('btnFill').onclick = toggleFill; $('btnPause').onclick = () => pauseGame(true);

// ---------------- weapons + combat ----------------
function setWeapon(id, quiet) { if (!weaponsNow().includes(id)) { if (!quiet && id !== P.weapon) toast(id === 'cello' ? 'The Pink Cello is still a secret…' : 'Not found yet', 1.2); return; } if (id === P.weapon) return; P.weapon = id; lil.hold(W8[id]); P.upper = 'switch'; P.upperT = 0; P.upperDur = 0.3; sfx('switch'); drawWeapon(); G.fs.switched = true; }
function cycleWeapon(d) { const w = weaponsNow(); const i = w.indexOf(P.weapon); setWeapon(w[(i + d + w.length) % w.length]); }
const tmp = new V3(), tmp2 = new V3(), ray = new THREE.Raycaster();
function handWorld(out) { const h = lil.held || lil.hand; if (h) h.getWorldPosition(out); else out.copy(P.pos).add(new V3(0, 1.3, 0)); if (out.distanceTo(P.pos) > 2.5) out.copy(P.pos).add(new V3(0, 1.3, 0)); return out; }
function aimPoint() {
  const usingMouse = mouse.locked || (!isTouch && mouse.active > 0);
  if (usingMouse) {
    const ndc = mouse.locked ? new THREE.Vector2(0, 0) : new THREE.Vector2(mouse.x / SW() * 2 - 1, -(mouse.y / SH()) * 2 + 1);
    ray.setFromCamera(ndc, camera); let best = 60, hit = null;
    for (const t of [...enemies.filter(e => e.alive), ...bells.filter(b => !b.rung && b.g.visible)]) { const c = t.center(); const d = ray.ray.distanceSqToPoint(c); const r = t.r * 1.3; if (d < r * r) { const dist = ray.ray.origin.distanceTo(c); if (dist < best) { best = dist; hit = c; } } }
    return hit ? hit.clone() : ray.ray.at(40, new V3());
  }
  // no mouse: soft auto-aim at the nearest target in front, else straight ahead
  const fwd = new V3(Math.sin(P.face), 0, Math.cos(P.face)); let best = null, bd = 30;
  for (const t of [...enemies.filter(e => e.alive), ...bells.filter(b => !b.rung && b.g.visible)]) { const c = t.center(); tmp.subVectors(c, P.pos); const d = tmp.length(); tmp.y = 0; tmp.normalize(); if (tmp.dot(fwd) > 0.78 && d < bd) { bd = d; best = c; } }
  return best ? best.clone() : P.pos.clone().add(fwd.multiplyScalar(30)).add(new V3(0, 1.3, 0));
}
const noteMat = new THREE.MeshStandardMaterial({ color: 0xff8ad6, emissive: 0xff3fb4, emissiveIntensity: 2.4, roughness: 0.3 });
const blackMat = new THREE.MeshStandardMaterial({ color: 0x050008, emissive: 0x16002a, emissiveIntensity: 1, roughness: 0.4 });
function noteMesh() { const g = new THREE.Group(); const h = new THREE.Mesh(new THREE.SphereGeometry(0.09, 14, 10), noteMat); h.scale.set(1.25, 0.85, 0.9); h.rotation.z = 0.4; g.add(h); const st = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.32, 6), noteMat); st.position.set(0.09, 0.16, 0); g.add(st); const fl = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.03, 0.02), noteMat); fl.position.set(0.14, 0.3, 0); fl.rotation.z = -0.6; g.add(fl); return g; }
function starMesh() { const s = new THREE.Shape(); for (let i = 0; i < 10; i++) { const r = i % 2 ? 0.06 : 0.15, a = i / 10 * Math.PI * 2; i ? s.lineTo(Math.cos(a) * r, Math.sin(a) * r) : s.moveTo(Math.cos(a) * r, Math.sin(a) * r); } return new THREE.Mesh(new THREE.ExtrudeGeometry(s, { depth: 0.03, bevelEnabled: true, bevelThickness: 0.015, bevelSize: 0.01, bevelSegments: 1 }), new THREE.MeshStandardMaterial({ color: 0xffe08a, emissive: 0xff7ad0, emissiveIntensity: 2.6 })); }
const trailTex = glowTexture();
function fire() {
  const w = WEAPONS[P.weapon]; if (P.fireCd > 0 || P.absorb) return;
  if (!flags().unlimitedMana && P.mana < w.cost) { if (P.weapon === 'sonic' && P.mana >= 0.5) {} else { toast(P.pouch ? 'Out of mana: press R to absorb your hearts' : 'Out of mana: collect hearts', 1.6); P.fireCd = 0.4; return; } }
  P.mana = Math.max(0, P.mana - w.cost); P.fireCd = w.cd; drawMana();
  const target = aimPoint(); const from = handWorld(new V3()); const dir = new V3().subVectors(target, from).normalize();
  P.face = Math.atan2(dir.x, dir.z); // turn toward the aim
  if (P.weapon === 'cello') { celloWave(); return; }
  P.upper = P.weapon === 'wand' ? 'wand' : 'attack'; P.upperT = 0; P.upperDur = P.weapon === 'wand' ? 0.4 : 0.28;
  const boom = flags().sonicBoom ? 2 : 1;
  const mk = (d, kind) => { const m = kind === 'wand' ? starMesh() : noteMesh(); if (kind === 'sonic' && boom > 1) m.scale.setScalar(1.6); m.position.copy(from); scene.add(m);
    const tr = sprites(14, trailTex, kind === 'wand' ? 0xffe0a0 : 0xff6ad5, kind === 'wand' ? 0.35 : 0.28, 0.7); scene.add(tr);
    const sh = { m, tr, vel: d.clone().multiplyScalar(kind === 'wand' ? 26 : 22), life: 1.7, dmg: w.dmg * (kind === 'sonic' ? boom : 1), kind, hist: [], black: 0 };
    if (kind === 'sonic' && G.step === 4 && !G.fs.blackNote && G.fs.shots >= 2) { G.fs.blackNote = true; sh.black = 0.35; } // foreshadowing: one note turns black, then back
    shots.push(sh); };
  if (P.weapon === 'wand') { for (const a of [-0.1, 0, 0.1]) mk(dir.clone().applyAxisAngle(new V3(0, 1, 0), a), 'wand'); sfx('star'); }
  else { mk(dir, 'sonic'); sfx('sonic'); }
  G.fs.shots = (G.fs.shots || 0) + 1; G.fs.lastShotKind = P.weapon;
  burst(from, 0xff7ad0, 8, 2.5, 0.35);
}
function celloWave() {
  P.upper = 'cello'; P.upperT = 0; P.upperDur = 1.2; sfx('cello');
  celloProp.visible = true; celloProp.position.copy(P.pos).add(new V3(Math.sin(P.face) * 0.45, 0, Math.cos(P.face) * 0.45)); celloProp.rotation.set(-0.25, P.face + Math.PI, 0); celloProp.userData.t = 1.4;
  const R = 9; for (let k = 0; k < 3; k++) setTimeout(() => ring(P.pos.clone().add(new V3(0, 0.3, 0)), 0xff5fbf, R, 0.9, true), k * 180);
  setTimeout(() => { for (const e of enemies) if (e.alive && e.pos.distanceTo(P.pos) < R) e.hit(celloDamage(e.maxHp), P.pos, 'cello'); }, 260);
}
function ring(pos, color, radius, dur, ground) { const m = new THREE.Mesh(new THREE.RingGeometry(0.8, 1, 64), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.8, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending })); m.position.copy(pos); if (ground) m.rotation.x = -Math.PI / 2; else m.lookAt(camera.position); scene.add(m); fx.push({ m, t: 0, dur, kind: 'ring', radius }); }
function burst(pos, color, n = 16, speed = 4, life = 0.6) { const p = sprites(n, glowTexture(), color, 0.25, 1); p.position.copy(pos); const v = []; for (let i = 0; i < n; i++) v.push(new V3(Math.random() - 0.5, Math.random() - 0.2, Math.random() - 0.5).normalize().multiplyScalar(speed * (0.4 + Math.random()))); scene.add(p); fx.push({ m: p, t: 0, dur: life, kind: 'burst', v }); }
function miniNotes(pos, n = 3) { for (let i = 0; i < n; i++) { const m = noteMesh(); m.scale.setScalar(0.5); m.position.copy(pos); scene.add(m); fx.push({ m, t: 0, dur: 0.9, kind: 'float', v: new V3((Math.random() - 0.5) * 1.5, 1.6 + Math.random(), (Math.random() - 0.5) * 1.5) }); } }
function updateShots(dt) {
  for (let i = shots.length - 1; i >= 0; i--) {
    const s = shots[i]; s.life -= dt; const step = s.vel.clone().multiplyScalar(dt); s.m.position.add(step); s.m.rotation.y += dt * 8; if (s.kind === 'wand') s.m.rotation.z += dt * 12;
    if (s.black > 0) { s.black -= dt; s.m.traverse(o => { if (o.isMesh) o.material = s.black > 0 ? blackMat : noteMat; }); }
    s.hist.unshift(s.m.position.clone()); if (s.hist.length > 14) s.hist.pop(); const tp = s.tr.geometry.attributes.position; s.hist.forEach((h, k) => tp.setXYZ(k, h.x, h.y, h.z)); for (let k = s.hist.length; k < 14; k++) tp.setXYZ(k, s.m.position.x, s.m.position.y, s.m.position.z); tp.needsUpdate = true;
    let hit = null; const p = s.m.position;
    for (const e of enemies) if (e.alive && p.distanceTo(e.center()) < e.r + 0.15) { hit = e; break; }
    if (!hit) for (const b of bells) if (!b.rung && b.g.visible && p.distanceTo(b.center()) < b.r + 0.1) { hit = b; break; }
    const gy = height(p.x, p.z);
    if (hit || s.life <= 0 || p.y < gy) {
      if (hit) { hit.hit(s.dmg, p, s.kind); sfx('impact'); ring(p.clone(), s.kind === 'wand' ? 0xffd36b : 0xff6ad5, 1.6, 0.35); burst(p.clone(), s.kind === 'wand' ? 0xffe08a : 0xff7ad0, 18, 4, 0.5); miniNotes(p.clone(), 2); }
      else if (p.y < gy) { burst(p.clone(), 0xffc0e6, 8, 2, 0.4); }
      scene.remove(s.m); scene.remove(s.tr); s.tr.geometry.dispose(); shots.splice(i, 1);
    }
  }
}
function updateFx(dt) {
  for (let i = fx.length - 1; i >= 0; i--) { const f = fx[i]; f.t += dt; const k = f.t / f.dur;
    if (f.kind === 'ring') { const s = 0.3 + k * f.radius; f.m.scale.setScalar(s); f.m.material.opacity = 0.8 * (1 - k); }
    if (f.kind === 'burst') { const p = f.m.geometry.attributes.position; for (let j = 0; j < p.count; j++) { const v = f.v[j]; p.setXYZ(j, v.x * f.t, v.y * f.t - 2 * f.t * f.t, v.z * f.t); } p.needsUpdate = true; f.m.material.opacity = 1 - k; }
    if (f.kind === 'float') { f.m.position.addScaledVector(f.v, dt); f.m.rotation.y += dt * 4; f.m.scale.setScalar(0.5 * (1 - k * 0.6)); }
    if (f.kind === 'orb') { f.update(dt, k); }
    if (k >= 1) { scene.remove(f.m); if (f.m.geometry) f.m.geometry.dispose?.(); fx.splice(i, 1); if (f.done) f.done(); }
  }
  if (celloProp.visible) { celloProp.userData.t -= dt; if (celloProp.userData.t <= 0) celloProp.visible = false; }
}

// ---------------- gloomlings: gentle corrupted creatures that get purified ----------------
const gloomMat = () => new THREE.MeshPhysicalMaterial({ color: 0x4a2a6a, roughness: 0.7, sheen: 1, sheenColor: new THREE.Color(0xb080ff), sheenRoughness: 0.4, emissive: 0x1a0830, emissiveIntensity: 0.6 });
class Gloomling {
  constructor(pos, big = false) {
    this.big = big; this.maxHp = big ? 12 : 3; this.hp = this.maxHp; this.alive = true; this.r = big ? 0.95 : 0.5; this.pos = pos.clone(); this.vel = new V3(); this.t = Math.random() * 5; this.state = 'idle'; this.st = 0; this.flash = 0; this.cd = 1;
    const g = new THREE.Group(); this.g = g; const s = big ? 1.9 : 1; g.scale.setScalar(s);
    this.mat = gloomMat(); const body = new THREE.Mesh(new THREE.SphereGeometry(0.45, 32, 24), this.mat); body.position.y = 0.45; body.castShadow = true; g.add(body); this.body = body;
    for (let i = 0; i < 14; i++) { const a = i / 14 * Math.PI * 2, b = (i % 3) * 0.4; const t = new THREE.Mesh(new THREE.SphereGeometry(0.13, 10, 8), this.mat); t.position.set(Math.cos(a) * 0.38, 0.62 + Math.sin(b) * 0.15, Math.sin(a) * 0.38); body.add(t); t.position.y -= 0.45; }
    const eyeW = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.1, clearcoat: 1 }), pup = new THREE.MeshPhysicalMaterial({ color: 0x1a0a2a, roughness: 0.05, clearcoat: 1 });
    for (const sx of [-1, 1]) { const e = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 12), eyeW); e.position.set(sx * 0.15, 0.1, 0.38); e.scale.set(1, 1.2, 0.6); body.add(e); const p = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 10), pup); p.position.set(sx * 0.15, 0.08, 0.44); body.add(p); const hl = new THREE.Mesh(new THREE.SphereGeometry(0.018, 8, 6), new THREE.MeshBasicMaterial({ color: 0xffffff })); hl.position.set(sx * 0.15 + 0.025, 0.12, 0.48); body.add(hl); const br = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.02, 0.02), pup); br.position.set(sx * 0.15, 0.24, 0.41); br.rotation.z = sx * 0.35; body.add(br); }
    this.heartMat = new THREE.MeshStandardMaterial({ color: 0x7a2a5a, emissive: 0xff3fa0, emissiveIntensity: 0.5 }); const h = new THREE.Mesh(heartGeo(0.09), this.heartMat); h.position.set(0, -0.12, 0.42); body.add(h);
    for (const sx of [-1, 1]) { const f = new THREE.Mesh(new THREE.SphereGeometry(0.11, 10, 8), this.mat); f.position.set(sx * 0.2, 0.06, 0.08); f.scale.set(1, 0.6, 1.3); g.add(f); }
    g.position.copy(pos); scene.add(g);
    const bar = new THREE.Sprite(new THREE.SpriteMaterial({ color: 0xff7ad0, transparent: true, opacity: 0, depthWrite: false })); bar.scale.set(0.6, 0.05, 1); bar.position.y = 1.15; g.add(bar); this.bar = bar;
  }
  center() { return this.g.position.clone().add(new V3(0, 0.45 * this.g.scale.y, 0)); }
  hit(d, from, kind) {
    if (!this.alive) return; this.hp -= d; this.flash = 0.15; this.bar.material.opacity = 1; this.bar.scale.x = 0.6 * Math.max(0, this.hp / this.maxHp);
    const k = tmp.subVectors(this.pos, from).setY(0).normalize().multiplyScalar(kind === 'cello' ? 7 : 3.5 / (this.big ? 2 : 1)); this.vel.add(k); this.state = 'chase';
    sfx('enemyHit'); if (this.hp <= 0.0001) this.purify();
  }
  purify() {
    this.alive = false; this.state = 'purify'; this.st = 0; sfx('purify'); burst(this.center(), 0xffc0ec, 40, 5, 0.9); ring(this.center(), 0xffe0f4, 3, 0.6); miniNotes(this.center(), 4);
    const n = this.big ? 5 : 2; for (let i = 0; i < n; i++) spawnHeart(this.center().add(new V3((Math.random() - 0.5) * 0.6, 0.3, (Math.random() - 0.5) * 0.6)), new V3((Math.random() - 0.5) * 3, 4 + Math.random() * 2, (Math.random() - 0.5) * 3));
    G.game.defeated++; bloomFlower(this.pos);
  }
  update(dt) {
    this.t += dt; const g = this.g;
    if (this.state === 'purify') { this.st += dt; const k = Math.min(1, this.st / 0.8); this.mat.color.lerpColors(new THREE.Color(0x4a2a6a), new THREE.Color(0xffd6f0), k); this.mat.emissive.set(0xff9ad8).multiplyScalar(k); g.scale.setScalar((this.big ? 1.9 : 1) * (1 - k * 0.9)); g.position.y += dt * 1.2; if (k >= 1) { scene.remove(g); this.dead = true; } return; }
    const toP = tmp.subVectors(P.pos, this.pos); const d = toP.length(); toP.y = 0;
    if (this.state === 'idle' && d < 14 && G.combatOn) this.state = 'chase';
    if (this.state === 'chase') { this.cd -= dt; if (d > 1.4) { toP.normalize(); const sp = this.big ? 1.6 : 2.3; this.vel.x = damp(this.vel.x, toP.x * sp, 3, dt); this.vel.z = damp(this.vel.z, toP.z * sp, 3, dt); } if (d < 2.6 && this.cd <= 0) { this.state = 'windup'; this.st = 0; } }
    if (this.state === 'windup') { this.st += dt; this.vel.multiplyScalar(0.85); this.heartMat.emissiveIntensity = 0.5 + this.st * 4; if (this.st > 0.55) { this.state = 'lunge'; this.st = 0; toP.normalize(); this.vel.set(toP.x * 7, 0, toP.z * 7); } }
    if (this.state === 'lunge') { this.st += dt; if (d < this.r + 0.45 && P.inv <= 0) { hurtPlayer(1, this.pos); this.vel.multiplyScalar(-0.4); } if (this.st > 0.35) { this.state = 'chase'; this.cd = 1.6 + Math.random(); this.heartMat.emissiveIntensity = 0.5; } }
    this.vel.multiplyScalar(Math.exp(-dt * 2)); this.pos.addScaledVector(this.vel, dt); this.pos.y = height(this.pos.x, this.pos.z);
    const hop = Math.abs(Math.sin(this.t * (this.state === 'chase' ? 7 : 3))) * (this.state === 'windup' ? 0 : 0.18);
    g.position.set(this.pos.x, this.pos.y + hop, this.pos.z); g.rotation.y = Math.atan2(toP.x, toP.z);
    const sq = this.state === 'windup' ? 1 - Math.min(0.25, this.st * 0.5) : 1 + Math.sin(this.t * 7) * 0.04; this.body.scale.set(1 / Math.sqrt(sq), sq, 1 / Math.sqrt(sq));
    if (this.flash > 0) { this.flash -= dt; this.mat.emissive.set(0xff9ad8); } else this.mat.emissive.set(0x1a0830);
    if (this.bar.material.opacity > 0) this.bar.material.opacity = Math.max(0, this.bar.material.opacity - dt * 0.4);
  }
}
let _hg = null; function heartGeo(s = 1) { const sh = new THREE.Shape(); sh.moveTo(0, -0.9); sh.bezierCurveTo(-0.3, -0.55, -1, -0.25, -1, 0.25); sh.bezierCurveTo(-1, 0.75, -0.4, 0.95, 0, 0.5); sh.bezierCurveTo(0.4, 0.95, 1, 0.75, 1, 0.25); sh.bezierCurveTo(1, -0.25, 0.3, -0.55, 0, -0.9); const g = new THREE.ExtrudeGeometry(sh, { depth: 0.3, bevelEnabled: true, bevelThickness: 0.15, bevelSize: 0.12, bevelSegments: 3, curveSegments: 12 }); g.center(); g.scale(s, s, s); return g; }
const pickHeartMat = new THREE.MeshPhysicalMaterial({ color: 0xff6fc4, emissive: 0xff2f9e, emissiveIntensity: 1.3, roughness: 0.2, clearcoat: 1 });
function spawnHeart(pos, vel) { const m = new THREE.Mesh(heartGeo(0.16), pickHeartMat); m.position.copy(pos); m.castShadow = true; scene.add(m); pickups.push({ kind: 'heart', m, vel: vel || new V3(), t: 0 }); }
function spawnPack(pos) { const g = new THREE.Group(); const glass = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.18, 0.36, 20), new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 0.6, roughness: 0.05, thickness: 0.2, transparent: true, opacity: 0.6 })); glass.position.y = 0.22; g.add(glass); const liq = new THREE.Mesh(heartGeo(0.1), new THREE.MeshStandardMaterial({ color: 0x9aff9a, emissive: 0x4aff7a, emissiveIntensity: 1.1 })); liq.position.y = 0.22; g.add(liq); const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 0.08, 16), new THREE.MeshStandardMaterial({ color: 0xf6c445, metalness: 1, roughness: 0.3 })); cap.position.y = 0.44; g.add(cap); g.position.copy(pos); scene.add(g); pickups.push({ kind: 'pack', m: g, vel: new V3(), t: 0, rest: true }); return g; }
function updatePickups(dt) {
  for (let i = pickups.length - 1; i >= 0; i--) { const p = pickups[i]; p.t += dt; const m = p.m;
    if (!p.rest) { p.vel.y -= 14 * dt; m.position.addScaledVector(p.vel, dt); const gy = height(m.position.x, m.position.z) + 0.35; if (m.position.y < gy) { m.position.y = gy; p.vel.set(0, 0, 0); p.rest = true; p.baseY = gy; } }
    else { m.position.y = (p.baseY ?? m.position.y) + Math.sin(p.t * 3) * 0.08; p.baseY = p.baseY ?? m.position.y; }
    m.rotation.y += dt * 2;
    const d = m.position.distanceTo(tmp.copy(P.pos).add(new V3(0, 0.8, 0)));
    if (p.kind === 'heart' && d < 3.2 && p.t > 0.4) { m.position.lerp(tmp, 1 - Math.exp(-dt * 7)); }
    if (d < 0.9 && p.t > 0.3) {
      if (p.kind === 'heart') { P.pouch++; sfx('heart'); burst(m.position.clone(), 0xff8ad6, 10, 2, 0.4); const el = $('pouch'); el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump'); }
      if (p.kind === 'pack') { if (P.packs >= 3) continue; P.packs++; sfx('pack'); toast(P.hp < P.maxHp ? `Health pack! Press ${isTouch ? '✚' : 'H'} to use it` : 'Health pack stored for later', 2.2); G.fs.packGot = true; }
      drawPouch(); scene.remove(m); pickups.splice(i, 1);
    }
  }
}
function useHealthPack() { if (!inGame()) return; if (P.packs <= 0) { toast('No health packs', 1); return; } if (P.hp >= P.maxHp) { toast('Your hearts are already full', 1.2); return; } P.packs--; P.hp = Math.min(P.maxHp, P.hp + 4); sfx('heal'); burst(P.pos.clone().add(new V3(0, 1, 0)), 0xb0ffb0, 24, 3, 0.8); drawHealth(); drawPouch(); G.fs.packUsed = true; }
function hurtPlayer(d, from) {
  if (P.roll > 0 && G.state === 'play') { G.fs.dodged = (G.fs.dodged || 0) + 1; return; } // rolling = untouchable
  if (P.inv > 0 || flags().godMode || flags().infiniteHearts || G.state !== 'play') { if (flags().godMode || flags().infiniteHearts) { P.inv = 0.6; sfx('bump'); } return; }
  P.hp = Math.max(0, P.hp - d); P.inv = 1.0; P.hurtT = 0.35; cam.shake = 0.25; sfx('hurt'); sfx('crack');
  const k = tmp.subVectors(P.pos, from).setY(0).normalize().multiplyScalar(6); P.vel.x += k.x; P.vel.z += k.z; P.vel.y = 3.5; P.onGround = false; drawHealth();
  if (P.hp <= 0) { G.state = 'dead'; $('dead').classList.add('show'); if (document.pointerLockElement) document.exitPointerLock(); }
}
$('btnRetry').onclick = () => { $('dead').classList.remove('show'); P.hp = P.maxHp; P.swim = false; P.climb = null; P.breath = 100; P.roll = 0; drawHealth(true); const sp = stepSpot(); P.pos.copy(sp); P.vel.set(0, 0, 0); G.state = 'play'; P.inv = 2; };
const flowersBloomed = [];
function bloomFlower(pos) { const g = new THREE.Group(); const m = new THREE.MeshStandardMaterial({ color: 0xffb0e0, emissive: 0xff6fc8, emissiveIntensity: 0.6 }); for (let i = 0; i < 6; i++) { const pt = new THREE.Mesh(new THREE.SphereGeometry(0.08, 10, 8), m); pt.scale.set(1, 0.3, 0.55); pt.position.set(Math.cos(i) * 0.08, 0.32, Math.sin(i) * 0.08); pt.rotation.y = -i; g.add(pt); } const st = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.016, 0.32, 5), new THREE.MeshStandardMaterial({ color: 0x4a9a40 })); st.position.y = 0.16; g.add(st); g.position.set(pos.x, height(pos.x, pos.z), pos.z); g.scale.setScalar(0.01); scene.add(g); flowersBloomed.push({ g, t: 0 }); }

// ---------------- melee (mic swing) + dodge roll ----------------
function melee() {
  if (!inGame() || P.meleeCd > 0 || P.absorb || P.climb || P.swim || P.roll > 0) return;
  P.meleeCd = 0.42; P.upper = 'melee'; P.upperT = 0; P.upperDur = 0.38; sfx('swing');
  const targets = [...enemies.filter(e => e.alive), ...TR.drums.filter(d => !d.done)];
  let best = null, bd = 3; for (const t of targets) { const c = t.center(); const d = Math.hypot(c.x - P.pos.x, c.z - P.pos.z); if (d < bd) { bd = d; best = t; } }
  if (best) { const c = best.center(); P.face = Math.atan2(c.x - P.pos.x, c.z - P.pos.z); }
  const fwd = new V3(Math.sin(P.face), 0, Math.cos(P.face)); let n = 0;
  for (const t of targets) { const c = t.center(); tmp2.set(c.x - P.pos.x, 0, c.z - P.pos.z); const d = tmp2.length(); if (d < 2.2 + (t.r || 0.5) * 0.6 && (d < 0.7 || tmp2.normalize().dot(fwd) > 0.2)) { t.hit(1.5, P.pos, 'melee'); n++; ring(c.clone(), 0xffd36b, 1.4, 0.3); burst(c.clone(), 0xffe08a, 14, 3.5, 0.4); } }
  burst(P.pos.clone().addScaledVector(fwd, 1.0).add(new V3(0, 1.1, 0)), 0xff9ad8, 8, 2.5, 0.3); if (n) { sfx('impact'); cam.shake = 0.08; }
  G.fs.melee = (G.fs.melee || 0) + 1;
}
function roll() {
  if (!inGame() || P.rollCd > 0 || !P.onGround || P.climb || P.swim || P.absorb) return;
  const { f, r } = camBasis(); const d = new V3(); if (keys.has('KeyW') || keys.has('ArrowUp')) d.add(f); if (keys.has('KeyS') || keys.has('ArrowDown')) d.sub(f); if (keys.has('KeyD') || keys.has('ArrowRight')) d.add(r); if (keys.has('KeyA') || keys.has('ArrowLeft')) d.sub(r);
  if (inp.stick.lengthSq() > 0.04) d.copy(f).multiplyScalar(inp.stick.y).addScaledVector(r, inp.stick.x);
  if (d.lengthSq() < 0.01) d.set(Math.sin(P.face), 0, Math.cos(P.face)); d.normalize();
  P.roll = 0.5; P.rollCd = 0.75; P.rollDir.copy(d); P.face = Math.atan2(d.x, d.z); sfx('roll'); burst(P.pos.clone().add(new V3(0, 0.2, 0)), 0xe8dcc8, 10, 2, 0.4);
  G.fs.rolls = (G.fs.rolls || 0) + 1;
}

// ---------------- training props: Shadow Man's lesson stations ----------------
const TR = { drums: [], pearl: null, rock: null, cliff: null, markers: [] };
function block(cx, cz, w, d, hgt, col) {
  const cs = [[-1, -1], [1, -1], [-1, 1], [1, 1], [0, 0]].map(([a, b]) => height(cx + a * w / 2, cz + b * d / 2)); const top = cs[4] + hgt, base = Math.min(...cs) - 0.6;
  const g = new THREE.BoxGeometry(w, top - base, d, 5, 6, 5); const pa = g.attributes.position; const hh = (top - base) / 2;
  for (let i = 0; i < pa.count; i++) { const y = pa.getY(i); if (y < hh - 0.01) { const k = 0.07 * Math.sin(i * 12.9898) ; pa.setX(i, pa.getX(i) * (1 + k)); pa.setZ(i, pa.getZ(i) * (1 + 0.06 * Math.cos(i * 7.233))); } }
  g.computeVertexNormals();
  const m = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ color: col, roughness: 0.93, flatShading: true })); m.position.set(cx, (top + base) / 2, cz); m.castShadow = true; m.receiveShadow = true; scene.add(m);
  const moss = new THREE.Mesh(new THREE.BoxGeometry(w * 1.04, 0.14, d * 1.04), new THREE.MeshStandardMaterial({ color: 0x5f9a45, roughness: 1 })); moss.position.set(cx, top - 0.05, cz); moss.receiveShadow = true; scene.add(moss);
  const b = { minX: cx - w / 2, maxX: cx + w / 2, minZ: cz - d / 2, maxZ: cz + d / 2, top, m }; W.boxes.push(b); return b;
}
function goalMarker(pos) { const m = new THREE.Mesh(new THREE.TorusGeometry(0.45, 0.06, 10, 36), new THREE.MeshStandardMaterial({ color: 0xffd36b, emissive: 0xffb02a, emissiveIntensity: 2 })); m.position.copy(pos).add(new V3(0, 1.1, 0)); scene.add(m); TR.markers.push(m); return m; }
function buildTraining() {
  const L = W.spots.ledge, C = W.spots.cliff;
  TR.rock = block(L.x, L.z, 2.6, 2.6, 2.6, 0x9a8fa8); TR.rock.marker = goalMarker(new V3(L.x, TR.rock.top, L.z));
  TR.cliff = block(C.x, C.z, 3, 4.4, 4.6, 0x8d8497); TR.cliff.marker = goalMarker(new V3(C.x + 0.3, TR.cliff.top, C.z));
  // vines on the cliff face that looks at the path (minX side)
  const cb = TR.cliff, vm = new THREE.MeshStandardMaterial({ color: 0x3f7a35, roughness: 0.9 }), lm = new THREE.MeshStandardMaterial({ color: 0x6fbf4a, roughness: 0.8, side: THREE.DoubleSide });
  const leaves = new THREE.InstancedMesh(new THREE.PlaneGeometry(0.26, 0.16), lm, 220); let li = 0; const o = new THREE.Object3D(); const gy = height(cb.minX, C.z);
  for (let k = 0; k < 7; k++) { const z = cb.minZ + 0.35 + k * (cb.maxZ - cb.minZ - 0.7) / 6; const len = cb.top - gy + 0.1; const st = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.045, len, 6), vm); st.position.set(cb.minX - 0.06, gy + len / 2, z); st.rotation.x = Math.sin(k) * 0.05; scene.add(st);
    for (let j = 0; j < 30 && li < 220; j++, li++) { o.position.set(cb.minX - 0.1, gy + 0.2 + j * len / 30, z + Math.sin(j * 1.7 + k) * 0.18); o.rotation.set(Math.sin(j) * 0.6, Math.PI / 2 + Math.cos(j * 2.1) * 0.5, Math.sin(j * 3.3) * 0.8); o.updateMatrix(); leaves.setMatrixAt(li, o.matrix); } }
  leaves.castShadow = true; scene.add(leaves);
  for (let k = 0; k < 9; k++) { const f = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 6), new THREE.MeshStandardMaterial({ color: 0xff8ad6, emissive: 0xff4fb8, emissiveIntensity: 0.8 })); f.position.set(cb.minX - 0.14, gy + 0.6 + (k * 0.47) % (cb.top - gy - 0.4), cb.minZ + 0.4 + (k * 1.37) % (cb.maxZ - cb.minZ - 0.8)); scene.add(f); }
  // moon pearl at the bottom of the deep pool (dive lesson)
  const bed = height(POND.x, POND.z); const pearl = new THREE.Mesh(new THREE.SphereGeometry(0.22, 24, 16), new THREE.MeshPhysicalMaterial({ color: 0xfff4fb, emissive: 0xff8ad6, emissiveIntensity: 1.6, roughness: 0.1, clearcoat: 1, iridescence: 1 }));
  pearl.position.set(POND.x, bed + 0.4, POND.z); scene.add(pearl); TR.pearl = { m: pearl, taken: false, base: bed + 0.4 };
  const shell = new THREE.Mesh(new THREE.SphereGeometry(0.4, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshStandardMaterial({ color: 0xffc0dc, roughness: 0.5, side: THREE.DoubleSide })); shell.scale.y = 0.35; shell.position.set(POND.x, bed + 0.05, POND.z); scene.add(shell);
  // practice drums (melee lesson)
  const D = W.spots.drums; [[-2.6, -1.2], [0, -2.6], [2.6, -1.2]].forEach(([dx, dz]) => { const x = D.x + dx, z = D.z + dz, y = height(x, z); const g = new THREE.Group(); const stump = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.38, 0.5, 14), new THREE.MeshStandardMaterial({ color: 0x7a5236, roughness: 0.9 })); stump.position.y = 0.25; g.add(stump);
    const dm = new THREE.MeshStandardMaterial({ color: 0xff6fc4, emissive: 0x6a0a40, emissiveIntensity: 0.3, roughness: 0.5 }); const drum = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.55, 22), dm); drum.position.y = 0.78; drum.castShadow = true; g.add(drum);
    const gold = new THREE.MeshStandardMaterial({ color: 0xf6c445, metalness: 1, roughness: 0.3 }); for (const yy of [0.52, 1.05]) { const rim = new THREE.Mesh(new THREE.TorusGeometry(0.43, 0.035, 8, 28), gold); rim.rotation.x = Math.PI / 2; rim.position.y = yy; g.add(rim); }
    g.position.set(x, y, z); scene.add(g); W.colliders.push({ x, z, r: 0.45 });
    const dr = { g, drum, dm, done: false, r: 0.5, sq: 0, center: () => g.position.clone().add(new V3(0, 0.8, 0)), hit: (dmg, from, kind) => { if (dr.done) return; if (kind !== 'melee') { toast('Too far! Get close and swing: ' + (isTouch ? 'HIT' : 'V'), 1.4); return; } dr.done = true; dr.sq = 1; sfx('drum'); dm.emissive.set(0xffc860); dm.emissiveIntensity = 1.2; miniNotes(dr.center(), 4); } };
    TR.drums.push(dr); });
}
function resetTraining(i) {
  TR.drums.forEach(d => { d.done = i > stepIdx('melee'); d.dm.emissive.set(d.done ? 0xffc860 : 0x6a0a40); d.dm.emissiveIntensity = d.done ? 1.2 : 0.3; });
  TR.pearl.taken = i > stepIdx('swim'); TR.pearl.m.visible = !TR.pearl.taken;
  TR.rock.marker.visible = i <= stepIdx('ledge'); TR.cliff.marker.visible = i <= stepIdx('climb');
}
function updateTraining(dt, t) {
  for (const d of TR.drums) { if (d.sq > 0) { d.sq = Math.max(0, d.sq - dt * 3); const k = 1 - Math.sin(d.sq * Math.PI) * 0.25; d.drum.scale.set(1 / Math.sqrt(k), k, 1 / Math.sqrt(k)); } }
  if (TR.pearl && !TR.pearl.taken) { TR.pearl.m.position.y = TR.pearl.base + Math.sin(t * 2) * 0.06; TR.pearl.m.rotation.y += dt; }
  TR.markers.forEach((m, i) => { m.rotation.y += dt * 1.5; m.position.y += Math.sin(t * 2 + i) * 0.002; });
}

// ---------------- microphone absorption: hearts -> pink mana ----------------
function startAbsorb() {
  if (!inGame() || P.absorb) return; if (P.pouch <= 0) { toast('No hearts to absorb yet', 1.2); return; }
  if (P.weapon !== 'sonic') { lil.hold(W8.sonic); }
  const n = P.pouch; P.pouch = 0; drawPouch(); P.absorb = { t: 0, n, done: 0, dur: 0.7 + n * 0.28 }; P.upper = 'absorb'; P.upperT = 0; P.upperDur = P.absorb.dur + 0.3;
  const mic = W8.sonic.userData; mic.ring.material.color.set(0xffffff);
  for (let i = 0; i < n; i++) {
    const m = new THREE.Mesh(heartGeo(0.12), pickHeartMat); const a = i / n * Math.PI * 2; const start = P.pos.clone().add(new V3(Math.cos(a) * 1.4, 1.2 + Math.sin(i) * 0.3, Math.sin(a) * 1.4)); m.position.copy(start); scene.add(m);
    const delay = 0.3 + i * 0.28, tr = sprites(10, trailTex, 0xff6ad5, 0.22, 0.8); scene.add(tr); const hist = [];
    fx.push({ m, t: 0, dur: delay + 0.55, kind: 'orb', update: (dt, k) => { const tt = fx.find(f => f.m === m)?.t || 0; const u = clamp((tt - delay) / 0.55, 0, 1); const tgt = handWorld(new V3()); const spin = tt * 4 + a; const r = 1.4 * (1 - u); m.position.set(lerp(start.x, tgt.x, u) + Math.cos(spin) * r * 0.5, lerp(start.y, tgt.y, u * u) + Math.sin(tt * 6) * 0.1 * (1 - u), lerp(start.z, tgt.z, u) + Math.sin(spin) * r * 0.5); m.scale.setScalar(1 - u * 0.7); m.rotation.y += dt * 6; hist.unshift(m.position.clone()); if (hist.length > 10) hist.pop(); const p = tr.geometry.attributes.position; hist.forEach((h, j) => p.setXYZ(j, h.x, h.y, h.z)); for (let j = hist.length; j < 10; j++) p.setXYZ(j, m.position.x, m.position.y, m.position.z); p.needsUpdate = true; },
      done: () => { scene.remove(tr); P.mana = Math.min(P.maxMana, P.mana + 20); drawMana(); const w = $('manaWrap'); w.classList.remove('pulse'); void w.offsetWidth; w.classList.add('pulse'); sfx('absorb', { i }); const hp = handWorld(new V3()); burst(hp, 0xff9ad8, 14, 2.5, 0.5); miniNotes(hp, 2); } });
  }
  sfx('whoosh');
}
function updateAbsorb(dt) {
  const A = P.absorb; const mic = W8.sonic.userData;
  if (!A) { mic.head.material.emissiveIntensity = damp(mic.head.material.emissiveIntensity, 0.25, 4, dt); return; }
  A.t += dt; mic.head.material.emissiveIntensity = 1.5 + Math.sin(A.t * 20) * 0.6; mic.ring.scale.setScalar(1 + Math.sin(A.t * 10) * 0.3);
  if (A.t > A.dur + 0.25) { P.absorb = null; sfx('absorbDone'); ring(handWorld(new V3()), 0xff9ad8, 2.5, 0.6); mic.ring.scale.setScalar(1); mic.ring.material.color.set(0xff6ad5); if (P.weapon !== 'sonic') lil.hold(W8[P.weapon]); G.fs.absorbed = true; toast('+' + A.n * 20 + ' MANA', 1.4); }
}

// ---------------- bells (aim practice), chest, interaction ----------------
function makeBell(pos) {
  const g = new THREE.Group(); const post = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 2.2, 10), new THREE.MeshStandardMaterial({ color: 0x8a6040, roughness: 0.8 })); post.position.y = 1.1; post.castShadow = true; g.add(post);
  const arm = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.06, 0.06), post.material); arm.position.set(0.25, 2.15, 0); g.add(arm);
  const pivot = new THREE.Group(); pivot.position.set(0.5, 2.1, 0); g.add(pivot);
  const pts = []; for (let i = 0; i <= 12; i++) { const u = i / 12; pts.push(new THREE.Vector2(0.06 + 0.22 * Math.pow(u, 1.6) + (u > 0.9 ? 0.03 : 0), -u * 0.42)); }
  const bm = new THREE.MeshPhysicalMaterial({ color: 0xf6c445, metalness: 1, roughness: 0.22, emissive: 0x3a2400, emissiveIntensity: 0.3 });
  const bell = new THREE.Mesh(new THREE.LatheGeometry(pts, 28), bm); bell.castShadow = true; pivot.add(bell);
  g.position.copy(pos); scene.add(g);
  const b = { g, pivot, bm, rung: false, r: 0.42, swing: 0, center: () => pivot.getWorldPosition(new V3()).add(new V3(0, -0.22, 0)), hit: (d, from, kind) => { if (b.rung) return; b.rung = true; b.swing = 1; sfx('bell'); bm.emissive.set(0xffc860); bm.emissiveIntensity = 1.4; burst(b.center(), 0xffe08a, 24, 3, 0.7); miniNotes(b.center(), 4); G.fs.bellKind = kind; G.fs.bellsRung = (G.fs.bellsRung || 0) + 1; } };
  bells.push(b); return b;
}
function updateBells(dt, t) { for (const b of bells) { if (b.swing > 0) { b.swing = Math.max(0, b.swing - dt * 0.35); b.pivot.rotation.z = Math.sin(t * 9) * 0.6 * b.swing; } } }
let chest = null;
function makeChest(pos) {
  const g = new THREE.Group(); const wood = new THREE.MeshStandardMaterial({ color: 0x9a5a3a, roughness: 0.7 }), gold = new THREE.MeshPhysicalMaterial({ color: 0xf6c445, metalness: 1, roughness: 0.25 });
  const box = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.5, 0.6), wood); box.position.y = 0.25; box.castShadow = true; g.add(box);
  const lidP = new THREE.Group(); lidP.position.set(0, 0.5, -0.3); g.add(lidP); const lid = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.9, 20, 1, false, 0, Math.PI), wood); lid.rotation.z = Math.PI / 2; lid.position.z = 0.3; lid.castShadow = true; lidP.add(lid);
  for (const x of [-0.35, 0.35]) { const band = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.52, 0.62), gold); band.position.set(x, 0.25, 0); g.add(band); }
  const lock = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.14, 0.05), gold); lock.position.set(0, 0.45, 0.31); g.add(lock);
  const glow = new THREE.PointLight(0xffc0e8, 0, 4, 2); glow.position.y = 0.8; g.add(glow);
  g.position.copy(pos); g.rotation.y = Math.PI * 0.85; scene.add(g); W.colliders.push({ x: pos.x, z: pos.z, r: 0.55 });
  return { g, lidP, glow, open: false };
}
function nearCat() { return cat.root.position.distanceTo(P.pos) < 2.2; }
function interactTarget() {
  if (chest && !chest.open && chest.g.position.distanceTo(P.pos) < 2.4) return 'chest';
  if (nearCat()) return 'cat';
  if (girl.root.visible && girl.root.position.distanceTo(P.pos) < 2.4) return 'girl';
  if (shadow.root.visible && shadow.root.position.distanceTo(P.pos) < 2.6) return 'shadow';
  return null;
}
function interact() {
  if (!inGame()) return; const t = interactTarget(); if (!t) return; P.upper = 'interact'; P.upperT = 0; P.upperDur = 0.6;
  if (t === 'chest') { chest.open = true; sfx('chest'); chest.glow.intensity = 6; G.game.chestOpened = true; burst(chest.g.position.clone().add(new V3(0, 0.8, 0)), 0xffe08a, 40, 3, 1.1);
    setTimeout(() => { toast('★ STAR WAND FOUND ★', 2.5); say('THE CAT', 'Mrrrp! (The cat looks extremely proud of itself.)'); setWeapon('wand'); }, 600); G.fs.chest = true; }
  if (t === 'cat') openCat();
  if (t === 'girl') { const L = ['(She smiles and hums along with the portal, staying close to the tall shadow.)', 'He says the portal will show us something wonderful today.', '(She waves at your cat. The cat pretends not to notice.)']; say('THE GIRL', L[(G.fs.girlTalk = ((G.fs.girlTalk || 0) + 1)) % L.length]); }
  if (t === 'shadow') { const L = ["Questions? Good. Keep them. They'll be useful later.", "Don't mind me. I'm only the guide… for now.", "The meadow likes you, little star. That's rarer than you'd think.", 'Every lesson here is a note. Learn enough of them and you get a song.']; say('SHADOW MAN', L[(G.fs.smTalk = ((G.fs.smTalk || 0) + 1)) % L.length]); }
}
function openCat() {
  if (document.pointerLockElement) document.exitPointerLock();
  G.state = 'catmenu'; $('catMenu').classList.add('show'); $('catBody').innerHTML = '<p class="story">The fluffy cat blinks slowly at you, tail curling into a question mark.</p>';
  const btns = $('catBtns'); btns.innerHTML = '';
  const add = (label, fn) => { const b = document.createElement('button'); b.textContent = label; b.onclick = fn; btns.appendChild(b); };
  add('PET THE CAT', () => { closeCat(); catDo('purr'); sfx('meow'); say('THE CAT', 'Prrrrrrr… (Maximum purr achieved.)'); burst(cat.root.position.clone().add(new V3(0, 0.8, 0)), 0xff9ad8, 12, 1.5, 0.8); });
  add('PLAY', () => { closeCat(); catDo('play'); sfx('meow'); });
  if (flags().pinkQuest === 'active' || flags().pinkQuest === 'catTalked') add('ASK ABOUT THE LOST MICROPHONE', () => { flags().pinkQuest = 'catTalked'; persist(); $('catBody').innerHTML = '<p class="story">The cat sniffs your hands, then stares hard toward the Whispering Woods, ears forward. It knows something about a lost microphone… and it will lead the way when you get there.</p><p class="small dim">Quest: The Lost Microphone — continues in Level 1.</p>'; });
  add('LOST KITTENS?', () => { $('catBody').innerHTML = '<p class="story">The cat\'s ears droop. It paws at the ground, then looks toward the portal. Something (or someone small) is missing out there.</p><p class="small dim">The Lost Kittens quest begins in Level 1: Whispering Woods.</p>'; });
  add('CLOSE', closeCat);
}
function closeCat() { $('catMenu').classList.remove('show'); if (G.state === 'catmenu') G.state = 'play'; }

// ---------------- cat + girl companions ----------------
const CAT = { state: 'idle', t: 0, act: null, actT: 0, idleT: 0, look: 0 };
function catDo(act, dur = 2.2) { CAT.act = act; CAT.actT = dur; }
function updateCat(dt, t) {
  const c = cat.root; const target = P.pos.clone().add(new V3(Math.sin(P.face + 2.2) * 1.6, 0, Math.cos(P.face + 2.2) * 1.6));
  const d = Math.hypot(target.x - c.position.x, target.z - c.position.z); let sp = 0, st = 'idle';
  const enemyNear = enemies.some(e => e.alive && e.pos.distanceTo(c.position) < 7 && G.combatOn);
  if (CAT.act) { CAT.actT -= dt; st = CAT.act === 'purr' ? 'sit' : CAT.act; if (CAT.actT <= 0) CAT.act = null; }
  else if (G.state === 'cutscene' && G.cine?.catState) { st = G.cine.catState; }
  else if (enemyNear && d < 4) { st = 'hiss'; }
  else if (d > 1.2) { sp = d > 6 ? 6.5 : d > 2.5 ? 4.2 : 1.7; st = sp > 4 ? 'run' : 'walk'; CAT.idleT = 0; const k = Math.min(1, sp * dt / d); c.position.x += (target.x - c.position.x) * k; c.position.z += (target.z - c.position.z) * k; const f = Math.atan2(target.x - c.position.x, target.z - c.position.z); c.rotation.y = rotTo(c.rotation.y, f, 8 * dt); }
  else { CAT.idleT += dt; st = CAT.idleT > 30 ? 'sleep' : CAT.idleT > 12 ? 'groom' : CAT.idleT > 3 ? 'sit' : 'idle'; if (CAT.idleT > 6 && Math.random() < dt * 0.05) catDo('play', 1.8); }
  c.position.y = damp(c.position.y, groundAt(W, c.position.x, c.position.z, c.position.y + 0.2), 14, dt);
  const ws = shadow.root.position; CAT.look = G.fs.catLook > 0 ? clamp(Math.atan2(ws.x - c.position.x, ws.z - c.position.z) - c.rotation.y, -1.2, 1.2) : damp(CAT.look, 0, 2, dt); if (G.fs.catLook > 0) G.fs.catLook -= dt;
  cat.look = CAT.look; cat.update(t, dt, st, sp);
}
const rotTo = (a, b, k) => { let d = ((b - a + Math.PI) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2) - Math.PI; return a + d * Math.min(1, k); };
const GIRL = { goal: null, mode: 'follow' };
// The girl quietly follows Shadow Man around the whole tutorial (a few meters behind him).
function updateGirl(dt, t) {
  if (!girl.root.visible || G.state === 'cutscene') { girl.update(t, dt, { state: G.cine?.girlState || 'idle', speed: 0 }); return; }
  const g = girl.root.position, sp0 = shadow.root.position, sf = shadow.root.rotation.y;
  const goal = shadow.root.visible ? new V3(sp0.x - Math.sin(sf) * 2.8 + Math.cos(sf) * 0.9, 0, sp0.z - Math.cos(sf) * 2.8 - Math.sin(sf) * 0.9) : P.pos.clone().add(new V3(-2, 0, 2));
  const d = Math.hypot(goal.x - g.x, goal.z - g.z); let sp = 0, st = 'idle';
  if (d > 0.9) { sp = d > 7 ? 5 : d > 3 ? 3.4 : 1.6; st = sp > 3 ? 'run' : 'walk'; const k = Math.min(1, sp * dt / d); g.x += (goal.x - g.x) * k; g.z += (goal.z - g.z) * k; girl.root.rotation.y = rotTo(girl.root.rotation.y, Math.atan2(goal.x - g.x, goal.z - g.z), 7 * dt); }
  else { const lookAt = G.combatOn ? P.pos : sp0; girl.root.rotation.y = rotTo(girl.root.rotation.y, Math.atan2(lookAt.x - g.x, lookAt.z - g.z), 3 * dt); if (G.combatOn) st = 'cheer'; }
  g.y = groundAt(W, g.x, g.z, g.y + 1.2); girl.update(t, dt, { state: st, speed: sp });
}
// Shadow Man walks ahead to each lesson station, waits for LIL SYNN, then speaks the hint.
const SHADOW = { goal: null, praise: 0 };
function updateShadowGuide(dt, t) {
  if (!shadow.root.visible || G.state === 'cutscene') return;
  const g = shadow.root.position; const goal = SHADOW.goal || g; const d = Math.hypot(goal.x - g.x, goal.z - g.z);
  const toP = Math.hypot(P.pos.x - g.x, P.pos.z - g.z); const goalToP = Math.hypot(P.pos.x - goal.x, P.pos.z - goal.z);
  const wait = G.state === 'play' && toP > 15 && goalToP > toP; // never leaves the player too far behind
  let sp = 0, st = 'idle';
  if (d > 0.5 && !wait && (G.state === 'play' || G.state === 'menu')) { sp = d > 9 ? 4.6 : 2.4; st = sp > 3 ? 'run' : 'walk'; const k = Math.min(1, sp * dt / d); g.x += (goal.x - g.x) * k; g.z += (goal.z - g.z) * k; shadow.root.rotation.y = rotTo(shadow.root.rotation.y, Math.atan2(goal.x - g.x, goal.z - g.z), 6 * dt); }
  else { shadow.root.rotation.y = rotTo(shadow.root.rotation.y, Math.atan2(P.pos.x - g.x, P.pos.z - g.z), 3 * dt); if (SHADOW.praise > 0) { SHADOW.praise -= dt; st = 'cheer'; } }
  g.y = damp(g.y, groundAt(W, g.x, g.z, g.y + 1.2), 12, dt); shadow.update(t, dt, { state: st, speed: sp });
  if (shadow.proc?.feather) shadow.proc.feather.rotation.z = Math.sin(t * 2.2) * 0.25;
  if (W.wilt && W.wilt.group.position.distanceTo(g) < 3.2) G.fs.wiltK = Math.min(1, (G.fs.wiltK || 0) + dt * 0.5); // flowers wilt near Shadow Man
}
// ---------------- tutorial ----------------
const off = (k, dx = 0, dz = 0) => { const p = W.spots[k]; const x = p.x + dx, z = p.z + dz; return new V3(x, height(x, z), z); };
const SM = (text, dur) => { subQ = subQ.filter(q => q.who !== 'SHADOW MAN'); say('SHADOW MAN', text, dur); }; // newest lesson line wins
const spk = (h) => `<span class="spk">SHADOW MAN</span>${h}`; // the hint box is Shadow Man's dialog box
const onRock = (b) => b && P.onGround && P.pos.y > b.top - 0.12 && P.pos.x > b.minX - 0.05 && P.pos.x < b.maxX + 0.05 && P.pos.z > b.minZ - 0.05 && P.pos.z < b.maxZ + 0.05;
const STEPS = [
  { id: 'move', spot: 'start', guide: () => off('start', -1.6, -9), p: () => spk(`Walk with ${K('move')}. Follow me.`), enter: () => SM('Well, well… the little star is awake. Walk with me. The portal is in a singing mood today.'), check: () => P.pos.distanceTo(W.spots.start) > 5 },
  { id: 'look', spot: 'start', guide: () => off('ringMove', -1.8, 0), p: () => spk(`Look around with ${K('look')}.`), enter: () => { G.fs.whale = 0.0001; SM('Look around. A good adventurer notices everything… even the things that notice back.'); }, check: () => G.yawAcc > 2.2 || G.stepT > 25 },
  { id: 'run', spot: 'ringMove', guide: () => off('ringRun', -2.4, -3), p: () => spk(`Keep up! Run: ${K('run')}. Keep going to sprint.`), enter: () => SM('Keep up! The meadow rewards the quick.'), check: () => G.ranT > 1.2 && P.pos.z < W.spots.ringRun.z + 2 },
  { id: 'jump', spot: 'ringRun', guide: () => off('afterLog', -2, 1), p: () => spk(`A fallen log. Over you go: ${K('jump')}.`), enter: () => say('THE CAT', 'Mrrp? (The cat clears the log in one elegant leap and waits for you.)'), check: () => P.pos.z < W.hedgeZ - 1.5 },
  { id: 'ledge', spot: 'afterLog', guide: () => off('ledge', 2.6, 1.5), p: () => spk(`That rock is taller than one jump. ${K('jump')}, then ${K('jump')} again in midair. Come up short? You'll grab the edge.`), enter: () => SM('Higher than it looks, isn\'t it? Jump twice. Reach for the edge.'), check: () => onRock(TR.rock) },
  { id: 'climb', spot: 'afterLog', guide: () => off('cliff', -3.4, 3), p: () => spk(`Walk into the vines to grab them. Climb with ${K('climb')}. ${K('jump')} leaps off, ${K('drop')} lets go.`), enter: () => SM('Vines are friendlier than they look. Up you go, all the way to the top.'), check: () => G.fs.climbed },
  { id: 'swim', spot: 'pondBank', guide: () => off('pondBank', 2.2, 0.5), p: () => spk(`Hop into the deep pool and swim with ${K('move')}. Hold ${K('dive')} to dive and grab the glowing pearl. Watch your AIR bar!`), enter: () => SM('Water next. Something glows at the bottom of that pool. Mind your breath, little star.'), check: () => G.fs.pearl && !P.swim },
  { id: 'melee', spot: 'drums', guide: () => off('drums', -3.6, 2.5), p: () => spk(`Up close, swing your mic: ${K('melee')}. Thump all three drums.`), enter: () => SM('Sometimes music needs a little push. Get close and give those drums a thump.'), check: () => TR.drums.every(d => d.done) },
  { id: 'blast', spot: 'camera', guide: () => off('targets', -4.5, 6), p: () => spk(isTouch ? `Now sing! Tap ${K('fire')} to fire Sonic Blast (it aims for you). Ring the three golden bells.` : `Now sing! Aim with the mouse (a small crosshair appears when it moves) and fire Sonic Blast with ${K('fire')}. Ring the three bells.`), enter: () => SM('Now sing. Bells always answer back.'), check: () => bells.slice(0, 3).every(b => b.rung) },
  { id: 'interact', spot: 'targets', guide: () => off('chest', -5, 3), p: () => spk(`Your cat found something. Walk to the chest and press ${K('use')}.`), enter: () => SM('Your cat found something. Cats always do.'), check: () => G.fs.chest },
  { id: 'switch', spot: 'targets', guide: () => off('chest', -5, 3), p: () => spk(`Switch weapons with ${K('swap')} (or <kbd>1</kbd> <kbd>2</kbd>). Ring the last bell with the Star Wand.`), enter: () => { bells[3] && (bells[3].g.visible = true); }, check: () => bells[3] && bells[3].rung && G.fs.bellKind === 'wand' || (bells[3]?.rung && G.fs.switched) },
  { id: 'combat', spot: 'arena', guide: () => off('arena', -7, 9), p: () => spk(`Gloomlings! Not wicked, only lost. Free them with music: ${K('fire')} from afar, ${K('melee')} up close.`), enter: () => { spawnWave(1); SM("Gloomlings. Not wicked, only lost. Play them free. I'll keep her safe back here."); }, check: () => waveClear() },
  { id: 'hearts', spot: 'arena', guide: () => off('arena', -7, 9), p: () => spk('They left their hearts behind. Collect them!'), check: () => P.pouch >= 2 && !pickups.some(p => p.kind === 'heart') || (P.pouch >= 4) },
  { id: 'mic', spot: 'arena', guide: () => off('arena', -7, 9), p: () => spk(`Your microphone turns hearts into pink mana. Absorb them with ${K('mic')}.`), enter: () => SM('Hold your mic up. Hearts are only music waiting to happen.'), check: () => G.fs.absorbed },
  { id: 'pack', spot: 'arena', guide: () => off('arena', -7, 9), p: () => spk(`Health packs restore hearts. Grab the glowing jar, then use it with ${K('heal')}.`), enter: () => { if (!G.fs.packSpawned) { G.fs.packSpawned = true; spawnPack(W.spots.pack.clone().add(new V3(0, 0.3, 0))); } }, check: () => G.fs.packUsed || (G.fs.packGot && P.hp >= P.maxHp) },
  { id: 'dodge', spot: 'arena', guide: () => off('arena', -4, -5), p: () => spk(`Footwork! Dodge roll with ${K('roll')}: while you roll, nothing can touch you. Roll twice.`), enter: () => { G.fs.rollBase = G.fs.rolls || 0; SM("Let's see your footwork. A roll at the right moment beats any shield."); }, check: () => (G.fs.rolls || 0) - (G.fs.rollBase || 0) >= 2 },
  { id: 'ability', spot: 'arena', guide: () => off('wave2', -7, 10), p: () => spk(`More gloom drifts in! Mana powers your magic: the Star Wand costs more but hits harder${flags().cello ? '. Try the Pink Cello on the crowd!' : '.'} Roll away from lunges.`), enter: () => spawnWave(2), check: () => waveClear() },
  { id: 'pause', spot: 'wave2', guide: () => off('wave2', -2, -6), p: () => spk(`Even heroes take a breath. Pause with ${K('pause')}, peek at Settings and the music player, then resume.`), enter: () => { G.fs.pausedOnce = false; SM('Even heroes take a breath. The music is yours to change, you know.'); }, check: () => G.fs.pausedOnce && G.state === 'play' },
  { id: 'portal', spot: 'wave2', guide: () => W.portal.group.position.clone().add(new V3(0.9, 0, 4.4)), p: () => spk('Follow me to the portal.'), enter: () => SM("Come. The portal is waiting… and so is your next lesson."), check: () => P.pos.distanceTo(W.portal.center) < 10.5 },
];
const stepIdx = (id) => STEPS.findIndex(s => s.id === id);
// Saves from stage 1 stored a 13-step index; map them onto the new lessons by id.
const OLD_IDS = ['move', 'run', 'jump', 'camera', 'aim', 'interact', 'switch', 'combat', 'hearts', 'mic', 'pack', 'ability', 'portal'];
function stepIndexOf(g) { if (!g) return 0; if (g.tutorialDone) return STEPS.length; if (g.stepV === 2) return clamp(g.step | 0, 0, STEPS.length); const id = { camera: 'look', aim: 'blast' }[OLD_IDS[g.step]] || OLD_IDS[g.step]; const i = stepIdx(id); return g.step >= OLD_IDS.length ? STEPS.length : Math.max(0, i); }
function stepSpot() { const st = STEPS[Math.min(G.step, STEPS.length - 1)]; return (W.spots[st?.spot] || W.spots.start).clone(); }
function enterStep(i) { G.step = i; G.game.step = i; G.game.stepV = 2; G.stepT = 0; const s = STEPS[i]; if (!s) return; prompt(s.p()); SHADOW.goal = s.guide ? s.guide() : null; s.enter && s.enter(); }
function advanceStep() { promptDone(); SHADOW.praise = 1.2; G.game.step = G.step + 1; G.game.stepV = 2; autosave(); if (G.step + 1 < STEPS.length) enterStep(G.step + 1); }
function updateTutorial(dt) { if (G.step >= STEPS.length || !W) return; G.stepT += dt; const s = STEPS[G.step]; if (s.check()) { if (s.id === 'portal') { startEndingCutscene(); return; } advanceStep(); } }
let waveN = 0; G.combatOn = false;
function spawnWave(n) { waveN = n; G.combatOn = true; const c = n === 1 ? W.spots.arena : W.spots.wave2; const list = n === 1 ? [[-3, -4], [3, -5], [0, -8]] : [[-4, -3], [4, -4], [-2, -7], [3, -8], [0, -6, true]]; list.forEach(([dx, dz, big]) => { const x = c.x + dx, z = c.z + dz; const e = new Gloomling(new V3(x, height(x, z), z), !!big); e.g.scale.multiplyScalar(0.01); e.spawnT = 0; enemies.push(e); burst(new V3(x, height(x, z) + 0.5, z), 0x9a6bff, 20, 2, 0.8); }); sfx('shadow'); AU.setMood('combat'); }
function waveClear() { const a = enemies.filter(e => !e.dead); if (a.length === 0 && waveN) { G.combatOn = false; AU.setMood('explore'); return true; } return false; }

// ---------------- foreshadowing ----------------
function updateForeshadow(dt, t) {
  if (!W) return; const F = G.fs;
  // portal flickers pink now and then
  F.flick = (F.flick ?? 6) - dt; if (F.flick < 0) { F.flick = 8 + Math.random() * 10; F.pinkT = 0.35; } if (F.pinkT > 0) F.pinkT -= dt;
  if (G.state !== 'cutscene') W.portal.U.uPink.value = F.pinkT > 0 ? 1 : damp(W.portal.U.uPink.value, 0, 6, dt);
  // dragon constellation: barely-there shimmer
  W.constellation.starM.opacity = 0.28 + Math.sin(t * 0.7) * 0.12; W.constellation.lineM.opacity = 0.05 + Math.sin(t * 0.7) * 0.03;
  // whale cloud passes overhead once the camera lesson starts
  if (F.whale) { F.whale += dt; W.whale.position.x = -260 + F.whale * 18; W.whale.position.z = lerp(-60, -90, Math.min(1, F.whale / 30)); if (W.whale.position.x > 300) F.whale = 0; }
  // the distant shadow between trees + cat looks + a flower wilts + a strange melody
  if (!F.melody && P.pos.z < -52) { F.melody = true; F.catLook = 3.5; sfx('melody'); } // a strange melody; the cat stares at Shadow Man
  if (F.wiltK) { const k = F.wiltK; W.wilt.head.rotation.z = k * 1.4; W.wilt.head.position.y = 0.6 - k * 0.15; W.wilt.mat.color.lerpColors(new THREE.Color(0xff7ad0), new THREE.Color(0x6a5a6a), k); W.wilt.mat.emissiveIntensity = 0.6 * (1 - k); }
}

// ---------------- player update ----------------
function camBasis() { const f = new V3(-Math.sin(cam.yaw), 0, -Math.cos(cam.yaw)); const r = new V3(-f.z, 0, f.x); return { f, r }; }
function updatePlayer(dt) {
  const { f, r } = camBasis(); const mv = new V3(); let mag = 0;
  if (keys.has('KeyW') || keys.has('ArrowUp')) mv.add(f); if (keys.has('KeyS') || keys.has('ArrowDown')) mv.sub(f); if (keys.has('KeyD') || keys.has('ArrowRight')) mv.add(r); if (keys.has('KeyA') || keys.has('ArrowLeft')) mv.sub(r);
  if (mv.lengthSq() > 0) { mv.normalize(); mag = 1; }
  if (inp.stick.lengthSq() > 0.01) { mv.copy(f).multiplyScalar(inp.stick.y).addScaledVector(r, inp.stick.x); mag = Math.min(1, inp.stick.length()); mv.normalize(); }
  const mvDir = mv.clone();
  const runKey = keys.has('ShiftLeft') || keys.has('ShiftRight') || (isTouch && mag > 0.75);
  let st = null;
  // ---- climbing (vine wall) ----
  if (P.climb) {
    const c = TR.cliff; const up = ((keys.has('KeyW') || keys.has('ArrowUp')) ? 1 : 0) - ((keys.has('KeyS') || keys.has('ArrowDown')) ? 1 : 0) + (Math.abs(inp.stick.y) > 0.3 ? Math.sign(inp.stick.y) : 0);
    const side = ((keys.has('KeyD') || keys.has('ArrowRight')) ? 1 : 0) - ((keys.has('KeyA') || keys.has('ArrowLeft')) ? 1 : 0) + (Math.abs(inp.stick.x) > 0.3 ? Math.sign(inp.stick.x) : 0);
    const u = clamp(up, -1, 1), sd = clamp(side, -1, 1);
    P.pos.y += u * 2.3 * dt; P.pos.z = clamp(P.pos.z + sd * 1.6 * dt, c.minZ + 0.25, c.maxZ - 0.25); P.pos.x = c.minX - 0.38; P.vel.set(0, 0, 0); P.face = Math.PI / 2; P.onGround = false;
    P.climb.acc = (P.climb.acc || 0) + Math.abs(u) * dt; if (P.climb.acc > 0.45) { P.climb.acc = 0; sfx('grab'); }
    const gy = height(P.pos.x, P.pos.z);
    if (P.pos.y >= c.top - 1.0 && u > 0) { P.pos.set(c.minX + 0.75, c.top, P.pos.z); P.climb = null; P.onGround = true; P.landT = 0.15; sfx('grab'); G.fs.climbed = true; burst(P.pos.clone().add(new V3(0, 0.2, 0)), 0x9adf7a, 12, 2, 0.5); }
    else if (P.pos.y <= gy && u < 0) { P.pos.y = gy; P.climb = null; P.onGround = true; }
    else if (inp.jump > 0) { inp.jump = 0; P.climb = null; P.vel.set(-4.5, 6.5, 0); P.face = -Math.PI / 2; sfx('jump'); }
    st = 'climb'; P.climbSpeed = Math.abs(u) + Math.abs(sd);
  }
  // ---- swimming (deep pool): surface swim, dive, breath ----
  const bed = height(P.pos.x, P.pos.z), SURF = WATER_Y - 1.3, deep = bed < WATER_Y - 1.25;
  if (!P.climb && !P.swim && deep && P.pos.y < WATER_Y - 0.45) { P.swim = true; P.vel.y = Math.max(P.vel.y, -2); sfx('splash'); burst(new V3(P.pos.x, WATER_Y + 0.1, P.pos.z), 0xd8f6ff, 26, 3.5, 0.7); ring(new V3(P.pos.x, WATER_Y + 0.02, P.pos.z), 0xe8fbff, 3, 0.8, true); G.fs.swam = true; }
  if (P.swim && !P.climb) {
    const sp = (runKey ? 4.2 : 3.0) * (mag || 0); const want = mvDir.clone().multiplyScalar(sp);
    P.vel.x = damp(P.vel.x, want.x, 3, dt); P.vel.z = damp(P.vel.z, want.z, 3, dt);
    if (mag > 0) P.face = rotTo(P.face, Math.atan2(want.x, want.z), 6 * dt);
    const dive = (keys.has('KeyC') || inp.act) && P.breath > 0;
    if (dive) P.vel.y = damp(P.vel.y, -2.4, 4, dt); else P.vel.y = damp(P.vel.y, P.pos.y < SURF - 0.05 ? (inp.jump > 0 ? 4.5 : 2.6) : 0, 4, dt);
    const nx = P.pos.x + P.vel.x * dt, nz = P.pos.z + P.vel.z * dt; const nb = height(nx, nz);
    P.pos.x = clamp(nx, pathX(nz) - 42, pathX(nz) + 42); P.pos.z = nz; P.pos.y = clamp(P.pos.y + P.vel.y * dt, nb + 0.15, SURF);
    const atSurf = P.pos.y >= SURF - 0.12;
    if (inp.jump > 0 && atSurf) { P.swim = false; P.vel.y = 7.6; P.onGround = false; inp.jump = 0; sfx('splash'); burst(new V3(P.pos.x, WATER_Y + 0.1, P.pos.z), 0xd8f6ff, 16, 3, 0.5); }
    else if (nb > WATER_Y - 1.15) { P.swim = false; } // reached the shallows: walk out
    if (inp.jump > 0) inp.jump -= dt;
    const under = P.pos.y + 1.6 < WATER_Y;
    if (under) { G.fs.diveT = (G.fs.diveT || 0) + dt; if (!flags().unlimitedOxygen) P.breath = Math.max(0, P.breath - 12 * dt); if (Math.random() < dt * 3) sfx('bubble'); }
    if (P.breath <= 0 && under) { P.drownT -= dt; if (P.drownT <= 0) { P.drownT = 1.6; const inv = P.inv; P.inv = 0; hurtPlayer(1, P.pos.clone().add(new V3(0.01, 0, 0))); P.vel.set(0, 2, 0); } }
    if (TR.pearl && !TR.pearl.taken && TR.pearl.m.position.distanceTo(P.pos.clone().add(new V3(0, 0.9, 0))) < 1.45) { TR.pearl.taken = true; TR.pearl.m.visible = false; G.fs.pearl = true; sfx('pearl'); P.mana = Math.min(P.maxMana, P.mana + 25); drawMana(); toast('✦ MOON PEARL ✦ +25 MANA', 2); burst(TR.pearl.m.position.clone(), 0xffe0f4, 30, 3, 0.8); }
    if (mag > 0 && atSurf) { P.stepAcc += dt * 3; if (P.stepAcc > 1.2) { P.stepAcc = 0; burst(new V3(P.pos.x, WATER_Y + 0.05, P.pos.z), 0xe8fbff, 6, 1.5, 0.4); } }
    st = under || dive ? 'dive' : 'swim';
  }
  if (!P.swim) { if (P.breath < 100) { if (P.breath < 30) sfx('gasp'); P.breath = Math.min(100, P.breath + 45 * dt); } P.drownT = 0; } else if (P.pos.y >= SURF - 0.12) P.breath = Math.min(100, P.breath + 45 * dt);
  if (!st) {
  if (mag > 0 && runKey) { P.runT += dt; G.ranT += dt; } else P.runT = 0; P.sprint = P.runT > 1.2;
  let speed = mag === 0 ? 0 : runKey ? (P.sprint ? 7.6 : 5.3) : (isTouch ? 2.4 + mag * 1.2 : 2.5);
  if (P.absorb) speed *= 0.35; if (P.landT > 0) speed *= 0.5;
  const gy0 = height(P.pos.x, P.pos.z); P.wading = gy0 < WATER_Y - 0.05 && P.pos.y < WATER_Y + 0.2; if (P.wading) speed *= 0.55;
  const want = mv.multiplyScalar(speed); const acc = P.onGround ? 12 : 4;
  if (P.roll > 0) { want.copy(P.rollDir).multiplyScalar(9.5 * (0.5 + P.roll)); P.vel.x = want.x; P.vel.z = want.z; }
  else { P.vel.x = damp(P.vel.x, want.x, acc, dt); P.vel.z = damp(P.vel.z, want.z, acc, dt); }
  if (mag > 0 && P.roll <= 0 && !(P.upper === 'attack' || P.upper === 'wand' || P.upper === 'melee')) P.face = rotTo(P.face, Math.atan2(want.x, want.z), 10 * dt);
  // jump / gravity
  if (P.onGround) { P.coyote = 0.12; P.jumps = 0; } else P.coyote -= dt;
  if (inp.jump > 0) { if (P.coyote > 0 || (P.jumps < 2 && !P.onGround)) { P.vel.y = P.jumps === 0 && P.coyote > 0 ? 8.3 : 7.2; P.jumps = P.coyote > 0 ? 1 : 2; P.coyote = 0; P.onGround = false; inp.jump = 0; P.roll = 0; sfx('jump'); if (P.jumps === 2) { burst(P.pos.clone().add(new V3(0, 0.2, 0)), 0xffd6f0, 14, 2.5, 0.5); G.fs.dbl = true; } } inp.jump -= dt; }
  P.vel.y -= 24 * dt; const fallV = P.vel.y;
  const next = P.pos.clone().addScaledVector(P.vel, dt);
  // grab the vines: walk into the cliff face
  const c = TR.cliff;
  if (c && mvDir.x > 0.35 && next.x > c.minX - 0.75 && next.x < c.minX + 0.1 && next.z > c.minZ + 0.15 && next.z < c.maxZ - 0.15 && next.y < c.top - 0.6) { P.climb = { acc: 0 }; P.vel.set(0, 0, 0); P.pos.set(c.minX - 0.38, Math.max(next.y, height(c.minX - 0.38, next.z)), next.z); P.roll = 0; sfx('grab'); G.fs.grabbed = true; lil.root.position.copy(P.pos); lil.root.rotation.y = Math.PI / 2; lil.update(G.t, dt, { state: 'climb', speed: 0 }); return; }
  // ledge grab: in the air, just short of a ledge top, moving toward it -> mantle up
  if (!P.onGround && mag > 0 && P.vel.y < 4) for (const b of W.boxes) { if (b.log) continue; const dy = b.top - next.y; if (dy < 0.05 || dy > 1.05) continue; const cx = clamp(next.x, b.minX, b.maxX), cz = clamp(next.z, b.minZ, b.maxZ); const dd = Math.hypot(next.x - cx, next.z - cz); if (dd < 0.001 || dd > 0.6) continue; const tx = (cx - next.x) / dd, tz = (cz - next.z) / dd; if (mvDir.x * tx + mvDir.z * tz < 0.2) continue; next.set(cx + tx * 0.5, b.top, cz + tz * 0.5); P.vel.set(0, 0, 0); P.landT = 0.18; sfx('grab'); G.fs.ledgeGrab = true; break; }
  // collisions: tree trunks, hedge/log boxes
  for (const c of W.colliders) { const dx = next.x - c.x, dz = next.z - c.z, d = Math.hypot(dx, dz), rr = c.r + 0.35; if (d < rr && d > 0.0001) { next.x = c.x + dx / d * rr; next.z = c.z + dz / d * rr; } }
  for (const b of W.boxes) { if (next.y >= b.top - 0.3) continue; if (next.x > b.minX - 0.35 && next.x < b.maxX + 0.35 && next.z > b.minZ - 0.35 && next.z < b.maxZ + 0.35) { const pz = P.pos.z; if (pz >= b.maxZ + 0.3) next.z = b.maxZ + 0.35; else if (pz <= b.minZ - 0.3) next.z = b.minZ - 0.35; else { const px = P.pos.x; if (px <= b.minX) next.x = b.minX - 0.35; else if (px >= b.maxX) next.x = b.maxX + 0.35; else next.z = pz > (b.minZ + b.maxZ) / 2 ? b.maxZ + 0.35 : b.minZ - 0.35; } } }
  next.x = clamp(next.x, pathX(next.z) - 42, pathX(next.z) + 42); next.z = clamp(next.z, -160, 22);
  const gy = groundAt(W, next.x, next.z, P.pos.y);
  if (next.y <= gy) { if (!P.onGround) { if (fallV < -9) { P.landT = 0.28; sfx('land'); cam.shake = 0.12; burst(next.clone().add(new V3(0, 0.1, 0)), 0xe8dcc8, 12, 2, 0.5); } else if (fallV < -3) { P.landT = 0.12; sfx('land'); } } next.y = gy; P.vel.y = 0; P.onGround = true; }
  else if (next.y > gy + 0.06) P.onGround = false;
  P.pos.copy(next);
  if (P.onGround && mag > 0) { P.stepAcc += dt * speed; if (P.stepAcc > 1.4) { P.stepAcc = 0; sfx('step'); if (P.wading) burst(P.pos.clone().add(new V3(0, WATER_Y - P.pos.y + 0.6, 0)), 0xd0f4ff, 8, 2, 0.4); } }
  }
  // timers
  P.inv -= dt; P.hurtT -= dt; P.landT -= dt; P.fireCd -= dt; P.meleeCd -= dt; P.roll = Math.max(0, P.roll - dt); P.rollCd -= dt; if (inp.fireTap > 0) inp.fireTap -= dt;
  if ((inp.fire || inp.fireTap > 0) && !P.climb && !P.swim) { fire(); if (P.weapon === 'cello') inp.fireTap = 0; }
  if (P.upper) { P.upperT += dt / Math.max(0.01, P.upperDur); if (P.upperT >= 1) P.upper = null; }
  if (P.mana < 25 && !flags().unlimitedMana) { P.mana = Math.min(25, P.mana + dt * 1.5); }
  // animation state
  const hs = Math.hypot(P.vel.x, P.vel.z);
  if (!st) { st = 'idle'; if (!P.onGround) st = P.vel.y > 0.5 ? 'jump' : 'fall'; else if (P.landT > 0) st = 'land'; else if (hs > 0.25) st = P.sprint && hs > 6 ? 'sprint' : hs > 3.6 ? 'run' : 'walk'; if (P.roll > 0) st = 'roll'; }
  if (P.hurtT > 0 && !P.swim && !P.climb) st = 'hurt';
  lil.root.position.copy(P.pos); lil.root.rotation.y = P.face;
  lil.root.visible = !(P.inv > 0 && Math.floor(P.inv * 14) % 2 === 0 && P.inv < 0.9 && G.state === 'play');
  lil.update(G.t, dt, { state: st, speed: st === 'climb' ? P.climbSpeed : hs, upper: P.climb || P.swim ? null : P.upper, upperT: P.upperT });
}
function updateCamera(dt) {
  const tgt = P.pos.clone().add(new V3(0, 1.55, 0)); const { r } = camBasis(); tgt.addScaledVector(r, 0.55);
  cam.target.lerp(tgt, 1 - Math.exp(-dt * 12));
  const off = new V3(Math.sin(cam.yaw) * Math.cos(cam.pitch), Math.sin(cam.pitch), Math.cos(cam.yaw) * Math.cos(cam.pitch)).multiplyScalar(cam.dist);
  const want = cam.target.clone().add(off); const gy = height(want.x, want.z) + 0.4; if (want.y < gy) want.y = gy;
  cam.pos.lerp(want, 1 - Math.exp(-dt * 14)); camera.position.copy(cam.pos);
  if (cam.shake > 0) { cam.shake -= dt; camera.position.add(new V3((Math.random() - 0.5) * cam.shake, (Math.random() - 0.5) * cam.shake, 0)); }
  camera.lookAt(cam.target);
}

// ---------------- cutscenes ----------------
function easeIO(x) { return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2; }
function startEndingCutscene(replay) {
  if (document.pointerLockElement) document.exitPointerLock();
  G.state = 'cutscene'; document.body.classList.add('cine'); $('hud').classList.add('hidden'); $('touch').classList.add('hidden'); $('crosshair').classList.remove('on'); $('skipCine').classList.remove('hidden'); prompt('');
  AU.suspend(1.5); subQ = []; subT = 0; $('subs').innerHTML = '';
  const base = W.portal.group.position; const V = (x, y, z) => base.clone().add(new V3(x, y, z)); const Vg = (x, z) => { const v = V(x, 0, z); v.y = height(v.x, v.z); return v; };
  const sm0 = Vg(0.9, 4.4), g0 = Vg(-0.9, 4.8), lpos = Vg(1.3, 11);
  shadow.root.visible = true; shadow.root.scale.setScalar(1); shadow.root.position.copy(sm0); shadow.root.rotation.y = Math.PI; shadow.root.traverse(o => { if (o.material) { o.material.transparent = true; o.material.opacity = 1; } });
  girl.root.visible = true; girl.root.scale.setScalar(0.93); girl.root.position.copy(g0); girl.root.rotation.y = Math.PI;
  P.pos.copy(lpos); P.face = Math.PI; P.vel.set(0, 0, 0); P.swim = false; P.climb = null; lil.root.position.copy(P.pos); lil.root.rotation.y = P.face; cat.root.position.copy(P.pos).add(new V3(1.0, 0, 0.6)); cat.root.rotation.y = Math.PI;
  W.portal.disc.scale.setScalar(1); W.portal.U.uChaos.value = 0;
  const shots = [
    { d: 3.4, cam: [V(7, 2.6, 17), V(4, 3.0, 14)], look: [V(0, 2.6, 2), V(0, 3, 1)], on: () => { sfx('portal'); W.portal.U.uPink.value = 1; SM("Here we are. Listen… it's humming your song, little star.", 3.3); } },
    { d: 3.0, cam: [V(-2.6, 1.6, 7.6), V(-2.1, 1.65, 6.8)], look: [V(-0.9, 1.4, 4.8), V(-0.9, 1.5, 4.8)], on: () => say('THE GIRL', "It's beautiful… it's never glowed pink like this before.", 3) },
    { d: 3.6, cam: [V(2.0, 1.8, 7.4), V(1.5, 1.85, 6.6)], look: [V(0.9, 1.75, 4.4), V(0.9, 1.8, 4.4)], on: () => { G.cine.smFace = Math.atan2(lpos.x - sm0.x, lpos.z - sm0.z); SM('You learned quickly today. But the best lessons never end in a meadow.', 3.5); } },
    { d: 3.0, cam: [V(-4.6, 2.2, 9.5), V(-3.8, 2.4, 8.2)], look: [V(0, 1.4, 4.4), V(0, 1.7, 2.6)], on: () => { G.cine.smFace = Math.PI; G.cine.take = 0; G.cine.girlState = 'walk'; sfx('whoosh'); say('', 'Shadow Man takes the girl by the hand and steps toward the light.', 2.8); } },
    { d: 2.6, cam: [V(2.6, 1.6, 14.2), V(2.1, 1.55, 13.2)], look: [V(1.3, 1.4, 11), V(1.3, 1.5, 11)], on: () => { G.cine.lilState = 'reach'; G.cine.catState = 'hiss'; sfx('hiss'); say('THE GIRL', 'Synn—!', 1.6); } },
    { d: 3.4, cam: [V(0.2, 2.0, 9.6), V(0.1, 2.4, 8.0)], look: [V(0, 1.8, 1), V(0, 2.4, 0)], on: () => { G.cine.girlState = 'reach'; G.cine.into = 0; sfx('shadow'); SM('If you want her back… follow the music.', 3); } },
    { d: 3.6, cam: [V(1.2, 2.4, 13.5), V(0, 3.2, 11)], look: [V(0, 3.6, 0), V(0, 3.4, 0)], on: () => { shadow.root.visible = false; girl.root.visible = false; G.cine.seal = 0; sfx('seal'); cam.shake = 0.7; ring(W.portal.center.clone(), 0xff6ad5, 7, 1.0); ring(W.portal.center.clone(), 0x9a6bff, 5, 1.4); say('', 'The portal flares… then folds in on itself, sealing her away in another dimension.', 3.4); } },
    { d: 3.2, cam: [V(3.2, 1.2, 12.6), V(2.6, 1.3, 12.0)], look: [V(1.5, 0.9, 11.2), V(1.4, 1.0, 11.4)], on: () => { sfx('meow'); G.cine.lilState = 'idle'; G.cine.catState = 'meow'; say('THE CAT', 'MRRAOW. (The cat stares at the empty stones, then up at you: we are going after her.)', 3.1); } },
    { d: 3.0, cam: [V(-3, 2.0, 17), V(-4.5, 3.4, 20)], look: [V(1, 1.2, 10), V(0.5, 1.8, 6)], on: () => { G.cine.catState = 'sit'; setTimeout(() => $('fade').classList.add('on'), 2100); } },
  ];
  G.cine = { shots, i: -1, t: 0, total: 0, replay: !!replay, girlState: 'idle', lilState: 'idle', catState: 'sit', sm0, g0, sm1: Vg(0.25, 0.5), g1: Vg(-0.35, 0.9), smFace: Math.PI };
  nextShot();
}
function nextShot() { const C = G.cine; C.i++; C.t = 0; const s = C.shots[C.i]; if (!s) { endCutscene(); return; } s.on && s.on(); }
function updateCutscene(dt, t) {
  const C = G.cine; if (!C) return; const s = C.shots[C.i]; if (!s) return; C.t += dt; const k = easeIO(Math.min(1, C.t / s.d));
  camera.position.lerpVectors(s.cam[0], s.cam[1], k); const look = new V3().lerpVectors(s.look[0], s.look[1], k); if (cam.shake > 0) { cam.shake -= dt; camera.position.add(new V3((Math.random() - 0.5) * cam.shake * 0.5, (Math.random() - 0.5) * cam.shake * 0.5, 0)); } camera.lookAt(look);
  let smSt = 'idle';
  if (C.take !== undefined && C.into === undefined) { C.take = Math.min(1, C.take + dt / 4.2); const e = easeIO(C.take); shadow.root.position.lerpVectors(C.sm0, C.sm1, e); girl.root.position.lerpVectors(C.g0, C.g1, e); smSt = C.take < 1 ? 'walk' : 'idle'; }
  if (C.into !== undefined && shadow.root.visible) { C.into = Math.min(1, C.into + dt / 3.0); const e = easeIO(C.into); const o = 1 - e;
    shadow.root.traverse(m => { if (m.material) { m.material.transparent = true; m.material.opacity = Math.max(0, o); } }); shadow.root.scale.setScalar(Math.max(0.01, 1 - e * 0.4)); girl.root.scale.setScalar(Math.max(0.01, 0.93 * (1 - e * 0.85)));
    girl.root.position.lerp(W.portal.center.clone().add(new V3(-0.2, -2.6, 0.2)), dt * 0.9); shadow.root.position.lerp(W.portal.center.clone().add(new V3(0.3, -3.0, 0)), dt * 0.9);
    W.portal.U.uPink.value = 1; W.portal.light.intensity = 30 + e * 90; W.portal.disc.scale.setScalar(1 + e * 0.25);
    if (Math.random() < 0.6) burst(girl.root.position.clone().add(new V3(0, 0.9, 0)), Math.random() < 0.5 ? 0x2a0a4a : 0xff6ad5, 6, 2, 0.7); }
  if (C.seal !== undefined) { C.seal += dt; const e = Math.min(1, C.seal / 2.4); W.portal.U.uChaos.value = Math.min(1, C.seal * 0.8); W.portal.U.uPink.value = Math.sin(C.seal * 13) > 0 ? 1 : 0.2;
    W.portal.disc.scale.setScalar(Math.max(0.03, 1.25 * (1 - easeIO(e)) + 0.03)); W.portal.light.intensity = e < 0.25 ? 140 : Math.max(2, 120 * (1 - e)); if (Math.random() < 0.4 && e < 1) burst(W.portal.center.clone(), Math.random() < 0.5 ? 0x9a6bff : 0xff6ad5, 8, 4, 0.6); }
  shadow.root.rotation.y = rotTo(shadow.root.rotation.y, C.smFace, 6 * dt); if (shadow.root.visible) shadow.update(t, dt, { state: smSt, speed: 1.6 }); if (shadow.proc?.feather) shadow.proc.feather.rotation.z = Math.sin(t * 2) * 0.2;
  girl.root.rotation.y = rotTo(girl.root.rotation.y, C.girlState === 'reach' ? 0 : Math.PI, 5 * dt);
  if (C.lilState === 'run') { P.pos.z -= dt * 3.5; P.pos.y = height(P.pos.x, P.pos.z); cat.root.position.z -= dt * 3.6; }
  lil.root.position.copy(P.pos); lil.root.rotation.y = P.face; lil.update(t, dt, { state: C.lilState, speed: C.lilState === 'run' ? 4.5 : 0 });
  if (C.t >= s.d) nextShot();
}
function skipCine() { const C = G.cine; if (!C) return; for (let i = C.i + 1; i < C.shots.length; i++) { /* jump to the end state */ } endCutscene(); }
function endCutscene() {
  const C = G.cine; if (!C) return; G.cine = null; document.body.classList.remove('cine'); $('skipCine').classList.add('hidden'); shadow.root.visible = false; girl.root.visible = false; $('subs').innerHTML = ''; subQ = [];
  W.portal.U.uChaos.value = 0.6; W.portal.disc.scale.setScalar(0.03); W.portal.light.intensity = 2; // sealed
  if (!SV.cutscenes.includes('shadow-takes-girl')) SV.cutscenes.push('shadow-takes-girl');
  if (!C.replay) { G.game.tutorialDone = true; G.game.step = STEPS.length; autosave(); }
  else persist();
  $('fade').classList.add('on');
  setTimeout(() => { $('fade').classList.remove('on'); if (C.replay) { returnToMenu(); } else { G.state = 'tbc'; $('tbc').classList.add('show'); } }, 900);
}
$('skipCine').onclick = skipCine;

// ---------------- game lifecycle ----------------
function clearWorldState() {
  enemies.splice(0).forEach(e => scene.remove(e.g)); pickups.splice(0).forEach(p => scene.remove(p.m)); shots.splice(0).forEach(s => { scene.remove(s.m); scene.remove(s.tr); }); fx.splice(0).forEach(f => scene.remove(f.m));
  bells.splice(0).forEach(b => scene.remove(b.g)); if (chest) { scene.remove(chest.g); W.colliders = W.colliders.filter(c => !(Math.abs(c.x - chest.g.position.x) < 0.01 && Math.abs(c.z - chest.g.position.z) < 0.01)); chest = null; }
  flowersBloomed.splice(0).forEach(f => scene.remove(f.g)); G.combatOn = false; waveN = 0;
}
function setupWorldForStep(game) {
  const i = game.step; const T = W.spots.targets; const bl = stepIdx('blast'), sw = stepIdx('switch');
  [[-3.2, 0], [0, -3], [3.4, 0.4], [1.5, -6]].forEach(([dx, dz], k) => { const x = T.x + dx, z = T.z + dz; const b = makeBell(new V3(x, height(x, z), z)); if (i > bl && k < 3) { b.rung = true; b.bm.emissive.set(0xffc860); } if (k === 3) { b.g.visible = i >= sw; if (i > sw) b.rung = true; } });
  chest = makeChest(W.spots.chest); if (game.chestOpened) { chest.open = true; chest.lidP.rotation.x = -1.9; }
  if (i > stepIdx('combat')) waveN = 1; if (i > stepIdx('ability')) waveN = 2;
  resetTraining(i);
}
function startGame(game, fromSlot) {
  if (!W) { worldReady.then(() => startGame(game, fromSlot)); return; }
  game.step = stepIndexOf(game); game.stepV = 2;
  G.game = game; G.fs = {}; G.yawAcc = 0; G.ranT = 0; clearWorldState();
  P.swim = false; P.climb = null; P.roll = 0; P.rollCd = 0; P.meleeCd = 0; P.breath = 100; P.drownT = 0; inp.act = false;
  P.maxHp = maxHpNow(); P.hp = game.hp == null ? P.maxHp : Math.min(game.hp, P.maxHp); P.mana = game.mana; P.pouch = game.pouch; P.packs = game.healthPacks; P.weapon = 'sonic'; P.absorb = null; P.upper = null;
  P.pos.copy(game.step >= STEPS.length ? W.spots.wave2 : (game.step ? stepSpotFor(game.step) : W.spots.start)); P.vel.set(0, 0, 0); P.face = Math.PI; cam.yaw = 0; cam.pitch = 0.28;
  cam.pos.copy(P.pos).add(new V3(0, 3, 6)); cam.target.copy(P.pos);
  setupWorldForStep(game);
  const live = game.step < STEPS.length; const smP = game.step ? P.pos.clone().add(new V3(-1.5, 0, -4)) : off('start', -1.8, -3.2);
  shadow.root.visible = live; shadow.root.scale.setScalar(1); shadow.root.position.set(smP.x, height(smP.x, smP.z), smP.z); shadow.root.rotation.y = 0; shadow.root.traverse(o => { if (o.material) { o.material.opacity = 1; } });
  girl.root.visible = live; girl.root.scale.setScalar(0.93); girl.root.position.copy(smP).add(new V3(-1.2, 0, -1.8)); girl.root.position.y = height(girl.root.position.x, girl.root.position.z);
  cat.root.position.copy(game.step ? P.pos.clone().add(new V3(1.5, 0, 1)) : W.spots.catStart);
  lil.setCostume(costumeOf()); lil.hold(W8.sonic); cat.setCrown(!!flags().catCrown); cat.root.scale.setScalar(flags().bigCat ? 2.2 : 1);
  W.portal.U.uChaos.value = 0; W.portal.disc.scale.setScalar(1); W.portal.light.intensity = W.portal.light.userData.base ?? (W.portal.light.userData.base = 30);
  buildHealthHUD(); drawMana(); drawPouch(); drawWeapon();
  hideScreens(); $('hud').classList.remove('hidden'); if (isTouch) $('touch').classList.remove('hidden');
  G.state = 'play'; AU.start('explore'); AU.unsuspend();
  if (game.step >= STEPS.length) { G.state = 'tbc'; $('tbc').classList.add('show'); $('hud').classList.add('hidden'); return; }
  enterStep(game.step);
  if (G.step >= 3) G.fs.whale = 0.0001;
}
function stepSpotFor(step) { const old = G.step; G.step = step; const s = stepSpot(); G.step = old; return s; }
function snapshot() { const g = G.game; g.hp = P.hp; g.mana = P.mana; g.pouch = P.pouch; g.healthPacks = P.packs; g.weapon = P.weapon; g.weapons = weaponsNow(); return SAVE.snapshotGame(g); }
function autosave() { if (!G.game) return; SV.current = snapshot(); SV.current.savedAt = Date.now(); const ok = persist(); if (!ok) toast('Could not save (storage full or blocked)', 2.5); }
function hideScreens() { ['menu', 'pause', 'sheet', 'codes', 'catMenu', 'dead', 'tbc'].forEach(id => $(id).classList.remove('show')); }
function pauseGame(on) {
  if (on && G.state === 'play') { G.state = 'paused'; G.fs.pausedOnce = true; $('pause').classList.add('show'); $('btnPSongs').classList.toggle('hidden', !flags().songSelector); drawMusic(); $('crosshair').classList.remove('on'); AU.dim(true); if (document.pointerLockElement) document.exitPointerLock(); }
  else if (!on && G.state === 'paused') { hideScreens(); G.state = 'play'; AU.dim(false); }
}
function returnToMenu() { hideScreens(); G.state = 'menu'; $('hud').classList.add('hidden'); $('touch').classList.add('hidden'); prompt(''); $('menu').classList.add('show'); clearWorldState(); girl.root.visible = true; placeIdle(); refreshMenu(); AU.unsuspend(); }
function placeIdle() { if (!W) return; P.pos.copy(W.spots.start); lil.root.position.copy(P.pos); lil.root.rotation.y = Math.PI; const sp = off('start', -3.4, -3.6); shadow.root.visible = true; shadow.root.scale.setScalar(1); shadow.root.position.copy(sp); shadow.root.rotation.y = 0.5; SHADOW.goal = sp.clone(); girl.root.visible = true; girl.root.scale.setScalar(0.93); girl.root.position.copy(W.spots.girlStart); girl.root.rotation.y = Math.PI * 0.75; cat.root.position.copy(W.spots.catStart); W.portal.disc.scale.setScalar(1); }

// ---------------- menus ----------------
function refreshMenu() {
  const has = !!SV.current; const cont = document.querySelector('#menuBtns [data-act=continue]'); cont.disabled = !has;
  document.querySelector('#menuBtns [data-act=load]').disabled = !SV.slots.some(Boolean) && !has;
  $('btnWardrobe').classList.toggle('hidden', SV.unlocks.costumes.length < 2);
  $('btnSongs').classList.toggle('hidden', !flags().songSelector);
}
refreshMenu();
const menuAct = {
  new: () => { if (SV.current && !confirm('Start a new game? Your autosave will be replaced (manual save slots are kept).')) return; AU.unlock(); startGame(SAVE.blankGame()); sfx('code'); },
  continue: () => { if (!SV.current) return; AU.unlock(); startGame(SAVE.snapshotGame(SV.current)); },
  codes: () => openCodes(), songs: () => openSongs(), load: () => openLoad(), settings: () => openSettings(), credits: () => openCredits(), inventory: () => openInventory(), gallery: () => openGallery(), wardrobe: () => openWardrobe(),
  chars: () => openInfo('CHARACTERS', `<div class="info"><p><b>LIL SYNN</b> — playable.</p><p><b>The Girl in the Yellow Dress</b> — ${flags().girlPlayable ? 'unlocked as a playable character. Her own story mode arrives in a later update; your unlock is saved.' : 'locked.'}</p><p><b>The Cat</b> — your companion, always.</p><p class="small dim"><span class="soon">COMING SOON</span> Character selection opens when the girl's alternate story is built.</p></div>`),
  upgrades: () => openInfo('UPGRADES', `<div class="info"><p>Magic sword level: <b>${SV.unlocks.swordLevel}</b> / 369 (saved)</p><p class="small dim"><span class="soon">COMING SOON</span> Weapon forging and the 369-level magic sword arrive with Level 1.</p></div>`),
  achievements: () => openInfo('ACHIEVEMENTS', `<div class="info"><p class="small dim"><span class="soon">COMING SOON</span> Achievements arrive with the next stage.</p><p>Tutorial: ${SV.current?.tutorialDone ? '✓ complete' : 'in progress'}</p></div>`),
};
document.querySelectorAll('#menuBtns button').forEach(b => b.addEventListener('click', () => { sfx('click'); menuAct[b.dataset.act]?.(); }));
document.querySelectorAll('#pause nav button').forEach(b => b.addEventListener('click', () => { sfx('click'); ({ resume: () => pauseGame(false), inventory: () => openInventory(), settings: () => openSettings(), save: () => openSave(), load: () => openLoad(), mainmenu: () => { autosave(); returnToMenu(); }, code: () => openPauseCodes(), songs: () => openSongs() })[b.dataset.act]?.(); }));
document.querySelectorAll('#tbc button').forEach(b => b.addEventListener('click', () => { sfx('click'); if (b.dataset.act === 'mainmenu') returnToMenu(); if (b.dataset.act === 'replay') startGame(SAVE.blankGame()); }));
let sheetFrom = null;
function openSheet(title, html, onBack) { sheetFrom = G.state; $('sheetTitle').textContent = title; $('sheetBody').innerHTML = html; $('sheet').classList.add('show'); $('sheet').dataset.back = ''; $('sheetBack').onclick = () => { closeSheet(); onBack && onBack(); }; }
function closeSheet() { $('sheet').classList.remove('show'); sfx('click'); refreshMenu(); }
function openInfo(t, h) { openSheet(t, h); }
function openCredits() {
  openSheet('CREDITS', `<div class="credits"><p class="kicker">LIL SYNN - ROAD TO HER</p>
    <p class="main">Made by Hark AI, ChatGPT by LIL SYNN / Jarred Gainer 2026 SYNOVA MEDIA</p>
    <p class="small">LIL SYNN - ROAD TO HER · Created by LIL SYNN / Jarred Gainer</p>
    <p class="small">Music: LIL SYNN</p>
    <p class="small dim">3D nature kits, rigged bases: Quaternius (CC0) · Logs: Poly Haven (CC0) · Cat base: Vuena (CC0) · HDRI skies: Poly Haven (CC0) · Engine: three.js (MIT)</p>
    <p class="small dim">© 2026 SYNOVA MEDIA. LIL SYNN and associated original game content. All rights reserved. (Rights holders to be confirmed before commercial release.)</p></div>`);
}
function slotMeta(g) { if (!g) return '<span class="dim">Empty</span>'; const si = stepIndexOf(g); const st = STEPS[Math.min(si, STEPS.length - 1)]; const d = g.savedAt ? new Date(g.savedAt).toLocaleString() : ''; return `<b>Enchanted Meadow</b> · ${g.tutorialDone ? 'Tutorial complete' : 'Lesson ' + (si + 1) + '/' + STEPS.length + ' (' + (st?.id || '') + ')'}<br><span class="dim">${d}</span>`; }
function openLoad() {
  const rows = [['Autosave', SV.current, 'auto'], ...SV.slots.map((s, i) => ['Slot ' + (i + 1), s, i])];
  openSheet('LOAD GAME', rows.map(([n, g, id]) => `<div class="slot"><div class="meta">${n}<br>${slotMeta(g)}</div><button data-load="${id}" ${g ? '' : 'disabled'}>LOAD</button></div>`).join(''));
  $('sheetBody').querySelectorAll('[data-load]').forEach(b => b.onclick = () => { const id = b.dataset.load; const g = id === 'auto' ? SV.current : SV.slots[+id]; if (!g) return; closeSheet(); startGame(SAVE.snapshotGame(g)); toast('Loaded ' + (id === 'auto' ? 'autosave' : 'slot ' + (+id + 1)), 1.6); });
}
function openSave() {
  openSheet('SAVE GAME', SV.slots.map((s, i) => `<div class="slot"><div class="meta">Slot ${i + 1}<br>${slotMeta(s)}</div><button data-save="${i}">SAVE HERE</button></div>`).join('') + '<p class="small dim">Autosave also updates after every lesson.</p>');
  $('sheetBody').querySelectorAll('[data-save]').forEach(b => b.onclick = () => { const i = +b.dataset.save; const snap = snapshot(); snap.savedAt = Date.now(); SV.slots[i] = snap; const ok = persist(); toast(ok ? `Saved to slot ${i + 1} ✓` : 'Save failed: storage blocked or full', 2); openSave(); });
}
function openInventory() {
  const g = G.game || SV.current; const w = (G.game ? weaponsNow() : (g?.weapons || ['sonic'])).map(id => `${WEAPONS[id].icon} ${WEAPONS[id].name}`).join('<br>');
  openSheet('INVENTORY', `<div class="info"><p class="secTitle">WEAPONS</p><p>${w}</p><p class="secTitle">ITEMS</p><p>❤ Hearts (unabsorbed): <b>${G.game ? P.pouch : g?.pouch || 0}</b><br>✚ Health packs: <b>${G.game ? P.packs : g?.healthPacks || 0}</b> ${G.game && P.packs ? '<button id="invHeal">USE ONE</button>' : ''}<br>🎤 Magical Microphone: ${flags().pinkQuest && flags().pinkQuest !== 'complete' ? '<i>quest active: The Lost Microphone</i>' : 'equipped'}</p><p class="secTitle">SPECIAL</p><p>Magic sword level ${SV.unlocks.swordLevel} <span class="soon">LEVEL 1</span></p><p class="small dim">Crafting materials, artifacts and accessories arrive with the next realms.</p></div>`);
  const h = $('invHeal'); if (h) h.onclick = () => { const was = G.state; G.state = 'play'; useHealthPack(); G.state = was; openInventory(); };
}
function openGallery() {
  const has = SV.cutscenes.includes('shadow-takes-girl');
  openSheet('CUTSCENE GALLERY', `<div class="slot"><div class="meta"><b>The Portal</b><br><span class="dim">${has ? 'Shadow Man appears in the Enchanted Meadow' : 'Locked: finish the tutorial'}</span></div><button id="playCine" ${has ? '' : 'disabled'}>WATCH</button></div>`);
  const b = $('playCine'); if (b) b.onclick = () => { closeSheet(); hideScreens(); worldReady.then(() => { clearWorldState(); G.game = G.game || SAVE.blankGame(); startEndingCutscene(true); }); };
}
function openWardrobe() {
  openSheet('WARDROBE', COSTUMES.filter(c => SV.unlocks.costumes.includes(c.id) || c.id === 'classic').map(c => `<div class="slot"><div class="meta"><b>${c.name}</b></div><button data-cos="${c.id}" ${SV.unlocks.costume === c.id ? 'disabled' : ''}>${SV.unlocks.costume === c.id ? 'WEARING' : 'WEAR'}</button></div>`).join(''));
  $('sheetBody').querySelectorAll('[data-cos]').forEach(b => b.onclick = () => { SV.unlocks.costume = b.dataset.cos; persist(); lil.setCostume(costumeOf()); openWardrobe(); });
}
// Settings: identical panel from the main menu and the pause menu; every change applies immediately and persists.
function openSettings() {
  const tog = (k, label) => `<div class="set"><label>${label}</label><button class="tog ${S[k] ? 'on' : 'off'}" data-tog="${k}">${S[k] ? 'ON' : 'OFF'}</button></div>`;
  const rng = (k, label, min = 0, max = 1, step = 0.05) => `<div class="set"><label>${label}</label><span class="val" id="v_${k}">${Math.round(S[k] * 100)}%</span><input type="range" min="${min}" max="${max}" step="${step}" value="${S[k]}" data-rng="${k}" aria-label="${label}"></div>`;
  openSheet('SETTINGS', `<div class="secTitle">AUDIO</div>${rng('master', 'Master volume')}${tog('musicOn', 'Music')}${rng('music', 'Music volume')}${tog('sfxOn', 'Sound effects')}${rng('sfx', 'Sound effects volume')}<button id="audioReset">RESET AUDIO TO DEFAULTS</button>
    <div class="secTitle">CONTROLS & DISPLAY</div>${rng('sensitivity', 'Mouse / camera sensitivity', 0.3, 2, 0.05)}${tog('invertY', 'Invert camera Y')}${tog('subtitles', 'Subtitles')}
    <div class="set"><label>Subtitle size</label><select id="subSize">${['small', 'medium', 'large'].map(s => `<option ${S.subtitleSize === s ? 'selected' : ''}>${s}</option>`).join('')}</select></div>
    ${rng('brightness', 'Brightness', 0.6, 1.5, 0.05)}
    <div class="set"><label>Graphics quality <span class="small dim">(now: ${tier})</span></label><select id="qual">${['auto', 'low', 'med', 'high'].map(s => `<option ${S.quality === s ? 'selected' : ''}>${s}</option>`).join('')}</select></div>
    <div class="set"><label>Screen</label><span class="row"><button id="setFill">${document.body.classList.contains('fill') ? 'USE 9:16' : 'FILL WINDOW'}</button><button id="setFs">FULLSCREEN</button></span></div>
    <p class="small dim">Controls: WASD move · Shift run (hold to sprint) · Space jump ×2 · mouse look (click to lock) · E / click fire · Q / wheel / 1-3 switch · R absorb hearts · F interact · H health pack · V / right-click melee · C roll (dive in deep water, let go of vines) · Esc pause · N next song · M pause/play music · B replay song</p>`);
  const body = $('sheetBody');
  body.querySelectorAll('[data-tog]').forEach(b => b.onclick = () => { const k = b.dataset.tog; S[k] = !S[k]; b.classList.toggle('on', S[k]); b.classList.toggle('off', !S[k]); b.textContent = S[k] ? 'ON' : 'OFF'; AU.apply(); persist(); if (S.sfxOn) sfx('click'); });
  body.querySelectorAll('[data-rng]').forEach(r => r.oninput = () => { const k = r.dataset.rng; S[k] = +r.value; $('v_' + k).textContent = Math.round(S[k] * 100) + '%'; AU.apply(); if (k === 'brightness') renderer.toneMappingExposure = 0.92 * S.brightness; persist(); });
  $('audioReset').onclick = () => { for (const k of ['master', 'musicOn', 'music', 'sfxOn', 'sfx']) S[k] = SAVE.DEFAULT_SETTINGS[k]; AU.apply(); persist(); openSettings(); };
  $('subSize').onchange = (e) => { S.subtitleSize = e.target.value; applySubSize(); persist(); };
  $('qual').onchange = (e) => { S.quality = e.target.value; persist(); toast('Quality changes apply after a reload', 2.5); };
  $('setFill').onclick = () => { toggleFill(); openSettings(); }; $('setFs').onclick = toggleFullscreen;
}

// ---------------- Song Selector (code JUNE23): pick any LIL SYNN song, it loops until MESS ----------------
const fmtDur = (s) => s ? Math.floor(s / 60) + ':' + String(Math.round(s % 60)).padStart(2, '0') : '';
function openSongs() {
  if (!flags().songSelector) return;
  const cur = AU.repeat?.id; const groups = {};
  AU.tracks.forEach((t, i) => { const k = t.album || t.folder || 'SINGLES'; (groups[k] = groups[k] || []).push([t, i]); });
  const html = `<p class="small dim">Pick a song: it plays on repeat (Next is locked) until you enter <b>MESS</b> with the code button in the pause menu. Songs load only when picked.</p>` + Object.entries(groups).map(([g, list]) => `<div class="secTitle">${g}</div>` + list.map(([t, i]) => `<div class="slot"><div class="meta"><b>${t.title}</b><br><span class="dim">${[t.artist || 'LIL SYNN', fmtDur(t.duration)].filter(Boolean).join(' · ')}</span></div><button data-song="${i}" ${cur === t.id ? 'disabled' : ''}>${cur === t.id ? '🔁 ON REPEAT' : '▶ PLAY ON REPEAT'}</button></div>`).join('')).join('');
  openSheet('SONG SELECTOR', html || '<p>No songs found in audio/tracks.json.</p>');
  $('sheetBody').querySelectorAll('[data-song]').forEach(b => b.onclick = () => { const t = AU.tracks[+b.dataset.song]; if (!t) return; AU.unlock(); SV.unlocks.repeatTrack = t.id; persist(); AU.setRepeat(t); toast('🔁 ' + t.title + ' on repeat', 1.6); openSongs(); });
}
// Pause-menu code box: the one exception to "codes only on the main menu". Accepts only MESS.
let codeMode = 'menu';
function openPauseCodes() {
  if (G.state !== 'paused') return; codeMode = 'pause'; G.state = 'pcodes'; $('codes').classList.add('show'); $('codeIn').value = ''; $('codeMsg').className = ''; $('codeMsg').querySelector('b').textContent = 'PAUSE MENU CODE'; $('codeMsg').querySelector('p').textContent = 'Only one special code works here.'; setTimeout(() => $('codeIn').focus(), 30);
}

// ---------------- secret codes (MAIN MENU ONLY) ----------------
function openCodes() {
  if (G.state !== 'menu') return; // hard guard: never from gameplay, pause, cutscenes
  codeMode = 'menu'; G.state = 'codes'; $('codes').classList.add('show'); $('codeIn').value = ''; $('codeMsg').className = ''; $('codeMsg').querySelector('b').textContent = ''; $('codeMsg').querySelector('p').textContent = 'Type a secret code and press Enter.'; setTimeout(() => $('codeIn').focus(), 30);
}
function closeCodes() { $('codes').classList.remove('show'); if (codeMode === 'pause') { G.state = 'paused'; codeMode = 'menu'; drawMusic(); return; } G.state = 'menu'; refreshMenu(); }
function submitCode() {
  if (G.state === 'pcodes') { const res = applyPauseCode($('codeIn').value, SV); const box = $('codeMsg'); box.className = res.ok ? '' : 'bad'; box.querySelector('b').textContent = res.title; box.querySelector('p').textContent = res.msg; if (res.ok) { persist(); AU.setRepeat(null); AU.skip(); sfx('code'); drawMusic(); } else sfx('nope'); $('codeIn').select(); return; }
  if (G.state !== 'codes') return;
  const res = applyCode($('codeIn').value, SV); const box = $('codeMsg'); box.className = res.ok ? '' : 'bad'; box.querySelector('b').textContent = res.title; box.querySelector('p').textContent = res.msg;
  if (res.ok) { const ok = persist(); if (!ok) box.querySelector('p').textContent += ' (Could not save: storage blocked.)'; sfx('code'); lil.setCostume(costumeOf()); } else sfx('nope');
  $('codeIn').select();
}
$('codeOk').onclick = submitCode; $('codeClose').onclick = closeCodes;
$('btnPCode').addEventListener('click', () => { sfx('click'); openPauseCodes(); });
$('codeIn').addEventListener('keydown', (e) => { e.stopPropagation(); if (e.key === 'Enter') submitCode(); if (e.key === 'Escape') closeCodes(); });
// touch devices have no CTRL key: long-press the title on the main menu
(() => { let tm = null; const el = $('titleLogo'); el.addEventListener('pointerdown', () => { tm = setTimeout(() => { if (G.state === 'menu' && $('menu').classList.contains('show')) openCodes(); }, 1200); }); ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => el.addEventListener(ev, () => clearTimeout(tm))); })();

// ---------------- main loop ----------------
const clock = new THREE.Clock(); let menuT = 0; const MANUAL = TEST && params.has('manual');
function frame(fixedDt, noRender) {
  if (!MANUAL) requestAnimationFrame(() => frame());
  const dt = fixedDt || Math.min(0.05, clock.getDelta()); G.t += dt; U.time.value = G.t;
  if (W) W.update(G.t, dt);
  if (W && TR.rock) updateTraining(dt, G.t);
  if (G.state === 'play') { updatePlayer(dt); updateCamera(dt); updateTutorial(dt); G.game.playTime += dt; }
  else if (G.state === 'cutscene') updateCutscene(dt, G.t);
  else if ((G.state === 'menu' || G.state === 'codes') && W) { menuT += dt; const c = W.spots.start; const a = 0.5 + Math.sin(menuT * 0.06) * 0.35; camera.position.set(c.x + Math.sin(a) * 6.5, c.y + 1.9, c.z + 1 + Math.cos(a) * 6.5); camera.lookAt(c.x, c.y + 0.2, c.z - 1); lil.update(G.t, dt, { state: 'idle', speed: 0 }); }
  if (W && G.state !== 'cutscene' && G.state !== 'menu' && G.state !== 'codes') { updateForeshadow(dt, G.t); }
  if (W && G.state !== 'paused' && G.state !== 'catmenu') { updateCat(dt, G.t); updateShadowGuide(dt, G.t); updateGirl(dt, G.t); for (const e of enemies) { if (e.spawnT !== undefined && e.spawnT < 1) { e.spawnT += dt * 1.5; e.g.scale.setScalar((e.big ? 1.9 : 1) * Math.min(1, e.spawnT)); } if (!e.dead && G.state === 'play') e.update(dt); } for (let i = enemies.length - 1; i >= 0; i--) if (enemies[i].dead) enemies.splice(i, 1); updateShots(dt); updatePickups(dt); updateFx(dt); updateBells(dt, G.t); updateAbsorb(dt); flowersBloomed.forEach(f => { f.t += dt; f.g.scale.setScalar(Math.min(1.6, f.t * 2)); }); if (chest && chest.open) chest.lidP.rotation.x = damp(chest.lidP.rotation.x, -1.9, 4, dt); }
  if (W && G.state === 'menu') updateForeshadow(dt, G.t);
  // crosshair: only visible while the mouse is moving (or locked & moving)
  mouse.active -= dt; const ch = $('crosshair'); const showCh = G.state === 'play' && !isTouch && mouse.active > 0;
  ch.classList.toggle('on', showCh); if (showCh) { if (mouse.locked) { ch.style.left = '50%'; ch.style.top = '50%'; } else { ch.style.left = mouse.x + 'px'; ch.style.top = mouse.y + 'px'; } }
  // interaction hint
  const it = G.state === 'play' ? interactTarget() : null; const ih = $('interactHint'); ih.classList.toggle('hidden', !it); if (it) ih.innerHTML = `${isTouch ? 'USE' : '<b>F</b>'} · ${{ chest: 'Open the chest', cat: 'The cat', girl: 'Talk', shadow: 'Shadow Man' }[it]}`;
  // context button + breath meter
  const al = P.swim ? 'DIVE' : P.climb ? 'DROP' : 'ROLL'; const ta = $('tAct'); if (ta.textContent !== al) ta.textContent = al;
  const showB = G.state === 'play' && (P.swim || P.breath < 99.5); $('breath').classList.toggle('hidden', !showB); if (showB) { $('breathFill').style.width = P.breath + '%'; $('breath').classList.toggle('low', P.breath < 30); }
  if (toastT > 0) { toastT -= dt; if (toastT <= 0) $('toast').classList.remove('on'); }
  drawSubs(dt);
  // shadows follow the player
  const fc = G.state === 'menu' ? W?.spots.start || P.pos : P.pos; if (W) { sun.position.set(fc.x + W.sunDir.x * 80, fc.y + W.sunDir.y * 80 + 20, fc.z + W.sunDir.z * 80); sun.target.position.copy(fc); }
  if (!noRender) { if (PIPE) { try { PIPE.render(dt); } catch (e) { console.warn('pipeline failed, using built-in', e); PIPE = null; composer.render(); } } else composer.render(); }
}
requestAnimationFrame(() => frame());

// test hooks (only with ?test)
if (TEST) window.__LSMR = { BODY, setInputMode, isTouch: () => isTouch, advance: (sec, fps = 20) => { const n = Math.max(1, Math.round(sec * fps)); for (let i = 0; i < n; i++) frame(1 / fps, i < n - 1); }, keys, inp, mouse, cam, G, P, SV: () => SV, S, AU, startGame, enterStep, STEPS, W: () => W, worldReady, flags, teleport: (x, z) => { P.pos.set(x, height(x, z), z); }, celloDamage, enemies, fire, setWeapon, spawnWave, startEndingCutscene, TR, shadow, girl, POND, melee, roll, stepIdx, musicCmd, openSongs, openPauseCodes, pauseGame, off, SHADOW };
