import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { createRequire } from 'node:module';
import test from 'node:test';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const css = readFileSync(new URL('../css/styles.css', import.meta.url), 'utf8');
const introAsset = new URL('../assets/img/logo-zetrix-intro.svg', import.meta.url);

test('intro uses the exact committed Figma wordmark', () => {
  assert.equal(existsSync(introAsset), true);
  assert.ok(statSync(introAsset).size > 0);
  const svg = readFileSync(introAsset, 'utf8');
  assert.match(svg, /<svg/i);
  assert.match(svg, /#(?:C82127|c82127)/);
  assert.match(svg, /fill="black"/);
});

test('head guard enables the intro on every page load and has a CSS failsafe', () => {
  assert.doesNotMatch(html, /sessionStorage/);
  assert.doesNotMatch(html, /zetrix:intro:v1/);
  assert.match(html, /classList\.add\('site-intro-pending'\)/);
  assert.match(html, /__zetrixIntroFailsafe = setTimeout/);
  assert.match(html, /classList\.remove\('site-intro-pending'\)/);
});

test('decorative overlay contains all three official color states', () => {
  assert.match(html, /class="site-intro" data-site-intro aria-hidden="true"/);
  assert.match(html, /class="site-intro__canvas site-intro__canvas--brand"/);
  assert.match(html, /class="site-intro__canvas site-intro__canvas--dark"/);
  assert.match(html, /class="site-intro__logo" data-site-intro-logo/);
  assert.match(html, /class="site-intro__mark site-intro__mark--light" src="assets\/img\/logo-zetrix-intro\.svg"/);
  assert.match(html, /class="site-intro__mark site-intro__mark--white" src="assets\/img\/logo-zetrix-intro\.svg"/);
  assert.match(html, /class="site-intro__mark site-intro__mark--nav" src="assets\/img\/logo-zetrix\.svg"/);
});

test('intro CSS is hidden by default and uses exact responsive geometry', () => {
  assert.match(css, /\.site-intro\s*\{[^}]*display:\s*none[^}]*position:\s*fixed[^}]*inset:\s*0[^}]*z-index:\s*1000/s);
  assert.match(css, /\.site-intro-pending \.site-intro\s*\{[^}]*display:\s*grid/s);
  assert.match(css, /\.site-intro__logo\s*\{[^}]*width:\s*min\(348px,\s*calc\(100vw - 48px\)\)[^}]*aspect-ratio:\s*348\s*\/\s*60/s);
  assert.match(css, /@media \(max-width:\s*479px\)[\s\S]*?\.site-intro__logo\s*\{[^}]*width:\s*min\(220px,\s*calc\(100vw - 48px\)\)/s);
  assert.match(css, /\.site-intro__canvas--brand\s*\{[^}]*background:\s*#c5242e[^}]*clip-path:\s*inset\(0 100% 0 0\)/s);
  assert.match(css, /\.site-intro__canvas--dark\s*\{[^}]*background:\s*#18181b/s);
});

const require = createRequire(import.meta.url);
const intro = require('../js/site-intro.js');

test('intro completion signal dispatches exactly once', () => {
  const events = [];
  function CustomEvent(type) { this.type = type; }
  const signal = intro.createCompletionSignal({
    CustomEvent,
    dispatchEvent: (event) => events.push(event.type),
  });

  assert.equal(signal(), true);
  assert.equal(signal(), false);
  assert.deepEqual(events, ['zetrix:intro-complete']);
});

test('every reveal exit shares the completion signal', () => {
  const script = readFileSync(new URL('../js/site-intro.js', import.meta.url), 'utf8');
  assert.match(script, /var signalComplete = createCompletionSignal\(win\)/);
  assert.match(script, /root\.classList\.remove\('site-intro-pending'\);[\s\S]*signalComplete\(\)/);
  assert.match(script, /function cleanup\(\)[\s\S]*signalComplete\(\)/);
});

test('controller has no persistent replay gate', () => {
  const script = readFileSync(new URL('../js/site-intro.js', import.meta.url), 'utf8');
  assert.doesNotMatch(script, /sessionStorage/);
  assert.doesNotMatch(script, /SESSION_KEY/);
  assert.doesNotMatch(script, /shouldRunIntro/);
  assert.doesNotMatch(script, /safeSessionRead/);
});

test('destination transform maps the centered logo to the live navbar bounds', () => {
  assert.deepEqual(
    intro.destinationTransform(
      { left: 546, top: 482, width: 348, height: 60 },
      { left: 224, top: 42, width: 116, height: 20 }
    ),
    { x: -322, y: -440, scaleX: 1 / 3, scaleY: 1 / 3 }
  );
});

test('missing intro markup fails open and removes the pending state', () => {
  const classes = new Set(['site-intro-pending']);
  const doc = {
    documentElement: {
      classList: {
        contains: (name) => classes.has(name),
        remove: (name) => classes.delete(name)
      }
    },
    querySelector: () => null
  };
  const cleanup = intro.init(doc, { location: { hash: '' }, scrollY: 0 });
  assert.equal(typeof cleanup, 'function');
  assert.equal(classes.has('site-intro-pending'), false);
});

test('controller contains the approved timing and every failure exit', () => {
  const script = readFileSync(new URL('../js/site-intro.js', import.meta.url), 'utf8');
  assert.match(script, /await wait\(550\)/);
  assert.match(script, /await wait\(600\)/);
  assert.match(script, /await wait\(400\)/);
  assert.match(script, /duration:\s*750/);
  assert.match(script, /win\.setTimeout\(cleanup,\s*3200\)/);
  assert.match(script, /doc\.addEventListener\('visibilitychange', onVisibilityChange\)/);
  assert.match(script, /win\.addEventListener\('pagehide', cleanup/);
  assert.match(script, /if \(!sourceRect\.width \|\| !targetRect\.width\) return cleanup\(\)/);
  assert.match(script, /catch \(error\) \{ cleanup\(\); \}/);
});

test('logo arrival includes scale movement and a single restrained pulse', () => {
  assert.match(css, /\.site-intro\.is-logo-visible \.site-intro__logo\s*\{[^}]*transition:[^}]*transform 550ms/s);
  assert.match(css, /@keyframes site-intro-pulse/);
  assert.match(css, /\.site-intro\.is-brand \.site-intro__logo::after\s*\{[^}]*animation:\s*site-intro-pulse 600ms/s);
});

test('intro controller loads before other deferred homepage controllers', () => {
  const introIndex = html.indexOf('<script src="js/site-intro.js?v=3" defer></script>');
  const revealIndex = html.indexOf('<script src="js/site-reveal.js?v=11" defer></script>');
  assert.ok(introIndex > -1);
  assert.ok(revealIndex > -1);
  assert.ok(introIndex < revealIndex);
});

test('stylesheet cache version is advanced for the intro styles', () => {
  assert.match(html, /<link rel="stylesheet" href="css\/styles\.css\?v=87" \/>/);
});

test('handoff reveals the real homepage while the brand canvas retires', () => {
  assert.match(css, /\.site-intro\.is-handoff\s*\{[^}]*background:\s*transparent/s);
  assert.match(css, /\.site-intro\.is-handoff \.site-intro__canvas--brand\s*\{[^}]*clip-path:\s*inset\(0 0 0 100%\)[^}]*750ms/s);
  assert.match(css, /\.site-intro\.is-handoff \.site-intro__canvas--dark\s*\{[^}]*clip-path:\s*inset\(0 0 0 0\)[^}]*opacity:\s*0[^}]*750ms/s);
});
