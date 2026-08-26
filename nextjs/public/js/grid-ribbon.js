/* ============================================================
   Grid ribbon — a scroll-driven fine square grid over the
   right-hand region, spanning Sections 3–5 (the .ribbon-flow
   band: tools, ai-layer, robotics).

   Look: a mosaic of separate, faint grey rounded tiles — one in every
   cell (a dot-grid, NOT connected graph-paper lines). A SINGLE
   Zetrix-red wave stays near the vertical centre of the viewport and
   glides smoothly (constant velocity) as you scroll, so it follows the
   screen. It lights up tiles with red — dense/bright at the crest, ragged
   at the edges — so one blocky "pattern" tracks your scroll. The grey
   tiles stay visible around the lit cells (mosaic feel).
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
  // Section 3 (tools): while this section is centred, the red wave reorganises
  // into a vertical stack of shaded cubes built from the same tiles. Measured
  // separately from the band so the wave over Sections 4–5 is unaffected.
  var toolsTrack = document.querySelector('[data-tools-track]');
  // Section 4 (ai-layer / "Your Agentic Twin"): while centred, the wave morphs
  // into a red-tile silhouette of the mascot robot.
  var aiTrack = document.querySelector('[data-ai-ribbon-track]');
  // Section 5 (NurAI): while centred, the wave morphs into the NurAI wave logo.
  var nuraiTrack = document.querySelector('[data-nurai]');

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

  // Cube-morph tunables (Section 3). A vertical stack of isometric cubes drawn
  // on the square tile grid ("pixel isometric"): three faces per cube, shaded
  // top>left>right for a 3D read without leaving the cheap square grid.
  var CUBE_R = 0.105;        // cube half-width as a fraction of viewport HEIGHT
  var CUBE_CX = 0.46;        // stack horizontal centre (fraction of canvas width) — centred in the section's right region
  var CUBE_GAP = 1.18;       // stacking step as a fraction of full cube height (>1 = clear space between cubes)
  // Cube face shades — the SAME red as the wave (pal.redHi), only darkened per
  // face so the 3D reads. Kept saturated (a plain multiply), never washed out.
  var FACE_LEFT = 0.70;      // left-face brightness vs the top face
  var FACE_RIGHT = 0.48;     // right-face brightness vs the top face (darkest)
  var MORPH_EDGE = 0.20;     // per-tile crossfade width — smaller = snappier hand-off
  var MORPH_STAGGER = 0.62;  // how much per-tile noise spreads the transition (organic dissolve)
  // Scatter: a sparse halo of dim red tiles around the cubes so the area reads
  // as active rather than empty. Per-tile random, denser near the stack.
  var SCATTER_ALPHA = 0.55;  // scatter-tile brightness vs the cube faces (dimmer)
  var SCATTER_DENSITY = 0.42;// max fraction of surrounding tiles lit (nearest the cubes)
  var SCATTER_PAD = 1.15;    // how far the halo reaches beyond the stack (fraction of stack size)
  var SCATTER_CLEAR = 1.32;  // keep-out zone around each cube (inflate factor) so scatter never touches it

  // Avatar (Section 4): a red-tile silhouette of the mascot robot. Pixel-art map
  // — one char per grid tile. '#' = solid (redHi), '+' = face panel (dim red),
  // ' ' = empty (background + carved eyes/mouth). Rendered onto real grid cells.
  var AVATAR_CX = 0.50;      // avatar centre (fraction of canvas width) — right region
  var AVATAR_FACE = 0.42;    // face-panel brightness vs the solid red (dim, so carved eyes/mouth read)
  // Horizontal wavy ribbon behind the avatar (grid-tile version of the
  // illustration's flowing ribbon). All fractions of the viewport.
  var RIBBON_Y = 0.60;       // ribbon centre height (fraction of viewport)
  var RIBBON_AMP = 0.05;     // wave amplitude
  var RIBBON_THICK = 1.7;    // band thickness in grid cells
  var RIBBON_WAVELEN = 0.55; // wavelength as a fraction of canvas width
  // NurAI logo (Section 5): the real brand mark, traced from its SVG onto the
  // grid ('#' = a lit tile). Rendered in brand teal with a left->right gradient.
  var LOGO_CX = 0.50;        // logo centre (fraction of canvas width)
  var LOGO_SCATTER = 0.18;   // scatter density around the logo (sparser than the cubes)
  var LOGO_TEAL_A = [64, 162, 192];   // gradient start (left, brighter teal)
  var LOGO_TEAL_B = [186, 244, 255];  // gradient end (right, light teal)
  var LOGO_BITMAP = [
    "..........##..........",
    ".........####.........",
    ".........####.........",
    "..#####...##....#####.",
    ".#######.......#######",
    ".#######......#######.",
    ".###.####....####.....",
    "####..###....###......",
    "###...###....###......",
    "###...###....###......",
    "###....###...###......",
    "###....###..####......",
    "###....###..###.......",
    "###....####.###.......",
    ".##.....#######.......",
    "........######........",
    ".........####........."
  ];
  // '#' solid (redHi), '+' face panel (dim red), ' '/'.' empty (carved eyes/mouth).
  var ROBOT = [
    "........#........",
    "........#........",
    ".....#######.....",
    "...###########...",
    "..#############..",
    "..#+++++++++++#..",
    "..#++ +++++ ++#..",
    "..#++ +++++ ++#..",
    "..#+++++++++++#..",
    "..#+++++++++++#..",
    "..#+++     +++#..",
    "..#############..",
    "...###########...",
    ".....#######.....",
    "....#########....",
    "...###########...",
    "..#############..",
    "#.#############.#",
    "#.#############.#",
    "..#############..",
    "...###########...",
    "....#########....",
    ".....#######.....",
    "......#####......"
  ];

  // Palettes — the grid must read on BOTH the dark (#18181b) and the light
  // (#ffffff) site backgrounds. Dark: faint grey lines + a brighter glowing
  // red core. Light: darker hairline-grey lines + a deeper, richer red core
  // (a lighter core would wash out to pink on white).
  // maxOpacity is a ceiling on the whole canvas so the grid reads as a BACKGROUND
  // texture and never competes with the content. lineAlpha is boosted to
  // compensate (so the lattice survives the dimming); redHi is softened so the
  // crest glows without shouting on an already red-dense layout.
  // tileAlpha: opacity of the faint grey rounded tile drawn in EVERY cell (the
  // empty dot-grid field). It replaces the old graph-paper lines, so the grid
  // now reads as separate rounded squares rather than a connected lattice.
  var PALETTES = {
    dark:  { grey: [120, 124, 134], tileAlpha: 0.08, red: [232, 58, 70], redHi: [255, 108, 116], cellAlpha: 0.94, maxOpacity: 0.72 },
    light: { grey: [24, 24, 27],    tileAlpha: 0.06, red: [222, 52, 62], redHi: [204, 42, 52], cellAlpha: 0.96, maxOpacity: 0.58 }
  };
  var pal = PALETTES.dark;
  function refreshPalette() {
    pal = document.documentElement.getAttribute('data-theme') === 'light'
      ? PALETTES.light : PALETTES.dark;
  }
  // ---------------------------------------------------------------

  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var cssW = 0, cssH = 0;
  var centerY = CENTER_Y;    // vertical anchor; pushed lower on tablet/mobile so
                             // the morph sits BELOW the (top-aligned) copy.
  var cols = 0, rows = 0, cw = 0, ch = 0;
  var noise = new Float32Array(0);
  var target = 0, current = 0;
  var morph = 0;             // 0 = wave, 1 = fully-formed cube stack (Section 3)
  var morphA = 0;            // 0 = wave, 1 = fully-formed avatar robot (Section 4)
  var morphN = 0;            // 0 = wave, 1 = fully-formed NurAI wave logo (Section 5)
  var visible = false, running = false, frame = 0;

  function clamp(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
  function smoothstep(t) { return t * t * (3 - 2 * t); }  // ease-in-out 0..1

  // Per-tile shape presence during a morph, staggered by the cell's own noise so
  // the wave dissolves into (and back out of) the shape ORGANICALLY — tiles hand
  // over at slightly different moments instead of one uniform crossfade. 0 = still
  // the wave, 1 = fully the shape. Reverses automatically as m falls. Shared by
  // the Section-3 cubes and the Section-4 avatar.
  function mixAt(idx, m) {
    var tc = 0.12 + noise[idx] * MORPH_STAGGER;   // per-tile transition centre
    return smoothstep(clamp((m - tc) / MORPH_EDGE + 0.5));
  }

  // Is point (px,py) inside the convex quad q = [x0,y0, x1,y1, x2,y2, x3,y3]?
  // Same-sign edge cross products -> inside. Used to rasterise cube faces onto
  // the square tile grid (a tile lights up if its centre lands on a face).
  function inQuad(px, py, q) {
    var sign = 0;
    for (var i = 0; i < 4; i++) {
      var ax = q[i * 2], ay = q[i * 2 + 1];
      var j = (i + 1) % 4;
      var cross = (q[j * 2] - ax) * (py - ay) - (q[j * 2 + 1] - ay) * (px - ax);
      if (cross !== 0) {
        var s = cross > 0 ? 1 : -1;
        if (sign === 0) sign = s;
        else if (s !== sign) return false;
      }
    }
    return true;
  }

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
    // Adaptive cell: on narrow (full-width) canvases shrink the cell so the
    // col-based morphs (robot ~19 cols, logo ~22 cols) still fit the width.
    // Desktop (50vw canvas) is unaffected — it stays at CELL.
    var acell = Math.min(CELL, Math.max(11, cssW / 26));
    cols = Math.max(1, Math.round(cssW / acell));
    rows = Math.max(1, Math.round(cssH / acell));
    // Phone keeps 0.6 (100vh sections). Tablet-portrait (768–1023) uses ~80vh
    // sections, so drop the morph lower to keep it below the top-aligned copy.
    var iw = window.innerWidth;
    centerY = (iw >= 768 && iw <= 1023) ? 0.72 : (iw < 768 ? 0.6 : CENTER_Y);
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
    // Gradual, eased scroll fade-in: the grid ramps up over a FULL viewport of
    // scroll (FADE = 1) as the band enters, and smoothstep softens both ends so
    // it eases in rather than sliding in linearly. Same treatment on the way out.
    var FADE = 1.0;
    var fadeIn = smoothstep(clamp((vh - rect.top) / (vh * FADE)));
    var fadeOut = smoothstep(clamp(rect.bottom / (vh * FADE)));
    var op = visible ? Math.min(fadeIn, fadeOut) : 0;
    // Fade the grid out as Section 6 (the layers handoff) climbs into view, so
    // the wave never overlays its images/text — the grid belongs to Sections 3–5.
    if (nextGuard) {
      var nt = nextGuard.getBoundingClientRect().top;
      op = Math.min(op, clamp((nt - vh * 0.55) / (vh * 0.45)));
    }
    // Ceiling so the grid stays a background texture, never a focal element.
    canvas.style.opacity = String(op * pal.maxOpacity);

    // --- cube morph (Section 3) ---------------------------------------------
    // The tools section is a single-viewport section, so drive the morph off how
    // centred it is: cubes form as it approaches centre, HOLD fully formed while
    // it sits near centre (a plateau of ~0.36vh of scroll), then dissolve back
    // to the wave as it leaves — scrub + hold.
    morph = 0;
    if (toolsTrack) {
      var tr = toolsTrack.getBoundingClientRect();
      var off = Math.abs((tr.top + tr.height / 2) - vh / 2) / vh; // 0 = centred
      morph = smoothstep(clamp((0.6 - off) / (0.6 - 0.18)));      // hold within 0.18
    }
    morphA = 0;
    if (aiTrack) {
      var ar = aiTrack.getBoundingClientRect();
      var offA = Math.abs((ar.top + ar.height / 2) - vh / 2) / vh;
      morphA = smoothstep(clamp((0.6 - offA) / (0.6 - 0.18)));
    }
    morphN = 0;
    if (nuraiTrack) {
      var nr = nuraiTrack.getBoundingClientRect();
      var offN = Math.abs((nr.top + nr.height / 2) - vh / 2) / vh;
      morphN = smoothstep(clamp((0.6 - offN) / (0.6 - 0.18)));
    }
    if (reduce) { morph = morph > 0.5 ? 1 : 0; morphA = morphA > 0.5 ? 1 : 0; morphN = morphN > 0.5 ? 1 : 0; }
  }

  function render(progress) {
    ctx.clearRect(0, 0, cssW, cssH);
    if (cssW <= 0 || cssH <= 0) return;

    var rad = Math.min(cw, ch) * RADIUS;       // rounded, dot-like tiles
    var roundable = !!ctx.roundRect;
    var r, c, x, y, w, hh, ry, dn, crest, idx, on, alpha, t, cr, cg, cb;

    // --- base dot-grid: a faint grey rounded tile in EVERY cell (always) ---
    // Separate tiles with a gap around each — not connected lines — so the field
    // reads like a mosaic of squares that the red wave lights up.
    ctx.fillStyle = 'rgba(' + pal.grey[0] + ',' + pal.grey[1] + ',' + pal.grey[2] + ',' + pal.tileAlpha + ')';
    for (r = 0; r < rows; r++) {
      y = Math.round(r * ch) + GAP;
      hh = Math.ceil(ch) - GAP;
      for (c = 0; c < cols; c++) {
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

    // --- ONE red wave, gliding smoothly near the viewport centre ---
    // Linear in scroll -> constant velocity -> no stop-and-go. The small TRAVEL
    // range keeps the band around the middle of the screen while it follows the
    // scroll. Cells fill densest at the crest and ragged at its edges, drawn as
    // red tiles OVER the grey base so the wave lights up the mosaic.
    // In Sections 3 & 4 each wave tile dissolves out (per-tile, staggered by
    // noise) as its shape counterpart forms in — an organic hand-off, not a fade.
    var shapeMorph = Math.max(morph, morphA, morphN);   // only one section is centred at a time
    if (shapeMorph < 0.999) {
      var center = centerY + (progress - 0.5) * TRAVEL;
      for (r = 0; r < rows; r++) {
        ry = rows > 1 ? r / (rows - 1) : 0;
        dn = (ry - center) / BAND_W;
        crest = Math.exp(-dn * dn);            // 0..1 Gaussian band
        if (crest < 0.02) continue;            // outside the wave -> bare grid
        t = crest * crest;                     // push the core toward redHi
        cr = (pal.red[0] + (pal.redHi[0] - pal.red[0]) * t) | 0;
        cg = (pal.red[1] + (pal.redHi[1] - pal.red[1]) * t) | 0;
        cb = (pal.red[2] + (pal.redHi[2] - pal.red[2]) * t) | 0;
        y = Math.round(r * ch) + GAP;
        hh = Math.ceil(ch) - GAP;
        for (c = 0; c < cols; c++) {
          idx = r * cols + c;
          on = crest - noise[idx] * RAG;       // organic scatter threshold
          if (on <= 0) continue;
          // stronger crest weighting -> dim, sparse cells at the wave's leading
          // edge and a bright core, so the moving front reads clearly.
          alpha = (pal.cellAlpha * 0.5 + 0.5 * crest) * clamp(on * 2.6) * (shapeMorph > 0.001 ? 1 - mixAt(idx, shapeMorph) : 1);
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

    // --- Section 3: a vertical stack of shaded cubes, built from the tiles ---
    // Three isometric cubes made from the SAME red as the wave (top = redHi,
    // left/right just darkened per face for the 3D read). Each tile fades in via
    // cubeMix() — noise-staggered — so the cubes assemble organically.
    if (morph > 0.001) {
      var r0 = CUBE_R * cssH;                  // cube half-width
      var h0 = r0;                             // side-face height (cube-ish)
      var cubeH = h0 + r0;                      // full cube height (top apex -> bottom apex)
      var step = cubeH * CUBE_GAP;             // centre-to-centre stacking distance
      var stackX = CUBE_CX * cssW;
      var midY = cssH * centerY - h0 / 2;      // centre the whole tower
      var origins = [midY + step, midY, midY - step];   // bottom, middle, top
      var top = pal.redHi;                     // top face = the wave's crest red
      var left = [(top[0] * FACE_LEFT) | 0, (top[1] * FACE_LEFT) | 0, (top[2] * FACE_LEFT) | 0];
      var right = [(top[0] * FACE_RIGHT) | 0, (top[1] * FACE_RIGHT) | 0, (top[2] * FACE_RIGHT) | 0];

      // Pre-build each cube's three face quads (for drawing) plus a slightly
      // inflated copy (a keep-out zone) so the scatter never touches the cubes.
      function scaleQ(q, cx, cy, k) {
        return [cx + (q[0] - cx) * k, cy + (q[1] - cy) * k,
                cx + (q[2] - cx) * k, cy + (q[3] - cy) * k,
                cx + (q[4] - cx) * k, cy + (q[5] - cy) * k,
                cx + (q[6] - cx) * k, cy + (q[7] - cy) * k];
      }
      var cubes = [];
      for (var ci = 0; ci < 3; ci++) {
        var oy = origins[ci];
        var pcx0 = stackX, pcy0 = oy + h0 / 2;   // cube centre (for inflating the keep-out zone)
        // vertices: A top, B right, C front, D left, E left-bottom, F front-bottom, G right-bottom
        var tq = [stackX, oy - r0 / 2, stackX + r0, oy, stackX, oy + r0 / 2, stackX - r0, oy];
        var lq = [stackX - r0, oy, stackX, oy + r0 / 2, stackX, oy + h0 + r0 / 2, stackX - r0, oy + h0];
        var rq = [stackX, oy + r0 / 2, stackX + r0, oy, stackX + r0, oy + h0, stackX, oy + h0 + r0 / 2];
        cubes.push({
          topQ: tq, leftQ: lq, rightQ: rq,
          topC: scaleQ(tq, pcx0, pcy0, SCATTER_CLEAR),
          leftC: scaleQ(lq, pcx0, pcy0, SCATTER_CLEAR),
          rightC: scaleQ(rq, pcx0, pcy0, SCATTER_CLEAR)
        });
      }
      // True inside the inflated keep-out zone — scatter tiles here are dropped.
      function nearAnyCube(px, py) {
        for (var k = 0; k < 3; k++) {
          var q = cubes[k];
          if (inQuad(px, py, q.topC) || inQuad(px, py, q.leftC) || inQuad(px, py, q.rightC)) return true;
        }
        return false;
      }

      // --- scatter halo: sparse dim-red tiles filling the space around the stack ---
      var towerCY = midY + h0 / 2;
      var towerHalf = step + (h0 + r0) / 2;
      var haloX = r0 * (1 + SCATTER_PAD);
      var haloY = towerHalf * (1 + SCATTER_PAD * 0.35);
      var sc = pal.red;
      var sc0 = Math.max(0, Math.floor((stackX - haloX) / cw));
      var sc1 = Math.min(cols - 1, Math.ceil((stackX + haloX) / cw));
      var sr0 = Math.max(0, Math.floor((towerCY - haloY) / ch));
      var sr1 = Math.min(rows - 1, Math.ceil((towerCY + haloY) / ch));
      for (r = sr0; r <= sr1; r++) {
        var scy = r * ch + ch / 2;
        y = Math.round(r * ch) + GAP;
        hh = Math.ceil(ch) - GAP;
        for (c = sc0; c <= sc1; c++) {
          var scx = c * cw + cw / 2;
          var fall = (1 - clamp(Math.abs(scx - stackX) / haloX)) * (1 - clamp(Math.abs(scy - towerCY) / haloY));
          if (fall <= 0.02) continue;
          if (hash2(c, r, 6151) > SCATTER_DENSITY * fall) continue;   // sparse, per-tile random
          if (nearAnyCube(scx, scy)) continue;                        // keep a clear buffer around the cubes
          var smix = mixAt(r * cols + c, morph);
          if (smix < 0.01) continue;
          var sa = pal.cellAlpha * SCATTER_ALPHA * (0.3 + 0.7 * fall) * smix * (0.55 + 0.45 * hash2(c, r, 991));
          ctx.fillStyle = 'rgba(' + sc[0] + ',' + sc[1] + ',' + sc[2] + ',' + sa.toFixed(3) + ')';
          x = Math.round(c * cw) + GAP;
          w = Math.ceil(cw) - GAP;
          if (roundable) { ctx.beginPath(); ctx.roundRect(x, y, w, hh, rad); ctx.fill(); }
          else ctx.fillRect(x, y, w, hh);
        }
      }

      // --- the cubes themselves, drawn on top of the scatter ---
      for (ci = 0; ci < 3; ci++) {
        var cube = cubes[ci];
        var c0 = Math.max(0, Math.floor((stackX - r0) / cw));
        var c1 = Math.min(cols - 1, Math.ceil((stackX + r0) / cw));
        var rr0 = Math.max(0, Math.floor((origins[ci] - r0 / 2) / ch));
        var rr1 = Math.min(rows - 1, Math.ceil((origins[ci] + h0 + r0 / 2) / ch));
        for (r = rr0; r <= rr1; r++) {
          var pcy = r * ch + ch / 2;
          y = Math.round(r * ch) + GAP;
          hh = Math.ceil(ch) - GAP;
          for (c = c0; c <= c1; c++) {
            var pcx = c * cw + cw / 2;
            var col;
            if (inQuad(pcx, pcy, cube.topQ)) col = top;
            else if (inQuad(pcx, pcy, cube.leftQ)) col = left;
            else if (inQuad(pcx, pcy, cube.rightQ)) col = right;
            else continue;
            var mix = mixAt(r * cols + c, morph);   // per-tile organic reveal
            if (mix < 0.01) continue;
            ctx.fillStyle = 'rgba(' + col[0] + ',' + col[1] + ',' + col[2] + ',' + (pal.cellAlpha * mix).toFixed(3) + ')';
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
    }

    // --- Section 4: red-tile silhouette of the mascot robot (pixel-art map) ---
    // Each ROBOT char maps to one grid cell, centred on the right region. Tiles
    // fade in with the same organic mixAt() so the grid reassembles into the bot.
    if (morphA > 0.001) {
      var rRows = ROBOT.length, rCols = ROBOT[0].length;
      var colStart = Math.round((AVATAR_CX * cssW) / cw - rCols / 2);
      var rowStart = Math.round((cssH * centerY) / ch - rRows / 2);
      var solid = pal.redHi;                                    // body / head / arms
      var face = [(solid[0] * AVATAR_FACE) | 0, (solid[1] * AVATAR_FACE) | 0, (solid[2] * AVATAR_FACE) | 0]; // dim face panel

      // --- horizontal wavy "ribbon" of tiles flowing across, behind the robot ---
      // A sine band a couple of tiles thick, spanning the width and fading at its
      // edges — the illustration's ribbon, rendered in the grid. Robot draws over.
      var ribBase = cssH * RIBBON_Y;
      var ribAmp = cssH * RIBBON_AMP;
      var ribThick = ch * RIBBON_THICK;
      var ribFreq = (Math.PI * 2) / (cssW * RIBBON_WAVELEN);
      var ribCol = pal.red;
      for (r = 0; r < rows; r++) {
        var rpy = r * ch + ch / 2;
        y = Math.round(r * ch) + GAP;
        hh = Math.ceil(ch) - GAP;
        for (c = 0; c < cols; c++) {
          var rpx = c * cw + cw / 2;
          var cyR = ribBase + ribAmp * Math.sin(rpx * ribFreq);
          var dR = Math.abs(rpy - cyR);
          if (dR > ribThick) continue;
          var edgeR = 1 - dR / ribThick;           // soft top/bottom edge
          var rmix = mixAt(r * cols + c, morphA);
          if (rmix < 0.01) continue;
          var ra = pal.cellAlpha * 0.7 * edgeR * rmix;
          ctx.fillStyle = 'rgba(' + ribCol[0] + ',' + ribCol[1] + ',' + ribCol[2] + ',' + ra.toFixed(3) + ')';
          x = Math.round(c * cw) + GAP;
          w = Math.ceil(cw) - GAP;
          if (roundable) { ctx.beginPath(); ctx.roundRect(x, y, w, hh, rad); ctx.fill(); }
          else ctx.fillRect(x, y, w, hh);
        }
      }

      // --- the robot itself, on top of the ribbon ---
      for (var br = 0; br < rRows; br++) {
        var line = ROBOT[br];
        var gr = rowStart + br;
        if (gr < 0 || gr >= rows) continue;
        y = Math.round(gr * ch) + GAP;
        hh = Math.ceil(ch) - GAP;
        for (var bc = 0; bc < rCols; bc++) {
          var chr = line.charAt(bc);
          if (chr === ' ' || chr === '.') continue;        // empty / carved eyes+mouth
          var gc = colStart + bc;
          if (gc < 0 || gc >= cols) continue;
          var acol = (chr === '+') ? face : solid;         // '+' dim face panel, else solid
          var amix = mixAt(gr * cols + gc, morphA);
          if (amix < 0.01) continue;
          ctx.fillStyle = 'rgba(' + acol[0] + ',' + acol[1] + ',' + acol[2] + ',' + (pal.cellAlpha * amix).toFixed(3) + ')';
          x = Math.round(gc * cw) + GAP;
          w = Math.ceil(cw) - GAP;
          if (roundable) { ctx.beginPath(); ctx.roundRect(x, y, w, hh, rad); ctx.fill(); }
          else ctx.fillRect(x, y, w, hh);
        }
      }
    }

    // --- Section 5: the NurAI logo, traced from its SVG onto the grid ---
    if (morphN > 0.001) {
      var lRows = LOGO_BITMAP.length, lCols = LOGO_BITMAP[0].length;
      var lColStart = Math.round((LOGO_CX * cssW) / cw - lCols / 2);
      var lRowStart = Math.round((cssH * centerY) / ch - lRows / 2);
      var ta = LOGO_TEAL_A, tb = LOGO_TEAL_B;

      // occupancy (logo cells + 1-cell buffer) so the scatter keeps clear of it
      var lOcc = {};
      for (var obr = 0; obr < lRows; obr++) {
        var obl = LOGO_BITMAP[obr];
        for (var obc = 0; obc < lCols; obc++) {
          if (obl.charAt(obc) !== '#') continue;
          for (var ddr = -1; ddr <= 1; ddr++) for (var ddc = -1; ddc <= 1; ddc++)
            lOcc[(lRowStart + obr + ddr) + ':' + (lColStart + obc + ddc)] = 1;
        }
      }
      // --- scatter halo of dim teal tiles filling the space around the logo ---
      var lcx = (lColStart + lCols / 2) * cw;
      var lcy = (lRowStart + lRows / 2) * ch;
      var lhaloX = (lCols / 2) * cw * (1 + SCATTER_PAD);
      var lhaloY = (lRows / 2) * ch * (1 + SCATTER_PAD * 0.5);
      var lsc0 = Math.max(0, Math.floor((lcx - lhaloX) / cw));
      var lsc1 = Math.min(cols - 1, Math.ceil((lcx + lhaloX) / cw));
      var lsr0 = Math.max(0, Math.floor((lcy - lhaloY) / ch));
      var lsr1 = Math.min(rows - 1, Math.ceil((lcy + lhaloY) / ch));
      for (r = lsr0; r <= lsr1; r++) {
        var lscy = r * ch + ch / 2;
        y = Math.round(r * ch) + GAP;
        hh = Math.ceil(ch) - GAP;
        for (c = lsc0; c <= lsc1; c++) {
          if (lOcc[r + ':' + c]) continue;
          var lscx = c * cw + cw / 2;
          var lfall = (1 - clamp(Math.abs(lscx - lcx) / lhaloX)) * (1 - clamp(Math.abs(lscy - lcy) / lhaloY));
          if (lfall <= 0.02) continue;
          if (hash2(c, r, 6151) > LOGO_SCATTER * lfall) continue;
          var lsmix = mixAt(r * cols + c, morphN);
          if (lsmix < 0.01) continue;
          var lsa = pal.cellAlpha * SCATTER_ALPHA * (0.3 + 0.7 * lfall) * lsmix * (0.55 + 0.45 * hash2(c, r, 991));
          ctx.fillStyle = 'rgba(' + tb[0] + ',' + tb[1] + ',' + tb[2] + ',' + lsa.toFixed(3) + ')';
          x = Math.round(c * cw) + GAP;
          w = Math.ceil(cw) - GAP;
          if (roundable) { ctx.beginPath(); ctx.roundRect(x, y, w, hh, rad); ctx.fill(); }
          else ctx.fillRect(x, y, w, hh);
        }
      }

      for (var lbr = 0; lbr < lRows; lbr++) {
        var lline = LOGO_BITMAP[lbr];
        var lgr = lRowStart + lbr;
        if (lgr < 0 || lgr >= rows) continue;
        y = Math.round(lgr * ch) + GAP;
        hh = Math.ceil(ch) - GAP;
        for (var lbc = 0; lbc < lCols; lbc++) {
          if (lline.charAt(lbc) !== '#') continue;
          var lgc = lColStart + lbc;
          if (lgc < 0 || lgc >= cols) continue;
          var gt = lCols > 1 ? lbc / (lCols - 1) : 0;           // left->right gradient
          var lr = (ta[0] + (tb[0] - ta[0]) * gt) | 0;
          var lg = (ta[1] + (tb[1] - ta[1]) * gt) | 0;
          var lb = (ta[2] + (tb[2] - ta[2]) * gt) | 0;
          var lmix = mixAt(lgr * cols + lgc, morphN);
          if (lmix < 0.01) continue;
          ctx.fillStyle = 'rgba(' + lr + ',' + lg + ',' + lb + ',' + (pal.cellAlpha * lmix).toFixed(3) + ')';
          x = Math.round(lgc * cw) + GAP;
          w = Math.ceil(cw) - GAP;
          if (roundable) { ctx.beginPath(); ctx.roundRect(x, y, w, hh, rad); ctx.fill(); }
          else ctx.fillRect(x, y, w, hh);
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
