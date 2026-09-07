// SEO / AEO / GEO regression: crawls every URL in sitemap.xml on a running server and asserts the essentials.
const BASE = process.env.BASE ?? "http://localhost:3100";
const SITE = "https://www.heartcare4life.com";
const fails = [], warns = [];
const fail = (u, m) => fails.push(`${u}: ${m}`);
const warn = (u, m) => warns.push(`${u}: ${m}`);

const sm = await (await fetch(BASE + "/sitemap.xml")).text();
const urls = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(SITE, ""));
console.log(`sitemap: ${urls.length} urls`);
const titles = new Map(), descs = new Map();
for (const u of urls) {
  const r = await fetch(BASE + u);
  if (r.status !== 200) { fail(u, `status ${r.status}`); continue; }
  const h = await r.text();
  const title = h.match(/<title>([^<]*)<\/title>/)?.[1] ?? "";
  const desc = h.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? "";
  const canon = h.match(/<link rel="canonical" href="([^"]*)"/)?.[1] ?? "";
  const h1s = [...h.matchAll(/<h1[\s>]/g)].length;
  const og = /property="og:title"/.test(h);
  const ld = [...h.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  if (!title) fail(u, "missing <title>"); else if (title.length > 70) warn(u, `title ${title.length} chars`);
  if (!desc) fail(u, "missing meta description"); else if (desc.length < 50 || desc.length > 170) warn(u, `description ${desc.length} chars`);
  if (canon.replace(/\/$/, "") !== (SITE + u).replace(/\/$/, "")) fail(u, `canonical ${canon}`);
  if (h1s !== 1) fail(u, `${h1s} h1 tags`);
  if (!og) fail(u, "missing og:title");
  if (!ld.length) fail(u, "no JSON-LD");
  for (const s of ld) { try { const j = JSON.parse(s); if (!j["@context"]) fail(u, "JSON-LD without @context"); } catch { fail(u, "invalid JSON-LD"); } }
  if (!/BreadcrumbList/.test(h) && u !== "/") warn(u, "no BreadcrumbList");
  if (!/name="viewport"/.test(h)) fail(u, "no viewport");
  if (!/<html lang="en"/.test(h)) fail(u, "no lang");
  if (/EMBED::|\*\*\[EMBED\]\*\*|Option A|yourpractice\.online\/3250/.test(h)) fail(u, "raw content leak");
  const imgsNoAlt = [...h.matchAll(/<img(?![^>]*\balt=)[^>]*>/g)].length; if (imgsNoAlt) warn(u, `${imgsNoAlt} img without alt`);
  if (titles.has(title)) fail(u, `duplicate title with ${titles.get(title)}`); titles.set(title, u);
  if (descs.has(desc)) warn(u, `duplicate description with ${descs.get(desc)}`); descs.set(desc, u);
}
// Entity / GEO checks on home
const home = await (await fetch(BASE + "/")).text();
for (const t of ['"Physician"', '"MedicalOrganization"', '"MedicalClinic"', "Bonita", "Redding", "(619) 585-0476", "(530) 433-5427", "5190 Governor Dr", "Vimal Nanavati"]) if (!home.includes(t)) fail("/", `home missing ${t}`);
// llms.txt
for (const f of ["/llms.txt", "/llms-full.txt", "/robots.txt"]) { const r = await fetch(BASE + f); if (r.status !== 200) fail(f, `status ${r.status}`); else { const t = await r.text(); if (f.startsWith("/llms") && !/Nanavati[\s\S]*Bonita[\s\S]*Redding/.test(t)) fail(f, "missing entity facts"); if (f === "/robots.txt" && !/sitemap/i.test(t)) fail(f, "no sitemap line"); } }
const full = await (await fetch(BASE + "/llms-full.txt")).text(); if (full.length < 150000) warn("/llms-full.txt", `only ${full.length} chars`);
// FAQ + video schema
const faq = await (await fetch(BASE + "/faqs")).text(); if (!/"FAQPage"/.test(faq) || !/"Question"/.test(faq)) fail("/faqs", "no FAQPage schema");
const vid = await (await fetch(BASE + "/videos")).text(); if (!/"VideoObject"/.test(vid)) fail("/videos", "no VideoObject schema");
const tst = await (await fetch(BASE + "/testimonials")).text(); if (/"AggregateRating"/.test(tst)) fail("/testimonials", "self-serving AggregateRating present");
// legacy redirects
const legacy = JSON.parse(await (await import("node:fs")).promises.readFile(new URL("../redirects.json", import.meta.url), "utf8"));
let redirOk = 0;
for (const r of legacy.slice(0, 200)) { if (r.source.includes(":")) continue; const res = await fetch(BASE + r.source, { redirect: "manual" }); const loc = res.headers.get("location") ?? ""; if (res.status !== 308 && res.status !== 301) fail(r.source, `redirect status ${res.status}`); else if (!loc.endsWith(r.destination)) fail(r.source, `redirects to ${loc}`); else redirOk++; }
console.log(`redirects ok: ${redirOk}`);

