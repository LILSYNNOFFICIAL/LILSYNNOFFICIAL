import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SUNO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const REQUIRED = [
  'Suno_Guide.html', 'README.md', 'package.json', 'command-center.html',
  'guides/v6.html', 'guides/prompting.html', 'guides/lyrics.html', 'guides/styles.html',
  'guides/sliders.html', 'guides/voices.html', 'guides/editing.html', 'guides/audio.html',
  'guides/stems.html', 'guides/studio.html', 'guides/midi.html', 'guides/effects.html',
  'guides/automation.html', 'guides/production.html', 'guides/troubleshooting.html', 'guides/rights.html',
  'deep-dives/ultimate-control.html', 'deep-dives/everything-expansion.html',
  'deep-dives/final-current-expansion.html', 'deep-dives/coverage-audit.html',
  'deep-dives/gaps-closure.html', 'deep-dives/gap-closure-all-remaining.html',
  'deep-dives/additional-current-details.html',
  'complete/complete-guide.html',
  'prompt-architect.html', 'style-builder.html', 'lyrics-builder.html', 'controls.html', 'troubleshooter.html', 'workflow.html',
  'js/suno.js', 'js/suno-tools.js', 'js/suno-forum.js', 'js/suno-drafts.js',
  'css/suno.css', 'css/command-center.css', 'css/tools.css', 'search-index.json', 'manifest.json'
];

const TOOLS = ['prompt-architect.html', 'style-builder.html', 'lyrics-builder.html', 'controls.html', 'troubleshooter.html', 'workflow.html'];
const failures = [];
const exists = async p => { try { await fs.access(p); return true; } catch { return false; } };
const read = rel => fs.readFile(path.join(SUNO, rel), 'utf8');

async function walk(dir) {
  const out = [];
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...await walk(full));
    else out.push(full);
  }
  return out;
}

function plain(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

for (const rel of REQUIRED) {
  if (!(await exists(path.join(SUNO, rel)))) failures.push(`missing /Suno/${rel}`);
}

const files = await walk(SUNO);
const htmlFiles = files.filter(file => file.endsWith('.html'));

for (const file of htmlFiles) {
  const html = await fs.readFile(file, 'utf8');
  const rel = path.relative(SUNO, file);

  const canonicalRefs = [...html.matchAll(/(?:href|src)=["']([^"']+)["']/gi)]
    .map(match => match[1])
    .filter(ref => /github\.com\/LILSYNNOFFICIAL\/LIL-SYNN-s-Complete-Suno-V6-Guide/i.test(ref) || /raw\.githubusercontent\.com\/LILSYNNOFFICIAL\/LIL-SYNN-s-Complete-Suno-V6-Guide/i.test(ref));
  if (canonicalRefs.length && !/<aside[^>]+class=["'][^"']*source-note[^"']*["'][\s\S]*canonical/i.test(html)) {
    failures.push(`${rel}: canonical source URL must remain attribution-only, not navigation/resource plumbing`);
  }
  if (/(?:href|src)=["'][^"']+\.md(?:[#"']|$)/i.test(html)) failures.push(`${rel}: Markdown navigation reference remains`);
  if (plain(html).length < 300) failures.push(`${rel}: suspiciously little rendered content`);

  for (const match of html.matchAll(/(?:href|src)=["']([^"']+)["']/gi)) {
    const ref = match[1].split('#')[0].split('?')[0];
    if (!ref || /^(https?:|mailto:|tel:|javascript:|data:|#)/i.test(ref) || ref.startsWith('/')) continue;
    if (ref === '../assets/img/Image 1 - Homepage hero identity artwork.png') continue;
    const target = path.resolve(path.dirname(file), ref);
    if (!target.startsWith(SUNO + path.sep)) failures.push(`${rel}: reference escapes /Suno -> ${ref}`);
    else if (!(await exists(target))) failures.push(`${rel}: broken local reference -> ${ref}`);
  }
}

for (const tool of TOOLS) {
  const html = await read(tool);
  for (const marker of ['suno-tools.js', 'suno-drafts.js', 'tools.css', 'id="copy-output"', 'id="reset-tool"']) {
    if (!html.includes(marker)) failures.push(`${tool}: missing ${marker}`);
  }
}

const landing = await read('Suno_Guide.html');
for (const marker of ['id="library"', 'css/suno.css', 'js/suno.js']) {
  if (!landing.includes(marker)) failures.push(`landing: missing ${marker}`);
}

const audio = await read('guides/audio.html');
for (const marker of ['V6 AUDIO QUALITY ISSUES', 'Mini V6', 'Weirdness: 0%', 'Style & Audio Influence: 86%', 'WHOLE TRACK', 'recreate the original audio exactly as sung and performed']) {
  if (!audio.includes(marker)) failures.push(`audio guide: missing ${marker}`);
}

const drafts = await read('js/suno-drafts.js');
for (const marker of ['localStorage', 'lilsynn-suno-draft', 'restore', 'save']) {
  if (!drafts.includes(marker)) failures.push(`draft runtime: missing ${marker}`);
}

const forum = await read('js/suno-forum.js');
for (const marker of ["link.target='_blank'", "link.rel='noopener noreferrer'"]) {
  if (!forum.includes(marker)) failures.push(`forum runtime: missing ${marker}`);
}

try {
  const index = JSON.parse(await read('search-index.json'));
  if (!Array.isArray(index.entries) || index.entries.length < 25) failures.push('search index: incomplete entry set');
  const bad = (index.entries || []).filter(entry => !entry.title || !entry.href || !/^\/Suno\//.test(entry.href));
  if (bad.length) failures.push(`search index: ${bad.length} invalid route(s)`);
} catch {
  failures.push('search index: invalid JSON');
}

try {
  const manifest = JSON.parse(await read('manifest.json'));
  for (const key of ['name', 'short_name', 'start_url', 'coreTopics', 'deepDives', 'completeDocuments', 'toolCount', 'syncDate']) {
    if (!(key in manifest)) failures.push(`manifest: missing ${key}`);
  }
  if (manifest.start_url !== '/Suno/Suno_Guide.html') failures.push('manifest: start_url is not isolated to /Suno');
} catch {
  failures.push('manifest: invalid JSON');
}

for (const file of files.filter(file => file.endsWith('.mjs') && !file.endsWith('.test.mjs') && path.basename(file) !== 'suno-site-doctor.mjs')) {
  const text = await fs.readFile(file, 'utf8');
  const rel = path.relative(SUNO, file);
  if (/\bconst\s+root\s*=\s*process\.cwd\(\)/.test(text) || /path\.join\(root\s*,\s*["']Suno["']\)/.test(text)) {
    failures.push(`${rel}: depends on main/root working-directory paths`);
  }
}

if (failures.length) {
  console.error(`Suno Site Doctor FAILED — ${failures.length} issue(s)`);
  for (const failure of failures) console.error(`  • ${failure}`);
  process.exit(1);
}

console.log(`Suno Site Doctor PASS — isolated /Suno validation succeeded (${htmlFiles.length} HTML files).`);
