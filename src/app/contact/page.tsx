import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import Form from "@/components/Form";
import JsonLd from "@/components/JsonLd";
import { buildMetadata, graph, webPageLd, ID } from "@/lib/seo";
import { LOCATIONS, HOURS } from "@/lib/site";

export const metadata = buildMetadata({ title: "Contact Us | Bonita, San Diego & Redding Offices", description: "Call Bonita (619) 585-0476 or Redding (530) 433-5427, or request an appointment online. Addresses, maps and hours for all three HeartCare4life offices.", route: "/contact" });

export default function Contact() {
  return (
    <>
      <JsonLd data={graph(webPageLd({ route: "/contact", title: "Contact Us", description: metadata.description as string, type: "ContactPage", about: { "@id": ID.org } }))} />
      <PageHeader eyebrow="HeartCare4life" title="Contact Us" lede="If you wish to be advised on the most appropriate treatment, please call the office nearest you to schedule an appointment, or request an appointment online. We are happy to hear from you." crumbs={[{ name: "Home", route: "/" }, { name: "Contact Us", route: "/contact" }]} />
      <div className="container-x py-14">
        <div className="grid gap-10 md:grid-cols-3">
          {LOCATIONS.map((l) => (
            <section key={l.id} id={l.id} className="scroll-mt-24 border-t border-rule-strong pt-6">
              <h2 className="m-0 font-serif text-[1.5rem] font-medium text-navy">{l.name}</h2>
              <address className="mt-3 not-italic leading-relaxed text-ink-muted">{l.street}{l.suite ? `, ${l.suite}` : ""}<br />{l.city}, {l.state} {l.zip}</address>
              <p className="mt-2"><a href={l.phoneHref} className="link-u text-[1.15rem] font-semibold text-ink">{l.phone}</a></p>
              <a href={l.maps} target="_blank" rel="noopener" className="link-u text-[.9rem]">Driving directions →</a>
              {l.mapEmbed && <div className="mt-5 aspect-[4/3] overflow-hidden rounded-lg"><iframe src={l.mapEmbed} title={`Map to ${l.name}`} loading="lazy" className="h-full w-full border-0" referrerPolicy="no-referrer-when-downgrade" /></div>}
            </section>
          ))}
        </div>
        <div className="mt-14 grid gap-14 border-t border-rule pt-12 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <h2 className="display text-[1.75rem]">Practice hours</h2>
            <ul className="m-0 mt-5 list-none p-0">{HOURS.map((h) => (<li key={h.days} className="flex justify-between gap-6 border-b border-rule py-2 text-[.95rem]"><span className="font-semibold">{h.days}</span><span className="text-ink-muted">{h.hours}</span></li>))}</ul>
            <h2 className="display mt-10 text-[1.75rem]">Email us anytime</h2>
            <p className="mt-3 text-ink-muted">Use the form to reach the office, or <Link href="/appointments/online">request an appointment online</Link>. For medical emergencies call 911.</p>
          </div>
          <div>
            <h2 className="display mb-6 text-[1.75rem]">Send a message</h2>
            <Form kind="contact" submitLabel="Send message" fields={[{ name: "name", label: "Name", required: true }, { name: "email", label: "Email", type: "email", required: true }, { name: "phone", label: "Phone", type: "tel" }, { name: "location", label: "Office", type: "select", options: LOCATIONS.map((l) => l.name) }, { name: "message", label: "Message", type: "textarea", required: true }]} />
          </div>
        </div>
      </div>
    </>
  );
}
