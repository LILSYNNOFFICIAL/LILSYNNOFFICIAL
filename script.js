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
  // LOAD YOUTUBE VIDEOS (recommended: embed videos, show playlists as links)
  // =========================
  async function loadVideos() {
    const grid = document.getElementById("youtube-grid");
    if (!grid) return;

    // show placeholder while loading
    grid.innerHTML = '<p class="text-center text-gray-400">Loading videos…</p>';

    function renderItems(items) {
      grid.innerHTML = items.map(item => {
        const title = (item.snippet && item.snippet.title) || '';

        // Video items: embed the video
        if (item.type === 'video' && item.videoId) {
          const iframeSrc = `https://www.youtube.com/embed/${item.videoId}`;
          return `
            <div class="glass rounded-3xl overflow-hidden border border-[#ff008f]/30 hover:border-[#ff4fd8]">
              <iframe
                class="youtube-iframe"
                src="${iframeSrc}"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen>
              </iframe>
              <div class="p-4 text-sm font-['Rajdhani'] text-center">
                ${escapeHtml(title)}
              </div>
            </div>
          `;
        }

        // Playlist items: show a link card (avoid embedding playlists directly)
        if (item.type === 'playlist' && item.playlistId) {
          const playlistUrl = item.url || `https://youtube.com/playlist?list=${item.playlistId}`;
          return `
            <div class="glass rounded-3xl overflow-hidden border border-[#ff008f]/30 hover:border-[#ff4fd8] p-6 flex flex-col items-center justify-center">
              <div class="text-lg font-['Rajdhani'] mb-4 text-center">${escapeHtml(title)}</div>
              <a href="${playlistUrl}" target="_blank" rel="noopener noreferrer" class="inline-block bg-[#ff008f] text-black font-bold px-6 py-3 rounded-md hover:bg-[#ff4fd8]">Play playlist</a>
            </div>
          `;
        }

        // Fallback generic card
        return `
          <div class="glass rounded-3xl overflow-hidden border border-[#ff008f]/30 p-6 text-center">
            <div class="text-sm font-['Rajdhani']">${escapeHtml(title || 'Unavailable')}</div>
          </div>
        `;
      }).join('');
    }

    // Try server, then fallback file
    try {
      const res = await fetch('/api/youtube');
      if (res.ok) {
        const data = await res.json();
        if (data && data.items && data.items.length) {
          renderItems(data.items);
          return;
        }
      }
    } catch (e) {
      console.warn('YouTube fetch failed (server). Using fallback if available.');
    }

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
