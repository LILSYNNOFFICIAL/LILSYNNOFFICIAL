document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("music-grid");
  const latestTitle = document.getElementById("latest-release-title");
  const releaseSection = document.getElementById("presave");

  if (releaseSection) {
    const keepOneListenButton = () => {
      const buttons = [...releaseSection.querySelectorAll("[data-listen-cta], .cta-primary")];
      buttons.slice(1).forEach(button => button.remove());
      if (buttons[0]) buttons[0].setAttribute("data-listen-cta", "true");
    };
    keepOneListenButton();
    new MutationObserver(keepOneListenButton).observe(releaseSection, { childList: true, subtree: true });

    if (latestTitle) {
      const lockLatestRelease = () => {
        if (latestTitle.textContent.trim() !== "HELLO GOODBYE") latestTitle.textContent = "HELLO GOODBYE";
      };
      lockLatestRelease();
      new MutationObserver(lockLatestRelease).observe(latestTitle, { childList: true, characterData: true, subtree: true });
    }
  }

  if (!grid) return;

  const escapeHtml = value => String(value).replace(/[&<>\"']/g, ch => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;"
  })[ch]);

  const shuffle = items => {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  const renderRandomSongs = async () => {
    try {
      const response = await fetch("https://itunes.apple.com/lookup?id=1850720041&entity=song&limit=200", { cache: "no-store" });
      if (!response.ok) throw new Error("Song catalog request failed");
      const data = await response.json();
      const songs = (data.results || [])
        .filter(item => item.wrapperType === "track" && item.kind === "song" && item.artistName === "LIL SYNN" && item.trackName)
        .filter((item, index, arr) => arr.findIndex(x => x.trackId === item.trackId) === index);
      if (!songs.length) throw new Error("No LIL SYNN songs found");

      const selected = shuffle(songs).slice(0, Math.min(8, songs.length));
      grid.innerHTML = selected.map(song => {
        const title = escapeHtml(song.trackName);
        const release = escapeHtml(song.collectionName || "LIL SYNN");
        const artwork = (song.artworkUrl100 || "").replace("100x100bb", "600x600bb");
        const date = song.releaseDate ? new Date(song.releaseDate).getFullYear() : "2026";
        const apple = song.trackViewUrl || song.collectionViewUrl || "https://music.apple.com/us/artist/lil-synn/1850720041";
        const spotify = `https://open.spotify.com/search/${encodeURIComponent(`LIL SYNN ${song.trackName}`)}`;
        const youtube = `https://www.youtube.com/results?search_query=${encodeURIComponent(`LIL SYNN ${song.trackName}`)}`;
        return `<article class="music-card"><a href="${apple}" target="_blank" rel="noopener noreferrer" aria-label="Open ${title} on Apple Music">${artwork ? `<img src="${artwork}" alt="${title} — LIL SYNN artwork" loading="lazy" decoding="async">` : `<div class="music-placeholder">LIL SYNN</div>`}</a><div class="music-card-body"><h3 class="music-card-title">${title}</h3><p class="music-card-meta">${release} · ${date}</p><div class="music-card-links"><a href="${spotify}" target="_blank" rel="noopener noreferrer" aria-label="Play ${title} on Spotify">PLAY</a><a href="${spotify}" target="_blank" rel="noopener noreferrer" aria-label="Open ${title} on Spotify">SPOTIFY</a><a href="${youtube}" target="_blank" rel="noopener noreferrer" aria-label="Find ${title} on YouTube">YOUTUBE</a></div></div></article>`;
      }).join("");
    } catch (error) {
      console.warn("Random LIL SYNN song selection failed; keeping the existing catalog.", error);
    }
  };

  // Wait for the existing catalog loader to populate the grid, then replace it
  // with a fresh random selection. If the API fails, the existing catalog remains.
  const randomizeWhenReady = () => {
    if (!grid.querySelector(".music-card")) return;
    randomizeWhenReady.done = true;
    renderRandomSongs();
  };
  const observer = new MutationObserver(() => {
    if (randomizeWhenReady.done) return;
    randomizeWhenReady();
  });
  observer.observe(grid, { childList: true, subtree: true });
  randomizeWhenReady();

  const enhance = () => {
    grid.querySelectorAll(".music-card").forEach(card => {
      const links = card.querySelector(".music-card-links");
      if (!links || links.dataset.enhanced === "true") return;
      const title = card.querySelector(".music-card-title")?.textContent?.trim() || "LIL SYNN";
      const spotify = links.querySelector('a[href*="open.spotify.com"]')?.href || `https://open.spotify.com/search/${encodeURIComponent(`LIL SYNN ${title}`)}`;
      const youtube = `https://www.youtube.com/results?search_query=${encodeURIComponent(`LIL SYNN ${title}`)}`;
      links.innerHTML = `
        <a href="${spotify}" target="_blank" rel="noopener noreferrer" aria-label="Play ${escapeHtml(title)} on Spotify">PLAY</a>
        <a href="${spotify}" target="_blank" rel="noopener noreferrer" aria-label="Open ${escapeHtml(title)} on Spotify">SPOTIFY</a>
        <a href="${youtube}" target="_blank" rel="noopener noreferrer" aria-label="Find ${escapeHtml(title)} on YouTube">YOUTUBE</a>
      `;
      links.dataset.enhanced = "true";
    });
  };

  enhance();
  new MutationObserver(enhance).observe(grid, { childList: true, subtree: true });
});
