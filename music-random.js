document.addEventListener('DOMContentLoaded',()=>{
 const grid=document.getElementById('music-grid');
 const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
 const titleKey=s=>String(s||'').toLowerCase().replace(/[’']/g,'').replace(/[^a-z0-9]+/g,' ').trim();
 const render=items=>{grid.innerHTML=items.map(s=>{const title=esc(s.trackName),release=esc(s.collectionName||'LIL SYNN'),art=s.art||'',apple=s.apple||'',spotify=s.spotify||'',year=s.year||'';if(!apple||!spotify)return '';return `<article class="music-card"><a href="${spotify}" target="_blank" rel="noopener noreferrer" aria-label="Open ${title}">${art?`<img src="${art}" alt="${title} — LIL SYNN artwork" loading="lazy" decoding="async">`:'<div class="music-placeholder">LIL SYNN</div>'}</a><div class="music-card-body"><h3 class="music-card-title">${title}</h3><p class="music-card-meta">${release}${year?' · '+year:''}</p><div class="music-card-links"><a href="${spotify}" target="_blank" rel="noopener noreferrer" aria-label="Open ${title} on Spotify">SPOTIFY</a><a href="${apple}" target="_blank" rel="noopener noreferrer" aria-label="Open ${title} on Apple Music">APPLE</a></div></div></article>`}).join('')};
 (async()=>{if(!grid)return;try{
   const [appleResponse,catalogResponse,artResponse]=await Promise.all([
     fetch('https://itunes.apple.com/lookup?id=1850720041&entity=song&limit=200',{cache:'no-store'}),
     fetch('/release-catalog.json',{cache:'no-store'}),
     fetch('https://api.github.com/repos/LILSYNNOFFICIAL/LILSYNNOFFICIAL/contents/assets/images/icons/album_art?ref=main',{cache:'no-store'})
   ]);
   if(!appleResponse.ok||!catalogResponse.ok)throw Error('Catalog unavailable');
   const appleData=await appleResponse.json(),catalog=await catalogResponse.json();
   const appleSongs=(appleData.results||[]).filter(x=>x.wrapperType==='track'&&x.kind==='song'&&x.artistName==='LIL SYNN'&&x.trackName);
   let artFiles=[];if(artResponse.ok){const j=await artResponse.json();artFiles=(Array.isArray(j)?j:[]).filter(x=>x.type==='file'&&/\.jpg$/i.test(x.name));}
   const spotifyMap=catalog.trackSpotify||{};
   const artworkFor=release=>{const k=titleKey(release);let f=artFiles.find(x=>titleKey(x.name.replace(/^\d+_lil_synn_/i,'').replace(/\.jpg$/i,''))===k);if(!f){const parts=k.split(' ');f=artFiles.find(x=>parts.length&&parts.every(p=>titleKey(x.name).includes(p)))}return f?'https://raw.githubusercontent.com/LILSYNNOFFICIAL/LILSYNNOFFICIAL/main/assets/images/icons/album_art/'+encodeURIComponent(f.name):''};
   const entries=[];
   for(const release of catalog.order||[]){const group=catalog.groups?.[release];if(group?.tracks){for(const track of group.tracks)entries.push({track,release})}else if(release!=='Touching to the North')entries.push({track:release,release})}
   const appleByTitle=new Map(appleSongs.map(x=>[titleKey(x.trackName),x]));
   const pool=[];for(const e of entries){const a=appleByTitle.get(titleKey(e.track));const spotify=spotifyMap[e.track];if(!a||!spotify||!a.trackViewUrl)continue;pool.push({trackName:a.trackName,collectionName:e.release,apple:a.trackViewUrl,spotify,art:artworkFor(e.release)||a.artworkUrl100?.replace('100x100bb','600x600bb')||'',year:a.releaseDate?new Date(a.releaseDate).getFullYear():''})}
   const unique=[],seen=new Set();for(const s of pool){const k=titleKey(s.trackName);if(!seen.has(k)){seen.add(k);unique.push(s)}}
   if(unique.length<8)throw Error('Not enough fully linked songs');
   // Fresh random selection on EVERY page load. Prefer one song per release first,
   // then fill the remaining slots from the complete randomized song pool.
   const randomized=shuffle(unique),chosen=[],usedReleases=new Set();
   for(const song of randomized){if(chosen.length===8)break;if(!usedReleases.has(song.collectionName)){chosen.push(song);usedReleases.add(song.collectionName)}}
   for(const song of shuffle(unique)){if(chosen.length===8)break;if(!chosen.some(x=>titleKey(x.trackName)===titleKey(song.trackName)))chosen.push(song)}
   render(shuffle(chosen));
 }catch(e){console.warn('Release-derived random music unavailable',e)}})();
});
