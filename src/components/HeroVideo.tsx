"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const CLIPS = [
  { u: "/video/new-banner-video.mp4", c: "HeartCare4life" },
  { u: "https://videos.pexels.com/video-files/11458070/11458070-hd_1920_1080_25fps.mp4", c: "La Jolla Cove, San Diego" },
  { u: "https://videos.pexels.com/video-files/13149719/13149719-hd_1920_1080_24fps.mp4", c: "Coronado Bridge, San Diego" },
  { u: "https://videos.pexels.com/video-files/9701851/9701851-hd_1920_1080_25fps.mp4", c: "Balboa Park, San Diego" },
];
const MAX = 12000, START_TIMEOUT = 8000;

export default function HeroVideo() {
  const a = useRef<HTMLVideoElement>(null);
  const b = useRef<HTMLVideoElement>(null);
  const [credit, setCredit] = useState(CLIPS[0].c);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const A = a.current, B = b.current; if (!A || !B) return;
    const idx = 0; let cur: HTMLVideoElement | null = null, timer = 0, failures = 0, dead = false;
    const src = (i: number) => CLIPS[((i % CLIPS.length) + CLIPS.length) % CLIPS.length];
    const start = (v: HTMLVideoElement, i: number) => {
      if (dead || failures >= CLIPS.length) return;
      let done = false;
      const ok = () => {
        if (done) return; done = true; v.removeEventListener("playing", ok); window.clearTimeout(to);
        failures = 0; v.classList.add("playing"); if (cur && cur !== v) cur.classList.remove("playing"); cur = v; setCredit(src(i).c);
        timer = window.setTimeout(() => start(v === A ? B : A, i + 1), MAX);
      };
      const fail = () => { if (done) return; done = true; v.removeEventListener("playing", ok); failures++; start(v, i + 1); };
      const to = window.setTimeout(fail, START_TIMEOUT);
      v.addEventListener("playing", ok); v.onerror = fail;
      v.src = src(i).u; v.load(); v.play().catch(fail);
    };
    start(A, idx);
    return () => { dead = true; window.clearTimeout(timer); };
  }, []);

  return (
    <section className="relative h-[68vh] max-h-[720px] min-h-[440px] overflow-hidden bg-navy-2" aria-label="Welcome">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/hero-poster.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" aria-hidden="true" />
      <video ref={a} muted playsInline preload="auto" className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-[1400ms] [&.playing]:opacity-100" />
      <video ref={b} muted playsInline preload="auto" className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-[1400ms] [&.playing]:opacity-100" />
      <div className="hero-scrim absolute inset-0" />
      <div className="container-x relative flex h-full flex-col justify-end pb-14">
        <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, delay: .1 }} className="mb-4 text-[.72rem] font-semibold uppercase tracking-[.22em] text-[#d6cdb4]">Board-certified interventional cardiologist<span className="hidden sm:inline"> · Bonita · San Diego · Redding</span></motion.p>
        <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .9, delay: .2 }} className="m-0 font-serif text-[clamp(2.1rem,5vw,4rem)] font-medium leading-[1.04] text-[#f6f1e4]">Delivering Compassionate Heart Care Across California</motion.h1>
        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .9, delay: .35 }} className="mt-3.5 max-w-[34em] font-serif text-[clamp(1.15rem,2.2vw,1.5rem)] italic text-[#ded6c0]">Dr. Vimal Nanavati, MD, FACC — 32 years of cardiology and interventional cardiology, one patient at a time.</motion.p>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .9, delay: .55 }} className="mt-7 flex flex-wrap gap-3">
          <Link href="/appointments/online" className="btn-primary">Book an appointment</Link>
          <Link href="/services" className="btn-secondary border-[#f6f1e4]/70 text-[#f6f1e4] hover:bg-[#f6f1e4] hover:text-navy">Explore services</Link>
        </motion.div>
        <p className="absolute bottom-[18px] right-8 m-0 text-[.66rem] font-semibold uppercase tracking-[.18em] text-[#f6f1e48c]" aria-live="polite">{credit}</p>
      </div>
    </section>
  );
}
