import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Laterloom",
    short_name: "Laterloom",
    description: "Seal today. Open tomorrow.",
    start_url: "/dashboard",
    display: "standalone",
    orientation: "portrait",
    background_color: "#1c1d2c",
    theme_color: "#1c1d2c",
    categories: ["productivity", "lifestyle"],
    icons: [
      {
        src: "/icons/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icons/icon-maskable.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}
