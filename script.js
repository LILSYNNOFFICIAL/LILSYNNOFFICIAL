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

  // Hero: keep immediate native autoplay. The 2.53 MB WebM is the primary asset;
  // the MP4 remains the browser fallback in index.html.
  const bgVideo = document.getElementById("bgVideo");
  if (bgVideo) { bgVideo.muted = true; bgVideo.setAttribute("playsinline", ""); const p = bgVideo.play(); if (p?.catch) p.catch(() => {}); }

  // Homepage requested content. Apply directly here rather than relying on a
  // separate polish layer so the production behavior is deterministic.
  const release = document.getElementById('presave');
  if (release) {
    const title = document.getElementById('latest-release-title');
    if (title) title.textContent = 'RESCUE YOU (ACOUSTIC VERSION)';
    const art = release.querySelector('#latest-release-art img');
    if (art) { art.src = 'assets/images/icons/album_art/RESCUE_YOU_A.png'; art.alt = 'LIL SYNN — Rescue You (Acoustic Version) artwork'; }
    const spotify = release.querySelector('a[href*="open.spotify.com"]');
    if (spotify) { spotify.href = 'https://open.spotify.com/track/4btTfkMu5yHTsB6CTq1AcF'; spotify.textContent = 'SPOTIFY'; }
    const apple = release.querySelector('#latest-apple');
    if (apple) { apple.href = 'https://music.apple.com/us/song/rescue-you-acoustic-version/6807294984'; apple.textContent = 'APPLE MUSIC'; }
    const listen = release.querySelector('a.cta-primary');
    if (listen) { listen.href = 'https://music.apple.com/us/song/rescue-you-acoustic-version/6807294984'; listen.textContent = 'LISTEN NOW'; }
    const presave = document.getElementById('presave-link');
    if (presave) presave.remove();
  }

  const videoGrid = document.getElementById('youtube-grid');
  if (videoGrid) {
    const videos = [
      ['Rescue You (Acoustic Version)', 'Glh5acZNiFM'],
      ['Somewhere In-Between', 'q_EENWIxiUA'],
      ['Black Glass', 'vebiWy-RL4Y'],
      ['Static On My Tongue', 'JRJswRmhbmA'],
      ["It's In Her Eyes", 'NMFONDfJoi8'],
      ['Fade Into You', 'tfVl30iEMkg'],
      ['Heal', '_1w0aG-lj8U'],
      ['Hindsight', 'HX5EZCPsAxI'],
      ['Back From The Blackout', 'WejkZ945Jt8']
    ];
    videoGrid.innerHTML = videos.map(([title, id]) => `<article class="glass rounded-3xl overflow-hidden border border-[#ff008f]/30 hover:border-[#ff4fd8]"><div class="relative youtube-card" data-video-id="${id}" data-video-title="${title}" style="aspect-ratio:16/9;background:#000;overflow:hidden"><img src="https://i.ytimg.com/vi/${id}/hqdefault.jpg" alt="${title}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover" loading="lazy" decoding="async"><button type="button" class="youtube-play-overlay" aria-label="Play ${title}" style="position:absolute;inset:0;width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:transparent;border:0;cursor:pointer"><span style="display:flex;align-items:center;justify-content:center;width:72px;height:72px;border-radius:999px;background:rgba(255,0,143,.94);box-shadow:0 0 28px rgba(255,0,143,.55);color:#fff;font-size:30px;padding-left:5px">▶</span></button></div><div class="p-4 text-sm font-['Rajdhani'] text-center">${title}</div></article>`).join('');
    videoGrid.querySelectorAll('.youtube-card').forEach(card => card.querySelector('.youtube-play-overlay')?.addEventListener('click', () => {
      const id = card.dataset.videoId, title = card.dataset.videoTitle;
      const iframe = document.createElement('iframe');
      iframe.title = `LIL SYNN — ${title}`;
      iframe.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&playsinline=1&rel=0&modestbranding=1`;
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture; web-share';
      iframe.allowFullscreen = true; iframe.referrerPolicy = 'strict-origin-when-cross-origin';
      iframe.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border:0;display:block;background:#000';
      card.innerHTML = ''; card.appendChild(iframe);
    }));
  }
});