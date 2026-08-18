import assert from 'node:assert/strict';
import test from 'node:test';

import explosion from '../js/globe-explosion.js';
import network from '../js/globe-network.js';

test('network recipe contains every approved structural family', () => {
  const rig = network.build(explosion.seed);
  assert.ok(rig.outerArcs.length >= 900);
  assert.ok(rig.innerArcs.length >= 420);
  assert.ok(rig.traces.length >= 120);
  assert.ok(rig.glyphs.length >= 360);
  assert.ok(rig.particles.length >= 540);
  assert.deepEqual(rig.familyCounts, { crosses: 6, rings: 6, brackets: 6, boxes: 6 });
  for (const key of ['outerArcs', 'innerArcs', 'traces', 'glyphs', 'particles']) {
    const values = rig[key];
    assert.equal(values.length % 3, 0);
    assert.ok(values.every(Number.isFinite));
  }
});

test('network recipe is deterministic and centered around the globe anchor', () => {
  const first = network.build(explosion.seed);
  const second = network.build(explosion.seed);
  assert.deepEqual(first, second);
  const xs = [];
  for (let index = 0; index < first.outerArcs.length; index += 3) {
    xs.push(first.outerArcs[index]);
  }
  assert.ok(Math.min(...xs) <= -180);
  assert.ok(Math.max(...xs) >= 180);
});
