# ZID Performance Optimization Design

**Date:** 2026-09-30  
**Status:** Approved for implementation planning  
**Scope:** Optimize the existing standalone ZID page before migrating it to a native Next.js route.

## Objective

Reduce the ZID page's image transfer, decoded-image memory, and unnecessary animation work without changing its layout, visual identity, responsive behavior, or content. The optimized standalone page becomes the validated source for the later Next.js migration.

## Baseline

The current page is `nextjs/public/zid.html` with assets in `nextjs/public/assets/zid/`.

- The page references 21 PNG/JPEG raster assets and one WebP raster asset.
- Unique referenced raster payload: approximately 9.41 MiB.
- Six animated hero icons are 1,254 x 1,254 PNGs of roughly 1.1-1.2 MiB each, but render at approximately 64-142 CSS pixels.
- All 78 image elements load eagerly.
- No image element requests asynchronous decoding.
- The hero's continuous CSS animations continue after the hero leaves the viewport.
- The existing scroll handler is passive and requestAnimationFrame-throttled; it does not require replacement.
- A representative WebP conversion reduced the unique referenced raster payload to approximately 0.66 MiB, about 93% smaller.

## Image Strategy

Every raster image referenced by the ZID page will use WebP. Existing SVG artwork will remain SVG because it is resolution-independent and converting it to a raster format would reduce quality.

### Hero artwork

- Resize the six 1,254 x 1,254 orbit icons to 384 x 384 before WebP encoding. This retains more than two device pixels per maximum rendered CSS pixel while sharply reducing download and decode cost.
- Encode the orbit icons at a visually high-quality lossy WebP setting.
- Encode `hero-myid` as high-quality WebP while retaining its current dimensions unless visual comparison demonstrates that a smaller source remains indistinguishable at the largest rendered size.
- Keep hero artwork eager, but request asynchronous decoding. The primary phone artwork may receive an explicit high fetch priority only if browser measurement shows that it is the page's largest contentful element.

### Phone screenshots

- Convert digitisation and verification screenshots to high-quality WebP without reducing their current 750 x 1,624 dimensions.
- Preserve text and QR-like interface detail through visual comparison at rendered size and at 2x zoom.
- Load all below-the-fold screenshots lazily and decode them asynchronously.

### QR codes and small app logos

- Convert QR artwork and small app logos to lossless WebP.
- Retain the QR code's source dimensions to preserve scan reliability.
- Confirm that the converted QR code remains visually crisp at its rendered size.

### Partner logos

- Resize the oversized 2,172 x 724 partner images to 652 x 217 before high-quality WebP encoding.
- Resize the 2,000 x 846 MYEG image to 600 x 254 before encoding.
- Preserve transparent backgrounds.
- Load partner images lazily and decode them asynchronously.

### Source files

The original untracked PNG files will not be deleted as part of this optimization. The HTML will reference only the optimized WebP variants. Later Git staging must include only required production assets and must not accidentally add unused source artwork.

## Loading and Rendering Strategy

- Add `loading="lazy"` to images below the first viewport.
- Add `decoding="async"` to raster images and other non-critical images.
- Keep the hero visuals eager so the initial composition does not visibly pop in.
- Add intrinsic `width` and `height` attributes where they can reserve the correct aspect ratio without overriding responsive CSS.
- Do not introduce Next.js `<Image>` during this stage; that belongs to the subsequent framework migration and would mix two independent changes.

## Motion Strategy

- Use an `IntersectionObserver` to pause the hero orbit animations when the hero is outside the viewport.
- Pause those animations while the document is hidden and resume them when visible.
- Remove persistent compositor hints from paused artwork where practical, while preserving the current animation when active.
- Change the verification progress indicator from animating `width` to animating `transform: scaleX()` so the browser can composite it without repeated layout.
- Retain the existing reduced-motion behavior.
- Retain the requestAnimationFrame-throttled, passive mobile handoff scroll logic because it already follows the appropriate pattern.

## Behavioral Boundaries

This phase will not:

- convert ZID markup to JSX;
- create the `/zid` Next.js route;
- link the homepage card;
- redesign sections or change copy;
- remove original untracked source images;
- alter external download or footer URLs.

Those tasks belong to the later Next.js migration.

## Testing

Automated checks will be added before production edits and must initially fail for the missing optimization behavior. They will verify that:

- ZID markup contains no PNG or JPEG references;
- every referenced local raster asset exists as WebP;
- below-the-fold raster images use lazy loading and asynchronous decoding;
- hero raster images request asynchronous decoding without lazy loading;
- the hero animation pause hook and visibility handling are present;
- the verification progress animation uses transforms instead of width;
- existing responsive ZID tests continue to pass.

After implementation:

- run the ZID test suite;
- run lint and a production build;
- compare desktop and mobile screenshots against the current page;
- inspect browser console errors;
- confirm that the unique referenced raster payload is below 1 MiB;
- confirm that the page remains usable with reduced motion enabled.

## Success Criteria

The optimization is complete when:

1. All referenced raster assets are WebP and all vector assets remain SVG.
2. The unique referenced raster payload is below 1 MiB.
3. No below-the-fold raster asset is loaded eagerly.
4. Offscreen hero animations do not continue consuming rendering work.
5. Desktop and mobile layout, content, theme behavior, and interactions remain visually equivalent.
6. Tests, lint, and the production build pass.

