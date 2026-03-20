"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ScrambleText from "@/components/ScrambleText";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { target: 4, suffix: "年+", label: "Design Experience" },
  { target: 10, suffix: "+", label: "Certifications" },
  { target: null, display: "緑上位", label: "AtCoder Rate" },
  { target: null, display: "∞", label: "Curiosity" },
];

function CountUpNumber({
  target,
  suffix,
}: {
  target: number;
  suffix: string;
}) {
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const span = spanRef.current;
    if (!span) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 1.6,
          ease: "power2.out",
          onUpdate: () => {
            span.textContent = Math.round(obj.val) + suffix;
          },
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(span);
    return () => observer.disconnect();
  }, [target, suffix]);

  return (
    <span ref={spanRef}>
      0{suffix}
    </span>
  );
}

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".about-tag",
        { x: -20, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.6,
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
        }
      );
      gsap.fromTo(
        ".about-heading",
        { clipPath: "inset(0 100% 0 0)", x: -40, opacity: 0 },
        {
          clipPath: "inset(0 0% 0 0)",
          x: 0,
          opacity: 1,
          duration: 1.0,
          ease: "power3.out",
          delay: 0.15,
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
        }
      );
      gsap.fromTo(
        ".about-body",
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          delay: 0.3,
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
        }
      );
      gsap.fromTo(
        ".stat-card",
        { y: 30, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.5,
          stagger: 0.1,
          scrollTrigger: { trigger: ".stats-grid", start: "top 82%" },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="pt-96 pb-56 w-full"
    >
      <div className="max-w-5xl mx-auto px-6 md:px-16">
        <span className="about-tag inline-block text-[10px] tracking-[0.35em] uppercase text-white/40 border border-white/15 px-3 py-1.5 rounded-full mb-8">
          About Me
        </span>

        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="about-heading text-5xl md:text-6xl font-black leading-tight mb-8 tracking-tight">
              <ScrambleText text="Design meets" delay={200} />
              <br />
              <span className="text-black">
                <ScrambleText text="Engineering" delay={500} />
              </span>
            </h2>
            <div className="about-body space-y-4">
              <p className="text-white/50 text-base md:text-lg leading-relaxed">
                新卒入社後はERPシステム開発に参画し、UI設計とフロントエンド実装を担当。
                現在は新規機能開発ユニットで、ユーザー体験を最優先としたUI設計に取り組んでいます。
              </p>
              <p className="text-white/50 text-base md:text-lg leading-relaxed">
                大学4年間でFigma・Illustratorを使った制作活動を積み重ね、
                UI/UXデザインの設計力を培いました。
                ビジュアル先行ではなく、情報設計から考えるアプローチが強みです。
              </p>
              <p className="text-white/50 text-base md:text-lg leading-relaxed">
                大学2年からAtCoderに継続的に取り組み、Highestレートで緑色上位に到達。
                設計力だけでなく、実装の問題解決力も備えています。
              </p>
            </div>
          </div>

          <div className="stats-grid space-y-6">
            {stats.map((s) => (
              <div key={s.label} className="stat-card group">
                <div className="h-px bg-white/10 mb-5 group-hover:bg-white/25 transition-colors duration-500" />
                <div className="flex items-baseline justify-between">
                  <div className="text-4xl font-black bg-gradient-to-r from-black to-black bg-clip-text text-transparent">
                    {s.target !== null ? (
                      <CountUpNumber target={s.target} suffix={s.suffix!} />
                    ) : (
                      s.display
                    )}
                  </div>
                  <div className="text-[10px] text-white/30 tracking-[0.25em] uppercase">
                    {s.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
