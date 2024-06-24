import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    scope: "/",
    start_url: "/",
    name: "LTX",
    short_name: "LTX",
    lang: "en-US",
    display_override: ["minimal-ui"],
    display: "standalone",
    theme_color: "#000000",
    background_color: "#000000",
    description:
      "Write. Learn. Connect. LTX is an intuitive, efficient and minimalist LaTeX editor. Creating, saving and sharing LaTeX documents has never been so effortless.",
    icons: [
      {
        src: "/img/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/img/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
    shortcuts: [
      {
        name: "Create new Document",
        url: "/create",
      },
    ],
  };
}
