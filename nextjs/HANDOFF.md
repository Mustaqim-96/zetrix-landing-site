# Handoff notes for the engineer

## What this is
A Next.js 16 (App Router, Turbopack) app generated from `../index.html` — the Zetrix
"From Trusted Infrastructure to Intelligent Machines" scrollytelling landing page.

Stack: TypeScript, Tailwind 4 (installed, see note below), App Router, `src/` layout.

## Important architectural decision — read this first
The original page is driven almost entirely by ~2,600 lines of hand-authored vanilla
JS (a three.js hero globe plus bespoke scroll choreography, carousels, nav dropdown,
theme toggle, footer spotlight). Rebuilding that in React would have broken the tightly
coupled DOM/CSS/scroll timing.

So this conversion **preserves the original animation system verbatim**:
- All CSS lives in `public/css/styles.css` (the complete hand-authored design system).
- All vendored libs + animation scripts live in `public/vendor/` and `public/js/`.
- `src/app/page.tsx` is the markup, converted 1:1 to JSX (classes/ids/data-attributes
  preserved exactly so every script hook still matches).
- `src/components/SiteScripts.tsx` loads the scripts **sequentially, in the original
  order** after mount, reproducing the original `defer` behaviour.

This means: to change visuals, edit `public/css/styles.css`; to change animation
behaviour, edit the files in `public/js/`. Treat `public/js` + `public/vendor` as
vendored code (they are excluded from ESLint in `eslint.config.mjs`).

## Routes
- `/` → `src/app/page.tsx`

## Key files
- `src/app/layout.tsx` — root layout. Sets `<title>`/metadata, injects the intro
  fail-safe script (`beforeInteractive`), links `/css/styles.css`, and renders
  `<SiteScripts />`. Uses `suppressHydrationWarning` on `<html>` because the theme
  and intro scripts mutate the `<html>` element outside React.
- `src/components/SiteScripts.tsx` — ordered, sequential loader for all site scripts.
- `src/app/globals.css` — intentionally minimal (Tailwind preflight NOT imported, so
  it doesn't override the hand-authored CSS). See the note inside the file.

## Assets
Everything from the original was copied into `public/` (served at the same relative
paths, just root-absolute):
- `public/css/styles.css`
- `public/assets/**` (img, icons, fonts, footer, partners, ribbon, tools-art)
- `public/vendor/three.min.js`, `public/vendor/OrbitControls.js`
- `public/js/**` (17 animation scripts)

Fonts (Metropolis, Titillium Web) are loaded via `@font-face` inside `styles.css` from
`/assets/fonts/` — no Google Fonts, no `next/font`.

## Third-party libraries
- **three.js** + **OrbitControls** — vendored (not installed via npm), loaded first by
  `SiteScripts` so the global `THREE` exists before the globe code runs. This matches
  the original, which also vendored these files.

No other third-party runtime libraries. No GSAP/Lenis — the scroll motion is custom.

## What's wired vs what's stubbed
Wired (fully functional, same as original):
- three.js hero globe (`#hero-globe`)
- Dark/light theme toggle (writes `data-theme` on `<html>`, persists to localStorage)
- Expanding nav dropdown + per-section accordions
- Robotics carousel and ecosystem "layers" carousel
- Scroll choreography: intro sequence, section reveals, ribbon flow, floating cubes,
  tools motion, footer wordmark spotlight

Stubbed / left as-is (these were placeholders in the original design too):
- All primary CTAs (`Get Started`, `BUIDL Now`, `Contact the team`) and footer links
  point to `href="#"`. Wire them to real destinations.
- No forms exist on this page, so there is no backend wiring to do here.

## Notes / intentional choices (search these if something looks unusual)
- Plain `<img>` tags are used instead of `next/image`. This is deliberate: the CSS and
  animation scripts select images by class and mutate them directly, and `next/image`'s
  wrapper DOM + generated `srcset` would break that targeting and the pixel-tuned
  layout. ESLint emits `no-img-element` **warnings** (not errors) for these — expected.
- Tailwind is installed and configured but its base reset is not applied globally (would
  fight the existing design). To use Tailwind on NEW components, scope `@import
  "tailwindcss";` so it doesn't leak into the existing landing-page markup.
- `next.config.ts` pins `turbopack.root` to this folder because the original HTML site
  (with its own lockfile) sits in the parent directory.

## Visual diff check
Not run against a pixel baseline. Verified functionally in a live browser:
build + lint pass (0 errors), all 17 scripts load in order, the three.js globe mounts
and renders, the theme toggle switches light/dark, and no console errors. The scroll-
pinned sections use the original untouched scripts, so they behave as in the source.
Recommend a manual scroll-through at desktop + mobile widths before shipping.

## How to run
1. `cd nextjs`
2. `npm install`
3. `npm run dev`
4. Open http://localhost:3000
