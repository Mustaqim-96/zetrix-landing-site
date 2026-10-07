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

test("shares the canonical site header across homepage and ZID", () => {
  const header = read("src/components/SiteHeader.tsx");
  const home = read("src/app/page.tsx");
  const zid = read("src/app/zid/page.tsx");

  assert.match(header, /export default function SiteHeader/);
  assert.match(header, /data-nav-count=["']6["']/);
  assert.match(header, /data-nav-count=["']9["']/);
  assert.match(home, /<SiteHeader\s*\/>/);
  assert.match(zid, /<SiteHeader\s+homeLinkMode=["']document-skip-intro["']\s*\/>/);
  assert.doesNotMatch(home, /<header className=["']nav-wrap["']/);
  assert.doesNotMatch(zid, /<header className=["']nav-wrap["']/);
});

test("skips the homepage splash once when returning from ZID", () => {
  const link = read("src/components/HomeLogoLink.tsx");
  const header = read("src/components/SiteHeader.tsx");
  const layout = read("src/app/layout.tsx");
  const zid = read("src/app/zid/page.tsx");

  assert.match(zid, /<SiteHeader\s+homeLinkMode=["']document-skip-intro["']\s*\/>/);
  assert.match(header, /<HomeLogoLink>/);
  assert.match(link, /sessionStorage\.setItem\(["']zetrix-skip-intro["'],\s*["']1["']\)/);
  assert.match(link, /href=["']\/["']/);
  assert.match(layout, /sessionStorage\.getItem\(["']zetrix-skip-intro["']\)/);
  assert.match(layout, /sessionStorage\.removeItem\(["']zetrix-skip-intro["']\)/);
});

test("shares the canonical site footer across homepage and ZID", () => {
  const footer = read("src/components/SiteFooter.tsx");
  const home = read("src/app/page.tsx");
  const zid = read("src/app/zid/page.tsx");

  assert.match(footer, /export default function SiteFooter/);
  assert.match(footer, /data-footer-spotlight/);
  assert.match(footer, /footer__wordmark-base/);
  assert.match(home, /<SiteFooter\s*\/>/);
  assert.match(zid, /<SiteFooter\s*\/>/);
  assert.doesNotMatch(home, /<footer className=["']footer["']/);
  assert.doesNotMatch(zid, /<footer className=["']footer["']/);
});

test("centers the ZID hero screenshot without rotation", () => {
  const css = read("src/app/zid/zid.css");
  const rule = css.match(/\.hero-phone\{([^}]*)\}/)?.[1] ?? "";

  assert.match(rule, /margin-inline:auto/);
  assert.match(rule, /transform:none/);
  assert.doesNotMatch(rule, /rotate\(/);
});

test("scales the ZID hero screenshot proportionally", () => {
  const css = read("src/app/zid/zid.css");
  const rule = css.match(/\.hero-phone img\{([^}]*)\}/)?.[1] ?? "";

  assert.match(rule, /width:100%/);
  assert.match(rule, /height:auto/);
});

test("removes the credential-verification walkthrough and its runtime hooks", () => {
  const page = read("src/app/zid/page.tsx");
  const runtime = read("src/components/ZidRuntime.tsx");
  const css = read("src/app/zid/zid.css");

  assert.doesNotMatch(page, /How to verify the Digitised Credentials\?/);
  assert.doesNotMatch(page, /className=["']verify["']/);
  assert.doesNotMatch(page, /data-verify-/);
  assert.doesNotMatch(runtime, /verify/i);
  assert.doesNotMatch(css, /\.verify/);
});

test("keeps only the MyID download card", () => {
  const page = read("src/app/zid/page.tsx");
  const css = read("src/app/zid/zid.css");

  assert.match(page, /<h3>MyID Superapp<\/h3>/);
  assert.doesNotMatch(page, /Zetrix Wallet\+/);
  assert.doesNotMatch(page, /zetrix-wallet\.webp/);
  assert.doesNotMatch(css, /\.download-card--wallet/);
  assert.equal(
    existsSync(new URL("../public/assets/zid/zetrix-wallet.webp", import.meta.url)),
    false,
  );
});

test("keeps only Zetrix and MYEG in the Powered by grid", () => {
  const page = read("src/app/zid/page.tsx");
  const css = read("src/app/zid/zid.css");
  const powered = page.match(/<section className=["']powered["'][\s\S]*?<\/section>/)?.[0] ?? "";

  assert.match(powered, /partner--zetrix/);
  assert.match(powered, /partner--myeg/);
  assert.doesNotMatch(powered, /partner--xinghuo|partner--beibu/);
  assert.doesNotMatch(powered, /xinghuo\.webp|beibu-gulf\.webp/);
  assert.doesNotMatch(css, /\.partner--xinghuo|\.partner--beibu|\.partner-logo/);
  assert.match(page, /collaboration with Beibu Gulf Investment Group and Xinghuo Blockchain Infrastructure/);
  assert.equal(existsSync(new URL("../public/assets/zid/xinghuo.webp", import.meta.url)), false);
  assert.equal(existsSync(new URL("../public/assets/zid/beibu-gulf.webp", import.meta.url)), false);
});

test("keeps ZID media resets out of the shared site chrome", () => {
  const css = read("src/app/zid/zid.css");

  assert.match(css, /\.zid-page main img\{display:block;max-width:100%\}/);
  assert.doesNotMatch(css, /(?:^|\n)\s*img\{display:block;max-width:100%\}/);
});
