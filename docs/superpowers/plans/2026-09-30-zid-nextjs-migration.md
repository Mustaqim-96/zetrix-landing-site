# ZID Native Next.js Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the standalone `public/zid.html` document with a native `/zid` App Router page and make the complete homepage ZID card navigate to it.

**Architecture:** The root layout retains only truly global theme and stylesheet concerns. Homepage-only heavyweight scripts move into the homepage render tree, while `/zid` owns its markup, route stylesheet, metadata, and a cleanup-safe client runtime. Cross-route links deliberately use Next.js `reloadDocument` for the initial migration because the legacy homepage animation scripts are one-shot IIFEs without teardown APIs; this creates a clean runtime boundary while keeping `/zid` a native Next.js route.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, CSS, existing vanilla JavaScript controllers, Node.js built-in test runner.

## Global Constraints

- Preserve the approved ZID layout, copy, responsive behavior, light/dark theme, and animations.
- Keep all ZID raster references as WebP and all existing vector artwork as SVG.
- Keep the unique referenced ZID raster payload below 1 MiB.
- Keep hero imagery eager; keep below-the-fold raster imagery lazy with asynchronous decoding and intrinsic dimensions.
- Do not load homepage Three.js, globe, carousel, grid-ribbon, or homepage reveal scripts on a direct `/zid` request.
- Clean up every ZID listener, timeout, observer, media-query listener, and animation frame on unmount.
- Preserve the untracked PNG/source artwork; do not stage or delete it.
- Do not redesign sections, change marketing copy, change external destinations, push, or deploy.

## File Structure

- `nextjs/src/app/layout.tsx`: global metadata, viewport, theme prepaint, common stylesheet; no homepage runtime payload.
- `nextjs/src/app/page.tsx`: homepage markup, homepage runtime mount, and linked ZID card.
- `nextjs/src/components/HomeResources.tsx`: homepage-only Three.js/globe preloads.
- `nextjs/src/components/SiteScripts.tsx`: existing homepage script loader, mounted only by the homepage.
- `nextjs/src/app/zid/page.tsx`: server-rendered ZID markup and route metadata.
- `nextjs/src/app/zid/zid.css`: the standalone page's route-owned visual rules.
- `nextjs/src/components/ZidRuntime.tsx`: cleanup-safe ZID behavior and shared chrome script lifecycle.
- `nextjs/public/js/theme-toggle.js`: shared API plus tracked auto-init cleanup handle.
- `nextjs/public/js/nav-dropdown.js`: shared API plus tracked auto-init cleanup handle.
- `nextjs/public/js/footer-spotlight.js`: shared API plus tracked auto-init cleanup handle.
- `nextjs/src/app/sitemap.ts`: homepage and `/zid` entries.
- `nextjs/tests/zid-nextjs.test.mjs`: route architecture, card link, metadata, and runtime-isolation contract.
- `nextjs/tests/zid-performance.test.mjs`: WebP/loading/motion assertions against TSX, CSS, and runtime sources.
- `nextjs/tests/zid-responsive.test.mjs`: responsive CSS and viewport assertions against the migrated files.

---

### Task 1: Isolate the homepage runtime from the root layout

**Files:**
- Create: `nextjs/src/components/HomeResources.tsx`
- Create: `nextjs/tests/zid-nextjs.test.mjs`
- Modify: `nextjs/src/app/layout.tsx`
- Modify: `nextjs/src/app/page.tsx`

**Interfaces:**
- Produces: `HomeResources(): null`, which calls React DOM `preload()` only while the homepage renders.
- Produces: a root layout that mounts neither `SiteScripts` nor homepage script preloads.
- Consumes: existing default export `SiteScripts(): null`.

- [ ] **Step 1: Add failing runtime-isolation tests**

Create `nextjs/tests/zid-nextjs.test.mjs` with source-level contracts:

```js
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
```

