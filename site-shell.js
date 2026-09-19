(()=>{'use strict';
const path=location.pathname.toLowerCase().replace(/\/$/,'')||'/';
const route=path.replace(/\.html$/,'');
const indexPage=path==='/'||route==='/index';
const excluded=new Set(['/suno','/backup']);
if(excluded.has(route)) return;
const nav=[['HOME','/'],['MUSIC','/#music'],['VIDEOS','/#videos'],['GALLERY','/gallery.html'],['UNIVERSE','/#universe'],['CONTACT','/#signal'],['FORUM','https://lilsynn-suno.base44.app']];
const more=[['RELEASES','/releases.html'],['VOTE 4 LIL SYNN','/vote'],['UPCOMING','/coming_soon.html'],['SUNO GUIDE','/suno'],['ARCHIVE','/archive.html'],['THE SIGNAL','/#signal'],['LORE','/lore']];
const social=[['SPOTIFY','https://open.spotify.com/artist/6ozcOAnRAUPn3z5c0GR5kU','/assets/images/icons/spotify.svg'],['APPLE MUSIC','https://music.apple.com/us/artist/lil-synn/1850720041','/assets/images/icons/apple-music.svg'],['YOUTUBE','https://www.youtube.com/@LILSYNNOFFICIAL','/assets/images/icons/youtube.svg'],['INSTAGRAM','https://www.instagram.com/lilsynnofficial/','/assets/images/icons/instagram.svg'],['TIKTOK','https://www.tiktok.com/@lilsynnofficial','/assets/images/icons/tiktok.svg'],['X','https://x.com/lilsynnofficial','/assets/images/icons/twitter.svg'],['FACEBOOK','https://www.facebook.com/lilsynnofficial','/assets/images/icons/facebook.svg'],['SOUNDCLOUD','https://soundcloud.com/lilsynnofficial','/assets/images/icons/soundcloud.svg']];
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function injectCss(){if(document.getElementById('ls-canonical-css'))return;const l=document.createElement('link');l.id='ls-canonical-css';l.rel='stylesheet';l.href='/site-shell.css?v=20260918';document.head.appendChild(l)}
function bg(){if(document.getElementById('ls-bg-layer'))return;const d=document.createElement('div');d.id='ls-bg-layer';d.setAttribute('aria-hidden','true');d.innerHTML='<video autoplay muted loop playsinline preload="auto" aria-hidden="true"><source src="/assets/mov/LS_BG_STARS.webm" type="video/webm"></video>';document.body.prepend(d);const v=d.querySelector('video');v.muted=true;v.defaultMuted=true;v.play().catch(()=>{})}
function particles(){let root=document.querySelector('.ls-particles');if(!root){root=document.createElement('div');root.className='ls-particles';root.setAttribute('aria-hidden','true');document.body.prepend(root)}if(root.dataset.lsReady==='1')return;root.dataset.lsReady='1';const count=innerWidth<600?32:innerWidth<1000?44:56,items=[];for(let i=0;i<count;i++){const p=document.createElement('i'),depth=.35+Math.random()*.65;p.style.setProperty('--s',((1+Math.random()*2.8)*depth)+'px');p.style.setProperty('--hue',Math.floor(Math.random()*360));p.style.setProperty('--alpha',(.30+Math.random()*.38)*depth);root.appendChild(p);items.push({el:p,x:-20+Math.random()*(innerWidth+40),y:-20+Math.random()*(innerHeight+40),vx:-8+Math.random()*16,vy:-7+Math.random()*14,phase:Math.random()*Math.PI*2,w:.4+Math.random()*1.1,d:depth})}const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;if(reduced)return;let last=performance.now();const tick=now=>{const dt=Math.min(.04,Math.max(.001,(now-last)/1000));last=now;if(!document.hidden)for(const q of items){q.phase+=dt*q.w;q.x+=q.vx*dt;q.y+=q.vy*dt;if(q.x<-30)q.x=innerWidth+30;if(q.x>innerWidth+30)q.x=-30;if(q.y<-30)q.y=innerHeight+30;if(q.y>innerHeight+30)q.y=-30;const t=.82+.18*Math.sin(q.phase*1.7);q.el.style.transform='translate3d('+q.x+'px,'+q.y+'px,0) scale('+t+')';q.el.style.opacity=(.72*t*q.d).toFixed(3)}requestAnimationFrame(tick)};requestAnimationFrame(tick)}
const shapes=['<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="42"/><circle cx="50" cy="50" r="25"/><path d="M50 8L86 71H14Z"/><path d="M50 92L14 29H86Z"/></svg>','<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="43"/><polygon points="50,7 87,72 13,72"/><polygon points="50,93 13,28 87,28"/><circle cx="50" cy="50" r="10"/></svg>','<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40"/><path d="M50 10L90 50L50 90L10 50Z"/><path d="M50 20L80 50L50 80L20 50Z"/><circle cx="50" cy="50" r="8"/></svg>'];
function geometry(){let layer=document.getElementById('ls-geometry-layer');if(layer?.dataset.lsReady==='1')return;if(!layer){layer=document.createElement('div');layer.id='ls-geometry-layer';layer.setAttribute('aria-hidden','true');document.body.prepend(layer)}layer.dataset.lsReady='1';const count=innerWidth<600?10:innerWidth<1000?15:20,items=[];for(let i=0;i<count;i++){const s=document.createElement('span');s.innerHTML=shapes[i%shapes.length];const d=.28+Math.random()*.72;s.style.setProperty('--size',(52*d+30)+'px');s.style.setProperty('--hue',Math.floor(180+Math.random()*155));s.style.setProperty('--alpha',(.18+Math.random()*.22)*d);s.style.setProperty('--glow',(.08+Math.random()*.14)*d);layer.appendChild(s);items.push({el:s,x:-120+Math.random()*(innerWidth+240),y:-120+Math.random()*(innerHeight+240),vx:-13+Math.random()*26,vy:-13+Math.random()*(26),r:Math.random()*360,vr:-8+Math.random()*16})}const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;if(reduced)return;let last=performance.now();const tick=now=>{const dt=Math.min(.04,Math.max(.001,(now-last)/1000));last=now;if(!document.hidden)for(const q of items){q.x+=q.vx*dt;q.y+=q.vy*dt;q.r+=q.vr*dt;if(q.x<-150)q.x=innerWidth+150;if(q.x>innerWidth+150)q.x=-150;if(q.y<-150)q.y=innerHeight+150;if(q.y>innerHeight+150)q.y=-150;q.el.style.transform='translate3d('+q.x+'px,'+q.y+'px,0) rotate('+q.r+'deg)'}requestAnimationFrame(tick)};requestAnimationFrame(tick)}
async function injectTemplate(){
  if(document.querySelector('[data-ls-template-applied]'))return;
  try{
    const res=await fetch('/template.html?template=20260919',{cache:'no-store'});
    if(!res.ok)throw new Error('template fetch '+res.status);
    const html=await res.text();
    const doc=new DOMParser().parseFromString(html,'text/html');
    const headStyles=[...doc.head.querySelectorAll('style')];
    for(const s of headStyles){const x=document.createElement('style');x.id=s.id||'';x.textContent=s.textContent;document.head.appendChild(x)}
    if(!document.querySelector('link[data-ls-template-shell]')){const l=document.createElement('link');l.rel='stylesheet';l.href='/site-shell.css?v=20260919';l.dataset.lsTemplateShell='1';document.head.appendChild(l)}
    const header=doc.querySelector('[data-ls-global-header]');
    const menu=doc.querySelector('#ls-template-menu');
    const footer=doc.querySelector('[data-ls-global-footer]');
    if(!header||!menu||!footer)throw new Error('template shell incomplete');
    const legacy=['.topbar','.nav-stack','.menu-panel','#menuPanel','.ls-canonical-topbar','.ls-canonical-footer','#ls-mobile-menu','#ls-bg-layer','.ls-particles','#ls-geometry-layer','#signal-geometry-layer'];
    legacy.forEach(sel=>document.querySelectorAll(sel).forEach(el=>{if(el!==header&&el!==footer)el.remove()}));
    const content=document.createElement('main');content.id='template-content';content.dataset.lsTemplateContent='1';
    const movable=[...document.body.children];
    for(const el of movable){if(el.tagName==='SCRIPT'&&el.src&&el.src.includes('/site-shell.js'))continue;if(el===header||el===menu||el===footer)continue;content.appendChild(el)}
    document.body.replaceChildren();
    const h=header.cloneNode(true),m=menu.cloneNode(true),ftr=footer.cloneNode(true);
    h.dataset.lsTemplateApplied='1';document.body.append(h,m,content,ftr);
    const open=m.querySelector('#ls-template-menu-open'),close=m.querySelector('#ls-template-menu-close');
    const setMenu=v=>{m.classList.toggle('open',v);m.setAttribute('aria-hidden',String(!v));if(open){open.setAttribute('aria-expanded',String(v));open.setAttribute('aria-label',v?'Close navigation menu':'Open navigation menu')}document.body.style.overflow=v?'hidden':''};
    if(open)open.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();setMenu(!m.classList.contains('open'))});
    if(close)close.addEventListener('click',()=>setMenu(false));
    m.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
    document.addEventListener('keydown',e=>{if(e.key==='Escape')setMenu(false)});
    const cats=[...h.querySelectorAll('.ls-template-cat')];
    const closeCats=except=>cats.forEach(cat=>{if(cat!==except){cat.classList.remove('open');cat.querySelector('button')?.setAttribute('aria-expanded','false')}});
    cats.forEach(cat=>{const b=cat.querySelector('button');if(!b)return;b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();const openNow=!cat.classList.contains('open');closeCats(cat);cat.classList.toggle('open',openNow);b.setAttribute('aria-expanded',String(openNow))})});
    document.addEventListener('click',e=>{if(!e.target.closest('.ls-template-cat'))closeCats(null)});
    document.addEventListener('keydown',e=>{if(e.key==='Escape')closeCats(null)});
    normalize();
  }catch(err){console.error('[LIL SYNN] Universal template injection failed:',err)}
}
function normalize(){document.querySelectorAll('a[href]').forEach(a=>{const h=a.getAttribute('href');if(h==='/vote#contact'||h==='/vote.html#contact'||h==='/index.html/contact')a.setAttribute('href','/#signal')})}
function init(){injectCss();bg();particles();geometry();if(!indexPage)signalGeometry();header();footer();normalize();document.body.classList.add('ls-canonical-page')}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
/* 2026-09-19: universal template injection; /suno and /backup remain excluded. */
