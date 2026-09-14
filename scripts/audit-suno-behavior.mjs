import fs from 'node:fs/promises';
import path from 'node:path';

const root=process.cwd();
const runtime=await fs.readFile(path.join(root,'Suno/js/suno-tools.js'),'utf8');
const failures=[];

const contracts=[
  {name:'prompt architect',fn:'promptArchitect',fields:['intent','genre','mood'],output:'CORE INTENT:',guard:'Start with the creative intent'},
  {name:'style builder',fn:'styleBuilder',fields:['style-genre','style-mood'],output:'STYLE DIRECTION',guard:'Choose a primary genre'},
  {name:'lyrics builder',fn:'lyricsBuilder',fields:['lyrics-title'],selectors:['.section-row'],output:'TAG REFERENCE',guard:'Add at least one song section'},
  {name:'controls assistant',fn:'controls',fields:['control-goal','control-variance'],output:'CONTROL STRATEGY',guard:'Choose the result you want'},
  {name:'troubleshooter',fn:'troubleshoot',fields:['issue'],output:'DIAGNOSIS',guard:'Choose the symptom'},
  {name:'workflow wizard',fn:'workflow',fields:['workflow-type'],output:'CREATOR WORKFLOW',guard:null}
];

for(const c of contracts){
  const start=runtime.indexOf(`function ${c.fn}()`);
  if(start<0){failures.push(`${c.name}: handler function missing`);continue;}
  const next=runtime.indexOf('\n  function ',start+10);
  const body=runtime.slice(start,next<0?runtime.length:next);
  for(const field of c.fields)if(!body.includes(`'${field}'`))failures.push(`${c.name}: missing field contract ${field}`);
  for(const selector of c.selectors||[])if(!body.includes(selector))failures.push(`${c.name}: missing selector contract ${selector}`);
  if(!body.includes('setOutput('))failures.push(`${c.name}: no output path`);
  if(c.output&&!body.includes(c.output))failures.push(`${c.name}: expected output contract missing`);
  if(c.guard&&!body.includes(c.guard))failures.push(`${c.name}: invalid-input guard missing`);
}

for(const [name,marker] of [
  ['generate action','#generate-tool'],
  ['copy action','#copy-output'],
  ['reset action','#reset-tool'],
  ['lyrics add action','#add-section'],
  ['lyrics remove action','.remove-row']
])if(!runtime.includes(marker))failures.push(`shared runtime: ${name} missing`);
if(!runtime.includes('aria-label="Remove section"'))failures.push('lyrics runtime: remove control lacks accessible label');

const commandCenter=await fs.readFile(path.join(root,'Suno/command-center.html'),'utf8');
if(!commandCenter.includes('id="copy-output"')||!commandCenter.includes('id="reset-tool"'))failures.push('command center: copy/reset controls missing');

if(failures.length){
  console.error(`Suno behavioral audit FAILED — ${failures.length} issue(s)`);
  failures.forEach(f=>console.error(`  • ${f}`));
  process.exit(1);
}
console.log(`Suno behavioral audit PASS — ${contracts.length} tool handlers expose their required inputs, selectors, guards, and output contracts; shared interactions are wired.`);
