import fs from 'node:fs';
import assert from 'node:assert/strict';

const source = fs.readFileSync(new URL('../homepage-final-fix.js', import.meta.url), 'utf8');

assert.doesNotMatch(source, /site-stars-bg/, 'homepage fix must not install a second stars video; the template #ls-bg-layer is the single background');
assert.match(source, /closest\('#ls-bg-layer'\)/, 'homepage fix keeps only the template background video');
assert.match(source, /position:fixed/, 'geometry layer must be fixed to the viewport');
assert.doesNotMatch(source, /\.hero-webm.*HERO_BG_WEBM\.webm/s, 'homepage fix must not bind the legacy hero WebM');
assert.match(source, /signal-geometry-layer/, 'homepage fix must install the sacred-geometry layer');
assert.match(source, /prefers-reduced-motion/, 'geometry layer must respect reduced-motion preferences');
assert.match(source, /pointer-events:none/, 'geometry/background layers must never block page interaction');
assert.doesNotMatch(source, /utilityDropdown|nav-stack|menuPanel|\.orbit-stage \.node/, 'legacy menu, dropdown portal and orbit-node code stay removed');
assert.doesNotMatch(source, /21474836\d\d/, 'no 2^31 z-index values');
assert.doesNotMatch(source, /OFFICIAL TRANSMISSION/, 'the transmission number lives in index.html, not in a MutationObserver');
assert.match(source, /orbit-stage/, 'homepage fix must tune the artist/orbit layout responsively');

console.log('homepage-final-fix assertions: PASS');
