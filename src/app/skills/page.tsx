"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import SkillsAurora from "@/components/SkillsAurora";
import {
  SiFigma,
  SiTypescript,
  SiReact,
  SiSass,
  SiCplusplus,
  SiDocker,
  SiBlender,
} from "react-icons/si";
import { FaAws } from "react-icons/fa";
import type { IconType } from "react-icons";

// Illustratorはシンプルアイコン未収録のためカスタムSVG
const AiIcon: IconType = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="currentColor" width={props.size ?? 16} height={props.size ?? 16}>
    <text x="2" y="17" fontSize="13" fontWeight="800" fontFamily="sans-serif">Ai</text>
  </svg>
);

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
  { name: "Figma",        category: "Design",   level: 5, icon: SiFigma },
  { name: "TypeScript",   category: "Frontend", level: 5, icon: SiTypescript },
  { name: "React",        category: "Frontend", level: 4, icon: SiReact },
  { name: "AWS",          category: "Infra",    level: 4, icon: FaAws },
  { name: "SCSS",         category: "Frontend", level: 3, icon: SiSass },
  { name: "C++",          category: "Backend",  level: 3, icon: SiCplusplus },
  { name: "Illustrator",  category: "Design",   level: 2, icon: AiIcon },
  { name: "Docker",       category: "Infra",    level: 2, icon: SiDocker },
  { name: "Blender",      category: "3D",       level: 1, icon: SiBlender },
];

const learning: string[] = [];

// ────────────────────────────────────────────
// Sub-components
// ────────────────────────────────────────────

// ────────────────────────────────────────────
// Radar chart data
// ────────────────────────────────────────────

const RADAR_AXES = [
  { label: "Frontend",  value: 5 },
  { label: "Design",    value: 5 },
  { label: "Infra",     value: 4 },
  { label: "Algorithm", value: 4 },
  { label: "Backend",   value: 3 },
  { label: "3D",        value: 1 },
];

const RADAR_MAX = 5;
const RADAR_SIZE = 320;
const RADAR_CX = RADAR_SIZE / 2;
const RADAR_CY = RADAR_SIZE / 2;
const RADAR_R = 110;

function polarToXY(angleRad: number, r: number) {
  return {
    x: RADAR_CX + r * Math.cos(angleRad - Math.PI / 2),
    y: RADAR_CY + r * Math.sin(angleRad - Math.PI / 2),
  };
}

