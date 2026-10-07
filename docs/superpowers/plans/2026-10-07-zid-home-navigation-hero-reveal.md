# ZID Home Navigation and Hero Reveal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let the ZID navbar logo open the homepage without replaying the splash and reuse the homepage title/subtitle reveal on the ZID hero.

**Architecture:** Preserve full-document navigation so homepage scripts initialize cleanly, but set and consume a one-use `sessionStorage` bypass flag. Expose the existing hero reveal through shared data attributes and load the same reveal script from the ZID runtime.

**Tech Stack:** Next.js App Router, React client components, TypeScript, browser `sessionStorage`, CSS/JavaScript animations, Node.js test runner

## Global Constraints

- Implement and verify on `dev`; do not change `main`.
- Direct homepage visits retain the splash.
- The bypass applies only to standard ZID logo navigation and is consumed once.
- Only the ZID title and subtitle receive the shared reveal; its CTA remains unchanged.
- Preserve reduced-motion behavior and ZID typography/layout.

---

### Task 1: Add a one-use homepage splash bypass

**Files:**
- Create: `nextjs/src/components/HomeLogoLink.tsx`
- Modify: `nextjs/src/components/SiteHeader.tsx`
- Modify: `nextjs/src/app/layout.tsx`
- Modify: `nextjs/src/app/zid/page.tsx`
- Modify: `nextjs/tests/zid-nextjs.test.mjs`

**Interfaces:**
- Produces: `HomeLogoLink({ children })`, which stores `zetrix-skip-intro=1` before navigating to `/`.
- Consumes: the same key in the early root-layout intro script.

- [ ] **Step 1: Write the failing navigation regression test**

Add this test to `nextjs/tests/zid-nextjs.test.mjs` and update the existing shared-header assertion from `document` to `document-skip-intro`:

```js
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
```

- [ ] **Step 2: Run the focused test and verify RED**

Run from `nextjs/`:

```bash
node --test --test-name-pattern="skips the homepage splash once when returning from ZID" tests/zid-nextjs.test.mjs
```

Expected: FAIL because the bypass contract does not exist.

- [ ] **Step 3: Create the client-side logo link**

Create `nextjs/src/components/HomeLogoLink.tsx`:

```tsx
"use client";

import type { MouseEvent, ReactNode } from "react";

type HomeLogoLinkProps = { children: ReactNode };

export default function HomeLogoLink({ children }: HomeLogoLinkProps) {
  function skipIntroOnce(event: MouseEvent<HTMLAnchorElement>) {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    try {
      window.sessionStorage.setItem("zetrix-skip-intro", "1");
    } catch {
      // Storage can be unavailable; normal navigation still proceeds.
    }
  }

  return <a className="nav__logo" href="/" aria-label="Zetrix home" onClick={skipIntroOnce}>{children}</a>;
}
```

- [ ] **Step 4: Route the ZID header through the new link**

In `nextjs/src/components/SiteHeader.tsx`, import `HomeLogoLink`, change the mode union to `"next" | "document-skip-intro"`, and use:

```tsx
const homeLink = homeLinkMode === "document-skip-intro"
  ? <HomeLogoLink>{logo}</HomeLogoLink>
  : <Link className="nav__logo" href="/" aria-label="Zetrix home">{logo}</Link>;
```

In `nextjs/src/app/zid/page.tsx`, use:

```tsx
<SiteHeader homeLinkMode="document-skip-intro" />
```

- [ ] **Step 5: Consume the bypass before starting the intro**

In `introFailsafe` in `nextjs/src/app/layout.tsx`, immediately after the pathname guard, add:

```js
try {
  if (window.sessionStorage.getItem('zetrix-skip-intro') === '1') {
    window.sessionStorage.removeItem('zetrix-skip-intro');
    return;
  }
} catch (e) {}
```

- [ ] **Step 6: Run the focused and full tests**

```bash
cd nextjs
node --test --test-name-pattern="skips the homepage splash once when returning from ZID" tests/zid-nextjs.test.mjs
node --test tests/zid-nextjs.test.mjs tests/zid-performance.test.mjs tests/zid-responsive.test.mjs
```

Expected: both commands pass.

- [ ] **Step 7: Commit Task 1**

```bash
git add nextjs/src/components/HomeLogoLink.tsx nextjs/src/components/SiteHeader.tsx nextjs/src/app/layout.tsx nextjs/src/app/zid/page.tsx nextjs/tests/zid-nextjs.test.mjs
git commit -m "fix(zid): skip homepage splash from logo"
```

