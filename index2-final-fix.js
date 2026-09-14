(()=>{
  if(!/\/index2(?:\.html)?$/.test(location.pathname)) return;

  const css=`
    html,body{height:auto!important;min-height:100%!important;overflow-x:hidden!important;overflow-y:auto!important}
    body{position:relative!important}

    /* THE TWO WEBM LAYERS: HERO FIRST, STARS SECOND */
    body.index2-refined .hero{position:relative!important;overflow:visible!important;display:block!important;height:auto!important;min-height:0!important;padding-top:0!important;isolation:isolate!important}
    body.index2-refined .hero>.hero-stars{display:none!important}
    body.index2-refined .hero>.hero-webm{
      position:absolute!important;
      z-index:0!important;
      top:0!important;
      left:0!important;
      right:0!important;
      width:100%!important;
      height:var(--ls2-hero-webm-height,100vh)!important;
      min-height:0!important;
      object-fit:cover!important;
      object-position:center top!important;
      transform:none!important;
      pointer-events:none!important;
    }
    body.index2-refined .hero:before,body.index2-refined .hero:after{z-index:2!important;pointer-events:none!important}
    body.index2-refined .hero-inner{position:relative!important;z-index:5!important;min-height:620px!important;height:620px!important;display:flex!important;align-items:center!important}
    body.index2-refined .hero-ring{z-index:4!important}
    body.index2-refined .hero-readout{z-index:6!important}

    /* STARS BEGIN EXACTLY WHERE THE SIGNAL SECTION BEGINS AND RUN TO PAGE BOTTOM */
    body.index2-refined .ls2-page-stars{
      position:absolute!important;
      z-index:0!important;
      left:0!important;
      right:0!important;
      top:var(--ls2-stars-top,0px)!important;
      width:100%!important;
      height:var(--ls2-stars-height,1000px)!important;
      min-height:0!important;
      overflow:hidden!important;
      pointer-events:none!important;
    }
    body.index2-refined .ls2-page-stars video{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;object-fit:cover!important;object-position:center top!important}
    body.index2-refined .ls2-page-stars:after{pointer-events:none!important}

    /* ALL ACTUAL PAGE CONTENT SITS ABOVE BOTH WEBM BACKGROUNDS */
    body.index2-refined>main,body.index2-refined>.footer,body.index2-refined>.ls2-footer,body.index2-refined>.section,body.index2-refined>section:not(.ls2-page-stars){position:relative!important;z-index:1!important}

    /* MENU MUST ALWAYS BE IN FRONT OF THE GRAPHICS */
    body.index2-refined .topbar{z-index:1000!important}
    body.index2-refined .nav-stack{z-index:999!important}
    body.index2-refined .menu-panel{z-index:99999!important;isolation:isolate!important;background:rgba(2,2,4,.985)!important}

    /* NAV VOTE POSITION: KEEP UNIVERSE, PLACE VOTE BESIDE IT */
    body.index2-refined .desktop-nav{justify-content:center!important}
    body.index2-refined .desktop-nav .ls-vote-link{order:0!important}
    @media(min-width:761px){body.index2-refined .desktop-nav .ls-vote-link{transform:translateX(-8px)!important}}

    /* RESTORE NORMAL DOCUMENT SCROLLING; ONLY MENU LOCKS IT */
    body.index2-refined,body.index2-refined *{scrollbar-width:thin;scrollbar-color:#ff008f #08080c}
    body.index2-refined::-webkit-scrollbar,body.index2-refined body::-webkit-scrollbar{width:8px}
    body.index2-refined::-webkit-scrollbar-track{background:#08080c}
    body.index2-refined::-webkit-scrollbar-thumb{background:#ff008f;border-radius:8px;border:2px solid #08080c}

    @media(max-width:760px){
      body.index2-refined .hero-inner{height:500px!important;min-height:500px!important}
    }
  `;
  const s=document.createElement('style');s.id='ls2-final-fix-css';s.textContent=css;document.head.appendChild(s);

  const rebuild=()=>{
    const hero=document.querySelector('.hero');
    const webm=hero?.querySelector('.hero-webm');
    const old=document.querySelectorAll('.ls2-page-stars');
    old.forEach(x=>x.remove());
    if(!hero||!webm)return;

    const signal=document.querySelector('#signal')||document.querySelector('.signal');
    const stars=document.createElement('div');
    stars.className='ls2-page-stars';
    stars.setAttribute('aria-hidden','true');
    const v=document.createElement('video');
    v.src='/assets/mov/LS_BG_STARS.webm';
    v.autoplay=true;
    v.muted=true;
    v.loop=true;
    v.playsInline=true;
    v.preload='auto';
    stars.appendChild(v);
    document.body.appendChild(stars);

    const sync=()=>{
      const signalTop=signal
        ? signal.getBoundingClientRect().top+window.scrollY
        : hero.getBoundingClientRect().bottom+window.scrollY;
      const pageHeight=Math.max(document.documentElement.scrollHeight,document.body.scrollHeight);
      const starsHeight=Math.max(0,pageHeight-signalTop);

      /* HERO WEBM occupies everything from page top through the Signal boundary. */
      document.documentElement.style.setProperty('--ls2-hero-webm-height',Math.max(signalTop,hero.offsetHeight)+'px');
      /* STARS begins exactly where HERO WEBM ends and continues to the bottom. */
      document.documentElement.style.setProperty('--ls2-stars-top',signalTop+'px');
      document.documentElement.style.setProperty('--ls2-stars-height',Math.max(starsHeight,1)+'px');
      stars.style.top=signalTop+'px';
      stars.style.height=Math.max(starsHeight,1)+'px';
    };

    sync();
    window.addEventListener('resize',sync,{passive:true});
    if(window.ResizeObserver)new ResizeObserver(sync).observe(document.body);
    v.play().catch(()=>{});
  };

  const nav=()=>{
    const desktop=document.querySelector('.desktop-nav');
    if(!desktop)return;
    const universe=[...desktop.querySelectorAll('a')].find(a=>/universe/i.test(a.textContent));
    let vote=desktop.querySelector('.ls-vote-link');
    if(!vote){
      vote=document.createElement('a');
      vote.className='ls-vote-link';
      vote.href='https://tinyurl.com/VOTE-LIL-SYNN';
      vote.target='_blank';
      vote.rel='noopener noreferrer';
      vote.textContent='VOTE 4 LIL SYNN';
    }
    if(universe)universe.insertAdjacentElement('afterend',vote);
  };

  const menu=()=>{
    const panel=document.querySelector('.menu-panel');
    if(!panel)return;
    panel.style.zIndex='99999';
    const open=document.querySelector('#menuOpen');
    const close=document.querySelector('#menuClose');
    const unlock=()=>{document.documentElement.style.overflowY='auto';document.body.style.overflowY='auto';document.body.style.overflowX='hidden'};
    const lock=()=>{document.documentElement.style.overflow='hidden';document.body.style.overflow='hidden'};
    open?.addEventListener('click',()=>setTimeout(lock,0));
    close?.addEventListener('click',()=>setTimeout(unlock,0));
    panel.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setTimeout(unlock,0)));
    document.addEventListener('keydown',e=>{if(e.key==='Escape')setTimeout(unlock,0)});
    unlock();
  };

  const run=()=>{
    document.body.classList.add('index2-refined');
    nav();
    rebuild();
    menu();
  };

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});
  else run();
})();