document.addEventListener('DOMContentLoaded', () => {
    console.log('%c✅ Script loaded — checking YouTube proxy', 'color:#ff008f; font-size:14px');

    // HAMBURGER + SOCIALS DROPDOWN (unchanged)
    const ham = document.getElementById('hamburger');
    const menu = document.getElementById('sideMenu');
    const close = document.getElementById('closeMenu');
    ham.addEventListener('click', () => menu.classList.toggle('translate-x-full'));
    close.addEventListener('click', () => menu.classList.add('translate-x-full'));

    const trigger = document.getElementById('socialsTrigger');
    const dropdown = document.getElementById('socialsDropdown');
    if (trigger && dropdown) {
        trigger.addEventListener('click', () => {
            dropdown.classList.toggle('hidden');
            const arrow = trigger.querySelector('span');
            if (arrow) arrow.textContent = dropdown.classList.contains('hidden') ? '▼' : '▲';
        });
    }

    // YOUTUBE DEBUG FETCH
    console.log('Attempting to fetch videos from /api/youtube...');
    fetch('/api/youtube?maxResults=4')
        .then(r => {
            console.log('Proxy status:', r.status);
            return r.json();
        })
        .then(data => {
            console.log('✅ YouTube data received:', data);
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
            console.error('❌ Proxy error:', err);
            document.getElementById('youtube-grid').innerHTML = `
                <div style="color:#ff4fd8; padding:30px; text-align:center; font-size:18px;">
                    Videos should load here...<br>
                    <small>Check browser console (F12) for the exact error</small>
                </div>`;
        });

    // SOCIAL ICONS (unchanged)
    const socialHTML = `...your 9 icons here...`; // (same as before)

    if (dropdown) dropdown.innerHTML = socialHTML;
    const mainGrid = document.getElementById('main-social-grid');
    if (mainGrid) mainGrid.innerHTML = socialHTML;
});