- [ ] **Step 2: Run the architecture test and confirm the expected failure**

Run: `cd nextjs && node --test tests/zid-nextjs.test.mjs`

Expected: FAIL because `src/app/zid/page.tsx` and `HomeResources` do not exist and `SiteScripts` is still mounted by the root layout.

- [ ] **Step 3: Add homepage-only preloads**

Create `nextjs/src/components/HomeResources.tsx`:

```tsx
import { preload } from "react-dom";

export default function HomeResources() {
  preload("/vendor/three.min.js", { as: "script" });
  preload("/js/globe-data.js", { as: "script" });
  return null;
}
```

- [ ] **Step 4: Make the root layout route-neutral**

In `nextjs/src/app/layout.tsx`:

1. Remove the `SiteScripts` import and `<SiteScripts />` mount.
2. Remove the two script-preload links.
3. Keep `themeInit` and `/css/styles.css` global.
4. Restrict the intro failsafe to the homepage so direct `/zid` requests never receive `site-intro-pending`:

```ts
const introFailsafe = `(function () {
  if (window.location.pathname !== '/') return;
  document.documentElement.classList.add('site-intro-pending');
  window.__zetrixIntroFailsafe = setTimeout(function () {
    document.documentElement.classList.remove('site-intro-pending');
  }, 4200);
})();`;
```

5. Add safe-area support to the existing viewport export:

```ts
export const viewport: Viewport = {
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#18181b" },
  ],
};
```

- [ ] **Step 5: Mount homepage resources and scripts in the homepage**

Add imports to `nextjs/src/app/page.tsx`:

```tsx
import HomeResources from "@/components/HomeResources";
import SiteScripts from "@/components/SiteScripts";
```

Place these as the first children of the page fragment:

```tsx
<HomeResources />
<SiteScripts />
```

- [ ] **Step 6: Re-run the focused test**

Run: `cd nextjs && node --test tests/zid-nextjs.test.mjs`

Expected: only the native ZID page assertion remains failing.

- [ ] **Step 7: Commit the isolated homepage runtime**

```bash
git add nextjs/src/app/layout.tsx nextjs/src/app/page.tsx nextjs/src/components/HomeResources.tsx nextjs/tests/zid-nextjs.test.mjs
git commit -m "refactor: isolate homepage runtime"
```

---

### Task 2: Build the native ZID route and cleanup-safe runtime

**Files:**
- Create: `nextjs/src/app/zid/page.tsx`
- Create: `nextjs/src/app/zid/zid.css`
- Create: `nextjs/src/components/ZidRuntime.tsx`
- Modify: `nextjs/public/js/theme-toggle.js`
- Modify: `nextjs/public/js/nav-dropdown.js`
- Modify: `nextjs/public/js/footer-spotlight.js`
- Test: `nextjs/tests/zid-nextjs.test.mjs`

**Interfaces:**
- Produces: `ZidPage(): JSX.Element`, server-rendered at `/zid`.
- Produces: `ZidRuntime(): null`, a client component with a single `useEffect` cleanup boundary.
- Produces: optional global cleanup handles `window.__zetrixThemeToggleCleanup`, `window.__zetrixNavDropdownCleanup`, and `window.__zetrixFooterSpotlightCleanup`.
- Consumes: `window.ZetrixThemeToggle.init(document, window)`, `window.ZetrixNavDropdown.init(document, window)`, and `window.ZetrixFooterSpotlight.init(document, window)` from existing public scripts.

- [ ] **Step 1: Extend the failing test with native-route contracts**

Append to `nextjs/tests/zid-nextjs.test.mjs`:

