(()=>{
const $=(s,c=document)=>c.querySelector(s),$$=(s,c=document)=>[...c.querySelectorAll(s)];
const topics=[['V6 FUNDAMENTALS','/suno/v6'],['PROMPT ENGINEERING','/suno/prompting'],['LYRICS ENGINEERING','/suno/lyrics'],['STYLE CONSTRUCTION','/suno/styles'],['CREATIVE CONTROLS','/suno/sliders'],['VOICES & IDENTITY','/suno/voices'],['SURGICAL EDITING','/suno/editing'],['AUDIO & REFERENCES','/suno/audio'],['STEMS & REMASTER','/suno/stems'],['STUDIO 2.0','/suno/studio'],['MIDI & WAVETABLE','/suno/midi'],['EFFECTS & PLUGINS','/suno/effects'],['AUTOMATION','/suno/automation'],['PRODUCTION SYSTEM','/suno/production'],['DIAGNOSTICS','/suno/troubleshooting'],['RIGHTS & RELEASE','/suno/rights']];
const deep=[['ULTIMATE CONTROL','/suno/deep-dives/ultimate-control'],['EVERYTHING EXPANSION','/suno/deep-dives/everything-expansion'],['FINAL CURRENT EXPANSION','/suno/deep-dives/final-current-expansion'],['COVERAGE AUDIT','/suno/deep-dives/coverage-audit'],['GAPS CLOSURE','/suno/deep-dives/gaps-closure'],['ALL REMAINING CURRENT','/suno/deep-dives/gap-closure-all-remaining'],['ADDITIONAL CURRENT DETAILS','/suno/deep-dives/additional-current-details']];
const links=items=>items.map(([label,href])=>`<a href="${href}">${label}</a>`).join('');
const navHTML=`<div class="header-inner"><a class="brand" href="/suno" aria-label="LIL SYNN Suno V6 Guide home"><span>LIL SYNN</span><b>SUNO V6</b></a><nav class="site-nav" id="site-nav" aria-label="Guide navigation"><div class="nav-group"><button class="nav-trigger" type="button" aria-expanded="false" aria-controls="reader-create">CREATE <span>⌄</span></button><div class="nav-menu" id="reader-create">${links(topics.slice(0,4).concat(topics.slice(7,8)))}</div></div><div class="nav-group"><button class="nav-trigger" type="button" aria-expanded="false" aria-controls="reader-control">CONTROL <span>⌄</span></button><div class="nav-menu" id="reader-control">${links(topics.slice(4,7))}</div></div><div class="nav-group"><button class="nav-trigger" type="button" aria-expanded="false" aria-controls="reader-produce">PRODUCE <span>⌄</span></button><div class="nav-menu" id="reader-produce">${links(topics.slice(8))}</div></div><div class="nav-group"><button class="nav-trigger" type="button" aria-expanded="false" aria-controls="reader-research">RESEARCH <span>⌄</span></button><div class="nav-menu" id="reader-research">${links(deep)}</div></div><a class="nav-complete" href="/suno/complete">COMPLETE GUIDE</a></nav><button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav" aria-label="Open guide navigation"><span></span><span></span><span></span><b>MENU</b></button></div>`;
const header=$('.site-header');
if(header&&!header.querySelector('.header-inner'))header.innerHTML=navHTML;
const canonical=/^https?:\/\/(?:www\.)?github\.com\/LILSYNNOFFICIAL\/LIL-SYNN-s-Complete-Suno-V6-Guide/i;
const rawCanonical=/^https?:\/\/raw\.githubusercontent\.com\/LILSYNNOFFICIAL\/LIL-SYNN-s-Complete-Suno-V6-Guide/i;
$$('a').forEach(a=>{if(canonical.test(a.href)||rawCanonical.test(a.href)){a.href='/suno';a.removeAttribute('target');a.removeAttribute('rel');if(!a.textContent.trim())a.textContent='SUNO GUIDE';}});
const normalize=p=>{const path=(p||'/').replace(/\/+$/,'')||'/';return path.toLowerCase();};
const current=normalize(location.pathname);
$$('.nav-menu a,.nav-complete').forEach(a=>{if(normalize(a.getAttribute('href'))===current){a.setAttribute('aria-current','page');a.closest('.nav-group')?.classList.add('active');}});
const nav=$('.nav-toggle'),menu=$('#site-nav');
function closeGroups(except=null){$$('.nav-group').forEach(g=>{if(g!==except)g.classList.remove('open');const b=$('.nav-trigger',g);if(b)b.setAttribute('aria-expanded',String(g===except&&g.classList.contains('open')));});}
$$('.nav-trigger').forEach(btn=>btn.addEventListener('click',e=>{e.stopPropagation();const group=btn.closest('.nav-group');const open=group.classList.toggle('open');closeGroups(open?group:null);btn.setAttribute('aria-expanded',String(open));}));
if(nav&&menu)nav.addEventListener('click',e=>{if(e.target.closest('.nav-trigger'))return;const open=menu.classList.toggle('open');nav.setAttribute('aria-expanded',String(open));nav.setAttribute('aria-label',open?'Close guide navigation':'Open guide navigation');if(!open)closeGroups();});
document.addEventListener('click',e=>{if(!e.target.closest('.nav-group')&&!e.target.closest('.nav-toggle'))closeGroups();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeGroups();menu?.classList.remove('open');nav?.setAttribute('aria-expanded','false');nav?.setAttribute('aria-label','Open guide navigation');}});
$$('.nav-menu a,.nav-complete').forEach(a=>a.addEventListener('click',()=>{closeGroups();menu?.classList.remove('open');nav?.setAttribute('aria-expanded','false');nav?.setAttribute('aria-label','Open guide navigation');}));
const input=$('#guide-search'),cards=$$('.guide-card'),chips=$$('.filter-chip');let filter='all';
function apply(){const q=(input?.value||'').trim().toLowerCase();let shown=0;cards.forEach(card=>{const okFilter=filter==='all'||card.dataset.category===filter;const hay=((card.dataset.search||'')+' '+card.textContent).toLowerCase();const show=okFilter&&(!q||hay.includes(q));card.hidden=!show;if(show)shown++;});const empty=$('#no-results');if(empty)empty.hidden=shown!==0;if(input)input.setAttribute('aria-label',`Search guide library${q?`, ${shown} results`:''}`);}
if(input){input.setAttribute('role','searchbox');input.addEventListener('input',apply);}chips.forEach(chip=>chip.addEventListener('click',()=>{chips.forEach(x=>x.classList.remove('active'));chip.classList.add('active');filter=chip.dataset.filter||'all';apply();}));
$$('.accordion-trigger').forEach(btn=>btn.addEventListener('click',()=>{const panel=document.getElementById(btn.getAttribute('aria-controls'));const open=btn.getAttribute('aria-expanded')==='true';btn.setAttribute('aria-expanded',String(!open));if(panel)panel.hidden=open;}));
const top=$('.back-to-top');if(top)top.addEventListener('click',()=>window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'}));

let searchIndex=null;
const searchBoxStyles='position:fixed;inset:0;z-index:9999;background:rgba(5,5,4,.92);backdrop-filter:blur(12px);display:flex;align-items:flex-start;justify-content:center;padding:10vh 18px 30px;overflow:auto;';
function openGlobalResults(query){
  if(!query||!searchIndex)return;
  const q=query.trim().toLowerCase();
  if(q.length<2)return;
  let overlay=$('#global-search-results');
  if(!overlay){overlay=document.createElement('div');overlay.id='global-search-results';overlay.style.cssText=searchBoxStyles;document.body.appendChild(overlay);overlay.addEventListener('click',e=>{if(e.target===overlay)overlay.remove();});}
  const matches=searchIndex.entries.map(e=>{const hay=(e.title+' '+e.kicker+' '+e.text).toLowerCase();let score=0;if(hay.includes(q))score+=2;if(e.title.toLowerCase().includes(q))score+=8;return {...e,score};}).filter(e=>e.score).sort((a,b)=>b.score-a.score).slice(0,24);
  overlay.innerHTML=`<div style="width:min(980px,100%);border:1px solid rgba(201,154,62,.24);background:#0b0a08;box-shadow:0 24px 80px rgba(0,0,0,.55)"><div style="display:flex;justify-content:space-between;gap:20px;padding:18px 20px;border-bottom:1px solid rgba(201,154,62,.12)"><div><div style="color:#c99a3e;font-size:9px;font-weight:900;letter-spacing:.18em">GLOBAL GUIDE SEARCH</div><div style="color:#80786d;font-size:11px;margin-top:5px">${matches.length} result${matches.length===1?'':'s'} for “${q.replace(/</g,'&lt;')}”</div></div><button id="global-search-close" type="button" style="background:none;border:0;color:#c99a3e;font-size:20px;cursor:pointer">×</button></div><div style="padding:10px">${matches.length?matches.map((e,i)=>`<a href="${e.href}" style="display:block;padding:15px 14px;text-decoration:none;border-bottom:1px solid rgba(201,154,62,.08)"><div style="color:#c99a3e;font-size:8px;letter-spacing:.16em;font-weight:900">${e.kicker}</div><div style="color:#eee9df;font:400 23px Georgia,serif;margin:5px 0">${e.title}</div><div style="color:#81796e;font-size:12px;line-height:1.55">${e.text.slice(Math.max(0,e.text.toLowerCase().indexOf(q)-90),Math.max(0,e.text.toLowerCase().indexOf(q)-90)+260).replace(/</g,'&lt;')}</div></a>`).join(''):`<div style="padding:35px;color:#80786d;text-align:center">No matching content was found across the indexed guide.</div>`}</div></div>`;
  $('#global-search-close')?.addEventListener('click',()=>overlay.remove());
}
fetch('/suno/search-index.json',{cache:'no-store'}).then(r=>r.ok?r.json():null).then(data=>{searchIndex=data;}).catch(()=>{});
if(input){let timer;input.addEventListener('input',()=>{clearTimeout(timer);timer=setTimeout(()=>openGlobalResults(input.value),260);});input.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();openGlobalResults(input.value);}});}

