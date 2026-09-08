document.addEventListener("DOMContentLoaded", () => {
  const bgVideo = document.getElementById("bgVideo");
  if (bgVideo) {
    bgVideo.muted = true;
    bgVideo.setAttribute("playsinline", "");
    const play = bgVideo.play();
    if (play?.catch) play.catch(() => {});
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
});
