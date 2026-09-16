(()=>{
  // Production homepage visual/layout corrections.
  const install=()=>{
    if(document.getElementById('homepage-layout-fix')) return;
    const style=document.createElement('style');
    style.id='homepage-layout-fix';
    style.textContent=`
      .hero>.hero-webm{top:60px!important;height:52%!important;object-position:center top!important;transform:scale(1.10)!important}
      .hero>.hero-stars{top:calc(60px + 52%)!important;bottom:auto!important;height:48%!important;object-position:center top!important;opacity:.84!important;filter:brightness(.72) contrast(1.15)!important}
      .hero:before{inset:60px 0 0!important;background:linear-gradient(180deg,rgba(2,2,4,.03),rgba(2,2,4,.08) 48%,rgba(2,2,4,.34) 78%,rgba(2,2,4,.72) 100%)!important}
      .universe-layout>.orbit-stage{grid-column:1/-1!important;justify-self:center!important;margin:58px auto 0!important;width:min(560px,52vw)!important}
      .orbit-stage .node{width:78px!important;height:78px!important}
      .orbit-stage .n1{left:0!important;top:50%!important;transform:translateY(-50%)!important}
      .orbit-stage .n2{left:16%!important;top:7%!important}
      .orbit-stage .n3{right:16%!important;top:7%!important}
      .orbit-stage .n4{right:0!important;top:50%!important;transform:translateY(-50%)!important}
      .orbit-stage .n5{right:17%!important;bottom:5%!important}
      .orbit-stage .n6{left:17%!important;bottom:5%!important}
      .orbit-stage .node:hover{transform:scale(1.08)!important}
      .nav-stack .menu-row:last-child{overflow:visible!important;position:relative!important;z-index:50!important}
      .nav-stack .dropdown{z-index:60!important}
      .nav-stack .dropdown-menu{z-index:2147483000!important;position:absolute!important;top:31px!important;left:50%!important;transform:translateX(-50%)!important}
      #signal-geometry-layer{opacity:.48!important;filter:saturate(1.55) brightness(1.18) contrast(1.01)!important}
      .sg-symbol{filter:drop-shadow(0 0 2px rgba(255,255,255,.10))!important}
      #catalog{display:none!important}
      .release-feed+.buttons{display:none!important}
      @media(max-width:800px){
        .hero>.hero-webm{top:62px!important;height:47%!important;object-position:center top!important;transform:scale(1.12)!important}
        .hero>.hero-stars{top:calc(62px + 47%)!important;bottom:auto!important;height:47%!important;opacity:.84!important}
        .hero:before{inset:62px 0 0!important}
        .universe-layout>.orbit-stage{width:min(82vw,420px)!important;margin:38px auto 0!important}
        .orbit-stage .node{width:66px!important;height:66px!important}
        .nav-stack .dropdown-menu{position:fixed!important;top:104px!important;left:12px!important;right:12px!important;transform:none!important}
        #signal-geometry-layer{opacity:.42!important}
      }
      @media(max-width:480px){
        .hero>.hero-webm{top:56px!important;height:45%!important;transform:scale(1.14)!important}
        .hero>.hero-stars{top:calc(56px + 45%)!important;height:49%!important;opacity:.86!important}
        .hero:before{inset:56px 0 0!important}
        .universe-layout>.orbit-stage{width:88vw!important;max-width:360px!important;margin-top:28px!important}
        .orbit-stage .node{width:58px!important;height:58px!important}
        #signal-geometry-layer{opacity:.38!important}
      }
    `;
    document.head.appendChild(style);

    const music=document.getElementById('music'),videos=document.getElementById('videos');
    if(music&&videos)music.insertAdjacentElement('afterend',videos);
    document.getElementById('catalog')?.remove();
    if(music){const h=music.querySelector('.section-head h2');if(h)h.innerHTML='New <em>releases.</em>';const p=music.querySelector('.section-head>p');if(p)p.textContent='New music, videos and streaming links — the latest LIL SYNN transmissions in one place.'}

    const stage=document.querySelector('.orbit-stage');
    if(stage){
      let n6=stage.querySelector('.n6');
      if(!n6){n6=document.createElement('a');n6.className='node n6';n6.href='#music';n6.innerHTML='<img src="/assets/heal2.png" alt="New Releases">';stage.appendChild(n6)}
      else{n6.href='#music';n6.querySelector('img')?.setAttribute('src','/assets/heal2.png');n6.querySelector('img')?.setAttribute('alt','New Releases')}
      stage.querySelectorAll('.node').forEach((node,i)=>{if(!node.getAttribute('href')||/\/command\/?$/i.test(node.getAttribute('href')))node.href=i===5?'#music':'#home';node.style.pointerEvents='auto';node.setAttribute('aria-label',node.querySelector('img')?.alt||`Transmission ${i+1}`)})
    }

    const more=document.getElementById('utilityDropdown'),moreButton=more?.querySelector('button');
    if(more&&moreButton&&!more.dataset.captureFix){
      more.dataset.captureFix='1';
      moreButton.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();const open=!more.classList.contains('open');more.classList.toggle('open',open);moreButton.setAttribute('aria-expanded',String(open))},{capture:true});
    }

    const menuButton=document.getElementById('menuOpen'),panel=document.getElementById('menuPanel'),close=document.getElementById('menuClose');
    if(menuButton&&panel&&!menuButton.dataset.captureFix){
      menuButton.dataset.captureFix='1';
      const set=v=>{panel.classList.toggle('open',v);panel.setAttribute('aria-hidden',String(!v));menuButton.setAttribute('aria-expanded',String(v));document.documentElement.style.overflow=v?'hidden':'';document.body.style.overflow=v?'hidden':''};
      menuButton.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();set(true)},{capture:true});
      close?.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();set(false)},{capture:true});
    }

    const limit=document.createElement('script');limit.src='/index-release-limit.js?v=20260917';limit.defer=true;document.body.appendChild(limit);
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});
  else install();
})();
