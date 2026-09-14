import fs from 'node:fs/promises';
import path from 'node:path';
import https from 'node:https';

const ROOT = process.cwd();
const SUNO = path.join(ROOT, 'Suno');
const GUIDE = 'LILSYNNOFFICIAL/LIL-SYNN-s-Complete-Suno-V6-Guide';

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'LIL-SYNN-Suno-Site-Builder' } }, res => {
      let data = '';
      res.setEncoding('utf8');
      res.on('data', c => data += c);
      res.on('end', () => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) return get(res.headers.location).then(resolve, reject);
        if (res.statusCode !== 200) return reject(new Error(`GET ${url} -> ${res.statusCode}`));
        resolve(data);
      });
    }).on('error', reject);
  });
}

const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const inline = s => {
  let x = String(s);
  x = x.replace(/https?:\/\/github\.com\/[^)\s]+/gi, '');
  x = x.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, href) => {
    if (/github\.com/i.test(href)) return label;
    if (/\.md(?:#.*)?$/i.test(href)) {
      const clean = href.replace(/^\.\//,'').replace(/^\.\.\//,'').replace(/\.md(#.*)?$/i,'');
      return `<a href="/suno/library/${clean}/">${label}</a>`;
    }
    if (/^https?:\/\//i.test(href)) return `<a href="${href}">${label}</a>`;
    return `<a href="${href}">${label}</a>`;
  });
  x = x.replace(/`([^`]+)`/g,'<code>$1</code>');
  x = x.replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>');
  x = x.replace(/\*([^*]+)\*/g,'<em>$1</em>');
  return x;
};

function render(md) {
  const lines = md.replace(/\r/g,'').split('\n');
  let out='', inCode=false, code=[], list=false, quote=false;
  const closeList=()=>{if(list){out+='</ul>';list=false}};
  const closeQuote=()=>{if(quote){out+='</blockquote>';quote=false}};
  for (let i=0;i<lines.length;i++) {
    const raw=lines[i];
    if (raw.trim().startsWith('```')) {
      if (!inCode) { closeList(); closeQuote(); inCode=true; code=[]; }
      else { out+=`<pre><code>${esc(code.join('\n'))}</code></pre>`; inCode=false; }
      continue;
    }
    if (inCode) { code.push(raw); continue; }
    if (!raw.trim()) { closeList(); closeQuote(); continue; }
    const h=raw.match(/^(#{1,6})\s+(.+)$/);
    if (h) { closeList(); closeQuote(); const n=h[1].length; const text=h[2].replace(/\s+#+\s*$/,''); const id=text.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''); out+=`<h${n} id="${id}">${inline(text)}</h${n}>`; continue; }
    const li=raw.match(/^\s*[-*+]\s+(.+)$/);
    if (li) { closeQuote(); if(!list){out+='<ul>';list=true} out+=`<li>${inline(li[1])}</li>`; continue; }
    const ol=raw.match(/^\s*\d+\.\s+(.+)$/);
    if (ol) { closeQuote(); if(!list){out+='<ol>';list=true} out+=`<li>${inline(ol[1])}</li>`; continue; }
    const bq=raw.match(/^>\s?(.*)$/);
    if (bq) { closeList(); if(!quote){out+='<blockquote>';quote=true} out+=`<p>${inline(bq[1])}</p>`; continue; }
    if (/^---+$/.test(raw.trim())) { closeList(); closeQuote(); out+='<hr>'; continue; }
    if (raw.trim().startsWith('|') && raw.trim().endsWith('|')) {
      closeList(); closeQuote();
      const rows=[raw]; while(i+1<lines.length && lines[i+1].trim().startsWith('|')) rows.push(lines[++i]);
      out+='<div class="table-wrap"><table>';
      rows.forEach((r,idx)=>{ if(/^\s*\|?\s*:?-{3,}/.test(r.replace(/\|/g,'').trim())) return; const cells=r.trim().replace(/^\||\|$/g,'').split('|').map(c=>c.trim()); out+='<tr>'+cells.map(c=>`<${idx===0?'th':'td'}>${inline(c)}</${idx===0?'th':'td'}>`).join('')+'</tr>'; });
      out+='</table></div>'; continue;
    }
    closeList(); closeQuote();
    out+=`<p>${inline(raw)}</p>`;
  }
  closeList(); closeQuote();
  if(inCode) out+=`<pre><code>${esc(code.join('\n'))}</code></pre>`;
  return out;
}

const shell = (title, body, extra='') => `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)} — LIL SYNN Suno V6</title><meta name="description" content="LIL SYNN's complete Suno V6 knowledge system."><link rel="stylesheet" href="/suno/css/suno.css"><style>
body{background:#070706;color:#f7f3eb}.library-page{max-width:1220px;margin:auto;padding:110px 5vw 90px}.library-page h1{font:400 clamp(42px,6vw,82px)/.95 Georgia,serif;color:#f1cf78;margin:0 0 30px}.library-page h2{font:400 34px/1.1 Georgia,serif;color:#f1cf78;margin:50px 0 15px;border-bottom:1px solid rgba(241,207,120,.18);padding-bottom:10px}.library-page h3{font:400 25px Georgia,serif;color:#e6c46d;margin-top:34px}.library-page p,.library-page li{font:400 15px/1.72 Inter,system-ui,sans-serif;color:#c3bdb3}.library-page a{color:#f1cf78}.library-page code{color:#f1cf78;background:#11100d;padding:2px 5px}.library-page pre{white-space:pre-wrap;background:#0d0c09;border:1px solid rgba(241,207,120,.2);padding:18px;overflow:auto;color:#f4eee4;font:13px/1.65 ui-monospace,monospace}.library-page blockquote{margin:25px 0;padding:15px 20px;border-left:3px solid #f1cf78;background:rgba(241,207,120,.045)}.table-wrap{overflow:auto;margin:20px 0}.library-page table{border-collapse:collapse;width:100%;min-width:620px}.library-page th,.library-page td{border:1px solid rgba(255,255,255,.1);padding:10px;text-align:left}.library-page th{color:#f1cf78;background:#11100d}.library-page hr{border:0;border-top:1px solid rgba(241,207,120,.16);margin:38px 0}.crumb{font:900 8px Rajdhani,sans-serif;letter-spacing:.25em;color:#c99a3e;margin-bottom:16px}.library-nav{position:fixed;z-index:20;top:0;left:0;right:0;background:rgba(7,7,6,.94);border-bottom:1px solid rgba(241,207,120,.18);backdrop-filter:blur(14px);padding:13px 5vw;display:flex;justify-content:space-between;gap:15px}.library-nav a{font:900 8px Rajdhani,sans-serif;letter-spacing:.16em;text-transform:uppercase;text-decoration:none}.${extra}</style></head><body><nav class="library-nav"><a href="/suno">LIL SYNN / SUNO V6</a><a href="/suno/complete">MASTER REFERENCE</a></nav><main class="library-page"><div class="crumb">LIL SYNN / SUNO V6 KNOWLEDGE SYSTEM</div>${body}</main></body></html>`;

async function main(){
  const tree=JSON.parse(await get(`https://api.github.com/repos/${GUIDE}/git/trees/main?recursive=1`));
  const files=tree.tree.filter(x=>x.type==='blob' && /\.md$/i.test(x.path));
  const outRoot=path.join(SUNO,'library');
  await fs.rm(outRoot,{recursive:true,force:true});
  await fs.mkdir(outRoot,{recursive:true});
  const index=[];
  for(let i=0;i<files.length;i+=4){
    const batch=files.slice(i,i+4);
    await Promise.all(batch.map(async f=>{
      const md=await get(`https://raw.githubusercontent.com/${GUIDE}/main/${f.path.split('/').map(encodeURIComponent).join('/')}`);
      const slug=f.path.replace(/\.md$/i,'');
      const dir=path.join(outRoot,slug);
      await fs.mkdir(dir,{recursive:true});
      const first=(md.match(/^#\s+(.+)$/m)||[])[1]||path.basename(slug);
      const body=`<h1>${inline(first)}</h1>${render(md)}`;
      await fs.writeFile(path.join(dir,'index.html'),shell(first,body),'utf8');
      index.push({path:f.path,slug,title:first});
    }));
  }
  index.sort((a,b)=>a.path.localeCompare(b.path));
  const links=index.map(x=>`<a class="doc-card" href="/suno/library/${x.slug}/"><b>${esc(x.title)}</b><span>${esc(x.path)}</span></a>`).join('');
  await fs.writeFile(path.join(outRoot,'index.html'),shell('Complete Suno V6 Document Library',`<h1>Complete Suno V6 Document Library</h1><p>Every Markdown document in the current Suno knowledge repository is rendered into this website. No repository handoff is required to read the material.</p><div class="doc-grid">${links}</div}`,`.doc-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}.doc-card{display:block;text-decoration:none;border:1px solid rgba(241,207,120,.16);background:#0d0c09;padding:18px}.doc-card b{display:block;color:#f1cf78;font:400 20px Georgia,serif}.doc-card span{display:block;margin-top:8px;color:#716b62;font:800 8px Rajdhani,sans-serif;letter-spacing:.12em}@media(max-width:700px){.doc-grid{grid-template-columns:1fr}}`),'utf8');

  const aliases={
    'controls':'guides/sliders','troubleshooting':'guides/troubleshooting','prompting':'guides/prompting','lyrics':'guides/lyrics','styles':'guides/styles','audio':'guides/audio','editing':'guides/editing','production':'guides/production','sliders':'guides/sliders','stems':'guides/stems','studio':'guides/studio','midi':'guides/midi','effects':'guides/effects','automation':'guides/automation','rights':'guides/rights'
  };
  for(const [route,target] of Object.entries(aliases)){
    const dir=path.join(SUNO,route); await fs.mkdir(dir,{recursive:true});
    await fs.writeFile(path.join(dir,'index.html'),shell(route.replace(/-/g,' '),`<script>location.replace('/suno/library/${target}/');</script><p><a href="/suno/library/${target}/">Open ${esc(route)}</a></p>`),'utf8');
  }
  const customDir=path.join(SUNO,'customs','models'); await fs.mkdir(customDir,{recursive:true});
  const customDoc=index.find(x=>/custom/i.test(x.path) && /model/i.test(x.path));
  const customBody=customDoc?`<script>location.replace('/suno/library/${customDoc.slug}/');</script><h1>Custom Models</h1><p>Opening the complete Custom Models documentation.</p>`:`<h1>Custom Models</h1><p>Custom Models documentation is included in the complete document library.</p><a href="/suno/library/README/">Open the master reference →</a>`;
  await fs.writeFile(path.join(customDir,'index.html'),shell('Custom Models',customBody),'utf8');
  console.log(`Suno sync: rendered ${index.length} Markdown documents into /Suno/library`);
}
main().catch(err=>{console.error(err);process.exit(1)});
