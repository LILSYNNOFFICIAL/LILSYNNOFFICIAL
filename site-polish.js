document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("music-grid");
  if (!grid) return;

  const enhance = () => {
    grid.querySelectorAll(".music-card").forEach(card => {
      const links = card.querySelector(".music-card-links");
      if (!links || links.dataset.enhanced === "true") return;

      const title = card.querySelector(".music-card-title")?.textContent?.trim() || "LIL SYNN";
      const apple = links.querySelector('a[href*="music.apple.com"]')?.href || "https://music.apple.com/us/artist/lil-synn/1850720041";
      const spotify = links.querySelector('a[href*="open.spotify.com"]')?.href || `https://open.spotify.com/search/${encodeURIComponent(`LIL SYNN ${title}`)}`;
      const youtube = `https://www.youtube.com/results?search_query=${encodeURIComponent(`LIL SYNN ${title}`)}`;

      links.innerHTML = `
        <a href="${spotify}" target="_blank" rel="noopener noreferrer" aria-label="Play ${escapeHtml(title)} on Spotify">PLAY</a>
        <a href="${spotify}" target="_blank" rel="noopener noreferrer" aria-label="Open ${escapeHtml(title)} on Spotify">SPOTIFY</a>
        <a href="${youtube}" target="_blank" rel="noopener noreferrer" aria-label="Find ${escapeHtml(title)} on YouTube">YOUTUBE</a>
      `;
      links.dataset.enhanced = "true";

      const imageLink = card.querySelector("a:first-child");
      if (imageLink) imageLink.setAttribute("aria-label", `Open ${title} on Apple Music`);
      if (apple && !card.querySelector("[data-apple-release]")) {
        const appleLink = document.createElement("a");
        appleLink.href = apple;
        appleLink.target = "_blank";
        appleLink.rel = "noopener noreferrer";
        appleLink.dataset.appleRelease = "true";
        appleLink.className = "sr-only";
        appleLink.textContent = `Apple Music: ${title}`;
        card.appendChild(appleLink);
      }
    });
  };

  const escapeHtml = value => String(value).replace(/[&<>\"']/g, ch => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;"
  })[ch]);

  enhance();
  new MutationObserver(enhance).observe(grid, { childList: true, subtree: true });
});
