import type { Metadata } from "next";
import Script from "next/script";
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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: the theme toggle and intro scripts mutate the
    // <html> element (data-theme / site-intro-pending) outside React's control.
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script id="zetrix-intro-failsafe" strategy="beforeInteractive">
          {introFailsafe}
        </Script>
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
