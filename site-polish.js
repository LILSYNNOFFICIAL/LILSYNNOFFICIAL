document.addEventListener('DOMContentLoaded',()=>{
 const releaseSection=document.getElementById('presave');
 const latestTitle=document.getElementById('latest-release-title');
 const RESCUE_YOU_ACOUSTIC_SPOTIFY='https://open.spotify.com/track/4btTfkMu5yHTsB6CTq1AcF?si=1eeb2961302c471e';
 const RESCUE_YOU_ACOUSTIC_APPLE='https://music.apple.com/us/song/rescue-you-acoustic-version/6807294984';
 const RESCUE_YOU_ACOUSTIC_ART='https://raw.githubusercontent.com/LILSYNNOFFICIAL/LILSYNNOFFICIAL/main/assets/images/icons/album_art/RESCUE_YOU_A.png';
 const fixLatestRelease=()=>{
   if(!releaseSection)return;
   if(latestTitle)latestTitle.textContent='RESCUE YOU (ACOUSTIC VERSION)';
   const img=releaseSection.querySelector('#latest-release-art img');
   if(img){img.src=RESCUE_YOU_ACOUSTIC_ART;img.alt='LIL SYNN — Rescue You (Acoustic Version) artwork';}
   const spotify=releaseSection.querySelector('a[href*="open.spotify.com"]');
   if(spotify)spotify.href=RESCUE_YOU_ACOUSTIC_SPOTIFY;
   const apple=releaseSection.querySelector('#latest-apple');
   if(apple){apple.href=RESCUE_YOU_ACOUSTIC_APPLE;apple.textContent='APPLE MUSIC';}
   const listenNow=releaseSection.querySelector('a.cta-primary');
   if(listenNow){listenNow.href=RESCUE_YOU_ACOUSTIC_APPLE;listenNow.textContent='LISTEN NOW';listenNow.setAttribute('aria-label','Listen to Rescue You (Acoustic Version) on Apple Music');}
   const links=releaseSection.querySelector('.mt-7');
   if(links)links.style.cssText='display:flex;flex-wrap:wrap;justify-content:center;align-items:center;gap:.75rem;';
 };
 fixLatestRelease();
 if(latestTitle)new MutationObserver(()=>{if(latestTitle.textContent.trim()!=='RESCUE YOU (ACOUSTIC VERSION)')latestTitle.textContent='RESCUE YOU (ACOUSTIC VERSION)'}).observe(latestTitle,{childList:true,characterData:true,subtree:true});

 const home=document.getElementById('home');
 const tagline=home?.querySelector('p');if(tagline)tagline.textContent='Dark sound. Raw emotion. No limits';

 // Move PRE-SAVE to the hero, immediately below the first LISTEN NOW button.
 const heroListen=home?.querySelector('a[href="#music"]');
 const presave=releaseSection?.querySelector('#presave-link');
 if(heroListen&&presave&&!document.getElementById('hero-presave-link')){
   const heroPresave=presave.cloneNode(true);
   heroPresave.id='hero-presave-link';
   heroPresave.className='pointer-events-auto inline-block mt-3 bg-black/70 hover:bg-[#ff4fd8] text-white hover:text-black font-bold px-8 py-3 rounded-xl border border-[#ff008f] transition-transform hover:scale-105';
   heroListen.insertAdjacentElement('afterend',heroPresave);
   presave.remove();
 }

 // Make Spotify substantially taller.
 const spotifyFrame=document.querySelector('.spotify-player iframe');
 if(spotifyFrame){spotifyFrame.height=520;spotifyFrame.style.height='520px';}

 const brand=document.querySelector('nav > .max-w-7xl > a[aria-label="LIL SYNN home"]');
 if(brand&&!document.querySelector('nav a[data-special-access-icon]')){const icon=brand.querySelector('span[aria-hidden="true"]');if(icon){const special=document.createElement('a');special.href='special_access.html';special.setAttribute('aria-label','Special Access');special.dataset.specialAccessIcon='true';special.className=icon.className;special.style.textDecoration='none';special.textContent='🎧';special.style.marginRight='.25rem';brand.insertBefore(special,brand.firstChild);icon.remove();brand.classList.remove('gap-3');}}

 const menu=document.getElementById('sideMenu');if(menu){menu.style.overflowY='auto';menu.style.overflowX='hidden';const sideNav=menu.querySelector(':scope > nav');if(sideNav){sideNav.style.height='calc(100vh - 88px)';sideNav.style.minHeight='0';sideNav.style.overflowY='auto';sideNav.style.overflowX='hidden';sideNav.style.flex='1 1 auto';}}

 // Exactly 9 homepage videos. YouTube is embedded in-place after pressing the play overlay.
 const videos=document.getElementById('youtube-grid');
 const fallbackVideos=[
   ['Rescue You (Acoustic Version)','Glh5acZNiFM'],['Somewhere In-Between','q_EENWIxiUA'],['Black Glass','vebiWy-RL4Y'],['Static On My Tongue','JRJswRmhbmA'],["It's In Her Eyes",'NMFONDfJoi8'],['Fade Into You','tfVl30iEMkg'],['Heal','_1w0aG-lj8U'],['Hindsight','HX5EZCPsAxI'],['Back From The Blackout','WejkZ945Jt8']
 ];
 if(videos){
   videos.innerHTML=fallbackVideos.map(([title,id])=>`<article class="glass rounded-3xl overflow-hidden border border-[#ff008f]/30 hover:border-[#ff4fd8]"><div class="relative youtube-card" data-video-id="${id}" data-video-title="${title}" style="aspect-ratio:16/9;background:#000;overflow:hidden"><img src="https://i.ytimg.com/vi/${id}/hqdefault.jpg" alt="${title}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover" loading="lazy" decoding="async"><button type="button" class="youtube-play-overlay" aria-label="Play ${title}" style="position:absolute;inset:0;width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:transparent;border:0;cursor:pointer"><span style="display:flex;align-items:center;justify-content:center;width:72px;height:72px;border-radius:999px;background:rgba(255,0,143,.94);box-shadow:0 0 28px rgba(255,0,143,.55);color:#fff;font-size:30px;padding-left:5px">▶</span></button></div><div class="p-4 text-sm font-['Rajdhani'] text-center">${title}</div></article>`).join('');
   videos.querySelectorAll('.youtube-card').forEach(card=>{
     card.querySelector('.youtube-play-overlay')?.addEventListener('click',()=>{
       const id=card.dataset.videoId;const title=card.dataset.videoTitle;const iframe=document.createElement('iframe');
       iframe.title=`LIL SYNN — ${title}`;
       iframe.src=`https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&playsinline=1&rel=0&modestbranding=1`;
       iframe.allow='accelerometer; autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture; web-share';
       iframe.allowFullscreen=true;iframe.referrerPolicy='strict-origin-when-cross-origin';iframe.style.cssText='position:absolute;inset:0;width:100%;height:100%;border:0;display:block;background:#000;';
       card.innerHTML='';card.appendChild(iframe);
     });
   });
 }

 const about=document.getElementById('about');if(about&&!about.querySelector('[data-tidal-profile]')){const profileLinks=about.querySelector('.mt-7.flex.flex-wrap.gap-3');if(profileLinks){const a=document.createElement('a');a.href='https://tidal.com/artist/69300200';a.target='_blank';a.rel='noopener noreferrer';a.className='cta-secondary';a.dataset.tidalProfile='true';a.textContent='TIDAL PROFILE';profileLinks.appendChild(a)}}
 const footer=document.querySelector('footer');if(footer&&!footer.querySelector('[data-footer-social-icons]')){const legal=footer.querySelector('nav[aria-label="Legal navigation"]');const wrap=document.createElement('div');wrap.dataset.footerSocialIcons='true';wrap.className='mt-7 flex flex-wrap justify-center items-center gap-4';const icons=[['YouTube','https://www.youtube.com/@LILSYNNOFFICIAL','<path fill="currentColor" d="M88 18H12C5.37 18 0 23.37 0 30v40c0 6.63 5.37 12 12 12h76c6.63 0 12-5.37 12-12V30c0-6.63-5.37-12-12-12ZM39 31l34 19-34 19V31Z"/>'],['Spotify','https://open.spotify.com/artist/6ozcOAnRAUPn3z5c0GR5kU','<circle cx="50" cy="50" r="47" fill="currentColor"/><path d="M22 39c18-7 40-6 58 2M26 51c16-6 35-5 50 2M30 63c13-4 27-3 40 2" fill="none" stroke="#000" stroke-width="9" stroke-linecap="round"/>'],['Apple Music','https://music.apple.com/us/artist/lil-synn/1850720041','<path fill="currentColor" d="M58 20c5-6 6-12 6-16-7 1-13 4-18 9-4 5-6 10-5 16 7 1 13-3 17-9ZM75 50c0-10 7-17 13-20-5-8-14-10-20-10-8 0-15 5-19 5-5 0-11-5-18-5-9 0-17 5-22 13-10 15-3 39 7 52 5 6 11 13 18 12 7 0 10-4 18-4s11 4 18 4c8 0 13-7 18-13 5-7 7-14 7-14-1 0-20-7-20-20Z"/>'],['Instagram','https://www.instagram.com/lilsynnofficial/','<rect x="5" y="5" width="90" height="90" rx="25" fill="currentColor"/><rect x="25" y="25" width="50" height="50" rx="15" fill="none" stroke="#000" stroke-width="9"/><circle cx="50" cy="50" r="11" fill="none" stroke="#000" stroke-width="9"/><circle cx="69" cy="31" r="5.5" fill="#000"/>'],['X','https://x.com/lilsynnofficial','<path fill="currentColor" d="M8 9h25l17 24L71 9h20L61 45l31 46H67L47 62 23 91H4l35-41L8 9Zm24 8h-9l43 65h10L32 17Z"/>'],['SoundCloud','https://soundcloud.com/lilsynnofficial','<path fill="currentColor" d="M10 69h7V50h-7v19Zm10 0h7V42h-7v27Zm10 0h7V35h-7v34Zm10 0h7V29h-7v40Zm10-32c0-7 5-13 12-13 8 0 14 6 14 14 9 0 16 7 16 16 0 9-7 16-16 16H50V37Z"/>'],['TikTok','https://www.tiktok.com/@lilsynnofficial','<path fill="currentColor" d="M61 15h12c1 8 6 14 14 17v12c-6 0-11-2-15-5v27c0 11-9 20-20 20S32 77 32 66s9-20 20-20c2 0 4 0 6 1v12c-2-1-4-1-6-1-5 0-8 4-8 8s3 8 8 8 9-4 9-9V15Z"/>'],['Facebook','https://www.facebook.com/lilsynnofficial','<path fill="currentColor" d="M58 92V55h12l2-14H58v-9c0-4 2-7 8-7h7V12c-2 0-6-1-11-1-11 0-18 7-18 19v11H32v14h12v37h14Z"/>']];icons.forEach(([label,url,path])=>{const a=document.createElement('a');a.href=url;a.target='_blank';a.rel='noopener noreferrer';a.setAttribute('aria-label',label);a.title=label;a.style.cssText='display:flex;width:44px;height:44px;align-items:center;justify-content:center;color:#ff1493;transition:transform .2s ease,color .2s ease;';a.innerHTML=`<svg viewBox="0 0 100 100" width="36" height="36" aria-hidden="true">${path}</svg>`;a.addEventListener('mouseenter',()=>{a.style.transform='scale(1.12)';a.style.color='#ff4fd8'});a.addEventListener('mouseleave',()=>{a.style.transform='scale(1)';a.style.color='#ff1493'});wrap.appendChild(a)});if(legal)footer.insertBefore(wrap,legal);else footer.appendChild(wrap);}
});
