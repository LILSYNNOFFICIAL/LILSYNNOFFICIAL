(()=>{
  const VOTE_URL='https://orbiiit.com/en/participants/8fd990f6-54eb-4a0c-9b6e-851526c04c41?contestId=f85717be-ba9b-4857-b885-ccbbb9a45757';
  const geometryVisibility=()=>{
    const s=document.getElementById('signal-geometry-visibility-fix')||document.createElement('style');
    s.id='signal-geometry-visibility-fix';
    s.textContent=`
      #signal-geometry-layer{opacity:.74!important;filter:saturate(1.65) brightness(1.18) contrast(1.04)!important}
      #signal-geometry-layer .sg-symbol{filter:drop-shadow(0 0 5px rgba(255,255,255,.2)) drop-shadow(0 0 9px rgba(255,0,143,.12))!important}
      @media(max-width:800px){#signal-geometry-layer{opacity:.67!important}}
      @media(max-width:480px){#signal-geometry-layer{opacity:.60!important}}
      #videos{margin-top:0!important}
      .ls-vote4{display:flex!important;width:max-content!important;margin-top:9px!important;border-color:rgba(255,0,143,.82)!important;background:rgba(255,0,143,.08)!important;color:#fff!important;box-shadow:0 0 18px rgba(255,0,143,.12)!important}
      .ls-vote4:hover{background:#ff008f!important;color:#030005!important;box-shadow:0 0 24px rgba(255,0,143,.35)!important}
      .ls-releases-label{margin-top:20px!important;font:600 clamp(28px,4vw,52px)/.94 Orbitron,sans-serif!important;letter-spacing:-.045em!important;color:#f8f8fb!important;text-transform:lowercase!important}
      .ls-releases-label em{font-style:normal;color:transparent;-webkit-text-stroke:1px rgba(255,255,255,.65)}
    `;
    if(!s.isConnected)document.head.appendChild(s);
  };
  const placeVideosUnderNeverKnown=()=>{
    const videos=document.getElementById('videos'),feed=document.getElementById('releaseFeed');
    if(!videos||!feed)return false;
    const target=[...feed.querySelectorAll('.release-card')].find(card=>/never\s*known/i.test(card.textContent||''));
    if(!target)return false;
    if(target.nextElementSibling!==videos)target.insertAdjacentElement('afterend',videos);
    videos.style.order='';
    return true;
  };
  const addVoteButton=()=>{
    const strip=document.querySelector('#music .listen-strip');
    if(!strip||document.querySelector('.ls-vote4'))return !!document.querySelector('.ls-vote4');
    const a=document.createElement('a');
    a.className='btn ls-vote4';a.href=VOTE_URL;a.target='_blank';a.rel='noopener noreferrer';a.textContent='VOTE 4 LIL SYNN';
    strip.insertAdjacentElement('afterend',a);
    return true;
  };
  const addReleasesLabel=()=>{
    const videos=document.getElementById('videos');
    if(!videos||videos.querySelector('.ls-releases-label'))return !!videos?.querySelector('.ls-releases-label');
    const buttons=videos.querySelector('.buttons');
    if(!buttons)return false;
    const label=document.createElement('div');label.className='ls-releases-label';label.textContent='releases';
    buttons.insertAdjacentElement('afterend',label);
    return true;
  };
  const fixRandomize=()=>{
    if(document.documentElement.dataset.lsRandomizeFix)return;
    document.documentElement.dataset.lsRandomizeFix='1';
    document.addEventListener('click',e=>{
      const button=e.target.closest('button,a');
      if(!button||!/random/i.test((button.textContent||button.getAttribute('aria-label')||'').trim()))return;
      const grid=document.getElementById('youtube-grid');
      if(!grid)return;
      const cards=[...grid.children].filter(el=>el.tagName==='ARTICLE');
      if(cards.length<2)return;
      e.preventDefault();e.stopImmediatePropagation();
      for(let i=cards.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[cards[i],cards[j]]=[cards[j],cards[i]]}
      cards.forEach((card,i)=>{card.style.order=String(i);grid.appendChild(card)});
    },true);
  };
  const run=()=>{
    geometryVisibility();fixRandomize();addVoteButton();addReleasesLabel();
    if(!placeVideosUnderNeverKnown()){
      const feed=document.getElementById('releaseFeed');
      if(feed){const observer=new MutationObserver(()=>{
        const a=placeVideosUnderNeverKnown(),b=addVoteButton(),c=addReleasesLabel();
        if(a&&b&&c)observer.disconnect();
      });observer.observe(feed,{childList:true,subtree:true});setTimeout(()=>observer.disconnect(),15000)}
    }
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
})();
