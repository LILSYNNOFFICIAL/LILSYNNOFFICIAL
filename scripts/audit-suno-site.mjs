import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const suno = path.join(root, 'Suno');
const requiredRoutes = new Map([
  ['/css/suno.css', 'Suno/css/suno.css'],
  ['/js/suno.js', 'Suno/js/suno.js'],
  ['/suno', 'Suno/Suno_Guide.html'],
  ['/suno/complete', 'Suno/complete/complete-guide.html'],
  ['/suno/v6', 'Suno/guides/v6.html'],
  ['/suno/prompting', 'Suno/guides/prompting.html'],
  ['/suno/lyrics', 'Suno/guides/lyrics.html'],
  ['/suno/styles', 'Suno/guides/styles.html'],
  ['/suno/sliders', 'Suno/guides/sliders.html'],
  ['/suno/voices', 'Suno/guides/voices.html'],
  ['/suno/editing', 'Suno/guides/editing.html'],
  ['/suno/audio', 'Suno/guides/audio.html'],
  ['/suno/stems', 'Suno/guides/stems.html'],
  ['/suno/studio', 'Suno/guides/studio.html'],
  ['/suno/midi', 'Suno/guides/midi.html'],
  ['/suno/effects', 'Suno/guides/effects.html'],
  ['/suno/automation', 'Suno/guides/automation.html'],
  ['/suno/production', 'Suno/guides/production.html'],
  ['/suno/troubleshooting', 'Suno/guides/troubleshooting.html'],
  ['/suno/rights', 'Suno/guides/rights.html'],
  ['/suno/deep-dives/ultimate-control', 'Suno/complete/ultimate-control.html'],
  ['/suno/deep-dives/everything-expansion', 'Suno/complete/everything-expansion.html'],
  ['/suno/deep-dives/final-current-expansion', 'Suno/complete/final-current-expansion.html'],
  ['/suno/deep-dives/coverage-audit', 'Suno/complete/coverage-audit.html'],
  ['/suno/deep-dives/gaps-closure', 'Suno/complete/gaps-closure.html'],
  ['/suno/deep-dives/gap-closure-all-remaining', 'Suno/complete/gap-closure-all-remaining.html'],
  ['/suno/deep-dives/additional-current-details', 'Suno/complete/additional-current-details.html']
]);
const sourceDocs = [
  'README.md',
  'SUNO-V6-ULTIMATE-CONTROL-AND-PRODUCTION-ADDENDUM-2026.md',
  'SUNO-V6-EVERYTHING-EXPANSION.md',
  'SUNO-V6-FINAL-CURRENT-EXPANSION.md',
  'SUNO-V6-CURRENT-COVERAGE-AUDIT.md',
  'SUNO-V6-CURRENT-GAPS-CLOSURE.md',
  'SUNO-V6-GAP-CLOSURE-ALL-REMAINING-CURRENT.md',
  'SUNO-V6-ADDITIONAL-CURRENT-DETAILS.md'
];
const topicRoutes = [...requiredRoutes.keys()].filter(route => route.startsWith('/suno/') && !route.includes('/deep-dives/') && route !== '/suno/complete');
const failures = [];
const exists = async p => { try { await fs.access(p); return true; } catch { return false; } };
const read = p => fs.readFile(p,'utf8');
const plain = html => html.replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<style[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();

for (const [route, target] of requiredRoutes) if (!(await exists(path.join(root, target)))) failures.push(`${route}: missing ${target}`);
for (const file of ['Suno_Guide.html','js/suno.js','css/suno.css','complete/complete-guide.html','search-index.json','manifest.json']) if (!(await exists(path.join(suno,file)))) failures.push(`missing Suno/${file}`);

const routeTargets = [...requiredRoutes.values()];
const htmlFiles = routeTargets.filter(relative => relative.endsWith('.html'));
for (const relative of htmlFiles) {
  const html = await read(path.join(root, relative));
  if (/github\.com\/LILSYNNOFFICIAL\/LIL-SYNN-s-Complete-Suno-V6-Guide/i.test(html) || /raw\.githubusercontent\.com\/LILSYNNOFFICIAL\/LIL-SYNN-s-Complete-Suno-V6-Guide/i.test(html)) failures.push(`${relative}: canonical GitHub guide URL leaked into generated HTML`);
  if (/href=["'](?:\.\/|\.\.\/)?[^"']+\.md(?:[#"']|$)/i.test(html)) failures.push(`${relative}: Markdown navigation link remains in HTML`);
  if (plain(html).length < 800) failures.push(`${relative}: suspiciously little rendered content (${plain(html).length} chars)`);
}

