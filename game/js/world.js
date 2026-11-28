// The Enchanted Meadow: rolling terrain, instanced wind-blown grass/flowers, CC0 Quaternius trees/plants/rocks,
// animated stream + waterfall, 3D clouds (incl. the whale), mountains, sunbeams, butterflies, pollen, the portal.
import * as THREE from 'three';
import { normalMap, glowTexture, wingTexture, runeTexture } from './textures.js';
import { loadGLB } from './characters.js';

const V3 = THREE.Vector3, sstep = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
export const U = { time: { value: 0 }, wind: { value: 1 } };
let seed = 7; const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };

export const pathX = (z) => 5 * Math.sin(z * 0.03) + 2 * Math.sin(z * 0.071);
export const streamZ = (x) => -46 + 3.5 * Math.sin(x * 0.045);
export const WATER_Y = -0.55;
export const PORTAL = new V3(pathX(-142), 0, -142);
const POND_PX = pathX(-46);
export const POND = { x: POND_PX - 15.5, z: streamZ(POND_PX - 15.5), r: 6 }; // deep pool center
export function height(x, z) {
  let h = 1.3 * Math.sin(x * 0.045 + 1.3) * Math.cos(z * 0.038) + 0.8 * Math.sin(x * 0.09 + z * 0.07) + 0.35 * Math.sin(x * 0.21 - z * 0.17) + 0.6;
  const dp = Math.abs(x - pathX(z)); h *= 0.15 + 0.85 * sstep(2.5, 12, dp);
  h += sstep(32, 75, Math.abs(x)) * 16 + sstep(18, 60, z) * 12 + sstep(-160, -215, z) * 18;
  const ds = Math.abs(z - streamZ(x)); if (ds < 5.5) h = Math.min(h, h - 1.6 * Math.pow(1 - ds / 5.5, 1.6) * (1 + 0.0 * x)) ;
  // deep swimming pool in the stream, left of the path crossing (tutorial: swim + dive)
  if (ds < 5.2) { const PX = POND_PX; const k = sstep(5.2, 2.0, ds) * sstep(PX - 5, PX - 9, x) * sstep(PX - 27, PX - 22, x); if (k > 0) h = h + (Math.min(h, WATER_Y - 2.9) - h) * k; }
  if (x > 34) h += sstep(34, 40, x) * 9 * (1 - sstep(3, 7, ds) * 0) ; // cliff behind the waterfall
  const dpo = Math.hypot(x - PORTAL.x, z - PORTAL.z); if (dpo < 16) h = h * sstep(8, 16, dpo) + 0.3 * (1 - sstep(8, 16, dpo));
  return h;
}

function windify(mat, amp = 0.05, local = false) {
  mat.onBeforeCompile = (sh) => {
    sh.uniforms.uT = U.time; sh.uniforms.uWind = U.wind;
    sh.vertexShader = 'uniform float uT; uniform float uWind;\n' + sh.vertexShader.replace('#include <begin_vertex>', `#include <begin_vertex>
      #ifdef USE_INSTANCING
        mat4 wm = modelMatrix * instanceMatrix;
      #else
        mat4 wm = modelMatrix;
      #endif
      vec4 wO = wm * vec4(0.0, 0.0, 0.0, 1.0); vec4 wP = wm * vec4(transformed, 1.0);
      float hg = ${local ? 'max(0.0, position.y)' : 'max(0.0, wP.y - wO.y)'};
      float g = sin(uT * 1.7 + wO.x * 0.35 + wO.z * 0.27) + 0.45 * sin(uT * 3.3 + wO.x * 0.9 - wO.z * 0.6) + 0.6 * sin(uT * 0.6 + wO.x * 0.05);
      vec3 sw = vec3(g, 0.0, 0.55 * cos(uT * 1.3 + wO.z * 0.31 + wO.x * 0.1)) * ${amp.toFixed(4)} * uWind * hg * hg;
      transformed += inverse(mat3(wm)) * sw;`);
  };
  mat.customProgramCacheKey = () => 'wind' + amp + local;
  return mat;
}

// ---------- kit helpers (GLB node -> InstancedMesh per sub-mesh) ----------
function kitParts(scene, name) {
  const node = scene.getObjectByName(name); if (!node) return null;
  node.updateWorldMatrix(true, true); const inv = node.matrixWorld.clone().invert(); const parts = [];
  node.traverse(o => { if (o.isMesh) parts.push({ geo: o.geometry, mat: o.material, m: new THREE.Matrix4().multiplyMatrices(inv, o.matrixWorld) }); });
  const box = new THREE.Box3(); parts.forEach(p => { p.geo.computeBoundingBox(); box.union(p.geo.boundingBox.clone().applyMatrix4(p.m)); });
  return { parts, box };
}
function instance(group, kit, mats, { shadow = true, wind = 0, receive = true } = {}) {
  if (!kit || !mats.length) return [];
  const out = [];
  for (const p of kit.parts) {
    let m = p.mat;
    if (wind && /leaf|leaves|grass|flower|bush|clover|fern|plant/i.test(m.name || '') && !m.userData.windy) { m.userData.windy = true; m.alphaToCoverage = false; windify(m, wind); }
    const im = new THREE.InstancedMesh(p.geo, m, mats.length);
    mats.forEach((M, i) => im.setMatrixAt(i, new THREE.Matrix4().multiplyMatrices(M, p.m)));
    im.castShadow = shadow; im.receiveShadow = receive; im.frustumCulled = false; group.add(im); out.push(im);
  }
  return out;
}
const place = (x, z, s = 1, ry = rnd() * Math.PI * 2, y) => new THREE.Matrix4().compose(new V3(x, y ?? height(x, z), z), new THREE.Quaternion().setFromAxisAngle(new V3(0, 1, 0), ry), new V3(s, s, s));

