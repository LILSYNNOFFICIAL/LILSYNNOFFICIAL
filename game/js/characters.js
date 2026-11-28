// Characters: rigged GLB heroes when available (assets/models/*.glb, AnimationMixer + crossfades),
// with on-model procedural fallbacks (smooth lathe/tube forms, PBR fabric/leather/denim maps).
// LIL SYNN is always faceless: matte-black mask, hood up, pink galaxy aviators, crown necklace.
import * as THREE from 'three';
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';
import { normalMap, galaxyTexture, glowTexture, furTexture } from './textures.js';

const V3 = THREE.Vector3;
const lerp = THREE.MathUtils.lerp, damp = (a, b, k, dt) => lerp(a, b, 1 - Math.exp(-k * dt));

function mat(kind, color, o = {}) {
  const base = { color, roughness: 0.6, metalness: 0 };
  if (kind === 'fabric') return new THREE.MeshPhysicalMaterial({ ...base, roughness: 0.82, sheen: 0.45, sheenRoughness: 0.6, envMapIntensity: 0.4, sheenColor: new THREE.Color(o.sheen || 0x2a2838), normalMap: rep(normalMap('fabric'), o.rep || 4), normalScale: new THREE.Vector2(0.6, 0.6), ...o.x });
  if (kind === 'rib') return new THREE.MeshPhysicalMaterial({ ...base, roughness: 0.85, sheen: 0.5, sheenColor: new THREE.Color(0x3a3550), normalMap: rep(normalMap('rib'), o.rep || 3), normalScale: new THREE.Vector2(0.8, 0.8) });
  if (kind === 'denim') return new THREE.MeshPhysicalMaterial({ ...base, roughness: 0.9, sheen: 0.3, sheenColor: new THREE.Color(0x3a5a9a), normalMap: rep(normalMap('denim'), o.rep || 4), normalScale: new THREE.Vector2(0.7, 0.7) });
  if (kind === 'leather') return new THREE.MeshPhysicalMaterial({ ...base, roughness: o.r ?? 0.42, clearcoat: o.cc ?? 0.35, clearcoatRoughness: 0.4, normalMap: rep(normalMap('leather'), o.rep || 3), normalScale: new THREE.Vector2(0.35, 0.35) });
  if (kind === 'mask') return new THREE.MeshPhysicalMaterial({ ...base, color: 0x030304, roughness: 0.66, sheen: 0.2, sheenColor: new THREE.Color(0x1a1820), envMapIntensity: 0.35, normalMap: rep(normalMap('skin'), 2), normalScale: new THREE.Vector2(0.25, 0.25) });
  if (kind === 'metal') return new THREE.MeshPhysicalMaterial({ ...base, metalness: 1, roughness: o.r ?? 0.25, ...o.x });
  if (kind === 'skin') return new THREE.MeshPhysicalMaterial({ ...base, roughness: 0.55, sheen: 0.25, sheenColor: new THREE.Color(0xffc0a0), normalMap: rep(normalMap('skin'), 2), normalScale: new THREE.Vector2(0.2, 0.2) });
  return new THREE.MeshStandardMaterial({ ...base, ...o.x });
}
function rep(t, n) { const c = t.clone(); c.needsUpdate = true; c.wrapS = c.wrapT = THREE.RepeatWrapping; c.repeat.set(n, n); return c; }
function M(geo, m, parent, pos = [0, 0, 0], rot = [0, 0, 0], sc) { const o = new THREE.Mesh(geo, m); o.position.set(...pos); o.rotation.set(...rot); if (sc) o.scale.set(...sc); o.castShadow = true; o.receiveShadow = true; parent.add(o); return o; }
function lathe(profile, seg = 28) { return new THREE.LatheGeometry(profile.map(([r, y]) => new THREE.Vector2(r, y)), seg); }
// tapered limb with soft fold rings
function limb(len, r0, r1, seg = 18, folds = 0) {
  const pts = []; const n = 14;
  for (let i = 0; i <= n; i++) { const u = i / n; let r = lerp(r0, r1, u); if (folds) r *= 1 + folds * Math.sin(u * Math.PI * 7) * Math.sin(u * Math.PI); if (i === 0) r *= 0.75; if (i === n) r *= 0.8; pts.push([r, -u * len]); }
  return lathe(pts, seg);
}

