import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const css = readFileSync(new URL('../css/styles.css', import.meta.url), 'utf8');
const iconNames = [
  'lucide-fingerprint.svg',
  'lucide-badge-check.svg',
  'lucide-scroll-text.svg',
  'lucide-banknote.svg',
  'lucide-coins.svg',
  'lucide-wallet.svg',
  'arrow-up-right.svg'
];

test('tool cards use permanent local Figma-exported Lucide assets', () => {
  const toolGrid = html.match(/<div class="tool-grid">([\s\S]*?)<\/div>\s*<\/div>\s*<div class="tools__art"/)?.[1] ?? '';
  iconNames.forEach((name) => {
    assert.ok(existsSync(new URL(`../assets/icons/${name}`, import.meta.url)), name);
    assert.match(toolGrid, new RegExp(`assets/icons/${name.replace('.', '\\.')}`));
  });
  assert.equal((toolGrid.match(/class="tool-card__icon"/g) || []).length, 6);
  assert.equal((toolGrid.match(/class="tool-card__text"/g) || []).length, 6);
  assert.equal((toolGrid.match(/assets\/icons\/arrow-up-right\.svg/g) || []).length, 6);
});

test('card surface matches the Figma glass token contract', () => {
  assert.match(css, /\.tool-card\s*\{[^}]*height:\s*176px/s);
  assert.match(css, /\.tool-card\s*\{[^}]*min-height:\s*176px/s);
  assert.match(css, /\.tool-card\s*\{[^}]*padding:\s*16px/s);
  assert.match(css, /\.tool-card\s*\{[^}]*gap:\s*16px/s);
  assert.match(css, /background:\s*rgba\(24,\s*24,\s*27,\s*0\.74\)/);
  assert.match(css, /border:\s*1px solid rgba\(209,\s*209,\s*214,\s*0\.20\)/);
  assert.match(css, /border-radius:\s*14px/);
  assert.match(css, /backdrop-filter:\s*blur\(22px\) saturate\(120%\)/);
});

test('icon circles and card internals match Figma sizing and rhythm', () => {
  assert.match(css, /\.tool-card__icon\s*\{[^}]*width:\s*48px[^}]*height:\s*48px/s);
  assert.match(css, /\.tool-card__icon\s*\{[^}]*padding:\s*12px/s);
  assert.match(css, /background:\s*rgba\(255,\s*255,\s*255,\s*0\.10\)/);
  assert.match(css, /\.tool-card__icon img\s*\{[^}]*width:\s*24px[^}]*height:\s*24px/s);
  assert.match(css, /\.tool-card__text\s*\{[^}]*gap:\s*8px/s);
  assert.match(css, /\.tool-card__title\s*\{[^}]*height:\s*24px[^}]*font-size:\s*20px[^}]*line-height:\s*28px/s);
  assert.match(css, /\.tool-card__title\s*\{[^}]*font-size:\s*20px[^}]*line-height:\s*28px/s);
  assert.match(css, /\.tool-card__desc\s*\{[^}]*font-size:\s*16px[^}]*line-height:\s*24px/s);
});

test('all tool cards remain semantic non-clickable articles', () => {
  assert.equal((html.match(/<article class="tool-card">/g) || []).length, 6);
  assert.doesNotMatch(html, /<article class="tool-card" tabindex=/);
  assert.doesNotMatch(html, /<a\b[^>]*class="tool-card"/);
  assert.match(css, /\.tool-card\s*\{[^}]*cursor:\s*default/s);
});

test('tool cards use an obvious touch-safe glass hover', () => {
  assert.match(css, /@media \(hover: hover\) and \(pointer: fine\)[\s\S]*?\.tool-card:hover\s*\{[^}]*transform:\s*translateY\(-8px\) scale\(1\.01\)[^}]*border-color:\s*rgba\(228, 34, 46, 0\.68\)[^}]*box-shadow:/s);
  assert.match(css, /\.tool-card__arrow\s*\{[^}]*transition:\s*transform 240ms cubic-bezier\(0\.16, 1, 0\.3, 1\)/s);
  assert.match(css, /\.tool-card:hover \.tool-card__arrow[^}]*transform:\s*translate\(3px, -3px\)/s);
  assert.match(css, /\.tool-card:hover \.tool-card__icon[^}]*background:\s*rgba\(197, 36, 46, 0\.24\)/s);
  assert.doesNotMatch(css, /\.tool-card:focus-visible/);
  assert.match(css, /@media \(prefers-reduced-motion:\s*reduce\)[\s\S]*?\.tool-card__arrow[\s\S]*?transition:\s*none/s);
  assert.match(css, /@media \(prefers-reduced-motion:\s*reduce\)[\s\S]*?\.tool-card:hover\s*\{[^}]*transform:\s*none/s);
});
