import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync } from 'node:fs';
import test from 'node:test';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const css = readFileSync(new URL('../css/styles.css', import.meta.url), 'utf8');

const assets = [
  '../assets/img/robotics-pm01.png',
  '../assets/img/robotics-leju-kuavo.png',
  '../assets/img/robotics-gausium.png',
  '../assets/icons/robotics-arrow-up-right.svg',
];

test('robotics Figma exports are stored locally', () => {
  for (const relativePath of assets) {
    const assetUrl = new URL(relativePath, import.meta.url);
    assert.equal(existsSync(assetUrl), true, `${relativePath} is missing`);
    assert.ok(statSync(assetUrl).size > 0, `${relativePath} is empty`);
  }
});

test('robotics uses three semantic cards with local art and accessible copy', () => {
  const section = html.match(/<section class="robotics">[\s\S]*?<\/section>/)?.[0] ?? '';

  assert.match(section, /class="robotics__pin"/);
  assert.match(section, /class="robotics__inner"/);
  assert.equal((section.match(/<article class="robot-card">/g) ?? []).length, 3);
  assert.equal((section.match(/class="robot-card__image"/g) ?? []).length, 3);
  assert.equal((section.match(/class="robot-card__caption"/g) ?? []).length, 3);
  assert.equal((section.match(/class="robot-card__meta"/g) ?? []).length, 3);
  assert.equal((section.match(/robotics-arrow-up-right\.svg/g) ?? []).length, 3);

  assert.match(section, /assets\/img\/robotics-pm01\.png/);
  assert.match(section, /assets\/img\/robotics-leju-kuavo\.png/);
  assert.match(section, /assets\/img\/robotics-gausium\.png/);
  assert.match(section, />01<[^]*>PM01<[^]*An agile humanoid platform for development, research, and embodied-AI experiences\./);
  assert.match(section, />02<[^]*>Leju Kuavo<[^]*A humanoid robotics platform for embodied intelligence and real-world applications\./);
  assert.match(section, />03<[^]*>Gausium<[^]*Autonomous cleaning robots for commercial and industrial facilities\./);
  assert.equal((section.match(/alt="" aria-hidden="true"/g) ?? []).length, 3);
  assert.doesNotMatch(section, /figma\.com\/api\/mcp\/asset/);
});

test('robotics preserves the Figma desktop composition and card geometry', () => {
  assert.match(css, /\.robotics\s*\{[^}]*position:\s*relative[^}]*min-height:\s*100vh[^}]*min-height:\s*100svh/s);
  assert.match(css, /\.robotics__pin\s*\{[^}]*position:\s*relative[^}]*height:\s*100vh[^}]*height:\s*100svh[^}]*overflow:\s*hidden/s);
  assert.match(css, /\.robotics__inner\s*\{[^}]*position:\s*absolute[^}]*top:\s*202px[^}]*left:\s*50%[^}]*width:\s*1200px[^}]*height:\s*620px[^}]*transform:\s*translateX\(-50%\)[^}]*transform-origin:\s*50% 0/s);
  assert.match(css, /\.robotics__heading\s*\{[^}]*width:\s*800px[^}]*height:\s*120px[^}]*margin-inline:\s*auto/s);
  assert.match(css, /\.robotics__title\s*\{[^}]*font-size:\s*40px[^}]*line-height:\s*48px/s);
  assert.match(css, /\.robotics__subtitle\s*\{[^}]*margin-top:\s*16px[^}]*font-size:\s*20px[^}]*line-height:\s*28px/s);
  assert.match(css, /\.robot-cards\s*\{[^}]*margin-top:\s*40px[^}]*grid-template-columns:\s*repeat\(3,\s*384px\)[^}]*gap:\s*24px/s);
  assert.match(css, /\.robot-card\s*\{[^}]*width:\s*384px[^}]*height:\s*460px[^}]*border-radius:\s*16px/s);
  assert.match(css, /\.robot-card__caption\s*\{[^}]*left:\s*24px[^}]*right:\s*24px[^}]*bottom:\s*20px[^}]*padding:\s*16px[^}]*border:\s*1px solid rgba\(209, 209, 214, 0\.2\)[^}]*border-radius:\s*14px[^}]*background:\s*rgba\(24, 24, 27, 0\.74\)/s);
});

