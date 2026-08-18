import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const css = readFileSync(new URL('../css/styles.css', import.meta.url), 'utf8');
const motionUrl = new URL('../js/ai-layer-motion.js', import.meta.url);
const motion = existsSync(motionUrl) ? readFileSync(motionUrl, 'utf8') : '';

test('AI layer uses the exact full-screen Figma grid', () => {
  assert.match(css, /\.ai-layer__pin\s*\{[^}]*height:\s*100svh/s);
  assert.match(css, /\.ai-layer__inner\s*\{[^}]*max-width:\s*1200px/s);
  assert.match(css, /\.ai-cards\s*\{[^}]*grid-template-columns:\s*repeat\(2,\s*590px\)[^}]*gap:\s*20px/s);
  assert.match(css, /\.ai-card\s*\{[^}]*min-height:\s*566px/s);
  assert.match(css, /\.ai-card__media\s*\{[^}]*aspect-ratio:\s*540\s*\/\s*340/s);
});

test('AI layer delegates ribbon rendering to the shared story layer', () => {
  assert.match(html, /<section class="ai-layer" data-ai-ribbon-track>/);
  assert.match(html, /<svg class="ribbon-flow__visual"[^>]*>[\s\S]*?<path class="ribbon-flow__path" opacity="0\.8"[^>]*fill="none" mask="url\(#ribbon-flow-edge-mask\)" \/>[\s\S]*?<\/svg>/);
  assert.doesNotMatch(html, /class="ai-layer__ribbon-reveal"|class="ai-layer__ribbon-path"|ribbon-slice/);
  assert.equal((html.match(/<article class="ai-card"/g) || []).length, 2);
});

test('AI layer removes its figure note', () => {
  assert.doesNotMatch(html, /Fig\. 4\s+—\s+AI layer/);
  assert.doesNotMatch(css, /\.ai-layer\s*>\s*\.fig-note/);
});

test('AI cards use the supplied permanent 1080 by 680 illustrations', () => {
  for (const file of ['ai-nurai-illustration.png', 'ai-avatar-illustration.png']) {
    assert.equal(existsSync(new URL(`../assets/img/${file}`, import.meta.url)), true, file);
  }
  assert.match(html, /<img class="ai-card__base-image" src="assets\/img\/ai-nurai-illustration\.png" width="1080" height="680" alt="NurAI product preview" \/>/);
  assert.match(html, /<img class="ai-card__base-image" src="assets\/img\/ai-avatar-illustration\.png" width="1080" height="680" alt="Avatar agent product preview" \/>/);
  assert.doesNotMatch(html, /class="ai-avatar__|data-ai-depth=/);
  assert.doesNotMatch(html, /figma\.com\/api\/mcp\/asset/);
});

test('AI cards reuse the established translucent glass surface', () => {
  assert.match(css, /\.ai-card\s*\{[^}]*background:\s*rgba\(24, 24, 27, 0\.74\)/s);
  assert.match(css, /\.ai-card\s*\{[^}]*border:\s*1px solid rgba\(209, 209, 214, 0\.20\)/s);
  assert.match(css, /\.ai-card\s*\{[^}]*-webkit-backdrop-filter:\s*blur\(22px\) saturate\(120%\)/s);
  assert.match(css, /\.ai-card\s*\{[^}]*backdrop-filter:\s*blur\(22px\) saturate\(120%\)/s);
  assert.match(css, /\.ai-card\s*\{[^}]*box-shadow:[^}]*inset 1px 1px 0 rgba\(255, 255, 255, 0\.06\)/s);
});

test('AI layer stacks naturally on narrow screens with a viewport minimum', () => {
  assert.match(css, /@media \(max-width:\s*899px\)[\s\S]*?\.ai-layer__pin\s*\{[^}]*min-height:\s*100vh[^}]*min-height:\s*100svh/s);
  assert.match(css, /@media \(max-width:\s*899px\)[\s\S]*?\.ai-cards\s*\{[^}]*grid-template-columns:\s*1fr/s);
});

