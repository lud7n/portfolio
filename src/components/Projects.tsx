"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    num: "01",
    title: "Project Alpha",
    description:
      "WebGLとGSAPを活用したインタラクティブな3Dプロダクト体験。マウスに反応する没入型UIで、ユーザーを引き込む世界観を構築。",
    tags: ["Three.js", "GSAP", "React"],
    gradient: "from-indigo-500/10 to-purple-600/10",
    glow: "group-hover:shadow-[0_0_80px_rgba(139,92,246,0.15)]",
    accent: "border-indigo-500/20 group-hover:border-indigo-500/50",
    dot: "bg-indigo-400",
  },
  {
    num: "02",
    title: "Project Beta",
    description:
      "リアルタイムデータビジュアライゼーションダッシュボード。複雑なデータを美しいグラフとアニメーションで直感的に表現。",
    tags: ["Next.js", "TypeScript", "D3.js"],
    gradient: "from-cyan-500/10 to-blue-600/10",
    glow: "group-hover:shadow-[0_0_80px_rgba(6,182,212,0.15)]",
    accent: "border-cyan-500/20 group-hover:border-cyan-500/50",
    dot: "bg-cyan-400",
  },
  {
    num: "03",
    title: "Project Gamma",
    description:
      "没入型のフルスクリーンWebアニメーション体験。スクロール連動のストーリーテリングでブランドの世界観を演出。",
    tags: ["GSAP", "Canvas", "WebGL"],
    gradient: "from-purple-500/10 to-pink-600/10",
    glow: "group-hover:shadow-[0_0_80px_rgba(168,85,247,0.15)]",
    accent: "border-purple-500/20 group-hover:border-purple-500/50",
    dot: "bg-purple-400",
  },
  {
    num: "04",
    title: "Project Delta",
    description:
      "パフォーマンス最適化されたEコマースフロントエンド。Framer Motionによる流麗なページ遷移とCoreWebVitals対応。",
    tags: ["Next.js", "Tailwind", "Framer Motion"],
    gradient: "from-emerald-500/10 to-teal-600/10",
    glow: "group-hover:shadow-[0_0_80px_rgba(16,185,129,0.15)]",
    accent: "border-emerald-500/20 group-hover:border-emerald-500/50",
    dot: "bg-emerald-400",
  },
];

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".project-card",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".projects-grid",
            start: "top 78%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="py-36 px-6 md:px-16 max-w-7xl mx-auto"
    >
      <span className="inline-block text-[10px] tracking-[0.35em] uppercase text-cyan-400 border border-cyan-400/30 px-3 py-1.5 rounded-full mb-8">
        Projects
      </span>

      <h2 className="text-5xl md:text-6xl font-black mb-16 tracking-tight">
        Selected{" "}
        <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
          Works
        </span>
      </h2>

      <div className="projects-grid grid md:grid-cols-2 gap-5">
        {projects.map((project) => (
          <div
            key={project.num}
            className={`project-card group relative p-8 rounded-3xl border ${project.accent} bg-gradient-to-br ${project.gradient} backdrop-blur-sm hover:scale-[1.015] transition-all duration-400 ${project.glow} overflow-hidden`}
          >
            {/* Subtle noise/grain overlay */}
            <div className="absolute inset-0 rounded-3xl opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWx0ZXI9InVybCgjYSkiIG9wYWNpdHk9IjEiLz48L3N2Zz4=')]" />

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-8">
                <span className="text-6xl font-black text-white/[0.07] group-hover:text-white/[0.12] transition-colors duration-300 leading-none">
                  {project.num}
                </span>
                <div className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center group-hover:border-white/50 group-hover:rotate-45 transition-all duration-400">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M1 11L11 1M11 1H1M11 1V11"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      opacity="0.4"
                      className="group-hover:opacity-100 transition-opacity duration-200"
                    />
                  </svg>
                </div>
              </div>

              <h3 className="text-xl font-bold mb-3 text-white/90">{project.title}</h3>
              <p className="text-white/45 text-sm leading-relaxed mb-6">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] px-3 py-1 rounded-full bg-white/[0.07] text-white/50 tracking-wide"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
