(function (root, factory) {
  var api = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (root) root.ZetrixRibbonFlowMotion = api;
})(typeof window !== 'undefined' ? window : null, function () {
  'use strict';

  function clamp(value) {
    return Math.min(Math.max(value, 0), 1);
  }

  function progressFromSections(toolsTop, roboticsBottom, viewportHeight, startVisible) {
    var viewport = Math.max(viewportHeight, 1);
    var visible = clamp(startVisible);
    var startLine = (1 - visible) * viewport;
    var span = Math.max((roboticsBottom - toolsTop) - visible * viewport, 1);
    return clamp((startLine - toolsTop) / span);
  }

  function revealMetrics(startY, endY, progress, fadeHeight) {
    var amount = clamp(progress);
    if (amount === 0) return { bodyHeight: 0, edgeY: 0, edgeHeight: 0 };

    var start = Math.max(startY, 0);
    var end = Math.max(endY, start + 1);
    var headY = start + (end - start) * amount;
    var edgeHeight = Math.min(Math.max(fadeHeight, 0), headY);
    var edgeY = Math.max(headY - edgeHeight, 0);
    return { bodyHeight: edgeY, edgeY: edgeY, edgeHeight: edgeHeight };
  }

  function init(doc, win) {
    var flow = doc.querySelector('[data-ribbon-flow]');
    var tools = doc.querySelector('[data-tools-track]');
    var robotics = doc.querySelector('.robotics');
    var path = doc.querySelector('.ribbon-flow__path');
    var body = doc.querySelector('.ribbon-flow__reveal-body');
    var edge = doc.querySelector('.ribbon-flow__reveal-edge');
    if (!flow || !tools || !robotics || !path || !body || !edge || !win.matchMedia) return function () {};

    var motion = win.matchMedia('(prefers-reduced-motion: no-preference)');
    var frame = 0;

    function clearPathStyles() {
      path.style.removeProperty('stroke-dasharray');
      path.style.removeProperty('stroke-dashoffset');
    }

    function reset() {
      if (frame) win.cancelAnimationFrame(frame);
      frame = 0;
      clearPathStyles();
      renderReveal(1);
    }

    function renderReveal(progress) {
      var metrics = revealMetrics(100, 3100, progress, 220);
      body.setAttribute('height', String(metrics.bodyHeight));
      edge.setAttribute('y', String(metrics.edgeY));
      edge.setAttribute('height', String(metrics.edgeHeight));
    }

    function render() {
      frame = 0;
      if (!motion.matches) {
        renderReveal(1);
        return;
      }

      var toolsRect = tools.getBoundingClientRect();
      var roboticsRect = robotics.getBoundingClientRect();
      var progress = progressFromSections(toolsRect.top, roboticsRect.bottom, win.innerHeight, 0.4);
      renderReveal(progress);
    }

    function schedule() {
      if (!frame && motion.matches) frame = win.requestAnimationFrame(render);
    }

    function onScroll() {
      schedule();
    }

    function onResize() {
      schedule();
    }

    function onModeChange() {
      if (!motion.matches) {
        reset();
        return;
      }
      schedule();
    }

    if (motion.matches) schedule();
    else renderReveal(1);

    win.addEventListener('scroll', onScroll, { passive: true });
    win.addEventListener('resize', onResize);
    motion.addEventListener('change', onModeChange);

    return function cleanup() {
      reset();
      win.removeEventListener('scroll', onScroll);
      win.removeEventListener('resize', onResize);
      motion.removeEventListener('change', onModeChange);
    };
  }

  return {
    clamp: clamp,
    progressFromSections: progressFromSections,
    revealMetrics: revealMetrics,
    init: init
  };
});

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  window.ZetrixRibbonFlowMotion.init(document, window);
}
