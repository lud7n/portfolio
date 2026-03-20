"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const categories = [
  {
    label: "IT / Engineering",
    items: [
      { name: "Fundamental IT Engineer", en: "基本情報技術者" },
      { name: "Information Security Management", en: "情報セキュリティマネジメント" },
      { name: "AWS Certified Cloud Practitioner", en: "CLF" },
      { name: "AWS Certified Solutions Architect", en: "SAA" },
      { name: "AWS Certified Security Specialty", en: "SCS" },
    ],
  },
  {
    label: "Language / Culture",
    items: [
      { name: "TOEIC L&R 655", en: "Listening & Reading" },
      { name: "Kanji Proficiency Pre-Grade 1", en: "日本漢字能力検定" },
      { name: "Color Coordinator Grade 2", en: "色彩検定" },
      { name: "Bookkeeping Certificate Grade 3", en: "日商簿記" },
    ],
  },
];

export default function Certifications() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".cert-tag",
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
        }
      );
      gsap.fromTo(
        ".cert-heading",
        { x: 280, opacity: 0 },
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
        ".cert-category",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.15,
          delay: 0.25,
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
        }
      );
      gsap.fromTo(
        ".cert-item",
        { x: -16, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.45,
          stagger: 0.06,
          delay: 0.35,
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="certifications"
      className="w-full"
      style={{ paddingTop: "14rem", paddingBottom: "8rem" }}
    >
      <div className="max-w-5xl mx-auto px-6 md:px-16">
        <span className="cert-tag inline-block text-[10px] tracking-[0.35em] uppercase text-white/40 border border-white/15 px-3 py-1.5 rounded-full mb-8">
          Proven Knowledge
        </span>

        <h2 className="cert-heading text-5xl md:text-6xl font-black leading-tight mb-20 tracking-tight" style={{ perspective: "600px" }}>
          Certifi
          <br />
          <span className="text-black">cations.</span>
        </h2>

        <div className="grid md:grid-cols-2 gap-16">
          {categories.map((cat) => (
            <div key={cat.label} className="cert-category">
              <p className="text-[10px] tracking-[0.3em] uppercase text-white/25 mb-6">
                {cat.label}
              </p>
              <div className="space-y-0">
                {cat.items.map((item) => (
                  <div
                    key={item.name}
                    className="cert-item group border-b border-white/[0.06] py-4 flex items-baseline justify-between gap-4 hover:border-white/20 transition-colors duration-300"
                  >
                    <span className="text-white/80 text-sm font-medium tracking-wide">
                      {item.name}
                    </span>
                    <span className="text-white/20 text-[10px] tracking-[0.15em] uppercase text-right shrink-0 group-hover:text-white/35 transition-colors duration-300">
                      {item.en}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
