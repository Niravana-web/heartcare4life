import PageHeader from "@/components/PageHeader";
import Prose from "@/components/Prose";
import Cta from "@/components/Cta";
import JsonLd from "@/components/JsonLd";
import AuthorBlock from "@/components/AuthorBlock";
import { getPage, faqPairs, plainText } from "@/lib/content";
import { buildMetadata, graph, webPageLd, faqLd } from "@/lib/seo";

const page = getPage("/faqs")!;
export const metadata = buildMetadata({ title: "FAQs | Heart Health, Medication Safety & Visiting HeartCare4life", description: "Answers from Dr. Vimal Nanavati on office hours, scheduling, insurance, what to bring, medication safety and heart health.", route: "/faqs" });

export default function Faqs() {
  const pairs = faqPairs(page.body).map((p) => ({ q: p.q, a: plainText(p.a) }));
  return (
    <>
      <JsonLd data={graph(webPageLd({ route: "/faqs", title: "Frequently Asked Questions", description: metadata.description as string, type: "FAQPage", extra: { mainEntity: faqLd(pairs).mainEntity } }))} />
      <PageHeader eyebrow="Patient questions" title="Frequently Asked Questions" lede={`${pairs.length} answers about visiting HeartCare4life, medication safety and heart health.`} crumbs={[{ name: "Home", route: "/" }, { name: "FAQs", route: "/faqs" }]} />
      <div className="container-x py-14"><Prose body={page.body} /><div className="max-w-[76ch]"><AuthorBlock /></div></div>
      <Cta />
    </>
  );
}
