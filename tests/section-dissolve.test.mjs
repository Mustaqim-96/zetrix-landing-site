import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const css = readFileSync(new URL('../css/styles.css', import.meta.url), 'utf8');
const cardsScript = readFileSync(new URL('../js/cards.js', import.meta.url), 'utf8');
const toolsMotionScript = readFileSync(new URL('../js/tools-motion.js', import.meta.url), 'utf8');
const siteRevealUrl = new URL('../js/site-reveal.js', import.meta.url);
const revealScript = readFileSync(
  existsSync(siteRevealUrl) ? siteRevealUrl : new URL('../js/hero-reveal.js', import.meta.url),
  'utf8'
);

test('shared reveal controller replaces the hero-only script', () => {
  assert.ok(existsSync(siteRevealUrl));
  assert.match(html, /<script src="js\/site-reveal\.js\?v=11" defer><\/script>/);
  assert.doesNotMatch(html, /js\/hero-reveal\.js/);
});

test('ecosystem and tools copy use grouped once-only progressive dissolves', () => {
  assert.match(revealScript, /function setupDissolveGroup\(root, copyTargets, surfaceCards, cardStagger\)/);
  assert.match(revealScript, /setupDissolveGroup\(ecoCopy,\s*\[[\s\S]*?\.section-heading[\s\S]*?\.eco-card__sub[\s\S]*?\],\s*\[\]\)/);
  assert.match(revealScript, /setupDissolveGroup\(toolsCopy,\s*\[[\s\S]*?\.section-heading[\s\S]*?\.tools__sub[\s\S]*?\],\s*toolCards\)/);
  assert.doesNotMatch(revealScript, /setupDissolveGroup\(heroContent/);
  assert.doesNotMatch(revealScript, /classList\.remove\('is-in'\)/);
});

test('all six third-section cards dissolve in reading order', () => {
  assert.match(revealScript, /querySelectorAll\('\.tool-card'\)/);
  assert.match(revealScript, /var step = typeof staggerStep === 'number' \? staggerStep : 160/);
  assert.match(revealScript, /560 \+ index \* step/);
  assert.match(css, /\.tools__left\.is-reveal-ready \.tool-card\s*\{[^}]*opacity:\s*0[^}]*transition:\s*opacity 160ms ease-out/s);
  assert.match(css, /\.tools__left\.is-in \.tool-card\s*\{[^}]*opacity:\s*1[^}]*transition:\s*opacity 900ms cubic-bezier\(0\.16, 1, 0\.3, 1\) var\(--tool-card-delay\)/s);
  assert.doesNotMatch(css, /\.tools__left\.is-reveal-ready \.tool-card\s*\{[^}]*filter:/s);
  assert.doesNotMatch(css, /\.tools__left\.is-in \.tool-card\s*\{[^}]*filter:/s);
});

test('AI heading and cards use the stronger soft depth dissolve', () => {
  assert.match(revealScript, /setupDissolveGroup\(aiCopy,\s*\[[\s\S]*?\.section-heading[\s\S]*?\],\s*aiCards\)/);
  assert.match(css, /\.ai-layer__inner\.is-reveal-ready \.ai-card\s*\{[^}]*--card-reveal-y:\s*28px[^}]*--card-reveal-blur:\s*6px[^}]*opacity:\s*0[^}]*transform:\s*translateY\(var\(--card-reveal-y\)\) scale\(\.985\)[^}]*filter:\s*blur\(var\(--card-reveal-blur\)\)/s);
  assert.match(css, /\.ai-layer__inner\.is-in \.ai-card\s*\{[^}]*opacity:\s*1[^}]*transform:\s*translateY\(0\) scale\(1\)[^}]*filter:\s*blur\(0\)[^}]*transition:[^}]*900ms cubic-bezier\(0\.16, 1, 0\.3, 1\) var\(--tool-card-delay\)/s);
});

