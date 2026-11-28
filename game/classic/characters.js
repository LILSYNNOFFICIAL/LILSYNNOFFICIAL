// LIL SYNN: Broken Hearts — procedural, on-model characters with optional GLB swap-in.
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const std = (color, o = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.6, metalness: 0.0, ...o });

// ---------- shared textures ----------
let _galaxyTex = null;
export function galaxyTexture() {
  if (_galaxyTex) return _galaxyTex;
  const c = document.createElement('canvas'); c.width = c.height = 128;
  const g = c.getContext('2d');
  const grd = g.createLinearGradient(0, 0, 128, 128);
  grd.addColorStop(0, '#ff3fb4'); grd.addColorStop(0.45, '#7a2bff'); grd.addColorStop(0.75, '#1b3cff'); grd.addColorStop(1, '#ff7ad9');
  g.fillStyle = grd; g.fillRect(0, 0, 128, 128);
  for (let i = 0; i < 6; i++) {
    const x = Math.random() * 128, y = Math.random() * 128, r = 20 + Math.random() * 40;
    const rg = g.createRadialGradient(x, y, 0, x, y, r);
    rg.addColorStop(0, `hsla(${280 + Math.random() * 80},100%,70%,0.55)`); rg.addColorStop(1, 'hsla(300,100%,50%,0)');
    g.fillStyle = rg; g.fillRect(0, 0, 128, 128);
  }
  for (let i = 0; i < 90; i++) { g.fillStyle = `rgba(255,255,255,${0.4 + Math.random() * 0.6})`; g.fillRect(Math.random() * 128, Math.random() * 128, Math.random() < 0.1 ? 2 : 1, 1); }
  _galaxyTex = new THREE.CanvasTexture(c); _galaxyTex.colorSpace = THREE.SRGBColorSpace;
  return _galaxyTex;
}

function mesh(geo, mat, parent, pos = [0, 0, 0], rot = [0, 0, 0], scale) {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(...pos); m.rotation.set(...rot);
  if (scale) m.scale.set(...scale);
  m.castShadow = true;
  parent.add(m);
  return m;
}

export const lensMats = [];
export function setLensTexture(tex) { tex.colorSpace = THREE.SRGBColorSpace; for (const m of lensMats) { m.map = tex; m.emissiveMap = tex; m.emissiveIntensity = 0.9; m.needsUpdate = true; } }

// Aviator shades: two teardrop lenses with galaxy emissive + pink frame
function makeShades(parent, scale = 1, z = 0.2) {
  const g = new THREE.Group(); parent.add(g); g.position.set(0, 0, z); g.scale.setScalar(scale);
  const lensMat = new THREE.MeshStandardMaterial({ color: 0xff66cc, emissive: 0xffffff, emissiveMap: galaxyTexture(), map: galaxyTexture(), emissiveIntensity: 1.25, roughness: 0.05, metalness: 0.3 });
  lensMats.push(lensMat);
  const frameMat = std(0xff4fb8, { metalness: 0.8, roughness: 0.25, emissive: 0xff2a9c, emissiveIntensity: 0.6 });
  const lensGeo = new THREE.CircleGeometry(0.075, 20);
  for (const s of [-1, 1]) {
    const l = mesh(lensGeo, lensMat, g, [s * 0.085, 0, 0], [0, s * 0.18, 0], [1.15, 0.95, 1]);
    l.castShadow = false;
    const f = mesh(new THREE.TorusGeometry(0.077, 0.008, 6, 22), frameMat, g, [s * 0.085, 0, 0.001], [0, s * 0.18, 0], [1.15, 0.95, 1]);
    f.castShadow = false;
  }
  mesh(new THREE.BoxGeometry(0.05, 0.012, 0.012), frameMat, g, [0, 0.04, 0.005]);
  return g;
}

// Generic limb: pivot at top
function limb(parent, len, rTop, rBot, mat, pos) {
  const pivot = new THREE.Group(); pivot.position.set(...pos); parent.add(pivot);
  const m = mesh(new THREE.CylinderGeometry(rTop, rBot, len, 10), mat, pivot, [0, -len / 2, 0]);
  return { pivot, mesh: m };
}

