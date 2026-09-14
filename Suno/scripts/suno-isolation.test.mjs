import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const sunoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const repoRoot = path.resolve(sunoRoot, '..');
const failures = [];

const rootSunoScripts = [
  'sync-suno-guide.mjs',
  'build-suno-topics.mjs',
  'build-suno-index.mjs',
  'upgrade-suno-shell.mjs',
  'upgrade-suno-tools.mjs',
  'inject-suno-forum.mjs',
  'audit-suno-forum.mjs',
  'audit-suno-drafts.mjs',
  'audit-suno-runtime.mjs',
  'audit-suno-tools.mjs',
  'audit-suno-behavior.mjs',
  'audit-suno-accessibility.mjs',
  'audit-suno-site.mjs'
];

for (const name of rootSunoScripts) {
  if (fs.existsSync(path.join(repoRoot, 'scripts', name))) failures.push(`root Suno script still exists: scripts/${name}`);
}

if (fs.existsSync(path.join(repoRoot, 'package.json'))) {
  failures.push('root package.json still exists; Suno build metadata must be owned by /Suno');
}

const vercel = path.join(repoRoot, 'vercel.json');
if (fs.existsSync(vercel) && /\/suno|Suno\//i.test(fs.readFileSync(vercel, 'utf8'))) {
  failures.push('root vercel.json still contains Suno routing/configuration');
}

const workflow = path.join(repoRoot, '.github', 'workflows', 'suno-platform.yml');
if (fs.existsSync(workflow)) failures.push('root Suno GitHub workflow still exists');

const mainDoctor = fs.readFileSync(path.join(repoRoot, 'tools', 'site-doctor.mjs'), 'utf8');
if (!mainDoctor.includes('Suno Site Doctor')) failures.push('main Site Doctor has no non-blocking Suno health warning');
if (!mainDoctor.includes('Suno/scripts/suno-site-doctor.mjs')) failures.push('main Site Doctor does not target the isolated Suno doctor');
if (!mainDoctor.includes('warnings')) failures.push('main Site Doctor warning channel missing');
if (!mainDoctor.includes("entry.name === 'Suno'")) failures.push('main Site Doctor does not exclude /Suno from blocking JS scans');

const sunoDoctor = fs.readFileSync(path.join(sunoRoot, 'scripts', 'suno-site-doctor.mjs'), 'utf8');
if (!sunoDoctor.includes("path.dirname(fileURLToPath(import.meta.url))")) failures.push('Suno doctor is not anchored to its own /Suno location');
if (sunoDoctor.includes('process.cwd()')) failures.push('Suno doctor still depends on process.cwd()');

if (failures.length) {
  console.error(`Suno isolation contract FAILED — ${failures.length} issue(s)`);
  failures.forEach(f => console.error(`  • ${f}`));
  process.exit(1);
}

console.log('Suno isolation contract PASS — Suno tooling is isolated and main-site integration is warning-only.');
