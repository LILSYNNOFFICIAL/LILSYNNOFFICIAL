import assert from 'node:assert/strict';
import fs from 'node:fs';

const index2 = fs.readFileSync('index2.html', 'utf8');
const doctor = fs.readFileSync('tools/site-doctor.mjs', 'utf8');

assert.match(index2, /<script\s+src=["']\/?site-global2\.js(?:\?[^"']*)?["']/i);
assert.doesNotMatch(index2, /<script\s+src=["']\/?site-global\.js(?:\?[^"']*)?["']/i);
assert.match(doctor, /index2\.html/);
assert.match(doctor, /site-global2\.js/);

console.log('Site Doctor alternate-shell regression contract: PASS');