// ---------- LIL SYNN ----------
export function makeLilSynn() {
  const root = new THREE.Group();
  const body = new THREE.Group(); root.add(body);
  const hoodie = std(0x0b0b0e, { roughness: 0.85 });
  const black = std(0x020203, { roughness: 0.35 }); // balaclava: smooth opaque black
  const glove = std(0x050505, { roughness: 0.3, metalness: 0.15 });
  const jeans = std(0x16264a, { roughness: 0.9 });
  const boot = std(0x070707, { roughness: 0.5 });
  const silver = std(0xd8dde6, { metalness: 1, roughness: 0.2 });
  const gold = std(0xf6c445, { metalness: 1, roughness: 0.25, emissive: 0x332200, emissiveIntensity: 0.4 });
  const neonBlue = new THREE.MeshStandardMaterial({ color: 0x40e0ff, emissive: 0x29d9ff, emissiveIntensity: 3 });

  const hips = new THREE.Group(); hips.position.y = 0.95; body.add(hips);
  // torso
  const torso = new THREE.Group(); hips.add(torso);
  mesh(new THREE.CylinderGeometry(0.25, 0.22, 0.55, 14), hoodie, torso, [0, 0.3, 0], [0, 0, 0], [1, 1, 0.72]);
  mesh(new THREE.SphereGeometry(0.25, 14, 10), hoodie, torso, [0, 0.55, 0], [0, 0, 0], [1.05, 0.5, 0.75]);
  // hoodie pocket
  mesh(new THREE.BoxGeometry(0.28, 0.12, 0.04), std(0x111116, { roughness: 0.9 }), torso, [0, 0.14, 0.17]);
  // drawstrings
  for (const s of [-1, 1]) mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.18, 4), std(0x22222a), torso, [s * 0.05, 0.55, 0.19]);
  // belt
  mesh(new THREE.CylinderGeometry(0.235, 0.235, 0.06, 16), std(0x060606, { roughness: 0.4 }), hips, [0, 0.0, 0], [0, 0, 0], [1, 1, 0.75]);
  mesh(new THREE.BoxGeometry(0.08, 0.06, 0.02), silver, hips, [0, 0.0, 0.18]);
  for (let i = -2; i <= 2; i++) if (i) mesh(new THREE.SphereGeometry(0.012, 6, 4), silver, hips, [i * 0.07, 0, 0.17]);
  // neck/head
  const head = new THREE.Group(); head.position.set(0, 0.77, 0.01); torso.add(head);
  mesh(new THREE.SphereGeometry(0.15, 20, 16), black, head, [0, 0.0, 0.02], [0, 0, 0], [0.95, 1.08, 1]); // faceless head
  // hood (always up): open front shell
  const hoodGeo = new THREE.SphereGeometry(0.205, 20, 16, Math.PI * 0.62, Math.PI * 1.76, 0, Math.PI * 0.82);
  const hood = mesh(hoodGeo, new THREE.MeshStandardMaterial({ color: 0x0c0c10, roughness: 0.9, side: THREE.DoubleSide }), head, [0, 0.03, -0.02], [0.15, 0, 0], [1, 1.12, 1.12]);
  // hood rim
  mesh(new THREE.TorusGeometry(0.16, 0.025, 8, 24, Math.PI * 1.5), hoodie, head, [0, 0.0, 0.12], [0, 0, -Math.PI * 0.25], [1, 1.18, 1]);
  makeShades(head, 1, 0.15).position.y = 0.025;
  // crown pendant
  const chain = mesh(new THREE.TorusGeometry(0.12, 0.007, 6, 28, Math.PI), gold, torso, [0, 0.6, 0.12], [Math.PI * 1.05, 0, 0], [1, 1.4, 1]);
  chain.castShadow = false;
  const crown = new THREE.Group(); crown.position.set(0, 0.42, 0.2); torso.add(crown);
  mesh(new THREE.BoxGeometry(0.09, 0.04, 0.02), gold, crown);
  for (const x of [-0.035, 0, 0.035]) {
    mesh(new THREE.ConeGeometry(0.014, 0.045, 6), gold, crown, [x, 0.042, 0]);
    const tip = mesh(new THREE.SphereGeometry(0.011, 8, 6), neonBlue, crown, [x, 0.07, 0]); tip.castShadow = false;
  }
  // arms
  const arms = [];
  for (const s of [-1, 1]) {
    const up = limb(torso, 0.32, 0.075, 0.065, hoodie, [s * 0.3, 0.55, 0]);
    up.pivot.rotation.z = s * 0.12;
    const low = limb(up.pivot, 0.3, 0.065, 0.055, hoodie, [0, -0.32, 0]);
    mesh(new THREE.SphereGeometry(0.065, 10, 8), glove, low.pivot, [0, -0.34, 0.01], [0, 0, 0], [0.9, 1.2, 0.8]);
    arms.push({ up, low, s });
  }
  // legs
  const legs = [];
  for (const s of [-1, 1]) {
    const up = limb(hips, 0.45, 0.1, 0.085, jeans, [s * 0.12, -0.02, 0]);
    const low = limb(up.pivot, 0.42, 0.085, 0.075, jeans, [0, -0.45, 0]);
    mesh(new THREE.BoxGeometry(0.15, 0.13, 0.27), boot, low.pivot, [0, -0.45, 0.04]);
    mesh(new THREE.BoxGeometry(0.16, 0.04, 0.29), std(0x111111, { roughness: 0.9 }), low.pivot, [0, -0.51, 0.045]);
    legs.push({ up, low, s });
  }
  const rig = { root, body, hips, torso, head, arms, legs, crownTip: neonBlue };
  rig.animate = (t, dt, state) => animateHumanoid(rig, t, dt, state);
  return rig;
}

