# HeartCare4life — website

Next.js 16 (App Router) · Tailwind 4 · Framer Motion · Lenis. Content lives in `content/` as markdown + JSON, migrated from the previous heartcare4life.com site (see `../contents.md`). Design follows `../design-ref/DESIGN-SYSTEM.md`.

## Run
```
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
node scripts/seo-regression.mjs   # BASE=http://localhost:3000 — crawls sitemap, checks titles/descriptions/canonicals/h1/JSON-LD/og, llms.txt, FAQ/Video/Review schema, and all 128 legacy redirects
```

## Structure
- `content/pages/*.md` — one file per page, frontmatter = route/title/h1/description/legacy URLs/YouTube ids. Rendered by `src/app/[...slug]/page.tsx` (hubs get child cards, leaves get sidebar + CTA).
- `content/testimonials.json` (95 reviews), `content/videos.json` (15 YouTube), `content/news.json`.
- `src/lib/site.ts` — practice facts: 3 locations, phones, hours, socials, nav. Edit here; header, footer, JSON-LD, llms.txt all read from it.
- `src/lib/seo.ts` — metadata + JSON-LD builders (MedicalOrganization, Physician, MedicalClinic ×3, MedicalWebPage, MedicalProcedure/MedicalCondition, FAQPage, VideoObject, NewsArticle, AggregateRating/Review, BreadcrumbList).
- `src/app/sitemap.ts`, `robots.ts`, `llms.txt/route.ts`, `llms-full.txt/route.ts` — SEO/GEO endpoints.
- `redirects.json` — 301s from every old `-interventional-cardiologist-bonita-redding(-san-diego)-ca` URL and testimonial/news paths.
- `src/app/api/forms/route.ts` — receives all forms (appointment, contact, feedback, tell-a-friend, testimonial). Saves each submission as a private JSON file in Vercel Blob (`form-submissions/`) and emails it via Resend. Env: `RESEND_API_KEY`, `BLOB_READ_WRITE_TOKEN`, optional `FORM_RECIPIENTS` (comma-separated) and `FORM_FROM` (must be on a Resend-verified domain).

## Before launch
1. Verify `heartcare4life.com` in Resend and connect a Blob store to the Vercel project (see `/api/forms` above).
2. Confirm the North San Diego phone number (site used the Bonita number) and NPI for the Physician schema.
3. Replace `public/images/hero-poster.jpg` with a practice photo if desired; hero clips are the practice banner video + 3 Pexels San Diego clips (free license).
4. Patient Forms and Bill Payment pages still say "Coming soon" (as on the old site).
5. Submit `sitemap.xml` in Search Console; verify rich results for FAQ, Video, Review, LocalBusiness.
