import type { MetadataRoute } from "next";

// Keep SITE_URL in sync with the one in layout.tsx.
// TODO(handover): update to the final production domain when it changes.
const SITE_URL = "https://zetrix-landing-site.vercel.app";

// Next generates /sitemap.xml statically for the public site routes.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/zid`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
  ];
}
