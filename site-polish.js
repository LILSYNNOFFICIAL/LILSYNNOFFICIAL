(() => {
  const key = value => String(value ?? '').toLowerCase().normalize('NFKD').replace(/[’']/g, '').replace(/[^a-z0-9]/g, '');
  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[char]));
  const base = '/assets/images/icons/album_art/';
  const art = {
    neverknown: 'Never Known_album_cover.jpg',
    homeacousticversion: 'home_acoustic_version.png',
    ididitagain: 'I DID IT AGAIN.jpg',
    rescueyouacousticversion: 'RESCUE_YOU_A.png'
  };

  const renderLatest = async () => {
    const target = document.getElementById('presave');
    if (!target) return;
    try {
      const response = await fetch('/release-catalog.json', { cache: 'no-store' });
      if (!response.ok) throw new Error('release catalog unavailable');
      const catalog = await response.json();
      const titles = Array.isArray(catalog.order) ? catalog.order.slice(0, 3) : [];
      if (titles.length !== 3) throw new Error('catalog does not contain three latest releases');

      const spotify = catalog.trackSpotify || catalog.spotify || {};
      const apple = catalog.apple || {};
      target.innerHTML = `
        <div class="max-w-6xl mx-auto px-6 text-center">
          <p class="section-kicker">LATEST RELEASES</p>
          <h2 class="text-4xl md:text-5xl font-['Orbitron'] text-[#ff4fd8] mb-8">THE LATEST SIGNALS</h2>
          <div class="latest-release-list">
            ${titles.map((title, index) => {
              const k = key(title);
              const filename = art[k];
              const release = catalog.groups?.[title];
              const spotifyUrl = spotify[title] || release?.spotify || (release?.tracks || []).map(track => spotify[track]).find(Boolean) || '';
              const appleUrl = apple[title] || release?.apple || '';
              return `<article class="latest-release-card">
                <div class="latest-release-art">${filename ? `<img src="${base}${encodeURIComponent(filename)}" alt="LIL SYNN — ${esc(title)} artwork" loading="${index === 0 ? 'eager' : 'lazy'}" decoding="async">` : '<span>LIL SYNN</span>'}</div>
                <p class="latest-release-label">${index === 0 ? 'LATEST RELEASE' : 'RECENT RELEASE'}</p>
                <h3>${esc(title).toUpperCase()}</h3>
                <div class="latest-release-links">
                  ${spotifyUrl ? `<a href="${spotifyUrl}" target="_blank" rel="noopener noreferrer" class="cta-secondary">SPOTIFY</a>` : ''}
                  ${appleUrl ? `<a href="${appleUrl}" target="_blank" rel="noopener noreferrer" class="cta-secondary">APPLE MUSIC</a>` : ''}
                </div>
              </article>`;
            }).join('')}
          </div>
          <div class="mt-8 flex justify-center gap-3 flex-wrap"><a href="releases.html" class="cta-secondary">VIEW RELEASE ARCHIVE</a><a href="coming_soon.html" class="cta-secondary">COMING SOON</a></div>
        </div>`;

      const style = document.createElement('style');
      style.textContent = `
        .latest-release-list{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1.25rem;max-width:920px;margin:0 auto}
        .latest-release-card{min-width:0;text-align:center}
        .latest-release-art{aspect-ratio:1/1;background:#090909;border:1px solid rgba(255,0,143,.28);border-radius:1.25rem;overflow:hidden;display:grid;place-items:center;box-shadow:0 10px 28px rgba(0,0,0,.35)}
        .latest-release-art img{width:100%;height:100%;object-fit:cover;display:block}
        .latest-release-art span{color:#555;font:700 1rem Orbitron,sans-serif;letter-spacing:.1em}
        .latest-release-label{margin:.9rem 0 .35rem;color:#ff008f;font:700 .7rem Rajdhani,sans-serif;letter-spacing:.2em}
        .latest-release-card h3{margin:0;color:#fff;font:700 clamp(.9rem,1.6vw,1.15rem) Orbitron,sans-serif;line-height:1.25}
        .latest-release-links{display:flex;justify-content:center;gap:.5rem;flex-wrap:wrap;margin-top:.8rem}
        .latest-release-links .cta-secondary{min-height:36px;padding:.5rem .75rem;font-size:.75rem}
        @media(max-width:760px){.latest-release-list{grid-template-columns:repeat(2,minmax(0,1fr))}.latest-release-card:last-child{grid-column:1/-1;max-width:300px;width:100%;justify-self:center}}
        @media(max-width:480px){.latest-release-list{grid-template-columns:1fr}.latest-release-card:last-child{grid-column:auto}}
      `;
      document.head.appendChild(style);
    } catch (error) {
      console.warn('Latest release rendering unavailable', error);
    }
  };

  const renderVideos = async () => {
    const grid = document.getElementById('youtube-grid');
    if (!grid) return;
    try {
      const response = await fetch('/api/latest-youtube-releases?refresh=' + Date.now(), { cache: 'no-store' });
      if (!response.ok) throw new Error('YouTube feed unavailable');
      const data = await response.json();
      const videos = (data.videos || []).slice(0, 9);
      grid.innerHTML = videos.map(video => `<article class="glass rounded-3xl overflow-hidden border border-[#ff008f]/30"><div class="relative" style="aspect-ratio:16/9;background:#000;overflow:hidden"><img src="https://i.ytimg.com/vi/${encodeURIComponent(video.id)}/hqdefault.jpg" alt="${esc(video.title)}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover" loading="lazy" decoding="async"><a href="https://www.youtube.com/watch?v=${encodeURIComponent(video.id)}" target="_blank" rel="noopener noreferrer" aria-label="Watch ${esc(video.title)}" style="position:absolute;inset:0;display:grid;place-items:center;text-decoration:none"><span style="display:grid;place-items:center;width:68px;height:68px;border-radius:50%;background:#ff008f;color:#fff;font-size:28px">▶</span></a></div><div class="p-4 text-sm font-['Rajdhani'] text-center text-white">${esc(video.title)}</div></article>`).join('');
    } catch (error) {
      console.warn('Latest videos unavailable', error);
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { renderLatest(); renderVideos(); }, { once: true });
  } else {
    renderLatest();
    renderVideos();
  }
})();
