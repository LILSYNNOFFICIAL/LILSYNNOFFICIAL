// LIL SYNN: Broken Hearts — Level 1 prototype
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { makeLilSynn, makeGirl, makeShadowMan, makeCat, tryGLB, makePeacockFeather, setLensTexture } from './characters.js';
import { buildLevel, ARENA, glowTexture } from './level.js';

const V3 = THREE.Vector3;
const $ = (id) => document.getElementById(id);
const BASE = '/game/assets/';

// ---------------- quality ----------------
const params = new URLSearchParams(location.search);
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

// ---------------- renderer / scene ----------------
const renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: 'high-performance' });
renderer.setPixelRatio(Q.pixelRatio);
renderer.setSize(SW(), SH());
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = Q.shadows;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
$('app').appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x160826, Q.low ? 0.02 : 0.016);
const camera = new THREE.PerspectiveCamera(70, SW() / SH(), 0.1, 900);

const rt = new THREE.WebGLRenderTarget(SW() * Q.pixelRatio, SH() * Q.pixelRatio, { type: THREE.HalfFloatType, samples: Q.low ? 0 : 4 });
const composer = new EffectComposer(renderer, rt);
composer.setPixelRatio(Q.pixelRatio);
composer.addPass(new RenderPass(scene, camera));
const bloomScale = Q.low ? 0.5 : 1;
const bloom = new UnrealBloomPass(new THREE.Vector2(SW() * bloomScale, SH() * bloomScale), Q.bloom, 0.5, 0.72);
composer.addPass(bloom);
composer.addPass(new OutputPass());

scene.add(new THREE.HemisphereLight(0x9a7cff, 0x1a0620, 0.75));
const moon = new THREE.DirectionalLight(0xc8b8ff, 1.3);
moon.position.set(12, 25, 10);
moon.castShadow = Q.shadows;
moon.shadow.mapSize.set(2048, 2048);
Object.assign(moon.shadow.camera, { left: -22, right: 22, top: 22, bottom: -22, near: 1, far: 80 });
moon.shadow.bias = -0.0005;
scene.add(moon, moon.target);
// soft key light that rides with LIL SYNN so the all-black outfit reads against the night
const keyLight = new THREE.PointLight(0xffb0e8, 7, 7, 2); scene.add(keyLight);

const L = buildLevel(scene, Q, renderer);
$('heartTotal').textContent = L.hearts.length;

// ---------------- game-art textures (graceful if missing) ----------------
const TL = new THREE.TextureLoader();
const loadTex = (p) => new Promise(res => TL.load(BASE + p, res, undefined, () => res(null)));
const TEX = {};
Promise.all([
  loadTex('sky/sky_nebula_equirect_2048x1024.webp').then(t => { if (t) L.setSkyTexture(t); }),
  loadTex('textures/tex_galaxy_lens_512.webp').then(t => { if (t) setLensTexture(t); }),
  ...[['asphalt', 'textures/tex_wet_asphalt_neon_1024.webp'], ['rubber', 'textures/tex_rubber_playground_1024.webp'], ['metal', 'textures/tex_painted_neon_metal_1024.webp'], ['brick', 'textures/tex_graffiti_brick_1024.webp'], ['wisp', 'sprites/sprite_static_wisp_512.png'], ['orb', 'sprites/sprite_shadow_orb_512.png']]
    .map(([k, p]) => loadTex(p).then(t => { if (t) { if (k === 'wisp' || k === 'orb') t.colorSpace = THREE.SRGBColorSpace; TEX[k] = t; } })),
]).then(() => { L.applyTextures(TEX); $('loadMsg').textContent = ''; });

// ---------------- characters ----------------
const lil = makeLilSynn(); scene.add(lil.root);
const cat = makeCat(); scene.add(cat.root);
const girl = makeGirl(); scene.add(girl.root);
const shadow = makeShadowMan(); scene.add(shadow.root);
lil.root.traverse(o => { if (o.isMesh) o.castShadow = true; });
const MODELS = BASE + 'models/';
tryGLB(lil, MODELS + 'lil-synn.glb', 1.85);
tryGLB(girl, MODELS + 'girl.glb', 1.7);
tryGLB(shadow, MODELS + 'shadow-man.glb', 2.3);
tryGLB(cat, MODELS + 'cat.glb', 0.7);
const C = ARENA.center;
girl.root.position.set(C.x, 1.6, C.z - 13);
shadow.root.position.set(C.x, 0, C.z - 6);
shadow.root.rotation.y = 0;

// ---------------- audio ----------------
const AU = { muted: localStorage.getItem('lsbh_muted') === '1', el: null, ctx: null, cur: '' };
const TRACKS = { level: '/assets/other/Oblivion_out.mp3', boss: '/assets/other/Before(1).mp3' };
function music(which) {
  const src = TRACKS[which]; if (!src || AU.cur === src) return;
  if (!AU.el) { AU.el = new Audio(); AU.el.loop = true; AU.el.preload = 'auto'; AU.el.volume = 0.5; }
  AU.cur = src; AU.el.src = encodeURI(src); AU.el.muted = AU.muted;
  AU.el.play().catch(() => {});
}
function sfx(type) {
  if (AU.muted) return;
  try {
    if (!AU.ctx) AU.ctx = new (window.AudioContext || window.webkitAudioContext)();
    const ctx = AU.ctx, t = ctx.currentTime, o = ctx.createOscillator(), g = ctx.createGain();
    const P = { jump: ['square', 320, 520, 0.12, 0.05], djump: ['square', 420, 760, 0.14, 0.05], heart: ['triangle', 880, 1760, 0.22, 0.09], dash: ['sawtooth', 200, 80, 0.18, 0.05], hurt: ['sawtooth', 220, 60, 0.3, 0.09], stomp: ['square', 160, 640, 0.15, 0.07], boss: ['sawtooth', 90, 40, 0.6, 0.12], hit: ['square', 600, 120, 0.35, 0.1], orb: ['sine', 300, 140, 0.25, 0.04], win: ['triangle', 520, 1040, 0.8, 0.08] }[type];
    if (!P) return;
    o.type = P[0]; o.frequency.setValueAtTime(P[1], t); o.frequency.exponentialRampToValueAtTime(P[2], t + P[3]);
    g.gain.setValueAtTime(P[4], t); g.gain.exponentialRampToValueAtTime(0.0001, t + P[3]);
    o.connect(g).connect(ctx.destination); o.start(t); o.stop(t + P[3] + 0.02);
  } catch (e) {}
}
function setMuted(m) {
  AU.muted = m; localStorage.setItem('lsbh_muted', m ? '1' : '0');
  if (AU.el) AU.el.muted = m;
  $('btnMute').textContent = m ? '🔇' : '🔊'; $('btnMute2').textContent = m ? 'UNMUTE MUSIC' : 'MUTE MUSIC';
}
setMuted(AU.muted);

