(()=>{'use strict';

const path=location.pathname.toLowerCase().replace(/\/$/,'')||'/';
const route=path.replace(/\.html$/,'');
const excluded=new Set(['/suno','/backup','/template','/template_bu']);
if(excluded.has(route)||route.startsWith('/suno/'))return;

const SHELL_SCRIPT=new URL(document.currentScript?.getAttribute('src')||'site-shell.js',location.href);const SITE_BASE=SHELL_SCRIPT.pathname.replace(/\/site-shell\.js.*$/,'');const ROOT=p=>SITE_BASE+(p.startsWith('/')?p:'/'+p);const LS_BG_STARS='/assets/mov/LS_BG_STARS.webm';
// One version key for the shared shell. Bump it (and every page's site-shell.js?v=) whenever
// template.html, site-shell.css or this file changes. The template is fetched with the normal
// HTTP cache; the key makes each release a new URL.
const SHELL_VERSION='20261120-p2';
const TEMPLATE_URL=ROOT('/template.html')+'?template='+SHELL_VERSION;
const SHELL_CSS_URL=ROOT('/site-shell.css')+'?v='+SHELL_VERSION;

// site-shell.css is loaded exactly once, as early as possible (this script runs before
// DOMContentLoaded). Any older page-level copy is dropped once the current one has loaded.
function ensureShellCss(){
  let link=document.querySelector('link[data-ls-template-shell]');
  if(link)return link;
  const stale=[...document.querySelectorAll('link[rel="stylesheet"]')].filter(l=>/\/site-shell\.css(?:\?|$)/.test(l.getAttribute('href')||''));
  link=document.createElement('link');
  link.rel='stylesheet';
  link.href=SHELL_CSS_URL;
  link.dataset.lsTemplateShell='1';
  if(stale.length)link.addEventListener('load',()=>stale.forEach(l=>l.remove()),{once:true});
  document.head.appendChild(link);
  return link;
}
const SHELL_CSS_LINK=ensureShellCss();

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

function addTemplateStyles(doc){
  // Cascade order is fixed: page styles < template head styles < site-shell.css.
  const shellCss=ensureShellCss();
  [...doc.head.querySelectorAll('style')].forEach(s=>{
    const x=document.createElement('style');
    if(s.id)x.id='ls-injected-'+s.id;
    x.textContent=s.textContent.replace(/url\((['"]?)\//g,`url($1${SITE_BASE}/`);
    document.head.insertBefore(x,shellCss);
  });

  const repair=document.createElement('style');
  repair.id='ls-universal-template-layout';
  repair.textContent=`
/* UNIVERSAL TEMPLATE LAYOUT */
html,body{height:auto!important;min-height:0!important;scrollbar-color:#ff008f rgba(255,255,255,.08)!important;scrollbar-width:thin!important}*{scrollbar-color:#ff008f rgba(255,255,255,.08)!important;scrollbar-width:thin!important}*::-webkit-scrollbar{width:10px;height:10px}*::-webkit-scrollbar-track{background:rgba(255,255,255,.05)}*::-webkit-scrollbar-thumb{background:#ff008f;border:2px solid #08080b;border-radius:999px}*::-webkit-scrollbar-thumb:hover{background:#ff4fd8}
body.ls-canonical-page{padding:0!important;margin:0!important;overflow-x:hidden!important;overflow-y:visible!important}
body.ls-canonical-page .ls-canonical-topbar{display:block!important;visibility:visible!important;opacity:1!important;position:fixed!important;top:0!important;left:0!important;right:0!important;z-index:var(--z-header,1000)!important;overflow:visible!important;isolation:isolate!important}body.ls-canonical-page #ls-template-menu{position:fixed!important;z-index:var(--z-drawer,1100)!important}body.ls-canonical-page .ls-canonical-footer{display:block!important;visibility:visible!important;opacity:1!important;position:relative!important;z-index:var(--z-footer,3)!important}body.ls-canonical-page #template-content{
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
body.ls-canonical-page #template-content .legal-page,
body.ls-canonical-page #template-content .access{
  min-height:0!important;
  height:auto!important;
  padding-top:112px!important;
}
body.ls-canonical-page #template-content .release-detail{padding-bottom:90px!important}
body.ls-canonical-page #template-content .gallery-page{padding-bottom:88px!important}
body.ls-canonical-page #template-content .archive-page{padding-bottom:80px!important}
body.ls-canonical-page #template-content .universe{padding-bottom:80px!important}
body.ls-canonical-page #template-content .lore-page{padding-bottom:110px!important}
body.ls-canonical-page #template-content .release-page{padding-bottom:90px!important}
body.ls-canonical-page #template-content .coming-page{padding-bottom:90px!important}
body.ls-canonical-page #template-content .vote-page{padding-bottom:110px!important}
body.ls-canonical-page #template-content .legal-page{padding-bottom:70px!important}
body.ls-canonical-page #template-content .access{padding-bottom:70px!important}
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
    '#ls-template-menu',
    '.ls-template-menu',
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

  // Drawer geometry is set inline so no legacy stylesheet rule can pin it back
  // to the old full-width card. Inline !important outranks every sheet.
  const MENU_PROPS={'position':'fixed','inset':'0 0 0 auto','width':'min(360px,88vw)','box-sizing':'border-box','height':'100dvh','max-height':'100dvh','border-radius':'18px 0 0 18px','padding':'18px','overflow':'auto','z-index':'var(--z-drawer,1100)','transform':'none','visibility':'visible','opacity':'1','pointer-events':'auto','display':'block'};
  // Click-to-close scrim between the header and the drawer (--z-drawer-scrim).
  let scrim=document.getElementById('ls-menu-scrim');
  if(!scrim){
    scrim=document.createElement('div');
    scrim.id='ls-menu-scrim';
    scrim.setAttribute('aria-hidden','true');
    menu.before(scrim);
  }
  const setMenu=v=>{
    scrim.classList.toggle('open',v);
    if(v)Object.entries(MENU_PROPS).forEach(([k,val])=>menu.style.setProperty(k,val,'important'));
    else Object.keys(MENU_PROPS).forEach(k=>menu.style.removeProperty(k));
    menu.classList.toggle('open',v);
    menu.setAttribute('aria-hidden',String(!v));
    open.setAttribute('aria-expanded',String(v));
    open.setAttribute('aria-label',v?'Close navigation menu':'Open navigation menu');
    document.body.style.overflow=v?'hidden':'';
    // The drawer (--z-drawer) sits above the header (--z-header) and the scrim.
    // Move focus into the drawer and back out.
    if(v)close?.focus({preventScroll:true});
    else if(menu.contains(document.activeElement))open.focus({preventScroll:true});
  };

  open.addEventListener('click',e=>{
    e.preventDefault();
    e.stopPropagation();
    setMenu(!menu.classList.contains('open'));
  });
  if(close)close.addEventListener('click',()=>setMenu(false));
  scrim.addEventListener('click',()=>setMenu(false));
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

// Shared <head> tags (icons, manifest, theme-color, social/canonical defaults)
// live in template.html marked data-ls-head. They are copied into the page head
// only where the page has no tag of its own, so page-specific SEO always wins.
// Never copies or creates robots/noindex.
const SITE_ORIGIN='https://lilsynn.com';
function headKey(el){
  if(el.tagName==='LINK')return 'link|'+(el.getAttribute('rel')||'').toLowerCase()+'|'+(el.getAttribute('sizes')||'')+'|'+(el.getAttribute('type')||'');
  const n=el.getAttribute('name')||el.getAttribute('property')||'';
  return 'meta|'+n.toLowerCase();
}
function pageHasHeadTag(el){
  return [...document.head.querySelectorAll('link,meta')].some(x=>!x.hasAttribute('data-ls-head-copied')&&headKey(x)===headKey(el));
}
function canonicalUrl(){
  let p=location.pathname;
  if(SITE_BASE&&p.startsWith(SITE_BASE))p=p.slice(SITE_BASE.length)||'/';
  p=p.replace(/\/index\.html$/i,'/').replace(/\.html$/i,'');
  if(p.length>1)p=p.replace(/\/$/,'');
  const q=/^\/release$/i.test(p)?location.search:'';
  return SITE_ORIGIN+p+q;
}
function addTemplateHeadTags(doc){
  const robots=document.head.querySelector('meta[name="robots"]')?.getAttribute('content')||'';
  const noCanonical=/noindex/i.test(robots)||/\b404\b/.test(document.title||'');
  const title=(document.title||'').trim();
  const desc=document.head.querySelector('meta[name="description"]')?.getAttribute('content')||'';
  doc.head.querySelectorAll('[data-ls-head]').forEach(src=>{
    if(/robots/i.test(src.getAttribute('name')||''))return;
    if(pageHasHeadTag(src))return;
    const role=src.getAttribute('data-ls-head');
    const el=src.cloneNode(true);
    el.removeAttribute('data-ls-head');
    el.setAttribute('data-ls-head-copied',role||'1');
    if(role==='canonical'||role==='url'){
      if(noCanonical)return;
      el.setAttribute(el.tagName==='LINK'?'href':'content',canonicalUrl());
    }else if(role==='title'){
      if(!title)return;el.setAttribute('content',title);
    }else if(role==='description'){
      if(!desc)return;el.setAttribute('content',desc);
    }else if(el.tagName==='LINK'){
      const h=el.getAttribute('href');
      if(h&&h.startsWith('/')&&!h.startsWith('//'))el.setAttribute('href',ROOT(h));
    }
    document.head.appendChild(el);
  });
}

async function injectTemplate(){
  if(document.documentElement.dataset.lsTemplateApplied==='1')return;

  try{
    const res=await fetch(TEMPLATE_URL);
    if(!res.ok)throw new Error('template fetch '+res.status);

    const html=await res.text();
    const doc=new DOMParser().parseFromString(html,'text/html');
    const header=doc.querySelector('[data-ls-global-header]');
    const menu=doc.querySelector('#ls-template-menu');
    const footer=doc.querySelector('[data-ls-global-footer]');

    if(!header||!menu||!footer)throw new Error('template shell incomplete');

    addTemplateStyles(doc);
    addTemplateHeadTags(doc);
    removeLegacyShell();

    // Pages that already ship a <main> keep it as their single landmark; only
    // bare pages get wrapped so every route exposes exactly one main region.
    const content=document.createElement(document.querySelector('main')?'div':'main');
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
    { let r=route; if(SITE_BASE&&r.startsWith(SITE_BASE.toLowerCase()))r=r.slice(SITE_BASE.length)||'/'; if(r==='/index')r='/'; document.documentElement.dataset.lsRoute=r; }
    document.documentElement.dataset.lsTemplateApplied='1';

    wireMenu(document.body);
    // Activate the hidden Metricool footer widget after the canonical footer is mounted.
    // Recreate its script node because scripts cloned from the fetched template do not execute.
    const metricoolWidget=document.querySelector('[data-metricool-tracker]');
    if(metricoolWidget&&!window.__lsMetricoolTrackerLoaded){
      const widgetScript=metricoolWidget.querySelector('script');
      if(widgetScript){
        window.__lsMetricoolTrackerLoaded=true;
        const liveScript=document.createElement('script');
        liveScript.textContent=widgetScript.textContent;
        document.body.appendChild(liveScript);
      }
    }
    document.dispatchEvent(new CustomEvent('ls-template-applied'));
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