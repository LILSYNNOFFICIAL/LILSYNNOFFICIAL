document.addEventListener('DOMContentLoaded',()=>{
 const releaseSection=document.getElementById('presave');
 const latestTitle=document.getElementById('latest-release-title');
 if(!releaseSection)return;
 const keepOneListenButton=()=>{const buttons=[...releaseSection.querySelectorAll('[data-listen-cta], .cta-primary')];buttons.slice(1).forEach(b=>b.remove());if(buttons[0])buttons[0].setAttribute('data-listen-cta','true')};
 keepOneListenButton();new MutationObserver(keepOneListenButton).observe(releaseSection,{childList:true,subtree:true});
 if(latestTitle){const lock=()=>{if(latestTitle.textContent.trim()!=='HELLO GOODBYE')latestTitle.textContent='HELLO GOODBYE'};lock();new MutationObserver(lock).observe(latestTitle,{childList:true,characterData:true,subtree:true})}
});