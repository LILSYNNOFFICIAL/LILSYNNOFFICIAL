/* LIL SYNN universal site shell. One header, one menu, one footer, every page. */
(() => {
  const socials = [
    ['YouTube','https://www.youtube.com/@LILSYNNOFFICIAL','youtube.svg'],
    ['Spotify','https://open.spotify.com/artist/6ozcOAnRAUPn3z5c0GR5kU','spotify.svg'],
    ['Apple Music','https://music.apple.com/us/artist/lil-synn/1850720041','apple-music.svg'],
    ['Instagram','https://www.instagram.com/lilsynnofficial/','instagram.svg'],
    ['X / Twitter','https://x.com/lilsynnofficial','twitter.svg'],
    ['SoundCloud','https://soundcloud.com/lilsynnofficial','soundcloud.svg'],
    ['TikTok','https://www.tiktok.com/@lilsynnofficial','tiktok.svg'],
    ['Facebook','https://www.facebook.com/lilsynnofficial','facebook.svg']
  ];
  const streams = [
    ['Spotify','https://open.spotify.com/artist/6ozcOAnRAUPn3z5c0GR5kU'],
    ['Apple Music','https://music.apple.com/us/artist/lil-synn/1850720041'],
    ['YouTube','https://www.youtube.com/@LILSYNNOFFICIAL'],
    ['YouTube Music','https://music.youtube.com/@LILSYNNOFFICIAL'],
    ['TIDAL','https://tidal.com/artist/69300200'],
    ['Amazon Music','https://music.amazon.com/artists/B0FZB8RWV8/lil-synn']
  ];
  const nav = [
    ['Home','/'],['Music','/#music'],['Releases','/releases.html'],['Videos','/#videos'],
    ['About','/#about'],['Merch','https://lilsynnofficial.threadless.com/','external'],
    ['Lyrics','https://genius.com/artists/Lil-synn','external'],['Contact','/#contact']
  ];

  const external = (href, extra='') => extra === 'external' ? ` target="_blank" rel="noopener noreferrer"` : '';
  const links = items => items.map(item => `<a href="${item[1]}"${external(item[1],item[2])}>${item[0]}</a>`).join('');
  const socialLinks = socials.map(([label,href]) => `<a href="${href}" target="_blank" rel="noopener noreferrer">${label}</a>`).join('');
  const streamLinks = links(streams);

  const headerMarkup = () => `
    <header class="ls-header" data-ls-header>
      <div class="ls-header-inner">
        <a class="ls-brand" href="/" aria-label="LIL SYNN home">
          <img src="/assets/img/LS.png" alt="" aria-hidden="true">
          <span>LIL SYNN</span>
        </a>
        <button class="ls-menu-toggle" type="button" aria-label="Open navigation" aria-controls="ls-site-menu" aria-expanded="false">☰</button>
      </div>
    </header>
    <aside class="ls-menu" id="ls-site-menu" aria-label="Site menu" aria-hidden="true">
      <div class="ls-menu-head"><button class="ls-menu-close" type="button" aria-label="Close navigation">&times;</button></div>
      <nav class="ls-menu-nav" aria-label="Primary navigation">
        ${links(nav)}
        <div class="ls-menu-group">
          <button type="button" aria-expanded="false">Socials</button>
          <div class="ls-menu-drop">${socialLinks}</div>
        </div>
        <div class="ls-menu-group">
          <button type="button" aria-expanded="false">Stream</button>
          <div class="ls-menu-drop">${streamLinks}</div>
        </div>
      </nav>
    </aside>`;

  const footerMarkup = () => `
    <footer class="ls-footer" data-ls-footer>
      <div class="ls-footer-brand">LIL SYNN</div>
      <div class="ls-footer-tag">Dark sound. Raw emotion. No limits</div>
      <nav class="ls-footer-links" aria-label="Footer navigation">${links(nav)}<a href="/#signal">SYNN SIGNAL</a><a href="/special_access.html">Special Access</a></nav>
      <div class="ls-footer-socials" aria-label="Social profiles">
        ${socials.map(([label,href,file]) => `<a href="${href}" target="_blank" rel="noopener noreferrer" aria-label="${label}" title="${label}"><img src="/assets/images/icons/${file}" alt="${label}"></a>`).join('')}
      </div>
      <nav class="ls-footer-legal" aria-label="Legal navigation"><a href="/privacy.html">Privacy</a><a href="/terms.html">Terms</a></nav>
      <div class="ls-footer-copy">© ${new Date().getFullYear()} LIL SYNN</div>
    </footer>`;

  const ensureMeta = () => {
    const path = location.pathname.split('/').pop() || 'index.html';
    const titles = {
      'index.html':'LIL SYNN | Official Website',
      'releases.html':'LIL SYNN | Releases',
      'special_access.html':'LIL SYNN | Special Access',
      'privacy.html':'Privacy | LIL SYNN',
      'terms.html':'Terms | LIL SYNN',
      '404.html':'404 | LIL SYNN'
    };
    if (titles[path] && !document.title) document.title = titles[path];
    const description = document.querySelector('meta[name="description"]') || (() => { const m=document.createElement('meta');m.name='description';document.head.appendChild(m);return m; })();
    if (!description.content) description.content = 'Official LIL SYNN website for music, releases, videos, visuals, merchandise, and the SYNN SIGNAL.';
    const canonical = document.querySelector('link[rel="canonical"]') || (() => { const l=document.createElement('link');l.rel='canonical';document.head.appendChild(l);return l; })();
    canonical.href = location.origin + location.pathname.replace(/index\.html$/,'');
  };

  const shell = () => {
    if (document.getElementById('site-global-css')) return;
    const css=document.createElement('link');css.id='site-global-css';css.rel='stylesheet';css.href='/site-global.css?v=20260908';document.head.appendChild(css);
  };

  const replaceShell = () => {
    document.querySelectorAll('[data-ls-header],.ls-header').forEach(el=>el.remove());
    document.querySelectorAll('[data-ls-footer],.ls-footer').forEach(el=>el.remove());
    document.querySelectorAll('body > nav.nav, body > nav[aria-label="Primary navigation"]').forEach(el=>el.remove());
    document.querySelectorAll('body > #sideMenu, body > .menu').forEach(el=>el.remove());
    document.querySelectorAll('body > footer').forEach(el=>el.remove());
    document.body.insertAdjacentHTML('afterbegin',headerMarkup());
    document.body.insertAdjacentHTML('beforeend',footerMarkup());
    document.body.classList.add('ls-shell-ready');
  };

  const initMenu = () => {
    const root=document.getElementById('ls-site-menu');
    const toggle=document.querySelector('.ls-menu-toggle');
    const close=document.querySelector('.ls-menu-close');
    if(!root||!toggle)return;
    const setOpen=open=>{
      root.classList.toggle('open',open);
      root.setAttribute('aria-hidden',String(!open));
      toggle.setAttribute('aria-expanded',String(open));
      toggle.setAttribute('aria-label',open?'Close navigation':'Open navigation');
      document.documentElement.style.overflow=open?'hidden':'';
      if(!open)root.querySelectorAll('.ls-menu-group').forEach(g=>{g.classList.remove('open');g.querySelector('button')?.setAttribute('aria-expanded','false');});
    };
    toggle.addEventListener('click',()=>setOpen(!root.classList.contains('open')));
    close?.addEventListener('click',()=>setOpen(false));
    root.querySelectorAll('.ls-menu-group > button').forEach(button=>button.addEventListener('click',()=>{const group=button.parentElement;const open=!group.classList.contains('open');root.querySelectorAll('.ls-menu-group').forEach(g=>{g.classList.remove('open');g.querySelector('button')?.setAttribute('aria-expanded','false');});group.classList.toggle('open',open);button.setAttribute('aria-expanded',String(open));}));
    root.addEventListener('click',e=>{if(e.target.closest('a'))setOpen(false);});
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&root.classList.contains('open'))setOpen(false);});
    setOpen(false);
  };

  const normalizeLegacy = () => {
    document.querySelectorAll('.hero p,#home p').forEach(p=>{if(/Dark electronic music\. Atmospheric sound\. Emotion without limits\./i.test(p.textContent.trim()))p.textContent='Dark sound. Raw emotion. No limits';});
    const latest=document.getElementById('latest-release-title');
    if(latest&&/HELLO GOODBYE/i.test(latest.textContent.trim()))latest.textContent='Never Known';
    const latestArt=document.querySelector('#latest-release-art img');
    if(latestArt&&/heal2\.png/i.test(latestArt.getAttribute('src')||'')){latestArt.src='/assets/images/icons/album_art/Never Known_album_cover.jpg';latestArt.alt='LIL SYNN — Never Known artwork';}
  };

  const init = () => {
    shell();
    ensureMeta();
    replaceShell();
    initMenu();
    normalizeLegacy();
    document.querySelectorAll('a[target="_blank"]').forEach(a=>{if(!a.rel)a.rel='noopener noreferrer';});
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();