// ---------- shared props ----------
export const lensMats = [];
function shades(parent, s = 1, z = 0.11) {
  const g = new THREE.Group(); g.position.set(0, 0.012, z); g.scale.setScalar(s); parent.add(g);
  const lens = new THREE.MeshPhysicalMaterial({ color: 0xff7ad0, emissive: 0xffffff, emissiveMap: galaxyTexture(), map: galaxyTexture(), emissiveIntensity: 1.15, roughness: 0.06, metalness: 0.2, iridescence: 1, iridescenceIOR: 1.6, clearcoat: 1, clearcoatRoughness: 0.05 });
  lensMats.push(lens);
  const frame = mat('metal', 0xff6ac8, { r: 0.22, x: { emissive: 0xff2a9c, emissiveIntensity: 0.25 } });
  const sh = new THREE.Shape(); // aviator teardrop
  sh.moveTo(-0.034, 0.022); sh.bezierCurveTo(-0.01, 0.03, 0.03, 0.028, 0.036, 0.016); sh.bezierCurveTo(0.042, -0.006, 0.026, -0.03, 0.004, -0.031); sh.bezierCurveTo(-0.024, -0.031, -0.04, -0.008, -0.034, 0.022);
  const lg = new THREE.ExtrudeGeometry(sh, { depth: 0.003, bevelEnabled: true, bevelThickness: 0.002, bevelSize: 0.0015, bevelSegments: 2, curveSegments: 16 });
  // remap UVs to 0..1 so the galaxy fills the lens
  lg.computeBoundingBox(); const bb = lg.boundingBox, uv = lg.attributes.uv, p = lg.attributes.position;
  for (let i = 0; i < uv.count; i++) uv.setXY(i, (p.getX(i) - bb.min.x) / (bb.max.x - bb.min.x), (p.getY(i) - bb.min.y) / (bb.max.y - bb.min.y));
  const outline = sh.getPoints(24).map(v => new V3(v.x, v.y, 0.004));
  const fg = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(outline, true), 48, 0.0028, 6, true);
  for (const sgn of [-1, 1]) {
    const l = new THREE.Group(); l.position.set(sgn * 0.043, 0, 0); l.rotation.y = sgn * 0.22; l.scale.x = sgn; g.add(l);
    M(lg, lens, l).castShadow = false; M(fg, frame, l).castShadow = false;
    M(new THREE.CylinderGeometry(0.0022, 0.0022, 0.11, 6), frame, l, [0.04, 0.012, -0.055], [Math.PI / 2, 0, 0]); // temple arm
  }
  M(new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(new V3(-0.01, 0.018, 0.004), new V3(0, 0.026, 0.008), new V3(0.01, 0.018, 0.004)), 8, 0.0025, 5), frame, g);
  M(new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(new V3(-0.012, 0.004, 0.003), new V3(0, 0.0, 0.006), new V3(0.012, 0.004, 0.003)), 8, 0.0018, 5), frame, g);
  const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture(), color: 0xff5fc8, transparent: true, opacity: 0.22, depthWrite: false, blending: THREE.AdditiveBlending }));
  glow.scale.set(0.2, 0.09, 1); glow.position.z = -0.01; g.add(glow);
  return g;
}
function crownNecklace(parent, gold, neon, y = 0.36, z = 0.15) {
  const g = new THREE.Group(); parent.add(g);
  const curve = new THREE.CatmullRomCurve3([new V3(-0.075, y + 0.13, z - 0.05), new V3(-0.05, y + 0.05, z - 0.005), new V3(0, y + 0.0, z + 0.008), new V3(0.05, y + 0.05, z - 0.005), new V3(0.075, y + 0.13, z - 0.05)]);
  M(new THREE.TubeGeometry(curve, 40, 0.0035, 5), gold, g).castShadow = false;
  const s = new THREE.Shape(); s.moveTo(-0.034, 0); s.lineTo(0.034, 0); s.lineTo(0.04, 0.034); s.lineTo(0.018, 0.016); s.lineTo(0, 0.045); s.lineTo(-0.018, 0.016); s.lineTo(-0.04, 0.034); s.lineTo(-0.034, 0);
  const cg = new THREE.ExtrudeGeometry(s, { depth: 0.008, bevelEnabled: true, bevelThickness: 0.003, bevelSize: 0.0025, bevelSegments: 2 });
  const crown = M(cg, gold, g, [0, y - 0.045, z]); crown.castShadow = false;
  for (const [x, yy] of [[-0.04, 0.034], [0, 0.045], [0.04, 0.034]]) M(new THREE.SphereGeometry(0.0065, 10, 8), neon, crown, [x, yy + 0.004, 0.006]).castShadow = false;
  return g;
}
export function makeMic() {
  const g = new THREE.Group();
  M(new THREE.CylinderGeometry(0.016, 0.012, 0.15, 14), mat('leather', 0x0a0a0d, { r: 0.3 }), g, [0, 0.0, 0]);
  M(new THREE.CylinderGeometry(0.02, 0.017, 0.02, 16), mat('metal', 0xf0c050), g, [0, 0.08, 0]);
  const head = M(new THREE.SphereGeometry(0.034, 20, 16), new THREE.MeshPhysicalMaterial({ color: 0xffc0e6, metalness: 0.9, roughness: 0.3, emissive: 0xff3fae, emissiveIntensity: 0.25 }), g, [0, 0.115, 0]);
  const ring = M(new THREE.TorusGeometry(0.03, 0.004, 8, 24), new THREE.MeshBasicMaterial({ color: 0xff6ad5 }), g, [0, 0.1, 0], [Math.PI / 2, 0, 0]);
  g.userData = { head, ring }; return g;
}
export function makeWand() {
  const g = new THREE.Group(); const gold = mat('metal', 0xf3c04a, { r: 0.25 });
  M(new THREE.CylinderGeometry(0.008, 0.011, 0.32, 10), gold, g, [0, 0.12, 0]);
  const s = new THREE.Shape(); for (let i = 0; i < 10; i++) { const r = i % 2 ? 0.022 : 0.05, a = i / 10 * Math.PI * 2 + Math.PI / 2; i ? s.lineTo(Math.cos(a) * r, Math.sin(a) * r) : s.moveTo(Math.cos(a) * r, Math.sin(a) * r); }
  const star = M(new THREE.ExtrudeGeometry(s, { depth: 0.012, bevelEnabled: true, bevelThickness: 0.006, bevelSize: 0.005, bevelSegments: 2 }), new THREE.MeshStandardMaterial({ color: 0xff8ad8, emissive: 0xff4fc0, emissiveIntensity: 1.6, roughness: 0.3 }), g, [0, 0.31, -0.006]);
  g.userData = { star }; return g;
}
export function makeCello() {
  const g = new THREE.Group();
  const wood = new THREE.MeshPhysicalMaterial({ color: 0xff6fbf, roughness: 0.25, clearcoat: 1, emissive: 0xff2a9c, emissiveIntensity: 0.35, sheen: 0.4 });
  const pts = []; for (let i = 0; i <= 24; i++) { const u = i / 24; const r = 0.2 * (0.75 + 0.25 * Math.cos(u * Math.PI * 2 * 1.0)) * Math.sin(Math.PI * Math.min(1, u * 1.02)) + 0.002; pts.push([r, u * 0.75]); }
  M(lathe(pts, 32), wood, g, [0, 0, 0], [0, 0, 0], [1, 1, 0.35]);
  M(new THREE.BoxGeometry(0.035, 0.55, 0.03), mat('metal', 0x1a0a14, { r: 0.4 }), g, [0, 0.98, 0.02]);
  for (let i = -1.5; i <= 1.5; i++) M(new THREE.CylinderGeometry(0.0012, 0.0012, 1.1, 4), new THREE.MeshBasicMaterial({ color: 0xffe0f4 }), g, [i * 0.008, 0.72, 0.06]);
  g.userData = { wood }; return g;
}

// ---------- procedural humanoid rig (fallback) ----------
function humanoidRig() {
  const root = new THREE.Group(); const body = new THREE.Group(); root.add(body);
  const hips = new THREE.Group(); hips.position.y = 0.98; body.add(hips);
  const spine = new THREE.Group(); spine.position.y = 0.08; hips.add(spine);
  const chest = new THREE.Group(); chest.position.y = 0.2; spine.add(chest);
  const neck = new THREE.Group(); neck.position.y = 0.22; chest.add(neck);
  const head = new THREE.Group(); head.position.y = 0.13; neck.add(head);
  const arms = [], legs = [];
  for (const s of [-1, 1]) {
    const sh = new THREE.Group(); sh.position.set(s * 0.2, 0.15, 0); chest.add(sh);
    const fore = new THREE.Group(); fore.position.y = -0.29; sh.add(fore);
    const hand = new THREE.Group(); hand.position.y = -0.26; fore.add(hand);
    arms.push({ sh, fore, hand, s });
    const th = new THREE.Group(); th.position.set(s * 0.1, -0.04, 0); hips.add(th);
    const shin = new THREE.Group(); shin.position.y = -0.44; th.add(shin);
    const foot = new THREE.Group(); foot.position.y = -0.43; shin.add(foot);
    legs.push({ th, shin, foot, s });
  }
  return { root, body, hips, spine, chest, neck, head, arms, legs };
}

