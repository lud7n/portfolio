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

  // E: Magnetic effect handlers
  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) * 0.45;
    const dy = (e.clientY - cy) * 0.45;
    gsap.to(el, { x: dx, y: dy, duration: 0.3, ease: "power3.out" });
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    gsap.to(e.currentTarget, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.4)" });
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="pb-40 w-full"
      style={{ paddingTop: "22rem" }}
    >
      <div
        className="max-w-5xl mx-auto px-6 md:px-16 text-center"
        style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2rem" }}
      >
        <span className="contact-tag inline-block text-[10px] tracking-[0.35em] uppercase text-white/30 border border-white/10 px-3 py-1.5 rounded-full mb-10">
          Contact
        </span>

        <h2 className="contact-heading text-2xl md:text-3xl font-light tracking-[0.1em] text-white/50 mb-4">
          お気軽にご連絡ください
        </h2>

        <p className="contact-sub text-black/30 text-sm mb-10 max-w-xs mx-auto leading-relaxed tracking-wide">
          プロジェクトのご相談、お仕事のご依頼など
        </p>

        <div className="contact-cta">
          <div className="flex justify-center gap-12">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="inline-block text-[11px] text-white/20 hover:text-white/60 transition-colors duration-200 tracking-[0.2em] uppercase px-4 py-3"
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