// ---------------- input ----------------
const keys = new Set();
const inp = { jump: 0, dash: 0, stick: new THREE.Vector2() };
addEventListener('keydown', e => {
  if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) e.preventDefault();
  if (e.repeat) return;
  keys.add(e.code);
  if (e.code === 'Space') inp.jump = 0.15;
  if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') inp.dash = 0.12;
  if (e.code === 'Escape' || e.code === 'KeyP') togglePause();
  if (e.code === 'KeyM') setMuted(!AU.muted);
});
addEventListener('keyup', e => keys.delete(e.code));
addEventListener('blur', () => { keys.clear(); if (G.state === 'play') togglePause(true); });

const cam = { yaw: 0, pitch: 0.32, dist: 6.5, target: new V3(), shake: 0 };
const drag = { id: null, x: 0, y: 0 };
const stick = { id: null, ox: 0, oy: 0 };
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
    inp.stick.set(dx / m, -dy / m);
    $('stickKnob').style.transform = `translate(${dx}px, ${dy}px)`;
  } else if (e.pointerId === drag.id) {
    const s = e.pointerType === 'mouse' ? 0.005 : 0.008;
    cam.yaw -= (e.clientX - drag.x) * s; cam.pitch = THREE.MathUtils.clamp(cam.pitch + (e.clientY - drag.y) * s, -0.15, 1.2);
    drag.x = e.clientX; drag.y = e.clientY;
  }
});
const endPtr = e => {
  if (e.pointerId === stick.id) { stick.id = null; inp.stick.set(0, 0); $('stickKnob').style.transform = ''; const b = $('stickBase'); b.style.opacity = 0.6; }
  if (e.pointerId === drag.id) drag.id = null;
};
cv.addEventListener('pointerup', endPtr); cv.addEventListener('pointercancel', endPtr);
cv.addEventListener('wheel', e => { cam.dist = THREE.MathUtils.clamp(cam.dist + e.deltaY * 0.005, 3.5, 11); }, { passive: true });
const tbtn = (id, fn) => $(id).addEventListener('pointerdown', e => { e.preventDefault(); e.stopPropagation(); fn(); });
tbtn('tJump', () => inp.jump = 0.15); tbtn('tDash', () => inp.dash = 0.12);

// ---------------- UI ----------------
const fullH = `<img src="${BASE}ui/hud_heart_full_128.png" alt="" onerror="this.replaceWith('❤️')" style="width:30px;height:30px;vertical-align:middle">`;
const emptyH = `<img class="off2" src="${BASE}ui/hud_heart_empty_128.png" alt="" onerror="this.replaceWith('🖤')" style="width:30px;height:30px;vertical-align:middle">`;
function drawHealth() { $('health').innerHTML = Array.from({ length: P.maxHp }, (_, i) => i < P.hp ? fullH : emptyH).join(''); }
let toastT = 0;
function toast(msg, dur = 2) { const t = $('toast'); t.textContent = msg; t.classList.add('on'); toastT = dur; }
const show = (id, on = true) => $(id).classList.toggle('show', on);
// art on cards
(() => {
  const img = new Image(); img.onload = () => { const h = document.querySelector('#intro h1'); const logo = document.createElement('img'); logo.src = img.src; logo.alt = 'LIL SYNN: Broken Hearts'; logo.style.cssText = 'width:min(560px,86cqw);filter:drop-shadow(0 0 18px rgba(255,47,168,.5))'; h.replaceWith(logo); document.querySelector('#intro .kicker').style.display = 'none'; };
  img.src = BASE + 'ui/title_logo_1024x512.png';
  const bg = (id, f) => { const i = new Image(); i.onload = () => { $(id).style.background = `linear-gradient(rgba(6,2,14,.55), rgba(6,2,14,.85)), url("${i.src}") center/cover`; }; i.src = BASE + 'ui/' + f; };
  bg('intro', 'card_intro_1376x768.webp'); bg('end', 'card_win_1376x768.webp');
  const bh = document.querySelector('#hearts .bh'); bh.innerHTML = `<img src="${BASE}ui/icon_broken_heart_256.png" alt="" onerror="this.replaceWith('💔')" style="width:30px;height:30px;vertical-align:middle">`;
})();

// ---------------- game state ----------------
const G = { state: 'intro', time: 0, cine: 0, cpIndex: 0, startTime: 0 };
const P = { pos: new V3(0, 0, 8), vel: new V3(), r: 0.35, h: 1.8, onGround: false, ground: null, coyote: 0, jumps: 0, face: Math.PI, hp: 5, maxHp: 5, inv: 0, dashT: 0, dashCd: 0, airDash: true, dashDir: new V3(), hang: null, regrab: 0, climb: null, hearts: 0, lastSafe: new V3(0, 0, 8), knock: 0, groundY: 0 };
drawHealth();

$('btnPlay').onclick = () => { show('intro', false); $('hud').classList.remove('hidden'); if (isTouch) $('touch').classList.remove('hidden'); G.state = 'play'; cam.yaw = 0; G.startTime = G.time; music('level'); sfx('heart'); toast('Find the broken hearts 💔', 2.5); };
$('btnPause').onclick = () => togglePause();
$('btnResume').onclick = () => togglePause(false);
$('btnMute').onclick = () => setMuted(!AU.muted);
$('btnMute2').onclick = () => setMuted(!AU.muted);
$('btnRestart').onclick = () => location.reload();
$('btnAgain').onclick = () => location.reload();
$('btnRetry').onclick = () => respawn();
function togglePause(force) {
  if (G.state !== 'play' && G.state !== 'paused') return;
  const p = force !== undefined ? force : G.state === 'play';
  G.state = p ? 'paused' : 'play'; show('pause', p);
  if (AU.el) { if (p) AU.el.pause(); else AU.el.play().catch(() => {}); }
}

