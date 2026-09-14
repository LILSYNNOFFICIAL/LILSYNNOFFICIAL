(()=>{
  if(!/\/index2(?:\.html)?$/.test(location.pathname)) return;
  const css=`
    html,body{height:auto!important;min-height:100%!important;overflow-x:hidden!important;overflow-y:auto!important}
    body{position:relative!important}
    body.index2-refined{overflow-y:auto!important}
    body.index2-refined .topbar{z-index:1000!important}
    body.index2-refined .nav-stack{z-index:999!important}
    body.index2-refined .menu-panel{z-index:99999!important}
    body.index2-refined .hero{height:auto!important;min-height:0!important;padding-top:0!important;overflow:visible!important;display:block!important;position:relative!important}
    body.index2-refined .hero>.hero-webm{position:relative!important;z-index:1!important;top:auto!important;left:auto!important;right:auto!important;width:100%!important;height:auto!important;min-height:0!important;aspect-ratio:16/9!important;display:block!important;object-fit:cover!important;object-position:center top!important;transform:none!important}
    body.index2-refined .hero:before,body.index2-refined .hero:after{z-index:2!important;inset:0!important;pointer-events:none!important}
    body.index2-refined .hero-inner{position:absolute!important;z-index:5!important;inset:0!important;height:100%!important;min-height:0!important;display:flex!important;align-items:center!important}
    body.index2-refined .hero-ring{z-index:4!important}
    body.index2-refined .hero-readout{z-index:6!important}
    body.index2-refined .ls2-page-stars{position:relative!important;top:auto!important;left:auto!important;right:auto!important;width:100%!important;height:auto!important;min-height:100vh!important;overflow:hidden!important;z-index:0!important}
    body.index2-refined .ls2-page-stars video{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;object-fit:cover!important;object-position:center top!important}
    body.index2-refined .ls2-page-stars:after{pointer-events:none!important}
    body.index2-refined>main,body.index2-refined>.footer,body.index2-refined>.ls2-footer{position:relative!important;z-index:1!important}
    body.index2-refined .menu-panel{isolation:isolate!important;background:rgba(2,2,4,.985)!important}
    body.index2-refined .desktop-nav{justify-content:center!important}
    body.index2-refined .desktop-nav .ls-vote-link{order:0!important}
    @media(min-width:761px){body.index2-refined .desktop-nav .ls-vote-link{transform:translateX(-8px)!important}body.index2-refined .desktop-nav .ls-vote-link + a{margin-left:-8px!important}}
    @media(max-width:760px){body.index2-refined .hero>.hero-webm{aspect-ratio:16/10!important}body.index2-refined .ls2-page-stars{min-height:900px!important}}
  `;
  const s=document.createElement('style');s.id='ls2-final-fix-css';s.textContent=css;document.head.appendChild(s);

  const rebuild=()=>{
    const hero=document.querySelector('.hero');
    const old=document.querySelector('.ls2-page-stars');
    if(!hero)return;
    if(old)old.remove();
    const webm=hero.querySelector('.hero-webm');
    if(!webm)return;
    const stars=document.createElement('section');
    stars.className='ls2-page-stars';
    stars.setAttribute('aria-hidden','true');
    const v=document.createElement('video');
    v.src='/assets/mov/LS_BG_STARS.webm';v.autoplay=true;v.muted=true;v.loop=true;v.playsInline=true;v.preload='auto';
    stars.appendChild(v);
    hero.insertAdjacentElement('afterend',stars);
    const sync=()=>{
      const body=document.body;
      const minHeight=Math.max(window.innerHeight*1.5,document.documentElement.scrollHeight-(hero.offsetHeight||0));
      stars.style.height=Math.max(minHeight,900)+'px';
      body.style.minHeight=(hero.offsetHeight+stars.offsetHeight+Math.max(900,window.innerHeight))+'px';
    };
    sync();window.addEventListener('resize',sync,{passive:true});
    v.play().catch(()=>{});
  };

  const nav=()=>{
    const desktop=document.querySelector('.desktop-nav');
    if(desktop){
      const links=[...desktop.querySelectorAll('a')];
      const universe=links.find(a=>/universe/i.test(a.textContent));
      let vote=desktop.querySelector('.ls-vote-link');
      if(!vote){vote=document.createElement('a');vote.className='ls-vote-link';vote.href='https://tinyurl.com/VOTE-LIL-SYNN';vote.target='_blank';vote.rel='noopener noreferrer';vote.textContent='VOTE 4 LIL SYNN';}
      if(universe)universe.insertAdjacentElement('afterend',vote);
    }
    document.querySelectorAll('a').forEach(a=>{
      if(/vote 4 lil synn/i.test(a.textContent)){a.href='https://tinyurl.com/VOTE-LIL-SYNN';a.target='_blank';a.rel='noopener noreferrer'}
    });
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
  };

  const run=()=>{document.body.classList.add('index2-refined');nav();rebuild();menu();};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
})();