import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const css = readFileSync(new URL('../src/app/zid/zid.css', import.meta.url), 'utf8');
const sharedCss = readFileSync(new URL('../public/css/styles.css', import.meta.url), 'utf8');
const runtime = readFileSync(new URL('../src/components/ZidRuntime.tsx', import.meta.url), 'utf8');
const layout = readFileSync(new URL('../src/app/layout.tsx', import.meta.url), 'utf8');

test('enables device safe-area viewport handling', () => {
  assert.match(
    layout,
    /viewportFit:\s*["']cover["']/,
  );
});

test('compact navigation is safe-area aware with a 44px menu target', () => {
  const compact = sharedCss.match(
    /@media \(max-width: 1023px\) \{([\s\S]*?)\n\}/,
  )?.[1] ?? '';

  assert.match(compact, /\.nav-wrap\s*\{[^}]*env\(safe-area-inset-top\)/);
  assert.match(compact, /padding-inline:[^;]*env\(safe-area-inset-left\)[^;]*env\(safe-area-inset-right\)/);
  assert.match(compact, /\.nav__mobile-toggle\s*\{[^}]*width:\s*44px;[^}]*height:\s*44px/);
  assert.match(compact, /\.nav__logo\s*\{[^}]*min-height:\s*44px/);
  assert.match(compact, /\.nav__cta\s*\{[^}]*height:\s*44px;[^}]*min-height:\s*44px/);
  assert.match(compact, /\.footer__nav a,\s*\.footer__legal a\s*\{[^}]*min-height:\s*44px/);
  assert.match(compact, /\.social\s*\{[^}]*width:\s*44px;[^}]*height:\s*44px/);
});

test('mobile footer clears the device bottom safe area', () => {
  assert.match(
    sharedCss,
    /@media \(max-width: 767px\) \{[\s\S]*?\.footer__inner\s*\{[^}]*padding-bottom:\s*max\(32px,\s*env\(safe-area-inset-bottom\)\)/,
  );
});

test('mobile digitisation steps use self-contained Bevel-style feature cards', () => {
  const mobile = css.match(
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
  const mobile = css.match(
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
  const shortLandscape = css.match(
    /@media \(min-width:768px\) and \(max-width:1023px\) and \(max-height:600px\)\{([\s\S]*?)\n    \}/,
  )?.[1] ?? '';

  assert.match(shortLandscape, /\.download-about-handoff\{height:auto\}/);
  assert.match(shortLandscape, /\.download\{position:relative;top:auto;height:auto;min-height:auto/);
  assert.match(shortLandscape, /\.about\{position:relative;bottom:auto;height:auto/);
  assert.match(shortLandscape, /\.about::before\{display:none\}/);
  assert.match(shortLandscape, /\.step-phone\{[^}]*width:clamp\(180px,24vw,240px\)/);
});

test('mobile handoff synchronizes Download translation to the About runway', () => {
  assert.match(runtime, /const downloadHandoff = root\.querySelector<HTMLElement>\("\.download-about-handoff"\)/);
  assert.match(runtime, /new ResizeObserver\(syncDownloadHandoff\)/);
  assert.match(runtime, /setProperty\("--download-height", `\$\{downloadSection\.offsetHeight\}px`\)/);
  assert.match(runtime, /function updateDownloadHandoff\(\)/);
  assert.match(runtime, /downloadSection\.style\.transform = `translate3d\(0, \$\{progress\}px, 0\)`/);
  assert.match(runtime, /requestAnimationFrame\(updateDownloadHandoff\)/);
});

test('mobile About artwork is visibly lowered without cropping its floor', () => {
  const mobile = css.match(/@media \(max-width:767px\)\{([\s\S]*?)\n    \}/)?.[1] ?? '';

  assert.match(
    mobile,
    /\.about-backdrop\{[^}]*top:48px;[^}]*height:calc\(100% - 48px\);[^}]*object-position:100% center;transform:none/,
  );
});

test('mobile sections follow the Zetrix 60px transition rhythm', () => {
  const mobile = css.match(/@media \(max-width:767px\)\{([\s\S]*?)\n    \}/)?.[1] ?? '';

  assert.match(mobile, /:root\{--gutter:16px;--mobile-section-space:60px\}/);
  assert.match(mobile, /\.process\{padding:var\(--mobile-section-space\) 0 0\}/);
  assert.match(mobile, /\.download\{[^}]*padding:var\(--mobile-section-space\) 0 0/);
  assert.match(mobile, /\.powered\{padding:var\(--mobile-section-space\) 0 80px\}/);
});

test('tablet sections follow the Zetrix 96px transition rhythm', () => {
  const tablet = css.match(
    /@media \(min-width:768px\) and \(max-width:1023px\)\{([\s\S]*?)\n    \}/,
  )?.[1] ?? '';

  assert.match(tablet, /:root\{--tablet-section-space:96px\}/);
  assert.match(tablet, /\.process\{padding:var\(--tablet-section-space\) 0 0\}/);
  assert.match(tablet, /\.download\{align-items:flex-start;padding:var\(--tablet-section-space\) 0 0\}/);
  assert.match(tablet, /\.about-card\{height:calc\(100svh - 192px\)/);
  assert.match(tablet, /\.powered\{padding:0 0 112px\}/);
});
