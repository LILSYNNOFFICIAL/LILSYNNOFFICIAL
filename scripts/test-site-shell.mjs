import fs from 'node:fs';
import assert from 'node:assert/strict';

const root = new URL('../', import.meta.url);
const read = name => fs.readFileSync(new URL(name, root), 'utf8');

const shell = read('site-shell.js');
const css = read('site-shell.css');
const index = read('index.html');
const enhancements = read('index-enhancements.js');
const releases = read('latest-releases.js');
const vote = read('vote.html');
const adminApi = read('api/admin.js');
const command = read('command/index.html');
const admin = read('command/admin/index.html');
const designer = read('command/designer.html');
const designerJs = read('command/designer.js');
const vercel = read('vercel.json');

const pages = ['archive.html','releases.html','gallery.html','universe.html','release.html','special_access.html','privacy.html','terms.html','coming_soon.html','videos.html'];
const expectedPaths = pages.map(p => `/${p}`);

assert.match(shell, /LS_BG_STARS\.webm/);
assert.match(shell, /ls-bg-layer/);
assert.match(shell, /ls-geometry-layer/);
assert.match(shell, /ls-canonical-topbar/);
assert.match(shell, /ls-mobile-menu/);
assert.match(shell, /ls-more-menu/);
assert.match(shell, /document\.body\.appendChild\(m\)/, 'MORE must be portaled to body');
assert.match(shell, /aria-expanded/);
assert.match(shell, /Escape/);
assert.doesNotMatch(shell, /\/merch\.html/, 'canonical shell must not point to a nonexistent merch page');

const regularMatch = shell.match(/const regular=new Set\(\[([^\]]+)\]\)/);
assert.ok(regularMatch, 'canonical shell must declare its regular-page allowlist');
for (const path of expectedPaths) {
  const escaped = path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  assert.match(regularMatch[1], new RegExp(`['"]${escaped}['"]`), `${path} must be registered with the canonical shell`);
}

