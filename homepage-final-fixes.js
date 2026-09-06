(() => {
  const unwanted = /MERCH_SHOP\.png|LATEST_RELEASES\.png|LISTEN\.png|MUSIC\.png/i;
  const lsPattern = /(?:^|\/)assets\/img\/LS\.png(?:[?#]|$)/i;
  const merchUrl = 'https://lilsynnofficial.threadless.com/';
  let bgWasPlaying = false;
  let externalMediaPlaying = false;

  const fitBackgroundVideo = () => {
    const video = document.getElementById('bgVideo');
    if (!video) return;
    const mobile = matchMedia('(max-width: 767px)').matches;
    Object.assign(video.style, {position:'fixed',top:mobile?'56px':'72px',right:'0',bottom:'0',left:'0',width:'100vw',height:mobile?'calc(100dvh - 56px)':'calc(100vh - 72px)',minWidth:'0',minHeight:'0',maxWidth:'none',maxHeight:'none',margin:'0',padding:'0',objectFit:mobile?'cover':'fill',objectPosition:'center center',transform:'none',zIndex:'0',background:'#000',display:'block',pointerEvents:'none'});
    document.documentElement.style.background='#000'; document.body.style.background='#000';
  };

  const cleanArt = () => document.querySelectorAll('img').forEach(img => { if(unwanted.test(img.getAttribute('src')||'')){const a=img.closest('a');if(a&&a.children.length===1)a.remove();else img.remove();} });

  const ensureSingleLS = () => {
    const home=document.getElementById('home'), heading=home?.querySelector('h1'); if(!home||!heading)return;
    const imgs=Array.from(home.querySelectorAll('img')).filter(i=>lsPattern.test(i.getAttribute('src')||'')); imgs.slice(1).forEach(i=>i.remove());
    if(!imgs.length){const img=document.createElement('img');img.src='/assets/img/LS.png';img.alt='LIL SYNN';img.loading='eager';img.decoding='async';img.style.cssText='display:block;width:min(72vw,420px);max-height:260px;height:auto;object-fit:contain;margin:0 auto .25rem;';heading.parentNode.insertBefore(img,heading);}
  };

  const ensureMerchButton = () => {
    const merch=document.getElementById('merch'); if(!merch||merch.querySelector('[data-wear-the-signal]'))return;
    const b=document.createElement('a');b.href=merchUrl;b.target='_blank';b.rel='noopener noreferrer';b.dataset.wearTheSignal='true';b.textContent='WEAR THE SIGNAL';b.setAttribute('aria-label','Shop official LIL SYNN merch');b.style.cssText='display:inline-block;margin-top:1rem;background:#ff008f;color:#000;font-weight:700;padding:.65rem 1.5rem;border-radius:.75rem;text-decoration:none;';(merch.querySelector('h2')?.parentNode||merch).appendChild(b);
  };

  const bindRefresh = () => {
    const b=Array.from(document.querySelectorAll('button,a')).find(e=>/random\s*song|discover/i.test((e.textContent||'').trim())||/random.*(song|music)|discover/i.test((e.id||'')+' '+String(e.className||'')));
    if(!b||b.dataset.randomRefreshBound)return;b.dataset.randomRefreshBound='true';b.removeAttribute('href');b.textContent='Random Song Refresh';b.type='button';b.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();const run=()=>typeof window.lilSynnRefreshMusic==='function'&&window.lilSynnRefreshMusic();if(!run())setTimeout(run,300);},true);
  };

  const audio=()=>document.getElementById('bgMusic');
  const pauseForExternal=()=>{const a=audio();if(!a)return;if(!a.paused){bgWasPlaying=true;a.pause();}externalMediaPlaying=true;};
  const resumeAfterExternal=()=>{if(!externalMediaPlaying)return;externalMediaPlaying=false;if(!bgWasPlaying)return;bgWasPlaying=false;const a=audio();if(a){const p=a.play();if(p?.catch)p.catch(()=>{});}};

  const ensureCalmPlayer = () => {
    const a=audio(); if(!a)return;
    a.src='/assets/other/sound/Background.mp3';a.loop=true;a.autoplay=true;a.preload='auto';a.volume=.65;a.setAttribute('aria-label','The Calm — LIL SYNN');
    let p=document.getElementById('theCalmPlayer');
    if(!p){
      p=document.createElement('div');p.id='theCalmPlayer';p.innerHTML='<div class="calm-title">THE CALM <span>• LIL SYNN</span></div><button type="button" data-calm-toggle>▶</button><input data-calm-seek type="range" min="0" max="100" value="0" step="0.1" aria-label="The Calm progress"><button type="button" data-calm-mute>🔊</button>';
      p.style.cssText='position:relative;z-index:20;width:min(92vw,900px);margin:2rem auto 2rem;padding:.65rem .8rem;display:flex;align-items:center;gap:.7rem;background:rgba(0,0,0,.72);border:1px solid rgba(255,255,255,.2);border-radius:12px;box-sizing:border-box;';
      p.querySelector('.calm-title').style.cssText='font-weight:700;white-space:nowrap;';p.querySelector('.calm-title span').style.cssText='font-weight:400;opacity:.7;';p.querySelector('[data-calm-seek]').style.cssText='flex:1;min-width:60px;';
      const footer=document.querySelector('footer'); if(footer) footer.parentNode.insertBefore(p,footer); else document.body.appendChild(p);
      p.querySelector('[data-calm-toggle]').onclick=()=>a.paused?a.play().catch(()=>{}):a.pause();p.querySelector('[data-calm-mute]').onclick=()=>{a.muted=!a.muted;p.querySelector('[data-calm-mute]').textContent=a.muted?'🔇':'🔊';};p.querySelector('[data-calm-seek]').oninput=e=>{if(a.duration)a.currentTime=Number(e.target.value)/100*a.duration;};
      a.addEventListener('timeupdate',()=>{const s=p.querySelector('[data-calm-seek]');if(s&&a.duration)s.value=a.currentTime/a.duration*100;});a.addEventListener('play',()=>p.querySelector('[data-calm-toggle]').textContent='❚❚');a.addEventListener('pause',()=>p.querySelector('[data-calm-toggle]').textContent='▶');
    }
    const p1=a.play();if(p1?.catch)p1.catch(()=>{});
  };

  const loadScript=(src,id)=>{if(document.getElementById(id))return;const s=document.createElement('script');s.id=id;s.src=src;s.async=true;document.head.appendChild(s);};
  const bindYouTube = () => {
    const fs=Array.from(document.querySelectorAll('iframe[src*="youtube.com"],iframe[src*="youtube-nocookie.com"]'));if(!fs.length)return;
    fs.forEach(f=>{if(!/[?&]enablejsapi=1/.test(f.src))f.src+=(f.src.includes('?')?'&':'?')+'enablejsapi=1';});
    if(!window.YT?.Player){window.onYouTubeIframeAPIReady=bindYouTube;loadScript('https://www.youtube.com/iframe_api','lil-synn-youtube-api');return;}
    fs.forEach(f=>{if(f.dataset.lilSynnYouTubeBound)return;f.dataset.lilSynnYouTubeBound='true';try{new YT.Player(f,{events:{onStateChange:e=>{if(e.data===YT.PlayerState.PLAYING)pauseForExternal();else if([YT.PlayerState.ENDED,YT.PlayerState.PAUSED,YT.PlayerState.CUED].includes(e.data))resumeAfterExternal();}}});}catch(_){}});
  };

  const dedupeSpotify = () => {
    const frames=Array.from(document.querySelectorAll('iframe[src*="open.spotify.com"]'));
    // Keep the SECOND/LAST Spotify player. Remove every earlier duplicate.
    if(frames.length>1) frames.slice(0,-1).forEach(f=>{const wrap=f.closest('[data-spotify-player]')||f;wrap.remove();});
    const kept=Array.from(document.querySelectorAll('iframe[src*="open.spotify.com"]')).pop();
    if(kept){kept.setAttribute('allow','autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture');kept.setAttribute('allowfullscreen','');kept.style.width='100%';kept.style.maxWidth='100%';kept.style.border='0';kept.style.borderRadius='12px';}
  };

  const init=()=>{fitBackgroundVideo();cleanArt();ensureSingleLS();ensureMerchButton();bindRefresh();ensureCalmPlayer();bindYouTube();dedupeSpotify();window.addEventListener('resize',fitBackgroundVideo,{passive:true});window.addEventListener('orientationchange',fitBackgroundVideo,{passive:true});new MutationObserver(()=>{fitBackgroundVideo();cleanArt();ensureSingleLS();ensureMerchButton();bindRefresh();ensureCalmPlayer();bindYouTube();dedupeSpotify();}).observe(document.body,{childList:true,subtree:true});};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();