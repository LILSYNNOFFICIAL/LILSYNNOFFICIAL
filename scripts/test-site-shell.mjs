import fs from 'node:fs';
import assert from 'node:assert/strict';

const root = new URL('../', import.meta.url);
const read = name => fs.readFileSync(new URL(name, root), 'utf8');

const shell = read('site-shell.js');
const css = read('site-shell.css');
const index = read('index.html');
const enhancements = read('index-enhancements.js');
const releases = read('latest-releases.js');
const adminApi = read('api/admin.js');
const command = read('command/index.html');
const admin = read('command/admin/index.html');
const designer = read('command/designer.html');
const designerJs = read('command/designer.js');
const vercel = read('vercel.json');

const pages = ['releases.html','gallery.html','universe.html','release.html','special_access.html','privacy.html','terms.html','coming_soon.html','videos.html'];

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

const excludedMatch = shell.match(/const excluded=new Set\(\[([^\]]+)\]\)/);
assert.ok(excludedMatch, 'canonical shell must declare its excluded-route set');
for (const route of ['/suno','/backup','/template','/template_bu']) {
  assert.ok(excludedMatch[1].includes(`'${route}'`), `${route} missing from shell exclusions`);
}

assert.match(css, /#ls-bg-layer\{position:fixed/);
const template = read('template.html');
// Layering uses the z-scale tokens declared once in the template head; no 2^31 escalation anywhere in the shell.
assert.match(template, /--z-bg:0;--z-decor:1;--z-content:2;--z-footer:3;/, 'template head declares the z-scale');
assert.match(template, /--z-header:1000;--z-drawer-scrim:1090;--z-drawer:1100;/, 'drawer sits above the scrim, the scrim above the header');
for (const [name, text] of [['site-shell.css', css], ['site-shell.js', shell], ['template.html', template], ['index.html', index]]) {
  assert.doesNotMatch(text, /z-index:\s*21474836\d\d/, `${name} must use the z-scale tokens, not 2^31 values`);
}
assert.match(shell, /'z-index':'var\(--z-drawer,1100\)'/, 'open drawer uses the drawer token');
assert.match(shell, /ls-menu-scrim/, 'drawer has a click-to-close scrim');
assert.doesNotMatch(css, /#ls-more-menu|\.ls-mobile-|\.ls-orb-galaxy/, 'dead menu/orb systems stay out of site-shell.css');
assert.doesNotMatch(template, /\\n\.ls-siqa-badge/, 'no literal \\n inside template CSS');
assert.doesNotMatch(template.slice(template.indexOf('</footer>')), /<style|<script/, 'template body tail carries no styles or scripts (they never reach pages)');
assert.match(css, /prefers-reduced-motion/);
assert.match(css, /body\.ls-canonical-page\{background:#020204!important/);
// site-shell.css is loaded once, by the shell, under the same version key as the template.
assert.match(shell, /const SHELL_VERSION='[^']+'/);
assert.match(shell, /TEMPLATE_URL=ROOT\('\/template\.html'\)\+'\?template='\+SHELL_VERSION/);
assert.match(shell, /SHELL_CSS_URL=ROOT\('\/site-shell\.css'\)\+'\?v='\+SHELL_VERSION/);
assert.doesNotMatch(shell, /cache:'no-store'/, 'template fetch uses the HTTP cache plus the version key');

// Homepage / artist UI contract.
assert.match(index, /<script src="\.\/homepage-final-fix\.js[^"]*" defer><\/script>/, 'homepage-final-fix.js is deferred');
assert.doesNotMatch(index, /site-shell\.css/, 'homepage does not load its own copy of site-shell.css');
assert.match(index, /OFFICIAL TRANSMISSION \/ 369/, 'transmission number lives in the HTML');
assert.doesNotMatch(index, /id=["']ls-template-menu["']/, 'homepage must not ship its own copy of the canonical menu');
assert.doesNotMatch(index, /data-ls-global-(?:header|footer)/, 'homepage must not ship its own copy of the canonical header/footer');
assert.match(shell, /document\.createElement\(document\.querySelector\('main'\)\?'div':'main'\)/, 'shell must not nest a second <main> around a page that already has one');
assert.doesNotMatch(index, /<video\b/, 'homepage must not ship its own background video; the template #ls-bg-layer owns it (asserted above)');
assert.doesNotMatch(read('404.html'), /<video\b/, '404 must not ship a second background video');
assert.doesNotMatch(read('homepage-final-fix.js'), /site-stars-bg/, 'homepage-final-fix.js must not create a second stars video');
assert.doesNotMatch(shell, /'z-index':'2147483641'|#ls-template-menu\{position:fixed!important;z-index:2147483641/, 'menu must not sit below the header (2147483641 < 2147483647)');
assert.doesNotMatch(index, /id=["']playerDock["']|utilityDropdown/i, 'dead homepage player dock / utility dropdown stay removed');
assert.match(index, /open\.spotify\.com\/artist\/6ozcOAnRAUPn3z5c0GR5kU/i, 'homepage must retain the canonical Spotify artist destination');
assert.match(index, /06 \/ ARTIST \+ WORLD/, 'homepage retains its current artist/world section');
assert.match(index, /id=["']releaseFeed["']/);
assert.match(index, /id=["']newReleaseFeed["']/);
assert.match(enhancements, /ensureHomepageLayout/);
assert.match(enhancements, /signal\.before\(orbit\)/);
assert.match(enhancements, /querySelectorAll\('#universe'\)/);

assert.match(releases, /\.slice\(0,8\)/);
assert.match(releases, /new Set/);
assert.match(releases, /repeat\(4/);
assert.match(releases, /repeat\(2/);

// Every regular page inherits the same shell and does not resurrect the legacy runtime.
for (const page of pages) {
  const html = read(page);
  assert.match(html, /<script[^>]+src=["']\/site-shell\.js/i, `${page} must load the canonical shell`);
  if (page !== 'special_access.html') assert.doesNotMatch(html, /<link[^>]+site-shell\.css/i, `${page} must not load its own copy of site-shell.css`);
  assert.doesNotMatch(html, /<script[^>]+src=["']\/site-global\.js/i, `${page} still references legacy runtime`);
  assert.doesNotMatch(html, /href=["']\/index\.html\/contact/i, `${page} has malformed contact routing`);
}
assert.doesNotMatch(read('404.html'), /\/site-global\.js/i);

// The legacy vote.html page is not part of the current tracked site surface.

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
for (const route of ['/command','/command/admin','/Suno','/api/admin']) assert.match(vercel, new RegExp(route.replace('/', '\\/')));

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
