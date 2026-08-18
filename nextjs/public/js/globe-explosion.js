(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.ZetrixGlobeExplosion = api;
})(typeof window !== 'undefined' ? window : this, function () {
  'use strict';

  var TIMING = Object.freeze({
    ignitionRamp: 90,
    burst: 620,
    tableau: 300,
    assemble: 900,
    resolve: 560,
    total: 2380
  });

  function clamp01(value) {
    return Math.max(0, Math.min(1, value));
  }

  function easeOutQuint(value) {
    var t = clamp01(value);
    return 1 - Math.pow(1 - t, 5);
  }

  function easeOutCubic(value) {
    var t = clamp01(value);
    return 1 - Math.pow(1 - t, 3);
  }

  function smootherstep(value) {
    var t = clamp01(value);
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  function mobileScale(width) {
    return Number(width) <= 767 ? 0.7 : 1;
  }

  function seed(index, salt) {
    var value = Math.sin((index + 1) * 12.9898 + (salt + 1) * 78.233) * 43758.5453;
    return value - Math.floor(value);
  }

  function writeState(target, phase, particleOpacity, burst, assembly,
    baseOpacity, lineOpacity, nodeOpacity, nodeGrowth, coreEnergy, settled) {
    var state = target || {};
    state.phase = phase;
    state.particleOpacity = particleOpacity;
    state.burst = burst;
    state.assembly = assembly;
    state.baseOpacity = baseOpacity;
    state.lineOpacity = lineOpacity;
    state.nodeOpacity = nodeOpacity;
    state.nodeGrowth = nodeGrowth;
    state.coreEnergy = coreEnergy;
    state.settled = settled;
    return state;
  }

  function stateAt(elapsedMs, target) {
    var elapsed = Math.max(0, Number(elapsedMs) || 0);
    var cursor = 0;
    if (elapsed < TIMING.burst) {
      var particleOpacity = easeOutCubic(elapsed / TIMING.ignitionRamp);
      var burstT = easeOutQuint(elapsed / TIMING.burst);
      return writeState(target, 'burst', particleOpacity, burstT, 0,
        0, 0, 0, 0, 1, false);
    }
    cursor += TIMING.burst;

    if (elapsed < cursor + TIMING.tableau) {
      return writeState(target, 'tableau', 1, 1, 0, 0, 0, 0, 0, 1, false);
    }
    cursor += TIMING.tableau;

    if (elapsed < cursor + TIMING.assemble) {
      var assemblyT = smootherstep((elapsed - cursor) / TIMING.assemble);
      return writeState(target, 'assemble', 1, 1, assemblyT, 0, 0, 0, 0,
        1 - assemblyT, false);
    }
    cursor += TIMING.assemble;

    if (elapsed < cursor + TIMING.resolve) {
      var resolveMs = elapsed - cursor;
      var base = smootherstep(resolveMs / 300);
      var line = smootherstep((resolveMs - 60) / 240);
      var nodeElapsed = resolveMs - 140;
      var node = smootherstep(nodeElapsed / 160);
      var nodeGrowth = easeOutCubic(nodeElapsed / 420);
      return writeState(target, 'resolve', 1, 1, 1, base, line, node,
        nodeGrowth, 0, false);
    }

    return writeState(target, 'settled', 1, 1, 1, 1, 1, 1, 1, 0, true);
  }

  function validUnit(value) {
    return Number.isFinite(value) && value >= 0 && value <= 1;
  }

  function validState(state) {
    return !!state && typeof state.phase === 'string' &&
      validUnit(state.particleOpacity) && validUnit(state.burst) &&
      validUnit(state.assembly) && validUnit(state.baseOpacity) &&
      validUnit(state.lineOpacity) && validUnit(state.nodeOpacity) &&
      validUnit(state.nodeGrowth) && validUnit(state.coreEnergy) &&
      typeof state.settled === 'boolean';
  }

  var CLOUD_CENTERS = [
    [-92, -18, -24],
    [-34, 48, 36],
    [28, -42, -38],
    [76, 28, 22],
    [118, -8, 4]
  ];

  function networkTarget(index, x, y, z, target) {
    var output = target || {};
    var coreSeed = seed(index, 31);
    var cluster = Math.min(4, Math.floor(seed(index, 37) * 5));
    var outlier = coreSeed >= 0.25 && seed(index, 41) > 0.94 ? 1 : 0;
    var jitterScale = outlier ? 1.5 : 1;

    if (coreSeed < 0.25) {
      output.x = Number(x) * (0.32 + seed(index, 43) * 0.28);
      output.y = Number(y) * (0.34 + seed(index, 47) * 0.3);
      output.z = Number(z) * (0.28 + seed(index, 53) * 0.32);
      output.layer = 0;
      output.side = 0;
    } else {
      var center = CLOUD_CENTERS[cluster];
      output.x = center[0] + (seed(index, 59) - 0.5) * 98 * jitterScale + Number(x) * 0.08;
      output.y = center[1] + (seed(index, 61) - 0.5) * 86 * jitterScale + Number(y) * 0.08;
      output.z = center[2] + (seed(index, 67) - 0.5) * 78 * jitterScale + Number(z) * 0.06;
      output.layer = 1;
      output.side = output.x < 0 ? -1 : 1;
    }

    output.cluster = cluster;
    output.outlier = outlier;
    output.weight = 0.55 + seed(index, 71) * 0.45;
    output.delay = output.layer === 0 ?
      seed(index, 73) * 0.035 : 0.035 + seed(index, 79) * 0.185;
    return output;
  }

  function validTarget(target) {
    return !!target && Number.isFinite(target.x) && Number.isFinite(target.y) &&
      Number.isFinite(target.z) && validUnit(target.layer) &&
      validUnit(target.weight) && validUnit(target.delay);
  }

  return {
    TIMING: TIMING,
    clamp01: clamp01,
    easeOutQuint: easeOutQuint,
    easeOutCubic: easeOutCubic,
    smootherstep: smootherstep,
    mobileScale: mobileScale,
    seed: seed,
    networkTarget: networkTarget,
    stateAt: stateAt,
    validState: validState,
    validTarget: validTarget
  };
});
