import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import motion from '../js/tools-motion.js';

const source = readFileSync(new URL('../js/tools-motion.js', import.meta.url), 'utf8');
const css = readFileSync(new URL('../css/styles.css', import.meta.url), 'utf8');

function makePin() {
  const classes = new Set();
  return {
    classes,
    classList: {
      add(...names) { names.forEach((name) => classes.add(name)); },
      remove(...names) { names.forEach((name) => classes.delete(name)); },
      toggle(name, active) { active ? classes.add(name) : classes.delete(name); },
      contains(name) { return classes.has(name); }
    }
  };
}

function makeMediaQuery(matches) {
  const listeners = new Set();
  return {
    matches,
    listeners,
    addEventListener(type, listener) {
      assert.equal(type, 'change');
      listeners.add(listener);
    },
    removeEventListener(type, listener) {
      assert.equal(type, 'change');
      listeners.delete(listener);
    }
  };
}

function makeControllerEnvironment({ entryMatches, ambientMatches }) {
  const pin = makePin();
  const track = { querySelector(selector) { return selector === '.tools__pin' ? pin : null; } };
  const entryMotion = makeMediaQuery(entryMatches);
  const ambientMotion = makeMediaQuery(ambientMatches);
  const frames = [];
  const timers = [];
  const documentListeners = new Map();
  let observer;
  const doc = {
    visibilityState: 'visible',
    querySelector(selector) { return selector === '[data-tools-track]' ? track : null; },
    addEventListener(type, listener) { documentListeners.set(type, listener); },
    removeEventListener(type, listener) { documentListeners.delete(type); }
  };
  const win = {
    IntersectionObserver: class {
      constructor(callback) { this.callback = callback; observer = this; }
      observe(target) { this.target = target; }
      disconnect() { this.disconnected = true; }
    },
    matchMedia(query) {
      if (query === '(prefers-reduced-motion: no-preference)') return entryMotion;
      if (query === '(min-width: 1024px) and (prefers-reduced-motion: no-preference)') return ambientMotion;
      throw new Error(`unexpected media query: ${query}`);
    },
    requestAnimationFrame(callback) { frames.push(callback); return frames.length; },
    cancelAnimationFrame() {},
    setTimeout(callback, delay) { timers.push({ callback, delay }); return timers.length; },
    clearTimeout() {}
  };

  return { pin, entryMotion, ambientMotion, frames, timers, documentListeners, doc, win, get observer() { return observer; } };
}

test('resetAssembly removes every cube lifecycle class', () => {
  const pin = makePin();
  pin.classList.add('is-cubes-visible', 'is-cubes-assembled', 'is-cube-assembly-complete', 'is-float-active');

  motion.resetAssembly(pin);

  assert.deepEqual([...pin.classes], []);
});

test('showAssembly starts visible with cubes unassembled before the animation frame', () => {
  const pin = makePin();

  motion.showAssembly(pin, false);

  assert.equal(pin.classes.has('is-cubes-visible'), true);
  assert.equal(pin.classes.has('is-cubes-assembled'), false);
  assert.equal(pin.classes.has('is-cube-assembly-complete'), false);
  assert.equal(pin.classes.has('is-float-active'), false);
});

test('showAssembly completes the stack immediately for reduced motion', () => {
  const pin = makePin();

  motion.showAssembly(pin, true);

  assert.equal(pin.classes.has('is-cubes-visible'), true);
  assert.equal(pin.classes.has('is-cubes-assembled'), true);
  assert.equal(pin.classes.has('is-cube-assembly-complete'), true);
});

test('floating begins only after assembly completes', () => {
  const classes = new Set();
  const pin = { classList: { toggle(name, active) { active ? classes.add(name) : classes.delete(name); } } };

  assert.equal(motion.setFloatActive(pin, true, true, true, false), false);
  assert.equal(motion.setFloatActive(pin, true, true, true, true), true);
  assert.equal(classes.has('is-float-active'), true);
  assert.equal(motion.setFloatActive(pin, false, true, true, true), false);
});

