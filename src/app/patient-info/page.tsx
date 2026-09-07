import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import Cta from "@/components/Cta";
import { buildMetadata, graph, webPageLd } from "@/lib/seo";
import Prose from "@/components/Prose";
import { getPage } from "@/lib/content";
import JsonLd from "@/components/JsonLd";

export const metadata = buildMetadata({ title: "Patient Info: Forms, Billing & Insurance", description: "Patient information for HeartCare4life: forms and downloads, patient education videos, bill payment options and medical insurance information.", route: "/patient-info" });
const ITEMS = [
  ["Patient Forms & Downloads", "/patient-info/patient-forms", "New-patient paperwork to complete before your visit."],
  ["Patient Education Videos", "/patient-info/patient-education-videos", "Animated explanations of heart anatomy, tests and procedures."],
  ["Bill Payment Options", "/patient-info/bill-payment", "How to pay your bill."],
  ["Medical Insurance Information", "/patient-info/insurance", "How to verify your coverage, referrals, prior authorization and what to expect on a bill."],
];
export default function PatientInfo() {
  const page = getPage("/patient-info");
  return (
    <>
      <JsonLd data={graph(webPageLd({ route: "/patient-info", title: "Patient Info", description: metadata.description as string, type: "CollectionPage" }))} />
      <PageHeader eyebrow="Education & resources" title="Patient Info" crumbs={[{ name: "Home", route: "/" }, { name: "Patient Info", route: "/patient-info" }]} />
      {page?.body && (
        <div className="container-x pt-14">
          <div className="max-w-[68ch]"><Prose body={page.body} /></div>
        </div>
      )}
      <div className="container-x grid gap-8 py-14 sm:grid-cols-2 lg:grid-cols-4">
        {ITEMS.map(([t, h, d], i) => (<Reveal key={h} delay={i * 0.06} className="border-t border-rule-strong pt-5"><h2 className="m-0 font-serif text-[1.35rem] font-normal text-navy"><Link href={h} className="no-underline hover:underline underline-offset-4">{t}</Link></h2><p className="mt-2 text-ink-muted">{d}</p></Reveal>))}
      </div>
      <Cta />
    </>
  );
}
