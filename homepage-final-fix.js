(()=>{
  const STARS='/assets/mov/LS_BG_STARS.webm';

  const ensureStarsBackground=()=>{
    let bg=document.getElementById('site-stars-bg');
    if(!bg){
      bg=document.createElement('video');
      bg.id='site-stars-bg';
      bg.setAttribute('aria-hidden','true');
      bg.setAttribute('tabindex','-1');
      bg.muted=true;bg.defaultMuted=true;bg.autoplay=true;bg.loop=true;bg.playsInline=true;bg.preload='auto';
      const source=document.createElement('source');source.src=STARS;source.type='video/webm';bg.appendChild(source);document.body.insertBefore(bg,document.body.firstChild);
    }
    bg.muted=true;bg.defaultMuted=true;bg.autoplay=true;bg.loop=true;bg.playsInline=true;bg.preload='auto';
    if(bg.getAttribute('src')!==STARS)bg.src=STARS;
    const source=bg.querySelector('source');if(source&&source.src!==location.origin+STARS)source.src=STARS;
    const play=()=>bg.play().catch(()=>{});bg.addEventListener('loadeddata',play,{once:true});bg.addEventListener('canplay',play,{once:true});bg.load();play();
    const resume=()=>{if(!document.hidden&&bg.paused)play()};document.addEventListener('visibilitychange',resume,{passive:true});window.addEventListener('pageshow',resume,{passive:true});return bg;
  };
  const removeLegacyHeroBackground=()=>{document.querySelectorAll('.hero>.hero-webm').forEach(v=>v.remove());document.querySelectorAll('.hero>.hero-stars').forEach(v=>v.remove())};
  const removePrivateCommandNode=()=>{document.querySelectorAll('.universe .node.n6,.orbit-stage .n6,a.node[href="/command"],a.node[href="/command/"]').forEach(el=>el.remove())};

  const installSignalGeometry=()=>{
    if(document.getElementById('signal-geometry-layer'))return;
    const svgNS='http://www.w3.org/2000/svg',svg=document.createElementNS(svgNS,'svg'),group=document.createElementNS(svgNS,'g');
    svg.id='signal-geometry-layer';svg.setAttribute('aria-hidden','true');svg.setAttribute('focusable','false');
    const palette=['#ff008f','#ff4fd8','#8b5cf6','#22d3ee','#facc15','#1db954','#00f5d4','#ff6b35','#a78bfa','#f472b6'];
    let seed=(Date.now()>>>0)||1;const rnd=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};
    const add=(el,color,opacity=.25,width=1.6)=>{el.setAttribute('fill','none');el.setAttribute('stroke',color);el.setAttribute('stroke-width',String(width));el.setAttribute('opacity',String(opacity));group.appendChild(el)};
    const circle=(cx,cy,r,color,opacity=.24,dash='',width=1.6)=>{const e=document.createElementNS(svgNS,'circle');e.setAttribute('cx',cx);e.setAttribute('cy',cy);e.setAttribute('r',r);if(dash)e.setAttribute('stroke-dasharray',dash);add(e,color,opacity,width)};
    const polygon=(cx,cy,r,n,rotation,color,opacity=.22)=>{const e=document.createElementNS(svgNS,'polygon'),pts=[];for(let i=0;i<n;i++){const a=(rotation+i*360/n)*Math.PI/180;pts.push(`${cx+Math.cos(a)*r},${cy+Math.sin(a)*r}`)}e.setAttribute('points',pts.join(' '));add(e,color,opacity,1.7)};
    const line=(x1,y1,x2,y2,color,opacity=.15,width=1.35)=>{const e=document.createElementNS(svgNS,'line');e.setAttribute('x1',x1);e.setAttribute('y1',y1);e.setAttribute('x2',x2);e.setAttribute('y2',y2);add(e,color,opacity,width)};
    const rosette=(cx,cy,r,color)=>{circle(cx,cy,r,color,.31,'',1.9);for(let i=0;i<6;i++){const a=i*Math.PI/3;circle(cx+Math.cos(a)*r,cy+Math.sin(a)*r,r,color,.21,'',1.55)}circle(cx,cy,r*.5,color,.25,'3 5',1.65);polygon(cx,cy,r,6,30,color,.21)};
    const flower=(cx,cy,r,color)=>{circle(cx,cy,r*.72,color,.28,'',1.7);for(let i=0;i<6;i++){const a=i*Math.PI/3;circle(cx+Math.cos(a)*r*.72,cy+Math.sin(a)*r*.72,r*.72,color,.20,'',1.55)}circle(cx,cy,r*.24,color,.32,'',1.8)};
    const mandala=(cx,cy,r,color)=>{circle(cx,cy,r,color,.30,'',1.9);circle(cx,cy,r*.82,color,.21,'3 6',1.5);for(let i=0;i<8;i++){const a=i*Math.PI/4;circle(cx+Math.cos(a)*r*.48,cy+Math.sin(a)*r*.48,r*.46,color,.17,'',1.45)}polygon(cx,cy,r*.88,8,22.5,color,.19);polygon(cx,cy,r*.62,8,0,color,.22);circle(cx,cy,r*.16,color,.36,'',1.9)};
    const merkaba=(cx,cy,r,color)=>{polygon(cx,cy,r,3,-90,color,.29);polygon(cx,cy,r,3,90,color,.23);circle(cx,cy,r*.12,color,.34,'',1.8)};
    const sacredHex=(cx,cy,r,color)=>{polygon(cx,cy,r,6,30,color,.28);polygon(cx,cy,r,6,0,color,.23);circle(cx,cy,r*.34,color,.25);circle(cx,cy,r*.12,color,.34)};
    const om=(cx,cy,r,color)=>{const text=document.createElementNS(svgNS,'text');text.setAttribute('x',cx);text.setAttribute('y',cy+r*.34);text.setAttribute('text-anchor','middle');text.setAttribute('font-size',String(r*1.05));text.setAttribute('font-family','serif');text.setAttribute('font-weight','600');text.setAttribute('fill',color);text.setAttribute('stroke',color);text.setAttribute('stroke-width','0.45');text.setAttribute('opacity','.84');text.textContent='ॐ';group.appendChild(text)};
    const draw=()=>{
      while(group.firstChild)group.removeChild(group.firstChild);const w=Math.max(document.documentElement.clientWidth,320),h=Math.max(window.innerHeight,560);svg.setAttribute('viewBox',`0 0 ${w} ${h}`);svg.setAttribute('width',w);svg.setAttribute('height',h);
      const count=Math.min(28,Math.max(15,Math.round(w/68)));
      for(let i=0;i<count;i++){const x=w*.025+rnd()*w*.95,y=h*.055+rnd()*h*.89,r=Math.min(170,Math.max(28,w*.022+rnd()*w*.07)),c=palette[Math.floor(rnd()*palette.length)],kind=Math.floor(rnd()*10);let e;
        if(kind===0)rosette(x,y,r,c);else if(kind===1)flower(x,y,r,c);else if(kind===2)mandala(x,y,r,c);else if(kind===3)merkaba(x,y,r,c);else if(kind===4)sacredHex(x,y,r,c);else if(kind===5){circle(x,y,r,c,.25,'1 7',1.65);circle(x,y,r*.72,c,.20,'',1.45);polygon(x,y,r,6,rnd()*30,c,.20)}else if(kind===6){polygon(x,y,r,3,rnd()*60,c,.27);polygon(x,y,r*.58,3,rnd()*60,c,.20);circle(x,y,r*.12,c,.31,'',1.7)}else if(kind===7){polygon(x,y,r,6,rnd()*30,c,.25);circle(x,y,r*.8,c,.20);circle(x,y,r*.35,c,.25,'2 6',1.45)}else if(kind===8){circle(x,y,r,c,.23,'1 8',1.6);circle(x,y,r*.5,c,.20);circle(x,y,r*.2,c,.28,'',1.5)}else{circle(x,y,r,c,.24,'',1.6);line(x-r,y,x+r,y,c,.16);line(x,y-r,x,y+r,c,.16)}
      }
      om(w*.82,h*.22,Math.min(58,Math.max(38,w*.045)),palette[1]);
      for(let i=0;i<4;i++){const x=w*(.12+rnd()*.76),y=h*(.18+rnd()*.64),r=Math.min(95,Math.max(34,w*.035+rnd()*w*.025)),c=palette[Math.floor(rnd()*palette.length)];for(let j=0;j<8;j++){const a=j*Math.PI/4;line(x,y,x+Math.cos(a)*r,y+Math.sin(a)*r,c,.10,1.15)}}
      Array.from(group.children).forEach((el,i)=>{el.style.transformBox='fill-box';el.style.transformOrigin='center';el.style.animation=`sg-float-${i%6} ${18+(i%7)*3}s ease-in-out infinite`;el.style.willChange='transform,opacity';});
    };
    svg.appendChild(group);document.body.appendChild(svg);draw();let timer;window.addEventListener('resize',()=>{clearTimeout(timer);timer=setTimeout(draw,180)},{passive:true});
  };

  const install=()=>{
    if(document.getElementById('homepage-final-fix-css'))return;const style=document.createElement('style');style.id='homepage-final-fix-css';style.textContent=`
      html,body{background:#020204!important;overflow-x:hidden}
      #site-stars-bg{position:fixed!important;top:0!important;left:0!important;width:100vw!important;height:100svh!important;min-width:100vw!important;min-height:100svh!important;object-fit:cover!important;object-position:center center!important;z-index:0!important;pointer-events:none!important;opacity:.62!important;filter:brightness(.72) contrast(1.12)!important;transform:translate3d(0,0,0)!important;backface-visibility:hidden!important;-webkit-backface-visibility:hidden!important;will-change:transform!important;contain:layout paint!important}
      #signal-geometry-layer{position:fixed!important;inset:0!important;width:100vw!important;height:100svh!important;z-index:2!important;pointer-events:none!important;overflow:visible!important;opacity:1!important;mix-blend-mode:screen!important;filter:saturate(1.5) brightness(1.22) contrast(1.06)!important;transform:translate3d(0,0,0)!important;backface-visibility:hidden!important;-webkit-backface-visibility:hidden!important}
      #signal-geometry-layer>g>text{filter:drop-shadow(0 0 7px rgba(255,0,143,.55))}
      @keyframes sg-float-0{0%,100%{transform:translate3d(-7px,4px,0) rotate(-7deg) scale(1)}50%{transform:translate3d(9px,-8px,0) rotate(8deg) scale(1.035)}}
      @keyframes sg-float-1{0%,100%{transform:translate3d(6px,-5px,0) rotate(9deg) scale(1.02)}50%{transform:translate3d(-10px,9px,0) rotate(-10deg) scale(.97)}}
      @keyframes sg-float-2{0%,100%{transform:translate3d(-4px,-8px,0) rotate(14deg) scale(.98)}50%{transform:translate3d(8px,7px,0) rotate(-13deg) scale(1.04)}}
      @keyframes sg-float-3{0%,100%{transform:translate3d(8px,3px,0) rotate(-11deg) scale(1)}50%{transform:translate3d(-7px,-9px,0) rotate(12deg) scale(1.03)}}
      @keyframes sg-float-4{0%,100%{transform:translate3d(-9px,1px,0) rotate(6deg) scale(1.03)}50%{transform:translate3d(5px,8px,0) rotate(-8deg) scale(.98)}}
      @keyframes sg-float-5{0%,100%{transform:translate3d(4px,7px,0) rotate(-4deg) scale(.99)}50%{transform:translate3d(-8px,-6px,0) rotate(6deg) scale(1.035)}}
      .topbar{z-index:10000!important}.nav-stack{z-index:9999!important}.menu-panel{z-index:11000!important}.player-dock{z-index:12000!important}.dropdown{z-index:10001!important}.dropdown-menu{z-index:10002!important;position:absolute!important}.nav-stack,.menu-row,.dropdown,.dropdown-menu{isolation:isolate}
      .hero,.hero-inner,.section,.archive,.stars-zone,.signal,.catalog,.videos-section,.universe,.footer{position:relative;z-index:3}.hero{background:transparent!important}.hero:before{z-index:1!important;background:linear-gradient(180deg,rgba(2,2,4,.22),rgba(2,2,4,.34) 48%,rgba(2,2,4,.62) 82%,rgba(2,2,4,.86) 100%)!important}.hero:after{z-index:1!important;background:linear-gradient(90deg,rgba(2,2,4,.82),rgba(2,2,4,.42) 38%,rgba(2,2,4,.08) 70%,rgba(2,2,4,.5)),linear-gradient(0deg,rgba(2,2,4,.88),transparent 40%,rgba(2,2,4,.2))!important}.hero-ring{z-index:3!important}.stars-zone{background:rgba(2,2,4,.24)!important}.stars-zone>video{display:none!important}.universe-layout>.orbit-stage{grid-column:1 / -1!important;justify-self:center!important;width:min(620px,48vw)!important;margin:34px auto 0!important}.universe-layout .universe-copy{grid-column:1!important}.universe .n6{display:none!important}
      @media(max-width:1100px){.dropdown-menu{z-index:10002!important}}
      @media(max-width:800px){#site-stars-bg{opacity:.58!important;height:100svh!important;min-height:100svh!important}#signal-geometry-layer{opacity:.92!important;height:100svh!important}.universe-layout{grid-template-columns:1fr!important;gap:28px!important}.universe-layout>.orbit-stage{grid-column:1!important;width:min(82vw,430px)!important;margin:8px auto 0!important;justify-self:center!important}.orbit-stage .node{width:70px;height:70px}}
      @media(max-width:480px){#site-stars-bg{opacity:.56!important;height:100svh!important;min-height:100svh!important}#signal-geometry-layer{opacity:.84!important;height:100svh!important}.universe-layout>.orbit-stage{width:82vw!important;max-width:360px!important;margin:0 auto 0!important;transform:translateX(-2vw)!important}.orbit-stage .node{width:58px;height:58px}}
      @media(prefers-reduced-motion:reduce){#signal-geometry-layer>g>*{animation:none!important}}
    `;document.head.appendChild(style);
  };
  const run=()=>{install();removeLegacyHeroBackground();ensureStarsBackground();removePrivateCommandNode();installSignalGeometry()};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
})();