test('browser controller replays on entry and resets on non-intersecting exit', () => {
  assert.match(source, /new win\.IntersectionObserver/);
  assert.match(source, /threshold:\s*\[0,\s*0\.25\]/);
  assert.match(source, /if \(!entry\.isIntersecting\)\s*\{[\s\S]*leaveSection\(\)/);
  assert.match(source, /showAssembly\(pin, !entryMotion\.matches\)/);
  assert.match(source, /win\.requestAnimationFrame\(function startAssembly\(\)/);
  assert.match(source, /classList\.add\('is-cube-assembly-complete'\)/);
  assert.match(source, /win\.setTimeout\(completeAssembly,\s*1800\)/);
  assert.match(source, /win\.cancelAnimationFrame\(assemblyFrame\)/);
  assert.doesNotMatch(source, /addEventListener\('scroll'/);
  assert.doesNotMatch(source, /stateForProgress|progressFromMetrics|applyState/);
  assert.doesNotMatch(source, /function markAssembled/);
  assert.doesNotMatch(source, /is-cubes-assembled'\)\) return/);
});

test('mobile entry motion replays while ambient floating remains desktop-only and cleanup removes both listeners', () => {
  const environment = makeControllerEnvironment({ entryMatches: true, ambientMatches: false });
  const cleanup = motion.init(environment.doc, environment.win);

  assert.equal(environment.observer.target, environment.doc.querySelector('[data-tools-track]'));
  environment.observer.callback([{ isIntersecting: true, intersectionRatio: 0.25 }]);
  assert.equal(environment.pin.classes.has('is-cubes-visible'), true);
  assert.equal(environment.pin.classes.has('is-cubes-assembled'), false);

  environment.frames.shift()();
  assert.equal(environment.pin.classes.has('is-cubes-assembled'), true);
  assert.deepEqual(environment.timers.map(({ delay }) => delay), [1800]);
  environment.timers.shift().callback();
  assert.equal(environment.pin.classes.has('is-cube-assembly-complete'), true);
  assert.equal(environment.pin.classes.has('is-float-active'), false);

  environment.observer.callback([{ isIntersecting: false, intersectionRatio: 0 }]);
  assert.deepEqual([...environment.pin.classes], []);
  environment.observer.callback([{ isIntersecting: true, intersectionRatio: 0.25 }]);
  assert.equal(environment.frames.length, 1);
  assert.equal(environment.pin.classes.has('is-cubes-assembled'), false);

  cleanup();
  assert.equal(environment.entryMotion.listeners.size, 0);
  assert.equal(environment.ambientMotion.listeners.size, 0);
  assert.equal(environment.documentListeners.size, 0);
});

test('controller gives entry and ambient motion independent media-query responsibilities', () => {
  assert.match(source, /var entryMotion = win\.matchMedia\('\(prefers-reduced-motion: no-preference\)'\)/);
  assert.match(source, /var ambientMotion = win\.matchMedia\('\(min-width: 1024px\) and \(prefers-reduced-motion: no-preference\)'\)/);
  assert.match(source, /showAssembly\(pin, !entryMotion\.matches\)/);
  assert.match(source, /ambientMotion\.matches, assemblyComplete/);
  assert.match(source, /entryMotion\.addEventListener\('change', onEntryMotionChange\)/);
  assert.match(source, /ambientMotion\.addEventListener\('change', onAmbientMotionChange\)/);
  assert.match(source, /entryMotion\.removeEventListener\('change', onEntryMotionChange\)/);
  assert.match(source, /ambientMotion\.removeEventListener\('change', onAmbientMotionChange\)/);
});

test('browser lifecycle pauses ambient motion and clears pending work on cleanup', () => {
  assert.match(source, /doc\.addEventListener\('visibilitychange', onVisibilityChange\)/);
  assert.match(source, /observer\.disconnect\(\)/);
  assert.match(source, /win\.clearTimeout\(assemblyTimer\)/);
  assert.match(source, /clearPending\(\);\s*resetAssembly\(pin\)/);
  assert.match(source, /doc\.removeEventListener\('visibilitychange', onVisibilityChange\)/);
});

test('tools artwork preserves responsive active opacity while its section is active', () => {
  const compactToolsStart = css.indexOf('@media (max-width: 699px) {');
  const compactToolsEnd = css.indexOf('/* ===================== AI LAYER', compactToolsStart);
  const compactToolsCss = css.slice(compactToolsStart, compactToolsEnd);

  assert.match(css, /\.tools__art\s*\{[^}]*--tools-art-active-opacity:\s*1[^}]*opacity:\s*0[^}]*visibility:\s*hidden[^}]*transition:\s*none/s);
  assert.match(css, /\.tools__pin\.is-cubes-visible \.tools__art\s*\{[^}]*opacity:\s*var\(--tools-art-active-opacity\)[^}]*visibility:\s*visible/s);
  assert.match(css, /@media \(max-width:\s*1023px\)\s*\{[\s\S]*?\.tools__art\s*\{[^}]*--tools-art-active-opacity:\s*\.38/s);
  assert.match(compactToolsCss, /\.tools__art\s*\{[^}]*--tools-art-active-opacity:\s*\.28[^}]*display:\s*block[^}]*right:\s*-250px[^}]*transform:\s*scale\(\.72\)[^}]*transform-origin:\s*50% 0/s);
  assert.doesNotMatch(compactToolsCss, /\.tools__art\s*\{[^}]*display:\s*none/s);
});

test('rendered cubes stack smoothly from bottom to top before floating', () => {
  assert.match(css, /\.tools__cube\s*\{[^}]*transition:[^}]*transform 1200ms cubic-bezier\(\.16, 1, \.3, 1\) var\(--cube-entry-delay\)[^}]*opacity 700ms ease-out var\(--cube-entry-delay\)/s);
  assert.match(css, /\.tools__cube--bottom\s*\{[^}]*--cube-entry-delay:\s*0ms/s);
  assert.match(css, /\.tools__cube--centre\s*\{[^}]*--cube-entry-delay:\s*250ms/s);
  assert.match(css, /\.tools__cube--top\s*\{[^}]*--cube-entry-delay:\s*500ms/s);
});

test('leaving the section resets cubes instantly so every re-entry starts fresh', () => {
  assert.match(
    css,
    /\.tools__pin:not\(\.is-cubes-visible\) \.tools__cube\s*\{[^}]*transition:\s*none/s
  );
});

test('width-based structural fallback does not preassemble responsive cubes', () => {
  const fallbackStart = css.indexOf('@media (max-width: 1023px), (prefers-reduced-motion: reduce) {');
  const fallbackEnd = css.indexOf('@media (max-width: 1023px) {', fallbackStart + 1);

  assert.ok(fallbackStart >= 0 && fallbackEnd > fallbackStart, 'tools structural fallback is missing');
  const structuralFallback = css.slice(fallbackStart, fallbackEnd);
  assert.doesNotMatch(
    structuralFallback,
    /--cube-(?:bottom|centre|top)-(?:y|scale|opacity)\s*:/,
    'responsive structure must not overwrite the hidden/separated cube entry state'
  );
  assert.match(css, /\.tools__pin\s*\{[^}]*--cube-bottom-y:\s*-72px[^}]*--cube-bottom-opacity:\s*0/s);
  assert.match(css, /\.tools__pin\.is-cubes-assembled\s*\{[^}]*--cube-bottom-y:\s*0px[^}]*--cube-bottom-opacity:\s*1/s);
});
