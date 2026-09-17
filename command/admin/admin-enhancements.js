(() => {
  const $=s=>document.querySelector(s);
  function qaEnhance(){
    const route=$('#qaRoute'), viewport=$('#qaViewport');
    if(!route||!viewport)return;
    route.value='/';
    route.setAttribute('list','qaRoutes');
    if(!$('#qaRoutes')){
      const dl=document.createElement('datalist');dl.id='qaRoutes';
      ['/','/command/','/command/admin/','/command/designer.html','/releases.html','/archive.html','/vote','/Suno/'].forEach(v=>{const o=document.createElement('option');o.value=v;dl.append(o)});
      route.after(dl);
    }
    if(![...viewport.options].some(o=>o.value==='tablet')){const o=document.createElement('option');o.value='tablet';o.textContent='tablet';viewport.append(o)}
  }
  function addRefresh(){
    const top=$('.top-status');if(!top||$('#adminRefresh'))return;
    const b=document.createElement('button');b.id='adminRefresh';b.className='action';b.type='button';b.textContent='↻ REFRESH';b.onclick=()=>window.render?.(document.querySelector('#nav button.active')?.dataset.view||'dashboard');top.append(b);
  }
  document.addEventListener('click',e=>{const b=e.target.closest('#nav button');if(!b)return;setTimeout(()=>{if(b.dataset.view==='qa')qaEnhance();addRefresh()},80)});
  const observer=new MutationObserver(()=>{if($('#qaRoute'))qaEnhance();addRefresh()});
  observer.observe(document.body,{childList:true,subtree:true});
  setTimeout(()=>{qaEnhance();addRefresh()},250);
})();
