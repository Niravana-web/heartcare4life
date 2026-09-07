import { notFound } from "next/navigation";
import Link from "next/link";
import { allPages, getPage, childrenOf, excerpt } from "@/lib/content";
import { CUSTOM_ROUTES, SECTION_META, crumbsFor, DIAGNOSTIC_SLUGS, comparesFor, NOT_A_PROCEDURE, COMPARE_ENTITIES } from "@/lib/routes";
import { buildMetadata, graph, webPageLd, videoLd, abs } from "@/lib/seo";
import PageHeader from "@/components/PageHeader";
import Prose from "@/components/Prose";
import JsonLd from "@/components/JsonLd";
import Cta from "@/components/Cta";
import LocationsBlock from "@/components/LocationsBlock";
import YouTube from "@/components/YouTube";
import Reveal from "@/components/Reveal";
import AuthorBlock from "@/components/AuthorBlock";
import videos from "../../../content/videos.json";

export const dynamicParams = false;

export function generateStaticParams() {
  return allPages()
    .filter((p) => !CUSTOM_ROUTES.has(p.route))
    .map((p) => ({ slug: p.route.split("/").filter(Boolean) }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const page = getPage("/" + slug.join("/"));
  if (!page) return {};
  const label = SECTION_META[page.section]?.name ?? "Cardiology";
  return buildMetadata({
    title: cleanTitle(page.h1, page.section),
    description: page.description,
    route: page.route,
    image: `/og?t=${encodeURIComponent(page.h1)}&s=${encodeURIComponent(label)}`,
  });
}

/**
 * buildMetadata appends " | HeartCare4life" (17 chars). Google truncates around 60,
 * so only add a qualifier that still fits inside that budget. Longest fitting wins.
 */
const TITLE_BUDGET = 60 - " | HeartCare4life".length;
const SUFFIXES: Record<string, string[]> = {
  services: ["San Diego & Redding", "San Diego"],
  conditions: ["Symptoms & Treatment", "Symptoms"],
  compare: ["Which Is Right for You?"],
};

function cleanTitle(h1: string, section: string) {
  for (const suffix of SUFFIXES[section] ?? []) {
    const candidate = `${h1} | ${suffix}`;
    if (candidate.length <= TITLE_BUDGET) return candidate;
  }
  return h1;
}

export default async function Page({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const route = "/" + slug.join("/");
  const page = getPage(route);
  if (!page || CUSTOM_ROUTES.has(route)) notFound();
  const kids = childrenOf(route);
  const isHub = kids.length > 0;
  const meta = SECTION_META[page.section];
  const siblings = isHub ? [] : childrenOf("/" + page.section).filter((p) => p.route !== route);
  const vids = page.youtube.map((id) => videos.find((v) => v.id === id)).filter(Boolean) as typeof videos;

  const compares = comparesFor(route);
  const slugTail = slug[slug.length - 1];
  const isDiagnostic = DIAGNOSTIC_SLUGS.has(slugTail);
  const crumbs = crumbsFor(route, page.h1);

  const entityId = abs(route) + "#entity";
  const about = meta?.schemaType && !isHub && !NOT_A_PROCEDURE.has(slugTail)
    ? { "@type": meta.schemaType, "@id": entityId, name: page.h1, description: page.description, url: abs(route) }
    : undefined;

  /** Comparison pages name the entities they weigh, instead of defaulting to the org. */
  const mentions = page.section === "compare" && !isHub
    ? (COMPARE_ENTITIES[slugTail] ?? []).map((r) => ({ "@id": abs(r) + "#entity" }))
    : [];

  /** Conditions link to the services that treat them, mirroring the editorial cross-links. */
  const treatmentIds = meta?.schemaType === "MedicalCondition"
    ? [...page.body.matchAll(/\]\((\/services\/[a-z0-9-]+)\)/g)].map((m) => abs(m[1]) + "#entity")
    : [];

  const ld = graph(
    webPageLd({
      route, title: page.h1, description: page.description,
      about: about ? { "@id": entityId } : undefined,
      type: isHub ? "CollectionPage" : "MedicalWebPage",
      ...(mentions.length ? { extra: { mentions } } : {}),
    }),
    ...(about ? [{
      ...about,
      ...(meta?.schemaType === "MedicalProcedure" ? {
        howPerformed: isDiagnostic
          ? "Performed by Dr. Vimal Nanavati, board-certified interventional cardiologist, at HeartCare4life offices in Bonita, San Diego and Redding, CA"
          : "Performed by Dr. Vimal Nanavati, board-certified interventional cardiologist, at affiliated hospitals serving San Diego and Redding, CA",
        procedureType: isDiagnostic ? "https://schema.org/NoninvasiveProcedure" : "https://schema.org/PercutaneousProcedure",
      } : {}),
      ...(meta?.schemaType === "MedicalCondition" ? {
        associatedAnatomy: { "@type": "AnatomicalStructure", name: "Heart" },
        ...(treatmentIds.length ? { possibleTreatment: [...new Set(treatmentIds)].map((id) => ({ "@id": id })) } : {}),
      } : {}),
    }] : []),
    ...vids.map(videoLd),
  );

  return (
    <>
      <JsonLd data={ld} />
      <PageHeader eyebrow={meta?.eyebrow} title={page.h1} lede={isHub ? page.description : undefined} crumbs={crumbs} />
      <div className="container-x py-14">
        <div className={isHub ? "" : "grid gap-14 lg:grid-cols-[minmax(0,1fr)_300px]"}>
          <Reveal>
            <Prose body={page.body} />
            {vids.length > 0 && page.route !== "/videos" && (
              <div className="mt-12 grid gap-8 sm:grid-cols-2">
                {vids.map((v) => (<figure key={v.id} className="m-0"><YouTube id={v.id} title={v.title} /><figcaption className="mt-3 font-serif text-lg text-navy">{v.title}</figcaption></figure>))}
              </div>
            )}
            {!["accessibility", "accessibility-statement", "disclaimer", "privacy", "open-payments-database", "gallery"].includes(page.section)
              && (!isHub || ["services", "conditions", "treatments", "compare"].includes(page.section))
              && <AuthorBlock />}
          </Reveal>
          {!isHub && (
            <aside className="lg:sticky lg:top-20 lg:self-start">
              <div className="border-t border-rule-strong pt-5">
                <p className="eyebrow mb-3 text-[.72rem]">Your cardiologist</p>
                <Link href="/dr-vimal-nanavati" className="no-underline">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/images/dr-vimal-nanavati-sb.jpg" alt="Dr. Vimal Nanavati, board certified interventional cardiologist" className="mb-3 aspect-[4/5] w-full rounded-lg object-cover object-top" loading="lazy" />
                  <span className="font-serif text-xl text-navy">Dr. Vimal Nanavati</span>
                </Link>
                <p className="mt-1 text-[.9rem] text-ink-muted">Board Certified in Cardiology and Interventional Cardiology</p>
                <Link href="/appointments/online" className="btn-primary mt-4 w-full text-center">Book an appointment</Link>
              </div>
              {compares.length > 0 && (
                <div className="mt-8 border-t border-rule pt-5">
                  <p className="eyebrow mb-3 text-[.72rem]">Weighing your options</p>
                  <ul className="m-0 list-none p-0">
                    {compares.map((c) => (
                      <li key={c.slug} className="border-b border-rule py-2 text-[.95rem]">
                        <Link href={`/compare/${c.slug}`} className="no-underline text-ink hover:text-navy hover:underline underline-offset-4">{c.title}</Link>
                      </li>
                    ))}
                  </ul>
                  <Link href="/compare" className="link-u mt-3 inline-block text-[.875rem]">All comparisons →</Link>
                </div>
              )}
              {siblings.length > 0 && (
                <div className="mt-8 border-t border-rule pt-5">
                  <p className="eyebrow mb-3 text-[.72rem]">More {meta?.name.toLowerCase() ?? "pages"}</p>
                  <ul className="m-0 list-none p-0">
                    {siblings.slice(0, 14).map((s) => (<li key={s.route} className="border-b border-rule py-2 text-[.95rem]"><Link href={s.route} className="no-underline text-ink hover:text-navy hover:underline underline-offset-4">{s.h1}</Link></li>))}
                  </ul>
                  <Link href={"/" + page.section} className="link-u mt-3 inline-block text-[.875rem]">All {meta?.name.toLowerCase()} →</Link>
                </div>
              )}
            </aside>
          )}
        </div>
        {isHub && (
          <div className="mt-12 grid gap-8 border-t border-rule pt-10 sm:grid-cols-2 lg:grid-cols-3">
            {kids.map((k, i) => (
              <Reveal key={k.route} delay={(i % 3) * 0.06} as="article" className="flex flex-col border-t border-rule-strong pt-5">
                <h2 className="m-0 font-serif text-[1.4rem] font-normal leading-tight text-navy"><Link href={k.route} className="no-underline hover:underline underline-offset-4">{k.h1}</Link></h2>
                <p className="mb-4 mt-2 flex-1 text-[.95rem] leading-relaxed text-ink-muted">{excerpt(k)}</p>
                <Link href={k.route} className="link-u text-[.875rem]">Read →</Link>
              </Reveal>
            ))}
          </div>
        )}
      </div>
      <Cta />
      <LocationsBlock compact />
    </>
  );
}
