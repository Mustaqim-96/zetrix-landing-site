import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import explosion from '../js/globe-explosion.js';

const globeSource = readFileSync(new URL('../js/globe.js', import.meta.url), 'utf8');
const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');

test('timeline advances immediately from nothing through burst to the settled globe', () => {
  assert.deepEqual(explosion.TIMING, {
    ignitionRamp: 90,
    burst: 620,
    tableau: 300,
    assemble: 900,
    resolve: 560,
    total: 2380,
  });
  assert.equal(explosion.stateAt(0).phase, 'burst');
  assert.equal(explosion.stateAt(619).phase, 'burst');
  assert.equal(explosion.stateAt(620).phase, 'tableau');
  assert.equal(explosion.stateAt(920).phase, 'assemble');
  assert.equal(explosion.stateAt(1820).phase, 'resolve');
  assert.equal(explosion.stateAt(2379).phase, 'resolve');
  assert.equal(explosion.stateAt(2380).phase, 'settled');
});

test('explosion begins on the first positive frame after content completion', () => {
  const zero = explosion.stateAt(0);
  const firstFrame = explosion.stateAt(16);

  assert.deepEqual([zero.particleOpacity, zero.burst], [0, 0]);
  assert.ok(firstFrame.particleOpacity > 0);
  assert.ok(firstFrame.burst > 0);
  assert.equal(explosion.stateAt(45).particleOpacity, 0.875);
  assert.equal(explosion.stateAt(310).burst, 0.96875);
  assert.equal(explosion.stateAt(90).particleOpacity, 1);
  assert.equal(explosion.stateAt(620).burst, 1);
  assert.notEqual(firstFrame.phase, 'blank');
  assert.notEqual(firstFrame.phase, 'ignite');
});

test('all entrance values stay bounded and settle exactly', () => {
  const keys = ['particleOpacity', 'burst', 'assembly', 'baseOpacity',
    'lineOpacity', 'nodeOpacity', 'nodeGrowth', 'coreEnergy'];
  for (let time = -100; time <= 2500; time += 17) {
    const state = explosion.stateAt(time);
    for (const key of keys) {
      assert.ok(state[key] >= 0 && state[key] <= 1, `${key} escaped at ${time}ms`);
    }
  }
  assert.deepEqual(explosion.stateAt(2500), {
    phase: 'settled',
    particleOpacity: 1,
    burst: 1,
    assembly: 1,
    baseOpacity: 1,
    lineOpacity: 1,
    nodeOpacity: 1,
    nodeGrowth: 1,
    coreEnergy: 0,
    settled: true,
  });
});

test('nodes grow together from the surface with no overshoot', () => {
  const samples = [1960, 2030, 2170, 2300, 2379]
    .map((time) => explosion.stateAt(time).nodeGrowth);

  assert.equal(explosion.stateAt(1959).nodeGrowth, 0);
  assert.equal(explosion.easeOutCubic(0.5), 0.875);
  assert.equal(explosion.stateAt(2170).nodeGrowth, 0.875);
  for (let index = 1; index < samples.length; index += 1) {
    assert.ok(samples[index] >= samples[index - 1]);
  }
  assert.ok(samples.every((value) => value >= 0 && value <= 1));
  assert.equal(explosion.stateAt(2380).nodeGrowth, 1);
});

test('node opacity starts gently without a temporary lead-dot channel', () => {
  assert.equal(explosion.stateAt(1960).nodeOpacity, 0);
  assert.ok(explosion.stateAt(2040).nodeOpacity > 0);
  assert.equal('nodeLeadOpacity' in explosion.stateAt(2040), false);
});

test('entrance begins invisible and structural layers wait for exact assembly', () => {
  const blank = explosion.stateAt(0);
  assert.deepEqual(
    [blank.particleOpacity, blank.baseOpacity, blank.lineOpacity, blank.nodeOpacity],
    [0, 0, 0, 0],
  );
  assert.ok(explosion.stateAt(16).particleOpacity > 0);
  for (const time of [1, 300, 700, 1000, 1819]) {
    const state = explosion.stateAt(time);
    assert.equal(state.baseOpacity, 0);
    assert.equal(state.lineOpacity, 0);
    assert.equal(state.nodeOpacity, 0);
  }
});

