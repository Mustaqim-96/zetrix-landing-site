import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import test from 'node:test';

const require = createRequire(import.meta.url);
const {
  clamp, ease, frameFor, handoffFrame, poseFor, transitionProgress, usesStaticLayout
} = require('../js/layers-carousel.js');
const source = readFileSync(new URL('../js/layers-carousel.js', import.meta.url), 'utf8');

function assertPoseClose(actual, expected) {
  Object.keys(expected).forEach((key) => {
    assert.ok(
      Math.abs(actual[key] - expected[key]) < 1e-12,
      `${key}: expected ${expected[key]}, received ${actual[key]}`
    );
  });
}

test('clamp and easing keep scrub values bounded', () => {
  assert.equal(clamp(-1, 0, 1), 0);
  assert.equal(clamp(2, 0, 1), 1);
  assert.equal(ease(0), 0);
  assert.equal(ease(1), 1);
});

test('quintic smootherstep eases gently into both endpoints', () => {
  assert.equal(ease(0), 0);
  assert.equal(ease(.5), .5);
  assert.equal(ease(1), 1);
  assert.ok(ease(.01) < .00002);
  assert.ok(1 - ease(.99) < .00002);
});

test('static controls interpolate through the desktop shuffle path in both directions', () => {
  assert.equal(transitionProgress(0, 1, 0, 800), 0);
  assert.equal(transitionProgress(0, 1, 400, 800), .5);
  assert.equal(transitionProgress(0, 1, 800, 800), 1);
  assert.equal(transitionProgress(1, 0, 400, 800), .5);
  assert.equal(transitionProgress(.5, 1, 1200, 800), 1);
});

test('only reduced motion disables scroll scrubbing; narrow screens keep it', () => {
  assert.equal(usesStaticLayout(false), false);
  assert.equal(usesStaticLayout(true), true);
  // Narrow viewports no longer force the static layout — the second argument is ignored.
  assert.equal(usesStaticLayout(false, true), false);
});

test('handoff dissolve completes halfway through the CTA rise', () => {
  assert.deepEqual(handoffFrame(2048, 3072), { handoffProgress: 0, dissolveProgress: 0 });
  assert.deepEqual(handoffFrame(2304, 3072), { handoffProgress: 0.25, dissolveProgress: 0.5 });
  assert.deepEqual(handoffFrame(2560, 3072), { handoffProgress: 0.5, dissolveProgress: 1 });
  assert.deepEqual(handoffFrame(3072, 3072), { handoffProgress: 1, dissolveProgress: 1 });
});

test('static layouts reset the outgoing dissolve before retaining carousel state', () => {
  assert.match(
    source,
    /if \(isStaticLayout\(\)\) \{\s*track\.style\.setProperty\('--layers-exit-progress', 0\);\s*return announced < 0 \? 0 : announced \/ 2;/
  );
});

test('initial frame is blockchain front, AI middle, robotics rear', () => {
  const frame = frameFor(0);
  assert.deepEqual(frame.order, [0, 1, 2]);
  assert.equal(frame.activeIndex, 0);
  assert.equal(frame.localProgress, 0);
});

test('half progress makes AI the active front card', () => {
  const frame = frameFor(.5);
  assert.deepEqual(frame.order, [1, 2, 0]);
  assert.equal(frame.activeIndex, 1);
});

test('final frame makes robotics front and releases after it settles', () => {
  const frame = frameFor(1);
  assert.deepEqual(frame.order, [2, 0, 1]);
  assert.equal(frame.activeIndex, 2);
  assert.equal(frame.localProgress, 0);
  assert.match(source, /var motionDistance = total \* \(2 \/ 3\)/);
});

test('outgoing card follows the approved wide arc and depth path', () => {
  assertPoseClose(poseFor(0, 0), { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 });
  assertPoseClose(poseFor(0, .5), { x: 219, y: 31, rotate: 11.5, scale: .9575, opacity: 1 });
  assertPoseClose(poseFor(0, 1), { x: 18, y: -34, rotate: 3, scale: .965, opacity: 1 });
});

test('incoming card advances continuously from rear depth to front', () => {
  assertPoseClose(poseFor(1, 0), { x: -18, y: -34, rotate: -3, scale: .965, opacity: 1 });
  assertPoseClose(poseFor(1, .5), { x: -9, y: -17, rotate: -1.5, scale: .9825, opacity: 1 });
  assertPoseClose(poseFor(1, 1), { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 });
});

test('paint-layer crossover waits until the outgoing card is separated', () => {
  assert.match(
    source,
    /slotIndex === 0 \? \(amount < 0\.55 \? 4 : 1\) : \(slotIndex === 1 \? 3 : 2\)/
  );
});

test('rear cards use restrained tilt while every card stays fully opaque', () => {
  assert.match(source, /\{ x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 \}/);
  assert.match(source, /\{ x: -18, y: -34, rotate: -3, scale: \.965, opacity: 1 \}/);
  assert.match(source, /\{ x: 18, y: -34, rotate: 3, scale: \.965, opacity: 1 \}/);
});
