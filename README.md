# Zetrix Landing Site

Marketing landing page for Zetrix, built with **Next.js** (App Router).

## Structure

The app lives in [`nextjs/`](nextjs/). The scroll-driven animations — the WebGL
globe, the grid-ribbon dot-grid morph, section reveals, and the ecosystem /
robotics carousels — are vanilla-JS modules in `nextjs/public/js/`, loaded after
hydration. Styles are in `nextjs/public/css/styles.css`.

```
nextjs/
├── src/app/          # Next.js App Router pages
├── public/js/        # vanilla-JS animation modules
├── public/css/       # styles.css
├── public/assets/    # images, fonts, video
└── public/vendor/    # third-party libs (three.js, etc.)
```

## Develop

```bash
cd nextjs
npm install
npm run dev        # http://localhost:3000
```

Requires **Node 20.9+** (pinned to 22 via `nextjs/package.json` `engines` and
`nextjs/.nvmrc`).

## Build

```bash
cd nextjs
npm run build
```

## Deploy (Vercel)

The Vercel project is configured with **Root Directory = `nextjs`** and
**Framework Preset = Next.js**. Pushes to **`main`** deploy to production;
**`dev`** is the working branch.

Production: https://zetrix-landing-site.vercel.app
