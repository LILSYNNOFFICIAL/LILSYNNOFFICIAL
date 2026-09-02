(()=>{
const run=()=>{
  const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
  const release=document.getElementById('presave');
  if(release){
    const title=$('#latest-release-title');
    if(title) title.textContent='RESCUE YOU (ACOUSTIC VERSION)';
    const art=release.querySelector('#latest-release-art img');
    if(art){art.src='https://raw.githubusercontent.com/LILSYNNOFFICIAL/LILSYNNOFFICIAL/main/assets/images/icons/album_art/RESCUE_YOU_A.png';art.alt='LIL SYNN — Rescue You (Acoustic Version) artwork';}
    const spotify=release.querySelector('a[href*="open.spotify.com"]');
    if(spotify) spotify.href='https://open.spotify.com/track/4btTfkMu5yHTsB6CTq1AcF?si=1eeb2961302c471e';
    const apple=release.querySelector('#latest-apple');
    if(apple){apple.href='https://music.apple.com/us/song/rescue-you-acoustic-version/6807294984';apple.textContent='APPLE MUSIC';}
    const listen=release.querySelector('a.cta-primary');
    if(listen){listen.href='https://music.apple.com/us/song/rescue-you-acoustic-version/6807294984';listen.textContent='LISTEN NOW';listen.setAttribute('aria-label','Listen to Rescue You (Acoustic Version) on Apple Music');}
    const presave=release.querySelector('#presave-link');
    if(presave) presave.remove();
  }

  const videoGrid=document.getElementById('youtube-grid');
  if(videoGrid){
    const videos=[
      ['Rescue You (Acoustic Version)','Glh5acZNiFM'],
      ['Somewhere In-Between','q_EENWIxiUA'],
      ['Black Glass','vebiWy-RL4Y'],
      ['Static On My Tongue','JRJswRmhbmA'],
      ["It's In Her Eyes",'NMFONDfJoi8'],
      ['Fade Into You','tfVl30iEMkg'],
      ['Heal','_1w0aG-lj8U'],
      ['Hindsight','HX5EZCPsAxI'],
      ['Back From The Blackout','WejkZ945Jt8']
    ];
    videoGrid.innerHTML=videos.map(([title,id])=>`<article class="glass rounded-3xl overflow-hidden border border-[#ff008f]/30 hover:border-[#ff4fd8]"><div class="relative youtube-card" data-video-id="${id}" data-video-title="${title}" style="aspect-ratio:16/9;background:#000;overflow:hidden"><img src="https://i.ytimg.com/vi/${id}/hqdefault.jpg" alt="${title}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover" loading="lazy" decoding="async"><button type="button" class="youtube-play-overlay" aria-label="Play ${title}" style="position:absolute;inset:0;width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:transparent;border:0;cursor:pointer"><span style="display:flex;align-items:center;justify-content:center;width:72px;height:72px;border-radius:999px;background:rgba(255,0,143,.94);box-shadow:0 0 28px rgba(255,0,143,.55);color:#fff;font-size:30px;padding-left:5px">▶</span></button></div><div class="p-4 text-sm font-['Rajdhani'] text-center">${title}</div></article>`).join('');
    $$('.youtube-card').forEach(card=>card.querySelector('.youtube-play-overlay')?.addEventListener('click',()=>{
      const id=card.dataset.videoId, title=card.dataset.videoTitle, iframe=document.createElement('iframe');
      iframe.title=`LIL SYNN — ${title}`;
      iframe.src=`https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&playsinline=1&rel=0&modestbranding=1`;
      iframe.allow='accelerometer; autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture; web-share';
      iframe.allowFullscreen=true; iframe.referrerPolicy='strict-origin-when-cross-origin';
      iframe.style.cssText='position:absolute;inset:0;width:100%;height:100%;border:0;display:block;background:#000';
      card.innerHTML=''; card.appendChild(iframe);
    }));
  }

  const hero=document.getElementById('home');
  if(hero){
    const tagline=hero.querySelector('p'); if(tagline) tagline.textContent='Dark sound. Raw emotion. No limits';
    const listen=hero.querySelector('a[href="#music"]'), releasePresave=release?.querySelector('#presave-link');
    if(listen && !document.getElementById('hero-presave-link')){
      const a=document.createElement('a'); a.id='hero-presave-link'; a.href='https://hyperfollow.com/lilsynnofficial'; a.target='_blank'; a.rel='noopener noreferrer';
      a.className='pointer-events-auto inline-block mt-3 bg-black/70 hover:bg-[#ff4fd8] text-white hover:text-black font-bold px-8 py-3 rounded-xl border border-[#ff008f] transition-transform hover:scale-105'; a.textContent='PRE-SAVE';
      listen.insertAdjacentElement('afterend',a);
    }
  }

  const spotifyFrame=$('.spotify-player iframe'); if(spotifyFrame){spotifyFrame.height=520;spotifyFrame.style.height='520px';}

  const brand=$('nav > .max-w-7xl > a[aria-label="LIL SYNN home"]');
  if(brand && !document.querySelector('nav a[data-special-access-icon]')){
    const icon=brand.querySelector('span[aria-hidden="true"]'); if(icon){const a=document.createElement('a');a.href='special_access.html';a.dataset.specialAccessIcon='true';a.className=icon.className;a.style.textDecoration='none';a.textContent='🎧';a.setAttribute('aria-label','Special Access');brand.insertBefore(a,brand.firstChild);icon.remove();}
  }

  const menu=document.getElementById('sideMenu'); if(menu){menu.style.overflowY='auto';menu.style.overflowX='hidden';}
};
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',run,{once:true}); else run();
window.addEventListener('load',run,{once:true});
})();