function RadarChart({
  hoveredCategory,
  onCategoryHover,
}: {
  hoveredCategory: string | null;
  onCategoryHover: (cat: string | null) => void;
}) {
  const polygonRef = useRef<SVGPolygonElement>(null);
  const n = RADAR_AXES.length;

  const axes = RADAR_AXES.map((axis, i) => {
    const angle = (2 * Math.PI * i) / n;
    const tip = polarToXY(angle, RADAR_R);
    const labelPos = polarToXY(angle, RADAR_R + 28);
    return { ...axis, angle, tip, labelPos };
  });

  const dataPoints = axes.map(({ value, angle }) =>
    polarToXY(angle, (value / RADAR_MAX) * RADAR_R)
  );
  const polygonPoints = dataPoints.map(p => `${p.x},${p.y}`).join(" ");

  const rings = [1, 2, 3, 4, 5].map(level => {
    const pts = Array.from({ length: n }, (_, i) => {
      const angle = (2 * Math.PI * i) / n;
      return polarToXY(angle, (level / RADAR_MAX) * RADAR_R);
    });
    return pts.map(p => `${p.x},${p.y}`).join(" ");
  });

  useEffect(() => {
    const el = polygonRef.current;
    if (!el) return;
    gsap.fromTo(el,
      { scale: 0, transformOrigin: `${RADAR_CX}px ${RADAR_CY}px`, opacity: 0 },
      {
        scale: 1, opacity: 1, duration: 1.2, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 85%" },
      }
    );
  }, []);

  const isAnyHovered = hoveredCategory !== null;

  return (
    <svg
      viewBox={`0 0 ${RADAR_SIZE} ${RADAR_SIZE}`}
      width={RADAR_SIZE}
      height={RADAR_SIZE}
      className="overflow-visible"
    >
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {/* F: ポリゴン用グラデーション */}
        <linearGradient id="radarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#6366f1" stopOpacity="0.5" />
          <stop offset="50%"  stopColor="#8b5cf6" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.3" />
        </linearGradient>
        <linearGradient id="radarStroke" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#818cf8" />
          <stop offset="100%" stopColor="#22d3ee" />
        </linearGradient>
      </defs>

      {/* grid rings */}
      {rings.map((pts, i) => (
        <polygon key={i} points={pts} fill="none"
          stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
      ))}

      {/* axis lines */}
      {axes.map((axis, i) => {
        const active = hoveredCategory === axis.label;
        return (
          <line key={i}
            x1={RADAR_CX} y1={RADAR_CY}
            x2={axis.tip.x} y2={axis.tip.y}
            stroke={active ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.08)"}
            strokeWidth={active ? "1.5" : "1"}
            style={{ transition: "stroke 0.25s, stroke-width 0.25s" }}
          />
        );
      })}

      {/* data polygon */}
      <polygon
        ref={polygonRef}
        points={polygonPoints}
        fill="url(#radarGrad)"
        stroke="url(#radarStroke)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      {/* data dots + hover targets */}
      {dataPoints.map((p, i) => {
        const axis = axes[i];
        const active = hoveredCategory === axis.label;
        const dimmed = isAnyHovered && !active;
        return (
          <g key={i}
            onMouseEnter={() => onCategoryHover(axis.label)}
            onMouseLeave={() => onCategoryHover(null)}
            style={{ cursor: "pointer" }}
          >
            {/* glow ring */}
            {active && (
              <circle cx={p.x} cy={p.y} r="10"
                fill="rgba(129,140,248,0.15)"
                filter="url(#glow)"
              />
            )}
            {/* dot */}
            <circle cx={p.x} cy={p.y}
              r={active ? 5 : 3}
              fill={dimmed ? "rgba(255,255,255,0.15)" : active ? "#a5b4fc" : "#c7d2fe"}
              style={{ transition: "r 0.2s, fill 0.2s" }}
            />
            {/* hover hit area */}
            <circle cx={p.x} cy={p.y} r="16" fill="transparent" />
          </g>
        );
      })}

      {/* labels */}
      {axes.map((axis, i) => {
        const active = hoveredCategory === axis.label;
        const dimmed = isAnyHovered && !active;
        return (
          <text key={i}
            x={axis.labelPos.x} y={axis.labelPos.y}
            textAnchor="middle" dominantBaseline="middle"
            fontSize="10" letterSpacing="0.15em"
            fill={active ? "rgba(255,255,255,0.9)" : dimmed ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.35)"}
            style={{ textTransform: "uppercase", fontFamily: "inherit", transition: "fill 0.25s", cursor: "pointer" }}
            onMouseEnter={() => onCategoryHover(axis.label)}
            onMouseLeave={() => onCategoryHover(null)}
          >
            {axis.label}
          </text>
        );
      })}
    </svg>
  );
}

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
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

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
    <main className="min-h-screen text-white relative" style={{ background: "transparent" }}>
      {/* ベース背景色 */}
      <div aria-hidden style={{ position: "fixed", inset: 0, zIndex: 0, background: "#050810" }} />
      {/* オーロラシェーダー */}
      <SkillsAurora />
      {/* ノイズテクスチャオーバーレイ */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 2,
          pointerEvents: "none",
          opacity: 0.035,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: "180px 180px",
        }}
      />
      <div className="relative z-10">

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

        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* レーダーチャート */}
          <div className="flex justify-center">
            <RadarChart
              hoveredCategory={hoveredCategory}
              onCategoryHover={setHoveredCategory}
            />
          </div>

          {/* リスト */}
          <div className="stack-grid divide-y divide-white/[0.06]">
            {techStack.map((item) => {
              const active = hoveredCategory === item.category;
              const dimmed = hoveredCategory !== null && !active;
              return (
                <div
                  key={item.name}
                  className="stack-item flex items-center justify-between py-4 cursor-default"
                  style={{ opacity: dimmed ? 0.15 : 1, transition: "opacity 0.25s" }}
                  onMouseEnter={() => setHoveredCategory(item.category)}
                  onMouseLeave={() => setHoveredCategory(null)}
                >
                  <div className="flex items-center gap-5">
                    <span className="text-[9px] tracking-[0.25em] uppercase text-white/20 w-14">
                      {item.category}
                    </span>
                    <div className="flex items-center gap-3">
                      <item.icon
                        size={16}
                        style={{ color: active ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.25)", transition: "color 0.2s" }}
                      />
                      <span
                        className="text-sm md:text-base font-semibold transition-colors duration-200"
                        style={{ color: active ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.6)" }}
                      >
                        {item.name}
                      </span>
                    </div>
                  </div>
                  <LevelDots level={item.level} />
                </div>
              );
            })}
          </div>
        </div>
      </section>



      </div>
    </main>
  );
}
