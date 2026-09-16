(()=>{
  const STARS='/assets/mov/LS_BG_STARS.webm';
  const ns='http://www.w3.org/2000/svg';
  const palette=['#ff008f','#ff4fd8','#8b5cf6','#22d3ee','#facc15','#1db954','#00f5d4','#ff6b35','#a78bfa','#f472b6'];

  const stars=()=>{
    let bg=document.getElementById('site-stars-bg');
    if(!bg){bg=document.createElement('video');bg.id='site-stars-bg';bg.setAttribute('aria-hidden','true');bg.muted=true;bg.defaultMuted=true;bg.autoplay=true;bg.loop=true;bg.playsInline=true;bg.preload='auto';const s=document.createElement('source');s.src=STARS;s.type='video/webm';bg.appendChild(s);document.body.insertBefore(bg,document.body.firstChild)}
    bg.muted=true;bg.defaultMuted=true;bg.autoplay=true;bg.loop=true;bg.playsInline=true;bg.preload='auto';if(bg.src!==location.origin+STARS)bg.src=STARS;bg.load();bg.play().catch(()=>{});return bg;
  };

  const shape=(g,type,cx,cy,r,color)=>{
    const add=(el,op=.20,w=1.6)=>{el.setAttribute('fill','none');el.setAttribute('stroke',color);el.setAttribute('stroke-width',w);el.setAttribute('opacity',op);g.appendChild(el)};
    const circle=(x,y,rr,op=.22,dash='')=>{const e=document.createElementNS(ns,'circle');e.setAttribute('cx',x);e.setAttribute('cy',y);e.setAttribute('r',rr);if(dash)e.setAttribute('stroke-dasharray',dash);add(e,op)};
    const poly=(n,rr,rot,op=.22)=>{const e=document.createElementNS(ns,'polygon'),p=[];for(let i=0;i<n;i++){const a=(rot+i*360/n)*Math.PI/180;p.push(`${Math.cos(a)*rr},${Math.sin(a)*rr}`)}e.setAttribute('points',p.join(' '));add(e,op,1.75)};
    if(type===0){circle(0,0,r,.25);for(let i=0;i<6;i++){const a=i*Math.PI/3;circle(Math.cos(a)*r,Math.sin(a)*r,r,.16)}circle(0,0,r*.48,.22,'3 5');poly(6,r,30,.17)}
    else if(type===1){circle(0,0,r*.72,.23);for(let i=0;i<6;i++){const a=i*Math.PI/3;circle(Math.cos(a)*r*.72,Math.sin(a)*r*.72,r*.72,.15)}circle(0,0,r*.24,.25)}
    else if(type===2){circle(0,0,r,.25);circle(0,0,r*.82,.16,'3 6');for(let i=0;i<8;i++){const a=i*Math.PI/4;circle(Math.cos(a)*r*.48,Math.sin(a)*r*.48,r*.46,.13)}poly(8,r*.88,22.5,.16);poly(8,r*.62,0,.18);circle(0,0,r*.16,.29)}
    else if(type===3){poly(3,r,-90,.25);poly(3,r,90,.19);circle(0,0,r*.12,.27)}
    else if(type===4){poly(6,r,30,.24);poly(6,r,0,.19);circle(0,0,r*.34,.20);circle(0,0,r*.12,.27)}
    else if(type===5){circle(0,0,r,.21,'1 7');circle(0,0,r*.72,.16);poly(6,r,.0,.16)}
    else if(type===6){poly(3,r,Math.random()*60,.24);poly(3,r*.58,Math.random()*60,.16);circle(0,0,r*.12,.25)}
    else if(type===7){poly(6,r,Math.random()*30,.21);circle(0,0,r*.8,.16);circle(0,0,r*.35,.20,'2 6')}
    else if(type===8){circle(0,0,r,.20,'1 8');circle(0,0,r*.5,.16);circle(0,0,r*.2,.24,'2 4')}
    else{circle(0,0,r,.21);const h=document.createElementNS(ns,'line');h.setAttribute('x1',-r);h.setAttribute('y1',0);h.setAttribute('x2',r);h.setAttribute('y2',0);add(h,.12,1.3);const v=document.createElementNS(ns,'line');v.setAttribute('x1',0);v.setAttribute('y1',-r);v.setAttribute('x2',0);v.setAttribute('y2',r);add(v,.12,1.3)}
    g.setAttribute('transform',`translate(${cx} ${cy})`);
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
      if(connector){const add=(x1,y1,x2,y2)=>{const e=document.createElementNS(ns,'line');e.setAttribute('x1',x1);e.setAttribute('y1',y1);e.setAttribute('x2',x2);e.setAttribute('y2',y2);e.setAttribute('stroke',color);e.setAttribute('stroke-width','1.15');e.setAttribute('opacity','.11');g.appendChild(e)};for(let i=0;i<8;i++){const a=i*Math.PI/4;add(0,0,Math.cos(a)*r,Math.sin(a)*r)}}else shape(g,Math.floor(Math.random()*10),0,0,r,color);
      g.setAttribute('transform',`translate(${cx} ${cy})`);
      symbols.push({g,cx,cy,phase:rand(0,Math.PI*2),phase2:rand(0,Math.PI*2),phase3:rand(0,Math.PI*2),ax:rand(w*.012,w*.045),ay:rand(h*.012,h*.045),speed:rand(.000012,.000035),spin:rand(.012,.085)*(Math.random()<.28?-1:1),spinWave:rand(.2,.7),opacity:connector?rand(.42,.62):rand(.52,.78)});
      g.style.opacity=symbols[symbols.length-1].opacity;
    };
    const count=Math.min(30,Math.max(18,Math.round(w/58)));
    for(let i=0;i<count;i++)addSymbol(false);for(let i=0;i<4;i++)addSymbol(true);
    svg.appendChild(field);document.body.appendChild(svg);

    let raf=0,start=performance.now(),pausedAt=0,pausedTotal=0;
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
    document.addEventListener('visibilitychange',()=>{if(!document.hidden)raf=requestAnimationFrame(frame)},{passive:true});
  };

  const css=()=>{if(document.getElementById('homepage-final-fix-css'))return;const s=document.createElement('style');s.id='homepage-final-fix-css';s.textContent=`html,body{background:#020204!important;overflow-x:hidden}#site-stars-bg{position:fixed!important;inset:0!important;width:100vw!important;height:100svh!important;object-fit:cover!important;z-index:0!important;pointer-events:none!important;opacity:.62!important;filter:brightness(.72) contrast(1.12)!important}#signal-geometry-layer{position:fixed!important;inset:0!important;width:100vw!important;height:100svh!important;z-index:2!important;pointer-events:none!important;overflow:visible!important;opacity:.76!important;mix-blend-mode:screen!important;filter:saturate(1.9) brightness(1.35) contrast(1.02)!important}.sg-symbol{transform-origin:0 0;will-change:transform}.hero,.hero-inner,.section,.archive,.stars-zone,.signal,.catalog,.videos-section,.universe,.footer{position:relative;z-index:3}.hero{background:transparent!important}.stars-zone>video{display:none!important}.topbar{z-index:10000!important}.nav-stack{z-index:9999!important}.menu-panel,.dropdown-menu{z-index:11000!important}.universe-layout>.orbit-stage{grid-column:1/-1!important;justify-self:center!important;width:min(620px,48vw)!important;margin:34px auto 0!important}.universe .n6{display:none!important}@media(max-width:800px){#signal-geometry-layer{opacity:.68!important}.universe-layout{grid-template-columns:1fr!important}.universe-layout>.orbit-stage{width:min(82vw,430px)!important;margin:8px auto 0!important}.orbit-stage .node{width:70px;height:70px}}@media(max-width:480px){#signal-geometry-layer{opacity:.62!important}.universe-layout>.orbit-stage{width:82vw!important;max-width:360px!important;transform:translateX(-2vw)!important}.orbit-stage .node{width:58px;height:58px}}@media(prefers-reduced-motion:reduce){#signal-geometry-layer{display:none!important}}`;document.head.appendChild(s)};

  const run=()=>{css();stars();document.querySelectorAll('.hero>.hero-webm,.hero>.hero-stars').forEach(e=>e.remove());document.querySelectorAll('.universe .node.n6,.orbit-stage .n6,a.node[href="/command"],a.node[href="/command/"]').forEach(e=>e.remove());installGeometry()};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
})();
