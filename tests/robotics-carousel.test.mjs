import test from 'node:test';
import assert from 'node:assert/strict';
import carousel from '../js/robotics-carousel.js';

test('mobile robotics index stays within the available cards', () => {
  assert.equal(carousel.nextIndex(0, -1, 3), 0);
  assert.equal(carousel.nextIndex(0, 1, 3), 1);
  assert.equal(carousel.nextIndex(2, 1, 3), 2);
});

test('mobile robotics status uses one-based, zero-padded numbering', () => {
  assert.equal(carousel.statusText(0, 3), '01 / 03');
  assert.equal(carousel.statusText(2, 3), '03 / 03');
});

test('mobile robotics pagination activates exactly one Figma bar', () => {
  assert.deepEqual(carousel.progressState(0, 3), [true, false, false]);
  assert.deepEqual(carousel.progressState(1, 3), [false, true, false]);
  assert.deepEqual(carousel.progressState(2, 3), [false, false, true]);
});

test('tablet robotics shows two cards and has two positions for three cards', () => {
  assert.equal(carousel.visibleCount(true), 2);
  assert.equal(carousel.visibleCount(false), 1);
  assert.equal(carousel.lastIndex(3, 2), 1);
  assert.equal(carousel.lastIndex(3, 1), 2);
});

test('tablet robotics announces the visible range', () => {
  assert.equal(carousel.rangeStatusText(0, 2, 3), '01–02 / 03');
  assert.equal(carousel.rangeStatusText(1, 2, 3), '02–03 / 03');
});
