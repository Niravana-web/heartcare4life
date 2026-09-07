"use client";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { NAV, UTILITY_NAV, LOCATIONS, SITE } from "@/lib/site";

export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="bg-cream">
      <div className="bg-navy text-[.78rem] tracking-[.06em] text-[#f4eee0b8]">
        <div className="container-x flex min-h-8 flex-wrap items-center justify-center gap-x-5 gap-y-1 py-1 sm:justify-end">
          {UTILITY_NAV.map((u) => (
            <Link key={u.href} href={u.href} className="flex min-h-[44px] items-center py-2 uppercase hover:text-white hover:underline underline-offset-4">{u.label}</Link>
          ))}
          <span className="hidden sm:inline opacity-40">|</span>
          {LOCATIONS.slice(0, 2).map((l) => (
            <a key={l.id} href={l.phoneHref} className="flex min-h-[44px] items-center whitespace-nowrap py-2 hover:text-white"><span className="opacity-70">{l.shortName}</span> <strong className="font-semibold text-[#f4eee0]">{l.phone}</strong></a>
          ))}
        </div>
      </div>

      <div className="px-6 pb-[26px] pt-8 text-center">
        <p className="m-0 mb-2.5 text-[.69rem] uppercase tracking-[.34em] text-ink-subtle">heartcare4life.com</p>
        <Link href="/" className="font-serif text-[clamp(1.6rem,3vw,2.1rem)] font-medium uppercase tracking-[.14em] text-navy no-underline">HeartCare4life</Link>
        <p className="mt-3 text-[.72rem] uppercase tracking-[.22em] text-ink-subtle">
          Dr. Vimal Nanavati <span className="mx-2 opacity-70">·</span> {SITE.tagline}
        </p>
        <p className="mt-1.5 text-[.72rem] uppercase tracking-[.22em] text-ink-subtle">
          <Link href="/locations#south-san-diego" className="hover:text-navy">Bonita</Link>
          <span className="mx-2 opacity-70">·</span>
          <Link href="/locations#north-san-diego" className="hover:text-navy">San Diego</Link>
          <span className="mx-2 opacity-70">·</span>
          <Link href="/locations#northern-california" className="hover:text-navy">Redding, California</Link>
        </p>
      </div>

      <div className="navbar-blur sticky top-0 z-50 border-y border-rule">
        <div className="container-x relative flex min-h-[50px] items-center justify-center">
          <button
            className="-ml-2 flex h-11 w-11 cursor-pointer items-center justify-center text-navy lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M3 12h18M3 18h18" /></svg>
          </button>
          <nav aria-label="Primary" className="hidden lg:flex flex-wrap items-center justify-center gap-x-[30px]">
            {NAV.map((n) => (
              <div key={n.href} className="group relative">
                <Link href={n.href} className="inline-block border-b border-transparent py-2 text-[.69rem] font-semibold uppercase tracking-[.18em] text-ink no-underline hover:border-rule-strong hover:text-navy">{n.label}</Link>
                {n.children && (
                  <div className="invisible absolute left-1/2 top-full z-50 min-w-[240px] -translate-x-1/2 border border-rule bg-cream-2 p-2 opacity-0 shadow-sm transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                    {n.children.map((c) => (
                      <Link key={c.href} href={c.href} className="block px-3 py-2 text-[.72rem] uppercase tracking-[.12em] text-ink hover:bg-cream hover:text-navy">{c.label}</Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
          <AnimatePresence>
            {open && (
              <motion.nav
                aria-label="Mobile"
                initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                className="absolute left-0 right-0 top-full flex flex-col gap-1 border-b border-rule bg-cream p-6 lg:hidden"
              >
                {NAV.flatMap((n) => [n, ...(n.children ?? []).filter((c) => c.href !== n.href)]).map((n, i) => (
                  <Link key={n.href + i} href={n.href} onClick={() => setOpen(false)} className={`flex min-h-[44px] items-center text-[.8rem] font-semibold uppercase tracking-[.16em] ${"children" in n ? "text-navy" : "pl-4 text-ink-muted"}`}>{n.label}</Link>
                ))}
                {UTILITY_NAV.map((u) => (
                  <Link key={u.href} href={u.href} onClick={() => setOpen(false)} className="flex min-h-[44px] items-center text-[.8rem] font-semibold uppercase tracking-[.16em] text-navy">{u.label}</Link>
                ))}
              </motion.nav>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
