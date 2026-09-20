(()=>{'use strict';
const ensureHomepageLayout=()=>{
 const main=document.querySelector('#template-content > main')||document.querySelector('main');
 if(!main)return;
 const signal=document.getElementById('signal');
 const orbit=main.querySelector('.homepage-orbit')||main.querySelector('.orbit-stage')?.parentElement;
 if(orbit&&signal&&orbit!==signal) signal.before(orbit);
 const artists=main.querySelectorAll('#universe');
 artists.forEach((x,i)=>{if(i>0)x.remove()});
};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ensureHomepageLayout,{once:true});else ensureHomepageLayout();
window.addEventListener('ls-template-applied',ensureHomepageLayout);
})();