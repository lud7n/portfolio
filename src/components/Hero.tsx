"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import dynamic from "next/dynamic";

const Scene3D = dynamic(() => import("@/components/Scene3D"), { ssr: false });

const titleLine1 = "Creative".split("");
const titleLine2 = "Developer".split("");

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.3 });

      tl.fromTo(
        ".hero-char",
        { y: "110%", opacity: 0 },
        {
          y: "0%",
          opacity: 1,
          duration: 0.9,
          stagger: 0.025,
          ease: "power4.out",
        }
      )
        .fromTo(
          ".hero-subtitle",
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
          "-=0.3"
        )
        .fromTo(
          ".hero-cta",
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power3.out" },
          "-=0.4"
        )
        .fromTo(
          ".hero-scroll",
          { opacity: 0 },
          { opacity: 1, duration: 0.8 },
          "-=0.2"
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      id="home"
      className="relative h-screen w-full flex items-center justify-center overflow-hidden"
    >
      {/* 3D Canvas background */}
      <div className="absolute inset-0 z-0">
        <Scene3D />
      </div>

      {/* Vignette + gradient overlay */}
      <div className="absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,_transparent_30%,_#010d1f_100%)]" />
      <div className="absolute bottom-0 left-0 right-0 h-48 z-[1] bg-gradient-to-t from-[#010d1f] to-transparent" />

      {/* Content */}
      <div className="relative z-[2] text-center px-6 max-w-6xl mx-auto">
        {/* Title line 1 */}
        <div className="overflow-hidden mb-0">
          <h1 className="text-[clamp(60px,12vw,140px)] font-black tracking-tighter leading-[0.9] text-white">
            {titleLine1.map((char, i) => (
              <span
                key={i}
                className="hero-char inline-block"
                style={{ display: "inline-block" }}
              >
                {char}
              </span>
            ))}
          </h1>
        </div>

        {/* Title line 2 - gradient */}
        <div className="overflow-hidden mb-8">
          <h1 className="text-[clamp(60px,12vw,140px)] font-black tracking-tighter leading-[0.9] bg-gradient-to-r from-cyan-300 via-sky-400 to-teal-400 bg-clip-text text-transparent">
            {titleLine2.map((char, i) => (
              <span
                key={i}
                className="hero-char inline-block"
                style={{ display: "inline-block" }}
              >
                {char}
              </span>
            ))}
          </h1>
        </div>

        {/* Subtitle */}
        <p className="hero-subtitle text-base md:text-lg text-white/50 max-w-md mx-auto mb-10 leading-relaxed tracking-wide">
          デザインとコードで体験を創る。
          <br />
          フロントエンド × WebGL × アニメーション
        </p>

        {/* CTA Buttons */}
        <div className="flex gap-4 justify-center flex-wrap">
          <a
            href="#projects"
            className="hero-cta inline-block px-8 py-3.5 bg-gradient-to-r from-cyan-500 to-teal-600 rounded-full text-white font-semibold text-sm tracking-wide hover:scale-105 hover:shadow-[0_0_40px_rgba(6,182,212,0.5)] transition-all duration-300"
          >
            Projects
          </a>
          <a
            href="#contact"
            className="hero-cta inline-block px-8 py-3.5 border border-white/20 rounded-full text-white/70 font-semibold text-sm tracking-wide hover:bg-white/10 hover:text-white hover:border-white/40 transition-all duration-300"
          >
            Contact
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="hero-scroll absolute bottom-10 left-1/2 -translate-x-1/2 z-[2] flex flex-col items-center gap-2">
        <span className="text-[10px] tracking-[0.35em] uppercase text-white/30">Scroll</span>
        <div className="w-px h-14 bg-gradient-to-b from-white/30 to-transparent" />
      </div>
    </section>
  );
}
