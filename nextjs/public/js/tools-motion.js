(function (root, factory) {
  var api = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (root) root.ZetrixToolsMotion = api;
})(typeof window !== 'undefined' ? window : null, function () {
  'use strict';

  function resetAssembly(pin) {
    pin.classList.remove(
      'is-cubes-visible',
      'is-cubes-assembled',
      'is-cube-assembly-complete',
      'is-float-active'
    );
  }

  function showAssembly(pin, reducedMotion) {
    resetAssembly(pin);
    pin.classList.add('is-cubes-visible');
    if (reducedMotion) {
      pin.classList.add('is-cubes-assembled', 'is-cube-assembly-complete');
    }
  }

  function setFloatActive(pin, isIntersecting, isVisible, isEnabled, isAssembled) {
    var active = Boolean(isIntersecting && isVisible && isEnabled && isAssembled);
    pin.classList.toggle('is-float-active', active);
    return active;
  }

  function init(doc, win) {
    var track = doc.querySelector('[data-tools-track]');
    var pin = track && track.querySelector('.tools__pin');
    if (!track || !pin) return function () {};

    var entryMotion = win.matchMedia('(prefers-reduced-motion: no-preference)');
    var ambientMotion = win.matchMedia('(min-width: 1024px) and (prefers-reduced-motion: no-preference)');
    var isIntersecting = false;
    var assemblyComplete = false;
    var assemblyTimer = 0;
    var assemblyFrame = 0;

    function clearPending() {
      if (assemblyTimer) win.clearTimeout(assemblyTimer);
      if (assemblyFrame) win.cancelAnimationFrame(assemblyFrame);
      assemblyTimer = 0;
      assemblyFrame = 0;
    }

    function syncFloatState() {
      setFloatActive(pin, isIntersecting, doc.visibilityState !== 'hidden', ambientMotion.matches, assemblyComplete);
    }

    function completeAssembly() {
      assemblyTimer = 0;
      if (!isIntersecting) return;
      assemblyComplete = true;
      pin.classList.add('is-cube-assembly-complete');
      syncFloatState();
    }

    function leaveSection() {
      isIntersecting = false;
      assemblyComplete = false;
      clearPending();
      resetAssembly(pin);
    }

    function enterSection() {
      isIntersecting = true;
      assemblyComplete = false;
      clearPending();
      showAssembly(pin, !entryMotion.matches);
      if (!entryMotion.matches) {
        assemblyComplete = true;
        syncFloatState();
        return;
      }

      assemblyFrame = win.requestAnimationFrame(function startAssembly() {
        assemblyFrame = 0;
        if (!isIntersecting) return;
        pin.classList.add('is-cubes-assembled');
      assemblyTimer = win.setTimeout(completeAssembly, 1800);
      });
    }

    var observer = 'IntersectionObserver' in win
      ? new win.IntersectionObserver(function (entries) {
          var entry = entries[0];
          if (!entry) {
            leaveSection();
            syncFloatState();
            return;
          }
          if (!entry.isIntersecting) {
            leaveSection();
            syncFloatState();
            return;
          }
          if (entry.intersectionRatio >= 0.25) enterSection();
          syncFloatState();
        }, { threshold: [0, 0.25] })
      : null;

    if (observer) observer.observe(track);
    else enterSection();

    function onVisibilityChange() {
      syncFloatState();
    }

    function onEntryMotionChange() {
      if (isIntersecting) enterSection();
      syncFloatState();
    }

    function onAmbientMotionChange() {
      syncFloatState();
    }

    doc.addEventListener('visibilitychange', onVisibilityChange);
    entryMotion.addEventListener('change', onEntryMotionChange);
    ambientMotion.addEventListener('change', onAmbientMotionChange);

    return function cleanup() {
      if (observer) observer.disconnect();
      clearPending();
      resetAssembly(pin);
      doc.removeEventListener('visibilitychange', onVisibilityChange);
      entryMotion.removeEventListener('change', onEntryMotionChange);
      ambientMotion.removeEventListener('change', onAmbientMotionChange);
    };
  }

  return {
    resetAssembly: resetAssembly,
    showAssembly: showAssembly,
    setFloatActive: setFloatActive,
    init: init
  };
});

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  window.ZetrixToolsMotion.init(document, window);
}