test('burst and assembly are monotonic with exact endpoints', () => {
  const burst = [0, 120, 260, 460, 619].map((time) => explosion.stateAt(time).burst);
  const assembly = [920, 1100, 1300, 1500, 1700, 1819]
    .map((time) => explosion.stateAt(time).assembly);
  for (const samples of [burst, assembly]) {
    for (let index = 1; index < samples.length; index += 1) {
      assert.ok(samples[index] >= samples[index - 1]);
    }
  }
  assert.equal(explosion.stateAt(0).burst, 0);
  assert.equal(explosion.stateAt(620).burst, 1);
  assert.equal(explosion.stateAt(920).assembly, 0);
  assert.equal(explosion.stateAt(1820).assembly, 1);
});

test('structure resolves in the approved base line node order', () => {
  const start = explosion.stateAt(1820);
  const afterBase = explosion.stateAt(1860);
  const afterLine = explosion.stateAt(1900);
  const afterNode = explosion.stateAt(1980);
  assert.deepEqual([start.baseOpacity, start.lineOpacity, start.nodeOpacity], [0, 0, 0]);
  assert.ok(afterBase.baseOpacity > 0);
  assert.equal(afterBase.lineOpacity, 0);
  assert.equal(afterBase.nodeOpacity, 0);
  assert.ok(afterLine.lineOpacity > 0);
  assert.equal(afterLine.nodeOpacity, 0);
  assert.ok(afterNode.nodeOpacity > 0);
  const originalStructureEnd = explosion.stateAt(2120);
  assert.deepEqual(
    [originalStructureEnd.baseOpacity, originalStructureEnd.lineOpacity,
      originalStructureEnd.nodeOpacity],
    [1, 1, 1],
  );
  assert.ok(originalStructureEnd.nodeGrowth < 1);
  assert.deepEqual(
    [explosion.stateAt(2380).baseOpacity, explosion.stateAt(2380).lineOpacity,
      explosion.stateAt(2380).nodeOpacity],
    [1, 1, 1],
  );
});

test('mobile displacement is restrained and seeded values are deterministic', () => {
  assert.equal(explosion.mobileScale(390), 0.7);
  assert.equal(explosion.mobileScale(767), 0.7);
  assert.equal(explosion.mobileScale(768), 1);
  assert.equal(explosion.seed(42, 7), explosion.seed(42, 7));
  assert.notEqual(explosion.seed(42, 7), explosion.seed(43, 7));
});

test('state sampling can reuse a caller-owned object during animation frames', () => {
  const target = {};

  assert.equal(explosion.stateAt(300, target), target);
  assert.equal(typeof target.phase, 'string');
  assert.equal(typeof target.burst, 'number');
});

test('helper validation rejects malformed animation state and particle targets', () => {
  assert.equal(explosion.validState(explosion.stateAt(500)), true);
  assert.equal(explosion.validState({ ...explosion.stateAt(500), burst: NaN }), false);
  assert.equal(explosion.validState({ ...explosion.stateAt(500), nodeOpacity: 2 }), false);
  assert.equal(explosion.validTarget(explosion.networkTarget(4, 10, 20, 30)), true);
  assert.equal(explosion.validTarget({
    ...explosion.networkTarget(4, 10, 20, 30),
    x: Infinity,
  }), false);
});

test('particle targets form a deterministic asymmetric 3D cloud', () => {
  const targets = Array.from({ length: 1200 }, (_, index) =>
    explosion.networkTarget(index, 40, (index % 101) - 50, 80),
  );
  const xs = targets.map((target) => target.x);
  const ys = targets.map((target) => target.y);
  const zs = targets.map((target) => target.z);
  const nearCore = targets.filter((target) => target.layer === 0);
  const outliers = targets.filter((target) => target.outlier === 1);

  assert.deepEqual(
    explosion.networkTarget(42, 50, 20, 80),
    explosion.networkTarget(42, 50, 20, 80),
  );
  assert.ok(nearCore.length >= 240 && nearCore.length <= 360);
  assert.ok(outliers.length >= 45 && outliers.length <= 120);
  assert.ok(outliers.every((target) => target.layer === 1));
  assert.ok(new Set(targets.map((target) => target.cluster)).size >= 4);
  assert.ok(Math.max(...xs) - Math.min(...xs) >= 260);
  assert.ok(Math.max(...ys) - Math.min(...ys) >= 170);
  assert.ok(Math.max(...zs) - Math.min(...zs) >= 130);
  assert.ok(Math.abs(Math.max(...xs) + Math.min(...xs)) > 8);
  assert.ok(targets.every((target) => target.delay >= 0 && target.delay <= 0.22));
});

test('network target sampling can reuse caller-owned setup state', () => {
  const target = {};
  assert.equal(explosion.networkTarget(7, 10, 20, 30, target), target);
  assert.equal(typeof target.layer, 'number');
  assert.equal(typeof target.weight, 'number');
  assert.equal(typeof target.cluster, 'number');
  assert.equal(typeof target.outlier, 'number');
});