// ---------------- particles ----------------
const parts = [];
const pMatCache = {};
function burst(pos, color, n = 14, spd = 4, size = 0.35, life = 0.8) {
  if (Q.low) n = Math.ceil(n / 2);
  for (let i = 0; i < n; i++) {
    const m = pMatCache[color] || (pMatCache[color] = new THREE.SpriteMaterial({ map: glowTexture(), color, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
    const s = new THREE.Sprite(m.clone()); s.position.copy(pos); s.scale.setScalar(size); scene.add(s);
    const v = new V3(Math.random() - 0.5, Math.random() * 0.8 + 0.2, Math.random() - 0.5).normalize().multiplyScalar(spd * (0.4 + Math.random() * 0.8));
    parts.push({ s, v, life, max: life, size });
  }
}
function updateParts(dt) {
  for (let i = parts.length - 1; i >= 0; i--) {
    const p = parts[i]; p.life -= dt;
    if (p.life <= 0) { scene.remove(p.s); p.s.material.dispose(); parts.splice(i, 1); continue; }
    p.v.y -= 4 * dt; p.s.position.addScaledVector(p.v, dt);
    const k = p.life / p.max; p.s.material.opacity = k; p.s.scale.setScalar(p.size * (0.5 + k));
  }
}

// ---------------- physics ----------------
const GRAV = -26, RUN = 7.2, JUMP = 9.6, DJUMP = 8.6, DASH = 19;
function overlaps(c, pos) {
  return pos.x - P.r < c.max.x && pos.x + P.r > c.min.x && pos.z - P.r < c.max.z && pos.z + P.r > c.min.z && pos.y < c.max.y - 0.001 && pos.y + P.h > c.min.y;
}
function moveDir() {
  let ix = 0, iz = 0;
  if (keys.has('KeyW') || keys.has('ArrowUp')) iz += 1;
  if (keys.has('KeyS') || keys.has('ArrowDown')) iz -= 1;
  if (keys.has('KeyA') || keys.has('ArrowLeft')) ix -= 1;
  if (keys.has('KeyD') || keys.has('ArrowRight')) ix += 1;
  ix += inp.stick.x; iz += inp.stick.y;
  const fwd = new V3(-Math.sin(cam.yaw), 0, -Math.cos(cam.yaw)), right = new V3(Math.cos(cam.yaw), 0, -Math.sin(cam.yaw));
  const d = fwd.multiplyScalar(iz).add(right.multiplyScalar(ix));
  if (d.length() > 1) d.normalize();
  return d;
}

function tryLedge(c, d, nx, nz) {
  if (P.onGround || P.climb || c.mover) return false;
  const top = c.max.y, diff = top - P.pos.y;
  if (diff < 0.45 || diff > 1.95) return false;
  if (d.x * nx + d.z * nz < 0.4) return false; // must push into the wall
  const to = new V3(THREE.MathUtils.clamp(P.pos.x + nx * 0.6, c.min.x + P.r, c.max.x - P.r), top, THREE.MathUtils.clamp(P.pos.z + nz * 0.6, c.min.z + P.r, c.max.z - P.r));
  // headroom check
  const free = !L.colliders.some(o => o !== c && overlaps(o, to));
  if (!free) return false;
  P.climb = { from: P.pos.clone(), to, t: 0 }; P.vel.set(0, 0, 0); return true;
}

function physics(dt, d) {
  // carry on movers
  if (P.ground && P.ground.mover) P.pos.add(P.ground.mover.delta);
  const steps = Math.max(1, Math.ceil(dt / (1 / 120))), h = dt / steps;
  const wasGround = P.onGround;
  P.onGround = false; P.ground = null;
  for (let s = 0; s < steps; s++) {
    if (P.dashT <= 0) P.vel.y += GRAV * h;
    P.vel.y = Math.max(P.vel.y, -30);
    // X
    P.pos.x += P.vel.x * h;
    for (const c of L.colliders) if (overlaps(c, P.pos)) {
      if (c.max.y - P.pos.y < 0.32 && (wasGround || P.onGround)) { P.pos.y = c.max.y; continue; } // step up
      const n = P.vel.x > 0 ? 1 : -1;
      if (tryLedge(c, d, n, 0)) return;
      P.pos.x = n > 0 ? c.min.x - P.r - 1e-3 : c.max.x + P.r + 1e-3; P.vel.x = 0;
    }
    // Z
    P.pos.z += P.vel.z * h;
    for (const c of L.colliders) if (overlaps(c, P.pos)) {
      if (c.max.y - P.pos.y < 0.32 && (wasGround || P.onGround)) { P.pos.y = c.max.y; continue; }
      const n = P.vel.z > 0 ? 1 : -1;
      if (tryLedge(c, d, 0, n)) return;
      P.pos.z = n > 0 ? c.min.z - P.r - 1e-3 : c.max.z + P.r + 1e-3; P.vel.z = 0;
    }
    // Y
    P.pos.y += P.vel.y * h;
    for (const c of L.colliders) if (overlaps(c, P.pos)) {
      if (P.vel.y <= 0 || P.pos.y > c.max.y - 0.45) { P.pos.y = c.max.y; P.vel.y = Math.min(0, P.vel.y); P.onGround = true; P.ground = c; }
      else { P.pos.y = c.min.y - P.h - 1e-3; P.vel.y = Math.min(0, P.vel.y); }
    }
    for (const r of L.ramps) {
      if (P.pos.x < r.minX || P.pos.x > r.maxX) continue;
      const k = (P.pos.z - r.z0) / (r.z1 - r.z0); if (k < 0 || k > 1) continue;
      const sy = r.y0 + (r.y1 - r.y0) * k;
      if (P.pos.y <= sy + 0.06 && P.pos.y > sy - 0.7 && P.vel.y <= 0.5) { P.pos.y = sy; P.vel.y = 0; P.onGround = true; P.ground = { ramp: r }; P.vel.z -= 14 * h; }
    }
    if (P.pos.y <= 0) { P.pos.y = 0; P.vel.y = 0; P.onGround = true; }
  }
}

function nearestOnSeg(a, b, p) { const ab = b.clone().sub(a); const t = THREE.MathUtils.clamp(p.clone().sub(a).dot(ab) / ab.lengthSq(), 0, 1); return { t, pt: a.clone().addScaledVector(ab, t) }; }
const HAND = 2.0;

function hurt(from, amt = 1) {
  if (P.inv > 0 || G.state !== 'play') return;
  P.hp -= amt; P.inv = 1.3; drawHealth(); sfx('hurt'); cam.shake = 0.4;
  const away = P.pos.clone().sub(from).setY(0); if (away.lengthSq() < 1e-4) away.set(0, 0, 1); away.normalize();
  P.vel.set(away.x * 9, 6.5, away.z * 9); P.knock = 0.3; P.hang = null; P.climb = null; P.dashT = 0;
  burst(P.pos.clone().setY(P.pos.y + 1), 0xff2fa8, 10, 3);
  if (P.hp <= 0) { G.state = 'dead'; setTimeout(() => show('dead'), 600); }
}
function respawn() {
  show('dead', false);
  const cp = L.checkpoints[G.cpIndex]; P.pos.copy(cp); P.vel.set(0, 0, 0); P.hp = P.maxHp; P.inv = 2; drawHealth();
  P.hang = P.climb = null;
  if (B.active && !B.dead) { B.orbs.forEach(o => scene.remove(o.m)); B.orbs.length = 0; B.blades.forEach(o => scene.remove(o.m)); B.blades.length = 0; B.state = 'orbs'; B.t = 0; B.volleys = 0; P.pos.set(C.x, 0, C.z + 14); }
  G.state = 'play';
}

// ---------------- player update ----------------
function updatePlayer(dt) {
  P.inv = Math.max(0, P.inv - dt); P.dashCd -= dt; P.regrab -= dt; P.knock -= dt;
  inp.jump -= dt; inp.dash -= dt;
  const d = moveDir();
  let mode = 'run';

  if (P.climb) { // ledge climb
    P.climb.t += dt / 0.32; const k = Math.min(P.climb.t, 1);
    const ky = Math.min(1, k * 1.6), kx = Math.max(0, (k - 0.35) / 0.65);
    P.pos.set(THREE.MathUtils.lerp(P.climb.from.x, P.climb.to.x, kx), THREE.MathUtils.lerp(P.climb.from.y, P.climb.to.y, ky), THREE.MathUtils.lerp(P.climb.from.z, P.climb.to.z, kx));
    if (k >= 1) { P.climb = null; P.onGround = true; P.jumps = 0; P.airDash = true; }
    animateLil(dt, 'climb', 0); return;
  }

  if (P.hang) { // monkey bars
    const { bar } = P.hang; const ab = bar.b.clone().sub(bar.a); const len = ab.length(); ab.normalize();
    P.hang.t = THREE.MathUtils.clamp(P.hang.t + d.dot(ab) * 3.4 * dt / len, -0.02, 1.02);
    const pt = bar.a.clone().addScaledVector(ab, P.hang.t * len);
    P.pos.set(pt.x, pt.y - HAND, pt.z); P.vel.set(0, 0, 0);
    if (d.lengthSq() > 0.01) P.face = Math.atan2(d.x, d.z);
    const off = P.hang.t < 0 || P.hang.t > 1;
    if (inp.jump > 0 || off || inp.dash > 0) {
      const jumped = inp.jump > 0; inp.jump = 0; const ht = P.hang.t;
      P.hang = null; P.regrab = 0.4; P.jumps = 1;
      if (jumped) { P.vel.set(d.x * RUN, JUMP * 0.85, d.z * RUN); sfx('jump'); }
      if (off && !jumped) { const sg = ht > 1 ? 3 : -3; P.vel.set(ab.x * sg, 2, ab.z * sg); }
    }
    animateLil(dt, 'hang', d.length() * 5); return;
  }

  // horizontal control
  const ctrl = P.knock > 0 ? 0 : (P.onGround ? 16 : 7);
  if (P.dashT > 0) {
    P.dashT -= dt; P.vel.x = P.dashDir.x * DASH; P.vel.z = P.dashDir.z * DASH; P.vel.y = 0; mode = 'dash';
    if (Math.random() < 0.7) burst(P.pos.clone().setY(P.pos.y + 0.9), 0x9a4dff, 1, 0.5, 0.5, 0.35);
  } else {
    const k = 1 - Math.exp(-ctrl * dt);
    P.vel.x += (d.x * RUN - P.vel.x) * k; P.vel.z += (d.z * RUN - P.vel.z) * k;
  }
  // jump
  if (P.onGround) { P.coyote = 0.1; P.jumps = 0; P.airDash = true; } else P.coyote -= dt;
  if (inp.jump > 0 && P.knock <= 0) {
    if (P.coyote > 0) { P.vel.y = JUMP; P.jumps = 1; P.coyote = 0; inp.jump = 0; sfx('jump'); P.dashT = 0; }
    else if (P.jumps < 2) { P.vel.y = DJUMP; P.jumps = 2; inp.jump = 0; sfx('djump'); burst(P.pos.clone(), 0x29e0ff, 8, 2.5, 0.3, 0.4); P.dashT = 0; }
  }
  // dash
  if (inp.dash > 0 && P.dashCd <= 0 && (P.onGround || P.airDash)) {
    inp.dash = 0; P.dashT = 0.2; P.dashCd = 0.55; if (!P.onGround) P.airDash = false;
    P.dashDir.copy(d.lengthSq() > 0.01 ? d.clone().normalize() : new V3(Math.sin(P.face), 0, Math.cos(P.face)));
    sfx('dash'); cam.shake = Math.max(cam.shake, 0.08);
  }
  physics(dt, d);
  if (P.climb) { animateLil(dt, 'climb', 0); return; }

  // grab monkey bars
  if (!P.onGround && P.regrab <= 0) {
    const hand = P.pos.clone(); hand.y += HAND;
    for (const bar of L.bars) {
      const { t, pt } = nearestOnSeg(bar.a, bar.b, hand);
      const dxz = Math.hypot(pt.x - hand.x, pt.z - hand.z);
      if (dxz < 0.75 && Math.abs(pt.y - hand.y) < 0.55 && t > 0.01 && t < 0.99) { P.hang = { bar, t }; P.dashT = 0; sfx('stomp'); break; }
    }
  }

  // shadow pool + safe spot
  const pl = L.pool;
  if (P.onGround && !P.ground && P.pos.x > pl.minX && P.pos.x < pl.maxX && P.pos.z > pl.minZ && P.pos.z < pl.maxZ) {
    const s = P.lastSafe.clone(); hurt(P.pos.clone().add(new V3(0, 0, 1))); P.pos.copy(s); P.vel.set(0, 0, 0);
    if (P.hp > 0) toast('The shadow pool bites! Use the platforms.', 2);
  } else if (P.onGround && !(P.ground && (P.ground.mover || P.ground.ramp))) P.lastSafe.copy(P.pos);

  // arena boundary
  if (B.active && !B.dead) {
    const off = P.pos.clone().sub(C).setY(0); const l = off.length();
    if (l > ARENA.radius) { off.multiplyScalar(ARENA.radius / l); P.pos.x = C.x + off.x; P.pos.z = C.z + off.z; }
  }

  const hs = Math.hypot(P.vel.x, P.vel.z);
  if (hs > 0.3 && P.dashT <= 0) P.face = Math.atan2(P.vel.x, P.vel.z);
  if (P.dashT > 0) P.face = Math.atan2(P.dashDir.x, P.dashDir.z);
  if (!P.onGround && mode !== 'dash') mode = 'air';
  if (P.knock > 0) mode = 'hurt';
  animateLil(dt, mode, P.onGround ? hs : 0);
}

function animateLil(dt, mode, speed) {
  lil.root.position.copy(P.pos);
  const cur = lil.root.rotation.y; let diff = P.face - cur; diff = Math.atan2(Math.sin(diff), Math.cos(diff));
  lil.root.rotation.y = cur + diff * Math.min(1, dt * 14);
  lil.animate(G.time, dt, { mode, speed });
  lil.root.visible = P.inv > 0 && G.state === 'play' ? Math.floor(G.time * 16) % 2 === 0 : true;
}

// ---------------- hearts, wisps, cat ----------------
let pingT = 1.5; const pings = [];
function updateWorld(dt) {
  const center = P.pos.clone(); center.y += 0.9;
  for (const h of L.hearts) {
    if (h.taken) continue;
    h.obj.rotation.y += dt * 2; h.obj.position.y = h.base + Math.sin(G.time * 2.5 + h.base) * 0.15;
    if (h.obj.position.distanceTo(center) < 1.15) {
      h.taken = true; h.obj.visible = false; P.hearts++; $('heartCount').textContent = P.hearts; sfx('heart');
      burst(h.obj.position, 0xff2fa8, 16, 4);
      if (P.hearts % 5 === 0 && P.hp < P.maxHp) { P.hp++; drawHealth(); toast(`${P.hearts} hearts mended: +1 health`, 2); }
      else if (P.hearts === L.hearts.length) toast('Every broken heart found! 💖', 2.5);
    }
  }
  for (const w of L.wisps) {
    if (!w.alive) { if (w.dying > 0) { w.dying -= dt; w.obj.scale.setScalar(Math.max(0.01, w.dying * 2)); if (w.dying <= 0) w.obj.visible = false; } continue; }
    const a = G.time * w.speed + w.phase;
    w.obj.position.set(w.home.x + Math.cos(a) * w.r, w.home.y + Math.sin(G.time * 3 + w.phase) * 0.25, w.home.z + Math.sin(a) * w.r);
    w.core.rotation.x += dt * 2; w.core.rotation.y += dt * 3;
    w.spark.visible = Math.random() > 0.15;
    const dist = w.obj.position.distanceTo(center);
    if (dist < 0.95 && G.state === 'play') {
      if (P.dashT > 0 || (P.vel.y < -0.5 && P.pos.y > w.obj.position.y - 0.35)) {
        w.alive = false; w.dying = 0.4; burst(w.obj.position, 0x9a4dff, 18, 5); sfx('stomp');
        if (P.dashT <= 0) { P.vel.y = 10; P.jumps = 1; }
      } else hurt(w.obj.position);
    }
  }
  // cat follows
  const back = new V3(Math.sin(P.face), 0, Math.cos(P.face)).multiplyScalar(-1.5);
  const side = new V3(Math.cos(P.face), 0, -Math.sin(P.face)).multiplyScalar(0.9);
  const goal = P.pos.clone().add(back).add(side);
  if (P.onGround && !P.hang) P.groundY = P.pos.y;
  goal.y = P.groundY;
  const cp = cat.root.position; const to = goal.clone().sub(cp); const dist = to.length();
  if (dist > 18) cp.copy(goal);
  else { const spd = THREE.MathUtils.clamp(dist * 3, 0, 10); if (dist > 0.4) cp.addScaledVector(to.normalize(), Math.min(spd * dt, dist)); }
  cp.y += (goal.y - cp.y) * Math.min(1, dt * 6);
  // nearest heart
  let near = null, nd = Infinity;
  for (const h of L.hearts) if (!h.taken) { const dd = h.obj.position.distanceTo(cp); if (dd < nd) { nd = dd; near = h; } }
  let look = 0;
  const moving = dist > 0.5;
  const tgtYaw = moving ? Math.atan2(to.x, to.z) : (near ? Math.atan2(near.obj.position.x - cp.x, near.obj.position.z - cp.z) : P.face);
  let df = tgtYaw - cat.root.rotation.y; df = Math.atan2(Math.sin(df), Math.cos(df)); cat.root.rotation.y += df * Math.min(1, dt * 6);
  if (near && moving) { const hy = Math.atan2(near.obj.position.x - cp.x, near.obj.position.z - cp.z) - cat.root.rotation.y; look = THREE.MathUtils.clamp(Math.atan2(Math.sin(hy), Math.cos(hy)), -0.8, 0.8); }
  cat.animate(G.time, dt, { speed: moving ? Math.min(dist * 3, 10) : 0, look });
  // ping toward nearest heart
  pingT -= dt;
  if (near && pingT <= 0 && !B.active) {
    pingT = 3.2;
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture(), color: 0x29e0ff, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
    s.position.copy(cp).add(new V3(0, 0.8, 0)); s.scale.setScalar(0.6); scene.add(s);
    pings.push({ s, from: s.position.clone(), to: near.obj.position.clone(), t: 0 });
  }
  for (let i = pings.length - 1; i >= 0; i--) {
    const p = pings[i]; p.t += dt / 1.1;
    const k = Math.min(p.t, 1); const travel = Math.min(1, 5 / Math.max(p.from.distanceTo(p.to), 0.1));
    p.s.position.lerpVectors(p.from, p.to, k * travel); p.s.position.y += Math.sin(k * Math.PI) * 0.6;
    p.s.material.opacity = 1 - k; p.s.scale.setScalar(0.6 + k * 0.6);
    if (p.t >= 1) { scene.remove(p.s); p.s.material.dispose(); pings.splice(i, 1); }
  }
  // HUD hint with arrow
  if (near && !B.active) {
    const dir = near.obj.position.clone().sub(P.pos); const ang = Math.atan2(dir.x, dir.z) - Math.atan2(-Math.sin(cam.yaw), -Math.cos(cam.yaw));
    const arrows = ['↑', '↖', '←', '↙', '↓', '↘', '→', '↗'];
    const idx = ((Math.round(ang / (Math.PI / 4)) % 8) + 8) % 8;
    $('catHint').textContent = `🐈‍⬛ the cat senses a heart ${arrows[idx]} ${Math.round(dir.length())}m`;
  } else $('catHint').textContent = B.active ? '' : (P.hearts >= L.hearts.length ? '🐈‍⬛ the cat is staring at the SHADOW ZONE…' : '');
}

// ---------------- boss ----------------
const B = { active: false, dead: false, state: 'idle', t: 0, phase: 1, hits: 0, volleys: 0, fireT: 0, waves: 0, orbs: [], blades: [], hp: 6, ang: 0, pos: new V3(C.x, 0, C.z - 6), deathT: 0, stars: [] };
const orbGeo = new THREE.SphereGeometry(0.28, 12, 10);
const orbMat = new THREE.MeshStandardMaterial({ color: 0x000000, emissive: 0x7a2bff, emissiveIntensity: 2.2, roughness: 0.2 });
for (let i = 0; i < 3; i++) { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture(), color: 0xffd23a, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })); s.scale.setScalar(0.45); s.visible = false; scene.add(s); B.stars.push(s); }

