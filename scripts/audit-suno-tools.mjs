import fs from 'node:fs/promises';
import path from 'node:path';

const root=process.cwd();
const suno=path.join(root,'Suno');
const specs=[
  {file:'prompt-architect.html',tool:'prompt-architect',generate:'BUILD PROMPT →',required:['id="intent"','id="genre"','id="mood"']},
  {file:'style-builder.html',tool:'style-builder',generate:'BUILD STYLE →',required:['id="style-genre"','id="style-mood"']},
  {file:'lyrics-builder.html',tool:'lyrics-builder',generate:'BUILD STRUCTURE →',required:['id="lyrics-title"','id="section-list"','id="add-section"']},
  {file:'controls.html',tool:'controls',generate:'BUILD STRATEGY →',required:['id="control-goal"','id="control-variance"']},
  {file:'troubleshooter.html',tool:'troubleshooter',generate:'DIAGNOSE →',required:['id="issue"']},
  {file:'workflow.html',tool:'workflow',generate:'MAP WORKFLOW →',required:['id="workflow-type"']},
  {file:'command-center.html',tool:'command-center',generate:null,required:['id="tool-output"','id="copy-output"','id="reset-tool"']}
];
const failures=[];
for(const spec of specs){
  const file=path.join(suno,spec.file);
  let html;
  try{html=await fs.readFile(file,'utf8')}catch{failures.push(`${spec.file}: missing page`);continue;}
  for(const marker of [`data-tool="${spec.tool}"`,'id="tool-output"','id="copy-output"','id="reset-tool"','/js/suno.js','/js/suno-drafts.js','/css/tools.css']){
    if(!html.includes(marker))failures.push(`${spec.file}: missing ${marker}`);
  }
  if(spec.generate&&!html.includes(`id="generate-tool"`))failures.push(`${spec.file}: missing generate action`);
  if(spec.generate&&!html.includes(spec.generate))failures.push(`${spec.file}: missing generate label`);
  for(const marker of spec.required)if(!html.includes(marker))failures.push(`${spec.file}: missing ${marker}`);
  if(!/<button[^>]+type="button"[^>]+id="(generate-tool|copy-output|reset-tool)"/.test(html)&&!/<button[^>]+id="(generate-tool|copy-output|reset-tool)"[^>]+type="button"/.test(html))failures.push(`${spec.file}: action buttons are not explicit non-submit buttons`);
}
const runtime=await fs.readFile(path.join(suno,'js','suno-tools.js'),'utf8');
for(const marker of ["'prompt-architect':promptArchitect","'style-builder':styleBuilder","'lyrics-builder':lyricsBuilder","'controls':controls","'troubleshooter':troubleshoot","'workflow':workflow"]){
  if(!runtime.includes(marker))failures.push(`runtime: missing handler ${marker}`);
}
for(const marker of ['#generate-tool','#copy-output','#reset-tool','#add-section','.remove-row'])if(!runtime.includes(marker))failures.push(`runtime: missing interaction ${marker}`);
const drafts=await fs.readFile(path.join(suno,'js','suno-drafts.js'),'utf8');
if(!drafts.includes('const key=`lilsynn-suno-draft:${tool}`'))failures.push('draft runtime: storage key is not tool-scoped');
if(!drafts.includes('form?.addEventListener(\'input\',queueSave)'))failures.push('draft runtime: input autosave missing');
if(!drafts.includes('restore()'))failures.push('draft runtime: restore call missing');
if(failures.length){console.error(`Suno Tool audit FAILED — ${failures.length} issue(s)`);for(const f of failures)console.error(`  • ${f}`);process.exit(1)}
console.log(`Suno Tool audit PASS — ${specs.length} interactive surfaces have required controls, runtime wiring, clean-route assets, and draft persistence.`);
