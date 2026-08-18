import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

const script = readFileSync(new URL('../js/site-reveal.js', import.meta.url), 'utf8');

class FakeStyle {
  constructor() {
    this.values = new Map();
  }

  setProperty(name, value) {
    this.values.set(name, String(value));
  }

  getPropertyValue(name) {
    return this.values.get(name) ?? '';
  }
}

class FakeElement {
  constructor(ownerDocument, tagName = 'div') {
    this.ownerDocument = ownerDocument;
    this.nodeType = 1;
    this.nodeName = tagName.toUpperCase();
    this.childNodes = [];
    this.style = new FakeStyle();
    this.attributes = new Map();
    this.selectorMap = new Map();
    this.selectorAllMap = new Map();
    this.dataset = {};
    this.classes = new Set();
    this.classList = {
      add: (...names) => names.forEach((name) => this.classes.add(name)),
      remove: (...names) => names.forEach((name) => this.classes.delete(name)),
      contains: (name) => this.classes.has(name)
    };
  }

  get className() {
    return Array.from(this.classes).join(' ');
  }

  set className(value) {
    this.classes = new Set(String(value).split(/\s+/).filter(Boolean));
  }

  get textContent() {
    return this.childNodes.map((node) => node.nodeType === 3 ? node.nodeValue : node.textContent).join('');
  }

  set textContent(value) {
    this.childNodes = [this.ownerDocument.createTextNode(String(value))];
  }

  setAttribute(name, value) {
    this.attributes.set(name, String(value));
  }

  getAttribute(name) {
    return this.attributes.get(name) ?? null;
  }

  appendChild(node) {
    this.childNodes.push(node);
    return node;
  }

  replaceChildren(...nodes) {
    this.childNodes = nodes.flatMap((node) =>
      node.nodeName === '#DOCUMENT-FRAGMENT' ? node.childNodes : [node]
    );
  }

  querySelector(selector) {
    return this.selectorMap.get(selector) ?? null;
  }

  querySelectorAll(selector) {
    return this.selectorAllMap.get(selector) ?? [];
  }
}

class FakeTextNode {
  constructor(value) {
    this.nodeType = 3;
    this.nodeName = '#text';
    this.nodeValue = value;
  }
}

class FakeDocument {
  constructor() {
    this.selectorMap = new Map();
    this.documentElement = this.createElement('html');
  }

  createElement(tagName) {
    return new FakeElement(this, tagName);
  }

  createTextNode(value) {
    return new FakeTextNode(value);
  }

  createDocumentFragment() {
    return new FakeElement(this, '#document-fragment');
  }

  querySelector(selector) {
    return this.selectorMap.get(selector) ?? null;
  }
}

function makeTextElement(document, ...nodes) {
  const element = document.createElement('div');
  nodes.forEach((node) => element.appendChild(
    node === '<br>' ? document.createElement('br') : document.createTextNode(node)
  ));
  return element;
}

function collect(root, className) {
  const matches = [];
  const visit = (node) => {
    if (node.nodeType === 1 && node.classList.contains(className)) matches.push(node);
    if (node.childNodes) node.childNodes.forEach(visit);
  };
  visit(root);
  return matches;
}

