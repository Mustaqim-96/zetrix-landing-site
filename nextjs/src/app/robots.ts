import type { MetadataRoute } from "next";

// Keep SITE_URL in sync with the one in layout.tsx.
// TODO(handover): update to the final production domain when it changes.
const SITE_URL = "https://zetrix-landing-site.vercel.app";

// Next generates /robots.txt from this at build time (static).
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
