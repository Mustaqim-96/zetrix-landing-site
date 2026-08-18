import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const css = readFileSync(new URL('../css/styles.css', import.meta.url), 'utf8');
const cardsScript = readFileSync(new URL('../js/cards.js', import.meta.url), 'utf8');
const revealScript = readFileSync(new URL('../js/site-reveal.js', import.meta.url), 'utf8');

test('ecosystem keeps its long track inside a full-screen sticky viewport', () => {
  assert.match(css, /\.eco-track\s*\{[^}]*height:\s*280vh/s);
  assert.match(css, /\.eco-pin\s*\{[^}]*position:\s*sticky[^}]*top:\s*0[^}]*min-height:\s*100svh[^}]*place-items:\s*center/s);
  assert.match(css, /\.eco-card\s*\{[^}]*max-width:\s*1280px[^}]*height:\s*min\(840px,\s*calc\(100svh - 120px\)\)[^}]*padding:\s*80px[^}]*border-radius:\s*28px/s);
  assert.match(css, /\.eco-card__sub\s*\{[^}]*margin-top:\s*16px[^}]*font-size:\s*20px[^}]*line-height:\s*28px/s);
  assert.match(css, /\.eco-stack\s*\{[^}]*width:\s*523px[^}]*margin-right:\s*32px[^}]*transform:\s*translateY\(13px\)/s);
  assert.match(css, /\.eco-fcard:nth-child\(1\)\s*\{\s*--rot:\s*3deg;\s*\}/);
  assert.doesNotMatch(css, /\.eco-fcard:nth-child\(3\) \.node-illus\s*\{[^}]*max-width:\s*277px/);
  assert.match(cardsScript, /var REVEAL = \[0\.10, 0\.40, 0\.75\]/);
  assert.match(cardsScript, /coin\.classList\.toggle\('is-in',\s*rect\.top <= 0\)/);
});

test('tools section uses normal-flow full-screen geometry', () => {
  assert.match(css, /\.tools\s*\{[^}]*position:\s*relative[^}]*min-height:\s*100vh[^}]*min-height:\s*100svh[^}]*height:\s*auto/s);
  assert.match(css, /\.tools__pin\s*\{[^}]*position:\s*relative[^}]*top:\s*auto[^}]*width:\s*100%[^}]*height:\s*100vh[^}]*height:\s*100svh[^}]*padding:\s*120px 0[^}]*display:\s*flex[^}]*align-items:\s*center[^}]*overflow:\s*hidden/s);
  assert.doesNotMatch(css, /\.tools\s*\{[^}]*height:\s*180vh/s);
  assert.doesNotMatch(css, /\.tools__pin\s*\{[^}]*position:\s*sticky/s);
  assert.match(css, /\.tools__inner\s*\{[^}]*width:\s*min\(1200px,\s*calc\(100% - 48px\)\)[^}]*margin-inline:\s*auto/s);
  assert.match(css, /\.tools__left\s*\{[^}]*width:\s*600px/s);
  assert.match(css, /\.tools__sub\s*\{[^}]*margin-top:\s*16px[^}]*max-width:\s*600px[^}]*font-size:\s*20px[^}]*line-height:\s*28px/s);
  assert.match(css, /\.tool-grid\s*\{[^}]*margin-top:\s*40px[^}]*grid-template-columns:\s*repeat\(2,\s*290px\)[^}]*gap:\s*20px/s);
  assert.match(css, /\.tools__art\s*\{[^}]*top:\s*-22px[^}]*right:\s*0[^}]*width:\s*576px[^}]*height:\s*820px/s);
  assert.match(css, /\.tools__pin\.is-cubes-assembled\s*\{[^}]*--cube-bottom-y:\s*0px[^}]*--cube-centre-y:\s*0px[^}]*--cube-top-y:\s*0px/s);
  assert.match(css, /\.tools__cube\s*\{[^}]*transition:[^}]*transform 1200ms[^}]*opacity 700ms/s);
});

test('AI and robotics sections use normal-flow full-screen geometry', () => {
  assert.match(css, /\.ai-layer\s*\{[^}]*position:\s*relative[^}]*min-height:\s*100vh[^}]*min-height:\s*100svh[^}]*height:\s*auto/s);
  assert.match(css, /\.ai-layer__pin\s*\{[^}]*position:\s*relative[^}]*top:\s*auto[^}]*width:\s*100%[^}]*height:\s*100vh[^}]*height:\s*100svh[^}]*overflow:\s*hidden/s);
  assert.doesNotMatch(css, /\.ai-layer\s*\{[^}]*height:\s*180vh/s);
  assert.doesNotMatch(css, /\.ai-layer__pin\s*\{[^}]*position:\s*sticky/s);
  assert.match(css, /\.robotics\s*\{[^}]*position:\s*relative[^}]*min-height:\s*100vh[^}]*min-height:\s*100svh/s);
  assert.match(css, /\.robotics__pin\s*\{[^}]*position:\s*relative[^}]*height:\s*100vh[^}]*height:\s*100svh[^}]*overflow:\s*hidden/s);
});

