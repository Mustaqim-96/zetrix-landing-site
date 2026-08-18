import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const css = readFileSync(new URL('../css/styles.css', import.meta.url), 'utf8');
const assets = [
  'telegram.svg',
  'discord.svg',
  'x.svg',
  'tiktok.svg',
  'zetrix-wordmark-mask.svg',
  'zetrix-wordmark-fill.svg'
];

test('footer stores every Figma export as a permanent local SVG', () => {
  for (const asset of assets) {
    const source = readFileSync(new URL(`../assets/footer/${asset}`, import.meta.url), 'utf8');
    assert.match(source, /<svg\b/i, `${asset} must contain exported SVG artwork`);
  }
  assert.doesNotMatch(html, /figma\.com\/api\/mcp\/asset/);
});

test('footer keeps semantic link groups and exported social glyphs', () => {
  assert.match(html, /<footer class="footer">[\s\S]*class="footer__nav"/);
  for (const label of ['Product', 'Individuals', 'Ecosystem', 'Tools', 'Discover']) {
    assert.match(html, new RegExp(`<h4 class="footer__head">${label}<\\/h4>`));
  }
  for (const network of ['telegram', 'discord', 'x', 'tiktok']) {
    assert.match(html, new RegExp(`assets/footer/${network}\\.svg`));
  }
  assert.match(html, /class="footer__wordmark-art"[^>]*aria-hidden="true"/);
  assert.match(html, /class="footer__wordmark-base"[^>]*zetrix-wordmark-fill\.svg[^>]*alt=""/);
  assert.match(html, /class="footer__wordmark-color-trail"[^>]*zetrix-wordmark-fill\.svg[^>]*alt=""/);
  assert.match(html, /class="footer__wordmark-spotlight"[^>]*zetrix-wordmark-fill\.svg[^>]*alt=""/);
});

test('footer establishes a layer above the sticky hero', () => {
  assert.match(
    css,
    /\.footer\s*\{[^}]*position:\s*relative[^}]*z-index:\s*2[^}]*background:\s*#000/s,
  );
});

test('footer matches the Figma desktop geometry and typography', () => {
  assert.match(css, /\.footer__inner\s*\{[^}]*max-width:\s*1440px[^}]*padding:\s*64px 120px 48px/s);
  assert.match(css, /\.footer__top\s*\{[^}]*min-height:\s*300px/s);
  assert.match(css, /\.footer__nav\s*\{[^}]*grid-template-columns:\s*repeat\(3, 163px\)[^}]*column-gap:\s*64px[^}]*row-gap:\s*64px[^}]*width:\s*617px/s);
  const headingRule = css.match(/\.footer__head\s*\{[^}]*\}/s)?.[0] ?? '';
  assert.match(headingRule, /font-weight:\s*700/);
  assert.match(headingRule, /font-size:\s*20px/);
  assert.match(headingRule, /line-height:\s*28px/);
  assert.match(css, /\.footer__col a\s*\{[^}]*font-size:\s*16px[^}]*line-height:\s*24px[^}]*color:\s*#999/s);
});

test('footer uses exact social, wordmark, and legal rhythm', () => {
  assert.match(css, /\.footer__socials\s*\{[^}]*gap:\s*16px/s);
  assert.match(css, /\.social\s*\{[^}]*width:\s*40px[^}]*height:\s*40px/s);
  assert.match(css, /\.footer__brand\s*\{[^}]*margin-top:\s*120px/s);
  assert.match(css, /\.footer__wordmark-art\s*\{[^}]*width:\s*1200px[^}]*height:\s*207px[^}]*overflow:\s*visible/s);
  assert.doesNotMatch(css, /\.footer__wordmark-art\s*\{[^}]*mask-image:/s);
  assert.match(css, /\.footer__wordmark-art img\s*\{[^}]*object-fit:\s*contain[^}]*transform:\s*scale\(\.99\)/s);
  assert.match(css, /\.footer__bottom\s*\{[^}]*margin-top:\s*40px/s);
  assert.match(css, /\.footer__legal\s*\{[^}]*gap:\s*24px/s);
});

