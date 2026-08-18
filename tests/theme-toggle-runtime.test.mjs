import assert from 'node:assert/strict';
import test from 'node:test';
import theme from '../js/theme-toggle.js';

function makeRoot() {
  const attributes = new Map();
  return {
    attributes,
    setAttribute(name, value) { attributes.set(name, value); },
    removeAttribute(name) { attributes.delete(name); }
  };
}

function makeButton() {
  const attributes = new Map();
  const listeners = new Map();
  return {
    attributes,
    listeners,
    setAttribute(name, value) { attributes.set(name, value); },
    addEventListener(type, listener) { listeners.set(type, listener); },
    removeEventListener(type, listener) {
      if (listeners.get(type) === listener) listeners.delete(type);
    },
    click() { listeners.get('click')?.(); }
  };
}

function makeStorage(initialValue = null) {
  const values = new Map();
  if (initialValue !== null) values.set('zetrix-theme', initialValue);
  return {
    values,
    getItem(key) { return values.get(key) ?? null; },
    setItem(key, value) { values.set(key, value); }
  };
}

function makeThrowingStorage() {
  return {
    getItem() { throw new Error('storage unavailable'); },
    setItem() { throw new Error('storage unavailable'); }
  };
}

function makeHarness({ stored = null, storage = makeStorage(stored) } = {}) {
  const documentElement = makeRoot();
  const button = makeButton();
  const doc = {
    documentElement,
    querySelector(selector) {
      return selector === '[data-theme-toggle]' ? button : null;
    }
  };
  const win = { localStorage: storage };
  return { button, doc, documentElement, storage, win };
}

test('theme values normalize to a dark default', () => {
  assert.equal(theme.normalizeTheme('light'), 'light');
  assert.equal(theme.normalizeTheme('dark'), 'dark');
  assert.equal(theme.normalizeTheme('system'), 'dark');
  assert.equal(theme.normalizeTheme(null), 'dark');
});

test('storage reads and writes safely', () => {
  const storage = makeStorage('light');
  assert.equal(theme.readStoredTheme(storage), 'light');
  assert.equal(theme.writeStoredTheme(storage, 'dark'), true);
  assert.equal(storage.values.get(theme.STORAGE_KEY), 'dark');
  assert.equal(theme.readStoredTheme(makeThrowingStorage()), 'dark');
  assert.equal(theme.writeStoredTheme(makeThrowingStorage(), 'light'), false);
});

test('applyTheme only marks the light state on the root', () => {
  const root = makeRoot();
  const doc = { documentElement: root };

  assert.equal(theme.applyTheme(doc, 'light'), 'light');
  assert.equal(root.attributes.get('data-theme'), 'light');
  assert.equal(theme.applyTheme(doc, 'dark'), 'dark');
  assert.equal(root.attributes.has('data-theme'), false);
});

test('a saved light preference still initializes in dark mode', () => {
  const environment = makeHarness({ stored: 'light' });
  const cleanup = theme.init(environment.doc, environment.win);

  assert.equal(environment.documentElement.attributes.has('data-theme'), false);
  assert.equal(environment.button.attributes.get('aria-pressed'), 'false');
  assert.equal(environment.button.attributes.get('aria-label'), 'Switch to light mode');
  assert.equal(environment.button.attributes.get('title'), 'Switch to light mode');

  environment.button.click();

  assert.equal(environment.documentElement.attributes.get('data-theme'), 'light');
  assert.equal(environment.button.attributes.get('aria-pressed'), 'true');
  assert.equal(environment.button.attributes.get('aria-label'), 'Switch to dark mode');
  assert.equal(environment.storage.values.get(theme.STORAGE_KEY), 'light');

  cleanup();
  assert.equal(environment.button.listeners.has('click'), false);
});

test('storage failure remains interactive and a missing button is harmless', () => {
  const environment = makeHarness({ storage: makeThrowingStorage() });
  assert.doesNotThrow(() => theme.init(environment.doc, environment.win));
  assert.doesNotThrow(() => environment.button.click());
  assert.equal(environment.documentElement.attributes.get('data-theme'), 'light');

  const cleanup = theme.init({
    documentElement: makeRoot(),
    querySelector() { return null; }
  }, {});
  assert.equal(typeof cleanup, 'function');
  assert.doesNotThrow(cleanup);
});

test('a throwing localStorage getter safely falls back to dark', () => {
  const environment = makeHarness();
  Object.defineProperty(environment.win, 'localStorage', {
    get() { throw new Error('denied'); }
  });

  assert.doesNotThrow(() => theme.init(environment.doc, environment.win));
  assert.equal(environment.documentElement.attributes.has('data-theme'), false);
  assert.equal(environment.button.attributes.get('aria-pressed'), 'false');
});
