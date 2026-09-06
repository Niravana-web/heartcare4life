import Link from "next/link";
import { LOCATIONS, HOURS } from "@/lib/site";
import Reveal from "./Reveal";

export default function LocationsBlock({ compact = false }: { compact?: boolean }) {
  return (
    <section className="border-t border-rule" aria-labelledby="locations-heading">
      <div className="container-x py-16">
        <div className="mb-10 max-w-[60ch]">
          <p className="eyebrow mb-4">Office locations</p>
          <h2 id="locations-heading" className="display text-[clamp(2rem,3.6vw,3rem)]">Schedule your appointment today.</h2>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {LOCATIONS.map((l, i) => (
            <Reveal key={l.id} delay={i * 0.08} className="border-t border-rule-strong pt-6">
              <h3 className="m-0 font-serif text-[1.35rem] font-medium text-navy"><Link href={`/locations/${l.id}`} className="no-underline hover:underline underline-offset-4">{l.name}</Link></h3>
              <address className="mt-3 text-[.95rem] not-italic leading-relaxed text-ink-muted">
                <a href={l.maps} target="_blank" rel="noopener" className="no-underline hover:text-navy">{l.street}{l.suite ? `, ${l.suite}` : ""}<br />{l.city}, {l.state} {l.zip}</a><br />
                <a href={l.phoneHref} className="link-u mt-1 inline-block font-semibold text-ink">{l.phone}</a>
              </address>
              <Link href="/appointments/online" className="link-u mt-4 inline-block text-[.875rem]">Book an appointment →</Link>
            </Reveal>
          ))}
        </div>
        {!compact && (
          <div className="mt-12 grid gap-8 border-t border-rule pt-8 md:grid-cols-2">
            <div>
              <p className="eyebrow mb-3">Practice hours</p>
              <ul className="m-0 list-none p-0 text-[.95rem] leading-relaxed">
                {HOURS.map((h) => (<li key={h.days} className="flex justify-between gap-6 border-b border-rule py-2"><span className="font-semibold">{h.days}</span><span className="text-ink-muted">{h.hours}</span></li>))}
              </ul>
            </div>
            <div>
              <p className="eyebrow mb-3">Expert consultation, any time, anywhere</p>
              <p className="text-[1.0625rem] leading-relaxed text-ink-muted">International and out-of-area patients can request a virtual second-opinion consultation with Dr. Nanavati.</p>
              <Link href="/appointments/telehealth" className="btn-secondary mt-4">Request a virtual consultation</Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
