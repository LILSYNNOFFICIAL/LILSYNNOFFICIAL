(()=>{
  // The promoted THE SIGNAL homepage owns its header/navigation and hero layout.
  // Keep the legacy universal shell off this page and apply only the final visual tuning.
  const install=()=>{
    if(document.getElementById('homepage-final-fix-css')) return;
    const style=document.createElement('style');
    style.id='homepage-final-fix-css';
    style.textContent=`
      /* HERO: crop upward so Synn's head dominates the frame. */
      .hero>.hero-webm{
        top:60px!important;
        height:52%!important;
        object-position:center top!important;
        transform:scale(1.10)!important;
      }

      /* STARS: begin directly where the hero WebM ends and remain visible. */
      .hero>.hero-stars{
        top:calc(60px + 52%)!important;
        bottom:auto!important;
        height:48%!important;
        object-position:center top!important;
        opacity:.84!important;
        filter:brightness(.72) contrast(1.15)!important;
      }

      .hero:before{
        inset:60px 0 0!important;
        background:linear-gradient(180deg,rgba(2,2,4,.03),rgba(2,2,4,.08) 48%,rgba(2,2,4,.34) 78%,rgba(2,2,4,.72) 100%)!important;
      }

      /* UNIVERSE: center the complete orbital assembly and move it lower. */
      .universe-layout>.orbit-stage{
        grid-column:1 / -1!important;
        justify-self:center!important;
        margin:88px auto 0!important;
      }

      @media(max-width:800px){
        .hero>.hero-webm{
          top:62px!important;
          height:47%!important;
          object-position:center top!important;
          transform:scale(1.12)!important;
        }
        .hero>.hero-stars{
          top:calc(62px + 47%)!important;
          bottom:auto!important;
          height:47%!important;
          opacity:.84!important;
        }
        .hero:before{inset:62px 0 0!important}
        .universe-layout>.orbit-stage{margin:70px auto 0!important}
      }

      @media(max-width:480px){
        .hero>.hero-webm{
          top:56px!important;
          height:45%!important;
          transform:scale(1.14)!important;
        }
        .hero>.hero-stars{
          top:calc(56px + 45%)!important;
          height:49%!important;
          opacity:.86!important;
        }
        .hero:before{inset:56px 0 0!important}
        .universe-layout>.orbit-stage{margin-top:58px!important}
      }
    `;
    document.head.appendChild(style);
  };
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',install,{once:true});
  else install();
})();
