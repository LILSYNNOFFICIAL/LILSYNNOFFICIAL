// ================================
// MOBILE MENU TOGGLE
// ================================
const menuButton = document.getElementById("menu-button");
const mobileMenu = document.getElementById("mobile-menu");

if (menuButton && mobileMenu) {
  menuButton.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
  });
}

// ================================
// LOAD YOUTUBE VIDEOS (SECURE)
// ================================
async function loadYouTubeVideos() {
  try {

    const response = await fetch("/api/youtube");

    if (!response.ok) {
      throw new Error("Failed to fetch videos");
    }

    const data = await response.json();

    const grid = document.getElementById("youtube-grid");

    if (!grid) {
      console.error("youtube-grid element not found");
      return;
    }

    if (!data.items || data.items.length === 0) {
      grid.innerHTML = "<p>No videos found.</p>";
      return;
    }

    grid.innerHTML = data.items.map(video => {

      const videoId = video.id.videoId;
      const title = video.snippet.title;

      return `
        <div class="glass rounded-3xl overflow-hidden border border-[#ff008f]/30 hover:border-[#ff4fd8] transition">
          
          <iframe
            width="100%"
            height="220"
            src="https://www.youtube.com/embed/${videoId}"
            frameborder="0"
            allowfullscreen
          ></iframe>

          <div class="p-4 text-sm font-['Rajdhani'] text-center">
            ${title}
          </div>

        </div>
      `;

    }).join("");

  } catch (error) {

    console.error("YouTube load error:", error);

    const grid = document.getElementById("youtube-grid");
    if (grid) {
      grid.innerHTML = "<p>Unable to load videos.</p>";
    }

  }
}

// ================================
// INITIALIZE
// ================================
document.addEventListener("DOMContentLoaded", () => {
  loadYouTubeVideos();
});
