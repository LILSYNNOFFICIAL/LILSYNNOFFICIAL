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
  // LOAD YOUTUBE VIDEOS (with diagnostics)
  // =========================
  async function loadVideos() {
    const grid = document.getElementById("youtube-grid");
    if (!grid) return;

    // show placeholder / spinner
    grid.innerHTML = '<p class="text-center text-gray-400">Loading videos…</p>';

    try {
      const res = await fetch("/api/youtube");

      // DIAGNOSTICS: show HTTP status on the page for debugging
      const diag = document.getElementById("youtube-diag");
      if (diag) diag.textContent = `HTTP ${res.status}`;

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error("/api/youtube returned non-JSON:", text.slice(0, 1000));
        grid.innerHTML = `
          <div class="text-center text-gray-400">
            <p>Videos unavailable (bad response).</p>
            <pre class="text-xs text-left max-w-xl mx-auto break-words bg-black/50 p-2 rounded">${escapeHtml(text.slice(0, 1000))}</pre>
          </div>
        `;
        return;
      }

      if (!data || !data.items || !data.items.length) {
        console.warn("/api/youtube returned no items", data);
        grid.innerHTML = `
          <div class="text-center text-gray-400">
            <p>Videos unavailable (no items).</p>
            <pre class="text-xs text-left max-w-xl mx-auto break-words bg-black/50 p-2 rounded">${escapeHtml(JSON.stringify(data).slice(0, 1000))}</pre>
          </div>
        `;
        return;
      }

      // populate grid
      grid.innerHTML = data.items.map(item => `
        <div class="glass rounded-3xl overflow-hidden border border-[#ff008f]/30 hover:border-[#ff4fd8]">
          <iframe
            width="100%"
            height="220"
            src="https://www.youtube.com/embed/${(item.id && (item.id.videoId || item.id)) || (item.snippet && item.snippet.resourceId && item.snippet.resourceId.videoId) || ''}"
            frameborder="0"
            allowfullscreen>
          </iframe>
          <div class="p-4 text-sm font-['Rajdhani'] text-center">
            ${escapeHtml((item.snippet && item.snippet.title) || '')}
          </div>
        </div>
      `).join("");

    } catch (err) {
      console.error("Video load failed", err);
      grid.innerHTML = `
        <div class="text-center text-gray-400">
          <p>Videos unavailable (fetch error).</p>
          <p class="text-xs mt-2">Check console/network for details.</p>
        </div>
      `;
    }
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
