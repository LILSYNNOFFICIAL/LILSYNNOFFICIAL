/* Universal LIL SYNN shell: one navigation system for every HTML page. */
(() => {
  const socials = [
    ['YouTube','https://www.youtube.com/@LILSYNNOFFICIAL'],
    ['Spotify','https://open.spotify.com/artist/6ozcOAnRAUPn3z5c0GR5kU'],
    ['Apple Music','https://music.apple.com/us/artist/lil-synn/1850720041'],
    ['Instagram','https://www.instagram.com/lilsynnofficial/'],
    ['X / Twitter','https://x.com/lilsynnofficial'],
    ['SoundCloud','https://soundcloud.com/lilsynnofficial'],
    ['TikTok','https://www.tiktok.com/@lilsynnofficial'],
    ['Facebook','https://www.facebook.com/lilsynnofficial']
  ];
  const streams = [
    ['Spotify','https://open.spotify.com/artist/6ozcOAnRAUPn3z5c0GR5kU'],
    ['Apple Music','https://music.apple.com/us/artist/lil-synn/1850720041'],
    ['YouTube','https://www.youtube.com/@LILSYNNOFFICIAL'],
    ['YouTube Music','https://music.youtube.com/@LILSYNNOFFICIAL'],
    ['TIDAL','https://tidal.com/artist/69300200'],
    ['Amazon Music','https://music.amazon.com/artists/B0FZB8RWV8/lil-synn']
  ];
  const linkMarkup = items => items.map(([label,href]) => `<a class="menu-link" target="_blank" rel="noopener noreferrer" href="${href}">${label}</a>`).join('');

  const init = () => {
    let style = document.getElementById('lilsynn-visual-fixes');
    if (!style) {
      style = document.createElement('style');
      style.id = 'lilsynn-visual-fixes';
      style.textContent = `
        :root{--ls-pink:#ff008f;--ls-glow:#ff4fd8;--ls-panel:rgba(7,7,10,.68)}
        html{background:#050505} body{background:#050505!important;color:#fff!important}
        /* The index header is the canonical position: fixed flush to the viewport top. */
        nav[aria-label="Primary navigation"],.nav{position:fixed!important;top:0!important;left:0!important;right:0!important;width:100%!important;height:72px!important;z-index:50!important;background:rgba(4,4,7,.72)!important;border-bottom:1px solid rgba(255,0,143,.28)!important;backdrop-filter:blur(18px)!important;-webkit-backdrop-filter:blur(18px)!important}
        nav[aria-label="Primary navigation"]>div,.nav-inner{max-width:1180px!important;height:100%!important;box-sizing:border-box!important;display:flex!important;align-items:center!important;justify-content:space-between!important;margin-left:auto!important;margin-right:auto!important}
        nav a[aria-label="LIL SYNN home"]>span:first-child,.brand-icon{display:block!important;width:38px!important;height:38px!important;min-width:38px!important;font-size:0!important;line-height:1!important;background:url('/assets/img/LS.png') center/contain no-repeat!important}
        nav a[aria-label="LIL SYNN home"]{gap:.6rem!important} nav a[aria-label="LIL SYNN home"]>span:last-child{font-size:1.45rem!important;line-height:1!important}
        #hamburger,.hamb{font-size:2rem!important;line-height:1!important}
        body:has(.hero){padding-top:0!important}
        body:has(.hero) .hero{box-sizing:border-box!important;min-height:calc(100vh - 72px)!important;padding-top:72px!important}
        #sideMenu,.menu{position:fixed!important;top:0!important;right:0!important;left:auto!important;bottom:0!important;width:min(86vw,360px)!important;height:100dvh!important;z-index:60!important;background:rgba(5,5,8,.96)!important;border-left:1px solid rgba(255,0,143,.18)!important;overflow:hidden!important}
        #sideMenu .menu-link,.menu a,.menu button{color:#fff!important} #sideMenu .menu-link:hover,.menu a:hover,.menu button:hover{color:var(--ls-glow)!important}
        #sideMenu>nav,.menu nav{display:flex!important;flex-direction:column!important;gap:1.15rem!important;height:auto!important;overflow-y:auto!important;overflow-x:hidden!important;overscroll-behavior:contain!important;padding:0 2rem 3rem!important;min-height:0!important;max-height:calc(100dvh - 88px)!important;box-sizing:border-box!important}
        #sideMenu.translate-x-full,.menu{transform:translateX(100%)!important} #sideMenu:not(.translate-x-full),.menu.open{transform:translateX(0)!important}
        #sideMenu>nav>.group,.menu nav>.group{display:flex!important;flex-direction:column!important;gap:.55rem!important;width:100%!important;flex:0 0 auto!important;min-height:0!important;margin:0!important}
        #sideMenu>nav>.group>button,.menu nav>.group>button{display:block!important;width:100%!important;flex:0 0 auto!important;padding:0!important;margin:0!important;text-align:left!important}
        #sideMenu #socialsDropdown,#sideMenu #tg .drop,.menu #sg .drop,.menu #tg .drop{display:flex;flex-direction:column;gap:.6rem;margin:0 0 0 1rem;padding:.25rem .5rem .75rem .75rem;min-height:0;max-height:32vh;overflow-y:auto;overflow-x:hidden;overscroll-behavior:contain;scrollbar-width:auto;scrollbar-color:#ff008f #111;flex:0 1 auto}
        #sideMenu #socialsDropdown.hidden,#sideMenu #tg .drop[hidden],.menu .drop[hidden]{display:none!important}
        #sideMenu #socialsDropdown::-webkit-scrollbar,#sideMenu #tg .drop::-webkit-scrollbar,.menu #sg .drop::-webkit-scrollbar,.menu #tg .drop::-webkit-scrollbar{width:10px}
        #sideMenu #socialsDropdown::-webkit-scrollbar-track,#sideMenu #tg .drop::-webkit-scrollbar-track,.menu #sg .drop::-webkit-scrollbar-track,.menu #tg .drop::-webkit-scrollbar-track{background:#111;border-radius:8px}
        #sideMenu #socialsDropdown::-webkit-scrollbar-thumb,#sideMenu #tg .drop::-webkit-scrollbar-thumb,.menu #sg .drop::-webkit-scrollbar-thumb,.menu #tg .drop::-webkit-scrollbar-thumb{background:#ff008f;border-radius:8px;border:2px solid #111}
        #sideMenu #socialsDropdown::-webkit-scrollbar-thumb:hover,#sideMenu #tg .drop::-webkit-scrollbar-thumb:hover,.menu #sg .drop::-webkit-scrollbar-thumb:hover,.menu #tg .drop::-webkit-scrollbar-thumb:hover{background:#ff4fd8}
        #sideMenu #socialsDropdown a,#sideMenu #tg .drop a,.menu #sg .drop a,.menu #tg .drop a{display:block!important;position:static!important;flex:0 0 auto!important;line-height:1.25!important;white-space:normal!important;margin:0!important;padding:0!important}
        #sideMenu>nav>.group + .group,.menu nav>.group + .group{margin-top:.35rem!important}
        #home{background:transparent!important;isolation:isolate}
        #presave,#music,#videos,#about,#merch,#signal,#contact{background:rgba(6,6,9,.74)!important;backdrop-filter:blur(7px)!important;-webkit-backdrop-filter:blur(7px)!important}
        #music-grid{max-width:1100px;margin-left:auto;margin-right:auto}.music-card{box-shadow:0 14px 45px rgba(0,0,0,.28)!important}.section-subtitle{color:#c2c2c2!important}
        .about-card{background:linear-gradient(145deg,rgba(13,13,17,.94),rgba(28,0,21,.78))!important}
        body:has(.hero) .hero img{width:min(44vw,280px)!important;max-height:165px!important;margin-bottom:10px!important}
        body:has(.hero) .content,body:has(.hero) .catalog{position:relative} body:has(.hero) .footer,body:has(.hero) .site-footer{background:rgba(5,5,8,.8)!important}
        body:has(#releases) #releases{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:16px} body:has(#releases) #releases .release{grid-column:1/-1;margin:0} body:has(#releases) #releases .single{margin:0;width:auto}
        @media(max-width:900px){body:has(#releases) #releases{grid-template-columns:repeat(4,minmax(0,1fr))}}
        @media(max-width:700px){body:has(#releases) #releases{grid-template-columns:repeat(3,minmax(0,1fr))}}
        @media(max-width:560px){body:has(#releases) #releases{grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}}
        @media(max-width:640px){nav a[aria-label="LIL SYNN home"]>span:first-child,.brand-icon{width:30px!important;height:30px!important;min-width:30px!important}nav a[aria-label="LIL SYNN home"]>span:last-child{font-size:1.15rem!important}#hamburger,.hamb{font-size:1.65rem!important}#sideMenu>nav,.menu nav{gap:1.1rem!important;padding:0 1.25rem 4rem!important;max-height:calc(100dvh - 82px)!important}#sideMenu #socialsDropdown,#sideMenu #tg .drop,.menu #sg .drop,.menu #tg .drop{max-height:34vh;margin-left:.75rem;padding-right:.5rem}}
      `;
      document.head.appendChild(style);
    }

    document.querySelectorAll('nav a[aria-label="LIL SYNN home"]>span:first-child,.brand-icon').forEach(icon=>{icon.textContent='';icon.setAttribute('aria-hidden','true');});
    document.querySelectorAll('.hero p,#home p').forEach(p=>{if(/Dark electronic music\. Atmospheric sound\. Emotion without limits\./i.test(p.textContent.trim()))p.textContent='Dark sound. Raw emotion. No limits';});

    const menu=document.querySelector('#sideMenu nav,.menu nav');
    const menuRoot=document.querySelector('#sideMenu,.menu');
    const hamburger=document.querySelector('#hamburger,.hamb');
    const closeButton=document.querySelector('#closeMenu,.close button');
    if(!menu||!menuRoot||!hamburger)return;

    menu.innerHTML=`
      <a href="/" class="menu-link shrink-0">Home</a>
      <a href="/#music" class="menu-link shrink-0">Music</a>
      <a href="/releases.html" class="menu-link shrink-0">Releases</a>
      <a href="/#videos" class="menu-link shrink-0">Videos</a>
      <a href="/#about" class="menu-link shrink-0">About</a>
      <a href="https://lilsynnofficial.threadless.com/" target="_blank" rel="noopener noreferrer" class="menu-link shrink-0">Merch</a>
      <a href="https://genius.com/artists/Lil-synn" target="_blank" rel="noopener noreferrer" class="menu-link shrink-0">Lyrics</a>
      <a href="/#contact" class="menu-link shrink-0">Contact</a>
      <div class="group" id="sg"><button type="button" class="menu-link" aria-expanded="false" aria-controls="socialsDropdown">Socials</button><div class="drop" id="socialsDropdown" hidden>${linkMarkup(socials)}</div></div>
      <div class="group" id="tg"><button type="button" class="menu-link" aria-expanded="false" aria-controls="streamDropdown">Stream</button><div class="drop" id="streamDropdown" hidden>${linkMarkup(streams)}</div></div>
    `;

    hamburger.onclick=null; if(closeButton)closeButton.onclick=null;
    hamburger.setAttribute('aria-expanded','false'); hamburger.setAttribute('aria-label','Open navigation'); hamburger.setAttribute('aria-controls',menuRoot.id||'siteMenu');
    menuRoot.setAttribute('aria-hidden','true'); menuRoot.classList.remove('open'); menuRoot.classList.add('translate-x-full');

    const setMenuState=open=>{
      menuRoot.classList.toggle('open',open); menuRoot.classList.toggle('translate-x-full',!open); menuRoot.setAttribute('aria-hidden',String(!open));
      hamburger.setAttribute('aria-expanded',String(open)); hamburger.setAttribute('aria-label',open?'Close navigation':'Open navigation');
      if(!open){menu.querySelectorAll('.drop').forEach(drop=>drop.hidden=true);menu.querySelectorAll('.group button').forEach(button=>button.setAttribute('aria-expanded','false'));}
    };
    hamburger.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();setMenuState(!menuRoot.classList.contains('open'));});
    closeButton?.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();setMenuState(false);});
    menu.addEventListener('click',e=>{
      const groupButton=e.target.closest('.group > button');
      if(groupButton){e.preventDefault();const panel=groupButton.nextElementSibling;const open=!!panel&&panel.hidden;menu.querySelectorAll('.group .drop').forEach(drop=>{if(drop!==panel)drop.hidden=true;});menu.querySelectorAll('.group > button').forEach(button=>button.setAttribute('aria-expanded','false'));if(panel)panel.hidden=!open;groupButton.setAttribute('aria-expanded',String(open));return;}
      const link=e.target.closest('a'); if(link&&link.getAttribute('href')?.startsWith('#'))setMenuState(false);
    });
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menuRoot.classList.contains('open'))setMenuState(false);});

    const latest=document.getElementById('latest-release-title'); if(latest&&/HELLO GOODBYE/i.test(latest.textContent.trim()))latest.textContent='Never Known';
    const latestArt=document.querySelector('#latest-release-art img'); if(latestArt&&/heal2\.png/i.test(latestArt.getAttribute('src')||'')){latestArt.src='/assets/images/icons/album_art/Never Known_album_cover.jpg';latestArt.alt='LIL SYNN — Never Known artwork';}
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();