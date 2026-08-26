(function (root, factory) {
  'use strict';
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root && root.document) {
    root.ZetrixRoboticsCarousel = api;
    api.init(root.document, root);
  }
})(typeof window !== 'undefined' ? window : null, function () {
  'use strict';

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function nextIndex(current, delta, total) {
    return clamp(current + delta, 0, Math.max(total - 1, 0));
  }

  function statusText(index, total) {
    function pad(value) { return String(value).padStart(2, '0'); }
    return pad(index + 1) + ' / ' + pad(total);
  }

  function progressState(index, total) {
    var state = [];
    for (var item = 0; item < total; item += 1) state.push(item === index);
    return state;
  }

  function visibleCount(isTablet) {
    return isTablet ? 2 : 1;
  }

  function lastIndex(total, visible) {
    return Math.max(total - visible, 0);
  }

  function rangeStatusText(index, visible, total) {
    function pad(value) { return String(value).padStart(2, '0'); }
    var start = index + 1;
    var end = Math.min(index + visible, total);
    return pad(start) + '–' + pad(end) + ' / ' + pad(total);
  }

  function init(doc, win) {
    var rootElement = doc.querySelector('[data-robotics-carousel]');
    if (!rootElement || !win.matchMedia) return;

    var track = rootElement.querySelector('.robot-cards');
    var cards = Array.prototype.slice.call(rootElement.querySelectorAll('.robot-card'));
    var prev = doc.getElementById('robotics-prev');
    var next = doc.getElementById('robotics-next');
    var status = doc.getElementById('robotics-status');
    var bars = Array.prototype.slice.call(rootElement.querySelectorAll('.robotics__progress i'));
    if (!track || !cards.length || !prev || !next || !status) return;

    var narrowQuery = win.matchMedia('(max-width: 1279px)');
    var tabletQuery = win.matchMedia('(min-width: 768px) and (max-width: 1279px)');
    var current = 0;
    var ticking = false;

    function render(index, shouldScroll) {
      var visible = visibleCount(tabletQuery.matches);
      var maximum = lastIndex(cards.length, visible);
      current = clamp(index, 0, maximum);
      prev.disabled = current === 0;
      next.disabled = current === maximum;
      status.textContent = tabletQuery.matches
        ? rangeStatusText(current, visible, cards.length)
        : statusText(current, cards.length);
      bars.forEach(function (bar) { bar.classList.remove('is-active'); });
      progressState(current, maximum + 1).forEach(function (active, index) {
        if (bars[index]) bars[index].classList.toggle('is-active', active);
      });

      if (shouldScroll && narrowQuery.matches) {
        // A smooth scrollIntoView / scrollTo never lands on this snap-mandatory
        // flex track (the snap container resets the pending animation), so the
        // card never moves on a button press. Jump instantly instead. offsetLeft
        // is relative to the track, so aligning the card to the track's start
        // brings it into view.
        var prevBehavior = track.style.scrollBehavior;
        track.style.scrollBehavior = 'auto';
        track.scrollLeft = cards[current].offsetLeft;
        track.style.scrollBehavior = prevBehavior;
      }
    }

    function closestCard() {
      var trackLeft = track.getBoundingClientRect().left;
      var closest = 0;
      var distance = Infinity;
      cards.forEach(function (card, index) {
        var nextDistance = Math.abs(card.getBoundingClientRect().left - trackLeft);
        if (nextDistance < distance) {
          distance = nextDistance;
          closest = index;
        }
      });
      render(closest, false);
    }

    function onScroll() {
      if (!narrowQuery.matches || ticking) return;
      ticking = true;
      win.requestAnimationFrame(function () {
        ticking = false;
        closestCard();
      });
    }

    prev.addEventListener('click', function () {
      render(current - 1, true);
    });
    next.addEventListener('click', function () {
      render(current + 1, true);
    });
    track.addEventListener('scroll', onScroll, { passive: true });
    render(0, false);
  }

  return {
    clamp: clamp,
    nextIndex: nextIndex,
    statusText: statusText,
    progressState: progressState,
    visibleCount: visibleCount,
    lastIndex: lastIndex,
    rangeStatusText: rangeStatusText,
    init: init
  };
});
