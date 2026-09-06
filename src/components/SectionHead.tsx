export default function SectionHead({ eyebrow, title, lede, center = false }: { eyebrow?: string; title: string; lede?: string; center?: boolean }) {
  return (
    <div className={`mb-10 max-w-[60ch] ${center ? "mx-auto text-center" : ""}`}>
      {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
      <h2 className="display text-[clamp(2rem,3.6vw,3rem)] leading-[1.1]">{title}</h2>
      {lede && <p className="mt-5 text-[1.0625rem] leading-relaxed text-ink-muted">{lede}</p>}
    </div>
  );
}
