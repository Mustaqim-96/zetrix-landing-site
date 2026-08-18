(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else {
    root.HeroEcosystemHandoff = api;
    if (root.document) api.init(root.document, root);
  }
})(typeof window !== 'undefined' ? window : this, function () {
  'use strict';

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function frameFor(ecosystemTop, viewportHeight, coverHeight) {
    var height = Math.max(
      typeof coverHeight === 'number' ? coverHeight : (viewportHeight || 0),
      1
    );
    var coverProgress = clamp(1 - ecosystemTop / height, 0, 1);
    return {
      coverProgress: coverProgress,
      exitProgress: clamp(coverProgress / 0.5, 0, 1)
    };
  }

  function usesStaticLayout(win) {
    return !win.matchMedia ||
      win.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function init(doc, win) {
    var hero = doc.querySelector('.hero');
    var ecosystem = doc.querySelector('.ecosystem');
    if (!hero || !ecosystem || !win.requestAnimationFrame) return function () {};

    var frameId = 0;
    var ticking = false;
    var disposed = false;

    function reset() {
      hero.style.setProperty('--hero-eco-sticky-top', '0px');
      hero.style.setProperty('--hero-eco-exit-progress', '0');
    }

    function update() {
      frameId = 0;
      ticking = false;
      if (disposed) return;
      if (usesStaticLayout(win)) {
        reset();
        return;
      }

      var ecosystemTop = ecosystem.getBoundingClientRect().top;
      var stickyTop = Math.min(win.innerHeight - hero.offsetHeight, 0);
      var coverHeight = Math.min(win.innerHeight, hero.offsetHeight);
      var frame = frameFor(ecosystemTop, win.innerHeight, coverHeight);
      hero.style.setProperty('--hero-eco-sticky-top', stickyTop + 'px');
      hero.style.setProperty('--hero-eco-exit-progress', frame.exitProgress.toFixed(4));
    }

    function requestUpdate() {
      if (disposed || ticking) return;
      ticking = true;
      frameId = win.requestAnimationFrame(update);
    }

    function onVisibilityChange() {
      if (doc.hidden) {
        if (frameId && win.cancelAnimationFrame) win.cancelAnimationFrame(frameId);
        frameId = 0;
        ticking = false;
      } else {
        requestUpdate();
      }
    }

    function cleanup() {
      if (disposed) return;
      disposed = true;
      win.removeEventListener('scroll', requestUpdate);
      win.removeEventListener('resize', requestUpdate);
      win.removeEventListener('pagehide', cleanup);
      doc.removeEventListener('visibilitychange', onVisibilityChange);
      if (frameId && win.cancelAnimationFrame) win.cancelAnimationFrame(frameId);
      frameId = 0;
      ticking = false;
      reset();
    }

    win.addEventListener('scroll', requestUpdate, { passive: true });
    win.addEventListener('resize', requestUpdate);
    win.addEventListener('pagehide', cleanup, { once: true });
    doc.addEventListener('visibilitychange', onVisibilityChange);
    requestUpdate();
    return cleanup;
  }

  return {
    clamp: clamp,
    frameFor: frameFor,
    usesStaticLayout: usesStaticLayout,
    init: init
  };
});