function startBoss() {
  B.active = true; G.cpIndex = 1; B.state = 'intro'; B.t = 0; G.state = 'cine'; G.cine = 2.8;
  show('bossCard'); $('boss').classList.remove('hidden'); updateBossBar(); music('boss'); sfx('boss'); cam.shake = 0.5;
  setTimeout(() => show('bossCard', false), 2600);
}
function updateBossBar() { $('bossFill').style.width = (B.hp / 6 * 100) + '%'; $('bossPhase').textContent = `PHASE ${Math.min(B.phase, 3)} / 3`; }
function spawnOrb(from, target, speed) {
  const g = new THREE.Group();
  g.add(new THREE.Mesh(orbGeo, orbMat));
  const spr = new THREE.Sprite(new THREE.SpriteMaterial({ map: TEX.orb || glowTexture(), color: TEX.orb ? 0xffffff : 0x9a4dff, transparent: true, depthWrite: false, blending: TEX.orb ? THREE.NormalBlending : THREE.AdditiveBlending }));
  spr.scale.setScalar(TEX.orb ? 1.3 : 1.4); g.add(spr);
  g.position.copy(from); scene.add(g);
  const v = target.clone().sub(from).normalize().multiplyScalar(speed);
  B.orbs.push({ m: g, v, life: 5, speed });
  sfx('orb');
}
function spawnFan(n, spread, speed, offset = 0) {
  const base = Math.atan2(P.pos.x - B.pos.x, P.pos.z - B.pos.z) + offset;
  for (let i = 0; i < n; i++) {
    const a = spread >= Math.PI * 2 ? (i / n) * Math.PI * 2 + offset : base - spread / 2 + spread * (n === 1 ? 0.5 : i / (n - 1));
    const f = makePeacockFeather(0.9); f.rotation.set(Math.PI / 2, 0, 0);
    const holder = new THREE.Group(); holder.add(f); f.position.set(0, 0, -0.45);
    holder.position.set(B.pos.x, 0.5, B.pos.z); holder.rotation.y = a + Math.PI; scene.add(holder);
    B.blades.push({ m: holder, v: new V3(Math.sin(a), 0, Math.cos(a)).multiplyScalar(speed), life: 4 });
  }
}
function updateBoss(dt) {
  if (!B.active) { shadow.animate(G.time, dt, { mode: 'idle', speed: 0 }); shadow.root.lookAt(P.pos.x, 0, P.pos.z); return; }
  B.t += dt;
  const ph = B.phase;
  const toP = P.pos.clone().sub(B.pos).setY(0);
  let mode = 'idle';
  if (B.state === 'intro') { if (B.t > 2.8) { B.state = 'orbs'; B.t = 0; B.volleys = 0; } }
  else if (B.state === 'orbs') {
    mode = 'throw';
    B.ang += dt * (0.35 + ph * 0.15);
    const R = 7 + ph;
    const goal = new V3(C.x + Math.sin(B.ang) * R, 0, C.z + Math.cos(B.ang) * R * 0.7 - 2);
    if (ph === 3 && B.t > 0 && Math.floor(B.t / 1.6) !== Math.floor((B.t - dt) / 1.6)) { burst(B.pos.clone().setY(2), 0x9a4dff, 14, 4); B.ang += 2.2; B.pos.copy(new V3(C.x + Math.sin(B.ang) * R, 0, C.z + Math.cos(B.ang) * R * 0.7 - 2)); burst(B.pos.clone().setY(2), 0x9a4dff, 14, 4); }
    B.pos.lerp(goal, Math.min(1, dt * 1.5));
    B.fireT -= dt;
    if (B.fireT <= 0) {
      B.fireT = 1.15 - ph * 0.2; B.volleys++;
      const hand = B.pos.clone().add(new V3(0, 3.2, 0));
      const tgt = P.pos.clone().add(new V3(P.vel.x * 0.35, 1.0, P.vel.z * 0.35));
      const n = ph === 1 ? 1 : ph === 2 ? 3 : 4;
      for (let i = 0; i < n; i++) { const side = new V3(-toP.z, 0, toP.x).normalize().multiplyScalar((i - (n - 1) / 2) * 1.6); spawnOrb(hand, tgt.clone().add(side), 8 + ph * 2); }
    }
    if (B.volleys >= 3 + ph) { B.state = 'windup'; B.t = 0; toast('⚠ The feather glows… get ready to JUMP', 1.3); }
  } else if (B.state === 'windup') {
    mode = 'feather';
    if (B.t > 0.9) { B.state = 'feather'; B.t = 0; B.waves = 0; }
  } else if (B.state === 'feather') {
    mode = 'feather';
    const waves = ph, gap = 0.75;
    if (B.waves < waves && B.t >= B.waves * gap) {
      if (ph < 3) spawnFan(ph === 1 ? 7 : 9, Math.PI * (ph === 1 ? 0.6 : 0.8), 9 + ph, B.waves * 0.12);
      else spawnFan(16, Math.PI * 2, 10, B.waves * 0.2);
      B.waves++; sfx('boss'); cam.shake = 0.2;
    }
    if (B.t > waves * gap + 0.9) { B.state = 'stunned'; B.t = 0; toast('He staggers! DASH into him!', 1.6); }
  } else if (B.state === 'stunned') {
    mode = 'stunned';
    if (B.t > 3.6 - ph * 0.35) { B.state = 'orbs'; B.t = 0; B.volleys = 0; }
  } else if (B.state === 'hit') {
    mode = 'hurt';
    if (B.t > 0.9) {
      if (B.hits >= 2) {
        B.hits = 0; B.phase++;
        if (B.phase > 3) { B.state = 'dying'; B.t = 0; B.dead = true; return; }
        B.state = 'roar'; B.t = 0; toast(`PHASE ${B.phase}: Shadow Man is furious`, 2); sfx('boss'); cam.shake = 0.6;
        const away = P.pos.clone().sub(B.pos).setY(0).normalize(); P.vel.set(away.x * 14, 7, away.z * 14); P.knock = 0.4;
        updateBossBar();
      } else { B.state = 'orbs'; B.t = 0; B.volleys = 0; }
    }
  } else if (B.state === 'roar') { mode = 'feather'; if (B.t > 1.5) { B.state = 'orbs'; B.t = 0; B.volleys = 0; } }

  // contact / hit check
  const pd = Math.hypot(P.pos.x - B.pos.x, P.pos.z - B.pos.z);
  if (pd < 1.3 && P.pos.y < 3.8 && G.state === 'play') {
    if (B.state === 'stunned' && P.dashT > 0) {
      B.hits++; B.hp = Math.max(0, 6 - ((B.phase - 1) * 2 + B.hits)); updateBossBar();
      B.state = 'hit'; B.t = 0; sfx('hit'); cam.shake = 0.5; burst(B.pos.clone().setY(2.5), 0xffffff, 26, 7, 0.5);
      P.dashT = 0; const away = P.pos.clone().sub(B.pos).setY(0).normalize(); P.vel.set(away.x * 10, 6, away.z * 10); P.knock = 0.3;
    } else if (B.state !== 'stunned' && B.state !== 'hit') hurt(B.pos);
  }
  // stars over head when stunned
  B.stars.forEach((s, i) => { s.visible = B.state === 'stunned'; const a = G.time * 4 + i * 2.1; s.position.set(B.pos.x + Math.cos(a) * 0.7, 4.3, B.pos.z + Math.sin(a) * 0.7); });

  shadow.root.position.copy(B.pos);
  shadow.root.rotation.y = Math.atan2(toP.x, toP.z);
  shadow.animate(G.time, dt, { mode, speed: 0.6 });
}
function updateProjectiles(dt) {
  const center = P.pos.clone(); center.y += 0.9;
  for (let i = B.orbs.length - 1; i >= 0; i--) {
    const o = B.orbs[i]; o.life -= dt;
    if (B.phase >= 2 && !B.dead) { const want = center.clone().sub(o.m.position).normalize().multiplyScalar(o.speed); o.v.lerp(want, Math.min(1, dt * 0.6)); }
    o.m.position.addScaledVector(o.v, dt);
    const dd = o.m.position.distanceTo(center);
    let kill = o.life <= 0 || o.m.position.y < 0.1 || B.dead;
    if (!kill && P.dashT > 0 && dd < 1.1) { kill = true; sfx('stomp'); }
    else if (!kill && dd < 0.7) { kill = true; hurt(o.m.position); }
    if (kill) { burst(o.m.position, 0x9a4dff, 8, 3); scene.remove(o.m); B.orbs.splice(i, 1); }
  }
  for (let i = B.blades.length - 1; i >= 0; i--) {
    const b = B.blades[i]; b.life -= dt; b.m.position.addScaledVector(b.v, dt);
    b.m.children[0].rotation.z += dt * 10;
    const dxz = Math.hypot(b.m.position.x - P.pos.x, b.m.position.z - P.pos.z);
    let kill = b.life <= 0 || b.m.position.distanceTo(C) > ARENA.radius + 3 || B.dead;
    if (!kill && dxz < 0.7 && P.pos.y < 0.75) { kill = true; hurt(b.m.position); }
    if (kill) { scene.remove(b.m); B.blades.splice(i, 1); }
  }
}

