# ZID Shared Navigation, Footer, and Hero Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `/zid` render the homepage's exact navigation and footer from shared components, and center its hero phone screenshot without rotation.

**Architecture:** Extract the canonical homepage navigation and footer markup into focused server components consumed by both routes. Preserve route-specific runtime loading, allow ZID to use a full-document home link, and remove only the ZID CSS rules that override shared chrome while centering the existing WebP hero asset.

**Tech Stack:** Next.js 16 App Router, React 19 server components, TypeScript, hand-authored layered CSS, Node test runner, ESLint.

## Global Constraints

- Work only on the local `dev` branch; do not merge or push.
- Preserve the ZID route metadata, content, animation controllers, and optimized WebP assets.
- Do not load homepage-only Three.js or globe scripts on `/zid`.
- Keep navigation, footer, keyboard behavior, theming, safe areas, and responsive behavior identical across `/` and `/zid`.
- Keep the hero screenshot decorative, upright, responsive, and horizontally centered.
- Preserve all unrelated tracked and untracked user files.

## File Structure

- Create `nextjs/src/components/SiteHeader.tsx`: canonical shared navbar markup and route-safe home-link behavior.
- Create `nextjs/src/components/SiteFooter.tsx`: canonical shared footer markup and footer spotlight hooks.
- Modify `nextjs/src/app/page.tsx`: replace inline navbar/footer markup with shared components.
- Modify `nextjs/src/app/zid/page.tsx`: replace stale navbar/footer duplicates with shared components.
- Modify `nextjs/src/app/zid/zid.css`: remove route overrides for shared chrome and center the hero screenshot.
- Modify `nextjs/tests/zid-nextjs.test.mjs`: cover shared ownership and hero alignment.

---

### Task 1: Add Shared-Chrome Regression Coverage

**Files:**
- Modify: `nextjs/tests/zid-nextjs.test.mjs`

**Interfaces:**
- Consumes: existing `read(relativePath)` test helper.
- Produces: structural assertions for `SiteHeader`, `SiteFooter`, both routes, and `.hero-phone` alignment.

- [ ] **Step 1: Write the failing component ownership tests**

Append these tests:

```js
test("shares the canonical site header across homepage and ZID", () => {
  const header = read("src/components/SiteHeader.tsx");
  const home = read("src/app/page.tsx");
  const zid = read("src/app/zid/page.tsx");

  assert.match(header, /export default function SiteHeader/);
  assert.match(header, /data-nav-count=["']6["']/);
  assert.match(header, /data-nav-count=["']9["']/);
  assert.match(home, /<SiteHeader\s*\/>/);
  assert.match(zid, /<SiteHeader\s+homeLinkMode=["']document["']\s*\/>/);
  assert.doesNotMatch(home, /<header className=["']nav-wrap["']/);
  assert.doesNotMatch(zid, /<header className=["']nav-wrap["']/);
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
```

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```bash
cd nextjs && node --test tests/zid-nextjs.test.mjs
```

Expected: the three new tests fail because the shared components do not exist and `.hero-phone` still uses `rotate(-2.4deg)`.

- [ ] **Step 3: Commit the red tests**

```bash
git add nextjs/tests/zid-nextjs.test.mjs
git commit -m "test(zid): define shared chrome behavior"
```

---

### Task 2: Extract and Reuse the Canonical Header

**Files:**
- Create: `nextjs/src/components/SiteHeader.tsx`
- Modify: `nextjs/src/app/page.tsx:12,36-140`
- Modify: `nextjs/src/app/zid/page.tsx:3,33-101`

**Interfaces:**
- Produces: `SiteHeader({ homeLinkMode?: "next" | "document" }): JSX.Element`.
- Consumers: homepage uses the default `"next"`; ZID passes `"document"` to preserve the full-navigation runtime boundary.

- [ ] **Step 1: Create the shared header shell and home-link interface**

Create `SiteHeader.tsx` with this component boundary, then move the complete homepage `<header className="nav-wrap">…</header>` markup into its return value without changing menu content, counts, URLs, image loading attributes, accessibility attributes, or data hooks:

