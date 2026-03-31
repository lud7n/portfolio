"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRouter } from "next/navigation";

gsap.registerPlugin(ScrollTrigger);

function runCircleReveal(originEl: HTMLElement, bg: string, onDone: () => void) {
  const rect = originEl.getBoundingClientRect();
  const ox = rect.left + rect.width / 2;
  const oy = rect.top + rect.height / 2;
  const size = rect.width;

  const div = document.createElement("div");
  div.style.cssText = `
    position: fixed;
    z-index: 9999;
    border-radius: 50%;
    background: ${bg};
    pointer-events: none;
    width: ${size}px;
    height: ${size}px;
    left: ${ox - size / 2}px;
    top: ${oy - size / 2}px;
    transform: scale(1);
    transform-origin: center center;
  `;
  document.body.appendChild(div);

  const maxDist = Math.sqrt(window.innerWidth ** 2 + window.innerHeight ** 2);
  gsap.to(div, {
    scale: (maxDist * 2) / size,
    duration: 0.7,
    ease: "power3.inOut",
    onComplete: () => {
      document.body.removeChild(div);
      onDone();
    },
  });
}

function CTAButton({
  label,
  href,
  revealBg,
}: {
  label: string;
  href: string;
  revealBg: string;
}) {
  const router = useRouter();
  const btnRef = useRef<HTMLAnchorElement>(null);

  const handleMouseEnter = () => {
    const el = btnRef.current;
    if (!el) return;
    gsap.to(el.querySelector(".cta-arrow"), { y: 6, duration: 0.4, ease: "power2.out" });
    gsap.to(el.querySelector(".cta-ring"), { scale: 1.12, duration: 0.4, ease: "power2.out" });
  };

  const handleMouseLeave = () => {
    const el = btnRef.current;
    if (!el) return;
    gsap.to(el.querySelector(".cta-arrow"), { y: 0, duration: 0.6, ease: "elastic.out(1, 0.4)" });
    gsap.to(el.querySelector(".cta-ring"), { scale: 1, duration: 0.6, ease: "elastic.out(1, 0.4)" });
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const ring = btnRef.current?.querySelector(".cta-ring") as HTMLElement;
    runCircleReveal(ring ?? (btnRef.current as HTMLElement), revealBg, () => router.push(href));
  };

  return (
    <a
      ref={btnRef}
      href={href}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="flex flex-col items-center gap-3 group cursor-pointer"
    >
      <div className="cta-ring w-12 h-12 rounded-full border border-white/20 flex items-center justify-center
                      bg-white/[0.03] backdrop-blur-sm group-hover:border-white/40 transition-colors duration-300">
        <svg className="cta-arrow text-white/50 group-hover:text-white/90 transition-colors duration-300"
          width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M7 1v12M1 7l6 6 6-6" stroke="currentColor"
            strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <span className="text-[9px] tracking-[0.3em] uppercase text-white/25
                       group-hover:text-white/60 transition-colors duration-300">
        {label}
      </span>
    </a>
  );
}

export default function ScrollCTA() {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    gsap.set(el, { opacity: 0, y: 24 });

    ScrollTrigger.create({
      trigger: "#theme",
      start: "bottom 80%",
      onEnter: () => {
        gsap.to(el, { opacity: 1, y: 0, duration: 1.0, ease: "power3.out" });
      },
      onLeaveBack: () => {
        gsap.to(el, { opacity: 0, y: 24, duration: 0.4, ease: "power2.in" });
      },
    });

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="fixed bottom-10 left-1/2 -translate-x-1/2 z-40 flex items-end gap-8"
    >
      <CTAButton label="Skills"    href="/skills"   revealBg="#050810" />
      <CTAButton label="Projects"  href="/projects" revealBg="#06080f" />
    </div>
  );
}
