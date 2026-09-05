(() => {
  const unwanted = /MERCH_SHOP\.png|LATEST_RELEASES\.png|LISTEN\.png|MUSIC\.png/i;
  const lsPattern = /(?:^|\/)assets\/img\/LS\.png(?:[?#]|$)/i;
  const merchUrl = 'https://lilsynnofficial.threadless.com/';

  const cleanArt = () => {
    document.querySelectorAll('img').forEach(img => {
      if (!unwanted.test(img.getAttribute('src') || '')) return;
      const wrapper = img.closest('a');
      if (wrapper && wrapper.children.length === 1) wrapper.remove();
      else img.remove();
    });
  };

  const ensureSingleLS = () => {
    const home = document.getElementById('home');
    const heading = home?.querySelector('h1');
    if (!home || !heading) return;

    const lsImages = Array.from(home.querySelectorAll('img')).filter(img =>
      lsPattern.test(img.getAttribute('src') || '')
    );

    lsImages.slice(1).forEach(img => img.remove());

    if (lsImages.length === 0) {
      const img = document.createElement('img');
      img.src = '/assets/img/LS.png';
      img.alt = 'LIL SYNN';
      img.loading = 'eager';
      img.decoding = 'async';
      img.style.cssText = 'display:block;width:min(72vw,420px);max-height:260px;height:auto;object-fit:contain;margin:0 auto .25rem;';
      heading.parentNode.insertBefore(img, heading);
    } else {
      lsImages[0].style.marginBottom = '.25rem';
      heading.style.marginTop = '0';
    }
  };

  const ensureMerchButton = () => {
    const merch = document.getElementById('merch');
    if (!merch) return;
    let button = merch.querySelector('[data-wear-the-signal]');
    if (!button) {
      button = document.createElement('a');
      button.href = merchUrl;
      button.target = '_blank';
      button.rel = 'noopener noreferrer';
      button.dataset.wearTheSignal = 'true';
      button.textContent = 'WEAR THE SIGNAL';
      button.setAttribute('aria-label', 'Shop official LIL SYNN merch');
      button.style.cssText = 'display:inline-block;margin-top:1rem;background:#ff008f;color:#000;font-weight:700;padding:.65rem 1.5rem;border-radius:.75rem;text-decoration:none;transition:transform .2s ease,background-color .2s ease;';
      button.addEventListener('mouseenter', () => { button.style.backgroundColor = '#ff4fd8'; button.style.transform = 'scale(1.05)'; });
      button.addEventListener('mouseleave', () => { button.style.backgroundColor = '#ff008f'; button.style.transform = 'scale(1)'; });
      const heading = merch.querySelector('h2');
      if (heading?.parentNode) heading.parentNode.appendChild(button);
      else merch.appendChild(button);
    }
  };

  const bindRefresh = () => {
    const button = Array.from(document.querySelectorAll('button,a')).find(el => {
      const text = (el.textContent || '').trim().toLowerCase();
      const id = (el.id || '').toLowerCase();
      const cls = String(el.className || '').toLowerCase();
      return /random\s*song|discover/.test(text) || /random.*(song|music)|discover/.test(id + ' ' + cls);
    });
    if (!button || button.dataset.randomRefreshBound) return;
    button.dataset.randomRefreshBound = 'true';
    if (button.tagName === 'A') button.removeAttribute('href');
    button.textContent = 'Random Song Refresh';
    button.setAttribute('aria-label', 'Refresh random songs');
    button.setAttribute('type', 'button');
    button.addEventListener('click', event => {
      event.preventDefault();
      event.stopImmediatePropagation();
      const run = () => typeof window.lilSynnRefreshMusic === 'function' && window.lilSynnRefreshMusic();
      if (!run()) setTimeout(run, 300);
    }, true);
  };

  const init = () => {
    cleanArt();
    ensureSingleLS();
    ensureMerchButton();
    bindRefresh();
    new MutationObserver(() => {
      cleanArt();
      ensureSingleLS();
      ensureMerchButton();
      bindRefresh();
    }).observe(document.body, { childList: true, subtree: true });
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
