import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root to this project. The original HTML site sits in the
  // parent folder (with its own lockfile), so Turbopack would otherwise warn
  // about an ambiguous root.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