test('point shader moves continuously from ignition origin to cloud to globe', () => {
  for (const attribute of ['aNetworkTarget', 'aNetworkLayer', 'aNetworkWeight', 'aNetworkDelay']) {
    assert.match(globeSource, new RegExp(`setAttribute\\(\"${attribute}\"`));
  }
  for (const uniform of ['uBurst', 'uAssembly', 'uParticleOpacity', 'uMobileScale']) {
    assert.match(globeSource, new RegExp(uniform));
  }
  assert.match(globeSource, /window\.ZetrixGlobeNetwork/);
  assert.match(globeSource, /function buildNetworkAttributes/);
  assert.match(globeSource,
    /vec3 origin=normalize\(aNetworkTarget\)\*\(3\.0\+3\.0\*aNetworkWeight\)/);
  assert.match(globeSource, /responsiveTarget=mix\(position,aNetworkTarget,uMobileScale\)/);
  assert.match(globeSource, /vec3 burstPosition=mix\(origin,responsiveTarget,burstLocal\)/);
  assert.match(globeSource, /vec3 moved=mix\(burstPosition,position,assemblyLocal\)/);
  assert.match(globeSource, /dot\.a\*uParticleOpacity/);
  assert.match(globeSource, /if\(dot\.a<0\.25\)discard/);
  assert.doesNotMatch(globeSource, /uNetwork|uNetworkOpacity/);
  assert.doesNotMatch(globeSource, /camera\.position\.(?:x|y)\s*=/);
});