export async function buildMeadow(scene, Q, base) {
  seed = 7;
  const W = { colliders: [], boxes: [], platforms: [], updates: [], group: new THREE.Group(), spots: {} };
  scene.add(W.group); const G = W.group;
  const [trees, plants, rocks, logs] = await Promise.all(['nature_trees', 'nature_plants', 'nature_rocks', 'nature_logs'].map(n => loadGLB(base + 'assets/nature/' + n + '.glb')));
  W.kitsLoaded = { trees: !!trees, plants: !!plants, rocks: !!rocks, logs: !!logs };

  // ---------- sky (gradient, sun, moving clouds, faint stars + dragon constellation) ----------
  const skyMat = new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false, fog: false,
    uniforms: { uT: U.time, sunDir: { value: new V3(0.55, 0.32, -0.77).normalize() } },
    vertexShader: 'varying vec3 vD; void main(){ vD = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); gl_Position.z = gl_Position.w; }',
    fragmentShader: `varying vec3 vD; uniform float uT; uniform vec3 sunDir;
      float h(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
      float n(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f); return mix(mix(h(i),h(i+vec2(1,0)),f.x), mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x), f.y); }
      float fbm(vec2 p){ float s=0., a=.5; for(int i=0;i<5;i++){ s+=a*n(p); p*=2.03; a*=.5; } return s; }
      void main(){ vec3 d = normalize(vD); float y = d.y;
        vec3 zen = vec3(0.30,0.42,0.86), mid = vec3(0.78,0.62,0.95), hor = vec3(1.0,0.80,0.62), low = vec3(0.98,0.70,0.72);
        vec3 c = mix(hor, mid, smoothstep(0.02, 0.25, y)); c = mix(c, zen, smoothstep(0.25, 0.85, y)); c = mix(low, c, smoothstep(-0.1, 0.03, y));
        float sd = max(dot(d, sunDir), 0.); c += vec3(1.0,0.75,0.45) * pow(sd, 6.0) * 0.45 + vec3(1.0,0.9,0.7) * pow(sd, 900.0) * 6.0;
        vec2 cp = d.xz / (y + 0.18) * 1.6 + vec2(uT * 0.012, uT * 0.004);
        float cl = smoothstep(0.52, 0.85, fbm(cp)) * smoothstep(0.03, 0.2, y);
        vec3 cc = mix(vec3(1.0,0.86,0.92), vec3(1.0,0.97,0.9), pow(sd, 2.0)); c = mix(c, cc, cl * 0.75);
        float st = step(0.9975, h(floor(d.xy * 420.0 + d.z * 37.0))) * smoothstep(0.35, 0.8, y) * 0.5; c += st;
        gl_FragColor = vec4(c, 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
  });
  const sky = new THREE.Mesh(new THREE.SphereGeometry(800, 48, 24), skyMat); sky.renderOrder = -10; sky.frustumCulled = false; G.add(sky);
  W.sunDir = skyMat.uniforms.sunDir.value;
  // dragon constellation (foreshadowing): faint stars + hairline in the eastern sky above the portal
  const dragonPts = [[0, 0], [1, 0.4], [2, 0.5], [3, 0.2], [4, 0.6], [5, 1.2], [5.6, 1.9], [5.2, 2.4], [4.6, 2.1], [2, 0.5], [2.4, 1.6], [3.4, 2.2], [1, 0.4], [0.6, 1.4], [-0.3, 1.9], [-1, 1.5]];
  const cg = new THREE.Group(); const cpos = dragonPts.map(([a, b]) => new V3(a * 22, b * 22, 0));
  const starsG = new THREE.BufferGeometry().setFromPoints(cpos); const starM = new THREE.PointsMaterial({ color: 0xffd6f4, size: 5, sizeAttenuation: false, transparent: true, opacity: 0.0, depthWrite: false, fog: false, map: glowTexture(), blending: THREE.AdditiveBlending });
  cg.add(new THREE.Points(starsG, starM)); const lineM = new THREE.LineBasicMaterial({ color: 0xffb0e0, transparent: true, opacity: 0.0, fog: false });
  cg.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(cpos), lineM));
  cg.position.set(140, 300, -620); cg.lookAt(0, 0, 0); G.add(cg); W.constellation = { starM, lineM };

  // ---------- terrain ----------
  const seg = Q.low ? 160 : 260, size = 340;
  const tg = new THREE.PlaneGeometry(size, size, seg, seg); tg.rotateX(-Math.PI / 2); tg.translate(0, 0, -70);
  const tp = tg.attributes.position, col = new Float32Array(tp.count * 3), cc = new THREE.Color();
  for (let i = 0; i < tp.count; i++) {
    const x = tp.getX(i), z = tp.getZ(i), y = height(x, z); tp.setY(i, y);
    const dp = Math.abs(x - pathX(z)), ds = Math.abs(z - streamZ(x)), rock = sstep(5, 12, y - 3) ;
    cc.setHSL(0.27 + 0.03 * Math.sin(x * 0.1 + z * 0.13), 0.55, 0.28 + 0.06 * Math.sin(x * 0.07) * Math.cos(z * 0.05));
    const dirt = new THREE.Color(0.36, 0.27, 0.19).lerp(new THREE.Color(0.44, 0.34, 0.24), 0.5 + 0.5 * Math.sin(x * 1.3 + z));
    cc.lerp(dirt, 1 - sstep(1.4, 2.6, dp)); if (ds < 4.2) cc.lerp(new THREE.Color(0.36, 0.34, 0.28), 1 - sstep(2.6, 4.2, ds));
    cc.lerp(new THREE.Color(0.5, 0.46, 0.52), rock);
    col.set([cc.r, cc.g, cc.b], i * 3);
  }
  tg.setAttribute('color', new THREE.BufferAttribute(col, 3)); tg.computeVertexNormals();
  const gnm = normalMap('ground').clone(); gnm.needsUpdate = true; gnm.repeat.set(60, 60);
  const ground = new THREE.Mesh(tg, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.95, normalMap: gnm, normalScale: new THREE.Vector2(0.6, 0.6) }));
  ground.receiveShadow = true; G.add(ground);

  // ---------- water: stream ribbon + pool + waterfall ----------
  const waterU = { uT: U.time, uNm: { value: normalMap('water') }, uSun: { value: W.sunDir }, fogColor: { value: new THREE.Color() }, fogDensity: { value: 0 } };
  const waterMat = new THREE.ShaderMaterial({
    transparent: true, fog: true, uniforms: THREE.UniformsUtils.merge([THREE.UniformsLib.fog, {}]),
    vertexShader: `varying vec2 vUv; varying vec3 vW; #include <fog_pars_vertex>
      void main(){ vUv = uv; vec4 w = modelMatrix * vec4(position,1.0); vW = w.xyz; vec4 mvPosition = viewMatrix * w; gl_Position = projectionMatrix * mvPosition; #include <fog_vertex> }`.replace(/#include <(\w+)>/g, '\n#include <$1>\n'),
    fragmentShader: `uniform float uT; uniform sampler2D uNm; uniform vec3 uSun; varying vec2 vUv; varying vec3 vW; #include <fog_pars_fragment>
      void main(){ vec2 p = vW.xz * 0.18; vec3 n1 = texture2D(uNm, p + vec2(uT*0.12, uT*0.03)).xyz*2.-1.; vec3 n2 = texture2D(uNm, p*1.7 - vec2(uT*0.08, -uT*0.05)).xyz*2.-1.;
        vec3 n = normalize(vec3(n1.x+n2.x, 3.0, n1.y+n2.y)); vec3 v = normalize(cameraPosition - vW); float fr = pow(1.0 - max(dot(n, v), 0.0), 3.0);
        vec3 deep = vec3(0.05,0.32,0.42), shallow = vec3(0.28,0.72,0.72), skyc = vec3(0.95,0.8,0.9);
        float edge = 1.0 - abs(vUv.y - 0.5) * 2.0; vec3 c = mix(shallow, deep, smoothstep(0.0, 0.7, edge)); c = mix(c, skyc, fr * 0.7);
        vec3 r = reflect(-v, n); c += vec3(1.0,0.85,0.6) * pow(max(dot(r, uSun), 0.0), 120.0) * 2.5;
        float foam = smoothstep(0.18, 0.0, edge) * (0.6 + 0.4 * sin(vW.x*3.0 + uT*2.0)); c = mix(c, vec3(1.0), foam * 0.6);
        gl_FragColor = vec4(c, mix(0.72, 0.92, fr) );
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
        #include <fog_fragment>
      }`.replace(/#include <(\w+)>/g, '\n#include <$1>\n'),
  });
  waterMat.uniforms.uT = U.time; waterMat.uniforms.uNm = { value: normalMap('water') }; waterMat.uniforms.uSun = { value: W.sunDir };
  const sp = [], sw = 8.5; for (let x = -110; x <= 40; x += 1.5) sp.push(new V3(x, WATER_Y, streamZ(x)));
  const ribbon = new THREE.BufferGeometry(); const rp = [], ru = [], ri = [];
  sp.forEach((p, i) => { const q = sp[Math.min(i + 1, sp.length - 1)], o = sp[Math.max(i - 1, 0)]; const t = new V3().subVectors(q, o).normalize(); const nrm = new V3(-t.z, 0, t.x); for (const s of [-1, 1]) { const v = p.clone().addScaledVector(nrm, s * sw / 2); rp.push(v.x, v.y, v.z); ru.push(i / sp.length * 20, s < 0 ? 0 : 1); } if (i) { const a = (i - 1) * 2; ri.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); } });
  ribbon.setAttribute('position', new THREE.Float32BufferAttribute(rp, 3)); ribbon.setAttribute('uv', new THREE.Float32BufferAttribute(ru, 2)); ribbon.setIndex(ri); ribbon.computeVertexNormals();
  const water = new THREE.Mesh(ribbon, waterMat); water.renderOrder = 2; G.add(water);
  const pool = new THREE.Mesh(new THREE.CircleGeometry(7, 40), waterMat); pool.rotation.x = -Math.PI / 2; pool.position.set(36, WATER_Y + 0.01, streamZ(36)); G.add(pool);
  const fallMat = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, side: THREE.DoubleSide, uniforms: { uT: U.time },
    vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
    fragmentShader: `uniform float uT; varying vec2 vUv; float h(float x){ return fract(sin(x*91.7)*437.5); }
      void main(){ float col = floor(vUv.x * 46.0); float s = fract(vUv.y * 3.0 + uT * (1.4 + h(col) * 0.8) + h(col)); float streak = smoothstep(0.0, 0.5, s) * (0.55 + 0.45 * h(col + 3.0));
        float edge = smoothstep(0.0, 0.12, vUv.x) * smoothstep(1.0, 0.88, vUv.x); vec3 c = mix(vec3(0.55,0.85,0.95), vec3(1.0), streak);
        gl_FragColor = vec4(c, (0.55 + 0.4 * streak) * edge); }` });
  const fz = streamZ(37), fallTop = height(41, fz) + 0.3;
  const fall = new THREE.Mesh(new THREE.PlaneGeometry(6, fallTop - WATER_Y, 1, 1), fallMat); fall.position.set(39.2, (fallTop + WATER_Y) / 2, fz); fall.rotation.y = -Math.PI / 2; fall.rotation.x = 0; G.add(fall);
  // mist at the waterfall base
  const mist = sprites(60, glowTexture(), 0xeefcff, 2.6, 0.18); mist.userData.base = new V3(37.5, WATER_Y + 0.5, fz); G.add(mist);
  W.updates.push((t) => { const p = mist.geometry.attributes.position; for (let i = 0; i < p.count; i++) { const k = (t * 0.25 + i / p.count) % 1; p.setXYZ(i, 37.5 - k * 4 + Math.sin(i * 7) * 1.5, WATER_Y + 0.2 + k * 2.5, fz + Math.sin(i * 3.1) * 2.8); } p.needsUpdate = true; });

  // ---------- grass blades (instanced, wind) ----------
  const bladeN = Q.low ? 9000 : Q.med ? 26000 : 55000;
  const bg = new THREE.BufferGeometry(); const bp = [], bc = [], bn = [], bi = []; const SEG = 4;
  for (let i = 0; i <= SEG; i++) { const u = i / SEG, w = 0.055 * (1 - u * 0.92), bend = u * u * 0.12; bp.push(-w, u * 0.55, bend, w, u * 0.55, bend); const c = new THREE.Color(0.12, 0.3, 0.07).lerp(new THREE.Color(0.62, 0.82, 0.32), u); bc.push(c.r, c.g, c.b, c.r, c.g, c.b); bn.push(0, 1, 0.3, 0, 1, 0.3); if (i) { const a = (i - 1) * 2; bi.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); } }
  bg.setAttribute('position', new THREE.Float32BufferAttribute(bp, 3)); bg.setAttribute('color', new THREE.Float32BufferAttribute(bc, 3)); bg.setAttribute('normal', new THREE.Float32BufferAttribute(bn, 3)); bg.setIndex(bi);
  const bladeMat = windify(new THREE.MeshStandardMaterial({ vertexColors: true, side: THREE.DoubleSide, roughness: 0.8 }), 0.55, true);
  const blades = new THREE.InstancedMesh(bg, bladeMat, bladeN); const m4 = new THREE.Matrix4(), q4 = new THREE.Quaternion(), tint = new THREE.Color();
  let bcount = 0;
  for (let i = 0; i < bladeN * 3 && bcount < bladeN; i++) {
    const z = 22 - rnd() * 182, x = pathX(z) + (rnd() - 0.5) * 2 * (6 + rnd() * rnd() * 34);
    const dp = Math.abs(x - pathX(z)); if (dp < 1.7 + rnd() * 0.8) continue; const y = height(x, z); if (y < WATER_Y + 0.15) continue; if (Math.hypot(x - PORTAL.x, z - PORTAL.z) < 5) continue;
    const s = 0.7 + rnd() * 0.9 + (dp > 8 ? rnd() * 0.5 : 0);
    m4.compose(new V3(x, y - 0.02, z), q4.setFromEuler(new THREE.Euler((rnd() - 0.5) * 0.3, rnd() * Math.PI * 2, (rnd() - 0.5) * 0.3)), new V3(s, s * (0.8 + rnd() * 0.6), s));
    blades.setMatrixAt(bcount, m4); tint.setHSL(0.24 + rnd() * 0.07, 0.6, 0.45 + rnd() * 0.2); blades.setColorAt(bcount, tint); bcount++;
  }
  blades.count = bcount; blades.receiveShadow = true; blades.castShadow = false; blades.frustumCulled = false; G.add(blades);

  // ---------- plants & flowers from the kit (fallback: simple procedural flowers) ----------
  const scatter = (n, fn) => { const out = []; for (let i = 0; i < n * 4 && out.length < n; i++) { const r = fn(); if (r) out.push(r); } return out; };
  const meadowSpot = (minD = 2.6, maxD = 30, zr = [18, -158]) => () => { const z = zr[0] - rnd() * (zr[0] - zr[1]), x = pathX(z) + (rnd() < 0.5 ? -1 : 1) * (minD + rnd() * (maxD - minD)); const y = height(x, z); if (y < WATER_Y + 0.25 || Math.abs(z - streamZ(x)) < 4.5) return null; return [x, z]; };
  if (plants) {
    const kit = (n) => kitParts(plants.scene, n);
    const scale = (Q.low ? 0.4 : Q.med ? 0.7 : 1);
    const spread = (name, n, sMin, sMax, spot) => { const k = kit(name); if (!k) return; instance(G, k, scatter(Math.round(n * scale), spot).map(([x, z]) => place(x, z, sMin + rnd() * (sMax - sMin))), { shadow: false, wind: 0.08 }); };
    spread('Grass_Wispy_Tall', 700, 0.9, 1.5, meadowSpot(2.2, 32)); spread('Grass_Common_Tall', 600, 0.9, 1.4, meadowSpot(2.2, 32)); spread('Grass_Common_Short', 500, 1, 1.5, meadowSpot(2, 20));
    spread('Flower_3_Group', 420, 0.9, 1.4, meadowSpot(2.4, 26)); spread('Flower_4_Group', 420, 0.9, 1.4, meadowSpot(2.4, 26)); spread('Flower_3_Single', 300, 1, 1.5, meadowSpot(2, 14)); spread('Flower_4_Single', 300, 1, 1.5, meadowSpot(2, 14));
    spread('Clover_1', 300, 1, 1.6, meadowSpot(2, 18)); spread('Clover_2', 260, 1, 1.6, meadowSpot(2, 18)); spread('Fern_1', 160, 1.2, 2, meadowSpot(8, 34));
    spread('Bush_Common_Flowers', 70, 1.2, 2, meadowSpot(7, 36)); spread('Bush_Common', 80, 1.2, 2.2, meadowSpot(9, 40));
    spread('Mushroom_Common', 50, 1, 1.8, meadowSpot(6, 30)); spread('Plant_1_Big', 60, 1, 1.6, meadowSpot(5, 30)); spread('Plant_7_Big', 60, 1, 1.6, meadowSpot(5, 30));
    W.plantKit = plants;
  } else {
    const fg = new THREE.SphereGeometry(0.06, 8, 6); const cols = [0xff6fbf, 0xffd23a, 0xb06bff, 0x5ac8ff, 0xffffff];
    cols.forEach((c, ci) => { const im = new THREE.InstancedMesh(fg, windify(new THREE.MeshStandardMaterial({ color: c, roughness: 0.5, emissive: c, emissiveIntensity: 0.08 }), 0.6), 500); const ps = scatter(500, meadowSpot(2, 26)); ps.forEach(([x, z], i) => im.setMatrixAt(i, place(x, z, 1, 0, height(x, z) + 0.35))); im.count = ps.length; G.add(im); });
  }

  // ---------- trees: giant trees along the path, enchanted twisted trees by the portal, distant forest ----------
  const giants = [[-11, 0], [12, -14], [-13, -22], [14, -58], [-15, -68], [13, -96], [-14, -112], [16, -122]];
  const treeCol = (x, z, r) => W.colliders.push({ x, z, r });
  if (trees) {
    const pick = (n) => kitParts(trees.scene, n);
    const groups = {};
    const add = (name, x, z, s) => { (groups[name] = groups[name] || []).push(place(x, z, s)); };
    giants.forEach(([dx, z], i) => { const x = pathX(z) + dx; add(i % 2 ? 'CommonTree_1' : 'CommonTree_2', x, z, 2.6 + rnd() * 0.8); treeCol(x, z, 1.3); });
    [[-9, -128], [10, -134], [-12, -146], [11, -152], [0, -160]].forEach(([dx, z], i) => { const x = pathX(z) + dx; add('TwistedTree_' + (1 + i % 3), x, z, 1.6 + rnd() * 0.5); treeCol(x, z, 0.8); });
    for (let i = 0; i < 70; i++) { const z = 18 - rnd() * 175, side = rnd() < 0.5 ? -1 : 1, x = pathX(z) + side * (18 + rnd() * 18); if (Math.abs(z - streamZ(x)) < 6) continue; const n = ['CommonTree_3', 'CommonTree_4', 'CommonTree_5', 'CommonTree_1', 'TwistedTree_2'][i % 5]; add(n, x, z, 1.2 + rnd() * 0.9); treeCol(x, z, 0.6); }
    const far = Q.low ? 120 : 260;
    for (let i = 0; i < far; i++) { const z = 30 - rnd() * 210, side = rnd() < 0.5 ? -1 : 1, x = side * (44 + rnd() * 70); add(['Pine_1', 'Pine_2', 'Pine_3', 'CommonTree_3', 'Pine_5'][i % 5], x, z, 1.4 + rnd() * 1.4); }
    for (let i = 0; i < (Q.low ? 40 : 90); i++) { const x = (rnd() - 0.5) * 220, z = -175 - rnd() * 60; add(['Pine_1', 'Pine_2', 'CommonTree_4'][i % 3], x, z, 1.6 + rnd() * 1.6); }
    for (const [n, list] of Object.entries(groups)) instance(G, pick(n), list, { shadow: !Q.low, wind: 0.0025 });
  } else {
    const bark = new THREE.MeshStandardMaterial({ color: 0x6a4a36, roughness: 0.9, normalMap: normalMap('bark') });
    const leaf = windify(new THREE.MeshStandardMaterial({ color: 0x5aa54a, roughness: 0.8 }), 0.003);
    giants.forEach(([dx, z]) => { const x = pathX(z) + dx, y = height(x, z); const tr = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 1.4, 14, 14), bark); tr.position.set(x, y + 7, z); tr.castShadow = true; G.add(tr); for (let k = 0; k < 6; k++) { const s = new THREE.Mesh(new THREE.IcosahedronGeometry(3.5 + rnd() * 2, 2), leaf); s.position.set(x + (rnd() - 0.5) * 6, y + 14 + rnd() * 4, z + (rnd() - 0.5) * 6); s.castShadow = true; G.add(s); } treeCol(x, z, 1.3); });
  }
  W.giants = giants.map(([dx, z]) => new V3(pathX(z) + dx, height(pathX(z) + dx, z), z));

  // ---------- rocks, stepping stones, the fallen log, stumps ----------
  if (rocks) {
    const rk = (n) => kitParts(rocks.scene, n);
    const along = [], mediums = [];
    for (let x = -90; x < 34; x += 3 + rnd() * 4) for (const s of [-1, 1]) { const z = streamZ(x) + s * (3.8 + rnd() * 1.2); along.push(place(x, z, 0.8 + rnd() * 0.9, undefined, height(x, z) - 0.15)); }
    instance(G, rk('Pebble_Round_1'), along.filter((_, i) => i % 3 === 0)); instance(G, rk('Pebble_Round_3'), along.filter((_, i) => i % 3 === 1)); instance(G, rk('Pebble_Square_2'), along.filter((_, i) => i % 3 === 2));
    for (let i = 0; i < 40; i++) { const z = 15 - rnd() * 170, x = pathX(z) + (rnd() < 0.5 ? -1 : 1) * (6 + rnd() * 26); mediums.push(place(x, z, 0.9 + rnd() * 1.6, undefined, height(x, z) - 0.2)); }
    instance(G, rk('Rock_Medium_1'), mediums.slice(0, 14)); instance(G, rk('Rock_Medium_2'), mediums.slice(14, 27)); instance(G, rk('Rock_Medium_3'), mediums.slice(27));
    // cliff boulders flanking the waterfall
    const cl = []; for (let i = 0; i < 16; i++) { const z = fz + (i - 8) * 1.6 + (i > 7 ? 3 : -3), x = 38.5 + rnd() * 2; cl.push(place(x, z, 2.4 + rnd() * 1.6, undefined, WATER_Y + (i % 4) * 2.4)); }
    instance(G, rk('Rock_Medium_3'), cl);
    // stepping stones across the stream (platforms)
    const stones = []; const sx = pathX(-46);
    for (let i = 0; i < 4; i++) { const z = streamZ(sx) + 3 - i * 2.0, x = sx + (i % 2 ? 0.7 : -0.6); stones.push(place(x, z, 1.25, rnd() * 3, WATER_Y - 0.05)); W.platforms.push({ x, z, r: 0.75, top: WATER_Y + 0.33 }); }
    instance(G, rk('RockPath_Round_Small_1'), stones);
  }
  // hedge line with one gap that the fallen log blocks -> teaches jumping
  const hedgeZ = -31, gapX = pathX(hedgeZ);
  if (plants) {
    const bk = kitParts(plants.scene, 'Bush_Common_Flowers') || kitParts(plants.scene, 'Bush_Common'); const list = [];
    for (let x = -62; x <= 62; x += 1.7) { if (Math.abs(x - gapX) < 3.2) continue; list.push(place(x, hedgeZ + Math.sin(x) * 0.4, 1.9 + rnd() * 0.6)); }
    instance(G, bk, list, { wind: 0.02 });
  }
  W.boxes.push({ minX: -70, maxX: gapX - 3, minZ: hedgeZ - 1.2, maxZ: hedgeZ + 1.2, top: 9 }, { minX: gapX + 3, maxX: 70, minZ: hedgeZ - 1.2, maxZ: hedgeZ + 1.2, top: 9 });
  const logTop = height(gapX, hedgeZ) + 0.85;
  W.boxes.push({ minX: gapX - 3.2, maxX: gapX + 3.2, minZ: hedgeZ - 0.5, maxZ: hedgeZ + 0.5, top: logTop, log: true });
  if (logs) {
    const lk = kitParts(logs.scene, 'dead_tree_trunk');
    if (lk) { const sz = lk.box.getSize(new V3()); const L = Math.max(sz.x, sz.z); const s = 7.4 / L; const rot = sz.x > sz.z ? 0 : Math.PI / 2; const gy = height(gapX, hedgeZ);
      instance(G, lk, [new THREE.Matrix4().compose(new V3(gapX, gy - lk.box.min.y * s - 0.05, hedgeZ), new THREE.Quaternion().setFromAxisAngle(new V3(0, 1, 0), rot), new V3(s, s, s))]);
      const lb = W.boxes[W.boxes.length - 1]; lb.top = gy + Math.min(1.25, Math.max(0.6, sz.y * s - 0.05)); }
    const st = kitParts(logs.scene, 'tree_stump_01'); if (st) { const s = 1.1 / Math.max(0.01, st.box.getSize(new V3()).y); instance(G, st, [place(pathX(6) + 3.2, 6, s)]); W.colliders.push({ x: pathX(6) + 3.2, z: 6, r: 0.6 }); W.spots.stump = new V3(pathX(6) + 3.2, height(pathX(6) + 3.2, 6) + 1.1, 6); }
  }
  if (!logs) { const lg = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.5, 6.4, 18), new THREE.MeshStandardMaterial({ color: 0x6a4a36, roughness: 0.9, normalMap: normalMap('bark') })); lg.rotation.z = Math.PI / 2; lg.position.set(gapX, logTop - 0.42, hedgeZ); lg.castShadow = true; G.add(lg); }

  // ---------- mountains + distant floating island ----------
  const mm = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1, flatShading: false });
  for (let i = 0; i < 16; i++) {
    const a = -Math.PI * 0.95 + (i / 15) * Math.PI * 0.9 + (rnd() - 0.5) * 0.1, r = 330 + rnd() * 90, h = 70 + rnd() * 90;
    const g = new THREE.ConeGeometry(70 + rnd() * 50, h, 48, 12); const p = g.attributes.position, c = new Float32Array(p.count * 3);
    for (let k = 0; k < p.count; k++) { const x = p.getX(k), y = p.getY(k), z = p.getZ(k); const n = 1 + 0.18 * Math.sin(x * 0.08 + i) * Math.cos(z * 0.07) + 0.08 * Math.sin(y * 0.2 + x * 0.1); p.setXYZ(k, x * n, y, z * n); const t = (y + h / 2) / h; const col = new THREE.Color(0.42, 0.45, 0.62).lerp(new THREE.Color(1.0, 0.86, 0.92), sstep(0.72, 0.9, t)); c.set([col.r, col.g, col.b], k * 3); }
    g.setAttribute('color', new THREE.BufferAttribute(c, 3)); g.computeVertexNormals();
    const m = new THREE.Mesh(g, mm); m.position.set(Math.sin(a) * r, h / 2 - 12, -70 + Math.cos(a) * r); G.add(m);
  }

  // ---------- 3D cumulus clouds + the whale cloud (foreshadowing) ----------
  const cloudMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 1, emissive: 0xffe6f0, emissiveIntensity: 0.35, fog: false });
  const puff = new THREE.IcosahedronGeometry(1, 3);
  const cloud = (n, sx, sy, sz) => { const g = new THREE.Group(); for (let i = 0; i < n; i++) { const m = new THREE.Mesh(puff, cloudMat); const s = 0.5 + rnd() * 0.6; m.scale.set(s * sx, s * sy, s * sz); m.position.set((rnd() - 0.5) * sx * 2.2, (rnd() - 0.3) * sy * 0.8, (rnd() - 0.5) * sz * 1.5); g.add(m); } return g; };
  const clouds = []; for (let i = 0; i < (Q.low ? 6 : 12); i++) { const c = cloud(9, 14, 6, 9); c.position.set((rnd() - 0.5) * 500, 95 + rnd() * 50, -120 - rnd() * 260); G.add(c); clouds.push(c); }
  const whale = new THREE.Group(); const wm = new THREE.MeshStandardMaterial({ color: 0xfff2fa, roughness: 1, emissive: 0xffd0ea, emissiveIntensity: 0.45, fog: false });
  const wb = (s, p) => { const m = new THREE.Mesh(puff, wm); m.scale.set(...s); m.position.set(...p); whale.add(m); };
  wb([16, 6.5, 7], [0, 0, 0]); wb([9, 5.5, 6], [12, 0.5, 0]); wb([7, 4, 5], [-12, 1, 0]); wb([5, 2.6, 3.5], [-21, 2, 0]); wb([2.5, 0.8, 7], [-27, 3.5, 0]); wb([5, 1, 2], [3, -5, 6]); wb([5, 1, 2], [3, -5, -6]);
  whale.position.set(-260, 85, -60); whale.rotation.y = 0.1; G.add(whale); W.whale = whale;
  W.updates.push((t, dt) => { clouds.forEach((c, i) => { c.position.x += dt * (0.6 + i * 0.05); if (c.position.x > 280) c.position.x = -280; }); });

  // ---------- sunbeams through the giant trees ----------
  const beamMat = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, uniforms: { uT: U.time },
    vertexShader: 'varying vec2 vUv; varying float vY; void main(){ vUv = uv; vY = position.y; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
    fragmentShader: 'uniform float uT; varying vec2 vUv; void main(){ float a = smoothstep(0.0, 0.35, vUv.y) * smoothstep(1.0, 0.6, vUv.y) * (0.6 + 0.4 * sin(vUv.x * 18.0 + uT * 0.6)); gl_FragColor = vec4(1.0, 0.86, 0.6, a * 0.085); }' });
  W.giants.forEach((g, i) => { if (i % 2) return; const b = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 3.2, 16, 20, 1, true), beamMat); b.position.set(g.x - W.sunDir.x * 4, g.y + 7, g.z - W.sunDir.z * 4); b.lookAt(b.position.clone().add(W.sunDir)); b.rotateX(Math.PI / 2); G.add(b); });

  // ---------- pollen / fireflies ----------
  const pollen = sprites(Q.low ? 400 : 1400, glowTexture(), 0xffffff, 0.22, 0.9, true);
  const pc = pollen.geometry.attributes.color, pp = pollen.geometry.attributes.position, pal = [new THREE.Color(0xff9ad8), new THREE.Color(0xffe28a), new THREE.Color(0x9ad8ff), new THREE.Color(0xd0a0ff)];
  const base0 = []; for (let i = 0; i < pp.count; i++) { const z = 20 - rnd() * 180, x = pathX(z) + (rnd() - 0.5) * 50; const y = height(x, z) + 0.4 + rnd() * 4; base0.push([x, y, z, rnd() * 6]); const c = pal[i % 4]; pc.setXYZ(i, c.r, c.g, c.b); }
  G.add(pollen); W.pollen = pollen;
  W.updates.push((t) => { for (let i = 0; i < pp.count; i++) { const [x, y, z, o] = base0[i]; pp.setXYZ(i, x + Math.sin(t * 0.3 + o) * 1.2, y + Math.sin(t * 0.5 + o * 2) * 0.5, z + Math.cos(t * 0.25 + o) * 1.2); } pp.needsUpdate = true; });

  // ---------- butterflies ----------
  const bfs = [];
  for (let i = 0; i < (Q.low ? 10 : 26); i++) {
    const g = new THREE.Group(); const hue = [320, 280, 200, 45][i % 4];
    const wm2 = new THREE.MeshStandardMaterial({ map: wingTexture(hue), transparent: true, alphaTest: 0.3, side: THREE.DoubleSide, emissive: new THREE.Color().setHSL(hue / 360, 0.9, 0.5), emissiveMap: wingTexture(hue), emissiveIntensity: 0.35, roughness: 0.5 });
    const wgeo = new THREE.PlaneGeometry(0.16, 0.13); wgeo.translate(0.08, 0, 0);
    const L = new THREE.Mesh(wgeo, wm2), R = new THREE.Mesh(wgeo, wm2); R.scale.x = -1; g.add(L, R);
    g.add(new THREE.Mesh(new THREE.CapsuleGeometry(0.008, 0.06, 4, 6), new THREE.MeshStandardMaterial({ color: 0x221122 })).rotateX(Math.PI / 2));
    const z = 15 - rnd() * 160, x = pathX(z) + (rnd() - 0.5) * 24; g.userData = { L, R, home: new V3(x, height(x, z) + 1, z), o: rnd() * 10 }; G.add(g); bfs.push(g);
  }
  W.butterflies = bfs;
  W.updates.push((t) => { bfs.forEach(b => { const u = b.userData, k = t * 0.35 + u.o; const p = new V3(u.home.x + Math.sin(k) * 3 + Math.sin(k * 2.3) * 1.2, u.home.y + 0.6 + Math.sin(k * 1.7) * 0.5, u.home.z + Math.cos(k * 0.8) * 3); b.lookAt(p.clone().add(new V3(Math.cos(k), 0, -Math.sin(k * 0.8)))); b.position.copy(p); const f = Math.sin(t * 22 + u.o) * 1.1; u.L.rotation.y = f; u.R.rotation.y = -f; }); });

  // ---------- the portal: rune-stone ring, swirling disc, sparks ----------
  const portal = new THREE.Group(); portal.position.set(PORTAL.x, height(PORTAL.x, PORTAL.z), PORTAL.z); G.add(portal);
  const stone = new THREE.MeshStandardMaterial({ color: 0x8a8098, roughness: 0.85, normalMap: normalMap('rock'), normalScale: new THREE.Vector2(1, 1) });
  const ringG = new THREE.TorusGeometry(3.3, 0.42, 24, 72); { const p = ringG.attributes.position; for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i), z = p.getZ(i), n = 1 + 0.06 * Math.sin(x * 4 + y * 3) * Math.cos(z * 5); p.setXYZ(i, x * n, y * n, z * n); } ringG.computeVertexNormals(); }
  const ring = new THREE.Mesh(ringG, stone); ring.position.y = 3.6; ring.castShadow = true; portal.add(ring);
  const runeMat = new THREE.MeshStandardMaterial({ color: 0x000000, emissive: 0xffc860, emissiveMap: runeTexture(), emissiveIntensity: 2.2, transparent: true, alphaMap: runeTexture(), depthWrite: false });
  const rr = new THREE.Mesh(new THREE.TorusGeometry(3.32, 0.43, 6, 72), runeMat); rr.position.copy(ring.position); rr.scale.set(1.001, 1.001, 1.07); portal.add(rr);
  for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2; const s = new THREE.Mesh(new THREE.DodecahedronGeometry(0.7, 1), stone); s.position.set(Math.cos(a) * 6.5, 0.6, Math.sin(a) * 6.5 * 0.7 + 1.5); s.scale.set(0.7, 1.7 + rnd(), 0.6); s.rotation.y = a; s.castShadow = true; portal.add(s); W.colliders.push({ x: portal.position.x + s.position.x, z: portal.position.z + s.position.z, r: 0.6 }); }
  const discU = { uT: U.time, uPink: { value: 0 }, uChaos: { value: 0 } };
  const disc = new THREE.Mesh(new THREE.CircleGeometry(3.0, 64), new THREE.ShaderMaterial({ transparent: true, depthWrite: false, side: THREE.DoubleSide, uniforms: discU,
    vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
    fragmentShader: `uniform float uT, uPink, uChaos; varying vec2 vUv;
      void main(){ vec2 p = vUv - 0.5; float r = length(p) * 2.0; float a = atan(p.y, p.x);
        float sw = sin(a * 5.0 + r * (10.0 + uChaos * 20.0) - uT * (2.5 + uChaos * 6.0)) * 0.5 + 0.5; float sw2 = sin(a * 3.0 - r * 7.0 + uT * 1.7) * 0.5 + 0.5;
        vec3 blue = vec3(0.35, 0.75, 1.0), gold = vec3(1.0, 0.82, 0.45), pink = vec3(1.0, 0.35, 0.75), vio = vec3(0.55, 0.3, 1.0);
        vec3 c = mix(blue, gold, sw * 0.6); c = mix(c, pink, uPink); c = mix(c, vio, uChaos * sw2);
        float core = smoothstep(1.0, 0.0, r); float alpha = smoothstep(1.0, 0.82, r) * (0.55 + 0.45 * sw);
        gl_FragColor = vec4(c * (1.2 + core * 1.6), alpha); }` }));
  disc.position.y = 3.6; portal.add(disc);
  const pl = new THREE.PointLight(0x9ad0ff, 30, 18, 2); pl.position.y = 3.6; portal.add(pl);
  const sparks = sprites(260, glowTexture(), 0xffe0a0, 0.18, 1, true); portal.add(sparks);
  W.portal = { group: portal, disc, U: discU, light: pl, sparks, center: new V3(portal.position.x, portal.position.y + 3.6, portal.position.z) };
  W.updates.push((t) => { const p = sparks.geometry.attributes.position, c = sparks.geometry.attributes.color; for (let i = 0; i < p.count; i++) { const k = (t * 0.2 + i / p.count) % 1, a = i * 2.4 + t * (0.6 + discU.uChaos.value * 3); const r = 3.6 - k * 3.3; p.setXYZ(i, Math.cos(a) * r, 3.6 + Math.sin(a) * r, Math.sin(i) * 0.3); const pk = discU.uPink.value; c.setXYZ(i, 1, 0.85 - pk * 0.5, 0.6 + pk * 0.2); } p.needsUpdate = true; c.needsUpdate = true; pl.color.setRGB(0.6 + discU.uPink.value * 0.4, 0.8 - discU.uPink.value * 0.4, 1); });

  // ---------- foreshadowing props: a distant shadow between trees + a flower that can wilt ----------
  const shadowSpot = new V3(pathX(-60) - 24, 0, -60); shadowSpot.y = height(shadowSpot.x, shadowSpot.z); W.spots.shadow = shadowSpot;
  const wilt = new THREE.Group(); const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.02, 0.6, 6), new THREE.MeshStandardMaterial({ color: 0x3f8a3a })); stem.position.y = 0.3; wilt.add(stem);
  const bloomMat = new THREE.MeshStandardMaterial({ color: 0xff7ad0, emissive: 0xff3fb0, emissiveIntensity: 0.6, roughness: 0.4 });
  const head = new THREE.Group(); head.position.y = 0.6; wilt.add(head); for (let i = 0; i < 6; i++) { const pt = new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 8), bloomMat); pt.scale.set(1, 0.35, 0.6); pt.position.set(Math.cos(i) * 0.07, 0, Math.sin(i) * 0.07); head.add(pt); }
  const wx = pathX(-58) - 4.5; wilt.position.set(wx, height(wx, -58), -58); wilt.scale.setScalar(1.6); G.add(wilt); W.wilt = { group: wilt, head, mat: bloomMat };

  // ---------- tutorial spots ----------
  const S = (z, dx = 0) => { const x = pathX(z) + dx; return new V3(x, height(x, z), z); };
  Object.assign(W.spots, { start: S(10), girlStart: S(7, -2.2), catStart: S(8.5, 1.6), ringMove: S(-6), ringRun: S(-24), afterLog: S(-36), stones: S(-46), camera: S(-54), targets: S(-66), chest: S(-80, 3.5), arena: S(-100), pack: S(-90, -5), wave2: S(-118), portalApproach: S(-130), ledge: S(-35, -7), cliff: S(-39, 7.5), drums: S(-58), pondBank: new V3(POND.x + 1, height(POND.x + 1, POND.z + 6), POND.z + 6), pondFar: new V3(POND.x + 2, height(POND.x + 2, POND.z - 6.5), POND.z - 6.5) });
  W.hedgeZ = hedgeZ;
  W.update = (t, dt) => { for (const f of W.updates) f(t, dt); };
  return W;
}

export function sprites(n, map, color, size, opacity, vColors) {
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(n * 3), 3));
  if (vColors) { const c = new Float32Array(n * 3).fill(1); g.setAttribute('color', new THREE.Float32BufferAttribute(c, 3)); }
  const m = new THREE.PointsMaterial({ map, color, size, transparent: true, opacity, depthWrite: false, blending: THREE.AdditiveBlending, vertexColors: !!vColors, sizeAttenuation: true });
  const p = new THREE.Points(g, m); p.frustumCulled = false; return p;
}

// ground height including stepping-stone and log tops (only when the feet are above them)
export function groundAt(W, x, z, feetY) {
  let y = height(x, z);
  for (const p of W.platforms) if (Math.hypot(x - p.x, z - p.z) < p.r && feetY >= p.top - 0.35) y = Math.max(y, p.top);
  for (const b of W.boxes) if (x > b.minX && x < b.maxX && z > b.minZ && z < b.maxZ && feetY >= b.top - 0.3) y = Math.max(y, b.top);
  return y;
}
