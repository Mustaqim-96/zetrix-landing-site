(function () {
  'use strict';

  var section = document.querySelector('.ai-layer');
  if (!section || !window.matchMedia) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (reduceMotion) return;

  function setActive(isActive) {
    section.classList.toggle('is-ai-active', isActive);
  }

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        setActive(entry.isIntersecting);
      });
    }, { threshold: 0.16, rootMargin: '-8% 0px -8% 0px' });

    observer.observe(section);
  } else {
    setActive(true);
  }

  if (!finePointer) return;

  Array.prototype.forEach.call(
    section.querySelectorAll('.ai-card__media-stage'),
    function (stage) {
      var frame = 0;
      var pointerX = 0;
      var pointerY = 0;

      function renderPointer() {
        frame = 0;
        stage.style.setProperty('--ai-pointer-x', (pointerX * 4).toFixed(2) + 'px');
        stage.style.setProperty('--ai-pointer-y', (pointerY * 3).toFixed(2) + 'px');
      }

      stage.addEventListener('pointermove', function (event) {
        var rect = stage.getBoundingClientRect();
        if (!rect.width || !rect.height) return;

        pointerX = Math.max(-1, Math.min(1, ((event.clientX - rect.left) / rect.width) * 2 - 1));
        pointerY = Math.max(-1, Math.min(1, ((event.clientY - rect.top) / rect.height) * 2 - 1));

        if (!frame) frame = window.requestAnimationFrame(renderPointer);
      }, { passive: true });

      stage.addEventListener('pointerleave', function () {
        pointerX = 0;
        pointerY = 0;
        if (frame) window.cancelAnimationFrame(frame);
        frame = window.requestAnimationFrame(renderPointer);
      }, { passive: true });
    }
  );
})();
