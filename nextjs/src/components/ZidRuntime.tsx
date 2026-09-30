"use client";

import { useEffect } from "react";

type Cleanup = () => void;

type ZetrixWindow = Window & {
  __zetrixThemeToggleCleanup?: Cleanup;
  __zetrixNavDropdownCleanup?: Cleanup;
  __zetrixFooterSpotlightCleanup?: Cleanup;
};

const SHARED_SCRIPTS = [
  "/js/theme-toggle.js",
  "/js/nav-dropdown.js",
  "/js/footer-spotlight.js",
] as const;

function initializeZidController(doc: Document, win: Window): Cleanup {
  const root = doc.querySelector<HTMLElement>(".zid-page");
  if (!root) return () => undefined;

  const reduced = win.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const heroSection = root.querySelector<HTMLElement>(".hero");
  const verifySection = root.querySelector<HTMLElement>(".verify");
  const verifyPanel = root.querySelector<HTMLElement>(".verify-panel");
  const verifyDemo = root.querySelector<HTMLElement>(".verify-demo");
  const verifySteps = Array.from(root.querySelectorAll<HTMLButtonElement>("[data-verify-step]"));
  const verifyMedia = Array.from(root.querySelectorAll<HTMLElement>("[data-verify-media]"));
  const downloadHandoff = root.querySelector<HTMLElement>(".download-about-handoff");
  const downloadSection = root.querySelector<HTMLElement>(".download");
  const aboutSection = root.querySelector<HTMLElement>(".about");
  const compactHandoff = win.matchMedia("(max-width: 767px)");
  const VERIFY_DELAY = 4500;

  let verifyIndex = 0;
  let verifyTimer = 0;
  let verifyVisible = false;
  let verifyFocused = false;
  let downloadHandoffFrame = 0;
  let heroVisible = true;
  let verifyObserver: IntersectionObserver | null = null;
  let heroObserver: IntersectionObserver | null = null;
  let revealObserver: IntersectionObserver | null = null;

  function syncHeroMotion() {
    heroSection?.classList.toggle("is-motion-paused", doc.hidden || !heroVisible);
  }

  function verifyIsPaused() {
    return !verifyVisible || verifyFocused || doc.hidden;
  }

  function scheduleVerifyCycle() {
    win.clearTimeout(verifyTimer);
    const paused = verifyIsPaused();
    verifyPanel?.classList.toggle("is-paused", paused);
    if (reduced || paused || !verifySteps.length) return;
    verifyTimer = win.setTimeout(() => setVerifyStep(verifyIndex + 1), VERIFY_DELAY);
  }

  function setVerifyStep(index: number, restartTimer = true) {
    if (!verifySteps.length || !verifyDemo || !verifyPanel) return;
    verifyIndex = (index + verifySteps.length) % verifySteps.length;
    verifyDemo.dataset.verifyActive = String(verifyIndex);

    verifySteps.forEach((item, itemIndex) => {
      const active = itemIndex === verifyIndex;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-pressed", String(active));
    });
    verifyMedia.forEach((media, mediaIndex) => {
      const active = mediaIndex === verifyIndex;
      media.classList.toggle("is-active", active);
      media.setAttribute("aria-hidden", String(!active));
    });

    void verifyPanel.offsetWidth;
    if (restartTimer) scheduleVerifyCycle();
  }

  function handleVisibilityChange() {
    scheduleVerifyCycle();
    syncHeroMotion();
  }

  const verifyStepCleanups = verifySteps.map((button) => {
    const handleClick = () => setVerifyStep(Number(button.dataset.verifyStep));
    button.addEventListener("click", handleClick);
    return () => button.removeEventListener("click", handleClick);
  });

  function handleVerifyFocusIn(event: FocusEvent) {
    verifyFocused = event.target instanceof Element && event.target.matches(":focus-visible");
    scheduleVerifyCycle();
  }

  function handleVerifyFocusOut(event: FocusEvent) {
    if (!verifyPanel?.contains(event.relatedTarget as Node | null)) {
      verifyFocused = false;
      scheduleVerifyCycle();
    }
  }

  verifyPanel?.addEventListener("focusin", handleVerifyFocusIn);
  verifyPanel?.addEventListener("focusout", handleVerifyFocusOut);
  doc.addEventListener("visibilitychange", handleVisibilityChange);

  if ("IntersectionObserver" in win && verifySection) {
    verifyObserver = new IntersectionObserver(
      (entries) => {
        verifyVisible = entries[0]?.isIntersecting ?? false;
        scheduleVerifyCycle();
      },
      { threshold: 0.35 },
    );
    verifyObserver.observe(verifySection);
  } else {
    verifyVisible = true;
    scheduleVerifyCycle();
  }

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
    win.clearTimeout(verifyTimer);
    verifyObserver?.disconnect();
    heroObserver?.disconnect();
    revealObserver?.disconnect();
    downloadResizeObserver?.disconnect();
    if (downloadHandoffFrame) win.cancelAnimationFrame(downloadHandoffFrame);
    doc.removeEventListener("visibilitychange", handleVisibilityChange);
    win.removeEventListener("resize", syncDownloadHandoff);
    win.removeEventListener("scroll", requestDownloadHandoffUpdate);
    compactHandoff.removeEventListener("change", syncDownloadHandoff);
    verifyStepCleanups.forEach((cleanup) => cleanup());
    verifyPanel?.removeEventListener("focusin", handleVerifyFocusIn);
    verifyPanel?.removeEventListener("focusout", handleVerifyFocusOut);
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
