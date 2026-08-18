import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const css = readFileSync(new URL('../css/styles.css', import.meta.url), 'utf8');
const siteRevealUrl = new URL('../js/site-reveal.js', import.meta.url);
const script = readFileSync(
  existsSync(siteRevealUrl) ? siteRevealUrl : new URL('../js/hero-reveal.js', import.meta.url),
  'utf8'
);

test('hero markup keeps the three reveal targets outside the globe', () => {
  const contentStart = html.indexOf('<div class="hero__content">');
  const globeStart = html.indexOf('<div class="hero__globe"');
  const contentMarkup = html.slice(contentStart, globeStart);

  assert.notEqual(contentStart, -1);
  assert.ok(contentStart < globeStart);
  assert.match(contentMarkup, /hero__title hero__reveal/);
  assert.match(contentMarkup, /hero__subtitle hero__reveal/);
  assert.match(contentMarkup, /hero__cta hero__reveal/);
  assert.doesNotMatch(html.slice(globeStart), /hero__globe[^>]*hero__reveal/);
});

test('hero alone uses the original bounded glyph blur reveal', () => {
  assert.match(css, /\.is-reveal-ready \.hero__glyph\s*\{[^}]*opacity:\s*0[^}]*filter:\s*blur\(12px\)[^}]*transition-duration:\s*160ms/s);
  assert.match(css, /\.is-in \.hero__glyph\s*\{[^}]*opacity:\s*1[^}]*filter:\s*blur\(0\)[^}]*transition-duration:\s*720ms[^}]*cubic-bezier\(0\.16,\s*1,\s*0\.3,\s*1\)[^}]*var\(--hero-glyph-delay\)/s);
  assert.match(script, /function enhanceHeroText\(element, baseDelay, glyphStep\)/);
  assert.match(script, /glyph\.className = 'hero__glyph'/);
  assert.match(script, /word\.className = 'hero__word'/);
  assert.match(script, /setupHeroReveal\(heroContent,[\s\S]*?\.hero__title[\s\S]*?\.hero__subtitle[\s\S]*?\.hero__cta/);
  assert.match(script, /enhanceHeroText\(title, 0, 8\)/);
  assert.match(script, /enhanceHeroText\(subtitle, 180, 3\)/);
});

test('hero preserves accessible copy and reveals its CTA as one element', () => {
  assert.match(script, /visual\.setAttribute\('aria-hidden', 'true'\)/);
  assert.match(script, /accessible\.className = 'hero__reveal-a11y'/);
  assert.match(script, /element\.replaceChildren\(fragment\)/);
  assert.doesNotMatch(script, /enhanceHeroText\(cta/);
  assert.match(css, /\.hero__content\.is-reveal-ready \.hero__cta\s*\{[^}]*opacity:\s*0/s);
  assert.match(css, /\.hero__content\.is-in \.hero__cta\s*\{[^}]*opacity:\s*1[^}]*transition-duration:\s*500ms,\s*180ms,\s*180ms[^}]*transition-delay:\s*420ms,\s*0ms,\s*0ms/s);
});

test('later copy resolves word by word with accessible fallback text', () => {
  assert.match(script, /function enhanceSectionCopy\(element, baseDelay, wordStep\)/);
  assert.match(script, /word\.className = 'copy-dissolve__word'/);
  assert.match(script, /visual\.className = 'copy-dissolve__visual'/);
  assert.match(script, /accessible\.className = 'copy-dissolve__a11y'/);
  assert.match(script, /enhanceSectionCopy\(target, index === 0 \? 0 : 180, 50\)/);
  assert.match(script, /function setupDissolveGroup\(root, copyTargets, surfaceCards, cardStagger\)/);
  assert.match(script, /target\.classList\.add\('copy-dissolve'\)/);
  assert.match(css, /\.copy-dissolve__word\s*\{[^}]*display:\s*inline-block/s);
  assert.match(css, /\.is-reveal-ready \.copy-dissolve__word\s*\{[^}]*opacity:\s*0[^}]*filter:\s*blur\(10px\)[^}]*transform:\s*translateY\(8px\)/s);
  assert.match(css, /\.is-in \.copy-dissolve__word\s*\{[^}]*opacity:\s*1[^}]*filter:\s*blur\(0\)[^}]*transform:\s*translateY\(0\)[^}]*800ms cubic-bezier\(0\.16,\s*1,\s*0\.3,\s*1\) var\(--copy-word-delay\)/s);
});

test('one observer reveals hero and section groups once with progressive fallbacks', () => {
  assert.equal((script.match(/new IntersectionObserver/g) ?? []).length, 1);
  assert.match(script, /threshold:\s*0\.15/);
  assert.match(script, /revealObserver\.unobserve\(root\)/);
  assert.match(script, /requestAnimationFrame\(function \(\) \{\s*root\.classList\.add\('is-in'\)/s);
  assert.doesNotMatch(script, /classList\.remove\('is-in'\)/);
  assert.match(script, /prefers-reduced-motion:\s*reduce/);
  assert.match(script, /!\('IntersectionObserver' in window\)/);
});
