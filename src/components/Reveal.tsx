"use client";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";

/** Fade-up on scroll. Content is fully visible in SSR HTML (no-JS, crawlers, screenshots); the animation only arms after hydration. */
export default function Reveal({ children, delay = 0, className, as = "div" }: { children: ReactNode; delay?: number; className?: string; as?: "div" | "section" | "li" | "article" }) {
  const reduce = useReducedMotion();
  const [armed, setArmed] = useState(false);
  useEffect(() => { const t = requestAnimationFrame(() => setArmed(true)); return () => cancelAnimationFrame(t); }, []);
  const M = motion[as];
  return (
    <M
      className={className}
      initial={armed && !reduce ? { opacity: 0, y: 18 } : false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </M>
  );
}