assert.match(css, /#ls-bg-layer\{position:fixed/);
assert.match(css, /#ls-more-menu\{position:fixed/);
assert.match(css, /z-index:2147483000/);
assert.match(css, /pointer-events:none/);
assert.match(css, /prefers-reduced-motion/);
assert.match(css, /body\.ls-canonical-page\{[^}]*background:transparent!important/);

assert.match(index, /homepage-final-fix\.js/);
assert.match(index, /LS_BG_STARS\.webm/);
assert.match(index, /id=["']playerDock["']/i);
assert.match(index, /id=["']playerClose["']/i);
assert.match(index, /id=["']spotifyFrame["']/i);
assert.match(index, /open\.spotify\.com\/embed\/artist\/6ozcOAnRAUPn3z5c0GR5kU/i);
assert.match(enhancements, /THE ARTIST/);
assert.match(enhancements, /PERSONA OF THE MUSIC/);
assert.match(enhancements, /TOOLKIT/);
assert.match(enhancements, /VISUAL WORLD/);
assert.match(enhancements, /CREATOR/);
assert.match(enhancements, /VISION/);
assert.match(enhancements, /ls-modal-backdrop/);
assert.match(enhancements, /ls-artist-modal/);
assert.match(enhancements, /role=\"dialog\"/);
assert.match(enhancements, /aria-modal=\"true\"/);
assert.match(enhancements, /document\.body\.appendChild\(back\)/);
assert.match(enhancements, /ls-core-trigger/);

assert.match(releases, /\.slice\(0,8\)/);
assert.match(releases, /new Set/);
assert.match(releases, /repeat\(4/);
assert.match(releases, /repeat\(2/);

for (const page of pages) {
  const html = read(page);
  assert.match(html, /<script[^>]+src=["']\/site-shell\.js/i, `${page} must load the canonical shell`);
  assert.doesNotMatch(html, /<script[^>]+src=["']\/site-global\.js/i, `${page} still references legacy runtime`);
  assert.doesNotMatch(html, /href=["']\/vote#contact/i, `${page} has broken vote contact routing`);
  assert.doesNotMatch(html, /href=["']\/index\.html\/contact/i, `${page} has malformed contact routing`);
}

assert.doesNotMatch(read('404.html'), /\/site-global\.js/i, '404 must not resurrect the legacy runtime');
assert.match(vote, /LS_BG_STARS\.webm|class=["']bg-stars["']/i, 'vote must retain the stars background');
assert.doesNotMatch(vote, /\/site-global\.js/i, 'vote must not reference the legacy runtime');
assert.doesNotMatch(vote, /href=["']\/vote#contact/i, 'vote must not self-route Contact through /vote');
assert.doesNotMatch(vote, /href=["']\/index\.html\/contact/i, 'vote must not use malformed Contact routing');
assert.match(vote, /href=["']\/(?:#contact|index\.html#contact)["']/i, 'vote must provide canonical Contact routing');

assert.match(adminApi, /action==='login'/);
assert.match(adminApi, /action==='session'/);
assert.match(adminApi, /AUTH_REQUIRED/);
assert.match(adminApi, /ADMIN_PASSWORD_HASH/);
assert.match(adminApi, /ADMIN_SESSION_SECRET/);
assert.match(adminApi, /HttpOnly; Secure; SameSite=Strict/);
assert.match(adminApi, /Max-Age=28800/);
assert.match(adminApi, /TOO_MANY_ATTEMPTS/);
assert.doesNotMatch(adminApi, /console\.log\([^)]*(PASSWORD|SECRET|TOKEN|COOKIE)/i);

assert.match(command, /id=["']loginForm["']/);
assert.match(admin, /id=["']loginForm["']/);
assert.match(designer, /id=["']loginForm["']/);
assert.match(designerJs, /\/api\/admin\?action=login/);
assert.match(designerJs, /\/api\/admin\?action=session/);

assert.match(vercel, /\/command\/admin/);
assert.match(vercel, /\/command/);
assert.match(vercel, /\/vote/);
assert.match(vercel, /\/Suno/);
assert.match(vercel, /\/api\/admin/);

const workflowDir = new URL('.github/workflows/', root);
const workflowNames = fs.readdirSync(workflowDir).filter(name => /\.(?:yml|yaml)$/i.test(name));
assert.ok(!workflowNames.includes('fix-homepage.yml'), 'obsolete fix-homepage workflow must remain absent');
assert.ok(!workflowNames.includes('fix-index2-wiring.yml'), 'obsolete index2 mutator must remain absent');
assert.ok(!workflowNames.includes('install-index-under-construction-v2.yml'), 'obsolete homepage mutator must remain absent');
assert.ok(!workflowNames.includes('restore-modern-home.yml'), 'obsolete workflow-run homepage mutator must remain absent');

const rerun = read('.github/workflows/RERUN ALL JOBS.yml');
assert.match(rerun, /workflow_dispatch:/);
assert.doesNotMatch(rerun, /^\s+push:/m, 'RERUN ALL JOBS must be manual-only');
assert.match(rerun, /actions:\s*write/);
assert.match(rerun, /contents:\s*read/);

const intentionalMutators = new Set([
  'admin-git.yml',
  'github-pages-preview.yml',
  'sync-suno-guide.yml',
  'update-latest-videos.yml',
  'optimize-index2-webm.yml'
]);
for (const name of workflowNames) {
  const text = fs.readFileSync(new URL(name, workflowDir), 'utf8');
  const writesMain = /git\s+push(?:\s+origin)?\s+(?:HEAD:)?main|git\s+push\s*$/m.test(text);
  const grantsWrite = /contents:\s*write/.test(text);
  if (writesMain && grantsWrite) assert.ok(intentionalMutators.has(name), `${name} is an unclassified main-mutating workflow`);
}

const catalog = JSON.parse(read('release-catalog.json'));
const unique = [...new Set(catalog.order || [])];
assert.equal(unique.length, (catalog.order || []).length, 'release catalog contains duplicates');
assert.equal(unique.slice(0,8).length, Math.min(8, unique.length));

console.log('site-shell architecture + auth + workflow audit: PASS');
