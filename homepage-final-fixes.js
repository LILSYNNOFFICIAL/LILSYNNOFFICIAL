/* Homepage final fixes: preserve the universal header/menu and make the actual universal headphone mark visibly larger. */
(() => {
  const apply = () => {
    const mobile = window.matchMedia('(max-width: 640px)').matches;
    const size = mobile ? 100 : 128;
    document.querySelectorAll('.site-headphones, .ls-brand img[src*="LS_HEADPHONES.png"]').forEach((img) => {
      img.style.setProperty('width', `${size}px`, 'important');
      img.style.setProperty('height', `${size}px`, 'important');
      img.style.setProperty('max-width', `${size}px`, 'important');
      img.style.setProperty('max-height', `${size}px`, 'important');
      img.style.setProperty('object-fit', 'contain', 'important');
    });
  };

  apply();
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', apply, { once: true });
  window.addEventListener('resize', apply, { passive: true });
  new MutationObserver(apply).observe(document.body, { childList: true, subtree: true });
})();
