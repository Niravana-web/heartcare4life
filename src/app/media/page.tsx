import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import { buildMetadata, graph, webPageLd } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";

export const metadata = buildMetadata({ title: "Media: Videos, Testimonials & News", description: "Videos, patient testimonials, before-and-after angiogram results, photo gallery and news from Dr. Vimal Nanavati and HeartCare4life.", route: "/media" });
const ITEMS = [
  ["Videos", "/videos", "Educational talks and interviews from Dr. Nanavati's Heart Matters channel."],
  ["Patient Testimonials", "/testimonials", "95 five-star reviews from Google, Healthgrades, Zocdoc and our patients."],
  ["Before and After", "/before-and-after", "Real angiogram images showing coronary blockages before and after stenting."],
  ["Gallery", "/gallery", "Photos from the practice, events and community."],
  ["In the News", "/news", "Updates from Dr. Nanavati's work in cardiovascular medicine."],
];
export default function Media() {
  return (
    <>
      <JsonLd data={graph(webPageLd({ route: "/media", title: "Media", description: metadata.description as string, type: "CollectionPage" }))} />
      <PageHeader eyebrow="Videos, news and stories" title="Media" bg="/hero.jpeg" crumbs={[{ name: "Home", route: "/" }, { name: "Media", route: "/media" }]} />
      <div className="container-x grid gap-8 py-14 sm:grid-cols-2 lg:grid-cols-3">
        {ITEMS.map(([t, h, d], i) => (<Reveal key={h} delay={i * 0.06} className="border-t border-rule-strong pt-5"><h2 className="m-0 font-serif text-[1.5rem] font-normal text-navy"><Link href={h} className="no-underline hover:underline underline-offset-4">{t}</Link></h2><p className="mt-2 text-ink-muted">{d}</p><Link href={h} className="link-u text-[.875rem]">Open →</Link></Reveal>))}
      </div>
    </>
  );
}
