document.addEventListener("DOMContentLoaded", () => {
  console.log("%cLIL SYNN site loaded", "color:#ff008f;font-weight:bold");

  const ham = document.getElementById("hamburger");
  const menu = document.getElementById("sideMenu");
  const close = document.getElementById("closeMenu");
  if (ham && menu) ham.addEventListener("click", () => menu.classList.toggle("translate-x-full"));
  if (close && menu) close.addEventListener("click", () => menu.classList.add("translate-x-full"));

  const trigger = document.getElementById("socialsTrigger");
  const dropdown = document.getElementById("socialsDropdown");
  if (trigger && dropdown) {
    trigger.addEventListener("click", () => {
      dropdown.classList.toggle("hidden");
      const arrow = trigger.querySelector("span");
      if (arrow) arrow.textContent = dropdown.classList.contains("hidden") ? "▼" : "▲";
    });
  }

  async function loadVideos() {
    const grid = document.getElementById("youtube-grid");
    if (!grid) return;
    grid.innerHTML = '<p class="text-center text-gray-400">Loading videos…</p>';
    function renderItems(items) {
      grid.innerHTML = items.map(item => {
        const title = (item.snippet && item.snippet.title) || '';
        const vid = item.videoId || (item.id && (item.id.videoId || item.id)) || '';
        const thumb = vid ? `https://i.ytimg.com/vi/${vid}/hqdefault.jpg` : '';
        return `<div class="glass rounded-3xl overflow-hidden border border-[#ff008f]/30 hover:border-[#ff4fd8]"><div class="relative" style="position:relative;padding-top:56.25%;background:#000;">${thumb ? `<img src="${thumb}" alt="${escapeHtml(title)}" style="position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;cursor:pointer;" data-ytid="${vid}" class="yt-thumb">` : ''}<button class="yt-play" style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);background:rgba(0,0,0,0.6);border-radius:999px;border:2px solid #fff;padding:14px 18px;cursor:pointer;font-size:18px;color:#fff;">►</button></div><div class="p-4 text-sm font-['Rajdhani'] text-center">${escapeHtml(title)}</div></div>`;
      }).join('');
      grid.querySelectorAll('.yt-thumb').forEach(img => {
        const vid = img.getAttribute('data-ytid');
        const onClick = () => {
          const iframe = document.createElement('iframe');
          iframe.className = 'youtube-iframe';
          iframe.style.position='absolute'; iframe.style.top='0'; iframe.style.left='0'; iframe.style.width='100%'; iframe.style.height='100%';
          iframe.frameBorder='0'; iframe.allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
          iframe.allowFullscreen=true; iframe.src=`https://www.youtube.com/embed/${vid}?autoplay=1`;
          img.parentElement.innerHTML=''; img.parentElement.appendChild(iframe);
        };
        img.addEventListener('click', onClick);
        const btn=img.parentElement.querySelector('.yt-play'); if(btn) btn.addEventListener('click',onClick);
      });
    }
    try { const res=await fetch('/api/youtube'); if(res.ok){const data=await res.json(); if(data?.items?.length){renderItems(data.items);return;}} } catch(e){console.warn('YouTube fetch failed.');}
    try { const res=await fetch('/assets/youtube-fallback.json'); if(res.ok){const data=await res.json(); if(data?.items?.length){renderItems(data.items);return;}} } catch(e){console.warn('Fallback fetch failed.');}
    grid.innerHTML='<div class="text-center text-gray-400"><p>Videos are temporarily unavailable.</p><a href="https://www.youtube.com/@LILSYNNOFFICIAL" target="_blank" rel="noopener noreferrer" class="underline text-[#ff008f]">Visit the YouTube channel</a></div>';
  }
  loadVideos();

  // Fresh, standalone site assets. The SVG files themselves are the artwork; no filters or recoloring are applied.
  const ICON_VERSION = '20260828-v3';
  const socials = [
    ['YouTube','https://www.youtube.com/@LILSYNNOFFICIAL','youtube.svg'],
    ['Spotify','https://open.spotify.com/artist/6ozcOAnRAUPn3z5c0GR5kU','spotify.svg'],
    ['Apple Music','https://music.apple.com/us/artist/lil-synn/1850720041','apple-music.svg'],
    ['Instagram','https://www.instagram.com/lilsynnofficial/','instagram.svg'],
    ['X','https://x.com/lilsynnofficial','twitter.svg'],
    ['SoundCloud','https://soundcloud.com/lilsynnofficial','soundcloud.svg'],
    ['TikTok','https://www.tiktok.com/@lilsynnofficial','tiktok.svg'],
    ['Facebook','https://www.facebook.com/lilsynnofficial','facebook.svg']
  ];

  const mainGrid = document.getElementById('main-social-grid');
  if (mainGrid) {
    mainGrid.innerHTML = socials.map(([name, href, file]) => `
      <a href="${href}" target="_blank" rel="noopener noreferrer" class="social-icon-button" aria-label="${name}">
        <img class="social-icon-svg" src="assets/images/icons/${file}?v=${ICON_VERSION}" alt="${name}">
      </a>`).join('');
  }

  function escapeHtml(str){return String(str).replace(/[&<>\"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'})[m]);}
});