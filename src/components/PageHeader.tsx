import Link from "next/link";
import JsonLd from "./JsonLd";
import { breadcrumbLd } from "@/lib/seo";

export type Crumb = { name: string; route: string };

export default function PageHeader({ eyebrow, title, lede, crumbs }: { eyebrow?: string; title: string; lede?: string; crumbs: Crumb[] }) {
  return (
    <section className="border-b border-rule">
      <div className="container-x pb-12 pt-16 md:pt-20">
        <JsonLd data={{ "@context": "https://schema.org", ...breadcrumbLd(crumbs) }} />
        <nav aria-label="Breadcrumb" className="mb-6 text-[.75rem] uppercase tracking-[.14em] text-ink-subtle">
          <ol className="m-0 flex list-none flex-wrap gap-x-2 p-0">
            {crumbs.map((c, i) => (
              <li key={c.route} className="flex items-center gap-2">
                {i < crumbs.length - 1 ? <Link href={c.route} className="no-underline hover:text-navy">{c.name}</Link> : <span aria-current="page" className="text-ink">{c.name}</span>}
                {i < crumbs.length - 1 && <span aria-hidden="true" className="opacity-60">/</span>}
              </li>
            ))}
          </ol>
        </nav>
        {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
        <h1 className="display text-[clamp(2.5rem,5vw,4rem)]">{title}</h1>
        {lede && <p className="mt-5 max-w-[70ch] text-[1.2rem] leading-[1.55] text-ink-muted">{lede}</p>}
      </div>
    </section>
  );
}
