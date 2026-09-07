document.addEventListener("DOMContentLoaded", () => {
  const ham = document.getElementById("hamburger");
  const menu = document.getElementById("sideMenu");
  const close = document.getElementById("closeMenu");
  if (!ham || !menu) return;

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
  ham.setAttribute("aria-expanded", "false");

  ham.addEventListener("click", event => {
    event.preventDefault();
    event.stopPropagation();
    setMenuState(menu.classList.contains("translate-x-full"));
  });

  close?.addEventListener("click", event => {
    event.preventDefault();
    event.stopPropagation();
    setMenuState(false);
  });

  menu.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", () => setMenuState(false));
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !menu.classList.contains("translate-x-full")) {
      setMenuState(false);
    }
  });

  const style = document.createElement("style");
  style.id = "lil-synn-navigation-runtime";
  style.textContent = `
    #sideMenu > nav {
      max-height: calc(100dvh - 88px);
      overflow-y: auto;
      overflow-x: hidden;
      overscroll-behavior: contain;
    }
    .nav-library-group {
      width: 100%;
      min-width: 0;
      flex: 0 0 auto !important;
      min-height: 0 !important;
      display: block !important;
    }
    .nav-library-group > button {
      width: 100%;
      padding: 0;
      text-align: left;
    }
    .nav-scroll-library {
      max-height: min(48vh, 390px);
      overflow-y: auto;
      overflow-x: hidden;
      overscroll-behavior: contain;
      padding-right: .65rem;
      scrollbar-width: auto;
      scrollbar-color: #ff008f #111;
    }
    .nav-scroll-library::-webkit-scrollbar { width: 9px; }
    .nav-scroll-library::-webkit-scrollbar-track { background: #111; border-radius: 8px; }
    .nav-scroll-library::-webkit-scrollbar-thumb { background: #ff008f; border-radius: 8px; border: 2px solid #111; }
    .nav-scroll-library::-webkit-scrollbar-thumb:hover { background: #ff4fd8; }
    .nav-library-group + .nav-library-group { margin-top: -1.5rem !important; }
    #sideMenu > nav > .nav-library-group + .nav-library-group { margin-top: -1.5rem !important; padding-top: 0 !important; }
    @media (max-width: 640px) {
      #sideMenu { width: min(86vw, 360px); }
      #sideMenu > nav { max-height: calc(100dvh - 82px); padding-bottom: 1.5rem; }
      .nav-scroll-library { max-height: 42vh; }
    }
  `;
  document.head.appendChild(style);

  const makeGroup = (id, label, links) => {
    const group = document.createElement("div");
    group.className = "nav-library-group";

    const button = document.createElement("button");
    button.type = "button";
    button.className = "menu-link flex justify-between w-full shrink-0";
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-controls", id);
    button.textContent = label;

    const list = document.createElement("div");
    list.id = id;
    list.className = "hidden flex flex-col gap-3 mt-4 pl-4 text-base font-['Rajdhani'] nav-scroll-library";

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

  if (!document.getElementById("streamTrigger")) {
    const originalSocialGroup = document.getElementById("socialsTrigger")?.parentElement;
    const videosLink = [...menu.querySelectorAll(":scope > nav > a")].find(
      link => link.textContent.trim().toLowerCase() === "videos"
    );

    if (originalSocialGroup && videosLink) {
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

      const socialsGroup = makeGroup("socialsDropdown", "Socials", socialLinks);
      const streamGroup = makeGroup("streamDropdown", "Stream", streamLinks);
      originalSocialGroup.replaceWith(socialsGroup);
      videosLink.after(socialsGroup, streamGroup);
    }
  }

  const bgVideo = document.getElementById("bgVideo");
  if (bgVideo) {
    bgVideo.muted = true;
    bgVideo.setAttribute("playsinline", "");
    const play = bgVideo.play();
    if (play?.catch) play.catch(() => {});
  }

  const rhythmStyle = document.createElement("style");
  rhythmStyle.id = "homepage-rhythm-final";
  rhythmStyle.textContent = `
    #home, #contact { background: rgba(128,128,128,.18) !important; }
    #presave, #music, #videos, #about, #merch, #signal { background: rgba(8,8,8,.62) !important; border-top:0 !important; border-bottom:0 !important; box-shadow:none !important; outline:0 !important; }
    #presave::before,#presave::after,#music::before,#music::after,#videos::before,#videos::after,#about::before,#about::after,#merch::before,#merch::after,#signal::before,#signal::after { border:0 !important; box-shadow:none !important; background:transparent !important; }
    #presave + #music,#music + #videos,#videos + #about,#about + #merch,#merch + #signal { border-top:0 !important; }
  `;
  document.head.appendChild(rhythmStyle);
});