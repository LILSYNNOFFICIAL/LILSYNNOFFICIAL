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

  const PINK = '#FF1493';
  const socialIcons = `
    <a href="https://www.youtube.com/@LILSYNNOFFICIAL" target="_blank" rel="noopener noreferrer" class="social-icon-button" aria-label="YouTube"><svg class="social-icon-svg" viewBox="0 0 100 100" aria-hidden="true"><path fill="${PINK}" d="M88 17H12C5.37 17 0 22.37 0 29v42c0 6.63 5.37 12 12 12h76c6.63 0 12-5.37 12-12V29c0-6.63-5.37-12-12-12ZM36 70V30l37 20-37 20Z"/></svg></a>
    <a href="https://open.spotify.com/artist/6ozcOAnRAUPn3z5c0GR5kU" target="_blank" rel="noopener noreferrer" class="social-icon-button" aria-label="Spotify"><svg class="social-icon-svg" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="48" fill="${PINK}"/><path d="M23 39c17-6 40-5 57 3M27 51c15-5 34-4 48 3M31 63c12-4 27-3 38 2" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round"/></svg></a>
    <a href="https://music.apple.com/us/artist/lil-synn/1850720041" target="_blank" rel="noopener noreferrer" class="social-icon-button" aria-label="Apple Music"><svg class="social-icon-svg" viewBox="0 0 100 100" aria-hidden="true"><path fill="${PINK}" d="M58 21c6-7 6-13 6-17-7 1-14 5-18 10-4 4-7 10-6 16 7 1 14-3 18-9Zm17 29c0-11 9-17 13-20-6-9-16-10-20-10-9-1-17 5-21 5-5 0-11-5-18-5-9 0-18 5-23 13-10 16-3 40 7 53 5 6 11 13 18 12 7 0 10-4 18-4s11 4 18 4c8 0 13-7 18-13 6-7 8-14 8-14-1 0-18-7-18-21Z"/></svg></a>
    <a href="https://www.instagram.com/lilsynnofficial/" target="_blank" rel="noopener noreferrer" class="social-icon-button" aria-label="Instagram"><svg class="social-icon-svg" viewBox="0 0 100 100" aria-hidden="true"><rect x="6" y="6" width="88" height="88" rx="24" fill="${PINK}"/><rect x="25" y="25" width="50" height="50" rx="15" fill="none" stroke="#fff" stroke-width="8"/><circle cx="50" cy="50" r="12" fill="none" stroke="#fff" stroke-width="8"/><circle cx="69" cy="31" r="5" fill="#fff"/></svg></a>
    <a href="https://x.com/lilsynnofficial" target="_blank" rel="noopener noreferrer" class="social-icon-button" aria-label="X"><svg class="social-icon-svg" viewBox="0 0 100 100" aria-hidden="true"><path fill="${PINK}" d="M12 10h22l18 25 21-25h15L60 46l28 44H66L47 61 23 90H8l32-38L12 10Zm19 8h-5l42 64h6L31 18Z"/></svg></a>
    <a href="https://soundcloud.com/lilsynnofficial" target="_blank" rel="noopener noreferrer" class="social-icon-button" aria-label="SoundCloud"><svg class="social-icon-svg" viewBox="0 0 100 100" aria-hidden="true"><path fill="${PINK}" d="M8 63h5v18H8V63Zm9-10h5v28h-5V53Zm9-9h5v37h-5V44Zm9-6h5v43h-5V38Zm9-5h5v48h-5V33Zm9 0c4-3 9-5 14-5 16 0 29 13 29 29 0 16-13 29-29 29H53V33ZM8 75h5v6H8v-6Zm9-1h5v7h-5v-7Zm9-2h5v9h-5v-9Zm9-1h5v10h-5V71Zm9-1h5v11h-5V70Z"/></svg></a>
    <a href="https://www.tiktok.com/@lilsynnofficial" target="_blank" rel="noopener noreferrer" class="social-icon-button" aria-label="TikTok"><svg class="social-icon-svg" viewBox="0 0 100 100" aria-hidden="true"><path fill="${PINK}" d="M58 8h16c1 10 6 17 17 19v16c-7 0-13-2-18-5v28c0 18-12 29-29 29-15 0-26-11-26-26 0-16 12-27 28-27 3 0 6 1 9 2v16c-3-2-6-3-9-3-7 0-12 5-12 12 0 7 5 11 11 11 7 0 13-4 13-14V8Z"/></svg></a>
    <a href="https://www.facebook.com/lilsynnofficial" target="_blank" rel="noopener noreferrer" class="social-icon-button" aria-label="Facebook"><svg class="social-icon-svg" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="47" fill="${PINK}"/><path fill="#fff" d="M56 86V56h10l2-12H56v-8c0-4 2-7 8-7h5V18c-3 0-7-1-11-1-11 0-18 7-18 19v8H30v12h10v30h16Z"/></svg></a>`;

  const mainGrid = document.getElementById("main-social-grid");
  if (mainGrid) mainGrid.innerHTML = socialIcons;

  function escapeHtml(str){return String(str).replace(/[&<>\"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'})[m]);}
});
