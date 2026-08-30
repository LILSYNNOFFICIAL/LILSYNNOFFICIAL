document.addEventListener("DOMContentLoaded", () => {
  const ham = document.getElementById("hamburger");
  const menu = document.getElementById("sideMenu");
  const close = document.getElementById("closeMenu");
  const setMenuState = open => {
    if (!menu || !ham) return;
    menu.classList.toggle("translate-x-full", !open);
    menu.setAttribute("aria-hidden", String(!open));
    ham.setAttribute("aria-expanded", String(open));
    ham.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    if (open) {
      const first = menu.querySelector("a, button");
      if (first) setTimeout(() => first.focus(), 0);
    } else ham.focus();
  };
  if (menu) menu.setAttribute("aria-hidden", "true");
  if (ham && menu) ham.addEventListener("click", event => {
    event.preventDefault();
    event.stopPropagation();
    setMenuState(menu.classList.contains("translate-x-full"));
  });
  if (close && menu) close.addEventListener("click", event => {
    event.preventDefault();
    event.stopPropagation();
    setMenuState(false);
  });
  document.querySelectorAll('#sideMenu a[href^="#"]').forEach(link => link.addEventListener("click", () => setMenuState(false)));
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && menu && !menu.classList.contains("translate-x-full")) setMenuState(false);
  });

  const bgVideo = document.getElementById("bgVideo");
  if (bgVideo) {
    bgVideo.preload = "metadata";
    bgVideo.setAttribute("playsinline", "");
    bgVideo.muted = true;
    const startVideo = () => { const p = bgVideo.play(); if (p?.catch) p.catch(() => {}); };
    if (bgVideo.readyState >= 2) startVideo(); else bgVideo.addEventListener("loadeddata", startVideo, { once: true });
  }
});