function animateHumanoid(rig, t, dt, st) {
  const sp = Math.min(st.speed / 7, 1.4);
  rig.phase = (rig.phase || 0) + dt * (4 + sp * 8) * (sp > 0.05 ? 1 : 0);
  const p = rig.phase;
  let legA = Math.sin(p) * 0.9 * sp, armA = -Math.sin(p) * 0.8 * sp, bob = Math.abs(Math.sin(p)) * 0.06 * sp;
  let lean = sp * 0.18, armUp = 0, knee = 0;
  const idle = Math.sin(t * 2) * 0.015;
  if (st.mode === 'air') { legA = 0.5; armA = -0.6; knee = 0.9; bob = 0; lean = 0.1; armUp = 0.6; }
  if (st.mode === 'hang') { armUp = 2.9; legA = Math.sin(t * 6) * 0.3 * (sp > 0.05 ? 1 : 0.2); armA = 0; knee = 0.3; lean = 0; bob = 0; }
  if (st.mode === 'dash') { lean = 0.7; legA = 0.9; armA = -1.2; knee = 0.6; bob = 0; }
  if (st.mode === 'climb') { armUp = 2.2; knee = 1.2; legA = 0.8; lean = 0.3; }
  if (st.mode === 'hurt') { lean = -0.4; armUp = 1.0; }
  if (st.mode === 'cheer') { armUp = 2.6 + Math.sin(t * 8) * 0.3; legA = 0; lean = -0.1; bob = Math.abs(Math.sin(t * 6)) * 0.1; }
  rig.body.position.y = bob + idle;
  rig.torso.rotation.x = lean;
  rig.legs.forEach((l, i) => {
    const a = (i ? -legA : legA);
    l.up.pivot.rotation.x = st.mode === 'air' || st.mode === 'dash' || st.mode === 'climb' ? -(i ? legA * 0.4 : legA) : a;
    l.low.pivot.rotation.x = Math.max(0, knee + (a < 0 ? -a * 0.9 : 0.15 * sp));
  });
  rig.arms.forEach((a, i) => {
    const sw = i ? -armA : armA;
    a.up.pivot.rotation.x = armUp ? -armUp : sw;
    a.low.pivot.rotation.x = armUp ? -0.2 : -0.4 * sp - 0.1;
  });
  if (rig.crownTip) rig.crownTip.emissiveIntensity = 2.5 + Math.sin(t * 5) * 0.8;
}

