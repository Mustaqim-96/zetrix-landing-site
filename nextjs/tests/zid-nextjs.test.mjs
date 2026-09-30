import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const read = (relativePath) => {
  const url = new URL(`../${relativePath}`, import.meta.url);
  return existsSync(url) ? readFileSync(url, "utf8") : "";
};

test("provides a native ZID App Router page", () => {
  assert.equal(existsSync(new URL("../src/app/zid/page.tsx", import.meta.url)), true);
});

test("keeps homepage-only runtime out of the root layout", () => {
  const layout = read("src/app/layout.tsx");
  const home = read("src/app/page.tsx");

  assert.doesNotMatch(layout, /<SiteScripts\s*\/>/);
  assert.doesNotMatch(layout, /three\.min\.js|globe-data\.js/);
  assert.match(home, /<HomeResources\s*\/>/);
  assert.match(home, /<SiteScripts\s*\/>/);
});

test("gives ZID route metadata and an isolated client runtime", () => {
  const page = read("src/app/zid/page.tsx");
  const runtime = read("src/components/ZidRuntime.tsx");

  assert.match(page, /export const metadata/);
  assert.match(page, /canonical:\s*["']\/zid["']/);
  assert.match(page, /<ZidRuntime\s*\/>/);
  assert.match(page, /className=["']zid-page["']/);
  assert.match(runtime, /return \(\) =>/);
  assert.match(runtime, /clearTimeout/);
  assert.match(runtime, /disconnect\(\)/);
  assert.match(runtime, /removeEventListener/);
  assert.match(runtime, /cancelAnimationFrame/);
});

test("uses absolute public asset paths in the ZID JSX", () => {
  const page = read("src/app/zid/page.tsx");

  assert.doesNotMatch(page, /src=["']\.\//);
  assert.match(page, /src=["']\/assets\/zid\/hero-myid\.webp["']/);
});
