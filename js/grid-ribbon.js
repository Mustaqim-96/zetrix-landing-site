/* ============================================================
   Grid ribbon — a scroll-driven fine square grid over the
   right-hand region, spanning Sections 3–5 (the .ribbon-flow
   band: tools, ai-layer, robotics).

   Look: flat graph-paper grid of thin, subtle grey lines. A SINGLE
   Zetrix-red wave stays near the vertical centre of the viewport and
   glides smoothly (constant velocity) as you scroll, so it follows the
   screen. It fills cells with red blocks — dense/bright at the crest, ragged
   at the edges — so one blocky "pattern" tracks your scroll. The grey
   grid stays visible in the gaps between filled cells (mosaic feel).
   Horizontal edge fade (CSS mask) dissolves the half-screen strip
   into the background on both sides.

   Perf: ONE <canvas>, GPU-composited, NO continuous loop — the wave
   phase and fill are pure functions of a smoothed scroll progress,
   so all work stops when scrolling settles or the band leaves the
   viewport.

   Classic (non-module) IIFE so it also runs over file:// on the root
   static site, matching the other site scripts.
   ============================================================ */
(function () {
  var canvas = document.querySelector('[data-grid-ribbon]');
  if (!canvas || !canvas.getContext) return;
  // Scope the grid to Sections 3–5 (tools, ai-layer, robotics), which are
  // exactly the children of .ribbon-flow — so the wave never appears over
  // Section 2 (ecosystem).
  var band = document.querySelector('[data-ribbon-flow]');
  if (!band) return;
  // The next section (Section 6, the layers handoff) pins into view during the
  // Section 5 -> 6 transition while the band is still fading. We fade the grid
  // out against this element so it never overlays Section 6's content.
  var nextGuard = document.querySelector('[data-layers-handoff]');

  var ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;

  var reduce = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- tunables -------------------------------------------------
  // geometry (theme-independent)
  var CELL = 20;             // target cell size in CSS px (small grid)
  var BAND_W = 0.12;         // single-wave thickness (fraction of viewport height)
  var RAG = 1.10;            // scatter: >1 disperses even the crest core (organic, not a solid band)
  var GAP = 2;               // px gap around each cell so the grid shows through
  var RADIUS = 0.34;         // cell corner radius (fraction of cell size) — soft, dot-like tiles
  var SMOOTH = 0.12;         // scroll interpolation (higher = snappier)
  // Wave anchoring: the band glides at a CONSTANT velocity (linear in scroll —
  // no easing, so no stop-and-go) through a range centred on the viewport
  // middle, so it stays near centre and follows the scroll smoothly.
  var CENTER_Y = 0.5;        // vertical anchor within the viewport (0 top, 1 bottom)
  var TRAVEL = 0.60;         // total glide range, centred on CENTER_Y (bigger = more obvious wave)

  // Palettes — the grid must read on BOTH the dark (#18181b) and the light
  // (#ffffff) site backgrounds. Dark: faint grey lines + a brighter glowing
  // red core. Light: darker hairline-grey lines + a deeper, richer red core
  // (a lighter core would wash out to pink on white).
  // maxOpacity is a ceiling on the whole canvas so the grid reads as a BACKGROUND
  // texture and never competes with the content. lineAlpha is boosted to
  // compensate (so the lattice survives the dimming); redHi is softened so the
  // crest glows without shouting on an already red-dense layout.
  var PALETTES = {
    dark:  { grey: [120, 124, 134], lineAlpha: 0.16, red: [210, 44, 54], redHi: [236, 88, 94], cellAlpha: 0.86, maxOpacity: 0.62 },
    light: { grey: [24, 24, 27],    lineAlpha: 0.18, red: [206, 40, 50], redHi: [178, 24, 34], cellAlpha: 0.90, maxOpacity: 0.50 }
  };
  var pal = PALETTES.dark;
  function refreshPalette() {
    pal = document.documentElement.getAttribute('data-theme') === 'light'
      ? PALETTES.light : PALETTES.dark;
  }
  // ---------------------------------------------------------------

  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var cssW = 0, cssH = 0;
  var cols = 0, rows = 0, cw = 0, ch = 0;
  var noise = new Float32Array(0);
  var target = 0, current = 0;
  var visible = false, running = false, frame = 0;

  function clamp(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }

  // Deterministic 2-octave value noise -> organic clusters of varying size
  // (big blobs + finer scatter), so the fill reads as an organic, scattered
  // pattern rather than a solid band or TV static. Rebuilt on resize from the
  // grid dimensions only, so it never reshuffles mid-scroll.
  function hash2(x, y, seed) {
    var s = (x * 374761393 + y * 668265263) ^ seed;
    s = (s ^ (s >> 13)) * 1274126177;
    return ((s >>> 0) % 100000) / 100000;
  }
  function vnoise(fx, fy, seed) {
    var x0 = Math.floor(fx), y0 = Math.floor(fy), tx = fx - x0, ty = fy - y0;
    var sx = tx * tx * (3 - 2 * tx), sy = ty * ty * (3 - 2 * ty);
    var a = hash2(x0, y0, seed), b = hash2(x0 + 1, y0, seed);
    var cc = hash2(x0, y0 + 1, seed), d = hash2(x0 + 1, y0 + 1, seed);
    var top = a + (b - a) * sx, bot = cc + (d - cc) * sx;
    return top + (bot - top) * sy;
  }
  function buildNoise() {
    var n = cols * rows;
    if (noise.length !== n) noise = new Float32Array(n);
    var seed = (cols * 73856093) ^ (rows * 19349663);
    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        // big organic blobs (coarse octave) + finer scatter detail (fine octave)
        var v = 0.62 * vnoise(c / 3.2, r / 3.2, seed) +
                0.38 * vnoise(c / 1.25, r / 1.25, seed ^ 0x9e37);
        noise[r * cols + c] = clamp(v);
      }
    }
  }

  function resize() {
    cssW = canvas.clientWidth || 600;
    cssH = canvas.clientHeight || window.innerHeight;
    canvas.width = Math.round(cssW * dpr);
    canvas.height = Math.round(cssH * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cols = Math.max(1, Math.round(cssW / CELL));
    rows = Math.max(1, Math.round(cssH / CELL));
    cw = cssW / cols;
    ch = cssH / rows;
    buildNoise();
  }

  // progress 0->1 across the whole time the Sections 3–5 band is on screen —
  // from the moment it enters the bottom of the viewport to the moment it
  // leaves the top. Spanning the full transit (not just height - vh) means the
  // wave keeps moving the entire time it is visible and never freezes at
  // progress 1 while it is still fading out over the next section. One
  // getBoundingClientRect per scroll event — no per-frame layout reads.
  function measure() {
    var rect = band.getBoundingClientRect();
    var vh = window.innerHeight || 1;
    var span = rect.height + vh;
    var p = span > 0 ? (vh - rect.top) / span : 0;
    target = clamp(p);

    visible = rect.top < vh && rect.bottom > 0;
    var fadeIn = clamp((vh - rect.top) / (vh * 0.6));
    var fadeOut = clamp(rect.bottom / (vh * 0.6));
    var op = visible ? Math.min(fadeIn, fadeOut) : 0;
    // Fade the grid out as Section 6 (the layers handoff) climbs into view, so
    // the wave never overlays its images/text — the grid belongs to Sections 3–5.
    if (nextGuard) {
      var nt = nextGuard.getBoundingClientRect().top;
      op = Math.min(op, clamp((nt - vh * 0.55) / (vh * 0.45)));
    }
    // Ceiling so the grid stays a background texture, never a focal element.
    canvas.style.opacity = String(op * pal.maxOpacity);
  }

  function render(progress) {
    ctx.clearRect(0, 0, cssW, cssH);
    if (cssW <= 0 || cssH <= 0) return;

    // --- graph-paper grid lines (always) ---
    ctx.fillStyle = 'rgba(' + pal.grey[0] + ',' + pal.grey[1] + ',' + pal.grey[2] + ',' + pal.lineAlpha + ')';
    var i, x, y;
    for (i = 0; i <= cols; i++) {
      x = Math.round(i * cw);
      ctx.fillRect(x, 0, 1, cssH);
    }
    for (i = 0; i <= rows; i++) {
      y = Math.round(i * ch);
      ctx.fillRect(0, y, cssW, 1);
    }

    // --- ONE red wave, gliding smoothly near the viewport centre ---
    // Linear in scroll -> constant velocity -> no stop-and-go. The small TRAVEL
    // range keeps the band around the middle of the screen while it follows the
    // scroll. Cells fill densest at the crest and ragged at its edges.
    var center = CENTER_Y + (progress - 0.5) * TRAVEL;
    var rad = Math.min(cw, ch) * RADIUS;       // rounded, dot-like tiles
    var roundable = !!ctx.roundRect;
    var r, c, ry, dn, crest, idx, on, alpha, t, cr, cg, cb, hh, w;
    for (r = 0; r < rows; r++) {
      ry = rows > 1 ? r / (rows - 1) : 0;
      dn = (ry - center) / BAND_W;
      crest = Math.exp(-dn * dn);              // 0..1 Gaussian band
      if (crest < 0.02) continue;              // outside the wave -> bare grid
      t = crest * crest;                       // push the core toward redHi
      cr = (pal.red[0] + (pal.redHi[0] - pal.red[0]) * t) | 0;
      cg = (pal.red[1] + (pal.redHi[1] - pal.red[1]) * t) | 0;
      cb = (pal.red[2] + (pal.redHi[2] - pal.red[2]) * t) | 0;
      y = Math.round(r * ch) + GAP;
      hh = Math.ceil(ch) - GAP;
      for (c = 0; c < cols; c++) {
        idx = r * cols + c;
        on = crest - noise[idx] * RAG;         // organic scatter threshold
        if (on <= 0) continue;
        // stronger crest weighting -> dim, sparse cells at the wave's leading
        // edge and a bright core, so the moving front reads clearly.
        alpha = (pal.cellAlpha * 0.5 + 0.5 * crest) * clamp(on * 2.6);
        ctx.fillStyle = 'rgba(' + cr + ',' + cg + ',' + cb + ',' + alpha.toFixed(3) + ')';
        x = Math.round(c * cw) + GAP;
        w = Math.ceil(cw) - GAP;
        if (roundable) {
          ctx.beginPath();
          ctx.roundRect(x, y, w, hh, rad);
          ctx.fill();
        } else {
          ctx.fillRect(x, y, w, hh);
        }
      }
    }
  }

  function tick() {
    frame = 0;
    current += (target - current) * SMOOTH;
    if (Math.abs(target - current) < 0.0006) current = target;
    render(current);
    if (visible && current !== target) schedule();
    else running = false;
  }

  function schedule() {
    running = true;
    if (!frame) frame = window.requestAnimationFrame(tick);
  }

  function onScroll() {
    measure();
    if (reduce) { current = target; render(current); return; }
    if (visible) schedule();
    else if (!running) render(current);
  }

  function onResize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    resize();
    measure();
    render(current);
  }

  refreshPalette();
  resize();
  measure();
  render(current);
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize);
  // Re-theme when the site toggle flips data-theme on <html>. There's no
  // continuous loop here, so observe the attribute and repaint on change.
  if (window.MutationObserver) {
    new MutationObserver(function () { refreshPalette(); render(current); })
      .observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  }
})();