// ---------- The Girl in the Yellow Dress ----------
export function makeGirl() {
  const root = new THREE.Group(); const body = new THREE.Group(); root.add(body);
  const skin = std(0xe8b896, { roughness: 0.7 });
  const hair = std(0x5a3218, { roughness: 0.75 });
  const dress = std(0xffd23a, { roughness: 0.55, emissive: 0x3a2a00, emissiveIntensity: 0.25 });
  const flats = std(0xff7ab8, { roughness: 0.4 });
  const hips = new THREE.Group(); hips.position.y = 0.88; body.add(hips);
  const torso = new THREE.Group(); hips.add(torso);
  mesh(new THREE.CylinderGeometry(0.17, 0.15, 0.42, 14), dress, torso, [0, 0.25, 0], [0, 0, 0], [1, 1, 0.75]);
  mesh(new THREE.CylinderGeometry(0.15, 0.36, 0.55, 18, 1, true), new THREE.MeshStandardMaterial({ color: 0xffd23a, roughness: 0.55, side: THREE.DoubleSide, emissive: 0x3a2a00, emissiveIntensity: 0.25 }), hips, [0, -0.2, 0]);
  for (const s of [-1, 1]) mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.12, 4), dress, torso, [s * 0.1, 0.48, 0]); // straps
  const head = new THREE.Group(); head.position.set(0, 0.66, 0); torso.add(head);
  mesh(new THREE.CylinderGeometry(0.045, 0.05, 0.1, 8), skin, torso, [0, 0.56, 0]);
  mesh(new THREE.SphereGeometry(0.13, 18, 14), skin, head, [0, 0, 0], [0, 0, 0], [0.92, 1.05, 0.95]);
  // face: hazel eyes, brows, smile
  const eyeW = std(0xffffff, { roughness: 0.3 }), eyeH = std(0x7a6a2a, { roughness: 0.2, emissive: 0x1a1400 });
  for (const s of [-1, 1]) {
    mesh(new THREE.SphereGeometry(0.022, 10, 8), eyeW, head, [s * 0.045, 0.015, 0.105], [0, 0, 0], [1, 0.8, 0.5]);
    mesh(new THREE.SphereGeometry(0.012, 8, 6), eyeH, head, [s * 0.045, 0.015, 0.117]);
    mesh(new THREE.BoxGeometry(0.035, 0.006, 0.006), hair, head, [s * 0.045, 0.048, 0.11], [0, 0, s * -0.15]);
  }
  mesh(new THREE.TorusGeometry(0.025, 0.005, 4, 10, Math.PI), std(0xc0505a), head, [0, -0.045, 0.112], [0, 0, Math.PI]);
  // brown hair: cap + long back
  mesh(new THREE.SphereGeometry(0.142, 18, 12, 0, Math.PI * 2, 0, Math.PI * 0.55), hair, head, [0, 0.01, -0.01], [-0.25, 0, 0]);
  mesh(new THREE.BoxGeometry(0.26, 0.34, 0.08), hair, head, [0, -0.13, -0.08], [0.1, 0, 0]);
  for (const s of [-1, 1]) mesh(new THREE.BoxGeometry(0.05, 0.28, 0.07), hair, head, [s * 0.12, -0.09, 0.0]);
  const arms = [];
  for (const s of [-1, 1]) {
    const up = limb(torso, 0.27, 0.04, 0.035, skin, [s * 0.2, 0.44, 0]); up.pivot.rotation.z = s * 0.15;
    const low = limb(up.pivot, 0.26, 0.035, 0.03, skin, [0, -0.27, 0]);
    arms.push({ up, low, s });
  }
  const legs = [];
  for (const s of [-1, 1]) {
    const up = limb(hips, 0.42, 0.055, 0.045, skin, [s * 0.08, -0.05, 0]);
    const low = limb(up.pivot, 0.4, 0.045, 0.035, skin, [0, -0.42, 0]);
    mesh(new THREE.BoxGeometry(0.08, 0.05, 0.17), flats, low.pivot, [0, -0.41, 0.03]);
    legs.push({ up, low, s });
  }
  root.scale.setScalar(0.95);
  const rig = { root, body, hips, torso, head, arms, legs };
  rig.animate = (t, dt, state) => animateHumanoid(rig, t, dt, state);
  return rig;
}

