import type { MetadataRoute } from "next";
import { categories, gallery, origin } from "@/lib/content/site";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    "",
    "/products",
    "/projects",
    "/about",
    "/services",
    "/contact",
    "/faq",
    "/privacy",
    ...categories.map((c) => `/products/${c.slug}`),
    ...gallery.map((p) => `/projects/${p.id}`),
  ].map((p) => ({
    url: origin + p,
    changeFrequency: "monthly",
    priority: p === "" ? 1 : 0.7,
  }));
}
