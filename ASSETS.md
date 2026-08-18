# Placeholder assets → replace with originals

All images in `assets/img/` are **placeholders cropped from the Figma render**. Layout and sizing are final — dropping a same-named original into `assets/img/` swaps it in with no code changes. Ideally provide transparent PNG / SVG at 2× the display size.

| File | Section | What it is | Notes for original |
|------|---------|-----------|--------------------|
| `logo-zetrix.svg` | Nav | ZETRIX pill-nav logo | **Now a vectorized SVG** (traced from render). Replace with the official brand SVG if you have it. |
| _(hero globe)_ | Hero | **Now a live Three.js globe** (`js/globe.js`) — dotted continents + city lights + red atmosphere, auto-rotating. Modelled on ds.zetrix.com, tinted red. Uses `assets/globe/earth-topology.png` (land mask) + `assets/globe/earth-night.jpg` (city lights) + `vendor/three.module.min.js`. Not an image to swap. |
| `z-coin.png` | One ecosystem | 3D red Z coin | Transparent PNG; sits bottom-left, clipped by card |
| `tools-cubes.png` | Tools | Red ribbon + 3D cubes (right) | See **Ribbon** note below |
| `ai-nurai.png` | AI layer | NurAI blue product banner | Transparent/ής not needed (rounded by card) |
| `ai-avatar.png` | AI layer | Avatar cream banner | — |
| `robot-pm01/leju/gausium.png` | Robotics | 3 robot cards **with captions baked in** | Provide robot images **without** the caption box; I'll rebuild the number/title/desc/arrow as HTML |
| `blockchain-card.png` | Layers/carousel | Robot + floating icons | Clean (no text baked) |
| `cta-robot.png` | #BUIDLREAL | Robot assembling cubes (right) | Transparent PNG preferred so the left fade isn't needed |
| `wordmark-zetrix.png` | Footer | Giant ZETRIX wordmark | Transparent PNG or SVG |
| `socials.png` | Footer | (unused — socials are inline SVG) | — |

## Known gaps to finalize with your assets
1. **Continuous red ribbon (Sections 3→4→5).** In the design one curved red ribbon flows behind the tools cubes, past the AI cards, down through robotics. Because it overlaps content it can't be cleanly cropped from the render — only the Section 3 piece is placed. Please provide the **full ribbon as one transparent PNG/SVG** and I'll position it as a background layer spanning those sections.
2. **Robot card captions** are currently baked into the images (placeholder). With transparent robot renders I'll rebuild the caption glass box + text as real HTML.
3. **Responsiveness:** built to the 1440 desktop design. Mobile/tablet breakpoints are a later pass.
