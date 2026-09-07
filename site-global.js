document.addEventListener("DOMContentLoaded", () => {
  if (/^(\/|\/index\.html?)$/i.test(location.pathname)) return;
  const nav = document.querySelector("header .nav");
  if (!nav || document.getElementById("sideMenu")) return;

  // Secondary pages use the same Tailwind-powered navigation system as index.html.
  if (!document.querySelector('script[src="https://cdn.tailwindcss.com"]')) {
    const tw = document.createElement("script");
    tw.src = "https://cdn.tailwindcss.com";
    document.head.appendChild(tw);
  }

  const ham = document.createElement("button");
  ham.id = "hamburger";
  ham.className = "text-5xl text-[#ff008f]";
  ham.style.marginLeft = ".5rem";
  ham.type = "button";
  ham.setAttribute("aria-label", "Open navigation");
  ham.setAttribute("aria-controls", "sideMenu");
  ham.setAttribute("aria-expanded", "false");
  ham.textContent = "☰";
  nav.appendChild(ham);

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
    </nav>`;
  document.body.appendChild(menu);

  // Match index.html/script.js: Stream is created dynamically immediately after Socials.
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
    list.className = `hidden flex flex-col gap-3 mt-4 pl-4 text-base font-['Rajdhani']${scrollable ? " max-h-[48vh] overflow-y-auto" : ""}`;
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
      button.setAttribute("aria-expanded", String(open));
    });
    group.append(button, list);
    return group;
  };

  const socialsGroup = menu.querySelector("#socialsTrigger")?.parentElement;
  const socialsButton = menu.querySelector("#socialsTrigger");
  const socialsDropdown = menu.querySelector("#socialsDropdown");
  const streamGroup = makeGroup("streamDropdown", "Stream", streamLinks, true);
  const videos = Array.from(menu.querySelectorAll("a")).find(a => a.textContent.trim() === "Videos");
  if (videos) {
    videos.after(socialsGroup, streamGroup);
  }
  socialsButton?.addEventListener("click", event => {
    event.preventDefault();
    event.stopPropagation();
    const open = socialsDropdown.classList.contains("hidden");
    socialsDropdown.classList.toggle("hidden", !open);
    socialsButton.setAttribute("aria-expanded", String(open));
  });

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

  menu.setAttribute("aria-hidden", "true");
  ham.addEventListener("click", event => {
    event.preventDefault();
    event.stopPropagation();
    setMenuState(menu.classList.contains("translate-x-full"));
  });
  menu.querySelector("#closeMenu")?.addEventListener("click", event => {
    event.preventDefault();
    event.stopPropagation();
    setMenuState(false);
  });
  menu.querySelectorAll('a[href^="/#"], a[href="/"]').forEach(link => link.addEventListener("click", () => setMenuState(false)));
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !menu.classList.contains("translate-x-full")) setMenuState(false);
  });
});