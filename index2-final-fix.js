(()=>{
  if(!/\/index2(?:\.html)?$/.test(location.pathname)) return;

  const suppressGlobalBackground=()=>{
    document.documentElement.classList.add('index2-page');
    document.getElementById('bgVideo')?.remove();
    document.querySelectorAll('.stars-zone>video').forEach(v=>v.remove());
    document.querySelector('.hero>.hero-stars')?.remove();
  };
  suppressGlobalBackground();
  new MutationObserver(suppressGlobalBackground).observe(document.documentElement,{childList:true,subtree:true});

  const css=`
    html,body{height:auto!important;min-height:100%!important;overflow-x:hidden!important;overflow-y:auto!important}
    body{position:relative!important}
    html.index2-page #bgVideo{display:none!important}

    /* EXACTLY TWO PAGE-WIDE WEBM LAYERS: HERO FIRST, STARS SECOND. */
    body.index2-refined .hero{position:relative!important;overflow:visible!important;display:block!important;height:auto!important;min-height:0!important;padding-top:0!important;isolation:isolate!important}
    body.index2-refined .hero>.hero-stars{display:none!important}
    body.index2-refined .hero>.hero-webm{position:absolute!important;z-index:0!important;top:0!important;left:0!important;right:0!important;width:100%!important;height:var(--ls2-hero-webm-height,100vh)!important;min-height:0!important;object-fit:cover!important;object-position:center top!important;transform:none!important;pointer-events:none!important}
    body.index2-refined .hero:before,body.index2-refined .hero:after{z-index:2!important;pointer-events:none!important}
    body.index2-refined .hero-inner{position:relative!important;z-index:5!important;min-height:620px!important;height:620px!important;display:flex!important;align-items:center!important}
    body.index2-refined .hero-ring{z-index:4!important}
    body.index2-refined .hero-readout{z-index:6!important}

    /* STARS BEGIN AT THE SIGNAL BOUNDARY AND RUN TO THE BOTTOM. */
    body.index2-refined .ls2-page-stars{position:absolute!important;z-index:0!important;left:0!important;right:0!important;top:var(--ls2-stars-top,0px)!important;width:100%!important;height:var(--ls2-stars-height,1000px)!important;min-height:0!important;overflow:hidden!important;pointer-events:none!important}
    body.index2-refined .ls2-page-stars video{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;object-fit:cover!important;object-position:center top!important}
    body.index2-refined .ls2-page-stars:after{pointer-events:none!important}
    body.index2-refined .stars-zone>video{display:none!important}

    /* ALL NORMAL CONTENT IS ABOVE BOTH WEBM LAYERS. */
    body.index2-refined>main,body.index2-refined>.footer,body.index2-refined>.ls2-footer,body.index2-refined>.section,body.index2-refined>section:not(.ls2-page-stars),body.index2-refined .stars-zone{position:relative!important;z-index:1!important}

    /* HORIZONTAL NAV IS VIEWPORT-CENTERED; VOTE ITSELF IS EXACTLY DEAD CENTER. */
    body.index2-refined .nav-inner{position:relative!important}
    body.index2-refined .desktop-nav{position:absolute!important;left:50%!important;top:50%!important;transform:translate(-50%,-50%)!important;width:min(calc(100vw - 150px),1120px)!important;max-width:none!important;display:flex!important;align-items:center!important;justify-content:center!important;gap:17px!important;flex:none!important}
    body.index2-refined .desktop-nav .ls-vote-link{position:absolute!important;left:50%!important;top:50%!important;transform:translate(-50%,-50%)!important;color:#ff4fd8!important;font-weight:900!important;text-shadow:0 0 12px rgba(255,0,143,.28)!important;z-index:2!important}
    body.index2-refined .desktop-nav a[href="#universe"]{margin-left:120px!important}
    @media(min-width:761px){body.index2-refined .desktop-nav a:nth-child(1),body.index2-refined .desktop-nav a:nth-child(2),body.index2-refined .desktop-nav a:nth-child(3),body.index2-refined .desktop-nav a:nth-child(4){transform:translateX(-60px)!important}body.index2-refined .desktop-nav a[href="#universe"],body.index2-refined .desktop-nav a[href="#contact"],body.index2-refined .desktop-nav a[href*="suno-forum"]{transform:translateX(60px)!important}}

    /* MENU OVERLAY IS ABOVE EVERYTHING, INCLUDING CONTENT AND WEBMS. */
    body.index2-refined .topbar{z-index:100000!important}
    body.index2-refined .nav-stack{z-index:99999!important}
    body.index2-refined .menu-panel{z-index:1000000!important;isolation:isolate!important;background:rgba(2,2,4,.985)!important;pointer-events:auto!important}
    body.index2-refined .menu-panel.open{pointer-events:auto!important}

    /* NORMAL PAGE SCROLL; ONLY THE OPEN MENU LOCKS SCROLL. */
    body.index2-refined,body.index2-refined *{scrollbar-width:thin;scrollbar-color:#ff008f #08080c}
    body.index2-refined::-webkit-scrollbar,body.index2-refined body::-webkit-scrollbar{width:8px}
    body.index2-refined::-webkit-scrollbar-track{background:#08080c}
    body.index2-refined::-webkit-scrollbar-thumb{background:#ff008f;border-radius:8px;border:2px solid #08080c}

    @media(max-width:760px){body.index2-refined .hero-inner{height:500px!important;min-height:500px!important}}
  `;
  const s=document.createElement('style');s.id='ls2-final-fix-css';s.textContent=css;document.head.appendChild(s);

  const rebuild=()=>{
    const hero=document.querySelector('.hero');
    const webm=hero?.querySelector('.hero-webm');
    if(!hero||!webm)return;

    const signal=document.querySelector('#signal')||document.querySelector('.signal');
    let stars=document.querySelector('.ls2-page-stars');
    let v=stars?.querySelector('video');
    if(!stars){
      stars=document.createElement('div');
      stars.className='ls2-page-stars';
      stars.setAttribute('aria-hidden','true');
      v=document.createElement('video');
      stars.appendChild(v);
      document.body.appendChild(stars);
    }
    if(!v)return;
    v.src='/assets/mov/LS_BG_STARS.webm';
    v.autoplay=true;
    v.muted=true;
    v.loop=true;
    v.playsInline=true;
    v.preload='metadata';

    const sync=()=>{
      const signalTop=signal?signal.getBoundingClientRect().top+window.scrollY:hero.getBoundingClientRect().bottom+window.scrollY;
      const pageHeight=Math.max(document.documentElement.scrollHeight,document.body.scrollHeight);
      const starsHeight=Math.max(0,pageHeight-signalTop);
      document.documentElement.style.setProperty('--ls2-hero-webm-height',signalTop+'px');
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
    if(universe)universe.insertAdjacentElement('beforebegin',vote);
    else desktop.appendChild(vote);
  };

  const menu=()=>{
    const panel=document.querySelector('.menu-panel');
    if(!panel)return;
    panel.style.zIndex='1000000';
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
    suppressGlobalBackground();
    nav();
    rebuild();
    menu();
  };

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});
  else run();
})();