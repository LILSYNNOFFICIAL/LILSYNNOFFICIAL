(()=>{'use strict';
const path=location.pathname.toLowerCase().replace(/\/$/,'')||'/';
const routePath=path.replace(/\.html$/,'');
const indexPage=path==='/'||routePath==='/index';
const excluded=new Set(['/suno','/backup']);
const vote=routePath==='/vote';
if(excluded.has(routePath))return;

const navGroups=[
 {label:'MUSIC',items:[['RELEASES','/releases.html'],['ARCHIVE','/archive.html'],['UPCOMING','/coming_soon.html'],['MUSIC','/#music']]},
 {label:'VISUALS',items:[['GALLERY','/gallery.html'],['VIDEOS','/videos.html'],['FEATURED VISUALS','/#videos']]},
 {label:'UNIVERSE',items:[['THE UNIVERSE','/universe.html'],['LORE','/lore.html'],['SIGNAL','/#universe']]},
 {label:'RECORDS',items:[['SYNTIENT RECORDS','/syntient_records/'],['RECORDS ARCHIVE','/archive.html']]},
 {label:'MORE',items:[['CONTACT','/#signal'],['SPECIAL ACCESS','/special_access.html'],['SUNO GUIDE','/suno'],['FORUM','https://suno-forum.base44.app']]}
];
const ctas=[['PRE-SAVE','/releases.html','ls-presave'],['VOTE 4 LIL SYNN','/vote','ls-vote']];
const social=[
 ['SPOTIFY','https://open.spotify.com/artist/6ozcOAnRAUPn3z5c0GR5kU','/assets/images/icons/spotify.svg'],
 ['APPLE MUSIC','https://music.apple.com/us/artist/lil-synn/1850720041','/assets/images/icons/apple-music.svg'],
 ['YOUTUBE','https://www.youtube.com/@LILSYNNOFFICIAL','/assets/images/icons/youtube.svg'],
 ['INSTAGRAM','https://www.instagram.com/lilsynnofficial/','/assets/images/icons/instagram.svg'],
 ['TIKTOK','https://www.tiktok.com/@lilsynnofficial','/assets/images/icons/tiktok.svg'],
 ['X','https://x.com/lilsynnofficial','/assets/images/icons/twitter.svg'],
 ['FACEBOOK','https://www.facebook.com/lilsynnofficial','/assets/images/icons/facebook.svg'],
 ['SOUNDCLOUD','https://soundcloud.com/lilsynnofficial','/assets/images/icons/soundcloud.svg']
];
const hamburgerGroups=[
 ['HOME',[['HOME','/']]],
 ['MUSIC',navGroups[0].items],
 ['VISUALS',navGroups[1].items],
 ['UNIVERSE',navGroups[2].items],
 ['RECORDS',navGroups[3].items],
 ['MORE',navGroups[4].items],
 ['OFFICIAL',[['VOTE 4 LIL SYNN','/vote'],['PRE-SAVE','/releases.html']]]
];

function injectCss(){
 if(document.getElementById('ls-canonical-css'))return;
 const l=document.createElement('link');l.id='ls-canonical-css';l.rel='stylesheet';l.href='/site-shell.css?v=20260918';document.head.appendChild(l);
}
function bg(){
 if(indexPage&&document.getElementById('site-stars-bg'))return;
 if(document.getElementById('ls-bg-layer'))return;
 const d=document.createElement('div');d.id='ls-bg-layer';d.setAttribute('aria-hidden','true');
 d.innerHTML='<video id="ls-shell-stars" autoplay muted loop playsinline preload="auto" aria-hidden="true"><source src="/assets/mov/LS_BG_STARS.webm" type="video/webm"></video>';
 document.body.prepend(d);const v=d.querySelector('video');v.muted=true;v.defaultMuted=true;v.play().catch(()=>{});
}
const shapes=[
 '<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="42"/><circle cx="50" cy="50" r="25"/><path d="M50 8L86 71H14Z"/><path d="M50 92L14 29H86Z"/></svg>',
 '<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="43"/><polygon points="50,7 87,72 13,72"/><polygon points="50,93 13,28 87,28"/><circle cx="50" cy="50" r="10"/></svg>',
 '<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="40"/><path d="M50 10L90 50L50 90L10 50Z"/><path d="M50 20L80 50L50 80L20 50Z"/><circle cx="50" cy="50" r="8"/></svg>'
];
const rand=(a,b)=>a+Math.random()*(b-a);
function particles(){
 let root=document.querySelector('.ls-particles');if(!root){root=document.createElement('div');root.className='ls-particles';root.setAttribute('aria-hidden','true');document.body.prepend(root)}
 if(root.dataset.lsReady==='1')return;root.dataset.lsReady='1';
 const count=innerWidth<600?24:innerWidth<1000?32:42,items=[];
 for(let i=0;i<count;i++){const p=document.createElement('i'),depth=rand(.35,1);p.style.setProperty('--s',rand(1,3.8)*depth+'px');p.style.setProperty('--hue',Math.floor(rand(0,360)));p.style.setProperty('--alpha',rand(.18,.52)*depth);root.appendChild(p);items.push({el:p,x:rand(-20,innerWidth+20),y:rand(-20,innerHeight+20),vx:rand(-8,8),vy:rand(-7,7),phase:rand(0,Math.PI*2),wobble:rand(.4,1.5),depth})}
 const tick=now=>{if(!document.hidden){const last=particles._last??now,dt=Math.min(.04,Math.max(.001,(now-last)/1000));particles._last=now;for(const q of items){q.phase+=dt*q.wobble;q.vx+=Math.cos(q.phase*.73)*.35*dt;q.vy+=Math.sin(q.phase*.61)*.35*dt;q.vx=Math.max(-12,Math.min(12,q.vx));q.vy=Math.max(-12,Math.min(12,q.vy));q.x+=q.vx*dt;q.y+=q.vy*dt;const m=30;if(q.x<-m)q.x=innerWidth+m;if(q.x>innerWidth+m)q.x=-m;if(q.y<-m)q.y=innerHeight+m;if(q.y>innerHeight+m)q.y=-m;const tw=.82+.18*Math.sin(q.phase*1.7);q.el.style.transform='translate3d('+q.x+'px,'+q.y+'px,0) scale('+tw+')';q.el.style.opacity=(.72*tw*q.depth).toFixed(3)}}else particles._last=now;requestAnimationFrame(tick)};requestAnimationFrame(tick);
}
function geometry(){
 let layer=document.getElementById('ls-geometry-layer');if(layer?.dataset.lsReady==='1')return;if(!layer){layer=document.createElement('div');layer.id='ls-geometry-layer';layer.setAttribute('aria-hidden','true');document.body.prepend(layer)}layer.dataset.lsReady='1';
 const count=innerWidth<600?10:innerWidth<1000?14:18,items=[];
 for(let i=0;i<count;i++){const s=document.createElement('span');s.innerHTML=shapes[i%shapes.length];const depth=rand(.28,1);s.style.setProperty('--size',rand(34,92)*depth+18+'px');s.style.setProperty('--hue',Math.floor(rand(180,335)));s.style.setProperty('--alpha',rand(.10,.28)*depth);s.style.setProperty('--glow',rand(.08,.22)*depth);layer.appendChild(s);const angle=rand(0,Math.PI*2),speed=rand(4,13)*depth;items.push({el:s,x:rand(-120,innerWidth+120),y:rand(-120,innerHeight+120),vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,rot:rand(0,360),vr:rand(-8,8),phase:rand(0,Math.PI*2),wobble:rand(.25,1)})}
 const tick=now=>{if(!document.hidden){const last=geometry._last??now,dt=Math.min(.04,Math.max(.001,(now-last)/1000));geometry._last=now;for(const q of items){q.phase+=dt*q.wobble;q.x+=q.vx*dt+Math.sin(q.phase)*3.5*dt;q.y+=q.vy*dt+Math.cos(q.phase*.71)*3.5*dt;q.rot+=q.vr*dt;const m=150;if(q.x<-m)q.x=innerWidth+m;if(q.x>innerWidth+m)q.x=-m;if(q.y<-m)q.y=innerHeight+m;if(q.y>innerHeight+m)q.y=-m;q.el.style.transform='translate3d('+q.x+'px,'+q.y+'px,0) rotate('+q.rot+'deg)'}}else geometry._last=now;requestAnimationFrame(tick)};requestAnimationFrame(tick);
}
function orbGalaxy(){const orb=document.querySelector('.hero-ring');if(!orb||orb.querySelector('.ls-orb-galaxy'))return;const g=document.createElement('div');g.className='ls-orb-galaxy';g.setAttribute('aria-hidden','true');g.innerHTML='<span></span><i></i>';orb.appendChild(g)}

function renderHorizontalNav(host){
 if(!host||host.dataset.lsNavReady==='1')return;
 host.dataset.lsNavReady='1';
 host.innerHTML=navGroups.map(g=>'<div class="ls-nav-group"><button class="ls-nav-drop" type="button" aria-expanded="false" aria-haspopup="true">'+g.label+' <span aria-hidden="true">▾</span></button><div class="ls-nav-dropdown" role="menu">'+g.items.map(([t,u])=>'<a href="'+u+'" role="menuitem"'+(u.startsWith('http')?' target="_blank" rel="noopener noreferrer"':'')+'>'+t+'</a>').join('')+'</div></div>').join('')+'<span class="ls-nav-ctas">'+ctas.map(([t,u,c])=>'<a class="ls-nav-cta '+c+'" href="'+u+'">'+t+'</a>').join('')+'</span>';
 const groups=[...host.querySelectorAll('.ls-nav-group')];
 const close=()=>groups.forEach(g=>{g.classList.remove('open');g.querySelector('button').setAttribute('aria-expanded','false')});
 groups.forEach(g=>{const b=g.querySelector('button');b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();const open=!g.classList.contains('open');close();if(open){g.classList.add('open');b.setAttribute('aria-expanded','true')}});g.addEventListener('mouseenter',()=>{if(innerWidth>900){close();g.classList.add('open');b.setAttribute('aria-expanded','true')}})});
 document.addEventListener('click',e=>{if(!e.target.closest('.ls-nav-group'))close()});document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
}

