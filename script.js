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
    if (open) { const first = menu.querySelector("a, button"); if (first) setTimeout(() => first.focus(), 0); } else ham.focus();
  };
  if (menu) menu.setAttribute("aria-hidden", "true");
  if (ham && menu) ham.addEventListener("click", event => { event.preventDefault(); event.stopPropagation(); setMenuState(menu.classList.contains("translate-x-full")); });
  if (close && menu) close.addEventListener("click", event => { event.preventDefault(); event.stopPropagation(); setMenuState(false); });
  document.querySelectorAll('#sideMenu a[href^="#"]').forEach(link => link.addEventListener("click", () => setMenuState(false)));
  document.addEventListener("keydown", event => { if (event.key === "Escape" && menu && !menu.classList.contains("translate-x-full")) setMenuState(false); });

  const trigger = document.getElementById("socialsTrigger");
  const dropdown = document.getElementById("socialsDropdown");
  if (trigger && dropdown) {
    trigger.setAttribute("aria-expanded", "false");
    trigger.addEventListener("click", event => {
      event.preventDefault(); event.stopPropagation();
      const open = dropdown.classList.contains("hidden");
      dropdown.classList.toggle("hidden", !open);
      trigger.setAttribute("aria-expanded", String(open));
      const arrow = trigger.querySelector("span");
      if (arrow) arrow.textContent = open ? "▲" : "▼";
    });
  }

  // Do not alter the hero video's native loading policy. The HTML video element
  // is responsible for immediate muted autoplay; with the optimized WebM
  // source this avoids a large JavaScript-controlled startup delay.
  const bgVideo = document.getElementById("bgVideo");
  if (bgVideo) { bgVideo.muted = true; bgVideo.setAttribute("playsinline", ""); const p = bgVideo.play(); if (p?.catch) p.catch(() => {}); }
});