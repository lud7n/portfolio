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
      className="py-36 px-6 md:px-16 max-w-7xl mx-auto text-center"
    >
      <span className="contact-tag inline-block text-[10px] tracking-[0.35em] uppercase text-pink-400 border border-pink-400/30 px-3 py-1.5 rounded-full mb-8">
        Contact
      </span>

      <h2 className="contact-heading text-[clamp(48px,9vw,110px)] font-black leading-[0.9] tracking-tight mb-10">
        Let&apos;s{" "}
        <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
          work
        </span>
        <br />
        together.
      </h2>

      <p className="contact-sub text-white/45 text-base md:text-lg mb-12 max-w-sm mx-auto leading-relaxed">
        プロジェクトのご相談、お仕事のご依頼はお気軽にどうぞ。
      </p>

      <div className="contact-cta">
        <a
          href="mailto:hello@example.com"
          className="inline-block px-12 py-5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full text-white font-bold text-base tracking-wide hover:scale-105 hover:shadow-[0_0_80px_rgba(168,85,247,0.4)] transition-all duration-300"
        >
          Get in touch →
        </a>

        <div className="flex justify-center gap-8 mt-14">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              className="text-xs text-white/25 hover:text-white/70 transition-colors duration-200 tracking-[0.2em] uppercase"
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
