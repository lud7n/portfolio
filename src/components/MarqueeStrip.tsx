"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";

const ITEMS = [
  "Frontend Engineer",
  "UI Designer",
  "GSAP",
  "Next.js",
  "TypeScript",
  "AtCoder",
  "AWS",
  "Figma",
  "React",
  "Three.js",
];

export default function MarqueeStrip({ reverse = false }: { reverse?: boolean }) {
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const inner = innerRef.current;
    if (!inner) return;
    const halfWidth = inner.scrollWidth / 2;
    const from = reverse ? -halfWidth : 0;
    const to = reverse ? 0 : -halfWidth;
    gsap.fromTo(inner, { x: from }, { x: to, repeat: -1, duration: 28, ease: "none" });
  }, [reverse]);

  const items = [...ITEMS, ...ITEMS];

  return (
    <div className="w-full overflow-hidden py-5 border-y border-white/[0.05]">
      <div ref={innerRef} className="flex whitespace-nowrap w-max">
        {items.map((item, i) => (
          <span
            key={i}
            className="text-[9px] tracking-[0.45em] uppercase text-white/[0.1] px-10"
          >
            {item}
            <span className="ml-10 text-white/[0.06]">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}
