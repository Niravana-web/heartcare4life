import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/api/"] },
      // AI crawlers are welcome; llms.txt describes the site for them.
      ...["GPTBot", "ChatGPT-User", "OAI-SearchBot", "ClaudeBot", "Claude-Web", "anthropic-ai", "PerplexityBot", "Google-Extended", "Applebot-Extended", "CCBot", "Bytespider", "Amazonbot", "meta-externalagent"].map((ua) => ({ userAgent: ua, allow: "/" })),
    ],
    sitemap: SITE.url + "/sitemap.xml",
    host: SITE.url,
  };
}
