import fs from 'node:fs/promises';
import path from 'node:path';

const runtime=await fs.readFile(path.join(process.cwd(),'Suno/js/suno.js'),'utf8');
const failures=[];
const required=[
  ['const escapeHtml=','HTML escaping helper'],
  ['const safeHref=','internal href guard'],
  ['escapeHtml(e.kicker)','escaped search kicker'],
  ['escapeHtml(e.title)','escaped search title'],
  ['escapeHtml(e.text','escaped search text'],
  ['escapeHtml(safeHref(e))','escaped safe search href'],
  ['escapeHtml(q)','escaped search query'],
  ['escapeHtml(m.syncDate)','escaped manifest sync date'],
  ['escapeHtml(m.coreTopics)','escaped manifest core topic count'],
  ['escapeHtml(m.deepDives)','escaped manifest deep-dive count'],
  ['escapeHtml(m.completeDocuments)','escaped manifest document count']
];
for(const [marker,label] of required){
  if(!runtime.includes(marker))failures.push(`suno.js: missing ${label}`);
}
for(const marker of ['href="${e.href}"','>${e.kicker}</div>','>${e.title}</div>','>${e.text.slice']){
  if(runtime.includes(marker))failures.push(`suno.js: unsafe direct interpolation ${marker}`);
}
if(failures.length){
  console.error('Suno runtime safety audit FAIL');
  failures.forEach(f=>console.error(`- ${f}`));
  process.exit(1);
}
console.log('Suno runtime safety audit PASS — dynamic search and manifest output is escaped and internal hrefs are guarded.');
