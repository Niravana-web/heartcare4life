// Verify every external citation in the content actually resolves.
// Fabricated or dead citations on a YMYL medical site are worse than none.
// Run: npm run seo:links
import fs from "node:fs";
import path from "node:path";

const dir = path.join(process.cwd(), "content", "pages");
const urls = new Map(); // url -> [files]

for (const f of fs.readdirSync(dir).filter((f) => f.endsWith(".md"))) {
  const body = fs.readFileSync(path.join(dir, f), "utf8");
  for (const [, u] of body.matchAll(/\]\((https?:\/\/[^)\s]+)\)/g)) {
    if (!urls.has(u)) urls.set(u, []);
    urls.get(u).push(f);
  }
}

// These hosts return 403 to any scripted request regardless of whether the page
// exists, so a 403 from them is not evidence of a broken link.
const BOT_WALLED = /^https?:\/\/(www\.)?(heart|acc|cdc|hhs|fda|freedomscientific)\.(org|gov|com)/;

async function check(u) {
  for (const method of ["HEAD", "GET"]) {
    try {
      const r = await fetch(u, {
        method,
        redirect: "follow",
        headers: { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)" },
        signal: AbortSignal.timeout(25000),
      });
      if (r.status === 405 && method === "HEAD") continue;
      return r.status;
    } catch {
      if (method === "HEAD") continue;
      return "ERR";
    }
  }
  return "ERR";
}

const entries = [...urls.keys()];
const results = [];
for (let i = 0; i < entries.length; i += 8) {
  const batch = entries.slice(i, i + 8);
  results.push(...(await Promise.all(batch.map(async (u) => [u, await check(u)]))));
}

const dead = [];
const walled = [];
for (const [u, status] of results) {
  if (status === 200) continue;
  if (status === 403 && BOT_WALLED.test(u)) walled.push([u, status]);
  else dead.push([u, status]);
}

console.log(`checked ${results.length} external citations across ${new Set([...urls.values()].flat()).size} files`);
if (walled.length) console.log(`${walled.length} returned 403 from bot-walled hosts (heart.org, cdc.gov, hhs.gov), treated as OK`);

if (dead.length) {
  console.error(`\n${dead.length} BROKEN citation(s):\n`);
  for (const [u, s] of dead) {
    console.error(`  [${s}] ${u}`);
    console.error(`        cited in: ${[...new Set(urls.get(u))].join(", ")}`);
  }
  process.exit(1);
}
console.log("all citations resolve");