function buildLilSynnProcedural(costume) {
  const R = humanoidRig();
  const C = costume || {};
  const jacket = mat('fabric', C.jacket ?? 0x0c0c10, { sheen: C.trim ? new THREE.Color(C.trim).multiplyScalar(0.4).getHex() : 0x4a4560 });
  const rib = mat('rib', C.jacket ?? 0x0c0c10);
  const trim = new THREE.MeshPhysicalMaterial({ color: C.trim ?? 0x1a1a22, roughness: 0.4, metalness: C.trim && C.trim !== 0x1a1a22 ? 0.8 : 0.1 });
  const mask = mat('mask'), glove = mat('leather', 0x050506, { r: 0.38 }), boot = mat('leather', 0x060607, { r: 0.45, cc: 0.55 });
  const jeans = mat('denim', 0x1b2a4c), sole = new THREE.MeshStandardMaterial({ color: 0x141416, roughness: 0.9 });
  const silver = mat('metal', 0xd8dde6, { r: 0.18 }), gold = mat('metal', 0xf6c445, { r: 0.22 });
  const neon = new THREE.MeshStandardMaterial({ color: 0x5ae8ff, emissive: 0x29d9ff, emissiveIntensity: 3.2 });
  // fitted jacket torso (shoulder slope, chest, tapered waist), ribbed hem, raised collar
  const torsoProfile = [[0.001, -0.02], [0.17, -0.02], [0.172, 0.05], [0.168, 0.12], [0.18, 0.22], [0.198, 0.3], [0.205, 0.37], [0.19, 0.42], [0.15, 0.455], [0.09, 0.47], [0.001, 0.475]];
  const tg = lathe(torsoProfile, 36); const tp = tg.attributes.position;
  for (let i = 0; i < tp.count; i++) { const x = tp.getX(i), y = tp.getY(i), z = tp.getZ(i); const a = Math.atan2(z, x); const fold = 0.004 * Math.sin(a * 9 + y * 30) * Math.sin(Math.min(1, y / 0.3) * Math.PI); const k = 1 + fold * 10; tp.setXYZ(i, x * k * (1 + 0.12 * Math.max(0, Math.min(1, (y - 0.2) / 0.15))), y, z * 0.66 * k); }
  tg.computeVertexNormals();
  M(tg, jacket, R.spine, [0, -0.06, 0]);
  M(new THREE.TorusGeometry(0.168, 0.022, 10, 36), rib, R.spine, [0, -0.07, 0], [Math.PI / 2, 0, 0], [1, 0.66, 1]);
  M(new THREE.BoxGeometry(0.008, 0.5, 0.008), silver, R.spine, [0, 0.17, 0.142]);
  for (const s of [-1, 1]) M(new THREE.BoxGeometry(0.11, 0.008, 0.006), trim, R.spine, [s * 0.09, 0.08, 0.128], [0, s * -0.35, -s * 0.5]); // pocket welts
  M(lathe([[0.075, 0], [0.085, 0.03], [0.1, 0.075], [0.106, 0.1], [0.098, 0.105]], 30), new THREE.MeshPhysicalMaterial({ color: C.jacket ?? 0x0c0c10, roughness: 0.8, sheen: 0.6, sheenColor: new THREE.Color(0x4a4560), side: THREE.DoubleSide }), R.chest, [0, 0.2, 0.0], [0, 0, 0], [1, 1, 0.9]);
  // shoulders
  for (const a of R.arms) {
    M(new THREE.SphereGeometry(0.085, 20, 14), jacket, a.sh, [0, -0.01, 0], [0, 0, 0], [1, 0.95, 0.9]);
    M(limb(0.29, 0.074, 0.062, 20, 0.04), jacket, a.sh, [0, -0.01, 0]);
    M(limb(0.25, 0.062, 0.052, 20, 0.05), jacket, a.fore);
    M(new THREE.TorusGeometry(0.05, 0.012, 8, 20), rib, a.fore, [0, -0.235, 0], [Math.PI / 2, 0, 0]);
    // glove: palm + 4 curled fingers + thumb
    const h = a.hand; M(new THREE.SphereGeometry(0.045, 16, 12), glove, h, [0, -0.04, 0], [0, 0, 0], [0.85, 1.15, 0.55]);
    for (let f = 0; f < 4; f++) M(new THREE.CapsuleGeometry(0.011, 0.045, 4, 8), glove, h, [(f - 1.5) * 0.018 * -a.s, -0.1, 0.012], [0.5, 0, 0]);
    M(new THREE.CapsuleGeometry(0.012, 0.035, 4, 8), glove, h, [a.s * -0.03, -0.055, 0.03], [0.6, 0, a.s * 0.7]);
  }
  // belt (black + silver), jeans, combat boots
  M(new THREE.TorusGeometry(0.168, 0.02, 8, 36), mat('leather', 0x070708, { r: 0.35 }), R.hips, [0, -0.005, 0], [Math.PI / 2, 0, 0], [1, 0.68, 0.9]);
  M(new THREE.BoxGeometry(0.06, 0.042, 0.012), silver, R.hips, [0, -0.005, 0.118]);
  for (let i = -3; i <= 3; i++) if (i) M(new THREE.SphereGeometry(0.0065, 8, 6), silver, R.hips, [Math.sin(i * 0.33) * 0.168, -0.005, Math.cos(i * 0.33) * 0.114]);
  M(lathe([[0.001, -0.13], [0.12, -0.13], [0.16, -0.08], [0.165, 0.0], [0.001, 0.0]], 30), jeans, R.hips, [0, -0.01, 0], [0, 0, 0], [1, 1, 0.72]);
  for (const l of R.legs) {
    M(limb(0.44, 0.088, 0.072, 20, 0.03), jeans, l.th);
    M(limb(0.33, 0.072, 0.064, 20, 0.06), jeans, l.shin);
    const f = l.foot; // boot shaft + toe + sole + laces
    M(lathe([[0.062, 0.0], [0.066, 0.09], [0.07, 0.17], [0.072, 0.19]], 24), boot, f, [0, -0.02, 0]);
    M(new THREE.CapsuleGeometry(0.058, 0.12, 6, 16), boot, f, [0, -0.025, 0.05], [Math.PI / 2, 0, 0], [1.05, 1, 0.78]);
    M(new THREE.BoxGeometry(0.12, 0.03, 0.27), sole, f, [0, -0.072, 0.045]);
    for (let i = 0; i < 4; i++) M(new THREE.BoxGeometry(0.07, 0.006, 0.01), silver, f, [0, 0.0 + i * 0.04, 0.066], [0, 0, (i % 2 ? 1 : -1) * 0.35]);
  }
  // faceless head + hood (always up)
  M(new THREE.SphereGeometry(0.112, 32, 24), mask, R.head, [0, 0, 0.012], [0, 0, 0], [0.93, 1.1, 1.0]);
  const a = 0.85; const hoodGeo = new THREE.SphereGeometry(0.145, 36, 24, Math.PI / 2 + a, Math.PI * 2 - 2 * a, 0, Math.PI * 0.78);
  M(hoodGeo, new THREE.MeshPhysicalMaterial({ color: C.jacket ?? 0x0c0c10, roughness: 0.85, sheen: 0.7, sheenColor: new THREE.Color(0x4a4560), side: THREE.DoubleSide, normalMap: rep(normalMap('fabric'), 3), normalScale: new THREE.Vector2(0.5, 0.5) }), R.head, [0, 0.015, -0.012], [0.12, 0, 0], [1.0, 1.08, 1.12]);
  const rimPts = []; for (let i = 0; i <= 24; i++) { const t = i / 24, ang = lerp(-1.25, 1.25, t); rimPts.push(new V3(Math.sin(ang) * 0.118, Math.cos(ang) * 0.15 - 0.02, 0.07 - Math.abs(Math.sin(ang)) * 0.03)); }
  M(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(rimPts), 40, 0.012, 8), jacket, R.head, [0, 0.02, 0.012]);
  shades(R.head, 1, 0.108);
  crownNecklace(R.chest, gold, neon, 0.02, 0.135);
  if (C.crown) { const cr = new THREE.Group(); R.head.add(cr); cr.position.set(0, 0.17, -0.01); for (let i = 0; i < 5; i++) M(new THREE.ConeGeometry(0.014, 0.05, 6), gold, cr, [(i - 2) * 0.03, 0, 0]); M(new THREE.TorusGeometry(0.07, 0.008, 6, 20), gold, cr, [0, -0.02, 0], [Math.PI / 2, 0, 0]); }
  R.neon = neon; R.kind = 'lil';
  return R;
}

