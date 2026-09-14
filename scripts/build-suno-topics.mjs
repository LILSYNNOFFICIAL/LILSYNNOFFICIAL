import fs from 'node:fs/promises';
import path from 'node:path';
import { marked } from 'marked';

const root = process.cwd();
const outDir = path.join(root,'Suno','guides');
const source = 'https://raw.githubusercontent.com/LILSYNNOFFICIAL/LIL-SYNN-s-Complete-Suno-V6-Guide/main/README.md';
const topics = [
  ['v6.html','V6 Fundamentals','CREATE',['CURRENT V6 MODEL FAMILY','CREATION ARCHITECTURE','SIMPLE MODE VS CUSTOM MODE']],
  ['prompting.html','Prompt Engineering','CREATE',['PROMPT ENGINEERING','STRUCTURE / META TAGS']],
  ['lyrics.html','Lyrics Engineering','CREATE',['LYRICS ENGINEERING']],
  ['styles.html','Style Construction','CREATE',['STYLE BOX ENGINEERING']],
  ['sliders.html','Creative Controls','CONTROL',['CREATIVE SLIDERS','ADVANCED OPTIONS / MAX MODE']],
  ['voices.html','Voices & Identity','CONTROL',['VOICES','CUSTOM MODELS','MY TASTE','INSPIRE']],
  ['editing.html','Surgical Editing','CONTROL',['EDITING: EXTEND / CROP / REPLACE / REUSE / ADJUST','SONG EDITOR / NATURAL-LANGUAGE EDITING','ADD VOCALS']],
  ['audio.html','Audio & References','CREATE',['REFERENCES & MULTIMODAL CREATION','AUDIO UPLOADS','SOUNDS','SAMPLE & MASHUP']],
  ['stems.html','Stems & Remaster','PRODUCE',['REMASTER','STEM SEPARATION']],
  ['studio.html','Studio 2.0','PRODUCE',['STUDIO 2.0','STUDIO CHAT','RECORDING / EDITING / TAKE LANES','LIBRARY / WORKSPACES','STUDIO EXPORT']],
  ['midi.html','MIDI & Wavetable','PRODUCE',['STUDIO MIDI','WAVETABLE SYNTH']],
  ['effects.html','Effects & Plugins','PRODUCE',['EFFECTS & CUSTOM PLUGINS']],
  ['automation.html','Automation','PRODUCE',['AUTOMATION']],
  ['production.html','Production System','PRODUCE',['PRODUCTION VOCABULARY','VOCAL ENGINEERING','ARRANGEMENT ENGINEERING','AUDIO / MIX / MASTER QUALITY','REPEATABILITY / SAME CHORUS']],
  ['troubleshooting.html','Diagnostics','FIX',['FAILURE MODES','SCIENTIFIC TESTING','PRODUCTION RESCUE','TROUBLESHOOTING']],
  ['rights.html','Rights & Release','PRODUCE',['PLANS / CREDITS / DOWNLOADS / RIGHTS','MOBILE / WEB ECOSYSTEM','OFFICIAL RESOURCE LIBRARY','ACCURACY POLICY']]
];
const routes = topics.map(([file,title])=>`/suno/${file.replace('.html','')}`);
const deep = ['/suno/deep-dives/ultimate-control','/suno/deep-dives/everything-expansion','/suno/deep-dives/final-current-expansion','/suno/deep-dives/coverage-audit','/suno/deep-dives/gaps-closure','/suno/deep-dives/gap-closure-all-remaining','/suno/deep-dives/additional-current-details'];
const response = await fetch(source);
if(!response.ok) throw new Error(`README.md: HTTP ${response.status}`);
const markdown = await response.text();
const normalized = markdown.replace(/\r\n/g,'\n');
const matches = [...normalized.matchAll(/^#{1,6}\s+(.+?)\s*$/gm)];
const sections = [];
for(let i=0;i<matches.length;i++){
  const start=matches[i].index;
  const end=i+1<matches.length?matches[i+1].index:normalized.length;
  sections.push({heading:matches[i][1].replace(/[*_`]/g,'').trim(),text:normalized.slice(start,end).trim()});
}
function escapeHtml(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
function pick(keywords){
  const found=[];
  for(const key of keywords){
    const k=key.toLowerCase();
    const hits=sections.filter(s=>s.heading.toLowerCase()===k || s.heading.toLowerCase().includes(k));
    for(const hit of hits) if(!found.includes(hit)) found.push(hit);
  }
  return found;
}
function nav(){return `<header class="site-header"><div class="header-inner"><a class="brand" href="/suno"><span>LIL SYNN</span><b>SUNO V6</b></a><nav class="site-nav" id="site-nav" aria-label="Guide navigation"><a class="nav-complete" href="/suno/complete">COMPLETE GUIDE</a></nav><button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav" aria-label="Open guide navigation"><span></span><span></span><span></span><b>MENU</b></button></div></header>`;}
const date=new Date().toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric',timeZone:'UTC'});
for(const [file,title,kicker,keywords] of topics){
  const chosen=pick(keywords);
  if(!chosen.length) throw new Error(`${file}: no canonical sections matched`);
  const markdownBody=`# ${title}\n\n> This topic page is generated from the canonical LIL SYNN Suno V6 knowledge base. The complete source remains available through the Complete Guide.\n\n${chosen.map(s=>s.text).join('\n\n---\n\n')}`;
  const body=marked.parse(markdownBody);
  const related=routes.filter(r=>!r.endsWith('/'+file.replace('.html',''))).slice(0,8).map((r,i)=>`<a href="${r}">${topics.find(t=>`/suno/${t[0].replace('.html','')}`===r)?.[1]||'TOPIC'}</a>`).join('');
  const deepLinks=deep.map((r,i)=>`<a href="${r}">DEEP DIVE ${String(i+1).padStart(2,'0')}</a>`).join('');
  const html=`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="${title} — LIL SYNN Suno V6 knowledge base."><title>${title} — LIL SYNN SUNO V6</title><link rel="stylesheet" href="../css/suno.css"></head><body>${nav()}<main class="guide-page"><div class="breadcrumbs"><a href="/suno">SUNO GUIDE</a> / ${kicker}</div><div class="meta"><span>${kicker}</span><span>CANONICAL TOPIC</span><span>SYNCED ${date.toUpperCase()}</span></div><article class="guide-content markdown-content">${body}</article><aside class="reader-tools"><div class="reader-jump"><span>RELATED CORE TOPICS</span><div>${related}</div></div><div class="reader-jump"><span>RESEARCH LIBRARY</span><div>${deepLinks}</div></div></aside><aside class="source-note">SOURCE: canonical Suno V6 source set · <a href="/suno/complete">READ THE COMPLETE GUIDE →</a></aside><div class="pager"><a href="/suno">← GUIDE HOME</a><a href="/suno/complete">COMPLETE GUIDE →</a></div></main><footer class="site-footer"><div><strong>LIL SYNN</strong><span> / SUNO V6 COMPLETE GUIDE</span></div><a href="/suno">SUNO GUIDE ↗</a><button class="back-to-top" type="button">↑ TOP</button></footer><script src="../js/suno.js"></script></body></html>`;
  await fs.writeFile(path.join(outDir,file),html,'utf8');
}
console.log(`Generated ${topics.length} substantive Suno topic pages from canonical README sections.`);
