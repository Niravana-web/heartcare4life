import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import Cta from "@/components/Cta";
import JsonLd from "@/components/JsonLd";
import { buildMetadata, graph, webPageLd } from "@/lib/seo";
import testimonials from "../../../content/testimonials.json";

export const metadata = buildMetadata({ title: "Patient Testimonials | 95 Reviews of Dr. Nanavati", description: "Read 95 patient reviews of Dr. Vimal Nanavati and HeartCare4life from Google, Healthgrades, Zocdoc and our website. Interventional cardiologist in Bonita, San Diego and Redding, CA.", route: "/testimonials" });

const SOURCES = ["Website", "Google", "Healthgrades", "Zocdoc"] as const;

export default function Testimonials() {
  const avg = testimonials.reduce((s, t) => s + t.stars, 0) / testimonials.length;
  return (
    <>
      <JsonLd data={graph(webPageLd({ route: "/testimonials", title: "Patient Testimonials", description: metadata.description as string, type: "CollectionPage" }))} />
      <PageHeader eyebrow="Media" title="Patient Testimonials" lede={`${testimonials.length} reviews · ${avg.toFixed(1)} / 5 average from Google, Healthgrades, Zocdoc and patients who wrote to us directly.`} crumbs={[{ name: "Home", route: "/" }, { name: "Patient Testimonials", route: "/testimonials" }]} />
      <div className="container-x py-14">
        <div className="mb-10 flex flex-wrap items-center gap-3">
          {SOURCES.map((s) => (<a key={s} href={`#${s.toLowerCase()}`} className="btn-secondary py-2 text-[.85rem]">{s} reviews ({testimonials.filter((t) => t.source === s).length})</a>))}
          <Link href="/testimonials/submit" className="btn-primary py-2 text-[.85rem]">Submit your testimonial</Link>
        </div>
        {SOURCES.map((s) => (
          <section key={s} id={s.toLowerCase()} className="mb-16 scroll-mt-24">
            <h2 className="display mb-8 border-b border-ink pb-3 text-[clamp(1.75rem,3vw,2.5rem)]">{s} reviews</h2>
            <div className="grid gap-8 md:grid-cols-2">
              {testimonials.filter((t) => t.source === s).map((t, i) => (
                <Reveal key={i} as="article" delay={(i % 2) * 0.05} className="border-t border-rule pt-5">
                  <p className="mb-2 text-navy" aria-label={`${t.stars} out of 5 stars`}>{"★".repeat(t.stars)}{"☆".repeat(5 - t.stars)}</p>
                  <blockquote className="m-0 text-[1rem] leading-relaxed text-ink">{t.text}</blockquote>
                  <p className="mb-0 mt-3 text-[.78rem] uppercase tracking-[.14em] text-ink-subtle">~ {t.name || "Patient"} · {t.source}</p>
                </Reveal>
              ))}
            </div>
          </section>
        ))}
      </div>
      <Cta />
    </>
  );
}
