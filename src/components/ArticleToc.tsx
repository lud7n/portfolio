"use client";

import { useEffect, useState } from "react";
import type { Heading } from "@/lib/headings";

export default function ArticleToc({ headings }: { headings: Heading[] }) {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    if (!headings.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // 最上部に近いものをアクティブに
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-10% 0% -80% 0%", threshold: 0 }
    );

    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (!headings.length) return null;

  return (
    <aside
      className="hidden xl:block"
      style={{
        position: "fixed",
        top: "8rem",
        right: "clamp(1.5rem, 3vw, 4rem)",
        width: "180px",
        zIndex: 10,
      }}
    >
      <nav>
        <p
          className="mb-4"
          style={{
            fontSize: "9px",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.2)",
          }}
        >
          目次
        </p>

        <ul className="space-y-1">
          {headings.map(({ id, text, level }) => {
            const isActive = activeId === id;
            return (
              <li key={id}>
                <a
                  href={`#${id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  style={{
                    display: "block",
                    paddingLeft: level === 2 ? "0.75rem" : level === 3 ? "1.25rem" : "1.75rem",
                    fontSize: "11px",
                    lineHeight: "1.5",
                    color: isActive ? "rgba(129,140,248,0.9)" : "rgba(255,255,255,0.25)",
                    transition: "color 0.2s ease",
                    paddingTop: "0.2rem",
                    paddingBottom: "0.2rem",
                    borderLeft: isActive ? "1px solid rgba(99,102,241,0.5)" : "1px solid transparent",
                  }}
                >
                  {text}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
