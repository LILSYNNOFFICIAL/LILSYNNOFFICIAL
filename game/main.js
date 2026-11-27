// LIL SYNN: Broken Hearts — game shell: renderer, player, flow, 369 levels.
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { makeLilSynn, makeGirl, makeShadowMan, makeCat, tryGLB, setLensTexture } from './characters.js';
import { buildLevel, makeSky, glowTexture } from './world.js';
import { Boss, BOSSES } from './boss.js';
import { THEMES, WORLD_THEMES, LEVELS_PER_WORLD, TOTAL_LEVELS, worldOf, levelInWorld, isBossLevel, themeFor } from './themes.js';
import * as SAVE from './progress.js';

const V3 = THREE.Vector3;
const $ = (id) => document.getElementById(id);
const BASE = '/game/assets/';
const params = new URLSearchParams(location.search);

// ---------------- quality ----------------
const isTouch = matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;
let isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) || (isTouch && Math.min(screen.width, screen.height) < 900);
if (params.get('q') === 'low') isMobile = true;
if (params.get('q') === 'high') isMobile = false;
const Q = { low: isMobile, shadows: !isMobile, reflections: !isMobile, pixelRatio: Math.min(devicePixelRatio || 1, isMobile ? 1.25 : 2), bloom: isMobile ? 0.65 : 0.95 };
if (isTouch) document.body.classList.add('touch');

// ---------------- 9:16 stage ----------------
const stage = $('stage');
const SW = () => Math.max(1, stage.clientWidth), SH = () => Math.max(1, stage.clientHeight);
if (localStorage.getItem('lsbh_fill') === '1' && !isTouch) document.body.classList.add('fill');

// ---------------- renderer ----------------
const renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: 'high-performance', preserveDrawingBuffer: params.has('shot') });
renderer.setPixelRatio(Q.pixelRatio); renderer.setSize(SW(), SH());
renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = Q.shadows; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
$('app').appendChild(renderer.domElement);
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x160826, 0.016);
const camera = new THREE.PerspectiveCamera(70, SW() / SH(), 0.1, isMobile ? 130 : 190);
const rt = new THREE.WebGLRenderTarget(SW() * Q.pixelRatio, SH() * Q.pixelRatio, { type: THREE.HalfFloatType, samples: Q.low ? 0 : 4 });
const composer = new EffectComposer(renderer, rt); composer.setPixelRatio(Q.pixelRatio);
composer.addPass(new RenderPass(scene, camera));
const bloomScale = Q.low ? 0.5 : 1;
const bloom = new UnrealBloomPass(new THREE.Vector2(SW() * bloomScale, SH() * bloomScale), Q.bloom, 0.5, 0.72);
composer.addPass(bloom); composer.addPass(new OutputPass());
const hemi = new THREE.HemisphereLight(0x9a7cff, 0x1a0620, 0.75); scene.add(hemi);
const moon = new THREE.DirectionalLight(0xc8b8ff, 1.3); moon.position.set(12, 25, 10); moon.castShadow = Q.shadows;
moon.shadow.mapSize.set(2048, 2048); Object.assign(moon.shadow.camera, { left: -22, right: 22, top: 22, bottom: -22, near: 1, far: 80 }); moon.shadow.bias = -0.0005;
scene.add(moon, moon.target);
const keyLight = new THREE.PointLight(0xffb0e8, 7, 7, 2); scene.add(keyLight);
const pmrem = new THREE.PMREMGenerator(renderer);

// ---------------- assets ----------------
const TL = new THREE.TextureLoader();
const loadTex = (p) => new Promise(res => TL.load(BASE + p, t => { t.colorSpace = THREE.SRGBColorSpace; res(t); }, undefined, () => res(null)));
const TEX = {};
let STORY = null;
const assetsReady = Promise.all([
  ...[['sky', 'sky/sky_nebula_equirect_2048x1024.webp'], ['lens', 'textures/tex_galaxy_lens_512.webp'], ['asphalt', 'textures/tex_wet_asphalt_neon_1024.webp'], ['rubber', 'textures/tex_rubber_playground_1024.webp'], ['metal', 'textures/tex_painted_neon_metal_1024.webp'], ['brick', 'textures/tex_graffiti_brick_1024.webp'], ['wisp', 'sprites/sprite_static_wisp_512.png'], ['orb', 'sprites/sprite_shadow_orb_512.png']]
    .map(([k, p]) => loadTex(p).then(t => { if (t) TEX[k] = t; })),
  fetch('/game/story.json').then(r => r.ok ? r.json() : null).then(j => { STORY = j; }).catch(() => {}),
]).then(() => { if (TEX.lens) setLensTexture(TEX.lens); $('loadMsg').textContent = ''; });
const story = () => STORY || { worlds: Array.from({ length: 9 }, (_, i) => ({ name: THEMES[WORLD_THEMES[i]].name, lessons: ['…'], preBoss: '…', postBoss: '…', intro: '' })), reveal: ['TO BE CONTINUED…'], rewards: [], catMissions: { kittens: 'Find {n} lost kittens', notes: 'Collect {n} music notes', crowns: 'Find {n} hidden crowns' }, level1Encounter: { before: '…', after: '…' } };

// ---------------- characters ----------------
const lil = makeLilSynn(); scene.add(lil.root);
const cat = makeCat(); scene.add(cat.root);
const girl = makeGirl(); scene.add(girl.root);
const shadow = makeShadowMan(); scene.add(shadow.root);
const MODELS = BASE + 'models/';
tryGLB(lil, MODELS + 'lil-synn.glb', 1.85); tryGLB(girl, MODELS + 'girl.glb', 1.7); tryGLB(shadow, MODELS + 'shadow-man.glb', 2.3); tryGLB(cat, MODELS + 'cat.glb', 0.7);

// ---------------- audio ----------------
const AU = { muted: localStorage.getItem('lsbh_muted') === '1', el: null, ctx: null, cur: '' };
const TRACKS = { a: '/assets/other/Oblivion_out.mp3', b: '/assets/other/Ties Remain2.mp3', boss: '/assets/other/Before(1).mp3' };
function music(which) {
  const src = TRACKS[which]; if (!src || AU.cur === src) { if (AU.el && AU.el.paused && !AU.muted) AU.el.play().catch(() => {}); return; }
  if (!AU.el) { AU.el = new Audio(); AU.el.loop = true; AU.el.preload = 'auto'; AU.el.volume = 0.5; }
  AU.cur = src; AU.el.src = encodeURI(src); AU.el.muted = AU.muted; AU.el.play().catch(() => {});
}
function sfx(type) {
  if (AU.muted) return;
  try {
    if (!AU.ctx) AU.ctx = new (window.AudioContext || window.webkitAudioContext)();
    const ctx = AU.ctx, t = ctx.currentTime, o = ctx.createOscillator(), g = ctx.createGain();
    const P = { jump: ['square', 320, 520, 0.12, 0.05], djump: ['square', 420, 760, 0.14, 0.05], heart: ['triangle', 880, 1760, 0.22, 0.09], dash: ['sawtooth', 200, 80, 0.18, 0.05], hurt: ['sawtooth', 220, 60, 0.3, 0.09], crack: ['square', 900, 200, 0.2, 0.08], stomp: ['square', 160, 640, 0.15, 0.07], boss: ['sawtooth', 90, 40, 0.6, 0.12], hit: ['square', 600, 120, 0.35, 0.1], orb: ['sine', 300, 140, 0.25, 0.04], win: ['triangle', 520, 1040, 0.8, 0.08], meow: ['triangle', 700, 1100, 0.25, 0.07], gate: ['sine', 200, 600, 0.5, 0.08], pack: ['sine', 500, 1000, 0.3, 0.08] }[type];
    if (!P) return;
    o.type = P[0]; o.frequency.setValueAtTime(P[1], t); o.frequency.exponentialRampToValueAtTime(P[2], t + P[3]);
    g.gain.setValueAtTime(P[4], t); g.gain.exponentialRampToValueAtTime(0.0001, t + P[3]);
    o.connect(g).connect(ctx.destination); o.start(t); o.stop(t + P[3] + 0.02);
  } catch (e) {}
}
function setMuted(m) {
  AU.muted = m; localStorage.setItem('lsbh_muted', m ? '1' : '0'); if (AU.el) AU.el.muted = m;
  $('btnMute').textContent = m ? '♪̸' : '♪'; $('btnMute').style.opacity = m ? 0.5 : 1; $('btnMute2').textContent = m ? 'UNMUTE MUSIC' : 'MUTE MUSIC';
}
setMuted(AU.muted);

