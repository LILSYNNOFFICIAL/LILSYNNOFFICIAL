// Level 1: The Neon Playground — geometry, colliders, collectibles, mobs, arena.
import * as THREE from 'three';
import { Reflector } from 'three/addons/objects/Reflector.js';
import { makePeacockFeather } from './characters.js';

export const NEON = { pink: 0xff2fa8, cyan: 0x29e0ff, purple: 0x9a4dff, yellow: 0xffd23a, blue: 0x3a6bff, green: 0x30ffb0 };
const neonMat = (c, i = 3) => new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: i, roughness: 0.3 });
export const ARENA = { center: new THREE.Vector3(0, 0, -128), radius: 19, gateZ: -106 };

// ---------- nebula sky ----------
function makeSky() {
  const mat = new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false, fog: false,
    uniforms: { uTime: { value: 0 }, uTex: { value: null }, uHasTex: { value: 0 } },
    vertexShader: `varying vec3 vDir; void main(){ vDir = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
    fragmentShader: `
      varying vec3 vDir; uniform float uTime; uniform sampler2D uTex; uniform float uHasTex;
      float h(vec3 p){ p = fract(p*0.3183099+.1); p*=17.0; return fract(p.x*p.y*p.z*(p.x+p.y+p.z)); }
      float n(vec3 x){ vec3 i=floor(x); vec3 f=fract(x); f=f*f*(3.0-2.0*f);
        return mix(mix(mix(h(i),h(i+vec3(1,0,0)),f.x),mix(h(i+vec3(0,1,0)),h(i+vec3(1,1,0)),f.x),f.y),
                   mix(mix(h(i+vec3(0,0,1)),h(i+vec3(1,0,1)),f.x),mix(h(i+vec3(0,1,1)),h(i+vec3(1,1,1)),f.x),f.y),f.z); }
      float fbm(vec3 p){ float v=0.0,a=0.5; for(int i=0;i<5;i++){ v+=a*n(p); p*=2.03; a*=0.5;} return v; }
      void main(){
        vec3 d = normalize(vDir);
        if (uHasTex > 0.5) {
          vec2 uv = vec2(atan(d.z, d.x) / 6.2831853 + 0.5, asin(clamp(d.y,-1.0,1.0)) / 3.14159265 + 0.5);
          gl_FragColor = vec4(texture2D(uTex, uv).rgb * 1.1, 1.0); return;
        }
        float up = clamp(d.y*0.5+0.5, 0.0, 1.0);
        vec3 col = mix(vec3(0.10,0.02,0.16), vec3(0.01,0.0,0.04), pow(up,0.8));
        float neb = fbm(d*2.2 + vec3(0.0, 0.0, uTime*0.004));
        float neb2 = fbm(d*4.5 + vec3(3.1));
        col += vec3(0.85,0.12,0.6) * smoothstep(0.45,0.85,neb) * 0.85 * (0.4+up);
        col += vec3(0.15,0.25,0.95) * smoothstep(0.5,0.9,neb2) * 0.7 * up;
        col += vec3(0.5,0.1,0.9) * smoothstep(0.55,0.95,neb*neb2*1.8) * 0.6;
        float s = h(floor(d*420.0)); col += vec3(1.0) * step(0.9975, s) * (0.6+0.6*up);
        float s2 = h(floor(d*180.0)+7.0); col += vec3(0.8,0.9,1.0) * step(0.999, s2) * 1.5;
        col += vec3(0.9,0.2,0.5) * pow(1.0-abs(d.y), 8.0) * 0.35; // horizon glow
        gl_FragColor = vec4(col, 1.0);
      }`
  });
  const sky = new THREE.Mesh(new THREE.SphereGeometry(400, 32, 16), mat);
  sky.frustumCulled = false; sky.renderOrder = -1;
  return sky;
}

// ---------- broken heart collectible ----------
let _heartGeo = null;
function brokenHeartGeos() {
  if (_heartGeo) return _heartGeo;
  const zig = [[0, -17], [1.6, -13], [-1.4, -9], [1.8, -5], [-1.2, -1], [1.4, 3], [0, 5]];
  const half = (sx) => {
    const s = new THREE.Shape();
    const pts = [];
    for (let i = 0; i <= 24; i++) { const t = (i / 24) * Math.PI; pts.push([sx * 16 * Math.pow(Math.sin(t), 3), 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)]); }
    s.moveTo(pts[0][0], pts[0][1]);
    pts.slice(1).forEach(p => s.lineTo(p[0], p[1]));
    zig.forEach(p => s.lineTo(p[0], p[1]));
    const g = new THREE.ExtrudeGeometry(s, { depth: 4, bevelEnabled: true, bevelThickness: 1.2, bevelSize: 1, bevelSegments: 2 });
    g.translate(0, 6, -2); g.scale(0.022, 0.022, 0.022);
    return g;
  };
  _heartGeo = [half(1), half(-1)];
  return _heartGeo;
}
export function makeBrokenHeart() {
  const [r, l] = brokenHeartGeos();
  const mat = new THREE.MeshStandardMaterial({ color: 0xff3fa0, emissive: 0xff1a8c, emissiveIntensity: 2.2, roughness: 0.2, metalness: 0.2 });
  const g = new THREE.Group();
  const a = new THREE.Mesh(r, mat), b = new THREE.Mesh(l, mat);
  a.position.x = 0.04; b.position.x = -0.04; a.rotation.z = -0.08; b.rotation.z = 0.08;
  g.add(a, b);
  const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture(), color: 0xff3fa0, transparent: true, opacity: 0.55, depthWrite: false, blending: THREE.AdditiveBlending }));
  glow.scale.setScalar(1.4); g.add(glow);
  return g;
}

let _glow = null;
export function glowTexture() {
  if (_glow) return _glow;
  const c = document.createElement('canvas'); c.width = c.height = 64;
  const g = c.getContext('2d'); const rg = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  rg.addColorStop(0, 'rgba(255,255,255,1)'); rg.addColorStop(0.25, 'rgba(255,255,255,0.5)'); rg.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = rg; g.fillRect(0, 0, 64, 64);
  _glow = new THREE.CanvasTexture(c); return _glow;
}

function signTexture(text, color) {
  const c = document.createElement('canvas'); c.width = 512; c.height = 128;
  const g = c.getContext('2d');
  g.font = 'bold 84px "Arial Black", Impact, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.shadowColor = color; g.shadowBlur = 24; g.fillStyle = '#fff'; g.fillText(text, 256, 66);
  g.shadowBlur = 8; g.fillStyle = color; g.fillText(text, 256, 66);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

function brickTexture() {
  const c = document.createElement('canvas'); c.width = 256; c.height = 128; const g = c.getContext('2d');
  g.fillStyle = '#1a0d14'; g.fillRect(0, 0, 256, 128);
  for (let y = 0; y < 8; y++) for (let x = -1; x < 9; x++) {
    const ox = (y % 2) * 16; const v = 30 + Math.random() * 25;
    g.fillStyle = `rgb(${v + 20},${v * 0.45},${v * 0.55})`; g.fillRect(x * 32 + ox + 1, y * 16 + 1, 30, 14);
  }
  // graffiti splashes
  const cols = ['#ff2fa8', '#29e0ff', '#9a4dff', '#ffd23a'];
  for (let i = 0; i < 5; i++) { g.strokeStyle = cols[i % 4]; g.globalAlpha = 0.5; g.lineWidth = 3 + Math.random() * 4; g.beginPath(); g.moveTo(Math.random() * 256, Math.random() * 128); for (let k = 0; k < 4; k++) g.quadraticCurveTo(Math.random() * 256, Math.random() * 128, Math.random() * 256, Math.random() * 128); g.stroke(); }
  g.globalAlpha = 1;
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; return t;
}

// ---------- builder ----------
export function buildLevel(scene, quality, renderer) {
  const L = { colliders: [], ramps: [], bars: [], hearts: [], wisps: [], movers: [], swings: [], anim: [], checkpoints: [] };
  const sky = makeSky(); scene.add(sky); L.sky = sky;

  // environment map from the sky for wet reflections
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envScene = new THREE.Scene(); const skyCopy = makeSky(); skyCopy.scale.setScalar(0.1); envScene.add(skyCopy);
  const env = pmrem.fromScene(envScene, 0.02).texture;
  scene.environment = env; L.env = env; L.pmrem = pmrem;
  L.setSkyTexture = (tex) => {
    tex.colorSpace = THREE.SRGBColorSpace;
    for (const s of [sky, skyCopy]) { s.material.uniforms.uTex.value = tex; s.material.uniforms.uHasTex.value = 1; }
    const e2 = pmrem.fromScene(envScene, 0.02).texture; scene.environment = e2;
  };

  // wet reflective ground
  const groundSize = [140, 300];
  if (quality.reflections) {
    const refl = new Reflector(new THREE.PlaneGeometry(...groundSize), { textureWidth: Math.floor(window.innerWidth * 0.5), textureHeight: Math.floor(window.innerHeight * 0.5), color: 0x777788 });
    refl.rotation.x = -Math.PI / 2; refl.position.set(0, -0.005, -60); scene.add(refl); L.reflector = refl;
  }
  const groundMat = new THREE.MeshStandardMaterial({ color: 0x0b0912, roughness: 0.18, metalness: 0.6, envMapIntensity: 1.2, transparent: !!quality.reflections, opacity: quality.reflections ? 0.72 : 1 });
  L.groundMat = groundMat;
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(...groundSize), groundMat);
  ground.rotation.x = -Math.PI / 2; ground.position.set(0, 0, -60); ground.receiveShadow = true; scene.add(ground);
  // neon path lines on the ground
  for (const x of [-4.2, 4.2]) {
    const line = new THREE.Mesh(new THREE.PlaneGeometry(0.08, 110), neonMat(x < 0 ? NEON.pink : NEON.cyan, 2.5));
    line.rotation.x = -Math.PI / 2; line.position.set(x, 0.01, -48); scene.add(line);
  }

  const box = (x, y, z, w, h, d, mat, opts = {}) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    m.position.set(x, y + h / 2, z); m.castShadow = true; m.receiveShadow = true; scene.add(m);
    if (opts.solid !== false) L.colliders.push({ min: new THREE.Vector3(x - w / 2, y, z - d / 2), max: new THREE.Vector3(x + w / 2, y + h, z + d / 2), mesh: m });
    return m;
  };
  const tube = (a, b, r, mat) => {
    const va = new THREE.Vector3(...a), vb = new THREE.Vector3(...b);
    const len = va.distanceTo(vb);
    const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, len, 8), mat);
    m.position.copy(va).add(vb).multiplyScalar(0.5);
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), vb.clone().sub(va).normalize());
    m.castShadow = true; scene.add(m); return m;
  };
  L.platMats = [];
  const platMat = (c) => { const m = new THREE.MeshStandardMaterial({ color: 0x151022, roughness: 0.35, metalness: 0.3 }); L.platMats.push(m); return m; };
  const edge = (m, c) => { // neon trim around a platform top
    const p = m.geometry.parameters; const y = m.position.y + p.height / 2 + 0.02;
    const t = new THREE.Mesh(new THREE.BoxGeometry(p.width + 0.06, 0.06, p.depth + 0.06), neonMat(c, 2.5));
    t.position.set(m.position.x, y - 0.04, m.position.z); scene.add(t);
    return t;
  };
  const plat = (x, y, z, w, d, c = NEON.pink, h = 0.4) => { const m = box(x, y - h, z, w, h, d, platMat()); edge(m, c); return m; };
  const heart = (x, y, z) => { const h = makeBrokenHeart(); h.position.set(x, y, z); scene.add(h); L.hearts.push({ obj: h, base: y, taken: false }); };
  const wisp = (x, y, z, r = 1.5, speed = 1) => {
    const g = new THREE.Group();
    const core = new THREE.Mesh(new THREE.IcosahedronGeometry(0.32, 1), new THREE.MeshStandardMaterial({ color: 0x1a0030, emissive: 0x7a2bff, emissiveIntensity: 2.4, roughness: 0.2, flatShading: true }));
    const spark = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 6), new THREE.MeshBasicMaterial({ color: 0xffffff }));
    const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture(), color: 0x9a4dff, transparent: true, opacity: 0.8, depthWrite: false, blending: THREE.AdditiveBlending }));
    halo.scale.setScalar(2);
    const face = new THREE.Sprite(new THREE.SpriteMaterial({ transparent: true, depthWrite: false, opacity: 0 }));
    face.scale.setScalar(1.5);
    g.add(core, spark, halo, face); g.position.set(x, y, z); scene.add(g);
    L.wisps.push({ obj: g, core, spark, face, home: new THREE.Vector3(x, y, z), r, speed, phase: Math.random() * 6, alive: true, dying: 0 });
  };

  // brick wall backdrop with neon sign (start area)
  const brick = brickTexture(); brick.repeat.set(6, 2);
  const wallMat = new THREE.MeshStandardMaterial({ map: brick, roughness: 0.85 });
  L.wallMat = wallMat;
  box(0, 0, 16, 34, 7, 1, wallMat);
  const sign = new THREE.Mesh(new THREE.PlaneGeometry(9, 2.25), new THREE.MeshBasicMaterial({ map: signTexture('LIL SYNN', '#ff2fa8'), transparent: true, toneMapped: false, color: 0xffffff }));
  sign.position.set(0, 4.6, 15.45); sign.rotation.y = Math.PI; scene.add(sign);
  const sign2 = new THREE.Mesh(new THREE.PlaneGeometry(7, 1.75), new THREE.MeshBasicMaterial({ map: signTexture('BROKEN HEARTS', '#29e0ff'), transparent: true, toneMapped: false }));
  sign2.position.set(0, 3.0, 15.45); sign2.rotation.y = Math.PI; scene.add(sign2);
  // side walls (soft boundaries)
  box(-24, 0, -50, 1, 5, 150, wallMat); box(24, 0, -50, 1, 5, 150, wallMat);

  // distant city silhouette (instanced)
  const nB = quality.low ? 40 : 90;
  const bGeo = new THREE.BoxGeometry(1, 1, 1);
  const bMat = new THREE.MeshStandardMaterial({ color: 0x07050c, roughness: 0.9, emissive: 0x12051c, emissiveIntensity: 0.6 });
  const city = new THREE.InstancedMesh(bGeo, bMat, nB); const dummy = new THREE.Object3D();
  const winGeo = new THREE.PlaneGeometry(1, 1);
  const winMat = new THREE.MeshBasicMaterial({ color: 0xff5fc8, toneMapped: false });
  const wins = new THREE.InstancedMesh(winGeo, winMat, nB);
  for (let i = 0; i < nB; i++) {
    const a = (i / nB) * Math.PI * 2; const R = 95 + Math.random() * 40;
    const w = 6 + Math.random() * 10, h = 12 + Math.random() * 45;
    dummy.position.set(Math.cos(a) * R, h / 2, -60 + Math.sin(a) * R * 1.4); dummy.scale.set(w, h, w); dummy.rotation.y = -a; dummy.updateMatrix();
    city.setMatrixAt(i, dummy.matrix);
    dummy.position.y = h * (0.5 + Math.random() * 0.4); dummy.scale.set(w * 0.3, 0.6, 1); dummy.position.x -= Math.cos(a) * (w / 2 + 0.05); dummy.position.z -= Math.sin(a) * 1.4 * (w / 2 + 0.05); dummy.lookAt(0, dummy.position.y, -60); dummy.updateMatrix();
    wins.setMatrixAt(i, dummy.matrix); wins.setColorAt(i, new THREE.Color([NEON.pink, NEON.cyan, NEON.purple, NEON.yellow][i % 4]));
  }
  scene.add(city, wins);

  // ===== Zone A: swings + slide (start) =====
  // swing set (decorative, animated)
  const swingFrame = neonMat(NEON.purple, 2);
  tube([-11, 0, 4], [-10, 4, 4], 0.08, swingFrame); tube([-9, 0, 4], [-10, 4, 4], 0.08, swingFrame);
  tube([-11, 0, -2], [-10, 4, -2], 0.08, swingFrame); tube([-9, 0, -2], [-10, 4, -2], 0.08, swingFrame);
  tube([-10, 4, 4.2], [-10, 4, -2.2], 0.1, neonMat(NEON.pink, 3));
  for (const z of [2.4, -0.4]) {
    const piv = new THREE.Group(); piv.position.set(-10, 4, z); scene.add(piv);
    const chMat = new THREE.MeshStandardMaterial({ color: 0xaaaacc, metalness: 1, roughness: 0.3 });
    for (const dz of [-0.35, 0.35]) { const c = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 3.2, 4), chMat); c.position.set(0, -1.6, dz); piv.add(c); }
    const seat = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.06, 0.85), neonMat(NEON.cyan, 2)); seat.position.y = -3.2; piv.add(seat);
    L.swings.push({ piv, ph: z });
  }
  // slide: ladder tower + ramp
  const tower = plat(7, 2.6, 6, 2.2, 2.2, NEON.yellow, 2.6);
  tube([6, 0, 7.2], [6, 2.6, 7.2], 0.05, neonMat(NEON.yellow, 2)); tube([8, 0, 7.2], [8, 2.6, 7.2], 0.05, neonMat(NEON.yellow, 2));
  for (let y = 0.4; y < 2.6; y += 0.45) tube([6, y, 7.25], [8, y, 7.25], 0.035, neonMat(NEON.yellow, 1.5));
  { // ramp from (7,2.6,4.9) down to (7,0,-1.5)
    const z0 = 4.9, z1 = -1.5, y0 = 2.6, y1 = 0.05; const len = Math.hypot(z0 - z1, y0 - y1);
    L.slideMat = new THREE.MeshStandardMaterial({ color: 0xff2fa8, emissive: 0xff2fa8, emissiveIntensity: 0.5, metalness: 0.3, roughness: 0.3 });
    const r = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.12, len), L.slideMat);
    r.position.set(7, (y0 + y1) / 2 - 0.06, (z0 + z1) / 2); r.rotation.x = -Math.atan2(y0 - y1, z0 - z1); r.castShadow = r.receiveShadow = true; scene.add(r);
    for (const sx of [-0.8, 0.8]) tube([7 + sx, y0 + 0.35, z0], [7 + sx, y1 + 0.35, z1], 0.05, neonMat(NEON.cyan, 3));
    L.ramps.push({ minX: 6.2, maxX: 7.8, z0, z1, y0, y1 });
  }
  heart(7, 3.4, 6); heart(-10, 1.2, 1); heart(0, 1.0, -4);

  // ===== Zone B: stepping platforms =====
  plat(-2, 1.0, -12, 3, 3, NEON.cyan); heart(-2, 1.8, -12);
  plat(2.5, 2.0, -16, 2.5, 2.5, NEON.pink); heart(2.5, 2.8, -16);
  plat(-1.5, 3.0, -20.5, 2.5, 2.5, NEON.purple);
  plat(3, 4.2, -24.5, 2.2, 2.2, NEON.cyan); heart(3, 5.0, -24.5);
  // climb wall: tall block you must ledge-grab/double-jump
  const wall = box(-6, 0, -26, 4, 2.9, 2, platMat()); edge(wall, NEON.yellow); heart(-6, 3.7, -26);
  wisp(0, 1.0, -9, 2.0); wisp(-4, 1.0, -21, 1.5);

  // ===== Zone C: monkey bars =====
  const barsMat = neonMat(NEON.cyan, 1.8), rungMat = neonMat(NEON.pink, 1.3);
  plat(0, 3.0, -33, 3.5, 3.5, NEON.pink);
  // ramp of steps up to it
  plat(-3.2, 1.0, -30, 2, 2, NEON.purple); plat(-3.2, 2.0, -32.6, 1.6, 1.6, NEON.purple);
  const barY = 5.0, bz0 = -35, bz1 = -46;
  for (const x of [-0.5, 0.5]) {
    tube([x, barY, bz0], [x, barY, bz1], 0.05, barsMat);
    tube([x, 0, bz0 - 0.2], [x, barY, bz0 - 0.2], 0.06, barsMat);
    tube([x, 0, bz1 + 0.2], [x, barY, bz1 + 0.2], 0.06, barsMat);
  }
  for (let z = bz0; z >= bz1; z -= 0.7) tube([-0.5, barY, z], [0.5, barY, z], 0.035, rungMat);
  L.bars.push({ a: new THREE.Vector3(0, barY, bz0), b: new THREE.Vector3(0, barY, bz1) });
  plat(0, 3.0, -48.2, 3.5, 3.5, NEON.cyan);
  heart(0, 3.6, -38); heart(0, 3.6, -42); heart(0, 3.8, -48.2);
  wisp(0, 1.0, -40, 0.5, 2.0); wisp(-3, 1.0, -43, 1.0, 1.4);
  // second, side monkey bar running along x
  const b2y = 4.2, bx0 = 2.2, bx1 = 10;
  for (const z of [-48.7, -47.7]) {
    tube([bx0, b2y, z], [bx1, b2y, z], 0.05, barsMat);
    tube([bx1 + 0.2, 0, z], [bx1 + 0.2, b2y, z], 0.06, barsMat);
  }
  for (let x = bx0; x <= bx1; x += 0.7) tube([x, b2y, -48.7], [x, b2y, -47.7], 0.035, rungMat);
  L.bars.push({ a: new THREE.Vector3(bx0, b2y, -48.2), b: new THREE.Vector3(bx1, b2y, -48.2) });
  plat(11.5, 2.2, -48.2, 2.2, 2.2, NEON.yellow); heart(11.5, 3.0, -48.2); heart(6, 2.7, -48.2);

  // ===== Zone D: moving platforms over a glowing pool =====
  const pool = new THREE.Mesh(new THREE.PlaneGeometry(16, 18), new THREE.MeshStandardMaterial({ color: 0x220040, emissive: 0x5a1aa8, emissiveIntensity: 0.6, roughness: 0.05, metalness: 0.5, transparent: true, opacity: 0.85 }));
  pool.rotation.x = -Math.PI / 2; pool.position.set(0, 0.02, -64); scene.add(pool);
  L.pool = { minX: -8, maxX: 8, minZ: -73, maxZ: -55 };
  plat(0, 1.2, -54, 3, 2, NEON.purple);
  const mover = (x, y, z, ax, amp, spd, c) => {
    const m = box(x, y - 0.35, z, 2.4, 0.35, 2.4, platMat()); const t = edge(m, c);
    const col = L.colliders[L.colliders.length - 1];
    const mv = { m, t, col, base: new THREE.Vector3(x, y, z), ax, amp, spd, delta: new THREE.Vector3(), ph: Math.random() * 6 };
    col.mover = mv; L.movers.push(mv);
  };
  mover(-3, 1.8, -58.5, 'x', 3.5, 0.9, NEON.cyan);
  mover(3, 2.6, -63, 'x', 3.5, 1.1, NEON.pink);
  mover(0, 3.2, -67.5, 'y', 1.2, 1.3, NEON.yellow);
  plat(0, 2.0, -73, 3, 2.4, NEON.cyan);
  heart(-3, 2.6, -58.5); heart(3, 3.4, -63); heart(0, 5.0, -67.5);
  wisp(-5, 1.0, -75, 1.6, 1.2); wisp(5, 1.0, -77, 1.6, 1.2);

  // ===== Zone E: jungle-gym tower =====
  plat(-4, 1.2, -82, 2.5, 2.5, NEON.pink);
  plat(-1, 2.6, -85, 2.2, 2.2, NEON.purple);
  plat(-4.5, 4.0, -88, 2.2, 2.2, NEON.cyan);
  plat(-1, 5.4, -91, 2.6, 2.6, NEON.yellow); heart(-1, 6.3, -91);
  for (const [x, z] of [[-2.3, -89.7], [0.3, -89.7], [-2.3, -92.3], [0.3, -92.3]]) tube([x, 0, z], [x, 5.4, z], 0.06, neonMat(NEON.yellow, 2));
  heart(-4.5, 4.8, -88); heart(4, 1.0, -86);
  wisp(2, 1.0, -88, 2.2, 1.0); wisp(-2, 1.0, -97, 2.5, 1.1);

  // ===== Gate & boss arena =====
  const gateMat = neonMat(NEON.pink, 3.5);
  tube([-5, 0, ARENA.gateZ], [-5, 6, ARENA.gateZ], 0.15, gateMat); tube([5, 0, ARENA.gateZ], [5, 6, ARENA.gateZ], 0.15, gateMat);
  tube([-5, 6, ARENA.gateZ], [5, 6, ARENA.gateZ], 0.15, gateMat);
  const gSign = new THREE.Mesh(new THREE.PlaneGeometry(8, 2), new THREE.MeshBasicMaterial({ map: signTexture('SHADOW ZONE', '#9a4dff'), transparent: true, toneMapped: false }));
  gSign.position.set(0, 7.2, ARENA.gateZ); scene.add(gSign);
  // arena floor & ring
  const C = ARENA.center;
  const floor = new THREE.Mesh(new THREE.CircleGeometry(ARENA.radius + 1, 64), new THREE.MeshStandardMaterial({ color: 0x0a0614, roughness: 0.15, metalness: 0.7, transparent: !!quality.reflections, opacity: quality.reflections ? 0.8 : 1 }));
  floor.rotation.x = -Math.PI / 2; floor.position.set(C.x, 0.015, C.z); floor.receiveShadow = true; scene.add(floor);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(ARENA.radius + 0.6, 0.12, 8, 96), neonMat(NEON.purple, 3)); ring.rotation.x = Math.PI / 2; ring.position.set(C.x, 0.05, C.z); scene.add(ring);
  const ring2 = new THREE.Mesh(new THREE.TorusGeometry(6, 0.06, 6, 64), neonMat(NEON.pink, 2)); ring2.rotation.x = Math.PI / 2; ring2.position.set(C.x, 0.04, C.z); scene.add(ring2);
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    const x = C.x + Math.cos(a) * (ARENA.radius + 1.5), z = C.z + Math.sin(a) * (ARENA.radius + 1.5);
    if (z > C.z + ARENA.radius - 2) continue; // keep entrance clear
    tube([x, 0, z], [x, 4 + (i % 3), z], 0.18, neonMat([NEON.purple, NEON.pink, NEON.cyan][i % 3], 3));
  }
  // barrier that appears when the fight starts
  const barrier = new THREE.Mesh(new THREE.CylinderGeometry(ARENA.radius + 0.6, ARENA.radius + 0.6, 5, 64, 1, true), new THREE.MeshBasicMaterial({ color: 0x9a4dff, transparent: true, opacity: 0.0, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending }));
  barrier.position.set(C.x, 2.5, C.z); scene.add(barrier); L.barrier = barrier;
  // girl's cage
  const cage = new THREE.Group(); cage.position.set(C.x, 1.6, C.z - 13); scene.add(cage);
  const cageMat = new THREE.MeshStandardMaterial({ color: 0x05000a, emissive: 0x4a0a90, emissiveIntensity: 1.4, roughness: 0.4 });
  for (let i = 0; i < 14; i++) { const a = (i / 14) * Math.PI * 2; const b = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 2.6, 5), cageMat); b.position.set(Math.cos(a) * 0.9, 1.3, Math.sin(a) * 0.9); cage.add(b); }
  for (const y of [0, 2.6]) { const r = new THREE.Mesh(new THREE.TorusGeometry(0.9, 0.08, 6, 28), cageMat); r.rotation.x = Math.PI / 2; r.position.y = y; cage.add(r); }
  const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.5, 1.6, 24), new THREE.MeshStandardMaterial({ color: 0x0d0818, metalness: 0.6, roughness: 0.3 }));
  pedestal.position.set(C.x, 0.8, C.z - 13); scene.add(pedestal);
  L.colliders.push({ min: new THREE.Vector3(C.x - 1.3, 0, C.z - 14.3), max: new THREE.Vector3(C.x + 1.3, 1.6, C.z - 11.7), mesh: pedestal });
  L.cage = cage; L.cageMat = cageMat;
  heart(C.x - 10, 1.0, C.z + 4); heart(C.x + 10, 1.0, C.z + 4);

  // checkpoints
  L.checkpoints.push(new THREE.Vector3(0, 0, 8), new THREE.Vector3(0, 0, ARENA.gateZ + 4));

  // a few real neon point lights (budgeted)
  const pl = (c, x, y, z, i, d) => { const l = new THREE.PointLight(c, i, d, 2); l.position.set(x, y, z); scene.add(l); return l; };
  if (!quality.low) {
    pl(NEON.pink, 0, 5, 12, 40, 30); pl(NEON.cyan, 0, 6, -40, 40, 30); pl(NEON.purple, 0, 6, -66, 40, 30); pl(NEON.purple, 0, 8, -128, 80, 45);
  } else {
    pl(NEON.pink, 0, 6, -20, 50, 50); pl(NEON.purple, 0, 8, -128, 80, 45);
  }

  // apply game-art textures when they arrive (procedural fallbacks stay otherwise)
  L.applyTextures = (T) => {
    const rep = (t, x, y) => { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(x, y); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t; };
    if (T.asphalt) { groundMat.map = rep(T.asphalt, 28, 60); groundMat.color.set(0x8a8a9a); groundMat.roughness = 0.25; groundMat.needsUpdate = true; }
    if (T.rubber) { floor.material.map = rep(T.rubber, 8, 8); floor.material.color.set(0x8a7aa0); floor.material.roughness = 0.55; floor.material.needsUpdate = true; }
    if (T.brick) { wallMat.map = rep(T.brick, 1, 1); wallMat.needsUpdate = true; for (const c of L.colliders) if (c.mesh && c.mesh.material === wallMat) { const p = c.mesh.geometry.parameters; const uv = c.mesh.geometry.attributes.uv; for (let i = 0; i < uv.count; i++) { const f = Math.floor(i / 4); const w = f < 2 ? p.depth : p.width; const h = f === 2 || f === 3 ? p.depth : p.height; uv.setXY(i, uv.getX(i) * w / 4, uv.getY(i) * h / 4); } uv.needsUpdate = true; } }
    if (T.metal) { T.metal.colorSpace = THREE.SRGBColorSpace; T.metal.wrapS = T.metal.wrapT = THREE.RepeatWrapping; for (const m of L.platMats) { m.map = T.metal; m.color.set(0x4a3a5c); m.needsUpdate = true; } if (L.slideMat) { L.slideMat.map = T.metal; L.slideMat.color.set(0xffffff); L.slideMat.emissiveIntensity = 0.15; L.slideMat.needsUpdate = true; } }
    if (T.wisp) for (const w of L.wisps) { w.face.material.map = T.wisp; w.face.material.opacity = 1; w.face.material.needsUpdate = true; w.core.scale.setScalar(0.55); }
  };

  L.update = (t, dt) => {
    sky.material.uniforms.uTime.value = t;
    for (const s of L.swings) s.piv.rotation.z = Math.sin(t * 1.6 + s.ph) * 0.45;
    for (const mv of L.movers) {
      const off = Math.sin(t * mv.spd + mv.ph) * mv.amp;
      const np = mv.base.clone(); np[mv.ax] += off;
      const old = mv.m.position.clone();
      mv.m.position.set(np.x, np.y - 0.175, np.z);
      mv.t.position.set(np.x, np.y - 0.02, np.z);
      mv.delta.copy(mv.m.position).sub(old);
      mv.col.min.set(np.x - 1.2, np.y - 0.35, np.z - 1.2); mv.col.max.set(np.x + 1.2, np.y, np.z + 1.2);
    }
    ring2.rotation.z = t * 0.3;
  };
  return L;
}

export { makePeacockFeather };
