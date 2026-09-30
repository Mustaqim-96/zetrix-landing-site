import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = readFileSync(
  new URL('../public/zid.html', import.meta.url),
  'utf8',
);

test('enables device safe-area viewport handling', () => {
  assert.match(
    html,
    /<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">/,
  );
});

test('compact navigation is safe-area aware with a 44px menu target', () => {
  const compact = html.match(
    /@media \(max-width:1023px\)\{([\s\S]*?)\n    \}/,
  )?.[1] ?? '';

  assert.match(compact, /\.site-header\{[^}]*env\(safe-area-inset-top\)/);
  assert.match(compact, /padding-inline:[^;]*env\(safe-area-inset-left\)[^;]*env\(safe-area-inset-right\)/);
  assert.match(compact, /\.nav__mobile-toggle\{width:44px;height:44px/);
  assert.match(compact, /\.nav__logo\{[^}]*min-height:44px/);
  assert.match(compact, /\.nav__cta\{height:44px;min-height:44px/);
  assert.match(compact, /\.footer__nav a,\.footer__legal a\{[^}]*min-height:44px/);
  assert.match(compact, /\.social\{width:44px;height:44px/);
});

test('mobile footer clears the device bottom safe area', () => {
  const mobile = html.match(
    /@media \(max-width:767px\)\{([\s\S]*?)\n    \}/,
  )?.[1] ?? '';

  assert.match(
    mobile,
    /\.footer__inner\{[^}]*padding-bottom:max\(32px,env\(safe-area-inset-bottom\)\)/,
  );
});

test('mobile digitisation steps use self-contained Bevel-style feature cards', () => {
  const mobile = html.match(
    /@media \(max-width:767px\)\{([\s\S]*?)\n    \}/,
  )?.[1] ?? '';

  assert.match(
    mobile,
    /\.step-card\{[^}]*height:clamp\(510px,calc\(107\.6vw \+ 166px\),584px\);min-height:0[^}]*overflow:hidden[^}]*border-radius:24px/,
  );
  assert.match(
    mobile,
    /\.step-phone\{position:absolute;top:200px;left:auto;right:50%;width:77\.32%;transform:translateX\(50%\)\}/,
  );
  assert.doesNotMatch(mobile, /\.step-phone\{[^}]*position:fixed/);
});

test('mobile hero fades its artwork into the following section', () => {
  const mobile = html.match(
    /@media \(max-width:767px\)\{([\s\S]*?)\n    \}/,
  )?.[1] ?? '';

  assert.match(
    mobile,
    /\.hero::after\{content:"";position:absolute;z-index:6;right:0;bottom:0;left:0;height:clamp\(190px,26svh,240px\);background:linear-gradient\(180deg,rgba\(24,24,27,0\) 0%,rgba\(24,24,27,\.78\) 54%,#18181b 92%\);pointer-events:none\}/,
  );
  assert.match(
    mobile,
    /html\[data-theme="light"\] \.hero::after\{background:linear-gradient\(180deg,rgba\(255,255,255,0\) 0%,rgba\(255,255,255,\.82\) 54%,#fff 92%\)\}/,
  );
});

test('short tablet landscape returns sticky handoff to normal flow', () => {
  const shortLandscape = html.match(
    /@media \(min-width:768px\) and \(max-width:1023px\) and \(max-height:600px\)\{([\s\S]*?)\n    \}/,
  )?.[1] ?? '';

  assert.match(shortLandscape, /\.download-about-handoff\{height:auto\}/);
  assert.match(shortLandscape, /\.download\{position:relative;top:auto;height:auto;min-height:auto/);
  assert.match(shortLandscape, /\.about\{position:relative;bottom:auto;height:auto/);
  assert.match(shortLandscape, /\.about::before\{display:none\}/);
  assert.match(shortLandscape, /\.step-phone\{[^}]*width:clamp\(180px,24vw,240px\)/);
});

test('mobile handoff synchronizes Download translation to the About runway', () => {
  assert.match(html, /const downloadHandoff = document\.querySelector\('\.download-about-handoff'\)/);
  assert.match(html, /new ResizeObserver\(syncDownloadHandoff\)/);
  assert.match(html, /setProperty\('--download-height', `\$\{downloadSection\.offsetHeight\}px`\)/);
  assert.match(html, /function updateDownloadHandoff\(\)/);
  assert.match(html, /downloadSection\.style\.transform = `translate3d\(0, \$\{progress\}px, 0\)`/);
  assert.match(html, /requestAnimationFrame\(updateDownloadHandoff\)/);
});

test('mobile About artwork is visibly lowered without cropping its floor', () => {
  const mobile = html.match(/@media \(max-width:767px\)\{([\s\S]*?)\n    \}/)?.[1] ?? '';

  assert.match(
    mobile,
    /\.about-backdrop\{[^}]*top:48px;[^}]*height:calc\(100% - 48px\);[^}]*object-position:100% center;transform:none/,
  );
});

test('mobile sections follow the Zetrix 60px transition rhythm', () => {
  const mobile = html.match(/@media \(max-width:767px\)\{([\s\S]*?)\n    \}/)?.[1] ?? '';

  assert.match(mobile, /:root\{--gutter:16px;--mobile-section-space:60px\}/);
  assert.match(mobile, /\.process\{padding:var\(--mobile-section-space\) 0 0\}/);
  assert.match(mobile, /\.verify\{padding:var\(--mobile-section-space\) 0 0\}/);
  assert.match(mobile, /\.download\{[^}]*padding:var\(--mobile-section-space\) 0 0/);
  assert.match(mobile, /\.powered\{padding:var\(--mobile-section-space\) 0 80px\}/);
});

test('tablet sections follow the Zetrix 96px transition rhythm', () => {
  const tablet = html.match(
    /@media \(min-width:768px\) and \(max-width:1023px\)\{([\s\S]*?)\n    \}/,
  )?.[1] ?? '';

  assert.match(tablet, /:root\{--tablet-section-space:96px\}/);
  assert.match(tablet, /\.process\{padding:var\(--tablet-section-space\) 0 0\}/);
  assert.match(tablet, /\.verify\{padding:var\(--tablet-section-space\) 0 0\}/);
  assert.match(tablet, /\.download\{align-items:flex-start;padding:var\(--tablet-section-space\) 0 0\}/);
  assert.match(tablet, /\.about-card\{height:calc\(100svh - 192px\)/);
  assert.match(tablet, /\.powered\{padding:0 0 112px\}/);
});
