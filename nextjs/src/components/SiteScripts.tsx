"use client";

import { useEffect } from "react";

/**
 * Loads the site's vendored libraries and animation scripts in the exact order
 * the original index.html declared them. Order matters: three.js must define the
 * global THREE before OrbitControls/globe code runs, and globe-data/explosion/
 * network must exist before globe.js consumes them.
 *
 * We load sequentially (script.async = false + awaiting each onload) so the
 * ordering is deterministic — next/script does not guarantee cross-script order.
 * The scripts are plain IIFEs that initialise immediately against the already-
 * mounted DOM, so running them here (after hydration) reproduces the original
 * `defer` behaviour.
 */
const SCRIPTS: string[] = [
  "/vendor/three.min.js",
  "/vendor/OrbitControls.js",
  "/js/globe-data.js",
  "/js/globe-explosion.js",
  "/js/globe-network.js",
  "/js/globe.js",
  "/js/site-intro.js",
  "/js/site-reveal.js",
  "/js/robotics-carousel.js",
  "/js/hero-ecosystem-handoff.js",
  "/js/tools-motion.js",
  "/js/grid-ribbon.js",
  "/js/cards.js",
  "/js/eco-carousel.js",
  "/js/layers-carousel.js",
  "/js/theme-toggle.js",
  "/js/nav-dropdown.js",
  "/js/footer-spotlight.js",
];

// Module-level guard so the chain runs exactly once, even though React strict
// mode (dev) invokes the effect twice. Because it survives the double-invoke, we
// don't need — and must not use — an abort flag that would stop the chain early.
let started = false;

export default function SiteScripts() {
  useEffect(() => {
    if (started) return;
    started = true;

    const loadScript = (src: string) =>
      new Promise<void>((resolve) => {
        const script = document.createElement("script");
        script.src = src;
        script.async = false;
        script.dataset.zetrixSiteScript = "true";
        script.onload = () => resolve();
        script.onerror = () => {
          // Keep the chain going even if one script fails, matching how the
          // browser would continue past a failed <script> tag.
          console.error(`[Zetrix] Failed to load ${src}`);
          resolve();
        };
        document.body.appendChild(script);
      });

    (async () => {
      for (const src of SCRIPTS) {
        await loadScript(src);
      }
    })();
  }, []);

  return null;
}
