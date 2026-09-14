(()=>{
  if(!/\/index2(?:\.html)?$/.test(location.pathname)) return;
  if(window.__lsIndex2RefinementLoaded) return;
  window.__lsIndex2RefinementLoaded=true;

  const VOTE='https://tinyurl.com/VOTE-LIL-SYNN';
  const FORUM='https://suno-forum.base44.app';
  const APPLE='https://music.apple.com/us/artist/lil-synn/1850720041';
  const SPOTIFY='https://open.spotify.com/artist/6ozcOAnRAUPn3z5c0GR5kU';
  const YOUTUBE='https://www.youtube.com/@LILSYNNOFFICIAL';
  const INSTAGRAM='https://www.instagram.com/lilsynnofficial/';
  const X='https://x.com/lilsynnofficial';
  const SOUNDCLOUD='https://soundcloud.com/lilsynnofficial';
  const TIKTOK='https://www.tiktok.com/@lilsynnofficial';
  const FACEBOOK='https://www.facebook.com/lilsynnofficial';
  const RECORDS='https://www.facebook.com/people/SYNTIENT-RECORDS/61574033170694/';

  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  const css=`
  html{scrollbar-color:#ff008f #08080c;scrollbar-width:thin}
  body::-webkit-scrollbar{width:8px}body::-webkit-scrollbar-track{background:#08080c}body::-webkit-scrollbar-thumb{background:#ff008f;border-radius:9px;border:2px solid #08080c}
  body.index2-refined{background:#020204!important}
  body.index2-refined .hero{height:620px!important;min-height:620px!important;padding-top:105px!important;isolation:isolate}
  body.index2-refined .hero>.hero-webm{top:78px!important;height:542px!important;bottom:auto!important;object-position:center top!important;transform:scale(1.01)!important;z-index:0!important}
  body.index2-refined .hero>.hero-stars{display:none!important}
  body.index2-refined .hero:before{inset:78px 0 0!important;background:linear-gradient(180deg,rgba(2,2,4,.02),rgba(2,2,4,.08) 58%,rgba(2,2,4,.66) 91%,#020204 100%)!important}
  body.index2-refined .hero-inner,body.index2-refined .hero-copy,body.index2-refined .hero-ring,body.index2-refined .hero-readout{z-index:3}
  .ls2-page-stars{position:absolute!important;left:0!important;right:0!important;z-index:0!important;pointer-events:none!important;overflow:hidden!important}
  .ls2-page-stars video{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;object-fit:cover!important;object-position:center top!important;opacity:.43!important;filter:brightness(.62) contrast(1.12)!important}
  .ls2-page-stars:after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(2,2,4,.03),rgba(2,2,4,.28) 32%,rgba(2,2,4,.7) 78%,#020204 100%)}
  body.index2-refined> :not(.ls2-page-stars):not(.topbar):not(.menu-panel):not(script):not(style){position:relative;z-index:1}
  body.index2-refined main,body.index2-refined .section,body.index2-refined .archive,body.index2-refined .stars-zone{background:transparent!important}
  body.index2-refined .stars-zone{border-top-color:rgba(255,0,143,.18)!important}
  .ls2-particles{position:absolute;inset:0;pointer-events:none;z-index:4;overflow:hidden}
  .ls2-particle{position:absolute;width:2px;height:2px;border-radius:50%;background:rgba(255,79,216,.28);box-shadow:0 0 8px rgba(255,0,143,.2);animation:ls2Float var(--d) ease-in-out infinite alternate}
  .ls2-particle:nth-child(3n){background:rgba(255,255,255,.2)}
  @keyframes ls2Float{from{transform:translate3d(0,12px,0);opacity:.06}to{transform:translate3d(var(--x),-34px,0);opacity:.32}}
  .desktop-nav .ls-vote-link{color:#fff!important;background:#ff008f!important;border:1px solid #ff008f!important;padding:7px 10px!important;box-shadow:0 0 18px rgba(255,0,143,.2)}
  .hamburger{display:grid!important;border-color:rgba(255,0,143,.65)!important;background:rgba(2,2,4,.78)!important;box-shadow:0 0 18px rgba(255,0,143,.13)}
  .hamburger span{background:#ff008f!important;box-shadow:0 0 8px rgba(255,0,143,.45)}
  .ls2-artist{position:relative;z-index:2;padding:92px 0 105px;width:min(1320px,92vw);margin:auto}
  .ls2-artist-head{display:flex;justify-content:space-between;align-items:end;gap:30px;margin-bottom:28px}.ls2-artist-head h2{font:600 clamp(34px,5vw,68px)/.92 Orbitron,sans-serif;margin:7px 0}.ls2-artist-head p{max-width:510px;color:#9696a1;margin:0;line-height:1.55}
  .ls2-artist-controls{display:flex;flex-wrap:wrap;gap:7px;margin-top:24px}
  .ls2-artist-button{border:1px solid rgba(255,0,143,.3);background:rgba(2,2,4,.7);color:#d7d7dc;padding:11px 13px;font:700 8px Rajdhani,sans-serif;letter-spacing:.18em;text-transform:uppercase;cursor:pointer}.ls2-artist-button:hover,.ls2-artist-button.active{color:#fff;background:#ff008f;border-color:#ff008f}
  .ls2-modal{position:fixed;inset:0;z-index:500;background:rgba(0,0,0,.72);backdrop-filter:blur(10px);display:none;align-items:center;justify-content:center;padding:5vw}.ls2-modal.open{display:flex}
  .ls2-modal-window{position:relative;width:min(900px,94vw);max-height:84vh;overflow:auto;background:rgba(5,5,8,.98);border:1px solid rgba(255,0,143,.4);box-shadow:0 30px 100px rgba(0,0,0,.75);padding:42px 44px 48px;scrollbar-color:#ff008f #08080c;scrollbar-width:thin}.ls2-modal-window::-webkit-scrollbar{width:8px}.ls2-modal-window::-webkit-scrollbar-track{background:#08080c}.ls2-modal-window::-webkit-scrollbar-thumb{background:#ff008f;border-radius:8px}.ls2-modal-window h3{font:600 clamp(25px,4vw,45px)/1 Orbitron,sans-serif;color:#ff4fd8;margin:0 45px 25px 0}.ls2-modal-window p{color:#c4c4ca;font-size:15px;line-height:1.65;margin:0 0 18px}.ls2-modal-close{position:absolute;right:16px;top:12px;border:1px solid rgba(255,255,255,.16);background:none;color:#fff;width:38px;height:38px;font-size:25px;cursor:pointer}.ls2-modal-close:hover{border-color:#ff008f;color:#ff4fd8}
  .ls2-footer{position:relative;z-index:2;padding:55px 5vw 28px;text-align:center;background:#020204;border-top:1px solid rgba(255,0,143,.18)}.ls2-footer-socials{display:flex;justify-content:center;flex-wrap:wrap;gap:10px;margin:22px auto 28px}.ls2-footer-socials a{width:42px;height:42px;display:grid;place-items:center;border:1px solid rgba(255,0,143,.22);background:rgba(255,255,255,.02);transition:.2s}.ls2-footer-socials a:hover{border-color:#ff008f;background:rgba(255,0,143,.09);transform:translateY(-2px)}.ls2-footer-socials img{width:20px;height:20px;object-fit:contain}.ls2-footer-label{font:700 18px Orbitron,sans-serif;letter-spacing:.14em}.ls2-footer-label a{color:#ff4fd8}.ls2-footer-tag{margin:14px 0 6px;font:700 10px Rajdhani,sans-serif;letter-spacing:.28em;color:#c9c9d0}.ls2-footer-copy{font-size:9px;letter-spacing:.18em;color:#6f6f79}.ls2-footer-links{display:flex;justify-content:center;flex-wrap:wrap;gap:14px;margin:18px 0}.ls2-footer-links a{font-size:8px;font-weight:800;letter-spacing:.16em;color:#92929b}.ls2-footer-links a:hover{color:#ff4fd8}.ls2-footer-legal{display:flex;justify-content:center;gap:18px;margin-top:14px}.ls2-footer-legal a{font-size:8px;letter-spacing:.15em;color:#6e6e77}.ls2-footer-legal a:hover{color:#fff}.ls2-easter{display:inline-flex;width:70px;height:55px;overflow:hidden;align-items:center;justify-content:center;margin:14px auto 0}.ls2-easter img{width:145px;height:145px;max-width:none;object-fit:contain;transform:scale(1.55)}.ls2-easter:hover{filter:drop-shadow(0 0 12px rgba(255,0,143,.35))}.ls2-up{position:fixed;z-index:450;right:18px;bottom:18px;width:46px;height:46px;border:1px solid rgba(255,0,143,.45);background:rgba(2,2,4,.86);display:grid;place-items:center;opacity:.72;cursor:pointer}.ls2-up img{width:27px;height:27px;object-fit:contain}.ls2-up:hover{opacity:1;border-color:#ff008f}
  @media(max-width:760px){body.index2-refined .hero{height:500px!important;min-height:500px!important}body.index2-refined .hero>.hero-webm{top:68px!important;height:432px!important}.desktop-nav .ls-vote-link{display:none!important}.ls2-artist-head{display:block}.ls2-modal{padding:14px}.ls2-modal-window{padding:38px 22px 30px;max-height:88vh}.ls2-footer-socials a{width:38px;height:38px}.ls2-footer-socials img{width:18px;height:18px}}
  `;
  const style=document.createElement('style');style.id='ls2-final-refinement-css';style.textContent=css;document.head.appendChild(style);
  document.body.classList.add('index2-refined');

  const nav=()=>{
    const desktop=document.querySelector('.desktop-nav');
    if(desktop){
      let vote=desktop.querySelector('.ls-vote-link');
      if(!vote){vote=document.createElement('a');vote.className='ls-vote-link';vote.href=VOTE;vote.target='_blank';vote.rel='noopener noreferrer';vote.textContent='VOTE 4 LIL SYNN';const universe=[...desktop.querySelectorAll('a')].find(a=>/universe/i.test(a.textContent));(universe||desktop.lastElementChild)?.insertAdjacentElement('afterend',vote)}
    }
    const panel=document.querySelector('.menu-panel');
    if(panel){
      const links=[...panel.querySelectorAll('a')];
      const ensure=(text,href,hot=false)=>{if(links.some(a=>a.textContent.trim().toLowerCase()===text.toLowerCase()))return;const a=document.createElement('a');a.href=href;a.textContent=text;if(hot)a.className='hot';panel.querySelector('.menu-grid')?.appendChild(a)};
      ensure('VOTE 4 LIL SYNN',VOTE,true);ensure('SUNO FORUM',FORUM,true);ensure('FOLLOW THE SIGNAL','#signal');
      panel.querySelectorAll('a').forEach(a=>{if(/suno.*forum|forum/i.test(a.textContent))a.href=FORUM;if(/join the signal/i.test(a.textContent))a.href='#signal'});
    }
    document.querySelectorAll('a').forEach(a=>{if(/join the signal/i.test(a.textContent))a.href='#signal';if(/suno forum/i.test(a.textContent))a.href=FORUM;if(/vote 4 lil synn/i.test(a.textContent)){a.href=VOTE;a.target='_blank';a.rel='noopener noreferrer'}});
  };

  const stars=()=>{
    const hero=document.querySelector('.hero');
    if(!hero||document.querySelector('.ls2-page-stars'))return;
    const signal=document.querySelector('#signal')||document.querySelector('.signal');
    const wrap=document.createElement('div');wrap.className='ls2-page-stars';
    const v=document.createElement('video');v.src='/assets/mov/LS_BG_STARS.webm';v.autoplay=true;v.muted=true;v.loop=true;v.playsInline=true;v.preload='auto';wrap.appendChild(v);document.body.appendChild(wrap);
    const sync=()=>{const start=signal?signal.getBoundingClientRect().top+scrollY:hero.offsetTop+hero.offsetHeight;const end=Math.max(document.documentElement.scrollHeight,start+800);wrap.style.top=start+'px';wrap.style.height=(end-start)+'px'};
    sync();addEventListener('resize',sync,{passive:true});if(window.ResizeObserver)new ResizeObserver(sync).observe(document.body);v.play().catch(()=>{});
  };

  const particles=()=>{
    const hero=document.querySelector('.hero');if(!hero||document.querySelector('.ls2-particles'))return;
    const p=document.createElement('div');p.className='ls2-particles';
    for(let i=0;i<30;i++){const s=document.createElement('i');s.className='ls2-particle';s.style.left=(Math.random()*100)+'%';s.style.top=(Math.random()*100)+'%';s.style.setProperty('--x',((Math.random()-.5)*90)+'px');s.style.setProperty('--d',(12+Math.random()*22)+'s');s.style.animationDelay=(-Math.random()*18)+'s';p.appendChild(s)}hero.appendChild(p);
  };

  const transmission=()=>document.querySelectorAll('*').forEach(el=>{if(el.childNodes.length===1&&el.firstChild.nodeType===3&&/OFFICIAL TRANSMISSION\s*\/?\s*(002|037)/i.test(el.textContent))el.textContent=el.textContent.replace(/(002|037)/,'369')});

  const artist=()=>{
    if(document.querySelector('.ls2-artist'))return;
    const anchor=document.querySelector('#about')||document.querySelector('.about')||document.querySelector('#music')||document.querySelector('main');if(!anchor)return;
    const data=[
      ['THE ARTIST',`LIL SYNN creates a genre-defying sound drawing from dark pop, electropop, melodic trap, ambient R&B, emo rap, and electronic music. His music combines atmospheric production, melodic songwriting, and raw emotional expression, moving between vulnerability, intensity, darkness, and experimentation.<br><br>His songs explore themes of love, heartbreak, identity, isolation, ambition, and the darker sides of the human experience, with each release designed to create its own emotional and sonic world.`],
      ['THE PERSONA',`LIL SYNN is intentionally faceless. His signature persona allows him to exist beyond the conventional boundaries of a traditional artist, creating a recognizable identity across music, artwork, animation, video, and storytelling.<br><br>While LIL SYNN is an AI artist and AI persona, the creative direction behind the project is human. The man behind the persona writes, develops, directs, and oversees LIL SYNN's music, visual identity, storytelling, and evolving mythology.`],
      ['THE MUSIC',`Behind every LIL SYNN song is a human songwriter.<br><br>The man behind the persona writes LIL SYNN's lyrics by hand, crafting the words, concepts, emotional direction, and structure of each song. He uses detailed structure tags and musical direction prompts to program the architecture of each track, guiding elements such as verses, choruses, bridges, transitions, dynamics, instrumentation, and overall arrangement.<br><br>His creative workflow combines traditional songwriting with modern AI-assisted music production, allowing human-written ideas and lyrics to become fully realized musical compositions.`],
      ['THE TOOLKIT',`His creative toolkit includes Suno, Google Flow/Veo, Grok, ChatGPT, FL Studio, the Novation Launchpad, and a Novation Launchkey keyboard, combining generative AI with hands-on digital music production and performance hardware.`],
      ['THE VISUAL WORLD',`Every piece of LIL SYNN's generative visual world is directed through the creator's own creative process. He personally designs the prompts used to create LIL SYNN's generative artwork, imagery, and animations, directing the visual concepts, character design, environments, atmosphere, composition, movement, and overall aesthetic.<br><br>This hands-on approach allows the music and visuals to function as parts of the same creative universe rather than existing as separate pieces of content.`],
      ['THE CREATOR',`The creative work behind LIL SYNN extends far beyond music.<br><br>The man behind the persona is the founder and operator of <a href="${RECORDS}" target="_blank" rel="noopener noreferrer">SYNTIENT RECORDS</a>, LIL SYNN's independent record label, and the creative force behind SYNSTATIC, Ziggy and Chickenman, Chasing Quiet, and The Lions Roar.<br><br>He is also an expert-level prompt designer and AI developer, creating experimental tools and systems that explore new ways humans can communicate, create, organize, and work with artificial intelligence.`],
      ['THE VISION',`LIL SYNN sits at the center of a much larger independent creative universe where music, AI, technology, visual art, animation, and storytelling intersect.<br><br>From the Central Valley of California to a global digital audience, the work represents an ongoing exploration of what one person can create by pushing the boundaries of modern artificial intelligence.<br><br>LIL SYNN isn't just an AI artist. He's one expression of a much larger creative experiment in what AI makes possible.`],
      ['OVERALL',`LIL SYNN is an AI artist and AI persona from California’s Central Valley, built at the intersection of music, artificial intelligence, visual art, storytelling, and technology.`]
    ];
    const sec=document.createElement('section');sec.className='ls2-artist';sec.id='ls2-artist';sec.innerHTML='<div class="ls2-artist-head"><div><p class="ey">THE ARTIST / THE UNIVERSE</p><h2>WHO IS <em style="font-style:normal;color:#ff4fd8">LIL SYNN?</em></h2></div><p>The long-form artist profile from the original site, now presented as focused floating windows so the page stays sharp instead of becoming one giant wall of text.</p></div><div class="ls2-artist-controls"></div>';
    const controls=sec.querySelector('.ls2-artist-controls');const modal=document.createElement('div');modal.className='ls2-modal';modal.innerHTML='<div class="ls2-modal-window" role="dialog" aria-modal="true"><button class="ls2-modal-close" type="button" aria-label="Close">×</button><div class="ls2-modal-content"></div></div>';document.body.appendChild(modal);const content=modal.querySelector('.ls2-modal-content');const close=()=>{modal.classList.remove('open');document.documentElement.style.overflow=''};modal.querySelector('.ls2-modal-close').onclick=close;modal.addEventListener('click',e=>{if(e.target===modal)close()});document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
    data.forEach(([title,html])=>{const b=document.createElement('button');b.type='button';b.className='ls2-artist-button';b.textContent=title;b.onclick=()=>{content.innerHTML='<h3>'+esc(title)+'</h3><div>'+html+'</div>';modal.classList.add('open');document.documentElement.style.overflow='hidden';modal.querySelector('.ls2-modal-window').scrollTop=0};controls.appendChild(b)});
    anchor.parentNode.insertBefore(sec,anchor.nextSibling);
  };

  const footer=()=>{
    if(document.querySelector('.ls2-footer'))return;
    document.querySelectorAll('body>footer').forEach(f=>{if(!f.classList.contains('ls2-footer'))f.style.display='none'});
    const f=document.createElement('footer');f.className='ls2-footer';
    const socials=[['YouTube',YOUTUBE,'youtube.svg'],['Spotify',SPOTIFY,'spotify.svg'],['Instagram',INSTAGRAM,'instagram.svg'],['X / Twitter',X,'twitter.svg'],['SoundCloud',SOUNDCLOUD,'soundcloud.svg'],['TikTok',TIKTOK,'tiktok.svg'],['Facebook',FACEBOOK,'facebook.svg'],['Apple Music',APPLE,'apple-music.svg']];
    f.innerHTML='<div class="ls2-footer-label"><a href="'+RECORDS+'" target="_blank" rel="noopener noreferrer">SYNTIENT RECORDS</a></div><div class="ls2-footer-links"><a href="/suno/">SUNO V6 GUIDE</a><a href="'+FORUM+'" target="_blank" rel="noopener noreferrer">SUNO FORUM</a><a href="/privacy.html">PRIVACY</a><a href="/terms.html">TERMS</a></div><div class="ls2-footer-socials">'+socials.map(([n,u,img])=>'<a href="'+u+'" target="_blank" rel="noopener noreferrer" aria-label="'+n+'"><img src="/assets/images/icons/'+img+'" alt="'+n+'"></a>').join('')+'</div><div class="ls2-footer-tag">DARK SOUND. RAW MOTION. NO LIMITS.</div><div class="ls2-footer-copy">© 2026 LIL SYNN · DESIGNED WITH CHATGPT</div><a class="ls2-easter" href="/special_access.html" aria-label="Special Access"><img src="/assets/images/icons/LS_HEADPHONES.png" alt=""></a>';
    document.body.appendChild(f);
  };

  const up=()=>{if(document.querySelector('.ls2-up'))return;const b=document.createElement('button');b.className='ls2-up';b.type='button';b.setAttribute('aria-label','Return to top');b.innerHTML='<img src="/assets/images/icons/UP_ARROWS.png" alt="">';b.onclick=()=>scrollTo({top:0,behavior:'smooth'});document.body.appendChild(b)};

  const run=()=>{nav();stars();particles();transmission();artist();footer();up()};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
})();