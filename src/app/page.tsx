import Link from "next/link";
import HeroVideo from "@/components/HeroVideo";
import Reveal from "@/components/Reveal";
import SectionHead from "@/components/SectionHead";
import LocationsBlock from "@/components/LocationsBlock";
import YouTube from "@/components/YouTube";
import JsonLd from "@/components/JsonLd";
import { buildMetadata, graph, webPageLd, videoLd } from "@/lib/seo";
import { SITE, DOCTOR } from "@/lib/site";
import { childrenOf, excerpt } from "@/lib/content";
import testimonials from "../../content/testimonials.json";
import videos from "../../content/videos.json";

const HOME_TITLE = "HeartCare4life | Cardiologist Bonita, San Diego & Redding";
export const metadata = buildMetadata({
  title: HOME_TITLE,
  description: "Board-certified interventional cardiologist Dr. Vimal Nanavati, 32 years of experience. Offices in Bonita, North San Diego and Redding, CA. Telehealth available.",
  route: "/",
});

const FEATURED_SERVICES = [
  ["Echocardiography", "/services/transthoracic-echocardiography"],
  ["Electrocardiogram", "/services/electrocardiogram-ecg-ekg"],
  ["Stress Testing", "/services/advanced-stress-testing"],
  ["Venous Ablation", "/services/venous-ablation"],
  ["Vascular Ultrasound", "/services/vascular-ultrasound"],
  ["Holter Monitoring", "/services/holter-monitoring"],
];

const SPOTLIGHT = [
  { title: "Advanced Lipid Testing", href: "/services/advanced-lipid-testing", img: "/images/advanced-lipid-testing-hme.webp", body: "Evaluation of cardiovascular risk by measuring particle size, particle number, inflammation markers, and genetic contributors to cholesterol abnormalities. This comprehensive assessment helps identify hidden risks, personalize treatment plans, and guide targeted therapies to better prevent heart attack, stroke, and long-term cardiovascular disease." },
  { title: "Minimally Invasive Coronary Stenting", href: "/services/coronary-stenting", img: "/images/minimally-invasive-coronary-stenting-hme.webp", body: "Procedure used to open narrowed or blocked coronary arteries. A small mesh tube, called a stent, is placed to keep the artery open, restoring blood flow to the heart. It relieves chest pain, reduces heart attack risk, and improves overall cardiac function." },
  { title: "Structural Heart Procedures: Left Atrial Appendage Closure", href: "/services/left-atrial-appendage-closure", img: "/images/structural-heart-procedures-left-atrial-appendage-closure-hme.webp", body: "Left atrial appendage closure (LAAC) is a minimally invasive procedure that helps prevent strokes in patients with atrial fibrillation. A small device seals off a small heart pouch called the left atrial appendage, reducing the risk of blood clots. It's an alternative for patients who cannot take long-term blood thinners." },
];

const RISKS = [
  ["Family History", "A family history of heart disease can increase your risk of a heart attack. If close relatives have experienced cardiac conditions, especially at a younger age, it is important to discuss your family medical history with your doctor to better understand your personal risk."],
  ["High Blood Pressure", "High blood pressure places added strain on the heart and blood vessels, increasing the risk of heart attack over time. Monitoring your blood pressure regularly and managing it through lifestyle changes or medication can help protect your heart."],
  ["Diabetes", "Diabetes affects how the body processes sugar and can damage blood vessels that supply the heart. Poorly controlled blood sugar significantly raises heart attack risk, making proper diabetes management essential for long-term cardiovascular health."],
  ["High Saturated Fat & Cholesterol Diet", "A diet high in saturated fats and cholesterol can lead to plaque buildup in the arteries, restricting blood flow to the heart. Adopting heart-healthy eating habits can help reduce cholesterol levels and lower heart attack risk."],
  ["Sedentary Lifestyle", "A lack of physical activity can weaken the heart and contribute to weight gain and poor circulation. Regular exercise helps strengthen the heart, improve blood flow, and reduce the risk of heart attack."],
  ["Smoking", "Smoking damages blood vessels and reduces oxygen levels in the blood, increasing the likelihood of heart attack. Quitting smoking can rapidly improve heart health and significantly lower cardiovascular risk."],
  ["Narcotic Drugs", "The use of narcotic or illicit drugs can place extreme stress on the heart and disrupt normal rhythms. Avoiding drug use and seeking medical support when needed can greatly reduce the risk of sudden cardiac events."],
];

const FEATURED_VIDEOS = ["b1uK6R_Ih74", "GEiF1uwGybs", "NF6lm7kSKfQ", "MnpPWGvUZZs", "Dr6Q_bmgMM0"];

