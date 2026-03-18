"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const socials = [
  { label: "GitHub", href: "#" },
  { label: "Twitter", href: "#" },
  { label: "LinkedIn", href: "#" },
];

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".contact-tag",
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
        }
      );
      gsap.fromTo(
        ".contact-heading",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          delay: 0.1,
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
        }
      );
      gsap.fromTo(
        ".contact-sub",
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          delay: 0.3,
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
        }
      );
      gsap.fromTo(
        ".contact-cta",
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          delay: 0.45,
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="pb-24 w-full"
      style={{ paddingTop: "14rem" }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-16 text-center" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2rem" }}>
        <span className="contact-tag inline-block text-[10px] tracking-[0.35em] uppercase text-white/30 border border-white/10 px-3 py-1.5 rounded-full mb-10">
          Contact
        </span>

        <h2 className="contact-heading text-2xl md:text-3xl font-light tracking-[0.1em] text-white/60 mb-4">
          お気軽にご連絡ください
        </h2>

        <p className="contact-sub text-white/30 text-sm mb-10 max-w-xs mx-auto leading-relaxed tracking-wide">
          プロジェクトのご相談、お仕事のご依頼など
        </p>

        <div className="contact-cta">
          <div className="flex justify-center gap-8">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                className="text-[11px] text-white/20 hover:text-white/50 transition-colors duration-200 tracking-[0.2em] uppercase"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
