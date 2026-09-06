import Link from "next/link";
import { LOCATIONS } from "@/lib/site";

export default function Cta({ title = "Ready to take care of your heart?", body = "Call the office nearest you or request an appointment online. Dr. Nanavati sees one patient at a time, and every visit starts with listening." }: { title?: string; body?: string }) {
  return (
    <section className="container-x py-16">
      <div className="mx-auto max-w-[62ch] text-center">
        <p className="eyebrow mb-4">Appointments</p>
        <h2 className="display text-[clamp(2rem,3.6vw,3rem)]">{title}</h2>
        <p className="mt-5 text-[1.0625rem] leading-relaxed text-ink-muted">{body}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/appointments/online" className="btn-primary">Request an appointment</Link>
          <a href={LOCATIONS[0].phoneHref} className="btn-secondary">Call {LOCATIONS[0].shortName} {LOCATIONS[0].phone}</a>
          <a href={LOCATIONS[1].phoneHref} className="btn-secondary">Call {LOCATIONS[1].shortName} {LOCATIONS[1].phone}</a>
        </div>
      </div>
    </section>
  );
}