function buildGlobalHeader(){
 let h=document.querySelector('[data-ls-global-header],.ls-canonical-topbar');
 if(!h){h=document.createElement('header');h.className='ls-canonical-topbar';h.setAttribute('data-ls-global-header','true');document.body.prepend(h)}
 if(h.dataset.lsShellReady==='1')return h;
 h.dataset.lsShellReady='1';
 if(!h.querySelector('.ls-header-main'))h.innerHTML='<div class="ls-header-main"><a class="ls-brand" href="/" aria-label="LIL SYNN home"><img src="/assets/images/icons/LS_LOGO.png" alt="LIL SYNN"></a><button class="ls-menu-toggle" id="ls-menu-toggle" type="button" aria-label="Open navigation" aria-controls="ls-global-menu" aria-expanded="false">☰</button></div><div class="ls-header-navrow"><nav class="ls-desktop-nav" aria-label="Primary navigation"></nav></div><div class="ls-header-art" aria-hidden="true"><img src="/assets/img/LS.png" alt=""></div>';
 renderHorizontalNav(h.querySelector('.ls-desktop-nav'));
 const button=h.querySelector('#ls-menu-toggle');
 button?.addEventListener('click',e=>{e.preventDefault();const m=document.getElementById('ls-global-menu');if(m)toggleGlobalMenu(!m.classList.contains('open'))});
 return h;
}
function buildHamburger(){
 let m=document.getElementById('ls-global-menu');if(!m){m=document.createElement('aside');m.id='ls-global-menu';m.className='ls-global-menu';document.body.append(m)}
 if(m.dataset.lsReady==='1')return m;m.dataset.lsReady='1';
 m.innerHTML='<div class="ls-menu-head"><button class="ls-menu-close" id="ls-menu-close" type="button" aria-label="Close navigation">×</button></div><nav class="ls-menu-nav" aria-label="Menu navigation">'+hamburgerGroups.map(([label,items])=>'<div class="ls-menu-group"><button class="ls-menu-group-toggle" type="button" aria-expanded="false">'+label+' <span>▾</span></button><div class="ls-menu-drop">'+items.map(([t,u])=>'<a href="'+u+'"'+(u.startsWith('http')?' target="_blank" rel="noopener noreferrer"':'')+'>'+t+'</a>').join('')+'</div></div>').join('')+'<div class="ls-menu-group"><button class="ls-menu-group-toggle" type="button" aria-expanded="false">SOCIALS <span>▾</span></button><div class="ls-menu-drop">'+social.map(([t,u])=>'<a href="'+u+'" target="_blank" rel="noopener noreferrer">'+t+'</a>').join('')+'</div></div></nav>';
 const close=()=>toggleGlobalMenu(false);
 m.querySelector('#ls-menu-close').addEventListener('click',close);
 m.querySelectorAll('.ls-menu-group-toggle').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();const g=b.closest('.ls-menu-group'),open=!g.classList.contains('open');g.classList.toggle('open',open);b.setAttribute('aria-expanded',String(open))}));
 m.querySelectorAll('a[href]').forEach(a=>a.addEventListener('click',()=>toggleGlobalMenu(false)));
 return m;
}
function toggleGlobalMenu(open){
 const m=document.getElementById('ls-global-menu'),b=document.getElementById('ls-menu-toggle');if(!m)return;
 m.classList.toggle('open',open);m.setAttribute('aria-hidden',String(!open));if(b){b.setAttribute('aria-expanded',String(open));b.setAttribute('aria-label',open?'Close navigation':'Open navigation')}
 document.body.classList.toggle('ls-menu-open',open);
}
function calm(){
 if(document.getElementById('lilSynnCalm'))return;
 const a=document.createElement('audio');a.id='bgMusic';a.src='/assets/other/sound/Background.mp3';a.loop=true;a.preload='metadata';a.style.display='none';document.body.append(a);
 let st={};try{st=JSON.parse(localStorage.getItem('lilSynnTheCalmStateV4')||'{}')||{}}catch{}
 if(Number.isFinite(st.volume))a.volume=st.volume;if(typeof st.muted==='boolean')a.muted=st.muted;
 const p=document.createElement('div');p.id='lilSynnCalm';p.innerHTML='<strong>THE CALM <span>• LIL SYNN</span></strong><button type="button" data-calm-toggle aria-label="Play or pause The Calm">▶</button><input data-calm-seek type="range" min="0" max="100" value="0" step=".1" aria-label="The Calm progress"><input data-calm-volume type="range" min="0" max="1" value=".65" step=".01" aria-label="The Calm volume"><button type="button" data-calm-mute aria-label="Mute The Calm">🔊</button>';
 const f=document.querySelector('footer');(f?f.parentNode:document.body).insertBefore(p,f||null);
 const t=p.querySelector('[data-calm-toggle]'),m=p.querySelector('[data-calm-mute]'),v=p.querySelector('[data-calm-volume]'),s=p.querySelector('[data-calm-seek]');
 v.value=a.muted?0:a.volume;m.textContent=a.muted?'🔇':'🔊';
 const save=()=>{try{localStorage.setItem('lilSynnTheCalmStateV4',JSON.stringify({time:a.currentTime||0,playing:!a.paused,volume:a.volume,muted:a.muted}))}catch{}};
 t.onclick=()=>{a.paused?a.play().catch(()=>{}):a.pause();save()};m.onclick=()=>{a.muted=!a.muted;m.textContent=a.muted?'🔇':'🔊';save()};v.oninput=e=>{a.volume=+e.target.value;a.muted=a.volume===0;save()};s.oninput=e=>{if(a.duration)a.currentTime=+e.target.value/100*a.duration};
 a.ontimeupdate=()=>{if(a.duration)s.value=a.currentTime/a.duration*100};a.onvolumechange=()=>{v.value=a.muted?0:a.volume;m.textContent=a.muted||a.volume===0?'🔇':'🔊'};a.onplay=()=>t.textContent='❚❚';a.onpause=()=>t.textContent='▶';
 if(Number.isFinite(st.time)){const r=()=>{if(!a.duration||st.time<a.duration)a.currentTime=st.time};a.readyState>=1?r():a.addEventListener('loadedmetadata',r,{once:true})}
 if(st.playing)a.play().catch(()=>{});
}
function footer(){
 let f=document.querySelector('[data-ls-global-footer],footer.footer');
 if(!f){f=document.createElement('footer');f.className='footer ls-site-footer';f.setAttribute('data-ls-global-footer','true');document.body.append(f)}
 if(f.dataset.lsFooterReady==='1')return;f.dataset.lsFooterReady='1';
 if(!f.querySelector('.footer-inner'))f.innerHTML='<div class="footer-inner"><div class="footer-main"><div><div class="footer-brand">LIL SYNN<span>THE OFFICIAL DIGITAL HOME</span></div><a class="ls-footer-headphones" href="/special_access.html" aria-label="Special Access"><img src="/assets/images/icons/LS_HEADPHONES.png" alt="Special Access"></a></div><nav class="footer-links" aria-label="Footer navigation"><a href="/">OFFICIAL SITE</a><a href="/releases.html">RELEASES</a><a href="/coming_soon.html">UPCOMING</a><a href="/archive.html">ARCHIVE</a><a href="/gallery.html">GALLERY</a><a href="/videos.html">VIDEOS</a><a href="/universe.html">UNIVERSE</a><a href="/special_access.html">SPECIAL ACCESS</a><a href="/suno">SUNO GUIDE</a><a href="https://suno-forum.base44.app" target="_blank" rel="noopener noreferrer">FORUM</a><a href="/privacy.html">PRIVACY</a><a href="/terms.html">TERMS</a></nav><a class="footer-suno" href="/suno"><small>CREATOR TOOL / KNOWLEDGE BASE</small><strong>SUNO GUIDE →</strong><p>Prompting, controls, production, editing, diagnostics and the complete creator reference.</p></a></div><div class="ls-footer-social-icons" aria-label="LIL SYNN official platforms"></div><div class="footer-bottom"><span>© '+new Date().getFullYear()+' LIL SYNN · SYNTIENT RECORDS</span><span><a href="/suno">SUNO GUIDE</a> · <a href="/">OFFICIAL SITE</a> · <a href="#top">BACK TO TOP ↑</a></span></div></div>';
 const socialRoot=f.querySelector('.ls-footer-social-icons');if(socialRoot&&!socialRoot.children.length)socialRoot.innerHTML=social.map(([t,u,img])=>'<a href="'+u+'" target="_blank" rel="noopener noreferrer" aria-label="'+t+'" title="'+t+'"><img src="'+img+'" alt="'+t+'"></a>').join('');
}
function normalize(){document.querySelectorAll('a[href]').forEach(a=>{const h=a.getAttribute('href');if(h==='/vote#contact'||h==='/vote.html#contact'||h==='/index.html/contact')a.setAttribute('href','/#signal')})}
function init(){
 injectCss();
 document.querySelectorAll('.topbar,.nav-stack,.menu-panel').forEach(x=>x.remove());
 bg();particles();geometry();orbGalaxy();
 buildGlobalHeader();buildHamburger();calm();footer();normalize();
 document.body.classList.add('ls-canonical-page');
 if(routePath==='/template')document.body.classList.add('ls-template-page');
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();