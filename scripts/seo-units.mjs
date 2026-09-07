// Static SEO checks over the content and config files. No server needed.
// Run: npm run seo:units
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const dir = path.join(root, "content", "pages");
const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));

const pages = files.map((f) => {
  const raw = fs.readFileSync(path.join(dir, f), "utf8");
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  assert.ok(m, `${f}: frontmatter fences not found`);
  let fm;
  try {
    fm = JSON.parse(m[1]);
  } catch (e) {
    assert.fail(`${f}: frontmatter is not valid JSON — ${e.message}`);
  }
  return { file: f, ...fm, body: m[2].trim() };
});

const routes = new Set(pages.map((p) => p.route));
// Routes served by hand-built pages rather than a markdown file.
const EXTRA = new Set([
  "/", "/locations", "/locations/south-san-diego", "/locations/north-san-diego",
  "/locations/northern-california", "/contact", "/faqs", "/testimonials",
  "/testimonials/submit", "/videos", "/news", "/site-map", "/media",
  "/patient-info", "/feedback", "/tell-a-friend", "/appointments/online",
  "/appointments/general", "/dr-vimal-nanavati",
]);

const fails = [];
const warns = [];
const bad = (f, msg) => fails.push(`${f}: ${msg}`);
const warn = (f, msg) => warns.push(`${f}: ${msg}`);
const words = (s) => s.split(/\s+/).filter(Boolean).length;

// 1. Frontmatter integrity
for (const p of pages) {
  if (!p.route?.startsWith("/")) bad(p.file, "route missing or not absolute");
  if (!p.h1) bad(p.file, "h1 missing");
  if (!p.description) bad(p.file, "description missing");
  else if (p.description.length < 70) bad(p.file, `description ${p.description.length} chars, want 70+`);
  else if (p.description.length > 165) warn(p.file, `description ${p.description.length} chars, will be truncated at render`);
  if (!Array.isArray(p.legacyUrls)) bad(p.file, "legacyUrls must be an array");
  if (!Array.isArray(p.youtube)) bad(p.file, "youtube must be an array");
  if (p.updated !== undefined && !/^\d{4}-\d{2}-\d{2}$/.test(p.updated)) bad(p.file, `updated must be YYYY-MM-DD, got ${p.updated}`);
}

// 2. No duplicate routes, titles or descriptions
for (const key of ["route", "title", "description"]) {
  const seen = new Map();
  for (const p of pages) {
    if (!p[key]) continue;
    if (seen.has(p[key])) bad(p.file, `duplicate ${key} shared with ${seen.get(p[key])}`);
    else seen.set(p[key], p.file);
  }
}

