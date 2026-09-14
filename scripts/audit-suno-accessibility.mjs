import fs from 'node:fs/promises';
import path from 'node:path';

const root=process.cwd();
const suno=path.join(root,'Suno');
const files=['prompt-architect.html','style-builder.html','lyrics-builder.html','controls.html','troubleshooter.html','workflow.html','command-center.html'];
const failures=[];

for(const name of files){
  const html=await fs.readFile(path.join(suno,name),'utf8');
  const controls=[...html.matchAll(/<(input|select|textarea)\b[^>]*>/g)].map(m=>m[0]);
  const buttons=[...html.matchAll(/<button\b[^>]*>/g)].map(m=>m[0]);
  if(!html.includes('aria-expanded="false"')||!html.includes('aria-controls="site-nav"'))failures.push(`${name}: mobile menu lacks expanded/controls state`);
  if(!html.includes('id="site-nav"'))failures.push(`${name}: navigation target missing`);
  if(!html.includes('<main'))failures.push(`${name}: main landmark missing`);
  if(!html.includes('<h1'))failures.push(`${name}: primary heading missing`);
  for(const button of buttons){
    if(!/\btype="button"\b/.test(button)&&!/\btype='button'\b/.test(button))failures.push(`${name}: button lacks explicit type=button`);
  }
  const labeled=html.match(/<label\b/g)?.length||0;
  const textInputs=controls.filter(x=>/\b(?:input|textarea|select)\b/.test(x)&&!/type="checkbox"/.test(x)).length;
  if(textInputs>labeled)failures.push(`${name}: ${textInputs} form controls but only ${labeled} labels`);
  if(name==='lyrics-builder'&&!html.includes('aria-label="Remove section"')&&!html.includes('aria-label="Remove section"'))failures.push(`${name}: remove-section control lacks accessible label`);
}

const forum=await fs.readFile(path.join(suno,'js','suno-forum.js'),'utf8');
for(const marker of ["link.target='_blank'","link.rel='noopener noreferrer'","aria-label','Open the LIL SYNN Suno community forum"]){
  if(!forum.includes(marker))failures.push(`forum runtime: missing accessibility/security contract ${marker}`);
}

if(failures.length){
  console.error(`Suno accessibility audit FAILED — ${failures.length} issue(s)`);
  failures.forEach(f=>console.error(`  • ${f}`));
  process.exit(1);
}
console.log(`Suno accessibility audit PASS — ${files.length} interactive pages have landmarks, mobile menu state, explicit button types, form labels, and accessible Forum behavior.`);
