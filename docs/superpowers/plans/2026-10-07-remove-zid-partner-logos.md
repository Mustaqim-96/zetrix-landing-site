# Remove Two ZID Partner Logos Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the Xinghuo and Beibu Gulf logo cards from the ZID Powered by section while centering the remaining Zetrix and MYEG cards.

**Architecture:** Keep the existing Powered by section and card component styles. Remove the first two card instances, delete their unused assets and selectors, and reduce the desktop grid to two centered columns while preserving the existing mobile one-column breakpoint.

**Tech Stack:** Next.js App Router, React/TSX, CSS, Node.js test runner

## Global Constraints

- Implement and verify on `dev`; do not change `main`.
- Keep the About ZID collaboration copy unchanged.
- Keep the Powered by heading and the Zetrix and MYEG cards.
- Do not redesign the remaining cards.

---

### Task 1: Remove the two partner cards and center the remaining pair

**Files:**
- Modify: `nextjs/tests/zid-nextjs.test.mjs`
- Modify: `nextjs/src/app/zid/page.tsx`
- Modify: `nextjs/src/app/zid/zid.css`
- Delete: `nextjs/public/assets/zid/xinghuo.webp`
- Delete: `nextjs/public/assets/zid/beibu-gulf.webp`

**Interfaces:**
- Consumes: the existing static Powered by markup and partner-grid styles.
- Produces: a responsive Powered by section containing only centered Zetrix and MYEG cards.

- [ ] **Step 1: Write the failing regression test**

Add this test to `nextjs/tests/zid-nextjs.test.mjs`:

```js
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
```

- [ ] **Step 2: Run the focused test and verify RED**

Run from `nextjs/`:

```bash
node --test --test-name-pattern="keeps only Zetrix and MYEG in the Powered by grid" tests/zid-nextjs.test.mjs
```

Expected: FAIL because both partner cards and assets still exist.

- [ ] **Step 3: Remove the Xinghuo and Beibu Gulf card markup**

Delete these two elements from `nextjs/src/app/zid/page.tsx`:

```tsx
<div className="partner partner--xinghuo"><span className="partner-logo"><img src="/assets/zid/xinghuo.webp" alt="Xinghuo Blockchain Infrastructure" loading="lazy" decoding="async" width="652" height="217" /><img className="partner-logo-light" src="/assets/zid/xinghuo.webp" alt="" aria-hidden="true" loading="lazy" decoding="async" width="652" height="217" /></span></div>
<div className="partner partner--beibu"><span className="partner-logo"><img src="/assets/zid/beibu-gulf.webp" alt="Beibu Gulf Investment Group" loading="lazy" decoding="async" width="652" height="217" /><img className="partner-logo-light" src="/assets/zid/beibu-gulf.webp" alt="" aria-hidden="true" loading="lazy" decoding="async" width="652" height="217" /></span></div>
```

Keep the adjacent Zetrix and MYEG card elements unchanged.

- [ ] **Step 4: Center the two-card grid and remove obsolete selectors**

In `nextjs/src/app/zid/zid.css`, change the desktop partner grid to:

```css
.partner-grid{display:grid;margin-top:30px;grid-template-columns:repeat(2,minmax(0,280px));justify-content:center;gap:16px}
```

Remove these selectors because no remaining markup uses them:

```css
.partner-logo{display:grid;place-items:center}
.partner-logo img{grid-area:1/1}
.partner-logo-light{opacity:0;clip-path:inset(0 0 0 var(--wordmark-start))}
.partner--xinghuo{--wordmark-start:38%}
.partner--beibu{--wordmark-start:17%}
```

Keep the existing tablet two-column and mobile one-column overrides.

- [ ] **Step 5: Delete the unused assets**

Delete exactly:

```text
nextjs/public/assets/zid/xinghuo.webp
nextjs/public/assets/zid/beibu-gulf.webp
```

- [ ] **Step 6: Run the focused test and verify GREEN**

Run from `nextjs/`:

```bash
node --test --test-name-pattern="keeps only Zetrix and MYEG in the Powered by grid" tests/zid-nextjs.test.mjs
```

Expected: PASS.

- [ ] **Step 7: Run full verification**

Run from `nextjs/`:

```bash
node --test tests/zid-nextjs.test.mjs tests/zid-performance.test.mjs tests/zid-responsive.test.mjs
npm run lint
npm run build
node /Users/mustaqim/.agents/skills/impeccable/scripts/detect.mjs --json src/app/zid/page.tsx src/app/zid/zid.css
```

Expected: all tests pass, lint and build exit 0, and the detector reports no blocking issues introduced by the change.

- [ ] **Step 8: Inspect desktop and mobile renderings**

Open `/zid` from the `dev` worktree server. At desktop and 390px mobile widths, confirm only Zetrix and MYEG appear, the two cards are centered, and the Powered by heading remains.

- [ ] **Step 9: Commit the implementation on `dev`**

```bash
git add nextjs/tests/zid-nextjs.test.mjs nextjs/src/app/zid/page.tsx nextjs/src/app/zid/zid.css nextjs/public/assets/zid/xinghuo.webp nextjs/public/assets/zid/beibu-gulf.webp
git commit -m "refactor(zid): remove two partner logos"
```
