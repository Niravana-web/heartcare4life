import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { allPages } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { SECTION_META } from "@/lib/routes";

export const metadata = buildMetadata({ title: "Sitemap", description: "Every page on heartcare4life.com: services, conditions, treatments, appointments, patient information, media and contact for Dr. Vimal Nanavati.", route: "/site-map" });
const EXTRA = [["/", "Home"], ["/testimonials", "Patient Testimonials"], ["/testimonials/submit", "Submit a Testimonial"], ["/videos", "Videos"], ["/news", "In the News"], ["/contact", "Contact Us"], ["/locations", "Practice Locations"], ["/appointments/online", "Online Appointment"], ["/appointments/general", "General Appointment"], ["/faqs", "FAQs"], ["/feedback", "Feedback"], ["/tell-a-friend", "Tell a Friend"], ["/media", "Media"], ["/patient-info", "Patient Info"]];

export default function SiteMap() {
  const pages = allPages();
  const groups = new Map<string, { route: string; name: string }[]>();
  for (const [r, n] of EXTRA) groups.set("General", [...(groups.get("General") ?? []), { route: r, name: n }]);
  for (const p of pages) {
    const key = SECTION_META[p.section]?.name ?? "General";
    if (groups.get(key)?.some((x) => x.route === p.route)) continue;
    groups.set(key, [...(groups.get(key) ?? []), { route: p.route, name: p.h1 }]);
  }
  return (
    <>
      <PageHeader title="Sitemap" crumbs={[{ name: "Home", route: "/" }, { name: "Sitemap", route: "/site-map" }]} />
      <div className="container-x grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-3">
        {[...groups.entries()].map(([g, items]) => (
          <section key={g}><h2 className="display mb-4 border-b border-ink pb-2 text-[1.5rem]">{g}</h2><ul className="m-0 list-none p-0">{items.sort((a, b) => a.name.localeCompare(b.name)).map((i) => (<li key={i.route} className="py-1"><Link href={i.route} className="no-underline hover:underline underline-offset-4">{i.name}</Link></li>))}</ul></section>
        ))}
      </div>
    </>
  );
}