// ---------------- input ----------------
const keys = new Set();
const inp = { jump: 0, dash: 0, stick: new THREE.Vector2() };
addEventListener('keydown', e => {
  if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) e.preventDefault();
  if (e.repeat) return; keys.add(e.code);
  if (e.code === 'Space') inp.jump = 0.15;
  if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') inp.dash = 0.12;
  if (e.code === 'Escape' || e.code === 'KeyP') togglePause();
  if (e.code === 'KeyM') setMuted(!AU.muted);
  if (e.code === 'KeyF') toggleFullscreen();
});
addEventListener('keyup', e => keys.delete(e.code));
addEventListener('blur', () => { keys.clear(); if (G.state === 'play') togglePause(true); });
const cam = { yaw: 0, pitch: 0.32, dist: 6.5, target: new V3(), shake: 0 };
const drag = { id: null, x: 0, y: 0 }, stick = { id: null, ox: 0, oy: 0 };
const cv = renderer.domElement;
cv.addEventListener('pointerdown', e => {
  const rc = stage.getBoundingClientRect();
  if (e.pointerType !== 'mouse' && e.clientX - rc.left < rc.width * 0.5 && e.clientY - rc.top > rc.height * 0.35 && stick.id === null) {
    stick.id = e.pointerId; stick.ox = e.clientX; stick.oy = e.clientY;
    const b = $('stickBase'); b.style.left = (e.clientX - rc.left - 60) + 'px'; b.style.top = (e.clientY - rc.top - 60) + 'px'; b.style.bottom = 'auto'; b.style.opacity = 1;
  } else if (drag.id === null) { drag.id = e.pointerId; drag.x = e.clientX; drag.y = e.clientY; }
  cv.setPointerCapture?.(e.pointerId);
});
cv.addEventListener('pointermove', e => {
  if (e.pointerId === stick.id) {
    let dx = e.clientX - stick.ox, dy = e.clientY - stick.oy; const l = Math.hypot(dx, dy), m = 50;
    if (l > m) { dx *= m / l; dy *= m / l; }
    inp.stick.set(dx / m, -dy / m); $('stickKnob').style.transform = `translate(${dx}px, ${dy}px)`;
  } else if (e.pointerId === drag.id) {
    const s = e.pointerType === 'mouse' ? 0.005 : 0.008;
    cam.yaw -= (e.clientX - drag.x) * s; cam.pitch = THREE.MathUtils.clamp(cam.pitch + (e.clientY - drag.y) * s, -0.15, 1.2);
    drag.x = e.clientX; drag.y = e.clientY;
  }
});
const endPtr = e => {
  if (e.pointerId === stick.id) { stick.id = null; inp.stick.set(0, 0); $('stickKnob').style.transform = ''; $('stickBase').style.opacity = 0.6; }
  if (e.pointerId === drag.id) drag.id = null;
};
cv.addEventListener('pointerup', endPtr); cv.addEventListener('pointercancel', endPtr);
cv.addEventListener('wheel', e => { cam.dist = THREE.MathUtils.clamp(cam.dist + e.deltaY * 0.005, 3.5, 11); }, { passive: true });
const tbtn = (id, fn) => $(id).addEventListener('pointerdown', e => { e.preventDefault(); e.stopPropagation(); fn(); });
tbtn('tJump', () => inp.jump = 0.15); tbtn('tDash', () => inp.dash = 0.12);

function toggleFullscreen() {
  const el = document.documentElement; const fsEl = document.fullscreenElement || document.webkitFullscreenElement;
  const req = el.requestFullscreen || el.webkitRequestFullscreen;
  if (fsEl) { (document.exitFullscreen || document.webkitExitFullscreen).call(document); return; }
  if (req) { try { const r = req.call(el, { navigationUI: 'hide' }); if (r && r.catch) r.catch(() => document.body.classList.toggle('fill')); } catch (e) { document.body.classList.toggle('fill'); } }
  else { document.body.classList.toggle('fill'); setTimeout(() => scrollTo(0, 1), 50); } // iOS Safari: fill the viewport
}
$('btnFs').onclick = toggleFullscreen;
$('btnFill').onclick = () => { const on = document.body.classList.toggle('fill'); localStorage.setItem('lsbh_fill', on ? '1' : '0'); };

// ---------------- UI helpers ----------------
let toastT = 0;
function toast(msg, dur = 2) { const t = $('toast'); t.textContent = msg; t.classList.add('on'); toastT = dur; }
const show = (id, on = true) => $(id).classList.toggle('show', on);
const hideCards = () => ['intro', 'select', 'levelCard', 'storyCard', 'pause', 'dead', 'complete', 'end'].forEach(id => show(id, false));
(() => { // game-art on cards
  const img = new Image(); img.onload = () => { const h = document.querySelector('#intro h1'); const logo = document.createElement('img'); logo.src = img.src; logo.alt = 'LIL SYNN: Broken Hearts'; logo.style.cssText = 'width:min(560px,86cqw);filter:drop-shadow(0 0 18px rgba(255,47,168,.5))'; h.replaceWith(logo); document.querySelector('#intro .kicker').style.display = 'none'; };
  img.src = BASE + 'ui/title_logo_1024x512.png';
  const bg = (id, f) => { const i = new Image(); i.onload = () => { $(id).style.background = `linear-gradient(rgba(6,2,14,.55), rgba(6,2,14,.85)), url("${i.src}") center/cover`; }; i.src = BASE + 'ui/' + f; };
  bg('intro', 'card_intro_1376x768.webp'); bg('end', 'card_win_1376x768.webp');
  document.querySelector('#hearts .bh').innerHTML = `<img src="${BASE}ui/icon_broken_heart_256.png" alt="" onerror="this.replaceWith('💔')" style="width:28px;height:28px;vertical-align:middle">`;
})();

// ---------------- cracking hearts HUD ----------------
const CRACK_SVG = `<svg class="crack" viewBox="0 0 100 100"><polyline points="52,14 40,34 58,50 42,70 50,90" fill="none" stroke="#fff" stroke-width="7" stroke-linejoin="round" opacity=".95"/><polyline points="58,50 74,58" fill="none" stroke="#fff" stroke-width="5"/></svg>`;
let hudHearts = [];
function buildHealthHUD() {
  const el = $('health'); el.innerHTML = ''; hudHearts = [];
  for (let i = 0; i < P.maxHp / 2; i++) {
    const d = document.createElement('div'); d.className = 'hh';
    const f = `${BASE}ui/hud_heart_full_128.png`, e = `${BASE}ui/hud_heart_empty_128.png`;
    d.innerHTML = `<img class="e" src="${e}" alt=""><img class="f" src="${f}" alt="">${CRACK_SVG}<img class="sl" src="${f}" alt=""><img class="sr" src="${f}" alt="">`;
    el.appendChild(d); hudHearts.push({ d, v: -1 });
  }
  drawHealth(true);
}
function drawHealth(silent) {
  hudHearts.forEach((h, i) => {
    const v = THREE.MathUtils.clamp(P.hp - i * 2, 0, 2);
    if (v === h.v) return;
    const prev = h.v; h.v = v; const c = h.d.classList;
    c.remove('cracked', 'broken', 'mend');
    if (!silent) { void h.d.offsetWidth; }
    if (v === 1) c.add('cracked');
    if (v === 0) { c.add('broken'); if (!silent && prev > 0) { c.remove('shatter'); void h.d.offsetWidth; c.add('shatter'); } }
    if (!silent && prev >= 0 && v > prev) c.add('mend');
  });
}

