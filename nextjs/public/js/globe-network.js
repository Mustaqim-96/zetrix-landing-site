(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.ZetrixGlobeNetwork = api;
})(typeof window !== 'undefined' ? window : this, function () {
  'use strict';

  function segment(target, ax, ay, az, bx, by, bz) {
    target.push(ax, ay, az, bx, by, bz);
  }

  function arc(target, radiusX, radiusY, start, end, steps, z, gapEvery) {
    for (var index = 0; index < steps; index++) {
      if (gapEvery && index % gapEvery === gapEvery - 1) continue;
      var a = start + (end - start) * index / steps;
      var b = start + (end - start) * (index + 1) / steps;
      segment(target,
        Math.cos(a) * radiusX, Math.sin(a) * radiusY, z,
        Math.cos(b) * radiusX, Math.sin(b) * radiusY, z);
    }
  }

  function cross(target, x, y, z, size) {
    segment(target, x - size, y, z, x + size, y, z);
    segment(target, x, y - size, z, x, y + size, z);
  }

  function ring(target, x, y, z, radius) {
    for (var index = 0; index < 12; index++) {
      var a = Math.PI * 2 * index / 12;
      var b = Math.PI * 2 * (index + 1) / 12;
      segment(target,
        x + Math.cos(a) * radius, y + Math.sin(a) * radius, z,
        x + Math.cos(b) * radius, y + Math.sin(b) * radius, z);
    }
  }

  function bracket(target, x, y, z, size) {
    segment(target, x, y, z, x + size, y, z);
    segment(target, x, y, z, x, y + size, z);
  }

  function box(target, x, y, z, width, height) {
    segment(target, x, y, z, x + width, y, z);
    segment(target, x + width, y, z, x + width, y + height, z);
    segment(target, x + width, y + height, z, x, y + height, z);
    segment(target, x, y + height, z, x, y, z);
  }

  function build(seed) {
    var outerArcs = [], innerArcs = [], traces = [], glyphs = [], particles = [];
    arc(outerArcs, 198, 132, Math.PI * 0.08, Math.PI * 0.92, 78, -14, 9);
    arc(outerArcs, 198, 132, Math.PI * 1.08, Math.PI * 1.92, 78, -14, 9);
    arc(outerArcs, 186, 122, Math.PI * 0.12, Math.PI * 0.88, 70, 8, 8);
    arc(outerArcs, 186, 122, Math.PI * 1.12, Math.PI * 1.88, 70, 8, 8);
    arc(innerArcs, 132, 78, Math.PI * 0.05, Math.PI * 0.95, 54, 18, 7);
    arc(innerArcs, 108, 62, Math.PI * 1.05, Math.PI * 1.95, 48, -4, 6);

    for (var index = 0; index < 18; index++) {
      var side = index % 2 ? -1 : 1;
      var y = -62 + index * 7.2;
      var startX = side * (72 + seed(index, 3) * 30);
      var endX = side * (126 + seed(index, 5) * 46);
      segment(traces, startX, y, -6, endX, y, -6);
      if (index % 3 === 0) segment(traces, endX, y, -6, endX, y + 15, -6);
    }

    for (var glyphIndex = 0; glyphIndex < 24; glyphIndex++) {
      var glyphSide = glyphIndex % 2 ? -1 : 1;
      var gx = glyphSide * (88 + seed(glyphIndex, 11) * 88);
      var gy = -70 + seed(glyphIndex, 13) * 140;
      var gz = -18 + seed(glyphIndex, 17) * 36;
      if (glyphIndex % 4 === 0) cross(glyphs, gx, gy, gz, 2.5 + seed(glyphIndex, 19) * 3);
      else if (glyphIndex % 4 === 1) ring(glyphs, gx, gy, gz, 3 + seed(glyphIndex, 23) * 4);
      else if (glyphIndex % 4 === 2) bracket(glyphs, gx, gy, gz, 5 + seed(glyphIndex, 29) * 6);
      else box(glyphs, gx, gy, gz, 5 + seed(glyphIndex, 23) * 10,
        4 + seed(glyphIndex, 29) * 8);
    }

    for (var particleIndex = 0; particleIndex < 240; particleIndex++) {
      var particleSide = seed(particleIndex, 31) < 0.5 ? -1 : 1;
      particles.push(
        particleSide * (76 + seed(particleIndex, 37) * 108),
        -76 + seed(particleIndex, 41) * 152,
        -28 + seed(particleIndex, 43) * 56
      );
    }

    return {
      outerArcs: outerArcs,
      innerArcs: innerArcs,
      traces: traces,
      glyphs: glyphs,
      particles: particles,
      familyCounts: { crosses: 6, rings: 6, brackets: 6, boxes: 6 }
    };
  }

  return { build: build };
});
