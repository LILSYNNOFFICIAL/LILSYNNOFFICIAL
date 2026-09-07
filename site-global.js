(() => {
  const path = location.pathname;
  if (/^(\/|\/index\.html?)$/i.test(path)) return;

  const boot = () => {
    if (document.getElementById('secondary-site-nav')) return;

    /* Secondary pages use the same navigation structure, visual values, and interaction model as index.html. */
    const style = document.createElement('style');
    style.id = 'secondary-home-nav-style';
    style.textContent = `
      :root { --nav-height:72px; --nav-gap:.5rem; }
      body { overflow-x:hidden; background:transparent !important; }
      #secondary-site-nav { position:fixed;top:0;left:0;right:0;height:var(--nav-height);z-index:50;background:rgba(0,0,0,.60);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border-bottom:1px solid rgba(255,0,143,.30); }
      #secondary-site-nav > .nav-inner { height:100%;max-width:80rem;margin:0 auto;padding:1.25rem 1.5rem;display:flex;align-items:center;justify-content:space-between; }
      #secondary-site-nav .brand { display:flex;align-items:center;gap:.75rem;color:#ff008f;text-decoration:none;font-family:Orbitron,sans-serif;font-size:2.25rem;letter-spacing:.1em; }
      #secondary-site-nav .brand-icon { font-size:3rem;line-height:1; }
      #secondary-site-nav .brand-name { font-size:2.25rem;line-height:1; }
      #hamburger { color:#ff008f;background:transparent;border:0;font-size:3rem;line-height:1;margin-left:.5rem;padding:0;cursor:pointer; }
      #sideMenu { position:fixed;top:0;right:0;left:auto;width:18rem;height:100%;background:rgba(0,0,0,.90);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);transform:translateX(100%);transition:transform .3s;z-index:60;overflow:hidden;box-sizing:border-box; }
      #sideMenu.translate-x-full { transform:translateX(100%); }
      #sideMenu:not(.translate-x-full) { transform:translateX(0); }
      #sideMenu > .menu-close-row { display:flex;justify-content:flex-end;padding:1.5rem; }
      #closeMenu { font-size:1.875rem;line-height:1;color:#fff;background:transparent;border:0;padding:0;cursor:pointer; }
      #sideMenu > nav { display:flex;flex-direction:column;gap:1.5rem;padding:0 2rem;font-family:Orbitron,sans-serif;font-size:1.125rem;line-height:1.25;max-height:calc(100vh - 88px);overflow-y:auto;overflow-x:hidden;overscroll-behavior:contain;box-sizing:border-box; }
      #sideMenu a,#sideMenu button.menu-link { color:#fff;text-decoration:none;font-family:Orbitron,sans-serif;font-size:1.125rem;line-height:1.25;transition:color .2s,transform .2s;background:transparent;border:0;padding:0;text-align:left; }
      #sideMenu a:hover,#sideMenu a:focus-visible,#sideMenu button.menu-link:hover,#sideMenu button.menu-link:focus-visible { color:#ff4fd8;transform:translateX(3px); }
      .nav-library-group { width:100%;min-width:0;flex:0 0 auto;min-height:0;display:block; }
      .nav-library-group > button { width:100%; }
      .nav-library-group > div { min-width:0; }
      .dropdown-list { display:flex;flex-direction:column;gap:.75rem;margin-top:1rem;padding-left:1rem;font-family:Rajdhani,sans-serif!important;font-size:1rem;line-height:1.25; }
      .dropdown-list.hidden { display:none !important; }
      .dropdown-list a { font-family:Rajdhani,sans-serif!important;font-size:1rem!important; }
      .nav-scroll-library { max-height:min(48vh,390px);overflow-y:auto;overflow-x:hidden;overscroll-behavior:contain;padding-right:.75rem;scrollbar-width:auto;scrollbar-color:#ff008f #111; }
      .nav-scroll-library::-webkit-scrollbar { width:10px; }
      .nav-scroll-library::-webkit-scrollbar-track { background:#111;border-radius:8px; }
      .nav-scroll-library::-webkit-scrollbar-thumb { background:#ff008f;border-radius:8px;border:2px solid #111; }
      #bgVideo { position:fixed;top:var(--nav-height);left:0;width:100vw;height:calc(100vh - var(--nav-height));object-fit:cover;z-index:0;opacity:.95;pointer-events:none; }
      #secondary-bg-overlay { position:fixed;top:var(--nav-height);left:0;width:100vw;height:calc(100vh - var(--nav-height));background:linear-gradient(to bottom,rgba(0,0,0,.20),rgba(0,0,0,.40));z-index:1;pointer-events:none; }
      body > *:not(#bgVideo):not(#secondary-bg-overlay):not(#secondary-site-nav):not(#sideMenu) { position:relative;z-index:2; }
      @media (min-width:768px){ #sideMenu > nav { height:calc(100vh - 88px);min-height:0;overflow:hidden; } #sideMenu > nav > .nav-library-group:has(#socialsDropdown) { flex:1 1 auto;min-height:0;display:flex;flex-direction:column; } #sideMenu #socialsDropdown { flex:1 1 auto;min-height:0;max-height:none;overflow-y:scroll;overflow-x:hidden;overscroll-behavior:contain;padding-right:.75rem;padding-bottom:1.5rem;scrollbar-width:auto;scrollbar-color:#ff008f #111; } }
      @media (max-width:640px){ #secondary-site-nav > .nav-inner { padding-left:1rem;padding-right:1rem; } #secondary-site-nav .brand-icon { font-size:1.25rem; } #secondary-site-nav .brand-name { font-size:1.25rem; } #hamburger { font-size:1.4rem; } #sideMenu { width:min(86vw,360px); } #sideMenu > nav { max-height:calc(100vh - 82px);padding-bottom:1.5rem; } .nav-scroll-library { max-height:42vh; } }
    `;
    document.head.appendChild(style);

    document.querySelectorAll('#siteBgVideo,#siteBgOverlay').forEach(el => el.remove());

    const bg = document.createElement('video');
    bg.id = 'bgVideo';
    bg.autoplay = true;
    bg.loop = true;
    bg.muted = true;
    bg.playsInline = true;
    bg.setAttribute('aria-hidden','true');
    const sources = ['assets/mov/BG_ANI.webm','assets/mov/HERO_BG_WEBM.webm'];
    const chosen = sources[Math.floor(Math.random() * sources.length)];
    const source = document.createElement('source');
    source.src = chosen;
    source.type = 'video/webm';
    bg.appendChild(source);
    document.body.prepend(bg);
    const overlay = document.createElement('div');
    overlay.id = 'secondary-bg-overlay';
    overlay.setAttribute('aria-hidden','true');
    document.body.insertBefore(overlay, bg.nextSibling);
    bg.play().catch(() => {});
    bg.addEventListener('error', () => {
      const fallback = sources.find(src => src !== chosen);
      if (fallback) { source.src = fallback; bg.load(); bg.play().catch(() => {}); }
    }, { once:true });

    const oldHeader = document.querySelector('body > header');
    if (oldHeader) oldHeader.remove();

    const nav = document.createElement('nav');
    nav.id = 'secondary-site-nav';
    nav.setAttribute('aria-label','Primary navigation');
    nav.innerHTML = `
      <div class="nav-inner">
        <a href="/" class="brand" aria-label="LIL SYNN home"><span class="brand-icon" aria-hidden="true">🎧</span><span class="brand-name">LIL SYNN</span></a>
        <button id="hamburger" aria-label="Open navigation" aria-controls="sideMenu" aria-expanded="false">☰</button>
      </div>`;
    document.body.prepend(nav);

    const menu = document.createElement('div');
    menu.id = 'sideMenu';
    menu.className = 'translate-x-full';
    menu.setAttribute('aria-label','Site menu');
    menu.setAttribute('aria-hidden','true');
    menu.innerHTML = `
      <div class="menu-close-row"><button id="closeMenu" aria-label="Close menu">&times;</button></div>
      <nav>
        <a href="/" class="menu-link shrink-0">Home</a>
        <a href="/#music" class="menu-link shrink-0">Music</a>
        <a href="/releases.html" class="menu-link shrink-0">Releases</a>
        <a href="/#videos" class="menu-link shrink-0">Videos</a>
        <div class="nav-library-group"><button type="button" id="socialsTrigger" class="menu-link" aria-expanded="false" aria-controls="socialsDropdown">Socials</button><div id="socialsDropdown" class="dropdown-list hidden"><a href="https://www.youtube.com/@LILSYNNOFFICIAL" target="_blank" rel="noopener noreferrer" class="menu-link">YouTube</a><a href="https://open.spotify.com/artist/6ozcOAnRAUPn3z5c0GR5kU" target="_blank" rel="noopener noreferrer" class="menu-link">Spotify</a><a href="https://music.apple.com/us/artist/lil-synn/1850720041" target="_blank" rel="noopener noreferrer" class="menu-link">Apple Music</a><a href="https://www.instagram.com/lilsynnofficial/" target="_blank" rel="noopener noreferrer" class="menu-link">Instagram</a><a href="https://x.com/lilsynnofficial" target="_blank" rel="noopener noreferrer" class="menu-link">X / Twitter</a><a href="https://soundcloud.com/lilsynnofficial" target="_blank" rel="noopener noreferrer" class="menu-link">SoundCloud</a><a href="https://www.tiktok.com/@lilsynnofficial" target="_blank" rel="noopener noreferrer" class="menu-link">TikTok</a><a href="https://www.facebook.com/lilsynnofficial" target="_blank" rel="noopener noreferrer" class="menu-link">Facebook</a><a href="https://discord.gg/ZUVsHuCAv" target="_blank" rel="noopener noreferrer" class="menu-link">Discord</a><a href="https://github.com/orgs/Neurosyn-Dev/repositories" target="_blank" rel="noopener noreferrer" class="menu-link">GitHub</a></div></div>
        <div class="nav-library-group"><button type="button" id="streamTrigger" class="menu-link" aria-expanded="false" aria-controls="streamDropdown">Stream</button><div id="streamDropdown" class="dropdown-list hidden nav-scroll-library"><a href="https://open.spotify.com/artist/6ozcOAnRAUPn3z5c0GR5kU" target="_blank" rel="noopener noreferrer" class="menu-link">Spotify</a><a href="https://music.apple.com/us/artist/lil-synn/1850720041" target="_blank" rel="noopener noreferrer" class="menu-link">Apple Music</a><a href="https://www.youtube.com/@LILSYNNOFFICIAL" target="_blank" rel="noopener noreferrer" class="menu-link">YouTube</a><a href="https://music.apple.com/us/artist/lil-synn/1850720041" target="_blank" rel="noopener noreferrer" class="menu-link">iTunes</a><a href="https://music.youtube.com/@LILSYNNOFFICIAL" target="_blank" rel="noopener noreferrer" class="menu-link">YouTube Music</a><a href="https://tidal.com/artist/69300200" target="_blank" rel="noopener noreferrer" class="menu-link">TIDAL</a><a href="https://music.amazon.com/artists/B0FZB8RWV8/lil-synn" target="_blank" rel="noopener noreferrer" class="menu-link">Amazon Music</a><a href="https://www.iheart.com/artist/lil-synn-48522401" target="_blank" rel="noopener noreferrer" class="menu-link">iHeart</a><a href="https://www.pandora.com/artist/lil-synn/ARZwprX4ZVXjVKc" target="_blank" rel="noopener noreferrer" class="menu-link">Pandora</a><a href="https://www.qobuz.com/us-en/interpreter/lil-synn/29242938" target="_blank" rel="noopener noreferrer" class="menu-link">Qobuz</a></div></div>
        <a href="/#about" class="menu-link shrink-0">About</a>
        <a href="https://lilsynnofficial.threadless.com/" target="_blank" rel="noopener noreferrer" class="menu-link shrink-0">Merch</a>
        <a href="https://genius.com/artists/Lil-synn" target="_blank" rel="noopener noreferrer" class="menu-link shrink-0">Lyrics</a>
        <a href="/#contact" class="menu-link shrink-0">Contact</a>
      </nav>`;
    document.body.appendChild(menu);

    const hamburger = document.getElementById('hamburger');
    const close = document.getElementById('closeMenu');
    const setMenuState = open => {
      menu.classList.toggle('translate-x-full', !open);
      menu.setAttribute('aria-hidden', String(!open));
      hamburger.setAttribute('aria-expanded', String(open));
      hamburger.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
      if (open) { const first = menu.querySelector('a,button'); if (first) setTimeout(() => first.focus(), 0); }
      else hamburger.focus();
    };
    hamburger.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); setMenuState(menu.classList.contains('translate-x-full')); });
    close.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); setMenuState(false); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && !menu.classList.contains('translate-x-full')) setMenuState(false); });
    document.querySelectorAll('#sideMenu a[href^="#"]').forEach(link => link.addEventListener('click', () => setMenuState(false)));

    const bind = (triggerId, dropdownId) => {
      const trigger = document.getElementById(triggerId);
      const list = document.getElementById(dropdownId);
      trigger.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();
        const open = list.classList.contains('hidden');
        list.classList.toggle('hidden', !open);
        trigger.setAttribute('aria-expanded', String(open));
      });
    };
    bind('socialsTrigger','socialsDropdown');
    bind('streamTrigger','streamDropdown');
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once:true });
  else boot();
})();