// ---------------- win cutscene ----------------
const W = { t: 0, phase: 0 };
function updateWin(dt) {
  W.t += dt;
  if (W.phase === 0) { // boss dissolves
    shadow.root.scale.setScalar(Math.max(0.01, 1.35 * (1 - W.t / 2.2)));
    shadow.root.rotation.y += dt * (4 + W.t * 6);
    shadow.animate(G.time, dt, { mode: 'stunned', speed: 0 });
    if (Math.random() < 0.6) burst(B.pos.clone().setY(1 + Math.random() * 3), Math.random() < 0.5 ? 0x9a4dff : 0xffffff, 2, 3, 0.5, 0.8);
    if (W.t > 2.2) { shadow.root.visible = false; W.phase = 1; W.t = 0; sfx('win'); burst(L.cage.position.clone().setY(3), 0xffd23a, 30, 6, 0.5, 1.2); $('boss').classList.add('hidden'); B.stars.forEach(s => s.visible = false); }
  } else if (W.phase === 1) { // cage breaks, girl floats down
    L.cage.children.forEach((c, i) => { c.position.y -= dt * (2 + i % 3); c.rotation.z += dt * (i % 2 ? 1 : -1); });
    L.cageMat.opacity = Math.max(0, 1 - W.t); L.cageMat.transparent = true;
    const gp = girl.root.position; gp.y = THREE.MathUtils.lerp(1.6, 0, Math.min(1, W.t / 1.5)); gp.z = THREE.MathUtils.lerp(C.z - 13, C.z - 10.8, Math.min(1, W.t / 1.5));
    if (W.t > 1.6) { L.cage.visible = false; W.phase = 2; W.t = 0; }
  } else if (W.phase === 2) { // she runs to LIL SYNN
    const gp = girl.root.position; const to = P.pos.clone().sub(gp).setY(0); const d = to.length();
    girl.root.rotation.y = Math.atan2(to.x, to.z);
    if (d > 1.3) { gp.addScaledVector(to.normalize(), Math.min(dt * 4, d - 1.3)); girl.animate(G.time, dt, { mode: 'run', speed: 4 }); }
    else { W.phase = 3; W.t = 0; }
    if (W.t > 6) { W.phase = 3; W.t = 0; }
  } else if (W.phase === 3) {
    girl.animate(G.time, dt, { mode: 'cheer', speed: 0 });
    if (Math.random() < 0.3) burst(girl.root.position.clone().lerp(P.pos, 0.5).setY(2.2), [0xff2fa8, 0xffd23a, 0x29e0ff][Math.floor(Math.random() * 3)], 2, 2.5, 0.4, 1);
    if (W.t > 4.5 && W.phase !== 4) {
      W.phase = 4; const secs = Math.round(G.time - G.startTime);
      $('stats').textContent = `Broken hearts: ${P.hearts}/${L.hearts.length} · Time: ${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`;
      show('end'); $('hud').classList.add('hidden'); $('touch').classList.add('hidden');
    }
  }
  if (W.phase >= 2) {
    const face = Math.atan2(girl.root.position.x - P.pos.x, girl.root.position.z - P.pos.z);
    lil.root.rotation.y = face;
    lil.root.position.copy(P.pos); lil.root.visible = true;
    lil.animate(G.time, dt, { mode: W.phase >= 3 ? 'cheer' : 'idle', speed: 0 });
  } else animateLil(dt, 'idle', 0);
  if (W.phase < 2) girl.animate(G.time, dt, { mode: 'idle', speed: 0 });
  cat.animate(G.time, dt, { speed: 0, look: 0 });
}

