(() => {
  const unwanted = /MERCH_SHOP\.png|LATEST_RELEASES\.png|LISTEN\.png|MUSIC\.png/i;

  const removeUnwantedArt = () => {
    document.querySelectorAll('img').forEach(img => {
      const src = img.getAttribute('src') || '';
      if (unwanted.test(src)) {
        const wrapper = img.closest('a');
        if (wrapper && wrapper.children.length === 1) wrapper.remove();
        else img.remove();
      }
    });
  };

  const ensureLS = () => {
    const home = document.getElementById('home');
    const heading = home?.querySelector('h1');
    if (!home || !heading) return;
    const existing = home.querySelector('img[src*="/assets/img/LS.png"]');
    if (existing) return;
    const img = document.createElement('img');
    img.src = '/assets/img/LS.png';
    img.alt = 'LIL SYNN';
    img.loading = 'eager';
    img.decoding = 'async';
    img.style.cssText = 'display:block;width:min(72vw,420px);max-height:260px;height:auto;object-fit:contain;margin:0 auto 1.25rem;';
    heading.parentNode.insertBefore(img, heading);
  };

  const bindRandomRefresh = () => {
    const candidates = Array.from(document.querySelectorAll('button,a'));
    const refresh = candidates.find(el => {
      const t = (el.textContent || '').trim().toLowerCase();
      const id = (el.id || '').toLowerCase();
      const cls = (el.className || '').toString().toLowerCase();
      return /random\s*song|discover/.test(t) || /random.*(song|music)|discover/.test(id + ' ' + cls);
    });
    if (!refresh || refresh.dataset.randomRefreshBound) return;
    if (refresh.tagName === 'A') refresh.removeAttribute('href');
    refresh.dataset.randomRefreshBound = 'true';
    refresh.textContent = 'Random Song Refresh';
    refresh.setAttribute('aria-label', 'Refresh random songs');
    refresh.setAttribute('type', 'button');
    refresh.addEventListener('click', event => {
      event.preventDefault();
      event.stopImmediatePropagation();
      const run = () => typeof window.lilSynnRefreshMusic === 'function' && window.lilSynnRefreshMusic();
      if (!run()) setTimeout(run, 300);
    }, true);
  };

  const init = () => {
    removeUnwantedArt();
    ensureLS();
    bindRandomRefresh();
    const observer = new MutationObserver(() => {
      removeUnwantedArt();
      ensureLS();
      bindRandomRefresh();
    });
    observer.observe(document.body, { childList: true, subtree: true });
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
