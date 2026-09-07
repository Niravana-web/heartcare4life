import Link from "next/link";
import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import Cta from "@/components/Cta";
import LocationsBlock from "@/components/LocationsBlock";

export const metadata: Metadata = {
  title: { absolute: "Page Not Found | HeartCare4life" },
  description: "That page could not be found. Browse our cardiology services, conditions and office locations, or call to reach Dr. Vimal Nanavati's team.",
  robots: { index: false, follow: true },
};

const PLACES = [
  ["Cardiology services", "/services", "Diagnostic testing and interventional procedures."],
  ["Heart conditions", "/conditions", "What we diagnose and treat, in plain language."],
  ["Compare your options", "/compare", "Side-by-side guides to common heart procedures and tests."],
  ["Office locations", "/locations", "Bonita, North San Diego and Redding, California."],
  ["Book an appointment", "/appointments/online", "Request a visit or a telehealth second opinion."],
  ["Questions we hear often", "/faqs", "Insurance, referrals, telehealth and what to expect."],
];

export default function NotFound() {
  return (
    <>
      <PageHeader
        eyebrow="Error 404"
        title="We could not find that page"
        lede="The link may be out of date, or the address may have a typo. Here is where most people go next."
        crumbs={[{ name: "Home", route: "/" }, { name: "Page not found", route: "/404" }]}
      />
      <div className="container-x grid gap-8 py-14 sm:grid-cols-2 lg:grid-cols-3">
        {PLACES.map(([label, href, blurb]) => (
          <article key={href} className="border-t border-rule-strong pt-5">
            <h2 className="m-0 font-serif text-[1.4rem] font-normal text-navy">
              <Link href={href} className="no-underline hover:underline underline-offset-4">{label}</Link>
            </h2>
            <p className="mb-4 mt-2 text-[.95rem] leading-relaxed text-ink-muted">{blurb}</p>
            <Link href={href} className="link-u text-[.875rem]">Open →</Link>
          </article>
        ))}
      </div>
      <Cta />
      <LocationsBlock compact />
    </>
  );
}
