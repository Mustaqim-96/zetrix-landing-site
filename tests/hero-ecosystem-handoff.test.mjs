import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import test from 'node:test';

const require = createRequire(import.meta.url);
const handoff = require('../js/hero-ecosystem-handoff.js');

test('frame mapping dissolves the hero during the first half of the rise', () => {
  assert.deepEqual(handoff.frameFor(1024, 1024), { coverProgress: 0, exitProgress: 0 });
  assert.deepEqual(handoff.frameFor(768, 1024), { coverProgress: 0.25, exitProgress: 0.5 });
  assert.deepEqual(handoff.frameFor(512, 1024), { coverProgress: 0.5, exitProgress: 1 });
  assert.deepEqual(handoff.frameFor(0, 1024), { coverProgress: 1, exitProgress: 1 });
  assert.deepEqual(handoff.frameFor(-400, 1024), { coverProgress: 1, exitProgress: 1 });
  assert.deepEqual(handoff.frameFor(1500, 1024), { coverProgress: 0, exitProgress: 0 });
});

test('a shorter mobile hero stays completely sharp at the top of the page', () => {
  assert.deepEqual(
    handoff.frameFor(804, 844, 804),
    { coverProgress: 0, exitProgress: 0 }
  );
  assert.deepEqual(
    handoff.frameFor(402, 844, 804),
    { coverProgress: 0.5, exitProgress: 1 }
  );
});

test('static layouts include reduced motion but not narrow screens by default', () => {
  assert.equal(handoff.usesStaticLayout({ matchMedia: () => ({ matches: true }) }), true);
  assert.equal(handoff.usesStaticLayout({ matchMedia: () => ({ matches: false }) }), false);
  assert.equal(handoff.usesStaticLayout({}), true);
});

test('controller coalesces updates, writes progress, resets static state, and cleans up', () => {
  const values = [];
  const hero = { offsetHeight: 1238, style: { setProperty: (name, value) => values.push([name, value]) } };
  let ecosystemTop = 512;
  const ecosystem = { getBoundingClientRect: () => ({ top: ecosystemTop }) };
  const documentListeners = new Map();
  const windowListeners = new Map();
  const frames = new Map();
  let nextFrame = 1;
  let isStatic = false;

  const doc = {
    hidden: false,
    querySelector: (selector) => selector === '.hero' ? hero : selector === '.ecosystem' ? ecosystem : null,
    addEventListener: (name, handler) => documentListeners.set(name, handler),
    removeEventListener: (name) => documentListeners.delete(name)
  };
  const win = {
    innerHeight: 1024,
    matchMedia: () => ({ matches: isStatic }),
    requestAnimationFrame: (callback) => {
      const id = nextFrame++;
      frames.set(id, callback);
      return id;
    },
    cancelAnimationFrame: (id) => frames.delete(id),
    addEventListener: (name, handler) => windowListeners.set(name, handler),
    removeEventListener: (name) => windowListeners.delete(name)
  };

  const cleanup = handoff.init(doc, win);
  assert.equal(frames.size, 1);
  windowListeners.get('scroll')();
  assert.equal(frames.size, 1, 'scroll work is coalesced into the pending frame');
  const firstFrame = frames.entries().next().value;
  frames.delete(firstFrame[0]);
  firstFrame[1]();
  assert.deepEqual(values.at(-1), ['--hero-eco-exit-progress', '1.0000']);
  assert.ok(values.some(([name, value]) => name === '--hero-eco-sticky-top' && value === '-214px'));

  ecosystemTop = 768;
  windowListeners.get('scroll')();
  const secondFrame = frames.entries().next().value;
  frames.delete(secondFrame[0]);
  secondFrame[1]();
  assert.deepEqual(values.at(-1), ['--hero-eco-exit-progress', '0.5000']);

  isStatic = true;
  windowListeners.get('resize')();
  const staticFrame = frames.entries().next().value;
  frames.delete(staticFrame[0]);
  staticFrame[1]();
  assert.deepEqual(values.at(-1), ['--hero-eco-exit-progress', '0']);

  cleanup();
  assert.equal(windowListeners.has('scroll'), false);
  assert.equal(windowListeners.has('resize'), false);
  assert.equal(documentListeners.has('visibilitychange'), false);
  assert.deepEqual(values.at(-1), ['--hero-eco-exit-progress', '0']);
});

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const css = readFileSync(new URL('../css/styles.css', import.meta.url), 'utf8');
const cards = readFileSync(new URL('../js/cards.js', import.meta.url), 'utf8');

