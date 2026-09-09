/* Homepage final fixes: keep the universal header structure intact while making the headphone mark visibly larger. */
(() => {
  const apply = () => {
    document.querySelectorAll('.site-headphones').forEach((img) => {
      const mobile = window.matchMedia('(max-width: 640px)').matches;
      const size = mobile ? 84 : 104;
      img.style.setProperty('width', `${size}px`, 'important');
      img.style.setProperty('height', `${size}px`, 'important');
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', apply, { once: true });
  } else {
    apply();
  }

  window.addEventListener('resize', apply, { passive: true });
})();
