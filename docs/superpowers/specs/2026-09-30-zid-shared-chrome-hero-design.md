# ZID Shared Navigation, Footer, and Hero Design

## Goal

Make the ZID route use the same navigation bar and footer as the homepage, and center the ZID hero phone screenshot beneath its call to action.

## Scope

- Replace the duplicated navigation markup on `/zid` with the exact navigation used by `/`.
- Replace the duplicated footer markup on `/zid` with the exact footer used by `/`.
- Keep both pages on one shared implementation so later homepage changes cannot leave ZID behind.
- Preserve the ZID page's own hero, content sections, interactions, assets, and route metadata.
- Center the hero phone screenshot horizontally and remove its decorative rotation.
- Preserve responsive sizing and the existing WebP asset.

## Architecture

Create two server components:

- `SiteHeader` owns the complete homepage navigation markup, menu content, theme toggle, and responsive controls.
- `SiteFooter` owns the complete homepage footer navigation, social links, wordmark artwork, legal links, and spotlight hooks.

The homepage and ZID page both render these components. Their existing client runtimes continue to load the shared navigation, theme, and footer scripts. The homepage continues to load the rest of its animation runtime; ZID continues to load only its scoped runtime and the three shared scripts it needs.

The home link may retain a route-appropriate navigation mode: the homepage may use Next.js navigation, while ZID may request a full document navigation to avoid carrying one-shot legacy runtime state across routes. This behavioral detail must not change the rendered structure or styling.

## Visual Behavior

### Navigation

The ZID navigation must match the homepage in:

- desktop and compact layout;
- menu labels, item counts, cards, descriptions, and destinations;
- logo treatment;
- primary call to action;
- light/dark theme control;
- dropdown and mobile accordion behavior.

ZID-specific navigation CSS must not override the shared homepage navigation.

### Footer

The ZID footer must match the homepage in:

- column structure and link labels;
- social controls;
- oversized Zetrix wordmark artwork;
- copyright and legal row;
- responsive layout and safe-area spacing;
- footer spotlight interaction.

ZID-specific footer CSS must not override the shared homepage footer.

### Hero Screenshot

The phone screenshot remains below the ZID hero CTA and becomes visually centered on the hero axis. It is upright rather than rotated. Desktop, tablet, and mobile retain intentional responsive widths without horizontal overflow. The existing `hero-myid.webp` file remains unchanged.

## Accessibility and Performance

- Preserve the existing primary and footer navigation labels.
- Preserve keyboard focus behavior and mobile menu controls.
- Keep decorative hero imagery hidden from assistive technology.
- Do not add new image formats, dependencies, or homepage-only scripts to ZID.
- Continue lazy loading below-the-fold footer imagery where already applicable.

## Verification

- Add regression coverage proving both routes render the shared header and footer components.
- Confirm the old duplicated ZID navigation and footer markup is removed.
- Confirm the hero screenshot is centered and has no rotation at desktop and mobile breakpoints.
- Verify navbar dropdowns, mobile navigation, theme toggle, and footer spotlight on both routes.
- Run the complete tests, lint, production build, and `git diff --check`.
- Perform one bounded visual comparison at desktop and mobile sizes for both `/` and `/zid`.

## Out of Scope

- Redesigning the homepage navigation or footer.
- Changing ZID copy, imagery, section order, or animations outside the hero screenshot alignment.
- Merging or pushing `dev` to another branch.
