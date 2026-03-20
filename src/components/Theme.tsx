"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const lines = [
  "This portfolio is built on a single conviction —",
  "that the space between design and engineering",
  "is not a gap to be bridged, but a territory to be owned.",
  "",
  "Every interaction is intentional.",
  "Every animation carries weight.",
  "Stillness and motion coexist,",
  "because restraint is the hardest thing to design.",
  "",
  "Dark. Minimal. Alive.",
];

export default function Theme() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".theme-tag",
        { y: 20, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.6,
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
        }
      );
      gsap.fromTo(
        ".theme-version",
        { y: 20, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.6, delay: 0.1,
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
        }
      );
      gsap.fromTo(
        ".theme-heading",
        { rotateX: 65, opacity: 0, y: 30 },
        {
          rotateX: 0, opacity: 1, y: 0,
          duration: 1.1, ease: "power3.out", delay: 0.15,
          transformOrigin: "center bottom",
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
        }
      );
      gsap.fromTo(
        ".theme-line",
        { y: 24, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.65,
          stagger: 0.07,
          delay: 0.2,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="theme"
      className="w-full"
      style={{ paddingTop: "18rem", paddingBottom: "10rem" }}
    >
      <div className="max-w-5xl mx-auto px-6 md:px-16">
        {/* ヘッダー行 */}
        <div className="flex items-baseline justify-between mb-20">
          <span className="theme-tag inline-block text-[10px] tracking-[0.35em] uppercase text-white/40 border border-white/15 px-3 py-1.5 rounded-full">
            Theme
          </span>
          <span className="theme-version text-[10px] tracking-[0.3em] uppercase text-white/20">
            Ver 4.0 Cosmos
          </span>
        </div>

        {/* 見出し */}
        <h2 className="theme-heading text-5xl md:text-6xl font-black leading-tight tracking-tight mb-16" style={{ perspective: "600px" }}>
          Ver 4.0 Cosmos
          <br />
          <span className="text-black">Philosophy</span>
        </h2>

        {/* 本文 */}
        <div className="space-y-0 max-w-2xl">
          {lines.map((line, i) =>
            line === "" ? (
              <div key={i} className="theme-line h-6" />
            ) : (
              <p
                key={i}
                className="theme-line text-base md:text-lg leading-relaxed tracking-wide"
                style={{
                  color: i < 3
                    ? "rgba(248,248,246,0.65)"
                    : i < 8
                    ? "rgba(248,248,246,0.35)"
                    : "rgba(248,248,246,0.75)",
                  fontWeight: i === lines.length - 1 ? 700 : 300,
                  letterSpacing: i === lines.length - 1 ? "0.2em" : undefined,
                  fontSize: i === lines.length - 1 ? "0.85rem" : undefined,
                }}
              >
                {line}
              </p>
            )
          )}
        </div>

        {/* 区切りライン */}
        <div className="theme-line mt-20 h-px bg-white/[0.06]" />
        <p className="theme-line mt-6 text-[10px] tracking-[0.35em] uppercase text-white/15">
          Next.js · GSAP · Three.js · Framer Motion · TypeScript
        </p>
      </div>
    </section>
  );
}