// 3. Every internal markdown link resolves to a real route
for (const p of pages) {
  for (const m of p.body.matchAll(/(!?)\[[^\]]*\]\((\/[^)\s#]*)/g)) {
    const [, bang, href] = m;
    if (bang) continue;                       // image embed, not a page link
    if (/\.[a-z0-9]{2,4}$/i.test(href)) continue; // asset path, checked below
    const clean = href.replace(/\/$/, "") || "/";
    if (!routes.has(clean) && !EXTRA.has(clean)) bad(p.file, `dead internal link ${href}`);
  }
  // Referenced assets must exist on disk.
  for (const [, href] of p.body.matchAll(/\((\/images\/[^)\s]+)\)/g)) {
    if (!fs.existsSync(path.join(root, "public", href.replace(/^\//, "")))) bad(p.file, `missing asset ${href}`);
  }
}

// 4. Clinical pages carry real depth and real cross-links
const CLINICAL = /^(services|conditions|compare)__/;
for (const p of pages.filter((x) => CLINICAL.test(x.file) && x.route.split("/").length > 2)) {
  const n = words(p.body);
  if (n < 700) bad(p.file, `body ${n} words, want 700+`);
  const links = [...p.body.matchAll(/\]\(\/[^)\s#]*/g)].length;
  if (links < 4) bad(p.file, `${links} internal links, want 4+`);
  const cites = [...p.body.matchAll(/\]\(https?:\/\/(?:www\.)?(heart\.org|acc\.org|nhlbi\.nih\.gov|medlineplus\.gov|cdc\.gov)/g)].length;
  if (cites < 2) bad(p.file, `${cites} authoritative citations, want 2+`);
}

// 5. Condition pages must route patients to the services that treat them
for (const p of pages.filter((x) => x.file.startsWith("conditions__"))) {
  const svc = [...p.body.matchAll(/\]\((\/services\/[a-z0-9-]+)\)/g)].length;
  if (svc < 1) bad(p.file, "links to no service page");
}

// 6. Chest pain must lead with emergency guidance
const chest = pages.find((p) => p.route === "/conditions/chest-pain");
if (chest && !/911/.test(chest.body.slice(0, 700))) bad(chest.file, "no 911 guidance in the opening block");

// 7. Privacy policy must address HIPAA
const privacy = pages.find((p) => p.route === "/privacy");
if (privacy && !/HIPAA/i.test(privacy.body)) bad(privacy.file, "privacy policy never mentions HIPAA");

// 8. Vendor boilerplate must be gone
for (const p of pages) {
  if (/your practice online/i.test(p.body)) bad(p.file, "still contains 'Your Practice Online' vendor boilerplate");
}

// 9. Titles must fit Google's snippet before the site name is appended
{
  const src = fs.readFileSync(path.join(root, "src", "app", "[...slug]", "page.tsx"), "utf8");
  if (!/TITLE_BUDGET/.test(src)) bad("[...slug]/page.tsx", "title budget guard removed");
  const BRAND = " | HeartCare4life";
  for (const f of fs.readdirSync(path.join(root, "src", "app"), { recursive: true })) {
    if (typeof f !== "string" || !f.endsWith("page.tsx")) continue;
    const txt = fs.readFileSync(path.join(root, "src", "app", f), "utf8");
    for (const [, t] of txt.matchAll(/buildMetadata\(\{\s*title:\s*"([^"]+)"/g)) {
      const full = t.includes("HeartCare4life") ? t : t + BRAND;
      if (full.length > 60) bad("src/app/" + f, `title ${full.length} chars: "${full}"`);
    }
  }
}

// 10. Config invariants
const site = fs.readFileSync(path.join(root, "src", "lib", "site.ts"), "utf8");
if (!/SATURDAY_SPEC/.test(site)) bad("site.ts", "SATURDAY_SPEC missing");
const seo = fs.readFileSync(path.join(root, "src", "lib", "seo.ts"), "utf8");
// Ignore comments; only a real property assignment is a problem.
if (/^\s*hospitalAffiliation:/m.test(seo)) bad("seo.ts", "hospitalAffiliation still points at own clinics");
if (!/hasCredential/.test(seo)) bad("seo.ts", "physician hasCredential missing");
const cfg = fs.readFileSync(path.join(root, "next.config.ts"), "utf8");
if (!/Content-Security-Policy/.test(cfg)) bad("next.config.ts", "CSP header missing");
const robots = fs.readFileSync(path.join(root, "src", "app", "robots.ts"), "utf8");
if (/^\s*host:/m.test(robots)) bad("robots.ts", "deprecated Host directive still present");
if (!fs.existsSync(path.join(root, "src", "app", "not-found.tsx"))) bad("app", "not-found.tsx missing");
if (!fs.readdirSync(path.join(root, "public")).some((f) => /^[0-9a-f]{32}\.txt$/.test(f))) bad("public", "IndexNow key file missing");
// A CI checkout resets file mtimes, so sitemap lastmod must not read them.
const sm = fs.readFileSync(path.join(root, "src", "app", "sitemap.ts"), "utf8")
  .split("\n").filter((l) => !/^\s*(\/\/|\*|\/\*)/.test(l)).join("\n");
if (/statSync|\.mtime/.test(sm)) bad("sitemap.ts", "lastmod reads file mtime, which is the clone time in CI");

if (warns.length) {
  console.warn(`\n${warns.length} warning(s):`);
  for (const w of warns) console.warn("  " + w);
}

if (fails.length) {
  console.error(`\n${fails.length} SEO unit failure(s):\n`);
  for (const f of fails) console.error("  " + f);
  process.exit(1);
}
console.log(`seo:units — ${pages.length} pages checked, all assertions passed`);
