"use client";

import { useEffect, useRef } from "react";

export default function ArticleBackground() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const total = document.body.scrollHeight - window.innerHeight;
      const progress = total > 0 ? window.scrollY / total : 0;
      if (barRef.current) {
        barRef.current.style.height = `${progress * 100}%`;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        width: "2px",
        height: "100vh",
        zIndex: 50,
        background: "rgba(255,255,255,0.04)",
      }}
    >
      <div
        ref={barRef}
        style={{
          width: "100%",
          height: "0%",
          background: "linear-gradient(to bottom, #6366f1, #a78bfa)",
          transition: "height 0.05s linear",
        }}
      />
    </div>
  );
}
