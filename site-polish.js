document.addEventListener('DOMContentLoaded',()=>{
 const releaseSection=document.getElementById('presave');
 const latestTitle=document.getElementById('latest-release-title');
 const keepOneListenButton=()=>{if(!releaseSection)return;const buttons=[...releaseSection.querySelectorAll('[data-listen-cta], .cta-primary')];buttons.slice(1).forEach(b=>b.remove());if(buttons[0])buttons[0].setAttribute('data-listen-cta','true')};
 keepOneListenButton();
 if(releaseSection)new MutationObserver(keepOneListenButton).observe(releaseSection,{childList:true,subtree:true});
 if(latestTitle){const lock=()=>{if(latestTitle.textContent.trim()!=='HELLO GOODBYE')latestTitle.textContent='HELLO GOODBYE'};lock();new MutationObserver(lock).observe(latestTitle,{childList:true,characterData:true,subtree:true})}
 // MUSIC randomization belongs exclusively to music-random.js, which is loaded
 // once from index.html. Do not inject it repeatedly: repeated injections caused
 // the Music tiles to reshuffle after load and created competing observers.
 // LATEST VIDEOS is completely independent and is never randomized here.
});
