import fs from "node:fs";
import path from "node:path";
import type { MetadataRoute } from "next";
import { allPages } from "@/lib/content";
import { SITE, LOCATIONS } from "@/lib/site";
import news from "../../content/news.json";

/** Real mtime of the markdown behind a route, so lastmod tracks content, not deploys. */
function contentMtime(route: string): Date | undefined {
  const file = (route === "/" ? "home" : route.slice(1).replace(/\//g, "__")) + ".md";
  try {
    return fs.statSync(path.join(process.cwd(), "content", "pages", file)).mtime;
  } catch {
    return undefined;
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const custom = ["/", "/testimonials", "/testimonials/submit", "/videos", "/news", "/contact", "/locations", "/appointments/online", "/appointments/general", "/faqs", "/feedback", "/tell-a-friend", "/media", "/patient-info", "/site-map"];
  const routes = new Set<string>([...custom, ...allPages().map((p) => p.route), ...news.map((n) => `/news/${n.slug}`), ...LOCATIONS.map((l) => `/locations/${l.id}`)]);
  const pri = (r: string) => (r === "/" ? 1 : r.split("/").length === 2 ? 0.8 : 0.6);
  return [...routes].sort().map((r) => ({
    url: r === "/" ? SITE.url : SITE.url + r,
    lastModified: contentMtime(r) ?? now,
    changeFrequency: r === "/" ? "weekly" : "monthly",
    priority: pri(r),
  }));
}
