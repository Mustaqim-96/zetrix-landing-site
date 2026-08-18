import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, statSync } from 'node:fs';
import test from 'node:test';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const css = readFileSync(new URL('../css/styles.css', import.meta.url), 'utf8');
const motionUrl = new URL('../js/cta-motion.js', import.meta.url);
const asset = new URL('../assets/images/pre-footer/zetrix-buidlreal-cta-figma.png', import.meta.url);
const section = html.match(/<section class="cta"[\s\S]*?<\/section>/)?.[0] ?? '';
const handoffStart = html.indexOf('<div class="layers-cta-handoff" data-layers-handoff>');
const handoffEnd = html.indexOf('<!-- ===================== FOOTER', handoffStart);
const handoff = handoffStart >= 0 && handoffEnd > handoffStart ? html.slice(handoffStart, handoffEnd) : '';
const ctaCssStart = css.indexOf('/* ===================== CTA ===================== */');
const ctaCssEnd = css.indexOf('/* ===================== FOOTER ===================== */', ctaCssStart);
const ctaCss = ctaCssStart >= 0 && ctaCssEnd > ctaCssStart ? css.slice(ctaCssStart, ctaCssEnd) : '';
const ctaPanelRule = ctaCss.match(/\.cta__panel\s*\{[^}]*\}/s)?.[0] ?? '';

test('CTA uses the exact local Figma artwork as semantic content', () => {
  assert.equal(existsSync(asset), true, 'the permanent Figma CTA artwork is missing');
  if (existsSync(asset)) {
    const bytes = readFileSync(asset);
    assert.ok(statSync(asset).size > 0, 'the Figma CTA artwork is empty');
    assert.equal(bytes.subarray(1, 4).toString('ascii'), 'PNG');
    assert.equal(bytes.readUInt32BE(16), 1200, 'the Figma CTA artwork width changed');
    assert.equal(bytes.readUInt32BE(20), 802, 'the Figma CTA artwork height changed');
    assert.equal(
      createHash('sha256').update(bytes).digest('hex'),
      'b1970513c6dab8ff17f0429b681d4cd38be85960170cf85d3c54de31e298d252',
      'the Figma CTA artwork bytes changed'
    );
  }
  assert.match(section, /class="cta__backdrop"[^>]*src="assets\/images\/pre-footer\/zetrix-buidlreal-cta-figma\.png"[^>]*alt=""[^>]*aria-hidden="true"/);
  assert.match(section, /<h2 class="cta__title">#BUIDLREAL on Zetrix<\/h2>/);
  assert.match(section, /class="cta__desc"/);
  assert.equal((section.match(/class="btn [^"]*cta__btn"/g) ?? []).length, 2);
  assert.doesNotMatch(section, /figma\.com\/api\/mcp\/asset/);
});

test('CTA follows the ecosystem inside one layered handoff', () => {
  assert.ok(handoff.length > 0, 'the shared handoff wrapper is missing');
  assert.ok(handoff.indexOf('<section class="layers-track"') < handoff.indexOf('<section class="cta">'));
  assert.doesNotMatch(section, /data-cta-track|class="cta__pin"/);
  assert.doesNotMatch(html, /<script src="js\/cta-motion\.js/);
  assert.equal(existsSync(motionUrl), false, 'the obsolete CTA controller still exists');
});

test('CTA slides over the stationary ecosystem and settles full screen', () => {
  assert.match(css, /\.layers-cta-handoff\s*\{[^}]*position:\s*relative[^}]*height:\s*400vh[^}]*height:\s*400svh/s);
  assert.match(css, /\.layers-track\s*\{[^}]*position:\s*sticky[^}]*top:\s*0[^}]*height:\s*100vh[^}]*height:\s*100svh[^}]*z-index:\s*1/s);
  assert.match(css, /\.cta\s*\{[^}]*position:\s*absolute[^}]*bottom:\s*0[^}]*width:\s*100%[^}]*min-height:\s*100vh[^}]*min-height:\s*100svh[^}]*z-index:\s*2/s);
  assert.match(ctaCss, /\.cta\s*\{[^}]*height:\s*auto[^}]*min-height:\s*100svh[^}]*align-items:\s*end[^}]*padding-bottom:\s*120px/s);
  assert.match(ctaPanelRule, /width:\s*min\(1280px,\s*calc\(100vw - 160px\)\)/);
  assert.doesNotMatch(css, /--cta-(?:panel|title|copy|actions)-progress|\.cta__pin/);
});

test('CTA matches the second-section card width and fits short desktops', () => {
  assert.match(css, /\.eco-card\s*\{[^}]*max-width:\s*1280px[^}]*height:\s*min\(840px,\s*calc\(100svh - 120px\)\)/s);
  assert.match(ctaPanelRule, /width:\s*min\(1280px,\s*calc\(100vw - 160px\)\)[^}]*height:\s*min\(840px,\s*calc\(100svh - 120px\)\)/s);
  assert.doesNotMatch(ctaPanelRule, /aspect-ratio:\s*1200\s*\/\s*802/);
});

