document.addEventListener("DOMContentLoaded", () => {
  if (/^(\/|\/index\.html?)$/i.test(location.pathname)) return;

  const nav = document.querySelector("header .nav");
  if (!nav || document.getElementById("sideMenu")) return;

  const style = document.createElement("style");
  style.id = "secondary-home-navigation";
  style.textContent = `
    #hamburger {
      display:inline-flex!important;align-items:center!important;justify-content:center!important;
      margin-left:auto!important;width:auto!important;height:auto!important;padding:0!important;
      border:0!important;background:transparent!important;color:#ff008f!important;
      font-family:inherit!important;font-size:3rem!important;line-height:1!important;cursor:pointer!important;
    }
    #sideMenu {
      position:fixed!important;top:0!important;right:0!important;bottom:0!important;left:auto!important;
      width:18rem!important;height:100vh!important;height:100dvh!important;
      background:rgba(0,0,0,.90)!important;backdrop-filter:blur(24px)!important;-webkit-backdrop-filter:blur(24px)!important;
      transform:translateX(100%)!important;transition:transform .3s ease!important;
      z-index:99999!important;overflow:hidden!important;box-sizing:border-box!important;
    }
    #sideMenu.menu-open { transform:translateX(0)!important; }
    #sideMenu .side-menu-close-row { display:flex!important;justify-content:flex-end!important;padding:1.5rem!important;flex:0 0 auto!important; }
    #closeMenu { font-size:1.875rem!important;line-height:1!important;color:#fff!important;background:transparent!important;border:0!important;cursor:pointer!important;padding:0!important; }
    #sideMenu > nav { display:flex!important;flex-direction:column!important;gap:1.15rem!important;padding:0 2rem 1.5rem!important;margin:0!important;max-height:calc(100vh - 88px)!important;max-height:calc(100dvh - 88px)!important;overflow-y:auto!important;overflow-x:hidden!important;box-sizing:border-box!important;font-family:'Orbitron',sans-serif!important;font-size:.95rem!important;line-height:1.25!important; }
    #sideMenu > nav > a, #sideMenu .menu-link { display:block!important;flex:0 0 auto!important;color:#fff!important;text-decoration:none!important;font-family:'Orbitron',sans-serif!important;font-size:.95rem!important;line-height:1.25!important;transition:color .2s ease,transform .2s ease!important; }
    #sideMenu .menu-link:hover, #sideMenu .menu-link:focus-visible { color:#ff4fd8!important;transform:translateX(3px)!important; }
    #sideMenu .nav-library-group { width:100%!important;min-width:0!important;flex:0 0 auto!important;min-height:0!important;display:block!important; }
    #sideMenu .nav-library-group > button { width:100%!important;padding:0!important;text-align:left!important;background:transparent!important;border:0!important;cursor:pointer!important; }
    #sideMenu .nav-library-group > div { min-width:0!important; }
    #sideMenu .dropdown-list { display:flex;flex-direction:column;gap:.75rem;margin-top:1rem;padding-left:1rem;font-family:'Rajdhani',sans-serif!important;font-size:.9rem!important;line-height:1.25!important; }
    #sideMenu .dropdown-list.hidden { display:none!important; }
    #sideMenu .dropdown-list a { font-family:'Rajdhani',sans-serif!important;font-size:.9rem!important;line-height:1.25!important; }
    #sideMenu .stream-list { max-height:min(48vh,390px);overflow-y:auto;overflow-x:hidden;overscroll-behavior:contain;padding-right:.65rem;scrollbar-width:auto;scrollbar-color:#ff008f #111; }
    #sideMenu .stream-list::-webkit-scrollbar { width:9px; }
    #sideMenu .stream-list::-webkit-scrollbar-track { background:#111; }
    #sideMenu .stream-list::-webkit-scrollbar-thumb { background:#ff008f;border-radius:8px;border:2px solid #111; }
    @media(max-width:640px){
      #hamburger{font-size:1.4rem!important;height:44px!important;}
      #sideMenu{width:min(86vw,360px)!important;}
      #sideMenu > nav{gap:1.1rem!important;padding-bottom:1.5rem!important;max-height:calc(100dvh - 82px)!important;}
      #sideMenu .stream-list{max-height:42vh;}
    }
  `;
  document.head.appendChild(style);

  const hamburger = document.createElement("button");
  hamburger.id = "hamburger";
  hamburger.type = "button";
  hamburger.setAttribute("aria-label", "Open navigation");
  hamburger.setAttribute("aria-controls", "sideMenu");
  hamburger.setAttribute("aria-expanded", "false");
  hamburger.textContent = "☰";
  nav.appendChild(hamburger);

  const sideMenu = document.createElement("div");
  sideMenu.id = "sideMenu";
  sideMenu.setAttribute("aria-label", "Site menu");
  sideMenu.setAttribute("aria-hidden", "true");
  sideMenu.innerHTML = `
    <div class="side-menu-close-row">
      <button id="closeMenu" aria-label="Close menu">&times;</button>
    </div>
    <nav>
      <a href="/" class="menu-link">Home</a>
      <a href="/#music" class="menu-link">Music</a>
      <a href="/releases.html" class="menu-link">Releases</a>
      <a href="/#videos" class="menu-link">Videos</a>
      <div class="nav-library-group">
        <button type="button" id="socialsTrigger" class="menu-link" aria-expanded="false" aria-controls="socialsDropdown">Socials</button>
        <div id="socialsDropdown" class="dropdown-list hidden">
          <a href="https://www.instagram.com/lilsynnofficial/" target="_blank" rel="noopener noreferrer" class="menu-link">Instagram</a>
          <a href="https://www.tiktok.com/@lilsynnofficial" target="_blank" rel="noopener noreferrer" class="menu-link">TikTok</a>
          <a href="https://www.facebook.com/lilsynnofficial" target="_blank" rel="noopener noreferrer" class="menu-link">Facebook</a>
          <a href="https://x.com/lilsynnofficial" target="_blank" rel="noopener noreferrer" class="menu-link">X / Twitter</a>
          <a href="https://discord.gg/ZUVsHuCAv" target="_blank" rel="noopener noreferrer" class="menu-link">Discord</a>
          <a href="https://github.com/orgs/Neurosyn-Dev/repositories" target="_blank" rel="noopener noreferrer" class="menu-link">GitHub</a>
        </div>
      </div>
      <div class="nav-library-group">
        <button type="button" id="streamTrigger" class="menu-link" aria-expanded="false" aria-controls="streamDropdown">Stream</button>
        <div id="streamDropdown" class="dropdown-list hidden stream-list">
          <a href="https://open.spotify.com/artist/6ozcOAnRAUPn3z5c0GR5kU" target="_blank" rel="noopener noreferrer" class="menu-link">Spotify</a>
          <a href="https://music.apple.com/us/artist/lil-synn/1850720041" target="_blank" rel="noopener noreferrer" class="menu-link">Apple Music</a>
          <a href="https://www.youtube.com/@LILSYNNOFFICIAL" target="_blank" rel="noopener noreferrer" class="menu-link">YouTube</a>
          <a href="https://music.apple.com/us/artist/lil-synn/1850720041" target="_blank" rel="noopener noreferrer" class="menu-link">iTunes</a>
          <a href="https://music.youtube.com/@LILSYNNOFFICIAL" target="_blank" rel="noopener noreferrer" class="menu-link">YouTube Music</a>
          <a href="https://tidal.com/artist/69300200" target="_blank" rel="noopener noreferrer" class="menu-link">TIDAL</a>
          <a href="https://music.amazon.com/artists/B0FZB8RWV8/lil-synn" target="_blank" rel="noopener noreferrer" class="menu-link">Amazon Music</a>
          <a href="https://www.iheart.com/artist/lil-synn-48522401" target="_blank" rel="noopener noreferrer" class="menu-link">iHeart</a>
          <a href="https://www.pandora.com/artist/lil-synn/ARZwprX4ZVXjVKc" target="_blank" rel="noopener noreferrer" class="menu-link">Pandora</a>
          <a href="https://www.qobuz.com/us-en/interpreter/lil-synn/29242938" target="_blank" rel="noopener noreferrer" class="menu-link">Qobuz</a>
        </div>
      </div>
      <a href="/#about" class="menu-link">About</a>
      <a href="https://lilsynnofficial.threadless.com/" target="_blank" rel="noopener noreferrer" class="menu-link">Merch</a>
      <a href="https://genius.com/artists/Lil-synn" target="_blank" rel="noopener noreferrer" class="menu-link">Lyrics</a>
      <a href="/#contact" class="menu-link">Contact</a>
    </nav>`;
  document.body.appendChild(sideMenu);

  const setMenuState = open => {
    sideMenu.classList.toggle("menu-open", open);
    sideMenu.setAttribute("aria-hidden", String(!open));
    hamburger.setAttribute("aria-expanded", String(open));
    hamburger.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    if (open) {
      const first = sideMenu.querySelector("a, button");
      if (first) setTimeout(() => first.focus(), 0);
    } else hamburger.focus();
  };

  hamburger.addEventListener("click", event => {
    event.preventDefault();
    event.stopPropagation();
    setMenuState(!sideMenu.classList.contains("menu-open"));
  });
  document.getElementById("closeMenu").addEventListener("click", event => {
    event.preventDefault();
    event.stopPropagation();
    setMenuState(false);
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && sideMenu.classList.contains("menu-open")) setMenuState(false);
  });

  const bindDropdown = (triggerId, dropdownId) => {
    const trigger = document.getElementById(triggerId);
    const dropdown = document.getElementById(dropdownId);
    if (!trigger || !dropdown) return;
    trigger.addEventListener("click", event => {
      event.preventDefault();
      event.stopPropagation();
      const open = dropdown.classList.contains("hidden");
      dropdown.classList.toggle("hidden", !open);
      trigger.setAttribute("aria-expanded", String(open));
    });
  };
  bindDropdown("socialsTrigger", "socialsDropdown");
  bindDropdown("streamTrigger", "streamDropdown");
});