// ---------- Shadow Man ----------
export function makeShadowMan() {
  const root = new THREE.Group(); const body = new THREE.Group(); root.add(body);
  const shadow = new THREE.MeshStandardMaterial({ color: 0x020005, roughness: 1, metalness: 0, emissive: 0x0a0016, emissiveIntensity: 1 });
  const aura = new THREE.MeshBasicMaterial({ color: 0x5a1aa8, transparent: true, opacity: 0.18, side: THREE.BackSide, depthWrite: false });
  const teeth = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 3.2 });
  const hips = new THREE.Group(); hips.position.y = 1.35; body.add(hips);
  const torso = new THREE.Group(); hips.add(torso);
  const chest = mesh(new THREE.CylinderGeometry(0.42, 0.22, 1.05, 14), shadow, torso, [0, 0.5, 0], [0, 0, 0], [1, 1, 0.6]);
  mesh(new THREE.CylinderGeometry(0.47, 0.27, 1.12, 14), aura, torso, [0, 0.5, 0], [0, 0, 0], [1, 1, 0.66]).castShadow = false;
  // tattered shadow cloak bottom
  for (let i = 0; i < 9; i++) {
    const a = (i / 9) * Math.PI * 2;
    mesh(new THREE.ConeGeometry(0.12, 0.9 + Math.random() * 0.4, 5), shadow, hips, [Math.cos(a) * 0.2, -0.35, Math.sin(a) * 0.14], [Math.PI, 0, 0]);
  }
  const head = new THREE.Group(); head.position.set(0, 1.2, 0); torso.add(head);
  mesh(new THREE.SphereGeometry(0.27, 18, 14), shadow, head, [0, 0, 0], [0, 0, 0], [0.9, 1.1, 0.9]);
  mesh(new THREE.SphereGeometry(0.31, 14, 10), aura, head).castShadow = false;
  // fedora
  mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.03, 24), shadow, head, [0, 0.2, 0], [-0.08, 0, 0.05]);
  mesh(new THREE.CylinderGeometry(0.22, 0.27, 0.3, 18), shadow, head, [0, 0.36, 0], [-0.08, 0, 0.05]);
  mesh(new THREE.CylinderGeometry(0.275, 0.275, 0.05, 18), std(0x14001f, { emissive: 0x2a0050, emissiveIntensity: 0.6 }), head, [0, 0.25, 0], [-0.08, 0, 0.05]);
  // jagged glowing grin
  const grin = new THREE.Group(); grin.position.set(0, -0.08, 0.22); head.add(grin);
  const N = 11;
  for (let i = 0; i < N; i++) {
    const u = (i / (N - 1)) * 2 - 1;
    const x = u * 0.17, y = u * u * 0.06;
    const top = mesh(new THREE.ConeGeometry(0.018, 0.07 + Math.random() * 0.03, 4), teeth, grin, [x, y + 0.035, 0.03 - Math.abs(u) * 0.06], [Math.PI, 0, 0]);
    const bot = mesh(new THREE.ConeGeometry(0.016, 0.06 + Math.random() * 0.03, 4), teeth, grin, [x + 0.012, y - 0.035, 0.03 - Math.abs(u) * 0.06]);
    top.castShadow = bot.castShadow = false;
  }
  // arms
  const arms = [];
  for (const s of [-1, 1]) {
    const up = limb(torso, 0.65, 0.09, 0.07, shadow, [s * 0.45, 0.95, 0]); up.pivot.rotation.z = s * 0.2;
    const low = limb(up.pivot, 0.65, 0.07, 0.04, shadow, [0, -0.65, 0]);
    for (let f = -1; f <= 1; f++) mesh(new THREE.ConeGeometry(0.02, 0.22, 4), shadow, low.pivot, [f * 0.03, -0.75, 0], [Math.PI, 0, 0]);
    arms.push({ up, low, s });
  }
  // neon peacock feather in right hand
  const feather = makePeacockFeather(); feather.position.set(0, -0.72, 0.05); feather.rotation.x = -0.4;
  arms[1].low.pivot.add(feather);
  const legs = [];
  for (const s of [-1, 1]) {
    const up = limb(hips, 0.7, 0.11, 0.08, shadow, [s * 0.16, -0.05, 0]);
    const low = limb(up.pivot, 0.65, 0.08, 0.05, shadow, [0, -0.7, 0]);
    legs.push({ up, low, s });
  }
  const rig = { root, body, hips, torso, head, arms, legs, feather, teeth, shadow, aura };
  rig.animate = (t, dt, st) => {
    animateHumanoid(rig, t, dt, st);
    rig.body.position.y = 0.15 + Math.sin(t * 1.7) * 0.12; // floats
    teeth.emissiveIntensity = st.mode === 'stunned' ? 0.6 + Math.random() * 0.4 : 3 + Math.sin(t * 9) * 0.5;
    if (st.mode === 'stunned') { rig.torso.rotation.x = 0.6; rig.head.rotation.z = Math.sin(t * 5) * 0.3; }
    else rig.head.rotation.z = 0;
    if (st.mode === 'feather') rig.arms[1].up.pivot.rotation.x = -2.6 + Math.sin(t * 20) * 0.1;
    if (st.mode === 'throw') rig.arms[0].up.pivot.rotation.x = -1.6 + Math.sin(t * 12) * 0.6;
  };
  root.scale.setScalar(1.35);
  return rig;
}

