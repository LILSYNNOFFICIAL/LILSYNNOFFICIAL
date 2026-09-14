import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(new URL('.', import.meta.url).pathname, '..');
const admin = path.join(root, 'admin');
const command = path.join(root, 'command');
const suno = path.join(root, 'Suno');
const vercel = path.join(root, 'vercel.json');

assert.equal(fs.existsSync(path.join(admin, 'index.html')), true, 'Command Center index must exist');
assert.equal(fs.existsSync(path.join(admin, 'admin.css')), true, 'Command Center CSS must exist');
assert.equal(fs.existsSync(path.join(admin, 'admin.js')), true, 'Command Center JS must exist');
assert.equal(fs.existsSync(path.join(command, 'index.html')), true, 'Public Command Center route must exist');
assert.equal(fs.existsSync(path.join(suno, 'Suno_Guide.html')), true, 'Suno landing must exist');
assert.equal(fs.existsSync(path.join(suno, 'scripts', 'suno-site-doctor.mjs')), true, 'Suno doctor must exist');
assert.equal(fs.existsSync(path.join(suno, 'scripts', 'suno-site-doctor.test.mjs')), true, 'Suno doctor contract test must exist');
assert.equal(fs.existsSync(path.join(suno, 'scripts', 'suno-isolation.test.mjs')), true, 'Suno isolation test must exist');

const html = fs.readFileSync(path.join(admin, 'index.html'), 'utf8');
const publicCommand = fs.readFileSync(path.join(command, 'index.html'), 'utf8');
const js = fs.readFileSync(path.join(admin, 'admin.js'), 'utf8');
const routing = JSON.parse(fs.readFileSync(vercel, 'utf8'));
const sunoIndex = JSON.parse(fs.readFileSync(path.join(suno, 'search-index.json'), 'utf8'));
const sunoManifest = JSON.parse(fs.readFileSync(path.join(suno, 'manifest.json'), 'utf8'));

assert.match(html, /<main\b/i, 'Command Center must expose a main landmark');
assert.match(html, /LIL SYNN.*COMMAND CENTER/i, 'Command Center branding must be present');
assert.match(html, /\/site-health\.html/i, 'Main Site Health link must be present');
assert.match(html, /\/Suno\/health\.html/i, 'Suno Health link must be present');
assert.doesNotMatch(publicCommand, /<script[^>]+src=["']\/site-global\.js/i, 'Public Command Center must not load the main-site shell');
assert.match(publicCommand, /<main\b/i, 'Public Command Center must expose a main landmark');
assert.match(js, /UNKNOWN/, 'Unavailable signals must be represented as UNKNOWN');
assert.doesNotMatch(js, /(?:password|secret|api[_-]?key|authorization\s*[:=])/i, 'Frontend must not contain credential literals');
assert.doesNotMatch(js, /(?:DELETE|POST|PUT|PATCH)\s*["'`]https?:\/\//i, 'Frontend must not contain destructive GitHub writes');

const expectedRoutes = {
  '/suno': '/Suno/Suno_Guide.html',
  '/suno/': '/Suno/Suno_Guide.html',
  '/suno/v6': '/Suno/guides/v6.html',
  '/suno/prompting': '/Suno/guides/prompting.html',
  '/suno/lyrics': '/Suno/guides/lyrics.html',
  '/suno/styles': '/Suno/guides/styles.html',
  '/suno/audio': '/Suno/guides/audio.html',
  '/suno/sliders': '/Suno/guides/sliders.html',
  '/suno/voices': '/Suno/guides/voices.html',
  '/suno/editing': '/Suno/guides/editing.html',
  '/suno/stems': '/Suno/guides/stems.html',
  '/suno/studio': '/Suno/guides/studio.html',
  '/suno/midi': '/Suno/guides/midi.html',
  '/suno/effects': '/Suno/guides/effects.html',
  '/suno/automation': '/Suno/guides/automation.html',
  '/suno/production': '/Suno/guides/production.html',
  '/suno/troubleshooting': '/Suno/guides/troubleshooting.html',
  '/suno/rights': '/Suno/guides/rights.html',
  '/suno/complete': '/Suno/complete/complete-guide.html',
  '/suno/command-center': '/Suno/command-center.html',
  '/suno/prompt-architect': '/Suno/prompt-architect.html',
  '/suno/style-builder': '/Suno/style-builder.html',
  '/suno/lyrics-builder': '/Suno/lyrics-builder.html',
  '/suno/controls': '/Suno/controls.html',
  '/suno/troubleshooter': '/Suno/troubleshooter.html',
  '/suno/workflow': '/Suno/workflow.html',
  '/suno/deep-dives/ultimate-control': '/Suno/deep-dives/ultimate-control.html',
  '/suno/deep-dives/everything-expansion': '/Suno/deep-dives/everything-expansion.html',
  '/suno/deep-dives/final-current-expansion': '/Suno/deep-dives/final-current-expansion.html',
  '/suno/deep-dives/coverage-audit': '/Suno/deep-dives/coverage-audit.html',
  '/suno/deep-dives/gaps-closure': '/Suno/deep-dives/gaps-closure.html',
  '/suno/deep-dives/gap-closure-all-remaining': '/Suno/deep-dives/gap-closure-all-remaining.html',
  '/suno/deep-dives/additional-current-details': '/Suno/deep-dives/additional-current-details.html'
};
const rewrites = routing.rewrites || [];
const rewriteMap = new Map(rewrites.filter(r => r.source && r.destination).map(r => [r.source, r.destination]));
for (const [source, destination] of Object.entries(expectedRoutes)) {
  assert.equal(rewriteMap.get(source), destination, `Suno route must map ${source} -> ${destination}`);
  assert.equal(fs.existsSync(path.join(root, destination.slice(1))), true, `Suno route destination must exist: ${destination}`);
}
assert.equal(rewriteMap.get('/suno/:path*'), '/Suno/:path*', 'Unknown Suno child routes must fall through to the real Suno tree and 404 naturally');

assert.ok(Array.isArray(sunoIndex.entries) && sunoIndex.entries.length >= 25, 'Suno search index must contain the full entry set');
for (const entry of sunoIndex.entries) {
  assert.match(entry.href, /^\/Suno\//, `Search index entry must remain isolated: ${entry.title}`);
  assert.equal(fs.existsSync(path.join(root, entry.href.slice(1))), true, `Search index target must exist: ${entry.href}`);
}
assert.equal(sunoManifest.start_url, '/Suno/Suno_Guide.html', 'Suno manifest must remain isolated');
assert.ok(sunoManifest.coreTopics >= 17, 'Suno manifest must report the full core topic set');
assert.ok(sunoManifest.deepDives >= 7, 'Suno manifest must report the full research set');
assert.ok(sunoManifest.toolCount >= 6, 'Suno manifest must report all guide tools');

const audio = fs.readFileSync(path.join(suno, 'guides', 'audio.html'), 'utf8');
for (const marker of ['V6 AUDIO QUALITY ISSUES', 'Mini V6', 'Weirdness: 0%', 'Style & Audio Influence: 86%', 'WHOLE TRACK', 'recreate the original audio exactly as sung and performed']) {
  assert.match(audio, new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), `V6 audio-quality marker missing: ${marker}`);
}

console.log('Command Center + complete Suno route/content audit contract: PASS');
