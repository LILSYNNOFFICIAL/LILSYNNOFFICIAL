import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root=process.cwd();const errors=[];const warnings=[];
const exists=p=>fs.existsSync(path.join(root,p));
const fail=m=>errors.push(m);const warn=m=>warnings.push(m);
const htmlFiles=fs.readdirSync(root).filter(x=>x.endsWith('.html'));
const jsFiles=[];
const walk=dir=>{for(const entry of fs.readdirSync(dir,{withFileTypes:true})){if(['.git','node_modules','Suno'].includes(entry.name))continue;const full=path.join(dir,entry.name);if(entry.isDirectory())walk(full);else if(entry.name.endsWith('.js')||entry.name.endsWith('.mjs'))jsFiles.push(full)}};
walk(root);

const canonicalPages=new Set(['/archive.html','/releases.html','/gallery.html','/universe.html','/release.html','/special_access.html','/privacy.html','/terms.html','/coming_soon.html','/videos.html']);
const backgroundOnlyPages=new Set(['/vote.html']);
const virtualRoutes=new Set(['/vote','/vote/','/suno','/suno/','/command','/command/','/admin','/admin/','/site-doctor','/site-doctor/']);
const checkInlineScript=(file,code,index)=>{const temp=path.join(os.tmpdir(),`lilsynn-inline-${process.pid}-${index}.js`);try{fs.writeFileSync(temp,code,'utf8');execFileSync(process.execPath,['--check',temp],{stdio:'pipe'})}catch{fail(`${file}: inline JavaScript syntax check failed (script ${index})`)}finally{try{fs.unlinkSync(temp)}catch{}}};

