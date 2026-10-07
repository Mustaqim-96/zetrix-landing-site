"use client";

import type { MouseEvent, ReactNode } from "react";

type HomeLogoLinkProps = {
  children: ReactNode;
};

export default function HomeLogoLink({ children }: HomeLogoLinkProps) {
  function skipIntroOnce(event: MouseEvent<HTMLAnchorElement>) {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) return;

    try {
      window.sessionStorage.setItem("zetrix-skip-intro", "1");
    } catch {
      // Storage can be unavailable; normal navigation still proceeds.
    }
  }

  return (
    <a className="nav__logo" href="/" aria-label="Zetrix home" onClick={skipIntroOnce}>
      {children}
    </a>
  );
}
