# Remove the Zetrix Wallet+ Download Card Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the Zetrix Wallet+ download card from the ZID page while retaining and centering the MyID Superapp card.

**Architecture:** Keep the existing ZID download section and shared card styles. Remove the second card from the page, collapse the desktop grid to one centered column, remove the Wallet+-only selector and asset, and protect the result with a source-level regression test.

**Tech Stack:** Next.js App Router, React/TSX, CSS, Node.js test runner

## Global Constraints

- Implement and verify the change on `dev`; do not change `main`.
- Keep the MyID Superapp card, download heading, section copy, responsive spacing, and Download-to-About handoff unchanged.
- Do not redesign the remaining card or alter its links.

---

### Task 1: Remove the Wallet+ card and center MyID

**Files:**
- Modify: `nextjs/tests/zid-nextjs.test.mjs`
- Modify: `nextjs/src/app/zid/page.tsx`
- Modify: `nextjs/src/app/zid/zid.css`
- Delete: `nextjs/public/assets/zid/zetrix-wallet.webp`

**Interfaces:**
- Consumes: the existing static ZID page source and download-section CSS.
- Produces: a single-card download section containing only MyID Superapp.

- [ ] **Step 1: Write the failing regression test**

Add this test to `nextjs/tests/zid-nextjs.test.mjs`:

```js
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
```

- [ ] **Step 2: Run the focused test and verify RED**

Run from `nextjs/`:

```bash
node --test --test-name-pattern="keeps only the MyID download card" tests/zid-nextjs.test.mjs
```

Expected: FAIL because the page still contains `Zetrix Wallet+` and `zetrix-wallet.webp` still exists.

- [ ] **Step 3: Remove the Wallet+ markup and asset**

Delete this complete article from `nextjs/src/app/zid/page.tsx`:

```tsx
<article className="download-card download-card--wallet reveal">
  <div className="download-app-meta"><span>Download</span><h3>Zetrix Wallet+</h3></div>
  <div className="download-card-body">
    <div className="download-stores">
      <a className="download-store" href="#" aria-label="Download Zetrix Wallet Plus on the App Store"><img src="/assets/zid/app-store.svg" alt="" /><span className="download-store-copy"><small>Download on the</small><strong>App Store</strong></span></a>
      <a className="download-store" href="#" aria-label="Get Zetrix Wallet Plus on Google Play"><img src="/assets/zid/google-play.svg" alt="" /><span className="download-store-copy"><small>GET IT ON</small><strong>Google Play</strong></span></a>
    </div>
    <div className="download-code"><div className="download-qr"><img src="/assets/zid/download-qr.webp" alt="QR code to download Zetrix Wallet Plus" loading="lazy" decoding="async" width="800" height="800" /><span className="download-qr-badge"><img src="/assets/zid/zetrix-wallet.webp" alt="" loading="lazy" decoding="async" width="152" height="152" /></span></div><p className="download-qr-label">Scan QR code to download</p></div>
  </div>
</article>
```

Delete `nextjs/public/assets/zid/zetrix-wallet.webp` after confirming no references remain.

- [ ] **Step 4: Collapse the desktop grid and remove Wallet+-only CSS**

In `nextjs/src/app/zid/zid.css`, replace the desktop grid declaration:

```css
.download-grid{display:grid;width:600px;max-width:100%;grid-template-columns:minmax(0,280px);justify-content:center}
```

Remove this selector from the shared download rule:

```css
.download-card--wallet .download-qr-badge{border-radius:14px}
```

Keep the existing mobile rule intact; its single-column layout and fixed card width remain compatible.

- [ ] **Step 5: Run the focused test and verify GREEN**

Run from `nextjs/`:

```bash
node --test --test-name-pattern="keeps only the MyID download card" tests/zid-nextjs.test.mjs
```

Expected: PASS.

- [ ] **Step 6: Run the complete tracked ZID tests**

Run from `nextjs/`:

```bash
node --test tests/zid-nextjs.test.mjs tests/zid-performance.test.mjs tests/zid-responsive.test.mjs
```

Expected: all tests pass with zero failures.

- [ ] **Step 7: Run lint, production build, and the UI detector**

Run from `nextjs/`:

```bash
npm run lint
npm run build
node /Users/mustaqim/.agents/skills/impeccable/scripts/detect.mjs --json src/app/zid/page.tsx src/app/zid/zid.css
```

Expected: lint and build exit 0; the detector reports no blocking issues introduced by this change.

- [ ] **Step 8: Inspect desktop and mobile renderings**

Open `/zid` from the `dev` worktree's local server at desktop and mobile widths. Confirm that the MyID card is centered, no Wallet+ card appears, and the About transition remains intact.

- [ ] **Step 9: Commit the implementation on `dev`**

```bash
git add nextjs/tests/zid-nextjs.test.mjs nextjs/src/app/zid/page.tsx nextjs/src/app/zid/zid.css nextjs/public/assets/zid/zetrix-wallet.webp
git commit -m "refactor(zid): remove Wallet+ download card"
```
