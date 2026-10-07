# ZID Region Selector Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a selectable Malaysia/International segmented control above the ZID digitisation title while keeping the existing title and six steps unchanged for both selections.

**Architecture:** Keep `src/app/zid/page.tsx` as a server component and isolate the temporary selection state in one small client component. The component exposes two native pressed-state buttons; page integration and styling remain local to the existing ZID route.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, route-scoped CSS, Node.js built-in test runner

## Global Constraints

- Implement and commit the change on `dev` first.
- Malaysia is selected by default.
- Selecting International changes only the selected styling.
- The existing title and all six digitisation steps remain unchanged for both selections.
- Do not add International-specific copy, assets, routes, query parameters, or persistence.
- Keep `src/app/zid/page.tsx` as a server component.
- Use native buttons with mutually exclusive `aria-pressed` states and visible focus styling.

---

## File Structure

- Create `nextjs/src/components/CredentialRegionSelector.tsx`: owns selected-region state and renders the accessible two-option control.
- Modify `nextjs/src/app/zid/page.tsx`: imports and places the selector immediately before the digitisation heading.
- Modify `nextjs/src/app/zid/zid.css`: styles the selector for dark/light themes, focus, and mobile sizing.
- Modify `nextjs/tests/zid-nextjs.test.mjs`: protects the component contract, placement, server-component boundary, and unchanged six-step workflow.

### Task 1: Region selector behavior and page integration

**Files:**
- Create: `nextjs/src/components/CredentialRegionSelector.tsx`
- Modify: `nextjs/src/app/zid/page.tsx:1-65`
- Test: `nextjs/tests/zid-nextjs.test.mjs`

**Interfaces:**
- Produces: default export `CredentialRegionSelector(): JSX.Element`
- State: `type CredentialRegion = (typeof REGIONS)[number]`, derived from `const REGIONS = ["Malaysia", "International"] as const`
- DOM contract: `.process-region-selector[role="group"]` containing two buttons with `aria-pressed={selectedRegion === region}`
- Placement contract: `<CredentialRegionSelector />` occurs inside `.process-head` before `#digitise-title`

- [ ] **Step 1: Write the failing regression test**

Append this test to `nextjs/tests/zid-nextjs.test.mjs`:

```js
test("offers a region selector above the unchanged six-step digitisation guide", () => {
  const page = read("src/app/zid/page.tsx");
  const selector = read("src/components/CredentialRegionSelector.tsx");
  const processHeader =
    page.match(/<header className=["']process-head reveal["'][\s\S]*?<\/header>/)?.[0] ?? "";

  assert.match(page, /import CredentialRegionSelector from ["']@\/components\/CredentialRegionSelector["']/);
  assert.match(processHeader, /<CredentialRegionSelector\s*\/>[\s\S]*?id=["']digitise-title["']/);
  assert.doesNotMatch(page, /^[\s\S]*?["']use client["']/);

  assert.match(selector, /^["']use client["']/);
  assert.match(selector, /["']Malaysia["']/);
  assert.match(selector, /["']International["']/);
  assert.match(selector, /useState<CredentialRegion>\(["']Malaysia["']\)/);
  assert.match(selector, /role=["']group["']/);
  assert.match(selector, /aria-pressed=\{selectedRegion === region\}/);
  assert.match(selector, /onClick=\{\(\) => setSelectedRegion\(region\)\}/);

  assert.match(page, /How to digitise Malaysian ID<br \/>and more Malaysian nationals\?/);
  assert.equal((page.match(/data-process-step=/g) ?? []).length, 6);
});
```

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```bash
cd nextjs
node --test --test-name-pattern="offers a region selector" tests/zid-nextjs.test.mjs
```

Expected: FAIL because `CredentialRegionSelector.tsx` and its page import do not exist.

- [ ] **Step 3: Add the minimal client component**

Create `nextjs/src/components/CredentialRegionSelector.tsx`:

```tsx
"use client";

import { useState } from "react";

const REGIONS = ["Malaysia", "International"] as const;
type CredentialRegion = (typeof REGIONS)[number];

export default function CredentialRegionSelector() {
  const [selectedRegion, setSelectedRegion] =
    useState<CredentialRegion>("Malaysia");

  return (
    <div
      className="process-region-selector"
      role="group"
      aria-label="Credential region"
    >
      {REGIONS.map((region) => (
        <button
          className="process-region-selector__option"
          type="button"
          key={region}
          aria-pressed={selectedRegion === region}
          onClick={() => setSelectedRegion(region)}
        >
          {region}
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Integrate it immediately above the Section 2 title**

In `nextjs/src/app/zid/page.tsx`, add the import:

```tsx
import CredentialRegionSelector from "@/components/CredentialRegionSelector";
```

Then update only the process header:

```tsx
<header className="process-head reveal">
  <CredentialRegionSelector />
  <h2 className="section-title" id="digitise-title">
    How to digitise Malaysian ID<br />and more Malaysian nationals?
  </h2>
