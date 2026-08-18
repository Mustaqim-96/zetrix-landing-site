import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import spotlight from '../js/footer-spotlight.js';

const source = readFileSync(new URL('../js/footer-spotlight.js', import.meta.url), 'utf8');

function makeClassList() {
  const classes = new Set();
  return {
    classes,
    add(...names) { names.forEach((name) => classes.add(name)); },
    remove(...names) { names.forEach((name) => classes.delete(name)); },
    contains(name) { return classes.has(name); }
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

function createHarness({ reduced = false } = {}) {
  const classList = makeClassList();
  const root = { classList, offsetWidth: 1200 };
  const motionQuery = makeMediaQuery(reduced);
  const documentListeners = new Map();
  let visibilityState = 'visible';
  let observer;

  const doc = {
    get visibilityState() { return visibilityState; },
    querySelector(selector) { return selector === '[data-footer-spotlight]' ? root : null; },
    addEventListener(type, listener) { documentListeners.set(type, listener); },
    removeEventListener(type, listener) { documentListeners.delete(type); }
  };
  const win = {
    matchMedia(query) {
      assert.equal(query, '(prefers-reduced-motion: reduce)');
      return motionQuery;
    },
    IntersectionObserver: class {
      constructor(callback, options) {
        this.callback = callback;
        this.options = options;
        observer = this;
      }
      observe(target) { this.target = target; }
      disconnect() { this.disconnected = true; }
    }
  };

  const cleanup = spotlight.init(doc, win);
  return {
    root,
    motionQuery,
    documentListeners,
    cleanup,
    get observer() { return observer; },
    setVisibility(value) { visibilityState = value; },
    fireVisibility() { documentListeners.get('visibilitychange')(); }
  };
}

test('controller uses the approved threshold and reduced-motion guard', () => {
  assert.match(source, /matchMedia\('\(prefers-reduced-motion: reduce\)'\)/);
  assert.match(source, /threshold:\s*\[0,\s*0\.25\]/);
});

test('entry activates, exit resets, and re-entry activates again', () => {
  const environment = createHarness();

  assert.equal(environment.observer.target, environment.root);
  assert.deepEqual(environment.observer.options.threshold, [0, 0.25]);
  environment.observer.callback([{ isIntersecting: true, intersectionRatio: 0.25 }]);
  assert.equal(environment.root.classList.contains('is-spotlight-active'), true);
  environment.observer.callback([{ isIntersecting: false, intersectionRatio: 0 }]);
  assert.equal(environment.root.classList.contains('is-spotlight-active'), false);
  environment.observer.callback([{ isIntersecting: true, intersectionRatio: 0.4 }]);
  assert.equal(environment.root.classList.contains('is-spotlight-active'), true);
});

test('repeated intersecting updates do not restart an active two-pass sequence', () => {
  const environment = createHarness();
  let additions = 0;
  const add = environment.root.classList.add.bind(environment.root.classList);
  environment.root.classList.add = (...names) => {
    additions += names.includes('is-spotlight-active') ? 1 : 0;
    add(...names);
  };

  environment.observer.callback([{ isIntersecting: true, intersectionRatio: 0.25 }]);
  environment.observer.callback([{ isIntersecting: true, intersectionRatio: 0.6 }]);

  assert.equal(additions, 1);
});

test('reduced motion keeps the wordmark muted even while intersecting', () => {
  const environment = createHarness({ reduced: true });

  environment.observer.callback([{ isIntersecting: true, intersectionRatio: 0.5 }]);

  assert.equal(environment.root.classList.contains('is-spotlight-active'), false);
});

test('hidden documents and cleanup reset the sequence and remove listeners', () => {
  const environment = createHarness();
  environment.observer.callback([{ isIntersecting: true, intersectionRatio: 0.25 }]);
  environment.setVisibility('hidden');
  environment.fireVisibility();
  assert.equal(environment.root.classList.contains('is-spotlight-active'), false);

  environment.cleanup();

  assert.equal(environment.root.classList.contains('is-spotlight-active'), false);
  assert.equal(environment.observer.disconnected, true);
  assert.equal(environment.documentListeners.size, 0);
  assert.equal(environment.motionQuery.listeners.size, 0);
});
