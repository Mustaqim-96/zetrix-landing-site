import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const html = readFileSync(resolve(root, 'index.html'), 'utf8');
const css = readFileSync(resolve(root, 'css/styles.css'), 'utf8');

test('hero does not render or load the decorative cube video', () => {
  assert.doesNotMatch(html, /class="hero__video"|data-hero-video|<video\b/);
  assert.doesNotMatch(html, /hero-cubes-(?:loop|poster)|js\/hero-video\.js/);
  assert.doesNotMatch(css, /\.hero__video/);
});

test('hero keeps its content and globe composition', () => {
  assert.match(html, /<section class="hero">[\s\S]*class="hero__content"[\s\S]*class="hero__globe"/);
  assert.match(css, /\.hero\s*\{[^}]*isolation:\s*isolate[^}]*background:\s*var\(--bg\)/s);
  assert.match(css, /\.hero__content\s*\{[^}]*z-index:\s*2/s);
  assert.match(css, /\.hero__globe\s*\{[^}]*z-index:\s*1[^}]*height:\s*720px/s);
  assert.match(css, /@media \(prefers-reduced-motion:\s*no-preference\)[\s\S]*\.hero__content,\s*\.hero__globe\s*\{[^}]*opacity:\s*calc\(1 - var\(--hero-eco-exit-progress, 0\)\)/s);
});

test('removed video files remain available for recovery', () => {
  for (const file of [
    'assets/video/hero-cubes-loop.webm',
    'assets/video/hero-cubes-loop.mp4',
    'assets/video/hero-cubes-poster.png',
    'js/hero-video.js',
  ]) {
    assert.equal(existsSync(resolve(root, file)), true, `${file} is missing`);
  }
});
