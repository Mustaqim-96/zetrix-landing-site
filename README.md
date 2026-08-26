# Zetrix — Landing Site

Marketing landing site for **Zetrix**, a public blockchain for public sectors, enterprises,
and financial institutions. One long scrollytelling page — hero globe, ecosystem primitives,
a blockchain→AI→robotics narrative with a scroll-driven grid morph, an agentic-twin and NurAI
section, a layers deck, and a CTA/footer — with heavy custom animation and a responsive layout.

**Handover status:** the design and front-end behaviour are complete and live in production.
The engineering scaffolding around them is thin. Read [Known gaps](#known-gaps) before planning
work — the primary CTAs are placeholders and there are no tests.

---

## Start here

If you have just been handed this repo, do these four things in order. Budget ~30 minutes.

1. **Run it.** [Quick start](#quick-start) below — `cd nextjs && npm install && npm run dev`.
   Confirm the site loads at <http://localhost:3000> before reading anything else.
2. **Read [Where the site actually lives](#where-the-site-actually-lives).** This is the one
   surprising thing about the project. Short version: the sections are real JSX, but the
   *styling and all the motion* live in hand-authored CSS and vanilla-JS modules that run
   after hydration — not in React.
3. **Make a throwaway edit** to prove the loop works. Open `nextjs/src/app/page.tsx`, search
   for `Your Agentic Twin`, change the text, save, and watch it hot-reload. Then undo it.
4. **Skim [Known gaps](#known-gaps)** — that is your backlog, roughly in priority order.

### Contents

- [Quick start](#quick-start) — commands and environment
- [Where the site actually lives](#where-the-site-actually-lives) — **read this one**
- [Project structure](#project-structure) — what each file does
- [How the site is built](#how-the-site-is-built) — tokens, images, breakpoints, the grid morph, JS
- [Known gaps](#known-gaps) — what still needs doing
- [Troubleshooting](#troubleshooting) — non-obvious things that will bite you
- [Deployment](#deployment) — Vercel config that is **not** in the repo

---

## Quick start

The app lives in the [`nextjs/`](nextjs/) subfolder. Requires **Node.js 20.9+**
(pinned to 22 via `nextjs/package.json` `engines` and `nextjs/.nvmrc`).

```bash
cd nextjs
npm install
```

```bash
npm run dev
```

Open <http://localhost:3000>.

| Command         | What it does                                       |
| --------------- | -------------------------------------------------- |
| `npm run dev`   | Dev server on port 3000 with hot reload (Turbopack). |
| `npm run build` | Production build. Must pass before merging.        |
| `npm start`     | Serve the production build (run `build` first).    |
| `npm run lint`  | ESLint (`eslint-config-next`).                     |

No environment variables are required to run or build.

---

## Where the site actually lives

> ### ⚠️ Markup is in `page.tsx`; **styling and motion are not in React.**

This is a Next.js App Router app, but it is **not** a conventional component-based one. The
design was hand-authored (originally as a standalone HTML page) and preserved verbatim, so the
work is split across three places:

```
nextjs/src/app/page.tsx      ── the markup, 1:1 JSX. Classes/ids/data-attrs are
                                 load-bearing: every animation script selects by them.
nextjs/public/css/styles.css ── the ENTIRE design system (~4,500 lines). All visuals.
nextjs/public/js/*.js         ── ~18 vanilla-JS modules: the three.js globe, scroll
                                 choreography, the grid morph, carousels, nav, theme.
```

`src/components/SiteScripts.tsx` loads the vendored libraries and those JS modules
**sequentially, in a fixed order** after hydration (reproducing the original `defer`
behaviour). `three.js` must define the global `THREE` before the globe code runs, so order
matters — don't reshuffle the list casually.

### Consequences you need to know about

- **To change visuals, edit `public/css/styles.css`. To change animation behaviour, edit the
  files in `public/js/`.** Editing `page.tsx` only changes markup/copy.
- **`public/js/` and `public/vendor/` are vendored code** — treat them as such (they're
  excluded from ESLint in `eslint.config.mjs`). They are plain IIFEs that initialise
  immediately against the already-mounted DOM.
- **Page metadata is in `app/layout.tsx`, not the markup** — title and description live in the
  `metadata` export. `layout.tsx` also injects a tiny intro fail-safe script and links
  `/css/styles.css`, and sets `suppressHydrationWarning` on `<html>` because the theme/intro
  scripts mutate `<html>` outside React.
- **Plain `<img>` is used deliberately, not `next/image`.** The CSS and scripts select images
  by class and mutate them directly; `next/image`'s wrapper DOM + generated `srcset` would
  break that targeting. ESLint emits `no-img-element` **warnings** (not errors) — expected.
- **Scripts run once, after hydration.** A `started` module-level guard in `SiteScripts.tsx`
  means React strict-mode's double-invoke can't double-bind listeners.

### If you want to refactor into components

Reasonable, and viable — the markup has clean `<section>` boundaries with stable class names,
and each JS module maps to roughly one section. Do it section by section, moving the CSS and
behaviour for a section into a component together, and only then removing its entry from the
`SiteScripts` load order.

---

## Project structure

```
.
├── nextjs/                     # ◄── THE APP. Everything runs from here.
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx       # Root layout. Metadata, intro script, links styles.css.
│   │   │   ├── page.tsx         # ◄── THE MARKUP (all sections, as JSX).
│   │   │   └── globals.css      # Intentionally minimal (no Tailwind preflight).
│   │   └── components/
│   │       └── SiteScripts.tsx  # Ordered, sequential loader for the vendored + animation JS.
│   ├── public/
│   │   ├── css/styles.css       # ◄── THE DESIGN SYSTEM (all visuals).
│   │   ├── js/*.js              # ◄── THE MOTION (~18 vanilla-JS modules).
│   │   ├── vendor/              # three.js + OrbitControls (vendored, not npm).
│   │   └── assets/              # WebP imagery, SVG icons, self-hosted fonts.
│   ├── next.config.ts
│   ├── package.json             # engines.node = 22
│   └── .nvmrc                   # 22
├── design-source/              # Figma exports / source artwork (git-ignored, local only)
├── docs/                       # (git-ignored, local only)
└── README.md
```

> The repo previously carried a second, duplicated copy of the whole site as a static
> `index.html` at the root. It was removed (2026-08-26) so there is a single source of truth —
> if you find references to a root `index.html` or "the original HTML site" in older comments
> (e.g. `next.config.ts`), they are stale.

---

## How the site is built

### Design tokens

All colour, radius, and layout values are CSS custom properties on `:root` at the top of
`public/css/styles.css`. Use them; don't hardcode.

| Group  | Tokens                                                                     |
| ------ | -------------------------------------------------------------------------- |
| Brand  | `--red` `--red-hover`                                                      |
| Surface| `--bg` `--nav-bg` `--white` `--black`                                      |
| Text   | `--grey` `--text-tertiary` `--border-primary` `--line` `--hairline`        |
| Radius | `--radius-sm` `--radius-lg` `--radius-xl` `--radius-2xl` `--radius-pill`   |
| Layout | `--page-w` (1440) `--content-w` (1200) `--gutter` (120px)                 |

Type: **Metropolis** for headings (`--font-head`), **Titillium Web** for body
(`--font-body`). Both are self-hosted via `@font-face` from `public/assets/fonts/` — no Google
Fonts, no `next/font`. Light/dark is driven by `data-theme` on `<html>` (theme-toggle.js,
persisted to `localStorage`).

### Images

Photographic / 3D art is **WebP**; icons and logos are **SVG**. When you add a raster image,
convert it to WebP first (a raw PNG works but is typically several times larger than needed).

### Breakpoints

The CSS is desktop-first. The responsive tiers used across the site:

| Query                                      | Purpose                                                                 |
| ------------------------------------------ | ----------------------------------------------------------------------- |
| `min-width: 1280px`                        | Desktop. Pinned scrolly decks (tools, agentic, layers) and two-column layouts. |
| `min-width: 1024px and max-width: 1279px`  | Landscape tablet. Contained/centred layouts; carousels.                 |
| `min-width: 768px and max-width: 1023px`   | Portrait tablet. Single-column, centred.                                |
| `max-width: 767px`                         | Mobile. 32px side gutters, stacked layouts, drag carousels.             |

Section content sits **32px from the screen edges** on both tablet and mobile (uniform gutter).

### The grid-ribbon morph (`public/js/grid-ribbon.js`)

The signature effect. A fixed, full-viewport `<canvas class="grid-ribbon">` behind the content
paints a faint dot-grid with a red wave, and — driven by scroll position — **morphs into a
different pixel-art shape per section**: stacked cubes (Tools), an agentic-twin robot (Agentic
Twin), and the NurAI logo (NurAI). It renders on scroll (no continuous rAF loop). Opacity is
set from JS (ceiling `maxOpacity`), and is **halved on phones** (`MOBILE_DIM`) so section
titles stay readable over it. Palette (red/teal brightness, alphas) is at the top of the file.

### Interactive behaviour

Loaded in this order by `SiteScripts.tsx` (three.js/OrbitControls first):

| Module                        | What it does                                                        |
| ----------------------------- | ------------------------------------------------------------------- |
| `globe-data/-explosion/-network/globe.js` | three.js hero globe (`#hero-globe`).                    |
| `site-intro.js`               | Intro overlay sequence (with a 4.2s fail-safe from `layout.tsx`).   |
| `site-reveal.js`              | Staged section reveals / copy dissolve-in.                          |
| `robotics-carousel.js`        | Robotics card carousel (grid on tablet, drag rail on mobile).       |
| `hero-ecosystem-handoff.js`   | Transition between hero and ecosystem.                              |
| `tools-motion.js`             | Tools-section scroll choreography.                                  |
| `grid-ribbon.js`              | The dot-grid morph (see above).                                     |
| `cards.js`                    | Ecosystem scroll-driven card deck (desktop).                        |
| `eco-carousel.js`             | Ecosystem swipe carousel (≤1279px).                                 |
| `layers-carousel.js`          | "Ecosystem layers" deck carousel.                                   |
| `theme-toggle.js`             | Light/dark toggle → `data-theme`, persisted.                        |
| `nav-dropdown.js`             | Expanding nav + per-section accordions.                             |
| `footer-spotlight.js`         | Footer wordmark spotlight.                                          |

A few files in `public/js/` (e.g. `ai-layer-motion.js`, `hero-video.js`,
`ribbon-flow-motion.js`) are **not** in the load list — legacy/unused; leave or prune with care.

---

## Known gaps

None of these are bugs in the design — they are what a production launch still needs.

1. **Primary CTAs are placeholders.** `Get Started`, `BUIDL Now`, `Contact the team`, and most
   footer links point to `href="#"`. Wire them to real destinations. (No forms exist, so
   there's no backend wiring on this page.)
2. **Thin SEO / metadata.** Only `title` + `description` in `layout.tsx`. No Open Graph image,
   no `robots.txt`, no `sitemap.xml`, no canonical URL. Add these before launch if the page
   needs to rank/share well.
3. **No tests and no CI.** Nothing prevents a regression. A smoke test that boots the page and
   asserts no unexpected console errors would catch most breakage in a site of this shape.
4. **React DOM-mutation console errors.** The animation scripts mutate the server-rendered DOM
   directly, which can produce `insertBefore`/`removeChild` `NotFoundError` messages in the
   console. They are pre-existing and non-fatal (the scripts intentionally run against the
   mounted DOM), but they're noise — a component refactor is the real fix.
5. **No `next/image`.** Deliberate (see [Where the site actually lives](#where-the-site-actually-lives)),
   so image optimisation is bypassed. Only resolves with a component refactor.
6. **Tailwind is installed but its base reset is not applied** (it would fight the hand-authored
   CSS). To use Tailwind on *new* components, scope the import so it doesn't leak into the
   landing-page markup.

---

## Troubleshooting

Non-obvious things that cost time in this repo specifically.

**The page renders blank, with `__webpack_modules__` / `Cannot find module './xxx.js'` in the
terminal.** You ran `npm run build` while `npm run dev` was still running — both write to
`.next/`. Fix: `rm -rf nextjs/.next`, then restart the dev server. Never run `build` and `dev`
at the same time.

**Your styling/animation change doesn't appear.** Check *where* you edited. Copy/markup →
`src/app/page.tsx`. Visuals → `public/css/styles.css`. Motion → `public/js/*.js`. Editing
`page.tsx` won't change how anything looks or moves.

**A carousel's next/prev button doesn't scroll (but swipe works).** The carousel tracks use
`scroll-behavior: smooth` + `scroll-snap-type: x mandatory`, and a *smooth* programmatic scroll
never lands in that combination — the snap container resets it. The carousels work around this
by temporarily forcing `scroll-behavior: auto` before setting `scrollLeft`. If you add a new
carousel, do the same (don't use `scrollIntoView({behavior:'smooth'})`).

**Programmatic scrolling animates instead of jumping.** `scroll-behavior: smooth` is global, so
assigning `scrollTop`/`scrollLeft` animates. Set
`document.documentElement.style.scrollBehavior = 'auto'` first (mostly bites tests/console debugging).

**Prod looks stale, wrong, or 404s after a deploy.** This is almost always Vercel project
config, not the code — see [Deployment](#deployment). The two settings that must be right are
**Root Directory = `nextjs`** and **Framework Preset = Next.js**.

---

## Deployment

Hosted on **Vercel**. Pushes to **`main`** deploy to production; **`dev`** is the working
branch (commit to `dev`, review, then merge to `main`).

**Critical: two Vercel project settings are not represented in the repo** (there is no
`vercel.json`). If production ever serves the wrong thing, check these first:

| Setting              | Value       | Why                                                                    |
| -------------------- | ----------- | ---------------------------------------------------------------------- |
| **Root Directory**   | `nextjs`    | The app is in a subfolder. If left at repo root, Vercel builds nothing meaningful. |
| **Framework Preset** | Next.js     | Otherwise Vercel serves `public/` as static files and `/` returns 404. |
| **Node.js Version**  | 22.x        | Next.js 16 needs Node 20.9+. Also pinned via `engines` / `.nvmrc`.     |

`npm run build` prerenders `/` to static content — no server-side data fetching — so it also
runs anywhere Next.js runs (`npm start`, a container).

Production: <https://zetrix-landing-site.vercel.app>

---

## Tech stack

- [Next.js](https://nextjs.org/) 16 (App Router, Turbopack), React 19, TypeScript.
- No CSS framework applied and no component library — hand-authored CSS with custom properties,
  and vanilla JS. three.js is vendored (not installed via npm) for the hero globe.

## License

Proprietary — © Zetrix AI Berhad. All rights reserved.