// ---------------- state ----------------
let SAVEDATA = SAVE.load();
if (params.get('dev') === '1') SAVEDATA.unlocked = TOTAL_LEVELS;
const G = { state: 'title', time: 0, levelTime: 0, cine: 0, n: 1, cpIndex: -1, after: null };
const P = { pos: new V3(0, 0, 8), vel: new V3(), r: 0.35, h: 1.8, onGround: false, ground: null, coyote: 0, jumps: 0, face: Math.PI, hp: 10, maxHp: 10, inv: 0, dashT: 0, dashCd: 0, airDash: true, dashDir: new V3(), hang: null, regrab: 0, climb: null, hearts: 0, lastSafe: new V3(0, 0, 8), knock: 0, groundY: 0 };
let L = null, boss = null, sky = null;
const W = { t: 0, phase: 0 };

// ---------------- level loading ----------------
function applyTheme(theme) {
  scene.fog.color.set(theme.fog[0]); scene.fog.density = theme.fog[1] * (Q.low ? 1.15 : 1);
  hemi.color.set(theme.hemi[0]); hemi.groundColor.set(theme.hemi[1]); hemi.intensity = theme.hemi[2];
  moon.color.set(theme.moon[0]); moon.intensity = theme.moon[1]; renderer.toneMappingExposure = theme.exposure;
  if (sky) { scene.remove(sky); sky.geometry.dispose(); sky.material.dispose(); }
  sky = makeSky(theme, TEX.sky); sky.scale.setScalar(isMobile ? 0.3 : 0.45); scene.add(sky);
  const envScene = new THREE.Scene(); const s2 = makeSky(theme, TEX.sky); s2.scale.setScalar(0.1); envScene.add(s2);
  if (scene.environment) scene.environment.dispose();
  scene.environment = pmrem.fromScene(envScene, 0.02).texture; s2.geometry.dispose(); s2.material.dispose();
}
function loadLevel(n) {
  n = THREE.MathUtils.clamp(n | 0, 1, TOTAL_LEVELS);
  if (L) L.dispose(); if (boss) { boss.dispose(); boss = null; }
  parts.splice(0).forEach(p => scene.remove(p.s)); pings.splice(0).forEach(p => scene.remove(p.s));
  G.n = n; const theme = themeFor(n);
  applyTheme(theme);
  L = buildLevel({ scene, Q, renderer, n, theme, TEX, story: story() });
  // player
  P.maxHp = SAVE.maxHearts(SAVEDATA) * 2; P.hp = P.maxHp; buildHealthHUD();
  P.pos.copy(L.start); P.vel.set(0, 0, 0); P.hang = P.climb = null; P.hearts = 0; P.face = Math.PI; P.inv = 0; P.lastSafe.copy(L.start); P.groundY = 0;
  G.cpIndex = -1; G.levelTime = 0; L.keysHeld = 0; cam.yaw = 0;
  cat.root.position.set(1.5, 0, 9.5);
  $('heartCount').textContent = 0; $('heartTotal').textContent = L.hearts.length;
  $('lvlTag').textContent = `${worldOf(n) + 1}-${levelInWorld(n)} · ${theme.name.toUpperCase()}`;
  $('boss').classList.add('hidden'); $('keys').textContent = '';
  updateMissionHUD();
  // girl, Shadow Man and boss
  shadow.root.visible = !!L.arena; girl.root.visible = !!L.arena; shadow.root.scale.setScalar(1.35);
  shadow.shadow && shadow.shadow.emissive.set(0x0a0016);
  if (L.arena) {
    girl.root.position.copy(L.arena.cagePos); girl.root.rotation.set(0, 0, 0);
    const cfg = n === 1 ? BOSSES.prologue : BOSSES[worldOf(n)];
    boss = new Boss(scene, shadow, cfg, L.arena, bossCtx);
    $('bossName').textContent = n === 1 ? 'SHADOW MAN' : (story().worlds[worldOf(n)].bossName || 'SHADOW MAN');
  }
  music(L.arena && n !== 1 ? (theme.music || 'a') : (theme.music || 'a'));
}
function updateMissionHUD() {
  if (!L) return; const m = L.mission; const tpl = story().catMissions[m.type] || '{n}';
  $('mission').textContent = m.n ? (m.got >= m.n ? '🐈‍⬛ Cat mission complete ✓' : `🐈‍⬛ ${tpl.replace('{n}', m.n)}: ${m.got}/${m.n}`) : '';
}
function lessonFor(n) {
  const S = story(); if (n === 1) return S.level1Encounter?.before && S.prologue ? S.worlds[0].intro : '';
  const w = S.worlds[worldOf(n)]; const k = levelInWorld(n);
  if (k === 1) return w.intro || w.lessons[0];
  if (isBossLevel(n)) return w.preBoss;
  return w.lessons[(k - 2) % w.lessons.length];
}
function showLevelCard(n) {
  hideCards(); G.state = 'levelcard';
  const S = story(); const w = worldOf(n); const theme = themeFor(n);
  $('lcWorld').textContent = `WORLD ${w + 1} · ${theme.name.toUpperCase()}`;
  $('lcTitle').textContent = isBossLevel(n) ? `LEVEL ${n} · BOSS` : n === 1 ? 'LEVEL 1 · PROLOGUE' : `LEVEL ${n}`;
  $('lcLine').textContent = n === 1 ? (S.worlds[0].intro || '') : lessonFor(n);
  const m = L.mission; $('lcMission').textContent = m.n ? '🐈‍⬛ Side mission: ' + (S.catMissions[m.type] || '').replace('{n}', m.n) : '';
  show('levelCard');
}
function startLevel(n) { loadLevel(n); showLevelCard(n); SAVEDATA.last = n; SAVE.save(SAVEDATA); }

// ---------------- flow buttons ----------------
$('btnPlay').onclick = () => { assetsReady.then(() => { startLevel(Math.min(SAVEDATA.last || 1, SAVEDATA.unlocked)); }); sfx('heart'); music('a'); };
$('btnSelect').onclick = () => openSelect();
$('btnGo').onclick = () => { hideCards(); $('hud').classList.remove('hidden'); if (isTouch) $('touch').classList.remove('hidden'); G.state = 'play'; cam.yaw = 0; if (AU.el && AU.el.paused) AU.el.play().catch(() => {}); };
$('btnPause').onclick = () => togglePause();
$('btnResume').onclick = () => togglePause(false);
$('btnMute').onclick = () => setMuted(!AU.muted);
$('btnMute2').onclick = () => setMuted(!AU.muted);
$('btnRestart').onclick = () => { hideCards(); startLevel(G.n); };
$('btnToSelect').onclick = () => openSelect();
$('btnRetry').onclick = () => respawn();
$('btnNext').onclick = () => { if (G.n >= TOTAL_LEVELS) { openSelect(); return; } startLevel(G.n + 1); };
$('btnCpSelect').onclick = () => openSelect();
$('btnAgain').onclick = () => openSelect();
$('btnSelBack').onclick = () => { hideCards(); if (L && (G.state === 'paused')) { show('pause'); return; } show('intro'); G.state = 'title'; };
$('btnStory').onclick = () => { const f = G.after; G.after = null; show('storyCard', false); if (f) f(); };
function storyCard(kicker, title, who, line, btn, after) {
  $('scKicker').textContent = kicker; $('scTitle').textContent = title; $('scWho').textContent = who; $('scLine').textContent = line; $('btnStory').textContent = btn || 'CONTINUE';
  G.after = after; show('storyCard');
}
function togglePause(force) {
  if (G.state !== 'play' && G.state !== 'paused') return;
  const p = force !== undefined ? force : G.state === 'play';
  G.state = p ? 'paused' : 'play'; show('pause', p); show('select', false);
  if (!p) { $('hud').classList.remove('hidden'); if (isTouch) $('touch').classList.remove('hidden'); }
  if (AU.el) { if (p) AU.el.pause(); else if (!AU.muted) AU.el.play().catch(() => {}); }
}

