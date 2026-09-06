import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import Cta from "@/components/Cta";
import JsonLd from "@/components/JsonLd";
import { buildMetadata, graph, webPageLd } from "@/lib/seo";
import news from "../../../content/news.json";

export const metadata = buildMetadata({ title: "In the News | Dr. Vimal Nanavati", description: "News, meetings and updates from Dr. Vimal Nanavati and HeartCare4life, interventional cardiology in Bonita, San Diego and Redding, CA.", route: "/news" });

export default function News() {
  return (
    <>
      <JsonLd data={graph(webPageLd({ route: "/news", title: "In the News", description: metadata.description as string, type: "CollectionPage" }))} />
      <PageHeader eyebrow="Media" title="In the News" lede="Updates from Dr. Nanavati's work in cardiovascular medicine." crumbs={[{ name: "Home", route: "/" }, { name: "Media", route: "/media" }, { name: "In the News", route: "/news" }]} />
      <div className="container-x py-14">
        {news.map((n) => (
          <article key={n.slug} className="grid gap-6 border-t border-ink py-10 md:grid-cols-[1fr_1.2fr]">
            <div>
              <p className="eyebrow mb-3 text-[.75rem]">{new Date(n.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
              <h2 className="display text-[clamp(1.75rem,3vw,2.5rem)]"><Link href={`/news/${n.slug}`} className="no-underline hover:underline underline-offset-4">{n.title}</Link></h2>
            </div>
            <div>
              <p className="text-[1.0625rem] leading-relaxed text-ink-muted">{n.excerpt}</p>
              <Link href={`/news/${n.slug}`} className="link-u text-[.95rem]">Read more →</Link>
            </div>
          </article>
        ))}
      </div>
      <Cta />
    </>
  );
}
