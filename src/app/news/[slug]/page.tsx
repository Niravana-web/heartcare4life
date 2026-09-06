import { notFound } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import Cta from "@/components/Cta";
import JsonLd from "@/components/JsonLd";
import { buildMetadata, graph, abs, ID } from "@/lib/seo";
import news from "../../../../content/news.json";

export const dynamicParams = false;
export function generateStaticParams() { return news.map((n) => ({ slug: n.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const n = news.find((x) => x.slug === slug); if (!n) return {};
  return buildMetadata({ title: n.title, noBrand: true, description: n.excerpt, route: `/news/${n.slug}`, image: n.images[0], type: "article" });
}

export default async function Article({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const n = news.find((x) => x.slug === slug); if (!n) notFound();
  const route = `/news/${n.slug}`;
  return (
    <>
      <JsonLd data={graph({ "@type": "NewsArticle", "@id": abs(route) + "#article", headline: n.title, description: n.excerpt, image: n.images.map(abs), datePublished: n.date, dateModified: n.date, author: { "@id": ID.doctor }, publisher: { "@id": ID.org }, mainEntityOfPage: { "@type": "WebPage", "@id": abs(route) + "#webpage" }, articleBody: n.body })} />
      <PageHeader eyebrow={new Date(n.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })} title={n.title} crumbs={[{ name: "Home", route: "/" }, { name: "Media", route: "/media" }, { name: "In the News", route: "/news" }, { name: n.title, route }]} />
      <article className="container-x py-14">
        <div className="prose-hc">
          {n.body.split("\n\n").map((p, i) => <p key={i}>{p}</p>)}
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {n.images.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={src} src={src} alt={i === 0 ? "Dr. Vimal Nanavati at the American Medical Association meeting" : "Dr. Vimal Nanavati with AMA President Dr. Sandra Adamson Fryhofer"} className="w-full rounded-lg" loading="lazy" />
          ))}
        </div>
      </article>
      <Cta />
    </>
  );
}
