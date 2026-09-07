import Link from "next/link";
import { LOCATIONS } from "@/lib/site";

/**
 * Fixed tap-to-call bar, mobile only. A phone call is the primary conversion for
 * this practice and the header numbers scroll away, so this keeps one always in reach.
 * Body gets bottom padding via .has-callbar so it never covers the footer.
 */
export default function CallBar() {
  const [south, redding] = [LOCATIONS[0], LOCATIONS.find((l) => l.id === "northern-california") ?? LOCATIONS[1]];
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-rule-strong bg-cream-2/95 backdrop-blur-sm lg:hidden print:hidden">
      <div className="flex items-stretch gap-px">
        <a
          href={south.phoneHref}
          className="flex min-h-[52px] flex-1 flex-col items-center justify-center gap-0.5 px-3 py-2 text-navy no-underline"
        >
          <span className="text-[.62rem] uppercase tracking-[.12em] text-ink-subtle">{south.shortName}</span>
          <span className="text-[.9rem] font-semibold">{south.phone}</span>
        </a>
        <a
          href={redding.phoneHref}
          className="flex min-h-[52px] flex-1 flex-col items-center justify-center gap-0.5 border-x border-rule px-3 py-2 text-navy no-underline"
        >
          <span className="text-[.62rem] uppercase tracking-[.12em] text-ink-subtle">{redding.shortName}</span>
          <span className="text-[.9rem] font-semibold">{redding.phone}</span>
        </a>
        <Link
          href="/appointments/online"
          className="flex min-h-[52px] flex-1 items-center justify-center bg-navy px-3 py-2 text-[.78rem] font-semibold uppercase tracking-[.1em] text-cream no-underline"
        >
          Book
        </Link>
      </div>
    </div>
  );
}
