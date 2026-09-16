(()=>{
  'use strict';
  const KEY='ls-designer-dom-v1';
  const frame=()=>document.querySelector('#pageFrame')?.contentDocument||null;
  const escId=v=>String(v||'').replace(/[^a-z0-9_-]/gi,'-').slice(0,60).toLowerCase();
  const toast=t=>{const n=document.createElement('div');n.className='toast';n.textContent=t;document.body.append(n);setTimeout(()=>n.remove(),1800)};
  let deleted=[];
  function stableId(el){if(!el.dataset.lsId){const base=escId(el.id||el.tagName||'element');el.dataset.lsId=base+'-'+Math.random().toString(36).slice(2,9)}return el.dataset.lsId}
  function selector(el){if(!el||el===frame()?.body)return 'body';if(el.id&&/^[A-Za-z][\w-]*$/.test(el.id))return '#'+CSS.escape(el.id);const d=frame(),parts=[];let n=el;while(n&&n!==d.body){const p=n.parentElement;if(!p)break;const same=[...p.children].filter(x=>x.tagName===n.tagName);let part=n.tagName.toLowerCase();if(same.length>1)part+=`:nth-of-type(${same.indexOf(n)+1})`;parts.unshift(part);n=p}return 'body>'+parts.join('>')}
  function rememberDelete(el){if(!el)return;if(!el.dataset.lsDesigner)deleted.push(selector(el));else el.remove();localStorage.setItem(KEY,JSON.stringify({deleted}))}
  function created(){const d=frame();return d?[...d.querySelectorAll('[data-ls-designer="1"],.ls-designer-created')]:[]}
  function serialize(el){const attrs={};for(const a of ['id','class','title','alt','href','src','target','rel','controls','autoplay','muted','loop','poster','type','aria-label','role'])if(el.hasAttribute(a))attrs[a]=el.getAttribute(a);const style={};for(const k of ['position','top','right','bottom','left','width','height','min-width','max-width','min-height','max-height','margin','padding','display','flex','flex-direction','flex-wrap','flex-grow','flex-shrink','flex-basis','justify-content','align-items','gap','font-family','font-size','font-weight','line-height','letter-spacing','text-align','text-transform','color','background','background-color','border','border-width','border-style','border-color','border-radius','box-shadow','opacity','z-index','overflow','object-fit'])if(el.style[k])style[k]=el.style[k];return{id:stableId(el),tag:el.tagName.toLowerCase(),attrs,style,text:['img','video','hr'].includes(el.tagName.toLowerCase())?'':(el.textContent||'').slice(0,10000)}}
  async function baseSha(){const r=await fetch('/api/admin?action=commits');if(!r.ok)throw Error('AUTH_REQUIRED');const d=await r.json();return d.commits?.[0]?.sha||''}
  async function save(){try{const payload={confirmation:'SAVE DOM',baseSha:await baseSha(),created:created().map(serialize),deleted:[...new Set(deleted)]};if(!payload.created.length&&!payload.deleted.length){toast('No DOM changes to save');return}const r=await fetch('/api/designer-dom',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});const d=await r.json();if(!r.ok)throw Error(d.error||'SAVE_DOM_FAILED');localStorage.removeItem(KEY);deleted=[];toast('DOM saved to GitHub');document.querySelector('#status').innerHTML='<strong>DOM saved to GitHub</strong>'}catch(e){toast(e.message||'Save failed')}}
  function editText(){const d=frame();const label=document.querySelector('#overlay .selection .label');if(!d||!label)return toast('Select text first');let el;try{el=d.querySelector(label.textContent)}catch{}if(!el)return toast('Select an element first');const before=el.textContent||'';el.contentEditable='true';el.focus();const finish=()=>{el.contentEditable='false';if(el.textContent!==before){el.dataset.lsDesigner='1';stableId(el);toast('Text changed — save DOM to persist')}};el.addEventListener('blur',finish,{once:true})}
  function markCreated(el){if(!el)return;el.dataset.lsDesigner='1';stableId(el)}
  window.LSDesignerPersist={version:1,save,markCreated,rememberDelete,editText,serialize};
  function init(){
    const toolbar=document.querySelector('.toolbar');if(toolbar&&!document.querySelector('#saveDom')){const b=document.createElement('button');b.id='saveDom';b.className='tool save';b.textContent='SAVE DOM';b.title='Persist created/duplicated elements and text edits to index.html';b.onclick=save;toolbar.insertBefore(b,document.querySelector('#saveGithub'))}
    const plus=document.querySelector('#plusTools');
    const observer=new MutationObserver(ms=>ms.forEach(m=>m.addedNodes.forEach(n=>{if(n.nodeType===1&&(n.dataset?.lsDesigner==='1'||n.classList?.contains('ls-designer-created')))markCreated(n)})));
    const d=frame();if(d?.body)observer.observe(d.body,{childList:true,subtree:true});
    window.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='e'){e.preventDefault();editText()}});
    if(plus&&!document.querySelector('#persistEditText')){const b=document.createElement('button');b.id='persistEditText';b.className='tool';b.textContent='EDIT TEXT';b.onclick=editText;plus.append(b)}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
