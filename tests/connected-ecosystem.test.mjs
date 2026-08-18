import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync } from 'node:fs';
import test from 'node:test';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const css = readFileSync(new URL('../css/styles.css', import.meta.url), 'utf8');
const controller = readFileSync(new URL('../js/layers-carousel.js', import.meta.url), 'utf8');

const assets = [
  '../assets/img/connected-ecosystem-blockchain.png',
  '../assets/img/connected-ecosystem-ai.png',
  '../assets/img/connected-ecosystem-robotics.png',
];

test('connected ecosystem Figma cards are permanent local assets', () => {
  assets.forEach((relativePath) => {
    const asset = new URL(relativePath, import.meta.url);
    assert.equal(existsSync(asset), true, `${relativePath} is missing`);
    assert.ok(statSync(asset).size > 0, `${relativePath} is empty`);
  });
});

test('connected ecosystem uses a semantic three-card sticky deck', () => {
  const section = html.match(/<section class="layers-track"[\s\S]*?<\/section>/)?.[0] ?? '';
  assert.match(section, /id="connected-ecosystem"/);
  assert.match(section, /class="layers__pin"/);
  assert.equal((section.match(/<article class="carousel__card"/g) ?? []).length, 3);
  assert.match(section, /data-slide-index="0"[\s\S]*connected-ecosystem-blockchain\.png/);
  assert.match(section, /data-slide-index="1"[\s\S]*connected-ecosystem-ai\.png/);
  assert.match(section, /data-slide-index="2"[\s\S]*connected-ecosystem-robotics\.png/);
  assert.match(section, /id="carousel-status"[^>]*aria-live="polite"/);
  assert.match(section, /id="carousel-prev"[^>]*disabled/);
  assert.match(section, /id="carousel-next"/);
  assert.doesNotMatch(section, /carousel__ghost|figma\.com\/api\/mcp\/asset/);
});

test('connected ecosystem loads its isolated carousel controller', () => {
  assert.match(html, /<script src="js\/layers-carousel\.js\?v=7" defer><\/script>/);
  assert.match(html, /<link rel="stylesheet" href="css\/styles\.css\?v=87" \/>/);
});

test('connected ecosystem preserves Figma deck geometry', () => {
  assert.match(css, /\.layers-cta-handoff\s*\{[^}]*height:\s*400vh[^}]*height:\s*400svh/s);
  assert.match(css, /\.layers-track\s*\{[^}]*position:\s*sticky[^}]*top:\s*0[^}]*height:\s*100vh[^}]*height:\s*100svh/s);
  assert.match(css, /\.layers__pin\s*\{[^}]*position:\s*relative[^}]*height:\s*100vh[^}]*height:\s*100svh/s);
  assert.match(css, /\.layers__inner\s*\{[^}]*width:\s*1200px[^}]*height:\s*808px/s);
  assert.match(css, /\.layers__inner\s*\{[^}]*top:\s*max\(128px,\s*calc\(50% - 404px\)\)[^}]*transform:\s*translateX\(-50%\)[^}]*transform-origin:\s*50% 0/s);
  assert.match(css, /\.layers__heading\s*\{[^}]*width:\s*800px/s);
  assert.match(css, /\.carousel__stack\s*\{[^}]*width:\s*840px[^}]*height:\s*448px/s);
  assert.match(css, /\.carousel__card\s*\{[^}]*width:\s*800px[^}]*height:\s*400px[^}]*padding:\s*16px[^}]*border-radius:\s*16px/s);
  assert.match(css, /\.carousel__card\s*\{[^}]*padding:\s*16px[^}]*background:\s*rgba\(24,\s*24,\s*27,\s*0\.70\)/s);
  assert.match(css, /\.carousel__card img\s*\{[^}]*border-radius:\s*12px[^}]*object-fit:\s*cover/s);
  assert.match(css, /\.carousel__foot\s*\{[^}]*margin:\s*24px auto 0/s);
});