for(const file of htmlFiles){
 const html=fs.readFileSync(path.join(root,file),'utf8');
 const route=`/${file}`;
 const isCanonicalPage=canonicalPages.has(route);
 const isBackgroundOnly=backgroundOnlyPages.has(route);
 const standaloneHome=file==='index.html'&&/LIL SYNN — THE SIGNAL/i.test(html)&&/homepage-final-fix\.js/i.test(html);
 const standalone404=file==='404.html';

 if(isCanonicalPage&&!/<script\\b[^>]*src=["'](?:\\.\\/)?\\/?site-shell\\.js(?:\?[^"']*)?["'][^>]*>/i.test(html))fail(`${file}: missing canonical site-shell.js`);
 if(isBackgroundOnly&&!/<script\b[^>]*src=["'](?:\\.\\/)?\\/?site-shell\\.js(?:\?[^"']*)?["'][^>]*>/i.test(html))fail(`${file}: vote background shell missing site-shell.js`);
 const shellSource=file==='template.html'||file==='template_bu.html';\n if(!shellSource&&file!=='site-health.html'&&!standaloneHome&&!standalone404&&/site-global(?:\.js|\.css)/i.test(html))fail(`${file}: legacy site-global shell reference detected`);

 const globalScripts=[...html.matchAll(/<script\b[^>]*src=["']\/?site-global\.js[^"']*["'][^>]*>/gi)];
 if(globalScripts.length)fail(`${file}: legacy site-global.js reference detected`);
 const globalCss=[...html.matchAll(/<link\b[^>]*href=["']\/?site-global\.css[^"']*["'][^>]*>/gi)];
 if(globalCss.length)fail(`${file}: legacy site-global.css reference detected`);
 const descriptions=[...html.matchAll(/<meta\b[^>]*name=["']description["'][^>]*>/gi)];
 if(descriptions.length>1)fail(`${file}: duplicate meta description tags`);
 const canonicals=[...html.matchAll(/<link\b[^>]*rel=["']canonical["'][^>]*>/gi)];
 if(canonicals.length>1)fail(`${file}: duplicate canonical links`);
 if(['archive.html','release.html','gallery.html','universe.html'].includes(file)&&!exists('release-catalog.json'))fail(`${file}: release catalog dependency missing`);
 if(!/<main\b/i.test(html))warn(`${file}: no main landmark found; verify accessibility intent`);
 let inlineIndex=0;
 for(const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)){if(/\bsrc\s*=/.test(match[1]))continue;const code=match[2].trim();if(code)checkInlineScript(file,code,++inlineIndex)}
 for(const m of html.matchAll(/(?:src|href)=["']([^"'#?]+)(?:\?[^"']*)?["']/gi)){const ref=m[1];if(!ref.startsWith('/')||ref.startsWith('//')||/^(https?:|mailto:|tel:|data:|javascript:)/i.test(ref))continue;if(ref==='/_vercel/insights/script.js')continue;if(virtualRoutes.has(ref))continue;const local=ref.slice(1);if(local.includes('['))continue;if(!exists(local))fail(`${file}: missing local asset/reference ${ref}`)}
 if(!shellSource&&/id=["']sideMenu["']|aria-label=["']Primary navigation["']|homepage-final-fixes\.js/i.test(html))fail(`${file}: legacy shell marker detected`);
}

if(!exists('release-catalog.json'))fail('release-catalog.json missing');
if(exists('release-catalog.json')){try{const c=JSON.parse(fs.readFileSync('release-catalog.json','utf8'));if(!Array.isArray(c.order)||!c.order.length)fail('release-catalog.json: order is empty');const dup=c.order.filter((x,i,a)=>a.indexOf(x)!==i);if(dup.length)fail(`release-catalog.json: duplicate release order entries: ${[...new Set(dup)].join(', ')}`);if(!c.groups||typeof c.groups!=='object')warn('release-catalog.json: groups object missing');if(Array.isArray(c.order)&&c.groups){for(const title of c.order){const group=c.groups[title];if(group&&(!Array.isArray(group.tracks)||!group.tracks.length))fail(`release-catalog.json: group ${title} has no tracks`);}}}catch(e){fail(`release-catalog.json: invalid JSON (${e.message})`)}}

for(const file of jsFiles){try{execFileSync(process.execPath,['--check',file],{stdio:'pipe'})}catch{fail(`${path.relative(root,file)}: JavaScript syntax check failed`)}}

if(!exists('site-shell.js'))fail('site-shell.js missing');
if(!exists('site-shell.css'))fail('site-shell.css missing');
if(!exists('assets/mov/LS_BG_STARS.webm'))fail('assets/mov/LS_BG_STARS.webm missing');
if(!exists('assets/images/icons/LS_LOGO.png'))fail('LS_LOGO.png missing');
if(!exists('assets/images/icons/LS_HEADPHONES.png'))fail('LS_HEADPHONES.png missing');
for(const required of ['archive.html','release.html','gallery.html','universe.html','latest-releases.js','music-random.js','site-polish.js'])if(!exists(required))fail(`${required} missing`);
if(exists('site-global.js'))fail('site-global.js must remain removed; canonical shell is site-shell.js');
if(exists('site-global.css'))fail('site-global.css must remain removed; canonical shell is site-shell.css');
if(exists('latest-releases.js')){const l=fs.readFileSync('latest-releases.js','utf8');for(const platform of ['SPOTIFY','APPLE MUSIC','YOUTUBE'])if(!l.includes(`stream('${platform}'`))fail(`latest-releases.js: ${platform} CTA missing`);}
if(exists('transmissions.json')){try{const t=JSON.parse(fs.readFileSync('transmissions.json','utf8'));if(!Array.isArray(t.transmissions))fail('transmissions.json: transmissions array missing')}catch(e){fail(`transmissions.json: invalid JSON (${e.message})`)}}

const sunoDoctor=path.join(root,'Suno','scripts','suno-site-doctor.mjs');
if(!fs.existsSync(sunoDoctor))warn('Suno Site Doctor unavailable — /Suno health could not be checked. Main site checks continue normally.');
else{try{execFileSync(process.execPath,[sunoDoctor],{cwd:root,stdio:'pipe'});console.log('Suno Site Doctor: PASS (non-blocking health signal)')}catch(error){const detail=String(error?.stderr||error?.stdout||'').trim().split(/\r?\n/).filter(Boolean).slice(-1)[0]||'see /Suno/scripts/suno-site-doctor.mjs for details';warn(`Suno Site Doctor FAILED — ${detail}. This is warning-only and does not block the main site.`)}}

console.log(`LIL SYNN SITE DOCTOR: ${htmlFiles.length} HTML files, ${jsFiles.length} JS modules scanned.`);
for(const w of warnings)console.log(`⚠ ${w}`);
for(const e of errors)console.error(`✖ ${e}`);
if(errors.length){console.error(`\nSTATUS: FAILED (${errors.length} error${errors.length===1?'':'s'})`);process.exit(1)}
console.log('STATUS: PASS');
