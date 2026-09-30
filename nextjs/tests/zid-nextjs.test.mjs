import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const read = (relativePath) =>
  readFileSync(new URL(`../${relativePath}`, import.meta.url), "utf8");

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
