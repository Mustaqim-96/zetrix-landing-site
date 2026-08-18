import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const css = readFileSync(new URL('../css/styles.css', import.meta.url), 'utf8');
const cardsScript = readFileSync(new URL('../js/cards.js', import.meta.url), 'utf8');

test('phone layout is isolated below the tablet breakpoint', () => {
  assert.match(css, /@media \(max-width:\s*767px\)/);
  assert.match(css, /@media \(max-width:\s*767px\)[\s\S]*?\.hero__title\s*\{[^}]*font-size:\s*32px[^}]*line-height:\s*42px/s);
  assert.match(css, /@media \(max-width:\s*767px\)[\s\S]*?\.tool-grid\s*\{[^}]*grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)/s);
});

test('robotics exposes mobile carousel controls and status', () => {
  assert.match(html, /data-robotics-carousel/);
  assert.match(html, /id="robotics-prev"/);
  assert.match(html, /id="robotics-next"/);
  assert.match(html, /id="robotics-status"[^>]*aria-live="polite"/);
  assert.match(html, /js\/robotics-carousel\.js/);
});

test('phone layout preserves the live globe and prevents wide section tracks', () => {
  assert.match(html, /id="hero-globe"/);
  assert.doesNotMatch(html, /figma[^"']*globe/i);
  assert.match(css, /@media \(max-width:\s*767px\)[\s\S]*?\.robot-cards\s*\{[^}]*overflow-x:\s*auto[^}]*scroll-snap-type:\s*x mandatory/s);
});

test('the second section restores a compact phone scroll stack', () => {
  assert.match(cardsScript, /var OFFSET = viewportWidth < 768 \? 56 : \(viewportWidth < 1024 \? 72 : 96\)/);
  assert.match(css, /@media \(max-width:\s*767px\)[\s\S]*?\.eco-track\s*\{[^}]*height:\s*300svh/s);
  assert.match(css, /@media \(max-width:\s*767px\)[\s\S]*?\.eco-pin\s*\{[^}]*position:\s*sticky[^}]*top:\s*0/s);
  assert.match(css, /@media \(max-width:\s*767px\)[\s\S]*?\.eco-fcard\s*\{[^}]*position:\s*absolute/s);
});

test('phone and tablet preserve the desktop ribbon sweep on an oversized cropped canvas', () => {
  assert.match(html, /class="ribbon-flow__mobile"[^>]*src="assets\/ribbon\/zetrix-mobile-ribbon\.svg"/);
  assert.match(css, /\.ribbon-flow__mobile\s*\{\s*display:\s*none/s);
  assert.doesNotMatch(css, /\.ribbon-flow__mobile\s*\{[^}]*display:\s*block/s);
  assert.match(css, /@media \(max-width:\s*1023px\)[\s\S]*?\.ribbon-flow__visual\s*\{[^}]*left:\s*50%[^}]*width:\s*clamp\(700px,\s*110vw,\s*1100px\)[^}]*margin-left:\s*0[^}]*transform:\s*translateX\(-50%\)[^}]*overflow:\s*visible/s);
  assert.match(css, /@media \(max-width:\s*1023px\)[\s\S]*?\.ribbon-flow__path\s*\{[^}]*stroke-width:\s*clamp\(120px,\s*23\.5vw,\s*240px\)/s);
  assert.doesNotMatch(css, /@media \(max-width:\s*1023px\)[\s\S]*?\.ribbon-flow__visual\s*\{[^}]*width:\s*82\.3375%/s);
  assert.doesNotMatch(css, /@media \(max-width:\s*767px\)[\s\S]*?\.ribbon-flow__visual\s*\{[^}]*display:\s*none/s);
});

test('Robotics and Connected Ecosystem use the Figma phone spacing', () => {
  assert.match(css, /@media \(max-width:\s*767px\)[\s\S]*?\.robotics__heading\s*\{[^}]*gap:\s*12px/s);
  assert.match(css, /@media \(max-width:\s*767px\)[\s\S]*?\.robot-cards\s*\{[^}]*margin-top:\s*32px/s);
  assert.match(css, /@media \(max-width:\s*767px\)[\s\S]*?\.robot-card[^}]*aspect-ratio:\s*350\s*\/\s*460/s);
  assert.match(css, /@media \(max-width:\s*767px\)[\s\S]*?\.carousel__stack\s*\{[^}]*width:\s*350px[^}]*height:\s*220px/s);
});

test('phone sections use the Figma 60px vertical rhythm without changing tablet geometry', () => {
  assert.match(css, /@media \(max-width:\s*767px\)[\s\S]*?\.hero\s*\{[^}]*padding:\s*100px 20px 0/s);
  assert.match(css, /@media \(max-width:\s*767px\)[\s\S]*?\.eco-card\s*\{[^}]*height:\s*min\(780px,\s*calc\(100svh - 120px\)\)/s);
  assert.match(css, /@media \(max-width:\s*767px\)[\s\S]*?\.tools__pin\s*\{[^}]*padding:\s*60px 0/s);
  assert.match(css, /@media \(max-width:\s*767px\)[\s\S]*?\.ai-layer__pin\s*\{[^}]*padding:\s*60px 20px/s);
  assert.match(css, /@media \(max-width:\s*767px\)[\s\S]*?\.robotics__pin\s*\{[^}]*padding:\s*60px 20px/s);
  assert.match(css, /@media \(max-width:\s*767px\)[\s\S]*?\.layers__pin\s*\{[^}]*padding:\s*60px 20px/s);
  assert.match(css, /@media \(max-width:\s*767px\)[\s\S]*?\.layers__inner\s*\{[^}]*top:\s*120px[^}]*bottom:\s*60px[^}]*height:\s*auto[^}]*display:\s*flex[^}]*flex-direction:\s*column[^}]*justify-content:\s*safe center[^}]*transform:\s*translateX\(-50%\)/s);
  assert.match(css, /@media \(max-width:\s*767px\)[\s\S]*?\.cta\s*\{[^}]*padding:\s*60px 20px/s);
  assert.match(css, /@media \(max-width:\s*767px\)[\s\S]*?\.cta__panel\s*\{[^}]*height:\s*min\(780px,\s*calc\(100svh - 120px\)\)[^}]*min-height:\s*0/s);
  assert.match(css, /@media \(min-width:\s*768px\) and \(max-width:\s*1023px\)[\s\S]*?\.eco-card\s*\{[^}]*height:\s*calc\(100svh - 48px\)/s);
});
