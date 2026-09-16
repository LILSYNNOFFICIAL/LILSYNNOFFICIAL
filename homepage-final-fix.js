(()=>{
  // The promoted THE SIGNAL homepage owns its header/navigation and hero layout.
  // Keep the legacy universal shell off this page and apply only the final visual tuning.
  const ensureWebmPlayback=()=>{
    const sources={
      '.hero>.hero-webm':'/assets/mov/HERO_BG_WEBM.webm',
      '.hero>.hero-stars':'/assets/mov/LS_BG_STARS.webm'
    };
    Object.entries(sources).forEach(([selector,url])=>{
      const video=document.querySelector(selector);
      if(!video)return;
      video.muted=true;
      video.defaultMuted=true;
      video.autoplay=true;
      video.loop=true;
      video.playsInline=true;
      video.setAttribute('muted','');
      video.setAttribute('autoplay','');
      video.setAttribute('loop','');
      video.setAttribute('playsinline','');
      video.preload='auto';
      const source=video.querySelector('source');
      if(video.getAttribute('src')!==url) video.src=url;
      if(source&&source.getAttribute('src')!==url) source.src=url;
      const play=()=>video.play().catch(()=>{});
      video.addEventListener('loadeddata',play,{once:true});
      video.addEventListener('canplay',play,{once:true});
      video.load();
      play();
    });
    const resume=()=>document.querySelectorAll('.hero>.hero-webm,.hero>.hero-stars').forEach(v=>{if(v.paused)v.play().catch(()=>{})});
    document.addEventListener('visibilitychange',()=>{if(!document.hidden)resume()},{passive:true});
    window.addEventListener('pageshow',resume,{passive:true});
  };

  const installSignalGeometry=()=>{
    if(document.getElementById('signal-geometry-layer'))return;
    const svgNS='http://www.w3.org/2000/svg';
    const svg=document.createElementNS(svgNS,'svg');
    svg.id='signal-geometry-layer';
    svg.setAttribute('aria-hidden','true');
    svg.setAttribute('focusable','false');
    svg.innerHTML=`<defs>
      <filter id="sg-glow"><feGaussianBlur stdDeviation="1.8" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      <linearGradient id="sg-spectrum" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ff008f"/><stop offset=".35" stop-color="#8b5cf6"/><stop offset=".68" stop-color="#22d3ee"/><stop offset="1" stop-color="#facc15"/></linearGradient>
    </defs>`;
    const group=document.createElementNS(svgNS,'g');
    group.setAttribute('filter','url(#sg-glow)');
    const palette=['#ff008f','#ff4fd8','#8b5cf6','#22d3ee','#facc15','#1db954'];
    let seed=(Date.now()>>>0)||1;
    const rnd=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};
    const vw=()=>Math.max(document.documentElement.clientWidth,320);
    const vh=()=>Math.max(window.innerHeight,560);
    const add=(el,color,opacity=.13,width=1)=>{el.setAttribute('fill','none');el.setAttribute('stroke',color);el.setAttribute('stroke-width',String(width));el.setAttribute('opacity',String(opacity));group.appendChild(el)};
    const circle=(cx,cy,r,color,opacity=.12,dash='')=>{const e=document.createElementNS(svgNS,'circle');e.setAttribute('cx',cx);e.setAttribute('cy',cy);e.setAttribute('r',r);if(dash)e.setAttribute('stroke-dasharray',dash);add(e,color,opacity)};
    const polygon=(cx,cy,r,n,rotation,color,opacity=.1)=>{const e=document.createElementNS(svgNS,'polygon');const pts=[];for(let i=0;i<n;i++){const a=(rotation+i*360/n)*Math.PI/180;pts.push(`${cx+Math.cos(a)*r},${cy+Math.sin(a)*r}`)}e.setAttribute('points',pts.join(' '));add(e,color,opacity)};
    const rosette=(cx,cy,r,color)=>{circle(cx,cy,r,color,.11);for(let i=0;i<6;i++){const a=i*Math.PI/3;circle(cx+Math.cos(a)*r,cy+Math.sin(a)*r,r,color,.075)}circle(cx,cy,r*.52,color,.085,'3 5')};
    const draw=()=>{while(group.firstChild)group.removeChild(group.firstChild);const w=vw(),h=vh();svg.setAttribute('viewBox',`0 0 ${w} ${h}`);svg.setAttribute('width',w);svg.setAttribute('height',h);const count=Math.min(15,Math.max(9,Math.round(w/115)));for(let i=0;i<count;i++){const x=rnd()*w,y=rnd()*h,r=Math.min(150,Math.max(28,w*.025+rnd()*w*.09));const c=palette[Math.floor(rnd()*palette.length)];const kind=Math.floor(rnd()*5);if(kind===0){rosette(x,y,r,c)}else if(kind===1){circle(x,y,r,c,.1);circle(x,y,r*.72,'url(#sg-spectrum)',.09,'1 7');polygon(x,y,r,6,rnd()*30,c,.08)}else if(kind===2){polygon(x,y,r,3,rnd()*60,c,.1);polygon(x,y,r*.58,3,rnd()*60,c,.07);circle(x,y,r*.12,c,.14)}else if(kind===3){polygon(x,y,r,6,rnd()*30,c,.095);circle(x,y,r*.8,c,.07);circle(x,y,r*.35,c,.1,'2 6')}else{circle(x,y,r,c,.09,'1 8');circle(x,y,r*.5,c,.07);const e=document.createElementNS(svgNS,'line');e.setAttribute('x1',x-r);e.setAttribute('y1',y);e.setAttribute('x2',x+r);e.setAttribute('y2',y);add(e,c,.055)}}};
    svg.appendChild(group);document.body.appendChild(svg);draw();let timer;window.addEventListener('resize',()=>{clearTimeout(timer);timer=setTimeout(draw,180)},{passive:true});
  };

  const install=()=>{
    if(document.getElementById('homepage-final-fix-css')) return;
    const style=document.createElement('style');
    style.id='homepage-final-fix-css';
    style.textContent=`
      #signal-geometry-layer{position:fixed;inset:0;width:100vw;height:100vh;z-index:0;pointer-events:none;overflow:visible;opacity:.9;mix-blend-mode:screen;}
      #signal-geometry-layer g{transform-origin:center;animation:sg-drift 28s ease-in-out infinite alternate;}
      @keyframes sg-drift{from{transform:translate3d(-4px,2px,0) rotate(-.15deg)}to{transform:translate3d(4px,-2px,0) rotate(.15deg)}}
      body>header,body>nav,body>aside,body>main,body>footer{position:relative;z-index:1}
      @media(prefers-reduced-motion:reduce){#signal-geometry-layer g{animation:none!important}}

      /* HERO: crop upward so Synn's head dominates the frame. */
      .hero>.hero-webm{
        top:60px!important;
        height:52%!important;
        object-position:center top!important;
        transform:scale(1.10)!important;
      }

      /* STARS: begin directly where the hero WebM ends and remain visible. */
      .hero>.hero-stars{
        top:calc(60px + 52%)!important;
        bottom:auto!important;
        height:48%!important;
        object-position:center top!important;
        opacity:.84!important;
        filter:brightness(.72) contrast(1.15)!important;
      }

      .hero:before{
        inset:60px 0 0!important;
        background:linear-gradient(180deg,rgba(2,2,4,.03),rgba(2,2,4,.08) 48%,rgba(2,2,4,.34) 78%,rgba(2,2,4,.72) 100%)!important;
      }

      /* UNIVERSE: center the complete orbital assembly and move it lower. */
      .universe-layout>.orbit-stage{
        grid-column:1 / -1!important;
        justify-self:center!important;
        margin:88px auto 0!important;
      }

      @media(max-width:800px){
        .hero>.hero-webm{
          top:62px!important;
          height:47%!important;
          object-position:center top!important;
          transform:scale(1.12)!important;
        }
        .hero>.hero-stars{
          top:calc(62px + 47%)!important;
          bottom:auto!important;
          height:47%!important;
          opacity:.84!important;
        }
        .hero:before{inset:62px 0 0!important}
        .universe-layout>.orbit-stage{margin:70px auto 0!important}
      }

      @media(max-width:480px){
        .hero>.hero-webm{
          top:56px!important;
          height:45%!important;
          transform:scale(1.14)!important;
        }
        .hero>.hero-stars{
          top:calc(56px + 45%)!important;
          height:49%!important;
          opacity:.86!important;
        }
        .hero:before{inset:56px 0 0!important}
        .universe-layout>.orbit-stage{margin-top:58px!important}
      }
    `;
    document.head.appendChild(style);
  };
  const run=()=>{install();ensureWebmPlayback();installSignalGeometry()};
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',run,{once:true});
  else run();
})();
