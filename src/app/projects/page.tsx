"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import ProjectsLowPoly from "@/components/ProjectsLowPoly";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ────────────────────────────────────────────
// Data
// ────────────────────────────────────────────

const projects = [
  {
    num: "01",
    title: "人材支援ERPシステム開発",
    period: "2025.07 — 2026.03",
    roles: ["サブリーダー", "UIデザイン", "フロントエンド", "バックエンド", "インフラ"],
    scale: "フロントエンド5名 / バックエンド5名",
    overview: "人材支援事業のSES案件・契約・要員・勤怠情報を一元管理するERPシステムの開発保守。既存システムの利便性・拡張性の低さをUI改修と技術統一で改善。",
    highlights: [
      "未確定だった画面構成を設計し、操作性・視認性の改善提案を実施",
      "案件管理・スキルシート・クライアント管理など主要画面の実装",
      "検索・ソート・編集・削除などリスト操作機能の開発と操作フローの統一",
      "API Gateway → Lambda → RDS のニアサーバレスアーキテクチャ設計",
      "IAM Identity Center を活用したセキュリティベストプラクティスの権限管理",
      "GitHub Actions による CI/CD パイプラインの設計・構築",
      "新規参入メンバーへのオンボーディング支援",
    ],
    tech: ["TypeScript", "React", "SCSS", "MUI", "PostgreSQL", "AWS Lambda", "Amazon RDS", "Docker", "GitHub Actions", "Figma"],
    process: ["要件定義", "基本設計", "詳細設計", "実装・単体テスト", "結合テスト", "保守・運用"],
    accent: "#3730a3",
    accentLight: "#6366f1",
  },
  {
    num: "02",
    title: "社内イベント活性化アプリ",
    period: "2025.04 — 2025.06",
    roles: ["プロジェクトリーダー", "UIデザイン", "フロントエンド"],
    scale: "フロントエンド3名 / バックエンド4名",
    overview: "社内カルチャーイベントの活性化を目的としたWebアプリケーション。イベントの告知・参加申請・感想共有・企画提案を一元管理するプラットフォームを構築。",
    highlights: [
      "プロジェクトリーダーとして進捗管理・上長報告・工数管理を担当",
      "ホーム・プロフィール・イベント詳細・作成画面のレイアウト設計と実装",
      "イベント作成フォームのバリデーション・ジャンル選択制限などの改善",
      "参加者増減・満員対応・募集終了時の表示制御を実装",
      "各操作に対するトースト通知・ローディング画面の追加",
      "アニメーション・ホバーアクションの追加と調整",
    ],
    tech: ["React", "JavaScript", "HTML/CSS", "Python", "FastAPI", "MySQL", "Docker"],
    process: ["要件定義", "基本設計", "詳細設計", "実装・単体テスト"],
    accent: "#065f46",
    accentLight: "#10b981",
  },
  {
    num: "03",
    title: "物理操作による情報転送デバイス",
    period: "2023.04 — 2024.03",
    roles: ["プロジェクトリーダー", "プロダクトデザイナー"],
    scale: "6名（PL1 / エンジニア4 / デザイナー2）",
    overview: "ペン型デバイスを用い、擦る動作によって情報のコピー＆ペーストを直感的に行えるインタラクションの実現を目的とした研究開発。視覚的フィードバックと触覚フィードバックを組み合わせ、デジタル情報操作に物理的な手応えを再現。",
    highlights: [
      "ペン内部の複雑な形状を Blender で設計し、M5Stack や配線が収まるよう反映",
      "Illustrator でモックを作成し、レーザーカッターで物理形状を制作",
      "毎週メンバーの進捗を教授へ報告、他チームとの合同発表に向け連携",
      "中間・最終発表スライドを単独で作成し、一般観客の前で発表",
    ],
    tech: ["C++", "Blender", "Figma", "Illustrator"],
    process: ["要件定義", "基本設計", "詳細設計", "実装・単体テスト"],
    accent: "#78350f",
    accentLight: "#f59e0b",
  },
  {
    num: "04",
    title: "ポートフォリオサイトの運営",
    period: "2023.04 — 現在",
    roles: ["UIデザイン", "フロントエンド", "個人開発"],
    scale: "個人開発",
    overview: "個人の経歴や制作物を一覧できるポートフォリオサイトを継続的に開発・運営。現在は Ver.4.0 を制作中。デプロイ先もGitHub Pages → Xserver → AWS S3 と進化させてきた。",
    highlights: [
      "Figmaを用いてUIレイアウトを設計、フロントエンドに実装",
      "GSAP・Lenis を活用したスクロールアニメーション・パーティクルインタラクションの実装",
      "GitHub Actions による CI/CD パイプラインと GitHub Pages への自動デプロイ",
      "Ver.1.0: GitHub Pages / Ver.2.0: Xserver（独自ドメイン）/ Ver.3.0: AWS S3",
    ],
    tech: ["Next.js", "TypeScript", "React", "GSAP", "Tailwind CSS", "Figma", "Git", "GitHub Actions"],
    process: ["要件定義", "基本設計", "詳細設計", "実装・単体テスト", "保守・運用"],
    accent: "#4c1d95",
    accentLight: "#8b5cf6",
  },
];

