(()=>{
  const placeVideosUnderNeverKnown=()=>{
    const videos=document.getElementById('videos'),feed=document.getElementById('releaseFeed');
    if(!videos||!feed)return false;
    const target=[...feed.querySelectorAll('.release-card')].find(card=>/never\s*known/i.test(card.textContent||''));
    if(!target)return false;
    if(target.nextElementSibling!==videos)target.insertAdjacentElement('afterend',videos);
    videos.style.order='';
    return true;
  };
  const geometryVisibility=()=>{
    const s=document.createElement('style');s.id='signal-geometry-visibility-fix';s.textContent=`#signal-geometry-layer{opacity:.64!important;filter:saturate(1.45) brightness(1.1) contrast(1.02)!important}#signal-geometry-layer .sg-symbol{filter:drop-shadow(0 0 4px rgba(255,255,255,.16))!important}@media(max-width:800px){#signal-geometry-layer{opacity:.58!important}}@media(max-width:480px){#signal-geometry-layer{opacity:.52!important}}@media(prefers-reduced-motion:reduce){#signal-geometry-layer{display:none!important}}#videos{margin-top:0!important}`;document.head.appendChild(s);
  };
  const run=()=>{geometryVisibility();if(placeVideosUnderNeverKnown())return;const feed=document.getElementById('releaseFeed');if(feed){const observer=new MutationObserver(()=>{if(placeVideosUnderNeverKnown())observer.disconnect()});observer.observe(feed,{childList:true,subtree:true});setTimeout(()=>observer.disconnect(),15000)}};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
})();
