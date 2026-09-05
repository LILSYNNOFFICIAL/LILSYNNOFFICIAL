(() => {
  const init = () => {
    // The homepage should use only LS.png as the section artwork.
    document.querySelectorAll('img').forEach(img => {
      const src = img.getAttribute('src') || '';
      if (/MERCH_SHOP\.png|LATEST_RELEASES\.png|LISTEN\.png|MUSIC\.png/i.test(src)) {
        const wrapper = img.closest('a');
        if (wrapper && wrapper.children.length === 1) wrapper.remove();
        else img.remove();
      }
    });

    // Rename the existing random/discover control to the exact requested label.
    const candidates = Array.from(document.querySelectorAll('button, a'));
    const refresh = candidates.find(el => {
      const t = (el.textContent || '').trim().toLowerCase();
      const id = (el.id || '').toLowerCase();
      const cls = (el.className || '').toString().toLowerCase();
      return /random\s*song|discover/.test(t) || /random.*(song|music)|discover/.test(id + ' ' + cls);
    });

    if (refresh) {
      refresh.textContent = 'Random Song Refresh';
      refresh.setAttribute('aria-label', 'Refresh random songs');
      refresh.setAttribute('type', 'button');
      refresh.addEventListener('click', event => {
        event.preventDefault();
        event.stopImmediatePropagation();
        if (typeof window.lilSynnRefreshMusic === 'function') {
          window.lilSynnRefreshMusic();
        }
      }, true);
    }
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
