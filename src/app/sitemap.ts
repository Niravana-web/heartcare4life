import type { MetadataRoute } from "next";
import { allPages } from "@/lib/content";
import { SITE, LOCATIONS, REVIEWED } from "@/lib/site";
import news from "../../content/news.json";

export default function sitemap(): MetadataRoute.Sitemap {
  // Per-page `updated` dates from frontmatter. A CI checkout resets every file
  // mtime to the clone time, so the filesystem cannot answer this.
  const updated = new Map(allPages().map((p) => [p.route, p.updated]));
  const fallback = new Date(REVIEWED);
  const custom = ["/", "/testimonials", "/testimonials/submit", "/videos", "/news", "/contact", "/locations", "/appointments/online", "/appointments/general", "/faqs", "/feedback", "/tell-a-friend", "/media", "/patient-info", "/site-map"];
  const routes = new Set<string>([...custom, ...allPages().map((p) => p.route), ...news.map((n) => `/news/${n.slug}`), ...LOCATIONS.map((l) => `/locations/${l.id}`)]);
  const pri = (r: string) => (r === "/" ? 1 : r.split("/").length === 2 ? 0.8 : 0.6);
  return [...routes].sort().map((r) => ({
    url: r === "/" ? SITE.url : SITE.url + r,
    lastModified: updated.get(r) ? new Date(updated.get(r) as string) : fallback,
    changeFrequency: r === "/" ? "weekly" : "monthly",
    priority: pri(r),
  }));
}
