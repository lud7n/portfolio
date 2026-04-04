"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ArticlesHeader({ count }: { count: number }) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    gsap.to(el, {
      yPercent: -25,
      opacity: 0.2,
      ease: "none",
      scrollTrigger: {
        trigger: el,
        start: "top top",
        end: "bottom top",
        scrub: 1.2,
      },
    });

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  return (
    <div ref={sectionRef}>
      <div className="flex items-baseline justify-between mb-20">
        <span className="inline-block text-[10px] tracking-[0.35em] uppercase text-white/40 border border-white/15 px-3 py-1.5 rounded-full">
          Articles
        </span>
        <span className="text-[10px] tracking-[0.3em] uppercase text-white/20">
          {count} posts
        </span>
      </div>

      <h1 className="text-5xl md:text-6xl font-black leading-tight tracking-tight mb-20">
        Writing &{" "}
        <span className="text-indigo-400">Thinking</span>
      </h1>
    </div>
  );
}
