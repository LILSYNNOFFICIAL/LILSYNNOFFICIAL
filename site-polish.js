(()=>{
const run=async()=>{
 const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
 const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const key=s=>String(s||'').toLowerCase().normalize('NFKD').replace(/[’']/g,'').replace(/[^a-z0-9]/g,'');
 const release=document.getElementById('presave');
 let catalog=null, appleByTitle=new Map(), artFiles=[];
 try{
   const stamp=Date.now();
   const [cr,ar,ap]=await Promise.all([
     fetch(`/release-catalog.json?homepage_refresh=${stamp}`,{cache:'no-store'}),
     fetch(`https://api.github.com/repos/LILSYNNOFFICIAL/LILSYNNOFFICIAL/contents/assets/images/icons/album_art?ref=main&_=${stamp}`,{cache:'no-store'}),
     fetch(`https://itunes.apple.com/lookup?id=1850720041&entity=song&limit=200&_=${stamp}`,{cache:'no-store'})
   ]);
   if(cr.ok)catalog=await cr.json();
   if(ar.ok){const j=await ar.json();artFiles=(Array.isArray(j)?j:[]).filter(x=>x.type==='file'&&/\.(jpg|jpeg|png)$/i.test(x.name));}
   if(ap.ok){const j=await ap.json();for(const x of j.results||[])if(x.wrapperType==='track'&&x.kind==='song'&&String(x.artistName||'').toLowerCase()==='lil synn'&&x.trackName&&x.trackViewUrl)appleByTitle.set(key(x.trackName),x.trackViewUrl)}
 }catch(e){console.warn('Homepage catalog enrichment unavailable',e)}
 const spotifyMap=catalog?.trackSpotify||{};
 const appleSong=title=>key(title)==='rescueyouacousticversion'?'https://music.apple.com/us/song/rescue-you-acoustic-version/6807294984':appleByTitle.get(key(title))||'';
 const artFor=title=>{const exact=key(title);let f=artFiles.find(x=>key(x.name.replace(/^\d+_lil_synn_/i,'').replace(/\.(jpg|jpeg|png)$/i,''))===exact);if(!f)f=artFiles.find(x=>{const n=key(x.name.replace(/\.(jpg|jpeg|png)$/i,''));return n.includes(exact)||exact.includes(n)});return f?`https://raw.githubusercontent.com/LILSYNNOFFICIAL/LILSYNNOFFICIAL/main/assets/images/icons/album_art/${encodeURIComponent(f.name)}`:''};
 const releaseSpotify=title=>{const group=catalog?.groups?.[title],tracks=group?.tracks||[];return spotifyMap[title]||tracks.map(t=>spotifyMap[t]).find(Boolean)||''};
 const releaseApple=title=>{const group=catalog?.groups?.[title],tracks=group?.tracks||[];return appleSong(title)||tracks.map(appleSong).find(Boolean)||''};
 if(release&&catalog?.order?.length){
   const latestThree=catalog.order.slice(0,3),heading=document.createElement('div');heading.className='latest-release-heading';heading.innerHTML='<h2 style="margin:0;text-align:center;font-size:clamp(1.6rem,3vw,2.35rem);font-weight:900;letter-spacing:.14em;color:#fff">LATEST RELEASES</h2><div style="width:72px;height:2px;background:#ff008f;margin:10px auto 24px;box-shadow:0 0 14px rgba(255,0,143,.7)"></div>';release.innerHTML='';release.appendChild(heading);const list=document.createElement('div');list.className='latest-release-list';list.style.cssText='display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px;width:min(100%,900px);margin:0 auto;align-items:start;';latestThree.forEach((title,i)=>{const spotify=releaseSpotify(title),apple=releaseApple(title),art=artFor(title),card=document.createElement('article');card.style.cssText='min-width:0;width:100%;max-width:270px;margin:0 auto;text-align:center;';card.innerHTML=`<div style="aspect-ratio:1/1;background:#090909;overflow:hidden;border-radius:16px;border:1px solid rgba(255,0,143,.28);box-shadow:0 10px 28px rgba(0,0,0,.35)">${art?`<img src="${art}" alt="LIL SYNN — ${esc(title)} artwork" style="width:100%;height:100%;object-fit:cover;display:block" loading="${i===0?'eager':'lazy'}" decoding="async">`:'<div style="width:100%;height:100%;display:grid;place-items:center;color:#555;font-weight:800;letter-spacing:.1em">LIL SYNN</div>'}</div><div style="padding:13px 4px 4px"><div style="font-size:8px;font-weight:800;letter-spacing:.2em;color:#ff008f;text-transform:uppercase;margin-bottom:6px">${i===0?'LATEST RELEASE':'RECENT RELEASE'}</div><h3 style="margin:0 0 11px;font-size:clamp(13px,1.45vw,18px);font-weight:900;letter-spacing:.035em;line-height:1.2;color:#fff">${esc(title).toUpperCase()}</h3><div style="display:flex;justify-content:center;gap:7px;flex-wrap:wrap">${spotify?`<a href="${spotify}" target="_blank" rel="noopener noreferrer" style="display:inline-flex;align-items:center;justify-content:center;background:#1ed760;color:#000;text-decoration:none;font-weight:800;font-size:9px;letter-spacing:.09em;padding:8px 11px;border-radius:8px">SPOTIFY</a>`:''}${apple?`<a href="${apple}" target="_blank" rel="noopener noreferrer" style="display:inline-flex;align-items:center;justify-content:center;background:#ff008f;color:#050505;text-decoration:none;font-weight:800;font-size:9px;letter-spacing:.09em;padding:8px 11px;border-radius:8px">APPLE</a>`:''}</div></div>`;list.appendChild(card)});release.appendChild(list);const responsive=document.createElement('style');responsive.textContent='@media(max-width:760px){.latest-release-list{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:14px!important}.latest-release-list article{max-width:220px!important}}@media(max-width:480px){.latest-release-list{grid-template-columns:1fr!important;max-width:270px!important}.latest-release-list article{max-width:270px!important}}';document.head.appendChild(responsive);
 }
 const videoGrid=document.getElementById('youtube-grid');
 if(videoGrid){
   try{
     const r=await fetch('/api/latest-youtube-releases?refresh='+Date.now(),{cache:'no-store'});
     if(!r.ok) throw new Error('YouTube release feed unavailable');
     const data=await r.json();
     const videos=(data.videos||[]).slice(0,9);
     videoGrid.innerHTML=videos.map(v=>`<article class="glass rounded-3xl overflow-hidden border border-[#ff008f]/30 hover:border-[#ff4fd8]"><div class="relative youtube-card" data-video-id="${v.id}" data-video-title="${esc(v.title)}" style="aspect-ratio:16/9;background:#000;overflow:hidden"><img src="https://i.ytimg.com/vi/${v.id}/hqdefault.jpg" alt="${esc(v.title)}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover" loading="lazy" decoding="async"><button type="button" class="youtube-play-overlay" aria-label="Play ${esc(v.title)}" style="position:absolute;inset:0;width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:transparent;border:0;cursor:pointer"><span style="display:flex;align-items:center;justify-content:center;width:72px;height:72px;border-radius:999px;background:rgba(255,0,143,.94);box-shadow:0 0 28px rgba(255,0,143,.55);color:#fff;font-size:30px;padding-left:5px">▶</span></button></div><div class="p-4 text-sm font-['Rajdhani'] text-center">${esc(v.title)}</div></article>`).join('');
     $$('.youtube-card').forEach(card=>card.querySelector('.youtube-play-overlay')?.addEventListener('click',()=>{const id=card.dataset.videoId,title=card.dataset.videoTitle,iframe=document.createElement('iframe');iframe.title=`LIL SYNN — ${title}`;iframe.src=`https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&playsinline=1&rel=0&modestbranding=1`;iframe.allow='accelerometer; autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture; web-share';iframe.allowFullscreen=true;iframe.referrerPolicy='strict-origin-when-cross-origin';iframe.style.cssText='position:absolute;inset:0;width:100%;height:100%;border:0;display:block;background:#000';card.innerHTML='';card.appendChild(iframe)}));
   }catch(e){console.warn('Dynamic YouTube releases unavailable',e)}
 }
 const hero=document.getElementById('home');if(hero){const tagline=hero.querySelector('p');if(tagline)tagline.textContent='Dark sound. Raw emotion. No limits';const stack=hero.querySelector('.hero-cta-stack'),row=hero.querySelector('.hero-cta-row');if(stack&&row){const actions=[...row.querySelectorAll('a')];actions.filter(a=>a.textContent.trim().toUpperCase()==='PRE-SAVE').forEach(a=>a.remove());const listen=row.querySelector('a[href="#music"]');const vote=hero.querySelector('.hero-vote');if(vote)vote.remove();const presave=document.createElement('a');presave.id='hero-presave-link';presave.href='https://hyperfollow.com/lilsynnofficial';presave.target='_blank';presave.rel='noopener noreferrer';presave.className='inline-block bg-[#ff008f] hover:bg-[#ff4fd8] text-black font-bold px-8 py-3 rounded-xl transition-transform hover:scale-105';presave.textContent='PRE-SAVE';const voteLink=document.createElement('a');voteLink.href='https://tinyurl.com/VOTE-LIL-SYNN';voteLink.target='_blank';voteLink.rel='noopener noreferrer';voteLink.className='inline-block bg-[#ff008f] hover:bg-[#ff4fd8] text-black font-bold px-8 py-3 rounded-xl transition-transform hover:scale-105';voteLink.textContent='VOTE 4 LIL SYNN';row.innerHTML='';if(listen)row.appendChild(listen);row.appendChild(presave);row.appendChild(voteLink);stack.style.display='block';row.style.display='flex';row.style.flexWrap='nowrap';row.style.justifyContent='center';row.style.alignItems='center';row.style.gap='.75rem';const mobile=document.createElement('style');mobile.textContent='@media(max-width:600px){.hero-cta-row{flex-wrap:wrap!important}.hero-cta-row a{padding-left:1rem!important;padding-right:1rem!important;font-size:.8rem!important}}';document.head.appendChild(mobile)}}
 const menu=document.getElementById('sideMenu');if(menu){menu.style.height='100dvh';menu.style.maxHeight='100dvh';menu.style.overflowY='auto';menu.style.overflowX='hidden';menu.style.paddingBottom='2rem';const nav=menu.querySelector('nav');if(nav){nav.style.minHeight='calc(100dvh - 92px)';nav.style.paddingBottom='2rem'}}
 if(location.pathname.endsWith('special_access.html'))for(const h of $$('h2'))if(h.textContent.trim().toUpperCase()==='BLOOPERS & ALT SCENES'){const section=h.closest('.archive'),grid=section?.querySelector('.videos');if(grid){grid.style.display='flex';grid.style.justifyContent='center';grid.style.width='100%';const card=grid.querySelector('.card');if(card)card.style.width='min(100%,760px)'}}
 const spotifyFrame=$('.spotify-player iframe');if(spotifyFrame){spotifyFrame.height=520;spotifyFrame.style.height='520px'}
 const brand=$('nav > .max-w-7xl > a[aria-label="LIL SYNN home"]');if(brand&&!document.querySelector('nav a[data-special-access-icon]')){const icon=brand.querySelector('span[aria-hidden="true"]');if(icon){const a=document.createElement('a');a.href='special_access.html';a.dataset.specialAccessIcon='true';a.className=icon.className;a.style.textDecoration='none';a.textContent='🎧';a.setAttribute('aria-label','Special Access');brand.insertBefore(a,brand.firstChild);icon.remove()}}
 const style=document.createElement('style');style.textContent=`
 .homepage-refinement{position:relative;margin-top:2.5rem;padding:1.35rem 1.5rem;border:1px solid rgba(255,0,143,.24);border-radius:1.5rem;background:linear-gradient(135deg,rgba(255,0,143,.08),rgba(0,0,0,.42));box-shadow:0 16px 50px rgba(0,0,0,.24)}
 .homepage-refinement-kicker{font:700 .72rem Orbitron,sans-serif;letter-spacing:.24em;text-transform:uppercase;color:#ff008f}
 .homepage-refinement-title{margin:.45rem 0 .3rem;font:700 clamp(1.35rem,3vw,2.15rem) Orbitron,sans-serif;letter-spacing:.08em;color:#fff}
 .homepage-refinement-copy{margin:0;color:#bdbdbd;font:400 1.08rem Rajdhani,sans-serif;letter-spacing:.03em}
 .discover-button{display:inline-flex;align-items:center;justify-content:center;margin-top:1rem;padding:.75rem 1.25rem;border-radius:.8rem;background:#ff008f;color:#050505;font:700 .85rem Orbitron,sans-serif;letter-spacing:.08em;text-decoration:none;transition:transform .2s ease,background-color .2s ease}
 .discover-button:hover,.discover-button:focus-visible{background:#ff4fd8;transform:translateY(-2px)}
 .spotify-open-link{display:inline-flex;margin-top:.8rem;padding:.55rem .9rem;border:1px solid rgba(255,0,143,.5);border-radius:.7rem;color:#ff4fd8;text-decoration:none;font:600 .8rem Rajdhani,sans-serif;letter-spacing:.1em}
 .spotify-open-link:hover,.spotify-open-link:focus-visible{color:#fff;border-color:#ff4fd8}
 .about-summary{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:.7rem;margin:1.5rem 0 1rem}
 .about-summary a{padding:.75rem .5rem;border:1px solid rgba(255,0,143,.22);border-radius:.8rem;text-align:center;color:#ddd;text-decoration:none;font:700 .72rem Orbitron,sans-serif;letter-spacing:.06em}
 .about-summary a:hover,.about-summary a:focus-visible{border-color:#ff4fd8;color:#fff}
 .about-details{margin-top:.5rem}
 .about-details[hidden]{display:none}
 .about-toggle{display:inline-flex;align-items:center;justify-content:center;padding:.7rem 1.1rem;border:1px solid rgba(255,0,143,.45);border-radius:.8rem;background:transparent;color:#ff4fd8;font:700 .78rem Orbitron,sans-serif;letter-spacing:.08em;cursor:pointer}
 .about-toggle:hover,.about-toggle:focus-visible{background:rgba(255,0,143,.1);color:#fff}
 .merch-entrance{display:grid;grid-template-columns:minmax(0,1.2fr) minmax(220px,.8fr);gap:1.5rem;align-items:stretch;margin-top:2rem;text-align:left}
 .merch-panel{padding:1.5rem;border-radius:1.5rem;border:1px solid rgba(255,0,143,.24);background:linear-gradient(145deg,rgba(255,0,143,.11),rgba(0,0,0,.55));display:flex;flex-direction:column;justify-content:center}
 .merch-panel h3{margin:0 0 .5rem;font:700 1.3rem Orbitron,sans-serif;letter-spacing:.08em;color:#fff}
 .merch-panel p{margin:0;color:#bdbdbd;font:400 1.05rem Rajdhani,sans-serif}
 .merch-signal-art{min-height:220px;border-radius:1.5rem;border:1px solid rgba(255,0,143,.25);background:radial-gradient(circle at 30% 30%,rgba(255,0,143,.32),transparent 45%),radial-gradient(circle at 70% 70%,rgba(255,79,216,.16),transparent 45%),#050505;display:grid;place-items:center;overflow:hidden}
 .merch-signal-art span{font:700 clamp(1.4rem,4vw,2.5rem) Orbitron,sans-serif;letter-spacing:.18em;color:#fff;text-align:center;text-shadow:0 0 20px rgba(255,0,143,.55)}
 .signal-highlight{padding-top:5.25rem!important;padding-bottom:5.25rem!important}
 .footer-sitemap{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:2rem;max-width:760px;margin:2.2rem auto 0;text-align:left}
 .footer-sitemap h3{margin:0 0 .7rem;color:#ff4fd8;font:700 .78rem Orbitron,sans-serif;letter-spacing:.16em}
 .footer-sitemap a{display:block;margin:.4rem 0;color:#aaa;text-decoration:none;font:400 .95rem Rajdhani,sans-serif}
 .footer-sitemap a:hover,.footer-sitemap a:focus-visible{color:#fff}
 @media(max-width:900px){.about-summary{grid-template-columns:repeat(3,minmax(0,1fr))}.merch-entrance{grid-template-columns:1fr}.footer-sitemap{grid-template-columns:repeat(2,minmax(0,1fr))}}
 @media(max-width:560px){.homepage-refinement{padding:1.1rem}.about-summary{grid-template-columns:repeat(2,minmax(0,1fr))}.footer-sitemap{grid-template-columns:1fr}.signal-highlight{padding-top:4rem!important;padding-bottom:4rem!important}}
 `;document.head.appendChild(style);
 if(release){release.setAttribute('aria-label','Latest releases');}
 const listenHero=hero?.querySelector('.hero-cta-row a[href="#music"]');
 if(listenHero){listenHero.style.boxShadow='0 0 24px rgba(255,0,143,.28)';listenHero.style.transform='scale(1.03)';listenHero.setAttribute('data-primary-cta','true');}
 const spotifyPlayer=$('.spotify-player');
 if(spotifyPlayer){
   const kicker=spotifyPlayer.querySelector('.section-kicker');
   const title=spotifyPlayer.querySelector('h3');
   if(kicker)kicker.textContent='LISTEN TO LIL SYNN';
   if(title)title.textContent='SPOTIFY PLAYER';
   if(!spotifyPlayer.querySelector('.spotify-open-link')){
     const link=document.createElement('a');link.className='spotify-open-link';link.href='https://open.spotify.com/artist/6ozcOAnRAUPn3z5c0GR5kU';link.target='_blank';link.rel='noopener noreferrer';link.textContent='OPEN IN SPOTIFY';
     const wrap=document.createElement('div');wrap.style.textAlign='center';wrap.appendChild(link);spotifyPlayer.appendChild(wrap);
   }
 }
 const music=document.getElementById('music');
 if(music&&!music.querySelector('[data-discover-panel]')){
   const grid=document.getElementById('music-grid');
   const panel=document.createElement('div');panel.className='homepage-refinement';panel.dataset.discoverPanel='true';panel.innerHTML='<div class="homepage-refinement-kicker">DISCOVER</div><div class="homepage-refinement-title">DISCOVER LIL SYNN</div><p class="homepage-refinement-copy">Let the signal choose. Explore the catalog and discover a track at random.</p><a class="discover-button" href="#music-grid">RANDOM SONG / DISCOVER</a>';
   if(grid)grid.parentNode.insertBefore(panel,grid);
   const randomButton=panel.querySelector('.discover-button');
   randomButton?.addEventListener('click',e=>{e.preventDefault();const cards=$$('#music-grid > *');if(!cards.length)return;const chosen=cards[Math.floor(Math.random()*cards.length)];chosen.scrollIntoView({behavior:'smooth',block:'center'});chosen.animate?.([{transform:'scale(1)'},{transform:'scale(1.035)'},{transform:'scale(1)'}],{duration:600});});
 }
 const videos=document.getElementById('videos');
 if(videos){const sub=videos.querySelector('.section-subtitle');if(sub)sub.textContent='The newest transmissions from the LIL SYNN universe.';videos.setAttribute('aria-label','Latest videos from LIL SYNN');}
 const about=document.getElementById('about');
 if(about&&!about.querySelector('.about-toggle')){
   const card=about.querySelector('.about-card');
   const headings=card?[...card.querySelectorAll('h3')]:[];
   if(card&&headings.length){
     const summary=document.createElement('div');summary.className='about-summary';summary.innerHTML=['THE ARTIST','THE PERSONA','THE MUSIC','THE VISUAL WORLD','THE VISION'].map((label,i)=>`<a href="#about-part-${i}">${label}</a>`).join('');
     card.insertBefore(summary,headings[0]);
     headings.forEach((h,i)=>h.id=`about-part-${i}`);
     const details=document.createElement('div');details.className='about-details';details.hidden=true;
     const nodes=[...card.childNodes];let active=false;for(const node of nodes){if(node===summary)continue;if(node===headings[0])active=true;if(active){details.appendChild(node);}}
     card.appendChild(details);
     const toggle=document.createElement('button');toggle.type='button';toggle.className='about-toggle';toggle.textContent='READ THE FULL STORY';toggle.setAttribute('aria-expanded','false');card.insertBefore(toggle,details);
     toggle.addEventListener('click',()=>{details.hidden=!details.hidden;toggle.textContent=details.hidden?'READ THE FULL STORY':'COLLAPSE STORY';toggle.setAttribute('aria-expanded',String(!details.hidden));if(!details.hidden)details.scrollIntoView({behavior:'smooth',block:'start'});});
     summary.querySelectorAll('a').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();details.hidden=false;toggle.textContent='COLLAPSE STORY';toggle.setAttribute('aria-expanded','true');document.getElementById(a.getAttribute('href').slice(1))?.scrollIntoView({behavior:'smooth',block:'start'});}));
   }
 }
 const merch=document.getElementById('merch');
 if(merch&&!merch.querySelector('.merch-entrance')){
   const inner=merch.querySelector('.max-w-5xl');
   if(inner){
     const existingLink=inner.querySelector('a[href*="threadless"]');
     const entrance=document.createElement('div');entrance.className='merch-entrance';
     entrance.innerHTML='<div class="merch-panel"><h3>WEAR THE SIGNAL</h3><p>Official LIL SYNN merchandise — built for the people inside the signal.</p></div><div class="merch-signal-art" aria-hidden="true"><span>LIL SYNN<br>MERCH</span></div>';
     const panel=entrance.querySelector('.merch-panel');if(existingLink)panel.appendChild(existingLink);inner.appendChild(entrance);
   }
 }
 const signal=document.getElementById('signal');if(signal)signal.classList.add('signal-highlight');
 const footer=document.querySelector('footer');
 if(footer&&!footer.querySelector('.footer-sitemap')){
   const sitemap=document.createElement('div');sitemap.className='footer-sitemap';sitemap.innerHTML='<div><h3>EXPLORE</h3><a href="#music">Music</a><a href="releases.html">Releases</a><a href="#videos">Videos</a><a href="#about">About</a><a href="https://genius.com/artists/Lil-synn" target="_blank" rel="noopener noreferrer">Lyrics</a></div><div><h3>CONNECT</h3><a href="https://open.spotify.com/artist/6ozcOAnRAUPn3z5c0GR5kU" target="_blank" rel="noopener noreferrer">Spotify</a><a href="https://music.apple.com/us/artist/lil-synn/1850720041" target="_blank" rel="noopener noreferrer">Apple Music</a><a href="https://www.youtube.com/@LILSYNNOFFICIAL" target="_blank" rel="noopener noreferrer">YouTube</a><a href="https://www.instagram.com/lilsynnofficial/" target="_blank" rel="noopener noreferrer">Instagram</a><a href="https://www.tiktok.com/@lilsynnofficial" target="_blank" rel="noopener noreferrer">TikTok</a></div><div><h3>OFFICIAL</h3><a href="https://lilsynnofficial.threadless.com/" target="_blank" rel="noopener noreferrer">Merch</a><a href="#signal">SYNN Signal</a><a href="#contact">Contact</a><a href="privacy.html">Privacy</a><a href="terms.html">Terms</a></div>';
   const legal=footer.querySelector('[aria-label="Legal navigation"]');footer.insertBefore(sitemap,legal||null);
 }
};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();window.addEventListener('load',()=>run(),{once:true});
})();