import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import test from 'node:test';

const require = createRequire(import.meta.url);
const handoff = require('../js/hero-ecosystem-handoff.js');
const css = readFileSync(new URL('../css/styles.css', import.meta.url), 'utf8');
const cards = readFileSync(new URL('../js/cards.js', import.meta.url), 'utf8');

function media({ reduced = false, narrow = false } = {}) {
  return {
    matchMedia(query) {
      return {
        matches: (query.includes('prefers-reduced-motion: reduce') && reduced) ||
          (query.includes('max-width: 1023px') && narrow)
      };
    }
  };
}

test('hero takeover remains animated on phone and tablet unless motion is reduced', () => {
  assert.equal(handoff.usesStaticLayout(media({ narrow: true })), false);
  assert.equal(handoff.usesStaticLayout(media({ reduced: true })), true);
});

test('motion-enabled phone and tablet keep the hero sticky behind Section 2', () => {
  assert.match(css, /@media \(prefers-reduced-motion:\s*no-preference\)[\s\S]*?\.hero\s*\{[^}]*position:\s*sticky[^}]*z-index:\s*1/s);
  assert.match(css, /@media \(prefers-reduced-motion:\s*no-preference\)[\s\S]*?\.ecosystem\s*\{[^}]*z-index:\s*2[^}]*background:\s*var\(--bg\)/s);
  assert.match(css, /@media \(prefers-reduced-motion:\s*no-preference\)[\s\S]*?\.ecosystem::before\s*\{[^}]*top:\s*-192px[^}]*height:\s*192px/s);
});

test('phone keeps Section 2 pinned for the complete three-card deal', () => {
  assert.match(css, /@media \(max-width:\s*767px\)[\s\S]*?html,\s*body\s*\{[^}]*overflow-x:\s*clip/s);
  assert.match(css, /@media \(max-width:\s*767px\)[\s\S]*?\.eco-track\s*\{[^}]*height:\s*300svh/s);
  assert.match(css, /@media \(max-width:\s*767px\)[\s\S]*?\.eco-pin\s*\{[^}]*position:\s*sticky[^}]*top:\s*0[^}]*min-height:\s*100svh/s);
  assert.match(css, /@media \(max-width:\s*767px\)[\s\S]*?\.eco-card\s*\{[^}]*padding:\s*64px 16px 24px/s);
});

test('tablet overrides the old static fallback with a centered vertical deck', () => {
  assert.match(css, /@media \(min-width:\s*768px\) and \(max-width:\s*1023px\)[\s\S]*?\.eco-track\s*\{[^}]*height:\s*280svh/s);
  assert.match(css, /@media \(min-width:\s*768px\) and \(max-width:\s*1023px\)[\s\S]*?\.eco-pin\s*\{[^}]*position:\s*sticky[^}]*top:\s*0[^}]*min-height:\s*100svh/s);
  assert.match(css, /@media \(min-width:\s*768px\) and \(max-width:\s*1023px\)[\s\S]*?\.eco-card\s*\{[^}]*display:\s*grid[^}]*grid-template-columns:\s*1fr[^}]*grid-template-rows:\s*auto minmax\(0,\s*1fr\)/s);
  assert.match(css, /@media \(min-width:\s*768px\) and \(max-width:\s*1023px\)[\s\S]*?\.eco-card\s*\{[^}]*padding:\s*56px 36px 36px/s);
  assert.match(css, /@media \(min-width:\s*768px\) and \(max-width:\s*1023px\)[\s\S]*?\.eco-stack\s*\{[^}]*justify-self:\s*center[^}]*transform:\s*none/s);
});

test('card offsets preserve readable peeks on phone, tablet, and desktop', () => {
  assert.match(cards, /var OFFSET = viewportWidth < 768 \? 56 : \(viewportWidth < 1024 \? 72 : 96\)/);
});

test('phone and tablet use a substantially larger lower-left cropped coin', () => {
  assert.match(css, /\.eco-card__coin\s*\{[^}]*max-width:\s*none/s);
  assert.match(css, /@media \(max-width:\s*767px\)[\s\S]*?\.eco-card__coin\s*\{[^}]*left:\s*-300px[^}]*bottom:\s*-260px[^}]*width:\s*760px/s);
  assert.match(css, /@media \(min-width:\s*768px\) and \(max-width:\s*1023px\)[\s\S]*?\.eco-card__coin\s*\{[^}]*left:\s*-280px[^}]*bottom:\s*-300px[^}]*width:\s*820px/s);
});

test('reduced motion restores normal flow and exposes the completed stack', () => {
  assert.match(css, /@media \(prefers-reduced-motion:\s*reduce\)[\s\S]*?\.eco-track\s*\{[^}]*height:\s*auto/s);
  assert.match(css, /@media \(prefers-reduced-motion:\s*reduce\)[\s\S]*?\.eco-pin\s*\{[^}]*position:\s*static/s);
  assert.match(cards, /if \(reduceMotion \|\| !track\) \{\s*setActive\(cards\.length - 1\)/s);
});

test('phone shortens only the outer frame and adds breathing room above the stack', () => {
  assert.match(css, /@media \(max-width:\s*767px\)[\s\S]*?\.eco-card\s*\{[^}]*height:\s*min\(780px,\s*calc\(100svh - 120px\)\)[^}]*gap:\s*40px/s);
  assert.match(css, /@media \(max-width:\s*767px\)[\s\S]*?\.eco-stack\s*\{[^}]*height:\s*540px/s);
  assert.doesNotMatch(css, /@media \(max-width:\s*767px\)[\s\S]*?\.eco-fcard\s*\{[^}]*height:/s);
});
