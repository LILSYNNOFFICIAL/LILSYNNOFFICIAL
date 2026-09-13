/* LIL SYNN index2-specific global shell. Deliberately separate from site-global.js. */
(()=>{
  const root='/';
  const icon=(file,label,href)=>`<a class="ls2-icon" href="${href}" target="_blank" rel="noopener noreferrer" aria-label="${label}"><img src="/assets/images/icons/${file}" alt=""></a>`;
  const nav=[['Home','/index2.html'],['Music','/releases.html'],['Videos','#videos'],['Visuals','/gallery.html'],['Merch','https://lilsynnofficial.threadless.com/']];
  const menuNav=[['Home','/index2.html'],['Music','/releases.html'],['Archive','/archive.html'],['Visuals','/gallery.html'],['Universe','/universe.html'],['Videos','#videos'],['About','/index.html#about'],['Merch','https://lilsynnofficial.threadless.com/'],['Lyrics','https://genius.com/artists/Lil-synn'],['Contact','/index.html#contact']];
  const socials=[['youtube.svg','YouTube','https://www.youtube.com/@LILSYNNOFFICIAL'],['spotify.svg','Spotify','https://open.spotify.com/artist/6ozcOAnRAUPn3z5c0GR5kU'],['instagram.svg','Instagram','https://www.instagram.com/lilsynnofficial/'],['twitter.svg','X','https://x.com/lilsynnofficial'],['apple-music.svg','Apple Music','https://music.apple.com/us/artist/lil-synn/1850720041']];

  const injectCss=()=>{
    if(document.querySelector('link[data-ls2-css]')) return;
    const l=document.createElement('link'); l.rel='stylesheet'; l.href='/site-global2.css?v=20260914'; l.dataset.ls2Css='true'; document.head.appendChild(l);
  };

  const header=()=>`<header class="ls2-header" data-ls2-header>
    <div class="ls2-header-inner">
      <a class="ls2-brand" href="/index2.html" aria-label="LIL SYNN home"><img src="/assets/images/icons/LS_LOGO.png" alt="LIL SYNN"></a>
      <nav class="ls2-nav" aria-label="Primary navigation">${nav.map(([label,href])=>`<a href="${href}"${href.startsWith('http')?' target="_blank" rel="noopener noreferrer"':''}>${label}</a>`).join('')}</nav>
      <div class="ls2-actions">
        ${icon('spotify.svg','Spotify','https://open.spotify.com/artist/6ozcOAnRAUPn3z5c0GR5kU')}
        ${icon('youtube.svg','YouTube','https://www.youtube.com/@LILSYNNOFFICIAL')}
        ${icon('apple-music.svg','Apple Music','https://music.apple.com/us/artist/lil-synn/1850720041')}
        <span class="ls2-divider" aria-hidden="true"></span>
        <button class="ls2-menu-toggle" type="button" aria-controls="ls2-menu" aria-expanded="false" aria-label="Open menu"><span></span><span></span><span></span></button>
      </div>
    </div>
  </header>`;

  const menu=()=>`<aside class="ls2-menu" id="ls2-menu" aria-hidden="true"><div class="ls2-menu-head"><span>LIL SYNN</span><button class="ls2-menu-close" type="button" aria-label="Close menu">×</button></div><nav>${menuNav.map(([label,href])=>`<a href="${href}"${href.startsWith('http')?' target="_blank" rel="noopener noreferrer"':''}>${label}</a>`).join('')}</nav><div class="ls2-menu-socials">${socials.map(([file,label,href])=>icon(file,label,href)).join('')}</div></aside>`;

  const footer=()=>`<footer class="ls2-footer" data-ls2-footer>
    <div class="ls2-footer-inner">
      <div class="ls2-footer-mailing">
        <div class="ls2-mailing-label">JOIN THE SIGNAL</div>
        <form class="ls2-mailing-form" action="/index.html#contact" method="get" aria-label="Join the Signal mailing list">
          <input name="email" type="email" autocomplete="email" placeholder="YOUR EMAIL" aria-label="Your email address" required>
          <button type="submit" aria-label="Continue to mailing list">→</button>
        </form>
      </div>
      <div class="ls2-footer-socials">${socials.map(([file,label,href])=>icon(file,label,href)).join('')}</div>
      <div class="ls2-footer-branding"><span>LIL SYNN</span><span class="ls2-footer-rule"></span><span>OFFICIAL</span></div>
      <div class="ls2-footer-tag">MUSIC FOR A HIGHER FREQUENCY</div>
    </div>
    <div class="ls2-footer-bottom"><nav>${menuNav.slice(0,8).map(([label,href])=>`<a href="${href}"${href.startsWith('http')?' target="_blank" rel="noopener noreferrer"':''}>${label}</a>`).join('')}</nav><span>© ${new Date().getFullYear()} LIL SYNN</span></div>
  </footer>`;

  const shell=()=>{
    injectCss();
    if(!document.querySelector('[data-ls2-header]')) document.body.insertAdjacentHTML('afterbegin',header()+menu());
    if(!document.querySelector('[data-ls2-footer]')) document.body.insertAdjacentHTML('beforeend',footer());
    document.body.classList.add('ls2-shell-ready');
  };

  const menuBehavior=()=>{
    const menuEl=document.getElementById('ls2-menu'), toggle=document.querySelector('.ls2-menu-toggle'), close=document.querySelector('.ls2-menu-close');
    if(!menuEl||!toggle||toggle.dataset.ready) return;
    toggle.dataset.ready='1';
    const set=open=>{menuEl.classList.toggle('open',open);menuEl.setAttribute('aria-hidden',String(!open));toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Close menu':'Open menu');document.documentElement.classList.toggle('ls2-menu-open',open)};
    toggle.addEventListener('click',()=>set(!menuEl.classList.contains('open')));
    close?.addEventListener('click',()=>set(false));
    menuEl.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>set(false)));
    document.addEventListener('keydown',e=>{if(e.key==='Escape')set(false)});
  };

  const load=(src,check)=>{if(check&&document.querySelector(check))return;if(document.querySelector(`script[src^="${src}"]`))return;const s=document.createElement('script');s.src=`${src}?v=20260914`;s.async=false;document.body.appendChild(s)};
  const modules=()=>{
    load('/script.js');
    if(document.querySelector('#music-grid')) load('/music-random.js');
    if(document.querySelector('#presave')||document.querySelector('.latest-release-grid')) load('/latest-releases.js');
    if(document.querySelector('#youtube-grid')) load('/latest-videos.js');
    if(document.querySelector('#signal')) load('/signal-engine.js');
  };

  const mailing=()=>{const form=document.querySelector('.ls2-mailing-form');if(!form||form.dataset.ready)return;form.dataset.ready='1';form.addEventListener('submit',()=>{const input=form.querySelector('input');if(input&&input.value) localStorage.setItem('ls2MailingEmail',input.value)})};

  const ready=()=>{shell();menuBehavior();modules();mailing()};
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',ready,{once:true}); else ready();
})();
