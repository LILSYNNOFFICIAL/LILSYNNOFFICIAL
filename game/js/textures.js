// Procedural textures (generated at load, no downloads): fabric/denim/leather/rib/bark/rock normal maps,
// fur strand masks, leaf clusters, butterfly wings, galaxy lens, soft glow. All tileable.
import * as THREE from 'three';

function hash(x, y, s) { let h = (x * 374761393 + y * 668265263 + s * 1442695041) | 0; h = (h ^ (h >>> 13)) * 1274126177; return ((h ^ (h >>> 16)) >>> 0) / 4294967295; }
// tileable value noise
export function vnoise(x, y, period, seed = 0) {
  const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
  const p = period, w = (a) => ((a % p) + p) % p;
  const a = hash(w(xi), w(yi), seed), b = hash(w(xi + 1), w(yi), seed), c = hash(w(xi), w(yi + 1), seed), d = hash(w(xi + 1), w(yi + 1), seed);
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
export function fbm(x, y, period, oct = 4, seed = 0) { let s = 0, a = 0.5, f = 1, n = 0; for (let i = 0; i < oct; i++) { s += a * vnoise(x * f, y * f, period * f, seed + i); n += a; a *= 0.5; f *= 2; } return s / n; }

function canvas(n) { const c = document.createElement('canvas'); c.width = c.height = n; return c; }
function heightToNormal(h, n, strength) {
  const c = canvas(n), g = c.getContext('2d'), img = g.createImageData(n, n), d = img.data;
  const at = (x, y) => h[((y + n) % n) * n + ((x + n) % n)];
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    const dx = (at(x + 1, y) - at(x - 1, y)) * strength, dy = (at(x, y + 1) - at(x, y - 1)) * strength;
    const l = Math.hypot(dx, dy, 1), i = (y * n + x) * 4;
    d[i] = (-dx / l * 0.5 + 0.5) * 255; d[i + 1] = (-dy / l * 0.5 + 0.5) * 255; d[i + 2] = (1 / l * 0.5 + 0.5) * 255; d[i + 3] = 255;
  }
  g.putImageData(img, 0, 0);
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 4; return t;
}
const cache = {};
export function normalMap(kind, n = 256) {
  if (cache[kind]) return cache[kind];
  const h = new Float32Array(n * n);
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    const u = x / n, v = y / n; let z = 0;
    if (kind === 'fabric') { z = 0.5 * Math.sin(u * Math.PI * 2 * 48) * Math.sin(v * Math.PI * 2 * 48) + 0.6 * fbm(u * 16, v * 16, 16, 3, 1) + 0.8 * fbm(u * 3, v * 5, 3, 3, 7); }
    else if (kind === 'rib') { z = 0.8 * Math.pow(Math.abs(Math.sin(u * Math.PI * 24)), 0.6) + 0.2 * fbm(u * 32, v * 32, 32, 2, 3); }
    else if (kind === 'denim') { z = 0.6 * Math.sin((u + v) * Math.PI * 2 * 40) + 0.5 * fbm(u * 64, v * 8, 64, 2, 2) + 0.6 * fbm(u * 4, v * 4, 4, 3, 9); }
    else if (kind === 'leather') { const f = fbm(u * 24, v * 24, 24, 3, 4); z = Math.pow(f, 2) * 1.4 + 0.3 * fbm(u * 4, v * 4, 4, 2, 5); }
    else if (kind === 'bark') { z = 1.2 * fbm(u * 6, v * 40, 6, 4, 6) + 0.4 * Math.abs(Math.sin(u * Math.PI * 14 + fbm(u * 3, v * 6, 3, 2, 8) * 6)); }
    else if (kind === 'rock') { z = fbm(u * 6, v * 6, 6, 5, 11) * 1.4; }
    else if (kind === 'skin') { z = 0.3 * fbm(u * 40, v * 40, 40, 2, 12); }
    else if (kind === 'water') { z = fbm(u * 8, v * 8, 8, 4, 13); }
    else if (kind === 'ground') { z = fbm(u * 12, v * 12, 12, 4, 14) * 1.2; }
    h[y * n + x] = z;
  }
  const str = { fabric: 3, rib: 4, denim: 3, leather: 5, bark: 9, rock: 7, skin: 2, water: 6, ground: 5 }[kind] || 3;
  return (cache[kind] = heightToNormal(h, n, str));
}
// fur strand mask: R = strand height (0..1), tileable. Used by shell fur.
export function furTexture(n = 256) {
  if (cache.fur) return cache.fur;
  const c = canvas(n), g = c.getContext('2d'), img = g.createImageData(n, n), d = img.data;
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    const cell = 64, cx = Math.floor(x / n * cell), cy = Math.floor(y / n * cell);
    const r = hash(cx, cy, 21), clump = fbm(x / n * 8, y / n * 8, 8, 2, 22);
    const fx = (x / n * cell) % 1 - 0.5, fy = (y / n * cell) % 1 - 0.5; const rd = Math.hypot(fx, fy);
    const v = Math.max(0, (r * 0.7 + clump * 0.5) * (1 - rd * 1.2));
    const i = (y * n + x) * 4; d[i] = d[i + 1] = d[i + 2] = Math.min(255, v * 255); d[i + 3] = 255;
  }
  g.putImageData(img, 0, 0);
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.colorSpace = THREE.NoColorSpace; return (cache.fur = t);
}
export function galaxyTexture() {
  if (cache.galaxy) return cache.galaxy;
  const c = canvas(256), g = c.getContext('2d');
  const grd = g.createLinearGradient(0, 0, 256, 256);
  grd.addColorStop(0, '#ff5fc4'); grd.addColorStop(0.4, '#8a3bff'); grd.addColorStop(0.7, '#2a3cff'); grd.addColorStop(1, '#ff8ad9');
  g.fillStyle = grd; g.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 9; i++) { const x = hash(i, 1, 30) * 256, y = hash(i, 2, 30) * 256, r = 40 + hash(i, 3, 30) * 70; const rg = g.createRadialGradient(x, y, 0, x, y, r); rg.addColorStop(0, `hsla(${290 + hash(i, 4, 30) * 70},100%,72%,0.55)`); rg.addColorStop(1, 'hsla(300,100%,50%,0)'); g.fillStyle = rg; g.fillRect(0, 0, 256, 256); }
  for (let i = 0; i < 220; i++) { const a = 0.35 + hash(i, 5, 31) * 0.65; g.fillStyle = `rgba(255,255,255,${a})`; const s = hash(i, 6, 31) < 0.08 ? 2 : 1; g.fillRect(hash(i, 7, 31) * 256, hash(i, 8, 31) * 256, s, s); }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return (cache.galaxy = t);
}
export function glowTexture() {
  if (cache.glow) return cache.glow;
  const c = canvas(128), g = c.getContext('2d'), rg = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  rg.addColorStop(0, 'rgba(255,255,255,1)'); rg.addColorStop(0.25, 'rgba(255,255,255,.55)'); rg.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = rg; g.fillRect(0, 0, 128, 128); const t = new THREE.CanvasTexture(c); return (cache.glow = t);
}
// leaf cluster card (alpha) — many small leaves drawn with highlights, so foliage reads as real leaves up close
export function leafTexture(kind = 'green') {
  const k = 'leaf_' + kind; if (cache[k]) return cache[k];
  const n = 256, c = canvas(n), g = c.getContext('2d');
  const pal = kind === 'blossom' ? [['#ffb3d9', '#ff7ac0', '#ffd6ec'], ['#7cc06a', '#4f9a4a']] : kind === 'gold' ? [['#ffd36b', '#f0a83a', '#ffe9a8'], ['#9bc25a', '#6f9a3c']] : [['#7fcf5c', '#4e9e3e', '#a8e07a'], ['#3d7d35', '#2e6a2e']];
  for (let i = 0; i < 70; i++) {
    const a = hash(i, 1, 40) * Math.PI * 2, rr = Math.sqrt(hash(i, 2, 40)) * 100, x = 128 + Math.cos(a) * rr, y = 128 + Math.sin(a) * rr * 0.9;
    const s = 16 + hash(i, 3, 40) * 16, rot = hash(i, 4, 40) * Math.PI * 2, blossom = kind !== 'green' && hash(i, 5, 40) < 0.75;
    const cols = blossom ? pal[0] : (kind === 'green' ? pal[0] : pal[1]);
    g.save(); g.translate(x, y); g.rotate(rot);
    const grd = g.createLinearGradient(0, -s, 0, s); grd.addColorStop(0, cols[2] || cols[0]); grd.addColorStop(0.5, cols[0]); grd.addColorStop(1, cols[1]);
    g.fillStyle = grd; g.beginPath();
    if (blossom) { for (let p = 0; p < 5; p++) { g.rotate(Math.PI * 2 / 5); g.ellipse(0, -s * 0.35, s * 0.22, s * 0.38, 0, 0, Math.PI * 2); } }
    else { g.moveTo(0, -s); g.quadraticCurveTo(s * 0.55, 0, 0, s); g.quadraticCurveTo(-s * 0.55, 0, 0, -s); }
    g.fill(); if (!blossom) { g.strokeStyle = 'rgba(255,255,230,.35)'; g.lineWidth = 1.2; g.beginPath(); g.moveTo(0, -s * 0.9); g.lineTo(0, s * 0.9); g.stroke(); }
    else { g.fillStyle = '#ffe9a0'; g.beginPath(); g.arc(0, 0, s * 0.09, 0, Math.PI * 2); g.fill(); }
    g.restore();
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return (cache[k] = t);
}
export function wingTexture(hue = 320) {
  const k = 'wing' + hue; if (cache[k]) return cache[k];
  const n = 128, c = canvas(n), g = c.getContext('2d');
  const grd = g.createRadialGradient(10, 64, 4, 10, 64, 120);
  grd.addColorStop(0, `hsl(${hue},100%,85%)`); grd.addColorStop(0.5, `hsl(${hue},95%,62%)`); grd.addColorStop(0.9, `hsl(${hue + 40},90%,40%)`); grd.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = grd; g.beginPath(); g.moveTo(0, 64); g.bezierCurveTo(40, -10, 130, 10, 120, 60); g.bezierCurveTo(125, 90, 70, 128, 0, 70); g.fill();
  g.strokeStyle = 'rgba(30,10,40,.55)'; g.lineWidth = 2; for (let i = 0; i < 5; i++) { g.beginPath(); g.moveTo(2, 66); g.quadraticCurveTo(50, 40 + i * 10, 115, 30 + i * 16); g.stroke(); }
  g.fillStyle = 'rgba(255,255,255,.8)'; for (let i = 0; i < 4; i++) { g.beginPath(); g.arc(80 + i * 8, 40 + i * 9, 3, 0, Math.PI * 2); g.fill(); }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return (cache[k] = t);
}
// rune strip for the portal stones
export function runeTexture() {
  if (cache.rune) return cache.rune;
  const c = document.createElement('canvas'); c.width = 512; c.height = 64; const g = c.getContext('2d');
  g.fillStyle = '#000'; g.fillRect(0, 0, 512, 64); g.strokeStyle = '#fff'; g.lineWidth = 3; g.lineCap = 'round';
  for (let i = 0; i < 16; i++) { const x = 16 + i * 32; g.beginPath(); for (let j = 0; j < 4; j++) { const a = hash(i, j, 50), b = hash(i, j, 51); j ? g.lineTo(x + (a - 0.5) * 20, 12 + b * 40) : g.moveTo(x + (a - 0.5) * 20, 12 + b * 40); } g.stroke(); }
  const t = new THREE.CanvasTexture(c); t.wrapS = THREE.RepeatWrapping; return (cache.rune = t);
}
