(() => {
  const unwanted = /MERCH_SHOP\.png|LATEST_RELEASES\.png|LISTEN\.png|MUSIC\.png/i;
  const lsPattern = /(?:^|\/)assets\/img\/LS\.png(?:[?#]|$)/i;
  const merchUrl = 'https://lilsynnofficial.threadless.com/';
  let bgWasPlaying = false;
  let externalMediaPlaying = false;

  const fitBackgroundVideo = () => {
    const video = document.getElementById('bgVideo');
    if (!video) return;
    const mobile = window.matchMedia('(max-width: 767px)').matches;
    Object.assign(video.style, {
      position:'fixed', top:mobile?'56px':'72px', right:'0', bottom:'0', left:'0', width:'100vw',
      height:mobile?'calc(100dvh - 56px)':'calc(100vh - 72px)', minWidth:'0', minHeight:'0',
      maxWidth:'none', maxHeight:'none', margin:'0', padding:'0', objectFit:mobile?'cover':'fill',
      objectPosition:'center center', transform:'none', zIndex:'0', background:'#000', display:'block', pointerEvents:'none'
    });
    document.documentElement.style.background='#000';
    document.body.style.background='#000';
  };

  const cleanArt = () => document.querySelectorAll('img').forEach(img => {
    if (!unwanted.test(img.getAttribute('src') || '')) return;
    const wrapper=img.closest('a'); if(wrapper && wrapper.children.length===1) wrapper.remove(); else img.remove();
  });

  const ensureSingleLS = () => {
    const home=document.getElementById('home'), heading=home?.querySelector('h1'); if(!home||!heading)return;
    const imgs=Array.from(home.querySelectorAll('img')).filter(img=>lsPattern.test(img.getAttribute('src')||''));
    imgs.slice(1).forEach(img=>img.remove());
    if(!imgs.length){const img=document.createElement('img');img.src='/assets/img/LS.png';img.alt='LIL SYNN';img.loading='eager';img.decoding='async';img.style.cssText='display:block;width:min(72vw,420px);max-height:260px;height:auto;object-fit:contain;margin:0 auto .25rem;';heading.parentNode.insertBefore(img,heading);}
    else{imgs[0].style.marginBottom='.25rem';heading.style.marginTop='0';}
  };

  const ensureMerchButton = () => {
    const merch=document.getElementById('merch'); if(!merch)return;
    let button=merch.querySelector('[data-wear-the-signal]'); if(button)return;
    button=document.createElement('a'); button.href=merchUrl;button.target='_blank';button.rel='noopener noreferrer';button.dataset.wearTheSignal='true';button.textContent='WEAR THE SIGNAL';button.setAttribute('aria-label','Shop official LIL SYNN merch');button.style.cssText='display:inline-block;margin-top:1rem;background:#ff008f;color:#000;font-weight:700;padding:.65rem 1.5rem;border-radius:.75rem;text-decoration:none;';
    const heading=merch.querySelector('h2');(heading?.parentNode||merch).appendChild(button);
  };

  const bindRefresh=()=>{const button=Array.from(document.querySelectorAll('button,a')).find(el=>/random\s*song|discover/i.test((el.textContent||'').trim())||/random.*(song|music)|discover/i.test((el.id||'')+' '+String(el.className||'')));if(!button||button.dataset.randomRefreshBound)return;button.dataset.randomRefreshBound='true';button.removeAttribute('href');button.textContent='Random Song Refresh';button.type='button';button.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();const run=()=>typeof window.lilSynnRefreshMusic==='function'&&window.lilSynnRefreshMusic();if(!run())setTimeout(run,300);},true);};

  const getBgAudio=()=>document.getElementById('bgMusic');
  const pauseBackgroundForExternalMedia=()=>{const a=getBgAudio();if(!a)return;if(!a.paused){bgWasPlaying=true;a.pause();}externalMediaPlaying=true;};
  const resumeBackgroundAfterExternalMedia=()=>{if(!externalMediaPlaying)return;externalMediaPlaying=false;if(!bgWasPlaying)return;bgWasPlaying=false;const a=getBgAudio();if(a){const p=a.play();if(p?.catch)p.catch(()=>{});}};

  const ensureCalmPlayer=()=>{
    const audio=getBgAudio(); if(!audio)return;
    audio.src='/assets/other/sound/Background.mp3';audio.loop=true;audio.volume=0.65;audio.setAttribute('aria-label','The Calm — LIL SYNN');
    let player=document.getElementById('theCalmPlayer');
    if(!player){
      player=document.createElement('div');player.id='theCalmPlayer';player.innerHTML='<div class="calm-title">THE CALM <span>• LIL SYNN</span></div><button type="button" data-calm-toggle>▶</button><input data-calm-seek type="range" min="0" max="100" value="0" step="0.1" aria-label="The Calm progress"><button type="button" data-calm-mute>🔊</button>';
      player.style.cssText='position:relative;z-index:20;width:min(92vw,900px);margin:0 auto 1rem;padding:.65rem .8rem;display:flex;align-items:center;gap:.7rem;background:rgba(0,0,0,.72);border:1px solid rgba(255,255,255,.2);border-radius:12px;box-sizing:border-box;';
      player.querySelector('.calm-title').style.cssText='font-weight:700;white-space:nowrap;';player.querySelector('.calm-title span').style.cssText='font-weight:400;opacity:.7;';player.querySelector('[data-calm-seek]').style.cssText='flex:1;min-width:60px;';
      const home=document.getElementById('home'); const topText=home?.querySelector('h1'); if(topText?.parentNode) topText.parentNode.insertBefore(player,topText); else document.body.insertBefore(player,document.body.firstChild);
      player.querySelector('[data-calm-toggle]').onclick=()=>{if(audio.paused) audio.play().catch(()=>{});else audio.pause();};
      player.querySelector('[data-calm-mute]').onclick=()=>{audio.muted=!audio.muted;player.querySelector('[data-calm-mute]').textContent=audio.muted?'🔇':'🔊';};
      player.querySelector('[data-calm-seek]').oninput=e=>{if(audio.duration)audio.currentTime=(Number(e.target.value)/100)*audio.duration;};
      audio.addEventListener('timeupdate',()=>{const seek=player.querySelector('[data-calm-seek]');if(seek&&audio.duration)seek.value=(audio.currentTime/audio.duration)*100;});
      audio.addEventListener('play',()=>player.querySelector('[data-calm-toggle]').textContent='❚❚');audio.addEventListener('pause',()=>player.querySelector('[data-calm-toggle]').textContent='▶');
    }
  };

  const tryStartOnScroll=()=>{const a=getBgAudio();if(!a||externalMediaPlaying||!a.paused)return; a.play().catch(()=>{});};
  const bindAudioUnlock=()=>{
    if(window.__lilSynnScrollAudioBound)return;window.__lilSynnScrollAudioBound=true;
    // Browsers may reject audible autoplay from scroll; we retry on every scroll/touch movement.
    ['scroll','wheel','touchmove'].forEach(type=>window.addEventListener(type,tryStartOnScroll,{passive:true}));
  };

  const loadScript=(src,id)=>{if(document.getElementById(id))return;const s=document.createElement('script');s.id=id;s.src=src;s.async=true;document.head.appendChild(s);};
  const bindYouTubePlayers=()=>{const frames=Array.from(document.querySelectorAll('iframe[src*="youtube.com"],iframe[src*="youtube-nocookie.com"]'));if(!frames.length)return;frames.forEach(f=>{let src=f.src;if(!/[?&]enablejsapi=1/.test(src))f.src=src+(src.includes('?')?'&':'?')+'enablejsapi=1';});if(!window.YT?.Player){window.onYouTubeIframeAPIReady=bindYouTubePlayers;loadScript('https://www.youtube.com/iframe_api','lil-synn-youtube-api');return;}frames.forEach(f=>{if(f.dataset.lilSynnYouTubeBound)return;f.dataset.lilSynnYouTubeBound='true';try{new YT.Player(f,{events:{onStateChange:e=>{if(e.data===YT.PlayerState.PLAYING)pauseBackgroundForExternalMedia();else if([YT.PlayerState.ENDED,YT.PlayerState.PAUSED,YT.PlayerState.CUED].includes(e.data))resumeBackgroundAfterExternalMedia();}}});}catch(_){}});};

  const bindSpotifyPlayers=()=>{
    const frames=Array.from(document.querySelectorAll('iframe[src*="open.spotify.com"]')).filter(f=>!f.dataset.spotifyHandled);if(!frames.length)return;
    frames.forEach(frame=>{
      frame.dataset.spotifyHandled='true';
      // Keep the original Spotify iframe intact. The prior controller replacement was removing its content.
      frame.setAttribute('allow','autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture');frame.setAttribute('allowfullscreen','');frame.style.width='100%';frame.style.maxWidth='100%';frame.style.border='0';frame.style.borderRadius='12px';
    });
  };

  const init=()=>{fitBackgroundVideo();cleanArt();ensureSingleLS();ensureMerchButton();bindRefresh();ensureCalmPlayer();bindAudioUnlock();bindYouTubePlayers();bindSpotifyPlayers();window.addEventListener('resize',fitBackgroundVideo,{passive:true});window.addEventListener('orientationchange',fitBackgroundVideo,{passive:true});new MutationObserver(()=>{fitBackgroundVideo();cleanArt();ensureSingleLS();ensureMerchButton();bindRefresh();ensureCalmPlayer();bindYouTubePlayers();bindSpotifyPlayers();}).observe(document.body,{childList:true,subtree:true});};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();