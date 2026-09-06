import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import Cta from "@/components/Cta";
import JsonLd from "@/components/JsonLd";
import { buildMetadata, graph, webPageLd, ID } from "@/lib/seo";
import { LOCATIONS, HOURS } from "@/lib/site";

export const metadata = buildMetadata({ title: "Locations: Bonita, San Diego & Redding", description: "Three cardiology offices: 180 Otay Lakes Rd, Bonita · 5190 Governor Dr, San Diego · 2510 Airpark Dr, Redding. Hours, phone numbers, maps and directions.", route: "/locations" });

const BLURB: Record<string, string> = {
  "south-san-diego": "Our South San Diego office in Bonita serves Chula Vista, National City, Eastlake, Otay Ranch, Spring Valley and the South Bay. Full in-office diagnostic testing including echocardiography, stress testing, vascular ultrasound and Holter monitoring.",
  "north-san-diego": "Our North San Diego office on Governor Drive serves University City, La Jolla, Clairemont, Mira Mesa and central San Diego. Please call the South San Diego number to schedule.",
  "northern-california": "Dr. Nanavati was recruited to Redding in 1997 to build a quality cardiology program for the Northern Coast of California. The Airpark Drive office serves Redding, Shasta County, Anderson, Red Bluff and the surrounding communities, with selected Saturday hours.",
};

export default function Locations() {
  return (
    <>
      <JsonLd data={graph(webPageLd({ route: "/locations", title: "Practice Locations", description: metadata.description as string, type: "CollectionPage", about: { "@id": ID.org } }))} />
      <PageHeader eyebrow="About" title="Practice Locations" lede="HeartCare4life serves both Southern and Northern California from three offices, plus telehealth consultations for patients anywhere in the world." crumbs={[{ name: "Home", route: "/" }, { name: "Practice Locations", route: "/locations" }]} />
      <div className="container-x py-14">
        {LOCATIONS.map((l, i) => (
          <section key={l.id} id={l.id} className={`grid scroll-mt-24 gap-8 py-10 md:grid-cols-[1fr_1.2fr] ${i > 0 ? "border-t border-rule" : ""}`}>
            <div>
              <p className="eyebrow mb-3">{l.city}, California</p>
              <h2 className="display text-[clamp(1.75rem,3vw,2.5rem)]"><Link href={`/locations/${l.id}`} className="no-underline hover:underline underline-offset-4">{l.name}</Link></h2>
              <address className="mt-4 text-[1.05rem] not-italic leading-relaxed text-ink-muted">{l.street}{l.suite ? `, ${l.suite}` : ""}<br />{l.city}, {l.state} {l.zip}</address>
              <p className="mt-3"><a href={l.phoneHref} className="link-u text-[1.15rem] font-semibold text-ink">{l.phone}</a></p>
              <p className="mt-4 max-w-[60ch] leading-relaxed text-ink-muted">{BLURB[l.id]}</p>
              <div className="mt-5 flex flex-wrap gap-3"><Link href="/appointments/online" className="btn-primary">Book an appointment</Link><a href={l.maps} target="_blank" rel="noopener" className="btn-secondary">Driving directions</a></div>
            </div>
            {l.mapEmbed ? <div className="aspect-[4/3] overflow-hidden rounded-lg"><iframe src={l.mapEmbed} title={`Map to ${l.name}`} loading="lazy" className="h-full w-full border-0" referrerPolicy="no-referrer-when-downgrade" /></div>
              : <div className="aspect-[4/3] overflow-hidden rounded-lg"><iframe src={`https://maps.google.com/maps?q=${encodeURIComponent(`${l.street} ${l.city} ${l.state} ${l.zip}`)}&z=15&output=embed`} title={`Map to ${l.name}`} loading="lazy" className="h-full w-full border-0" referrerPolicy="no-referrer-when-downgrade" /></div>}
          </section>
        ))}
        <section className="border-t border-rule pt-10">
          <h2 className="display text-[1.75rem]">Practice hours</h2>
          <ul className="m-0 mt-5 max-w-[520px] list-none p-0">{HOURS.map((h) => (<li key={h.days} className="flex justify-between gap-6 border-b border-rule py-2 text-[.95rem]"><span className="font-semibold">{h.days}</span><span className="text-ink-muted">{h.hours}</span></li>))}</ul>
        </section>
      </div>
      <Cta title="Can't come to us? We'll come to you." body="Dr. Nanavati offers telehealth second opinions and international consultations. Expert health consultation, any time, anywhere." />
    </>
  );
}
