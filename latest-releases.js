(()=>{
const root=document.getElementById('presave');
if(!root||root.dataset.latestReleasesReady)return;
root.dataset.latestReleasesReady='1';
const norm=v=>String(v??'').toLowerCase().normalize('NFKD').replace(/[’']/g,'').replace(/[^a-z0-9]+/g,'');
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fallbackArt={neverknown:'Never Known_album_cover.jpg',homeacousticversion:'home_acoustic_version.png',ididitagain:'I DID IT AGAIN.jpg',rescueyouacousticversion:'RESCUE_YOU_A.png',somewhereinbetween:'57_lil_synn_somewhere_in_between.jpg',blackglass:'23_lil_synn_black_glass.jpg',hellogoodbye:'11_lil_synn_hello_goodbye.jpg'};
const base='/assets/images/icons/album_art/';
const artFor=title=>{const file=(window.LIL_SYNN_ART_MAP||{})[norm(title)]||fallbackArt[norm(title)];return file?base+encodeURIComponent(file):''};
const stream=(label,url,cls)=>url?`<a class="latest-release-link ${cls}" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${label}</a>`:'';
fetch('/release-catalog.json',{cache:'default'}).then(r=>{if(!r.ok)throw Error('catalog');return r.json()}).then(c=>{
 const recent=(c.order||[]).slice(0,3);
 if(!recent.length)throw Error('empty catalog');
 root.innerHTML=`<div class="latest-release-head"><p class="section-kicker">RECENT RELEASES</p><h2>THE LATEST SIGNAL</h2><p class="latest-release-sub">The three most recent releases in the canonical LIL SYNN catalog.</p></div><div class="latest-release-grid">${recent.map((title,i)=>{const g=c.groups?.[title],type=(g?.type||'SINGLE').toUpperCase(),art=artFor(title),sp=g?.spotify||c.spotify?.[title]||c.trackSpotify?.[title]||'',ap=g?.apple||c.apple?.[title]||'',sc=g?.soundcloud||c.soundcloud?.[title]||c.trackSoundcloud?.[title]||'';const detail='/release.html?id='+encodeURIComponent(title);return `<article class="latest-release-card"><a class="latest-release-art-link" href="${detail}" aria-label="Open ${esc(title)} release experience">${art?`<img class="latest-release-art" src="${art}" alt="${esc(title)} artwork" loading="eager" decoding="async">`:''}</a><div class="latest-release-copy"><span class="latest-release-number">${String(i+1).padStart(2,'0')}</span><span class="latest-release-type">${esc(type)}</span><h3>${esc(title)}</h3><div class="latest-release-actions">${stream('OPEN',''+detail,'latest-release-link-open')}${stream('SPOTIFY',sp,'sp')}${stream('APPLE MUSIC',ap,'am')}${stream('SOUNDCLOUD',sc,'sc')}</div></div></article>`}).join('')}</div>`;
}).catch(()=>{root.innerHTML='<div class="latest-release-head"><p class="section-kicker">RECENT RELEASES</p><h2>THE LATEST SIGNAL</h2><p class="latest-release-sub">The release catalog is temporarily unavailable.</p></div>'});
})();
