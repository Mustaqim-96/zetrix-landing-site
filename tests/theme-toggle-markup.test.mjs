import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');

test('head starts in dark mode without restoring a saved preference', () => {
  const stylesheetIndex = html.indexOf('css/styles.css?v=87');

  assert.ok(stylesheetIndex > -1, 'stylesheet is missing');
  assert.doesNotMatch(html.slice(0, stylesheetIndex), /localStorage\.getItem\('zetrix-theme'\)/);
  assert.doesNotMatch(html.slice(0, stylesheetIndex), /data-theme.*light/);
  assert.doesNotMatch(html.slice(0, stylesheetIndex), /matchMedia\([^)]*prefers-color-scheme/);
});

test('navbar exposes one accessible Orbit control in the approved order', () => {
  const ctaIndex = html.indexOf('class="btn btn--red nav__cta"');
  const themeIndex = html.indexOf('data-theme-toggle');
  const mobileIndex = html.indexOf('data-nav-mobile-toggle');

  assert.ok(ctaIndex < themeIndex && themeIndex < mobileIndex);
  assert.match(html, /<button class="theme-toggle"[^>]*data-theme-toggle[^>]*aria-pressed="false"[^>]*aria-label="Switch to light mode"[^>]*>/);
  assert.match(html, /class="theme-toggle__track"[^>]*aria-hidden="true"/);
  assert.match(html, /class="theme-toggle__orb"/);
  assert.equal((html.match(/data-theme-toggle/g) || []).length, 1);
});

test('theme controller is cache-safe and loads before navigation behavior', () => {
  const themeIndex = html.indexOf('<script src="js/theme-toggle.js?v=1" defer></script>');
  const navIndex = html.indexOf('<script src="js/nav-dropdown.js?v=2" defer></script>');

  assert.ok(themeIndex > -1);
  assert.ok(navIndex > themeIndex);
});
