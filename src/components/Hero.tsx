"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import dynamic from "next/dynamic";

const Scene3D = dynamic(() => import("@/components/Scene3D"), { ssr: false });

const titleLine1 = "Optimize my ".split("");
const titleLine2 = "objectives".split("");

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
      <div className="absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,_transparent_30%,_#001a3d_100%)]" />
      <div className="absolute bottom-0 left-0 right-0 h-48 z-[1] bg-gradient-to-t from-[#001a3d] to-transparent" />

      {/* Content */}
      <div className="relative z-[2] text-center px-6 max-w-6xl mx-auto">
        {/* Title - 1行 */}
        <div className="mb-8">
          <h1 className="text-[clamp(28px,4.5vw,64px)] font-black tracking-tighter leading-[0.9]">
            {titleLine1.map((char, i) => (
              <span key={i} className="hero-char inline-block text-white">
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
            {titleLine2.map((char, i) => (
              <span
                key={i}
                className="hero-char inline-block bg-gradient-to-r from-cyan-300 via-sky-400 to-teal-400 bg-clip-text text-transparent"
              >
                {char}
              </span>
            ))}
          </h1>
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
