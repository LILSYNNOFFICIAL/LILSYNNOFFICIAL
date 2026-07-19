document.addEventListener("DOMContentLoaded", () => {

  console.log("%cLIL SYNN site loaded", "color:#ff008f;font-weight:bold");

  // =========================
  // HAMBURGER MENU
  // =========================
  const ham = document.getElementById("hamburger");
  const menu = document.getElementById("sideMenu");
  const close = document.getElementById("closeMenu");

  if (ham && menu) {
    ham.addEventListener("click", () => {
      menu.classList.toggle("translate-x-full");
    });
  }

  if (close && menu) {
    close.addEventListener("click", () => {
      menu.classList.add("translate-x-full");
    });
  }

  // =========================
  // SOCIALS DROPDOWN (text-only in menu)
  // =========================
  const trigger = document.getElementById("socialsTrigger");
  const dropdown = document.getElementById("socialsDropdown");

  if (trigger && dropdown) {
    trigger.addEventListener("click", () => {
      dropdown.classList.toggle("hidden");
      const arrow = trigger.querySelector("span");
      if (arrow) {
        arrow.textContent = dropdown.classList.contains("hidden") ? "▼" : "▲";
      }
    });
  }

  // Utilities for YouTube loading
  const YOUTUBE_CHANNEL_URL = "https://www.youtube.com/channel/UC1uTOgZd1rNHnASINvT4b4Q";
  const CACHE_KEY = "youtube_feed_cache_v1";
  const CACHE_TTL_MS = 1000 * 60 * 60 * 6; // 6 hours

  async function fetchWithRetries(url, options = {}, retries = 2, backoff = 500) {
    let attempt = 0;
    while (attempt <= retries) {
      try {
        const res = await fetch(url, options);
        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(`HTTP ${res.status}: ${text}`);
        }
        return res;
      } catch (err) {
        console.warn(`fetch attempt ${attempt + 1} failed:`, err);
        if (attempt === retries) throw err;
        await new Promise(r => setTimeout(r, backoff * (attempt + 1)));
        attempt++;
      }
    }
  }

  function saveCache(data) {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data }));
    } catch (e) {
      console.warn("Unable to save youtube cache", e);
    }
  }
  function loadCache() {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed.ts || Date.now() - parsed.ts > CACHE_TTL_MS) return null;
      return parsed.data;
    } catch (e) {
      return null;
    }
  }

  // LOAD YOUTUBE VIDEOS with retries + cache + fallback
  async function loadVideos() {
    const grid = document.getElementById("youtube-grid");
    if (!grid) return;

    // show placeholder / spinner
    grid.innerHTML = '<p class="text-center text-gray-400">Loading videos…</p>';

    // First, try cache
    const cached = loadCache();
    if (cached && cached.items && cached.items.length) {
      try {
        populateGrid(grid, cached.items);
      } catch (e) {
        console.warn("populateGrid from cache failed", e);
      }
      // still attempt to refresh in background, but don't block display
      refreshVideosInBackground();
      return;
    }

    // no cache => fetch (with retries)
    try {
      const res = await fetchWithRetries("/api/youtube", {}, 2, 600);
      const data = await res.json();
      if (!data || !data.items || !data.items.length) {
        throw new Error("Invalid data shape from /api/youtube");
      }
      saveCache(data);
      populateGrid(grid, data.items);
    } catch (err) {
      console.error("Video load failed after retries:", err);
      // if we have cache we already rendered earlier; otherwise show fallback
      const cached2 = loadCache();
      if (cached2 && cached2.items && cached2.items.length) {
        populateGrid(grid, cached2.items);
      } else {
        grid.innerHTML = `
          <div class="text-center">
            <p class="text-gray-400 mb-2">Videos unavailable right now.</p>
            <a href="${YOUTUBE_CHANNEL_URL}" target="_blank" rel="noopener noreferrer" class="underline text-[#ff008f]">Visit the YouTube channel</a>
          </div>
        `;
      }
    }
  }

  // Background refresh to keep cache fresh without interrupting UI
  async function refreshVideosInBackground() {
    try {
      const res = await fetchWithRetries("/api/youtube", {}, 1, 800);
      const data = await res.json();
      if (data && data.items && data.items.length) saveCache(data);
    } catch (e) {
      // silent
      console.info("Background refresh for YouTube failed:", e);
    }
  }

  function populateGrid(grid, items) {
    grid.innerHTML = items.map(item => {
      const videoId = (item.id && (item.id.videoId || item.id)) || (item.snippet && item.snippet.resourceId && item.snippet.resourceId.videoId) || "";
      const title = (item.snippet && item.snippet.title) || "";
      if (!videoId) return "";
      return `
        <div class="glass rounded-3xl overflow-hidden border border-[#ff008f]/30 hover:border-[#ff4fd8]">
          <iframe
            width="100%"
            height="220"
            src="https://www.youtube.com/embed/${videoId}"
            frameborder="0"
            allowfullscreen>
          </iframe>
          <div class="p-4 text-sm font-['Rajdhani'] text-center">
            ${escapeHtml(title)}
          </div>
        </div>
      `;
    }).join("");
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>\"']/g, function (m) {
      return ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'})[m];
    });
  }

  loadVideos();

  // SOCIAL ICON GRID (BOTTOM OF PAGE)
  const socialIcons = `
    <a href="https://www.youtube.com/channel/UC1uTOgZd1rNHnASINvT4b4Q" target="_blank" rel="noopener noreferrer">
      <img src="assets/images/icons/youtube.svg" class="social-icon w-16 h-16 mx-auto">
    </a>
    <a href="https://open.spotify.com/artist/6ozcOAnRAUPn3z5c0GR5kU" target="_blank" rel="noopener noreferrer">
      <img src="assets/images/icons/spotify.svg" class="social-icon w-16 h-16 mx-auto">
    </a>
    <a href="https://music.apple.com/us/artist/lil-synn/1850720041" target="_blank" rel="noopener noreferrer">
      <img src="assets/images/icons/apple-music.svg" class="social-icon w-16 h-16 mx-auto">
    </a>
    <a href="https://www.instagram.com/lilsynnofficial/" target="_blank" rel="noopener noreferrer">
      <img src="assets/images/icons/instagram.svg" class="social-icon w-16 h-16 mx-auto">
    </a>
    <a href="https://x.com/lilsynnofficial" target="_blank" rel="noopener noreferrer">
      <img src="assets/images/icons/twitter.svg" class="social-icon w-16 h-16 mx-auto">
    </a>
    <a href="https://soundcloud.com/lilsynnofficial" target="_blank" rel="noopener noreferrer">
      <img src="assets/images/icons/soundcloud.svg" class="social-icon w-16 h-16 mx-auto">
    </a>
    <a href="https://www.tiktok.com/@lilsynnofficial" target="_blank" rel="noopener noreferrer">
      <img src="assets/images/icons/tiktok.svg" class="social-icon w-16 h-16 mx-auto">
    </a>
    <a href="https://www.facebook.com/lilsynnofficial" target="_blank" rel="noopener noreferrer">
      <img src="assets/images/icons/facebook.svg" class="social-icon w-16 h-16 mx-auto">
    </a>
  `;

  const mainGrid = document.getElementById("main-social-grid");
  if (mainGrid) mainGrid.innerHTML = socialIcons;

});
