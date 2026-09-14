import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const suno = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const repo = path.resolve(suno, '..');
const exists = rel => fs.existsSync(path.join(repo, rel));
const sunoExists = rel => fs.existsSync(path.join(suno, rel));
const read = rel => fs.readFileSync(path.join(repo, rel), 'utf8');

for (const forbidden of [
  'package.json',
  'scripts/audit-suno-site.mjs',
  'scripts/build-suno-topics.mjs',
  '.github/workflows/suno-platform.yml'
]) {
  assert.equal(exists(forbidden), false, `main site must not own Suno infrastructure: ${forbidden}`);
}

assert.equal(sunoExists('package.json'), true, 'Suno package must remain isolated under /Suno');
assert.equal(sunoExists('scripts/suno-site-doctor.mjs'), true, 'Suno doctor must remain under /Suno');
assert.equal(sunoExists('scripts/suno-site-doctor.test.mjs'), true, 'Suno doctor contract test must remain under /Suno');
assert.equal(sunoExists('scripts/suno-site-doctor.mjs'), true, 'Suno doctor must remain isolated');
assert.equal(sunoExists('search-index.json'), true, 'Suno search index must remain isolated');
assert.equal(sunoExists('manifest.json'), true, 'Suno manifest must remain isolated');
assert.equal(sunoExists('complete/complete-guide.html'), true, 'Suno complete guide must remain isolated');

const mainDoctor = read('tools/site-doctor.mjs');
assert.match(mainDoctor, /Suno Site Doctor/);
assert.match(mainDoctor, /warning-only and does not block the main site/);

const sunoDoctor = fs.readFileSync(path.join(suno, 'scripts/suno-site-doctor.mjs'), 'utf8');
assert.match(sunoDoctor, /fileURLToPath\(import\.meta\.url\)/);
assert.doesNotMatch(sunoDoctor, /\bconst\s+root\s*=\s*process\.cwd\(\)/);
assert.doesNotMatch(sunoDoctor, /path\.join\(root\s*,\s*["']Suno["']\)/);

const packageJson = JSON.parse(fs.readFileSync(path.join(suno, 'package.json'), 'utf8'));
assert.equal(packageJson.scripts.doctor, 'node scripts/suno-site-doctor.mjs');
assert.equal(packageJson.scripts.test, 'node scripts/suno-isolation.test.mjs && node scripts/suno-site-doctor.test.mjs');

console.log('Suno isolation contract PASS.');