test('CTA content matches the regular Section 2 desktop inset', () => {
  assert.match(css, /\.cta__content\s*\{[^}]*left:\s*80px/s);
});

test('CTA content matches the compact Section 2 desktop inset', () => {
  assert.match(css, /@media \(min-width:\s*1024px\) and \(max-height:\s*899px\)[\s\S]*?\.cta__content\s*\{[^}]*left:\s*48px/s);
});

test('CTA carries a gradient feather above its leading edge', () => {
  const feather = css.match(/\.cta::before\s*\{[^}]*\}/)?.[0] ?? '';
  const exactGradient = /linear-gradient\(180deg,\s*rgba\(24,\s*24,\s*27,\s*0\)\s*0%,\s*rgba\(24,\s*24,\s*27,\s*\.68\)\s*58%,\s*#18181b\s*100%\)/;

  assert.match(feather, /content:\s*""/);
  assert.match(feather, /position:\s*absolute/);
  assert.match(feather, /top:\s*-192px/);
  assert.match(feather, /left:\s*0/);
  assert.match(feather, /width:\s*100%/);
  assert.match(feather, /height:\s*192px/);
  assert.match(feather, exactGradient);
  assert.match(feather, /pointer-events:\s*none/);
  assert.doesNotMatch(
    feather.replace('rgba(24, 24, 27, .68) 58%, ', ''),
    exactGradient,
    'the contract rejects a feather with the required 58% gradient stop removed'
  );
  assert.match(css, /@media \(prefers-reduced-motion:\s*reduce\)\s*\{[\s\S]*?\.cta::before\s*\{[^}]*display:\s*none/s);
});

test('CTA has responsive and reduced-motion static fallbacks', () => {
  // Narrow screens keep the pinned hand-off but adopt the mobile CTA visual restyle.
  assert.match(css, /@media \(max-width:\s*1023px\), \(prefers-reduced-motion:\s*reduce\)[\s\S]*?\.cta__panel\s*\{[^}]*min-height:\s*min\(760px/s);
  // The un-pinned flow fallback now lives in a reduced-motion-only block.
  assert.match(css, /@media \(prefers-reduced-motion:\s*reduce\)\s*\{[\s\S]*?\.layers-cta-handoff\s*\{[^}]*height:\s*auto/s);
  assert.match(css, /@media \(prefers-reduced-motion:\s*reduce\)\s*\{[\s\S]*?\.layers-track\s*\{[^}]*position:\s*relative[^}]*height:\s*auto/s);
  assert.match(css, /@media \(prefers-reduced-motion:\s*reduce\)\s*\{[\s\S]*?\.cta\s*\{[^}]*position:\s*relative[^}]*bottom:\s*auto[^}]*min-height:\s*100svh/s);
  assert.match(css, /@media \(prefers-reduced-motion:\s*reduce\)\s*\{[\s\S]*?\.cta\s*\{[^}]*place-items:\s*center/s);
});

test('CTA actions retain a high-contrast keyboard focus state', () => {
  assert.match(css, /\.cta__btn:focus-visible\s*\{[^}]*outline:\s*3px solid #fff[^}]*outline-offset:\s*4px/s);
});

test('phone CTA uses the Figma mascot crop without changing wider screens', () => {
  assert.match(css, /@media \(max-width:\s*767px\)[\s\S]*?\.cta__backdrop\s*\{[^}]*inset:\s*auto[^}]*bottom:\s*0[^}]*left:\s*-40\.27%[^}]*width:\s*140\.3%[^}]*height:\s*auto[^}]*max-width:\s*none[^}]*object-fit:\s*contain/s);
  assert.match(css, /\.cta__backdrop\s*\{[^}]*inset:\s*0[^}]*width:\s*100%[^}]*height:\s*100%[^}]*object-fit:\s*cover/s);
  assert.match(html, /<link rel="stylesheet" href="css\/styles\.css\?v=87" \/>/);
});

test('phone CTA panel matches the artwork edge color for a seamless join', () => {
  assert.match(css, /@media \(max-width:\s*767px\)[\s\S]*?\.cta__panel\s*\{[^}]*background:\s*#111216/s);
});

test('phone CTA overlay clears the mascot while preserving the text treatment', () => {
  const phoneStart = css.lastIndexOf('@media (max-width: 767px) {');
  const phoneEnd = css.indexOf('@media (max-width: 767px) and (prefers-reduced-motion: reduce)', phoneStart);
  const phoneCss = css.slice(phoneStart, phoneEnd);

  assert.match(phoneCss, /\.cta__panel::after\s*\{[^}]*-webkit-mask-image:\s*radial-gradient\(/s);
  assert.match(phoneCss, /\.cta__panel::after\s*\{[^}]*mask-image:\s*radial-gradient\(/s);
  assert.match(phoneCss, /\.cta__panel::after\s*\{[^}]*mask-repeat:\s*no-repeat/s);
});
