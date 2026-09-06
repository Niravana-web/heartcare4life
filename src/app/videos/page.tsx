import PageHeader from "@/components/PageHeader";
import YouTube from "@/components/YouTube";
import Reveal from "@/components/Reveal";
import Cta from "@/components/Cta";
import JsonLd from "@/components/JsonLd";
import { buildMetadata, graph, webPageLd, videoLd } from "@/lib/seo";
import { SITE } from "@/lib/site";
import videos from "../../../content/videos.json";

export const metadata = buildMetadata({ title: "Heart Health Videos by Dr. Vimal Nanavati", description: "Watch Dr. Vimal Nanavati's videos on sudden cardiac death, atrial fibrillation, coronary stents, heart attack symptoms, radial artery catheterization and the latest cardiology trials. Heart Matters channel.", route: "/videos" });

export default function Videos() {
  const list = [...videos].sort((a, b) => a.title.localeCompare(b.title));
  return (
    <>
      <JsonLd data={graph(webPageLd({ route: "/videos", title: "Videos", description: metadata.description as string, type: "CollectionPage" }), { "@type": "ItemList", itemListElement: list.map((v, i) => ({ "@type": "ListItem", position: i + 1, item: videoLd(v) })) })} />
      <PageHeader eyebrow="Media" title="Videos" lede={`Educational talks and interviews from Dr. Nanavati's YouTube channel, Heart Matters. ${videos.length} videos.`} crumbs={[{ name: "Home", route: "/" }, { name: "Media", route: "/media" }, { name: "Videos", route: "/videos" }]} />
      <div className="container-x py-14">
        <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((v, i) => (
            <Reveal key={v.id} as="article" delay={(i % 3) * 0.06}>
              <YouTube id={v.id} title={v.title} />
              <h2 className="mt-3 font-serif text-[1.2rem] font-normal leading-snug text-navy">{v.title}</h2>
              <p className="mt-1 text-[.8rem] uppercase tracking-[.12em] text-ink-subtle">{v.channel}</p>
            </Reveal>
          ))}
        </div>
        <p className="mt-12 text-ink-muted">Subscribe on <a href={SITE.social.youtube} target="_blank" rel="noopener" className="link-u">YouTube — Dr. V. Nanavati (Heart Matters)</a>.</p>
      </div>
      <Cta />
    </>
  );
}
