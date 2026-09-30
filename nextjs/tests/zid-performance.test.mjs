import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, statSync } from 'node:fs';

const htmlUrl = new URL('../public/zid.html', import.meta.url);
const html = readFileSync(htmlUrl, 'utf8');

function rasterSources(markup) {
  return [...markup.matchAll(/src="\.\/(assets\/[^"?#]+\.(?:png|jpe?g|webp))"/gi)]
    .map((match) => match[1]);
}

function rasterTags(markup) {
  return [...markup.matchAll(/<img\b[^>]*src="\.\/assets\/[^"?#]+\.(?:png|jpe?g|webp)"[^>]*>/gi)]
    .map((match) => match[0]);
}

test('references only WebP raster assets with a sub-1 MiB unique payload', () => {
  const sources = [...new Set(rasterSources(html))];

  assert.ok(sources.length > 0);
  assert.deepEqual(
    sources.filter((source) => !source.endsWith('.webp')),
    [],
  );

  const totalBytes = sources.reduce((sum, source) => {
    const assetUrl = new URL(`../public/${source}`, import.meta.url);
    return sum + statSync(assetUrl).size;
  }, 0);

  assert.ok(totalBytes < 1024 * 1024, `raster payload is ${totalBytes} bytes`);
});

test('keeps hero raster images eager and asynchronously decoded', () => {
  const heroStart = html.indexOf('<section class="hero"');
  const heroEnd = html.indexOf('<section class="process"');
  const tags = rasterTags(html.slice(heroStart, heroEnd));

  assert.ok(tags.length > 0);
  for (const tag of tags) {
    assert.match(tag, /decoding="async"/);
    assert.doesNotMatch(tag, /loading="lazy"/);
    assert.match(tag, /width="\d+"/);
    assert.match(tag, /height="\d+"/);
  }
});

test('lazy-loads and asynchronously decodes below-the-fold raster images', () => {
  const processStart = html.indexOf('<section class="process"');
  const tags = rasterTags(html.slice(processStart));

  assert.ok(tags.length > 0);
  for (const tag of tags) {
    assert.match(tag, /loading="lazy"/);
    assert.match(tag, /decoding="async"/);
    assert.match(tag, /width="\d+"/);
    assert.match(tag, /height="\d+"/);
  }
});