// ---------------- camera ----------------
const tmpOff = new V3();
function updateCamera(dt) {
  let tgt, dist = cam.dist, yaw = cam.yaw, pitch = cam.pitch;
  if (G.state === 'win') {
    const mid = girl.root.position.clone().lerp(P.pos, 0.5);
    tgt = mid.add(new V3(0, 1.2, 0)); dist = 6.5; yaw = cam.yaw + G.time * 0.15 * 0; cam.yaw += dt * 0.25; pitch = 0.22;
    if (W.phase === 0) { tgt = B.pos.clone().add(new V3(0, 2, 0)); dist = 9; }
  } else if (G.state === 'cine' && B.active) {
    tgt = B.pos.clone().add(new V3(0, 2.6, 0)); dist = 8; pitch = 0.15;
    yaw = Math.atan2(P.pos.x - B.pos.x, P.pos.z - B.pos.z);
  } else {
    tgt = P.pos.clone().add(new V3(0, 1.5, 0)); if (B.active) dist += 1.5;
  }
  cam.target.lerp(tgt, 1 - Math.exp(-10 * dt));
  tmpOff.set(Math.sin(yaw) * Math.cos(pitch), Math.sin(pitch), Math.cos(yaw) * Math.cos(pitch)).multiplyScalar(dist);
  const want = cam.target.clone().add(tmpOff); if (want.y < 0.3) want.y = 0.3;
  camera.position.lerp(want, 1 - Math.exp(-(G.state === 'play' ? 14 : 3) * dt));
  if (cam.shake > 0) { cam.shake = Math.max(0, cam.shake - dt); const s = cam.shake * 0.5; camera.position.add(new V3((Math.random() - 0.5) * s, (Math.random() - 0.5) * s, (Math.random() - 0.5) * s)); }
  camera.lookAt(cam.target);
  // shadow light follows the player
  moon.position.copy(P.pos).add(new V3(10, 22, 8)); moon.target.position.copy(P.pos);
  keyLight.position.copy(camera.position).lerp(P.pos, 0.55).add(new V3(0, 1.2, 0));
}

