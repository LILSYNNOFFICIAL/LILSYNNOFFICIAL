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

  const navStyle = document.createElement("style");
  navStyle.textContent = `
    #sideMenu > nav { max-height: calc(100vh - 88px); overflow-y: auto; overflow-x: hidden; overscroll-behavior: contain; }
    .nav-library-group { width: 100%; min-width: 0; }
    .nav-library-group > button { padding: 0; text-align: left; }
    .nav-library-group > div { min-width: 0; }
    .nav-scroll-library { max-height: min(48vh, 390px); overflow-y: auto; overflow-x: hidden; overscroll-behavior: contain; padding-right: .65rem; scrollbar-width: auto; scrollbar-color: #ff008f #111; }
    .nav-scroll-library::-webkit-scrollbar { width: 9px; }
    .nav-scroll-library::-webkit-scrollbar-track { background: #111; border-radius: 8px; }
    .nav-scroll-library::-webkit-scrollbar-thumb { background: #ff008f; border-radius: 8px; border: 2px solid #111; }
    .nav-scroll-library::-webkit-scrollbar-thumb:hover { background: #ff4fd8; }
    @media (max-width: 640px) {
      #sideMenu { width: min(86vw, 360px); }
      #sideMenu > nav { max-height: calc(100vh - 82px); padding-bottom: 1.5rem; }
      .nav-scroll-library { max-height: 42vh; }
    }
  `;
  document.head.appendChild(navStyle);

  const legacyGroup = document.getElementById("socialsTrigger")?.parentElement;
  if (legacyGroup) {
    const streamLinks = [
      ["Spotify", "https://open.spotify.com/artist/6ozcOAnRAUPn3z5c0GR5kU"],
      ["Apple Music", "https://music.apple.com/us/artist/lil-synn/1850720041"],
      ["iTunes", "https://music.apple.com/us/artist/lil-synn/1850720041"],
      ["Amazon Music", "https://music.amazon.com/artists/B0FZB8RWV8/lil-synn"],
      ["TIDAL", "https://tidal.com/search?q=LIL%20SYNN"],
      ["SoundCloud", "https://soundcloud.com/lilsynnofficial"],
      ["Deezer", "https://www.deezer.com/search/LIL%20SYNN"],
      ["YouTube Music", "https://music.youtube.com/search?q=LIL%20SYNN"],
      ["Pandora", "https://www.pandora.com/search/lil%20synn"],
      ["iHeartRadio", "https://www.iheart.com/search/?q=LIL%20SYNN"],
      ["Qobuz", "https://www.qobuz.com/us-en/search?q=LIL%20SYNN"],
      ["JioSaavn", "https://www.jiosaavn.com/search/LIL%20SYNN"],
      ["Boomplay", "https://www.boomplay.com/search/default-artist?searchTerm=LIL%20SYNN"],
      ["Anghami", "https://play.anghami.com/search?query=LIL%20SYNN"],
      ["NetEase Cloud Music", "https://music.163.com/#/search/m/?s=LIL%20SYNN&type=100"],
      ["Tencent Music", "https://y.qq.com/n/ryqq/search?w=LIL%20SYNN&remoteplace=search"],
      ["Claro Música", "https://www.claromusica.com/search/LIL%20SYNN"],
      ["JOOX", "https://www.joox.com/search?q=LIL%20SYNN"],
      ["FLO", "https://www.music-flo.com/search?keyword=LIL%20SYNN"]
    ];
    const socialLinks = [
      ["YouTube", "https://www.youtube.com/@LILSYNNOFFICIAL"],
      ["Instagram", "https://www.instagram.com/lilsynnofficial/"],
      ["TikTok", "https://www.tiktok.com/@lilsynnofficial"],
      ["Facebook", "https://www.facebook.com/lilsynnofficial"],
      ["X / Twitter", "https://x.com/lilsynnofficial"],
      ["Discord", "https://discord.gg/ZUVsHuCAv"],
      ["GitHub", "https://github.com/orgs/Neurosyn-Dev/repositories"]
    ];
    const makeGroup = (id, label, links, scrollable = false) => {
      const group = document.createElement("div");
      group.className = "nav-library-group";
      const button = document.createElement("button");
      button.type = "button";
      button.className = "menu-link flex justify-between w-full shrink-0";
      button.setAttribute("aria-expanded", "false");
      button.setAttribute("aria-controls", id);
      button.innerHTML = `${label} <span aria-hidden="true">▼</span>`;
      const list = document.createElement("div");
      list.id = id;
      list.className = `hidden flex flex-col gap-3 mt-4 pl-4 text-base font-['Rajdhani']${scrollable ? " nav-scroll-library" : ""}`;
      links.forEach(([name, href]) => {
        const a = document.createElement("a");
        a.href = href;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.className = "menu-link";
        a.textContent = name;
        list.appendChild(a);
      });
      button.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();
        const open = list.classList.contains("hidden");
        list.classList.toggle("hidden", !open);
        button.setAttribute("aria-expanded", String(open));
        const arrow = button.querySelector("span");
        if (arrow) arrow.textContent = open ? "▲" : "▼";
      });
      group.append(button, list);
      return group;
    };
    const streamGroup = makeGroup("streamDropdown", "Stream", streamLinks, true);
    const socialsGroup = makeGroup("socialsDropdown", "Socials", socialLinks, false);
    legacyGroup.replaceChildren(streamGroup);
    const videosLink = Array.from(menu.querySelectorAll("a")).find(link => link.textContent.trim().toLowerCase() === "videos");
    if (videosLink) videosLink.after(socialsGroup);
    else legacyGroup.after(socialsGroup);
  }

  const bgVideo = document.getElementById("bgVideo");
  if (bgVideo) { bgVideo.muted = true; bgVideo.setAttribute("playsinline", ""); const p = bgVideo.play(); if (p?.catch) p.catch(() => {}); }
  const release = document.getElementById('presave');
  if (release) {
    const title = document.getElementById('latest-release-title'); if (title) title.textContent = 'RESCUE YOU (ACOUSTIC VERSION)';
    const art = release.querySelector('#latest-release-art img'); if (art) { art.src = 'assets/images/icons/album_art/RESCUE_YOU_A.png'; art.alt = 'LIL SYNN — Rescue You (Acoustic Version) artwork'; }
    const spotify = release.querySelector('a[href*="open.spotify.com"]'); if (spotify) { spotify.href = 'https://open.spotify.com/track/4btTfkMu5yHTsB6CTq1AcF'; spotify.textContent = 'SPOTIFY'; }
    const apple = release.querySelector('#latest-apple'); if (apple) { apple.href = 'https://music.apple.com/us/song/rescue-you-acoustic-version/6807294984'; apple.textContent = 'APPLE'; }
    const listen = release.querySelector('a.cta-primary'); if (listen) { listen.href = 'https://music.apple.com/us/song/rescue-you-acoustic-version/6807294984'; listen.textContent = 'APPLE'; }
    const presave = document.getElementById('presave-link'); if (presave) presave.remove();
  }
  const videoGrid = document.getElementById('youtube-grid');
  if (videoGrid) {
    const videos = [['Rescue You (Acoustic Version)','Glh5acZNiFM'],['Somewhere In-Between','q_EENWIxiUA'],['Black Glass','vebiWy-RL4Y'],['Static On My Tongue','JRJswRmhbmA'],["It's In Her Eyes",'NMFONDfJoi8'],['Fade Into You','tfVl30iEMkg'],['Heal','_1w0aG-lj8U'],['Hindsight','HX5EZCPsAxI'],['Back From The Blackout','WejkZ945Jt8']];
    videoGrid.innerHTML = videos.map(([title,id]) => `<article class="glass rounded-3xl overflow-hidden border border-[#ff008f]/30 hover:border-[#ff4fd8]"><div class="relative youtube-card" data-video-id="${id}" data-video-title="${title}" style="aspect-ratio:16/9;background:#000;overflow:hidden"><img src="https://i.ytimg.com/vi/${id}/hqdefault.jpg" alt="${title}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover" loading="lazy" decoding="async"><button type="button" class="youtube-play-overlay" aria-label="Play ${title}" style="position:absolute;inset:0;width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:transparent;border:0;cursor:pointer"><span style="display:flex;align-items:center;justify-content:center;width:72px;height:72px;border-radius:999px;background:rgba(255,0,143,.94);box-shadow:0 0 28px rgba(255,0,143,.55);color:#fff;font-size:30px;padding-left:5px">▶</span></button></div><div class="p-4 text-sm font-['Rajdhani'] text-center">${title}</div></article>`).join('');
    videoGrid.querySelectorAll('.youtube-card').forEach(card => card.querySelector('.youtube-play-overlay')?.addEventListener('click', () => { const id=card.dataset.videoId,title=card.dataset.videoTitle,iframe=document.createElement('iframe'); iframe.title=`LIL SYNN — ${title}`; iframe.src=`https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&playsinline=1&rel=0&modestbranding=1`; iframe.allow='accelerometer; autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture; web-share'; iframe.allowFullscreen=true; iframe.referrerPolicy='strict-origin-when-cross-origin'; iframe.style.cssText='position:absolute;inset:0;width:100%;height:100%;border:0;display:block;background:#000'; card.innerHTML=''; card.appendChild(iframe); }));
  }
});