export default function Home() {
  const conditions = childrenOf("/conditions").slice(0, 6);
  const featured = testimonials.filter((t) => t.text.length > 200 && t.text.length < 700).slice(0, 3);
  const vids = FEATURED_VIDEOS.map((id) => videos.find((v) => v.id === id)!).filter(Boolean);
  return (
    <>
      <JsonLd data={graph(webPageLd({ route: "/", title: HOME_TITLE, description: SITE.description, type: "WebPage" }), ...vids.map(videoLd))} />
      <HeroVideo />

      {/* Welcome */}
      <section className="container-x pb-12 pt-16">
        <Reveal className="max-w-[76ch]">
          <p className="text-[1.15rem] leading-[1.65] text-ink">
            Welcome to HeartCare4life. Dr. Vimal Nanavati is a board-certified <Link href="/dr-vimal-nanavati">interventional cardiologist</Link> with 32 years of experience, caring for patients in <Link href="/locations#south-san-diego">Bonita (South San Diego)</Link>, <Link href="/locations#north-san-diego">North San Diego</Link> and <Link href="/locations#northern-california">Redding (Northern California)</Link>. We provide comprehensive in-office testing to get to the correct diagnosis, and minimally invasive treatment when it is needed.
          </p>
          <p className="mt-5 flex flex-wrap items-center gap-3 text-[.875rem] tracking-[.04em] text-ink-subtle">
            <span>Bonita · San Diego · Redding</span><span className="h-1 w-1 rounded-full bg-ink-subtle" />
            <a href="tel:+16195850476" className="link-u">(619) 585-0476</a><span className="h-1 w-1 rounded-full bg-ink-subtle" />
            <a href="tel:+15304335427" className="link-u">(530) 433-5427</a>
          </p>
          <div className="mt-10 h-px w-24 bg-ink/30" />
        </Reveal>
      </section>

      {/* Services */}
      <section className="container-x py-12">
        <SectionHead eyebrow="Our services" title="Advanced care for a healthier heart." lede="We provide comprehensive in-office testing to get to the correct diagnosis. Here are a few of the reasons patients choose HeartCare4life." />
        <ul className="m-0 grid list-none gap-x-10 gap-y-0 p-0 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURED_SERVICES.map(([label, href], i) => (
            <Reveal key={href} as="li" delay={i * 0.05} className="border-t border-rule">
              <Link href={href} className="group flex items-baseline justify-between py-4 font-serif text-[1.35rem] text-navy no-underline"><span className="group-hover:underline underline-offset-4">{label}</span><span aria-hidden="true" className="text-ink-subtle transition group-hover:translate-x-1">→</span></Link>
            </Reveal>
          ))}
        </ul>
        <Link href="/services" className="link-u mt-8 inline-block text-[.95rem]">Explore all services →</Link>
      </section>

      {/* Doctor */}
      <section className="border-y border-rule bg-cream-2">
        <div className="container-x grid items-center gap-12 py-16 md:grid-cols-[380px_minmax(0,1fr)]">
          <Reveal>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/dr-vimal-nanavati-hme.png" alt="Dr. Vimal Nanavati, board certified in cardiology and interventional cardiology" className="w-full rounded-lg" loading="lazy" width={760} height={950} />
          </Reveal>
          <Reveal delay={0.1}>
            <p className="eyebrow mb-4">Your cardiologist</p>
            <h2 className="display text-[clamp(2rem,3.6vw,3rem)]">Dr. Vimal Nanavati, MD, FACC</h2>
            <p className="mt-2 text-[.8rem] font-bold uppercase tracking-[.16em] text-navy">{DOCTOR.boardCertified}</p>
            <p className="mt-5 text-[1.0625rem] leading-relaxed text-ink-muted">Dr. Vimal Nanavati is an Interventional Invasive Cardiologist residing in Redding, California. He was recruited to Northern California from Ohio in 1997 to initiate a quality Cardiology Program for the people living on the Northern Coast of California, and today serves patients across Southern and Northern California and around the world.</p>
            <div className="mt-6 flex items-baseline gap-3"><span className="font-serif text-6xl text-navy">32</span><span className="text-ink-muted">years of <em className="font-serif italic">experience</em></span></div>
            <div className="mt-6 flex flex-wrap gap-3"><Link href="/dr-vimal-nanavati" className="btn-primary">View profile</Link><Link href="/appointments/online" className="btn-secondary">Book an appointment</Link></div>
          </Reveal>
        </div>
      </section>

      {/* Spotlight */}
      <section className="container-x py-16">
        <SectionHead eyebrow="Interventional & preventive cardiology" title="Three things patients ask about most." />
        <div className="grid gap-10 md:grid-cols-3">
          {SPOTLIGHT.map((s, i) => (
            <Reveal key={s.href} as="article" delay={i * 0.08} className="flex flex-col border-t border-rule-strong pt-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s.img} alt={s.title} className="mb-5 aspect-[4/3] w-full rounded-lg object-cover" loading="lazy" />
              <h3 className="m-0 font-serif text-[1.5rem] font-normal leading-tight text-navy"><Link href={s.href} className="no-underline hover:underline underline-offset-4">{s.title}</Link></h3>
              <p className="mb-5 mt-3 flex-1 text-[.95rem] leading-relaxed text-ink-muted">{s.body}</p>
              <Link href={s.href} className="link-u text-[.875rem]">Know more →</Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Conditions */}
      <section className="border-t border-rule">
        <div className="container-x py-16">
          <SectionHead eyebrow="Conditions" title="What we see most." lede="Clear, plain-language explanations of the heart conditions Dr. Nanavati diagnoses and treats every day." />
          <div className="grid gap-x-10 md:grid-cols-2">
            {conditions.map((c, i) => (
              <Reveal key={c.route} delay={i * 0.04} className="grid gap-2 border-t border-rule py-5 sm:grid-cols-[220px_minmax(0,1fr)] sm:gap-8">
                <h3 className="m-0 font-serif text-[1.25rem] font-normal text-navy"><Link href={c.route} className="no-underline hover:underline underline-offset-4">{c.h1}</Link></h3>
                <p className="m-0 text-[.95rem] leading-relaxed text-ink-muted">{excerpt(c, 150)}</p>
              </Reveal>
            ))}
          </div>
          <Link href="/conditions" className="link-u mt-8 inline-block text-[.95rem]">All conditions →</Link>
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-t border-rule bg-cream-2">
        <div className="container-x py-16">
          <SectionHead eyebrow="Testimonials" title="Happy patients." lede="Five-star reviews from Google, Healthgrades, Zocdoc and patients who wrote to us directly." />
          <div className="grid gap-8 md:grid-cols-3">
            {featured.map((t, i) => (
              <Reveal key={i} as="article" delay={i * 0.08} className="flex flex-col border-t border-rule-strong pt-6">
                <p className="mb-3 text-navy" aria-label={`${t.stars} out of 5 stars`}>{"★".repeat(t.stars)}</p>
                <blockquote className="m-0 flex-1 font-serif text-[1.15rem] italic leading-snug text-ink">“{t.text.length > 320 ? t.text.slice(0, 320).replace(/\s\S*$/, "") + "…" : t.text}”</blockquote>
                <p className="mb-0 mt-4 text-[.8rem] uppercase tracking-[.14em] text-ink-subtle">~ {t.name || "Patient"} · {t.source}</p>
              </Reveal>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-6"><Link href="/testimonials" className="link-u text-[.95rem]">View all testimonials →</Link><Link href="/testimonials/submit" className="link-u text-[.95rem]">Submit a testimonial →</Link></div>
        </div>
      </section>

      {/* Risk factors */}
      <section className="container-x py-16">
        <SectionHead eyebrow="Prevention" title="Seven risk factors for heart attack." />
        <dl className="m-0 grid gap-x-10 md:grid-cols-2">
          {RISKS.map(([t, b], i) => (
            <Reveal key={t} delay={i * 0.04} className="border-t border-rule py-5">
              <dt className="font-serif text-[1.25rem] text-navy">{t}</dt>
              <dd className="m-0 mt-1.5 text-[.95rem] leading-relaxed text-ink-muted">{b}</dd>
            </Reveal>
          ))}
        </dl>
        <Link href="/seven-risk-factors-for-heart-attack" className="link-u mt-8 inline-block text-[.95rem]">Know more →</Link>
      </section>

      {/* Videos */}
      <section className="border-t border-rule">
        <div className="container-x py-16">
          <SectionHead eyebrow="Featured videos" title="Helpful videos." lede="Discover our featured interviews, talks, and educational content about cardiovascular health and innovative treatments." />
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {vids.map((v, i) => (
              <Reveal key={v.id} as="article" delay={i * 0.06}>
                <YouTube id={v.id} title={v.title} />
                <h3 className="mt-3 font-serif text-[1.15rem] font-normal leading-snug text-navy">{v.title}</h3>
              </Reveal>
            ))}
          </div>
          <Link href="/videos" className="link-u mt-8 inline-block text-[.95rem]">Watch more videos →</Link>
        </div>
      </section>

      {/* Patient info */}
      <section className="border-t border-rule bg-cream-2">
        <div className="container-x py-16">
          <SectionHead eyebrow="Patient info" title="Education & resources." />
          <ul className="m-0 grid list-none gap-x-10 p-0 sm:grid-cols-2 lg:grid-cols-4">
            {[["Patient Forms & Downloads", "/patient-info/patient-forms"], ["Patient Education Videos", "/patient-info/patient-education-videos"], ["Bill Payment Options", "/patient-info/bill-payment"], ["Medical Insurance Information", "/patient-info/insurance"]].map(([l, h]) => (
              <li key={h} className="border-t border-rule"><Link href={h} className="group flex items-baseline justify-between py-4 font-serif text-[1.2rem] text-navy no-underline"><span className="group-hover:underline underline-offset-4">{l}</span><span aria-hidden="true">→</span></Link></li>
            ))}
          </ul>
        </div>
      </section>

      <LocationsBlock />
    </>
  );
}