function createFixture({ reducedMotion = false, observerSupported = true } = {}) {
  const document = new FakeDocument();
  const makeRoot = (selector) => {
    const root = document.createElement('section');
    document.selectorMap.set(selector, root);
    return root;
  };

  const hero = makeRoot('.hero__content');
  const title = makeTextElement(document, 'From Trusted', '<br>', 'Infrastructure');
  const subtitle = makeTextElement(document, 'Build trust');
  const cta = makeTextElement(document, 'Get Started');
  hero.selectorMap.set('.hero__title', title);
  hero.selectorMap.set('.hero__subtitle', subtitle);
  hero.selectorMap.set('.hero__cta', cta);

  const laterTargets = [];
  const configureGroup = (rootSelector, selectors, surfaceSelector, surfaceCount) => {
    const root = makeRoot(rootSelector);
    selectors.forEach((selector) => {
      const target = rootSelector === '.eco-card__left' && selector === '.section-heading'
        ? makeTextElement(document, 'One ecosystem.', '<br>', 'Built on standards.')
        : makeTextElement(document, selector);
      root.selectorMap.set(selector, target);
      laterTargets.push(target);
    });
    if (surfaceSelector) {
      root.selectorAllMap.set(surfaceSelector,
        Array.from({ length: surfaceCount }, () => document.createElement('article')));
    }
    return root;
  };

  const eco = configureGroup('.eco-card__left', ['.section-heading', '.eco-card__sub'], null, 0);
  const tools = configureGroup('.tools__left', ['.section-heading', '.tools__sub'], '.tool-card', 2);
  const ai = configureGroup('.ai-layer__inner', ['.section-heading'], '.ai-card', 1);
  const robotics = configureGroup('.robotics__inner', ['.robotics__title', '.robotics__subtitle'], '.robot-card', 2);
  const layers = configureGroup('.layers__inner', ['.section-heading', '.section-sub'], '.carousel__stack, .carousel__foot', 2);
  const roots = [hero, eco, tools, ai, robotics, layers];

  const animationFrames = [];
  const timers = [];
  const listeners = new Map();
  const observerInstances = [];
  class FakeIntersectionObserver {
    constructor(callback, options) {
      this.callback = callback;
      this.options = options;
      this.observed = [];
      this.unobserved = [];
      observerInstances.push(this);
    }

    observe(target) {
      this.observed.push(target);
    }

    unobserve(target) {
      this.unobserved.push(target);
    }
  }

  const window = {
    matchMedia: () => ({ matches: reducedMotion }),
    requestAnimationFrame: (callback) => animationFrames.push(callback),
    setTimeout: (callback, delay) => {
      timers.push({ callback, delay });
      return timers.length;
    },
    addEventListener: (type, callback) => {
      const callbacks = listeners.get(type) ?? [];
      callbacks.push(callback);
      listeners.set(type, callbacks);
    },
    dispatchEvent: (event) => {
      (listeners.get(event.type) ?? []).slice().forEach((callback) => callback(event));
      return true;
    },
    CustomEvent: class CustomEvent {
      constructor(type) { this.type = type; }
    }
  };
  const context = { document, window };
  if (observerSupported) {
    window.IntersectionObserver = FakeIntersectionObserver;
    context.IntersectionObserver = FakeIntersectionObserver;
  }

  return {
    ai,
    animationFrames,
    context,
    cta,
    hero,
    laterTargets,
    listeners,
    observerInstances,
    roots,
    robotics,
    subtitle,
    title,
    timers,
    tools
  };
}

test('controller enhances hero and later copy while registering six once-only groups', () => {
  const fixture = createFixture();
  vm.runInNewContext(script, fixture.context);

  assert.equal(fixture.observerInstances.length, 1);
  const observer = fixture.observerInstances[0];
  assert.equal(observer.options.threshold, 0.15);
  assert.deepEqual(observer.observed, fixture.roots);

  const titleGlyphs = collect(fixture.title, 'hero__glyph');
  const subtitleGlyphs = collect(fixture.subtitle, 'hero__glyph');
  assert.equal(titleGlyphs.length, 25);
  assert.equal(subtitleGlyphs.length, 10);
  assert.equal(collect(fixture.cta, 'hero__glyph').length, 0);
  assert.equal(titleGlyphs[0].style.getPropertyValue('--hero-glyph-delay'), '0ms');
  assert.equal(titleGlyphs[1].style.getPropertyValue('--hero-glyph-delay'), '8ms');
  assert.equal(subtitleGlyphs[0].style.getPropertyValue('--hero-glyph-delay'), '180ms');
  assert.equal(subtitleGlyphs[1].style.getPropertyValue('--hero-glyph-delay'), '183ms');

  const titleVisual = collect(fixture.title, 'hero__reveal-visual')[0];
  const titleAccessible = collect(fixture.title, 'hero__reveal-a11y')[0];
  assert.equal(titleVisual.getAttribute('aria-hidden'), 'true');
  assert.equal(titleVisual.childNodes.filter((node) => node.nodeName === 'BR').length, 1);
  assert.equal(titleAccessible.childNodes[0].nodeValue, 'From Trusted Infrastructure');

  assert.equal(fixture.laterTargets.length, 9);
  fixture.laterTargets.forEach((target) => {
    assert.equal(collect(target, 'hero__glyph').length, 0);
    assert.equal(target.classList.contains('copy-dissolve'), true);
    assert.ok(collect(target, 'copy-dissolve__word').length > 0);
    assert.equal(collect(target, 'copy-dissolve__a11y').length, 1);
  });
  const ecoTitleVisual = collect(fixture.laterTargets[0], 'copy-dissolve__visual')[0];
  const ecoTitleA11y = collect(fixture.laterTargets[0], 'copy-dissolve__a11y')[0];
  const ecoTitleWords = collect(fixture.laterTargets[0], 'copy-dissolve__word');
  assert.equal(ecoTitleVisual.getAttribute('aria-hidden'), 'true');
  assert.equal(ecoTitleVisual.childNodes.filter((node) => node.nodeName === 'BR').length, 1);
  assert.equal(ecoTitleA11y.textContent, 'One ecosystem. Built on standards.');
  assert.deepEqual(
    ecoTitleWords.map((word) => word.style.getPropertyValue('--copy-word-delay')),
    ['0ms', '50ms', '100ms', '150ms', '200ms']
  );
  assert.deepEqual(
    fixture.laterTargets.map((target) =>
      collect(target, 'copy-dissolve__word')[0].style.getPropertyValue('--copy-word-delay')),
    ['0ms', '180ms', '0ms', '180ms', '0ms', '0ms', '180ms', '0ms', '180ms']
  );
  assert.deepEqual(
    fixture.tools.selectorAllMap.get('.tool-card')
      .map((card) => card.style.getPropertyValue('--tool-card-delay')),
    ['560ms', '720ms']
  );
  assert.deepEqual(
    fixture.ai.selectorAllMap.get('.ai-card')
      .map((card) => card.style.getPropertyValue('--tool-card-delay')),
    ['560ms']
  );
  assert.deepEqual(
    fixture.robotics.selectorAllMap.get('.robot-card')
      .map((card) => card.style.getPropertyValue('--tool-card-delay')),
    ['560ms', '720ms']
  );

  observer.callback([{ isIntersecting: false, target: fixture.hero }]);
  assert.equal(observer.unobserved.length, 0);
  observer.callback([{ isIntersecting: true, target: fixture.hero }]);
  assert.deepEqual(observer.unobserved, [fixture.hero]);
  assert.equal(fixture.hero.classList.contains('is-in'), false);
  fixture.animationFrames.shift()();
  assert.equal(fixture.hero.classList.contains('is-in'), true);
  observer.callback([{ isIntersecting: false, target: fixture.hero }]);
  assert.equal(fixture.hero.classList.contains('is-in'), true);
});

