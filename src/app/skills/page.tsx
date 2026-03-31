"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

// ────────────────────────────────────────────
// Data
// ────────────────────────────────────────────

const whatIDo = [
  {
    num: "01",
    axis: "Design",
    desc: "学生のころからFigmaを使ったUIデザインに取り組んでいて、気づけば5年ほど経ちました。デザインコースにいたこともあり、スライドデザインやサービスデザイン、プロダクトデザイン、3Dデザインなど、いろんな領域を少しずつ経験してきました。きれいに見せることよりも、ユーザー体験や情報の流れを先に考えるのが自分のスタイルです。「なぜこのデザインにしたか」を言葉で説明できるよう心がけているので、チームでの議論や提案もわりと得意だと思っています。",
    tags: ["Figma", "Illustrator", "Blender", "UI/UX", "Service Design", "3D Design"],
  },
  {
    num: "02",
    axis: "Frontend",
    desc: "大学時代は個人開発でHTML・CSS・JavaScript・React・Tailwind CSSを1年半ほど触っていました。就職後は業務でもメインでフロントを担当しており、TypeScript・React・SCSSを書き始めてちょうど1年になります。チームのフロントエンドレビューも主に自分が担当していたので、コードの品質や一貫性を意識する習慣がついてきた気がしています。",
    tags: ["TypeScript", "React", "Next.js", "GSAP"],
  },
  {
    num: "03",
    axis: "Backend",
    desc: "フロントほど自信があるわけではないですが、業務で1年間バックエンドにも携わってきました。リポジトリ・コントローラ・スキーマの3層アーキテクチャを意識したAPI設計を担当しており、コードレビューの経験もあります。まだ学んでいる途中ですが、設計の考え方は少しずつ身についてきたかなと思っています。",
    tags: ["Node.js", "C++", "REST API"],
  },
  {
    num: "04",
    axis: "Infra / Cloud",
    desc: "AWS複数資格を持っているので、AWSのサービス設計については一定の理解があります。業務では API Gateway → Lambda → RDS を組み合わせたニアサーバレスアーキテクチャの設計や、IAM Identity Center を活用したセキュリティベストプラクティスを意識した権限管理を担当しました。GitHub Actions を使った CI/CD パイプラインの設計経験もあります。インフラはまだ深めている最中ですが、設計の意図を説明できるレベルには来ていると思います。",
    tags: ["AWS", "Docker", "CI/CD"],
  },
  {
    num: "05",
    axis: "Algorithm",
    desc: "AtCoderで緑上位まで取り組んできたので、一般的なアルゴリズムはだいたい理解しています。競プロで培った知識は業務にも活かしていて、フロントエンドでLCSアルゴリズムを設計し検索パフォーマンスを改善した経験があります。個人的にはBFS・DFSなどグラフ系のアルゴリズムが好きで、グラフ構造を眺めているのが楽しいです。数学も得意なので、計算量の見積もりや数学的な考え方を使う場面は割と好きです。",
    tags: ["C++", "AtCoder", "Data Structures"],
  },
];

// 習熟度順: Figma > TypeScript > React > AWS > SCSS > C++ > Illustrator > Docker > Blender
const techStack = [
  { name: "Figma",        category: "Design",   level: 5 },
  { name: "TypeScript",   category: "Frontend", level: 5 },
  { name: "React",        category: "Frontend", level: 4 },
  { name: "AWS",          category: "Infra",    level: 4 },
  { name: "SCSS",         category: "Frontend", level: 3 },
  { name: "C++",          category: "Backend",  level: 3 },
  { name: "Illustrator",  category: "Design",   level: 2 },
  { name: "Docker",       category: "Infra",    level: 2 },
  { name: "Blender",      category: "3D",       level: 1 },
];

const learning = [
  "Three.js",
  "Rust",
  "WebGL",
  "Motion Design",
];

// ────────────────────────────────────────────
// Sub-components
// ────────────────────────────────────────────

function LevelDots({ level }: { level: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className="block w-1 h-1 rounded-full"
          style={{
            background: i < level ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.1)",
          }}
        />
      ))}
    </div>
  );
}