test('AI layer proportionally fits the complete Figma composition on short laptops', () => {
  const desktopShortStart = css.indexOf('@media (min-width: 1280px) and (max-height: 899px)');
  const desktopShortEnd = css.indexOf('@media (min-width: 1280px) and (max-height: 799px)', desktopShortStart);
  const desktopShortCss = css.slice(desktopShortStart, desktopShortEnd);
  const tabletShortStart = css.indexOf('@media (min-width: 1024px) and (max-width: 1279px) and (max-height: 899px)');
  const tabletShortEnd = css.indexOf('@media (max-width: 1023px)', tabletShortStart);
  const tabletShortCss = css.slice(tabletShortStart, tabletShortEnd);

  assert.match(css, /@media \(min-width:\s*1280px\) and \(max-height:\s*899px\)[\s\S]*?\.ai-layer__inner\s*\{[^}]*width:\s*1363\.636px[^}]*max-width:\s*none[^}]*height:\s*702px[^}]*transform:\s*translateX\(-50%\) scale\(\.88\)[^}]*transform-origin:\s*50% 0/s);
  assert.match(css, /@media \(min-width:\s*1280px\) and \(max-height:\s*899px\)[\s\S]*?\.ai-cards\s*\{[^}]*width:\s*100%[^}]*grid-template-columns:\s*repeat\(2, minmax\(0, 1fr\)\)/s);
  assert.match(desktopShortCss, /\.ai-card__media\s*\{[^}]*width:\s*100%/s);
  assert.match(css, /@media \(min-width:\s*1280px\) and \(max-height:\s*799px\)[\s\S]*?\.ai-layer__inner\s*\{[^}]*width:\s*1538\.462px[^}]*transform:\s*translateX\(-50%\) scale\(\.78\)/s);
  assert.match(css, /@media \(min-width:\s*1024px\) and \(max-width:\s*1279px\) and \(max-height:\s*899px\)[\s\S]*?\.ai-layer__inner\s*\{[^}]*width:\s*min\(1421\.053px, calc\(131\.579% - 52\.632px\)\)[^}]*max-width:\s*none[^}]*height:\s*702px[^}]*transform:\s*translateX\(-50%\) scale\(\.76\)/s);
  assert.match(tabletShortCss, /\.ai-card__media\s*\{[^}]*width:\s*100%/s);
  assert.doesNotMatch(css, /@media \(min-width:\s*900px\) and \(max-height:\s*899px\)[\s\S]*?\.ai-card__media\s*\{[^}]*height:\s*clamp\(/s);
});

test('AI media is static while card reveal and focus states remain accessible', () => {
  assert.doesNotMatch(html, /<script src="js\/ai-layer-motion\.js"/);
  assert.doesNotMatch(css, /\.ai-layer\.is-ai-active|ai-depth-float|ai-wave-drift|ai-glow-breathe/);
  assert.match(css, /@media \(prefers-reduced-motion:\s*reduce\)[\s\S]*?\.ai-layer[\s\S]*?animation:\s*none/s);
  assert.match(css, /\.ai-card:focus-within\s*\{[^}]*outline:/s);
});

test('AI card CTAs use the approved secure external destinations', () => {
  assert.match(html, /<a class="btn btn--red ai-card__cta" href="https:\/\/nur-ai\.ai\/" target="_blank" rel="noopener noreferrer" aria-label="Know more about NurAI">/);
  assert.match(html, /<a class="btn btn--red ai-card__cta" href="https:\/\/avatar\.inc\/" target="_blank" rel="noopener noreferrer" aria-label="Know more about Avatar">/);
});

test('AI cards coordinate card, image, and CTA feedback', () => {
  assert.match(css, /\.ai-card__base-image\s*\{[^}]*transition:\s*transform 320ms cubic-bezier\(\.16, 1, \.3, 1\)/s);
  assert.match(css, /@media \(hover: hover\) and \(pointer: fine\)[\s\S]*?\.ai-card:hover \.ai-card__base-image\s*\{[^}]*transform:\s*scale\(1\.025\)/s);
  assert.match(css, /\.ai-card:focus-within \.ai-card__base-image\s*\{[^}]*transform:\s*scale\(1\.025\)/s);
  assert.match(css, /\.ai-card__cta:focus-visible\s*\{[^}]*outline:/s);
  assert.match(css, /@media \(prefers-reduced-motion:\s*reduce\)[\s\S]*?\.ai-layer \*,[\s\S]*?transition:\s*none !important/s);
  assert.match(css, /@media \(prefers-reduced-motion:\s*reduce\)[\s\S]*?\.ai-layer \.ai-card__base-image,[\s\S]*?\.ai-layer \.ai-card \.arrow-ext\s*\{[^}]*transform:\s*none/s);
});

test('AI heading uses two intentional phone lines without changing its desktop break', () => {
  assert.match(html, /<h2 class="section-heading section-heading--center"><span class="ai-heading__line">Intelligence grounded in<\/span><br class="ai-heading__break ai-heading__break--mobile" \/> <span class="ai-heading__line">identity<\/span><br class="ai-heading__break ai-heading__break--desktop" \/> <span class="ai-heading__line">and values\.<\/span><\/h2>/);
  assert.match(css, /\.ai-heading__break--mobile\s*\{[^}]*display:\s*none/s);
  assert.match(css, /@media \(max-width:\s*599px\)[\s\S]*?\.ai-layer__inner > \.section-heading\s*\{[^}]*white-space:\s*nowrap/s);
  assert.match(css, /@media \(max-width:\s*599px\)[\s\S]*?\.ai-layer__inner > \.section-heading\s*\{[^}]*width:\s*calc\(100% \+ 16px\)[^}]*margin-inline:\s*-8px/s);
  assert.match(css, /@media \(max-width:\s*599px\)[\s\S]*?\.ai-heading__break--mobile\s*\{[^}]*display:\s*inline/s);
  assert.match(css, /@media \(max-width:\s*599px\)[\s\S]*?\.ai-heading__break--desktop\s*\{[^}]*display:\s*none/s);
});
