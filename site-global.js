/* Shared visual compatibility layer. Page content remains authored in each HTML file. */
(() => {
  const init = () => {
    if (document.getElementById('lilsynn-visual-fixes')) return;

    const style = document.createElement('style');
    style.id = 'lilsynn-visual-fixes';
    style.textContent = `
      :root{--ls-pink:#ff008f;--ls-glow:#ff4fd8;--ls-panel:rgba(7,7,10,.68)}
      html{background:#050505}
      body{background:#050505!important;color:#fff!important}
      nav[aria-label="Primary navigation"],.nav{background:rgba(4,4,7,.68)!important;border-bottom:1px solid rgba(255,0,143,.28)!important;backdrop-filter:blur(18px)!important;-webkit-backdrop-filter:blur(18px)!important}
      nav[aria-label="Primary navigation"]>div,.nav-inner{max-width:1180px!important}
      nav a[aria-label="LIL SYNN home"]>span:first-child,.brand-icon{display:block!important;width:38px!important;height:38px!important;min-width:38px!important;font-size:0!important;line-height:1!important;background:url('/assets/img/LS.png') center/contain no-repeat!important}
      nav a[aria-label="LIL SYNN home"]{gap:.6rem!important}
      nav a[aria-label="LIL SYNN home"]>span:last-child{font-size:1.45rem!important;line-height:1!important}
      #hamburger,.hamb{font-size:2rem!important;line-height:1!important}
      #sideMenu,.menu{background:rgba(5,5,8,.94)!important;border-left:1px solid rgba(255,0,143,.18)}
      #sideMenu .menu-link,.menu a,.menu button{color:#fff!important}
      #sideMenu .menu-link:hover,.menu a:hover,.menu button:hover{color:var(--ls-glow)!important}

      #home{background:transparent!important;isolation:isolate}
      #home:after{content:"";position:absolute;inset:auto 5% 34px;height:170px;max-width:1040px;margin:auto;border:1px solid rgba(255,0,143,.18);border-radius:28px;background:linear-gradient(180deg,rgba(5,5,8,.25),rgba(5,5,8,.68));backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);z-index:1;pointer-events:none}
      #home>div:last-child{position:relative;z-index:3}
      #home h1{font-size:clamp(2.2rem,6vw,4rem)!important;letter-spacing:.16em!important;text-shadow:0 8px 32px rgba(0,0,0,.8)!important}
      #home p{color:#fff!important;opacity:1!important;font-weight:600!important;letter-spacing:.08em!important}
      .hero-cta-stack{position:relative;z-index:4}
      .hero-cta-row a,.hero-vote{box-shadow:0 8px 24px rgba(255,0,143,.18)}

      #presave,#music,#videos,#about,#merch,#signal,#contact{background:rgba(6,6,9,.74)!important;backdrop-filter:blur(7px)!important;-webkit-backdrop-filter:blur(7px)!important;border-top:1px solid rgba(255,255,255,.025)}
      #presave{padding-top:4.5rem!important;padding-bottom:4.5rem!important}
      #presave h2{letter-spacing:.06em!important}
      #music-grid{max-width:1100px;margin-left:auto;margin-right:auto}
      .music-card{box-shadow:0 14px 45px rgba(0,0,0,.28)!important}
      .music-card-title{letter-spacing:.02em}
      .section-subtitle{color:#c2c2c2!important}
      .about-card{background:linear-gradient(145deg,rgba(13,13,17,.94),rgba(28,0,21,.78))!important}
      .contact-box{box-shadow:0 16px 45px rgba(0,0,0,.25)}

      body:has(.hero){padding-top:72px}
      body:has(.hero) .hero{min-height:360px!important;height:360px!important;justify-content:center!important;padding:36px 24px 30px!important}
      body:has(.hero) .hero .panel{inset:18px 6% 18px!important;background:linear-gradient(180deg,rgba(5,5,8,.36),rgba(5,5,8,.72))!important;border-color:rgba(255,0,143,.2)!important;z-index:-1!important}
      body:has(.hero) .hero img{width:min(44vw,280px)!important;max-height:165px!important;margin-bottom:10px!important}
      body:has(.hero) .hero h1{font-size:clamp(2rem,5vw,3.2rem)!important}
      body:has(.hero) .hero p{font-size:clamp(1rem,2vw,1.15rem)!important;color:#fff!important}
      body:has(.hero) .content,body:has(.hero) .catalog{position:relative}
      body:has(.hero) .footer,body:has(.hero) .site-footer{background:rgba(5,5,8,.8)!important}

      .footer-social-icons a,.icons a{transition:transform .2s ease,opacity .2s ease,filter .2s ease}
      .footer-social-icons a:hover,.icons a:hover{transform:translateY(-3px) scale(1.05);opacity:1;filter:drop-shadow(0 5px 12px rgba(255,0,143,.25))}
      .footer-social-icons img,.icons img{width:36px;height:36px;object-fit:contain;display:block}

      @media(max-width:640px){
        nav a[aria-label="LIL SYNN home"]>span:first-child,.brand-icon{width:30px!important;height:30px!important;min-width:30px!important}
        nav a[aria-label="LIL SYNN home"]>span:last-child{font-size:1.15rem!important}
        #hamburger,.hamb{font-size:1.65rem!important}
        #home:after{inset:auto 4% 20px;height:145px;border-radius:22px}
        #home h1{font-size:clamp(1.9rem,9vw,2.7rem)!important}
        #home p{font-size:.95rem!important}
        body:has(.hero){padding-top:64px}
        body:has(.hero) .hero{min-height:320px!important;height:320px!important;padding:28px 18px 24px!important}
        body:has(.hero) .hero .panel{inset:12px 4% 12px!important}
        body:has(.hero) .hero img{width:min(62vw,220px)!important;max-height:135px!important}
      }
    `;
    document.head.appendChild(style);

    document.querySelectorAll('nav a[aria-label="LIL SYNN home"]>span:first-child,.brand-icon').forEach(icon => {
      icon.textContent = '';
      icon.setAttribute('aria-hidden', 'true');
    });

    document.querySelectorAll('.hero p,#home p').forEach(p => {
      if (/Dark electronic music\. Atmospheric sound\. Emotion without limits\./i.test(p.textContent.trim())) {
        p.textContent = 'Dark sound. Raw emotion. No limits';
      }
    });
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once:true });
  else init();
})();
