import { type MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    scope: "/",
    start_url: "/",
    name: "LTX",
    short_name: "LTX",
    lang: "en-US",
    display: "minimal-ui",
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
        short_name: "Create",
        description: "Open the editor to create a new Document",
        url: "/create",
        icons: [{ src: "/img/square-pen.png", sizes: "24x24" }],
      },
    ],
  };
}
