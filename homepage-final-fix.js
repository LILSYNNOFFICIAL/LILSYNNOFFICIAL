(()=>{
  const STARS='/assets/mov/LS_BG_STARS.webm';

  const ensureStarsBackground=()=>{
    let bg=document.getElementById('site-stars-bg');
    if(!bg){
      bg=document.createElement('video');
      bg.id='site-stars-bg';
      bg.setAttribute('aria-hidden','true');
      bg.setAttribute('tabindex','-1');
      bg.muted=true;
      bg.defaultMuted=true;
      bg.autoplay=true;
      bg.loop=true;
      bg.playsInline=true;
      bg.preload='auto';
      const source=document.createElement('source');
      source.src=STARS;
      source.type='video/webm';
      bg.appendChild(source);
      document.body.insertBefore(bg,document.body.firstChild);
    }
    bg.muted=true;bg.defaultMuted=true;bg.autoplay=true;bg.loop=true;bg.playsInline=true;bg.preload='auto';
    if(bg.getAttribute('src')!==STARS)bg.src=STARS;
    const source=bg.querySelector('source');if(source&&source.src!==location.origin+STARS)source.src=STARS;
    const play=()=>bg.play().catch(()=>{});
    bg.addEventListener('loadeddata',play,{once:true});
    bg.addEventListener('canplay',play,{once:true});
    bg.load();play();
    const resume=()=>{if(!document.hidden&&bg.paused)play()};
    document.addEventListener('visibilitychange',resume,{passive:true});
    window.addEventListener('pageshow',resume,{passive:true});
    return bg;
  };

  const removeLegacyHeroBackground=()=>{
    document.querySelectorAll('.hero>.hero-webm').forEach(v=>v.remove());
    document.querySelectorAll('.hero>.hero-stars').forEach(v=>v.remove());
  };

  const removePrivateCommandNode=()=>{
    document.querySelectorAll('.universe .node.n6, .orbit-stage .n6, a.node[href="/command"], a.node[href="/command/"]').forEach(el=>el.remove());
  };

  const installSignalGeometry=()=>{
    if(document.getElementById('signal-geometry-layer'))return;
    const svgNS='http://www.w3.org/2000/svg';
    const svg=document.createElementNS(svgNS,'svg');
    svg.id='signal-geometry-layer';
    svg.setAttribute('aria-hidden','true');
    svg.setAttribute('focusable','false');
    const group=document.createElementNS(svgNS,'g');
    const palette=['#ff008f','#ff4fd8','#8b5cf6','#22d3ee','#facc15','#1db954'];
    let seed=(Date.now()>>>0)||1;
    const rnd=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};
    const add=(el,color,opacity=.14,width=1)=>{el.setAttribute('fill','none');el.setAttribute('stroke',color);el.setAttribute('stroke-width',String(width));el.setAttribute('opacity',String(opacity));group.appendChild(el)};
    const circle=(cx,cy,r,color,opacity=.12,dash='')=>{const e=document.createElementNS(svgNS,'circle');e.setAttribute('cx',cx);e.setAttribute('cy',cy);e.setAttribute('r',r);if(dash)e.setAttribute('stroke-dasharray',dash);add(e,color,opacity)};
    const polygon=(cx,cy,r,n,rotation,color,opacity=.1)=>{const e=document.createElementNS(svgNS,'polygon');const pts=[];for(let i=0;i<n;i++){const a=(rotation+i*360/n)*Math.PI/180;pts.push(`${cx+Math.cos(a)*r},${cy+Math.sin(a)*r}`)}e.setAttribute('points',pts.join(' '));add(e,color,opacity)};
    const rosette=(cx,cy,r,color)=>{circle(cx,cy,r,color,.13);for(let i=0;i<6;i++){const a=i*Math.PI/3;circle(cx+Math.cos(a)*r,cy+Math.sin(a)*r,r,color,.075)}circle(cx,cy,r*.5,color,.1,'3 5');polygon(cx,cy,r,6,30,color,.055)};
    const draw=()=>{
      while(group.firstChild)group.removeChild(group.firstChild);
      const w=Math.max(document.documentElement.clientWidth,320),h=Math.max(window.innerHeight,560);
      svg.setAttribute('viewBox',`0 0 ${w} ${h}`);svg.setAttribute('width',w);svg.setAttribute('height',h);
      const count=Math.min(18,Math.max(10,Math.round(w/105)));
      for(let i=0;i<count;i++){
        const x=w*.04+rnd()*w*.92,y=h*.08+rnd()*h*.84,r=Math.min(180,Math.max(32,w*.028+rnd()*w*.085));
        const c=palette[Math.floor(rnd()*palette.length)];
        const kind=Math.floor(rnd()*6);
        if(kind===0)rosette(x,y,r,c);
        else if(kind===1){circle(x,y,r,c,.11);circle(x,y,r*.72,c,.07,'1 7');polygon(x,y,r,6,rnd()*30,c,.09)}
        else if(kind===2){polygon(x,y,r,3,rnd()*60,c,.11);polygon(x,y,r*.58,3,rnd()*60,c,.075);circle(x,y,r*.12,c,.15)}
        else if(kind===3){polygon(x,y,r,6,rnd()*30,c,.1);circle(x,y,r*.8,c,.07);circle(x,y,r*.35,c,.1,'2 6')}
        else if(kind===4){circle(x,y,r,c,.1,'1 8');circle(x,y,r*.5,c,.08);circle(x,y,r*.2,c,.1)}
        else{circle(x,y,r,c,.1);const e=document.createElementNS(svgNS,'line');e.setAttribute('x1',x-r);e.setAttribute('y1',y);e.setAttribute('x2',x+r);e.setAttribute('y2',y);add(e,c,.055)}
      }
    };
    svg.appendChild(group);document.body.appendChild(svg);draw();
    let timer;window.addEventListener('resize',()=>{clearTimeout(timer);timer=setTimeout(draw,180)},{passive:true});
  };

  const install=()=>{
    if(document.getElementById('homepage-final-fix-css'))return;
    const style=document.createElement('style');style.id='homepage-final-fix-css';
    style.textContent=`
      html,body{background:#020204!important;overflow-x:hidden}
      #site-stars-bg{position:fixed!important;inset:0!important;width:100vw!important;height:100vh!important;min-width:100vw!important;min-height:100vh!important;object-fit:cover!important;object-position:center center!important;z-index:0!important;pointer-events:none!important;opacity:.62!important;filter:brightness(.72) contrast(1.12)!important}
      #signal-geometry-layer{position:fixed!important;inset:0!important;width:100vw!important;height:100vh!important;z-index:2!important;pointer-events:none!important;overflow:visible!important;opacity:.82!important;mix-blend-mode:screen!important}
      #signal-geometry-layer g{transform-origin:center;animation:sg-drift 28s ease-in-out infinite alternate}
      @keyframes sg-drift{from{transform:translate3d(-4px,2px,0) rotate(-.15deg)}to{transform:translate3d(4px,-2px,0) rotate(.15deg)}}
      .topbar{z-index:10000!important}.nav-stack{z-index:9999!important}.menu-panel{z-index:11000!important}.player-dock{z-index:12000!important}
      .dropdown{z-index:10001!important}.dropdown-menu{z-index:10002!important;position:absolute!important}
      .nav-stack,.menu-row,.dropdown,.dropdown-menu{isolation:isolate}
      .hero,.hero-inner,.section,.archive,.stars-zone,.signal,.catalog,.videos-section,.universe,.footer{position:relative;z-index:3}
      .hero{background:transparent!important}.hero:before{z-index:1!important;background:linear-gradient(180deg,rgba(2,2,4,.22),rgba(2,2,4,.34) 48%,rgba(2,2,4,.62) 82%,rgba(2,2,4,.86) 100%)!important}
      .hero:after{z-index:1!important;background:linear-gradient(90deg,rgba(2,2,4,.82),rgba(2,2,4,.42) 38%,rgba(2,2,4,.08) 70%,rgba(2,2,4,.5)),linear-gradient(0deg,rgba(2,2,4,.88),transparent 40%,rgba(2,2,4,.2))!important}
      .hero-ring{z-index:3!important}
      .stars-zone{background:rgba(2,2,4,.24)!important}
      .stars-zone>video{display:none!important}
      .universe-layout>.orbit-stage{grid-column:1 / -1!important;justify-self:center!important;width:min(620px,48vw)!important;margin:34px auto 0!important}
      .universe-layout .universe-copy{grid-column:1!important}
      .universe .n6{display:none!important}
      @media(max-width:1100px){.dropdown-menu{z-index:10002!important}}
      @media(max-width:800px){
        #site-stars-bg{opacity:.58!important;object-position:center center!important}
        #signal-geometry-layer{opacity:.68!important}
        .universe-layout{grid-template-columns:1fr!important;gap:28px!important}
        .universe-layout>.orbit-stage{grid-column:1!important;width:min(82vw,430px)!important;margin:8px auto 0!important;justify-self:center!important}
        .orbit-stage .node{width:70px;height:70px}
      }
      @media(max-width:480px){
        #site-stars-bg{opacity:.55!important}
        #signal-geometry-layer{opacity:.56!important}
        .universe-layout>.orbit-stage{width:82vw!important;max-width:360px!important;margin:0 auto 0!important;transform:translateX(-2vw)!important}
        .orbit-stage .node{width:58px;height:58px}
      }
      @media(prefers-reduced-motion:reduce){#signal-geometry-layer g{animation:none!important}}
    `;
    document.head.appendChild(style);
  };

  const run=()=>{install();removeLegacyHeroBackground();ensureStarsBackground();removePrivateCommandNode();installSignalGeometry()};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
})();
