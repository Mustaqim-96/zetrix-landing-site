/* Feature deck (One ecosystem section).
   Scroll-driven pile: the section starts empty, then cards slide in one by one
   and stack on top of each other. The active (newest) card is expanded on top
   showing its illustration; already-dealt cards peek above it. End state matches
   the Figma cascade. The coin dissolves in before the cards stack. */
(function () {
  var stack = document.getElementById('eco-stack');
  if (!stack) return;

  var cards = Array.prototype.slice.call(stack.querySelectorAll('.eco-fcard'));
  if (!cards.length) return;

  // Vertical cascade offset between stacked cards (matches Figma spacing).
  // On phones the titles wrap to 2–3 lines, so a fixed peek clips the last line
  // behind the next card. Size the phone peek to the tallest title (measured
  // live) so every dealt card shows its full title. Recomputed on resize.
  function headPadTop(card) {
    var head = card.querySelector('.eco-fcard__head');
    return head ? (parseFloat(getComputedStyle(head).paddingTop) || 0) : 0;
  }
  function computeOffset() {
    var vw = window.innerWidth || document.documentElement.clientWidth || 1024;
    if (vw >= 1024) return 96;
    if (vw >= 768) return 72;
    var need = 56; // floor
    cards.forEach(function (card) {
      var title = card.querySelector('.eco-fcard__title');
      if (title) need = Math.max(need, headPadTop(card) + title.offsetHeight + 8);
    });
    return Math.ceil(need);
  }
  var OFFSET = computeOffset();

  // Cards accumulate into a pile: cards before the active one peek above it
  // (already dealt), the active one is expanded on top, later cards stay hidden
  // below until scroll deals them. activeIdx === -1 => empty (no cards yet).
  function setActive(activeIdx) {
    cards.forEach(function (card, i) {
      var head = card.querySelector('.eco-fcard__head');
      if (i < activeIdx) {                 // already dealt -> collapsed peek above
        card.classList.add('is-shown');
        card.classList.remove('is-active');
        card.style.top = (i * OFFSET) + 'px';
        card.style.zIndex = String(i + 1);
        if (head) head.setAttribute('aria-expanded', 'false');
      } else if (i === activeIdx) {         // current -> expanded, on top of the pile
        card.classList.add('is-shown', 'is-active');
        card.style.top = (activeIdx * OFFSET) + 'px';
        card.style.zIndex = '100';
        if (head) head.setAttribute('aria-expanded', 'true');
      } else {                              // not dealt yet -> hidden below the pile
        card.classList.remove('is-shown', 'is-active');
        card.style.top = (Math.max(activeIdx, 0) * OFFSET) + 'px';
        card.style.zIndex = String(i + 1);
        if (head) head.setAttribute('aria-expanded', 'false');
      }
    });
  }

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var track = document.getElementById('eco-track');
  var coin = document.querySelector('.eco-card__coin');
  var cardBg = document.querySelector('.eco-card__bg');
  var current = -99;

  function setCoinVisible(visible) {
    if (coin) coin.classList.toggle('is-in', visible);
    if (cardBg) cardBg.classList.toggle('is-in', visible);
  }

  function show(idx) {
    idx = Math.max(-1, Math.min(cards.length - 1, idx)); // -1 = empty (no cards yet)
    if (idx === current) return;
    current = idx;
    setActive(idx);
  }

  // Click a header to jump straight to that card.
  cards.forEach(function (card, i) {
    var head = card.querySelector('.eco-fcard__head');
    if (head) head.addEventListener('click', function () { show(i); });
  });

  // Scroll progress at which each card is dealt. The section starts EMPTY;
  // card 1 slides in at 10%, card 2 at 40%, and card 3 is held back to 75%
  // so there's time to read card 2 before it slides in on top.
  var REVEAL = [0.10, 0.40, 0.75];
  function countFor(progress) {
    var c = 0;
    for (var i = 0; i < REVEAL.length; i++) if (progress >= REVEAL[i]) c = i + 1;
    return c;
  }

  if (reduceMotion || !track) {
    setActive(cards.length - 1); // show the full stack, no scrubbing
    current = cards.length - 1;
    setCoinVisible(true);
    window.addEventListener('resize', function () { OFFSET = computeOffset(); setActive(current); });
    // Titles are measured, so re-run once the web font has settled.
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () { OFFSET = computeOffset(); setActive(current); });
    }
  } else {
    var ticking = false;
    function update() {
      ticking = false;
      var rect = track.getBoundingClientRect();
      // Start the cube background / coin sliding in as the section enters the
      // viewport (its top crossing the lower half), so they glide in with the
      // scroll instead of popping in only once the section is fully pinned.
      var bgIn = rect.top <= window.innerHeight * 0.5;
      if (coin) coin.classList.toggle('is-in', bgIn);
      if (cardBg) cardBg.classList.toggle('is-in', bgIn);
      var total = track.offsetHeight - window.innerHeight;
      if (total <= 0) { show(cards.length - 1); return; }
      var scrolled = Math.min(Math.max(-rect.top, 0), total);
      show(countFor(scrolled / total) - 1); // -1 => empty
    }
    function onScroll() {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', function () { OFFSET = computeOffset(); onScroll(); });
    // Titles are measured, so re-run once the web font has settled.
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () { OFFSET = computeOffset(); onScroll(); });
    }
    setActive(-1); current = -1; // start empty
    update();
  }

})();
