"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Article } from "@/lib/notion";

gsap.registerPlugin(ScrollTrigger);

function formatDate(dateStr: string) {
  if (!dateStr) return "----/--/--";
  const d = new Date(dateStr);
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}`;
}

const STRIPE = "linear-gradient(90deg, #6366f1, #818cf8)";
const BORDER = "rgba(99,102,241,0.25)";

export default function ArticleCardGrid({ articles }: { articles: Article[] }) {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cards = gridRef.current?.querySelectorAll<HTMLElement>(".article-card");
    if (!cards?.length) return;

    cards.forEach((card, i) => {
      const isLeft = i % 2 === 0;
      const fromY = isLeft ? -75 : 75;
      const start = isLeft ? "top 92%" : "top 85%";
      const end   = isLeft ? "top 38%" : "top 30%";

      // 回転して登場
      gsap.fromTo(card,
        { rotateY: fromY, opacity: 0, transformOrigin: isLeft ? "left center" : "right center" },
        {
          rotateY: 0,
          opacity: 1,
          ease: "none",
          scrollTrigger: { trigger: card, start, end, scrub: 1 },
        }
      );

      // 視差：左カラムはゆっくり、右カラムは速く上に流れる
      gsap.to(card, {
        yPercent: isLeft ? -8 : -18,
        ease: "none",
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5,
        },
      });
    });

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  // ホバー時のシャイン効果
  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    const shine = el.querySelector<HTMLElement>(".shine-overlay");
    if (shine) {
      shine.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.10) 0%, transparent 55%)`;
    }
  };

  return (
    <div
      ref={gridRef}
      style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "5rem 2rem", perspective: "1200px" }}
    >
      {articles.map((article) => (
        <Link
          key={article.id}
          href={`/articles/${article.id}`}
          className="article-card group relative flex flex-col rounded-2xl overflow-hidden transition-shadow duration-300 hover:shadow-[0_0_30px_rgba(99,102,241,0.12)]"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: `1px solid ${BORDER}`,
            boxShadow: "0 2px 24px rgba(0,0,0,0.3)",
            transformStyle: "preserve-3d",
          }}
          onMouseMove={handleMouseMove}
        >
          {/* カラーストライプ */}
          <div className="h-[3px] w-full shrink-0" style={{ background: STRIPE }} />

          {/* コンテンツ */}
          <div className="flex flex-col flex-1" style={{ padding: "1.25rem 1.5rem" }}>
            <p className="text-[11px] tracking-[0.2em] font-mono mb-5 text-indigo-300/50">
              {formatDate(article.date)}
            </p>

            <h2 className="text-sm md:text-base font-semibold text-white/70 group-hover:text-white transition-colors duration-300 leading-snug flex-1">
              {article.title}
            </h2>

            <div className="flex items-end justify-between gap-3 mt-5">
              <div className="flex flex-wrap gap-1.5">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[9px] tracking-[0.2em] uppercase text-indigo-300/60 border border-indigo-400/20 px-2 py-0.5 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <span className="text-white/25 group-hover:text-white/70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300 text-sm shrink-0">
                ↗
              </span>
            </div>
          </div>

          {/* シャインオーバーレイ */}
          <div className="shine-overlay absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

          {/* ホバーグロー */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at top left, rgba(99,102,241,0.08) 0%, transparent 60%)" }}
          />
        </Link>
      ))}
    </div>
  );
}