```js
test("gives ZID route metadata and an isolated client runtime", () => {
  const page = read("src/app/zid/page.tsx");
  const runtime = read("src/components/ZidRuntime.tsx");
  assert.match(page, /export const metadata/);
  assert.match(page, /canonical:\s*["']\/zid["']/);
  assert.match(page, /<ZidRuntime\s*\/>/);
  assert.match(page, /className=["']zid-page["']/);
  assert.match(runtime, /return \(\) =>/);
  assert.match(runtime, /clearTimeout|clearInterval/);
  assert.match(runtime, /disconnect\(\)/);
  assert.match(runtime, /removeEventListener/);
  assert.match(runtime, /cancelAnimationFrame/);
});

test("uses absolute public asset paths in the ZID JSX", () => {
  const page = read("src/app/zid/page.tsx");
  assert.doesNotMatch(page, /src=["']\.\//);
  assert.match(page, /src=["']\/assets\/zid\/hero-myid\.webp["']/);
});
```

- [ ] **Step 2: Run the focused test and confirm the route contracts fail**

Run: `cd nextjs && node --test tests/zid-nextjs.test.mjs`

Expected: FAIL because the page, stylesheet, and runtime do not exist.

- [ ] **Step 3: Extract the approved route stylesheet**

Create `nextjs/src/app/zid/zid.css` from the complete `<style>` block in `nextjs/public/zid.html`, preserving every declaration and media query. Apply only these deterministic path and route-safety edits:

```css
@font-face { font-family: Metropolis; src: url("/assets/fonts/Metropolis-Regular.woff") format("woff"); font-weight: 400; font-display: swap; }
@font-face { font-family: Metropolis; src: url("/assets/fonts/Metropolis-SemiBold.woff") format("woff"); font-weight: 600; font-display: swap; }
@font-face { font-family: Metropolis; src: url("/assets/fonts/Metropolis-Bold.woff") format("woff"); font-weight: 700; font-display: swap; }
@font-face { font-family: "Titillium Web"; src: url("/assets/fonts/TitilliumWeb-Regular.ttf") format("truetype"); font-weight: 400; font-display: swap; }
@font-face { font-family: "Titillium Web"; src: url("/assets/fonts/TitilliumWeb-SemiBold.ttf") format("truetype"); font-weight: 600; font-display: swap; }
@font-face { font-family: "Titillium Web"; src: url("/assets/fonts/TitilliumWeb-Bold.ttf") format("truetype"); font-weight: 700; font-display: swap; }

/* Keep theme selectors anchored to the document and ZID root. */
html[data-theme="light"] .zid-page .hero {
  color: #18181b;
  background: linear-gradient(180deg, #f4e3e5 0%, #fbf4f4 39%, #fff 74%);
}

/* Limit broad element/reset rules to the route root. */
.zid-page,
.zid-page *,
.zid-page *::before,
.zid-page *::after { box-sizing: border-box; }
.zid-page { min-height: 100%; margin: 0; background: var(--page); color: var(--white); font-family: var(--body); font-size: 16px; line-height: 1.5; -webkit-font-smoothing: antialiased; }
.zid-page h1,
.zid-page h2,
.zid-page h3,
.zid-page h4,
.zid-page p { margin: 0; }
.zid-page a { color: inherit; text-decoration: none; }
.zid-page button { font: inherit; color: inherit; }
.zid-page img { display: block; max-width: 100%; }
```

Prefix the remaining page-specific selectors with `.zid-page` while leaving `@font-face`, `@keyframes`, `@media`, and `:root` custom-property declarations structurally valid. Change the light-theme Zetrix logo URL to `/assets/img/logo-zetrix-light.svg`. Import this file only from `src/app/zid/page.tsx`.

- [ ] **Step 4: Convert the ZID document body to JSX**

Create `nextjs/src/app/zid/page.tsx` with:

```tsx
import type { Metadata } from "next";
import ZidRuntime from "@/components/ZidRuntime";
import "./zid.css";

const TITLE = "ZID — Blockchain-based Identity Network";
const DESCRIPTION =
  "Zidentity provides blockchain-based identity, verifiable credentials and on-chain signing services for secure cross-border transactions.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/zid" },
  openGraph: {
    type: "website",
    url: "/zid",
    siteName: "Zetrix",
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};
```