function buildGirl() {
  const R = humanoidRig(); R.root.scale.setScalar(0.93);
  const skin = mat('skin', 0xe9b996), hair = new THREE.MeshPhysicalMaterial({ color: 0x5a3218, roughness: 0.5, sheen: 0.8, sheenColor: new THREE.Color(0xb07040) });
  const dress = new THREE.MeshPhysicalMaterial({ color: 0xffcf3a, roughness: 0.6, sheen: 0.8, sheenColor: new THREE.Color(0xfff0a0), side: THREE.DoubleSide, normalMap: rep(normalMap('fabric'), 5), normalScale: new THREE.Vector2(0.3, 0.3) });
  const flats = mat('leather', 0xff7ab8, { r: 0.35 }), gold = mat('metal', 0xf6c445);
  M(lathe([[0.001, 0], [0.13, 0], [0.12, 0.12], [0.135, 0.24], [0.14, 0.3], [0.1, 0.34], [0.001, 0.35]], 30), dress, R.spine, [0, -0.04, 0], [0, 0, 0], [1, 1, 0.7]);
  const sk = []; for (let i = 0; i <= 12; i++) { const u = i / 12; sk.push([0.13 + u * u * 0.22 + 0.01 * Math.sin(u * 20), -u * 0.5]); }
  const skirt = M(lathe(sk, 40), dress, R.hips, [0, 0.03, 0]); const sp = skirt.geometry.attributes.position;
  for (let i = 0; i < sp.count; i++) { const x = sp.getX(i), z = sp.getZ(i), y = sp.getY(i), a = Math.atan2(z, x), k = 1 + 0.06 * Math.sin(a * 10) * (-y / 0.5); sp.setX(i, x * k); sp.setZ(i, z * k * 0.85); }
  skirt.geometry.computeVertexNormals(); R.skirt = skirt;
  M(new THREE.CylinderGeometry(0.04, 0.045, 0.1, 12), skin, R.neck, [0, 0.02, 0]);
  const hd = R.head; M(new THREE.SphereGeometry(0.105, 32, 24), skin, hd, [0, 0, 0], [0, 0, 0], [0.9, 1.05, 0.95]);
  M(new THREE.SphereGeometry(0.02, 12, 8), skin, hd, [0, -0.01, 0.098]); // nose
  const eyeW = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.15, clearcoat: 1 }), iris = new THREE.MeshPhysicalMaterial({ color: 0x8a7030, roughness: 0.1, clearcoat: 1, emissive: 0x1a1200 });
  for (const s of [-1, 1]) { M(new THREE.SphereGeometry(0.018, 14, 10), eyeW, hd, [s * 0.036, 0.018, 0.084], [0, 0, 0], [1, 0.85, 0.6]); M(new THREE.SphereGeometry(0.0105, 12, 8), iris, hd, [s * 0.036, 0.018, 0.094]); M(new THREE.BoxGeometry(0.03, 0.005, 0.005), hair, hd, [s * 0.036, 0.045, 0.092], [0, 0, s * -0.12]); }
  M(new THREE.TorusGeometry(0.018, 0.0045, 6, 14, Math.PI), new THREE.MeshPhysicalMaterial({ color: 0xc8606a, roughness: 0.4 }), hd, [0, -0.045, 0.09], [0, 0, Math.PI]);
  M(new THREE.SphereGeometry(0.116, 32, 20, 0, Math.PI * 2, 0, Math.PI * 0.6), hair, hd, [0, 0.012, -0.008], [-0.3, 0, 0]);
  const back = []; for (let i = 0; i <= 10; i++) { const u = i / 10; back.push([0.11 - u * 0.03 + 0.012 * Math.sin(u * 9), -u * 0.32]); }
  M(lathe(back, 28), hair, hd, [0, 0.02, -0.03], [0.12, 0, 0], [1.05, 1, 0.6]);
  const loc = M(new THREE.SphereGeometry(0.014, 12, 10), gold, R.chest, [0, 0.07, 0.1], [0, 0, 0], [1, 1, 0.5]); loc.castShadow = false; // heart locket
  for (const a of R.arms) { a.sh.position.x *= 0.85; M(limb(0.27, 0.038, 0.032, 16), skin, a.sh); M(limb(0.25, 0.032, 0.027, 16), skin, a.fore); M(new THREE.SphereGeometry(0.032, 12, 10), skin, a.hand, [0, -0.03, 0], [0, 0, 0], [0.7, 1.2, 0.5]); }
  for (const l of R.legs) { l.th.position.x *= 0.8; M(limb(0.44, 0.06, 0.046, 16), skin, l.th); M(limb(0.42, 0.045, 0.034, 16), skin, l.shin); M(new THREE.CapsuleGeometry(0.035, 0.11, 4, 12), flats, l.foot, [0, -0.02, 0.04], [Math.PI / 2, 0, 0], [1, 1, 0.6]); }
  R.kind = 'girl'; return R;
}

function buildShadowMan() {
  const R = humanoidRig(); R.root.scale.setScalar(1.25);
  const sh = new THREE.MeshPhysicalMaterial({ color: 0x030106, roughness: 0.9, sheen: 0.6, sheenColor: new THREE.Color(0x4a1aa8), sheenRoughness: 0.35, emissive: 0x05000c });
  const teeth = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 2.6 });
  M(lathe([[0.001, -0.15], [0.16, -0.15], [0.17, 0.1], [0.24, 0.38], [0.2, 0.46], [0.001, 0.48]], 28), sh, R.spine, [0, -0.04, 0], [0, 0, 0], [1, 1, 0.65]);
  const coat = []; for (let i = 0; i <= 14; i++) { const u = i / 14; coat.push([0.17 + u * 0.18 + 0.02 * Math.sin(u * 30), -u * 0.85]); }
  const cm = M(lathe(coat, 36), new THREE.MeshPhysicalMaterial({ color: 0x030106, roughness: 0.9, sheen: 0.6, sheenColor: new THREE.Color(0x4a1aa8), side: THREE.DoubleSide, transparent: true, opacity: 0.94 }), R.hips, [0, 0.05, 0]);
  R.coat = cm;
  M(new THREE.SphereGeometry(0.12, 24, 18), sh, R.head, [0, 0, 0], [0, 0, 0], [0.9, 1.1, 0.95]);
  M(new THREE.CylinderGeometry(0.25, 0.25, 0.012, 32), sh, R.head, [0, 0.09, 0], [-0.1, 0, 0.06]);
  M(lathe([[0.001, 0.13], [0.09, 0.13], [0.11, 0.06], [0.115, 0]], 28), sh, R.head, [0, 0.095, 0], [-0.1, 0, 0.06]);
  M(new THREE.TorusGeometry(0.113, 0.01, 6, 28), new THREE.MeshStandardMaterial({ color: 0x1a0030, emissive: 0x5a1aa8, emissiveIntensity: 0.8 }), R.head, [0, 0.11, 0], [Math.PI / 2 - 0.1, 0, 0.06]);
  const grin = new THREE.Group(); grin.position.set(0, -0.035, 0.1); R.head.add(grin);
  for (let i = 0; i < 11; i++) { const u = (i / 10) * 2 - 1; const x = u * 0.065, y = u * u * 0.025; M(new THREE.ConeGeometry(0.007, 0.03, 4), teeth, grin, [x, y + 0.012, 0.01 - Math.abs(u) * 0.025], [Math.PI, 0, 0]).castShadow = false; M(new THREE.ConeGeometry(0.0065, 0.026, 4), teeth, grin, [x + 0.005, y - 0.012, 0.01 - Math.abs(u) * 0.025]).castShadow = false; }
  for (const a of R.arms) { M(limb(0.3, 0.06, 0.05, 14), sh, a.sh); M(limb(0.3, 0.05, 0.03, 14), sh, a.fore); for (let f = -1; f <= 1; f++) M(new THREE.ConeGeometry(0.01, 0.12, 5), sh, a.hand, [f * 0.016, -0.05, 0], [Math.PI, 0, 0]); }
  for (const l of R.legs) { M(limb(0.44, 0.07, 0.055, 14), sh, l.th); M(limb(0.43, 0.055, 0.035, 14), sh, l.shin); }
  const feather = makePeacockFeather(0.4); feather.position.set(0, -0.08, 0.02); feather.rotation.x = -0.3; R.arms[1].hand.add(feather);
  R.teeth = teeth; R.kind = 'shadow'; R.mat = sh; R.feather = feather;
  return R;
}
export function makePeacockFeather(scale = 1) {
  const g = new THREE.Group();
  const curve = new THREE.CatmullRomCurve3([new V3(0, 0, 0), new V3(0.03, 0.35, 0), new V3(-0.02, 0.75, 0.02), new V3(0.05, 1.05, 0)]);
  g.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 16, 0.01, 5), new THREE.MeshStandardMaterial({ color: 0x9fffe0, emissive: 0x30ffc0, emissiveIntensity: 1.6 })));
  const vane = new THREE.Mesh(new THREE.CircleGeometry(0.2, 24), new THREE.MeshStandardMaterial({ color: 0x00c8ff, emissive: 0x00a0ff, emissiveIntensity: 1.2, transparent: true, opacity: 0.85, side: THREE.DoubleSide })); vane.scale.set(0.8, 1.6, 1); vane.position.set(0.03, 0.78, 0); g.add(vane);
  [[0.12, 0x10ff70, 1.4], [0.085, 0xffd040, 1.8], [0.06, 0x2040ff, 2], [0.035, 0x0a0040, 0.6]].forEach(([r, c, e], i) => { const m = new THREE.Mesh(new THREE.CircleGeometry(r, 20), new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: e, side: THREE.DoubleSide })); m.scale.set(0.85, 1.1, 1); m.position.set(0.03, 0.86, 0.004 * (i + 1)); g.add(m); });
  g.scale.setScalar(scale); return g;
}

