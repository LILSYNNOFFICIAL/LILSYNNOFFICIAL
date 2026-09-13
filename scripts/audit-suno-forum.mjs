import fs from 'node:fs/promises';
import path from 'node:path';

const root=process.cwd();
const suno=path.join(root,'Suno');
const forumUrl='https://suno-forum.base44.app';
const failures=[];

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

const htmlFiles=await walk(suno);
if(!htmlFiles.length)failures.push('no Suno HTML pages found');
for(const file of htmlFiles){
  const html=await fs.readFile(file,'utf8');
  if(!html.includes('src="/js/suno-forum.js"'))failures.push(`${path.relative(root,file)}: missing Forum runtime`);
}
const runtime=await fs.readFile(path.join(suno,'js','suno-forum.js'),'utf8');
const requiredChecks=[
  [forumUrl,'forum destination'],
  ['.nav-forum','Forum navigation class'],
  ["link.target='_blank'",'new-tab target assignment'],
  ["link.rel='noopener noreferrer'",'noopener noreferrer assignment']
];
for(const [marker,label] of requiredChecks){
  if(!runtime.includes(marker))failures.push(`suno-forum.js: missing ${label}`);
}
const vercel=JSON.parse(await fs.readFile(path.join(root,'vercel.json'),'utf8'));
const rewrites=new Map((vercel.rewrites||[]).map(r=>[r.source,r.destination]));
if(rewrites.get('/js/suno-forum.js')!=='/Suno/js/suno-forum.js')failures.push('vercel.json: missing Forum runtime rewrite');
if(failures.length){console.error(`Suno Forum audit FAILED — ${failures.length} issue(s)`);for(const failure of failures)console.error(`  • ${failure}`);process.exit(1)}
console.log(`Suno Forum audit PASS — ${htmlFiles.length} HTML pages receive the shared Forum runtime and the clean asset rewrite is configured.`);