// ---------------- level select ----------------
let selWorld = 0;
function openSelect() {
  const prevState = G.state; hideCards(); show('select'); if (prevState !== 'paused') G.state = 'select';
  $('hud').classList.add('hidden'); $('touch').classList.add('hidden');
  selWorld = worldOf(Math.min(SAVEDATA.unlocked, TOTAL_LEVELS)); drawSelect();
}
function drawSelect() {
  const tabs = $('worldTabs'); tabs.innerHTML = '';
  for (let w = 0; w < 9; w++) {
    const b = document.createElement('button'); b.textContent = `W${w + 1}`; const first = w * LEVELS_PER_WORLD + 1;
    if (w === selWorld) b.classList.add('on'); if (first > SAVEDATA.unlocked) b.classList.add('locked');
    b.onclick = () => { selWorld = w; drawSelect(); }; tabs.appendChild(b);
  }
  $('worldName').textContent = `WORLD ${selWorld + 1} · ${THEMES[WORLD_THEMES[selWorld]].name.toUpperCase()}`;
  const grid = $('levelGrid'); grid.innerHTML = '';
  for (let k = 1; k <= LEVELS_PER_WORLD; k++) {
    const n = selWorld * LEVELS_PER_WORLD + k; const b = document.createElement('button'); const rec = SAVEDATA.levels[n];
    b.innerHTML = `${n}${rec ? `<span class="m">${rec.hearts >= rec.total ? '♥' : ''}${rec.cat ? '🐾' : ''}</span>` : ''}`;
    if (isBossLevel(n)) b.classList.add('boss'); if (rec && rec.done) b.classList.add('done');
    b.disabled = n > SAVEDATA.unlocked; b.title = rec ? `${rec.hearts}/${rec.total} hearts${rec.cat ? ' · cat mission ✓' : ''}` : '';
    b.onclick = () => { hideCards(); startLevel(n); }; grid.appendChild(b);
  }
  const S = story(); $('tokens').textContent = `🐾 Cat tokens: ${SAVEDATA.tokens} · max hearts: ${SAVE.maxHearts(SAVEDATA)}`;
  $('rewardList').innerHTML = (S.rewards || []).map(r => `${SAVEDATA.rewards.includes(r.id) ? '✓' : '○'} ${r.tokens} 🐾 → ${r.label}`).join('<br>');
}