// Pose engine for procedural humanoids. Targets per state, damped every frame (no snapping, no scaling).
function poseHumanoid(R, t, dt, st) {
  const P = R._p || (R._p = { ph: 0 });
  const sp = st.speed || 0; const gait = st.state;
  const rate = gait === 'sprint' ? 13 : gait === 'run' ? 10.5 : gait === 'walk' ? 6.5 : 0;
  P.ph += dt * rate; const s = Math.sin(P.ph), c = Math.cos(P.ph);
  const T = { hipY: 0, lean: 0, twist: 0, th: [0, 0], kn: [0.05, 0.05], arm: [0.05, 0.05], armZ: [0.08, 0.08], el: [-0.15, -0.15], head: 0, ft: [0, 0] };
  const amp = { walk: [0.45, 0.35, 0.3, 0.03], run: [0.85, 0.7, 1.1, 0.06], sprint: [1.05, 0.95, 1.45, 0.08] }[gait];
  if (amp) {
    T.th = [-s * amp[0], s * amp[0]]; T.kn = [Math.max(0, c) * amp[0] * 1.4 + 0.1, Math.max(0, -c) * amp[0] * 1.4 + 0.1];
    T.arm = [s * amp[1], -s * amp[1]]; T.el = [-amp[2], -amp[2]]; T.hipY = -Math.abs(c) * amp[3]; T.lean = gait === 'sprint' ? 0.32 : gait === 'run' ? 0.15 : 0.04; T.twist = s * 0.12;
  } else { T.hipY = Math.sin(t * 1.8) * 0.006; T.lean = Math.sin(t * 1.8) * 0.015; T.head = Math.sin(t * 0.5) * 0.15; T.armZ = [0.1 + Math.sin(t * 1.8) * 0.01, 0.1]; }
  if (gait === 'jump') { T.th = [-1.0, 0.25]; T.kn = [1.3, 0.5]; T.arm = [-1.1, 0.4]; T.armZ = [0.4, 0.4]; T.el = [-0.8, -0.5]; T.lean = 0.12; }
  if (gait === 'fall') { T.th = [-0.35, -0.1]; T.kn = [0.5, 0.35]; T.arm = [-0.3, -0.3]; T.armZ = [0.95, 0.95]; T.el = [-0.3, -0.3]; T.lean = -0.05; }
  if (gait === 'land') { T.hipY = -0.13; T.th = [-0.7, -0.7]; T.kn = [1.2, 1.2]; T.lean = 0.3; T.arm = [-0.3, -0.3]; T.armZ = [0.5, 0.5]; }
  if (gait === 'hurt') { T.lean = -0.35; T.arm = [-0.6, -0.6]; T.armZ = [0.7, 0.7]; T.el = [-1.2, -1.2]; T.head = 0.2; }
  if (gait === 'cheer') { T.arm = [-2.8, -2.8]; T.armZ = [0.3, 0.3]; T.el = [-0.2, -0.2]; T.hipY = Math.abs(Math.sin(t * 7)) * 0.06; }
  if (gait === 'reach') { T.arm = [-1.5, -0.2]; T.armZ = [0.1, 0.2]; T.el = [-0.1, -0.3]; T.lean = 0.25; T.th = [-0.4, 0.3]; T.kn = [0.3, 0.2]; }
  if (gait === 'sit') { T.hipY = -0.52; T.th = [-1.5, -1.5]; T.kn = [1.6, 1.6]; T.arm = [-0.3, -0.3]; T.el = [-0.6, -0.6]; }
  if (gait === 'float') { T.th = [0.1, 0.25]; T.kn = [0.3, 0.5]; T.arm = [-0.2, -0.4]; T.armZ = [0.5, 0.5]; T.el = [-0.5, -0.4]; T.lean = 0.05; }
  // upper-body overlays (legs keep their locomotion)
  const up = st.upper;
  if (up === 'attack') { const k = st.upperT; T.arm[1] = -1.45 - Math.sin(k * Math.PI) * 0.15; T.armZ[1] = -0.05; T.el[1] = -0.08; T.twist = -0.3; }
  if (up === 'wand') { const k = st.upperT; T.arm[1] = lerp(-2.6, -1.3, k); T.el[1] = -0.2; T.twist = -0.2; }
  if (up === 'cello') { T.arm = [-0.9, -1.0]; T.armZ = [-0.3, 0.6]; T.el = [-1.4, -1.0]; T.lean = 0.1; }
  if (up === 'absorb') { T.arm[1] = -2.0; T.el[1] = -0.9; T.arm[0] = -0.6; T.armZ[0] = 0.9; T.el[0] = -0.4; T.lean = -0.1; T.head = 0; }
  if (up === 'switch') { const k = Math.sin(st.upperT * Math.PI); T.arm[1] = 0.3 * k; T.el[1] = -0.3 - 1.0 * k; }
  if (up === 'interact') { T.arm[1] = -1.1; T.el[1] = -0.3; T.lean = 0.25; }
  const k = gait === 'land' || up === 'attack' ? 26 : 14;
  P.hipY = damp(P.hipY || 0, T.hipY, k, dt); R.hips.position.y = 0.98 + P.hipY;
  R.spine.rotation.x = damp(R.spine.rotation.x, T.lean, k, dt); R.spine.rotation.y = damp(R.spine.rotation.y, T.twist, k, dt);
  R.head.rotation.y = damp(R.head.rotation.y, T.head + (st.look || 0), 6, dt);
  R.legs.forEach((l, i) => { l.th.rotation.x = damp(l.th.rotation.x, T.th[i], k, dt); l.shin.rotation.x = damp(l.shin.rotation.x, Math.max(0, T.kn[i]), k, dt); l.foot.rotation.x = -l.th.rotation.x - l.shin.rotation.x * 0.6 + (amp ? 0 : 0); });
  R.arms.forEach((a, i) => { a.sh.rotation.x = damp(a.sh.rotation.x, T.arm[i], k, dt); a.sh.rotation.z = damp(a.sh.rotation.z, a.s * T.armZ[i], k, dt); a.fore.rotation.x = damp(a.fore.rotation.x, Math.min(0, T.el[i]), k, dt); });
  if (R.neon) R.neon.emissiveIntensity = 2.8 + Math.sin(t * 4) * 0.6;
  if (R.skirt) R.skirt.rotation.y = Math.sin(t * 2) * 0.05 + (gait === 'run' ? Math.sin(P.ph) * 0.1 : 0);
  if (R.coat) R.coat.rotation.y = Math.sin(t * 1.3) * 0.08;
}

