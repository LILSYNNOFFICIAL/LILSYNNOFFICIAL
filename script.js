document.addEventListener('DOMContentLoaded', () => {
    console.log('%c✅ LIL SYNN site loaded — YouTube proxy active', 'color:#ff008f; font-weight:bold');

    // HAMBURGER MENU
    const ham = document.getElementById('hamburger');
    const menu = document.getElementById('sideMenu');
    const close = document.getElementById('closeMenu');
    ham.addEventListener('click', () => menu.classList.toggle('translate-x-full'));
    close.addEventListener('click', () => menu.classList.add('translate-x-full'));

    // SOCIALS DROPDOWN
    const trigger = document.getElementById('socialsTrigger');
    const dropdown = document.getElementById('socialsDropdown');
    if (trigger && dropdown) {
        trigger.addEventListener('click', () => {
            dropdown.classList.toggle('hidden');
            const arrow = trigger.querySelector('span');
            if (arrow) arrow.textContent = dropdown.classList.contains('hidden') ? '▼' : '▲';
        });
    }

    // YOUTUBE LATEST VIDEOS — SECURE PROXY (key is now on Vercel only)
    fetch('/api/youtube?maxResults=4')
        .then(r => r.json())
        .then(data => {
            const grid = document.getElementById('youtube-grid');
            if (grid && data.items) {
                grid.innerHTML = data.items.map(item => `
                    <div class="glass rounded-3xl overflow-hidden border border-[#ff008f]/30 hover:border-[#ff4fd8]">
                        <iframe width="100%" height="220" src="https://www.youtube.com/embed/${item.id.videoId}" frameborder="0" allowfullscreen></iframe>
                        <div class="p-4 text-sm font-['Rajdhani'] text-center">${item.snippet.title}</div>
                    </div>
                `).join('');
            }
        })
        .catch(err => {
            console.log('YouTube proxy ready — videos will load on live domain');
        });

    // YOUR EXACT SOCIAL ICONS FROM assets/images/icons/ (pink glow)
    const socialHTML = `
        <a href="https://www.youtube.com/channel/UC1uTOgZd1rNHnASINvT4b4Q" target="_blank" class="block"><img src="assets/images/icons/youtube.svg" alt="YouTube" class="social-icon w-16 h-16 mx-auto"></a>
        <a href="https://open.spotify.com/artist/6ozcOAnRAUPn3z5c0GR5kU" target="_blank" class="block"><img src="assets/images/icons/spotify.svg" alt="Spotify" class="social-icon w-16 h-16 mx-auto"></a>
        <a href="https://music.apple.com/us/artist/lil-synn/1850720041" target="_blank" class="block"><img src="assets/images/icons/apple-music.svg" alt="Apple Music" class="social-icon w-16 h-16 mx-auto"></a>
        <a href="https://www.instagram.com/lilsynnofficial/" target="_blank" class="block"><img src="assets/images/icons/instagram.svg" alt="Instagram" class="social-icon w-16 h-16 mx-auto"></a>
        <a href="https://x.com/lilsynnofficial" target="_blank" class="block"><img src="assets/images/icons/twitter.svg" alt="Twitter / X" class="social-icon w-16 h-16 mx-auto"></a>
        <a href="https://soundcloud.com/lilsynnofficial" target="_blank" class="block"><img src="assets/images/icons/soundcloud.svg" alt="SoundCloud" class="social-icon w-16 h-16 mx-auto"></a>
        <a href="https://www.tiktok.com/@lilsynnofficial" target="_blank" class="block"><img src="assets/images/icons/tiktok.svg" alt="TikTok" class="social-icon w-16 h-16 mx-auto"></a>
        <a href="https://www.facebook.com/lilsynnofficial" target="_blank" class="block"><img src="assets/images/icons/facebook.svg" alt="Facebook" class="social-icon w-16 h-16 mx-auto"></a>
        <a href="https://www.threadless.com/@lilsynnofficial" target="_blank" class="block"><img src="assets/images/icons/threadless.svg" alt="Threadless" class="social-icon w-16 h-16 mx-auto"></a>
    `;

    // Inject into menu dropdown AND main page icons below Contact
    if (dropdown) dropdown.innerHTML = socialHTML;
    const mainGrid = document.getElementById('main-social-grid');
    if (mainGrid) mainGrid.innerHTML = socialHTML;
});