// ---------------- adaptive quality ----------------
const perf = { frames: 0, t: 0, level: 0 };
function adapt(dt) {
  perf.frames++; perf.t += dt;
  if (perf.t < 2.5) return;
  const fps = perf.frames / perf.t; perf.frames = 0; perf.t = 0;
  if (fps > 48 || G.state !== 'play') return;
  perf.level++;
  if (perf.level === 1 && L.reflector) { L.reflector.visible = false; L.groundMat.transparent = false; L.groundMat.opacity = 1; L.groundMat.needsUpdate = true; return; }
  if (perf.level <= 3 && renderer.getPixelRatio() > 0.75) { const pr = Math.max(0.75, renderer.getPixelRatio() - 0.25); renderer.setPixelRatio(pr); composer.setPixelRatio(pr); onResize(); return; }
  if (moon.castShadow) { moon.castShadow = false; return; }
  bloom.strength = Math.min(bloom.strength, 0.5);
}

function onResize() {
  const w = SW(), h = SH();
  camera.aspect = w / h; camera.fov = w / h < 0.8 ? 70 : 58; camera.updateProjectionMatrix();
  renderer.setSize(w, h); composer.setSize(w, h);
  bloom.resolution.set(w * bloomScale, h * bloomScale);
}
addEventListener('resize', onResize);
if (window.ResizeObserver) new ResizeObserver(() => onResize()).observe(stage);
// fullscreen (Fullscreen API; iOS Safari fallback = fill the viewport)
function toggleFullscreen() {
  const el = document.documentElement;
  const fsEl = document.fullscreenElement || document.webkitFullscreenElement;
  const req = el.requestFullscreen || el.webkitRequestFullscreen;
  if (fsEl) { (document.exitFullscreen || document.webkitExitFullscreen).call(document); return; }
  if (req) { const r = req.call(el, { navigationUI: 'hide' }); if (r && r.catch) r.catch(() => document.body.classList.toggle('fill')); }
  else { document.body.classList.toggle('fill'); setTimeout(() => scrollTo(0, 1), 50); }
}
$('btnFs').onclick = toggleFullscreen;
$('btnFill').onclick = () => { const on = document.body.classList.toggle('fill'); localStorage.setItem('lsbh_fill', on ? '1' : '0'); };
addEventListener('keydown', e => { if (e.code === 'KeyF' && !e.repeat) toggleFullscreen(); });

