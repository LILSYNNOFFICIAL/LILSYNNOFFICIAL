(() => {
  const path = location.pathname;
  if (/^(\/|\/index\.html?)$/i.test(path)) return;

  const boot = () => {
    if (document.getElementById('secondary-site-nav')) return;

    const style = document.createElement('style');
    style.id = 'secondary-home-nav-style';
    style.textContent = `
      html,body{min-height:100%;}
      body{margin:0!important;overflow-x:hidden!important;background:transparent!important;}
      #secondary-site-nav{position:fixed!important;top:0!important;left:0!important;right:0!important;width:100%!important;height:72px!important;z-index:50!important;background:rgba(0,0,0,.60)!important;backdrop-filter:blur(16px)!important;-webkit-backdrop-filter:blur(16px)!important;border-bottom:1px solid rgba(255,0,143,.30)!important;}
      #secondary-site-nav>.nav-inner{height:100%!important;max-width:80rem!important;margin:0 auto!important;padding:1.25rem 1.5rem!important;display:flex!important;align-items:center!important;justify-content:space-between!important;box-sizing:border-box!important;}
      #secondary-site-nav .brand{display:flex!important;align-items:center!important;gap:.75rem!important;color:#ff008f!important;text-decoration:none!important;font-family:Orbitron,sans-serif!important;font-size:2.25rem!important;letter-spacing:.1em!important;}
      #secondary-site-nav .brand-icon{font-size:3rem!important;line-height:1!important;}
      #secondary-site-nav .brand-name{font-size:2.25rem!important;line-height:1!important;}
      #hamburger{display:block!important;position:relative!important;width:auto!important;height:auto!important;min-width:0!important;min-height:0!important;margin-left:.5rem!important;padding:0!important;border:0!important;background:transparent!important;color:#ff008f!important;font:inherit!important;font-size:3rem!important;line-height:1!important;cursor:pointer!important;}

      /* Exact homepage side-panel geometry. */
      #sideMenu{position:fixed!important;top:0!important;right:0!important;bottom:0!important;left:auto!important;width:18rem!important;height:100vh!important;height:100dvh!important;margin:0!important;padding:0!important;box-sizing:border-box!important;background:rgba(0,0,0,.90)!important;backdrop-filter:blur(20px)!important;-webkit-backdrop-filter:blur(20px)!important;transform:translate3d(100%,0,0)!important;transition:transform .3s ease!important;z-index:60!important;overflow:hidden!important;display:block!important;}
      #sideMenu.translate-x-full{transform:translate3d(100%,0,0)!important;}
      #sideMenu:not(.translate-x-full){transform:translate3d(0,0,0)!important;}
      #sideMenu>.menu-close-row{height:auto!important;display:flex!important;justify-content:flex-end!important;padding:1.5rem!important;box-sizing:border-box!important;}
      #closeMenu{display:block!important;margin:0!important;padding:0!important;border:0!important;background:transparent!important;color:#fff!important;font-size:1.875rem!important;line-height:1!important;cursor:pointer!important;}

      /* Match index.html/style.css effective menu typography and spacing. */
      #sideMenu>nav{display:flex!important;flex-direction:column!important;gap:1.15rem!important;width:100%!important;margin:0!important;padding:0 2rem!important;box-sizing:border-box!important;color:#fff!important;font-family:Orbitron,sans-serif!important;font-size:.95rem!important;line-height:1.25!important;height:calc(100dvh - 88px)!important;min-height:0!important;overflow:hidden!important;}
      #sideMenu>nav>a,#sideMenu .menu-link{display:block!important;flex:0 0 auto!important;width:auto!important;margin:0!important;padding:0!important;border:0!important;background:transparent!important;color:#fff!important;text-decoration:none!important;font-family:Orbitron,sans-serif!important;font-size:.95rem!important;line-height:1.25!important;text-align:left!important;transition:color .2s ease,transform .2s ease!important;}
      #sideMenu .menu-link:hover,#sideMenu .menu-link:focus-visible{color:#ff4fd8!important;transform:translateX(3px)!important;}
      #sideMenu .nav-library-group{display:flex!important;flex-direction:column!important;width:100%!important;min-width:0!important;min-height:0!important;margin:0!important;padding:0!important;}
      #sideMenu .nav-library-group>button{width:100%!important;display:flex!important;justify-content:space-between!important;}

      /* SOCIALS and STREAM are independently collapsed/expandable and each gets its own pink scrollbar. */
      #sideMenu .dropdown-list{display:flex!important;flex-direction:column!important;gap:.75rem!important;margin:1rem 0 0!important;padding:0 0 1rem 1rem!important;box-sizing:border-box!important;font-family:Rajdhani,sans-serif!important;font-size:.9rem!important;line-height:1.25!important;min-height:0!important;overflow-y:scroll!important;overflow-x:hidden!important;overscroll-behavior:contain!important;scrollbar-width:auto!important;scrollbar-color:#ff008f #111!important;}
      #sideMenu .dropdown-list.hidden{display:none!important;}
      #sideMenu .dropdown-list a{font-family:Rajdhani,sans-serif!important;font-size:.9rem!important;line-height:1.25!important;}
      #sideMenu .dropdown-list::-webkit-scrollbar{width:10px!important;}
      #sideMenu .dropdown-list::-webkit-scrollbar-track{background:#111!important;border-radius:8px!important;}
      #sideMenu .dropdown-list::-webkit-scrollbar-thumb{background:#ff008f!important;border-radius:8px!important;border:2px solid #111!important;}
      #sideMenu .dropdown-list::-webkit-scrollbar-thumb:hover{background:#ff4fd8!important;}
      #sideMenu .nav-scroll-library{max-height:390px!important;}

      /* Homepage background begins immediately below the 72px pink header line and spans the full viewport width. */
      #bgVideo{position:fixed!important;top:72px!important;left:0!important;right:0!important;bottom:0!important;width:100vw!important;height:calc(100dvh - 72px)!important;max-width:none!important;max-height:none!important;margin:0!important;padding:0!important;object-fit:cover!important;object-position:center center!important;transform:none!important;z-index:0!important;opacity:.95!important;pointer-events:none!important;display:block!important;}
      #secondary-bg-overlay{position:fixed!important;top:72px!important;left:0!important;right:0!important;bottom:0!important;width:100vw!important;height:calc(100dvh - 72px)!important;margin:0!important;padding:0!important;background:linear-gradient(to bottom,rgba(0,0,0,.20),rgba(0,0,0,.40))!important;z-index:1!important;pointer-events:none!important;}
      body>main,body>section,body>.wrap,body>div:not(#sideMenu):not(#secondary-site-nav):not(#secondary-bg-overlay):not(#bgVideo),body>footer{position:relative;z-index:2;}

      @media(max-width:640px){
        #secondary-site-nav>.nav-inner{padding-left:1rem!important;padding-right:1rem!important;}
        #secondary-site-nav .brand-icon{font-size:1.25rem!important;}
        #secondary-site-nav .brand-name{font-size:1.25rem!important;}
        #hamburger{font-size:1.4rem!important;}
        #sideMenu{width:min(86vw,360px)!important;}
        #sideMenu>nav{gap:1.15rem!important;padding-bottom:1.5rem!important;overflow-y:auto!important;overflow-x:hidden!important;}
        #sideMenu .dropdown-list{max-height:34vh!important;overflow-y:scroll!important;}
      }
    `;
    document.head.appendChild(style);

    document.querySelectorAll('#siteBgVideo,#siteBgOverlay,#bgVideo,#secondary-bg-overlay,#secondary-site-nav,#sideMenu').forEach(el => el.remove());
    const oldHeader = document.querySelector('body>header');
    if (oldHeader) oldHeader.remove();

    const bg = document.createElement('video');
    bg.id='bgVideo'; bg.autoplay=true; bg.loop=true; bg.muted=true; bg.playsInline=true; bg.setAttribute('aria-hidden','true');
    const sources=['assets/mov/BG_ANI.webm','assets/mov/HERO_BG_WEBM.webm'];
    const chosen=sources[Math.floor(Math.random()*sources.length)];
    const source=document.createElement('source'); source.src=chosen; source.type='video/webm'; bg.appendChild(source); document.body.prepend(bg);
    const overlay=document.createElement('div'); overlay.id='secondary-bg-overlay'; overlay.setAttribute('aria-hidden','true'); document.body.insertBefore(overlay,bg.nextSibling);
    bg.play().catch(()=>{});
    bg.addEventListener('error',()=>{const fallback=sources.find(src=>src!==chosen);if(fallback){source.src=fallback;bg.load();bg.play().catch(()=>{});}}, {once:true});

    const nav=document.createElement('nav'); nav.id='secondary-site-nav'; nav.setAttribute('aria-label','Primary navigation'); nav.innerHTML=`<div class="nav-inner"><a href="/" class="brand" aria-label="LIL SYNN home"><span class="brand-icon" aria-hidden="true">🎧</span><span class="brand-name">LIL SYNN</span></a><button id="hamburger" aria-label="Open navigation" aria-controls="sideMenu" aria-expanded="false">☰</button></div>`; document.body.prepend(nav);

    const menu=document.createElement('div'); menu.id='sideMenu'; menu.className='translate-x-full'; menu.setAttribute('aria-label','Site menu'); menu.setAttribute('aria-hidden','true'); menu.innerHTML=`<div class="menu-close-row"><button id="closeMenu" aria-label="Close menu">&times;</button></div><nav><a href="/" class="menu-link shrink-0">Home</a><a href="/#music" class="menu-link shrink-0">Music</a><a href="/releases.html" class="menu-link shrink-0">Releases</a><a href="/#videos" class="menu-link shrink-0">Videos</a><div class="nav-library-group"><button type="button" id="socialsTrigger" class="menu-link" aria-expanded="false" aria-controls="socialsDropdown">Socials</button><div id="socialsDropdown" class="dropdown-list hidden nav-scroll-library"><a href="https://www.youtube.com/@LILSYNNOFFICIAL" target="_blank" rel="noopener noreferrer" class="menu-link">YouTube</a><a href="https://open.spotify.com/artist/6ozcOAnRAUPn3z5c0GR5kU" target="_blank" rel="noopener noreferrer" class="menu-link">Spotify</a><a href="https://music.apple.com/us/artist/lil-synn/1850720041" target="_blank" rel="noopener noreferrer" class="menu-link">Apple Music</a><a href="https://www.instagram.com/lilsynnofficial/" target="_blank" rel="noopener noreferrer" class="menu-link">Instagram</a><a href="https://x.com/lilsynnofficial" target="_blank" rel="noopener noreferrer" class="menu-link">X / Twitter</a><a href="https://soundcloud.com/lilsynnofficial" target="_blank" rel="noopener noreferrer" class="menu-link">SoundCloud</a><a href="https://www.tiktok.com/@lilsynnofficial" target="_blank" rel="noopener noreferrer" class="menu-link">TikTok</a><a href="https://www.facebook.com/lilsynnofficial" target="_blank" rel="noopener noreferrer" class="menu-link">Facebook</a><a href="https://discord.gg/ZUVsHuCAv" target="_blank" rel="noopener noreferrer" class="menu-link">Discord</a><a href="https://github.com/orgs/Neurosyn-Dev/repositories" target="_blank" rel="noopener noreferrer" class="menu-link">GitHub</a></div></div><div class="nav-library-group"><button type="button" id="streamTrigger" class="menu-link" aria-expanded="false" aria-controls="streamDropdown">Stream</button><div id="streamDropdown" class="dropdown-list hidden nav-scroll-library"><a href="https://open.spotify.com/artist/6ozcOAnRAUPn3z5c0GR5kU" target="_blank" rel="noopener noreferrer" class="menu-link">Spotify</a><a href="https://music.apple.com/us/artist/lil-synn/1850720041" target="_blank" rel="noopener noreferrer" class="menu-link">Apple Music</a><a href="https://www.youtube.com/@LILSYNNOFFICIAL" target="_blank" rel="noopener noreferrer" class="menu-link">YouTube</a><a href="https://music.apple.com/us/artist/lil-synn/1850720041" target="_blank" rel="noopener noreferrer" class="menu-link">iTunes</a><a href="https://music.youtube.com/@LILSYNNOFFICIAL" target="_blank" rel="noopener noreferrer" class="menu-link">YouTube Music</a><a href="https://tidal.com/artist/69300200" target="_blank" rel="noopener noreferrer" class="menu-link">TIDAL</a><a href="https://music.amazon.com/artists/B0FZB8RWV8/lil-synn" target="_blank" rel="noopener noreferrer" class="menu-link">Amazon Music</a><a href="https://www.iheart.com/artist/lil-synn-48522401" target="_blank" rel="noopener noreferrer" class="menu-link">iHeart</a><a href="https://www.pandora.com/artist/lil-synn/ARZwprX4ZVXjVKc" target="_blank" rel="noopener noreferrer" class="menu-link">Pandora</a><a href="https://www.qobuz.com/us-en/interpreter/lil-synn/29242938" target="_blank" rel="noopener noreferrer" class="menu-link">Qobuz</a></div></div><a href="/#about" class="menu-link shrink-0">About</a><a href="https://lilsynnofficial.threadless.com/" target="_blank" rel="noopener noreferrer" class="menu-link shrink-0">Merch</a><a href="https://genius.com/artists/Lil-synn" target="_blank" rel="noopener noreferrer" class="menu-link shrink-0">Lyrics</a><a href="/#contact" class="menu-link shrink-0">Contact</a></nav>`; document.body.appendChild(menu);

    const hamburger=document.getElementById('hamburger'), close=document.getElementById('closeMenu');
    const setMenuState=open=>{menu.classList.toggle('translate-x-full',!open);menu.setAttribute('aria-hidden',String(!open));hamburger.setAttribute('aria-expanded',String(open));hamburger.setAttribute('aria-label',open?'Close navigation':'Open navigation');};
    hamburger.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();setMenuState(menu.classList.contains('translate-x-full'));});
    close.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();setMenuState(false);});
    document.addEventListener('keydown',e=>{if(e.key==='Escape')setMenuState(false);});
    const bind=(triggerId,dropdownId)=>{const trigger=document.getElementById(triggerId),list=document.getElementById(dropdownId);trigger.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();const open=list.classList.contains('hidden');list.classList.toggle('hidden',!open);trigger.setAttribute('aria-expanded',String(open));});};
    bind('socialsTrigger','socialsDropdown'); bind('streamTrigger','streamDropdown');
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();