function injectLivePanel(){
  fetch('/suno/manifest.json',{cache:'no-store'}).then(r=>r.ok?r.json():null).then(m=>{
    if(!m||$('#suno-live-panel'))return;
    const anchor=$('.source-status')||$('.hero');if(!anchor)return;
    const panel=document.createElement('section');panel.id='suno-live-panel';panel.className='section';panel.style.cssText='border-top:1px solid rgba(201,154,62,.14);border-bottom:1px solid rgba(201,154,62,.14);display:grid;grid-template-columns:1fr 1fr;gap:40px;';
    panel.innerHTML=`<div><p class="eyebrow">WHAT’S NEW / LIVE BUILD</p><h2 style="margin:0;font:400 clamp(36px,4.5vw,58px)/.98 Georgia,serif">Fresh from the <em>source.</em></h2><p style="color:#8f877b;max-width:680px">The guide is regenerated from the canonical source set at build time. This build contains ${m.coreTopics} core topics, ${m.deepDives} research deep dives and ${m.completeDocuments} full-source documents.</p></div><div style="border-left:1px solid rgba(201,154,62,.14);padding-left:30px;align-self:center"><div style="color:#c99a3e;font-size:8px;font-weight:900;letter-spacing:.16em">LATEST SYNCHRONIZATION</div><div style="color:#eee9df;font:400 28px Georgia,serif;margin:8px 0">${m.syncDate}</div><div style="color:#71695f;font-size:11px">Search now spans the entire indexed guide, including the deep-dive source documents.</div></div>`;
    anchor.insertAdjacentElement('afterend',panel);
  }).catch(()=>{});
}
injectLivePanel();
})();