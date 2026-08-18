(function (root, factory) {
  'use strict';
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root && root.document) {
    root.ZetrixLayersCarousel = api;
    api.init(root.document, root);
  }
})(typeof window !== 'undefined' ? window : null, function () {
  'use strict';

  var COPY = [
    ['Blockchain', 'Verifies identity, credentials, ownership, and transactions.'],
    ['AI', 'Turns trusted data into intelligent decisions and automation.'],
    ['Robotics', 'Turns intelligent decisions into measurable real-world action.']
  ];
  var SLOT = [
    { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 },
    { x: -18, y: -34, rotate: -3, scale: .965, opacity: 1 },
    { x: 18, y: -34, rotate: 3, scale: .965, opacity: 1 }
  ];

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function ease(value) {
    value = clamp(value, 0, 1);
    return value * value * value * (value * (value * 6 - 15) + 10);
  }

  function usesStaticLayout(reducedMotion) {
    return Boolean(reducedMotion);
  }

  function handoffFrame(scrolled, total) {
    var carouselDistance = total * (2 / 3);
    var handoffDistance = total - carouselDistance;
    var handoffProgress = handoffDistance > 0 ?
      clamp((scrolled - carouselDistance) / handoffDistance, 0, 1) : 0;

    return {
      handoffProgress: handoffProgress,
      dissolveProgress: clamp(handoffProgress * 2, 0, 1)
    };
  }

  function frameFor(progress) {
    progress = clamp(progress, 0, 1);
    if (progress === 1) {
      return { step: 2, localProgress: 0, activeIndex: 2, order: [2, 0, 1] };
    }
    var raw = progress * 2;
    var step = Math.floor(raw);
    return {
      step: step,
      localProgress: raw - step,
      activeIndex: step,
      order: [step, (step + 1) % 3, (step + 2) % 3]
    };
  }

  function mix(a, b, amount) {
    return a + (b - a) * amount;
  }

  function transitionProgress(from, to, elapsed, duration) {
    var amount = duration > 0 ? clamp(elapsed / duration, 0, 1) : 1;
    return mix(from, to, ease(amount));
  }

  function poseFor(slotIndex, amount) {
    amount = clamp(amount, 0, 1);

    var targetSlot = slotIndex === 0 ? 2 : slotIndex - 1;
    var from = SLOT[slotIndex];
    var to = SLOT[targetSlot];
    var pose = {
      x: mix(from.x, to.x, amount),
      y: mix(from.y, to.y, amount),
      rotate: mix(from.rotate, to.rotate, amount),
      scale: mix(from.scale, to.scale, amount),
      opacity: mix(from.opacity, to.opacity, amount)
    };

    if (slotIndex === 0) {
      var arc = Math.sin(Math.PI * amount);
      pose.x += 210 * arc;
      pose.y += 48 * arc;
      pose.rotate += 10 * arc;
      pose.scale -= .025 * arc;
    }

    return pose;
  }

  function init(doc, win) {
    var track = doc.querySelector('[data-layers-handoff]');
    var rootElement = doc.getElementById('connected-ecosystem');
    if (!track || !rootElement) return;

    var cards = Array.prototype.slice.call(rootElement.querySelectorAll('.carousel__card'));
    var title = rootElement.querySelector('.carousel__title');
    var desc = rootElement.querySelector('.carousel__desc');
    var bars = Array.prototype.slice.call(rootElement.querySelectorAll('.carousel__progress i'));
    var prev = doc.getElementById('carousel-prev');
    var next = doc.getElementById('carousel-next');
    if (cards.length !== 3 || !title || !desc || !prev || !next) return;

    var reducedQuery = win.matchMedia ? win.matchMedia('(prefers-reduced-motion: reduce)') : null;
    var announced = -1;
    var ticking = false;
    var staticProgress = 0;
    var staticAnimation = 0;

    function isStaticLayout() {
      return usesStaticLayout(reducedQuery && reducedQuery.matches);
    }

    function setPose(card, pose, z) {
      card.style.setProperty('--card-x', pose.x + 'px');
      card.style.setProperty('--card-y', pose.y + 'px');
      card.style.setProperty('--card-rotate', pose.rotate + 'deg');
      card.style.setProperty('--card-scale', pose.scale);
      card.style.setProperty('--card-opacity', pose.opacity);
      card.style.setProperty('--card-z', z);
    }

    function render(progress) {
      staticProgress = progress;
      var frame = frameFor(progress);
      var amount = ease(frame.localProgress);
      var order = frame.order;

      order.forEach(function (cardIndex, slotIndex) {
        var pose = poseFor(slotIndex, amount);

        setPose(
          cards[cardIndex],
          pose,
          slotIndex === 0 ? (amount < 0.55 ? 4 : 1) : (slotIndex === 1 ? 3 : 2)
        );
      });

      var selected = clamp(Math.round(progress * 2), 0, 2);
      if (selected !== announced) {
        announced = selected;
        title.textContent = COPY[selected][0];
        desc.textContent = COPY[selected][1];
        bars.forEach(function (bar, index) {
          bar.classList.toggle('is-active', index === selected);
        });
        prev.disabled = selected === 0;
        next.disabled = selected === 2;
      }
    }

    function progressNow() {
      if (isStaticLayout()) {
        track.style.setProperty('--layers-exit-progress', 0);
        return announced < 0 ? 0 : announced / 2;
      }
      var rect = track.getBoundingClientRect();
      var total = track.offsetHeight - win.innerHeight;
      var scrolled = -rect.top;
      var frame = handoffFrame(scrolled, total);
      track.style.setProperty('--layers-exit-progress', frame.dissolveProgress);
      var motionDistance = total * (2 / 3);
      return motionDistance > 0 ? clamp(scrolled / motionDistance, 0, 1) : 0;
    }

    function update() {
      ticking = false;
      render(progressNow());
    }

    function requestUpdate() {
      if (!ticking) {
        ticking = true;
        win.requestAnimationFrame(update);
      }
    }

    function goTo(index) {
      index = clamp(index, 0, 2);
      if (isStaticLayout()) {
        var target = index / 2;
        staticAnimation += 1;
        var animation = staticAnimation;

        if (reducedQuery && reducedQuery.matches) {
          render(target);
          return;
        }

        var from = staticProgress;
        var started = null;
        function animate(timestamp) {
          if (animation !== staticAnimation) return;
          if (started === null) started = timestamp;
          var elapsed = timestamp - started;
          render(transitionProgress(from, target, elapsed, 800));
          if (elapsed < 800) win.requestAnimationFrame(animate);
          else render(target);
        }
        win.requestAnimationFrame(animate);
        return;
      }
      var top = win.scrollY + track.getBoundingClientRect().top;
      var total = track.offsetHeight - win.innerHeight;
      var motionDistance = total * (2 / 3);
      win.scrollTo({
        top: top + motionDistance * (index / 2),
        behavior: 'smooth'
      });
    }

    prev.addEventListener('click', function () { goTo(announced - 1); });
    next.addEventListener('click', function () { goTo(announced + 1); });
    win.addEventListener('scroll', requestUpdate, { passive: true });
    win.addEventListener('resize', requestUpdate);
    render(0);
    requestUpdate();
  }

  return {
    clamp: clamp,
    ease: ease,
    usesStaticLayout: usesStaticLayout,
    handoffFrame: handoffFrame,
    transitionProgress: transitionProgress,
    poseFor: poseFor,
    frameFor: frameFor,
    init: init
  };
});
