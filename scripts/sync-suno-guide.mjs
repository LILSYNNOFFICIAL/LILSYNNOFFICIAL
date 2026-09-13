import fs from 'node:fs/promises';
import path from 'node:path';
import { marked } from 'marked';

const root = process.cwd();
const sourceBase = 'https://raw.githubusercontent.com/LILSYNNOFFICIAL/LIL-SYNN-s-Complete-Suno-V6-Guide/main/';
const docs = [
  ['README.md','complete-guide.html','THE COMPLETE SUNO V6 GUIDE','MASTER GUIDE'],
  ['SUNO-V6-ULTIMATE-CONTROL-AND-PRODUCTION-ADDENDUM-2026.md','ultimate-control.html','Ultimate Control & Production Addendum','DEEP DIVE 01'],
  ['SUNO-V6-EVERYTHING-EXPANSION.md','everything-expansion.html','Everything Expansion','DEEP DIVE 02'],
  ['SUNO-V6-FINAL-CURRENT-EXPANSION.md','final-current-expansion.html','Final Current Expansion','DEEP DIVE 03'],
  ['SUNO-V6-CURRENT-COVERAGE-AUDIT.md','coverage-audit.html','Current Coverage Audit','DEEP DIVE 04'],
  ['SUNO-V6-CURRENT-GAPS-CLOSURE.md','gaps-closure.html','Current Gaps Closure','DEEP DIVE 05'],
  ['SUNO-V6-GAP-CLOSURE-ALL-REMAINING-CURRENT.md','gap-closure-all-remaining.html','Gap Closure — All Remaining Current','DEEP DIVE 06'],
  ['SUNO-V6-ADDITIONAL-CURRENT-DETAILS.md','additional-current-details.html','Additional Current Details','DEEP DIVE 07']
];
const topics = [
  ['V6 FUNDAMENTALS','/suno/v6'],['PROMPT ENGINEERING','/suno/prompting'],['LYRICS ENGINEERING','/suno/lyrics'],['STYLE CONSTRUCTION','/suno/styles'],['CREATIVE CONTROLS','/suno/sliders'],['VOICES & IDENTITY','/suno/voices'],['SURGICAL EDITING','/suno/editing'],['AUDIO & REFERENCES','/suno/audio'],['STEMS & REMASTER','/suno/stems'],['STUDIO 2.0','/suno/studio'],['MIDI & WAVETABLE','/suno/midi'],['EFFECTS & PLUGINS','/suno/effects'],['AUTOMATION','/suno/automation'],['PRODUCTION SYSTEM','/suno/production'],['DIAGNOSTICS','/suno/troubleshooting'],['RIGHTS & RELEASE','/suno/rights']
];
const deep = [
  ['ULTIMATE CONTROL','/suno/deep-dives/ultimate-control'],['EVERYTHING EXPANSION','/suno/deep-dives/everything-expansion'],['FINAL CURRENT EXPANSION','/suno/deep-dives/final-current-expansion'],['COVERAGE AUDIT','/suno/deep-dives/coverage-audit'],['GAPS CLOSURE','/suno/deep-dives/gaps-closure'],['ALL REMAINING CURRENT','/suno/deep-dives/gap-closure-all-remaining'],['ADDITIONAL CURRENT DETAILS','/suno/deep-dives/additional-current-details']
];
const deepLinkMap = {
  'SUNO-V6-ULTIMATE-CONTROL-AND-PRODUCTION-ADDENDUM-2026.md':'/suno/deep-dives/ultimate-control',
  'SUNO-V6-EVERYTHING-EXPANSION.md':'/suno/deep-dives/everything-expansion',
  'SUNO-V6-FINAL-CURRENT-EXPANSION.md':'/suno/deep-dives/final-current-expansion',
  'SUNO-V6-CURRENT-COVERAGE-AUDIT.md':'/suno/deep-dives/coverage-audit',
  'SUNO-V6-CURRENT-GAPS-CLOSURE.md':'/suno/deep-dives/gaps-closure',
  'SUNO-V6-GAP-CLOSURE-ALL-REMAINING-CURRENT.md':'/suno/deep-dives/gap-closure-all-remaining',
  'SUNO-V6-ADDITIONAL-CURRENT-DETAILS.md':'/suno/deep-dives/additional-current-details'
};
const outDir = path.join(root, 'Suno', 'complete');
await fs.mkdir(outDir, { recursive: true });
marked.setOptions({ gfm: true, breaks: false });
const buildDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
function navMenu(items){return items.map(([label,href])=>`<a href="${href}">${label}</a>`).join('');}
const sharedNav = `<header class="site-header"><div class="header-inner"><a class="brand" href="/suno" aria-label="LIL SYNN Suno V6 Guide home"><span>LIL SYNN</span><b>SUNO V6</b></a><nav class="site-nav" id="site-nav" aria-label="Guide navigation"><div class="nav-group"><button class="nav-trigger" type="button" aria-expanded="false" aria-controls="reader-create">CREATE <span>⌄</span></button><div class="nav-menu" id="reader-create">${navMenu(topics.slice(0,4).concat(topics.slice(7,8)))}</div></div><div class="nav-group"><button class="nav-trigger" type="button" aria-expanded="false" aria-controls="reader-control">CONTROL <span>⌄</span></button><div class="nav-menu" id="reader-control">${navMenu(topics.slice(4,7))}</div></div><div class="nav-group"><button class="nav-trigger" type="button" aria-expanded="false" aria-controls="reader-produce">PRODUCE <span>⌄</span></button><div class="nav-menu" id="reader-produce">${navMenu(topics.slice(8))}</div></div><div class="nav-group"><button class="nav-trigger" type="button" aria-expanded="false" aria-controls="reader-research">RESEARCH <span>⌄</span></button><div class="nav-menu" id="reader-research">${navMenu(deep)}</div></div><a class="nav-complete" href="/suno/complete">COMPLETE GUIDE</a></nav><button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav" aria-label="Open guide navigation"><span></span><span></span><span></span><b>MENU</b></button></div></header>`;
function sanitizeLinks(html) {
  let output = html
    .replace(/https?:\/\/(?:www\.)?github\.com\/LILSYNNOFFICIAL\/LIL-SYNN-s-Complete-Suno-V6-Guide[^\"\s)>]*/gi, '#')
    .replace(/https?:\/\/raw\.githubusercontent\.com\/LILSYNNOFFICIAL\/LIL-SYNN-s-Complete-Suno-V6-Guide[^\"\s)>]*/gi, '#');
  for (const [file, href] of Object.entries(deepLinkMap)) {
    const escaped = file.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
    output = output.replace(new RegExp(`href=[\"'](?:\\.\\/)?${escaped}[\"']`, 'gi'), `href="${href}"`);
  }
  return output;
}
function readerTools(index) {
  const prev = index > 0 ? docs[index - 1] : null;
  const next = index < docs.length - 1 ? docs[index + 1] : null;
  const prevHref = prev ? (index === 1 ? '/suno/complete' : deep[index - 2][1]) : '/suno';
  const nextHref = next ? (index === 0 ? deep[0][1] : deep[index][1]) : '/suno';
  const jump = topics.map(([label, href]) => `<a href="${href}">${label}</a>`).join('');
  return `<aside class="reader-tools"><div class="reader-jump"><span>JUMP TO CORE TOPIC</span><div>${jump}</div></div><div class="reader-sequence"><a href="${prevHref}"${prev ? '' : ' aria-disabled="true"'}>← ${prev ? 'PREVIOUS DOCUMENT' : 'GUIDE HOME'}</a><a href="${nextHref}">${next ? 'NEXT DOCUMENT' : 'GUIDE HOME'} →</a></div></aside>`;
}
for (const [index, [src, file, title, kicker]] of docs.entries()) {
  const response = await fetch(sourceBase + encodeURI(src));
  if (!response.ok) throw new Error(`${src}: HTTP ${response.status}`);
  const markdown = await response.text();
  const body = sanitizeLinks(marked.parse(markdown));
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="${title} — LIL SYNN's complete Suno V6 knowledge base."><title>${title} — LIL SYNN SUNO V6</title><link rel="stylesheet" href="../css/suno.css"></head><body>${sharedNav}<main class="guide-page complete-reader"><div class="breadcrumbs"><a href="/suno">SUNO GUIDE</a> / ${kicker}</div><div class="meta"><span>${kicker}</span><span>FULL CONTENT</span><span>SYNCED ${buildDate.toUpperCase()}</span></div>${readerTools(index)}<article class="guide-content markdown-content">${body}</article><div class="pager"><a href="/suno">← GUIDE HOME</a><a href="/suno/complete">COMPLETE GUIDE →</a></div></main><footer class="site-footer"><div><strong>LIL SYNN</strong><span> / SUNO V6 COMPLETE GUIDE</span></div><a href="/suno">SUNO GUIDE ↗</a><button class="back-to-top" type="button">↑ TOP</button></footer><script src="../js/suno.js"></script></body></html>`;
  await fs.writeFile(path.join(outDir, file), html, 'utf8');
}

const guideDir = path.join(root, 'Suno', 'guides');
for (const file of await fs.readdir(guideDir)) {
  if (!file.endsWith('.html')) continue;
  const fullPath = path.join(guideDir, file);
  let html = await fs.readFile(fullPath, 'utf8');
  html = html.replace(/href=[\"']https?:\/\/(?:www\.)?github\.com\/LILSYNNOFFICIAL\/LIL-SYNN-s-Complete-Suno-V6-Guide[^\"']*[\"']/gi, 'href="/suno"');
  html = html.replace(/href=[\"']https?:\/\/raw\.githubusercontent\.com\/LILSYNNOFFICIAL\/LIL-SYNN-s-Complete-Suno-V6-Guide[^\"']*[\"']/gi, 'href="/suno"');
  html = html.replace(/href=[\"']\.\.\/Suno_Guide\.html(?:#[^\"']*)?[\"']/gi, 'href="/suno"');
  await fs.writeFile(fullPath, html, 'utf8');
}

const landingPath = path.join(root, 'Suno', 'Suno_Guide.html');
let landing = await fs.readFile(landingPath, 'utf8');
landing = landing.replace(/THE LIVING REFERENCE · UPDATED [^<]+/i, `THE LIVING REFERENCE · UPDATED ${buildDate.toUpperCase()}`);
if (!landing.includes('id="suno-source-status"')) {
  const status = `<section class="source-status section" id="suno-source-status"><div><p class="eyebrow">LIVE SOURCE STATUS</p><h2>Knowledge base <em>synchronized.</em></h2><p>This site is rebuilt from the canonical Suno V6 source set at build time. The current synchronized source date is <strong>${buildDate}</strong>. Read everything here; no visitor navigation requires the source repository.</p></div><div class="source-status-grid"><div><b>8</b><span>SOURCE DOCUMENTS</span></div><div><b>16</b><span>CORE TOPICS</span></div><div><b>7</b><span>DEEP DIVES</span></div></div></section>`;
  landing = landing.replace('<section class="principle">', `${status}<section class="principle">`);
}
await fs.writeFile(landingPath, landing, 'utf8');

const cssPath = path.join(root, 'Suno', 'css', 'suno.css');
let css = await fs.readFile(cssPath, 'utf8');
const marker = '/* SUNO READER HARDENING */';
if (!css.includes(marker)) {
  css += `\n${marker}\n.reader-tools{margin:0 0 36px;border:1px solid var(--line);background:#0b0a08}.reader-jump{padding:16px;border-bottom:1px solid rgba(201,154,62,.1)}.reader-jump>span{display:block;color:var(--gold);font-size:7px;font-weight:900;letter-spacing:.16em;margin-bottom:10px}.reader-jump>div{display:flex;gap:6px;flex-wrap:wrap}.reader-jump a{border:1px solid rgba(201,154,62,.13);padding:7px 9px;color:#827a6f;font-size:7px;letter-spacing:.1em}.reader-jump a:hover{color:var(--gold2);border-color:var(--gold)}.reader-sequence{display:flex;justify-content:space-between;gap:10px;padding:10px 16px}.reader-sequence a{color:#a59d90;font-size:8px;font-weight:800;letter-spacing:.12em}.reader-sequence a:hover{color:var(--gold2)}.reader-sequence a[aria-disabled=true]{opacity:.35;pointer-events:none}.source-status{display:grid;grid-template-columns:1fr 360px;gap:60px;border-top:1px solid var(--line);border-bottom:1px solid var(--line)}.source-status h2{margin:0;font:400 clamp(42px,5vw,68px)/.95 Georgia,serif}.source-status p:not(.eyebrow){color:#8f877b;max-width:720px}.source-status-grid{display:grid;grid-template-columns:repeat(3,1fr);align-content:center;border-left:1px solid var(--line);padding-left:30px}.source-status-grid div{padding:14px 12px;border-bottom:1px solid rgba(201,154,62,.1)}.source-status-grid div:last-child{border-bottom:0}.source-status-grid b{display:block;color:var(--gold2);font:400 30px Georgia,serif}.source-status-grid span{color:#686157;font-size:7px;letter-spacing:.15em}.nav-group.active>.nav-trigger{color:var(--gold2)}.nav-menu a[aria-current=page]{color:var(--gold2);background:rgba(201,154,62,.08)}@media(max-width:760px){.reader-tools{margin-bottom:28px}.reader-jump>div{max-height:180px;overflow:auto}.reader-sequence{flex-direction:column}.source-status{grid-template-columns:1fr;gap:24px}.source-status-grid{border-left:0;border-top:1px solid var(--line);padding:14px 0 0}.source-status-grid div{border-right:1px solid rgba(201,154,62,.1);border-bottom:0}.source-status-grid div:last-child{border-right:0}}\n`;
  await fs.writeFile(cssPath, css, 'utf8');
}
console.log(`Generated ${docs.length} complete Suno knowledge-base pages and sanitized ${await fs.readdir(guideDir).then(files=>files.filter(f=>f.endsWith('.html')).length)} core topic pages. Sync date: ${buildDate}.`);
