document.addEventListener("DOMContentLoaded", () => {
  if (/^(\/|\/index\.html?)$/i.test(location.pathname)) return;
  const nav = document.querySelector("header .nav");
  if (!nav || document.getElementById("sideMenu")) return;

  /* Secondary pages use the exact navigation DOM used by index.html. */
  const ham = document.getElementById("hamburger") || (() => {
    const b = document.createElement("button");
    b.id = "hamburger";
    b.className = "text-5xl text-[#ff008f]";
    b.style.marginLeft = ".5rem";
    b.type = "button";
    b.textContent = "☰";
    b.setAttribute("aria-label", "Open navigation");
    b.setAttribute("aria-controls", "sideMenu");
    b.setAttribute("aria-expanded", "false");
    nav.appendChild(b);
    return b;
  })();

  const menu = document.createElement("div");
  menu.id = "sideMenu";
  menu.className = "fixed top-0 right-0 h-full w-72 bg-black/90 backdrop-blur-xl transform translate-x-full transition-transform duration-300 z-50";
  menu.setAttribute("aria-label", "Site menu");
  menu.setAttribute("aria-hidden", "true");
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
    </nav>`;
  document.body.appendChild(menu);

  /* Exact non-Tailwind equivalents of the navigation rules on index.html/style.css. */
  const style = document.createElement("style");
  style.id = "index-navigation-secondary";
  style.textContent = `
    #sideMenu { position:fixed; top:0; right:0; width:18rem; height:100%; background:rgba(0,0,0,.90); backdrop-filter:blur(16px); -webkit-backdrop-filter:blur(16px); transform:translateX(100%); transition:transform .3s ease; z-index:60; overflow:hidden; }
    #sideMenu.translate-x-0 { transform:translateX(0); }
    #sideMenu > div:first-child { display:flex; justify-content:flex-end; padding:1.5rem; flex-shrink:0; }
    #sideMenu > nav { display:flex; flex-direction:column; gap:1.5rem; padding:0 2rem; color:#fff; font-size:1.125rem; line-height:1.25; font-family:Orbitron, sans-serif; }
    #sideMenu > nav > a, #sideMenu > nav > div { flex-shrink:0; }
    #sideMenu a { color:#fff; text-decoration:none; }
    #sideMenu button { color:#fff; background:transparent; border:0; font:inherit; cursor:pointer; }
    #sideMenu #closeMenu { font:1.875rem/1 Arial,sans-serif; padding:0; }
    #sideMenu .menu-link { transition:color .2s ease, transform .2s ease; }
    #sideMenu .menu-link:hover, #sideMenu .menu-link:focus-visible { color:#ff4fd8; transform:translateX(3px); }
    #sideMenu #socialsDropdown, #sideMenu #streamDropdown { display:none; flex-direction:column; gap:.75rem; margin-top:1rem; padding-left:1rem; font-family:Rajdhani,sans-serif; font-size:1rem; line-height:1.25; }
    #sideMenu #socialsDropdown.is-open, #sideMenu #streamDropdown.is-open { display:flex; }
    #sideMenu #streamDropdown { max-height:min(48vh,390px); overflow-y:auto; overflow-x:hidden; overscroll-behavior:contain; padding-right:.65rem; scrollbar-color:#ff008f #111; }
    #sideMenu #streamDropdown::-webkit-scrollbar { width:9px; }
    #sideMenu #streamDropdown::-webkit-scrollbar-track { background:#111; border-radius:8px; }
    #sideMenu #streamDropdown::-webkit-scrollbar-thumb { background:#ff008f; border-radius:8px; border:2px solid #111; }
    #sideMenu #streamDropdown::-webkit-scrollbar-thumb:hover { background:#ff4fd8; }
    #sideMenu #socialsDropdown a, #sideMenu #streamDropdown a { font-size:.9rem; line-height:1.25; }
    @media (min-width:768px) {
      #sideMenu > nav { height:calc(100vh - 88px); min-height:0; overflow:hidden; }
      #sideMenu #socialsDropdown { flex:1 1 auto; min-height:0; max-height:none; overflow-y:scroll; overflow-x:hidden; overscroll-behavior:contain; padding-right:.75rem; padding-bottom:1.5rem; scrollbar-color:#ff008f #111; }
      #sideMenu #socialsDropdown.is-open { display:flex; }
      #sideMenu #socialsDropdown::-webkit-scrollbar { width:10px; }
      #sideMenu #socialsDropdown::-webkit-scrollbar-track { background:#111; border-radius:8px; }
      #sideMenu #socialsDropdown::-webkit-scrollbar-thumb { background:#ff008f; border-radius:8px; border:2px solid #111; }
      #sideMenu #socialsDropdown::-webkit-scrollbar-thumb:hover { background:#ff4fd8; }
    }
    @media (max-width:640px) {
      #sideMenu { width:min(86vw,360px); }
      #sideMenu > nav { max-height:calc(100vh - 82px); padding-bottom:1.5rem; overflow-y:auto; }
      #sideMenu #streamDropdown { max-height:42vh; }
    }
  `;
  document.head.appendChild(style);

  const streamLinks = [
    ["Spotify", "https://open.spotify.com/artist/6ozcOAnRAUPn3z5c0GR5kU"],
    ["Apple Music", "https://music.apple.com/us/artist/lil-synn/1850720041"],
    ["YouTube", "https://www.youtube.com/@LILSYNNOFFICIAL"],
    ["iTunes", "https://music.apple.com/us/artist/lil-synn/1850720041"],
    ["YouTube Music", "https://music.youtube.com/@LILSYNNOFFICIAL"],
    ["TIDAL", "https://tidal.com/artist/69300200"],
    ["Amazon Music", "https://music.amazon.com/artists/B0FZB8RWV8/lil-synn"],
    ["iHeart", "https://www.iheart.com/artist/lil-synn-48522401"],
    ["Pandora", "https://www.pandora.com/artist/lil-synn/ARZwprX4ZVXjVKc"],
    ["Qobuz", "https://www.qobuz.com/us-en/interpreter/lil-synn/29242938"]
  ];
  const socialLinks = [
    ["YouTube", "https://www.youtube.com/@LILSYNNOFFICIAL"],
    ["Spotify", "https://open.spotify.com/artist/6ozcOAnRAUPn3z5c0GR5kU"],
    ["Apple Music", "https://music.apple.com/us/artist/lil-synn/1850720041"],
    ["Instagram", "https://www.instagram.com/lilsynnofficial/"],
    ["X / Twitter", "https://x.com/lilsynnofficial"],
    ["SoundCloud", "https://soundcloud.com/lilsynnofficial"],
    ["TikTok", "https://www.tiktok.com/@lilsynnofficial"],
    ["Facebook", "https://www.facebook.com/lilsynnofficial"],
    ["Discord", "https://discord.gg/ZUVsHuCAv"],
    ["GitHub", "https://github.com/orgs/Neurosyn-Dev/repositories"]
  ];

  const makeGroup = (id, label, links, scrollable = false) => {
    const group = document.createElement("div");
    const button = document.createElement("button");
    button.type = "button";
    button.className = "menu-link flex justify-between w-full shrink-0";
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-controls", id);
    button.textContent = label;
    const list = document.createElement("div");
    list.id = id;
    list.className = "hidden flex flex-col gap-3 mt-4 pl-4 text-base font-['Rajdhani']";
    if (scrollable) list.classList.add("nav-scroll-library");
    links.forEach(([name, href]) => {
      const a = document.createElement("a");
      a.href = href;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.className = "menu-link";
      a.textContent = name;
      list.appendChild(a);
    });
    button.addEventListener("click", event => {
      event.preventDefault();
      event.stopPropagation();
      const open = list.classList.contains("hidden");
      list.classList.toggle("hidden", !open);
      list.classList.toggle("is-open", open);
      button.setAttribute("aria-expanded", String(open));
    });
    group.append(button, list);
    return group;
  };

  const legacyGroup = document.getElementById("socialsTrigger")?.parentElement;
  const socialsGroup = makeGroup("socialsDropdown", "Socials", socialLinks, false);
  const streamGroup = makeGroup("streamDropdown", "Stream", streamLinks, true);
  if (legacyGroup) legacyGroup.replaceWith(socialsGroup);
  const videosLink = Array.from(menu.querySelectorAll("a")).find(link => link.textContent.trim().toLowerCase() === "videos");
  if (videosLink) videosLink.after(socialsGroup, streamGroup);
  else menu.querySelector("nav")?.append(socialsGroup, streamGroup);

  const setMenuState = open => {
    menu.classList.toggle("translate-x-full", !open);
    menu.classList.toggle("translate-x-0", open);
    menu.setAttribute("aria-hidden", String(!open));
    ham.setAttribute("aria-expanded", String(open));
    ham.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    if (open) { const first = menu.querySelector("a, button"); if (first) setTimeout(() => first.focus(), 0); }
    else ham.focus();
  };
  if (!ham.classList.contains("text-5xl")) ham.classList.add("text-5xl");
  ham.setAttribute("aria-controls", "sideMenu");
  ham.setAttribute("aria-expanded", "false");
  ham.addEventListener("click", event => { event.preventDefault(); event.stopPropagation(); setMenuState(menu.classList.contains("translate-x-full")); });
  document.getElementById("closeMenu").addEventListener("click", event => { event.preventDefault(); event.stopPropagation(); setMenuState(false); });
  menu.querySelectorAll('a[href^="/#"], a[href="/"]').forEach(link => link.addEventListener("click", () => setMenuState(false)));
  document.addEventListener("keydown", event => { if (event.key === "Escape" && !menu.classList.contains("translate-x-full")) setMenuState(false); });
});