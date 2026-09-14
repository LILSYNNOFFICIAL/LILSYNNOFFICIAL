import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const scriptsDir = path.dirname(fileURLToPath(import.meta.url));
const doctor = path.join(scriptsDir, 'suno-site-doctor.mjs');
const source = await fs.readFile(doctor, 'utf8');
assert.equal(source.includes('process.cwd()'), false, 'Site Doctor must not depend on the main repository working directory');
assert.equal(source.includes("path.join(root,'Suno')"), false, 'Site Doctor must not resolve Suno through a root-level path');

const result = await new Promise((resolve) => {
  const child = spawn(process.execPath, [doctor], { cwd: path.resolve(scriptsDir, '../..') });
  let stdout = '';
  let stderr = '';
  child.stdout.on('data', chunk => { stdout += chunk; });
  child.stderr.on('data', chunk => { stderr += chunk; });
  child.on('close', code => resolve({ code, stdout, stderr }));
});

assert.equal(result.code, 0, result.stderr || result.stdout);
assert.match(result.stdout, /Suno Site Doctor PASS/);
console.log('Suno Site Doctor isolation test PASS');
