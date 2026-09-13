import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const suno = path.join(root, 'Suno');
const coreDir = path.join(suno, 'guides');
const completeDir = path.join(suno, 'complete');
const strip = html => html.replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<style[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ').replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/\s+/g,' ').trim();
const titleFrom = html => (html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || 'Suno Guide').replace(/\s+/g,' ').trim();
const routeMap = {'v6.html':'/suno/v6','prompting.html':'/suno/prompting','lyrics.html':'/suno/lyrics','styles.html':'/suno/styles','sliders.html':'/suno/sliders','voices.html':'/suno/voices','editing.html':'/suno/editing','audio.html':'/suno/audio','stems.html':'/suno/stems','studio.html':'/suno/studio','midi.html':'/suno/midi','effects.html':'/suno/effects','automation.html':'/suno/automation','production.html':'/suno/production','troubleshooting.html':'/suno/troubleshooting','rights.html':'/suno/rights'};
const core=[];
for(const file of Object.keys(routeMap)){const html=await fs.readFile(path.join(coreDir,file),'utf8');core.push({title:titleFrom(html),kicker:'CORE TOPIC',href:routeMap[file],text:strip(html).slice(0,60000),kind:'guide'});}
const deepRoutes={'ultimate-control.html':'/suno/deep-dives/ultimate-control','everything-expansion.html':'/suno/deep-dives/everything-expansion','final-current-expansion.html':'/suno/deep-dives/final-current-expansion','coverage-audit.html':'/suno/deep-dives/coverage-audit','gaps-closure.html':'/suno/deep-dives/gaps-closure','gap-closure-all-remaining.html':'/suno/deep-dives/gap-closure-all-remaining','additional-current-details.html':'/suno/deep-dives/additional-current-details'};
const deep=[];
for(const file of Object.keys(deepRoutes)){const html=await fs.readFile(path.join(completeDir,file),'utf8');deep.push({title:titleFrom(html),kicker:'DEEP DIVE',href:deepRoutes[file],text:strip(html).slice(0,60000),kind:'guide'});}
const masterHtml=await fs.readFile(path.join(completeDir,'complete-guide.html'),'utf8');
const master={title:'THE COMPLETE SUNO V6 GUIDE',kicker:'MASTER GUIDE',href:'/suno/complete',text:strip(masterHtml).slice(0,100000),kind:'guide'};
const toolMeta=[
 ['PROMPT ARCHITECT','/suno/prompt-architect','CREATE · TOOL','Prompt construction, creative intent, genre, mood, vocals, arrangement, production, constraints'],
 ['STYLE BUILDER','/suno/style-builder','CREATE · TOOL','Style construction, genre, era, mood, vocals, instrumentation, texture, mix direction'],
 ['LYRICS / TAG BUILDER','/suno/lyrics-builder','CREATE · TOOL','Lyrics structure, section tags, arrangement notes, song architecture'],
 ['CONTROLS ASSISTANT','/suno/controls','CONTROL · TOOL','Creative controls, predictable results, exploration, repair, identity, controlled experiments'],
 ['TROUBLESHOOTER','/suno/troubleshooter','FIX · TOOL','Diagnostics, vocal drift, structure problems, crowded mix, repetition, section repair, references'],
 ['WORKFLOW WIZARD','/suno/workflow','PRODUCE · TOOL','Production workflow, generation, selection, repair, Studio, QC, release'],
 ['COMMAND CENTER','/suno/command-center','SYSTEM · TOOL','Interactive Suno creator tools, connected knowledge base, production command center']
];
const tools=toolMeta.map(([title,href,kicker,text])=>({title,kicker,href,text,kind:'tool'}));
const terminology=[
 ['Prompt hierarchy','/suno/prompting','REFERENCE · TERM','Prioritize the most important creative direction before secondary descriptors.'],
 ['Style construction','/suno/styles','REFERENCE · TERM','Build style direction from audible characteristics rather than adjective accumulation.'],
 ['Creative controls','/suno/sliders','REFERENCE · TERM','Use controls as experimental variables and compare outputs against a stable target.'],
 ['Surgical editing','/suno/editing','REFERENCE · TERM','Repair a strong result locally instead of discarding the entire generation.'],
 ['Stem separation','/suno/stems','REFERENCE · TERM','Separate musical components for targeted balance and production work.'],
 ['Studio 2.0','/suno/studio','REFERENCE · TERM','Move from generation into the production environment for deeper editing and refinement.'],
 ['Production QC','/suno/production','REFERENCE · TERM','Final checks for arrangement, vocals, timing, mix, export and release readiness.']
].map(([title,href,kicker,text])=>({title,kicker,href,text,kind:'reference'}));
const entries=[master,...core,...deep,...tools,...terminology];
const now=new Date();
const syncDate=now.toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric',timeZone:'UTC'});
await fs.writeFile(path.join(suno,'search-index.json'),JSON.stringify({generatedAt:now.toISOString(),syncDate,entries},null,2));
await fs.writeFile(path.join(suno,'manifest.json'),JSON.stringify({generatedAt:now.toISOString(),syncDate,sourceRepository:'canonical Suno V6 source set',coreTopics:core.length,deepDives:deep.length,completeDocuments:1+deep.length,toolSurfaces:tools.length,referenceTerms:terminology.length,indexedEntries:entries.length},null,2));
console.log(`Built Suno search index: ${entries.length} entries; ${core.length} core topics; ${deep.length} deep dives; ${tools.length} tools.`);
