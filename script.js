document.addEventListener("DOMContentLoaded", () => {
  console.log("%cLIL SYNN site loaded", "color:#ff008f;font-weight:bold");

  const bgVideo = document.getElementById("bgVideo");
  if (bgVideo) {
    bgVideo.preload = "metadata";
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      bgVideo.pause();
    }
  }

  const ham = document.getElementById("hamburger");
  const menu = document.getElementById("sideMenu");
  const close = document.getElementById("closeMenu");
  const setMenuState = (open) => {
    if (!menu || !ham) return;
    menu.classList.toggle("translate-x-full", !open);
    ham.setAttribute("aria-expanded", String(open));
    ham.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    if (open) {
      const first = menu.querySelector("a, button");
      if (first) setTimeout(() => first.focus(), 0);
    } else {
      ham.focus();
    }
  };
  if (ham && menu) ham.addEventListener("click", () => setMenuState(menu.classList.contains("translate-x-full")));
  if (close && menu) close.addEventListener("click", () => setMenuState(false));
  document.querySelectorAll('#sideMenu a[href^="#"]').forEach(link => link.addEventListener("click", () => setMenuState(false)));

  const trigger = document.getElementById("socialsTrigger");
  const dropdown = document.getElementById("socialsDropdown");
  if (trigger && dropdown) {
    trigger.addEventListener("click", () => {
      const open = dropdown.classList.toggle("hidden") === false;
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

  async function loadMusic() {
    const grid = document.getElementById("music-grid");
    const latestArt = document.getElementById("latest-release-art");
    const latestTitle = document.getElementById("latest-release-title");
    const latestApple = document.getElementById("latest-apple");
    if (!grid) return;
    grid.innerHTML = '<div class="col-span-full text-center text-gray-400">Loading releases…</div>';
    try {
      const res = await fetch("https://itunes.apple.com/lookup?id=1850720041&entity=album&limit=20&sort=recent");
      if (!res.ok) throw new Error("Apple Music catalog request failed");
      const data = await res.json();
      const releases = (data.results || []).filter(item => item.wrapperType === "collection" && item.collectionName && item.artistName === "LIL SYNN").filter((item, index, arr) => arr.findIndex(x => x.collectionId === item.collectionId) === index).slice(0, 8);
      if (!releases.length) throw new Error("No releases found");
      const latest = releases[0];
      const latestArtwork = (latest.artworkUrl100 || "").replace("100x100bb", "600x600bb");
      if (latestTitle) latestTitle.textContent = latest.collectionName.toUpperCase();
      if (latestApple) latestApple.href = latest.collectionViewUrl || "https://music.apple.com/us/artist/lil-synn/1850720041";
      if (latestArt && latestArtwork) latestArt.innerHTML = `<img src="${latestArtwork}" alt="LIL SYNN — ${escapeHtml(latest.collectionName)} artwork" loading="eager" decoding="async">`;
      grid.innerHTML = releases.map(release => {
        const title = escapeHtml(release.collectionName);
        const artwork = (release.artworkUrl100 || "").replace("100x100bb", "600x600bb");
        const date = release.releaseDate ? new Date(release.releaseDate).getFullYear() : "2026";
        const apple = release.collectionViewUrl || "https://music.apple.com/us/artist/lil-synn/1850720041";
        const spotify = `https://open.spotify.com/search/${encodeURIComponent(`LIL SYNN ${release.collectionName}`)}`;
        return `<article class="music-card"><a href="${apple}" target="_blank" rel="noopener noreferrer" aria-label="Open ${title} on Apple Music">${artwork ? `<img src="${artwork}" alt="${title} — LIL SYNN artwork" loading="lazy" decoding="async">` : `<div class="music-placeholder">LIL SYNN</div>`}</a><div class="music-card-body"><h3 class="music-card-title">${title}</h3><p class="music-card-meta">${date}</p><div class="music-card-links"><a href="${apple}" target="_blank" rel="noopener noreferrer">APPLE</a><a href="${spotify}" target="_blank" rel="noopener noreferrer">SPOTIFY</a></div></div></article>`;
      }).join("");
      ensureListenButton();
    } catch (e) {
      console.warn("Music catalog fetch failed.", e);
      grid.innerHTML = `<div class="col-span-full text-center text-gray-400"><p>Music catalog temporarily unavailable.</p><a href="https://music.apple.com/us/artist/lil-synn/1850720041" target="_blank" rel="noopener noreferrer" class="underline text-[#ff008f]">Open LIL SYNN on Apple Music</a></div>`;
      ensureListenButton();
    }
  }

  async function loadVideos() {
    const grid = document.getElementById("youtube-grid");
    if (!grid) return;
    grid.innerHTML = '<p class="text-center text-gray-400">Loading videos…</p>';
    function renderItems(items) {
      grid.innerHTML = items.slice(0, 6).map(item => {
        const title = (item.snippet && item.snippet.title) || '';
        const vid = item.videoId || (item.id && (item.id.videoId || item.id)) || '';
        const thumb = vid ? `https://i.ytimg.com/vi/${vid}/hqdefault.jpg` : '';
        const safeTitle = escapeHtml(title);
        return `<article class="glass rounded-3xl overflow-hidden border border-[#ff008f]/30 hover:border-[#ff4fd8]"><div class="relative" style="position:relative;padding-top:56.25%;background:#000;"><a href="https://www.youtube.com/watch?v=${encodeURIComponent(vid)}" target="_blank" rel="noopener noreferrer" class="yt-direct-link" aria-label="Watch ${safeTitle} on YouTube"><img src="${thumb}" alt="${safeTitle}" style="position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;cursor:pointer;" data-ytid="${escapeHtml(vid)}" class="yt-thumb" loading="lazy"></a><button type="button" class="yt-play" aria-label="Play ${safeTitle}" style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);background:rgba(0,0,0,0.72);border-radius:999px;border:2px solid #fff;padding:14px 18px;cursor:pointer;font-size:18px;color:#fff;z-index:2;">►</button></div><div class="p-4 text-sm font-['Rajdhani'] text-center">${safeTitle}</div></article>`;
      }).join('');
      grid.querySelectorAll('.yt-thumb').forEach(img => {
        const vid = img.getAttribute('data-ytid');
        const onClick = (event) => {
          if (event) event.preventDefault();
          const frameHost = img.closest('div.relative');
          if (!frameHost || !vid) return;
          const iframe = document.createElement('iframe');
          iframe.className = 'youtube-iframe';
          iframe.title = `LIL SYNN — ${img.alt}`;
          iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
          iframe.setAttribute('allowfullscreen', '');
          iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
          iframe.loading = 'eager';
          iframe.src = `https://www.youtube.com/embed/${encodeURIComponent(vid)}?autoplay=1&playsinline=1&rel=0&modestbranding=1&enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}`;
          frameHost.style.paddingTop = '0';
          frameHost.innerHTML = '';
          frameHost.appendChild(iframe);
        };
        img.addEventListener('click', onClick);
        const btn = img.closest('div.relative')?.querySelector('.yt-play');
        if (btn) btn.addEventListener('click', onClick);
      });
    }
    try { const res=await fetch('/api/youtube'); if(res.ok){const data=await res.json(); if(data?.items?.length){renderItems(data.items);return;}} } catch(e){console.warn('YouTube fetch failed.');}
    try { const res=await fetch('/assets/youtube-fallback.json'); if(res.ok){const data=await res.json(); if(data?.items?.length){renderItems(data.items);return;}} } catch(e){console.warn('Fallback fetch failed.');}
    grid.innerHTML='<div class="text-center text-gray-400"><p>Videos are temporarily unavailable.</p><a href="https://www.youtube.com/@LILSYNNOFFICIAL" target="_blank" rel="noopener noreferrer" class="underline text-[#ff008f]">Visit the YouTube channel</a></div>';
  }

  const socials = [
    ['YouTube','https://www.youtube.com/@LILSYNNOFFICIAL',`<svg viewBox="0 0 100 100" aria-hidden="true"><path fill="#FF1493" fill-opacity="1" d="M88 18H12C5.37 18 0 23.37 0 30v40c0 6.63 5.37 12 12 12h76c6.63 0 12-5.37 12-12V30c0-6.63-5.37-12-12-12ZM39 31l34 19-34 19V31Z"/></svg>`],
    ['Spotify','https://open.spotify.com/artist/6ozcOAnRAUPn3z5c0GR5kU',`<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="47" fill="#FF1493" fill-opacity="1"/><path d="M22 39c18-7 40-6 58 2M26 51c16-6 35-5 50 2M30 63c13-4 27-3 40 2" fill="none" stroke="#fff" stroke-opacity="1" stroke-width="9" stroke-linecap="round"/></svg>`],
    ['Apple Music','https://music.apple.com/us/artist/lil-synn/1850720041',`<svg viewBox="0 0 100 100" aria-hidden="true"><path fill="#FF1493" fill-opacity="1" d="M58 20c5-6 6-12 6-16-7 1-13 4-18 9-4 5-6 10-5 16 7 1 13-3 17-9ZM75 50c0-10 7-17 13-20-5-8-14-10-20-10-8 0-15 5-19 5-5 0-11-5-18-5-9 0-17 5-22 13-10 15-3 39 7 52 5 6 11 13 18 12 7 0 10-4 18-4s11 4 18 4c8 0 13-7 18-13 5-7 7-14 7-14-1 0-20-7-20-20Z"/></svg>`],
    ['Instagram','https://www.instagram.com/lilsynnofficial/',`<svg viewBox="0 0 100 100" aria-hidden="true"><rect x="5" y="5" width="90" height="90" rx="25" fill="#FF1493" fill-opacity="1"/><rect x="25" y="25" width="50" height="50" rx="15" fill="none" stroke="#fff" stroke-opacity="1" stroke-width="9"/><circle cx="50" cy="50" r="11" fill="none" stroke="#fff" stroke-opacity="1" stroke-width="9"/><circle cx="69" cy="31" r="5.5" fill="#fff" fill-opacity="1"/></svg>`],
    ['X','https://x.com/lilsynnofficial',`<svg viewBox="0 0 100 100" aria-hidden="true"><path fill="#FF1493" fill-opacity="1" d="M8 9h25l17 24L71 9h20L61 45l31 46H67L47 62 23 91H4l35-41L8 9Zm24 8h-9l43 65h10L32 17Z"/></svg>`],
    ['SoundCloud','https://soundcloud.com/lilsynnofficial',`<svg viewBox="0 0 100 100" aria-hidden="true"><path fill="#FF1493" fill-opacity="1" d="M7 61h7v22H7V61Zm10-12h7v34h-7V49Zm10-10h7v44h-7V39Zm10-7h7v51h-7V32Zm10-5h7v56h-7V27Zm10 0c4-3 9-5 14-5 17 0 31 14 31 31S85 84 68 84H57V27ZM7 77h7v6H7v-6Zm10-2h7v8h-7v-8Zm10-2h7v10h-7V73Zm10-2h7v12h-7V71Zm10-1h7v14h-7V70Z"/></svg>`],
    ['TikTok','https://www.tiktok.com/@lilsynnofficial',`<svg viewBox="0 0 100 100" aria-hidden="true"><path fill="#FF1493" fill-opacity="1" d="M57 7h18c1 10 7 17 18 20v17c-7 0-13-2-18-5v28c0 19-13 30-30 30-16 0-28-11-28-27 0-17 13-28 29-28 3 0 7 1 10 2v17c-3-2-6-3-10-3-7 0-12 5-12 12s5 12 12 12c7 0 13-5 13-15V7Z"/></svg>`],
    ['Facebook','https://www.facebook.com/lilsynnofficial',`<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="47" fill="#FF1493" fill-opacity="1"/><path fill="#fff" fill-opacity="1" d="M57 87V57h11l2-13H57v-8c0-5 3-7 8-7h6V18c-3-1-7-1-11-1-11 0-18 7-18 19v8H30v13h12v30h15Z"/></svg>`]
  ];
  const mainGrid = document.getElementById('main-social-grid');
  if (mainGrid) mainGrid.innerHTML = socials.map(([name, href, svg]) => `<a href="${href}" target="_blank" rel="noopener noreferrer" class="social-icon-button" aria-label="${name}"><span class="social-icon-svg" aria-hidden="true">${svg}</span></a>`).join('');

  function forceContactTextOpaque() {
    const contact = document.getElementById('contact');
    if (!contact) return;
    const solid = (el, color) => {
      if (!el) return;
      el.style.setProperty('opacity', '1', 'important');
      el.style.setProperty('visibility', 'visible', 'important');
      el.style.setProperty('filter', 'none', 'important');
      el.style.setProperty('-webkit-filter', 'none', 'important');
      el.style.setProperty('mix-blend-mode', 'normal', 'important');
      el.style.setProperty('text-shadow', 'none', 'important');
      el.style.setProperty('color', color, 'important');
      el.style.setProperty('-webkit-text-fill-color', color, 'important');
    };
    let node = contact;
    while (node && node !== document.body) {
      node.style.setProperty('opacity', '1', 'important');
      node.style.setProperty('filter', 'none', 'important');
      node.style.setProperty('-webkit-filter', 'none', 'important');
      node.style.setProperty('mix-blend-mode', 'normal', 'important');
      node = node.parentElement;
    }
    contact.querySelectorAll('*').forEach(el => {
      el.style.setProperty('opacity', '1', 'important');
      el.style.setProperty('visibility', 'visible', 'important');
      el.style.setProperty('filter', 'none', 'important');
      el.style.setProperty('-webkit-filter', 'none', 'important');
      el.style.setProperty('mix-blend-mode', 'normal', 'important');
    });
    contact.querySelectorAll('p').forEach(p => {
      const text = p.textContent.trim();
      if (text === 'STAY CONNECTED') solid(p, '#ff4fd8');
      else if (text === 'BOOKING / BUSINESS / PRESS') solid(p, '#ffffff');
      else if (text === '© 2026 LIL SYNN') solid(p, '#ffffff');
      else solid(p, '#ffffff');
    });
    contact.querySelectorAll('h3').forEach(h => solid(h, '#ff008f'));
    contact.querySelectorAll('a').forEach(a => {
      const text = a.textContent.trim();
      if (text === 'SYNOVAMEDIA@GMAIL.COM') solid(a, '#ff4fd8');
      else if (!a.closest('#main-social-grid')) solid(a, '#ff4fd8');
    });
  }

  forceContactTextOpaque();
  const contact = document.getElementById('contact');
  if (contact) {
    const observer = new MutationObserver(() => forceContactTextOpaque());
    observer.observe(contact, { childList: true, subtree: true });
  }

  function escapeHtml(str){return String(str).replace(/[&<>\"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'})[m]);}
  ensureListenButton();
  loadMusic();
  loadVideos();
});