function WhatIDoItem({
  item,
  open,
  dimmed,
  onOpen,
  onClose,
}: {
  item: typeof whatIDo[0];
  open: boolean;
  dimmed: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  const handleEnter = () => onOpen();
  const handleLeave = () => onClose();
  const handleClick = () => (open ? onClose() : onOpen());

  return (
    <div
      className="what-row border-b border-white/[0.08] cursor-pointer group select-none"
      style={{ opacity: dimmed ? 0.08 : 1, transition: "opacity 0.35s ease" }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onClick={handleClick}
    >
      {/* タイトル行 */}
      <div className="flex items-center justify-between" style={{ paddingTop: "2.5rem", paddingBottom: "2.5rem" }}>
        <div className="flex items-baseline gap-5 md:gap-8">
          <span className="text-xl md:text-2xl font-black text-white/[0.08] tabular-nums">
            {item.num}
          </span>
          <h3 className="text-3xl md:text-5xl font-black tracking-tight transition-colors duration-300 group-hover:text-white">
            {item.axis}
          </h3>
        </div>

        {/* 矢印 */}
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          className="text-white/25 flex-shrink-0 transition-transform duration-400 group-hover:text-white/60"
          style={{ transform: open ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.35s ease" }}
        >
          <path
            d="M4 2l8 6-8 6"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* 展開エリア（CSS grid trick） */}
      <div
        style={{
          display: "grid",
          gridTemplateRows: open ? "1fr" : "0fr",
          transition: "grid-template-rows 0.38s ease",
        }}
      >
        <div className="overflow-hidden">
          <div style={{ paddingBottom: "2.5rem", paddingLeft: "4.5rem" }}>
            <p className="text-white/40 text-sm leading-relaxed mb-4">{item.desc}</p>
            <div className="flex flex-wrap gap-2">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[9px] tracking-[0.2em] uppercase text-white/30 border border-white/10 px-2.5 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────
// Page
// ────────────────────────────────────────────

export default function Skills() {
  const heroRef   = useRef<HTMLDivElement>(null);
  const whatRef   = useRef<HTMLElement>(null);
  const stackRef  = useRef<HTMLElement>(null);
  const learnRef  = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handleOpen  = useCallback((i: number) => setActiveIndex(i), []);
  const handleClose = useCallback(() => setActiveIndex(null), []);

  useEffect(() => {
    const ctx = gsap.context(() => {

      // Hero: 左からスライド（トップページと統一）
      gsap.fromTo(".skills-tag",
        { x: -20, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.7, ease: "power3.out", delay: 0.1 }
      );
      gsap.fromTo(".skills-heading",
        { x: -280, opacity: 0 },
        {
          x: 0, opacity: 1, ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top 85%",
            end: "top 25%",
            scrub: 1.2,
          },
        }
      );
      gsap.fromTo(".skills-sub",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.4 }
      );

      // What I Do: 行をスタガーで
      gsap.fromTo(".what-row",
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.6, ease: "power3.out", stagger: 0.1,
          scrollTrigger: { trigger: whatRef.current, start: "top 80%" },
        }
      );

      // Tech Stack: 右からスライド
      gsap.fromTo(".stack-heading",
        { x: 280, opacity: 0 },
        {
          x: 0, opacity: 1, ease: "none",
          scrollTrigger: {
            trigger: stackRef.current,
            start: "top 85%",
            end: "top 25%",
            scrub: 1.2,
          },
        }
      );
      gsap.fromTo(".stack-item",
        { y: 24, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.5, ease: "power3.out", stagger: 0.06,
          scrollTrigger: { trigger: ".stack-grid", start: "top 82%" },
        }
      );

      // Currently Learning
      gsap.fromTo(".learn-item",
        { x: -20, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 0.5, ease: "power3.out", stagger: 0.08,
          scrollTrigger: { trigger: learnRef.current, start: "top 85%" },
        }
      );

    });

    return () => ctx.revert();
  }, []);

  return (
    <main className="bg-[#080808] min-h-screen text-white">

      {/* ── Hero ── */}
      <div ref={heroRef} className="max-w-5xl mx-auto px-6 md:px-16" style={{ paddingTop: "10rem", paddingBottom: "8rem" }}>
        <h1 className="skills-heading text-5xl md:text-7xl font-black leading-tight tracking-tight mb-6">
          What I
          <br />
          <span className="text-white/15">Build With</span>
        </h1>

        <p className="skills-sub text-white/40 text-base md:text-lg leading-relaxed max-w-md">
          デザインを起点に、フロントからインフラまで領域を広げてきました。全体の繋がりを意識しながら動けることが、自分の強みだと思っています。
        </p>
      </div>

      {/* ── What I Do ── */}
      <section ref={whatRef} className="max-w-5xl mx-auto px-6 md:px-16" style={{ paddingBottom: "10rem" }}>
        <div className="border-t border-white/[0.08]">
          {whatIDo.map((item, i) => (
            <WhatIDoItem
              key={item.num}
              item={item}
              open={activeIndex === i}
              dimmed={activeIndex !== null && activeIndex !== i}
              onOpen={() => handleOpen(i)}
              onClose={handleClose}
            />
          ))}
        </div>
      </section>

      {/* ── Tech Stack ── */}
      <section ref={stackRef} className="max-w-5xl mx-auto px-6 md:px-16" style={{ paddingBottom: "10rem" }}>
        <h2 className="stack-heading text-4xl md:text-6xl font-black leading-tight tracking-tight mb-16">
          Tools &amp;
          <br />
          <span className="text-white/15">Technologies</span>
        </h2>

        <div className="stack-grid divide-y divide-white/[0.06]">
          {techStack.map((item) => (
            <div
              key={item.name}
              className="stack-item flex items-center justify-between py-5 group hover:pl-2 transition-all duration-300"
            >
              <div className="flex items-center gap-6">
                <span className="text-[9px] tracking-[0.25em] uppercase text-white/20 w-16">
                  {item.category}
                </span>
                <span className="text-base md:text-lg font-semibold group-hover:text-white/90 transition-colors duration-300">
                  {item.name}
                </span>
              </div>
              <LevelDots level={item.level} />
            </div>
          ))}
        </div>
      </section>

      {/* ── Currently Learning ── */}
      <section ref={learnRef} className="max-w-5xl mx-auto px-6 md:px-16" style={{ paddingBottom: "10rem" }}>
        <div className="flex flex-wrap gap-3">
          {learning.map((item) => (
            <span
              key={item}
              className="learn-item text-sm tracking-wide text-white/40 border border-white/10 px-4 py-2 rounded-full hover:text-white/70 hover:border-white/30 transition-colors duration-200"
            >
              {item}
            </span>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <div className="max-w-5xl mx-auto px-6 md:px-16 pb-24 flex items-center justify-between border-t border-white/[0.06] pt-12">
        <p className="text-white/20 text-[10px] tracking-[0.25em] uppercase">© 2026 lud7n</p>
        <Link
          href="/"
          className="text-[10px] tracking-[0.3em] uppercase text-white/25 hover:text-white/60 transition-colors duration-200 flex items-center gap-2"
        >
          Back to Top
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M4 11L9 6 4 1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>

    </main>
  );
}