test('robotics artwork preserves mascot headroom at rest and on hover', () => {
  assert.match(css, /\.robot-card__image\s*\{[^}]*object-fit:\s*cover[^}]*object-position:\s*center top[^}]*transform-origin:\s*center top/s);
});

test('robotics scales uniformly on short laptops and stacks on narrow screens', () => {
  assert.match(css, /@media \(min-width:\s*1280px\) and \(max-height:\s*899px\)[\s\S]*?\.robotics__inner\s*\{[^}]*top:\s*84px[^}]*width:\s*1363\.636px[^}]*transform:\s*translateX\(-50%\) scale\(\.88\)/);
  assert.match(css, /@media \(min-width:\s*1280px\) and \(max-height:\s*899px\)[\s\S]*?\.robot-cards\s*\{[^}]*width:\s*100%[^}]*grid-template-columns:\s*repeat\(3, minmax\(0, 1fr\)\)/s);
  assert.match(css, /@media \(min-width:\s*1280px\) and \(max-height:\s*899px\)[\s\S]*?\.robot-card\s*\{[^}]*width:\s*100%/s);
  assert.match(css, /@media \(min-width:\s*1024px\) and \(max-width:\s*1279px\) and \(max-height:\s*899px\)[\s\S]*?\.robotics__inner\s*\{[^}]*top:\s*88px[^}]*width:\s*min\(1421\.053px, calc\(131\.579% - 52\.632px\)\)[^}]*transform:\s*translateX\(-50%\) scale\(\.76\)/);
  assert.match(css, /@media \(max-width:\s*1023px\)[\s\S]*?\.robotics__pin\s*\{[^}]*height:\s*auto[^}]*min-height:\s*100vh[^}]*min-height:\s*100svh[^}]*overflow:\s*visible/);
  assert.match(css, /@media \(max-width:\s*899px\)[\s\S]*?\.robot-cards\s*\{[^}]*grid-template-columns:\s*1fr/);
});

test('robotics hover is pointer-specific and reduced motion stays static', () => {
  assert.match(css, /@media \(hover:\s*hover\) and \(pointer:\s*fine\)[\s\S]*?\.robot-card:hover\s*\{[^}]*transform:\s*translateY\(-8px\) scale\(1\.01\)[^}]*border-color:\s*rgba\(228, 34, 46, 0\.54\)/);
  assert.match(css, /@media \(hover:\s*hover\) and \(pointer:\s*fine\)[\s\S]*?\.robot-card:hover \.robot-card__image\s*\{[^}]*transform:\s*scale\(1\.035\)/);
  assert.match(css, /@media \(hover:\s*hover\) and \(pointer:\s*fine\)[\s\S]*?\.robot-card:hover \.robot-card__arrow\s*\{[^}]*transform:\s*translate\(3px,\s*-3px\)/);
  assert.match(css, /\.robot-card\s*\{[^}]*transition:[^}]*300ms cubic-bezier\(0\.16, 1, 0\.3, 1\)/s);
  assert.match(css, /@media \(prefers-reduced-motion:\s*reduce\)[\s\S]*?\.robotics \*[^}]*transition:\s*none !important/);
  assert.match(css, /@media \(prefers-reduced-motion:\s*reduce\)[\s\S]*?\.robot-card[^}]*transform:\s*none !important/);
});

test('robotics cards have no outer drop shadow in resting or hover states', () => {
  assert.match(css, /\.robot-card\s*\{[^}]*box-shadow:\s*none/s);
  assert.match(css, /\.robot-card:hover\s*\{[^}]*box-shadow:\s*none/s);
  assert.doesNotMatch(css, /\.robot-card\s*\{[^}]*transition:[^}]*box-shadow/s);
  assert.doesNotMatch(css, /\.robotics__inner\.is-reveal-ready \.robot-card\s*\{[^}]*transition:[^}]*box-shadow/s);
  assert.doesNotMatch(css, /\.robotics__inner\.is-in \.robot-card\s*\{[^}]*transition:[^}]*box-shadow/s);
});

test('robotics reveal assets are cache-busted for replay updates', () => {
  assert.match(html, /<link rel="stylesheet" href="css\/styles\.css\?v=87" \/>/);
  assert.match(html, /<script src="js\/site-reveal\.js\?v=11" defer><\/script>/);
});
