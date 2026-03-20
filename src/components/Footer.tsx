"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const socials = [
  {
    label: "GitHub",
    href: "https://github.com/lud7n",
    icon: (
      <path
        fill="currentColor"
        d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
      />
    ),
  },
  {
    label: "X",
    href: "https://x.com/Iud7n/",
    icon: (
      <path
        fill="currentColor"
        d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.259 5.626zm-1.161 17.52h1.833L7.084 4.126H5.117z"
      />
    ),
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/lud7n/",
    icon: (
      <>
        <rect x="2" y="2" width="20" height="20" rx="5" strokeWidth="1.8" stroke="currentColor" fill="none" />
        <circle cx="12" cy="12" r="4.5" strokeWidth="1.8" stroke="currentColor" fill="none" />
        <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" />
      </>
    ),
  },
  {
    label: "AtCoder",
    href: "https://atcoder.jp/users/lud7n",
    icon: (
      <>
        <rect x="2"  y="15" width="5" height="7" rx="0.5" fill="currentColor" opacity="0.5" />
        <rect x="9"  y="10" width="5" height="12" rx="0.5" fill="currentColor" opacity="0.75" />
        <rect x="17" y="4"  width="5" height="18" rx="0.5" fill="currentColor" />
      </>
    ),
  },
];

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".footer-left",
        { x: -40, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: footerRef.current, start: "top 95%" },
        }
      );
      gsap.fromTo(
        ".footer-icon",
        { x: 30, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 0.6, ease: "power3.out",
          stagger: 0.08, delay: 0.15,
          scrollTrigger: { trigger: footerRef.current, start: "top 95%" },
        }
      );
    }, footerRef);

    return () => ctx.revert();
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const dx = (e.clientX - (rect.left + rect.width / 2)) * 0.45;
    const dy = (e.clientY - (rect.top + rect.height / 2)) * 0.45;
    gsap.to(el, { x: dx, y: dy, duration: 0.3, ease: "power3.out" });
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    gsap.to(e.currentTarget, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.4)" });
  };

  return (
    <footer ref={footerRef} className="border-t border-white/[0.06] py-10 px-8 md:px-16 flex flex-col md:flex-row items-center justify-between gap-6">
      <p className="footer-left text-white/20 text-[10px] tracking-[0.25em] uppercase">© 2026 lud7n</p>

      <div className="flex items-center gap-8">
        {socials.map((s) => (
          <a
            key={s.label}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            aria-label={s.label}
            className="footer-icon flex flex-col items-center gap-2 group"
          >
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              className="text-white/25 group-hover:text-white/70 transition-colors duration-200"
            >
              {s.icon}
            </svg>
            <span className="text-[8px] tracking-[0.25em] uppercase text-white/15 group-hover:text-white/40 transition-colors duration-200">
              {s.label}
            </span>
          </a>
        ))}
      </div>
    </footer>
  );
}
