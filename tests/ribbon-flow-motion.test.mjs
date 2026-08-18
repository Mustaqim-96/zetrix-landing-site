import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const css = readFileSync(new URL('../css/styles.css', import.meta.url), 'utf8');
const motionUrl = new URL('../js/ribbon-flow-motion.js', import.meta.url);
const svgUrl = new URL('../assets/brand-ribbon.svg', import.meta.url);
const motionSource = existsSync(motionUrl) ? readFileSync(motionUrl, 'utf8') : '';
const ribbonSvg = readFileSync(svgUrl, 'utf8');

test('ribbon flow embeds only the exact Figma route and treatment', () => {
  const expectedRoute = 'M500.04 100.008C596.64 236.708 1146.64 646.708 1080.04 920.008C1013.34 1193.31 106.64 1503.31 100.04 1740.01C93.3402 1976.71 956.64 2113.31 1040.04 2340.01C1123.34 2566.71 673.34 2973.31 600.04 3100.01';
  const path = html.match(/<path class="ribbon-flow__path"[^>]*d="([^"]+)"[^>]*>/);

  assert.ok(path, 'Figma ribbon path is missing');
  assert.equal(path[1], expectedRoute);
  assert.match(html, /<svg class="ribbon-flow__visual" viewBox="0 0 1185\.65 3200\.02" preserveAspectRatio="none" aria-hidden="true" focusable="false">/);
  assert.doesNotMatch(path[0], /pathLength=/);
  assert.match(path[0], /opacity="0\.8" vector-effect="non-scaling-stroke" stroke-dasharray="none"/);
  assert.match(path[0], /stroke="url\(#ribbon-flow-gradient\)" stroke-width="360" stroke-linecap="round" stroke-linejoin="round" fill="none" mask="url\(#ribbon-flow-edge-mask\)"/);
  assert.match(html, /<linearGradient id="ribbon-flow-head-fade" x1="0" y1="0" x2="0" y2="1">\s*<stop offset="0" stop-color="#fff" \/>\s*<stop offset="1" stop-color="#000" \/>\s*<\/linearGradient>/);
  assert.match(html, /<mask id="ribbon-flow-edge-mask" maskUnits="userSpaceOnUse" x="-180" y="0" width="1545\.65" height="3200\.02" mask-type="luminance">\s*<rect x="-180" y="0" width="1545\.65" height="3200\.02" fill="#000" \/>\s*<rect class="ribbon-flow__reveal-body" x="-180" y="0" width="1545\.65" height="0" fill="#fff" \/>\s*<rect class="ribbon-flow__reveal-edge" x="-180" y="0" width="1545\.65" height="0" fill="url\(#ribbon-flow-head-fade\)" \/>\s*<\/mask>/);
  assert.doesNotMatch(html, /ribbon-flow-reveal|clip-path="url\(#ribbon-flow-reveal\)"/);
  assert.equal((html.match(/class="ribbon-flow__path"/g) || []).length, 1);
  assert.doesNotMatch(html, /ribbon-flow__head|ribbon-flow__continuation/);
  assert.match(ribbonSvg, new RegExp(`d="${expectedRoute.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`));
  assert.match(ribbonSvg, /stroke="url\(#brand-ribbon-gradient\)" stroke-width="200" stroke-linecap="round" stroke-linejoin="round"/);
});

test('one timeline runs from 40% Section 3 visibility to the bottom of Section 5', async () => {
  assert.ok(motionSource, 'ribbon flow motion source is missing');
  const { default: motion } = await import('../js/ribbon-flow-motion.js');

  assert.equal(motion.progressFromSections(900, 3900, 1000, 0.4), 0);
  assert.equal(motion.progressFromSections(600, 3600, 1000, 0.4), 0);
  assert.equal(motion.progressFromSections(-700, 2300, 1000, 0.4), 0.5);
  assert.equal(motion.progressFromSections(-2000, 1000, 1000, 0.4), 1);
  assert.equal(motion.progressFromSections(-2200, 800, 1000, 0.4), 1);

  assert.deepEqual(motion.revealMetrics(100, 3100, 0, 220), { bodyHeight: 0, edgeY: 0, edgeHeight: 0 });
  assert.deepEqual(motion.revealMetrics(100, 3100, 0.05, 220), { bodyHeight: 30, edgeY: 30, edgeHeight: 220 });
  assert.deepEqual(motion.revealMetrics(100, 3100, 0.5, 220), { bodyHeight: 1380, edgeY: 1380, edgeHeight: 220 });
  assert.deepEqual(motion.revealMetrics(100, 3100, 1, 220), { bodyHeight: 2880, edgeY: 2880, edgeHeight: 220 });
});

test('ribbon draw is rAF-coalesced, directly reversible, and single-path only', () => {
  assert.match(motionSource, /\[data-ribbon-flow\]/);
  assert.match(motionSource, /\[data-tools-track\]/);
  assert.match(motionSource, /\.robotics/);
  assert.match(motionSource, /\.ribbon-flow__path/);
  assert.match(motionSource, /requestAnimationFrame/);
  assert.match(motionSource, /addEventListener\('scroll', onScroll, \{ passive: true \}\)/);
  assert.match(motionSource, /progressFromSections\(toolsRect\.top, roboticsRect\.bottom, win\.innerHeight, 0\.4\)/);
  assert.match(motionSource, /var body = doc\.querySelector\('\.ribbon-flow__reveal-body'\)/);
  assert.match(motionSource, /var edge = doc\.querySelector\('\.ribbon-flow__reveal-edge'\)/);
  assert.match(motionSource, /var metrics = revealMetrics\(100, 3100, progress, 220\)/);
  assert.match(motionSource, /body\.setAttribute\('height', String\(metrics\.bodyHeight\)\)/);
  assert.match(motionSource, /edge\.setAttribute\('y', String\(metrics\.edgeY\)\)/);
  assert.match(motionSource, /edge\.setAttribute\('height', String\(metrics\.edgeHeight\)\)/);
  assert.doesNotMatch(motionSource, /path\.style\.strokeDasharray\s*=/);
  assert.doesNotMatch(motionSource, /path\.style\.strokeDashoffset\s*=/);
  assert.match(motionSource, /path\.style\.removeProperty\('stroke-dasharray'\)/);
  assert.match(motionSource, /cancelAnimationFrame/);
  assert.doesNotMatch(
    motionSource,
    /max-height: 899px|shortScreen|renderClipReveal|viewBoxRevealHeight|revealPosition|ribbon-flow__head|drawState|headStart|headLength|headOpacity|phaseLengths|continuation|stepToward|Math\.abs\(|--ribbon-draw|is-ribbon-flow-ready|IntersectionObserver|data-ribbon-stage|sticky|setTimeout|setInterval/
  );
});

test('ribbon CSS exposes the complete Figma route for reduced motion', () => {
  assert.doesNotMatch(css, /calc\(var\(--ribbon-draw\)/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)[\s\S]*?\.ribbon-flow__path\s*\{[^}]*stroke-dasharray:\s*none\s*!important/s);
  assert.doesNotMatch(css, /\.ribbon-flow__head|\.ribbon-flow__continuation/);
});
