/* LIL SYNN signal and experience layer. No personal profiling. */
(()=>{
const reduce=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
const connection=navigator.connection;
const lowPower=reduce||!!connection?.saveData||['slow-2g','2g'].includes(connection?.effectiveType);
if(lowPower)document.documentElement.dataset.lsLowPower='true';

const esc=s=>String(s??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
const load=async()=>{
  const signal=document.getElementById('signal');
  if(!signal||signal.dataset.signalReady)return;
  signal.dataset.signalReady='1';
  let data;
  try{const r=await fetch('/transmissions.json',{cache:'default'});if(!r.ok)throw Error('transmission fetch failed');data=await r.json()}catch{return}
  const items=Array.isArray(data?.transmissions)?data.transmissions:[];
  const wrap=document.createElement('div');
  wrap.className='ls-signal-experience';
  wrap.innerHTML=`<div class="ls-signal-head"><span class="section-kicker">LIVE FREQUENCY</span><h3>THE SIGNAL</h3><p>Updates, releases, visuals, and transmissions from the LIL SYNN universe.</p></div><div class="ls-signal-grid" data-signal-grid></div><div class="ls-oracle" aria-live="polite"><div><span class="section-kicker">SIGNAL ORACLE</span><h3 data-oracle-title>GENERATE A SIGNAL</h3><p data-oracle-body>Let the system choose a track, mood, and destination.</p></div><button type="button" class="discover-button" data-oracle-button>ENTER THE SIGNAL</button></div>`;
  const grid=wrap.querySelector('[data-signal-grid]');
  items.forEach(item=>{const a=document.createElement('a');a.className='ls-signal-card';a.href=item.href||'#';if(item.external){a.target='_blank';a.rel='noopener noreferrer'}a.innerHTML=`<span class="ls-signal-label">${esc(item.label)}</span><strong>${esc(item.title)}</strong><span>${esc(item.body)}</span><b>${esc(item.cta||'OPEN')} ↗</b>`;grid.appendChild(a)});
  signal.appendChild(wrap);
  const oracle=[
    ['NIGHT FREQUENCY','Dark atmosphere. Start with <strong>HELLO GOODBYE</strong>.','https://open.spotify.com/album/1cwzhlX5MIxBRdCiZawmQx?si=elV5OdZcTY6l1q-bP09ANg','LISTEN ON SPOTIFY'],
    ['EMOTIONAL STATIC','The signal recommends <strong>HEAL</strong>.','https://open.spotify.com/album/263h1YbnRIKLx4QWOWeM73?si=h59Er5LdTxOomK7FV31sVg','LISTEN ON SPOTIFY'],
    ['RAW SIGNAL','Go deeper into the catalog with <strong>DON\'T SAY IT</strong>.','https://open.spotify.com/album/0hFnpj0E4NFF0013EP79E2?si=MWdkt60bQWWeGPmrWy27XQ','LISTEN ON SPOTIFY'],
    ['VISUAL TRANSMISSION','The signal wants motion. Open the latest visual stories.','/#videos','WATCH VIDEOS'],
    ['ARCHIVE FREQUENCY','The catalog is waiting. Browse every release and its identity.','/releases.html','OPEN ARCHIVE']
  ];
  const title=wrap.querySelector('[data-oracle-title]'),body=wrap.querySelector('[data-oracle-body]'),button=wrap.querySelector('[data-oracle-button]');
  button.addEventListener('click',()=>{const choice=oracle[Math.floor(Math.random()*oracle.length)];title.textContent=choice[0];body.innerHTML=choice[1];let link=wrap.querySelector('[data-oracle-link]');if(!link){link=document.createElement('a');link.className='cta-primary';link.dataset.oracleLink='1';button.insertAdjacentElement('afterend',link)}link.href=choice[2];link.textContent=choice[3];if(choice[2].startsWith('http')){link.target='_blank';link.rel='noopener noreferrer'}else{link.removeAttribute('target');link.removeAttribute('rel')} });
};
const reveal=()=>{if(lowPower||!('IntersectionObserver'in window))return;const els=document.querySelectorAll('section,.ls-signal-card,.ls-oracle');els.forEach(e=>e.classList.add('ls-reveal'));const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('ls-revealed');io.unobserve(e.target)}}),{threshold:.08});els.forEach(e=>io.observe(e));};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{load();reveal()},{once:true});else{load();reveal()}
})();
