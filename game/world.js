// Level construction: builder API, hand-made Level 1, and the seeded chunk generator for levels 2-369.
import * as THREE from 'three';
import { Reflector } from 'three/addons/objects/Reflector.js';
import { difficulty, isBossLevel, worldOf, levelInWorld } from './themes.js';

// ---------- seeded RNG ----------
export function mulberry32(seed) {
  let a = seed >>> 0;
  return () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

// ---------- shared textures / geos ----------
let _glow = null;
export function glowTexture() {
  if (_glow) return _glow;
  const c = document.createElement('canvas'); c.width = c.height = 64;
  const g = c.getContext('2d'); const rg = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  rg.addColorStop(0, 'rgba(255,255,255,1)'); rg.addColorStop(0.25, 'rgba(255,255,255,0.5)'); rg.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = rg; g.fillRect(0, 0, 64, 64);
  _glow = new THREE.CanvasTexture(c); return _glow;
}
export function signTexture(text, color) {
  const c = document.createElement('canvas'); c.width = 512; c.height = 128;
  const g = c.getContext('2d');
  g.font = 'bold 84px "Arial Black", Impact, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.shadowColor = color; g.shadowBlur = 24; g.fillStyle = '#fff'; g.fillText(text, 256, 66);
  g.shadowBlur = 8; g.fillStyle = color; g.fillText(text, 256, 66);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
function procWallTexture(kind) {
  const c = document.createElement('canvas'); c.width = 256; c.height = 128; const g = c.getContext('2d');
  if (kind === 'stone') {
    g.fillStyle = '#1a140e'; g.fillRect(0, 0, 256, 128);
    for (let i = 0; i < 40; i++) { const v = 30 + Math.random() * 30; g.fillStyle = `rgb(${v + 10},${v},${v - 8})`; g.fillRect(Math.random() * 256, Math.random() * 128, 20 + Math.random() * 40, 12 + Math.random() * 20); }
  } else if (kind === 'metal') {
    g.fillStyle = '#10141e'; g.fillRect(0, 0, 256, 128);
    for (let x = 0; x < 256; x += 32) { g.fillStyle = '#1a2030'; g.fillRect(x, 0, 30, 128); g.fillStyle = '#29e0ff'; g.globalAlpha = 0.15; g.fillRect(x + 14, 0, 2, 128); g.globalAlpha = 1; }
  } else {
    g.fillStyle = '#1a0d14'; g.fillRect(0, 0, 256, 128);
    for (let y = 0; y < 8; y++) for (let x = -1; x < 9; x++) { const ox = (y % 2) * 16; const v = 30 + Math.random() * 25; g.fillStyle = `rgb(${v + 20},${v * 0.45},${v * 0.55})`; g.fillRect(x * 32 + ox + 1, y * 16 + 1, 30, 14); }
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; return t;
}

// sky: procedural nebula/gradient or the game-art panorama with a tint, plus optional sun
export function makeSky(theme, tex) {
  const s = theme.sky;
  const mat = new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false, fog: false,
    uniforms: {
      uTime: { value: 0 }, uTex: { value: tex || null }, uHasTex: { value: s.tex && tex ? 1 : 0 }, uTint: { value: new THREE.Color(s.tint || 0xffffff) },
      uTop: { value: new THREE.Color(s.top || 0x010004) }, uBot: { value: new THREE.Color(s.bot || 0x1a0428) }, uNeb1: { value: new THREE.Color(s.neb1 || 0xd81e9a) }, uNeb2: { value: new THREE.Color(s.neb2 || 0x2640f0) },
      uStars: { value: s.stars ?? 1 }, uSun: { value: new THREE.Vector3(...(s.sun || [0, -1, 0])).normalize() }, uSunOn: { value: s.sun ? 1 : 0 }, uSunCol: { value: new THREE.Color(s.sunCol || 0xffffff) },
    },
    vertexShader: `varying vec3 vDir; void main(){ vDir = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
    fragmentShader: `
      varying vec3 vDir; uniform float uTime, uHasTex, uStars, uSunOn; uniform sampler2D uTex; uniform vec3 uTint, uTop, uBot, uNeb1, uNeb2, uSun, uSunCol;
      float h(vec3 p){ p = fract(p*0.3183099+.1); p*=17.0; return fract(p.x*p.y*p.z*(p.x+p.y+p.z)); }
      float n(vec3 x){ vec3 i=floor(x); vec3 f=fract(x); f=f*f*(3.0-2.0*f);
        return mix(mix(mix(h(i),h(i+vec3(1,0,0)),f.x),mix(h(i+vec3(0,1,0)),h(i+vec3(1,1,0)),f.x),f.y),
                   mix(mix(h(i+vec3(0,0,1)),h(i+vec3(1,0,1)),f.x),mix(h(i+vec3(0,1,1)),h(i+vec3(1,1,1)),f.x),f.y),f.z); }
      float fbm(vec3 p){ float v=0.0,a=0.5; for(int i=0;i<5;i++){ v+=a*n(p); p*=2.03; a*=0.5;} return v; }
      void main(){
        vec3 d = normalize(vDir); vec3 col;
        float up = clamp(d.y*0.5+0.5, 0.0, 1.0);
        if (uHasTex > 0.5) {
          vec2 uv = vec2(atan(d.z, d.x) / 6.2831853 + 0.5, asin(clamp(d.y,-1.0,1.0)) / 3.14159265 + 0.5);
          col = texture2D(uTex, uv).rgb * uTint * 1.1;
        } else {
          col = mix(uBot, uTop, pow(clamp(d.y*1.2+0.15,0.0,1.0), 0.7));
          float neb = fbm(d*2.2 + vec3(0.0, 0.0, uTime*0.004)); float neb2 = fbm(d*4.5 + vec3(3.1));
          col += uNeb1 * smoothstep(0.5,0.9,neb) * 0.45 * (0.3+up);
          col += uNeb2 * smoothstep(0.55,0.92,neb2) * 0.4 * up;
          float s = h(floor(d*420.0)); col += vec3(1.0) * step(0.9975, s) * uStars * up;
        }
        if (uSunOn > 0.5) { float k = max(dot(d, uSun), 0.0); col += uSunCol * (pow(k, 400.0) * 3.0 + pow(k, 12.0) * 0.6); }
        gl_FragColor = vec4(col, 1.0);
      }`
  });
  const sky = new THREE.Mesh(new THREE.SphereGeometry(400, 32, 16), mat);
  sky.frustumCulled = false; sky.renderOrder = -1;
  return sky;
}

// broken-heart collectible
let _heartGeo = null;
function brokenHeartGeos() {
  if (_heartGeo) return _heartGeo;
  const zig = [[0, -17], [1.6, -13], [-1.4, -9], [1.8, -5], [-1.2, -1], [1.4, 3], [0, 5]];
  const half = (sx) => {
    const s = new THREE.Shape(); const pts = [];
    for (let i = 0; i <= 24; i++) { const t = (i / 24) * Math.PI; pts.push([sx * 16 * Math.pow(Math.sin(t), 3), 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)]); }
    s.moveTo(pts[0][0], pts[0][1]); pts.slice(1).forEach(p => s.lineTo(p[0], p[1])); zig.forEach(p => s.lineTo(p[0], p[1]));
    const g = new THREE.ExtrudeGeometry(s, { depth: 4, bevelEnabled: true, bevelThickness: 1.2, bevelSize: 1, bevelSegments: 2 });
    g.translate(0, 6, -2); g.scale(0.022, 0.022, 0.022); return g;
  };
  _heartGeo = [half(1), half(-1)]; return _heartGeo;
}
const heartMat = new THREE.MeshStandardMaterial({ color: 0xff3fa0, emissive: 0xff1a8c, emissiveIntensity: 2.2, roughness: 0.2, metalness: 0.2 });
export function makeBrokenHeart(mat = heartMat, glowCol = 0xff3fa0) {
  const [r, l] = brokenHeartGeos(); const g = new THREE.Group();
  const a = new THREE.Mesh(r, mat), b = new THREE.Mesh(l, mat);
  a.position.x = 0.04; b.position.x = -0.04; a.rotation.z = -0.08; b.rotation.z = 0.08; g.add(a, b);
  const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture(), color: glowCol, transparent: true, opacity: 0.55, depthWrite: false, blending: THREE.AdditiveBlending }));
  glow.scale.setScalar(1.4); g.add(glow); return g;
}
const packMat = new THREE.MeshStandardMaterial({ color: 0x7dffb0, emissive: 0x2aff8a, emissiveIntensity: 2.0, roughness: 0.2 });
function makeHealthPack() { // whole (mended) heart with a plus
  const g = new THREE.Group();
  const s = new THREE.Shape(); for (let i = 0; i <= 48; i++) { const t = (i / 48) * Math.PI * 2; const x = 16 * Math.pow(Math.sin(t), 3), y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t); i ? s.lineTo(x, y) : s.moveTo(x, y); }
  const geo = new THREE.ExtrudeGeometry(s, { depth: 5, bevelEnabled: true, bevelThickness: 1.5, bevelSize: 1, bevelSegments: 2 }); geo.translate(0, 6, -2.5); geo.scale(0.022, 0.022, 0.022);
  g.add(new THREE.Mesh(geo, packMat));
  const w = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const a = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.08, 0.16), w); a.position.set(0, 0.12, 0.02); const b = a.clone(); b.rotation.z = Math.PI / 2; g.add(a, b);
  const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture(), color: 0x2aff8a, transparent: true, opacity: 0.6, depthWrite: false, blending: THREE.AdditiveBlending })); glow.scale.setScalar(1.6); g.add(glow);
  return g;
}
function makeCatItem(type) {
  const g = new THREE.Group();
  if (type === 'kittens') {
    const fur = new THREE.MeshStandardMaterial({ color: 0x0c0c10, roughness: 1, emissive: 0x220014, emissiveIntensity: 0.5 });
    const body = new THREE.Mesh(new THREE.SphereGeometry(0.16, 10, 8), fur); body.scale.set(1, 0.85, 1.3); body.position.y = 0.16; g.add(body);
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.12, 10, 8), fur); head.position.set(0, 0.32, 0.16); g.add(head);
    for (const s of [-1, 1]) { const e = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.09, 4), fur); e.position.set(s * 0.06, 0.44, 0.16); g.add(e); const eye = new THREE.Mesh(new THREE.SphereGeometry(0.02, 6, 4), new THREE.MeshBasicMaterial({ color: 0x9bff3a })); eye.position.set(s * 0.045, 0.34, 0.27); g.add(eye); }
    const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.05, 0.3, 6), fur); tail.position.set(0, 0.3, -0.22); tail.rotation.x = -0.6; g.add(tail);
  } else if (type === 'notes') {
    const m = new THREE.MeshStandardMaterial({ color: 0x29e0ff, emissive: 0x29e0ff, emissiveIntensity: 2.5 });
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.13, 10, 8), m); head.scale.set(1.3, 0.9, 0.6); head.position.y = 0.2; g.add(head);
    const stem = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.55, 0.04), m); stem.position.set(0.14, 0.45, 0); g.add(stem);
    const flag = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.06, 0.04), m); flag.position.set(0.22, 0.68, 0); flag.rotation.z = -0.5; g.add(flag);
  } else {
    const m = new THREE.MeshStandardMaterial({ color: 0xf6c445, metalness: 1, roughness: 0.25, emissive: 0x664400, emissiveIntensity: 0.8 });
    const band = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.12, 16, 1, true), m); band.position.y = 0.2; g.add(band);
    for (let i = 0; i < 5; i++) { const a = (i / 5) * Math.PI * 2; const c = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.16, 4), m); c.position.set(Math.cos(a) * 0.2, 0.33, Math.sin(a) * 0.2); g.add(c); const tip = new THREE.Mesh(new THREE.SphereGeometry(0.025, 6, 4), new THREE.MeshBasicMaterial({ color: 0x40e0ff })); tip.position.set(Math.cos(a) * 0.2, 0.42, Math.sin(a) * 0.2); g.add(tip); }
  }
  const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture(), color: type === 'kittens' ? 0x9bff3a : type === 'notes' ? 0x29e0ff : 0xffd23a, transparent: true, opacity: 0.5, depthWrite: false, blending: THREE.AdditiveBlending }));
  glow.scale.setScalar(1.2); glow.position.y = 0.3; g.add(glow);
  return g;
}

const UNIT = new THREE.BoxGeometry(1, 1, 1);
const CYL = new THREE.CylinderGeometry(1, 1, 1, 8);

// ======================================================================
export function buildLevel({ scene, Q, renderer, n, theme, TEX, story }) {
  const root = new THREE.Group(); scene.add(root);
  const rng = mulberry32(n * 7919 + 17);
  const d = difficulty(n);
  const pal = theme.palette;
  const L = { n, theme, root, d, colliders: [], ramps: [], bars: [], hearts: [], heartSlots: [], hiddenSlots: [], wisps: [], movers: [], swings: [], hazards: [], packs: [], catItems: [], switches: [], gates: [], keys: [], doors: [], checkpoints: [], anims: [], arenas: [], exit: null, arena: null, killY: theme.ground === 'void' ? theme.killY : -50, start: new THREE.Vector3(0, 0, 8), keysHeld: 0, minZ: 0, maxZ: 20 };
  const add = (o) => { root.add(o); return o; };

  // materials (per level)
  const neonCache = {};
  const neon = (c, i = 2.5) => neonCache[c + '_' + i] || (neonCache[c + '_' + i] = new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: i, roughness: 0.3 }));
  const platMat = new THREE.MeshStandardMaterial({ color: TEX.metal ? 0x4a3a5c : 0x151022, roughness: 0.35, metalness: 0.3, map: TEX.metal || null });
  if (TEX.metal) { TEX.metal.wrapS = TEX.metal.wrapT = THREE.RepeatWrapping; TEX.metal.colorSpace = THREE.SRGBColorSpace; }
  const wallTex = theme.wall === 'brick' && TEX.brick ? TEX.brick : procWallTexture(theme.wall || 'brick');
  wallTex.wrapS = wallTex.wrapT = THREE.RepeatWrapping; wallTex.colorSpace = THREE.SRGBColorSpace;
  const wallMat = new THREE.MeshStandardMaterial({ map: wallTex, roughness: 0.85, color: theme.wall === 'brick' ? 0xffffff : 0xb0b0b8 });
  const floorMat = new THREE.MeshStandardMaterial({ color: theme.groundTint, roughness: 0.45, metalness: 0.2, map: TEX.rubber || null });
  if (TEX.rubber) { TEX.rubber.wrapS = TEX.rubber.wrapT = THREE.RepeatWrapping; TEX.rubber.colorSpace = THREE.SRGBColorSpace; }
  const buildingMat = new THREE.MeshStandardMaterial({ color: 0x1a1420, roughness: 0.8, emissive: 0x0a0610, emissiveIntensity: 1 });
  L.cageMat = new THREE.MeshStandardMaterial({ color: 0x05000a, emissive: 0x4a0a90, emissiveIntensity: 1.4, roughness: 0.4 });

  // ---------------- builder API ----------------
  const api = { rng, d, theme, pal, L, n,
    r: (a, b) => a + (b - a) * rng(), ri: (a, b) => Math.floor(a + (b - a + 1) * rng()), pick: (arr) => arr[Math.floor(rng() * arr.length)],
  };
  const boxMesh = (x, y, z, w, h, dd, mat) => { const m = new THREE.Mesh(UNIT, mat); m.scale.set(w, h, dd); m.position.set(x, y + h / 2, z); m.castShadow = true; m.receiveShadow = true; return add(m); };
  api.box = (x, y, z, w, h, dd, mat = platMat, solid = true) => {
    const m = boxMesh(x, y, z, w, h, dd, mat);
    if (solid) L.colliders.push({ min: new THREE.Vector3(x - w / 2, y, z - dd / 2), max: new THREE.Vector3(x + w / 2, y + h, z + dd / 2), mesh: m });
    return m;
  };
  api.trim = (x, top, z, w, dd, c) => { const t = new THREE.Mesh(UNIT, neon(c, 2.2)); t.scale.set(w + 0.06, 0.06, dd + 0.06); t.position.set(x, top - 0.02, z); return add(t); };
  api.plat = (x, top, z, w, dd, c = pal[0], h = 0.4) => { const m = api.box(x, top - h, z, w, h, dd); api.trim(x, top, z, w, dd, c); return m; };
  api.tube = (a, b, r, mat) => {
    const va = new THREE.Vector3(...a), vb = new THREE.Vector3(...b); const len = va.distanceTo(vb);
    const m = new THREE.Mesh(CYL, mat); m.scale.set(r, len, r); m.position.copy(va).add(vb).multiplyScalar(0.5);
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), vb.clone().sub(va).normalize()); m.castShadow = true; return add(m);
  };
  api.neon = neon;
  // ground tile: in void worlds it is a real floating floor / rooftop; in solid worlds the big ground plane already exists
  api.floor = (x0, x1, z0, z1) => {
    if (theme.ground !== 'void') return;
    const w = x1 - x0, dd = Math.abs(z1 - z0), cx = (x0 + x1) / 2, cz = (z0 + z1) / 2, depth = theme.floorDepth || 0.7;
    api.box(cx, -depth, cz, w, depth, dd, theme.decor === 'rooftops' ? buildingMat : floorMat);
    api.trim(cx, 0.0, cz, w, dd, pal[1]);
    if (theme.decor === 'rooftops' && Q && !Q.low) { // windows on building sides
      for (let i = 0; i < 6; i++) { const wy = -2 - i * 4; const wm = new THREE.Mesh(UNIT, neon(i % 2 ? 0xffd27a : 0xff9ac0, 1.2)); wm.scale.set(w * 0.8, 0.5, 0.05); wm.position.set(cx, wy, Math.max(z0, z1) + 0.03); add(wm); }
    }
  };
  // a gap: in solid worlds a shadow pool that bites, in void worlds simply nothing (fall = damage)
  api.hazard = (x0, x1, z0, z1) => {
    if (theme.ground === 'void') return;
    const w = x1 - x0, dd = Math.abs(z1 - z0);
    const pool = new THREE.Mesh(new THREE.PlaneGeometry(w, dd), new THREE.MeshStandardMaterial({ color: 0x220040, emissive: 0x5a1aa8, emissiveIntensity: 0.7, roughness: 0.05, metalness: 0.5, transparent: true, opacity: 0.88 }));
    pool.rotation.x = -Math.PI / 2; pool.position.set((x0 + x1) / 2, 0.02, (z0 + z1) / 2); add(pool);
    L.hazards.push({ minX: x0, maxX: x1, minZ: Math.min(z0, z1), maxZ: Math.max(z0, z1) });
  };
  api.heartSlot = (x, y, z, w = 1) => L.heartSlots.push({ p: new THREE.Vector3(x, y, z), w });
  api.hiddenSlot = (x, y, z) => { if (theme.ground === 'void' && y <= 0.01) api.plat(x, 0, z, 2, 2, pal[3]); L.hiddenSlots.push(new THREE.Vector3(x, y, z)); };
  api.heart = (x, y, z) => { const h = makeBrokenHeart(); h.position.set(x, y, z); add(h); L.hearts.push({ obj: h, base: y, taken: false }); };
  api.wisp = (x, y, z, r = 1.5, speed = 1, arena = null) => {
    const g = new THREE.Group();
    const core = new THREE.Mesh(new THREE.IcosahedronGeometry(0.32, 1), new THREE.MeshStandardMaterial({ color: 0x1a0030, emissive: 0x7a2bff, emissiveIntensity: 2.4, roughness: 0.2, flatShading: true }));
    const spark = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 6), new THREE.MeshBasicMaterial({ color: 0xffffff }));
    const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture(), color: 0x9a4dff, transparent: true, opacity: 0.8, depthWrite: false, blending: THREE.AdditiveBlending })); halo.scale.setScalar(2);
    const face = new THREE.Sprite(new THREE.SpriteMaterial({ map: TEX.wisp || null, transparent: true, depthWrite: false, opacity: TEX.wisp ? 1 : 0 })); face.scale.setScalar(1.5);
    if (TEX.wisp) core.scale.setScalar(0.55);
    g.add(core, spark, halo, face); g.position.set(x, y, z); add(g);
    const w = { obj: g, core, spark, face, home: new THREE.Vector3(x, y, z), r, speed, phase: rng() * 6, alive: true, dying: 0, arena };
    L.wisps.push(w); return w;
  };
  api.pack = (x, y, z) => { const p = makeHealthPack(); p.position.set(x, y, z); add(p); L.packs.push({ obj: p, base: y, taken: false }); };
  api.bar = (a, b, c = pal[1]) => { // monkey bars between a and b (same height)
    const A = new THREE.Vector3(...a), B = new THREE.Vector3(...b); const dir = B.clone().sub(A).normalize(); const side = new THREE.Vector3(-dir.z, 0, dir.x).multiplyScalar(0.5);
    const bm = neon(c, 1.8), rm = neon(pal[0], 1.3);
    for (const s of [-1, 1]) { const o = side.clone().multiplyScalar(s); api.tube([A.x + o.x, A.y, A.z + o.z], [B.x + o.x, B.y, B.z + o.z], 0.05, bm); api.tube([A.x + o.x, A.y, A.z + o.z], [A.x + o.x, A.y - 5, A.z + o.z], 0.06, bm); api.tube([B.x + o.x, B.y, B.z + o.z], [B.x + o.x, B.y - 5, B.z + o.z], 0.06, bm); }
    const len = A.distanceTo(B); for (let t = 0; t <= len; t += 0.7) { const p = A.clone().addScaledVector(dir, t); api.tube([p.x - side.x, p.y, p.z - side.z], [p.x + side.x, p.y, p.z + side.z], 0.035, rm); }
    L.bars.push({ a: A, b: B });
  };
  api.mover = (x, y, z, ax, amp, spd, c = pal[1], w = 2.4) => {
    const m = api.box(x, y - 0.35, z, w, 0.35, w); const t = api.trim(x, y, z, w, w, c);
    const col = L.colliders[L.colliders.length - 1];
    const mv = { m, t, col, w, base: new THREE.Vector3(x, y, z), ax, amp, spd, delta: new THREE.Vector3(), ph: rng() * 6 }; col.mover = mv; L.movers.push(mv); return mv;
  };
  api.ramp = (x, z0, z1, y0, y1, c = pal[0]) => {
    const len = Math.hypot(z0 - z1, y0 - y1);
    const r = new THREE.Mesh(UNIT, new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: 0.35, metalness: 0.3, roughness: 0.3, map: TEX.metal || null }));
    r.scale.set(1.6, 0.12, len); r.position.set(x, (y0 + y1) / 2 - 0.06, (z0 + z1) / 2); r.rotation.x = -Math.atan2(y0 - y1, z0 - z1); r.castShadow = r.receiveShadow = true; add(r);
    for (const sx of [-0.8, 0.8]) api.tube([x + sx, y0 + 0.35, z0], [x + sx, y1 + 0.35, z1], 0.05, neon(pal[1], 3));
    L.ramps.push({ minX: x - 0.8, maxX: x + 0.8, z0, z1, y0, y1 });
  };
  // puzzle pieces
  api.gate = (x, z, w = 8, kind = 'switch', need = 1, id = 0) => {
    const c = kind === 'key' ? 0xffd23a : kind === 'arena' ? 0xff3a5a : pal[2];
    const m = api.box(x, 0, z, w, 4, 0.5, new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: 1.2, transparent: true, opacity: 0.55, roughness: 0.2 }));
    const col = L.colliders[L.colliders.length - 1];
    const g = { m, col, kind, need, id, open: false, t: 0, z, label: null };
    if (theme.ground === 'void') { m.scale.x = w + 6; col.min.x = x - (w + 6) / 2; col.max.x = x + (w + 6) / 2; }
    // high floor for void worlds so the gate stands on something
    L.gates.push(g); return g;
  };
  api.sw = (x, y, z, gateId) => {
    const base = new THREE.Mesh(CYL, new THREE.MeshStandardMaterial({ color: 0x222233, metalness: 0.6, roughness: 0.3 })); base.scale.set(0.8, 0.12, 0.8); base.position.set(x, y + 0.06, z); add(base);
    const pad = new THREE.Mesh(CYL, neon(pal[2], 2)); pad.scale.set(0.6, 0.1, 0.6); pad.position.set(x, y + 0.16, z); add(pad);
    L.switches.push({ pos: new THREE.Vector3(x, y, z), pad, gateId, on: false });
  };
  api.key = (x, y, z) => {
    const g = new THREE.Group(); const m = neon(0xffd23a, 2.5);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.05, 6, 16), m); ring.position.y = 0.35; g.add(ring);
    const shaft = new THREE.Mesh(UNIT, m); shaft.scale.set(0.06, 0.4, 0.06); shaft.position.y = 0.0; g.add(shaft);
    const tooth = new THREE.Mesh(UNIT, m); tooth.scale.set(0.14, 0.06, 0.06); tooth.position.set(0.07, -0.12, 0); g.add(tooth);
    const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture(), color: 0xffd23a, transparent: true, opacity: 0.6, depthWrite: false, blending: THREE.AdditiveBlending })); glow.scale.setScalar(1.3); glow.position.y = 0.15; g.add(glow);
    g.position.set(x, y + 0.4, z); add(g); L.keys.push({ obj: g, base: y + 0.4, taken: false });
  };
  api.checkpoint = (x, z, y = 0) => {
    const post = new THREE.Mesh(CYL, new THREE.MeshStandardMaterial({ color: 0x222230, metalness: 0.7, roughness: 0.3 })); post.scale.set(0.06, 2.2, 0.06); post.position.set(x, y + 1.1, z); add(post);
    const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.2, 12, 8), new THREE.MeshStandardMaterial({ color: 0x555566, emissive: 0x333344, emissiveIntensity: 1 })); lamp.position.set(x, y + 2.3, z); add(lamp);
    L.checkpoints.push({ pos: new THREE.Vector3(x + 1, y, z), z, lamp, active: false });
  };
  api.exit = (x, z, y = 0) => {
    const g = new THREE.Group(); g.position.set(x, y, z); add(g);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(1.8, 0.14, 10, 48), neon(pal[0], 3.2)); ring.position.y = 2.1; g.add(ring);
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(1.5, 0.05, 6, 48), neon(pal[1], 3)); ring2.position.y = 2.1; g.add(ring2);
    const disc = new THREE.Mesh(new THREE.CircleGeometry(1.45, 32), new THREE.MeshBasicMaterial({ color: pal[2], transparent: true, opacity: 0.35, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false })); disc.position.y = 2.1; g.add(disc);
    L.exit = { pos: new THREE.Vector3(x, y, z), g, ring, ring2 };
    L.anims.push(t => { ring.rotation.z = t; ring2.rotation.z = -t * 1.6; disc.material.opacity = 0.3 + Math.sin(t * 3) * 0.1; });
  };
  api.sign = (text, color, x, y, z, w = 8, ry = 0) => { const s = new THREE.Mesh(new THREE.PlaneGeometry(w, w / 4), new THREE.MeshBasicMaterial({ map: signTexture(text, color), transparent: true, toneMapped: false, side: THREE.DoubleSide })); s.position.set(x, y, z); s.rotation.y = ry; return add(s); };
  api.sideWalls = (z0, z1, W = 11) => { // themed boundaries along a stretch
    if (theme.ground === 'void') return;
    const len = Math.abs(z1 - z0), cz = (z0 + z1) / 2;
    for (const s of [-1, 1]) {
      const m = api.box(s * W, 0, cz, 1, 5, len, wallMat);
      const uv = m.geometry; // shared unit geometry: use texture repeat via clone material per length bucket
      m.material = wallMatFor(len);
    }
  };
  const wallMats = {};
  const wallMatFor = (len) => { const k = Math.max(1, Math.round(len / 5)); if (!wallMats[k]) { const t = wallTex.clone(); t.needsUpdate = true; t.repeat.set(k, 1.25); wallMats[k] = new THREE.MeshStandardMaterial({ map: t, roughness: 0.85, color: wallMat.color }); } return wallMats[k]; };
  api.wallMat = (len) => wallMatFor(len);
  api.decor = (z0, z1) => decorate(api, theme, z0, z1, add, neon, buildingMat, Q);
  api.arena = (cz, radius = 19) => buildArena(api, add, neon, cz, radius, floorMat, theme);

  // ---------------- content ----------------
  if (n === 1) level1(api);
  else generate(api, n);

  // finalize hearts: choose 20 slots spread along the level (deterministic)
  if (n !== 1) {
    const slots = L.heartSlots.slice().sort((a, b) => b.p.z - a.p.z);
    const want = 20;
    if (slots.length) {
      for (let i = 0; i < want; i++) { const s = slots[Math.min(slots.length - 1, Math.floor((i + rng() * 0.8) * slots.length / want))]; api.heart(s.p.x + (L.hearts.some(h => h.obj.position.distanceTo(s.p) < 0.5) ? (i % 2 ? 0.9 : -0.9) : 0), s.p.y, s.p.z); }
    }
  }
  // cat mission
  const types = ['kittens', 'notes', 'crowns'];
  const mType = n === 1 ? 'kittens' : types[(n + worldOf(n)) % 3];
  const mN = mType === 'notes' ? 5 : 3;
  L.mission = { type: mType, n: Math.min(mN, L.hiddenSlots.length), got: 0 };
  const hs = L.hiddenSlots.slice();
  for (let i = 0; i < L.mission.n; i++) { const k = Math.floor(rng() * hs.length); const p = hs.splice(k, 1)[0]; const it = makeCatItem(mType); it.position.copy(p); add(it); L.catItems.push({ obj: it, base: p.y, taken: false }); }

  // ground plane (solid worlds) sized to the level
  const zLen = L.maxZ - L.minZ + 60, zMid = (L.maxZ + L.minZ) / 2;
  if (theme.ground !== 'void') {
    const gw = 60;
    if (Q.reflections) {
      const refl = new Reflector(new THREE.PlaneGeometry(gw, zLen), { textureWidth: 512, textureHeight: 512, color: 0x55556a });
      refl.rotation.x = -Math.PI / 2; refl.position.set(0, -0.005, zMid); add(refl); L.reflector = refl;
    }
    const gm = new THREE.MeshStandardMaterial({ color: theme.groundTint, roughness: 0.25, metalness: 0.6, envMapIntensity: 1.2, transparent: !!Q.reflections, opacity: Q.reflections ? 0.8 : 1 });
    if (TEX.asphalt) { const t = TEX.asphalt.clone(); t.needsUpdate = true; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(gw / 5, zLen / 5); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; gm.map = t; }
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(gw, zLen), gm); ground.rotation.x = -Math.PI / 2; ground.position.set(0, 0, zMid); ground.receiveShadow = true; add(ground);
    L.groundMat = gm;
  }
  // a few point lights along the level
  const nl = Q.low ? 2 : 4;
  for (let i = 0; i < nl; i++) { const l = new THREE.PointLight(pal[i % pal.length], 40, 32, 2); l.position.set(0, 6, L.maxZ - (i + 0.5) * (L.maxZ - L.minZ) / nl); add(l); }
  if (theme.rain) L.rain = makeRain(add, Q);

  L.update = (t, dt, camPos) => {
    for (const s of L.swings) s.piv.rotation.z = Math.sin(t * 1.6 + s.ph) * 0.45;
    for (const mv of L.movers) {
      const off = Math.sin(t * mv.spd + mv.ph) * mv.amp; const np = mv.base.clone(); np[mv.ax] += off;
      const old = mv.m.position.clone(); mv.m.position.set(np.x, np.y - 0.175, np.z); mv.t.position.set(np.x, np.y - 0.02, np.z);
      mv.delta.copy(mv.m.position).sub(old);
      mv.col.min.set(np.x - mv.w / 2, np.y - 0.35, np.z - mv.w / 2); mv.col.max.set(np.x + mv.w / 2, np.y, np.z + mv.w / 2);
    }
    for (const g of L.gates) if (g.open && g.t < 1) { g.t = Math.min(1, g.t + dt * 1.5); g.m.position.y = 2 - g.t * 4.2; g.m.material.opacity = 0.55 * (1 - g.t); }
    for (const a of L.anims) a(t, dt);
    if (L.rain && camPos) L.rain.update(dt, camPos);
  };
  L.dispose = () => {
    scene.remove(root);
    root.traverse(o => { if (o.geometry && o.geometry !== UNIT && o.geometry !== CYL && !(_heartGeo && _heartGeo.includes(o.geometry))) o.geometry.dispose(); });
    if (L.reflector) L.reflector.dispose?.();
  };
  return L;
}

// ---------------- rain ----------------
function makeRain(add, Q) {
  const N = Q.low ? 600 : 1600; const pos = new Float32Array(N * 6);
  const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const drops = []; for (let i = 0; i < N; i++) drops.push([Math.random() * 40 - 20, Math.random() * 20, Math.random() * 40 - 20]);
  const lines = new THREE.LineSegments(geo, new THREE.LineBasicMaterial({ color: 0x9ab8ff, transparent: true, opacity: 0.45 })); lines.frustumCulled = false; add(lines);
  return { update(dt, c) {
    for (let i = 0; i < N; i++) { const d = drops[i]; d[1] -= dt * 22; if (d[1] < 0) { d[1] += 20; d[0] = Math.random() * 40 - 20; d[2] = Math.random() * 40 - 20; }
      const x = c.x + d[0], y = d[1], z = c.z + d[2]; pos.set([x, y, z, x + 0.05, y + 0.6, z], i * 6); }
    geo.attributes.position.needsUpdate = true; } };
}

// ---------------- decoration per theme (no colliders, outside the path) ----------------
function decorate(api, theme, z0, z1, add, neon, buildingMat, Q) {
  const { rng, pal } = api; const kind = theme.decor; const len = Math.abs(z1 - z0);
  const count = Math.max(1, Math.round(len / (Q.low ? 14 : 8)));
  for (let i = 0; i < count; i++) {
    const z = z0 - (i + rng()) * len / count, s = rng() < 0.5 ? -1 : 1, x = s * (13 + rng() * 6);
    if (kind === 'playground') {
      if (rng() < 0.5) { // swing frame
        const m = neon(pal[2], 1.6); api.tube([x - 1, 0, z + 2], [x, 3.5, z + 2], 0.07, m); api.tube([x + 1, 0, z + 2], [x, 3.5, z + 2], 0.07, m); api.tube([x - 1, 0, z - 2], [x, 3.5, z - 2], 0.07, m); api.tube([x + 1, 0, z - 2], [x, 3.5, z - 2], 0.07, m); api.tube([x, 3.5, z + 2], [x, 3.5, z - 2], 0.08, neon(pal[0], 2.5));
        const piv = new THREE.Group(); piv.position.set(x, 3.5, z); add(piv); const seat = new THREE.Mesh(UNIT, neon(pal[1], 1.8)); seat.scale.set(0.5, 0.06, 0.8); seat.position.y = -2.8; piv.add(seat);
        for (const dz of [-0.35, 0.35]) { const c = new THREE.Mesh(CYL, new THREE.MeshStandardMaterial({ color: 0xaaaacc, metalness: 1, roughness: 0.3 })); c.scale.set(0.02, 2.8, 0.02); c.position.set(0, -1.4, dz); piv.add(c); }
        api.L.swings.push({ piv, ph: rng() * 6 });
      } else { const m = neon(pal[3], 1.5); api.tube([x, 0, z], [x, 2.5, z], 0.08, m); const b = new THREE.Mesh(new THREE.SphereGeometry(0.5, 12, 8), neon(pal[0], 1.2)); b.position.set(x, 2.8, z); add(b); }
    } else if (kind === 'alley' || kind === 'rain') {
      const h = 6 + rng() * 10; const m = new THREE.Mesh(UNIT, buildingMat); m.scale.set(6, h, 6); m.position.set(s * 17, h / 2, z); add(m);
      if (rng() < 0.6) { const sg = new THREE.Mesh(UNIT, neon(api.pick(pal), 2.6)); sg.scale.set(0.1, 0.8, 2.5); sg.position.set(s * 13.9, 3 + rng() * 3, z); add(sg); }
      if (rng() < 0.4) { const dm = new THREE.Mesh(UNIT, new THREE.MeshStandardMaterial({ color: 0x1a3a2a, roughness: 0.6 })); dm.scale.set(1.2, 1, 2); dm.position.set(s * 12.5, 0.5, z); add(dm); }
    } else if (kind === 'rooftops') {
      if (rng() < 0.5) { const t = new THREE.Mesh(CYL, new THREE.MeshStandardMaterial({ color: 0x6a4a3a, roughness: 0.8 })); t.scale.set(1.2, 2, 1.2); t.position.set(x, 3 - 6, z); add(t); }
      const h = 10 + rng() * 25; const b = new THREE.Mesh(UNIT, buildingMat); b.scale.set(8, h, 8); b.position.set(s * (20 + rng() * 10), -h / 2 + 4 * rng(), z); add(b);
    } else if (kind === 'city') {
      const h = 12 + rng() * 30; const b = new THREE.Mesh(UNIT, buildingMat); b.scale.set(7, h, 7); b.position.set(s * 18, h / 2, z); add(b);
      for (let k = 0; k < 4; k++) { const w = new THREE.Mesh(UNIT, neon(k % 2 ? 0xffc070 : pal[0], 1.4)); w.scale.set(0.05, 0.6, 4); w.position.set(s * 14.47, 3 + k * (h / 5), z); add(w); }
      if (rng() < 0.5) { api.tube([s * 12, 0, z + 3], [s * 12, 4.5, z + 3], 0.06, new THREE.MeshStandardMaterial({ color: 0x333333 })); const l = new THREE.Mesh(new THREE.SphereGeometry(0.25, 8, 6), neon(0xffc070, 2.5)); l.position.set(s * 12, 4.6, z + 3); add(l); }
    } else if (kind === 'underground') {
      const p = new THREE.Mesh(CYL, new THREE.MeshStandardMaterial({ color: 0x3a3028, roughness: 0.9 })); p.scale.set(0.7, 9, 0.7); p.position.set(s * 12.5, 4.5, z); add(p);
      const fire = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 6), neon(0xff8a2a, 3)); fire.position.set(s * 11.8, 2.6, z); add(fire);
      if (rng() < 0.4) { const st = new THREE.Mesh(new THREE.IcosahedronGeometry(0.9, 0), new THREE.MeshStandardMaterial({ color: 0x5a5040, roughness: 0.7, emissive: 0x2affd0, emissiveIntensity: 0.15, flatShading: true })); st.position.set(s * 15, 0.9, z); add(st); }
    } else if (kind === 'archive') {
      const sh = new THREE.Mesh(UNIT, new THREE.MeshStandardMaterial({ color: 0x1a2030, metalness: 0.6, roughness: 0.4 })); sh.scale.set(1.2, 7, 5); sh.position.set(s * 13, 3.5, z); add(sh);
      for (let k = 0; k < 5; k++) { const rw = new THREE.Mesh(UNIT, neon(k % 2 ? pal[0] : pal[2], 1.0)); rw.scale.set(0.1, 0.25, 4.6); rw.position.set(s * 12.38, 0.8 + k * 1.3, z); add(rw); }
    } else if (kind === 'nebula') {
      const a = new THREE.Mesh(new THREE.IcosahedronGeometry(0.8 + rng() * 2, 0), new THREE.MeshStandardMaterial({ color: 0x3a2a5a, roughness: 0.6, emissive: api.pick(pal), emissiveIntensity: 0.25, flatShading: true }));
      a.position.set(s * (12 + rng() * 15), -6 + rng() * 14, z); add(a); const sp = 0.2 + rng() * 0.5; api.L.anims.push(t => { a.rotation.x = t * sp; a.rotation.y = t * sp * 0.7; });
    } else if (kind === 'portal') {
      const r = new THREE.Mesh(new THREE.TorusGeometry(3 + rng() * 4, 0.12, 8, 48), neon(api.pick(pal), 2.2)); r.position.set(s * (14 + rng() * 10), rng() * 8, z); r.rotation.y = rng() * 3; add(r);
      const sp = 0.2 + rng() * 0.4; api.L.anims.push(t => { r.rotation.x = t * sp; });
    }
  }
}

// ---------------- boss arena ----------------
function buildArena(api, add, neon, cz, R, floorMat, theme) {
  const { L, pal } = api; const C = new THREE.Vector3(0, 0, cz);
  if (theme.ground === 'void') { const f = new THREE.Mesh(new THREE.CylinderGeometry(R + 1, R + 0.5, 1, 48), floorMat); f.position.set(0, -0.5, cz); add(f); L.colliders.push({ min: new THREE.Vector3(-R - 1, -1, cz - R - 1), max: new THREE.Vector3(R + 1, 0, cz + R + 1), mesh: f }); }
  const floor = new THREE.Mesh(new THREE.CircleGeometry(R + 1, 64), new THREE.MeshStandardMaterial({ color: 0x0a0614, roughness: 0.2, metalness: 0.6, transparent: true, opacity: 0.85 }));
  floor.rotation.x = -Math.PI / 2; floor.position.set(0, 0.015, cz); floor.receiveShadow = true; add(floor);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(R + 0.6, 0.12, 8, 96), neon(pal[2], 3)); ring.rotation.x = Math.PI / 2; ring.position.set(0, 0.05, cz); add(ring);
  const ring2 = new THREE.Mesh(new THREE.TorusGeometry(6, 0.06, 6, 64), neon(pal[0], 2)); ring2.rotation.x = Math.PI / 2; ring2.position.set(0, 0.04, cz); add(ring2);
  L.anims.push(t => { ring2.rotation.z = t * 0.3; });
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; const x = Math.cos(a) * (R + 1.5), z = cz + Math.sin(a) * (R + 1.5); if (z > cz + R - 2) continue; api.tube([x, 0, z], [x, 4 + (i % 3), z], 0.18, neon(pal[i % 3], 3)); }
  const barrier = new THREE.Mesh(new THREE.CylinderGeometry(R + 0.6, R + 0.6, 5, 64, 1, true), new THREE.MeshBasicMaterial({ color: pal[2], transparent: true, opacity: 0.0, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending }));
  barrier.position.set(0, 2.5, cz); add(barrier);
  // girl's cage on a pedestal at the back
  const cage = new THREE.Group(); cage.position.set(0, 1.6, cz - R + 6); add(cage);
  for (let i = 0; i < 14; i++) { const a = (i / 14) * Math.PI * 2; const b = new THREE.Mesh(CYL, L.cageMat); b.scale.set(0.05, 2.6, 0.05); b.position.set(Math.cos(a) * 0.9, 1.3, Math.sin(a) * 0.9); cage.add(b); }
  for (const y of [0, 2.6]) { const r = new THREE.Mesh(new THREE.TorusGeometry(0.9, 0.08, 6, 28), L.cageMat); r.rotation.x = Math.PI / 2; r.position.y = y; cage.add(r); }
  const ped = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.5, 1.6, 24), new THREE.MeshStandardMaterial({ color: 0x0d0818, metalness: 0.6, roughness: 0.3 })); ped.position.set(0, 0.8, cz - R + 6); add(ped);
  L.colliders.push({ min: new THREE.Vector3(-1.3, 0, cz - R + 4.7), max: new THREE.Vector3(1.3, 1.6, cz - R + 7.3), mesh: ped });
  L.arena = { center: C, radius: R, gateZ: cz + R + 2, barrier, cage, cagePos: cage.position.clone() };
  L.minZ = Math.min(L.minZ, cz - R - 4);
  return L.arena;
}

// ======================================================================
// Level 1 (hand-made): The Neon Playground prologue, ends in Shadow Man's first test.
function level1(api) {
  const { L, pal } = api; const P = pal;
  L.maxZ = 20;
  api.box(0, 0, 16, 34, 7, 1, api.wallMat(34));
  api.sign('LIL SYNN', '#ff2fa8', 0, 4.6, 15.45, 9, Math.PI); api.sign('BROKEN HEARTS', '#29e0ff', 0, 3.0, 15.45, 7, Math.PI);
  api.sideWalls(16, -104, 24);
  // swings
  const m = api.neon(P[2], 2);
  api.tube([-11, 0, 4], [-10, 4, 4], 0.08, m); api.tube([-9, 0, 4], [-10, 4, 4], 0.08, m); api.tube([-11, 0, -2], [-10, 4, -2], 0.08, m); api.tube([-9, 0, -2], [-10, 4, -2], 0.08, m);
  api.tube([-10, 4, 4.2], [-10, 4, -2.2], 0.1, api.neon(P[0], 3));
  for (const z of [2.4, -0.4]) {
    const piv = new THREE.Group(); piv.position.set(-10, 4, z); L.root.add(piv);
    for (const dz of [-0.35, 0.35]) { const c = new THREE.Mesh(CYL, new THREE.MeshStandardMaterial({ color: 0xaaaacc, metalness: 1, roughness: 0.3 })); c.scale.set(0.02, 3.2, 0.02); c.position.set(0, -1.6, dz); piv.add(c); }
    const seat = new THREE.Mesh(UNIT, api.neon(P[1], 2)); seat.scale.set(0.5, 0.06, 0.85); seat.position.y = -3.2; piv.add(seat); L.swings.push({ piv, ph: z });
  }
  // slide
  api.plat(7, 2.6, 6, 2.2, 2.2, P[3], 2.6);
  for (let y = 0.4; y < 2.6; y += 0.45) api.tube([6, y, 7.25], [8, y, 7.25], 0.035, api.neon(P[3], 1.5));
  api.ramp(7, 4.9, -1.5, 2.6, 0.05, P[0]);
  api.heart(7, 3.4, 6); api.heart(-10, 1.2, 1); api.heart(0, 1.0, -4);
  api.hiddenSlot(-14, 0, 6); api.pack(-12, 0.8, -6);
  // stepping platforms
  api.plat(-2, 1.0, -12, 3, 3, P[1]); api.heart(-2, 1.8, -12);
  api.plat(2.5, 2.0, -16, 2.5, 2.5, P[0]); api.heart(2.5, 2.8, -16);
  api.plat(-1.5, 3.0, -20.5, 2.5, 2.5, P[2]);
  api.plat(3, 4.2, -24.5, 2.2, 2.2, P[1]); api.heart(3, 5.0, -24.5);
  api.box(-6, 0, -26, 4, 2.9, 2); api.trim(-6, 2.9, -26, 4, 2, P[3]); api.heart(-6, 3.7, -26);
  api.hiddenSlot(-6.5, 2.9, -26.6);
  api.wisp(0, 1.0, -9, 2.0); api.wisp(-4, 1.0, -21, 1.5);
  api.checkpoint(4, -29);
  // monkey bars
  api.plat(0, 3.0, -33, 3.5, 3.5, P[0]); api.plat(-3.2, 1.0, -30, 2, 2, P[2]); api.plat(-3.2, 2.0, -32.6, 1.6, 1.6, P[2]);
  api.bar([0, 5.0, -35], [0, 5.0, -46]);
  api.plat(0, 3.0, -48.2, 3.5, 3.5, P[1]);
  api.heart(0, 3.6, -38); api.heart(0, 3.6, -42); api.heart(0, 3.8, -48.2);
  api.wisp(0, 1.0, -40, 0.5, 2.0); api.wisp(-3, 1.0, -43, 1.0, 1.4);
  api.bar([2.2, 4.2, -48.2], [10, 4.2, -48.2]);
  api.plat(11.5, 2.2, -48.2, 2.2, 2.2, P[3]); api.heart(11.5, 3.0, -48.2); api.heart(6, 2.7, -48.2);
  api.hiddenSlot(12.2, 2.2, -49);
  // moving platforms over shadow pool
  api.hazard(-8, 8, -55, -73);
  api.plat(0, 1.2, -54, 3, 2, P[2]);
  api.mover(-3, 1.8, -58.5, 'x', 3.5, 0.9, P[1]); api.mover(3, 2.6, -63, 'x', 3.5, 1.1, P[0]); api.mover(0, 3.2, -67.5, 'y', 1.2, 1.3, P[3]);
  api.plat(0, 2.0, -73, 3, 2.4, P[1]);
  api.heart(-3, 2.6, -58.5); api.heart(3, 3.4, -63); api.heart(0, 5.0, -67.5);
  api.wisp(-5, 1.0, -75, 1.6, 1.2); api.wisp(5, 1.0, -77, 1.6, 1.2);
  api.checkpoint(-6, -77); api.pack(6, 0.8, -79);
  // jungle gym tower
  api.plat(-4, 1.2, -82, 2.5, 2.5, P[0]); api.plat(-1, 2.6, -85, 2.2, 2.2, P[2]); api.plat(-4.5, 4.0, -88, 2.2, 2.2, P[1]); api.plat(-1, 5.4, -91, 2.6, 2.6, P[3]);
  api.heart(-1, 6.3, -91); api.heart(-4.5, 4.8, -88); api.heart(4, 1.0, -86);
  for (const [x, z] of [[-2.3, -89.7], [0.3, -89.7], [-2.3, -92.3], [0.3, -92.3]]) api.tube([x, 0, z], [x, 5.4, z], 0.06, api.neon(P[3], 2));
  api.wisp(2, 1.0, -88, 2.2, 1.0); api.wisp(-2, 1.0, -97, 2.5, 1.1);
  // gate + arena
  const gm = api.neon(P[0], 3.5); const gz = -106;
  api.tube([-5, 0, gz], [-5, 6, gz], 0.15, gm); api.tube([5, 0, gz], [5, 6, gz], 0.15, gm); api.tube([-5, 6, gz], [5, 6, gz], 0.15, gm);
  api.sign('SHADOW ZONE', '#9a4dff', 0, 7.2, gz, 8);
  const A = api.arena(-128, 19);
  api.heart(-10, 1.0, -124); api.heart(10, 1.0, -124);
  L.checkpoints.push({ pos: new THREE.Vector3(0, 0, -112), z: -110, lamp: null, active: false, arena: true });
  L.decorRange = [20, -150];
  api.decor(20, -104);
}

// ======================================================================
// Procedural generator: hand-designed chunk templates assembled with a seeded RNG.
// Each chunk gets the current z (path runs toward -z) and returns the new z.
const CHUNKS = {
  run(api, z) { // warm-up straight with low blocks
    const { r, d } = api; const len = 16;
    api.floor(-6, 6, z, z - len);
    for (let i = 0; i < 3; i++) { const x = r(-4, 4), zz = z - 3 - i * 4.5, h = r(0.6, 1.4); api.plat(x, h, zz, r(1.6, 2.6), r(1.6, 2.6), api.pick(api.pal)); api.heartSlot(x, h + 0.9, zz); }
    if (d > 0.25) api.wisp(r(-3, 3), 1.0, z - len / 2, r(1, 2.5), r(0.8, 1.4));
    api.heartSlot(0, 1, z - len + 2);
    return z - len;
  },
  steps(api, z) { // stepping stones over a gap
    const { r, d } = api; const gap = 1.4 + d * 2.0; const n = 4 + Math.round(d * 3);
    api.floor(-5, 5, z, z - 3); let zz = z - 3; let y = 1, x = 0;
    const startZ = zz;
    for (let i = 0; i < n; i++) {
      const w = Math.max(1.3, 2.6 - d * 1.1); zz -= gap + w / 2; x = Math.max(-5, Math.min(5, x + r(-2.5, 2.5))); y = Math.max(0.6, Math.min(4.5, y + r(-0.6, 1.0)));
      api.plat(x, y, zz, w, w, api.pick(api.pal)); api.heartSlot(x, y + 0.9, zz); zz -= w / 2;
    }
    zz -= gap * 0.8; api.hazard(-10, 10, startZ, zz);
    api.floor(-5, 5, zz, zz - 3); api.heartSlot(0, 1, zz - 1.5);
    if (api.rng() < 0.5) api.hiddenSlot(api.pick([-1, 1]) * 9, 0, startZ - 2);
    return zz - 3;
  },
  zigzag(api, z) {
    const { r, d } = api; const n = 5 + Math.round(d * 3); api.floor(-5, 5, z, z - 3); let zz = z - 3; const s0 = zz;
    for (let i = 0; i < n; i++) { const x = (i % 2 ? 1 : -1) * (2.5 + d * 1.5), y = 1 + (i % 3) * 0.7 + d; zz -= 2.6 + d * 1.0; api.plat(x, y, zz, 2, 2, api.pal[i % 4]); api.heartSlot(x, y + 0.9, zz); }
    zz -= 3; api.hazard(-10, 10, s0, zz); api.floor(-5, 5, zz, zz - 3);
    if (d > 0.4) api.wisp(0, 2.2, (s0 + zz) / 2, 1.5, 1.2);
    return zz - 3;
  },
  tower(api, z) { // climb up and over, hidden item on top
    const { r, d } = api; const len = 22; api.floor(-7, 7, z, z - len);
    const levels = 4 + Math.round(d * 3); let y = 0; const cz = z - len / 2; const R = 3.2;
    for (let i = 0; i < levels; i++) { y += 1.15 + d * 0.35; const a = i * 1.7; const x = Math.cos(a) * R, zz = cz + Math.sin(a) * R; api.plat(x, y, zz, 2, 2, api.pal[i % 4]); api.heartSlot(x, y + 0.9, zz); }
    const top = y + 1.1; api.plat(0, top, cz, 2.4, 2.4, api.pal[3]);
    api.hiddenSlot(0, top, cz); api.heartSlot(0, top + 0.9, cz - 0.6);
    for (const [dx, dz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) api.tube([dx * 1.1, 0, cz + dz * 1.1], [dx * 1.1, top - 0.4, cz + dz * 1.1], 0.05, api.neon(api.pal[3], 1.6));
    if (d > 0.3) api.wisp(r(-4, 4), 1, cz, 2.5, 1.0);
    return z - len;
  },
  ledges(api, z) { // tall walls: double-jump or grab the ledge
    const { r, d } = api; const n = 2 + Math.round(d * 2); let zz = z; api.floor(-7, 7, z, z - n * 7 - 2);
    for (let i = 0; i < n; i++) { zz -= 6; const h = 2.4 + d * 1.6 + r(0, 0.5); api.box(0, 0, zz, 14, h, 1.6); api.trim(0, h, zz, 14, 1.6, api.pal[i % 4]); api.heartSlot(r(-5, 5), h + 0.9, zz); }
    api.hiddenSlot(r(-6, 6), 0, zz - 1.6);
    return zz - 3;
  },
  bars(api, z) { // monkey bars across a pit
    const { r, d } = api; const len = 7 + d * 7; const y = 2.4 + d; const x = r(-3, 3);
    api.floor(-5, 5, z, z - 3); api.plat(x, y - 2.0, z - 4, 3, 3, api.pal[0]);
    const z0 = z - 5.6, z1 = z0 - len; api.bar([x, y + 0.2, z0], [x, y + 0.2, z1]);
    for (let t = 0; t < len; t += 3.5) api.heartSlot(x, y - 1.2, z0 - t - 1);
    api.plat(x, y - 2.0, z1 - 1.6, 3, 3, api.pal[1]);
    api.hazard(-10, 10, z - 3, z1 - 3.2); if (d > 0.35) api.wisp(x, 0.9, (z0 + z1) / 2, 1.0, 1.6);
    api.floor(-5, 5, z1 - 3.2, z1 - 6);
    return z1 - 6;
  },
  movers(api, z) {
    const { r, d } = api; const n = 3 + Math.round(d * 2); api.floor(-5, 5, z, z - 3); let zz = z - 3; const s0 = zz;
    for (let i = 0; i < n; i++) { zz -= 4.4; const ax = api.rng() < 0.65 ? 'x' : 'y'; const y = 1.4 + i * 0.4 + d; api.mover(ax === 'x' ? 0 : r(-2, 2), y, zz, ax, ax === 'x' ? 2.5 + d * 2 : 1.0, 0.8 + d * 0.9, api.pal[i % 4], Math.max(1.8, 2.6 - d * 0.6)); api.heartSlot(0, y + 1.2, zz); }
    zz -= 4; api.hazard(-10, 10, s0, zz); api.floor(-5, 5, zz, zz - 3);
    return zz - 3;
  },
  arena(api, z) { // mob arena: gate opens when every wisp is gone
    const { r, d } = api; const len = 22; api.floor(-9, 9, z, z - len);
    const id = api.L.gates.length; const n = 3 + Math.round(d * 5);
    for (let i = 0; i < n; i++) api.wisp(r(-6, 6), r(0.9, 1.6), z - r(4, len - 5), r(0.5, 2.5), r(0.7, 1.6), id);
    api.plat(-6, 1.2, z - len / 2, 2, 2, api.pal[2]); api.plat(6, 1.2, z - len / 2, 2, 2, api.pal[2]);
    api.heartSlot(-6, 2.1, z - len / 2); api.heartSlot(6, 2.1, z - len / 2);
    if (d > 0.45) api.pack(0, 0.8, z - len / 2);
    const g = api.gate(0, z - len, 18, 'arena', n, id); g.label = api.sign('CLEAR THE WISPS', '#ff3a5a', 0, 4.8, z - len + 0.3, 6);
    return z - len - 1;
  },
  switches(api, z) { // press every switch to open the gate
    const { r, d } = api; const len = 22; api.floor(-9, 9, z, z - len); const id = api.L.gates.length; const n = 2 + (d > 0.55 ? 1 : 0);
    const spots = [[-6, -6], [6, -12], [-5, -17], [5, -5]];
    for (let i = 0; i < n; i++) { const [x, dz] = spots[i]; const h = 1.2 + i * 1.1 + d * 1.5; api.plat(x, h, z + dz, 2.4, 2.4, api.pal[2]); api.sw(x, h, z + dz, id); api.heartSlot(x, h + 1.2, z + dz); api.plat(x * 0.55, h * 0.5, z + dz + 1.5, 1.6, 1.6, api.pal[1]); }
    const g = api.gate(0, z - len, 18, 'switch', n, id); g.label = api.sign(`PRESS ${n} SWITCHES`, '#9a4dff', 0, 4.8, z - len + 0.3, 6);
    if (d > 0.4) api.wisp(0, 1.0, z - len / 2, 3, 1.0);
    return z - len - 1;
  },
  keydoor(api, z) { // key sits up high or behind bars
    const { r, d } = api; const len = 24; api.floor(-9, 9, z, z - len); const id = api.L.gates.length;
    const side = api.rng() < 0.5 ? -1 : 1; let y = 0;
    for (let i = 0; i < 3; i++) { y += 1.3 + d * 0.4; api.plat(side * (3 + i * 1.6), y, z - 6 - i * 3, 2, 2, api.pal[i % 4]); api.heartSlot(side * (3 + i * 1.6), y + 0.9, z - 6 - i * 3); }
    api.plat(side * 7.5, y + 0.6, z - 16, 2.4, 2.4, 0xffd23a); api.key(side * 7.5, y + 0.6, z - 16);
    api.hiddenSlot(-side * 7.5, 0, z - 10);
    const g = api.gate(0, z - len, 18, 'key', 1, id); g.label = api.sign('FIND THE KEY', '#ffd23a', 0, 4.8, z - len + 0.3, 6);
    return z - len - 1;
  },
  slide(api, z) {
    const { r } = api; const len = 18; api.floor(-6, 6, z, z - len);
    const x = r(-3, 3); const h = 3 + api.d * 1.5;
    for (let i = 0; i < 3; i++) api.plat(x - 2.2, 1 + i * (h / 3), z - 2 - i * 1.4, 1.5, 1.4, api.pal[i % 4]);
    api.plat(x, h, z - 5, 2.2, 2.2, api.pal[3]); api.ramp(x, z - 6.1, z - 6.1 - h * 2.3, h, 0.05, api.pal[0]);
    api.heartSlot(x, h + 0.9, z - 5); api.heartSlot(x, h * 0.5 + 0.9, z - 6.1 - h * 1.15);
    return z - len;
  },
  rest(api, z) { const len = 10; api.floor(-6, 6, z, z - len); api.checkpoint(-3.5, z - 4); api.pack(3, 0.8, z - 5); api.heartSlot(0, 1, z - 6); api.hiddenSlot(api.pick([-1, 1]) * 9.5, 0, z - 6); return z - len; },
};

function generate(api, n) {
  const { L, rng, d } = api; const boss = isBossLevel(n); const w = worldOf(n);
  let z = 6; L.maxZ = 18;
  api.floor(-7, 7, 18, 6); api.box(0, 0, 18, 24, 5, 1, undefined); // back wall
  api.sign(`${w + 1}-${levelInWorld(n)}`, '#29e0ff', 0, 3.4, 17.45, 4, Math.PI);
  // weighted chunk pool by difficulty / world
  const pool = [['run', 1.2 - d], ['steps', 1.5], ['zigzag', 1.2], ['tower', 1], ['ledges', 0.6 + d], ['bars', 1.1], ['movers', 0.7 + d], ['arena', 0.6 + d * 1.2], ['switches', 0.3 + d], ['keydoor', 0.3 + d * 0.8], ['slide', 0.6]];
  const pickChunk = (prev) => { let tot = 0; const p = pool.filter(c => c[0] !== prev); p.forEach(c => tot += c[1]); let x = rng() * tot; for (const c of p) { x -= c[1]; if (x <= 0) return c[0]; } return p[0][0]; };
  const count = boss ? 4 : 13 + Math.round(d * 6);
  let prev = null; const start = z;
  for (let i = 0; i < count; i++) {
    if (i > 0 && i % 4 === 0) z = CHUNKS.rest(api, z);
    const c = i === 0 ? 'run' : pickChunk(prev); prev = c;
    const z0 = z; z = CHUNKS[c](api, z); api.sideWalls(z0, z, 11);
  }
  api.decor(start + 10, z - 10);
  if (boss) {
    api.floor(-6, 6, z, z - 6); api.checkpoint(-3, z - 2);
    const R = 19; const cz = z - 6 - R - 1; api.floor(-4, 4, z - 6, cz + R);
    api.arena(cz, R);
    L.checkpoints.push({ pos: new THREE.Vector3(0, 0, cz + R - 3), z: cz + R, lamp: null, active: false, arena: true });
    api.heartSlot(-10, 1, cz + 4); api.heartSlot(10, 1, cz + 4);
    L.minZ = cz - R - 4;
  } else {
    api.floor(-6, 6, z, z - 12); api.exit(0, z - 8);
    L.minZ = z - 14;
  }
  // make sure there are enough hidden slots for the cat mission
  let k = 0; while (L.hiddenSlots.length < 6 && k < 20) { const zz = start - rng() * (start - z); api.hiddenSlot((rng() < 0.5 ? -1 : 1) * (8 + rng() * 1.5), 0, zz); k++; }
}
