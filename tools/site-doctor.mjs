import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root=process.cwd();
const errors=[];const warnings=[];
const exists=p=>fs.existsSync(path.join(root,p));
const fail=m=>errors.push(m);const warn=m=>warnings.push(m);
const htmlFiles=fs.readdirSync(root).filter(x=>x.endsWith('.html'));
const jsFiles=[];
const walk=dir=>{for(const entry of fs.readdirSync(dir,{withFileTypes:true})){if(['.git','node_modules'].includes(entry.name))continue;const full=path.join(dir,entry.name);if(entry.isDirectory())walk(full);else if(entry.name.endsWith('.js')||entry.name.endsWith('.mjs'))jsFiles.push(full)}};
walk(root);

for(const file of htmlFiles){
 const html=fs.readFileSync(path.join(root,file),'utf8');
 if(!/site-global\.js(?:\?|["'])/.test(html))fail(`${file}: missing global shell script`);
 const globalScripts=[...html.matchAll(/<script\b[^>]*src=["']\/?site-global\.js[^"']*["'][^>]*>/gi)];
 if(globalScripts.length>1)fail(`${file}: duplicate explicit site-global.js scripts`);
 const globalCss=[...html.matchAll(/<link\b[^>]*href=["']\/?site-global\.css[^"']*["'][^>]*>/gi)];
 if(globalCss.length>1)fail(`${file}: duplicate explicit site-global.css links`);
 const descriptions=[...html.matchAll(/<meta\b[^>]*name=["']description["'][^>]*>/gi)];
 if(descriptions.length>1)fail(`${file}: duplicate meta description tags`);
 const canonicals=[...html.matchAll(/<link\b[^>]*rel=["']canonical["'][^>]*>/gi)];
 if(canonicals.length>1)fail(`${file}: duplicate canonical links`);
 if(['archive.html','release.html','gallery.html','universe.html'].includes(file)&&!exists('release-catalog.json'))fail(`${file}: release catalog dependency missing`);
 if(!/<main\b/i.test(html))warn(`${file}: no main landmark found; verify accessibility intent`);
 for(const m of html.matchAll(/(?:src|href)=["']([^"'#?]+)(?:\?[^"']*)?["']/gi)){const ref=m[1];if(!ref.startsWith('/')||ref.startsWith('//')||/^(https?:|mailto:|tel:|data:|javascript:)/i.test(ref))continue;const local=ref.slice(1);if(local.includes('['))continue;if(!exists(local))fail(`${file}: missing local asset/reference ${ref}`)}
 if(/id=["']sideMenu["']|aria-label=["']Primary navigation["']|homepage-final-fixes\.js/i.test(html))fail(`${file}: legacy shell marker detected`);
}

if(!exists('release-catalog.json'))fail('release-catalog.json missing');
if(exists('release-catalog.json')){try{const c=JSON.parse(fs.readFileSync('release-catalog.json','utf8'));if(!Array.isArray(c.order)||!c.order.length)fail('release-catalog.json: order is empty');const dup=c.order.filter((x,i,a)=>a.indexOf(x)!==i);if(dup.length)fail(`release-catalog.json: duplicate release order entries: ${[...new Set(dup)].join(', ')}`);if(!c.groups||typeof c.groups!=='object')warn('release-catalog.json: groups object missing');if(Array.isArray(c.order)&&c.groups){for(const title of c.order){const group=c.groups[title];if(group&&(!Array.isArray(group.tracks)||!group.tracks.length))fail(`release-catalog.json: group ${title} has no tracks`);}}}catch(e){fail(`release-catalog.json: invalid JSON (${e.message})`)}}

for(const file of jsFiles){try{execFileSync(process.execPath,['--check',file],{stdio:'pipe'})}catch{fail(`${path.relative(root,file)}: JavaScript syntax check failed`)}}

const css=exists('site-global.css')?fs.readFileSync('site-global.css','utf8'):'';
if(css.includes('var(--glow)'))fail('site-global.css: undefined --glow variable');
if(css.includes('LG_BG_STARS.webm')||css.includes('BG_ANI.webm'))fail('site-global.css: stale background asset reference detected');
if(!exists('assets/mov/LS_BG_STARS.webm'))fail('assets/mov/LS_BG_STARS.webm missing');
if(!exists('assets/images/icons/LS_LOGO.png'))fail('LS_LOGO.png missing');
if(!exists('assets/images/icons/LS_HEADPHONES.png'))fail('LS_HEADPHONES.png missing');
for(const required of ['archive.html','release.html','gallery.html','universe.html','latest-releases.js','music-random.js'])if(!exists(required))fail(`${required} missing`);
if(exists('transmissions.json')){try{const t=JSON.parse(fs.readFileSync('transmissions.json','utf8'));if(!Array.isArray(t.transmissions))fail('transmissions.json: transmissions array missing')}catch(e){fail(`transmissions.json: invalid JSON (${e.message})`)}}

console.log(`LIL SYNN SITE DOCTOR: ${htmlFiles.length} HTML files, ${jsFiles.length} JS modules scanned.`);
for(const w of warnings)console.log(`⚠ ${w}`);
for(const e of errors)console.error(`✖ ${e}`);
if(errors.length){console.error(`\nSTATUS: FAILED (${errors.length} error${errors.length===1?'':'s'})`);process.exit(1)}
console.log('STATUS: PASS');
