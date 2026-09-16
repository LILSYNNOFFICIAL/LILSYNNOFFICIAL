(()=>{
  const VOTE_URL='https://orbiiit.com/en/participants/8fd990f6-54eb-4a0c-9b6e-851526c04c41?contestId=f85717be-ba9b-4857-b885-ccbbb9a45757';
  const fixTransmission=()=>{const replace=()=>document.querySelectorAll('.hero-kicker .ey').forEach(el=>{if(/OFFICIAL TRANSMISSION\s*\/\s*002/i.test(el.textContent||''))el.textContent=(el.textContent||'').replace(/002/g,'369')});replace();new MutationObserver(replace).observe(document.body,{childList:true,subtree:true,characterData:true})};
  const addVote=()=>{const music=document.getElementById('music');if(!music||music.querySelector('.ls-vote-main'))return;const strip=music.querySelector('.listen-strip');if(!strip)return;const a=document.createElement('a');a.className='btn ls-vote-main';a.href=VOTE_URL;a.target='_blank';a.rel='noopener noreferrer';a.textContent='VOTE 4 LIL SYNN';const s=document.createElement('style');s.textContent='.ls-vote-main{margin-top:9px!important;border-color:rgba(255,0,143,.82)!important;background:rgba(255,0,143,.08)!important;color:#fff!important}.ls-vote-main:hover{background:#ff008f!important;color:#030005!important}';document.head.appendChild(s);strip.insertAdjacentElement('afterend',a)};
  const run=()=>{fixTransmission();addVote();};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
  setTimeout(addVote,500);setTimeout(addVote,1500);setTimeout(addVote,3000);
})();