// ---------------- particles ----------------
const parts = []; const pMatCache = {};
function burst(pos, color, n = 14, spd = 4, size = 0.35, life = 0.8) {
  if (Q.low) n = Math.ceil(n / 2);
  for (let i = 0; i < n; i++) {
    const c = color === 'rainbow' ? [0xff2fa8, 0x29e0ff, 0xffd23a, 0x9a4dff][i % 4] : color;
    const m = pMatCache[c] || (pMatCache[c] = new THREE.SpriteMaterial({ map: glowTexture(), color: c, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
    const s = new THREE.Sprite(m.clone()); s.position.copy(pos); s.scale.setScalar(size); scene.add(s);
    const v = new V3(Math.random() - 0.5, Math.random() * 0.8 + 0.2, Math.random() - 0.5).normalize().multiplyScalar(spd * (0.4 + Math.random() * 0.8));
    parts.push({ s, v, life, max: life, size });
  }
}
function updateParts(dt) {
  for (let i = parts.length - 1; i >= 0; i--) {
    const p = parts[i]; p.life -= dt;
    if (p.life <= 0) { scene.remove(p.s); p.s.material.dispose(); parts.splice(i, 1); continue; }
    p.v.y -= 4 * dt; p.s.position.addScaledVector(p.v, dt); const k = p.life / p.max; p.s.material.opacity = k; p.s.scale.setScalar(p.size * (0.5 + k));
  }
}

// ---------------- physics ----------------
const GRAV = -26, RUN = 7.2, JUMP = 9.6, DJUMP = 8.6, DASH = 19, HAND = 2.0;
function overlaps(c, pos) {
  return !c.disabled && pos.x - P.r < c.max.x && pos.x + P.r > c.min.x && pos.z - P.r < c.max.z && pos.z + P.r > c.min.z && pos.y < c.max.y - 0.001 && pos.y + P.h > c.min.y;
}
function moveDir() {
  let ix = 0, iz = 0;
  if (keys.has('KeyW') || keys.has('ArrowUp')) iz += 1; if (keys.has('KeyS') || keys.has('ArrowDown')) iz -= 1;
  if (keys.has('KeyA') || keys.has('ArrowLeft')) ix -= 1; if (keys.has('KeyD') || keys.has('ArrowRight')) ix += 1;
  ix += inp.stick.x; iz += inp.stick.y;
  const fwd = new V3(-Math.sin(cam.yaw), 0, -Math.cos(cam.yaw)), right = new V3(Math.cos(cam.yaw), 0, -Math.sin(cam.yaw));
  const d = fwd.multiplyScalar(iz).add(right.multiplyScalar(ix)); if (d.length() > 1) d.normalize(); return d;
}
function tryLedge(c, d, nx, nz) {
  if (P.onGround || P.climb || c.mover || c.gate) return false;
  const top = c.max.y, diff = top - P.pos.y; if (diff < 0.45 || diff > 1.95) return false;
  if (d.x * nx + d.z * nz < 0.4) return false;
  const to = new V3(THREE.MathUtils.clamp(P.pos.x + nx * 0.6, c.min.x + P.r, c.max.x - P.r), top, THREE.MathUtils.clamp(P.pos.z + nz * 0.6, c.min.z + P.r, c.max.z - P.r));
  if (L.colliders.some(o => o !== c && overlaps(o, to))) return false;
  P.climb = { from: P.pos.clone(), to, t: 0 }; P.vel.set(0, 0, 0); return true;
}
function physics(dt, d) {
  if (P.ground && P.ground.mover) P.pos.add(P.ground.mover.delta);
  const steps = Math.max(1, Math.ceil(dt / (1 / 120))), h = dt / steps; const wasGround = P.onGround;
  const solidGround = L.theme.ground !== 'void';
  P.onGround = false; P.ground = null;
  for (let s = 0; s < steps; s++) {
    if (P.dashT <= 0) P.vel.y += GRAV * h; P.vel.y = Math.max(P.vel.y, -30);
    P.pos.x += P.vel.x * h;
    for (const c of L.colliders) if (overlaps(c, P.pos)) {
      if (c.max.y - P.pos.y < 0.32 && (wasGround || P.onGround)) { P.pos.y = c.max.y; continue; }
      const n = P.vel.x > 0 ? 1 : -1; if (tryLedge(c, d, n, 0)) return;
      P.pos.x = n > 0 ? c.min.x - P.r - 1e-3 : c.max.x + P.r + 1e-3; P.vel.x = 0;
    }
    P.pos.z += P.vel.z * h;
    for (const c of L.colliders) if (overlaps(c, P.pos)) {
      if (c.max.y - P.pos.y < 0.32 && (wasGround || P.onGround)) { P.pos.y = c.max.y; continue; }
      const n = P.vel.z > 0 ? 1 : -1; if (tryLedge(c, d, 0, n)) return;
      P.pos.z = n > 0 ? c.min.z - P.r - 1e-3 : c.max.z + P.r + 1e-3; P.vel.z = 0;
    }
    P.pos.y += P.vel.y * h;
    for (const c of L.colliders) if (overlaps(c, P.pos)) {
      if (P.vel.y <= 0 || P.pos.y > c.max.y - 0.45) { P.pos.y = c.max.y; P.vel.y = Math.min(0, P.vel.y); P.onGround = true; P.ground = c; }
      else { P.pos.y = c.min.y - P.h - 1e-3; P.vel.y = Math.min(0, P.vel.y); }
    }
    for (const r of L.ramps) {
      if (P.pos.x < r.minX || P.pos.x > r.maxX) continue; const k = (P.pos.z - r.z0) / (r.z1 - r.z0); if (k < 0 || k > 1) continue;
      const sy = r.y0 + (r.y1 - r.y0) * k;
      if (P.pos.y <= sy + 0.06 && P.pos.y > sy - 0.7 && P.vel.y <= 0.5) { P.pos.y = sy; P.vel.y = 0; P.onGround = true; P.ground = { ramp: r }; P.vel.z -= 14 * h; }
    }
    if (solidGround && P.pos.y <= 0) { P.pos.y = 0; P.vel.y = 0; P.onGround = true; }
  }
}
function nearestOnSeg(a, b, p) { const ab = b.clone().sub(a); const t = THREE.MathUtils.clamp(p.clone().sub(a).dot(ab) / ab.lengthSq(), 0, 1); return { t, pt: a.clone().addScaledVector(ab, t) }; }

function hurt(from, amt = 1) {
  if (P.inv > 0 || G.state !== 'play') return;
  P.hp = Math.max(0, P.hp - amt); P.inv = 1.3; drawHealth(); sfx(P.hp % 2 ? 'crack' : 'hurt'); cam.shake = 0.4;
  const away = P.pos.clone().sub(from).setY(0); if (away.lengthSq() < 1e-4) away.set(0, 0, 1); away.normalize();
  P.vel.set(away.x * 9, 6.5, away.z * 9); P.knock = 0.3; P.hang = null; P.climb = null; P.dashT = 0;
  burst(P.pos.clone().setY(P.pos.y + 1), 0xff2fa8, 10, 3);
  if (P.hp <= 0) { G.state = 'dead'; setTimeout(() => show('dead'), 700); }
}
function heal(amt) { const before = P.hp; P.hp = Math.min(P.maxHp, P.hp + amt); if (P.hp > before) drawHealth(); return P.hp > before; }
function respawnPoint() { return G.cpIndex >= 0 ? L.checkpoints[G.cpIndex].pos : L.start; }
function respawn() {
  show('dead', false); P.pos.copy(respawnPoint()); P.vel.set(0, 0, 0); P.hp = P.maxHp; P.inv = 2; drawHealth(true); buildHealthHUD();
  P.hang = P.climb = null; if (boss && boss.active) boss.resetAfterDeath(); G.state = 'play';
}
function fellOff() { // void worlds: lose a heart-half and return to safe ground
  const s = P.lastSafe.clone(); P.inv = 0; hurt(P.pos.clone().add(new V3(0, 0, 1)), 1); if (P.hp > 0) { P.pos.copy(s).add(new V3(0, 0.1, 0)); P.vel.set(0, 0, 0); P.knock = 0; toast('Careful of the drop!', 1.2); }
}

// ---------------- player update ----------------
function updatePlayer(dt) {
  P.inv = Math.max(0, P.inv - dt); P.dashCd -= dt; P.regrab -= dt; P.knock -= dt; inp.jump -= dt; inp.dash -= dt;
  const d = moveDir(); let mode = 'run';
  if (P.climb) {
    P.climb.t += dt / 0.32; const k = Math.min(P.climb.t, 1); const ky = Math.min(1, k * 1.6), kx = Math.max(0, (k - 0.35) / 0.65);
    P.pos.set(THREE.MathUtils.lerp(P.climb.from.x, P.climb.to.x, kx), THREE.MathUtils.lerp(P.climb.from.y, P.climb.to.y, ky), THREE.MathUtils.lerp(P.climb.from.z, P.climb.to.z, kx));
    if (k >= 1) { P.climb = null; P.onGround = true; P.jumps = 0; P.airDash = true; }
    animateLil(dt, 'climb', 0); return;
  }
  if (P.hang) {
    const { bar } = P.hang; const ab = bar.b.clone().sub(bar.a); const len = ab.length(); ab.normalize();
    P.hang.t = THREE.MathUtils.clamp(P.hang.t + d.dot(ab) * 3.4 * dt / len, -0.02, 1.02);
    const pt = bar.a.clone().addScaledVector(ab, P.hang.t * len); P.pos.set(pt.x, pt.y - HAND, pt.z); P.vel.set(0, 0, 0);
    if (d.lengthSq() > 0.01) P.face = Math.atan2(d.x, d.z);
    const off = P.hang.t < 0 || P.hang.t > 1;
    if (inp.jump > 0 || off || inp.dash > 0) {
      const jumped = inp.jump > 0; inp.jump = 0; const ht = P.hang.t; P.hang = null; P.regrab = 0.4; P.jumps = 1;
      if (jumped) { P.vel.set(d.x * RUN, JUMP * 0.85, d.z * RUN); sfx('jump'); }
      if (off && !jumped) { const sg = ht > 1 ? 3 : -3; P.vel.set(ab.x * sg, 2, ab.z * sg); }
    }
    animateLil(dt, 'hang', d.length() * 5); return;
  }
  const ctrl = P.knock > 0 ? 0 : (P.onGround ? 16 : 7);
  if (P.dashT > 0) {
    P.dashT -= dt; P.vel.x = P.dashDir.x * DASH; P.vel.z = P.dashDir.z * DASH; P.vel.y = 0; mode = 'dash';
    if (Math.random() < 0.7) burst(P.pos.clone().setY(P.pos.y + 0.9), SAVE.trailColor(SAVEDATA), 1, 0.5, 0.5, 0.35);
  } else { const k = 1 - Math.exp(-ctrl * dt); P.vel.x += (d.x * RUN - P.vel.x) * k; P.vel.z += (d.z * RUN - P.vel.z) * k; }
  if (P.onGround) { P.coyote = 0.1; P.jumps = 0; P.airDash = true; } else P.coyote -= dt;
  if (inp.jump > 0 && P.knock <= 0) {
    if (P.coyote > 0) { P.vel.y = JUMP; P.jumps = 1; P.coyote = 0; inp.jump = 0; sfx('jump'); P.dashT = 0; }
    else if (P.jumps < 2) { P.vel.y = DJUMP; P.jumps = 2; inp.jump = 0; sfx('djump'); burst(P.pos.clone(), 0x29e0ff, 8, 2.5, 0.3, 0.4); P.dashT = 0; }
  }
  if (inp.dash > 0 && P.dashCd <= 0 && (P.onGround || P.airDash)) {
    inp.dash = 0; P.dashT = 0.2; P.dashCd = 0.55; if (!P.onGround) P.airDash = false;
    P.dashDir.copy(d.lengthSq() > 0.01 ? d.clone().normalize() : new V3(Math.sin(P.face), 0, Math.cos(P.face))); sfx('dash'); cam.shake = Math.max(cam.shake, 0.08);
  }
  physics(dt, d);
  if (P.climb) { animateLil(dt, 'climb', 0); return; }
  if (!P.onGround && P.regrab <= 0) {
    const hand = P.pos.clone(); hand.y += HAND;
    for (const bar of L.bars) { const { t, pt } = nearestOnSeg(bar.a, bar.b, hand); if (Math.hypot(pt.x - hand.x, pt.z - hand.z) < 0.75 && Math.abs(pt.y - hand.y) < 0.55 && t > 0.01 && t < 0.99) { P.hang = { bar, t }; P.dashT = 0; sfx('stomp'); break; } }
  }
  // hazards (shadow pools) & falling
  if (P.onGround && !P.ground) {
    const inPool = L.hazards.some(z => P.pos.x > z.minX && P.pos.x < z.maxX && P.pos.z > z.minZ && P.pos.z < z.maxZ);
    if (inPool) { const s = P.lastSafe.clone(); P.inv = 0; hurt(P.pos.clone().add(new V3(0, 0, 1))); P.pos.copy(s); P.vel.set(0, 0, 0); P.knock = 0; if (P.hp > 0) toast('The shadow pool bites! Use the platforms.', 1.6); }
    else P.lastSafe.copy(P.pos);
  } else if (P.onGround && !(P.ground.mover || P.ground.ramp)) P.lastSafe.copy(P.pos);
  if (P.pos.y < L.killY) fellOff();
  if (boss && boss.active && !boss.dead) { const A = L.arena; const off = P.pos.clone().sub(A.center).setY(0); const l = off.length(); if (l > A.radius) { off.multiplyScalar(A.radius / l); P.pos.x = A.center.x + off.x; P.pos.z = A.center.z + off.z; } }
  const hs = Math.hypot(P.vel.x, P.vel.z);
  if (hs > 0.3 && P.dashT <= 0) P.face = Math.atan2(P.vel.x, P.vel.z);
  if (P.dashT > 0) P.face = Math.atan2(P.dashDir.x, P.dashDir.z);
  if (!P.onGround && mode !== 'dash') mode = 'air'; if (P.knock > 0) mode = 'hurt';
  animateLil(dt, mode, P.onGround ? hs : 0);
}
function animateLil(dt, mode, speed) {
  lil.root.position.copy(P.pos);
  const cur = lil.root.rotation.y; let diff = P.face - cur; diff = Math.atan2(Math.sin(diff), Math.cos(diff)); lil.root.rotation.y = cur + diff * Math.min(1, dt * 14);
  lil.animate(G.time, dt, { mode, speed });
  lil.root.visible = P.inv > 0 && G.state === 'play' ? Math.floor(G.time * 16) % 2 === 0 : true;
}

// ---------------- world interactions ----------------
let pingT = 1.5, pingAlt = 0; const pings = [];
function updateWorld(dt) {
  const center = P.pos.clone(); center.y += 0.9; const t = G.time;
  for (const h of L.hearts) {
    if (h.taken) continue; h.obj.rotation.y += dt * 2; h.obj.position.y = h.base + Math.sin(t * 2.5 + h.base) * 0.15;
    if (h.obj.position.distanceTo(center) < 1.15) {
      h.taken = true; h.obj.visible = false; P.hearts++; $('heartCount').textContent = P.hearts; sfx('heart'); burst(h.obj.position, 0xff2fa8, 16, 4);
      if (P.hearts % 5 === 0 && heal(1)) toast(`${P.hearts} hearts gathered: a crack mends`, 1.8);
      else if (P.hearts === L.hearts.length) toast('Every broken heart found! 💖', 2.2);
    }
  }
  for (const p of L.packs) {
    if (p.taken) continue; p.obj.rotation.y += dt * 1.5; p.obj.position.y = p.base + Math.sin(t * 3) * 0.12;
    if (p.obj.position.distanceTo(center) < 1.15) { if (P.hp >= P.maxHp) continue; p.taken = true; p.obj.visible = false; heal(2); sfx('pack'); burst(p.obj.position, 0x2aff8a, 18, 4); toast('Heart mended +1', 1.2); }
  }
  for (const it of L.catItems) {
    if (it.taken) continue; it.obj.rotation.y += dt * 1.2; it.obj.position.y = it.base + 0.1 + Math.sin(t * 2 + it.base) * 0.08;
    const p = it.obj.position.clone(); p.y += 0.3;
    if (p.distanceTo(center) < 1.2) {
      it.taken = true; it.obj.visible = false; L.mission.got++; sfx('meow'); burst(p, 0x9bff3a, 14, 3); updateMissionHUD();
      toast(L.mission.got >= L.mission.n ? 'Cat mission complete! 🐾' : `The cat is pleased (${L.mission.got}/${L.mission.n})`, 1.8);
    }
  }
  for (const k of L.keys) {
    if (k.taken) continue; k.obj.rotation.y += dt * 2; k.obj.position.y = k.base + Math.sin(t * 3) * 0.1;
    if (k.obj.position.distanceTo(center) < 1.2) { k.taken = true; k.obj.visible = false; L.keysHeld++; sfx('heart'); toast('Key found. Find the gold gate.', 1.6); $('keys').textContent = `🔑 × ${L.keysHeld}`; }
  }
  for (const s of L.switches) {
    if (s.on) continue;
    if (P.onGround && Math.hypot(P.pos.x - s.pos.x, P.pos.z - s.pos.z) < 0.9 && Math.abs(P.pos.y - s.pos.y) < 0.4) {
      s.on = true; s.pad.material = s.pad.material.clone(); s.pad.material.color.set(0x2aff8a); s.pad.material.emissive.set(0x2aff8a); s.pad.position.y -= 0.06; sfx('gate');
      const left = L.switches.filter(o => o.gateId === s.gateId && !o.on).length; toast(left ? `Switch on. ${left} to go.` : 'All switches on. The gate opens!', 1.5);
    }
  }
  for (const g of L.gates) {
    if (g.open) continue;
    let open = false;
    if (g.kind === 'switch') open = L.switches.filter(s => s.gateId === g.id).every(s => s.on);
    else if (g.kind === 'arena') open = L.wisps.filter(w => w.arena === g.id).every(w => !w.alive);
    else if (g.kind === 'key') open = L.keysHeld > 0 && Math.abs(P.pos.z - g.z) < 3.5;
    if (open) { g.open = true; g.col.disabled = true; if (g.kind === 'key') { L.keysHeld--; $('keys').textContent = L.keysHeld ? `🔑 × ${L.keysHeld}` : ''; } if (g.label) g.label.visible = false; sfx('gate'); toast('Gate open!', 1.0); }
    else if (g.kind === 'key' && Math.abs(P.pos.z - g.z) < 3 && !g.told) { g.told = true; toast('Locked. There is a key somewhere up high.', 1.8); }
  }
  for (let i = 0; i < L.checkpoints.length; i++) {
    const c = L.checkpoints[i]; if (c.active || P.pos.z > c.z) continue;
    c.active = true; if (i > G.cpIndex) G.cpIndex = i;
    if (c.lamp) { c.lamp.material = c.lamp.material.clone(); c.lamp.material.emissive.set(0x2aff8a); c.lamp.material.emissiveIntensity = 3; sfx('pack'); toast('Checkpoint', 1); }
  }
  for (const w of L.wisps) {
    if (!w.alive) { if (w.dying > 0) { w.dying -= dt; w.obj.scale.setScalar(Math.max(0.01, w.dying * 2)); if (w.dying <= 0) w.obj.visible = false; } continue; }
    const a = t * w.speed + w.phase;
    w.obj.position.set(w.home.x + Math.cos(a) * w.r, w.home.y + Math.sin(t * 3 + w.phase) * 0.25, w.home.z + Math.sin(a) * w.r);
    w.core.rotation.x += dt * 2; w.core.rotation.y += dt * 3; w.spark.visible = Math.random() > 0.15;
    const dist = w.obj.position.distanceTo(center);
    const catDash = SAVEDATA.rewards.includes('catDash') && P.dashT > 0 && dist < 2.4;
    if ((dist < 0.95 || catDash) && G.state === 'play') {
      if (P.dashT > 0 || (P.vel.y < -0.5 && P.pos.y > w.obj.position.y - 0.35)) {
        w.alive = false; w.dying = 0.4; burst(w.obj.position, 0x9a4dff, 18, 5); sfx('stomp'); if (P.dashT <= 0) { P.vel.y = 10; P.jumps = 1; }
      } else hurt(w.obj.position, L.d > 0.7 ? 2 : 1);
    }
  }
  if (L.exit && G.state === 'play' && Math.hypot(P.pos.x - L.exit.pos.x, P.pos.z - L.exit.pos.z) < 1.8 && P.pos.y - L.exit.pos.y < 3) levelComplete();
  updateCat(dt);
}
function updateCat(dt) {
  const back = new V3(Math.sin(P.face), 0, Math.cos(P.face)).multiplyScalar(-1.5), side = new V3(Math.cos(P.face), 0, -Math.sin(P.face)).multiplyScalar(0.9);
  const goal = P.pos.clone().add(back).add(side); if (P.onGround && !P.hang) P.groundY = P.pos.y; goal.y = P.groundY;
  const cp = cat.root.position; const to = goal.clone().sub(cp); const dist = to.length();
  if (dist > 18) cp.copy(goal); else { const spd = THREE.MathUtils.clamp(dist * 3, 0, 10); if (dist > 0.4) cp.addScaledVector(to.normalize(), Math.min(spd * dt, dist)); }
  cp.y += (goal.y - cp.y) * Math.min(1, dt * 6);
  const nearest = (list) => { let n = null, nd = Infinity; for (const h of list) if (!h.taken) { const dd = h.obj.position.distanceTo(cp); if (dd < nd) { nd = dd; n = h; } } return n; };
  const nh = nearest(L.hearts), ni = nearest(L.catItems);
  const target = (pingAlt % 2 && ni) ? ni : (nh || ni);
  const moving = dist > 0.5;
  const tgtYaw = moving ? Math.atan2(to.x, to.z) : (target ? Math.atan2(target.obj.position.x - cp.x, target.obj.position.z - cp.z) : P.face);
  let df = tgtYaw - cat.root.rotation.y; df = Math.atan2(Math.sin(df), Math.cos(df)); cat.root.rotation.y += df * Math.min(1, dt * 6);
  let look = 0; if (target && moving) { const hy = Math.atan2(target.obj.position.x - cp.x, target.obj.position.z - cp.z) - cat.root.rotation.y; look = THREE.MathUtils.clamp(Math.atan2(Math.sin(hy), Math.cos(hy)), -0.8, 0.8); }
  cat.animate(G.time, dt, { speed: moving ? Math.min(dist * 3, 10) : 0, look });
  pingT -= dt;
  if (target && pingT <= 0 && !(boss && boss.active)) {
    pingT = 3.2; pingAlt++;
    const isItem = L.catItems.includes(target);
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture(), color: isItem ? 0x9bff3a : 0x29e0ff, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
    s.position.copy(cp).add(new V3(0, 0.8, 0)); s.scale.setScalar(0.6); scene.add(s); pings.push({ s, from: s.position.clone(), to: target.obj.position.clone(), t: 0 });
    const dir = target.obj.position.clone().sub(P.pos); const ang = Math.atan2(dir.x, dir.z) - Math.atan2(-Math.sin(cam.yaw), -Math.cos(cam.yaw));
    const arrows = ['↑', '↖', '←', '↙', '↓', '↘', '→', '↗']; const idx = ((Math.round(ang / (Math.PI / 4)) % 8) + 8) % 8;
    $('catHint').textContent = `🐈‍⬛ ${isItem ? 'the cat smells something hidden' : 'the cat senses a heart'} ${arrows[idx]} ${Math.round(dir.length())}m`;
  }
  if (!target || (boss && boss.active)) $('catHint').textContent = '';
  for (let i = pings.length - 1; i >= 0; i--) {
    const p = pings[i]; p.t += dt / 1.1; const k = Math.min(p.t, 1); const travel = Math.min(1, 5 / Math.max(p.from.distanceTo(p.to), 0.1));
    p.s.position.lerpVectors(p.from, p.to, k * travel); p.s.position.y += Math.sin(k * Math.PI) * 0.6; p.s.material.opacity = 1 - k; p.s.scale.setScalar(0.6 + k * 0.6);
    if (p.t >= 1) { scene.remove(p.s); p.s.material.dispose(); pings.splice(i, 1); }
  }
}

// ---------------- boss hooks ----------------
const bossCtx = {
  get P() { return P; }, TEX,
  toast, sfx, burst, hurt: (from, amt) => hurt(from, amt), shake: (s) => { cam.shake = Math.max(cam.shake, s); },
  canHurt: () => G.state === 'play',
  onBossHit: () => updateBossBar(),
  onDefeated: () => { updateBossBar(); G.state = 'win'; W.t = 0; W.phase = 0; },
};
function updateBossBar() { if (!boss) return; $('bossFill').style.width = (boss.hp * 100) + '%'; $('bossPhase').textContent = `PHASE ${Math.min(boss.phase + 1, boss.cfg.phases.length)} / ${boss.cfg.phases.length}`; }
function startBoss() {
  boss.start(); G.cpIndex = Math.max(G.cpIndex, L.checkpoints.findIndex(c => c.arena));
  G.state = 'cine'; G.cine = 2.8; $('boss').classList.remove('hidden'); updateBossBar(); music('boss'); sfx('boss'); cam.shake = 0.5;
  const S = story(); const line = G.n === 1 ? S.level1Encounter.before : S.worlds[worldOf(G.n)].preBoss;
  toast('“' + line + '”', 3.2);
}

// ---------------- endings ----------------
function levelComplete(extraLine) {
  if (G.state !== 'play' && G.state !== 'win') return;
  G.state = 'complete'; sfx('win');
  const n = G.n; const res = { hearts: P.hearts, total: L.hearts.length, cat: L.mission.n > 0 && L.mission.got >= L.mission.n, time: Math.round(G.levelTime) };
  const out = SAVE.recordLevel(SAVEDATA, n, res, story().rewards);
  $('hud').classList.add('hidden'); $('touch').classList.add('hidden');
  $('cpKicker').textContent = isBossLevel(n) ? 'BOSS DEFEATED' : 'LEVEL COMPLETE';
  $('cpTitle').textContent = `${worldOf(n) + 1}-${levelInWorld(n)} · ${themeFor(n).name}`;
  $('stats').innerHTML = `💔 ${res.hearts}/${res.total} broken hearts<br>🐾 cat mission ${res.cat ? '✓' : '✗'}<br>⏱ ${Math.floor(res.time / 60)}:${String(res.time % 60).padStart(2, '0')}` + (extraLine ? `<br><br><i>“${extraLine}”</i>` : '');
  $('cpRewards').textContent = (out.gotCatNow ? `+1 cat token (${SAVEDATA.tokens}). ` : '') + (out.fresh.length ? 'Unlocked: ' + out.fresh.join(', ') : '');
  $('btnNext').textContent = n >= TOTAL_LEVELS ? 'LEVEL SELECT' : (isBossLevel(n + 1) ? 'NEXT: BOSS' : 'NEXT LEVEL');
  setTimeout(() => show('complete'), 400);
}
function updateWin(dt) {
  W.t += dt; const S = story(); const final = boss && boss.cfg.final; const A = L.arena;
  if (W.phase === 0) { // Shadow Man kneels / dissolves
    const k = Math.min(1, W.t / 2.2);
    shadow.animate(G.time, dt, { mode: 'stunned', speed: 0 });
    if (final) { shadow.shadow.emissive.lerp(new THREE.Color(0xffffff), dt * 0.8); }
    else { shadow.root.scale.setScalar(Math.max(0.01, 1.35 * (1 - k))); shadow.root.rotation.y += dt * (4 + W.t * 6); }
    if (Math.random() < 0.6) burst(boss.pos.clone().setY(1 + Math.random() * 3), Math.random() < 0.5 ? boss.cfg.aura : 0xffffff, 2, 3, 0.5, 0.8);
    if (W.t > 2.2) {
      W.phase = 1; W.t = 0; $('boss').classList.add('hidden'); boss.stars.forEach(s => s.visible = false);
      if (!final) {
        shadow.root.visible = false;
        const line = G.n === 1 ? S.level1Encounter.after : S.worlds[worldOf(G.n)].postBoss;
        // he takes the girl away again: the cage fades out in a burst
        burst(A.cage.position.clone().setY(3), boss.cfg.aura, 30, 6, 0.5, 1.2); A.cage.visible = false; girl.root.visible = false;
        storyCard(G.n === 1 ? 'PROLOGUE' : `WORLD ${worldOf(G.n) + 1} CLEARED`, 'SHADOW MAN', 'SHADOW MAN', line, 'CONTINUE', () => levelComplete());
        W.phase = 9;
      } else { sfx('win'); burst(A.cage.position.clone().setY(3), 0xffd23a, 30, 6, 0.5, 1.2); }
    }
  } else if (W.phase === 1) { // final: cage breaks, girl floats down
    A.cage.children.forEach((c, i) => { c.position.y -= dt * (2 + i % 3); c.rotation.z += dt * (i % 2 ? 1 : -1); });
    const gp = girl.root.position; gp.y = THREE.MathUtils.lerp(A.cagePos.y, 0, Math.min(1, W.t / 1.5)); gp.z = THREE.MathUtils.lerp(A.cagePos.z, A.cagePos.z + 2.2, Math.min(1, W.t / 1.5));
    girl.animate(G.time, dt, { mode: 'idle', speed: 0 });
    if (W.t > 1.6) { A.cage.visible = false; W.phase = 2; W.t = 0; }
  } else if (W.phase === 2) {
    const gp = girl.root.position; const to = P.pos.clone().sub(gp).setY(0); const d = to.length(); girl.root.rotation.y = Math.atan2(to.x, to.z);
    if (d > 1.3 && W.t < 6) { gp.addScaledVector(to.normalize(), Math.min(dt * 4, d - 1.3)); girl.animate(G.time, dt, { mode: 'run', speed: 4 }); } else { W.phase = 3; W.t = 0; W.ri = 0; }
  } else if (W.phase === 3) { // reveal cards
    girl.animate(G.time, dt, { mode: 'cheer', speed: 0 });
    if (Math.random() < 0.3) burst(girl.root.position.clone().lerp(P.pos, 0.5).setY(2.2), [0xff2fa8, 0xffd23a, 0x29e0ff][Math.floor(Math.random() * 3)], 2, 2.5, 0.4, 1);
    if (!G.after && !$('storyCard').classList.contains('show')) {
      const lines = S.reveal; if (W.ri < lines.length - 1) { const i = W.ri++; storyCard('THE TRUTH', i === 0 ? 'SHADOW MAN' : '', i === 3 ? 'THE GIRL' : 'SHADOW MAN', lines[i], 'CONTINUE', () => {}); }
      else { W.phase = 4; levelComplete(); setTimeout(() => { show('complete', false); $('endStats').textContent = `Cat tokens: ${SAVEDATA.tokens} · Levels cleared: ${Object.keys(SAVEDATA.levels).length}/369`; show('end'); }, 1200); }
    }
  }
  if (W.phase >= 2 && W.phase < 9) { lil.root.rotation.y = Math.atan2(girl.root.position.x - P.pos.x, girl.root.position.z - P.pos.z); lil.root.position.copy(P.pos); lil.root.visible = true; lil.animate(G.time, dt, { mode: W.phase >= 3 ? 'cheer' : 'idle', speed: 0 }); }
  else animateLil(dt, 'idle', 0);
  if (final && W.phase >= 1) shadow.animate(G.time, dt, { mode: 'idle', speed: 0 });
  cat.animate(G.time, dt, { speed: 0, look: 0 });
}

// ---------------- camera ----------------
const tmpOff = new V3();
function updateCamera(dt) {
  let tgt, dist = cam.dist, yaw = cam.yaw, pitch = cam.pitch;
  if (G.state === 'win' && boss) {
    if (W.phase === 0 || W.phase === 9) { tgt = boss.pos.clone().add(new V3(0, 2, 0)); dist = 9; }
    else { tgt = girl.root.position.clone().lerp(P.pos, 0.5).add(new V3(0, 1.2, 0)); dist = 6.5; cam.yaw += dt * 0.25; pitch = 0.22; }
  } else if (G.state === 'cine' && boss) { tgt = boss.pos.clone().add(new V3(0, 2.6, 0)); dist = 8; pitch = 0.15; yaw = Math.atan2(P.pos.x - boss.pos.x, P.pos.z - boss.pos.z); }
  else { tgt = P.pos.clone().add(new V3(0, 1.5, 0)); if (boss && boss.active) dist += 1.5; }
  cam.target.lerp(tgt, 1 - Math.exp(-10 * dt));
  tmpOff.set(Math.sin(yaw) * Math.cos(pitch), Math.sin(pitch), Math.cos(yaw) * Math.cos(pitch)).multiplyScalar(dist);
  const want = cam.target.clone().add(tmpOff); if (L && L.theme.ground !== 'void' && want.y < 0.3) want.y = 0.3;
  camera.position.lerp(want, 1 - Math.exp(-(G.state === 'play' ? 14 : 3) * dt));
  if (cam.shake > 0) { cam.shake = Math.max(0, cam.shake - dt); const s = cam.shake * 0.5; camera.position.add(new V3((Math.random() - 0.5) * s, (Math.random() - 0.5) * s, (Math.random() - 0.5) * s)); }
  camera.lookAt(cam.target);
  if (sky) sky.position.copy(camera.position);
  moon.position.copy(P.pos).add(new V3(10, 22, 8)); moon.target.position.copy(P.pos);
  keyLight.position.copy(camera.position).lerp(P.pos, 0.55).add(new V3(0, 1.2, 0));
}

// ---------------- adaptive quality ----------------
const perf = { frames: 0, t: 0, level: 0 };
function adapt(dt) {
  perf.frames++; perf.t += dt; if (perf.t < 2.5) return;
  const fps = perf.frames / perf.t; perf.frames = 0; perf.t = 0;
  if (fps > 48 || G.state !== 'play' || params.has('shot')) return;
  perf.level++;
  if (perf.level === 1 && L.reflector) { L.reflector.visible = false; Q.reflections = false; if (L.groundMat) { L.groundMat.transparent = false; L.groundMat.opacity = 1; L.groundMat.needsUpdate = true; } return; }
  if (perf.level <= 3 && renderer.getPixelRatio() > 0.75) { const pr = Math.max(0.75, renderer.getPixelRatio() - 0.25); renderer.setPixelRatio(pr); composer.setPixelRatio(pr); onResize(); return; }
  if (moon.castShadow) { moon.castShadow = false; return; }
  bloom.strength = Math.min(bloom.strength, 0.5);
}
function onResize() {
  const w = SW(), h = SH(); camera.aspect = w / h; camera.fov = w / h < 0.8 ? 70 : 58; camera.updateProjectionMatrix();
  renderer.setSize(w, h); composer.setSize(w, h); bloom.resolution.set(w * bloomScale, h * bloomScale);
}
addEventListener('resize', onResize);
if (window.ResizeObserver) new ResizeObserver(() => onResize()).observe(stage);

// ---------------- main loop ----------------
const clock = new THREE.Clock();
function frame() {
  requestAnimationFrame(frame);
  const dt = Math.min(clock.getDelta(), 1 / 20);
  if (G.state !== 'paused') G.time += dt;
  if (toastT > 0) { toastT -= dt; if (toastT <= 0) $('toast').classList.remove('on'); }
  if (!L) { composer.render(dt); return; }
  if (G.state === 'play') {
    G.levelTime += dt; updatePlayer(dt);
    if (boss && !boss.active && L.arena && P.pos.z < L.arena.gateZ - 3) startBoss();
  } else if (G.state === 'levelcard' || G.state === 'title' || G.state === 'select') {
    lil.root.position.copy(P.pos); lil.root.rotation.y = Math.PI; lil.animate(G.time, dt, { mode: 'idle', speed: 0 }); cam.yaw = Math.sin(G.time * 0.15) * 0.6;
  } else if (G.state === 'cine') { G.cine -= dt; animateLil(dt, 'idle', 0); if (G.cine <= 0) G.state = 'play'; }
  else if (G.state === 'dead') animateLil(dt, 'hurt', 0);
  if (G.state !== 'paused') {
    L.update(G.time, dt, camera.position); if (sky) sky.material.uniforms.uTime.value = G.time;
    if (G.state === 'win') updateWin(dt);
    else {
      if (G.state !== 'complete') updateWorld(dt);
      if (boss) boss.update(dt, G.time);
      if (L.arena && girl.root.visible) { girl.animate(G.time, dt, { mode: 'idle', speed: 0 }); girl.root.rotation.y = Math.sin(G.time * 0.5) * 0.4; girl.root.position.y = L.arena.cagePos.y + Math.sin(G.time * 1.3) * 0.03; }
    }
    if (L.arena) { const b = L.arena.barrier.material; b.opacity = boss && boss.active && !boss.dead ? Math.min(0.22, b.opacity + dt * 0.2) : Math.max(0, b.opacity - dt * 0.2); }
    updateParts(dt); updateCamera(dt); adapt(dt);
  }
  composer.render(dt);
}
// title backdrop: build level 1 behind the title card
assetsReady.then(() => {
  loadLevel(1); G.state = 'title';
  const dl = parseInt(params.get('level') || '0', 10);
  if (dl >= 1 && dl <= SAVEDATA.unlocked) { startLevel(dl); }
});
frame();

// test / screenshot hooks (harmless in production)
window.__LSBH = { G, P, get B() { return boss; }, get L() { return L; }, Q, SAVE: () => SAVEDATA, startLevel, loadLevel, levelComplete, cam };