// ---------------- main loop ----------------
const clock = new THREE.Clock();
function frame() {
  requestAnimationFrame(frame);
  const dt = Math.min(clock.getDelta(), 1 / 20);
  if (G.state !== 'paused') G.time += dt;
  if (toastT > 0) { toastT -= dt; if (toastT <= 0) $('toast').classList.remove('on'); }
  if (G.state === 'play') {
    updatePlayer(dt);
    if (!B.active && P.pos.z < ARENA.gateZ - 3) startBoss();
  } else if (G.state === 'intro') {
    lil.root.position.copy(P.pos); lil.root.rotation.y = Math.PI; lil.animate(G.time, dt, { mode: 'idle', speed: 0 });
    cam.yaw = Math.sin(G.time * 0.15) * 0.6;
  } else if (G.state === 'cine') {
    G.cine -= dt; animateLil(dt, 'idle', 0); if (G.cine <= 0) G.state = 'play';
  } else if (G.state === 'dead') animateLil(dt, 'hurt', 0);
  if (G.state !== 'paused') {
    L.update(G.time, dt);
    if (G.state === 'win') updateWin(dt);
    else {
      updateWorld(dt); updateBoss(dt); updateProjectiles(dt);
      if (!B.active || !B.dead) girl.animate(G.time, dt, { mode: 'idle', speed: 0 });
      if (B.dead && G.state === 'play') { G.state = 'win'; W.t = 0; W.phase = 0; B.orbs.forEach(o => scene.remove(o.m)); B.orbs.length = 0; B.blades.forEach(o => scene.remove(o.m)); B.blades.length = 0; }
      if (B.active && !B.dead) L.barrier.material.opacity = Math.min(0.22, L.barrier.material.opacity + dt * 0.2);
    }
    if (B.dead) L.barrier.material.opacity = Math.max(0, L.barrier.material.opacity - dt * 0.2);
    // girl in cage faces out and sways
    if (G.state !== 'win') { girl.root.rotation.y = Math.sin(G.time * 0.5) * 0.4; girl.root.position.y = 1.6 + Math.sin(G.time * 1.3) * 0.03; }
    updateParts(dt);
    updateCamera(dt);
    adapt(dt);
  }
  composer.render(dt);
}
frame();

// test hooks (harmless in production)
window.__LSBH = { G, P, B, L, Q, warp: (z) => { P.pos.set(0, 0, z); }, startBoss };
