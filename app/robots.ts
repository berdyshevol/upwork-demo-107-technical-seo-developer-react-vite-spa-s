import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/data";

// Allows crawling of everything except the noindex thank-you page, and points
// crawlers at the data-driven sitemap.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: "/thank-you",
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
