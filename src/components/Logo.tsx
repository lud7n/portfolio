"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import Link from "next/link";

export default function Logo({ className = "" }: { className?: string }) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const lines = svg.querySelectorAll("line");

    const onEnter = () => {
      // 上の斜め線を上へ、下の斜め線を下へ広げる
      gsap.to(lines[1], { attr: { y2: 0 },  duration: 0.35, ease: "power3.out" });
      gsap.to(lines[2], { attr: { y2: 26 }, duration: 0.35, ease: "power3.out" });
      gsap.to(lines, { opacity: 1, duration: 0.2 });
    };

    const onLeave = () => {
      gsap.to(lines[1], { attr: { y2: 3 },  duration: 0.4, ease: "power3.out" });
      gsap.to(lines[2], { attr: { y2: 23 }, duration: 0.4, ease: "power3.out" });
    };

    svg.addEventListener("mouseenter", onEnter);
    svg.addEventListener("mouseleave", onLeave);
    return () => {
      svg.removeEventListener("mouseenter", onEnter);
      svg.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <Link href="/" className={`block ${className}`} aria-label="Home">
      <svg
        ref={svgRef}
        width="22"
        height="26"
        viewBox="0 0 22 26"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ cursor: "pointer" }}
      >
        {/* 縦線 */}
        <line x1="4" y1="2" x2="4" y2="24" stroke="#f8f8f6" strokeWidth="1.5" strokeLinecap="round" />
        {/* 上の斜め線（中央から右上へ） */}
        <line x1="4" y1="13" x2="18" y2="3" stroke="#f8f8f6" strokeWidth="1.5" strokeLinecap="round" />
        {/* 下の斜め線（中央から右下へ） */}
        <line x1="4" y1="13" x2="18" y2="23" stroke="#f8f8f6" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </Link>
  );
}