test('robotics copy and cards use the stronger soft depth dissolve', () => {
  assert.match(revealScript, /setupDissolveGroup\(roboticsCopy,\s*\[[\s\S]*?\.robotics__title[\s\S]*?\.robotics__subtitle[\s\S]*?\],\s*roboticsCards\)/);
  assert.match(css, /\.robotics__inner\.is-reveal-ready \.robot-card\s*\{[^}]*--card-reveal-y:\s*28px[^}]*--card-reveal-blur:\s*6px[^}]*opacity:\s*0[^}]*transform:\s*translateY\(var\(--card-reveal-y\)\) scale\(\.985\)[^}]*filter:\s*blur\(var\(--card-reveal-blur\)\)/s);
  assert.match(css, /\.robotics__inner\.is-in \.robot-card\s*\{[^}]*opacity:\s*1[^}]*transform:\s*translateY\(0\) scale\(1\)[^}]*filter:\s*blur\(0\)[^}]*transition:[^}]*900ms cubic-bezier\(0\.16, 1, 0\.3, 1\) var\(--tool-card-delay\)/s);
  assert.match(css, /@media \(max-width:\s*899px\)[\s\S]*?\.ai-layer__inner\.is-reveal-ready \.ai-card,[\s\S]*?\.robotics__inner\.is-reveal-ready \.robot-card\s*\{[^}]*--card-reveal-y:\s*18px[^}]*--card-reveal-blur:\s*4px/s);
  assert.match(css, /@media \(prefers-reduced-motion:\s*reduce\)[\s\S]*?\.robot-card[^}]*opacity:\s*1[^}]*filter:\s*none[^}]*transform:\s*none !important/s);
});

test('settled cards retain their pointer hover transforms', () => {
  assert.match(css, /\.ai-card:hover,\s*\.ai-layer__inner\.is-in \.ai-card:hover\s*\{[^}]*transform:\s*translateY\(-6px\)/s);
  assert.match(css, /\.robot-card:hover,\s*\.robotics__inner\.is-in \.robot-card:hover\s*\{[^}]*transform:\s*translateY\(-8px\) scale\(1\.01\)/s);
});

test('second-section deck is excluded while its existing motion remains intact', () => {
  assert.doesNotMatch(revealScript, /eco-fcard/);
  assert.doesNotMatch(cardsScript, /document\.querySelector\('\.eco-card__left'\)/);
  assert.match(cardsScript, /document\.querySelector\('\.eco-card__coin'\)/);
  assert.match(cardsScript, /var REVEAL = \[0\.10, 0\.40, 0\.75\]/);
  assert.match(css, /\.eco-fcard\s*\{[^}]*transition:\s*top \.8s cubic-bezier\(\.16, \.84, \.44, 1\)/s);
  assert.match(css, /\.eco-fcard__panel\s*\{[^}]*transition:\s*opacity \.55s ease/s);
  assert.doesNotMatch(css, /\.eco-fcard__panel\s*\{[^}]*transition:[^}]*max-height/s);
});

test('artwork scroll motion stays isolated from copy and card reveals', () => {
  assert.doesNotMatch(toolsMotionScript, /tool-card|tools__left|copy-dissolve/);
});

test('connected ecosystem copy and deck reveal once as grouped elements', () => {
  assert.match(revealScript, /setupDissolveGroup\(layersCopy,\s*\[[\s\S]*?\.section-heading[\s\S]*?\.section-sub[\s\S]*?\],\s*layersSurfaces\)/);
  assert.match(css, /\.layers__inner\.is-reveal-ready \.carousel__stack\s*\{[^}]*opacity:\s*0/s);
  assert.match(css, /\.layers__inner\.is-in \.carousel__stack\s*\{[^}]*opacity:\s*1[^}]*900ms cubic-bezier\(\.16, 1, \.3, 1\)/s);
  assert.match(css, /\.layers__inner\.is-in \.carousel__foot\s*\{[^}]*opacity:\s*1[^}]*900ms cubic-bezier\(\.16, 1, \.3, 1\)/s);
  assert.doesNotMatch(revealScript, /classList\.remove\('is-in'\)/);
});
