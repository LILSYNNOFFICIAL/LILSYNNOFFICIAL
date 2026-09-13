(()=>{
  const FORUM_URL='https://suno-forum.base44.app';
  const styleId='suno-forum-nav-style';
  const addStyles=()=>{
    if(document.getElementById(styleId))return;
    const style=document.createElement('style');
    style.id=styleId;
    style.textContent='.nav-forum{height:40px;margin:auto 0 auto 8px;padding:0 14px;display:inline-flex;align-items:center;justify-content:center;border:1px solid rgba(201,154,62,.34);color:#f1cf78!important;font-size:9px;font-weight:900;letter-spacing:.15em;white-space:nowrap;transition:.2s;text-decoration:none}.nav-forum:hover{background:linear-gradient(135deg,#f0cc73,#b9842e);border-color:transparent;color:#0b0906!important;transform:translateY(-1px);box-shadow:0 12px 30px rgba(201,154,62,.12)}@media(max-width:760px){.nav-forum{height:46px;width:100%;justify-content:flex-start;margin:7px 0 0;padding:0 12px;border:1px solid rgba(201,154,62,.2)}}';
    document.head.appendChild(style);
  };
  const addForum=()=>{
    document.querySelectorAll('.site-nav').forEach(nav=>{
      if(nav.querySelector('.nav-forum'))return;
      const link=document.createElement('a');
      link.className='nav-forum';
      link.href=FORUM_URL;
      link.target='_blank';
      link.rel='noopener noreferrer';
      link.setAttribute('aria-label','Open the LIL SYNN Suno community forum');
      link.textContent='FORUM ↗';
      nav.appendChild(link);
    });
  };
  addStyles();
  addForum();
})();