---

### Task 2: Share the homepage title and subtitle reveal with ZID

**Files:**
- Modify: `nextjs/src/app/page.tsx`
- Modify: `nextjs/src/app/zid/page.tsx`
- Modify: `nextjs/src/components/ZidRuntime.tsx`
- Modify: `nextjs/public/js/site-reveal.js`
- Modify: `nextjs/tests/zid-nextjs.test.mjs`

**Interfaces:**
- Consumes: `[data-hero-reveal]`, `[data-hero-reveal-title]`, and `[data-hero-reveal-subtitle]` markers.
- Produces: the existing glyph reveal and completion event on both pages.

- [ ] **Step 1: Write the failing shared-reveal regression test**

Add:

```js
test("shares the homepage title and subtitle reveal with ZID", () => {
  const home = read("src/app/page.tsx");
  const zid = read("src/app/zid/page.tsx");
  const runtime = read("src/components/ZidRuntime.tsx");
  const reveal = read("public/js/site-reveal.js");

  for (const page of [home, zid]) {
    assert.match(page, /data-hero-reveal/);
    assert.match(page, /data-hero-reveal-title/);
    assert.match(page, /data-hero-reveal-subtitle/);
  }
  assert.match(runtime, /["']\/js\/site-reveal\.js["']/);
  assert.match(reveal, /querySelector\(["']\[data-hero-reveal\]["']\)/);
  assert.match(reveal, /querySelector\(["']\[data-hero-reveal-title\]["']\)/);
  assert.match(reveal, /querySelector\(["']\[data-hero-reveal-subtitle\]["']\)/);
  assert.doesNotMatch(zid, /hero__cta/);
});
```

- [ ] **Step 2: Run the focused test and verify RED**

```bash
cd nextjs
node --test --test-name-pattern="shares the homepage title and subtitle reveal with ZID" tests/zid-nextjs.test.mjs
```

Expected: FAIL because the shared marker contract is absent.

- [ ] **Step 3: Mark both hero-copy groups**

In the homepage, add `data-hero-reveal` to `.hero__content`, `data-hero-reveal-title` to its `h1`, and `data-hero-reveal-subtitle` to its subtitle. Add the same attributes to the existing ZID `.hero-content`, `h1`, and `.hero-copy` without changing their classes.

- [ ] **Step 4: Consume shared markers in the reveal script**

Replace the final homepage-only selectors in `nextjs/public/js/site-reveal.js` with:

```js
var heroContent = document.querySelector('[data-hero-reveal]');
setupHeroReveal(heroContent,
  heroContent && heroContent.querySelector('[data-hero-reveal-title]'),
  heroContent && heroContent.querySelector('[data-hero-reveal-subtitle]'),
  heroContent && heroContent.querySelector('.hero__cta')
);
```

- [ ] **Step 5: Load the reveal engine from ZID**

Add `"/js/site-reveal.js"` as the first entry in `SHARED_SCRIPTS` in `nextjs/src/components/ZidRuntime.tsx`.

- [ ] **Step 6: Run the focused and full tests**

```bash
cd nextjs
node --test --test-name-pattern="shares the homepage title and subtitle reveal with ZID" tests/zid-nextjs.test.mjs
node --test tests/zid-nextjs.test.mjs tests/zid-performance.test.mjs tests/zid-responsive.test.mjs
```

Expected: both commands pass.

- [ ] **Step 7: Run final verification**

```bash
cd nextjs
npm run lint
npm run build
node /Users/mustaqim/.agents/skills/impeccable/scripts/detect.mjs --json src/app/zid/page.tsx src/app/zid/zid.css src/components/HomeLogoLink.tsx src/components/SiteHeader.tsx
```

Expected: lint and build exit 0; the detector reports no blocking issue introduced by the change.

- [ ] **Step 8: Verify browser behavior**

From a fresh `/zid` load, confirm the title and subtitle reveal. Click the ZID navbar logo and confirm `/` loads without `site-intro-pending` or a visible splash while the homepage title/subtitle reveal still runs. Then directly reload `/` and confirm the normal splash remains.

- [ ] **Step 9: Commit Task 2**

```bash
git add nextjs/src/app/page.tsx nextjs/src/app/zid/page.tsx nextjs/src/components/ZidRuntime.tsx nextjs/public/js/site-reveal.js nextjs/tests/zid-nextjs.test.mjs
git commit -m "feat(zid): share homepage hero reveal"
```