const landing = await read(path.join(suno,'Suno_Guide.html'));
if (!landing.includes('id="suno-source-status"')) failures.push('landing page is missing live source status marker');
if (!landing.includes('/suno/complete') || !landing.includes('/suno/v6')) failures.push('landing page is missing primary internal calls-to-action');
if (!landing.includes('css/suno.css') || !landing.includes('js/suno.js')) failures.push('landing page is missing shared Suno asset references');
for (const route of topicRoutes) if (!landing.includes(`href="${route}"`)) failures.push(`landing navigation is missing ${route}`);

const guideHtml = await fs.readdir(path.join(suno,'guides')).then(files => files.filter(file => file.endsWith('.html')));
if (guideHtml.length !== 16) failures.push(`core guide count is ${guideHtml.length}; expected exactly 16`);
const completeHtml = await fs.readdir(path.join(suno,'complete')).then(files => files.filter(file => file.endsWith('.html')));
if (completeHtml.length !== 8) failures.push(`complete/deep-dive page count is ${completeHtml.length}; expected exactly 8`);

const master = await read(path.join(suno,'complete/complete-guide.html'));
if (!master.includes('class="reader-toc"')) failures.push('complete guide is missing generated table of contents');
if ((master.match(/class="reader-toc-links"/g)||[]).length !== 1) failures.push('complete guide TOC structure is malformed');
if ((master.match(/href="\/suno\/deep-dives\//g)||[]).length < 7) failures.push('complete guide is missing deep-dive navigation links');

const index = JSON.parse(await read(path.join(suno,'search-index.json')));
if (!Array.isArray(index.entries) || index.entries.length !== 24) failures.push(`search index contains ${index.entries?.length ?? 0} entries; expected 24`);
for (const entry of index.entries || []) {
  if (!entry.href || !entry.title || !entry.text || entry.text.length < 500) failures.push(`search index entry is incomplete: ${entry.title || 'untitled'}`);
  if (/github\.com\/LILSYNNOFFICIAL\/LIL-SYNN-s-Complete-Suno-V6-Guide/i.test(entry.text)) failures.push(`search index leaks canonical GitHub URL: ${entry.title}`);
}
const manifest = JSON.parse(await read(path.join(suno,'manifest.json')));
if (manifest.coreTopics !== 16 || manifest.deepDives !== 7 || manifest.completeDocuments !== 8 || manifest.indexedEntries !== 24) failures.push(`manifest counts are inconsistent: ${JSON.stringify(manifest)}`);

const script = await read(path.join(root,'scripts/sync-suno-guide.mjs'));
for (const source of sourceDocs) if (!script.includes(`'${source}'`)) failures.push(`sync script does not enumerate ${source}`);
const indexScript = await read(path.join(root,'scripts/build-suno-index.mjs'));
for (const required of ['search-index.json','manifest.json','complete-guide.html','v6.html','ultimate-control.html']) if (!indexScript.includes(required)) failures.push(`index build script is missing ${required}`);
const runtime = await read(path.join(suno,'js/suno.js'));
for (const required of ['/suno/search-index.json','/suno/manifest.json','GLOBAL GUIDE SEARCH','WHAT’S NEW / LIVE BUILD']) if (!runtime.includes(required)) failures.push(`runtime UX is missing ${required}`);

const vercel = JSON.parse(await read(path.join(root,'vercel.json')));
const rewrites = new Map((vercel.rewrites || []).map(rule => [rule.source, rule.destination]));
for (const [route, target] of requiredRoutes) {
  const expected = `/${target}`;
  if (rewrites.get(route) !== expected) failures.push(`vercel route ${route}: expected ${expected}, got ${rewrites.get(route) ?? 'missing'}`);
}

if (failures.length) {
  console.error(`Suno audit FAILED — ${failures.length} issue(s)`);
  for (const failure of failures) console.error(`  • ${failure}`);
  process.exit(1);
}
console.log(`Suno audit PASS — ${requiredRoutes.size} routes/assets, 16 core topics, 8 full-source pages, 24 indexed search entries, TOC + live-update checks, no canonical GitHub leakage.`);
