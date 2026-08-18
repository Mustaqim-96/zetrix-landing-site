import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const css = readFileSync(new URL('../css/styles.css', import.meta.url), 'utf8');
const tabletStart = css.lastIndexOf('@media (min-width: 768px) and (max-width: 1023px)');
const tabletEnd = css.indexOf('@media (max-width: 767px)', tabletStart);
const tabletBlocks = css.slice(tabletStart, tabletEnd);

test('tablet uses 60px content gutters and a vertical pinned ecosystem', () => {
  assert.match(tabletBlocks, /\.hero__content\s*\{[^}]*padding-inline:\s*60px/s);
  assert.match(tabletBlocks, /\.ecosystem\s*\{[^}]*padding:\s*0 60px/s);
  assert.match(tabletBlocks, /\.eco-track\s*\{[^}]*height:\s*280svh/s);
  assert.match(tabletBlocks, /\.eco-pin\s*\{[^}]*position:\s*sticky/s);
  assert.match(tabletBlocks, /\.eco-card\s*\{[^}]*grid-template-columns:\s*1fr/s);
  assert.match(tabletBlocks, /\.eco-card__left\s*\{[^}]*text-align:\s*center/s);
});

test('tablet centers tools, hides cube art, and keeps two tool columns', () => {
  assert.match(tabletBlocks, /\.tools__inner\s*\{[^}]*width:\s*calc\(100% - 120px\)/s);
  assert.match(tabletBlocks, /\.tools__left\s*\{[^}]*margin-inline:\s*auto[^}]*text-align:\s*center/s);
  assert.match(tabletBlocks, /\.tool-grid\s*\{[^}]*grid-template-columns:\s*repeat\(2, minmax\(0, 1fr\)\)/s);
  assert.match(tabletBlocks, /\.tool-card\s*\{[^}]*text-align:\s*left/s);
  assert.match(tabletBlocks, /\.tools__art\s*\{[^}]*display:\s*none/s);
});

test('tablet ribbon uses desktop geometry', () => {
  assert.match(tabletBlocks, /\.ribbon-flow__visual\s*\{[^}]*width:\s*1185\.65px[^}]*margin-left:\s*-506\.67px[^}]*transform:\s*none/s);
});

test('tablet keeps both AI cards side by side within 60px gutters', () => {
  assert.match(tabletBlocks, /\.ai-layer__pin\s*\{[^}]*padding:\s*96px 60px 80px/s);
  assert.match(tabletBlocks, /\.ai-layer__inner\s*\{[^}]*max-width:\s*none/s);
  assert.match(tabletBlocks, /\.ai-cards\s*\{[^}]*grid-template-columns:\s*repeat\(2, minmax\(0, 1fr\)\)/s);
  assert.match(tabletBlocks, /\.ai-card\s*\{[^}]*min-width:\s*0/s);
  assert.match(tabletBlocks, /\.ai-card__media\s*\{[^}]*width:\s*100%/s);
});

test('tablet robotics exposes two equal cards and pagination controls', () => {
  assert.match(tabletBlocks, /\.robotics__pin\s*\{[^}]*padding:\s*96px 60px 80px/s);
  assert.match(tabletBlocks, /\.robot-cards\s*\{[^}]*display:\s*flex[^}]*overflow-x:\s*auto/s);
  assert.match(tabletBlocks, /\.robot-card[^}]*\{[^}]*flex:\s*0 0 calc\(50% - 10px\)/s);
  assert.match(tabletBlocks, /\.robotics__controls\s*\{[^}]*display:\s*flex/s);
  assert.match(tabletBlocks, /\.robotics__progress i:nth-child\(3\)\s*\{[^}]*display:\s*none/s);
});

test('tablet connected ecosystem and CTA respect the shared gutters', () => {
  assert.match(tabletBlocks, /\.layers__pin\s*\{[^}]*padding-inline:\s*60px/s);
  assert.match(tabletBlocks, /\.cta\s*\{[^}]*padding:\s*48px 60px/s);
  assert.match(tabletBlocks, /\.cta__panel\s*\{[^}]*background:\s*#111216/s);
  assert.match(tabletBlocks, /\.cta__content\s*\{[^}]*top:\s*48px[^}]*left:\s*60px[^}]*text-align:\s*center/s);
  assert.match(tabletBlocks, /\.cta__backdrop\s*\{[^}]*bottom:\s*0[^}]*height:\s*auto[^}]*object-fit:\s*contain/s);
});

test('tablet CTA overlay clears the mascot while preserving the text treatment', () => {
  assert.match(tabletBlocks, /\.cta__panel::after\s*\{[^}]*-webkit-mask-image:\s*radial-gradient\(/s);
  assert.match(tabletBlocks, /\.cta__panel::after\s*\{[^}]*mask-image:\s*radial-gradient\(/s);
  assert.match(tabletBlocks, /\.cta__panel::after\s*\{[^}]*mask-repeat:\s*no-repeat/s);
});
