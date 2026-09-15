(()=>{
  const path=location.pathname.replace(/\/$/,'')||'/';
  if(path!=='/'&&path!=='/index.html') return;
  const init=()=>{
    if(document.getElementById('ls-under-construction')) return;
    const panel=document.createElement('aside');
    panel.id='ls-under-construction';
    panel.setAttribute('aria-label','Site under construction');
    panel.innerHTML='<div class="ls-uc-inner"><div class="ls-uc-kicker">LIL SYNN / OFFICIAL SITE</div><h1>UNDER<br><span>CONSTRUCTION</span></h1><p>The site is being rebuilt. The content underneath is still here.</p><div class="ls-uc-spacer" aria-hidden="true"></div><button id="ls-uc-close" type="button" aria-label="Close under construction notice">×</button></div>';
    const style=document.createElement('style');
    style.id='ls-under-construction-style';
    style.textContent=`#ls-under-construction{position:fixed;inset:0;z-index:2147483646;background:#000;color:#fff;overflow-y:auto;overflow-x:hidden}#ls-under-construction .ls-uc-inner{min-height:170vh;width:100%;display:flex;flex-direction:column;align-items:center;text-align:center;padding:18vh 24px 8vh;box-sizing:border-box;font-family:Rajdhani,Arial,sans-serif}.ls-uc-kicker{font:700 11px Rajdhani,sans-serif;letter-spacing:.35em;color:#ff4fd8;margin-bottom:24px}.ls-uc-inner h1{margin:0;font:800 clamp(48px,10vw,130px)/.82 Orbitron,Arial,sans-serif;letter-spacing:-.07em}.ls-uc-inner h1 span{color:transparent;-webkit-text-stroke:1px rgba(255,255,255,.8)}.ls-uc-inner p{max-width:560px;margin:28px auto 0;color:#999;font:600 16px/1.5 Rajdhani,sans-serif;letter-spacing:.08em}.ls-uc-spacer{flex:1}.ls-uc-inner button{width:52px;height:52px;border:1px solid rgba(255,255,255,.45);border-radius:50%;background:#050505;color:#fff;font:400 30px/1 Arial,sans-serif;cursor:pointer;opacity:.15;transition:opacity .2s,border-color .2s,transform .2s}.ls-uc-inner button:hover,.ls-uc-inner button:focus-visible{opacity:1;border-color:#ff008f;transform:scale(1.06);outline:none}@media(max-width:600px){#ls-under-construction .ls-uc-inner{min-height:155vh;padding:17vh 18px 7vh}.ls-uc-inner h1{font-size:17vw}.ls-uc-inner p{font-size:14px}.ls-uc-inner button{width:48px;height:48px}}`;
    document.head.appendChild(style);document.body.appendChild(panel);
    const close=()=>{panel.remove();style.remove();document.documentElement.style.overflow='';document.body.style.overflow=''};
    panel.querySelector('#ls-uc-close').addEventListener('click',close);
    panel.addEventListener('scroll',()=>{const nearBottom=panel.scrollTop+panel.clientHeight>=panel.scrollHeight-24;panel.querySelector('#ls-uc-close').style.opacity=nearBottom?'1':'.15';panel.querySelector('#ls-uc-close').style.pointerEvents=nearBottom?'auto':'none'});
    panel.querySelector('#ls-uc-close').style.pointerEvents='none';
    document.documentElement.style.overflow='hidden';document.body.style.overflow='hidden';
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();