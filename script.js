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

  // =========================
  // LOAD YOUTUBE VIDEOS (silent diagnostics removed)
  // =========================
  async function loadVideos() {
    const grid = document.getElementById("youtube-grid");
    if (!grid) return;

    // show placeholder while loading
    grid.innerHTML = '<p class="text-center text-gray-400">Loading videos…</p>';

    // helper to render items array
    function renderItems(items) {
      grid.innerHTML = items.map(item => `
        <div class="glass rounded-3xl overflow-hidden border border-[#ff008f]/30 hover:border-[#ff4fd8]">
          <iframe
            class="youtube-iframe"
            src="https://www.youtube.com/embed/${(item.id && (item.id.videoId || item.id)) || (item.snippet && item.snippet.resourceId && item.snippet.resourceId.videoId) || ''}"
            frameborder="0"
            allowfullscreen>
          </iframe>
          <div class="p-4 text-sm font-['Rajdhani'] text-center">
            ${escapeHtml((item.snippet && item.snippet.title) || '')}
          </div>
        </div>
      `).join("");
    }

    // try server endpoint, otherwise fallback to bundled JSON, otherwise show generic message
    try {
      const res = await fetch("/api/youtube");
      if (res.ok) {
        const data = await res.json();
        if (data && data.items && data.items.length) {
          renderItems(data.items);
          return;
        }
      }
    } catch (e) {
      // intentionally silent on-page; log to console for debugging
      console.warn('YouTube fetch failed (server). Using fallback if available.');
    }

    // fallback file bundled with site
    try {
      const fallbackRes = await fetch('/assets/youtube-fallback.json');
      if (fallbackRes.ok) {
        const fallback = await fallbackRes.json();
        if (fallback && fallback.items && fallback.items.length) {
          renderItems(fallback.items);
          return;
        }
      }
    } catch (e) {
      console.warn('Fallback fetch failed.');
    }

    // final fallback: generic UI
    grid.innerHTML = `
      <div class="text-center text-gray-400">
        <p>Videos are temporarily unavailable.</p>
        <a href="https://www.youtube.com/channel/UC1uTOgZd1rNHnASINvT4b4Q" target="_blank" rel="noopener noreferrer" class="underline text-[#ff008f]">Visit the YouTube channel</a>
      </div>
    `;
  }

  loadVideos();

  // =========================
  // SOCIAL ICON GRID (BOTTOM OF PAGE)
  // =========================
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

  function escapeHtml(str) {
    return String(str).replace(/[&<>\"']/g, function (m) {
      return ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'})[m];
    });
  }

});
