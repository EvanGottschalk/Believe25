import type { MetadataRoute } from "next";
import { SITE } from "@/config/site";
import { ROUTABLE_SECTIONS } from "@/config/sections";
import { LEGAL_PAGES } from "@/config/legal";
import { getAllProducts } from "@/lib/shopify/client";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const products = await getAllProducts();

  return [
    { url: SITE.url, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE.url}/shop`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE.url}/custom`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    ...ROUTABLE_SECTIONS.map((s) => ({
      url: `${SITE.url}/${s.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...products.map((p) => ({
      url: `${SITE.url}/shop/${p.handle}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...LEGAL_PAGES.map((p) => ({
      url: `${SITE.url}/${p.slug}`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
  ];
}