After the metadata, export `ZidPage` with a `.zid-page` root containing `<ZidRuntime />` followed by the complete converted body described next.

Use the complete existing body range from the skip link through `</footer>` as the authoritative content. Apply all of these mechanical JSX conversions, with no copy or ordering changes:

```text
class -> className
for -> htmlFor
tabindex -> tabIndex
all style attributes -> React style objects
all img/br/meta-like tags -> self-closing tags
./assets/... -> /assets/...
href="./" on the logo -> href="/"
numeric width/height strings -> JSX numeric attributes where touched
```

Keep the exact existing section IDs and data attributes: `main`, `hero`, `digitise`, `verify`, `download`, `about`, `powered`, `data-verify-step`, `data-verify-media`, `data-process-step`, `data-footer-spotlight`, and the shared navigation hooks. Keep the hero WebPs eager, and retain `loading="lazy"`, `decoding="async"`, width, and height on every below-the-fold raster.

- [ ] **Step 5: Make shared script auto-initialization cleanup-addressable**

Replace the final auto-init block in each shared script with its matching form:

```js
// theme-toggle.js
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  if (window.__zetrixThemeToggleCleanup) window.__zetrixThemeToggleCleanup();
  window.__zetrixThemeToggleCleanup = window.ZetrixThemeToggle.init(document, window);
}

// nav-dropdown.js
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  if (window.__zetrixNavDropdownCleanup) window.__zetrixNavDropdownCleanup();
  window.__zetrixNavDropdownCleanup = window.ZetrixNavDropdown.init(document, window);
}

// footer-spotlight.js
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  if (window.__zetrixFooterSpotlightCleanup) window.__zetrixFooterSpotlightCleanup();
  window.__zetrixFooterSpotlightCleanup = window.ZetrixFooterSpotlight.init(document, window);
}
```

- [ ] **Step 6: Port the inline ZID controller into an effect with explicit cleanup**

Create `nextjs/src/components/ZidRuntime.tsx`. Begin with the precise client/runtime types and shared-script loader:

```tsx
"use client";

import { useEffect } from "react";

type Cleanup = () => void;
type ZetrixWindow = Window & {
  __zetrixThemeToggleCleanup?: Cleanup;
  __zetrixNavDropdownCleanup?: Cleanup;
  __zetrixFooterSpotlightCleanup?: Cleanup;
};

const SHARED_SCRIPTS = [
  "/js/theme-toggle.js",
  "/js/nav-dropdown.js",
  "/js/footer-spotlight.js",
] as const;

export default function ZidRuntime() {
  useEffect(() => {
    const win = window as ZetrixWindow;
    const scripts = SHARED_SCRIPTS.map((src) => {
      const script = document.createElement("script");
      script.src = src;
      script.async = false;
      script.dataset.zetrixZidScript = "true";
      document.body.appendChild(script);
      return script;
    });

    const cleanupZidController = initializeZidController(document, window);

    return () => {
      win.__zetrixThemeToggleCleanup?.();
      win.__zetrixNavDropdownCleanup?.();
      win.__zetrixFooterSpotlightCleanup?.();
      win.__zetrixThemeToggleCleanup = undefined;
      win.__zetrixNavDropdownCleanup = undefined;
      win.__zetrixFooterSpotlightCleanup = undefined;
      scripts.forEach((script) => script.remove());
      cleanupZidController();
    };
  }, []);

  return null;
}
```

Define `initializeZidController(doc: Document, win: Window): Cleanup` above the component. Its body is the existing `zid.html` controller with `document` changed to `doc`, `window` changed to `win`, DOM queries scoped to `.zid-page`, and anonymous click/focus callbacks changed to named handlers or stored remover functions. Keep `VERIFY_DELAY = 4500`, `syncHeroMotion`, `handleVisibilityChange`, `verifyIsPaused`, `scheduleVerifyCycle`, `setVerifyStep`, `syncDownloadHandoff`, `updateDownloadHandoff`, and `requestDownloadHandoffUpdate` unchanged in behavior. Return one cleanup function whose complete teardown sequence is:

```ts
window.clearTimeout(verifyTimer);
verifyObserver?.disconnect();
heroObserver?.disconnect();
revealObserver?.disconnect();
downloadResizeObserver?.disconnect();
if (downloadHandoffFrame) window.cancelAnimationFrame(downloadHandoffFrame);
document.removeEventListener("visibilitychange", handleVisibilityChange);
window.removeEventListener("resize", syncDownloadHandoff);
window.removeEventListener("scroll", requestDownloadHandoffUpdate);
compactHandoff.removeEventListener("change", syncDownloadHandoff);
verifyStepCleanups.forEach((cleanup) => cleanup());
verifyPanel.removeEventListener("focusin", handleVerifyFocusIn);
verifyPanel.removeEventListener("focusout", handleVerifyFocusOut);
downloadHandoff?.style.removeProperty("--download-height");
if (downloadSection) downloadSection.style.transform = "";
document.querySelector(".hero")?.classList.remove("is-motion-paused");
```

Use the original functions `syncHeroMotion`, `handleVisibilityChange`, `verifyIsPaused`, `scheduleVerifyCycle`, `setVerifyStep`, `syncDownloadHandoff`, `updateDownloadHandoff`, and `requestDownloadHandoffUpdate`. Convert anonymous focus/click callbacks into named handlers or store per-button remover functions so the cleanup removes the same callback identities.

- [ ] **Step 7: Run route tests, type-aware lint, and build**

Run:

```bash
cd nextjs
node --test tests/zid-nextjs.test.mjs
npm run lint -- --quiet
npm run build -- --webpack
```

Expected: route tests PASS, lint exits 0, and the build lists both `/` and `/zid` as generated routes.

- [ ] **Step 8: Commit the native route**

```bash
git add nextjs/src/app/zid/page.tsx nextjs/src/app/zid/zid.css nextjs/src/components/ZidRuntime.tsx nextjs/public/js/theme-toggle.js nextjs/public/js/nav-dropdown.js nextjs/public/js/footer-spotlight.js nextjs/src/app/layout.tsx nextjs/tests/zid-nextjs.test.mjs
git commit -m "feat(zid): add native Next.js route"
```

---

### Task 3: Link the homepage card and publish route metadata

**Files:**
- Modify: `nextjs/src/app/page.tsx`
- Modify: `nextjs/src/app/sitemap.ts`
- Modify: `nextjs/public/css/styles.css`
- Test: `nextjs/tests/zid-nextjs.test.mjs`

**Interfaces:**
- Consumes: existing `Link` import from `next/link`.
- Produces: a whole-card `<Link href="/zid" reloadDocument>` navigation boundary.
- Produces: sitemap entries for `/` and `/zid`.

- [ ] **Step 1: Add failing card, sitemap, and focus-style tests**

Append to `nextjs/tests/zid-nextjs.test.mjs`:

```js
test("links the complete homepage ZID card to the native route", () => {
  const home = read("src/app/page.tsx");
  assert.match(
    home,
    /<Link\s+href=["']\/zid["']\s+reloadDocument\s+className=["']tool-card["'][\s\S]*?<h3[^>]*>ZID<\/h3>[\s\S]*?<\/Link>/,
  );
  assert.doesNotMatch(home, /href=["']\/zid\.html["']/);
});

test("publishes ZID in the sitemap", () => {
  const sitemap = read("src/app/sitemap.ts");
  assert.match(sitemap, /url:\s*`\$\{SITE_URL\}\/zid`/);
});

test("provides a visible keyboard focus treatment for the linked card", () => {
  const css = read("src/app/zid/zid.css");
  const globalCss = read("public/css/styles.css");
  assert.match(`${globalCss}\n${css}`, /\.tool-card:focus-visible/);
});
```

