import fs from 'node:fs';
import assert from 'node:assert/strict';

const root = new URL('../', import.meta.url);
const read = name => fs.readFileSync(new URL(name, root), 'utf8');
const shell = read('site-shell.js');
const css = read('site-shell.css');
const index = read('index.html');
const enhancements = read('index-enhancements.js');
const releases = read('latest-releases.js');
const workflow = read('.github/workflows/fix-homepage.yml');

assert.match(shell, /LS_BG_STARS\.webm/);
assert.match(shell, /ls-bg-layer/);
assert.match(shell, /ls-geometry-layer/);
assert.match(shell, /ls-canonical-topbar/);
assert.match(shell, /ls-mobile-menu/);
assert.match(shell, /ls-more-menu/);
assert.match(shell, /document\.body\.appendChild\(moreMenu\)/, 'MORE must be portaled to body');
assert.match(shell, /aria-expanded/);
assert.match(shell, /Escape/);
assert.match(shell, /\/\#contact/);
assert.doesNotMatch(shell, /\/merch\.html/, 'canonical shell must not point to a nonexistent merch page');

assert.match(css, /#ls-bg-layer\{position:fixed/);
assert.match(css, /#ls-more-menu\{position:fixed/);
assert.match(css, /z-index:2147483000/);
assert.match(css, /pointer-events:none/);
assert.match(css, /prefers-reduced-motion/);
assert.match(css, /body\.ls-canonical-page\{[^}]*background:transparent!important/);

assert.match(index, /homepage-final-fix\.js/);
assert.match(index, /LS_BG_STARS\.webm/);
assert.match(enhancements, /signal-form/);
assert.match(enhancements, /THE ARTIST/);
assert.match(enhancements, /PERSONA OF THE MUSIC/);
assert.match(enhancements, /TOOLKIT/);
assert.match(enhancements, /VISUAL WORLD/);
assert.match(enhancements, /CREATOR/);
assert.match(enhancements, /VISION/);
assert.match(enhancements, /document\.body\.appendChild\(p\)/, 'index MORE must use a body-level portal');
assert.match(enhancements, /ls-core-trigger/);
assert.match(enhancements, /playerDock/);

assert.match(releases, /\.slice\(0,8\)/);
assert.match(releases, /new Set/);
assert.match(releases, /repeat\(4/);
assert.match(releases, /repeat\(2/);

assert.doesNotMatch(workflow, /site-global\.js[^\n]*inject|inject[^\n]*site-global\.js/i, 'workflow must never inject the legacy shell');
assert.match(workflow, /site-shell\.js/);
assert.match(workflow, /site-shell\.css/);
assert.match(workflow, /index-enhancements\.js/);

const pages = ['archive.html','releases.html','gallery.html','universe.html','release.html','special_access.html','privacy.html','terms.html','coming_soon.html'];
for (const page of pages) {
  const html = read(page);
  assert.doesNotMatch(html, /<script[^>]+src=["']\/site-global\.js/i, `${page} still references legacy runtime`);
  assert.doesNotMatch(html, /href=["']\/vote#contact/i, `${page} has broken vote contact routing`);
  assert.doesNotMatch(html, /href=["']\/index\.html\/contact/i, `${page} has malformed contact routing`);
}

const catalog = JSON.parse(read('release-catalog.json'));
const unique = [...new Set(catalog.order || [])];
assert.equal(unique.length, (catalog.order || []).length, 'release catalog contains duplicates');
assert.equal(unique.slice(0,8).length, Math.min(8, unique.length));

console.log('site-shell architecture assertions: PASS');
