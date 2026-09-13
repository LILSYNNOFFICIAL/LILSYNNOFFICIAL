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
function navMenu(items){return items.map(([label,href])=>`<a href="${href}">${label}</a>`).join('');}
const sharedNav = `<header class="site-header"><div class="header-inner"><a class="brand" href="/suno" aria-label="LIL SYNN Suno V6 Guide home"><span>LIL SYNN</span><b>SUNO V6</b></a><nav class="site-nav" id="site-nav" aria-label="Guide navigation"><div class="nav-group"><button class="nav-trigger" type="button" aria-expanded="false" aria-controls="reader-create">CREATE <span>⌄</span></button><div class="nav-menu" id="reader-create">${navMenu(topics.slice(0,4).concat(topics.slice(7,8)))}</div></div><div class="nav-group"><button class="nav-trigger" type="button" aria-expanded="false" aria-controls="reader-control">CONTROL <span>⌄</span></button><div class="nav-menu" id="reader-control">${navMenu(topics.slice(4,7))}</div></div><div class="nav-group"><button class="nav-trigger" type="button" aria-expanded="false" aria-controls="reader-produce">PRODUCE <span>⌄</span></button><div class="nav-menu" id="reader-produce">${navMenu(topics.slice(8))}</div></div><div class="nav-group"><button class="nav-trigger" type="button" aria-expanded="false" aria-controls="reader-research">RESEARCH <span>⌄</span></button><div class="nav-menu" id="reader-research">${navMenu(deep)}</div></div><a class="nav-complete" href="/suno/complete">COMPLETE GUIDE</a></nav><button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav"><span></span><span></span><span></span><b>MENU</b></button></div></header>`;
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
for (const [src, file, title, kicker] of docs) {
  const response = await fetch(sourceBase + encodeURI(src));
  if (!response.ok) throw new Error(`${src}: HTTP ${response.status}`);
  const markdown = await response.text();
  const body = sanitizeLinks(marked.parse(markdown));
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="${title} — LIL SYNN's complete Suno V6 knowledge base."><title>${title} — LIL SYNN SUNO V6</title><link rel="stylesheet" href="../css/suno.css"></head><body>${sharedNav}<main class="guide-page complete-reader"><div class="breadcrumbs"><a href="/suno">SUNO GUIDE</a> / ${kicker}</div><div class="meta"><span>${kicker}</span><span>FULL CONTENT</span><span>REFERENCE DATE: SEPTEMBER 13, 2026</span></div><article class="guide-content markdown-content">${body}</article><div class="pager"><a href="/suno">← GUIDE HOME</a><a href="/suno/complete">COMPLETE GUIDE →</a></div></main><footer class="site-footer"><div><strong>LIL SYNN</strong><span> / SUNO V6 COMPLETE GUIDE</span></div><a href="/suno">SUNO GUIDE ↗</a><button class="back-to-top" type="button">↑ TOP</button></footer><script src="../js/suno.js"></script></body></html>`;
  await fs.writeFile(path.join(outDir, file), html, 'utf8');
}

const guideDir = path.join(root, 'Suno', 'guides');
for (const file of await fs.readdir(guideDir)) {
  if (!file.endsWith('.html')) continue;
  const fullPath = path.join(guideDir, file);
  let html = await fs.readFile(fullPath, 'utf8');
  html = html.replace(/href=[\"']https?:\/\/(?:www\.)?github\.com\/LILSYNNOFFICIAL\/LIL-SYNN-s-Complete-Suno-V6-Guide[^\"']*[\"']/gi, 'href="/suno"');
  html = html.replace(/href=[\"']\.\.\/Suno_Guide\.html(?:#[^\"']*)?[\"']/gi, 'href="/suno"');
  await fs.writeFile(fullPath, html, 'utf8');
}
console.log(`Generated ${docs.length} complete Suno knowledge-base pages and sanitized ${await fs.readdir(guideDir).then(files=>files.filter(f=>f.endsWith('.html')).length)} core topic pages.`);
