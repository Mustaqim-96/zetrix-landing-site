import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';

const assetDirectory = new URL('../assets/tools-art/', import.meta.url);
const assets = [
  'tools-section-frame.svg',
  'tools-brand-ribbon.svg',
  'tools-blockchain-cube.png',
  'tools-art-ellipse.svg',
  'tools-art-particles.svg',
  'tools-art-small-cubes.svg',
  'tools-art-ticks.svg',
  'tools-art-guides.svg',
  'tools-art-connectors.svg',
  'tools-art-axis-line.svg',
  'tools-art-cap-line.svg',
  'tools-art-label-line.svg',
  'tools-art-red-line.svg',
  'tools-art-active-line.svg',
  'tools-art-active-dot.svg',
  'tools-art-tick-a.svg',
  'tools-art-tick-b.svg',
  'tools-art-tick-c.svg',
  'tools-art-tick-d.svg'
];

test('Section 3 Figma artwork assets are stored locally', () => {
  for (const asset of assets) {
    assert.equal(existsSync(new URL(asset, assetDirectory)), true, `${asset} is missing`);
  }
});

test('Section 3 Figma artwork files contain the expected formats', () => {
  for (const asset of assets) {
    const contents = readFileSync(new URL(asset, assetDirectory));

    if (asset.endsWith('.svg')) {
      assert.match(contents.toString('utf8'), /<svg\b/, `${asset} is not an SVG`);
    } else {
      assert.deepEqual([...contents.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
    }
  }
});

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const css = readFileSync(new URL('../css/styles.css', import.meta.url), 'utf8');
const sharedRibbonPattern = /<svg class="ribbon-flow__visual"[^>]*>[\s\S]*?<path class="ribbon-flow__path" opacity="0\.8"[^>]*fill="none" mask="url\(#ribbon-flow-edge-mask\)" \/>[\s\S]*?<\/svg>/;

test('Section 3 uses shared ribbon and local cube markup', () => {
  assert.match(html, /<section class="tools" data-tools-track>/);
  assert.match(html, /<div class="tools__pin">/);
  assert.match(html, /class="tools__section-frame"[^>]+tools-section-frame\.svg/);
  assert.match(html, sharedRibbonPattern);
  assert.doesNotMatch(html, /class="tools__ribbon-reveal"|class="tools__ribbon-path"|ribbon-slice/);
  assert.match(html, /class="tools__art" data-tools-art aria-hidden="true"/);
  assert.equal((html.match(/data-tools-cube/g) || []).length, 3);
  assert.equal((html.match(/tools-blockchain-cube\.png/g) || []).length, 3);
  assert.match(html, /<link rel="stylesheet" href="css\/styles\.css\?v=87" \/>/);
  assert.match(html, /<script src="js\/tools-motion\.js\?v=3" defer><\/script>/);
  assert.match(html, /<script src="js\/ribbon-flow-motion\.js\?v=15" defer><\/script>/);
  assert.doesNotMatch(html, /css\/styles\.css\?v=12/);
  assert.doesNotMatch(html, /<script src="js\/tools-motion\.js" defer><\/script>/);
  assert.doesNotMatch(html, /<script src="js\/ribbon-flow-motion\.js" defer><\/script>/);
});

test('artwork layers preserve the Figma coordinate system', () => {
  assert.match(css, /\.tools__art\s*\{[^}]*width:\s*576px[^}]*height:\s*820px/s);
  assert.match(css, /\.tools__cube--top\s*\{[^}]*left:\s*251\.12px[^}]*top:\s*76px[^}]*width:\s*154\.211px[^}]*height:\s*160px/s);
  assert.match(css, /\.tools__cube--centre\s*\{[^}]*left:\s*183\.66px[^}]*top:\s*260px[^}]*width:\s*289\.145px[^}]*height:\s*300px/s);
  assert.match(css, /\.tools__cube--bottom\s*\{[^}]*left:\s*251\.12px[^}]*top:\s*584px[^}]*width:\s*154\.211px[^}]*height:\s*160px/s);
});

test('Section 3 cards align with one Section 4 card on short laptops', () => {
  const shortLaptopStart = css.indexOf('@media (min-width: 1024px) and (max-height: 899px)');
  const shortLaptopEnd = css.indexOf('@media (min-width: 1024px) and (max-height: 799px)', shortLaptopStart);
  const shortLaptopCss = css.slice(shortLaptopStart, shortLaptopEnd);

  assert.match(shortLaptopCss, /\.tools__left\s*\{[^}]*width:\s*652px/s);
  assert.match(shortLaptopCss, /\.tool-grid\s*\{[^}]*width:\s*100%[^}]*grid-template-columns:\s*repeat\(2, minmax\(0, 1fr\)\)/s);
});

