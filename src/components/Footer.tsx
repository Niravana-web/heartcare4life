import Link from "next/link";
import { SITE, LOCATIONS, HOURS } from "@/lib/site";

const social = [
  { k: "facebook", label: "Facebook", href: SITE.social.facebook, d: "M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.7-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12Z" },
  { k: "x", label: "X (Twitter)", href: SITE.social.x, d: "M18.9 1.6h3.7l-8.1 9.2L24 22.4h-7.4l-5.9-7.6-6.6 7.6H.4l8.6-9.9L0 1.6h7.6l5.3 7 6-7Zm-1.3 18.6h2L6.5 3.7H4.3l13.3 16.5Z" },
  { k: "linkedin", label: "LinkedIn", href: SITE.social.linkedin, d: "M5 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.5h4V21H3V9.5Zm6.5 0h3.8v1.6h.1a4.2 4.2 0 0 1 3.8-2.1c4 0 4.8 2.6 4.8 6V21h-4v-5.3c0-1.3 0-2.9-1.8-2.9s-2 1.4-2 2.8V21h-4V9.5Z" },
  { k: "instagram", label: "Instagram", href: SITE.social.instagram, d: "M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 8.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4ZM17.4 5.4a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4ZM12 3c2.4 0 2.7 0 3.7.1 2.4.1 3.6 1.3 3.7 3.7.1 1 .1 1.2.1 3.7s0 2.7-.1 3.7c-.1 2.4-1.3 3.6-3.7 3.7-1 .1-1.2.1-3.7.1s-2.7 0-3.7-.1c-2.4-.1-3.6-1.3-3.7-3.7C4.5 14.2 4.5 14 4.5 12s0-2.7.1-3.7c.1-2.4 1.3-3.6 3.7-3.7C9.3 4.5 9.6 4.5 12 4.5ZM12 3c-2.4 0-2.8 0-3.7.1C5 3.2 3.2 5 3.1 8.3 3 9.2 3 9.6 3 12s0 2.8.1 3.7c.1 3.3 1.9 5.1 5.2 5.2.9.1 1.3.1 3.7.1s2.8 0 3.7-.1c3.3-.1 5.1-1.9 5.2-5.2.1-.9.1-1.3.1-3.7s0-2.8-.1-3.7c-.1-3.3-1.9-5.1-5.2-5.2C14.8 3 14.4 3 12 3Z" },
  { k: "youtube", label: "YouTube", href: SITE.social.youtube, d: "M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.3 3.6-6.3 3.6Z" },
];

const legal = [
  { label: "Disclaimer", href: "/disclaimer" },
  { label: "Privacy", href: "/privacy" },
  { label: "Accessibility", href: "/accessibility-statement" },
  { label: "Open Payments Database", href: "/open-payments-database" },
  { label: "Sitemap", href: "/site-map" },
  { label: "Feedback", href: "/feedback" },
  { label: "Tell a Friend", href: "/tell-a-friend" },
];

export default function Footer() {
  return (
    <footer className="mt-20 bg-navy font-sans text-[#f4eee0b8]">
      <div className="container-x">
        <div className="grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="m-0 mb-3.5 font-serif text-[1.35rem] font-medium uppercase tracking-[.14em] text-[#f4eee0]">HeartCare4life</p>
            <p className="m-0 max-w-[52ch] text-[.85rem] leading-[1.65] text-[#f4eee099]">
              Dr. Vimal Nanavati, MD, FACC — {SITE.tagline}. Advanced Heart Care, Inc. serves patients in Bonita and North San Diego (South &amp; North San Diego County), Redding (Northern California), and worldwide through telehealth consultations.
            </p>
            <p className="mb-4 mt-6 text-[.78rem] font-bold uppercase tracking-[.14em] text-[#dce0e8]">Let&apos;s connect</p>
            <ul className="m-0 flex list-none flex-wrap gap-[9px] p-0">
              {social.map((s) => (
                <li key={s.k}>
                  <a href={s.href} target="_blank" rel="noopener" aria-label={s.label} className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 text-white transition hover:-translate-y-px hover:border-white/60 hover:bg-white/15">
                    <svg viewBox="0 0 24 24" className="h-[17px] w-[17px] fill-current" aria-hidden="true"><path d={s.d} /></svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-4 text-[.78rem] font-bold uppercase tracking-[.14em] text-[#dce0e8]">Office locations</p>
            <ul className="m-0 list-none space-y-4 p-0 text-[.85rem] leading-relaxed">
              {LOCATIONS.map((l) => (
                <li key={l.id}>
                  <Link href={`/locations/${l.id}`} className="inline-block py-1 font-semibold text-[#f4eee0] no-underline hover:underline">{l.name}</Link><br />
                  <a href={l.maps} target="_blank" rel="noopener" className="inline-block py-1 text-[#f4eee0b8] no-underline hover:text-white">{l.street}{l.suite ? `, ${l.suite}` : ""}, {l.city}, {l.state} {l.zip}</a><br />
                  <a href={l.phoneHref} className="inline-block py-1 text-[#f4eee0] no-underline hover:underline">{l.phone}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-4 text-[.78rem] font-bold uppercase tracking-[.14em] text-[#dce0e8]">Practice hours</p>
            <ul className="m-0 list-none space-y-1.5 p-0 text-[.85rem]">
              {HOURS.map((h) => (<li key={h.days}><span className="text-[#f4eee0]">{h.days}:</span> {h.hours}</li>))}
            </ul>
            <p className="mb-4 mt-6 text-[.78rem] font-bold uppercase tracking-[.14em] text-[#dce0e8]">Quick links</p>
            <ul className="m-0 grid list-none grid-cols-2 gap-x-4 gap-y-1.5 p-0 text-[.85rem]">
              {[["Services", "/services"], ["Conditions", "/conditions"], ["Treatments", "/treatments"], ["Videos", "/videos"], ["Testimonials", "/testimonials"], ["Telehealth", "/appointments/telehealth"], ["Book online", "/appointments/online"], ["Contact", "/contact"]].map(([l, h]) => (
                <li key={h}><Link href={h} className="text-[#f4eee0bf] no-underline hover:text-white hover:underline">{l}</Link></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-white/10 py-7 text-[.84rem] text-[#f4eee099]">
          <span className="basis-full text-[.78rem] text-[#f4eee0b3]">Information on this website is for general education only and does not replace medical advice from your physician. If you are experiencing a medical emergency, call 911.</span>
          <span>© {new Date().getFullYear()} HeartCare4life · Advanced Heart Care, Inc. · Dr. Vimal Nanavati</span>
          <span className="opacity-50">·</span>
          {legal.map((l, i) => (
            <span key={l.href} className="inline-flex items-center gap-3">
              <Link href={l.href} className="text-[#f4eee0bf] no-underline hover:text-white hover:underline">{l.label}</Link>
              {i < legal.length - 1 && <span className="opacity-50">·</span>}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}