// ---------- GLB rigs ----------
const CLIPS = {
  lil: { idle: ['idle', 'Idle_Loop'], walk: ['walk', 'Walk_Loop'], run: ['run', 'Jog_Fwd_Loop'], sprint: ['sprint', 'Sprint_Loop'], jump: ['jump_start', 'Jump_Start'], fall: ['jump', 'Jump_Loop'], land: ['land', 'Jump_Land'], hurt: ['hit', 'Hit_Chest'], cheer: ['dance', 'Dance_Loop'], reach: ['cast', 'Spell_Simple_Idle_Loop'], interact: ['interact', 'Interact'], attack: ['cast', 'Spell_Simple_Shoot', 'punch'], absorb: ['cast', 'Spell_Simple_Idle_Loop'], cello: ['cast'], wand: ['attack', 'Sword_Attack'], switch: ['interact'], sit: ['sit', 'Sitting_Idle_Loop'], float: ['jump', 'Jump_Loop'] },
  cat: { idle: ['idle'], idle2: ['idle_alt'], walk: ['walk'], run: ['run'], jump: ['jump'], sit: ['sit'], sleep: ['sleep'], play: ['play', 'attack'], meow: ['meow', 'call'], hiss: ['hit'], eat: ['eat'] },
};
function findClip(clips, names) { for (const n of names) { const c = clips.find(c => c.name === n) || clips.find(c => c.name.toLowerCase() === n.toLowerCase()) || clips.find(c => c.name.toLowerCase().includes(n.toLowerCase())); if (c) return c; } return null; }

const loaderP = (async () => {
  const { GLTFLoader } = await import('three/addons/loaders/GLTFLoader.js');
  const { MeshoptDecoder } = await import('three/addons/libs/meshopt_decoder.module.js');
  const l = new GLTFLoader(); l.setMeshoptDecoder(MeshoptDecoder); return l;
})();
export async function loadGLB(url) {
  try { const r = await fetch(url, { method: 'HEAD' }); if (!r.ok) return null; const l = await loaderP; return await l.loadAsync(url); } catch (e) { console.warn('GLB load failed', url, e); return null; }
}

// Sprite/billboard adapter (illustrated characters): cfg = { height, fps, states: { idle: [urls], walk: [...] ... } }.
// Unknown states fall back to idle. Always faces the camera around Y (cylindrical billboard).
export async function spriteBody(cfg, base) {
  const TL = new THREE.TextureLoader(); const tex = {};
  for (const [st, urls] of Object.entries(cfg.states || {})) tex[st] = await Promise.all(urls.map(u => TL.loadAsync(base + u).then(t => { t.colorSpace = THREE.SRGBColorSpace; return t; }).catch(() => null)));
  if (!tex.idle || !tex.idle[0]) return null;
  const img = tex.idle[0].image, aspect = img.width / img.height, h = cfg.height || 1.8;
  const mat = new THREE.MeshStandardMaterial({ map: tex.idle[0], transparent: true, alphaTest: 0.4, side: THREE.DoubleSide, roughness: 1 });
  const plane = new THREE.Mesh(new THREE.PlaneGeometry(h * aspect, h), mat); plane.position.y = h / 2; plane.castShadow = true;
  const group = new THREE.Group(); group.add(plane);
  return { group, hand: group, update(state, t, camera) { const fr = (tex[state] && tex[state].filter(Boolean).length ? tex[state] : tex.idle).filter(Boolean); const f = fr[Math.floor(t * (cfg.fps || 8)) % fr.length]; if (mat.map !== f) { mat.map = f; mat.needsUpdate = true; } if (camera) { const wp = group.getWorldPosition(new V3()); const yaw = Math.atan2(camera.position.x - wp.x, camera.position.z - wp.z); plane.rotation.y = yaw - (group.parent ? group.parent.rotation.y : 0); } } };
}
// Loads a character from characters.json sources in order; returns the type that won ('glb' | 'sprite' | 'procedural').
export async function loadBody(ch, sources, base) {
  for (const src of sources || []) {
    try {
      if (src.type === 'glb' && await ch.tryGLB(base + src.url, src.height || 0)) return 'glb';
      if (src.type === 'sprite') { const sb = await spriteBody(src, base); if (sb) { ch.useSprite(sb); return 'sprite'; } }
    } catch (e) { console.warn('character source failed', src, e); }
  }
  return 'procedural';
}