test('ecosystem surface rises over a bottom-sticky hero on every motion-enabled viewport', () => {
  const motionPrefix = /@media \(prefers-reduced-motion:\s*no-preference\)/;
  assert.match(css, new RegExp(motionPrefix.source + '[\\s\\S]*?\\.hero\\s*\\{[^}]*position:\\s*sticky[^}]*top:\\s*var\\(--hero-eco-sticky-top,\\s*0px\\)[^}]*bottom:\\s*0[^}]*z-index:\\s*1', 's'));
  assert.match(css, new RegExp(motionPrefix.source + '[\\s\\S]*?\\.ecosystem\\s*\\{[^}]*z-index:\\s*2[^}]*background:\\s*var\\(--bg\\)', 's'));
  assert.match(css, new RegExp(motionPrefix.source + '[\\s\\S]*?\\.hero__content,[\\s\\S]*?\\.hero__globe\\s*\\{[^}]*opacity:\\s*calc\\(1 - var\\(--hero-eco-exit-progress,\\s*0\\)\\)[^}]*filter:\\s*blur\\(calc\\(var\\(--hero-eco-exit-progress,\\s*0\\) \\* 12px\\)\\)', 's'));
});

test('the complete ribbon story stays interactive above the sticky hero', () => {
  assert.match(css, /\.ribbon-story\s*\{[^}]*position:\s*relative[^}]*z-index:\s*2[^}]*isolation:\s*isolate/s);
});

test('ecosystem leading feather exactly matches the CTA material', () => {
  const ecosystemFeather = css.match(/\.ecosystem::before\s*\{[^}]*\}/)?.[0] ?? '';
  const ctaFeather = css.match(/\.cta::before\s*\{[^}]*\}/)?.[0] ?? '';
  const gradient = /linear-gradient\(180deg,\s*rgba\(24,\s*24,\s*27,\s*0\)\s*0%,\s*rgba\(24,\s*24,\s*27,\s*\.68\)\s*58%,\s*#18181b\s*100%\)/;
  [ecosystemFeather, ctaFeather].forEach((rule) => {
    assert.match(rule, /top:\s*-192px/);
    assert.match(rule, /height:\s*192px/);
    assert.match(rule, gradient);
    assert.match(rule, /pointer-events:\s*none/);
  });
});

test('keyboard focus restores visible hero content above the takeover', () => {
  assert.match(css, /@media \(prefers-reduced-motion:\s*no-preference\)[\s\S]*?\.hero:focus-within\s*\{[^}]*z-index:\s*3/s);
  assert.match(css, /@media \(prefers-reduced-motion:\s*no-preference\)[\s\S]*?\.hero__content:focus-within\s*\{[^}]*opacity:\s*1[^}]*filter:\s*none/s);
});

test('coin waits for the settled track while deck thresholds remain unchanged', () => {
  assert.match(cards, /coin\.classList\.toggle\('is-in',\s*rect\.top <= 0\)/);
  assert.match(cards, /var REVEAL = \[0\.10, 0\.40, 0\.75\]/);
  assert.doesNotMatch(cards, /io\.observe\(ecoCard\)|threshold:\s*0\.2/);
});

test('handoff assets are loaded with exact cache versions', () => {
  assert.match(html, /<link rel="stylesheet" href="css\/styles\.css\?v=87" \/>/);
  assert.match(html, /<script src="js\/hero-ecosystem-handoff\.js\?v=3" defer><\/script>/);
  assert.match(html, /<script src="js\/cards\.js\?v=9" defer><\/script>/);
});
