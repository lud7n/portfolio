"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scatterChars } from "@/lib/scatterChars";

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
    if (sectionRef.current) scatterChars(sectionRef.current, "theme-char");

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
        { x: -280, opacity: 0 },
        {
          x: 0, opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            end: "top 25%",
            scrub: 1.2,
          },
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

      // タイムライン: ラベル → 縦線描画 → ドット+アイテム スタガー
      gsap.fromTo(
        ".theme-archive-label",
        { opacity: 0, y: 10 },
        {
          opacity: 1, y: 0, duration: 0.5,
          scrollTrigger: { trigger: sectionRef.current, start: "top 78%" },
        }
      );
      gsap.fromTo(
        ".theme-timeline-line",
        { scaleY: 0 },
        {
          scaleY: 1, duration: 0.7, ease: "power2.inOut", delay: 0.2,
          scrollTrigger: { trigger: sectionRef.current, start: "top 78%" },
        }
      );
      gsap.fromTo(
        ".theme-timeline-dot",
        { scale: 0, opacity: 0 },
        {
          scale: 1, opacity: 1, duration: 0.3, stagger: 0.15, delay: 0.55,
          ease: "back.out(2)",
          scrollTrigger: { trigger: sectionRef.current, start: "top 78%" },
        }
      );
      gsap.fromTo(
        ".theme-timeline-item",
        { x: -16, opacity: 0 },
        {
          x: 0, opacity: 0.6, duration: 0.45, stagger: 0.15, delay: 0.6,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 78%" },
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
      style={{ paddingTop: "14rem", paddingBottom: "8rem" }}
    >
      <div className="max-w-5xl mx-auto" style={{ paddingLeft: "clamp(2rem, 5vw, 5rem)", paddingRight: "clamp(2rem, 5vw, 5rem)" }}>
        {/* ヘッダー行 */}
        <div className="flex items-baseline justify-between mb-20">
          <span className="theme-version text-[10px] tracking-[0.3em] uppercase text-white/20">
            Ver 4.0 Cosmos
          </span>
        </div>

        {/* バージョンアーカイブ タイムライン */}
        <div className="mb-12">
          <p className="theme-archive-label text-[9px] tracking-[0.4em] uppercase text-white/20 mb-6">Archive</p>
          <div className="relative" style={{ paddingLeft: "1.25rem" }}>
            {/* 縦線（scaleY アニメーション用） */}
            <div
              className="theme-timeline-line absolute left-0 top-0 bottom-0 w-px bg-white/[0.08]"
              style={{ transformOrigin: "top", scaleY: 0 } as React.CSSProperties}
            />

            {[
              { ver: "Ver 1.0", href: "https://lud7n.github.io/lud7n.site.old/" },
              { ver: "Ver 2.0", href: "https://lud7n.github.io/lud7n.site/#/" },
              { ver: "Ver 3.0", href: "http://lud7n.neet.s3-website-us-east-1.amazonaws.com/#/" },
            ].map(({ ver, href }) => (
              <a
                key={ver}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="theme-timeline-item group flex items-center gap-4 py-3 hover:opacity-100 transition-opacity duration-300"
                style={{ opacity: 0 }}
              >
                {/* ドット */}
                <div className="theme-timeline-dot absolute left-0 w-[5px] h-[5px] rounded-full bg-white/30 -translate-x-[2px] group-hover:bg-indigo-400 transition-colors duration-300" style={{ scale: 0 } as React.CSSProperties} />
                {/* ライン */}
                <div className="h-px w-6 bg-white/30 group-hover:w-10 group-hover:bg-white/60 transition-all duration-300" />
                <span className="text-xs tracking-[0.3em] uppercase text-white/70 group-hover:text-white transition-colors duration-300">
                  {ver}
                </span>
                <span className="text-xs text-white/30 group-hover:text-white group-hover:translate-x-1 transition-all duration-300">
                  ↗
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* 見出し */}
        <h2 className="theme-heading text-5xl md:text-6xl font-black leading-tight tracking-tight" style={{ perspective: "600px", marginBottom: "1.5rem" }}>
          {"Ver 4.0 Cosmos".split("").map((c, i) => (
            <span key={i} className="theme-char inline-block" style={{ whiteSpace: c === " " ? "pre" : "normal" }}>{c}</span>
          ))}
          <br />
          {"Philosophy".split("").map((c, i) => (
            <span key={i} className="theme-char inline-block text-indigo-400">{c}</span>
          ))}
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
