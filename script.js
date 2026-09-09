if(!window.__lsSiteMotionLoaded){window.__lsSiteMotionLoaded=true;
(()=>{
const ensureBackgroundVideo=async()=>{
  let video=document.getElementById('bgVideo');
  if(!video){video=document.createElement('video');video.id='bgVideo';video.autoplay=true;video.loop=true;video.muted=true;video.playsInline=true;document.body.prepend(video)}else if(video.parentElement!==document.body){document.body.prepend(video)}
  video.className='ls-global-bg-video';video.setAttribute('aria-hidden','true');video.muted=true;video.playsInline=true;
  let overlay=document.querySelector('.ls-global-bg-overlay');
  if(!overlay){overlay=document.createElement('div');overlay.className='ls-global-bg-overlay';document.body.prepend(overlay)}
  try{
    const r=await fetch('/assets/mov/index.json',{cache:'no-store'});const files=r.ok?await r.json():[];const videos=Array.isArray(files)?files.filter(x=>/\.webm$/i.test(String(x))):[];
    if(videos.length){const pick=videos[Math.floor(Math.random()*videos.length)];const src='/assets/mov/'+encodeURIComponent(pick);const current=video.querySelector('source');if(!current||current.getAttribute('src')!==src){video.innerHTML='';const source=document.createElement('source');source.src=src;source.type='video/webm';video.appendChild(source);video.load()}}
    video.play().catch(()=>{});
  }catch(e){if(!video.querySelector('source')){video.innerHTML='<source src="/assets/mov/BG_ANI.webm" type="video/webm">';video.load()}video.play().catch(()=>{})}
};
const addHomepageRandomize=()=>{if(!document.getElementById('music-grid')||document.querySelector('.discover-button'))return;const grid=document.getElementById('music-grid'),panel=document.createElement('div');panel.className='homepage-refinement';panel.innerHTML='<button type="button" class="discover-button">RANDOMIZE</button>';grid.parentNode.insertBefore(panel,grid);panel.querySelector('button').addEventListener('click',()=>window.lilSynnRefreshMusic?.())};
const rhythm=()=>{if(document.getElementById('homepage-rhythm-final'))return;const style=document.createElement('style');style.id='homepage-rhythm-final';style.textContent=`#home,#contact{background:rgba(128,128,128,.18)!important}#presave,#music,#videos,#about,#merch,#signal{background:rgba(8,8,8,.62)!important;border-top:0!important;border-bottom:0!important;box-shadow:none!important;outline:0!important}#presave::before,#presave::after,#music::before,#music::after,#videos::before,#videos::after,#about::before,#about::after,#merch::before,#merch::after,#signal::before,#signal::after{border:0!important;box-shadow:none!important;background:transparent!important}#presave + #music,#music + #videos,#videos + #about,#about + #merch,#merch + #signal{border-top:0!important}`;document.head.appendChild(style)};
const init=()=>{ensureBackgroundVideo();addHomepageRandomize();rhythm()};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
}
