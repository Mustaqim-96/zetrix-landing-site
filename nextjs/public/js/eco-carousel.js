/* Ecosystem primitives — mobile horizontal carousel.
   On phones the eco cards render as a horizontal swipe carousel (mirroring the
   robotics carousel) with prev/next buttons and a progress indicator. On wider
   screens the scroll-driven deck (cards.js) runs instead and the controls are
   hidden, so this controller stays inert there. */
(function () {
  var root = document.querySelector('[data-eco-carousel]');
  if (!root || !window.matchMedia) return;

  var track = root.querySelector('.eco-stack');
  var cards = Array.prototype.slice.call(root.querySelectorAll('.eco-fcard'));
  var prev = document.getElementById('eco-prev');
  var next = document.getElementById('eco-next');
  var status = document.getElementById('eco-status');
  var bars = Array.prototype.slice.call(root.querySelectorAll('.eco-progress i'));
  if (!track || !cards.length || !prev || !next) return;

  var narrow = window.matchMedia('(max-width: 1279px)');
  var current = 0;
  var ticking = false;

  function pad(value) { return String(value).padStart(2, '0'); }

  function render(index, shouldScroll) {
    var maximum = cards.length - 1;
    current = Math.min(Math.max(index, 0), maximum);
    prev.disabled = current === 0;
    next.disabled = current === maximum;
    if (status) status.textContent = pad(current + 1) + ' / ' + pad(cards.length);
    bars.forEach(function (bar, i) { bar.classList.toggle('is-active', i === current); });

    if (shouldScroll && narrow.matches) {
      // The track has `scroll-behavior: smooth` + `scroll-snap-type: x mandatory`,
      // and in that combination programmatic scrolls (scrollIntoView / scrollTo /
      // a plain scrollLeft assignment) never land — the snap container keeps
      // resetting the pending smooth animation to 0, so the card never moves.
      // Force an instant jump by temporarily disabling smooth. offsetLeft is
      // relative to the (position:relative) track, so aligning the card to the
      // track's start centres it (the track itself is centred in the card).
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
      var next = Math.abs(card.getBoundingClientRect().left - trackLeft);
      if (next < distance) { distance = next; closest = index; }
    });
    render(closest, false);
  }

  function onScroll() {
    if (!narrow.matches || ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () { ticking = false; closestCard(); });
  }

  prev.addEventListener('click', function () { render(current - 1, true); });
  next.addEventListener('click', function () { render(current + 1, true); });
  track.addEventListener('scroll', onScroll, { passive: true });
  render(0, false);
})();