```tsx
import Link from "next/link";

type SiteHeaderProps = {
  homeLinkMode?: "next" | "document";
};

const logo = (
  <>
    <img className="nav__logo-mark nav__logo-mark--dark" src="/assets/img/logo-zetrix.svg" alt="Zetrix" />
    <img className="nav__logo-mark nav__logo-mark--light" src="/assets/img/logo-zetrix-light.svg" alt="" aria-hidden="true" />
  </>
);

export default function SiteHeader({ homeLinkMode = "next" }: SiteHeaderProps) {
  const homeLink = homeLinkMode === "document"
    ? <a className="nav__logo" href="/" aria-label="Zetrix home">{logo}</a>
    : <Link className="nav__logo" href="/" aria-label="Zetrix home">{logo}</Link>;

  return (
    <header className="nav-wrap">
      <button className="nav__backdrop" type="button" data-nav-backdrop hidden aria-label="Close navigation menu"></button>
      <nav className="nav" data-nav aria-label="Primary">
        {homeLink}
        {/* Move the homepage nav__menu, BUIDL CTA, theme controls, mobile toggle,
            and every nav-dropdown group here verbatim. */}
      </nav>
    </header>
  );
}
```

The moved block must include the homepage's canonical group counts: Developers `2`, Individuals `1`, Ecosystem `6`, Tools `3`, Discover `4`, and Investors `9`.

- [ ] **Step 2: Replace homepage inline navigation**

Remove `import Link from "next/link";` if no other homepage markup uses it, add:

```tsx
import SiteHeader from "@/components/SiteHeader";
```

Replace the complete inline header block with:

```tsx
<SiteHeader />
```

- [ ] **Step 3: Replace ZID inline navigation**

Add:

```tsx
import SiteHeader from "@/components/SiteHeader";
```

Replace the complete ZID inline header block with:

```tsx
<SiteHeader homeLinkMode="document" />
```

- [ ] **Step 4: Run the focused test**

Run:

```bash
cd nextjs && node --test tests/zid-nextjs.test.mjs
```

Expected: the header test passes; footer and hero tests still fail.

- [ ] **Step 5: Commit the shared header**

```bash
git add nextjs/src/components/SiteHeader.tsx nextjs/src/app/page.tsx nextjs/src/app/zid/page.tsx
git commit -m "refactor: share site navigation"
```

---

### Task 3: Extract and Reuse the Canonical Footer

**Files:**
- Create: `nextjs/src/components/SiteFooter.tsx`
- Modify: `nextjs/src/app/page.tsx:556-613`
- Modify: `nextjs/src/app/zid/page.tsx:218-243`

**Interfaces:**
- Produces: `SiteFooter(): JSX.Element` with no route-specific props.
- Consumers: homepage and ZID render `<SiteFooter />`.

- [ ] **Step 1: Create the footer component from the homepage source of truth**

Move the homepage's complete `<footer className="footer">…</footer>` block into `SiteFooter.tsx`. Preserve the homepage link destinations exactly as they currently render, along with all `loading="lazy"`, `decoding="async"`, ARIA, social icon, and wordmark spotlight attributes:

