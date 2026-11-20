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
assert.match(source, /utilityDropdown|dropdown-menu/, 'homepage fix must harden dropdown stacking');
assert.match(source, /\.nav-stack \.menu-row\{overflow:visible!important/, 'More dropdown row must not clip its popup');
assert.match(source, /\.nav-stack \.dropdown-menu\{[^}]*z-index:2147483\d{3}/s, 'More dropdown must be above page content');
assert.match(source, /n6.*command|href.*\/command/, 'homepage fix must explicitly remove the private Command Center node');
assert.match(source, /orbit-stage/, 'homepage fix must tune the artist/orbit layout responsively');

console.log('homepage-final-fix assertions: PASS');
