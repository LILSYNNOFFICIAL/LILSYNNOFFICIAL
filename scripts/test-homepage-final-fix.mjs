import fs from 'node:fs';
import assert from 'node:assert/strict';

const source = fs.readFileSync(new URL('../homepage-final-fix.js', import.meta.url), 'utf8');

assert.match(source, /HERO_BG_WEBM\.webm/, 'homepage fix must explicitly bind the hero WebM asset');
assert.match(source, /LS_BG_STARS\.webm/, 'homepage fix must explicitly bind the stars WebM asset');
assert.match(source, /\.play\(\)/, 'homepage fix must explicitly attempt WebM playback');
assert.match(source, /signal-geometry-layer/, 'homepage fix must install the sacred-geometry layer');
assert.match(source, /prefers-reduced-motion/, 'geometry layer must respect reduced-motion preferences');
assert.match(source, /pointer-events:none/, 'geometry layer must never block page interaction');

console.log('homepage-final-fix assertions: PASS');
