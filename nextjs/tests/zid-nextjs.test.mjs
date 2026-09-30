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

test("links the complete homepage ZID card to the native route", () => {
  const home = read("src/app/page.tsx");

  assert.match(
    home,
    /<a\s+href=["']\/zid["']\s+className=["']tool-card["'][\s\S]*?<h3[^>]*>ZID<\/h3>[\s\S]*?<\/a>/,
  );
  assert.doesNotMatch(home, /href=["']\/zid\.html["']/);
});

test("publishes ZID in the sitemap", () => {
  const sitemap = read("src/app/sitemap.ts");
  assert.match(sitemap, /url:\s*`\$\{SITE_URL\}\/zid`/);
});

test("provides a visible keyboard focus treatment for the linked card", () => {
  const css = read("public/css/styles.css");
  assert.match(css, /\.tool-card:focus-visible/);
});

test("retires the standalone ZID HTML document", () => {
  assert.equal(existsSync(new URL("../public/zid.html", import.meta.url)), false);
});

test("places ZID styles above shared landing-page styles in the cascade", () => {
  const globals = read("src/app/globals.css");
  const shared = read("public/css/styles.css");
  const zid = read("src/app/zid/zid.css");

  assert.match(globals, /@layer\s+site,\s*zid\s*;/);
  assert.match(shared, /@layer\s+site\s*\{/);
  assert.match(zid, /@layer\s+zid\s*\{/);
});
