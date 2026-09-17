import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  if (!siteUrl) return [];

  return [
    { url: new URL("/", siteUrl).toString(), changeFrequency: "monthly", priority: 1 },
    { url: new URL("/privacy", siteUrl).toString(), changeFrequency: "yearly", priority: 0.3 },
  ];
}