export function makePeacockFeather(scale = 1) {
  const g = new THREE.Group();
  const curve = new THREE.CatmullRomCurve3([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0.03, 0.35, 0), new THREE.Vector3(-0.02, 0.75, 0.02), new THREE.Vector3(0.05, 1.05, 0)]);
  const stemMat = new THREE.MeshStandardMaterial({ color: 0x9fffe0, emissive: 0x30ffc0, emissiveIntensity: 2 });
  g.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 16, 0.008, 5), stemMat));
  // barbs
  const barbMat = new THREE.MeshStandardMaterial({ color: 0x0cf, emissive: 0x00b0ff, emissiveIntensity: 1.6, transparent: true, opacity: 0.85, side: THREE.DoubleSide });
  const vane = new THREE.Mesh(new THREE.CircleGeometry(0.2, 20), barbMat); vane.scale.set(0.8, 1.6, 1); vane.position.set(0.03, 0.78, 0); g.add(vane);
  const rings = [[0.12, 0x10ff70, 1.8], [0.085, 0xffd040, 2.2], [0.06, 0x2040ff, 2.5], [0.035, 0x0a0040, 0.8]];
  rings.forEach(([r, c, e], i) => {
    const m = new THREE.Mesh(new THREE.CircleGeometry(r, 20), new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: e, side: THREE.DoubleSide }));
    m.scale.set(0.85, 1.1, 1); m.position.set(0.03, 0.86, 0.004 * (i + 1)); g.add(m);
  });
  g.scale.setScalar(scale);
  return g;
}

