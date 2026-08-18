import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, statSync } from 'node:fs';
import test from 'node:test';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const css = readFileSync(new URL('../css/styles.css', import.meta.url), 'utf8');
const gifUrl = new URL('../assets/img/IDE.gif', import.meta.url);
const pngUrl = new URL('../assets/img/IDE-reduced-motion.png', import.meta.url);
const readRequired = (url) => {
  assert.equal(existsSync(url), true, `${url.pathname} is missing`);
  return readFileSync(url);
};

test('Smart Contract animation and reduced-motion frame are permanent local assets', () => {
  [gifUrl, pngUrl].forEach((url) => {
    assert.equal(existsSync(url), true, `${url.pathname} is missing`);
    assert.ok(statSync(url).size > 0, `${url.pathname} is empty`);
  });
});

test('GIF preserves its supplied dimensions and infinite loop metadata', () => {
  const gif = readRequired(gifUrl);
  const digest = createHash('sha256').update(gif).digest('hex');
  assert.equal(digest, '92fde97db5975a3e5f42b84610f42b308874b33e7883501c353d8268587271a0');
  assert.equal(gif.subarray(0, 6).toString('ascii'), 'GIF89a');
  assert.equal(gif.readUInt16LE(6), 480);
  assert.equal(gif.readUInt16LE(8), 270);
  const loopMarker = gif.indexOf(Buffer.from('NETSCAPE2.0'));
  assert.notEqual(loopMarker, -1);
  assert.deepEqual([...gif.subarray(loopMarker + 11, loopMarker + 16)], [3, 1, 0, 0, 0]);
});

test('static fallback is a 480 by 270 PNG', () => {
  const png = readRequired(pngUrl);
  assert.deepEqual([...png.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
  assert.equal(png.readUInt32BE(16), 480);
  assert.equal(png.readUInt32BE(20), 270);
});

test('first feature card uses the GIF with a reduced-motion picture source', () => {
  const firstCard = html.match(/<article class="eco-fcard"[^>]*>[\s\S]*?<\/article>/)?.[0] ?? '';
  assert.match(firstCard, /class="node-panel node-panel--smart-contract"/);
  assert.match(firstCard, /<picture>/);
  assert.match(firstCard, /<source media="\(prefers-reduced-motion: reduce\)" srcset="assets\/img\/IDE-reduced-motion\.png\?v=1" \/>/);
  assert.match(firstCard, /<img class="node-illus node-illus--smart-contract" src="assets\/img\/IDE\.gif\?v=1" width="480" height="270" alt="" aria-hidden="true" \/>/);
  assert.doesNotMatch(firstCard, /<svg class="node-illus"/);
});

test('only the Smart Contract panel adopts the GIF black surface and contained sizing', () => {
  assert.match(css, /\.node-panel--smart-contract\s*\{[^}]*background:\s*#000/s);
  assert.match(css, /\.node-illus--smart-contract\s*\{[^}]*max-width:\s*480px[^}]*aspect-ratio:\s*16\s*\/\s*9[^}]*object-fit:\s*contain/s);
  assert.ok(css.indexOf('.node-illus--smart-contract') > css.indexOf('.node-illus {'),
    'the modifier must follow the shared 360px cap in source order');
  assert.match(html, /<link rel="stylesheet" href="css\/styles\.css\?v=87" \/>/);
  assert.equal((html.match(/node-panel--smart-contract/g) ?? []).length, 1);
  assert.doesNotMatch(html, /smart-contract-ide-network/);
});
