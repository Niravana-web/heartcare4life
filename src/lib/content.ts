import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type Page = {
  route: string;
  title: string;
  h1: string;
  description: string;
  sourceUrl: string;
  legacyUrls: string[];
  youtube: string[];
  body: string;
  section: string;
};

const DIR = path.join(process.cwd(), "content", "pages");
let cache: Page[] | null = null;

export function allPages(): Page[] {
  if (cache) return cache;
  cache = fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const { data, content } = matter(fs.readFileSync(path.join(DIR, f), "utf8"));
      const route = data.route as string;
      const section = route === "/" ? "home" : route.split("/")[1];
      return { ...(data as Omit<Page, "body" | "section">), body: content.trim(), section };
    })
    .sort((a, b) => a.route.localeCompare(b.route));
  return cache;
}

export function getPage(route: string): Page | undefined {
  return allPages().find((p) => p.route === route);
}

export function childrenOf(route: string): Page[] {
  return allPages().filter((p) => p.route.startsWith(route + "/") && p.route.split("/").length === route.split("/").length + 1);
}

/** First meaningful paragraph of a page body, for cards and summaries. */
export function excerpt(p: Page, max = 180): string {
  const text = p.body
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\*\*\[EMBED\]\*\*[^\n]*/g, "")
    .replace(/<[^>]+>/g, "")
    .split(/\n\n+/)
    .map((s) => s.replace(/\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/[#*_>-]+/g, " ").replace(/\s+/g, " ").trim())
    .find((s) => s.length > 60);
  if (!text) return p.description;
  return text.length > max ? text.slice(0, max).replace(/\s\S*$/, "") + "…" : text;
}

/** Split an FAQ-style body (### question / answer) into Q&A pairs. */
export function faqPairs(body: string): { q: string; a: string }[] {
  const out: { q: string; a: string }[] = [];
  const parts = body.split(/^### /m).slice(1);
  for (const part of parts) {
    const [q, ...rest] = part.split("\n");
    const a = rest.join("\n").split(/^## /m)[0].trim();
    if (q && a) out.push({ q: q.trim(), a });
  }
  return out;
}

export function plainText(md: string): string {
  return md
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\*\*\[EMBED\]\*\*[^\n]*/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[*_`>]+/g, "")
    .replace(/^#+\s*/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
