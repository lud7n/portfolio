"use client";

import { gsap } from "gsap";

const socials = [
  { label: "GitHub",    href: "https://github.com/lud7n" },
  { label: "X",         href: "https://x.com/Iud7n/" },
  { label: "Instagram", href: "https://www.instagram.com/lud7n/" },
  { label: "AtCoder",   href: "https://atcoder.jp/users/lud7n" },
];

export default function Contact() {
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
    <section id="contact" className="w-full" />
  );
}
