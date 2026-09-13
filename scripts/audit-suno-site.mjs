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
const failures = [];
const exists = async p => { try { await fs.access(p); return true; } catch { return false; } };

for (const [route, target] of requiredRoutes) {
  if (!(await exists(path.join(root, target)))) failures.push(`${route}: missing ${target}`);
}
for (const file of ['Suno_Guide.html', 'js/suno.js', 'css/suno.css', 'complete/complete-guide.html']) {
  if (!(await exists(path.join(suno, file)))) failures.push(`missing Suno/${file}`);
}

const routeTargets = [...requiredRoutes.values()];
const htmlFiles = routeTargets.filter(relative => relative.endsWith('.html'));
for (const relative of htmlFiles) {
  const html = await fs.readFile(path.join(root, relative), 'utf8');
  if (/github\.com\/LILSYNNOFFICIAL\/LIL-SYNN-s-Complete-Suno-V6-Guide/i.test(html) || /raw\.githubusercontent\.com\/LILSYNNOFFICIAL\/LIL-SYNN-s-Complete-Suno-V6-Guide/i.test(html)) {
    failures.push(`${relative}: canonical GitHub guide URL leaked into generated HTML`);
  }
  if (/href=["'](?:\.\/|\.\.\/)?[^"']+\.md(?:[#"']|$)/i.test(html)) failures.push(`${relative}: Markdown navigation link remains in HTML`);
}

const landing = await fs.readFile(path.join(suno, 'Suno_Guide.html'), 'utf8');
if (!landing.includes('id="suno-source-status"')) failures.push('landing page is missing live source status marker');
if (!landing.includes('/suno/complete') || !landing.includes('/suno/v6')) failures.push('landing page is missing primary internal calls-to-action');
if (!landing.includes('css/suno.css') || !landing.includes('js/suno.js')) failures.push('landing page is missing shared Suno asset references');

const guideHtml = await fs.readdir(path.join(suno, 'guides')).then(files => files.filter(file => file.endsWith('.html')));
if (guideHtml.length < 16) failures.push(`core guide count is ${guideHtml.length}; expected at least 16`);
const completeHtml = await fs.readdir(path.join(suno, 'complete')).then(files => files.filter(file => file.endsWith('.html')));
if (completeHtml.length < 8) failures.push(`complete/deep-dive page count is ${completeHtml.length}; expected at least 8`);

const script = await fs.readFile(path.join(root, 'scripts/sync-suno-guide.mjs'), 'utf8');
for (const source of sourceDocs) {
  if (!script.includes(`'${source}'`)) failures.push(`sync script does not enumerate ${source}`);
}

const vercel = JSON.parse((await fs.readFile(path.join(root, 'vercel.json'), 'utf8')));
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

console.log(`Suno audit PASS — ${requiredRoutes.size} routes/assets, ${guideHtml.length} core topic pages, ${completeHtml.length} full-source pages, no canonical GitHub leakage.`);