// ────────────────────────────────────────────
// CursorCard
// ────────────────────────────────────────────

function CursorCard({
  project,
  visible,
  cardRef,
}: {
  project: typeof projects[0] | null;
  visible: boolean;
  cardRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div
      ref={cardRef}
      aria-hidden
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: 260,
        pointerEvents: "none",
        zIndex: 50,
        opacity: visible ? 1 : 0,
        transition: "opacity 0.2s ease",
      }}
    >
      {project && (
        <div style={{
          background: `linear-gradient(135deg, ${project.accent}cc 0%, #06080f 100%)`,
          border: `1px solid ${project.accentLight}30`,
          borderRadius: 4,
          padding: "1.25rem",
        }}>
          <div style={{ fontSize: 40, fontWeight: 900, lineHeight: 1, color: `${project.accentLight}18`, marginBottom: "0.6rem", letterSpacing: "-0.02em" }}>
            {project.num}
          </div>
          <p style={{ fontSize: 9, letterSpacing: "0.25em", color: `${project.accentLight}80`, textTransform: "uppercase", marginBottom: "0.6rem" }}>
            {project.period}
          </p>
          <p style={{ fontSize: 11, lineHeight: 1.7, color: "rgba(255,255,255,0.45)", marginBottom: "0.8rem" }}>
            {project.overview}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {project.tech.slice(0, 4).map((t) => (
              <span key={t} style={{
                fontSize: 8, letterSpacing: "0.15em", textTransform: "uppercase",
                color: `${project.accentLight}90`,
                border: `1px solid ${project.accentLight}30`,
                padding: "2px 7px", borderRadius: 99,
              }}>{t}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ────────────────────────────────────────────
// ProjectRow
// ────────────────────────────────────────────

function ProjectRow({
  project,
  isOpen,
  isHovered,
  isDimmed,
  onToggle,
  onMouseEnter,
  onMouseLeave,
}: {
  project: typeof projects[0];
  isOpen: boolean;
  isHovered: boolean;
  isDimmed: boolean;
  onToggle: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  return (
    <div
      className="project-row border-b border-white/[0.08] cursor-pointer select-none"
      style={{ opacity: isDimmed ? 0.1 : 1, transition: "opacity 0.3s ease" }}
      onClick={onToggle}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* ヘッダー行 */}
      <div className="flex items-center justify-between gap-6"
        style={{ paddingTop: "2.5rem", paddingBottom: isOpen ? "1.5rem" : "2.5rem" }}>
        <div className="flex items-center gap-6 md:gap-10 flex-1 min-w-0">
          <span className="text-xl font-black tabular-nums shrink-0 transition-colors duration-300"
            style={{ color: isHovered || isOpen ? project.accentLight : "rgba(255,255,255,0.08)" }}>
            {project.num}
          </span>
          <h2 className="font-black tracking-tight leading-tight transition-colors duration-300"
            style={{
              fontSize: "clamp(1.4rem, 3vw, 2.2rem)",
              color: isOpen ? "rgba(255,255,255,1)" : isHovered ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.7)",
            }}>
            {project.title}
          </h2>
        </div>

        <div className="hidden md:flex items-center gap-4 shrink-0">
          <span className="text-[10px] tracking-[0.25em] uppercase text-white/20">
            {project.period}
          </span>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
            className="text-white/20"
            style={{ transform: isOpen ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.35s ease", flexShrink: 0 }}>
            <path d="M3 2l8 5-8 5" stroke="currentColor" strokeWidth="1.3"
              strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* 展開エリア */}
      <div style={{
        display: "grid",
        gridTemplateRows: isOpen ? "1fr" : "0fr",
        transition: "grid-template-rows 0.42s ease",
      }}>
        <div className="overflow-hidden">
          <div
            className="grid md:grid-cols-2 gap-10 md:gap-16"
            style={{ paddingBottom: "2.5rem", paddingLeft: "clamp(2.5rem, 5vw, 4.5rem)" }}
          >
            {/* 左: 概要 + ハイライト */}
            <div>
              <p className="text-white/40 text-sm leading-relaxed mb-5">{project.overview}</p>
              <ul className="space-y-2">
                {project.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-white/30 leading-relaxed">
                    <span style={{ color: `${project.accentLight}60` }} className="mt-1 shrink-0">—</span>
                    {h}
                  </li>
                ))}
              </ul>
            </div>

            {/* 右: Tech + Process + Scale */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
              {/* Tech Stack */}
              <div>
                <p style={{ fontSize: "9px", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)", marginBottom: "0.75rem" }}>Tech Stack</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {project.tech.map((t) => (
                    <span key={t} style={{
                      fontSize: "9px", letterSpacing: "0.15em", textTransform: "uppercase",
                      color: `${project.accentLight}cc`,
                      border: `1px solid ${project.accentLight}35`,
                      padding: "3px 10px", borderRadius: "999px",
                    }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Process */}
              <div>
                <p style={{ fontSize: "9px", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)", marginBottom: "0.75rem" }}>Process</p>
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.35rem" }}>
                  {project.process.map((p, i) => (
                    <span key={p} style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                      <span style={{
                        fontSize: "9px", letterSpacing: "0.12em",
                        color: "rgba(255,255,255,0.45)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        padding: "3px 10px", borderRadius: "999px",
                        whiteSpace: "nowrap",
                      }}>
                        {p}
                      </span>
                      {i < project.process.length - 1 && (
                        <span style={{ fontSize: "8px", color: "rgba(255,255,255,0.15)" }}>→</span>
                      )}
                    </span>
                  ))}
                </div>
              </div>

              {/* Scale */}
              <div>
                <p style={{ fontSize: "9px", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)", marginBottom: "0.5rem" }}>Scale</p>
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}>{project.scale}</p>
              </div>
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

export default function Projects() {
  const heroRef  = useRef<HTMLDivElement>(null);
  const listRef  = useRef<HTMLElement>(null);
  const cardRef  = useRef<HTMLDivElement>(null);

  const [openIndex,    setOpenIndex]    = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleToggle = useCallback((i: number) => {
    setOpenIndex(prev => prev === i ? null : i);
  }, []);

  // カーソル追従
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    let mx = 0, my = 0, cx = 0, cy = 0;
    const onMove = (e: MouseEvent) => { mx = e.clientX + 24; my = e.clientY - 40; };
    window.addEventListener("mousemove", onMove);
    const ticker = gsap.ticker.add(() => {
      cx += (mx - cx) * 0.1;
      cy += (my - cy) * 0.1;
      gsap.set(card, { x: cx, y: cy });
    });
    return () => { window.removeEventListener("mousemove", onMove); gsap.ticker.remove(ticker); };
  }, []);

  // スクロールアニメーション
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".proj-heading",
        { x: -280, opacity: 0 },
        { x: 0, opacity: 1, ease: "none", scrollTrigger: { trigger: heroRef.current, start: "top 85%", end: "top 25%", scrub: 1.2 } }
      );
      gsap.fromTo(".proj-sub",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.3 }
      );
      gsap.fromTo(".project-row",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out", stagger: 0.12, scrollTrigger: { trigger: listRef.current, start: "top 85%" } }
      );
    });
    return () => ctx.revert();
  }, []);

  // カーソルカード: 開いているor別行ホバー中は非表示
  const showCard = hoveredIndex !== null && openIndex !== hoveredIndex;

  return (
    <main className="min-h-screen text-white relative" style={{ background: "#06080f" }}>
      {/* ベース背景 */}
      <div aria-hidden style={{ position: "fixed", inset: 0, zIndex: 0, background: "#06080f" }} />
      {/* ローポリ地形 */}
      <ProjectsLowPoly hoveredIndex={hoveredIndex} />
      {/* ノイズオーバーレイ */}
      <div aria-hidden style={{
        position: "fixed", inset: 0, zIndex: 2, pointerEvents: "none", opacity: 0.03,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundSize: "180px 180px",
      }} />

      <CursorCard
        project={hoveredIndex !== null ? projects[hoveredIndex] : null}
        visible={showCard}
        cardRef={cardRef}
      />

      <div className="relative z-10">
        <div ref={heroRef} className="max-w-5xl mx-auto"
          style={{ paddingTop: "10rem", paddingBottom: "6rem", paddingLeft: "clamp(2rem, 5vw, 5rem)", paddingRight: "clamp(2rem, 5vw, 5rem)" }}>
          <h1 className="proj-heading text-5xl md:text-7xl font-black leading-tight tracking-tight mb-6">
            Projects
            <br />
            <span className="text-white/15">& Work</span>
          </h1>
        </div>

        <section ref={listRef} className="max-w-5xl mx-auto"
          style={{ paddingBottom: "12rem", paddingLeft: "clamp(2rem, 5vw, 5rem)", paddingRight: "clamp(2rem, 5vw, 5rem)" }}>
          <div className="border-t border-white/[0.08]">
            {projects.map((project, i) => (
              <ProjectRow
                key={project.num}
                project={project}
                isOpen={openIndex === i}
                isHovered={hoveredIndex === i}
                isDimmed={openIndex !== null && openIndex !== i}
                onToggle={() => handleToggle(i)}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
