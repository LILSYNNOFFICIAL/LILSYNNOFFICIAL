document.addEventListener("DOMContentLoaded", () => {
  if (/^(\/|\/index\.html?)$/i.test(location.pathname)) return;

  const nav = document.querySelector("header .nav");
  if (!nav || document.getElementById("sideMenu")) return;

  // Secondary pages deliberately reuse the exact navigation DOM/classes from index.html.
  // Do not recreate menu behavior here: script.js is the single source of truth for toggling,
  // Socials, Stream, accessibility state, and responsive menu behavior.
  if (!document.querySelector('script[src="https://cdn.tailwindcss.com"]')) {
    const tailwind = document.createElement("script");
    tailwind.src = "https://cdn.tailwindcss.com";
    tailwind.onload = loadNavigationScript;
    document.head.appendChild(tailwind);
  } else {
    loadNavigationScript();
  }

  const hamburger = document.createElement("button");
  hamburger.id = "hamburger";
  hamburger.className = "text-5xl text-[#ff008f]";
  hamburger.style.marginLeft = ".5rem";
  hamburger.type = "button";
  hamburger.setAttribute("aria-label", "Open navigation");
  hamburger.setAttribute("aria-controls", "sideMenu");
  hamburger.setAttribute("aria-expanded", "false");
  hamburger.textContent = "☰";
  nav.appendChild(hamburger);

  // This is the same side-menu markup that exists in index.html.
  const sideMenu = document.createElement("div");
  sideMenu.id = "sideMenu";
  sideMenu.className = "fixed top-0 right-0 h-full w-72 bg-black/90 backdrop-blur-xl transform translate-x-full transition-transform duration-300 z-50";
  sideMenu.setAttribute("aria-label", "Site menu");
  sideMenu.innerHTML = `
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
  document.body.appendChild(sideMenu);

  function loadNavigationScript() {
    if (document.querySelector('script[src="/script.js"]')) return;
    const script = document.createElement("script");
    script.src = "/script.js";
    script.defer = false;
    document.head.appendChild(script);
  }
});