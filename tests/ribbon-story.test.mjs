import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const css = readFileSync(new URL('../css/styles.css', import.meta.url), 'utf8');
const ribbonSvgUrl = new URL('../assets/brand-ribbon.svg', import.meta.url);
const ribbonSvg = existsSync(ribbonSvgUrl) ? readFileSync(ribbonSvgUrl, 'utf8') : '';

test('one ribbon flow wraps tools, AI, and robotics in order after the ecosystem', () => {
  const story = html.indexOf('<div class="ribbon-story" data-ribbon-story>');
  const ecosystem = html.indexOf('<section class="ecosystem">');
  const flow = html.indexOf('<div class="ribbon-flow" data-ribbon-flow>');
  const visual = html.indexOf('<svg class="ribbon-flow__visual"');
  const tools = html.indexOf('<section class="tools" data-tools-track>');
  const ai = html.indexOf('<section class="ai-layer" data-ai-ribbon-track>');
  const robotics = html.indexOf('<section class="robotics">');

  assert.ok(story >= 0);
  assert.ok(story < ecosystem && ecosystem < flow && flow < visual && visual < tools && tools < ai && ai < robotics);
  assert.equal((html.match(/class="ribbon-flow__visual"/g) || []).length, 1);
  assert.equal((html.match(/class="ribbon-flow__path"/g) || []).length, 1);
  assert.doesNotMatch(html, /ribbon-flow__head|ribbon-flow__continuation/);
  assert.doesNotMatch(html, /assets\/brand-ribbon\.svg#Vector/);
});

test('the shared flow replaces all master-path, entry, and local slice markup', () => {
  for (const removedMarker of [
    'ribbon-story-master-path',
    'ribbon-slice',
    'ribbon-entry',
    'data-ribbon-stage'
  ]) {
    assert.doesNotMatch(html, new RegExp(removedMarker));
  }

  assert.doesNotMatch(html, /js\/ribbon-story-motion\.js/);
  assert.match(html, /<script src="js\/tools-motion\.js\?v=3" defer><\/script>/);
  assert.doesNotMatch(html, /<script src="js\/ai-layer-motion\.js"/);
  assert.match(html, /<script src="js\/ribbon-flow-motion\.js\?v=15" defer><\/script>/);
  assert.match(html, /<link rel="stylesheet" href="css\/styles\.css\?v=87" \/>/);
});

test('ribbon flow uses the exact desktop geometry and has no segmented-ribbon rules', () => {
  assert.match(css, /\.ribbon-story\s*\{[^}]*position:\s*relative[^}]*isolation:\s*isolate[^}]*background:\s*var\(--bg\)/s);
  assert.match(css, /\.ribbon-flow\s*\{[^}]*position:\s*relative[^}]*isolation:\s*isolate[^}]*overflow:\s*clip[^}]*background:\s*var\(--bg\)/s);
  assert.match(css, /\.ribbon-flow__visual\s*\{[^}]*position:\s*absolute[^}]*top:\s*0[^}]*left:\s*50%[^}]*width:\s*1185\.65px[^}]*height:\s*100%[^}]*margin-left:\s*-506\.67px[^}]*display:\s*block[^}]*max-width:\s*none[^}]*z-index:\s*1[^}]*pointer-events:\s*none/s);
  assert.match(css, /\.ribbon-flow\s*>\s*section\s*\{[^}]*position:\s*relative[^}]*z-index:\s*auto/s);
  assert.match(css, /\.robotics__pin\s*\{[^}]*position:\s*relative[^}]*z-index:\s*2/s);
  assert.match(css, /@media \(min-width:\s*1024px\)[\s\S]*?\.ribbon-flow__visual\s*\{[^}]*overflow:\s*visible/s);
  assert.match(css, /@media \(max-width:\s*1023px\)[\s\S]*?\.ribbon-flow__visual\s*\{[^}]*left:\s*50%[^}]*width:\s*clamp\(700px,\s*110vw,\s*1100px\)[^}]*margin-left:\s*0[^}]*transform:\s*translateX\(-50%\)[^}]*overflow:\s*visible/s);
  assert.match(css, /@media \(max-width:\s*1023px\)[\s\S]*?\.ribbon-flow__path\s*\{[^}]*stroke-width:\s*clamp\(120px,\s*23\.5vw,\s*240px\)/s);

  for (const removedRule of [
    '--ribbon-tools-draw',
    '--ribbon-ai-draw',
    '--ribbon-robotics-draw',
    '.ribbon-story__defs',
    '.ribbon-slice',
    '.ribbon-entry',
    '#ribbon-story-master-path'
  ]) {
    assert.doesNotMatch(css, new RegExp(removedRule.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
});

test('the local Figma ribbon SVG preserves its vector geometry and gradient', () => {
  assert.equal(existsSync(ribbonSvgUrl), true);
  assert.match(ribbonSvg, /viewBox="0 0 1185\.65 3200\.02"/);
  assert.match(ribbonSvg, /<path id="Vector" pathLength="1" opacity="0\.8" vector-effect="non-scaling-stroke" d="M500\.04 100\.008C596\.64 236\.708 1146\.64 646\.708 1080\.04 920\.008/);
  assert.match(ribbonSvg, /stroke="url\(#brand-ribbon-gradient\)" stroke-width="200" stroke-linecap="round" stroke-linejoin="round"/);
  assert.match(ribbonSvg, /<stop stop-color="#E4222E" stop-opacity="0"\/>/);
  assert.match(ribbonSvg, /<stop offset="0\.09" stop-color="#E4222E" stop-opacity="0\.95"\/>/);
  assert.match(ribbonSvg, /<stop offset="0\.5" stop-color="#C5242E"\/>/);
  assert.match(ribbonSvg, /<stop offset="0\.91" stop-color="#E4222E" stop-opacity="0\.95"\/>/);
  assert.match(ribbonSvg, /<stop offset="1" stop-color="#E4222E" stop-opacity="0"\/>/);
});
