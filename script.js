document.addEventListener("DOMContentLoaded", () => {
  console.log("%cLIL SYNN site loaded", "color:#ff008f;font-weight:bold");

  const bgVideo = document.getElementById("bgVideo");
  if (bgVideo) {
    bgVideo.preload = "metadata";
    bgVideo.setAttribute("poster", "assets/heal2.png");
    bgVideo.setAttribute("playsinline", "");
    bgVideo.muted = true;
    const reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const saveData = !!(connection && connection.saveData);
    const slowConnection = !!(connection && /(^|-)2g$|slow-2g/i.test(connection.effectiveType || ""));
    const smallViewport = window.matchMedia && window.matchMedia("(max-width: 767px)").matches;
    if (reducedMotion || saveData || (smallViewport && slowConnection)) {
      bgVideo.pause();
      bgVideo.removeAttribute("autoplay");
    } else {
      const startVideo = () => {
        const p = bgVideo.play();
        if (p && typeof p.catch === "function") p.catch(() => {});
      };
      if (bgVideo.readyState >= 2) startVideo();
      else bgVideo.addEventListener("loadeddata", startVideo, { once: true });
    }
  }

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
    } else {
      ham.focus();
    }
  };
  if (menu) menu.setAttribute("aria-hidden", "true");
  if (ham && menu) ham.addEventListener("click", () => setMenuState(menu.classList.contains("translate-x-full")));
  if (close && menu) close.addEventListener("click", () => setMenuState(false));
  document.querySelectorAll('#sideMenu a[href^="#"]').forEach(link => link.addEventListener("click", () => setMenuState(false)));
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && menu && !menu.classList.contains("translate-x-full")) setMenuState(false);
  });

  const trigger = document.getElementById("socialsTrigger");
  const dropdown = document.getElementById("socialsDropdown");
  if (trigger && dropdown) {
    trigger.addEventListener("click", () => {
      const open = !dropdown.classList.toggle("hidden");
      trigger.setAttribute("aria-expanded", String(open));
      const arrow = trigger.querySelector("span");
      if (arrow) arrow.textContent = open ? "▲" : "▼";
    });
  }

  function ensureListenButton() {
    const section = document.getElementById("presave");
    if (!section || section.querySelector("[data-listen-cta]")) return;
    const links = section.querySelector(".mt-7");
    if (!links) return;
    const button = document.createElement("a");
    button.href = "https://music.apple.com/us/artist/lil-synn/1850720041";
    button.target = "_blank";
    button.rel = "noopener noreferrer";
    button.className = "cta-primary";
    button.setAttribute("data-listen-cta", "true");
    button.textContent = "LISTEN NOW";
    button.setAttribute("aria-label", "Listen to LIL SYNN on Apple Music");
    links.appendChild(button);
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>\"']/g, m => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '\"': '&quot;', "'": '&#39;'
    })[m]);
  }

  // MUSIC is intentionally NOT rendered here. music-random.js is the sole owner of #music-grid.
  // This prevents a legacy Apple Music renderer from overwriting the randomized Music tiles.
  ensureListenButton();

  async function loadVideos() {
    const grid = document.getElementById("youtube-grid");
    if (!grid) return;
    grid.innerHTML = '<p class="text-center text-gray-400">Loading videos…</p>';

    function renderItems(items) {
      const validItems = (items || []).filter(item => item && (item.videoId || (item.id && (item.id.videoId || item.id)))).slice(0, 6);
      grid.innerHTML = validItems.map(item => {
        const title = (item.snippet && item.snippet.title) || "LIL SYNN Video";
        const vid = item.videoId || (item.id && (item.id.videoId || item.id)) || "";
        const thumb = `https://i.ytimg.com/vi/${encodeURIComponent(vid)}/hqdefault.jpg`;
        const safeTitle = escapeHtml(title);
        const safeVid = escapeHtml(vid);
        const youtubeUrl = `https://www.youtube.com/watch?v=${encodeURIComponent(vid)}`;
        return `<article class="glass rounded-3xl overflow-hidden border border-[#ff008f]/30 hover:border-[#ff4fd8]"><div class="relative yt-frame-host" style="position:relative;aspect-ratio:16/9;background:#000;overflow:hidden;"><a href="${youtubeUrl}" target="_blank" rel="noopener noreferrer" class="yt-direct-link" aria-label="Watch ${safeTitle} on YouTube"><img src="${thumb}" alt="${safeTitle}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;cursor:pointer;" data-ytid="${safeVid}" class="yt-thumb" loading="lazy" decoding="async"></a><button type="button" class="yt-play" aria-label="Play ${safeTitle}" style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);background:rgba(0,0,0,.78);border-radius:999px;border:2px solid #fff;padding:14px 18px;cursor:pointer;font-size:18px;color:#fff;z-index:2;">►</button></div><div class="p-4 text-sm font-['Rajdhani'] text-center">${safeTitle}</div></article>`;
      }).join("");

      grid.querySelectorAll(".yt-thumb").forEach(img => {
        const vid = img.getAttribute("data-ytid");
        const host = img.closest(".yt-frame-host");
        if (!vid || !host) return;
        const playVideo = event => {
          if (event) {
            event.preventDefault();
            event.stopPropagation();
          }
          const youtubeUrl = `https://www.youtube.com/watch?v=${encodeURIComponent(vid)}`;
          const iframe = document.createElement("iframe");
          iframe.className = "youtube-iframe";
          iframe.title = `LIL SYNN — ${img.alt}`;
          iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
          iframe.allowFullscreen = true;
          iframe.referrerPolicy = "strict-origin-when-cross-origin";
          iframe.loading = "eager";
          iframe.style.cssText = "position:absolute;inset:0;width:100%;height:100%;border:0;display:block;background:#000;";
          iframe.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(vid)}?autoplay=1&playsinline=1&rel=0&modestbranding=1&enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}`;
          host.innerHTML = "";
          host.appendChild(iframe);
          const fallback = document.createElement("div");
          fallback.style.cssText = "position:absolute;left:0;right:0;bottom:0;z-index:3;text-align:center;padding:8px;background:linear-gradient(transparent,rgba(0,0,0,.9));pointer-events:none;";
          fallback.innerHTML = `<a href="${youtubeUrl}" target="_blank" rel="noopener noreferrer" style="pointer-events:auto;color:#fff;text-decoration:underline;font:600 14px Rajdhani,sans-serif;">OPEN ON YOUTUBE</a>`;
          host.appendChild(fallback);
          iframe.focus();
        };
        img.addEventListener("click", playVideo);
        host.querySelector(".yt-play")?.addEventListener("click", playVideo);
      });
    }

    // Latest Videos is deliberately deterministic: the API/fallback supplies newest-first and we retain that order.
    try {
      const res = await fetch("/api/youtube", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data?.items) && data.items.length) {
          renderItems(data.items);
          return;
        }
      }
    } catch (e) {
      console.warn("YouTube API fetch failed; using fallback catalog.");
    }

    try {
      const res = await fetch("/assets/youtube-fallback.json", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data?.items) && data.items.length) {
          renderItems(data.items);
          return;
        }
      }
    } catch (e) {
      console.warn("YouTube fallback fetch failed.");
    }

    grid.innerHTML = '<div class="text-center text-gray-400"><p>Videos are temporarily unavailable.</p><a href="https://www.youtube.com/@LILSYNNOFFICIAL" target="_blank" rel="noopener noreferrer" class="underline text-[#ff008f]">Visit the YouTube channel</a></div>';
  }

  loadVideos();
});