import type { Metadata } from "next";
import { origin, site } from "./content/site";
export function metadata(
  title: string,
  description: string,
  path: string,
): Metadata {
  return {
    title,
    description,
    alternates: { canonical: origin + path },
    openGraph: {
      title: `${title} | ${site.name}`,
      description,
      url: origin + path,
      type: "website",
      locale: "en_LK",
      images: [
        {
          url: origin + "/images/bungalow-960.webp",
          width: 960,
          height: 720,
          alt: "Illustrative tropical home with a charcoal tiled roof",
        },
      ],
    },
    twitter: { card: "summary_large_image" },
  };
}
export function jsonLd(data: unknown) {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}
