import Link from "next/link";
import JsonLd from "./JsonLd";
import { breadcrumbLd } from "@/lib/seo";

export type Crumb = { name: string; route: string };

export default function PageHeader({ eyebrow, title, lede, crumbs, bg }: { eyebrow?: string; title: string; lede?: string; crumbs: Crumb[]; bg?: string }) {
  const light = bg ? " text-white!" : "";
  return (
    <section className={"relative border-b border-rule" + (bg ? " min-h-[60svh] flex items-end" : "")}>
      {bg && (
        <>
          {/* LCP element on pages that pass a bg. eslint-disable-next-line @next/next/no-img-element */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={bg} alt="" aria-hidden="true" width={1600} height={829} fetchPriority="high" decoding="async" className="absolute inset-0 h-full w-full object-cover object-top" />
          <div className="hero-scrim absolute inset-0" aria-hidden="true" />
        </>
      )}
      <div className={"container-x relative w-full pb-12 pt-16 md:pt-20" + light}>
        <JsonLd data={{ "@context": "https://schema.org", ...breadcrumbLd(crumbs) }} />
        <nav aria-label="Breadcrumb" className={"mb-6 text-[.75rem] uppercase tracking-[.14em] " + (bg ? "text-white/70" : "text-ink-subtle")}>
          <ol className="m-0 flex list-none flex-wrap gap-x-2 p-0">
            {crumbs.map((c, i) => (
              <li key={c.route} className="flex items-center gap-2">
                {i < crumbs.length - 1 ? <Link href={c.route} className={"no-underline " + (bg ? "hover:text-white" : "hover:text-navy")}>{c.name}</Link> : <span aria-current="page" className={bg ? "text-white" : "text-ink"}>{c.name}</span>}
                {i < crumbs.length - 1 && <span aria-hidden="true" className="opacity-60">/</span>}
              </li>
            ))}
          </ol>
        </nav>
        {eyebrow && <p className={"eyebrow mb-4" + light}>{eyebrow}</p>}
        <h1 className={"display text-[clamp(2.5rem,5vw,4rem)]" + light}>{title}</h1>
        {lede && <p className={"mt-5 max-w-[70ch] text-[1.2rem] leading-[1.55] " + (bg ? "text-white/85" : "text-ink-muted")}>{lede}</p>}
      </div>
    </section>
  );
}
