/* LIL SYNN signal and experience layer. No personal profiling. */
(()=>{
const reduce=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
const connection=navigator.connection;
const autoLow=reduce||!!connection?.saveData||['slow-2g','2g'].includes(connection?.effectiveType);
const lowPower=autoLow||localStorage.getItem('lsPerformance')==='low';
if(lowPower)document.documentElement.dataset.lsLowPower='true';
const esc=s=>String(s??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
const norm=s=>String(s??'').toLowerCase().normalize('NFKD').replace(/[’']/g,'').replace(/[^a-z0-9]+/g,'');
const load=async()=>{
 const signal=document.getElementById('signal');
 if(!signal||signal.dataset.signalReady)return;
 signal.dataset.signalReady='1';
 let data={transmissions:[]},catalog={order:[],groups:{},spotify:{},trackSpotify:{}};
 try{const [tr,cr]=await Promise.all([fetch('/transmissions.json',{cache:'default'}),fetch('/release-catalog.json',{cache:'default'})]);if(tr.ok)data=await tr.json();if(cr.ok)catalog=await cr.json()}catch{}
 const items=Array.isArray(data?.transmissions)?data.transmissions:[];
 const wrap=document.createElement('div');wrap.className='ls-signal-experience';
 wrap.innerHTML=`<div class="ls-signal-head"><span class="section-kicker">LIVE FREQUENCY</span><h3>THE SIGNAL</h3><p>Updates, releases, visuals, and transmissions from the LIL SYNN universe.</p></div><div class="ls-signal-grid" data-signal-grid></div><div class="ls-oracle" aria-live="polite"><div><span class="section-kicker">SIGNAL ORACLE</span><h3 data-oracle-title>GENERATE A SIGNAL</h3><p data-oracle-body>Let the system choose a track, mood, and destination.</p></div><button type="button" class="discover-button" data-oracle-button>ENTER THE SIGNAL</button></div>`;
 const grid=wrap.querySelector('[data-signal-grid]');items.forEach(item=>{const a=document.createElement('a');a.className='ls-signal-card';a.href=item.href||'#';if(item.external){a.target='_blank';a.rel='noopener noreferrer'}a.innerHTML=`<span class="ls-signal-label">${esc(item.label)}</span><strong>${esc(item.title)}</strong><span>${esc(item.body)}</span><b>${esc(item.cta||'OPEN')} ↗</b>`;grid.appendChild(a)});signal.appendChild(wrap);
 const choices=[];const order=Array.isArray(catalog.order)?catalog.order:[];for(const release of order){const group=catalog.groups?.[release],tracks=group?.tracks?.length?group.tracks:[release];for(const track of tracks){const href=catalog.trackSpotify?.[track]||catalog.spotify?.[track]||group?.spotify||catalog.spotify?.[release]||'';if(href)choices.push({title:track,release,type:group?.type||'SINGLE',href})}}
 const moods=[['NIGHT FREQUENCY','dark, nocturnal energy'],['EMOTIONAL STATIC','raw, intimate emotion'],['HEAVY SIGNAL','weight, tension, and low-end pressure'],['AFTER HOURS','late-night atmosphere and reflection'],['CLEAR FREQUENCY','a cleaner, more direct listen']];
 const title=wrap.querySelector('[data-oracle-title]'),body=wrap.querySelector('[data-oracle-body]'),button=wrap.querySelector('[data-oracle-button]');
 button.addEventListener('click',()=>{const choice=choices[Math.floor(Math.random()*choices.length)],mood=moods[Math.floor(Math.random()*moods.length)];if(!choice){title.textContent='SIGNAL UNAVAILABLE';body.textContent='The catalog is temporarily offline. Try again shortly.';return}title.textContent=mood[0];body.innerHTML=`The Oracle selects <strong>${esc(choice.title)}</strong> from <strong>${esc(choice.release)}</strong>. ${esc(mood[1])}.`;let link=wrap.querySelector('[data-oracle-link]');if(!link){link=document.createElement('a');link.className='cta-primary';link.dataset.oracleLink='1';button.insertAdjacentElement('afterend',link)}link.href=choice.href;link.target='_blank';link.rel='noopener noreferrer';link.textContent='LISTEN ON SPOTIFY'});
};
const reveal=()=>{if(lowPower||!('IntersectionObserver'in window))return;const els=document.querySelectorAll('section,.ls-signal-card,.ls-oracle');els.forEach(e=>e.classList.add('ls-reveal'));const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('ls-revealed');io.unobserve(e.target)}}),{threshold:.08});els.forEach(e=>io.observe(e))};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{load();reveal()},{once:true});else{load();reveal()}
})();
