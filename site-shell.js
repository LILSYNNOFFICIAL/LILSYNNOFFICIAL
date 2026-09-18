(()=>{'use strict';
const path=location.pathname.toLowerCase().replace(/\/$/,'')||'/';
const routePath=path.replace(/\.html$/,'');
const indexPage=path==='/'||routePath==='/index';
const excluded=new Set(['/suno','/backup']);
const vote=new Set(['/vote']);
if(excluded.has(routePath))return;
const navGroups=[
 {label:'MUSIC',items:[['RELEASES','/releases.html'],['ARCHIVE','/archive.html'],['UPCOMING','/coming_soon.html'],['MUSIC','/#music']]},
 {label:'VISUALS',items:[['GALLERY','/gallery.html'],['VIDEOS','/videos.html'],['FEATURED VISUALS','/#videos']]},
 {label:'UNIVERSE',items:[['THE UNIVERSE','/universe.html'],['LORE','/lore.html'],['SIGNAL','/#universe']]},
 {label:'RECORDS',items:[['SYNTIENT RECORDS','/syntient_records/'],['RECORDS ARCHIVE','/archive.html']]},
 {label:'MORE',items:[['CONTACT','/#signal'],['SUNO GUIDE','/suno'],['FORUM','https://suno-forum.base44.app']]}
];
const ctas=[['PRE-SAVE','/releases.html','ls-presave'],['VOTE 4 LIL SYNN','/vote','ls-vote']];
const social=[['SPOTIFY','https://open.spotify.com/artist/6ozcOAnRAUPn3z5c0GR5kU','/assets/images/icons/spotify.svg'],['APPLE MUSIC','https://music.apple.com/us/artist/lil-synn/1850720041','/assets/images/icons/apple-music.svg'],['YOUTUBE','https://www.youtube.com/@LILSYNNOFFICIAL','/assets/images/icons/youtube.svg'],['INSTAGRAM','https://www.instagram.com/lilsynnofficial/','/assets/images/icons/instagram.svg'],['TIKTOK','https://www.tiktok.com/@lilsynnofficial','/assets/images/icons/tiktok.svg'],['X','https://x.com/lilsynnofficial','/assets/images/icons/twitter.svg'],['FACEBOOK','https://www.facebook.com/lilsynnofficial','/assets/images/icons/facebook.svg'],['SOUNDCLOUD','https://soundcloud.com/lilsynnofficial','/assets/images/icons/soundcloud.svg']];
function injectCss(){if(document.getElementById('ls-canonical-css'))return;const l=document.createElement('link');l.id='ls-canonical-css';l.rel='stylesheet';l.href='/site-shell.css?v=20260918';document.head.appendChild(l)}
function bg(){if(indexPage&&document.getElementById('site-stars-bg'))return;if(document.getElementById('ls-bg-layer'))return;const d=document.createElement('div');d.id='ls-bg-layer';d.setAttribute('aria-hidden','true');d.innerHTML='<video id="ls-shell-stars" autoplay muted loop playsinline preload="auto" aria-hidden="true"><source src="/assets/mov/LS_BG_STARS.webm" type="video/webm"></video>';document.body.prepend(d);const v=d.querySelector('video');v.muted=true;v.defaultMuted=true;v.play().catch(()=>{});document.addEventListener('visibilitychange',()=>{if(!document.hidden)v.play().catch(()=>{})})}
const shapes=[
'<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="42"/><circle cx="50" cy="50" r="25"/><path d="M50 8L86 71H14Z"/><path d="M50 92L14 29H86Z"/></svg>',
'<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="43"/><polygon points="50,7 87,72 13,72"/><polygon points="50,93 13,28 87,28"/><circle cx="50" cy="50" r="10"/></svg>',
'<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="40"/><path d="M50 10L90 50L50 90L10 50Z"/><path d="M50 20L80 50L50 80L20 50Z"/><circle cx="50" cy="50" r="8"/></svg>',
'<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="39"/><path d="M50 6L61 39L94 50L61 61L50 94L39 61L6 50L39 39Z"/><circle cx="50" cy="50" r="18"/></svg>',
'<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="41"/><polygon points="50,8 60,40 92,50 60,60 50,92 40,60 8,50 40,40"/><circle cx="50" cy="50" r="27"/></svg>'
];
function rand(a,b){return a+Math.random()*(b-a)}
function particles(){
 let root=document.querySelector('.ls-particles');
 if(!root){root=document.createElement('div');root.className='ls-particles';root.setAttribute('aria-hidden','true');document.body.prepend(root)}
 if(root.dataset.lsReady==='1')return;
 root.dataset.lsReady='1';
 const count=window.innerWidth<600?24:window.innerWidth<1000?32:42;
 const items=[];
 for(let i=0;i<count;i++){
  const p=document.createElement('i');
  const depth=rand(.35,1);
  p.style.setProperty('--s',`${rand(1,3.8)*depth}px`);
  p.style.setProperty('--hue',Math.floor(rand(0,360)));
  p.style.setProperty('--alpha',rand(.18,.52)*depth);
  root.appendChild(p);
  items.push({el:p,x:rand(-20,innerWidth+20),y:rand(-20,innerHeight+20),vx:rand(-8,8),vy:rand(-7,7),phase:rand(0,Math.PI*2),wobble:rand(.4,1.5),depth});
 }
 const tick=(now)=>{
  if(!document.hidden){
   const last=particles._last??now;const dt=Math.min(.04,Math.max(.001,(now-last)/1000));particles._last=now;
   for(const q of items){
    q.phase+=dt*q.wobble;
    q.vx+=Math.cos(q.phase*.73)*.35*dt;
    q.vy+=Math.sin(q.phase*.61)*.35*dt;
    q.vx=Math.max(-12,Math.min(12,q.vx));q.vy=Math.max(-12,Math.min(12,q.vy));
    q.x+=q.vx*dt;q.y+=q.vy*dt;
    const m=30;
    if(q.x<-m)q.x=innerWidth+m;if(q.x>innerWidth+m)q.x=-m;
    if(q.y<-m)q.y=innerHeight+m;if(q.y>innerHeight+m)q.y=-m;
    const twinkle=.82+.18*Math.sin(q.phase*1.7);
    q.el.style.transform=`translate3d(${q.x}px,${q.y}px,0) scale(${twinkle})`;
    q.el.style.opacity=(.72*twinkle*q.depth).toFixed(3);
   }
  } else particles._last=now;
  requestAnimationFrame(tick);
 };
 requestAnimationFrame(tick);
}
function geometry(){
 let layer=document.getElementById('ls-geometry-layer');
 if(layer?.dataset.lsReady==='1')return;
 if(!layer){layer=document.createElement('div');layer.id='ls-geometry-layer';layer.setAttribute('aria-hidden','true');document.body.prepend(layer)}
 layer.dataset.lsReady='1';
 const count=window.innerWidth<600?10:window.innerWidth<1000?14:18;const items=[];
 for(let i=0;i<count;i++){
  const s=document.createElement('span');s.innerHTML=shapes[i%shapes.length];const depth=rand(.28,1);
  s.style.setProperty('--size',`${rand(34,92)*depth+18}px`);
  s.style.setProperty('--hue',Math.floor(rand(180,335)));
  s.style.setProperty('--alpha',rand(.10,.28)*depth);
  s.style.setProperty('--glow',rand(.08,.22)*depth);
  layer.appendChild(s);
  const angle=rand(0,Math.PI*2),speed=rand(4,13)*depth,spin=rand(-8,8);
  items.push({el:s,x:rand(-120,innerWidth+120),y:rand(-120,innerHeight+120),vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,rot:rand(0,360),vr:spin,phase:rand(0,Math.PI*2),wobble:rand(.25,1),depth});
 }
 const tick=(now)=>{
  if(!document.hidden){
   const last=geometry._last??now;const dt=Math.min(.04,Math.max(.001,(now-last)/1000));geometry._last=now;
   for(const q of items){
    q.phase+=dt*q.wobble;
    const side=Math.sin(q.phase)*3.5*dt, cross=Math.cos(q.phase*.71)*3.5*dt;
    q.x+=q.vx*dt+side;q.y+=q.vy*dt+cross;q.rot+=q.vr*dt;
    const margin=150;
    if(q.x<-margin)q.x=innerWidth+margin;if(q.x>innerWidth+margin)q.x=-margin;
    if(q.y<-margin)q.y=innerHeight+margin;if(q.y>innerHeight+margin)q.y=-margin;
    const breathe=1+.045*Math.sin(q.phase*1.3);
    q.el.style.transform=`translate3d(${q.x}px,${q.y}px,0) rotate(${q.rot}deg) scale(${breathe})`;
   }
  } else geometry._last=now;
  requestAnimationFrame(tick);
 };
 requestAnimationFrame(tick);
}
function orbGalaxy(){
 const orb=document.querySelector('.hero-ring');if(!orb||orb.querySelector('.ls-orb-galaxy'))return;
 const g=document.createElement('div');g.className='ls-orb-galaxy';g.setAttribute('aria-hidden','true');g.innerHTML='<span></span><i></i>';orb.appendChild(g);
}
function menu(){if(indexPage||document.querySelector('.ls-canonical-topbar'))return;
const h=document.createElement('header');h.className='ls-canonical-topbar';
h.innerHTML=`<div class="ls-nav-inner"><a class="ls-brand" href="/" aria-label="LIL SYNN home"><b>LIL</b> SYNN</a><nav class="ls-desktop-nav" aria-label="Primary navigation">${navGroups.map(g=>`<span class="ls-nav-group"><button class="ls-nav-drop" type="button" aria-expanded="false" aria-haspopup="true">${g.label} <span>▾</span></button><span class="ls-nav-dropdown" role="menu">${g.items.map(([t,u])=>`<a href="${u}" role="menuitem"${u.startsWith('http')?' target="_blank" rel="noopener noreferrer"':''}>${t}</a>`).join('')}</span></span>`).join('')}<span class="ls-nav-ctas">${ctas.map(([t,u,c])=>`<a class="ls-nav-cta ${c}" href="${u}">${t}</a>`).join('')}</span></nav></div>`;
document.body.prepend(h);
const groups=[...h.querySelectorAll('.ls-nav-group')];
const close=()=>groups.forEach(g=>{g.classList.remove('open');g.querySelector('button').setAttribute('aria-expanded','false')});
groups.forEach(g=>{const b=g.querySelector('button');b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();const open=!g.classList.contains('open');close();if(open){g.classList.add('open');b.setAttribute('aria-expanded','true')}});g.addEventListener('mouseenter',()=>{if(innerWidth>900){close();g.classList.add('open');b.setAttribute('aria-expanded','true')}})});
document.addEventListener('click',e=>{if(!e.target.closest('.ls-nav-group'))close()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
const mobile=document.createElement('aside');mobile.id='ls-mobile-menu';mobile.setAttribute('aria-hidden','true');mobile.innerHTML=`<nav>${navGroups.map(g=>`<div class="ls-mobile-group"><strong>${g.label}</strong>${g.items.map(([t,u])=>`<a href="${u}">${t}</a>`).join('')}</div>`).join('')}<div class="ls-mobile-ctas">${ctas.map(([t,u,c])=>`<a class="ls-nav-cta ${c}" href="${u}">${t}</a>`).join('')}</div></nav>`;document.body.appendChild(mobile)}
function footer(){if(!indexPage&&document.querySelector('.ls-canonical-footer'))return;if(indexPage){const f=document.querySelector('.footer');if(!f)return;if(!f.querySelector('.ls-footer-social-icons')){const wrap=document.createElement('div');wrap.className='ls-footer-social-icons';wrap.setAttribute('aria-label','LIL SYNN official platforms');wrap.innerHTML=social.map(([t,u,img])=>`<a href="${u}" target="_blank" rel="noopener noreferrer" aria-label="${t}" title="${t}"><img src="${img}" alt="${t}"></a>`).join('');const bottom=f.querySelector('.footer-bottom');(bottom||f).before(wrap)}if(!f.querySelector('a[href="/lore"]')){const a=document.createElement('a');a.href='/lore';a.textContent='LORE';a.setAttribute('aria-label','LIL SYNN lore');const legal=f.querySelector('.footer-legal,.legal,.footer-links,nav');(legal||f).appendChild(a)}return}const f=document.createElement('footer');f.className='ls-canonical-footer';f.innerHTML=`<div class="ls-footer-brand"><b>LIL</b> SYNN</div><div class="ls-footer-tag">Dark sound. Raw emotion. No limits</div><nav class="ls-footer-links"><a href="/">HOME</a><a href="/releases.html">RELEASES</a><a href="/archive.html">ARCHIVE</a><a href="/gallery.html">GALLERY</a><a href="/videos.html">VIDEOS</a><a href="/universe.html">UNIVERSE</a><a href="/#signal">CONTACT</a><a href="/#signal">SYNN SIGNAL</a><a href="/lore">LORE</a><a href="/vote">VOTE 4 LIL SYNN</a></nav><div class="ls-footer-social-icons" aria-label="LIL SYNN official platforms">${social.map(([t,u,img])=>`<a href="${u}" target="_blank" rel="noopener noreferrer" aria-label="${t}" title="${t}"><img src="${img}" alt="${t}"></a>`).join('')}</div><nav class="ls-footer-legal"><a href="/privacy.html">PRIVACY</a><a href="/terms.html">TERMS</a></nav><div class="ls-footer-copy">© ${new Date().getFullYear()} LIL SYNN</div>`;document.body.appendChild(f)}
function normalize(){document.querySelectorAll('a[href]').forEach(a=>{const h=a.getAttribute('href');if(h==='/vote#contact'||h==='/vote.html#contact'||h==='/index.html/contact')a.setAttribute('href','/#signal')})}
function init(){injectCss();if(!indexPage&&!vote.has(routePath)){document.querySelectorAll('.topbar,.nav-stack,.menu-panel').forEach(x=>x.remove())}bg();particles();geometry();orbGalaxy();if(vote.has(routePath)){document.querySelectorAll('.topbar,.nav-stack,.menu-panel,.footer').forEach(x=>x.remove());document.body.classList.add('ls-vote-canonical-page')}else{menu();footer()}normalize();document.body.classList.add('ls-canonical-page')}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();