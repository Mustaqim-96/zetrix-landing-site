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
  const downloadHandoff = root.querySelector<HTMLElement>(".download-about-handoff");
  const downloadSection = root.querySelector<HTMLElement>(".download");
  const aboutSection = root.querySelector<HTMLElement>(".about");
  const compactHandoff = win.matchMedia("(max-width: 767px)");

  let downloadHandoffFrame = 0;
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

  function updateDownloadHandoff() {
    downloadHandoffFrame = 0;
    if (!downloadHandoff || !downloadSection || !aboutSection || !compactHandoff.matches || reduced) {
      if (downloadSection) downloadSection.style.transform = "";
      return;
    }
    const runwayHeight = aboutSection.offsetHeight;
    const pinStart = downloadSection.offsetHeight - runwayHeight;
    const progress = Math.min(
      runwayHeight,
      Math.max(0, -downloadHandoff.getBoundingClientRect().top - pinStart),
    );
    downloadSection.style.transform = `translate3d(0, ${progress}px, 0)`;
  }

  function requestDownloadHandoffUpdate() {
    if (downloadHandoffFrame) win.cancelAnimationFrame(downloadHandoffFrame);
    downloadHandoffFrame = win.requestAnimationFrame(updateDownloadHandoff);
  }

  function syncDownloadHandoff() {
    if (!downloadHandoff || !downloadSection) return;
    if (compactHandoff.matches && !reduced) {
      downloadHandoff.style.setProperty("--download-height", `${downloadSection.offsetHeight}px`);
    } else {
      downloadHandoff.style.removeProperty("--download-height");
    }
    requestDownloadHandoffUpdate();
  }

  const downloadResizeObserver =
    "ResizeObserver" in win ? new ResizeObserver(syncDownloadHandoff) : null;
  if (downloadResizeObserver && downloadSection) downloadResizeObserver.observe(downloadSection);
  win.addEventListener("resize", syncDownloadHandoff, { passive: true });
  win.addEventListener("scroll", requestDownloadHandoffUpdate, { passive: true });
  compactHandoff.addEventListener("change", syncDownloadHandoff);
  syncDownloadHandoff();

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
    downloadResizeObserver?.disconnect();
    if (downloadHandoffFrame) win.cancelAnimationFrame(downloadHandoffFrame);
    doc.removeEventListener("visibilitychange", handleVisibilityChange);
    win.removeEventListener("resize", syncDownloadHandoff);
    win.removeEventListener("scroll", requestDownloadHandoffUpdate);
    compactHandoff.removeEventListener("change", syncDownloadHandoff);
    downloadHandoff?.style.removeProperty("--download-height");
    if (downloadSection) downloadSection.style.transform = "";
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
