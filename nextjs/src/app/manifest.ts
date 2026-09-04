import type { MetadataRoute } from "next";

// Generates /manifest.webmanifest (installability + home-screen metadata).
// Icons are generated from the brand Z-mark into public/icons/; apple-touch-icon
// comes from src/app/apple-icon.png (auto-wired by the App Router convention).
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Zetrix — From Trusted Infrastructure to Intelligent Machines",
    short_name: "Zetrix",
    description:
      "Build trust and transparency with a scalable public blockchain designed for Public Sectors, Enterprises and Financial institutions.",
    start_url: "/",
    display: "standalone",
    background_color: "#18181b",
    theme_color: "#18181b",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
