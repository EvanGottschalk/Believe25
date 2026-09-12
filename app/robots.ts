import type { MetadataRoute } from "next";
import { SITE } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/custom/thank-you"],
    },
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
