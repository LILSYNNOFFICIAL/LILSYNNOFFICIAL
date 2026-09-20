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

// Canonical shell contract.
assert.match(shell, /LS_BG_STARS\.webm/);
assert.match(shell, /ls-bg-layer/);
assert.match(shell, /ls-geometry-layer/);
assert.match(shell, /ls-canonical-topbar/);
assert.match(shell, /ls-mobile-menu/);
assert.match(read('template.html'), /id=["']ls-menu-more["']/);
assert.match(shell, /document\.body\.replaceChildren\(\.\.\.visuals,h,m,content,f\)/, 'canonical shell must mount header, menu, content, and footer together');
assert.match(shell, /aria-expanded/);
assert.match(shell, /Escape/);
assert.doesNotMatch(shell, /\/merch\.html/);

const regularMatch = shell.match(/const regular=new Set\(\[([^\]]+)\]\)/);
assert.ok(regularMatch, 'canonical shell must declare its regular-page allowlist');
for (const page of pages) assert.match(regularMatch[1], new RegExp(`['"]/${page.replace('.', '\\.')}['"]`), `${page} missing from canonical shell`);

assert.match(css, /#ls-bg-layer\{position:fixed/);
assert.match(css, /#ls-more-menu\{position:fixed/);
assert.match(css, /z-index:2147483000/);
assert.match(css, /prefers-reduced-motion/);
assert.match(css, /body\.ls-canonical-page\{[^}]*background:transparent!important/);

// Homepage / artist UI contract.
assert.match(index, /homepage-final-fix\.js/);
assert.match(index, /LS_BG_STARS\.webm/);
assert.match(index, /id=["']playerDock["']/i);
assert.match(index, /id=["']playerClose["']/i);
assert.match(index, /id=["']spotifyFrame["']/i);
assert.match(index, /open\.spotify\.com\/embed\/artist\/6ozcOAnRAUPn3z5c0GR5kU/i);
for (const section of ['THE ARTIST','PERSONA OF THE MUSIC','TOOLKIT','VISUAL WORLD','CREATOR','VISION']) assert.match(enhancements, new RegExp(section));
assert.match(enhancements, /ls-modal-backdrop/);
assert.match(enhancements, /ls-artist-modal/);
assert.match(enhancements, /role=\"dialog\"/);
assert.match(enhancements, /aria-modal=\"true\"/);
assert.match(enhancements, /document\.body\.appendChild\(back\)/);

assert.match(releases, /\.slice\(0,8\)/);
assert.match(releases, /new Set/);
assert.match(releases, /repeat\(4/);
assert.match(releases, /repeat\(2/);

// Every regular page inherits the same shell and does not resurrect the legacy runtime.
for (const page of pages) {
  const html = read(page);
  assert.match(html, /<script[^>]+src=["']\/site-shell\.js/i, `${page} must load the canonical shell`);
  assert.doesNotMatch(html, /<script[^>]+src=["']\/site-global\.js/i, `${page} still references legacy runtime`);
  assert.doesNotMatch(html, /href=["']\/index\.html\/contact/i, `${page} has malformed contact routing`);
}
assert.doesNotMatch(read('404.html'), /\/site-global\.js/i);

// Vote has its own surface but must retain the canonical background and a real Contact target.
assert.match(vote, /LS_BG_STARS\.webm|class=["']bg-stars["']/i);
assert.doesNotMatch(vote, /\/site-global\.js/i);
assert.doesNotMatch(vote, /href=["']\/index\.html\/contact/i);
assert.match(vote, /id=["']contact["']/i);

// Admin/auth route contract.
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

// Vercel route contract.
for (const route of ['/command','/command/admin','/vote','/Suno','/api/admin']) assert.match(vercel, new RegExp(route.replace('/', '\\/')));

// Workflow safety contract: old auto-mutators must stay gone and RERUN ALL JOBS is manual-only.
const workflowDir = new URL('.github/workflows/', root);
const workflowNames = fs.readdirSync(workflowDir).filter(name => /\.(?:yml|yaml)$/i.test(name));
for (const obsolete of ['fix-homepage.yml','fix-index2-wiring.yml','install-index-under-construction-v2.yml','restore-modern-home.yml']) assert.ok(!workflowNames.includes(obsolete), `${obsolete} must remain absent`);
const rerun = read('.github/workflows/RERUN ALL JOBS.yml');
assert.match(rerun, /workflow_dispatch:/);
assert.doesNotMatch(rerun, /^\s+push:/m, 'RERUN ALL JOBS must be manual-only');
assert.match(rerun, /actions:\s*write/);
assert.match(rerun, /contents:\s*read/);

const intentionalMutators = new Set(['admin-git.yml','github-pages-preview.yml','sync-suno-guide.yml','update-latest-videos.yml','optimize-index2-webm.yml']);
for (const name of workflowNames) {
  const text = fs.readFileSync(new URL(name, workflowDir), 'utf8');
  const writesMain = /git\s+push(?:\s+origin)?\s+(?:HEAD:)?main|git\s+push\s*$/m.test(text);
  const grantsWrite = /contents:\s*write/.test(text);
  if (writesMain && grantsWrite) assert.ok(intentionalMutators.has(name), `${name} is an unclassified main-mutating workflow`);
}

const catalog = JSON.parse(read('release-catalog.json'));
assert.equal(new Set(catalog.order || []).size, (catalog.order || []).length, 'release catalog contains duplicates');

console.log('site-shell architecture + auth + workflow audit: PASS');
