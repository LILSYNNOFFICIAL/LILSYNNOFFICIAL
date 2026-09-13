import fs from 'node:fs/promises';
import path from 'node:path';
const root=process.cwd();
const suno=path.join(root,'Suno');
const files=['command-center.html','prompt-architect.html','style-builder.html','lyrics-builder.html','controls.html','troubleshooter.html','workflow.html'];
const failures=[];
const runtime=path.join(suno,'js','suno-drafts.js');
try{await fs.access(runtime)}catch{failures.push('missing Suno/js/suno-drafts.js')}
for(const name of files){
  const file=path.join(suno,name);
  let html;
  try{html=await fs.readFile(file,'utf8')}catch{failures.push(`${name}: missing tool page`);continue}
  if(!html.includes('src="/js/suno-drafts.js"'))failures.push(`${name}: missing persistent-draft runtime`);
}
if(await fs.access(runtime).then(()=>true).catch(()=>false)){
  const js=await fs.readFile(runtime,'utf8');
  for(const marker of ['localStorage','lilsynn-suno-draft:','restore','reset-tool'])if(!js.includes(marker))failures.push(`suno-drafts.js: missing ${marker}`);
}
if(failures.length){console.error(`Suno Draft audit FAILED — ${failures.length} issue(s)`);for(const f of failures)console.error(`  • ${f}`);process.exit(1)}
console.log(`Suno Draft audit PASS — ${files.length} interactive surfaces have persistent local draft storage.`);
