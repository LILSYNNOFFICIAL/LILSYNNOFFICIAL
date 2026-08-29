document.addEventListener('DOMContentLoaded',()=>{
 const releaseSection=document.getElementById('presave');
 const latestTitle=document.getElementById('latest-release-title');
 const keepOneListenButton=()=>{if(!releaseSection)return;const buttons=[...releaseSection.querySelectorAll('[data-listen-cta], .cta-primary')];buttons.slice(1).forEach(b=>b.remove());if(buttons[0])buttons[0].setAttribute('data-listen-cta','true')};
 keepOneListenButton();
 if(releaseSection)new MutationObserver(keepOneListenButton).observe(releaseSection,{childList:true,subtree:true});
 if(latestTitle){const lock=()=>{if(latestTitle.textContent.trim()!=='HELLO GOODBYE')latestTitle.textContent='HELLO GOODBYE'};lock();new MutationObserver(lock).observe(latestTitle,{childList:true,characterData:true,subtree:true})}
 // Force-load the current Music renderer with a cache-busting URL. This intentionally
 // targets ONLY #music-grid; Latest Videos (#youtube-grid) is never touched here.
 const grid=document.getElementById('music-grid');
 if(grid){const s=document.createElement('script');s.src='music-random.js?v='+Date.now();s.async=false;document.body.appendChild(s)}
});
