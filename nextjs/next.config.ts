import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root to this project. The original HTML site sits in the
  // parent folder (with its own lockfile), so Turbopack would otherwise warn
  // about an ambiguous root.
  turbopack: {
    root: __dirname,
  },

  async headers() {
    // Standard security headers on every response. (No strict CSP: the page runs
    // a small inline theme/intro script and vendored globe libs, which a tight
    // CSP would block — revisit with nonces if a CSP is required.)
    const securityHeaders = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "X-DNS-Prefetch-Control", value: "on" },
      {
        key: "Strict-Transport-Security",
        value: "max-age=63072000; includeSubDomains; preload",
      },
    ];

    return [
      { source: "/:path*", headers: securityHeaders },
      // Vendored libraries never change (pinned copies of three.js /
      // OrbitControls), so they can be cached hard. Do NOT do this for
      // /js or /css — the team edits those and they have no content hash.
      {
        source: "/vendor/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;
