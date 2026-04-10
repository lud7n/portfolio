"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scatterChars } from "@/lib/scatterChars";

gsap.registerPlugin(ScrollTrigger);


export default function About() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (sectionRef.current) scatterChars(sectionRef.current, "about-char");

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
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="w-full"
      style={{ paddingTop: "14rem", paddingBottom: "8rem" }}
    >
      <div className="max-w-5xl mx-auto px-8 md:px-20">
        <span className="about-tag inline-block text-[10px] tracking-[0.35em] uppercase text-white/40 border border-white/15 px-3 py-1.5 rounded-full mb-8">
          About Me
        </span>

        <div className="max-w-2xl">
          <div>
            <h2 className="about-heading text-5xl md:text-6xl font-black leading-tight mb-8 tracking-tight" style={{ perspective: "600px" }}>
              {"Design meets".split("").map((c, i) => (
                <span key={i} className="about-char inline-block" style={{ whiteSpace: c === " " ? "pre" : "normal" }}>{c}</span>
              ))}
              <br />
              {"Engineering".split("").map((c, i) => (
                <span key={i} className="about-char inline-block text-indigo-400">{c}</span>
              ))}
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

        </div>
      </div>
    </section>
  );
}
