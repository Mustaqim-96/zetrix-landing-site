"use client";

import { useEffect } from "react";

type Cleanup = () => void;

type ZetrixWindow = Window & {
  __zetrixThemeToggleCleanup?: Cleanup;
  __zetrixNavDropdownCleanup?: Cleanup;
  __zetrixFooterSpotlightCleanup?: Cleanup;
};

const SHARED_SCRIPTS = [
  "/js/site-reveal.js",
  "/js/theme-toggle.js",
  "/js/nav-dropdown.js",
  "/js/footer-spotlight.js",
] as const;

function initializeZidController(doc: Document, win: Window): Cleanup {
  const root = doc.querySelector<HTMLElement>(".zid-page");
  if (!root) return () => undefined;

  const reduced = win.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const heroSection = root.querySelector<HTMLElement>(".hero");

  let heroVisible = true;
  let heroObserver: IntersectionObserver | null = null;
  let revealObserver: IntersectionObserver | null = null;

  function syncHeroMotion() {
    heroSection?.classList.toggle("is-motion-paused", doc.hidden || !heroVisible);
  }

  function handleVisibilityChange() {
    syncHeroMotion();
  }

  doc.addEventListener("visibilitychange", handleVisibilityChange);

  if ("IntersectionObserver" in win && heroSection) {
    heroObserver = new IntersectionObserver(
      (entries) => {
        heroVisible = entries[0]?.isIntersecting ?? false;
        syncHeroMotion();
      },
      { threshold: 0.01 },
    );
    heroObserver.observe(heroSection);
  }
  syncHeroMotion();

  const revealItems = Array.from(root.querySelectorAll<HTMLElement>(".reveal"));
  if (reduced || !("IntersectionObserver" in win)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  } else {
    revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          revealObserver?.unobserve(entry.target);
        });
      },
      { threshold: 0.12 },
    );
    revealItems.forEach((item) => revealObserver?.observe(item));
  }

  return () => {
    heroObserver?.disconnect();
    revealObserver?.disconnect();
    doc.removeEventListener("visibilitychange", handleVisibilityChange);
    heroSection?.classList.remove("is-motion-paused");
  };
}

export default function ZidRuntime() {
  useEffect(() => {
    const win = window as ZetrixWindow;
    const scripts = SHARED_SCRIPTS.map((src) => {
      const script = document.createElement("script");
      script.src = src;
      script.async = false;
      script.dataset.zetrixZidScript = "true";
      document.body.appendChild(script);
      return script;
    });
    const cleanupZidController = initializeZidController(document, window);

    return () => {
      cleanupZidController();
      win.__zetrixThemeToggleCleanup?.();
      win.__zetrixNavDropdownCleanup?.();
      win.__zetrixFooterSpotlightCleanup?.();
      win.__zetrixThemeToggleCleanup = undefined;
      win.__zetrixNavDropdownCleanup = undefined;
      win.__zetrixFooterSpotlightCleanup = undefined;
      scripts.forEach((script) => script.remove());
    };
  }, []);

  return null;
}
