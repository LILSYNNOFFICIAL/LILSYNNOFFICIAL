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
    .nav-library-group { width: 100%; min-width: 0; flex: 0 0 auto !important; min-height: 0 !important; display: block !important; }
    .nav-library-group > button { padding: 0; text-align: left; }
    .nav-library-group > div { min-width: 0; }
    #sideMenu > nav > .nav-library-group:has(#socialsDropdown) { flex: 0 0 auto !important; min-height: 0 !important; display: block !important; }
    #sideMenu #socialsDropdown { flex: none !important; max-height: none !important; overflow: visible; padding-bottom: 0; }
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
      ["YouTube", "https://www.youtube.com/@LILSYNNOFFICIAL"],
      ["iTunes", "https://music.apple.com/us/artist/lil-synn/1850720041"],
      ["YouTube Music", "https://music.youtube.com/@LILSYNNOFFICIAL"],
      ["TIDAL", "https://tidal.com/artist/69300200"],
      ["Amazon Music", "https://music.amazon.com/artists/B0FZB8RWV8/lil-synn"],
      ["iHeart", "https://www.iheart.com/artist/lil-synn-48522401"],
      ["Pandora", "https://www.pandora.com/artist/lil-synn/ARZwprX4ZVXjVKc"],
      ["Qobuz", "https://www.qobuz.com/us-en/interpreter/lil-synn/29242938"]
    ];
    const socialLinks = [
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
      button.textContent = label;
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
      });
      group.append(button, list);
      return group;
    };
    const streamGroup = makeGroup("streamDropdown", "Stream", streamLinks, true);
    const socialsGroup = makeGroup("socialsDropdown", "Socials", socialLinks, false);
    legacyGroup.replaceChildren(streamGroup);
    const videosLink = Array.from(menu.querySelectorAll("a")).find(link => link.textContent.trim().toLowerCase() === "videos");
    if (videosLink) videosLink.after(socialsGroup, streamGroup);
    else legacyGroup.after(socialsGroup, streamGroup);
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

  const rhythmStyle = document.createElement("style");
  rhythmStyle.id = "homepage-rhythm-final";
  rhythmStyle.textContent = `
    #home, #contact { background: rgba(128,128,128,.18) !important; }
    #presave, #music, #videos, #about, #merch, #signal { background: rgba(8,8,8,.62) !important; border-top:0 !important; border-bottom:0 !important; box-shadow:none !important; outline:0 !important; }
    #presave::before,#presave::after,#music::before,#music::after,#videos::before,#videos::after,#about::before,#about::after,#merch::before,#merch::after,#signal::before,#signal::after { border:0 !important; box-shadow:none !important; background:transparent !important; }
    #presave + #music,#music + #videos,#videos + #about,#about + #merch,#merch + #signal { border-top:0 !important; }
  `;
  document.head.appendChild(rhythmStyle);

  const darkBandStyle = document.createElement("style");
  darkBandStyle.id = "homepage-dark-band-final";
  darkBandStyle.textContent = `
    #presave,#music,#videos,#about,#merch,#signal { background:rgba(8,8,8,.62) !important; border-top:0 !important; border-bottom:0 !important; box-shadow:none !important; outline:0 !important; }
  `;
  document.head.appendChild(darkBandStyle);
});

