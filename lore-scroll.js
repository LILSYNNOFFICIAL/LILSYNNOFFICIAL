/* LIL SYNN — Lore scroll journey (lore.html only). Vanilla JS, no dependencies. */
(function(){
  'use strict';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var small = window.matchMedia && window.matchMedia('(max-width: 700px)').matches;
  var scenes = Array.prototype.slice.call(document.querySelectorAll('.scene'));
  var rail = document.querySelector('.lore-rail');
  var fill = rail && rail.querySelector('.rail-fill');
  var dots = rail ? Array.prototype.slice.call(rail.querySelectorAll('a')) : [];
  var hasIO = 'IntersectionObserver' in window;

  /* lazy-load scene art */
  function load(img){
    if(!img || img.dataset.done) return;
    img.dataset.done = '1';
    img.addEventListener('load', function(){ img.classList.add('loaded'); }, {once:true});
    if(img.dataset.srcset) img.srcset = img.dataset.srcset;
    img.src = img.dataset.src;
    if(img.complete && img.naturalWidth) img.classList.add('loaded');
  }
  var imgs = Array.prototype.slice.call(document.querySelectorAll('.scene-bg img[data-src], .scene-poster img[data-src]'));
  if(hasIO){
    var lazy = new IntersectionObserver(function(es){
      es.forEach(function(e){ if(e.isIntersecting){ load(e.target); lazy.unobserve(e.target); } });
    }, {rootMargin:'120% 0px'});
    imgs.forEach(function(i){ lazy.observe(i); });
  } else imgs.forEach(load);

  /* reveal panels + Shadow Man breaks */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll('.reveal, .sm-break'));
  if(reduce || !hasIO){ revealEls.forEach(function(el){ el.classList.add('in'); }); }
  else {
    var rv = new IntersectionObserver(function(es){
      es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); rv.unobserve(e.target); } });
    }, {threshold:0.12, rootMargin:'0px 0px -8% 0px'});
    revealEls.forEach(function(el){ rv.observe(el); });
  }

  /* active chapter dot */
  if(hasIO && dots.length){
    var act = new IntersectionObserver(function(es){
      es.forEach(function(e){
        if(!e.isIntersecting) return;
        var id = e.target.id;
        var idx = -1;
        dots.forEach(function(d,i){ var on = d.getAttribute('href') === '#'+id; d.classList.toggle('active', on); if(on) idx = i; });
        dots.forEach(function(d,i){ d.classList.toggle('passed', i < idx); });
      });
    }, {rootMargin:'-45% 0px -45% 0px'});
    scenes.forEach(function(s){ if(s.id) act.observe(s); });
  }

  /* scroll: timeline fill + parallax (rAF-throttled) */
  var visible = new Set();
  if(hasIO && !reduce){
    var vis = new IntersectionObserver(function(es){
      es.forEach(function(e){ if(e.isIntersecting) visible.add(e.target); else visible.delete(e.target); });
    });
    scenes.forEach(function(s){ vis.observe(s); });
  }
  var factor = small ? 0.06 : 0.14;
  var ticking = false;
  function frame(){
    ticking = false;
    var doc = document.documentElement;
    var max = (doc.scrollHeight - window.innerHeight) || 1;
    var p = Math.min(1, Math.max(0, window.scrollY / max));
    if(fill) fill.style.setProperty('--p', p.toFixed(4));
    if(reduce) return;
    var vh = window.innerHeight;
    visible.forEach(function(s){
      var r = s.getBoundingClientRect();
      var img = s.querySelector('.scene-bg img');
      if(!img) return;
      var off = (r.top + r.height/2 - vh/2) * -factor;
      img.style.transform = 'translate3d(0,' + off.toFixed(1) + 'px,0)';
    });
  }
  function onScroll(){ if(!ticking){ ticking = true; requestAnimationFrame(frame); } }
  window.addEventListener('scroll', onScroll, {passive:true});
  window.addEventListener('resize', onScroll);
  frame();

  /* floating particles (light) */
  var c = document.getElementById('lore-particles');
  if(c && !reduce && c.getContext){
    var ctx = c.getContext('2d'), W, H, dpr = Math.min(window.devicePixelRatio || 1, small ? 1 : 1.5);
    var n = small ? 22 : 46, parts = [];
    function size(){ W = c.clientWidth; H = c.clientHeight; c.width = W*dpr; c.height = H*dpr; ctx.setTransform(dpr,0,0,dpr,0,0); }
    size(); window.addEventListener('resize', size);
    for(var i=0;i<n;i++) parts.push({x:Math.random()*W, y:Math.random()*H, r:Math.random()*1.6+.4, vy:-(Math.random()*.25+.05), vx:(Math.random()-.5)*.12, a:Math.random()*.6+.2, pink:Math.random()<.55});
    var running = true;
    document.addEventListener('visibilitychange', function(){ running = !document.hidden; if(running) requestAnimationFrame(draw); });
    function draw(){
      if(!running) return;
      ctx.clearRect(0,0,W,H);
      for(var i=0;i<parts.length;i++){
        var q = parts[i]; q.x += q.vx; q.y += q.vy;
        if(q.y < -5){ q.y = H + 5; q.x = Math.random()*W; }
        if(q.x < -5) q.x = W + 5; else if(q.x > W + 5) q.x = -5;
        ctx.beginPath(); ctx.arc(q.x, q.y, q.r, 0, 6.283);
        ctx.fillStyle = q.pink ? 'rgba(255,79,216,' + q.a + ')' : 'rgba(200,220,255,' + (q.a*.8) + ')';
        ctx.fill();
      }
      requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);
  }
})();
