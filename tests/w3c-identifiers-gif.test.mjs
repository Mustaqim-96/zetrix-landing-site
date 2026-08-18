import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, statSync } from 'node:fs';
import test from 'node:test';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const css = readFileSync(new URL('../css/styles.css', import.meta.url), 'utf8');
const gifUrl = new URL('../assets/img/decentralised-identifiers.gif', import.meta.url);
const pngUrl = new URL('../assets/img/decentralised-identifiers-reduced-motion.png', import.meta.url);
const cards = [...html.matchAll(/<article class="eco-fcard"[^>]*>[\s\S]*?<\/article>/g)].map((match) => match[0]);
const readRequired = (url) => {
  assert.equal(existsSync(url), true, `${url.pathname} is missing`);
  return readFileSync(url);
};

test('W3C identifier animation and reduced-motion frame are permanent local assets', () => {
  [gifUrl, pngUrl].forEach((url) => {
    assert.equal(existsSync(url), true, `${url.pathname} is missing`);
    assert.ok(statSync(url).size > 0, `${url.pathname} is empty`);
  });
});

test('W3C identifier GIF is the exact supplied infinite 480 by 270 animation', () => {
  const gif = readRequired(gifUrl);
  const digest = createHash('sha256').update(gif).digest('hex');
  assert.equal(digest, 'fb15a83e87f6c829db426f6831604011b073d28986b9db11f678367557515e2e');
  assert.equal(gif.subarray(0, 6).toString('ascii'), 'GIF89a');
  assert.equal(gif.readUInt16LE(6), 480);
  assert.equal(gif.readUInt16LE(8), 270);
  const loopMarker = gif.indexOf(Buffer.from('NETSCAPE2.0'));
  assert.notEqual(loopMarker, -1);
  assert.deepEqual([...gif.subarray(loopMarker + 11, loopMarker + 16)], [3, 1, 0, 0, 0]);
});

test('W3C identifier static fallback is a 480 by 270 PNG', () => {
  const png = readRequired(pngUrl);
  assert.deepEqual([...png.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
  assert.equal(png.readUInt32BE(16), 480);
  assert.equal(png.readUInt32BE(20), 270);
});

test('second feature card uses the W3C GIF with a reduced-motion picture source', () => {
  const secondCard = cards[1] ?? '';
  assert.match(secondCard, /class="node-panel node-panel--w3c-identifiers"/);
  assert.match(secondCard, /<picture>/);
  assert.match(secondCard, /<source media="\(prefers-reduced-motion: reduce\)" srcset="assets\/img\/decentralised-identifiers-reduced-motion\.png\?v=1" \/>/);
  assert.match(secondCard, /<img class="node-illus node-illus--w3c-identifiers" src="assets\/img\/decentralised-identifiers\.gif\?v=1" width="480" height="270" alt="" aria-hidden="true" \/>/);
  assert.doesNotMatch(secondCard, /<svg class="node-illus/);
});

test('only the W3C identifier panel adopts its GIF surface and contained sizing', () => {
  assert.match(css, /\.node-panel--w3c-identifiers\s*\{[^}]*background:\s*#000/s);
  assert.match(css, /\.node-panel--w3c-identifiers picture\s*\{[^}]*display:\s*block[^}]*width:\s*100%/s);
  assert.match(css, /\.node-illus--w3c-identifiers\s*\{[^}]*max-width:\s*480px[^}]*aspect-ratio:\s*16\s*\/\s*9[^}]*object-fit:\s*contain/s);
  assert.equal((html.match(/node-panel--w3c-identifiers/g) ?? []).length, 1);
  assert.equal((html.match(/node-illus--w3c-identifiers/g) ?? []).length, 1);
  assert.match(html, /<link rel="stylesheet" href="css\/styles\.css\?v=87" \/>/);
  assert.doesNotMatch(html, /w3c-identifiers-network/);
});
