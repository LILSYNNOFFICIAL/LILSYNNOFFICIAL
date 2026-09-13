(()=>{
  const root=document.body;
  const tool=root?.dataset?.tool;
  if(!tool)return;
  const key=`lilsynn-suno-draft:${tool}`;
  const form=document.getElementById('tool-form');
  const output=document.getElementById('tool-output');
  const save=()=>{
    try{
      const data={fields:{},output:output?.value||''};
      if(form)form.querySelectorAll('input,select,textarea').forEach(el=>{
        if(!el.id&&(!el.name||el.type!=='checkbox'))return;
        const id=el.id||`name:${el.name}`;
        if(el.type==='checkbox'){
          data.fields[id]=data.fields[id]||[];
          if(el.checked)data.fields[id].push(el.value);
        }else data.fields[id]=el.value;
      });
      localStorage.setItem(key,JSON.stringify(data));
    }catch{}
  };
  const restore=()=>{
    try{
      const raw=localStorage.getItem(key); if(!raw)return;
      const data=JSON.parse(raw); if(!data||typeof data!=='object')return;
      if(form)form.querySelectorAll('input,select,textarea').forEach(el=>{
        const id=el.id||`name:${el.name}`;
        const saved=data.fields?.[id];
        if(el.type==='checkbox')el.checked=Array.isArray(saved)&&saved.includes(el.value);
        else if(typeof saved==='string')el.value=saved;
      });
      if(output&&typeof data.output==='string')output.value=data.output;
      const event=new Event('input',{bubbles:true}); output?.dispatchEvent(event);
    }catch{}
  };
  let timer;
  const queueSave=()=>{clearTimeout(timer);timer=setTimeout(save,250)};
  form?.addEventListener('input',queueSave);
  form?.addEventListener('change',queueSave);
  output?.addEventListener('input',queueSave);
  document.addEventListener('click',e=>{
    if(e.target.closest('#generate-tool'))setTimeout(save,50);
    if(e.target.closest('#reset-tool'))setTimeout(()=>{try{localStorage.removeItem(key)}catch{}},50);
  });
  restore();
})();