- [ ] **Step 2: Run the focused tests and confirm they fail**

Run: `cd nextjs && node --test tests/zid-nextjs.test.mjs`

Expected: FAIL for the unlinked card, missing sitemap entry, and focus style.

- [ ] **Step 3: Convert only the ZID article into a complete Link**

In `nextjs/src/app/page.tsx`, replace the first tools-grid `<article>` with:

```tsx
<Link href="/zid" reloadDocument className="tool-card" aria-label="Explore ZID digital identity">
  <div className="tool-card__top">
    <span className="tool-card__icon" aria-hidden="true">
      <img loading="lazy" decoding="async" src="/assets/icons/lucide-fingerprint.svg" alt="" />
    </span>
    <span className="tool-card__arrow" aria-hidden="true">
      <img loading="lazy" decoding="async" src="/assets/icons/arrow-up-right.svg" alt="" />
    </span>
  </div>
  <div className="tool-card__text">
    <h3 className="tool-card__title">ZID</h3>
    <p className="tool-card__desc">Privacy-preserving digital identity.</p>
  </div>
</Link>
```

Add a focus rule beside the existing `.tool-card` interaction rules in `nextjs/public/css/styles.css`:

```css
.tool-card:focus-visible {
  outline: 2px solid var(--accent, #c5242e);
  outline-offset: 4px;
}
```

- [ ] **Step 4: Add `/zid` to the sitemap**

Change `nextjs/src/app/sitemap.ts` to return:

```ts
return [
  {
    url: SITE_URL,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 1,
  },
  {
    url: `${SITE_URL}/zid`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.9,
  },
];
```

- [ ] **Step 5: Run focused tests and commit**

Run: `cd nextjs && node --test tests/zid-nextjs.test.mjs`

Expected: all tests PASS.

```bash
git add nextjs/src/app/page.tsx nextjs/src/app/sitemap.ts nextjs/public/css/styles.css nextjs/tests/zid-nextjs.test.mjs
git commit -m "feat(zid): link homepage card"
```

---

### Task 4: Move optimization/responsive tests to native sources and retire the HTML

**Files:**
- Modify: `nextjs/tests/zid-performance.test.mjs`
- Modify: `nextjs/tests/zid-responsive.test.mjs`
- Delete: `nextjs/public/zid.html`

**Interfaces:**
- Consumes: ZID JSX from `src/app/zid/page.tsx`, CSS from `src/app/zid/zid.css`, runtime from `src/components/ZidRuntime.tsx`, and viewport config from `src/app/layout.tsx`.
- Produces: tests independent of the removed legacy document.

- [ ] **Step 1: Point performance tests at the native sources before deleting HTML**

Replace the old `html` fixture with:

```js
const page = readFileSync(new URL("../src/app/zid/page.tsx", import.meta.url), "utf8");
const css = readFileSync(new URL("../src/app/zid/zid.css", import.meta.url), "utf8");
const runtime = readFileSync(new URL("../src/components/ZidRuntime.tsx", import.meta.url), "utf8");
```

Update raster parsing to accept absolute JSX paths and optional JSX braces:

```js
function rasterSources(markup) {
  return [...markup.matchAll(/src=["']\/(assets\/[^"'?#]+\.(?:png|jpe?g|webp))["']/gi)]
    .map((match) => match[1]);
}

function rasterTags(markup) {
  return [...markup.matchAll(/<img\b[^>]*src=["']\/assets\/[^"'?#]+\.(?:png|jpe?g|webp)["'][^>]*\/>/gi)]
    .map((match) => match[0]);
}
```

Use `page` for image/loading checks, `css` for motion/progress CSS checks, and `runtime` for observer/visibility checks. Preserve the existing payload threshold and all assertion meanings.