/* Approved homepage visual system: translucent HUD-style headers + local random-song refresh. */
document.addEventListener("DOMContentLoaded", () => {
  const style = document.createElement("style");
  style.id = "lil-synn-hud-headers";
  style.textContent = `
    .hud-section-heading {
      position:relative;
      margin:0 auto 2.25rem;
      width:min(100%, 860px);
      padding:1.15rem 1.35rem 1.25rem;
      border:1px solid rgba(255,0,143,.22);
      border-radius:1.35rem;
      background:linear-gradient(135deg,rgba(255,255,255,.055),rgba(255,0,143,.035) 48%,rgba(0,0,0,.34));
      box-shadow:0 14px 45px rgba(0,0,0,.2), inset 0 1px 0 rgba(255,255,255,.035);
      backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);
      overflow:hidden;
    }
    .hud-section-heading::before {
      content:"";position:absolute;left:18%;right:18%;top:0;height:1px;
      background:linear-gradient(90deg,transparent,rgba(255,0,143,.6),transparent);
      opacity:.65;
    }
    .hud-section-heading .section-kicker { margin-bottom:.35rem; }
    .hud-section-heading h2,.hud-section-heading h3 { margin-top:0; }
    .hud-section-heading .section-subtitle { margin-top:.55rem; }
    .hud-release-heading {
      width:min(100%,900px);margin:0 auto 1.5rem;padding:1rem 1.25rem;border-radius:1.35rem;
      border:1px solid rgba(255,0,143,.22);background:linear-gradient(135deg,rgba(255,255,255,.055),rgba(0,0,0,.3));
      box-shadow:0 14px 45px rgba(0,0,0,.18),inset 0 1px 0 rgba(255,255,255,.03);
      backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);
    }
    .hud-release-heading .section-kicker { margin-bottom:.35rem; }
    .discover-panel {
      position:relative;margin:0 auto 2rem;width:min(100%,860px);padding:1.25rem 1.35rem 1.35rem;text-align:center;
      border:1px solid rgba(255,0,143,.25);border-radius:1.45rem;
      background:linear-gradient(135deg,rgba(255,255,255,.06),rgba(255,0,143,.045),rgba(0,0,0,.38));
      box-shadow:0 18px 55px rgba(0,0,0,.24),inset 0 1px 0 rgba(255,255,255,.035);
      backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);overflow:hidden;
    }
    .discover-panel::before { content:"";position:absolute;top:0;left:25%;right:25%;height:1px;background:rgba(255,0,143,.7);box-shadow:0 0 18px rgba(255,0,143,.35); }
    .discover-panel-kicker { font:700 .72rem Orbitron,sans-serif;letter-spacing:.25em;color:#ff008f;text-transform:uppercase; }
    .discover-panel h3 { margin:.45rem 0 .35rem;font:700 clamp(1.25rem,3vw,2rem) Orbitron,sans-serif;letter-spacing:.08em;color:#fff; }
    .discover-panel p { margin:0;color:#aaa;font:400 1.08rem Rajdhani,sans-serif;letter-spacing:.025em; }
    .random-song-refresh { display:inline-flex;align-items:center;justify-content:center;margin-top:1rem;padding:.78rem 1.3rem;border:1px solid rgba(255,0,143,.5);border-radius:.8rem;background:#ff008f;color:#050505;font:700 .82rem Orbitron,sans-serif;letter-spacing:.07em;cursor:pointer;transition:transform .2s ease,background-color .2s ease,box-shadow .2s ease; }
    .random-song-refresh:hover,.random-song-refresh:focus-visible { background:#ff4fd8;transform:translateY(-2px);box-shadow:0 8px 24px rgba(255,0,143,.2); }
    .random-song-refresh[aria-busy="true"] { opacity:.7;cursor:wait;transform:none; }
    @media(max-width:640px){
      .hud-section-heading,.hud-release-heading,.discover-panel{padding:1rem .9rem;border-radius:1.1rem;}
      .discover-panel p{font-size:1rem;}
      .random-song-refresh{width:100%;max-width:320px;}
    }
  `;
  document.head.appendChild(style);

  const wrapHeading = (selector, target = null, className = "hud-section-heading") => {
    const heading = document.querySelector(selector);
    if (!heading || heading.closest(`.${className}`)) return null;
    const wrapper = document.createElement("div");
    wrapper.className = className;
    heading.parentNode.insertBefore(wrapper, heading);
    wrapper.appendChild(heading);
    if (target) {
      const extra = document.querySelector(target);
      if (extra && extra !== heading && !wrapper.contains(extra)) wrapper.appendChild(extra);
    }
    return wrapper;
  };

  const presave = document.getElementById("presave");
  if (presave) {
    const inner = presave.querySelector(":scope > div");
    const kicker = inner?.querySelector(":scope > .section-kicker");
    const h2 = inner?.querySelector(":scope > h2");
    const sub = inner?.querySelector(":scope > p.font-\\['Rajdhani'\\]");
    if (kicker && h2 && !inner.querySelector(".hud-release-heading")) {
      const panel = document.createElement("div");
      panel.className = "hud-release-heading";
      panel.append(kicker, h2);
      if (sub) panel.append(sub);
      inner.insertBefore(panel, inner.firstChild);
    }
  }

  wrapHeading("#music .section-heading");
  wrapHeading("#videos .section-heading");

  ["#about", "#merch", "#signal", "#contact"].forEach(sectionSelector => {
    const section = document.querySelector(sectionSelector);
    if (!section) return;
    const container = section.querySelector(":scope > div");
    if (!container || container.querySelector(":scope > .hud-section-heading")) return;
    const kicker = container.querySelector(":scope > .section-kicker");
    const heading = container.querySelector(":scope > h2");
    if (!kicker || !heading) return;
    const panel = document.createElement("div");
    panel.className = "hud-section-heading";
    panel.append(kicker, heading);
    const subtitle = Array.from(container.children).find(el => el.classList?.contains("section-subtitle"));
    if (subtitle) panel.append(subtitle);
    container.insertBefore(panel, container.firstChild);
  });

  const music = document.getElementById("music");
  const grid = document.getElementById("music-grid");
  if (music && grid && !document.getElementById("discover-lil-synn")) {
    const panel = document.createElement("div");
    panel.id = "discover-lil-synn";
    panel.className = "discover-panel";
    panel.innerHTML = `<div class="discover-panel-kicker">THE SIGNAL</div><h3>DISCOVER LIL SYNN</h3><p>Let the signal choose. Explore the catalog and discover a track at random.</p><button type="button" class="random-song-refresh" id="random-song-refresh" aria-label="Refresh random songs">RANDOM SONG REFRESH</button>`;
    grid.parentNode.insertBefore(panel, grid);
    const button = panel.querySelector("#random-song-refresh");
    button.addEventListener("click", () => {
      if (typeof window.lilSynnRefreshMusic !== "function") return;
      button.setAttribute("aria-busy", "true");
      button.disabled = true;
      window.lilSynnRefreshMusic();
      setTimeout(() => { button.removeAttribute("aria-busy"); button.disabled = false; }, 350);
    });
  }

  const spotify = document.querySelector("#music .spotify-player");
  if (spotify && !spotify.querySelector(".hud-section-heading")) {
    const header = spotify.querySelector(":scope > div.text-center");
    if (header) {
      const panel = document.createElement("div");
      panel.className = "hud-section-heading";
      while (header.firstChild) panel.appendChild(header.firstChild);
      header.replaceWith(panel);
    }
  }

  const latestKicker = document.querySelector("#presave .hud-release-heading .section-kicker");
  if (latestKicker) latestKicker.textContent = "LATEST RELEASES";
});
