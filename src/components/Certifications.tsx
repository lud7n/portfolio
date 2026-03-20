"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const categories = [
  {
    label: "IT / Engineering",
    items: [
      { name: "基本情報技術者", en: "Fundamental Information Technology Engineer" },
      { name: "情報セキュリティマネジメント", en: "Information Security Management" },
      { name: "AWS CLF", en: "AWS Certified Cloud Practitioner" },
      { name: "AWS SAA", en: "AWS Certified Solutions Architect – Associate" },
      { name: "AWS SCS", en: "AWS Certified Security – Specialty" },
    ],
  },
  {
    label: "Language / Culture",
    items: [
      { name: "TOEIC L&R 655点", en: "TOEIC Listening & Reading Test" },
      { name: "日本漢字能力検定 準1級", en: "Kanji Proficiency Test Pre-Grade 1" },
      { name: "色彩検定 2級", en: "Color Coordinator Grade 2" },
      { name: "日商簿記検定 3級", en: "Bookkeeping Certificate Grade 3" },
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
        { rotateX: 65, opacity: 0, y: 30 },
        {
          rotateX: 0, opacity: 1, y: 0,
          duration: 1.1, ease: "power3.out", delay: 0.1,
          transformOrigin: "center bottom",
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
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
      style={{ paddingTop: "52rem", paddingBottom: "32rem" }}
    >
      <div className="max-w-5xl mx-auto px-6 md:px-16">
        <span className="cert-tag inline-block text-[10px] tracking-[0.35em] uppercase text-white/40 border border-white/15 px-3 py-1.5 rounded-full mb-8">
          Certifications
        </span>

        <h2 className="cert-heading text-5xl md:text-6xl font-black leading-tight mb-20 tracking-tight" style={{ perspective: "600px" }}>
          Proven
          <br />
          <span className="text-black">Knowledge</span>
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
