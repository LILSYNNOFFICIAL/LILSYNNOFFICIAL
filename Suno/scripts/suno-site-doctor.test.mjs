import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const here = path.dirname(fileURLToPath(import.meta.url));
const doctor = path.join(here, 'suno-site-doctor.mjs');
const source = fs.readFileSync(doctor, 'utf8');

assert.equal(/\bconst\s+root\s*=\s*process\.cwd\(\)/.test(source), false, 'Suno doctor must not use a root cwd binding');
assert.equal(/path\.join\(root\s*,\s*["']Suno["']\)/.test(source), false, 'Suno doctor must not resolve Suno from a root binding');
assert.match(source, /fileURLToPath\(import\.meta\.url\)/, 'Suno doctor must resolve itself from import.meta.url');

const result = spawnSync(process.execPath, [doctor], {
  cwd: path.resolve(here, '../..'),
  encoding: 'utf8'
});

assert.equal(result.status, 0, `Suno doctor failed:\n${result.stdout}\n${result.stderr}`);
assert.match(result.stdout, /Suno Site Doctor PASS/);

console.log('Suno doctor contract PASS — location independence and isolated validation are intact.');