// Character wrapper: uniform API whether the body is a GLB, a sprite billboard or procedural.
export class Character {
  constructor(kind, opts = {}) {
    this.kind = kind; this.root = new THREE.Group(); this.state = 'idle'; this.upper = null; this.upperT = 0; this.opts = opts;
    this.proc = kind === 'lil' ? buildLilSynnProcedural(opts.costume) : kind === 'girl' ? buildGirl() : kind === 'shadow' ? buildShadowMan() : null;
    if (this.proc) { this.root.add(this.proc.root); this.hand = this.proc.arms[1].hand; this.headBone = this.proc.head; this.leftHand = this.proc.arms[0].hand; }
    this.mixer = null; this.actions = {}; this.cur = null;
  }
  setCostume(c) { if (this.glb) { this.applyCostumeGLB(c); return; } if (!this.proc || this.kind !== 'lil') return; const held = this.held; this.root.remove(this.proc.root); this.proc = buildLilSynnProcedural(c); this.root.add(this.proc.root); this.hand = this.proc.arms[1].hand; this.headBone = this.proc.head; if (held) this.hold(held); this.costume = c; }
  applyCostumeGLB(c) { if (!this.glb || !c) return; this.costume = c; this.glb.traverse(o => { if (!o.isMesh || !o.material) return; const n = o.material.name || ''; if (n === 'hoodie_fabric') { o.material.color.set(c.jacket); if (o.material.sheenColor) o.material.sheenColor.set(c.trim); } if (n === 'gold' || n === 'pink_frame') { if (c.chrome && n === 'gold') o.material.color.set(0xd8dde6); } if (n === 'denim' && c.id === 'legend') o.material.color.set(0x2a2a5a); }); }
  async tryGLB(url, height) {
    const g = await loadGLB(url); if (!g) return false;
    const model = (g.scene.children.length === 1 ? g.scene : g.scene); // keep hierarchy
    model.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; o.frustumCulled = false; if (/LOD1/i.test(o.name)) o.visible = false; } });
    const box = new THREE.Box3().setFromObject(model), size = box.getSize(new V3());
    if (height && size.y > 0.01) { const s = height / size.y; if (Math.abs(s - 1) > 0.15) { model.scale.multiplyScalar(s); box.setFromObject(model); } }
    model.position.y -= box.min.y;
    if (this.proc) this.root.remove(this.proc.root);
    this.root.add(model); this.glb = model; this.proc = null;
    this.mixer = new THREE.AnimationMixer(model); this.clips = g.animations || [];
    const map = CLIPS[this.kind === 'cat' ? 'cat' : 'lil'];
    for (const [st, names] of Object.entries(map)) { const c = findClip(this.clips, names); if (c) { const a = this.mixer.clipAction(c); if (['jump', 'land', 'hurt', 'attack', 'wand', 'interact', 'switch', 'hiss', 'meow', 'play'].includes(st)) { a.setLoop(THREE.LoopOnce); a.clampWhenFinished = true; } this.actions[st] = a; } }
    const bone = (re) => { let f = null; model.traverse(o => { if (!f && o.isBone && re.test(o.name)) f = o; }); return f; };
    this.hand = bone(/^hand_r$/i) || bone(/hand.?r/i) || this.root; this.leftHand = bone(/^hand_l$/i) || this.hand; this.headBone = bone(/^head$/i) || bone(/head/i);
    if (this.held) this.hold(this.held);
    if (this.opts.costume) this.applyCostumeGLB(this.opts.costume);
    this.play('idle', 0);
    return true;
  }
  play(st, fade = 0.2) {
    if (!this.mixer) return; const a = this.actions[st] || this.actions.idle; if (!a || a === this.cur) return;
    a.reset(); a.enabled = true; a.setEffectiveWeight(1); a.play(); if (this.cur) this.cur.crossFadeTo(a, fade, false); this.cur = a;
  }
  hold(obj) { // weapon in the right hand
    if (this.held && this.held.parent) this.held.parent.remove(this.held); this.held = obj; if (!obj) return;
    (this.hand || this.root).add(obj);
    if (this.glb) { this.root.updateMatrixWorld(true); const ws = new V3(); (this.hand || this.root).getWorldScale(ws); const rs = new V3(); this.root.getWorldScale(rs); obj.position.set(0, 0.06 / (ws.x / rs.x), 0); obj.rotation.set(0, 0, Math.PI); obj.scale.setScalar(rs.x / Math.max(0.0001, ws.x)); }
    else { obj.position.set(0, -0.08, 0.03); obj.rotation.set(Math.PI, 0, 0); obj.scale.setScalar(1); }
  }
  useSprite(sb) { if (this.proc) this.root.remove(this.proc.root); if (this.glb) this.root.remove(this.glb); this.proc = null; this.glb = null; this.mixer = null; this.sprite = sb; this.root.add(sb.group); this.hand = sb.hand; if (this.held) this.hold(this.held); }
  update(t, dt, st) {
    this.state = st.state; this.upper = st.upper || null;
    if (this.sprite) { this.sprite.update(st.upper || st.state, t, Character.camera); return; }
    if (this.mixer) {
      const want = st.upper && this.actions[st.upper] ? st.upper : st.state;
      this.play(want, want === 'land' ? 0.08 : 0.22);
      const spd = st.state === 'walk' || st.state === 'run' || st.state === 'sprint' ? THREE.MathUtils.clamp(st.speed / ({ walk: 1.6, run: 4.5, sprint: 7 }[st.state]), 0.7, 1.4) : 1;
      this.mixer.timeScale = spd; this.mixer.update(dt);
    } else if (this.proc) poseHumanoid(this.proc, t, dt, st);
  }
}

// ---------- Maine Coon cat (procedural fallback: shell-textured fur) ----------
export function buildCatProcedural(q = 'high') {
  const root = new THREE.Group(); const body = new THREE.Group(); root.add(body);
  const parts = []; // [geometry, position, rotation, scale, parentKey]
  const torso = new THREE.Group(); torso.position.y = 0.33; body.add(torso);
  const head = new THREE.Group(); head.position.set(0, 0.12, 0.27); torso.add(head);
  const tail = []; let tp = new THREE.Group(); tp.position.set(0, 0.04, -0.27); torso.add(tp);
  for (let i = 0; i < 7; i++) { const s = new THREE.Group(); s.position.set(0, 0, i ? -0.07 : 0); tp.add(s); tail.push(s); tp = s; }
  const legs = [];
  for (const [x, z] of [[-0.085, 0.16], [0.085, 0.16], [-0.085, -0.16], [0.085, -0.16]]) { const p = new THREE.Group(); p.position.set(x, -0.06, z); torso.add(p); const lo = new THREE.Group(); lo.position.y = -0.13; p.add(lo); legs.push({ p, lo }); }
  const furTex = furTexture(); const layers = q === 'low' ? 6 : q === 'med' ? 10 : 16;
  const furBase = (layer) => {
    const m = new THREE.MeshPhysicalMaterial({ color: 0x101014, roughness: 0.9, sheen: 1, sheenColor: new THREE.Color(0x5a5470), sheenRoughness: 0.5, alphaTest: 0.5, side: layer ? THREE.DoubleSide : THREE.FrontSide });
    m.userData.layer = layer / layers;
    m.onBeforeCompile = (sh) => {
      sh.uniforms.uLayer = { value: layer / layers }; sh.uniforms.uFur = { value: furTex }; sh.uniforms.uLen = { value: 0.035 };
      sh.vertexShader = 'uniform float uLayer; uniform float uLen; varying vec2 vFurUv;\n' + sh.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\n transformed += normalize(objectNormal) * uLayer * uLen; transformed.y -= uLayer * uLayer * uLen * 0.35; vFurUv = uv;');
      sh.fragmentShader = 'uniform float uLayer; uniform sampler2D uFur; varying vec2 vFurUv;\n' + sh.fragmentShader.replace('#include <alphatest_fragment>', 'float fz = texture2D(uFur, vFurUv * vec2(10.0, 10.0)).r; if (uLayer > 0.001 && fz < uLayer) discard;').replace('#include <color_fragment>', '#include <color_fragment>\n diffuseColor.rgb *= mix(0.35, 1.15, uLayer);');
    };
    m.customProgramCacheKey = () => 'fur' + layer; return m;
  };
  const geos = [
    [new THREE.SphereGeometry(0.2, 28, 20), torso, [0, 0, 0], [1.0, 0.92, 1.55]],
    [new THREE.SphereGeometry(0.13, 28, 20), head, [0, 0, 0], [1.12, 0.98, 1.0]],
    [new THREE.SphereGeometry(0.15, 24, 16), head, [0, -0.08, -0.04], [1.25, 0.8, 0.9]], // ruff / mane
    [new THREE.SphereGeometry(0.065, 20, 14), head, [0, -0.035, 0.1], [1.25, 0.82, 0.95]], // muzzle
  ];
  tail.forEach((s, i) => geos.push([new THREE.SphereGeometry(0.075 - i * 0.004, 18, 12), s, [0, 0, -0.035], [1, 1, 1.4]]));
  legs.forEach(l => { geos.push([new THREE.CapsuleGeometry(0.042, 0.1, 6, 14), l.p, [0, -0.06, 0], [1, 1, 1]]); geos.push([new THREE.CapsuleGeometry(0.036, 0.1, 6, 14), l.lo, [0, -0.06, 0], [1, 1, 1]]); geos.push([new THREE.SphereGeometry(0.045, 14, 10), l.lo, [0, -0.13, 0.015], [1, 0.7, 1.2]]); });
  for (let L = 0; L <= layers; L++) { const m = furBase(L); for (const [g, parent, pos, sc] of geos) { const o = new THREE.Mesh(g, m); o.position.set(...pos); o.scale.set(...sc); o.castShadow = L === 0; o.receiveShadow = true; parent.add(o); } }
  // ears with lynx tufts, nose, hood, pink shades
  const earM = new THREE.MeshPhysicalMaterial({ color: 0x0c0c10, roughness: 0.8, sheen: 1, sheenColor: new THREE.Color(0x5a5470) });
  const ears = [];
  for (const s of [-1, 1]) { const e = new THREE.Group(); e.position.set(s * 0.07, 0.11, -0.01); e.rotation.z = s * -0.25; head.add(e); M(new THREE.ConeGeometry(0.045, 0.12, 12), earM, e, [0, 0.05, 0]); M(new THREE.ConeGeometry(0.008, 0.06, 6), earM, e, [0, 0.13, 0]); ears.push(e); }
  M(new THREE.SphereGeometry(0.014, 10, 8), new THREE.MeshPhysicalMaterial({ color: 0x2a1a20, roughness: 0.3, clearcoat: 1 }), head, [0, -0.01, 0.165]);
  const hood = M(new THREE.SphereGeometry(0.152, 32, 20, Math.PI / 2 + 0.95, Math.PI * 2 - 1.9, 0, Math.PI * 0.6), new THREE.MeshPhysicalMaterial({ color: 0x111116, roughness: 0.85, sheen: 0.7, sheenColor: new THREE.Color(0x4a4560), side: THREE.DoubleSide, normalMap: rep(normalMap('fabric'), 3) }), head, [0, 0.025, -0.02]);
  const sh = shades(head, 0.95, 0.118); sh.position.y = 0.025;
  const crown = new THREE.Group(); crown.visible = false; head.add(crown); crown.position.set(0, 0.17, 0); const gold = mat('metal', 0xf6c445); for (let i = 0; i < 3; i++) M(new THREE.ConeGeometry(0.012, 0.04, 5), gold, crown, [(i - 1) * 0.025, 0, 0]); M(new THREE.TorusGeometry(0.035, 0.006, 6, 16), gold, crown, [0, -0.018, 0], [Math.PI / 2, 0, 0]);
  root.scale.setScalar(1.1);
  return { root, body, torso, head, tail, legs, ears, hood, crown };
}