</header>
```

- [ ] **Step 5: Run the focused test and verify GREEN**

Run:

```bash
cd nextjs
node --test --test-name-pattern="offers a region selector" tests/zid-nextjs.test.mjs
```

Expected: 1 matching test passes with zero failures.

- [ ] **Step 6: Commit the behavioral unit**

```bash
git add nextjs/src/components/CredentialRegionSelector.tsx nextjs/src/app/zid/page.tsx nextjs/tests/zid-nextjs.test.mjs
git commit -m "feat(zid): add credential region selector"
```

### Task 2: Route-scoped visual treatment and release verification

**Files:**
- Modify: `nextjs/src/app/zid/zid.css:61-62,79-82,125-126`
- Modify: `nextjs/tests/zid-nextjs.test.mjs`

**Interfaces:**
- Consumes: `.process-region-selector` and `.process-region-selector__option` from Task 1
- Produces: selected styling through `[aria-pressed="true"]`, inactive styling through `[aria-pressed="false"]`, and a minimum 44px target size

- [ ] **Step 1: Write the failing CSS contract test**

Append this test to `nextjs/tests/zid-nextjs.test.mjs`:

```js
test("styles the ZID region selector as an accessible responsive segmented control", () => {
  const css = read("src/app/zid/zid.css");

  assert.match(css, /\.process-region-selector\{/);
  assert.match(css, /\.process-region-selector__option\{/);
  assert.match(css, /min-height:44px/);
  assert.match(css, /\.process-region-selector__option\[aria-pressed=["']true["']\]/);
  assert.match(css, /\.process-region-selector__option:focus-visible/);
  assert.match(css, /html\[data-theme=["']light["']\] \.process-region-selector/);
});
```

- [ ] **Step 2: Run the focused CSS test and verify RED**

Run:

```bash
cd nextjs
node --test --test-name-pattern="styles the ZID region selector" tests/zid-nextjs.test.mjs
```

Expected: FAIL because the selector classes are not styled yet.

- [ ] **Step 3: Add the route-scoped selector styles**

In `nextjs/src/app/zid/zid.css`, expand the process-section rules with:

```css
.process{padding:120px 0}
.process-head{margin-bottom:40px}
.process-region-selector{display:flex;width:max-content;margin:0 auto 28px;padding:3px;border:1px solid rgba(255,255,255,.16);border-radius:10px;background:#3f3f46;box-shadow:inset 0 1px 0 rgba(255,255,255,.08)}
.process-region-selector__option{min-width:112px;min-height:44px;padding:0 18px;border:0;border-radius:7px;background:transparent;color:#d4d4d8;font-family:var(--body);font-size:15px;font-weight:600;line-height:1;cursor:pointer;transition:background-color .18s ease,color .18s ease,box-shadow .18s ease}
.process-region-selector__option[aria-pressed="true"]{background:#fff;color:var(--brand);box-shadow:0 1px 3px rgba(0,0,0,.24)}
.process-region-selector__option:hover:not([aria-pressed="true"]){color:#fff}
.process-region-selector__option:focus-visible{position:relative;z-index:1;outline:2px solid #fff;outline-offset:3px}
.process .section-title{width:min(695px,100%);margin-inline:auto;font-size:40px;line-height:48px;letter-spacing:0}
```

Add the light-theme adjustments beside the existing light process rules:

```css
html[data-theme="light"] .process-region-selector{border-color:#d4d4d8;background:#3f3f46;box-shadow:inset 0 1px 0 rgba(255,255,255,.12),0 8px 22px rgba(31,41,55,.08)}
html[data-theme="light"] .process-region-selector__option[aria-pressed="true"]{background:#fff;color:var(--brand)}
```

Inside `@media (max-width:767px)`, keep the targets touch-safe while tightening their width:

```css
.process-region-selector{margin-bottom:24px}
.process-region-selector__option{min-width:104px;padding-inline:14px}
```

Inside `@media (prefers-reduced-motion:reduce)`, disable the selector transition:

```css
.process-region-selector__option{transition:none}
```

- [ ] **Step 4: Run the focused test and verify GREEN**

Run:

```bash
cd nextjs
node --test --test-name-pattern="styles the ZID region selector" tests/zid-nextjs.test.mjs
```

Expected: 1 matching test passes with zero failures.

- [ ] **Step 5: Run complete automated verification**

Run:

```bash
cd nextjs
node --test tests/*.test.mjs
./node_modules/.bin/eslint src/components/CredentialRegionSelector.tsx src/app/zid/page.tsx --quiet
./node_modules/.bin/next build --webpack
```

Expected: all tests pass, ESLint exits 0, and the production build completes successfully.

- [ ] **Step 6: Verify behavior and responsive layout on localhost**

Start the site if necessary:

```bash
cd nextjs
npm run dev -- --hostname 127.0.0.1 --port 3001
```

At `http://127.0.0.1:3001/zid`, verify:

- Malaysia is selected on first load.
- Clicking International moves the selected treatment and leaves the title and six steps unchanged.
- Clicking Malaysia restores the selected treatment.
- Both controls expose the correct `aria-pressed` values.
- Keyboard focus is visible and Space/Enter activates each button.
- The control remains centered without clipping at desktop and 390px-wide mobile viewports.
- Dark and light themes preserve readable contrast.
- The browser console contains no errors.

- [ ] **Step 7: Commit the visual and verification unit**

```bash
git add nextjs/src/app/zid/zid.css nextjs/tests/zid-nextjs.test.mjs
git commit -m "style(zid): polish region selector"
```

- [ ] **Step 8: Confirm branch state**

Run:

```bash
git status --short --branch
git log --oneline --decorate -5
```

Expected: a clean `dev` branch containing both implementation commits; do not merge or push without explicit user approval.
