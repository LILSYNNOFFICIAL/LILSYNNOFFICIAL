document.addEventListener('DOMContentLoaded',()=>{
 const releaseSection=document.getElementById('presave');
 const latestTitle=document.getElementById('latest-release-title');
 const fixLatestRelease=async()=>{
   if(!releaseSection)return;
   if(latestTitle)latestTitle.textContent='SOMEWHERE IN-BETWEEN';
   const img=releaseSection.querySelector('#latest-release-art img');
   const spotify=releaseSection.querySelector('a[href*="open.spotify.com"]');
   if(spotify)spotify.href='https://open.spotify.com/track/4ieueqXTRCds3dOlKER5uM';
   releaseSection.querySelectorAll('a').forEach(a=>{if(a.textContent.trim().toUpperCase()==='LISTEN NOW')a.remove()});
   const links=releaseSection.querySelector('.mt-7');
   if(links)links.style.cssText='display:flex;flex-wrap:nowrap;justify-content:center;align-items:center;gap:.75rem;overflow-x:auto;overflow-y:hidden;';
   try{
     const r=await fetch('https://itunes.apple.com/lookup?id=1850720041&entity=song&limit=200&_='+Date.now(),{cache:'no-store'});if(!r.ok)throw Error('Apple lookup failed');
     const d=await r.json();const wanted=(d.results||[]).find(x=>x.wrapperType==='track'&&String(x.trackName||'').toLowerCase()==='somewhere in-between');
     if(wanted){const apple=releaseSection.querySelector('#latest-apple');if(apple)apple.href=wanted.trackViewUrl||'https://music.apple.com/us/artist/lil-synn/1850720041';if(img&&wanted.artworkUrl100)img.src=wanted.artworkUrl100.replace('100x100bb','600x600bb');}
   }catch(e){console.warn('Newest release artwork lookup failed',e)}
 };
 fixLatestRelease();
 if(latestTitle)new MutationObserver(()=>{if(latestTitle.textContent.trim()!=='SOMEWHERE IN-BETWEEN')latestTitle.textContent='SOMEWHERE IN-BETWEEN'}).observe(latestTitle,{childList:true,characterData:true,subtree:true});
 const menu=document.getElementById('sideMenu');
 if(menu){menu.style.overflowY='auto';menu.style.overflowX='hidden';const sideNav=menu.querySelector(':scope > nav');if(sideNav){sideNav.style.height='calc(100vh - 88px)';sideNav.style.minHeight='0';sideNav.style.overflowY='auto';sideNav.style.overflowX='hidden';sideNav.style.flex='1 1 auto';}const close=menu.querySelector('#closeMenu');if(close)close.addEventListener('click',()=>{});}
 const about=document.getElementById('about');
 if(about&&!about.querySelector('[data-tidal-profile]')){const profileLinks=about.querySelector('.mt-7.flex.flex-wrap.gap-3');if(profileLinks){const a=document.createElement('a');a.href='https://tidal.com/artist/69300200';a.target='_blank';a.rel='noopener noreferrer';a.className='cta-secondary';a.dataset.tidalProfile='true';a.textContent='TIDAL PROFILE';profileLinks.appendChild(a)}}
 const footer=document.querySelector('footer');
 if(footer&&!footer.querySelector('[data-footer-social-icons]')){
   const legal=footer.querySelector('nav[aria-label="Legal navigation"]');const wrap=document.createElement('div');wrap.dataset.footerSocialIcons='true';wrap.className='mt-7 flex flex-wrap justify-center items-center gap-4';
   const icons=[
    ['YouTube','https://www.youtube.com/@LILSYNNOFFICIAL','<path fill="currentColor" d="M88 18H12C5.37 18 0 23.37 0 30v40c0 6.63 5.37 12 12 12h76c6.63 0 12-5.37 12-12V30c0-6.63-5.37-12-12-12ZM39 31l34 19-34 19V31Z"/>'],
    ['Spotify','https://open.spotify.com/artist/6ozcOAnRAUPn3z5c0GR5kU','<circle cx="50" cy="50" r="47" fill="currentColor"/><path d="M22 39c18-7 40-6 58 2M26 51c16-6 35-5 50 2M30 63c13-4 27-3 40 2" fill="none" stroke="#000" stroke-width="9" stroke-linecap="round"/>'],
    ['Apple Music','https://music.apple.com/us/artist/lil-synn/1850720041','<path fill="currentColor" d="M58 20c5-6 6-12 6-16-7 1-13 4-18 9-4 5-6 10-5 16 7 1 13-3 17-9ZM75 50c0-10 7-17 13-20-5-8-14-10-20-10-8 0-15 5-19 5-5 0-11-5-18-5-9 0-17 5-22 13-10 15-3 39 7 52 5 6 11 13 18 12 7 0 10-4 18-4s11 4 18 4c8 0 13-7 18-13 5-7 7-14 7-14-1 0-20-7-20-20Z"/>'],
    ['Instagram','https://www.instagram.com/lilsynnofficial/','<rect x="5" y="5" width="90" height="90" rx="25" fill="currentColor"/><rect x="25" y="25" width="50" height="50" rx="15" fill="none" stroke="#000" stroke-width="9"/><circle cx="50" cy="50" r="11" fill="none" stroke="#000" stroke-width="9"/><circle cx="69" cy="31" r="5.5" fill="#000"/>'],
    ['X','https://x.com/lilsynnofficial','<path fill="currentColor" d="M8 9h25l17 24L71 9h20L61 45l31 46H67L47 62 23 91H4l35-41L8 9Zm24 8h-9l43 65h10L32 17Z"/>'],
    ['SoundCloud','https://soundcloud.com/lilsynnofficial','<path fill="currentColor" d="M10 69h7V50h-7v19Zm10 0h7V42h-7v27Zm10 0h7V35h-7v34Zm10 0h7V29h-7v40Zm10-32c0-7 5-13 12-13 8 0 14 6 14 14 9 0 16 7 16 16 0 9-7 16-16 16H50V37Z"/>'],
    ['TikTok','https://www.tiktok.com/@lilsynnofficial','<path fill="currentColor" d="M61 15h12c1 8 6 14 14 17v12c-6 0-11-2-15-5v27c0 11-9 20-20 20S32 77 32 66s9-20 20-20c2 0 4 0 6 1v12c-2-1-4-1-6-1-5 0-8 4-8 8s3 8 8 8 9-4 9-9V15Z"/>'],
    ['Facebook','https://www.facebook.com/lilsynnofficial','<path fill="currentColor" d="M58 92V55h12l2-14H58v-9c0-4 2-7 8-7h7V12c-2 0-6-1-11-1-11 0-18 7-18 19v11H32v14h12v37h14Z"/>']
   ];
   icons.forEach(([label,url,path])=>{const a=document.createElement('a');a.href=url;a.target='_blank';a.rel='noopener noreferrer';a.setAttribute('aria-label',label);a.title=label;a.style.cssText='display:flex;width:44px;height:44px;align-items:center;justify-content:center;color:#ff1493;transition:transform .2s ease,color .2s ease;';a.innerHTML=`<svg viewBox="0 0 100 100" width="36" height="36" aria-hidden="true">${path}</svg>`;a.addEventListener('mouseenter',()=>{a.style.transform='scale(1.12)';a.style.color='#ff4fd8'});a.addEventListener('mouseleave',()=>{a.style.transform='scale(1)';a.style.color='#ff1493'});wrap.appendChild(a)});
   if(legal)footer.insertBefore(wrap,legal);else footer.appendChild(wrap);
 }
});
