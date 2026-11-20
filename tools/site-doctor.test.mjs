// Site Doctor + shell contract regression (static, no browser).
// Rewritten for the current tree: index2.html / site-global2.js no longer exist,
// index.html is the production homepage and template.html + site-shell.js own the shell.
import assert from 'node:assert/strict';
import fs from 'node:fs';

const root = new URL('../', import.meta.url);
const read = name => fs.readFileSync(new URL(name, root), 'utf8');
const exists = name => fs.existsSync(new URL(name, root));

const index = read('index.html');
const doctor = read('tools/site-doctor.mjs');
const vercel = JSON.parse(read('vercel.json'));
const shell = read('site-shell.js');
const template = read('template.html');

// Homepage contract.
assert.match(index, /homepage-final-fix\.js/);
assert.match(index, /<script[^>]+src=["'](?:\.)?\/site-shell\.js/i, 'homepage loads the canonical shell');
assert.ok(!exists('index2.html'), 'index2.html must stay retired');
assert.ok(!exists('site-global.js') && !exists('site-global2.js'), 'legacy site-global runtimes must stay removed');

// Site Doctor still knows the homepage, the shell and the legacy-runtime guards.
assert.match(doctor, /standaloneHome/);
assert.match(doctor, /site-global\.js must remain removed/);
assert.match(doctor, /site-shell\.js missing/);

// Single background: the template's #ls-bg-layer is the only background video.
assert.match(template, /id="ls-bg-layer"[^>]*>\s*<video\b/);
assert.doesNotMatch(index, /<video\b/, 'index.html must not ship its own background video');
assert.doesNotMatch(read('404.html'), /<video\b/, '404.html must not ship its own background video');
assert.doesNotMatch(read('homepage-final-fix.js'), /site-stars-bg/, 'homepage-final-fix.js must not create a second stars video');

// Drawer stacks above the header: the menu z-index must equal the header's (the menu is mounted later, so it paints on top).
const headerZ = shell.match(/\.ls-canonical-topbar\{[^}]*?z-index:(\d+)/)?.[1];
const menuZInjected = shell.match(/#ls-template-menu\{position:fixed!important;z-index:(\d+)/)?.[1];
const menuZInline = shell.match(/'z-index':'(\d+)'/)?.[1];
assert.ok(headerZ && menuZInjected && menuZInline, 'shell declares header and menu z-index');
assert.equal(menuZInjected, headerZ, 'injected menu z-index must match header');
assert.equal(menuZInline, headerZ, 'inline (setMenu) menu z-index must match header');
assert.match(shell, /replaceChildren\(\.\.\.visuals,h,m,content,f\)/, 'menu must be mounted after the header');

// Shared head tags come from the template only; never noindex.
for (const re of [/rel="icon"[^>]*data-ls-head/, /rel="apple-touch-icon"[^>]*data-ls-head/, /rel="manifest"[^>]*data-ls-head/, /name="theme-color"[^>]*data-ls-head/, /rel="canonical"[^>]*data-ls-head="canonical"/, /property="og:image"[^>]*data-ls-head/, /name="twitter:card"[^>]*data-ls-head/]) assert.match(template, re);
assert.doesNotMatch(template, /name=["']robots["']/i, 'template must never inject robots/noindex');
assert.match(shell, /addTemplateHeadTags\(doc\)/);
for (const f of ['favicon.ico', 'site.webmanifest', 'assets/images/icons/favicon/apple-touch-icon.png', 'assets/images/icons/favicon/icon-32.png', 'assets/images/icons/favicon/icon-192.png', 'assets/images/icons/favicon/icon-512.png']) assert.ok(exists(f), `${f} missing`);
JSON.parse(read('site.webmanifest'));

// Merch lives in one place: the /merch redirect. Template links point at /merch.
const merch = vercel.redirects.filter(r => r.source === '/merch' || r.source === '/merch/');
assert.equal(merch.length, 2, '/merch and /merch/ redirects');
for (const r of merch) { assert.match(r.destination, /^https:\/\/lilsynnofficial\.threadless\.com\/?$/); assert.equal(r.permanent, false); }
assert.ok((template.match(/href="\/merch" target="_blank" rel="noopener"/g) || []).length >= 3, 'MERCH in header, menu and footer');

// Vercel route contract.
const sources = new Set([...vercel.redirects, ...(vercel.rewrites || [])].map(r => r.source));
for (const route of ['/admin', '/site-doctor', '/presave']) assert.ok(sources.has(route), `${route} route missing`);

console.log('Site Doctor route/shell regression contract: PASS');
