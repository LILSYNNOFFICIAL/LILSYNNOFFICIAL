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
   if(cr.ok) catalog=await cr.json();
   if(ar.ok){const j=await ar.json();artFiles=(Array.isArray(j)?j:[]).filter(x=>x.type==='file'&&/\.(jpg|jpeg|png)$/i.test(x.name));}
   if(ap.ok){const j=await ap.json();for(const x of j.results||[])if(x.wrapperType==='track'&&x.kind==='song'&&String(x.artistName||'').toLowerCase()==='lil synn'&&x.trackName&&x.trackViewUrl)appleByTitle.set(key(x.trackName),x.trackViewUrl)}
 }catch(e){console.warn('Homepage catalog enrichment unavailable',e)}
 const spotifyMap=catalog?.trackSpotify||{};
 const appleSong=title=>key(title)==='rescueyouacousticversion'?'https://music.apple.com/us/song/rescue-you-acoustic-version/6807294984':appleByTitle.get(key(title))||'';
 const artFor=title=>{
   const exact=key(title);let f=artFiles.find(x=>key(x.name.replace(/^\d+_lil_synn_/i,'').replace(/\.(jpg|jpeg|png)$/i,''))===exact);
   if(!f)f=artFiles.find(x=>{const n=key(x.name.replace(/\.(jpg|jpeg|png)$/i,''));return n.includes(exact)||exact.includes(n)});
   return f?`https://raw.githubusercontent.com/LILSYNNOFFICIAL/LILSYNNOFFICIAL/main/assets/images/icons/album_art/${encodeURIComponent(f.name)}`:'';
 };

 // Latest release is always the first item in the release catalog.
 if(release&&catalog?.order?.length){
   const latest=catalog.order[0];
   const latestGroup=catalog.groups?.[latest];
   const latestTrack=latestGroup?.tracks?.length?latestGroup.tracks[latestGroup.tracks.length-1]:latest;
   const spotify=spotifyMap[latest]||spotifyMap[latestTrack]||'';
   const apple=appleSong(latest)||appleSong(latestTrack);
   const title=$('#latest-release-title');
   if(title)title.textContent=latest.toUpperCase();
   const image=release.querySelector('#latest-release-art img');
   const art=artFor(latest)||artFor(latestTrack);
   if(image&&art){image.src=art;image.alt=`LIL SYNN — ${latest} artwork`;image.removeAttribute('width');image.removeAttribute('height');}
   const buttons=[...release.querySelectorAll('.mt-7 a')];
   const spotifyButton=buttons.find(a=>a.textContent.trim().toUpperCase()==='SPOTIFY')||buttons.find(a=>a.href.includes('open.spotify.com'));
   const appleButton=buttons.find(a=>a.id==='latest-apple');
   const listenButton=buttons.find(a=>a.classList.contains('cta-primary'));
   if(spotifyButton&&spotify)spotifyButton.href=spotify;
   if(appleButton)appleButton.remove();
   if(listenButton){listenButton.textContent='APPLE';listenButton.href=apple||listenButton.href;listenButton.setAttribute('aria-label',`Listen to ${latest} on Apple Music`);}
   const presave=release.querySelector('#presave-link');if(presave)presave.remove();
 }

 // Latest Videos: follow release-catalog order, then select the first nine releases with a known official video.
 const videoGrid=document.getElementById('youtube-grid');
 if(videoGrid){
   const videoMap={
     'Rescue You (Acoustic Version)':'Glh5acZNiFM',
     'Somewhere In-Between':'q_EENWIxiUA',
     'Black Glass':'vebiWy-RL4Y',
     'Static On My Tongue':'JRJswRmhbmA',
     "It's In Her Eyes":'NMFONDfJoi8',
     'Fade Into You':'tfVl30iEMkg',
     'Heal':'_1w0aG-lj8U',
     'Hindsight':'HX5EZCPsAxI',
     'Back From The Blackout':'WejkZ945Jt8'
   };
   const ordered=(catalog?.order||[]).map(title=>({title,id:videoMap[title]})).filter(x=>x.id).slice(0,9);
   videoGrid.innerHTML=ordered.map(({title,id})=>`<article class="glass rounded-3xl overflow-hidden border border-[#ff008f]/30 hover:border-[#ff4fd8]"><div class="relative youtube-card" data-video-id="${id}" data-video-title="${esc(title)}" style="aspect-ratio:16/9;background:#000;overflow:hidden"><img src="https://i.ytimg.com/vi/${id}/hqdefault.jpg" alt="${esc(title)}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover" loading="lazy" decoding="async"><button type="button" class="youtube-play-overlay" aria-label="Play ${esc(title)}" style="position:absolute;inset:0;width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:transparent;border:0;cursor:pointer"><span style="display:flex;align-items:center;justify-content:center;width:72px;height:72px;border-radius:999px;background:rgba(255,0,143,.94);box-shadow:0 0 28px rgba(255,0,143,.55);color:#fff;font-size:30px;padding-left:5px">▶</span></button></div><div class="p-4 text-sm font-['Rajdhani'] text-center">${esc(title)}</div></article>`).join('');
   $$('.youtube-card').forEach(card=>card.querySelector('.youtube-play-overlay')?.addEventListener('click',()=>{
     const id=card.dataset.videoId,title=card.dataset.videoTitle,iframe=document.createElement('iframe');
     iframe.title=`LIL SYNN — ${title}`;iframe.src=`https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&playsinline=1&rel=0&modestbranding=1`;iframe.allow='accelerometer; autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture; web-share';iframe.allowFullscreen=true;iframe.referrerPolicy='strict-origin-when-cross-origin';iframe.style.cssText='position:absolute;inset:0;width:100%;height:100%;border:0;display:block;background:#000';card.innerHTML='';card.appendChild(iframe);
   }));
 }

 // Hero: exactly three actions in one row.
 const hero=document.getElementById('home');
 if(hero){
   const tagline=hero.querySelector('p');if(tagline)tagline.textContent='Dark sound. Raw emotion. No limits';
   const stack=hero.querySelector('.hero-cta-stack'),row=hero.querySelector('.hero-cta-row'),listen=hero.querySelector('a[href="#music"]');
   if(stack&&row&&listen){
     row.appendChild(listen);
     const oldHeroPresave=hero.querySelector('#hero-presave-link');if(oldHeroPresave)oldHeroPresave.remove();
     const presave=document.createElement('a');presave.id='hero-presave-link';presave.href='https://hyperfollow.com/lilsynnofficial';presave.target='_blank';presave.rel='noopener noreferrer';presave.className='inline-block bg-[#ff008f] hover:bg-[#ff4fd8] text-black font-bold px-8 py-3 rounded-xl transition-transform hover:scale-105';presave.textContent='PRE-SAVE';presave.setAttribute('aria-label','Pre-save LIL SYNN');
     row.appendChild(presave);
     const vote=hero.querySelector('.hero-vote');if(vote)row.appendChild(vote);
     stack.style.display='block';row.style.display='flex';row.style.flexWrap='nowrap';row.style.justifyContent='center';row.style.alignItems='center';row.style.gap='.75rem';
   }
 }

 // Mobile menu: make the entire menu panel tall and independently scrollable.
 const menu=document.getElementById('sideMenu');
 if(menu){menu.style.height='100dvh';menu.style.maxHeight='100dvh';menu.style.overflowY='auto';menu.style.overflowX='hidden';menu.style.paddingBottom='2rem';const nav=menu.querySelector('nav');if(nav){nav.style.minHeight='calc(100dvh - 92px)';nav.style.paddingBottom='2rem';}}

 // Special Access: center the Bloopers & Alt Scenes video/card.
 if(location.pathname.endsWith('special_access.html')){
   for(const h of $$('h2'))if(h.textContent.trim().toUpperCase()==='BLOOPERS & ALT SCENES'){const section=h.closest('.archive');const grid=section?.querySelector('.videos');if(grid){grid.style.display='flex';grid.style.justifyContent='center';grid.style.width='100%';const card=grid.querySelector('.card');if(card)card.style.width='min(100%,760px)';}}
 }
 const spotifyFrame=$('.spotify-player iframe');if(spotifyFrame){spotifyFrame.height=520;spotifyFrame.style.height='520px';}
 const brand=$('nav > .max-w-7xl > a[aria-label="LIL SYNN home"]');
 if(brand&&!document.querySelector('nav a[data-special-access-icon]')){const icon=brand.querySelector('span[aria-hidden="true"]');if(icon){const a=document.createElement('a');a.href='special_access.html';a.dataset.specialAccessIcon='true';a.className=icon.className;a.style.textDecoration='none';a.textContent='🎧';a.setAttribute('aria-label','Special Access');brand.insertBefore(a,brand.firstChild);icon.remove();}}
};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
window.addEventListener('load',()=>run(),{once:true});
})();
