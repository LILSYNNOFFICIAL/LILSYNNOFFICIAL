import assert from 'node:assert/strict';
import fs from 'node:fs';

const index = fs.readFileSync('index.html', 'utf8');
const index2 = fs.readFileSync('index2.html', 'utf8');
const doctor = fs.readFileSync('tools/site-doctor.mjs', 'utf8');
const vercel = fs.readFileSync('vercel.json', 'utf8');

assert.match(index, /LIL SYNN — THE SIGNAL/);
assert.match(index, /homepage-final-fix\.js/);
assert.match(index2, /<script\s+src=["']\/?site-global2\.js(?:\?[^"']*)?["']/i);
assert.doesNotMatch(index2, /<script\s+src=["']\/?site-global\.js(?:\?[^"']*)?["']/i);
assert.match(doctor, /standaloneHome/);
assert.match(doctor, /index2\.html/);
assert.match(doctor, /site-global2\.js/);
assert.match(vercel, /"\/admin"/);
assert.match(vercel, /"\/site-doctor"/);

console.log('Site Doctor route/shell regression contract: PASS');