```tsx
export default function SiteFooter() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__top">
          <nav className="footer__nav" aria-label="Footer">
            {/* Product, Individuals, Ecosystem, Tools, and Discover columns
                moved verbatim from the homepage. */}
          </nav>
          <div className="footer__socials" aria-label="Zetrix social channels">
            {/* Four homepage social controls moved verbatim. */}
          </div>
        </div>
        <div className="footer__brand">
          <div className="footer__wordmark-art" data-footer-spotlight aria-hidden="true">
            {/* Five lazy wordmark layers moved verbatim. */}
          </div>
          <div className="footer__bottom">
            <p className="footer__copy">© 2026 Zetrix. All rights reserved.</p>
            <div className="footer__legal">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Replace both inline footers**

Add the same import to both route files:

```tsx
import SiteFooter from "@/components/SiteFooter";
```

Replace each complete inline footer with:

```tsx
<SiteFooter />
```

- [ ] **Step 3: Run the focused test**

Run:

```bash
cd nextjs && node --test tests/zid-nextjs.test.mjs
```

Expected: header and footer tests pass; the hero alignment test still fails.

- [ ] **Step 4: Commit the shared footer**

```bash
git add nextjs/src/components/SiteFooter.tsx nextjs/src/app/page.tsx nextjs/src/app/zid/page.tsx
git commit -m "refactor: share site footer"
```

---

### Task 4: Remove ZID Chrome Overrides and Center the Hero Screenshot

**Files:**
- Modify: `nextjs/src/app/zid/zid.css:41-49,58,95,149-175`

**Interfaces:**
- Consumes: canonical navbar/footer rules from `nextjs/public/css/styles.css` in the `site` cascade layer.
- Produces: ZID-only hero and section styling in the higher-priority `zid` layer without redefining shared chrome.

- [ ] **Step 1: Delete obsolete navigation overrides**

Remove the old standalone selectors that fight the homepage implementation:

```css
.site-header { ... }
.nav { ... }
.nav-logo { ... }
.nav-links { ... }
.nav-cta { ... }
.nav-toggle { ... }
.nav.is-open { ... }
```

Also remove their obsolete tablet/mobile descendants from the ZID media queries. Retain ZID section rules and any `.nav__*` touch-target safeguards only when the shared stylesheet does not already supply the same behavior.

- [ ] **Step 2: Delete obsolete footer overrides**

Remove the standalone `.footer`, `.footer-inner`, `.footer-top`, `.footer-nav`, `.footer-col`, `.footer-socials`, `.footer-brand`, `.footer-wordmark`, `.footer-bottom`, and `.footer-legal` declarations, including their media-query variants. Keep the shared homepage `.footer__*` rules as the only footer layout source.

- [ ] **Step 3: Center and straighten the hero screenshot**

Replace the `.hero-phone` declaration with:

```css
.hero-phone{position:relative;z-index:4;width:300px;margin-top:48px;margin-inline:auto;flex:0 0 auto;transform:none;filter:drop-shadow(0 30px 50px rgba(0,0,0,.58))}
```

Keep the existing mobile width override:

```css
@media (max-width:767px){
  .hero-phone{width:260px}
}
```

- [ ] **Step 4: Run focused tests and lint**

Run:

```bash
cd nextjs && node --test tests/zid-nextjs.test.mjs
npm run lint -- --quiet
```

Expected: all focused tests pass and ESLint exits with status `0`.

- [ ] **Step 5: Commit the visual correction**

```bash
git add nextjs/src/app/zid/zid.css nextjs/tests/zid-nextjs.test.mjs
git commit -m "fix(zid): match shared chrome and center hero"
```

---

### Task 5: Bounded Browser and Production Verification

**Files:**
- Verify only; modify the Task 2–4 files in one correction batch only if browser evidence shows a defect.

**Interfaces:**
- Consumes: `/`, `/zid`, the running local server on port `3001`, and both theme states.
- Produces: evidence that shared chrome, responsive behavior, and the hero screenshot meet the approved design.

- [ ] **Step 1: Run the Impeccable mechanical layout scan once**

Run:

```bash
node /Users/mustaqim/.agents/skills/impeccable/scripts/detect.mjs --json --scope layout nextjs/src/components/SiteHeader.tsx nextjs/src/components/SiteFooter.tsx nextjs/src/app/page.tsx nextjs/src/app/zid/page.tsx nextjs/src/app/zid/zid.css
```

Expected: no unexplained navigation, footer, overflow, touch-target, or hero alignment findings. Record any false positive rather than distorting established design to satisfy it.

- [ ] **Step 2: Run one desktop/mobile browser inspection pass**

At one desktop viewport and one compact viewport, inspect `/` and `/zid` together and verify:

- matching navbar geometry, content, menus, CTA, and theme toggle;
- working desktop dropdown and compact accordion interactions;
- matching footer columns, socials, oversized wordmark, legal row, and spotlight hook;
- no horizontal overflow;
- upright hero screenshot centered beneath the CTA;
- ZID second section remains visible below the hero.

Expected: all checks pass. If not, make one consolidated correction batch and perform one confirmation pass only.

- [ ] **Step 3: Run complete automated verification**

Run:

```bash
cd nextjs
node --test tests/*.test.mjs
npm run lint -- --quiet
npm run build -- --webpack
cd ..
git diff --check
```

Expected: all tests pass, lint exits `0`, the static `/` and `/zid` routes build successfully, and `git diff --check` reports nothing.

- [ ] **Step 4: Confirm branch and localhost handoff**

Run:

```bash
git status --short --branch
git log -6 --oneline --decorate
```

Expected: `HEAD` remains on `dev`; only the user's pre-existing untracked source images remain. Restart `npm run dev -- -p 3001` if the production build stopped the dev process, then leave `http://localhost:3001/zid` open for review.

