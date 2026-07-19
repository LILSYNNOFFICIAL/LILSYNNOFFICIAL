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
      if (arrow) arrow.textContent = dropdown.classList.contains("hidden") ? "▼" : "▲";
    });
  }

  // =========================
  // LOAD YOUTUBE VIDEOS (click-to-load thumbnails)
  // =========================
  async function loadVideos() {
    const grid = document.getElementById("youtube-grid");
    if (!grid) return;

    grid.innerHTML = '<p class="text-center text-gray-400">Loading videos…</p>';

    function renderItems(items) {
      grid.innerHTML = items.map(item => {
        const title = (item.snippet && item.snippet.title) || '';
        const vid = item.videoId || (item.id && (item.id.videoId || item.id)) || '';
        const thumb = vid ? `https://i.ytimg.com/vi/${vid}/hqdefault.jpg` : '';

        return `
          <div class="glass rounded-3xl overflow-hidden border border-[#ff008f]/30 hover:border-[#ff4fd8]">
            <div class="relative" style="position:relative;padding-top:56.25%;background:#000;">
              ${thumb ? `<img src="${thumb}" alt="${escapeHtml(title)}" style="position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;cursor:pointer;" data-ytid="${vid}" class="yt-thumb">` : ''}
              <button class="yt-play" style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);background:rgba(0,0,0,0.6);border-radius:999px;border:2px solid #fff;padding:14px 18px;cursor:pointer;font-size:18px;color:#fff;">►</button>
            </div>
            <div class="p-4 text-sm font-['Rajdhani'] text-center">${escapeHtml(title)}</div>
          </div>
        `;
      }).join('');

      // attach click handlers to replace thumbnail with iframe on demand
      grid.querySelectorAll('.yt-thumb').forEach(img => {
        const vid = img.getAttribute('data-ytid');
        const container = img.parentElement;
        const onClick = () => {
          const iframe = document.createElement('iframe');
          iframe.className = 'youtube-iframe';
          iframe.style.position = 'absolute';
          iframe.style.top = '0';
          iframe.style.left = '0';
          iframe.style.width = '100%';
          iframe.style.height = '100%';
          iframe.frameBorder = '0';
          iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
          iframe.allowFullscreen = true;
          iframe.src = `https://www.youtube.com/embed/${vid}?autoplay=1`;
          container.innerHTML = '';
          container.appendChild(iframe);
        };
        img.addEventListener('click', onClick);
        const btn = img.parentElement.querySelector('.yt-play');
        if (btn) btn.addEventListener('click', onClick);
      });

      // for play buttons where thumbnail element wasn't present (safety)
      grid.querySelectorAll('.yt-play').forEach(btn => {
        const img = btn.parentElement.querySelector('.yt-thumb');
        if (!img) {
          const container = btn.parentElement;
          btn.addEventListener('click', () => {
            const vid = container.querySelector('.yt-thumb') ? container.querySelector('.yt-thumb').getAttribute('data-ytid') : null;
            if (!vid) return;
            const iframe = document.createElement('iframe');
            iframe.className = 'youtube-iframe';
            iframe.style.position = 'absolute';
            iframe.style.top = '0';
            iframe.style.left = '0';
            iframe.style.width = '100%';
            iframe.style.height = '100%';
            iframe.frameBorder = '0';
            iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
            iframe.allowFullscreen = true;
            iframe.src = `https://www.youtube.com/embed/${vid}?autoplay=1`;
            container.innerHTML = '';
            container.appendChild(iframe);
          });
        }
      });
    }

    // Try server endpoint, otherwise fallback file
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