test('footer wordmark uses two balanced passes with a short loop pause and persistent color trail', () => {
  assert.match(css, /\.footer__wordmark-base\s*\{[^}]*filter:\s*grayscale\(1\) brightness\(\.58\)[^}]*opacity:\s*\.55/s);
  assert.match(css, /\.footer__wordmark-spotlight\s*\{[^}]*position:\s*absolute[^}]*inset:\s*0[^}]*-webkit-mask-image:\s*linear-gradient\(90deg,[^}]*mask-image:\s*linear-gradient\(90deg,[^}]*mask-size:\s*24% 100%[^}]*mask-position:\s*-32% 0/s);
  assert.match(css, /\.footer__wordmark-art\.is-spotlight-active \.footer__wordmark-spotlight\s*\{[^}]*animation:\s*footer-wordmark-spotlight 2\.6s cubic-bezier\(\.37, 0, \.63, 1\) 300ms 2 both/s);
  assert.match(css, /@keyframes footer-wordmark-spotlight\s*\{[\s\S]*?0%[^}]*mask-position:\s*-32% 0[\s\S]*?84%[^}]*mask-position:\s*132% 0[\s\S]*?100%[^}]*mask-position:\s*132% 0/s);
  assert.match(css, /\.footer__wordmark-color-trail\s*\{[^}]*position:\s*absolute[^}]*inset:\s*0[^}]*mask-size:\s*0% 100%/s);
  assert.match(css, /\.footer__wordmark-art\.is-spotlight-active \.footer__wordmark-color-trail\s*\{[^}]*animation:\s*footer-wordmark-color-trail 2\.6s cubic-bezier\(\.37, 0, \.63, 1\) 2\.9s 1 both/s);
  assert.match(css, /@keyframes footer-wordmark-color-trail\s*\{[\s\S]*?0%[^}]*mask-size:\s*0% 100%[\s\S]*?84%[^}]*-webkit-mask-size:\s*104% 100%[^}]*mask-size:\s*104% 100%[\s\S]*?100%[^}]*-webkit-mask-size:\s*104% 100%[^}]*mask-size:\s*104% 100%/s);
  assert.match(css, /@media \(max-width:\s*767px\)[\s\S]*?\.footer__wordmark-spotlight\s*\{[^}]*mask-size:\s*34% 100%/s);
  assert.match(css, /@media \(prefers-reduced-motion:\s*reduce\)[\s\S]*?\.footer__wordmark-color-trail,\s*\.footer__wordmark-spotlight\s*\{[^}]*display:\s*none/s);
});

test('footer social buttons use the approved smoky glass material', () => {
  const socialRule = css.match(/\.social\s*\{[^}]*\}/s)?.[0] ?? '';
  assert.match(socialRule, /background-color:\s*rgba\(24,\s*24,\s*27,\s*\.72\)/);
  assert.match(socialRule, /background-image:\s*linear-gradient\(145deg,\s*rgba\(255,\s*255,\s*255,\s*\.12\)\s*0%,\s*rgba\(63,\s*63,\s*70,\s*\.22\)\s*42%,\s*rgba\(9,\s*9,\s*11,\s*\.28\)\s*100%\)/);
  assert.match(socialRule, /border:\s*1px solid rgba\(255,\s*255,\s*255,\s*\.16\)/);
  assert.match(socialRule, /-webkit-backdrop-filter:\s*blur\(12px\) saturate\(135%\)/);
  assert.match(socialRule, /backdrop-filter:\s*blur\(12px\) saturate\(135%\)/);
  assert.match(socialRule, /box-shadow:\s*inset 0 1px 0 rgba\(255,\s*255,\s*255,\s*\.12\),\s*inset 0 -1px 0 rgba\(255,\s*255,\s*255,\s*\.03\),\s*0 8px 24px rgba\(0,\s*0,\s*0,\s*\.28\)/);
  assert.match(css, /\.social:hover,\s*\.social:focus-visible\s*\{[^}]*border-color:\s*rgba\(255,\s*255,\s*255,\s*\.26\)[^}]*background-color:\s*rgba\(39,\s*39,\s*42,\s*\.78\)/s);
});

test('footer has responsive wrapping and visible keyboard focus', () => {
  assert.match(css, /@media \(max-width:\s*1439px\)[\s\S]*\.footer__top\s*\{[^}]*flex-wrap:\s*wrap/);
  assert.match(css, /@media \(max-width:\s*767px\)[\s\S]*\.footer__nav\s*\{[^}]*grid-template-columns:\s*repeat\(2, minmax\(0, 1fr\)\)/);
  assert.match(css, /@media \(max-width:\s*599px\)[\s\S]*\.footer__bottom\s*\{[^}]*flex-direction:\s*column/);
  assert.match(css, /\.footer a:focus-visible\s*\{[^}]*outline:\s*2px solid #fff[^}]*outline-offset:\s*4px/s);
  assert.match(html, /css\/styles\.css\?v=87/);
});

test('footer starts fluid scaling below the reference frame and expands social hit areas', () => {
  assert.doesNotMatch(css, /@media \(max-width:\s*1199px\)\s*\{\s*\.footer__inner/);
  assert.match(css, /\.social\s*\{[^}]*position:\s*relative/s);
  assert.match(css, /\.social::before\s*\{[^}]*content:\s*['"]['"][^}]*position:\s*absolute[^}]*inset:\s*-2px/s);
});
