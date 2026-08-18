import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const css = readFileSync(new URL('../css/styles.css', import.meta.url), 'utf8');
const phoneStart = css.lastIndexOf('@media (max-width: 767px) {');
const phoneEnd = css.indexOf('@media (max-width: 374px)', phoneStart);
const phoneCss = css.slice(phoneStart, phoneEnd);

test('Sections 2 and 3 center only their phone headings and subtitles', () => {
  assert.match(phoneCss, /\.eco-card__left > \.section-heading,\s*\.eco-card__sub,\s*\.tools__left > \.section-heading,\s*\.tools__sub\s*\{[^}]*text-align:\s*center/s);
  assert.match(phoneCss, /\.eco-card__sub,\s*\.tools__sub\s*\{[^}]*margin-inline:\s*auto/s);
  assert.match(css, /\.eco-fcard__head\s*\{[^}]*text-align:\s*left/s);
  assert.doesNotMatch(phoneCss, /\.(?:eco-card|eco-card__left|tools__left|tool-card)\s*\{[^}]*text-align:\s*center/s);
  assert.match(html, /<link rel="stylesheet" href="css\/styles\.css\?v=87" \/>/);
});
