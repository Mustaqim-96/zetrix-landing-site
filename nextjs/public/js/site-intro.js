(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else if (root && root.document) api.init(root.document, root);
})(typeof window !== 'undefined' ? window : this, function () {
  'use strict';

  function destinationTransform(sourceRect, targetRect) {
    return {
      x: targetRect.left - sourceRect.left,
      y: targetRect.top - sourceRect.top,
      scaleX: targetRect.width / sourceRect.width,
      scaleY: targetRect.height / sourceRect.height
    };
  }

  function createCompletionSignal(win) {
    var sent = false;
    return function signal() {
      if (sent) return false;
      sent = true;
      if (win && typeof win.dispatchEvent === 'function' &&
          typeof win.CustomEvent === 'function') {
        win.dispatchEvent(new win.CustomEvent('zetrix:intro-complete'));
      }
      return true;
    };
  }

  function init(doc, win) {
    var signalComplete = createCompletionSignal(win);
    var root = doc.documentElement;
    var overlay = doc.querySelector('[data-site-intro]');
    var movingLogo = doc.querySelector('[data-site-intro-logo]');
    // Measure the wrapper, not a specific <img>: light/dark logo variants toggle
    // with display:none, and a hidden img would report zero size and abort handoff.
    var navLogo = doc.querySelector('.nav__logo');

    if (!root.classList.contains('site-intro-pending') || !overlay || !movingLogo || !navLogo) {
      root.classList.remove('site-intro-pending');
      if (overlay) overlay.remove();
      signalComplete();
      return function () {};
    }

    if (win.__zetrixIntroFailsafe) win.clearTimeout(win.__zetrixIntroFailsafe);

    var reduced = win.matchMedia &&
      win.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var animations = [];
    var timers = [];
    var finished = false;
    var hardStop = win.setTimeout(cleanup, 3200);

    function wait(delay) {
      return new Promise(function (resolve) {
        timers.push(win.setTimeout(resolve, delay));
      });
    }

    function cleanup() {
      if (finished) return;
      finished = true;
      win.clearTimeout(hardStop);
      timers.forEach(function (timer) { win.clearTimeout(timer); });
      animations.forEach(function (animation) {
        try { animation.cancel(); } catch (error) {}
      });
      doc.removeEventListener('visibilitychange', onVisibilityChange);
      win.removeEventListener('pagehide', cleanup);
      root.classList.remove('site-intro-pending');
      movingLogo.style.removeProperty('transform');
      overlay.remove();
      signalComplete();
    }

    function onVisibilityChange() {
      if (doc.hidden) cleanup();
    }

    async function run() {
      try {
        doc.addEventListener('visibilitychange', onVisibilityChange);
        win.addEventListener('pagehide', cleanup, { once: true });

        if (reduced || !movingLogo.animate) {
          overlay.classList.add('is-logo-visible', 'is-reduced');
          await wait(250);
          cleanup();
          return;
        }

        movingLogo.style.transform = 'scale(.96)';
        win.requestAnimationFrame(function () {
          overlay.classList.add('is-logo-visible');
          movingLogo.style.transform = 'scale(1)';
        });
        await wait(550);

        overlay.classList.add('is-brand');
        await wait(600);
        await wait(400);

        var sourceRect = movingLogo.getBoundingClientRect();
        var targetRect = navLogo.getBoundingClientRect();
        if (!sourceRect.width || !targetRect.width) return cleanup();
        var target = destinationTransform(sourceRect, targetRect);

        overlay.classList.add('is-handoff');
        var handoff = movingLogo.animate([
          { transform: 'translate3d(0, 0, 0) scale(1, 1)' },
          { transform: 'translate3d(' + target.x + 'px, ' + target.y +
              'px, 0) scale(' + target.scaleX + ', ' + target.scaleY + ')' }
        ], {
          duration: 750,
          easing: 'cubic-bezier(.16, 1, .3, 1)',
          fill: 'forwards'
        });
        animations.push(handoff);
        await handoff.finished;

        overlay.classList.add('is-settling');
        await wait(100);
        cleanup();
      } catch (error) { cleanup(); }
    }

    run();
    return cleanup;
  }

  return {
    destinationTransform: destinationTransform,
    createCompletionSignal: createCompletionSignal,
    init: init
  };
});
