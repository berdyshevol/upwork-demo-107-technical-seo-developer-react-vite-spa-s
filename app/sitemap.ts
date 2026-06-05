import type { MetadataRoute } from "next";
import { SITE_URL, services, locations, posts } from "@/lib/data";

// Driven from the same data module the routes render from, so every public
// page — including dynamic blog slugs — is guaranteed to appear here.
// /thank-you is deliberately excluded (it's noindex).
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date("2026-06-04");

  const entries: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, priority: 1 },
  ];

  for (const s of services) {
    entries.push({ url: `${SITE_URL}/services/${s.slug}`, lastModified: now });
  }
  for (const l of locations) {
    entries.push({ url: `${SITE_URL}/locations/${l.slug}`, lastModified: now });
  }
  for (const p of posts) {
    entries.push({ url: `${SITE_URL}/blog/${p.slug}`, lastModified: now });
  }

  return entries;
}