// ---- headers, LCP hints and new-page checks ----
{
  const r = await fetch(BASE + "/");
  const csp = r.headers.get("content-security-policy");
  if (!csp) fail("/", "no Content-Security-Policy header");
  else if (!/frame-ancestors/.test(csp)) warn("/", "CSP has no frame-ancestors");
  if (!r.headers.get("strict-transport-security")) fail("/", "no HSTS header");
  if (!/fetchpriority="high"|fetchPriority="high"/i.test(home)) fail("/", "hero image has no fetchpriority hint");
  if (!/tel:\+1619|tel:\+1530/.test(home)) fail("/", "no tap-to-call link");
}

// 404 must be a real page: one title, noindex, correct status
{
  const r = await fetch(BASE + "/definitely-not-a-real-page-xyz");
  if (r.status !== 404) fail("/404", `status ${r.status}, want 404`);
  const h = await r.text();
  const n = [...h.matchAll(/<title>/g)].length;
  if (n !== 1) fail("/404", `${n} <title> tags, want exactly 1`);
  if (!/noindex/.test(h)) fail("/404", "not noindexed");
  if (!/HeartCare4life/.test(h)) fail("/404", "no site chrome");
}

// IndexNow key + manifest
for (const [f, why] of [["/manifest.webmanifest", "web manifest"]]) {
  const r = await fetch(BASE + f);
  if (r.status !== 200) fail(f, `${why} status ${r.status}`);
}

// Every condition page must route to the services that treat it
for (const u of urls.filter((x) => x.startsWith("/conditions/"))) {
  const h = await (await fetch(BASE + u)).text();
  if (!/href="\/services\//.test(h)) fail(u, "links to no service page");
  if (!/possibleTreatment/.test(h)) warn(u, "no possibleTreatment in schema");
}

// Comparison pages exist and carry a table
{
  const idx = await fetch(BASE + "/compare");
  if (idx.status !== 200) fail("/compare", `status ${idx.status}`);
  const cmp = urls.filter((x) => x.startsWith("/compare/"));
  if (cmp.length < 8) fail("/compare", `only ${cmp.length} comparison pages in sitemap`);
  for (const u of cmp) {
    const h = await (await fetch(BASE + u)).text();
    if (!/<table/.test(h)) warn(u, "no comparison table");
  }
}

// Location pages carry FAQ schema and real depth
for (const u of urls.filter((x) => /^\/locations\/[a-z-]+$/.test(x))) {
  const h = await (await fetch(BASE + u)).text();
  if (!/"FAQPage"/.test(h)) fail(u, "no FAQPage schema");
  const text = h.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, "").replace(/<[^>]+>/g, " ");
  const wc = text.split(/\s+/).filter(Boolean).length;
  if (wc < 700) warn(u, `${wc} visible words`);
}

// Diagnostic services must not be typed as percutaneous procedures
{
  const h = await (await fetch(BASE + "/services/echocardiogram")).text();
  if (/PercutaneousProcedure/.test(h)) fail("/services/echocardiogram", "diagnostic test typed PercutaneousProcedure");
}

console.log(`\nWARNINGS (${warns.length})`); warns.forEach((w) => console.log("  - " + w));
console.log(`\nFAILURES (${fails.length})`); fails.forEach((f) => console.log("  - " + f));
process.exit(fails.length ? 1 : 0);
