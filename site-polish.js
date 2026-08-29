document.addEventListener('DOMContentLoaded',()=>{
 const releaseSection=document.getElementById('presave');
 const latestTitle=document.getElementById('latest-release-title');
 const keepOneListenButton=()=>{if(!releaseSection)return;const buttons=[...releaseSection.querySelectorAll('[data-listen-cta], .cta-primary')];buttons.slice(1).forEach(b=>b.remove());if(buttons[0])buttons[0].setAttribute('data-listen-cta','true')};
 keepOneListenButton();
 if(releaseSection)new MutationObserver(keepOneListenButton).observe(releaseSection,{childList:true,subtree:true});
 if(latestTitle){const lock=()=>{if(latestTitle.textContent.trim()!=='HELLO GOODBYE')latestTitle.textContent='HELLO GOODBYE'};lock();new MutationObserver(lock).observe(latestTitle,{childList:true,characterData:true,subtree:true})}
 // script.js also populates #music-grid on DOMContentLoaded. Its Apple catalog
 // request is asynchronous, so loading the random renderer only once can race with
 // it and then get overwritten. Re-run the renderer after that legacy request has
 // had time to finish. This is intentionally scoped ONLY to #music-grid.
 const grid=document.getElementById('music-grid');
 if(grid){
   const loadRandomMusic=()=>{
     const s=document.createElement('script');
     s.src='music-random.js?refresh='+Date.now();
     s.async=false;
     document.body.appendChild(s);
   };
   [250,1000,2500,5000].forEach(delay=>setTimeout(loadRandomMusic,delay));
 }
});