- [ ] **Step 2: Point responsive tests at CSS, runtime, and viewport sources**

Replace the old fixture with:

```js
const css = readFileSync(new URL("../src/app/zid/zid.css", import.meta.url), "utf8");
const runtime = readFileSync(new URL("../src/components/ZidRuntime.tsx", import.meta.url), "utf8");
const layout = readFileSync(new URL("../src/app/layout.tsx", import.meta.url), "utf8");
```

Use `layout` for `viewportFit: "cover"`, `css` for every media-query/layout assertion, and `runtime` for the mobile handoff observer/listener assertions. Preserve all existing breakpoints and dimensional values.

- [ ] **Step 3: Run all ZID tests before deleting the source document**

Run:

```bash
cd nextjs
node --test tests/zid-nextjs.test.mjs tests/zid-performance.test.mjs tests/zid-responsive.test.mjs
```

Expected: all tests PASS while `public/zid.html` still exists, proving no test depends on it.

- [ ] **Step 4: Delete the superseded HTML and assert it stays gone**

Delete `nextjs/public/zid.html`, then append this test to `zid-nextjs.test.mjs`:

```js
test("retires the standalone ZID HTML document", () => {
  assert.equal(existsSync(new URL("../public/zid.html", import.meta.url)), false);
});
```

- [ ] **Step 5: Run the complete automated verification**

Run:

```bash
cd nextjs
node --test tests/*.test.mjs
npm run lint -- --quiet
npm run build -- --webpack
```

Expected: every test passes, lint exits 0, and the production build succeeds with `/` and `/zid` listed.

- [ ] **Step 6: Perform browser regression checks**

Start the production server on an unused local port:

```bash
cd nextjs
npm run start -- -p 3001
```

Verify all of the following at `http://localhost:3001/` and `http://localhost:3001/zid`:

- `/` desktop and mobile visuals remain unchanged.
- The ZID card has hover/focus feedback and opens `/zid`.
- `/zid` matches the legacy desktop, tablet, and mobile reference compositions.
- Theme toggles, dropdown navigation, skip link, verification-step clicks/auto-cycle, reveal animations, hero pause/resume, download/About handoff, and footer spotlight work.
- Reduced-motion mode disables continuous choreography as before.
- Refreshing `/zid` succeeds and browser back returns to the homepage.
- Neither route logs console errors.
- A direct `/zid` network load does not request `three.min.js`, `globe-data.js`, or homepage animation scripts.

- [ ] **Step 7: Review the final diff for source-asset safety**

Run:

```bash
git status --short
git diff --check
git diff --stat
git ls-files --others --exclude-standard nextjs/public/assets/zid
```

Expected: only planned application/test changes are tracked; the original PNG/source artwork remains untracked and unstaged; `git diff --check` prints nothing.

- [ ] **Step 8: Commit the migration cleanup**

```bash
git add nextjs/tests/zid-nextjs.test.mjs nextjs/tests/zid-performance.test.mjs nextjs/tests/zid-responsive.test.mjs nextjs/public/zid.html
git commit -m "test(zid): verify native route migration"
```

---

## Final Acceptance Checklist

- [ ] The homepage card navigates to `/zid`, never `/zid.html`.
- [ ] `/zid` is server-rendered by `src/app/zid/page.tsx` with canonical metadata.
- [ ] ZID WebP payload remains below 1 MiB and every below-fold raster keeps lazy/async loading and dimensions.
- [ ] Direct `/zid` loads no homepage-only Three.js or animation runtime.
- [ ] ZID runtime resources are fully cleaned on unmount.
- [ ] `/` and `/zid` pass desktop/mobile visual and interaction checks.
- [ ] Node tests, lint, webpack production build, and `git diff --check` pass.
- [ ] `public/zid.html` is removed only after native-route parity is demonstrated.
- [ ] Untracked PNG/source assets remain untouched.
