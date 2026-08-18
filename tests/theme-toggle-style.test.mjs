import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const css = readFileSync(new URL('../css/styles.css', import.meta.url), 'utf8');

test('Orbit control matches the navbar height with a smoky glass shell', () => {
  const rule = css.match(/\.theme-toggle\s*\{[^}]*\}/s)?.[0] ?? '';

  assert.match(rule, /width:\s*56px/);
  assert.match(rule, /height:\s*56px/);
  assert.match(rule, /border:\s*1px solid rgba\(255,\s*255,\s*255,\s*\.1\)/);
  assert.match(rule, /background:\s*rgba\(255,\s*255,\s*255,\s*\.045\)/);
  assert.match(rule, /-webkit-backdrop-filter:\s*blur\(20px\) saturate\(140%\)/);
  assert.match(rule, /backdrop-filter:\s*blur\(20px\) saturate\(140%\)/);
});

test('Orbit sphere and track scale proportionally with the larger control', () => {
  assert.match(css, /\.theme-toggle__track\s*\{[^}]*width:\s*38px[^}]*height:\s*20px[^}]*border-radius:\s*var\(--radius-pill\)/s);
  assert.match(css, /\.theme-toggle__orb\s*\{[^}]*width:\s*14px[^}]*height:\s*14px[^}]*transform:\s*translateX\(18px\)/s);
  assert.match(css, /\.theme-toggle__orb\s*\{[^}]*radial-gradient/s);
});

test('Orbit is a navbar satellite only when the viewport has safe clearance', () => {
  assert.match(css, /@media \(min-width:\s*1200px\)[\s\S]*?\.theme-toggle\s*\{[^}]*position:\s*absolute[^}]*top:\s*0[^}]*right:\s*-68px/s);
  assert.match(css, /@media \(max-width:\s*1199px\)[\s\S]*?\.theme-toggle\s*\{[^}]*position:\s*static[^}]*margin-left:\s*8px/s);
});

test('Orbit has visible focus and reduced-motion fallbacks', () => {
  assert.match(css, /\.theme-toggle:focus-visible/);
  assert.match(css, /@media \(prefers-reduced-motion:\s*reduce\)[\s\S]{0,900}\.theme-toggle__track,\s*\.theme-toggle__orb,[\s\S]{0,160}\{\s*transition:\s*none\s*!important/s);
});

test('light theme exposes the approved Figma semantic palette', () => {
  const tokens = css.match(/html\[data-theme="light"\]\s*\{[^}]*\}/s)?.[0] ?? '';

  assert.match(tokens, /--theme-bg:\s*#ffffff/);
  assert.match(tokens, /--theme-surface-secondary:\s*#fafafa/);
  assert.match(tokens, /--theme-surface-tertiary:\s*#f5f5f6/);
  assert.match(tokens, /--theme-border:\s*#d1d1d6/);
  assert.match(tokens, /--theme-text:\s*#18181b/);
  assert.match(tokens, /--theme-text-secondary:\s*#71717a/);
  assert.match(tokens, /--theme-text-tertiary:\s*#a1a1aa/);
  assert.match(tokens, /--theme-icon:\s*#3f3f46/);
  assert.match(tokens, /color-scheme:\s*light/);
});

test('light theme covers every major page surface', () => {
  const selectors = [
    'body', '.nav', '.nav-dropdown__surface', '.nav-card', '.hero',
    '.ecosystem', '.eco-card', '.eco-fcard', '.ribbon-story',
    '.ribbon-flow', '.tools', '.tool-card', '.ai-layer', '.ai-card',
    '.robotics', '.robot-card', '.layers__pin', '.carousel__card',
    '.cta', '.cta__panel', '.footer', '.social', '.theme-toggle'
  ];

  for (const selector of selectors) {
    assert.match(css, new RegExp(`html\\[data-theme="light"\\] ${selector.replace('.', '\\.')}(?:[\\s,{])`), selector);
  }
});

test('light navigation and cards preserve glass material', () => {
  const nav = css.match(/html\[data-theme="light"\] \.nav\s*\{[^}]*\}/s)?.[0] ?? '';
  const dropdown = css.match(/html\[data-theme="light"\] \.nav-dropdown__surface\s*\{[^}]*\}/s)?.[0] ?? '';

  assert.match(nav, /rgba\(255,\s*255,\s*255,\s*\.72\)/);
  assert.match(nav, /backdrop-filter:\s*blur\(20px\) saturate\(140%\)/);
  assert.match(nav, /box-shadow:/);
  assert.match(dropdown, /rgba\(255,\s*255,\s*255,\s*\.94\)/);
  assert.match(dropdown, /backdrop-filter:\s*blur\(24px\) saturate\(115%\)/);
  assert.match(css, /html\[data-theme="light"\] \.tool-card,[\s\S]*\.ai-card,[\s\S]*\.carousel__card\s*\{[^}]*backdrop-filter:\s*blur\(20px\)/s);
});

test('light navigation keeps the complete two-tone Zetrix wordmark visible', () => {
  assert.match(css, /html\[data-theme="light"\] \.nav__logo img\s*\{[^}]*filter:\s*brightness\(0\)/s);
  assert.match(css, /html\[data-theme="light"\] \.nav__logo::after\s*\{[^}]*logo-zetrix\.svg[^}]*clip-path:\s*inset\(0 83% 0 0\)/s);
});

test('light Orbit travels left and uses the Zetrix red core', () => {
  const orb = css.match(/html\[data-theme="light"\] \.theme-toggle__orb\s*\{[^}]*\}/s)?.[0] ?? '';
  assert.match(orb, /transform:\s*translateX\(0\)/);
  assert.match(orb, /background:\s*#c5242e/);
  assert.match(orb, /rgba\(197,\s*36,\s*46,\s*\.2\)/);
});

test('original dark tokens and footer material remain unchanged', () => {
  assert.match(css, /--bg:\s*#18181b/);
  assert.match(css, /--nav-bg:\s*#131316/);
  assert.match(css, /\.footer\s*\{[^}]*background:\s*#000/s);
});
