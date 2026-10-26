import type { MetadataRoute } from "next";
import { origin } from "@/lib/content/site";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: process.env.NEXT_PUBLIC_INDEXABLE === "true" ? "/" : undefined,
      disallow: process.env.NEXT_PUBLIC_INDEXABLE === "true" ? ["/api/"] : "/",
    },
    sitemap: origin + "/sitemap.xml",
  };
}