test('shared ribbon and cube custom properties have isolated owners', () => {
  assert.doesNotMatch(css, /\.tools__pin\s*\{[^}]*--ribbon-draw:/s);
  assert.doesNotMatch(css, /\.tools__ribbon-path|\.tools__ribbon-reveal/);
  assert.match(css, /\.ribbon-flow__visual\s*\{[^}]*width:\s*1185\.65px/s);
  assert.doesNotMatch(css, /\.ribbon-slice|--ribbon-tools-draw|--ribbon-ai-draw|--ribbon-robotics-draw/);
  assert.match(css, /\.tools__cube\s*\{[^}]*translateY\(var\(--cube-y\)\)[^}]*scale\(var\(--cube-scale\)\)[^}]*opacity:\s*var\(--cube-opacity\)/s);
});

test('shared ribbon crosses section boundaries without local masks', () => {
  assert.doesNotMatch(css, /\.tools__ribbon-reveal|\.ai-layer__ribbon-reveal/);
  assert.doesNotMatch(html, /tools-ribbon-clip|ai-ribbon-clip/);
});

test('Section 3 omits the complete technical annotation layer', () => {
  const removedMarkup = [
    'tools-art-guides.svg',
    'tools-art-axis-line.svg',
    'tools-art-cap-line.svg',
    'tools-art-label-line.svg',
    'tools-art-red-line.svg',
    'tools-art-active-line.svg',
    'tools-art-active-dot.svg',
    'tools__annotations',
    'tools__annotation',
    '3</strong><small>LAYERS',
    '>001<',
    '>002<',
    '>003<',
    'ACTIVE BLOCK',
    'Fig. 3 — Blockchain layer'
  ];

  for (const marker of removedMarkup) assert.doesNotMatch(html, new RegExp(marker));
  assert.match(html, sharedRibbonPattern);
  assert.match(html, /tools-art-particles\.svg/);
  assert.match(html, /tools-art-small-cubes\.svg/);
  assert.equal((html.match(/data-tools-cube/g) || []).length, 3);
});

test('Section 3 removes the diffuse ellipse highlight', () => {
  assert.doesNotMatch(html, /tools__art-ellipse/);
  assert.doesNotMatch(html, /tools-art-ellipse\.svg/);
});

test('floating depth motion uses the stronger approved amplitudes', () => {
  assert.match(css, /@keyframes tools-particles-float[\s\S]*translate:\s*10px -14px[\s\S]*translate:\s*-8px 8px/);
  assert.match(css, /@keyframes tools-wire-cubes-float[\s\S]*translate:\s*-12px 18px[\s\S]*translate:\s*13px -10px/);
  assert.match(css, /\.tools__art-particles\s*\{[^}]*animation:\s*tools-particles-float 12s ease-in-out -5s infinite/s);
  assert.match(css, /\.tools__art-small-cubes\s*\{[^}]*animation:\s*tools-wire-cubes-float 10s ease-in-out -3s infinite/s);
  assert.match(css, /\.tools__cube\s*\{[^}]*transform:\s*translateY\(var\(--cube-y\)\) scale\(var\(--cube-scale\)\)[^}]*animation:\s*tools-rendered-cube-float var\(--cube-float-duration\)/s);
  assert.match(css, /\.tools__cube--bottom\s*\{[^}]*--cube-float-x:\s*-3px[^}]*--cube-float-duration:\s*6\.6s[^}]*--cube-float-y:\s*-11px[^}]*--cube-float-delay:\s*-3\.7s/s);
  assert.match(css, /\.tools__cube--centre\s*\{[^}]*--cube-float-x:\s*4px[^}]*--cube-float-duration:\s*7\.8s[^}]*--cube-float-y:\s*-16px[^}]*--cube-float-delay:\s*-2\.4s/s);
  assert.match(css, /\.tools__cube--top\s*\{[^}]*--cube-float-x:\s*-4px[^}]*--cube-float-duration:\s*6\.2s[^}]*--cube-float-y:\s*-13px[^}]*--cube-float-delay:\s*-1\.3s/s);
  assert.match(css, /\.tools__pin\.is-cube-assembly-complete\.is-float-active[\s\S]*animation-play-state:\s*running/);
  assert.match(css, /@media \(prefers-reduced-motion:\s*reduce\)[\s\S]*?\.tools__art-particles[\s\S]*?animation:\s*none/);
});
