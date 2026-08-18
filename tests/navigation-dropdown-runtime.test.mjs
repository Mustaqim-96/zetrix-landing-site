import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';

const url = new URL('../js/nav-dropdown.js', import.meta.url);
const source = existsSync(url) ? readFileSync(url, 'utf8') : '';

test('controller exports deterministic keyboard helpers and approved delay', async () => {
  assert.ok(source, 'nav dropdown controller is missing');
  const nav = (await import('../js/nav-dropdown.js')).default;
  assert.equal(nav.CLOSE_DELAY, 160);
  assert.equal(nav.isActivationKey('Enter'), true);
  assert.equal(nav.isActivationKey(' '), true);
  assert.equal(nav.isActivationKey('ArrowDown'), false);
  assert.equal(nav.wrapTabIndex(0, -1, 4), 3);
  assert.equal(nav.wrapTabIndex(3, 1, 4), 0);
  assert.equal(nav.wrapTabIndex(1, 1, 4), 2);
});

test('desktop interaction owns hover, focus, sizing, and delayed dismissal', () => {
  assert.match(source, /matchMedia\('\(min-width: 1024px\)'\)/);
  assert.match(source, /pointerenter/);
  assert.match(source, /focusin/);
  assert.match(source, /setTimeout\([^,]+, CLOSE_DELAY\)/s);
  assert.match(source, /clearTimeout/);
  assert.match(source, /--nav-panel-height/);
  assert.match(source, /scrollHeight/);
  assert.match(source, /aria-expanded/);
  assert.match(source, /requestAnimationFrame/);
  assert.match(source, /is-switching/);
});

test('controller supports escape, outside dismissal, focus restoration, and cleanup', () => {
  assert.match(source, /event\.key === 'Escape'/);
  assert.match(source, /listen\(doc, 'pointerdown'/);
  assert.match(source, /lastTrigger\.focus\(\)/);
  assert.match(source, /removeEventListener/);
  assert.match(source, /return function cleanup/);
});

test('mobile interaction traps focus and exposes one accordion at a time', () => {
  assert.match(source, /data-nav-mobile-toggle/);
  assert.match(source, /data-nav-accordion-trigger/);
  assert.match(source, /is-nav-locked/);
  assert.match(source, /event\.key !== 'Tab'/);
  assert.match(source, /wrapTabIndex/);
  assert.match(source, /is-accordion-open/);
  assert.match(source, /nav\.parentNode\.querySelector\('\[data-nav-backdrop\]'\)/);
});
