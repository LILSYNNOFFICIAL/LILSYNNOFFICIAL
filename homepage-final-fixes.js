(() => {
  const unwanted = /MERCH_SHOP\.png|LATEST_RELEASES\.png|LISTEN\.png|MUSIC\.png/i;
  const lsPattern = /(?:^|\/)assets\/img\/LS\.png(?:[?#]|$)/i;
  const merchUrl = 'https://lilsynnofficial.threadless.com/';
  let bgWasPlaying = false;
  let externalMediaPlaying = false;

  const fitBackgroundVideo = () => {
    const video = document.getElementById('bgVideo');
    if (!video) return;
    const mobile = window.matchMedia('(max-width: 767px)').matches;
    document.documentElement.style.setProperty('background', '#000', 'important');
    document.body.style.setProperty('background', '#000', 'important');
    video.style.setProperty('position', 'fixed', 'important');
    video.style.setProperty('top', mobile ? '56px' : '72px', 'important');
    video.style.setProperty('right', '0', 'important');
    video.style.setProperty('bottom', '0', 'important');
    video.style.setProperty('left', '0', 'important');
    video.style.setProperty('width', '100vw', 'important');
    video.style.setProperty('height', mobile ? 'calc(100dvh - 56px)' : 'calc(100vh - 72px)', 'important');
    video.style.setProperty('min-width', '0', 'important');
    video.style.setProperty('min-height', '0', 'important');
    video.style.setProperty('max-width', 'none', 'important');
    video.style.setProperty('max-height', 'none', 'important');
    video.style.setProperty('margin', '0', 'important');
    video.style.setProperty('padding', '0', 'important');
    video.style.setProperty('object-fit', mobile ? 'cover' : 'fill', 'important');
    video.style.setProperty('object-position', 'center center', 'important');
    video.style.setProperty('transform', 'none', 'important');
    video.style.setProperty('z-index', '0', 'important');
    video.style.setProperty('background', '#000', 'important');
    video.style.setProperty('display', 'block', 'important');
    video.style.setProperty('pointer-events', 'none', 'important');
  };

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
    const lsImages = Array.from(home.querySelectorAll('img')).filter(img => lsPattern.test(img.getAttribute('src') || ''));
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

  const getBgAudio = () => document.getElementById('bgMusic');

  const ensureCalmPlayer = () => {
    const audio = getBgAudio();
    if (!audio) return;
    audio.loop = true;
    audio.volume = 0.65;
    audio.setAttribute('aria-label', 'The Calm — LIL SYNN');
    audio.setAttribute('title', 'The Calm');
    audio.controls = true;
    audio.autoplay = true;
    audio.playsInline = true;
    audio.style.cssText = 'position:fixed;left:50%;bottom:10px;transform:translateX(-50%);z-index:9999;width:min(520px,calc(100vw - 24px));height:42px;display:block;border-radius:12px;filter:none;';
    let label = document.getElementById('the-calm-label');
    if (!label) {
      label = document.createElement('div');
      label.id = 'the-calm-label';
      label.textContent = 'THE CALM';
      label.style.cssText = 'position:fixed;left:50%;bottom:58px;transform:translateX(-50%);z-index:10000;font:700 11px/1.2 Arial,sans-serif;letter-spacing:.18em;color:#fff;text-shadow:0 1px 4px #000;pointer-events:none;';
      document.body.appendChild(label);
    }
  };

  const pauseBackgroundForExternalMedia = () => {
    const audio = getBgAudio();
    if (!audio) return;
    if (!audio.paused) {
      bgWasPlaying = true;
      audio.pause();
    }
    externalMediaPlaying = true;
  };

  const resumeBackgroundAfterExternalMedia = () => {
    if (!externalMediaPlaying) return;
    externalMediaPlaying = false;
    if (!bgWasPlaying) return;
    bgWasPlaying = false;
    const audio = getBgAudio();
    if (!audio) return;
    const p = audio.play();
    if (p && typeof p.catch === 'function') p.catch(() => {});
  };

  const startBackgroundMusic = () => {
    const audio = getBgAudio();
    if (!audio) return false;
    if (!audio.src || !audio.src.includes('/assets/other/sound/Background.mp3')) audio.src = '/assets/other/sound/Background.mp3';
    audio.loop = true;
    audio.volume = 0.65;
    audio.muted = false;
    audio.autoplay = true;
    audio.setAttribute('aria-label', 'The Calm — LIL SYNN');
    audio.setAttribute('title', 'The Calm');
    const promise = audio.play();
    if (promise && typeof promise.catch === 'function') promise.catch(() => {});
    return true;
  };

  const bindAudioUnlock = () => {
    if (window.__lilSynnAudioUnlockBound) return;
    window.__lilSynnAudioUnlockBound = true;
    const unlockFromScroll = () => {
      if (!externalMediaPlaying) startBackgroundMusic();
      if ('mediaSession' in navigator && 'MediaMetadata' in window) {
        navigator.mediaSession.metadata = new MediaMetadata({ title: 'The Calm', artist: 'LIL SYNN', album: 'The Calm' });
      }
    };
    window.addEventListener('scroll', unlockFromScroll, { passive: true });
    window.addEventListener('wheel', unlockFromScroll, { passive: true });
    window.addEventListener('touchmove', unlockFromScroll, { passive: true });
    window.addEventListener('touchstart', unlockFromScroll, { passive: true });
  };

  const loadScript = (src, id) => {
    if (document.getElementById(id)) return;
    const script = document.createElement('script');
    script.id = id;
    script.src = src;
    script.async = true;
    document.head.appendChild(script);
  };

  const bindYouTubePlayers = () => {
    const frames = Array.from(document.querySelectorAll('iframe[src*="youtube.com"], iframe[src*="youtube-nocookie.com"]'));
    if (!frames.length) return;
    frames.forEach(frame => {
      const src = frame.getAttribute('src') || '';
      if (!/[?&]enablejsapi=1(?:&|$)/.test(src)) {
        const joiner = src.includes('?') ? '&' : '?';
        frame.setAttribute('src', src + joiner + 'enablejsapi=1');
      }
    });
    if (!window.YT || !window.YT.Player) {
      window.onYouTubeIframeAPIReady = bindYouTubePlayers;
      loadScript('https://www.youtube.com/iframe_api', 'lil-synn-youtube-api');
      return;
    }
    frames.forEach(frame => {
      if (frame.dataset.lilSynnYouTubeBound) return;
      frame.dataset.lilSynnYouTubeBound = 'true';
      try {
        new YT.Player(frame, {
          events: {
            onStateChange: event => {
              if (event.data === YT.PlayerState.PLAYING) pauseBackgroundForExternalMedia();
              else if (event.data === YT.PlayerState.ENDED || event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.CUED) resumeBackgroundAfterExternalMedia();
            }
          }
        });
      } catch (_) {}
    });
  };

  const bindSpotifyPlayers = () => {
    const frames = Array.from(document.querySelectorAll('iframe[src*="open.spotify.com"]')).filter(frame => !frame.closest('[data-lil-synn-spotify-container]'));
    if (!frames.length) return;
    const initSpotify = api => {
      frames.forEach(frame => {
        if (!frame.isConnected || frame.closest('[data-lil-synn-spotify-container]')) return;
        const originalSrc = frame.getAttribute('src');
        if (!originalSrc) return;
        const width = frame.getAttribute('width') || '100%';
        const height = frame.getAttribute('height') || '152';
        const container = document.createElement('div');
        container.setAttribute('data-lil-synn-spotify-container', 'true');
        container.style.width = width === '100%' ? '100%' : width + (String(width).match(/%|px$/) ? '' : 'px');
        container.style.maxWidth = '100%';
        container.style.minHeight = height + (String(height).match(/%|px$/) ? '' : 'px');
        container.style.borderRadius = frame.style.borderRadius || '12px';
        frame.parentNode.replaceChild(container, frame);
        try {
          api.createController(container, { url: originalSrc, width, height }, controller => {
            container.dataset.lilSynnSpotifyBound = 'true';
            controller.addListener('playback_started', () => pauseBackgroundForExternalMedia());
            controller.addListener('playback_update', event => {
              const data = event?.data || {};
              if (data.isPaused === false) pauseBackgroundForExternalMedia();
              else if (data.isPaused === true) resumeBackgroundAfterExternalMedia();
            });
          });
        } catch (_) {
          const restored = document.createElement('iframe');
          restored.src = originalSrc;
          restored.width = width;
          restored.height = height;
          restored.setAttribute('allow', 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture');
          restored.setAttribute('allowfullscreen', '');
          restored.style.cssText = 'border-radius:12px;width:100%;max-width:100%;border:0;';
          container.replaceWith(restored);
        }
      });
    };
    if (window.SpotifyIframeApi) initSpotify(window.SpotifyIframeApi);
    else {
      window.onSpotifyIframeApiReady = initSpotify;
      loadScript('https://open.spotify.com/embed/iframe-api/v1', 'lil-synn-spotify-api');
    }
  };

  const bindExternalPlayers = () => {
    bindYouTubePlayers();
    bindSpotifyPlayers();
  };

  const init = () => {
    fitBackgroundVideo();
    cleanArt();
    ensureSingleLS();
    ensureMerchButton();
    bindRefresh();
    ensureCalmPlayer();
    startBackgroundMusic();
    bindAudioUnlock();
    bindExternalPlayers();
    window.addEventListener('resize', fitBackgroundVideo, { passive: true });
    window.addEventListener('orientationchange', fitBackgroundVideo, { passive: true });
    new MutationObserver(() => {
      fitBackgroundVideo();
      cleanArt();
      ensureSingleLS();
      ensureMerchButton();
      bindRefresh();
      ensureCalmPlayer();
      bindExternalPlayers();
    }).observe(document.body, { childList: true, subtree: true });
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();