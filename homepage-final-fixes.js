/* Homepage final fixes: the homepage must use the universal shell only. */
(() => {
  const removeLegacyShell = () => {
    document.querySelectorAll('body > nav, body > header, body > #sideMenu, body > .menu, body > footer').forEach((el) => {
      if (!el.matches('[data-ls-header], [data-ls-footer]') && !el.closest('[data-ls-header], [data-ls-footer]')) el.remove();
    });
  };

  const loadUniversalShell = () => {
    if (document.querySelector('script[data-ls-global-loader]')) return;
    removeLegacyShell();
    const script = document.createElement('script');
    script.src = '/site-global.js?v=20260911';
    script.dataset.lsGlobalLoader = 'true';
    script.onload = removeLegacyShell;
    document.head.appendChild(script);
  };

  const apply = () => {
    const mobile = window.matchMedia('(max-width: 640px)').matches;
    const size = mobile ? 100 : 128;
    document.querySelectorAll('.ls-brand img[src*="LS_HEADPHONES.png"]').forEach((img) => {
      img.style.setProperty('width', `${size}px`, 'important');
      img.style.setProperty('height', `${size}px`, 'important');
      img.style.setProperty('max-width', `${size}px`, 'important');
      img.style.setProperty('max-height', `${size}px`, 'important');
      img.style.setProperty('object-fit', 'contain', 'important');
    });
  };

  loadUniversalShell();
  apply();
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', apply, { once: true });
  window.addEventListener('resize', apply, { passive: true });
  new MutationObserver(() => { removeLegacyShell(); apply(); }).observe(document.body, { childList: true, subtree: true });
})();
