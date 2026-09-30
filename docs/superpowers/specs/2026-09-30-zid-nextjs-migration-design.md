# ZID Native Next.js Migration Design

**Date:** 2026-09-30  
**Status:** Approved for implementation planning  
**Scope:** Convert the optimized standalone ZID page into a native route in the existing Zetrix Next.js application and connect it to the homepage ZID card.

## Objective

Make ZID a first-class page of the Zetrix landing-site application at `/zid`. The migration must preserve the validated standalone page's appearance, responsive behavior, interactions, and optimized WebP delivery while preventing homepage-only animation code from loading on the ZID route.

## Current State

- The homepage is rendered by `nextjs/src/app/page.tsx`.
- The optimized ZID page is a standalone document at `nextjs/public/zid.html`.
- ZID production artwork is served from `nextjs/public/assets/zid/`, with raster references already converted to WebP.
- The root layout currently loads homepage-only scripts, Three.js preloads, and the homepage intro state on every route.
- The homepage ZID card is present but is not a link.
- The original untracked PNG source artwork is intentionally preserved and is outside this migration's staging scope.

## Selected Architecture

### Native route

- Add `nextjs/src/app/zid/page.tsx` as a native App Router page available at `/zid`.
- Convert the existing ZID body markup to semantic JSX without changing its visible copy or section ordering.
- Keep static asset URLs rooted at `/assets/zid/`.
- Export route-specific metadata for the ZID title, description, and canonical `/zid` URL.
- Add `/zid` to the application's sitemap.

### Styling

- Extract the ZID document's inline styles into route-owned CSS.
- Preserve the existing visual values and responsive breakpoints rather than redesigning the page during migration.
- Wrap the route in a stable `.zid-page` root and scope ZID-specific selectors beneath it. Any unavoidable document-level state must be applied and removed by the ZID client controller.
- Ensure selectors cannot unintentionally alter the homepage when users navigate between routes without a full reload, including when Next.js retains a previously loaded stylesheet.
- Retain the shared global Zetrix stylesheet for common navigation, footer, typography, and theme foundations.

### Runtime and script isolation

- Keep the early theme-preference script in the root layout so both routes paint with the correct theme.
- Move homepage-only preloads, intro state, and `SiteScripts` execution out of the root layout and into a homepage-only client boundary.
- Do not load Three.js, globe, robotics carousel, grid ribbon, ecosystem carousel, layers carousel, or homepage reveal controllers on `/zid`.
- Implement a dedicated ZID client controller that owns:
  - shared navigation dropdown setup;
  - theme-toggle setup;
  - footer spotlight setup;
  - verification accordion cycling;
  - hero animation visibility pausing;
  - responsive download/About handoff behavior;
  - ZID reveal observers.
- Every listener, timer, observer, and animation frame created by the ZID controller must be cleaned up when the route unmounts. This is required for reliable Next.js client-side navigation.
- Reuse the existing shared script APIs where they provide explicit initialization and cleanup; otherwise move the necessary behavior into React effects rather than depending on one-time document-load side effects.

### Homepage card

- Render the entire ZID service card as a Next.js `Link` targeting `/zid`.
- Preserve the card's current layout, icon, text, arrow, hover treatment, and grid geometry.
- Add a visible keyboard focus state without introducing nested interactive elements.

### Legacy page removal

- Keep `public/zid.html` during implementation as the visual and behavioral comparison source.
- Remove it only after the native `/zid` route passes automated and visual verification.
- Do not add a compatibility redirect from `/zid.html` unless an existing published URL requirement is identified; the supported route after migration is `/zid`.

## Accessibility and Performance

- Preserve heading order, meaningful alternative text, link labels, reduced-motion behavior, and keyboard access.
- Keep hero artwork eager and below-the-fold imagery lazy with asynchronous decoding.
- Preserve intrinsic image dimensions to limit layout shift.
- Keep all raster references on the ZID route in WebP; SVG assets remain SVG.
- Avoid introducing a second copy of page controllers or global event listeners after client navigation.
- Preserve the optimized unique raster payload target of less than 1 MiB.

## Testing Strategy

Automated checks will be adapted or added before implementation to verify:

- `/zid` is represented by a native App Router page;
- the homepage ZID card points to `/zid` and is keyboard accessible;
- route metadata and sitemap contain `/zid`;
- ZID raster references remain WebP and referenced assets exist;
- below-the-fold images remain lazy and asynchronously decoded;
- the hero motion pause and verification progress optimizations remain present;
- homepage-only scripts are not mounted by the ZID route;
- the ZID controller provides cleanup for route transitions;
- existing responsive requirements continue to hold.

Final verification will include:

- the full relevant test suite;
- lint;
- a production build using the repository's supported build path;
- desktop, tablet, and mobile visual comparisons for `/zid`;
- desktop and mobile regression checks for `/`;
- keyboard navigation, theme switching, responsive navigation, verification cycling, and reduced-motion checks;
- browser console inspection on both routes and during client navigation between them.

## Out of Scope

This migration will not:

- redesign ZID sections or change marketing copy;
- replace approved ZID artwork;
- add new download destinations or external integrations;
- delete or stage the preserved untracked PNG source files;
- push commits or deploy the site without a separate user request.

## Success Criteria

The migration is complete when:

1. `/zid` renders as a native Next.js page and matches the approved standalone page across supported viewport sizes.
2. The entire homepage ZID card navigates to `/zid` with mouse, touch, and keyboard input.
3. ZID retains the optimized WebP image delivery and offscreen-motion behavior.
4. Homepage-only animation dependencies do not load or initialize on `/zid`.
5. Client-side navigation does not duplicate listeners, observers, timers, or animations.
6. The old `public/zid.html` is removed after parity is verified.
7. Tests, lint, and the production build pass, and both routes are free of browser console errors.
