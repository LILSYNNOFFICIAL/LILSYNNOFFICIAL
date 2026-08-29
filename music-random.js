/* LIL SYNN — randomized Music section */
(() => {
  const ARTIST_ID = "1850720041";
  const APPLE_ARTIST = "https://music.apple.com/us/artist/lil-synn/1850720041";

  const escapeHtml = (value) => String(value ?? "").replace(/[&<>\'"]/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "\'": "&#39;", '"': "&quot;"
  }[c]));

  const shuffle = (items) => {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  async function renderRandomSongs(grid) {
    try {
      const res = await fetch(`https://itunes.apple.com/lookup?id=${ARTIST_ID}&entity=song&limit=200`, { cache: "no-store" });
      if (!res.ok) throw new Error("Apple Music song catalog request failed");
      const data = await res.json();
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
        const apple = song.trackViewUrl || song.collectionViewUrl || APPLE_ARTIST;
        const spotify = `https://open.spotify.com/search/${encodeURIComponent(`LIL SYNN ${song.trackName}`)}`;
        return `<article class="music-card"><a href="${apple}" target="_blank" rel="noopener noreferrer" aria-label="Open ${title} on Apple Music">${artwork ? `<img src="${artwork}" alt="${title} — LIL SYNN artwork" loading="lazy" decoding="async">` : `<div class="music-placeholder">LIL SYNN</div>`}</a><div class="music-card-body"><h3 class="music-card-title">${title}</h3><p class="music-card-meta">${release} · ${date}</p><div class="music-card-links"><a href="${apple}" target="_blank" rel="noopener noreferrer">APPLE</a><a href="${spotify}" target="_blank" rel="noopener noreferrer">SPOTIFY</a></div></div></article>`;
      }).join("");
    } catch (error) {
      console.warn("Random LIL SYNN music selection failed; leaving the existing Music section in place.", error);
    }
  }

  function init() {
    const grid = document.getElementById("music-grid");
    if (!grid) return;

    // script.js also populates this grid. Wait for that first render, then replace
    // it with a fresh randomized song selection. This preserves the existing site
    // behavior as a fallback if the song catalog is unavailable.
    const observer = new MutationObserver(() => {
      if (!grid.querySelector(".music-card")) return;
      observer.disconnect();
      renderRandomSongs(grid);
    });
    observer.observe(grid, { childList: true, subtree: true });

    // If the original catalog is already rendered before the observer attaches.
    if (grid.querySelector(".music-card")) {
      observer.disconnect();
      renderRandomSongs(grid);
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
