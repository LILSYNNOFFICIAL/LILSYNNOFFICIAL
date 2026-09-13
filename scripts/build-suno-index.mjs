import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const suno = path.join(root, 'Suno');
const coreDir = path.join(suno, 'guides');
const completeDir = path.join(suno, 'complete');
const strip = html => html.replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<style[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ').replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/\s+/g,' ').trim();
const titleFrom = html => (html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || 'Suno Guide').replace(/\s+/g,' ').trim();
const routeMap = {
  'v6.html':'/suno/v6','prompting.html':'/suno/prompting','lyrics.html':'/suno/lyrics','styles.html':'/suno/styles','sliders.html':'/suno/sliders','voices.html':'/suno/voices','editing.html':'/suno/editing','audio.html':'/suno/audio','stems.html':'/suno/stems','studio.html':'/suno/studio','midi.html':'/suno/midi','effects.html':'/suno/effects','automation.html':'/suno/automation','production.html':'/suno/production','troubleshooting.html':'/suno/troubleshooting','rights.html':'/suno/rights'
};
const core = [];
for (const file of Object.keys(routeMap)) {
  const html = await fs.readFile(path.join(coreDir,file),'utf8');
  core.push({title:titleFrom(html),kicker:'CORE TOPIC',href:routeMap[file],text:strip(html).slice(0,60000)});
}
const deepRoutes = {
  'ultimate-control.html':'/suno/deep-dives/ultimate-control','everything-expansion.html':'/suno/deep-dives/everything-expansion','final-current-expansion.html':'/suno/deep-dives/final-current-expansion','coverage-audit.html':'/suno/deep-dives/coverage-audit','gaps-closure.html':'/suno/deep-dives/gaps-closure','gap-closure-all-remaining.html':'/suno/deep-dives/gap-closure-all-remaining','additional-current-details.html':'/suno/deep-dives/additional-current-details'
};
const deep = [];
for (const file of Object.keys(deepRoutes)) {
  const html = await fs.readFile(path.join(completeDir,file),'utf8');
  deep.push({title:titleFrom(html),kicker:'DEEP DIVE',href:deepRoutes[file],text:strip(html).slice(0,60000)});
}
const masterHtml = await fs.readFile(path.join(completeDir,'complete-guide.html'),'utf8');
const master = {title:'THE COMPLETE SUNO V6 GUIDE',kicker:'MASTER GUIDE',href:'/suno/complete',text:strip(masterHtml).slice(0,100000)};
const entries = [master,...core,...deep];
const now = new Date();
const syncDate = now.toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric',timeZone:'UTC'});
await fs.writeFile(path.join(suno,'search-index.json'),JSON.stringify({generatedAt:now.toISOString(),syncDate,entries},null,2));
await fs.writeFile(path.join(suno,'manifest.json'),JSON.stringify({generatedAt:now.toISOString(),syncDate,sourceRepository:'canonical Suno V6 source set',coreTopics:core.length,deepDives:deep.length,completeDocuments:1+deep.length,indexedEntries:entries.length},null,2));
console.log(`Built Suno search index: ${entries.length} entries; ${core.length} core topics; ${deep.length} deep dives.`);
