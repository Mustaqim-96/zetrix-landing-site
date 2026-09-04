# Zetrix Landing Site — app

This folder holds the Next.js app, but the **real documentation lives one level up**:

➡️ **[../README.md](../README.md)** — start there.

It explains the one thing you must understand before touching this code: the markup
is React JSX, but **all styling and motion live outside React** in a hand-authored
`public/css/styles.css` and the vanilla-JS modules in `public/js/` — not in
components, and **not** using `next/font` (fonts are self-hosted Metropolis /
Titillium Web via `@font-face`).

Quick start (details and caveats in the root README):

```bash
npm install
npm run dev   # http://localhost:3000
```
