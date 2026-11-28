// Offline support (PWA / future Capacitor-TWA wrap). App shell is precached; music is cached on first full play.
const VERSION = 'rth-stage2-v1';
const SHELL = ["./", "index.html", "game.css", "manifest.json", "tracks.json", "audio/tracks.json", "characters.json", "js/audio.js", "js/characters.js", "js/cheats.js", "js/main.js", "js/save.js", "js/textures.js", "js/world.js", "vendor/three/LICENSE", "vendor/three/build/three.module.js", "vendor/three/examples/jsm/libs/meshopt_decoder.module.js", "vendor/three/examples/jsm/loaders/GLTFLoader.js", "vendor/three/examples/jsm/loaders/RGBELoader.js", "vendor/three/examples/jsm/math/SimplexNoise.js", "vendor/three/examples/jsm/postprocessing/EffectComposer.js", "vendor/three/examples/jsm/postprocessing/GTAOPass.js", "vendor/three/examples/jsm/postprocessing/MaskPass.js", "vendor/three/examples/jsm/postprocessing/OutputPass.js", "vendor/three/examples/jsm/postprocessing/Pass.js", "vendor/three/examples/jsm/postprocessing/RenderPass.js", "vendor/three/examples/jsm/postprocessing/ShaderPass.js", "vendor/three/examples/jsm/postprocessing/UnrealBloomPass.js", "vendor/three/examples/jsm/shaders/CopyShader.js", "vendor/three/examples/jsm/shaders/GTAOShader.js", "vendor/three/examples/jsm/shaders/LuminosityHighPassShader.js", "vendor/three/examples/jsm/shaders/OutputShader.js", "vendor/three/examples/jsm/shaders/PoissonDenoiseShader.js", "vendor/three/examples/jsm/utils/BufferGeometryUtils.js", "vendor/three/examples/jsm/utils/SkeletonUtils.js", "assets/nature/nature_logs.glb", "assets/nature/nature_plants.glb", "assets/nature/nature_rocks.glb", "assets/nature/nature_trees.glb", "assets/models/cat.glb", "assets/models/lil-synn.glb", "assets/hdri/kloofendal_48d_partly_cloudy_puresky_1k.hdr", "assets/hdri/qwantani_sunset_puresky_1k.hdr", "icons/icon-192.png", "icons/icon-512.png", "icons/maskable-512.png"];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION && k.startsWith('rth-')).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', (e) => {
  const req = e.request; if (req.method !== 'GET') return;
  const url = new URL(req.url); if (url.origin !== location.origin || !url.pathname.includes('/game/') || url.pathname.includes('/game/classic/')) return;
  if (req.headers.has('range')) { // media range requests: serve from a cached full file when we have one
    e.respondWith(caches.match(url.pathname).then(r => r || fetch(req))); return; }
  e.respondWith(caches.match(req, { ignoreSearch: true }).then(hit => hit || fetch(req).then(res => {
    if (res.ok && res.status === 200 && res.type === 'basic') { const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)); }
    return res;
  }).catch(() => hit || caches.match('index.html'))));
});
