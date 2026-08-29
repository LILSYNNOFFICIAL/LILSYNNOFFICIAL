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
