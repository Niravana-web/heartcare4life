import Link from "next/link";
import { REVIEWED } from "@/lib/site";

export default function AuthorBlock() {
  return (
    <aside className="mt-12 flex gap-4 rounded border-l-[3px] border-navy bg-navy/5 p-6" aria-label="About the author">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/dr-vimal-nanavati-sb.jpg" alt="Dr. Vimal Nanavati" className="h-14 w-14 shrink-0 rounded-full object-cover object-top" loading="lazy" width={56} height={56} />
      <div className="text-[.9rem] leading-relaxed">
        <p className="m-0 font-bold">Written and medically reviewed by <Link href="/dr-vimal-nanavati">Dr. Vimal Nanavati, MD, FACC</Link></p>
        <p className="m-0 mt-1 text-[.8rem] font-bold uppercase tracking-[.06em] text-navy">Board Certified in Cardiology and Interventional Cardiology</p>
        <p className="m-0 mt-1 text-ink-muted">Last reviewed {new Date(REVIEWED).toLocaleDateString("en-US", { year: "numeric", month: "long" })}. 32 years of clinical experience. Founder of HeartCare4life (Advanced Heart Care, Inc.), practicing in Bonita, San Diego and Redding, California.</p>
        <p className="m-0 mt-2 text-[.8rem] text-ink-subtle">This page is for general education and is not a substitute for a consultation. See our <Link href="/disclaimer">medical disclaimer</Link>. If you think you are having a heart attack, call 911.</p>
      </div>
    </aside>
  );
}