test('short and narrow viewports receive explicit structural fallbacks', () => {
  assert.match(css, /@media \(min-width:\s*1024px\) and \(max-height:\s*899px\)/);
  assert.match(css, /@media \(min-width:\s*1024px\) and \(max-height:\s*899px\)[\s\S]*?\.tools__pin\s*\{[^}]*padding:\s*96px 0 20px[^}]*align-items:\s*flex-start/);
  assert.match(css, /@media \(min-width:\s*1024px\) and \(max-height:\s*899px\)[\s\S]*?\.tools__inner\s*\{[^}]*left:\s*50%[^}]*width:\s*min\(1333\.333px,\s*calc\(111\.111% - 53\.333px\)\)[^}]*margin-inline:\s*0[^}]*transform:\s*translateX\(-50%\) scale\(0\.9\)[^}]*transform-origin:\s*50% 0/s);
  assert.match(css, /@media \(min-width:\s*1024px\) and \(max-height:\s*799px\)[\s\S]*?\.tools__inner\s*\{[^}]*width:\s*min\(1578\.947px,\s*calc\(131\.579% - 63\.158px\)\)[^}]*transform:\s*translateX\(-50%\) scale\(0\.76\)[^}]*flex-shrink:\s*0/);
  assert.doesNotMatch(css, /\.tool-card\s*\{[^}]*height:\s*132px/);
  assert.match(css, /@media \(max-width:\s*1023px\)[\s\S]*?\.eco-track\s*\{[^}]*height:\s*auto/);
  assert.match(css, /@media \(max-width:\s*1023px\)[\s\S]*?\.eco-pin\s*\{[^}]*position:\s*static/);
  assert.match(css, /@media \(max-width:\s*1023px\)[\s\S]*?\.eco-stack\s*\{[^}]*width:\s*100%[^}]*margin-right:\s*0[^}]*transform:\s*none/);
  assert.match(css, /@media \(max-width:\s*1023px\), \(prefers-reduced-motion:\s*reduce\)[\s\S]*?\.tools\s*\{[^}]*height:\s*auto/);
  assert.match(css, /@media \(max-width:\s*1023px\), \(prefers-reduced-motion:\s*reduce\)[\s\S]*?\.tools__pin\s*\{[^}]*position:\s*relative[^}]*height:\s*auto[^}]*min-height:\s*100vh[^}]*min-height:\s*100svh/s);
  assert.match(css, /@media \(max-width:\s*1023px\), \(prefers-reduced-motion:\s*reduce\)[\s\S]*?\.ai-layer\s*\{[^}]*height:\s*auto/);
  assert.match(css, /@media \(max-width:\s*1023px\), \(prefers-reduced-motion:\s*reduce\)[\s\S]*?\.ai-layer__pin\s*\{[^}]*position:\s*relative[^}]*height:\s*auto[^}]*min-height:\s*100vh[^}]*min-height:\s*100svh/s);
  assert.match(css, /@media \(max-width:\s*899px\)[\s\S]*?\.ai-layer__pin\s*\{[^}]*min-height:\s*100vh[^}]*min-height:\s*100svh[^}]*padding:\s*96px 24px 80px/s);
  assert.match(css, /@media \(max-width:\s*1023px\)[\s\S]*?\.robotics__pin\s*\{[^}]*height:\s*auto[^}]*min-height:\s*100vh[^}]*min-height:\s*100svh/s);
  assert.match(css, /@media \(max-width:\s*899px\)[\s\S]*?\.robotics__pin\s*\{[^}]*padding:\s*96px 24px 80px/s);
  assert.doesNotMatch(css, /\.ai-layer__pin\s*\{[^}]*min-height:\s*auto/s);
  assert.match(css, /@media \(max-width:\s*1023px\)[\s\S]*?\.tools__pin\s*\{[^}]*padding:\s*112px 0 80px/);
  assert.match(css, /@media \(max-width:\s*1023px\)[\s\S]*?\.tools__left\s*\{[^}]*width:\s*min\(600px,\s*100%\)/);
  assert.match(css, /@media \(max-width:\s*1023px\)[\s\S]*?\.tool-grid\s*\{[^}]*grid-template-columns:\s*repeat\(2,\s*290px\)/);
  assert.match(css, /@media \(max-width:\s*699px\)[\s\S]*?\.tools__inner\s*\{[^}]*width:\s*calc\(100% - 40px\)/);
  assert.match(css, /@media \(max-width:\s*699px\)[\s\S]*?\.tool-grid\s*\{[^}]*grid-template-columns:\s*1fr/);
  assert.match(revealScript, /var step = typeof staggerStep === 'number' \? staggerStep : 160/);
  assert.match(revealScript, /560 \+ index \* step/);
  assert.match(css, /\.layers-cta-handoff\s*\{[^}]*height:\s*400svh/s);
  assert.match(css, /\.layers-track\s*\{[^}]*position:\s*sticky[^}]*height:\s*100svh/s);
  assert.match(css, /\.layers__pin\s*\{[^}]*position:\s*relative[^}]*height:\s*100svh/s);
  assert.match(css, /@media \(max-width:\s*1023px\), \(prefers-reduced-motion:\s*reduce\)[\s\S]*?\.layers-track\s*\{[^}]*height:\s*auto/s);
});
