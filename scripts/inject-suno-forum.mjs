import fs from 'node:fs/promises';
import path from 'node:path';

const root=process.cwd();
const suno=path.join(root,'Suno');
const scriptTag='<script src="/js/suno-forum.js"></script>';

async function walk(dir){
  const entries=await fs.readdir(dir,{withFileTypes:true});
  const files=[];
  for(const entry of entries){
    const full=path.join(dir,entry.name);
    if(entry.isDirectory())files.push(...await walk(full));
    else if(entry.isFile()&&entry.name.endsWith('.html'))files.push(full);
  }
  return files;
}

const files=await walk(suno);
for(const file of files){
  let html=await fs.readFile(file,'utf8');
  if(!html.includes('src="/js/suno-forum.js"')){
    if(!html.includes('</body>'))throw new Error(`${path.relative(root,file)}: missing </body>`);
    html=html.replace('</body>',`${scriptTag}</body>`);
    await fs.writeFile(file,html,'utf8');
  }
}
console.log(`Injected shared Forum navigation runtime into ${files.length} Suno HTML pages.`);
