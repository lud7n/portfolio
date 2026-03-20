"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const TRAIL = ["K", "S", "·", "·", "·"];

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const trailRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    const glow = glowRef.current;
    if (!dot || !ring || !glow) return;

    const onMouseMove = (e: MouseEvent) => {
      gsap.to(dot, { x: e.clientX, y: e.clientY, duration: 0.08, ease: "power2.out" });
      gsap.to(ring, { x: e.clientX, y: e.clientY, duration: 0.35, ease: "power2.out" });
      gsap.to(glow, { x: e.clientX, y: e.clientY, duration: 1.0, ease: "power2.out" });

      trailRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.to(el, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.28 + i * 0.12,
          ease: "power2.out",
        });
      });
    };

    const onMouseEnterInteractive = () => {
      gsap.to(ring, { scale: 2.2, opacity: 0.6, borderColor: "rgba(248,248,246,0.5)", duration: 0.3 });
      gsap.to(dot, { scale: 0, duration: 0.2 });
    };

    const onMouseLeaveInteractive = () => {
      gsap.to(ring, { scale: 1, opacity: 1, borderColor: "rgba(255,255,255,0.5)", duration: 0.3 });
      gsap.to(dot, { scale: 1, duration: 0.2 });
    };

    window.addEventListener("mousemove", onMouseMove);

    const interactives = document.querySelectorAll("a, button, [data-cursor]");
    interactives.forEach((el) => {
      el.addEventListener("mouseenter", onMouseEnterInteractive);
      el.addEventListener("mouseleave", onMouseLeaveInteractive);
    });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <>
      {/* G: Cursor glow */}
      <div
        ref={glowRef}
        className="fixed top-0 left-0 pointer-events-none z-[9990] rounded-full"
        style={{
          width: "420px",
          height: "420px",
          transform: "translate(-50%, -50%)",
          background:
            "radial-gradient(circle, rgba(248,248,246,0.055) 0%, transparent 65%)",
        }}
      />

      {/* B: Trail characters */}
      {TRAIL.map((char, i) => (
        <div
          key={i}
          ref={(el) => {
            trailRefs.current[i] = el;
          }}
          className="fixed top-0 left-0 pointer-events-none select-none font-black"
          style={{
            zIndex: 9997 - i,
            transform: "translate(-50%, -50%)",
            opacity: Math.max(0.03, 0.2 - i * 0.04),
            fontSize: i < 2 ? "10px" : "7px",
            color: "#f8f8f6",
            letterSpacing: "0.05em",
          }}
        >
          {char}
        </div>
      ))}

      {/* Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 bg-white rounded-full pointer-events-none z-[9999]"
        style={{ transform: "translate(-50%, -50%)" }}
      />

      {/* Ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-9 h-9 border border-white/50 rounded-full pointer-events-none z-[9998]"
        style={{ transform: "translate(-50%, -50%)" }}
      />
    </>
  );
}
