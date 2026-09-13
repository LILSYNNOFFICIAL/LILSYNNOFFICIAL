(()=>{const $=(s,c=document)=>c.querySelector(s),$$=(s,c=document)=>[...c.querySelectorAll(s)];
const nav=$('.nav-toggle'),menu=$('#site-nav');
function closeGroups(except){$$('.nav-group').forEach(g=>{if(g!==except)g.classList.remove('open');const b=$('.nav-trigger',g);if(b)b.setAttribute('aria-expanded',String(g===except&&g.classList.contains('open')))});}
$$('.nav-trigger').forEach(btn=>{btn.addEventListener('click',e=>{e.stopPropagation();const group=btn.closest('.nav-group');const open=group.classList.toggle('open');closeGroups(open?group:null);btn.setAttribute('aria-expanded',String(open));});});
if(nav&&menu){nav.addEventListener('click',()=>{const open=menu.classList.toggle('open');nav.setAttribute('aria-expanded',String(open));if(!open)closeGroups(null);});}
document.addEventListener('click',e=>{if(!e.target.closest('.nav-group'))closeGroups(null);});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeGroups(null);if(menu){menu.classList.remove('open');nav?.setAttribute('aria-expanded','false');}}});
$$('.nav-menu a, .nav-complete').forEach(a=>a.addEventListener('click',()=>{closeGroups(null);menu?.classList.remove('open');nav?.setAttribute('aria-expanded','false');}));
const input=$('#guide-search'),cards=$$('.guide-card'),chips=$$('.filter-chip');let filter='all';
function apply(){const q=(input?.value||'').trim().toLowerCase();let shown=0;cards.forEach(card=>{const okFilter=filter==='all'||card.dataset.category===filter;const hay=((card.dataset.search||'')+' '+card.textContent).toLowerCase();const show=okFilter&&(!q||hay.includes(q));card.hidden=!show;if(show)shown++;});const empty=$('#no-results');if(empty)empty.hidden=shown!==0;}
if(input)input.addEventListener('input',apply);chips.forEach(chip=>chip.addEventListener('click',()=>{chips.forEach(x=>x.classList.remove('active'));chip.classList.add('active');filter=chip.dataset.filter||'all';apply();}));
$$('.accordion-trigger').forEach(btn=>btn.addEventListener('click',()=>{const panel=document.getElementById(btn.getAttribute('aria-controls'));const open=btn.getAttribute('aria-expanded')==='true';btn.setAttribute('aria-expanded',String(!open));if(panel)panel.hidden=open;}));
const top=$('.back-to-top');if(top)top.addEventListener('click',()=>window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'}));
})();