test('normal motion primes a fully invisible globe before waiting for content', () => {
  assert.match(globeSource, /function primeEntrance\(\)/);
  assert.match(globeSource, /explosion\.stateAt\(0, entranceState\)/);
  assert.match(globeSource, /continentPoints\.material = pointBurstMaterial/);
  assert.match(globeSource, /applyEntranceState\(entranceState\)/);
  assert.match(globeSource, /baseMaterial\.opacity = state\.baseOpacity/);
  assert.match(globeSource, /lineFallback\.opacity = state\.lineOpacity \* 0\.65/);
  assert.match(globeSource, /spikeMat\.opacity = state\.nodeOpacity/);
  assert.match(globeSource, /tipMat\.opacity = state\.nodeOpacity/);
  assert.match(globeSource, /networkRig\.visible = false/);
  assert.doesNotMatch(globeSource, /coastlineLines\.material = lineBurstMaterial/);
  assert.doesNotMatch(globeSource, /lGeo\.setAttribute\("aNetwork/);
});

test('settlement hides the network and restores original globe materials', () => {
  assert.match(globeSource, /networkRig\.visible = false/);
  assert.match(globeSource, /continentPoints\.material = pointFallback/);
  assert.match(globeSource, /coastlineLines\.material = lineFallback/);
  assert.match(globeSource, /lineFallback\.opacity = 0\.65/);
  assert.match(globeSource, /spikeMat\.opacity = 1/);
  assert.match(globeSource, /tipMat\.opacity = 1/);
  assert.match(globeSource, /baseMaterial\.depthWrite = true/);
  assert.match(globeSource, /atmosphereMaterial\.depthWrite = true/);
  assert.match(globeSource, /lineFallback\.depthWrite = true/);
  assert.match(globeSource, /controls\.enabled = true/);
  assert.match(globeSource, /controls\.autoRotate = !reduce/);
});

test('light theme gives the globe a dedicated material and brighter burst particles', () => {
  assert.match(globeSource, /function applyThemeMaterials\(\)/);
  assert.match(globeSource, /baseMaterial\.color\.setHex\(lightTheme \? 0xf1f3f5 : 0x18181b\)/);
  assert.match(globeSource, /atmosphereMaterial\.uniforms\.uColor\.value\.setHex\(lightTheme \? 0xcbd3df : 0x3b465e\)/);
  assert.match(globeSource, /uLightTheme:\s*\{ value: 0 \}/);
  assert.match(globeSource, /pointUniforms\.uLightTheme\.value = lightTheme \? 1 : 0/);
  assert.match(globeSource, /uLightTheme\*1\.25/);
  assert.match(globeSource, /mix\(vColor, vec3\(0\.773,0\.141,0\.18\), uLightTheme \* vCloud\)/);
});

test('node needles grow from fixed anchors with one synchronized value', () => {
  assert.match(globeSource, /var nodeRecords = \[\]/);
  assert.match(globeSource,
    /nodeRecords\.push\(\{\s*mesh: cyl,\s*normal: dir,\s*anchor: anchor,\s*finalLength: len/);
  assert.match(globeSource, /function applyNodeGrowth\(progress\)/);
  assert.match(globeSource, /currentLength = record\.finalLength \* progress/);
  assert.match(globeSource,
    /record\.mesh\.position\.copy\(record\.anchor\)\s*\.addScaledVector\(record\.normal, currentLength \/ 2\)/);
  assert.match(globeSource, /record\.mesh\.scale\.set\(1, currentLength, 1\)/);
});

test('node growth has no traveling lead dot and settlement restores exact geometry', () => {
  assert.match(globeSource, /var tips = new THREE\.Points\(tGeo, tipMat\)/);
  assert.match(globeSource, /applyNodeGrowth\(state\.nodeGrowth\)/);
  assert.match(globeSource, /applyNodeGrowth\(1\)/);
  assert.doesNotMatch(globeSource,
    /leadPositions|leadTipGeo|leadTipPositions|leadTipMat|leadTips/);
  assert.match(globeSource, /var appliedNodeGrowth = -1/);
  assert.match(globeSource, /if \(progress === appliedNodeGrowth\) return/);
  assert.match(globeSource, /appliedNodeGrowth = progress/);
});

test('globe waits for hero content completion and fails open safely', () => {
  assert.match(globeSource, /zetrix:hero-reveal-complete/);
  assert.match(globeSource, /dataset\.heroRevealComplete === "true"/);
  assert.match(globeSource, /introWaitTimer = window\.setTimeout/);
  assert.match(globeSource, /function startEntrance/);
  assert.match(globeSource, /if \(entranceHasRun/);
  assert.match(globeSource, /controls\.enabled = false/);
  assert.match(globeSource, /controls\.enabled = true/);
  assert.match(globeSource, /function settleEntrance/);
  assert.match(globeSource, /visibilitychange/);
  assert.doesNotMatch(globeSource, /zetrix:intro-complete/);
});

test('reduced motion and missing helper preserve the settled globe', () => {
  assert.match(globeSource,
    /if \(document\.hidden \|\| reduce \|\| !networkReady \|\| !explosion \|\| !pointUniforms\)/);
  assert.match(globeSource, /settleEntrance\(\)/);
  assert.doesNotMatch(globeSource, /sessionStorage|localStorage/);
});

test('content timeout and shader failures restore the original interactive globe', () => {
  assert.match(globeSource, /introWaitTimer = window\.setTimeout/);
  assert.match(globeSource, /if \(document\.hidden\)/);
  assert.match(globeSource, /renderer\.debug\.onShaderError/);
  assert.match(globeSource, /renderer\.compile\(scene, camera\)/);
  assert.match(globeSource, /diagnostics\.runnable === false/);
  assert.match(globeSource, /continentPoints\.material = pointFallback/);
  assert.match(globeSource, /coastlineLines\.material = lineFallback/);
  assert.match(globeSource, /new THREE\.Points\(cGeo, pointFallback\)/);
  assert.match(globeSource, /new THREE\.LineSegments\(lGeo, lineFallback\)/);
  assert.match(globeSource, /function safeBuildNetworkAttributes/);
  assert.match(globeSource, /explosion\.validTarget\(output\)/);
  assert.match(globeSource, /explosion\.validState\(entranceState\)/);
  assert.match(globeSource, /function primeEntrance\(\) \{[\s\S]*?try \{[\s\S]*?continentPoints\.material = pointBurstMaterial/);
  assert.match(globeSource, /catch \(error\)/);
  assert.match(globeSource, /explosion\.stateAt\(now - entranceStartedAt, entranceState\)/);
});

test('particle-only helpers load in cache-safe order', () => {
  const helperIndex = html.indexOf('<script src="js/globe-explosion.js?v=8" defer></script>');
  const networkIndex = html.indexOf('<script src="js/globe-network.js?v=1" defer></script>');
  const globeIndex = html.indexOf('<script src="js/globe.js?v=12" defer></script>');
  const introIndex = html.indexOf('<script src="js/site-intro.js?v=3" defer></script>');
  const revealIndex = html.indexOf('<script src="js/site-reveal.js?v=11" defer></script>');

  assert.ok(helperIndex > -1);
  assert.ok(networkIndex > helperIndex);
  assert.ok(globeIndex > networkIndex);
  assert.ok(introIndex > globeIndex);
  assert.ok(revealIndex > introIndex);
});
