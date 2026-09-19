(()=>{'use strict';

const path=location.pathname.toLowerCase().replace(/\/$/,'')||'/';
const route=path.replace(/\.html$/,'');
const excluded=new Set(['/suno','/backup','/template','/template_bu']);
if(excluded.has(route))return;

const SHELL_SCRIPT=new URL(document.currentScript?.getAttribute('src')||'site-shell.js',location.href);const SITE_BASE=SHELL_SCRIPT.pathname.replace(/\/site-shell\.js.*$/,'');const ROOT=p=>SITE_BASE+(p.startsWith('/')?p:'/'+p);const TEMPLATE_URL=ROOT('/template.html')+'?template=20260919';

function rewriteTemplateUrls(root){
  root.querySelectorAll('a[href],img[src],video[src],source[src],script[src],link[href]').forEach(el=>{
    const attr=el.hasAttribute('href')?'href':'src';
    const v=el.getAttribute(attr);
    if(v&&v.startsWith('/'))el.setAttribute(attr,ROOT(v));
  });
  root.querySelectorAll('[style]').forEach(el=>{
    const v=el.getAttribute('style');
    if(v)el.setAttribute('style',v.replace(/url\((['"]?)\//g,'url($1'+SITE_BASE+'/'));
  });
}

function rewritePageUrls(root){
  root.querySelectorAll('a[href],img[src],video[src],source[src],iframe[src],script[src],link[href]').forEach(el=>{
    const attr=el.hasAttribute('href')?'href':'src';
    const v=el.getAttribute(attr);
    if(!v||!v.startsWith('/')||v.startsWith('//'))return;
    el.setAttribute(attr,ROOT(v));
  });
  root.querySelectorAll('[style]').forEach(el=>{
    const v=el.getAttribute('style');
    if(v)el.setAttribute('style',v.replace(/url\((['"]?)\//g,'url($1'+SITE_BASE+'/'));
  });
  root.querySelectorAll('style').forEach(style=>{
    style.textContent=style.textContent.replace(/url\((['"]?)\//g,'url($1'+SITE_BASE+'/');
  });
}

function normalize(){
  document.querySelectorAll('a[href]').forEach(a=>{
    const h=a.getAttribute('href');
    if(h==='/vote#contact'||h==='/vote.html#contact'||h==='/index.html/contact')a.setAttribute('href','/#signal');
  });
}

function addTemplateStyles(doc){
  [...doc.head.querySelectorAll('style')].forEach(s=>{
    const x=document.createElement('style');
    if(s.id)x.id='ls-injected-'+s.id;
    x.textContent=s.textContent.replace(/url\((['"]?)\//g,`url($1${SITE_BASE}/`);
    document.head.appendChild(x);
  });
  if(!document.querySelector('link[data-ls-template-shell]')){
    const l=document.createElement('link');
    l.rel='stylesheet';
    l.href=ROOT('/site-shell.css')+'?v=20260919';
    l.dataset.lsTemplateShell='1';
    document.head.appendChild(l);
  }

  const repair=document.createElement('style');
  repair.id='ls-universal-template-layout';
  repair.textContent=`
/* UNIVERSAL TEMPLATE LAYOUT */
html,body{height:auto!important;min-height:0!important;scrollbar-color:#ff008f rgba(255,255,255,.08)!important;scrollbar-width:thin!important}*{scrollbar-color:#ff008f rgba(255,255,255,.08)!important;scrollbar-width:thin!important}*::-webkit-scrollbar{width:10px;height:10px}*::-webkit-scrollbar-track{background:rgba(255,255,255,.05)}*::-webkit-scrollbar-thumb{background:#ff008f;border:2px solid #08080b;border-radius:999px}*::-webkit-scrollbar-thumb:hover{background:#ff4fd8}
body.ls-canonical-page{padding:0!important;margin:0!important;overflow-x:hidden!important;overflow-y:visible!important}
body.ls-canonical-page .ls-canonical-topbar{display:block!important;visibility:visible!important;opacity:1!important;position:fixed!important;top:0!important;left:0!important;right:0!important;z-index:2147483000!important}body.ls-canonical-page #ls-template-menu{position:fixed!important;z-index:2147483641!important}body.ls-canonical-page .ls-canonical-footer{display:block!important;visibility:visible!important;opacity:1!important;position:relative!important;z-index:100!important}body.ls-canonical-page #template-content{position:relative!important;z-index:2!important}
body.ls-canonical-page #ls-template-menu{z-index:110!important;scrollbar-color:#ff008f rgba(255,255,255,.06)!important;scrollbar-width:thin!important}.ls-canonical-page #ls-template-menu::-webkit-scrollbar{width:8px!important;height:8px!important}.ls-canonical-page #ls-template-menu::-webkit-scrollbar-thumb{background:#ff008f!important;border-radius:999px!important}.ls-canonical-page #ls-template-menu::-webkit-scrollbar-track{background:rgba(255,255,255,.05)!important}
body.ls-canonical-page #template-content{
  display:block!important;
  position:relative!important;
  width:100%!important;
  height:auto!important;
  min-height:0!important;
  margin:0!important;
  padding:0!important;
  overflow:visible!important;
  box-sizing:border-box!important;
}
body.ls-canonical-page #template-content> :first-child{margin-top:0!important}
body.ls-canonical-page #template-content> *{margin-top:0!important;}
body.ls-canonical-page #template-content .page{min-height:0!important;height:auto!important;overflow:visible!important}
body.ls-canonical-page #template-content .gallery-page,
body.ls-canonical-page #template-content .archive-page,
body.ls-canonical-page #template-content .universe,
body.ls-canonical-page #template-content .lore-page,
body.ls-canonical-page #template-content .release-detail,
body.ls-canonical-page #template-content .release-page,
body.ls-canonical-page #template-content .coming-page,
body.ls-canonical-page #template-content .vote-page,
body.ls-canonical-page #template-content .legal-page{padding-top:0!important}
body.ls-canonical-page #template-content>script,
body.ls-canonical-page #template-content>style{display:none!important}
body.ls-canonical-page .ls-canonical-footer{margin-top:0!important}
@media(max-width:900px){
  body.ls-canonical-page #template-content{margin-top:0!important}
}
`;
  document.head.appendChild(repair);
}

function removeLegacyShell(){
  const selectors=[
    '[data-ls-global-header]',
    '[data-ls-global-footer]',
    '.ls-canonical-topbar',
    '.ls-canonical-footer',
    '#ls-mobile-menu',
    '#menuPanel',
    '.topbar',
    '.nav-stack',
    '.menu-panel',
    'footer.footer'
  ];
  selectors.forEach(sel=>{
    document.querySelectorAll(sel).forEach(el=>el.remove());
  });
}

function wireMenu(root){
  const menu=root.querySelector('#ls-template-menu');
  const open=root.querySelector('#ls-template-menu-open');
  const close=root.querySelector('#ls-template-menu-close');
  if(!menu||!open)return;

  const setMenu=v=>{
    menu.classList.toggle('open',v);
    menu.setAttribute('aria-hidden',String(!v));
    open.setAttribute('aria-expanded',String(v));
    open.setAttribute('aria-label',v?'Close navigation menu':'Open navigation menu');
    document.body.style.overflow=v?'hidden':'';
  };

  open.addEventListener('click',e=>{
    e.preventDefault();
    e.stopPropagation();
    setMenu(!menu.classList.contains('open'));
  });
  if(close)close.addEventListener('click',()=>setMenu(false));
  menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));

  const cats=[...root.querySelectorAll('.ls-template-cat')];
  const closeCats=except=>cats.forEach(cat=>{
    if(cat!==except){
      cat.classList.remove('open');
      cat.querySelector('button')?.setAttribute('aria-expanded','false');
    }
  });

  cats.forEach(cat=>{
    const b=cat.querySelector('button');
    if(!b)return;
    b.addEventListener('click',e=>{
      e.preventDefault();
      e.stopPropagation();
      const openNow=!cat.classList.contains('open');
      closeCats(cat);
      cat.classList.toggle('open',openNow);
      b.setAttribute('aria-expanded',String(openNow));
    });
  });

  document.addEventListener('click',e=>{
    if(!e.target.closest('.ls-template-cat'))closeCats(null);
  });
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'){
      setMenu(false);
      closeCats(null);
    }
  });
}

async function injectTemplate(){
  if(document.documentElement.dataset.lsTemplateApplied==='1')return;

  try{
    let res=await fetch(TEMPLATE_URL,{cache:'no-store'});if(!res.ok)res=await fetch(TEMPLATE_URL,{cache:'no-store'});
    if(!res.ok)throw new Error('template fetch '+res.status);

    const html=await res.text();
    const doc=new DOMParser().parseFromString(html,'text/html');
    const header=doc.querySelector('[data-ls-global-header]');
    const menu=doc.querySelector('#ls-template-menu');
    const footer=doc.querySelector('[data-ls-global-footer]');

    if(!header||!menu||!footer)throw new Error('template shell incomplete');

    addTemplateStyles(doc);
    removeLegacyShell();

    const content=document.createElement('main');
    content.id='template-content';
    content.dataset.lsTemplateContent='1';

    const visuals=[];
    const visualSelectors=['#ls-bg-layer','.ls-particles','#ls-geometry-layer'];
    visualSelectors.forEach(sel=>{
      const existing=document.querySelector(sel);
      if(existing)visuals.push(existing);
      else{
        const source=doc.querySelector(sel);
        if(source)visuals.push(source.cloneNode(true));
      }
    });

    [...document.body.children].forEach(el=>{
      if(el.matches('[data-ls-global-header],[data-ls-global-footer],.ls-canonical-topbar,.ls-canonical-footer,#ls-mobile-menu,#menuPanel'))return;
      if(visuals.includes(el))return;
      if(el.tagName==='SCRIPT'&&el.src&&el.src.includes('/site-shell.js'))return;
      content.appendChild(el);
    });

    rewritePageUrls(content);    const h=header.cloneNode(true);
    const m=menu.cloneNode(true);
    const f=footer.cloneNode(true);
    rewriteTemplateUrls(h);rewriteTemplateUrls(m);rewriteTemplateUrls(f);

    // The template is the canonical shell. Remove every page-owned copy of
    // the global header/menu/footer before mounting the template instances.
    // Page content itself is preserved verbatim inside #template-content.

    h.dataset.lsTemplateApplied='1';
    document.body.replaceChildren(...visuals,h,m,content,f);document.body.style.overflow='';document.documentElement.style.overflowX='hidden';
    document.body.classList.add('ls-canonical-page');
    document.documentElement.dataset.lsTemplateApplied='1';

    wireMenu(document.body);
    normalize();
  }catch(err){
    console.error('[LIL SYNN] Universal template injection failed:',err);
  }
}

if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded',injectTemplate,{once:true});
}else{
  injectTemplate();
}
})();