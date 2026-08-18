(function (root, factory) {
  var api = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (root) root.ZetrixFooterSpotlight = api;
})(typeof window !== 'undefined' ? window : null, function () {
  'use strict';

  function reset(element) {
    element.classList.remove('is-spotlight-active');
  }

  function activate(element) {
    reset(element);
    void element.offsetWidth;
    element.classList.add('is-spotlight-active');
  }

  function init(doc, win) {
    var element = doc.querySelector('[data-footer-spotlight]');
    if (!element) return function () {};

    var reducedMotion = win.matchMedia('(prefers-reduced-motion: reduce)');
    var isIntersecting = false;

    function enterSection() {
      if (reducedMotion.matches || doc.visibilityState === 'hidden') {
        reset(element);
        return;
      }
      activate(element);
    }

    function leaveSection() {
      isIntersecting = false;
      reset(element);
    }

    var observer = 'IntersectionObserver' in win
      ? new win.IntersectionObserver(function (entries) {
          var entry = entries[0];
          var nextIntersecting = Boolean(
            entry && entry.isIntersecting && entry.intersectionRatio >= 0.25
          );

          if (!nextIntersecting) {
            leaveSection();
            return;
          }

          if (!isIntersecting) {
            isIntersecting = true;
            enterSection();
          }
        }, { threshold: [0, 0.25] })
      : null;

    if (observer) {
      observer.observe(element);
    } else {
      isIntersecting = true;
      enterSection();
    }

    function onVisibilityChange() {
      if (doc.visibilityState === 'hidden') reset(element);
    }

    function onMotionChange() {
      if (reducedMotion.matches) {
        reset(element);
      } else if (isIntersecting && doc.visibilityState !== 'hidden') {
        activate(element);
      }
    }

    doc.addEventListener('visibilitychange', onVisibilityChange);
    reducedMotion.addEventListener('change', onMotionChange);

    return function cleanup() {
      if (observer) observer.disconnect();
      reset(element);
      doc.removeEventListener('visibilitychange', onVisibilityChange);
      reducedMotion.removeEventListener('change', onMotionChange);
    };
  }

  return {
    reset: reset,
    activate: activate,
    init: init
  };
});

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  window.ZetrixFooterSpotlight.init(document, window);
}
