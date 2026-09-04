import type { MetadataRoute } from "next";

// Keep SITE_URL in sync with the one in layout.tsx.
// TODO(handover): update to the final production domain when it changes.
const SITE_URL = "https://zetrix-landing-site.vercel.app";

// Single-page landing site — one entry. Next generates /sitemap.xml (static).
// Add more entries here if additional routes are introduced.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
