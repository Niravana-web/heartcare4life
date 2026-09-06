import { notFound } from "next/navigation";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import Cta from "@/components/Cta";
import JsonLd from "@/components/JsonLd";
import { buildMetadata, graph, webPageLd, locationLd, ID } from "@/lib/seo";
import { LOCATIONS, HOURS } from "@/lib/site";
import { childrenOf } from "@/lib/content";

export const dynamicParams = false;
export function generateStaticParams() { return LOCATIONS.map((l) => ({ id: l.id })); }

const COPY: Record<string, { title: string; description: string; intro: string; areas: string[]; note: string }> = {
  "south-san-diego": {
    title: "Cardiologist in Bonita & Chula Vista, CA",
    description: "HeartCare4life South San Diego: 180 Otay Lakes Rd, Ste 110, Bonita, CA 91902. Call (619) 585-0476. Full in-office cardiac testing with Dr. Vimal Nanavati.",
    intro: "Our South San Diego office sits on Otay Lakes Road in Bonita, minutes from Chula Vista, Eastlake and Otay Ranch. This is Dr. Nanavati's primary Southern California clinic, with in-office echocardiography, stress testing, vascular ultrasound, Holter monitoring and advanced lipid testing, so most diagnoses can be made without a referral elsewhere.",
    areas: ["Bonita", "Chula Vista", "Eastlake", "Otay Ranch", "National City", "Spring Valley", "Imperial Beach", "San Ysidro", "Coronado"],
    note: "Interventional procedures such as coronary stenting and left atrial appendage closure are performed at affiliated San Diego-area hospitals.",
  },
  "north-san-diego": {
    title: "Cardiologist in University City, San Diego",
    description: "HeartCare4life North San Diego: 5190 Governor Dr, San Diego, CA 92122. Call (619) 585-0476 to schedule with Dr. Vimal Nanavati, interventional cardiologist.",
    intro: "Our North San Diego office on Governor Drive in University City serves La Jolla, Clairemont, Mira Mesa, Kearny Mesa and central San Diego. Scheduling for this office is handled by our South San Diego team, so please call (619) 585-0476 to book.",
    areas: ["University City", "La Jolla", "Clairemont", "Mira Mesa", "Kearny Mesa", "Pacific Beach", "Del Mar", "Sorrento Valley"],
    note: "Consultations, follow-up visits and preventive cardiology are offered at this location; diagnostic testing may be scheduled at our Bonita office.",
  },
  "northern-california": {
    title: "Cardiologist in Redding, CA",
    description: "HeartCare4life Northern California: 2510 Airpark Drive, Ste 205, Redding, CA 96001. Call (530) 433-5427. Dr. Vimal Nanavati has served Redding since 1997.",
    intro: "Dr. Nanavati was recruited to Redding from Ohio in 1997 to build a quality cardiology program for the people of California's Northern Coast, and he has cared for this community ever since. The Airpark Drive office serves Redding, Shasta County and the surrounding North State, with selected Saturday appointments for patients who travel.",
    areas: ["Redding", "Anderson", "Red Bluff", "Shasta Lake", "Palo Cedro", "Cottonwood", "Weaverville", "Yreka", "Mount Shasta"],
    note: "This is the only office with Saturday hours, offered on selected Saturdays by appointment.",
  },
};

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; const c = COPY[id]; if (!c) return {};
  return buildMetadata({ title: c.title, description: c.description, route: `/locations/${id}` });
}

export default async function LocationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const l = LOCATIONS.find((x) => x.id === id); const c = COPY[id];
  if (!l || !c) notFound();
  const route = `/locations/${id}`;
  const services = childrenOf("/services").slice(0, 12);
  const clinic = { ...locationLd(l), "@id": ID.loc(l.id), url: undefined, mainEntityOfPage: { "@id": (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.heartcare4life.com") + route + "#webpage" } };
  return (
    <>
      <JsonLd data={graph(webPageLd({ route, title: c.title, description: c.description, about: { "@id": ID.loc(l.id) } }), clinic)} />
      <PageHeader eyebrow={`${l.city}, California`} title={l.name} lede={c.intro} crumbs={[{ name: "Home", route: "/" }, { name: "Practice Locations", route: "/locations" }, { name: l.name, route }]} />
      <div className="container-x grid gap-12 py-14 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <h2 className="display text-[1.75rem]">Address &amp; phone</h2>
          <address className="mt-4 text-[1.1rem] not-italic leading-relaxed text-ink">{l.street}{l.suite ? `, ${l.suite}` : ""}<br />{l.city}, {l.state} {l.zip}</address>
          <p className="mt-3"><a href={l.phoneHref} className="link-u text-[1.25rem] font-semibold text-ink">{l.phone}</a></p>
          <div className="mt-5 flex flex-wrap gap-3"><Link href="/appointments/online" className="btn-primary">Book an appointment</Link><a href={l.maps} target="_blank" rel="noopener" className="btn-secondary">Driving directions</a></div>
          <h2 className="display mt-10 text-[1.75rem]">Hours</h2>
          <ul className="m-0 mt-4 list-none p-0">{HOURS.map((h) => (<li key={h.days} className="flex justify-between gap-6 border-b border-rule py-2 text-[.95rem]"><span className="font-semibold">{h.days}</span><span className="text-ink-muted">{h.hours}</span></li>))}</ul>
          <p className="mt-4 text-[.95rem] text-ink-muted">{c.note}</p>
          <h2 className="display mt-10 text-[1.75rem]">Communities we serve from this office</h2>
          <p className="mt-3 leading-relaxed text-ink-muted">{c.areas.join(" · ")}</p>
        </div>
        <div>
          <div className="aspect-[4/3] overflow-hidden rounded-lg"><iframe src={l.mapEmbed ?? `https://maps.google.com/maps?q=${encodeURIComponent(`${l.street} ${l.city} ${l.state} ${l.zip}`)}&z=15&output=embed`} title={`Map to ${l.name}`} loading="lazy" className="h-full w-full border-0" referrerPolicy="no-referrer-when-downgrade" /></div>
          <h2 className="display mt-10 text-[1.75rem]">Services at HeartCare4life</h2>
          <ul className="m-0 mt-4 grid list-none gap-x-6 p-0 sm:grid-cols-2">{services.map((s) => (<li key={s.route} className="border-b border-rule py-2 text-[.95rem]"><Link href={s.route} className="no-underline text-ink hover:text-navy hover:underline underline-offset-4">{s.h1}</Link></li>))}</ul>
          <Link href="/services" className="link-u mt-3 inline-block text-[.9rem]">All services →</Link>
          <p className="mt-8 text-[.95rem] text-ink-muted">Your cardiologist at every location is <Link href="/dr-vimal-nanavati">Dr. Vimal Nanavati, MD, FACC</Link>, board certified in cardiology and interventional cardiology. Other offices: {LOCATIONS.filter((x) => x.id !== id).map((x, i) => (<span key={x.id}>{i > 0 && " · "}<Link href={`/locations/${x.id}`}>{x.name}</Link></span>))}.</p>
        </div>
      </div>
      <Cta />
    </>
  );
}
