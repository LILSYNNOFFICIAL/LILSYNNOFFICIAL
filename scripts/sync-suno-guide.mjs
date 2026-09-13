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

const outDir = path.join(root, 'Suno', 'complete');
await fs.mkdir(outDir, { recursive: true });
marked.setOptions({ gfm: true, breaks: false });

function sanitizeLinks(html) {
  return html.replace(/href="https:\/\/github\.com\/LILSYNNOFFICIAL\/LIL-SYNN-s-Complete-Suno-V6-Guide[^\"]*"/g, 'href="#" data-source-link="internalized"');
}

for (const [src, file, title, kicker] of docs) {
  const response = await fetch(sourceBase + encodeURI(src));
  if (!response.ok) throw new Error(`${src}: HTTP ${response.status}`);
  const markdown = await response.text();
  const body = sanitizeLinks(marked.parse(markdown));
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="${title} — LIL SYNN's complete Suno V6 knowledge base."><title>${title} — LIL SYNN SUNO V6</title><link rel="stylesheet" href="../css/suno.css"><link rel="stylesheet" href="../css/complete.css"></head><body><header class="site-header"><div class="header-inner"><a class="brand" href="../Suno_Guide.html">LIL SYNN <b>SUNO V6</b></a><nav><a href="../Suno_Guide.html">GUIDE HOME</a><a href="../Suno_Guide.html#guides">GUIDES</a><a href="../Suno_Guide.html#deep-dives">DEEP DIVES</a></nav></div></header><main class="guide-page complete-reader"><div class="breadcrumbs"><a href="../Suno_Guide.html">HOME</a> / ${kicker}</div><div class="meta"><span>${kicker}</span><span>FULL CONTENT</span><span>REFERENCE DATE: SEPTEMBER 13, 2026</span></div><article class="guide-content markdown-content">${body}</article><div class="pager"><a href="../Suno_Guide.html">← GUIDE HOME</a></div></main><button class="back-top" aria-label="Back to top">↑</button><script src="../js/suno.js"></script></body></html>`;
  await fs.writeFile(path.join(outDir, file), html, 'utf8');
}
console.log(`Generated ${docs.length} complete Suno knowledge-base pages.`);
