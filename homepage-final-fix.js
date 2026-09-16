(()=>{
  const STARS='/assets/mov/LS_BG_STARS.webm';
  const ns='http://www.w3.org/2000/svg';
  const palette=['#ff008f','#ff4fd8','#8b5cf6','#22d3ee','#facc15','#1db954','#00f5d4','#ff6b35','#a78bfa','#f472b6'];

  const stars=()=>{
    let bg=document.getElementById('site-stars-bg');
    if(!bg){bg=document.createElement('video');bg.id='site-stars-bg';bg.setAttribute('aria-hidden','true');bg.muted=true;bg.defaultMuted=true;bg.autoplay=true;bg.loop=true;bg.playsInline=true;bg.preload='auto';const s=document.createElement('source');s.src=STARS;s.type='video/webm';bg.appendChild(s);document.body.insertBefore(bg,document.body.firstChild)}
    bg.muted=true;bg.defaultMuted=true;bg.autoplay=true;bg.loop=true;bg.playsInline=true;bg.preload='auto';if(bg.src!==location.origin+STARS)bg.src=STARS;bg.load();bg.play().catch(()=>{});return bg;
  };

  const shape=(g,type,r,color)=>{
    const add=(el,op=.15,w=1.45)=>{el.setAttribute('fill','none');el.setAttribute('stroke',color);el.setAttribute('stroke-width',w);el.setAttribute('opacity',op);g.appendChild(el)};
    const circle=(x,y,rr,op=.16,dash='')=>{const e=document.createElementNS(ns,'circle');e.setAttribute('cx',x);e.setAttribute('cy',y);e.setAttribute('r',rr);if(dash)e.setAttribute('stroke-dasharray',dash);add(e,op)};
    const poly=(n,rr,rot,op=.16)=>{const e=document.createElementNS(ns,'polygon'),p=[];for(let i=0;i<n;i++){const a=(rot+i*360/n)*Math.PI/180;p.push(`${Math.cos(a)*rr},${Math.sin(a)*rr}`)}e.setAttribute('points',p.join(' '));add(e,op,1.55)};
    if(type===0){circle(0,0,r,.18);for(let i=0;i<6;i++){const a=i*Math.PI/3;circle(Math.cos(a)*r,Math.sin(a)*r,r,.11)}circle(0,0,r*.48,.15,'3 5');poly(6,r,30,.12)}
    else if(type===1){circle(0,0,r*.72,.16);for(let i=0;i<6;i++){const a=i*Math.PI/3;circle(Math.cos(a)*r*.72,Math.sin(a)*r*.72,r*.72,.10)}circle(0,0,r*.24,.18)}
    else if(type===2){circle(0,0,r,.18);circle(0,0,r*.82,.11,'3 6');for(let i=0;i<8;i++){const a=i*Math.PI/4;circle(Math.cos(a)*r*.48,Math.sin(a)*r*.48,r*.46,.09)}poly(8,r*.88,22.5,.11);poly(8,r*.62,0,.12);circle(0,0,r*.16,.20)}
    else if(type===3){poly(3,r,-90,.18);poly(3,r,90,.13);circle(0,0,r*.12,.19)}
    else if(type===4){poly(6,r,30,.17);poly(6,r,0,.12);circle(0,0,r*.34,.13);circle(0,0,r*.12,.19)}
    else if(type===5){circle(0,0,r,.15,'1 7');circle(0,0,r*.72,.11);poly(6,r,.0,.11)}
    else if(type===6){poly(3,r,Math.random()*60,.18);poly(3,r*.58,Math.random()*60,.11);circle(0,0,r*.12,.18)}
    else if(type===7){poly(6,r,Math.random()*30,.15);circle(0,0,r*.8,.11);circle(0,0,r*.35,.14,'2 6')}
    else if(type===8){circle(0,0,r,.14,'1 8');circle(0,0,r*.5,.11);circle(0,0,r*.2,.17,'2 4')}
    else{circle(0,0,r,.15);const h=document.createElementNS(ns,'line');h.setAttribute('x1',-r);h.setAttribute('y1',0);h.setAttribute('x2',r);h.setAttribute('y2',0);add(h,.08,1.15);const v=document.createElementNS(ns,'line');v.setAttribute('x1',0);v.setAttribute('y1',-r);v.setAttribute('x2',0);v.setAttribute('y2',r);add(v,.08,1.15)}
  };

  const installGeometry=()=>{
    if(document.getElementById('signal-geometry-layer'))return;
    const svg=document.createElementNS(ns,'svg'),field=document.createElementNS(ns,'g');
    svg.id='signal-geometry-layer';svg.setAttribute('aria-hidden','true');svg.setAttribute('focusable','false');
    const w=Math.max(document.documentElement.clientWidth,320),h=Math.max(window.innerHeight,560);
    svg.setAttribute('viewBox',`0 0 ${w} ${h}`);svg.setAttribute('preserveAspectRatio','none');svg.setAttribute('width','100%');svg.setAttribute('height','100%');
    const symbols=[];
    const rand=(a,b)=>a+Math.random()*(b-a);
    const addSymbol=(connector=false)=>{
      const g=document.createElementNS(ns,'g');g.classList.add('sg-symbol');field.appendChild(g);
      const cx=rand(w*.025,w*.975),cy=rand(h*.035,h*.965),r=rand(Math.max(24,w*.022),Math.min(145,w*.075)),color=palette[Math.floor(Math.random()*palette.length)];
      if(connector){const add=(x1,y1,x2,y2)=>{const e=document.createElementNS(ns,'line');e.setAttribute('x1',x1);e.setAttribute('y1',y1);e.setAttribute('x2',x2);e.setAttribute('y2',y2);e.setAttribute('stroke',color);e.setAttribute('stroke-width','1');e.setAttribute('opacity','.07');g.appendChild(e)};for(let i=0;i<8;i++){const a=i*Math.PI/4;add(0,0,Math.cos(a)*r,Math.sin(a)*r)}}else shape(g,Math.floor(Math.random()*10),r,color);
      g.setAttribute('transform',`translate(${cx} ${cy})`);
      symbols.push({g,cx,cy,phase:rand(0,Math.PI*2),phase2:rand(0,Math.PI*2),phase3:rand(0,Math.PI*2),ax:rand(w*.012,w*.045),ay:rand(h*.012,h*.045),speed:rand(.000012,.000035),spin:rand(.012,.085)*(Math.random()<.28?-1:1),spinWave:rand(.2,.7),opacity:connector?rand(.24,.38):rand(.34,.56)});
      g.style.opacity=symbols[symbols.length-1].opacity;
    };
    const count=Math.min(30,Math.max(18,Math.round(w/58)));
    for(let i=0;i<count;i++)addSymbol(false);for(let i=0;i<4;i++)addSymbol(true);
    svg.appendChild(field);document.body.appendChild(svg);

    let start=performance.now(),pausedAt=0,pausedTotal=0,raf=0;
    const frame=now=>{
      if(document.hidden){if(!pausedAt)pausedAt=now;raf=requestAnimationFrame(frame);return}
      if(pausedAt){pausedTotal+=now-pausedAt;pausedAt=0}
      const t=now-start-pausedTotal;
      for(const s of symbols){
        const a=t*s.speed+s.phase,b=t*s.speed*.61+s.phase2,c=t*s.speed*.37+s.phase3;
        const x=s.cx+Math.sin(a)*s.ax+Math.sin(b)*s.ax*.42+Math.cos(c)*s.ax*.18;
        const y=s.cy+Math.cos(a*.83)*s.ay+Math.sin(b*.71)*s.ay*.42+Math.cos(c*.53)*s.ay*.18;
        const rot=t*s.spin+s.spinWave*Math.sin(t*s.speed*.35+s.phase3);
        s.g.setAttribute('transform',`translate(${x.toFixed(2)} ${y.toFixed(2)}) rotate(${rot.toFixed(2)})`);
      }
      raf=requestAnimationFrame(frame);
    };
    raf=requestAnimationFrame(frame);
  };

  const menuAndContentFixes=()=>{
    const style=document.createElement('style');style.id='homepage-menu-content-fix';
    style.textContent=`
      /* MORE dropdown must escape the horizontally-scrolling nav row. */
      .nav-stack .menu-row:last-child{overflow:visible!important;position:relative!important;z-index:20!important}
      .nav-stack .dropdown{z-index:30!important}
      .nav-stack .dropdown-menu{z-index:2147483000!important;position:absolute!important;top:31px!important;left:50%!important;transform:translateX(-50%)!important;display:none!important}
      .nav-stack .dropdown.open .dropdown-menu{display:block!important}
      @media(max-width:800px){.nav-stack .menu-row:last-child{overflow:visible!important}.nav-stack .dropdown-menu{position:fixed!important;top:104px!important;left:12px!important;right:12px!important;transform:none!important;width:auto!important}}
      #signal-geometry-layer{opacity:.52!important;filter:saturate(1.65) brightness(1.22) contrast(1.01)!important}
      .sg-symbol{filter:drop-shadow(0 0 3px rgba(255,255,255,.12))!important}
      @media(max-width:800px){#signal-geometry-layer{opacity:.46!important}}
      @media(max-width:480px){#signal-geometry-layer{opacity:.42!important}}
      .universe-layout>.orbit-stage{grid-column:1/-1!important;justify-self:center!important;width:min(560px,52vw)!important;margin:58px auto 0!important}
      .orbit-stage .node{width:78px!important;height:78px!important}
      .orbit-stage .n1{left:0!important;top:50%!important;transform:translateY(-50%)!important}
      .orbit-stage .n2{left:16%!important;top:7%!important}
      .orbit-stage .n3{right:16%!important;top:7%!important}
      .orbit-stage .n4{right:0!important;top:50%!important;transform:translateY(-50%)!important}
      .orbit-stage .n5{right:17%!important;bottom:5%!important}
      .orbit-stage .n6{left:17%!important;bottom:5%!important}
      .orbit-stage .node:hover{transform:scale(1.08)!important}
      .release-feed+.buttons{display:none!important}
      #catalog{display:none!important}
      #videos{order:-1}
      @media(max-width:800px){.universe-layout>.orbit-stage{width:min(82vw,420px)!important;margin-top:38px!important}.orbit-stage .node{width:66px!important;height:66px!important}}
      @media(max-width:480px){.universe-layout>.orbit-stage{width:88vw!important;margin-top:28px!important}.orbit-stage .node{width:58px!important;height:58px!important}}
    `;document.head.appendChild(style);

    const videos=document.getElementById('videos'),music=document.getElementById('music'),archive=document.getElementById('archive');
    if(music&&videos)music.insertAdjacentElement('afterend',videos);
    if(music){const h=music.querySelector('.section-head h2');if(h)h.innerHTML='New <em>releases.</em>';const p=music.querySelector('.section-head>p');if(p)p.textContent='New music, videos and streaming links — the latest LIL SYNN transmissions in one place.'}
    document.getElementById('catalog')?.remove();

    const n6=document.querySelector('.orbit-stage .n6');
    if(n6){n6.href='#music';n6.querySelector('img')?.setAttribute('src','/assets/heal2.png');n6.querySelector('img')?.setAttribute('alt','New Releases');n6.setAttribute('aria-label','New Releases')}
    document.querySelectorAll('.orbit-stage .node').forEach((node,i)=>{if(!node.getAttribute('href')||node.getAttribute('href')==='/command'){node.href=i===5?'#music':'#home'};node.setAttribute('aria-label',node.querySelector('img')?.alt||`Transmission ${i+1}`);node.style.pointerEvents='auto'});

    const open=document.getElementById('menuOpen'),panel=document.getElementById('menuPanel'),close=document.getElementById('menuClose');
    if(open&&panel&&!open.dataset.menuRepair){open.dataset.menuRepair='1';const set=v=>{panel.classList.toggle('open',v);panel.setAttribute('aria-hidden',String(!v));open.setAttribute('aria-expanded',String(v));document.documentElement.style.overflow=v?'hidden':'';document.body.style.overflow=v?'hidden':''};open.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();set(true)});close?.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();set(false)});panel.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>set(false)))}
    const d=document.getElementById('utilityDropdown'),b=d?.querySelector('button');if(d&&b&&!b.dataset.moreRepair){b.dataset.moreRepair='1';b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();d.classList.toggle('open');b.setAttribute('aria-expanded',String(d.classList.contains('open')))});document.addEventListener('click',()=>{d.classList.remove('open');b.setAttribute('aria-expanded','false')})}
  };

  const css=()=>{if(document.getElementById('homepage-final-fix-css'))return;const s=document.createElement('style');s.id='homepage-final-fix-css';s.textContent=`html,body{background:#020204!important;overflow-x:hidden}#site-stars-bg{position:fixed!important;inset:0!important;width:100vw!important;height:100svh!important;object-fit:cover!important;z-index:0!important;pointer-events:none!important;opacity:.62!important;filter:brightness(.72) contrast(1.12)!important}#signal-geometry-layer{position:fixed!important;inset:0!important;width:100vw!important;height:100svh!important;z-index:2!important;pointer-events:none!important;overflow:visible!important;opacity:.52!important;mix-blend-mode:screen!important;filter:saturate(1.65) brightness(1.22) contrast(1.01)!important}.sg-symbol{transform-origin:0 0;will-change:transform}.hero,.hero-inner,.section,.archive,.stars-zone,.signal,.catalog,.videos-section,.universe,.footer{position:relative;z-index:3}.hero{background:transparent!important}.stars-zone>video{display:none!important}.topbar{z-index:10000!important}.nav-stack{z-index:9999!important}.menu-panel,.dropdown-menu{z-index:11000!important}.universe-layout>.orbit-stage{grid-column:1/-1!important;justify-self:center!important;width:min(560px,52vw)!important;margin:58px auto 0!important}@media(max-width:800px){#signal-geometry-layer{opacity:.46!important}.universe-layout{grid-template-columns:1fr!important}.universe-layout>.orbit-stage{width:min(82vw,420px)!important;margin:38px auto 0!important}.orbit-stage .node{width:66px;height:66px}}@media(max-width:480px){#signal-geometry-layer{opacity:.42!important}.universe-layout>.orbit-stage{width:88vw!important;max-width:360px!important;margin:28px auto 0!important}.orbit-stage .node{width:58px;height:58px}}@media(prefers-reduced-motion:reduce){#signal-geometry-layer{display:none!important}}`;document.head.appendChild(s)};

  const fixTransmission=()=>{
    const replace=()=>document.querySelectorAll('.hero-kicker .ey').forEach(el=>{if(/OFFICIAL TRANSMISSION\s*\/\s*002/i.test(el.textContent||''))el.textContent=(el.textContent||'').replace(/002/g,'369')});
    replace();
    const observer=new MutationObserver(replace);
    observer.observe(document.body,{childList:true,subtree:true,characterData:true});
    setTimeout(()=>observer.disconnect(),10000);
  };

  const run=()=>{css();stars();document.querySelectorAll('.hero>.hero-webm,.hero>.hero-stars').forEach(e=>e.remove());document.querySelectorAll('.universe .node.n6,a.node[href="/command"],a.node[href="/command/"]').forEach(e=>{if(e.matches('.n6')){e.href='#music';e.querySelector('img')?.setAttribute('src','/assets/heal2.png');e.querySelector('img')?.setAttribute('alt','New Releases')}else e.remove()});installGeometry();menuAndContentFixes();fixTransmission()};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
})();
