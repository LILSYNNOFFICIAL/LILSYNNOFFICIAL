import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(new URL('.', import.meta.url).pathname, '..');
const admin = path.join(root, 'admin');

assert.equal(fs.existsSync(path.join(admin, 'index.html')), true, 'Command Center index must exist');
assert.equal(fs.existsSync(path.join(admin, 'admin.css')), true, 'Command Center CSS must exist');
assert.equal(fs.existsSync(path.join(admin, 'admin.js')), true, 'Command Center JS must exist');

const html = fs.readFileSync(path.join(admin, 'index.html'), 'utf8');
const js = fs.readFileSync(path.join(admin, 'admin.js'), 'utf8');

assert.match(html, /<main\b/i, 'Command Center must expose a main landmark');
assert.match(html, /LIL SYNN.*COMMAND CENTER/i, 'Command Center branding must be present');
assert.match(html, /\/site-health\.html/i, 'Main Site Health link must be present');
assert.match(html, /\/Suno\/health\.html/i, 'Suno Health link must be present');
assert.match(js, /UNKNOWN/, 'Unavailable signals must be represented as UNKNOWN');
assert.doesNotMatch(js, /(?:password|secret|api[_-]?key|authorization\s*[:=])/i, 'Frontend must not contain credential literals');
assert.doesNotMatch(js, /(?:DELETE|POST|PUT|PATCH)\s*['"`]https?:\/\//i, 'Frontend must not contain destructive GitHub writes');

console.log('Command Center regression harness: PASS');