// ---------- Maine Coon cat sidekick ----------
export function makeCat() {
  const root = new THREE.Group(); const body = new THREE.Group(); root.add(body);
  const fur = std(0x0a0a0c, { roughness: 1 });
  const hoodie = std(0x141418, { roughness: 0.9 });
  const torso = new THREE.Group(); torso.position.y = 0.35; body.add(torso);
  mesh(new THREE.SphereGeometry(0.22, 14, 10), hoodie, torso, [0, 0, 0], [0, 0, 0], [0.95, 0.9, 1.5]);
  // fluff tufts
  for (let i = 0; i < 10; i++) mesh(new THREE.SphereGeometry(0.07 + Math.random() * 0.03, 6, 5), fur, torso, [(Math.random() - 0.5) * 0.35, -0.12 + Math.random() * 0.06, (Math.random() - 0.5) * 0.55]);
  const head = new THREE.Group(); head.position.set(0, 0.18, 0.32); torso.add(head);
  mesh(new THREE.SphereGeometry(0.15, 16, 12), fur, head, [0, 0, 0], [0, 0, 0], [1.1, 0.95, 1]);
  mesh(new THREE.SphereGeometry(0.075, 10, 8), fur, head, [0, -0.04, 0.11], [0, 0, 0], [1.2, 0.8, 0.9]); // muzzle
  mesh(new THREE.SphereGeometry(0.018, 6, 5), std(0x331a22), head, [0, -0.01, 0.18]);
  // ruff (mane)
  for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2; mesh(new THREE.SphereGeometry(0.06, 6, 5), fur, head, [Math.cos(a) * 0.15, -0.09 + Math.sin(a) * 0.05, -0.02]); }
  // hood up with ears poking
  mesh(new THREE.SphereGeometry(0.175, 16, 12, Math.PI * 0.6, Math.PI * 1.8, 0, Math.PI * 0.62), new THREE.MeshStandardMaterial({ color: 0x141418, roughness: 0.9, side: THREE.DoubleSide }), head, [0, 0.02, -0.02]);
  for (const s of [-1, 1]) {
    mesh(new THREE.ConeGeometry(0.05, 0.14, 4), fur, head, [s * 0.08, 0.17, 0], [0, 0, s * -0.25]);
    mesh(new THREE.ConeGeometry(0.012, 0.07, 3), fur, head, [s * 0.09, 0.26, 0], [0, 0, s * -0.25]); // lynx tufts
  }
  makeShades(head, 0.7, 0.13).position.y = 0.02;
  // legs
  const legs = [];
  for (const [x, z] of [[-0.1, 0.18], [0.1, 0.18], [-0.1, -0.18], [0.1, -0.18]]) {
    const p = new THREE.Group(); p.position.set(x, -0.08, z); torso.add(p);
    mesh(new THREE.CylinderGeometry(0.045, 0.04, 0.26, 8), fur, p, [0, -0.13, 0]);
    mesh(new THREE.SphereGeometry(0.05, 8, 6), fur, p, [0, -0.26, 0.01]);
    legs.push(p);
  }
  // huge bushy tail
  const tail = new THREE.Group(); tail.position.set(0, 0.05, -0.3); torso.add(tail);
  const segs = [];
  let parent = tail;
  for (let i = 0; i < 6; i++) {
    const s = new THREE.Group(); s.position.set(0, i ? 0.1 : 0, i ? -0.04 : 0); parent.add(s);
    mesh(new THREE.SphereGeometry(0.08 - i * 0.003, 8, 6), fur, s, [0, 0.05, 0], [0, 0, 0], [1, 1.2, 1]);
    segs.push(s); parent = s;
  }
  root.scale.setScalar(1.15);
  const rig = { root, body, head, legs, tail: segs };
  rig.animate = (t, dt, st) => {
    const sp = Math.min(st.speed / 6, 1.3);
    rig.phase = (rig.phase || 0) + dt * (3 + sp * 12) * (sp > 0.05 ? 1 : 0);
    legs.forEach((l, i) => { l.rotation.x = Math.sin(rig.phase + (i === 0 || i === 3 ? 0 : Math.PI)) * 0.7 * sp; });
    body.position.y = Math.abs(Math.sin(rig.phase)) * 0.04 * sp;
    segs.forEach((s, i) => { s.rotation.x = -0.35 + Math.sin(t * 3 + i * 0.6) * 0.08; s.rotation.z = Math.sin(t * 2.2 + i * 0.5) * 0.12; });
    head.rotation.y = st.look || 0;
  };
  return rig;
}

// ---------- GLB swap-in (graceful when files are missing) ----------
const loader = new GLTFLoader();
export function tryGLB(rig, url, height, onReady) {
  fetch(url, { method: 'HEAD' }).then(r => {
    if (!r.ok) return;
    loader.load(url, gltf => {
      const model = gltf.scene;
      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());
      const s = height / Math.max(size.y, 0.001);
      model.scale.setScalar(s);
      box.setFromObject(model);
      model.position.y -= box.min.y;
      const c = box.getCenter(new THREE.Vector3()); model.position.x -= c.x; model.position.z -= c.z;
      model.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
      rig.body.visible = false;
      rig.glb = model;
      rig.root.add(model);
      if (gltf.animations && gltf.animations.length) {
        rig.mixer = new THREE.AnimationMixer(model);
        rig.clips = gltf.animations;
        rig.mixer.clipAction(gltf.animations[0]).play();
      }
      const base = rig.animate;
      rig.animate = (t, dt, st) => {
        base(t, dt, st);
        if (rig.mixer) rig.mixer.update(dt * (0.5 + Math.min(st.speed / 6, 1)));
        else model.position.y = Math.abs(Math.sin((rig.phase || 0))) * 0.05;
      };
      onReady && onReady(model);
    }, undefined, () => {});
  }).catch(() => {});
}