test('reduced motion and unsupported observers leave original DOM untouched', () => {
  [
    createFixture({ reducedMotion: true }),
    createFixture({ observerSupported: false })
  ].forEach((fixture) => {
    vm.runInNewContext(script, fixture.context);
    assert.equal(fixture.observerInstances.length, 0);
    assert.equal(fixture.title.childNodes.length, 3);
    assert.equal(collect(fixture.title, 'hero__glyph').length, 0);
    assert.equal(fixture.roots.some((root) => root.classList.contains('is-reveal-ready')), false);
    assert.equal(fixture.laterTargets.some((target) => target.classList.contains('copy-dissolve')), false);
    assert.equal(fixture.laterTargets.some((target) => collect(target, 'copy-dissolve__word').length), false);
  });
});

test('hero waits for intro and signals once after its computed reveal endpoint', () => {
  const fixture = createFixture();
  fixture.context.document.documentElement.classList.add('site-intro-pending');
  let completions = 0;
  fixture.context.window.addEventListener('zetrix:hero-reveal-complete', () => {
    completions += 1;
  });
  vm.runInNewContext(script, fixture.context);

  const observer = fixture.observerInstances[0];
  observer.callback([{ isIntersecting: true, target: fixture.hero }]);
  assert.equal(fixture.animationFrames.length, 0);
  assert.equal(fixture.hero.classList.contains('is-in'), false);

  fixture.context.document.documentElement.classList.remove('site-intro-pending');
  fixture.context.window.dispatchEvent(
    new fixture.context.window.CustomEvent('zetrix:intro-complete')
  );
  fixture.animationFrames.shift()();
  assert.equal(fixture.hero.classList.contains('is-in'), true);

  const completionTimer = fixture.timers.find((timer) =>
    timer.delay >= 900 && timer.delay < 2000
  );
  assert.ok(completionTimer);
  completionTimer.callback();
  completionTimer.callback();
  assert.equal(completions, 1);
  assert.equal(
    fixture.context.document.documentElement.dataset.heroRevealComplete,
    'true'
  );
});

test('hero fails open when the intro controller never emits completion', () => {
  const fixture = createFixture();
  fixture.context.document.documentElement.classList.add('site-intro-pending');
  vm.runInNewContext(script, fixture.context);

  const observer = fixture.observerInstances[0];
  observer.callback([{ isIntersecting: true, target: fixture.hero }]);
  assert.equal(fixture.hero.classList.contains('is-in'), false);

  const introFallback = fixture.timers.find((timer) => timer.delay === 4300);
  assert.ok(introFallback);
  introFallback.callback();
  fixture.animationFrames.shift()();
  assert.equal(fixture.hero.classList.contains('is-in'), true);
});

test('unsupported reveal support marks hero content complete immediately', () => {
  const fixture = createFixture({ observerSupported: false });
  let completions = 0;
  fixture.context.window.addEventListener('zetrix:hero-reveal-complete', () => {
    completions += 1;
  });
  vm.runInNewContext(script, fixture.context);

  assert.equal(completions, 1);
  assert.equal(
    fixture.context.document.documentElement.dataset.heroRevealComplete,
    'true'
  );
});
