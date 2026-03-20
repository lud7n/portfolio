"use client";

import { gsap } from "gsap";

const socials = [
  { label: "GitHub",    href: "https://github.com/lud7n" },
  { label: "X",         href: "https://x.com/Iud7n/" },
  { label: "Instagram", href: "https://www.instagram.com/lud7n/" },
  { label: "AtCoder",   href: "https://atcoder.jp/users/lud7n" },
];

export default function Footer() {
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
    <footer className="border-t border-white/[0.06] py-10 px-8 md:px-16 flex flex-col md:flex-row items-center justify-between gap-6 text-white/25 text-[10px] tracking-[0.2em] uppercase">
      <p>© 2026 工藤 翔太</p>

      <div className="flex items-center gap-8">
        {socials.map((s) => (
          <a
            key={s.label}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="inline-block hover:text-white/60 transition-colors duration-200"
          >
            {s.label}
          </a>
        ))}
      </div>
    </footer>
  );
}
