#!/usr/bin/env node
/**
 * Ping IndexNow (Bing, Yandex, Naver, Seznam) with the site's URLs after a deploy.
 * Usage: node scripts/indexnow.mjs            → submits every URL in the sitemap
 *        node scripts/indexnow.mjs /a /b      → submits just those routes
 */
import fs from "node:fs";
import path from "node:path";

const HOST = "www.heartcare4life.com";
const pub = path.join(process.cwd(), "public");
const key = fs.readdirSync(pub).find((f) => /^[0-9a-f]{32}\.txt$/.test(f))?.replace(".txt", "");
if (!key) {
  console.error("No IndexNow key file found in public/. Expected <32-hex>.txt");
  process.exit(1);
}

let routes = process.argv.slice(2);
if (routes.length === 0) {
  const xml = await (await fetch(`https://${HOST}/sitemap.xml`)).text();
  routes = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(`https://${HOST}`, "") || "/");
}
const urlList = routes.map((r) => (r.startsWith("http") ? r : `https://${HOST}${r === "/" ? "" : r}`));

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: HOST, key, keyLocation: `https://${HOST}/${key}.txt`, urlList }),
});
console.log(`IndexNow: submitted ${urlList.length} URLs, HTTP ${res.status}`);
if (!res.ok) process.exit(1);
