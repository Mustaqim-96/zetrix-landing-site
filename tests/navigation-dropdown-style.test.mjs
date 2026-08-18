import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const css = readFileSync(new URL('../css/styles.css', import.meta.url), 'utf8');

test('dropdown surface extends the navbar smoky glass material', () => {
  const rule = css.match(/\.nav-dropdown__surface\s*\{[^}]*\}/s)?.[0] ?? '';
  assert.match(rule, /background-color:\s*rgba\(22,\s*22,\s*26,\s*\.985\)/);
  assert.match(rule, /background-image:\s*linear-gradient\(145deg,\s*rgba\(255,\s*255,\s*255,\s*\.055\),\s*rgba\(255,\s*255,\s*255,\s*\.012\) 58%,\s*transparent\)/);
  assert.doesNotMatch(rule, /rgba\(45,\s*21,\s*27/);
  assert.match(rule, /border:\s*1px solid rgba\(255,\s*255,\s*255,\s*\.1\)/);
  assert.match(rule, /-webkit-backdrop-filter:\s*blur\(24px\) saturate\(115%\)/);
  assert.match(rule, /backdrop-filter:\s*blur\(24px\) saturate\(115%\)/);
  assert.match(rule, /box-shadow:[^;]*inset 0 1px 0[^;]*0 24px 64px/s);
});

test('desktop panel uses the approved adaptive grid and lightweight motion', () => {
  assert.match(css, /\.nav-dropdown\s*\{[^}]*top:\s*64px[^}]*opacity:\s*0[^}]*transform:\s*translateY\(-8px\)[^}]*pointer-events:\s*none/s);
  assert.match(css, /\.nav\.is-menu-open \.nav-dropdown\s*\{[^}]*opacity:\s*1[^}]*transform:\s*translateY\(0\)[^}]*pointer-events:\s*auto/s);
  assert.match(css, /\.nav-dropdown::before\s*\{[^}]*top:\s*-8px[^}]*height:\s*8px/s);
  assert.match(css, /\.nav-panel__content\s*\{[^}]*grid-template-columns:\s*repeat\(3, minmax\(0, 1fr\)\)/s);
  assert.match(css, /\.nav-panel__group\[data-nav-count="1"\][^{]*\.nav-panel__content\s*\{[^}]*grid-template-columns:\s*minmax\(0, 1fr\)/s);
  assert.match(css, /\.nav-panel__group\[data-nav-count="2"\][^{]*\.nav-panel__content\s*\{[^}]*grid-template-columns:\s*repeat\(2, minmax\(0, 1fr\)\)/s);
  assert.doesNotMatch(css, /\.nav-card:hover[^}]*transform:/s);
});

test('link cards and focus states remain readable over glass', () => {
  const card = css.match(/\.nav-card\s*\{[^}]*\}/s)?.[0] ?? '';
  assert.match(card, /min-height:\s*88px/);
  assert.match(card, /background:\s*linear-gradient/);
  assert.match(card, /border:\s*1px solid rgba\(/);
  assert.match(css, /\.nav-card__icon\s*\{[^}]*width:\s*40px[^}]*height:\s*40px/s);
  assert.match(css, /\.nav-card__icon img\s*\{[^}]*width:\s*20px[^}]*height:\s*20px[^}]*filter:\s*brightness\(0\) invert\(1\)/s);
  assert.match(css, /\.nav-card:focus-visible\s*\{[^}]*outline:\s*2px solid #fff[^}]*outline-offset:\s*3px/s);
});

test('1023px mode becomes a glass drawer with accessible touch targets', () => {
  assert.match(css, /@media \(max-width:\s*1023px\)[\s\S]*\.nav__menu\s*\{[^}]*display:\s*none/s);
  assert.match(css, /@media \(max-width:\s*1023px\)[\s\S]*\.nav__mobile-toggle\s*\{[^}]*display:\s*grid/s);
  assert.match(css, /@media \(max-width:\s*1023px\)[\s\S]*\.nav-dropdown\s*\{[^}]*position:\s*fixed[^}]*top:\s*63px[^}]*max-height:\s*calc\(100svh - 96px\)[^}]*overflow-y:\s*auto/s);
  assert.match(css, /@media \(max-width:\s*1023px\)[\s\S]*\.nav-panel__accordion\s*\{[^}]*min-height:\s*48px/s);
  assert.match(css, /\.nav__mobile-toggle\s*\{[^}]*width:\s*40px[^}]*height:\s*40px/s);
});

test('mobile menu backdrop covers the viewport without boxing in the floating navbar', () => {
  const backdrop = css.match(/\.nav__backdrop\s*\{[^}]*\}/s)?.[0] ?? '';
  assert.match(backdrop, /top:\s*0/);
  assert.match(backdrop, /left:\s*0/);
  assert.match(backdrop, /width:\s*100vw/);
  assert.match(backdrop, /height:\s*100svh/);
  assert.match(backdrop, /pointer-events:\s*auto/);
  assert.doesNotMatch(backdrop, /transform:/);
  assert.doesNotMatch(backdrop, /inset:\s*-24px 0 0/);
});

test('reduced motion removes all dropdown transitions', () => {
  assert.match(css, /@media \(prefers-reduced-motion:\s*reduce\)[\s\S]*\.nav-dropdown,[\s\S]*\.nav \.caret\s*\{[^}]*transition:\s*none\s*!important/s);
});
