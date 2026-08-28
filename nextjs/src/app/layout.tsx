import type { Metadata } from "next";
import "./globals.css";
import SiteScripts from "@/components/SiteScripts";

export const metadata: Metadata = {
  title: "Zetrix — From Trusted Infrastructure to Intelligent Machines",
  description:
    "Build trust and transparency with a scalable public blockchain designed for Public Sectors, Enterprises and Financial institutions.",
};

// Mirrors the original inline <head> script: mark the intro as pending as early
// as possible and fail-safe it away after 4.2s so the page is never stuck behind
// the intro overlay.
const introFailsafe = `(function () {
  document.documentElement.classList.add('site-intro-pending');
  window.__zetrixIntroFailsafe = setTimeout(function () {
    document.documentElement.classList.remove('site-intro-pending');
  }, 4200);
})();`;

// Set the theme before first paint to avoid a dark→light flash. The CSS default
// (:root) is dark, so light must be opted into with data-theme="light". Light is
// now the default; a returning visitor who explicitly toggled dark keeps it.
// Must stay in sync with the defaults in /js/theme-toggle.js.
const themeInit = `(function () {
  try {
    var stored = localStorage.getItem('zetrix-theme');
    if (stored === 'dark') document.documentElement.removeAttribute('data-theme');
    else document.documentElement.setAttribute('data-theme', 'light');
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'light');
  }
})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: the theme toggle and intro scripts mutate the
    // <html> element (data-theme / site-intro-pending) outside React's control.
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Applies the default theme (light) before first paint, so there is no
            dark→light flash. Runs before the stylesheet so styles resolve with
            the theme already set. */}
        <script
          id="zetrix-theme-init"
          dangerouslySetInnerHTML={{ __html: themeInit }}
        />
        {/* Plain inline script: runs during head parsing (before hydration),
            same timing as the old beforeInteractive next/script, but without
            Next's deferred __next_s bootstrap wrapper — which reduces the
            hydration-tracked surface in <head>. */}
        <script
          id="zetrix-intro-failsafe"
          dangerouslySetInnerHTML={{ __html: introFailsafe }}
        />
        {/* The complete hand-authored design system, served statically. */}
        {/* eslint-disable-next-line @next/next/no-css-tags */}
        <link rel="stylesheet" href="/css/styles.css" />
      </head>
      <body>
        {children}
        <SiteScripts />
      </body>
    </html>
  );
}