test('connected ecosystem fits short laptops and keeps the pinned hand-off on narrow screens', () => {
  assert.match(css, /@media \(min-width:\s*1024px\) and \(max-height:\s*899px\)[\s\S]*?\.layers__inner\s*\{[^}]*top:\s*128px[^}]*transform:\s*translateX\(-50%\) scale\(\.82\)/s);
  assert.match(css, /@media \(min-width:\s*1024px\) and \(max-height:\s*749px\)[\s\S]*?\.layers__inner\s*\{[^}]*top:\s*128px[^}]*transform:\s*translateX\(-50%\) scale\(\.72\)/s);
  // Narrow screens keep the pinned scroll-driven hand-off: the inner is centred to fit.
  assert.match(css, /@media \(max-width:\s*1023px\)\s*\{\s*\.layers__pin\s*\{[^}]*padding-inline:\s*24px[^}]*\}\s*\.layers__inner\s*\{[^}]*top:\s*50%[^}]*transform:\s*translate\(-50%,\s*-50%\)/s);
  // Shared narrow sizing keeps the fluid card geometry (used by pinned and flow fallback).
  assert.match(css, /@media \(max-width:\s*1023px\), \(prefers-reduced-motion:\s*reduce\)[\s\S]*?\.carousel__stack\s*\{[^}]*aspect-ratio:\s*840 \/ 448/s);
  assert.match(css, /@media \(max-width:\s*1023px\), \(prefers-reduced-motion:\s*reduce\)[\s\S]*?\.carousel__card\s*\{[^}]*top:\s*10\.71%[^}]*height:\s*89\.29%/s);
});

test('connected ecosystem reduced motion remains visible and unpinned', () => {
  assert.match(css, /@media \(prefers-reduced-motion:\s*reduce\)[\s\S]*?\.layers__inner[\s\S]*?transition:\s*none !important/s);
  assert.match(css, /@media \(prefers-reduced-motion:\s*reduce\)\s*\{[\s\S]*?\.layers-cta-handoff\s*\{[^}]*height:\s*auto/s);
  assert.match(css, /@media \(prefers-reduced-motion:\s*reduce\)\s*\{[\s\S]*?\.layers-track\s*\{[^}]*position:\s*relative[^}]*height:\s*auto/s);
  assert.match(css, /@media \(prefers-reduced-motion:\s*reduce\)\s*\{[\s\S]*?\.layers__pin\s*\{[^}]*position:\s*relative[^}]*min-height:\s*100svh/s);
  assert.match(css, /@media \(prefers-reduced-motion:\s*reduce\)\s*\{[\s\S]*?\.layers__inner\s*\{[^}]*top:\s*auto[^}]*transform:\s*none/s);
});

test('connected ecosystem keeps its phone heading to three lines with 64px card clearance', () => {
  assert.match(html, /id="layers-title"[^>]*><span class="layers__title-line">Blockchain proves\.<\/span> <span class="layers__title-line">AI decides\.<\/span><br class="layers__title-break" \/><span class="layers__title-line">Robotics acts\.<\/span><\/h2>/);
  assert.match(css, /@media \(max-width:\s*767px\)[\s\S]*?\.layers__title-line\s*\{[^}]*display:\s*block[^}]*white-space:\s*nowrap/s);
  assert.match(css, /@media \(max-width:\s*767px\)[\s\S]*?\.layers__title-break\s*\{[^}]*display:\s*none/s);
  assert.match(css, /@media \(max-width:\s*767px\)[\s\S]*?\.layers__heading \.section-heading\s*\{[^}]*font-size:\s*24px[^}]*line-height:\s*30px/s);
  assert.match(css, /@media \(max-width:\s*767px\)[\s\S]*?\.carousel\s*\{[^}]*margin-top:\s*64px/s);
  assert.doesNotMatch(css, /@media \(max-width:\s*767px\)[\s\S]*?\.layers__heading \.section-heading\s*\{[^}]*font-size:\s*clamp/s);
});

test('carousel finishes before the CTA begins covering it', () => {
  assert.match(controller, /querySelector\('\[data-layers-handoff\]'\)/);
  assert.equal((controller.match(/motionDistance\s*=\s*total\s*\*\s*\(2\s*\/\s*3\)/g) ?? []).length, 2);
});

test('desktop handoff exposes a bounded outgoing dissolve with static fallbacks', () => {
  assert.match(controller, /setProperty\('--layers-exit-progress',\s*frame\.dissolveProgress\)/);
  assert.match(css, /\.layers__inner\s*\{[^}]*opacity:\s*calc\(1 - var\(--layers-exit-progress,\s*0\)\)[^}]*filter:\s*blur\(calc\(var\(--layers-exit-progress,\s*0\) \* 12px\)\)/s);
  assert.match(css, /@media \(prefers-reduced-motion:\s*reduce\)\s*\{[\s\S]*?\.layers__inner\s*\{[^}]*opacity:\s*1[^}]*filter:\s*none[^}]*will-change:\s*auto/s);
});
