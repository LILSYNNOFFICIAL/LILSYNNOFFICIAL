document.addEventListener("DOMContentLoaded", () => {
  if (/^(\/|\/index\.html?)$/i.test(location.pathname)) return;
  const nav = document.querySelector("header .nav");
  if (!nav || document.getElementById("sideMenu")) return;

  const ham = document.getElementById("hamburger") || (() => {
    const b = document.createElement("button");
    b.id = "hamburger";
    b.className = "text-5xl text-[#ff008f]";
    b.style.marginLeft = ".5rem";
    b.type = "button";
    b.textContent = "☰";
    nav.appendChild(b);
    return b;
  })();

  const menu = document.createElement("div");
  menu.id = "sideMenu";
  menu.className = "fixed top-0 right-0 h-full w-72 bg-black/90 backdrop-blur-xl transform translate-x-full transition-transform duration-300 z-50";
  menu.setAttribute("aria-label", "Site menu");
  menu.innerHTML = `
    <div class="flex justify-end p-6 shrink-0">
      <button id="closeMenu" class="text-3xl text-white hover:text-pink-500" aria-label="Close menu">&times;</button>
    </div>
    <nav class="flex flex-col gap-6 px-8 text-lg font-['Orbitron']">
      <a href="/" class="menu-link shrink-0">Home</a>
      <a href="/#music" class="menu-link shrink-0">Music</a>
      <a href="/releases.html" class="menu-link shrink-0">Releases</a>
      <a href="/#videos" class="menu-link shrink-0">Videos</a>
      <a href="/#about" class="menu-link shrink-0">About</a>
      <a href="https://lilsynnofficial.threadless.com/" target="_blank" rel="noopener noreferrer" class="menu-link shrink-0">Merch</a>
      <a href="https://genius.com/artists/Lil-synn" target="_blank" rel="noopener noreferrer" class="menu-link shrink-0">Lyrics</a>
      <a href="/#contact" class="menu-link shrink-0">Contact</a>
      <div>
        <button id="socialsTrigger" class="menu-link flex justify-between w-full shrink-0" aria-expanded="false" aria-controls="socialsDropdown">Socials</button>
        <div id="socialsDropdown" class="hidden flex flex-col gap-3 mt-4 pl-4 text-base font-['Rajdhani']">
          <a href="https://www.youtube.com/@LILSYNNOFFICIAL" target="_blank" rel="noopener noreferrer" class="menu-link">YouTube</a>
          <a href="https://open.spotify.com/artist/6ozcOAnRAUPn3z5c0GR5kU" target="_blank" rel="noopener noreferrer" class="menu-link">Spotify</a>
          <a href="https://music.apple.com/us/artist/lil-synn/1850720041" target="_blank" rel="noopener noreferrer" class="menu-link">Apple Music</a>
          <a href="https://www.instagram.com/lilsynnofficial/" target="_blank" rel="noopener noreferrer" class="menu-link">Instagram</a>
          <a href="https://x.com/lilsynnofficial" target="_blank" rel="noopener noreferrer" class="menu-link">X / Twitter</a>
          <a href="https://soundcloud.com/lilsynnofficial" target="_blank" rel="noopener noreferrer" class="menu-link">SoundCloud</a>
          <a href="https://www.tiktok.com/@lilsynnofficial" target="_blank" rel="noopener noreferrer" class="menu-link">TikTok</a>
          <a href="https://www.facebook.com/lilsynnofficial" target="_blank" rel="noopener noreferrer" class="menu-link">Facebook</a>
          <a href="https://discord.gg/ZUVsHuCAv" target="_blank" rel="noopener noreferrer" class="menu-link">Discord</a>
          <a href="https://github.com/orgs/Neurosyn-Dev/repositories" target="_blank" rel="noopener noreferrer" class="menu-link">GitHub</a>
        </div>
      </div>
      <div>
        <button id="streamTrigger" class="menu-link flex justify-between w-full shrink-0" aria-expanded="false" aria-controls="streamDropdown">Stream</button>
        <div id="streamDropdown" class="hidden flex flex-col gap-3 mt-4 pl-4 text-base font-['Rajdhani']">
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
    </nav>`;
  document.body.appendChild(menu);

  const style = document.createElement("style");
  style.id = "index-navigation-secondary";
  style.textContent = `
    #sideMenu { position:fixed; top:0; right:0; left:auto; bottom:auto; height:100%; width:18rem; z-index:60; overflow:hidden; }
    #sideMenu > nav { max-height:calc(100vh - 88px); overflow-y:auto; overflow-x:hidden; overscroll-behavior:contain; }
    #sideMenu a, #sideMenu button { box-sizing:border-box; }
    #sideMenu .menu-link { color:#fff; text-decoration:none; }
    #sideMenu .menu-link:hover { color:#ec4899; }
    #sideMenu #socialsDropdown, #sideMenu #streamDropdown { display:none; }
    #sideMenu #socialsDropdown.flex, #sideMenu #streamDropdown.flex { display:flex; }
    @media(max-width:640px){
      #sideMenu { width:min(86vw,360px); }
      #sideMenu > nav { max-height:calc(100vh - 82px); padding-bottom:1.5rem; }
    }
  `;
  document.head.appendChild(style);

  ham.setAttribute("aria-label", "Open navigation");
  ham.setAttribute("aria-controls", "sideMenu");
  ham.setAttribute("aria-expanded", "false");
  menu.setAttribute("aria-hidden", "true");

  const setMenuState = open => {
    menu.classList.toggle("translate-x-full", !open);
    menu.setAttribute("aria-hidden", String(!open));
    ham.setAttribute("aria-expanded", String(open));
    ham.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    if (open) {
      const first = menu.querySelector("a, button");
      if (first) setTimeout(() => first.focus(), 0);
    } else {
      ham.focus();
    }
  };

  ham.addEventListener("click", event => {
    event.preventDefault();
    event.stopPropagation();
    setMenuState(menu.classList.contains("translate-x-full"));
  });
  document.getElementById("closeMenu").addEventListener("click", event => {
    event.preventDefault();
    event.stopPropagation();
    setMenuState(false);
  });
  menu.querySelectorAll('a[href^="/"]').forEach(link => link.addEventListener("click", () => setMenuState(false)));
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !menu.classList.contains("translate-x-full")) setMenuState(false);
  });

  const bindDropdown = (triggerId, dropdownId) => {
    const trigger = document.getElementById(triggerId);
    const dropdown = document.getElementById(dropdownId);
    trigger.addEventListener("click", event => {
      event.preventDefault();
      event.stopPropagation();
      const open = dropdown.classList.contains("hidden");
      dropdown.classList.toggle("hidden", !open);
      dropdown.classList.toggle("flex", open);
      trigger.setAttribute("aria-expanded", String(open));
    });
  };
  bindDropdown("socialsTrigger", "socialsDropdown");
  bindDropdown("streamTrigger", "streamDropdown");
});