// Cat wrapper with spontaneous behaviours: follow, sit, groom, play, sleep, look, hiss, meow.
export class Cat {
  constructor(q) { this.root = new THREE.Group(); this.p = buildCatProcedural(q); this.root.add(this.p.root); this.state = 'idle'; this.t = 0; this.mixer = null; this.actions = {}; this.look = 0; this.mood = 'follow'; this.moodT = 0; this.vel = new V3(); this.face = 0; }
  async tryGLB(url, height = 0) {
    const g = await loadGLB(url); if (!g) return false;
    const model = g.scene; model.traverse(o => { if (o.isMesh) { o.castShadow = !/shell|card|whisker/i.test(o.material?.name || ''); o.receiveShadow = true; o.frustumCulled = false; if (/LOD1/i.test(o.name)) o.visible = false; } });
    const box = new THREE.Box3().setFromObject(model); if (height) { const size = box.getSize(new V3()); model.scale.multiplyScalar(height / Math.max(0.01, size.y)); box.setFromObject(model); } model.position.y -= box.min.y;
    this.root.remove(this.p.root); this.root.add(model); this.glb = model; this.mixer = new THREE.AnimationMixer(model);
    for (const [st, names] of Object.entries(CLIPS.cat)) { const c = findClip(g.animations || [], names); if (c) { const a = this.mixer.clipAction(c); if (['jump', 'hiss', 'meow', 'play'].includes(st)) { a.setLoop(THREE.LoopOnce); a.clampWhenFinished = true; } this.actions[st] = a; } }
    let hb = null; model.traverse(o => { if (!hb && o.isBone && /head/i.test(o.name)) hb = o; }); this.headBone = hb;
    this.cur = null; this.anim('idle'); return true;
  }
  anim(st) { if (!this.mixer) return; const a = this.actions[st] || this.actions.idle; if (!a || a === this.cur) return; a.reset().play(); if (this.cur) this.cur.crossFadeTo(a, 0.25, false); this.cur = a; }
  setCrown(on) { if (this.p.crown) this.p.crown.visible = on; }
  // procedural pose
  pose(t, dt, st, speed) {
    const P = this.p; if (!P.legs) return;
    const sp = Math.min(speed / 4, 1.4); this.ph = (this.ph || 0) + dt * (4 + sp * 9) * (speed > 0.1 ? 1 : 0);
    const sit = st === 'sit' || st === 'groom', sleep = st === 'sleep', hiss = st === 'hiss', play = st === 'play', jump = st === 'jump';
    P.legs.forEach((l, i) => { const ph = this.ph + (i === 0 || i === 3 ? 0 : Math.PI); let a = Math.sin(ph) * 0.7 * sp, k = Math.max(0, Math.cos(ph)) * 0.8 * sp; if (sit && i >= 2) { a = -1.2; k = 1.9; } if (sit && i < 2) { a = 0.15; k = 0; } if (sleep) { a = i < 2 ? -1.3 : -1.3; k = 1.6; } if (jump) { a = i < 2 ? -0.9 : 0.9; k = 0.4; } if (play && i === 0) { a = -1.6 + Math.sin(t * 14) * 0.4; k = 0.5; } if (st === 'groom' && i === 1) { a = -1.9; k = 1.7; } l.p.rotation.x = damp(l.p.rotation.x, a, 14, dt); l.lo.rotation.x = damp(l.lo.rotation.x, k, 14, dt); });
    const tilt = sit ? -0.55 : sleep ? 0 : hiss ? 0.0 : 0; P.torso.rotation.x = damp(P.torso.rotation.x, tilt, 8, dt);
    P.body.position.y = damp(P.body.position.y, sleep ? -0.2 : sit ? -0.05 : hiss ? 0.06 : Math.abs(Math.sin(this.ph)) * 0.025 * sp, 10, dt);
    P.torso.scale.y = damp(P.torso.scale.y, hiss ? 1.12 : 1, 8, dt); // fur puffs up (uniform layers, no limb distortion)
    P.head.rotation.y = damp(P.head.rotation.y, st === 'groom' ? 0.3 : this.look, 6, dt);
    P.head.rotation.x = damp(P.head.rotation.x, sleep ? 0.5 : st === 'groom' ? 0.6 + Math.sin(t * 9) * 0.1 : sit ? 0.45 : 0, 8, dt);
    P.tail.forEach((s, i) => { const up = hiss ? -0.5 : sleep ? 0.25 : -0.32; s.rotation.x = damp(s.rotation.x, up + Math.sin(t * (hiss ? 9 : 2.6) + i * 0.6) * (hiss ? 0.05 : 0.09), 8, dt); s.rotation.y = damp(s.rotation.y, sleep ? 0.38 : Math.sin(t * 1.9 + i * 0.5) * 0.16, 6, dt); });
    P.ears.forEach((e, i) => { const tw = Math.sin(t * 0.7 + i * 2) > 0.97 ? 0.35 : 0; e.rotation.x = damp(e.rotation.x, (hiss ? 0.8 : 0) + tw, 20, dt); });
  }
  useSprite(sb) { this.root.remove(this.p.root); if (this.glb) this.root.remove(this.glb); this.glb = null; this.mixer = null; this.sprite = sb; this.root.add(sb.group); }
  update(t, dt, st, speed) {
    this.state = st;
    if (this.sprite) { this.sprite.update(st, t, Character.camera); return; }
    if (this.mixer) { const map = { idle: 'idle', walk: 'walk', run: 'run', sit: 'sit', groom: 'eat', sleep: 'sleep', play: 'play', hiss: 'hiss', meow: 'meow', jump: 'jump', look: 'idle2' }; this.anim(map[st] || 'idle'); this.mixer.timeScale = st === 'walk' || st === 'run' ? THREE.MathUtils.clamp(speed / (st === 'run' ? 4 : 1.6), 0.7, 1.5) : 1; this.mixer.update(dt); if (this.headBone && this.look) this.headBone.rotation.y += this.look * 0.6; }
    else this.pose(t, dt, st, speed);
  }
}
