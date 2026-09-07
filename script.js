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
    @media (max-width: 640px) {
      #sideMenu { width: min(86vw, 360px); }
      #sideMenu > nav { max-height: calc(100dvh - 82px); padding-bottom: 1.5rem; }
    }
  `;
  document.head.appendChild(style);

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
